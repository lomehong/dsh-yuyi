/**
  * 讲协议 v2 的最小进程内 Yuyi Hub，供 `dsh-yuyi` 服务
  * 测试使用。记录每个客户端帧，并按
  * 可编排旋钮，套件因此无需真实中继
  * 真实中继。
 */

import { createServer, type Server } from 'node:http'
import { WebSocketServer, type RawData, type WebSocket } from 'ws'

/* * 把一条 ws 消息载荷解码为 UTF-8 文本，无论其到达容器。 */
function rawText(raw: RawData): string {
  if (Buffer.isBuffer(raw)) return raw.toString('utf8')
  if (Array.isArray(raw)) return Buffer.concat(raw).toString('utf8')
  return new TextDecoder().decode(raw)
}
import type {
  ClientFrame, DeliverFrame, HubFeature, HelloFrame,
  PeerDevice, RosterSession, TaskDataFrame, TraceFrame, YuyiMessage,
} from '../src/core.ts'

/* * fixture `deliver` 以之落定的投递 ack。 */
export interface DeliverAck {
  ok: boolean
  detail?: string
  handlerSessionID?: string
}

/* * 一个已连接的客户端套接字及其握手。 */
interface ClientConnection {
  socket: WebSocket
  hello: HelloFrame | undefined
}

/**
  * 可编排的假 Hub。构造、`await start()`、把服务的 `hub`
  * 配置指向 `url`，读记录帧或驱动 `deliver`。
 */
export class FixtureHub {
  /* * hello 后通告的 welcome 特性。 */
  features: readonly HubFeature[] = ['inbox', 'task', 'trace', 'hb_stats']
  /* * 回显给客户端的 welcome 身份字段。 */
  welcomeIdentity = {
    agentId: '00000000-0000-0000-0000-0000000000f1',
    agentName: 'fixture-agent',
    ownerUsername: 'fixture-owner',
    ownerUserId: 'u-fixture',
    role: 'worker',
  } as const
  /* * `send` 帧是否 ack 成功，以及带哪种投递模式标注。 */
  sendAckOk = true
  sendAckDetail: string | undefined = undefined
  sendDeliveredAs: 'notify' | 'mail_fallback' | undefined = 'notify'
  sendHandlerSessionID: string | undefined = undefined
  /* * `inbox/ack` 帧是否 ack 成功。 */
  inboxAckOk = true
  /* * 接受连接但永不回应 hello，把客户端钉在连接中窗口。 */
  silent = false
  /* * 用不带身份字段的 welcome 回应 hello。 */
  bareWelcome = false
  /* * `inbox/fetch` 所服务的条目与剩余计数。 */
  inboxEntries: Array<{ message: YuyiMessage; receivedAt: number }> = []
  inboxRemaining = 0
  /* * `inbox/ack` 消费的消息 id；hub 会删除它们。 */
  readonly ackedInboxIds = new Set<string>()
  /* * `peers` 请求所服务的设备列表。 */
  peersDevices: PeerDevice[] = []
  /* * `task/fetch` 所服务的任务索引；缺省则回空 task/data 帧。 */
  taskIndexTask: TaskDataFrame['task'] = undefined

  /* * 跨连接收到的每个 hello 帧。 */
  readonly helloFrames: HelloFrame[] = []
  /* * 按序收到的每个 roster 帧。 */
  readonly rosterFrames: RosterSession[][] = []
  /* * 收到的每个 trace 帧。 */
  readonly traceFrames: TraceFrame[] = []
  /* * `send` 帧携带的每条消息。 */
  readonly sentMessages: YuyiMessage[] = []
  /* * 收到的每个 ack 帧（我们的 `deliver` 应答）。 */
  readonly deliverAcks: DeliverAck[] = []

  private readonly server: Server = createServer()
  private readonly wss: WebSocketServer
  private readonly connections = new Set<ClientConnection>()
  private nextDeliverId = 0
  url = ''

  constructor() {
    this.wss = new WebSocketServer({ server: this.server })
    this.wss.on('connection', (socket) => {
      const conn: ClientConnection = { socket, hello: undefined }
      this.connections.add(conn)
      socket.on('message', (raw: RawData) => { this.handleFrame(conn, JSON.parse(rawText(raw)) as ClientFrame) })
      socket.on('close', () => { this.connections.delete(conn) })
    })
  }

