/**
 * Minimal in-process Yuyi Hub speaking protocol v2, for `dsh-yuyi` service
 * tests. Records every client frame and answers each request frame from
 * scriptable knobs, so suites assert both directions of the protocol without
 * a real relay.
 */

import { createServer, type Server } from 'node:http'
import { WebSocketServer, type RawData, type WebSocket } from 'ws'

/** Decode one ws message payload as UTF-8 text, whatever container it arrived in. */
function rawText(raw: RawData): string {
  if (Buffer.isBuffer(raw)) return raw.toString('utf8')
  if (Array.isArray(raw)) return Buffer.concat(raw).toString('utf8')
  return new TextDecoder().decode(raw)
}
import type {
  ClientFrame, DeliverFrame, HubFeature, HelloFrame,
  PeerDevice, RosterSession, TaskDataFrame, TraceFrame, YuyiMessage,
} from '../src/core.ts'

/** The delivery ack a fixture `deliver` resolved with. */
export interface DeliverAck {
  ok: boolean
  detail?: string
  handlerSessionID?: string
}

/** One connected client socket plus its handshake. */
interface ClientConnection {
  socket: WebSocket
  hello: HelloFrame | undefined
}

/**
 * Scriptable fake Hub. Construct, `await start()`, point the service's `hub`
 * config at `url`, and read the recorded frames or drive `deliver`.
 */
export class FixtureHub {
  /** Welcome features advertised after hello. */
  features: readonly HubFeature[] = ['inbox', 'task', 'trace', 'hb_stats']
  /** Welcome identity fields echoed back to the client. */
  welcomeIdentity = {
    agentId: '00000000-0000-0000-0000-0000000000f1',
    agentName: 'fixture-agent',
    ownerUsername: 'fixture-owner',
    ownerUserId: 'u-fixture',
    role: 'worker',
  } as const
  /** Whether `send` frames ack ok, and with which delivery mode annotation. */
  sendAckOk = true
  sendAckDetail: string | undefined = undefined
  sendDeliveredAs: 'notify' | 'mail_fallback' | undefined = 'notify'
  sendHandlerSessionID: string | undefined = undefined
  /** Whether `inbox/ack` frames ack ok. */
  inboxAckOk = true
  /** Accept the connection but never answer hello, pinning the client in the connecting window. */
  silent = false
  /** Answer hello with a welcome carrying no identity fields. */
  bareWelcome = false
  /** Entries and remaining count served to `inbox/fetch`. */
  inboxEntries: Array<{ message: YuyiMessage; receivedAt: number }> = []
  inboxRemaining = 0
  /** Message ids consumed by `inbox/ack`; the hub deletes them. */
  readonly ackedInboxIds = new Set<string>()
  /** Devices served to `peers` requests. */
  peersDevices: PeerDevice[] = []
  /** Task index served to `task/fetch`; absent serves an empty task/data frame. */
  taskIndexTask: TaskDataFrame['task'] = undefined

  /** Every hello frame received, across connections. */
  readonly helloFrames: HelloFrame[] = []
  /** Every roster frame received, in order. */
  readonly rosterFrames: RosterSession[][] = []
  /** Every trace frame received. */
  readonly traceFrames: TraceFrame[] = []
  /** Every message carried by a `send` frame. */
  readonly sentMessages: YuyiMessage[] = []
  /** Every ack frame received (our `deliver` replies). */
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

  /** Bind the listener on an ephemeral loopback port.
   * @returns the bound hub, for chaining.
   */
  async start(): Promise<this> {
    await new Promise<void>((resolve) => { this.server.listen(0, '127.0.0.1', () => { resolve() }) })
    const address = this.server.address()
    if (address === null || typeof address === 'string') throw new Error('fixture hub: expected a port address')
    this.url = `ws://127.0.0.1:${String(address.port)}`
    return this
  }

  /** Terminate every client and close the listener. */
  async stop(): Promise<void> {
    for (const conn of this.connections) conn.socket.terminate()
    this.connections.clear()
    await new Promise<void>((resolve) => { this.wss.close(() => { resolve() }) })
    this.server.close()
    this.server.closeAllConnections?.()
  }

  /** Whether at least one client completed the hello exchange. */
  hasClient(): boolean {
    for (const conn of this.connections) {
      if (conn.hello !== undefined) return true
    }
    return false
  }

  /**
   * Deliver one message to the (single) connected client and await its ack.
   * @param message - the message as the hub would endorse it.
   * @returns the ack the client sent back.
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