  /** 在临时回环端口上绑定监听器。
    * @returns 绑定的 hub，供链式调用。
   */
  async start(): Promise<this> {
    await new Promise<void>((resolve) => { this.server.listen(0, '127.0.0.1', () => { resolve() }) })
    const address = this.server.address()
    if (address === null || typeof address === 'string') throw new Error('fixture hub: expected a port address')
    this.url = `ws://127.0.0.1:${String(address.port)}`
    return this
  }

  /* * 终止所有客户端并关闭监听器。 */
  async stop(): Promise<void> {
    for (const conn of this.connections) conn.socket.terminate()
    this.connections.clear()
    await new Promise<void>((resolve) => { this.wss.close(() => { resolve() }) })
    this.server.close()
    this.server.closeAllConnections?.()
  }

  /* * 是否至少一个客户端完成了 hello 交换。 */
  hasClient(): boolean {
    for (const conn of this.connections) {
      if (conn.hello !== undefined) return true
    }
    return false
  }

  /**
    * 把一条消息投递给（唯一的）已连接客户端并等待其 ack。
    * @param message - 按 hub 背书形态的消息。
    * @returns 客户端发回的 ack。
   */
  deliver(message: YuyiMessage): Promise<DeliverAck> {
    const conn = [...this.connections][0]
    if (conn === undefined) throw new Error('fixture hub: deliver with no client connected')
    const frame: DeliverFrame = { type: 'deliver', id: `dlv${String(this.nextDeliverId += 1)}`, message }
    return new Promise<DeliverAck>((resolve) => {
      const onMessage = (raw: RawData): void => {
        const reply = JSON.parse(rawText(raw)) as ClientFrame
        if (reply.type !== 'ack' || reply.id !== frame.id) return
        conn.socket.off('message', onMessage)
        const ack: DeliverAck = {
          ok: reply.ok,
          ...(reply.detail !== undefined ? { detail: reply.detail } : {}),
          ...(reply.handlerSessionID !== undefined ? { handlerSessionID: reply.handlerSessionID } : {}),
        }
        this.deliverAcks.push(ack)
        resolve(ack)
      }
      conn.socket.on('message', onMessage)
      conn.socket.send(JSON.stringify(frame))
    })
  }

  private handleFrame(conn: ClientConnection, frame: ClientFrame): void {
    switch (frame.type) {
      case 'hello': {
        conn.hello = frame
        this.helloFrames.push(frame)
        if (this.silent) return
        if (this.bareWelcome) {
          this.reply(conn, { type: 'welcome', protocolVersion: 2, features: [...this.features] })
          return
        }
        this.reply(conn, {
          type: 'welcome',
          protocolVersion: 2,
          features: [...this.features],
          agentId: this.welcomeIdentity.agentId,
          agentName: this.welcomeIdentity.agentName,
          ownerUsername: this.welcomeIdentity.ownerUsername,
          ownerUserId: this.welcomeIdentity.ownerUserId,
          role: this.welcomeIdentity.role,
        })
        return
      }
      case 'roster':
        this.rosterFrames.push(frame.sessions)
        return
      case 'trace':
        this.traceFrames.push(frame)
        return
      case 'send':
        this.sentMessages.push(frame.message)
        this.reply(conn, {
          type: 'ack',
          id: frame.id,
          ok: this.sendAckOk,
          ...(this.sendAckDetail !== undefined ? { detail: this.sendAckDetail } : {}),
          ...(this.sendAckOk ? { deliveredAs: this.sendDeliveredAs } : {}),
          ...(this.sendHandlerSessionID !== undefined ? { handlerSessionID: this.sendHandlerSessionID } : {}),
        })
        return
      case 'peers':
        this.reply(conn, { type: 'peers', id: frame.id, devices: this.peersDevices })
        return
      case 'inbox/fetch':
        this.reply(conn, {
          type: 'inbox/data',
          id: frame.id,
          entries: frame.limit === 0 ? [] : this.inboxEntries.filter(entry => !this.ackedInboxIds.has(entry.message.id)),
          remaining: this.inboxRemaining,
        })
        return
      case 'inbox/ack':
        if (this.inboxAckOk) {
          for (const id of frame.ids) this.ackedInboxIds.add(id)
        }
        this.reply(conn, { type: 'ack', id: frame.id, ok: this.inboxAckOk })
        return
      case 'heartbeat/stats':
        return
      case 'ack':
        return
      case 'task/fetch':
        this.reply(conn, { type: 'task/data', id: frame.id, ...(this.taskIndexTask !== undefined ? { task: this.taskIndexTask } : {}) })
        return
    }
  }

  private reply(conn: ClientConnection, frame: unknown): void {
    conn.socket.send(JSON.stringify(frame))
  }
}
