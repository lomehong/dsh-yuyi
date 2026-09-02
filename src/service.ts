/**
  * yuyi 通信能力接缝的服务定义（`ctx.yuyi`）：
  * 拥有进程唯一的 Hub WebSocket 连接、本地会话
  * roster、进活跃 dsh agent 的唤醒投递路由与等回复
  * 关联。连接字段经 `yuyi`
  * 用户设置命名空间（覆盖组合条目）；提交的变更
  * 即时重连。未配置的部署保持休眠——每个
  * 方法以 `YUYI_NOT_CONFIGURED` 失败，而非静默降级。
 *
  * 投递路由遵循 `dsh-tool-jobs` 的唤醒模式：命中 roster 中
  * 空闲 agent 的 notify 提交 follow-up 回合（唤醒它）；
  * 运行中的 agent 在下一个步边界收到 steer。agent 循环
  * 在认领消息时拥有持久 `user/message` 事件，因此本
  * 接缝绝不自行追加会话日志事件。
 * @module dsh-yuyi
 */

import { hostname } from 'node:os'
import type { Context } from '@deepseek-ai/cordis'
import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import z from '@deepseek-ai/schemastery'
import { credentialRef } from '@deepseek-ai/dsh-credentials'
// 纯类型导入：载入 @deepseek-ai/dsh-settings 对 Context 的 `.settings` 增补。
import type {} from '@deepseek-ai/dsh-settings'
import { launchEnvironmentOf } from '@deepseek-ai/dsh-launch-environment'
import type { Agent } from '@deepseek-ai/dsh-agent'
import { createUserMessage } from '@deepseek-ai/dsh-llm'
import type { SessionId } from '@deepseek-ai/dsh-session/types'
import {
  HubClient,
  formatHubTaskIndex,
  matchSession,
  newID,
  parseAddress,
  yuyiEnvFile,
  yuyiEnvToken,
  append as inboxAppend,
  count as inboxCount,
  take as inboxTake,
  type InboxEntry,
  type PeerDevice,
  type RosterSession,
  type YuyiMessage,
} from './core.ts'
import { collectAssistantText, deliverySummary, formatIncoming, replyAddressOf } from './delivery.ts'
import { YuyiError } from './types.ts'
import type {
  YuyiConfig, YuyiDeliveryRoute, YuyiReplyResult, YuyiRosterEntry,
  YuyiSendRequest, YuyiSendResult, YuyiStatus,
} from './types.ts'


export { YuyiError }
export type {
  YuyiConfig, YuyiDeliveryRoute, YuyiErrorCode, YuyiReplyResult, YuyiRosterEntry,
  YuyiSendRequest, YuyiSendResult, YuyiStatus,
} from './types.ts'
export { formatIncoming, deliverySummary } from './delivery.ts'
export type { InboxEntry, PeerDevice, YuyiMessage } from './core.ts'


declare module '@deepseek-ai/cordis' {
  interface Context {
    /* * yuyi 通信服务（由本包的插件提供）。 */
    yuyi: YuyiRuntime
  }
}

/* * 发送并等回复方法失败前的默认等待时长。 */
const DEFAULT_REPLY_TIMEOUT_MS = 300_000

/* * 本接缝注册的设置命名空间；用户编辑即时落地为重连。
  * alpha.2 起移除 settingsNamespace() 品牌函数（仅 types 层的模板字面量校验）：
  * 裸字面量在 installSection 入参位置由 `SettingsNamespaceInput<Namespace>` 约束，
  * 这里 cast 为 SettingsNamespace 以匹配 server 侧用工具（如测试与断言）的一致语义。
  * 参考上游 dsh-agent-default-model 的用法。 */
const SETTINGS_NAMESPACE = 'yuyi'

/* * 未命中任何 roster 会话的消息的收件箱键（设备级停靠）。 */
const DEVICE_INBOX_KEY = 'device'
/* * 自动回执/自动回报的 contextHint 前缀：接收侧见到该前缀不再挂自动机制（防环）。 */
const AUTO_HINT_PREFIX = 'yuyi:auto'
/* * 处理结果观察的最长等待：回合被中止或卡死时超时静默放弃（等待方按自身超时收敛）。 */
const AUTO_RESULT_TIMEOUT_MS = 10 * 60_000
/* * 自动回报正文的长度上限。 */
const AUTO_RESULT_TEXT_CAP = 4000

/* * 一个已注册的等回复等待者。 */
interface PendingReply {
  resolve: (message: YuyiMessage) => void
  reject: (err: Error) => void
  timer: ReturnType<typeof setTimeout>
}

/**
  * yuyi 通信服务，注册为 `ctx.yuyi`（每进程一个
  * 实例；挂载在宿主平面）。hub 与
  * token 解析前服务休眠；{@link YuyiRuntime.status} 报告解析结果，每个
  * 触达 hub 的方法都以带稳定错误码的 {@link YuyiError} 失败。
 */
export default class YuyiRuntime extends TypertRemoteService {
  /* * 插件配置 schema；默认值放在 schema 字段上。 */
  static Config: z<YuyiConfig> = z.object({
    hub: z.string(),
    tokenEnv: z.string().default('YUYI_TOKEN'),
    device: z.string(),
    replyTimeoutMs: z.number().default(DEFAULT_REPLY_TIMEOUT_MS),
  })

  /* * 所需服务：投递路由据此解析的 agent 注册表。 */
  static inject = ['agents']

  private settingsSource: () => YuyiConfig
  private readonly roster = new Map<string, YuyiRosterEntry>()
  private readonly aliasToSession = new Map<string, string>()
  private readonly pendingReplies = new Map<string, PendingReply>()
  private client: HubClient | undefined
  private hubUrl = ''
  private tokenFound = false
  private hubUnread: number | undefined
  private lastStatusJson: string | undefined
  /* * 连接拆除时置位；其后排队的重连不得再拉起客户端。 */
  private disposed = false
  /* * 串行化连接周期，使设置变更与挂起中的 start 竞态时不泄漏客户端。 */
  private connectionTail: Promise<void> = Promise.resolve()
  /* * 休眠态（未配置/令牌未解析）的低频重试定时器；stop 时清除。 */
  private retryTimer: ReturnType<typeof setTimeout> | undefined
  /* * 每个会话至多一个进行中的结果观察器；同回合多次唤醒只回报一次。 */
  private readonly pendingResultWatches = new Set<string>()
  private resolvedDevice: string

  /**
    * @param ctx - 携带 agent 注册表的插件上下文。
    * @param config - 已校验的插件配置；兼任构造器所注册的
    * 用户设置节之下的 `base` 层，由本构造器注册。
   */
  constructor(ctx: Context, config: YuyiConfig) {
    super(ctx, 'yuyi')
    this.settingsSource = () => config
    this.resolvedDevice = this.resolveDevice()
    // 用户设置文档拥有组合条目之上的可编辑层：
    // 条目之上：每次提交的变更——以及设置服务的挂载或
    // 卸载——都会以新解析的值重启 hub 连接。
    // alpha.2 起模块级 installSettingsSection() 移除：经 inject(['settings'])
    // 取提供方，调用 SettingsProvider.installSection()（hooks 形状不变，
    // 参考上游 dsh-agent-default-model 的用法）。
    ctx.inject(['settings'], (sctx) => {
      sctx.settings.installSection(ctx, SETTINGS_NAMESPACE, YuyiRuntime.Config, config, {
        setSource: (source) => { this.settingsSource = source },
        onChange: () => { void this.reconnect() },
      })
    })
    // 令牌是本适配器（dsh）的专属凭证：设置页经凭证域写入/清除后，
    // 凭此事件即时重连，不等下一次设置变更。alpha.x 起该事件更名
    // credentials/reference-updated（ref 参数为 CredentialRef，此处转字符串比较）。
    ctx.on('credentials/reference-updated', (ref) => {
      if (String(ref) === this.settingsSource().tokenEnv) void this.reconnect()
    })
    ctx.effect(() => () => {
      this.disposed = true
      this.stop()
    }, 'dsh-yuyi: connection')
    void this.reconnect()
  }

  /**
    * 重算后的连接快照。
    * @returns 当前状态。
   */
  @Remote('status')
  status(): YuyiStatus {
    const client = this.client
    return {
      configured: this.hubUrl.length > 0 && this.tokenFound,
      connected: client?.connected === true,
      hub: this.hubUrl,
      device: this.resolvedDevice,
      ...(client?.agentId !== undefined ? { agentId: client.agentId } : {}),
      ...(client?.agentName !== undefined ? { agentName: client.agentName } : {}),
      ...(client?.ownerUsername !== undefined ? { ownerUsername: client.ownerUsername } : {}),
      ...(client?.role !== undefined ? { role: client.role } : {}),
      ...(client?.lastError !== undefined ? { lastError: client.lastError } : {}),
      /* v8 ignore next -- hubUnread becomes defined only through the 30s
         heartbeat callback ignored above; no unit fork can advance it. */
      ...(this.hubUnread !== undefined ? { hubUnread: this.hubUnread } : {}),
      deviceUnread: inboxCount(DEVICE_INBOX_KEY),
      sessions: [...this.roster.values()],
    }
  }

  /**
    * 把一个会话注册进本地 roster 并推送到 hub。别的
    * 若别的会话已持有该别名，抛
    * 持有别名。清理函数注销会话。
    * @param sessionId - 要注册的会话。
    * @param info - 展示给 peer、并用于别名寻址的 roster 事实。
    * @returns 注销会话的清理函数。
   */
  register(sessionId: SessionId, info: { readonly title: string; readonly directory: string; readonly name?: string }): () => void {
    const aliasKey = info.name?.toLowerCase()
    if (aliasKey !== undefined) {
      const holder = this.aliasToSession.get(aliasKey)
      if (holder !== undefined && holder !== sessionId) {
        throw new YuyiError(
          `yuyi: alias "${info.name}" is already registered by session "${holder}"`,
          'YUYI_DUPLICATE_ALIAS',
        )
      }
    }
    const dispose = this.ctx.effect(() => {
      this.roster.set(sessionId, { sessionId, ...info })
      if (aliasKey !== undefined) this.aliasToSession.set(aliasKey, sessionId)
      this.pushRoster()
      this.emitStatus()
      return () => {
        this.roster.delete(sessionId)
        if (aliasKey !== undefined && this.aliasToSession.get(aliasKey) === sessionId) {
          this.aliasToSession.delete(aliasKey)
        }
        this.pushRoster()
        this.emitStatus()
      }
    }, 'dsh-yuyi: roster registration')
    // ctx.effect 的清理函数在卸载时落定；roster API 是
    // 同步即发即弃清理函数，因此丢弃已落定的 promise。
    return () => { void dispose() }
  }

  /**
    * 会话注册时使用的别名（如有）。
    * @param sessionId - 要查的会话。
    * @returns 别名；未注册或匿名会话为 undefined。
   */
  aliasOf(sessionId: SessionId): string | undefined {
    return this.roster.get(sessionId)?.name
  }

  /**
    * 经 hub 发送一条消息并等待其投递 ack。
    * @param request - 消息请求；`from` 字段由 roster 填充。
    * @returns ack 的投递结果。
    * @throws {YuyiError} `YUYI_NOT_CONFIGURED`、`YUYI_NOT_CONNECTED` 或 `YUYI_SEND_REJECTED`。
   */
  async send(request: YuyiSendRequest): Promise<YuyiSendResult> {
    const message = this.buildMessage(request)
    const ack = await this.dispatch(message)
    const result: YuyiSendResult = {
      message,
      messageId: message.id,
      ...(ack.deliveredAs !== undefined ? { deliveredAs: ack.deliveredAs } : {}),
      ...(ack.handlerSessionID !== undefined ? { handlerSessionID: ack.handlerSessionID } : {}),
    }
    return result
  }

  /**
    * 发送一条 `expectReply` 消息并等待匹配的回信投递。
    * 等待在以下最先发生者处结束：回信到达、`replyTimeoutMs` 到期
    * （`YUYI_REPLY_TIMEOUT`），或 `signal` 中止（`YUYI_REPLY_ABORTED`）。
    * @param request - 消息请求；强制开启 `expectReply`。
    * @param signal - 等待的可选中止信号。
    * @returns 已发送消息与关联回信。
    * @throws {YuyiError} `send` 的各失败、`YUYI_REPLY_TIMEOUT` 或 `YUYI_REPLY_ABORTED`。
   */
  async sendExpectingReply(request: YuyiSendRequest, signal?: AbortSignal): Promise<YuyiReplyResult> {
    const message = this.buildMessage({ ...request, expectReply: true })
    const timeoutMs = this.settingsSource().replyTimeoutMs
    // 等待者先于发送注册：快的 hub 可能在
    // ack 之后立即送达，只在 `dispatch`
    // 后才注册的等待者会彻底错过那次投递。
    const reply = await new Promise<YuyiMessage>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pendingReplies.delete(message.id)
        reject(new YuyiError(
          `yuyi: no reply to message "${message.id}" within ${String(timeoutMs)}ms`,
          'YUYI_REPLY_TIMEOUT',
        ))
      }, timeoutMs)
      const waiter: PendingReply = {
        resolve: (value) => {
          clearTimeout(timer)
          signal?.removeEventListener('abort', onAbort)
          resolve(value)
        },
        reject: (err) => {
          clearTimeout(timer)
          signal?.removeEventListener('abort', onAbort)
          reject(err)
        },
        timer,
      }
      const onAbort = (): void => {
        this.pendingReplies.delete(message.id)
        waiter.reject(new YuyiError('yuyi: reply wait aborted', 'YUYI_REPLY_ABORTED'))
      }
      signal?.addEventListener('abort', onAbort, { once: true })
      this.pendingReplies.set(message.id, waiter)
      this.dispatch(message).catch((error: unknown) => {
        this.pendingReplies.delete(message.id)
        /* v8 ignore next -- the non-Error fallback arm: dispatch rejects only
           with YuyiError at this typed same-process boundary. */
        waiter.reject(error instanceof Error ? error : new Error(String(error)))
      })
    })
    return { sent: message, reply }
  }

  /**
    * 读一个本地收件箱：某会话的停靠消息或设备收件箱。
    * @param target - 要读收件箱的会话，或 `'device'`。
    * @param peek - true 保留收件箱消息；false 清除。
    * @returns 收件箱条目，按最旧在前。
   */
  @Remote('inbox')
  inboxRead(target: SessionId | 'device', peek?: boolean): InboxEntry[] {
    return inboxTake(target, peek === true)
  }

  /**
    * 列出当前经 hub 可达的设备与会话。
    * @returns 每个已连接设备一条，含其 roster 会话。
    * @throws {YuyiError} `YUYI_NOT_CONFIGURED` 或 `YUYI_NOT_CONNECTED`。
   */
  @Remote('peers')
  async peers(): Promise<PeerDevice[]> {
    const devices = await this.requireConnected().peers()
    // Hub 的 findTargets 会把内部命中标记（agentNameHit）原地写进会话对象，
    // 并随 peers 响应泄漏给端侧；这里把会话投影回协议声明的字段，避免
    // 污染工具的严格输出 schema（additionalProperties: false）。
    return devices.map(device => ({
      ...device,
      sessions: device.sessions.map((session): RosterSession => ({
        sessionID: session.sessionID,
        title: session.title,
        directory: session.directory,
        ...(session.name !== undefined ? { name: session.name } : {}),
        ...(session.capabilities !== undefined ? { capabilities: session.capabilities } : {}),
      })),
    }))
  }

  /**
    * 拉取本连接 agent 的 hub 侧收件箱（至少一次；
    * 条目保留至 {@link YuyiRuntime.hubInboxAck} 清除）。
    * @returns 全部挂起的 hub 收件箱条目。
    * @throws {YuyiError} `YUYI_NOT_CONFIGURED` 或 `YUYI_NOT_CONNECTED`。
   */
  async hubInboxDrain(): Promise<InboxEntry[]> {
    const frame = await this.requireConnected().inboxDrain()
    return frame.map(entry => ({ message: entry.message, receivedAt: entry.receivedAt }))
  }

  /**
    * 拉取一个任务的 hub 侧参与索引（参与者、轮数、
    * 轮数、时间窗）格式化供展示。需要 hub `task` 特性。
    * @param taskId - 要查的任务。
    * @returns 格式化索引；hub 无记录时为 undefined。
    * @throws {YuyiError} `YUYI_NOT_CONFIGURED` 或 `YUYI_NOT_CONNECTED`。
   */
  async taskIndex(taskId: string): Promise<string | undefined> {
    const task = await this.requireConnected().taskFetch(taskId)
    return task !== undefined ? formatHubTaskIndex(task) : undefined
  }

  /**
    * 确认已消费 hub 收件箱消息；hub 会删除它们。
    * @param ids - 已消费的消息 id。
    * @throws {YuyiError} `YUYI_NOT_CONFIGURED`、`YUYI_NOT_CONNECTED`，或 hub 拒收时的 `YUYI_SEND_REJECTED`。
   */
  async hubInboxAck(ids: string[]): Promise<void> {
    const ack = await this.requireConnected().inboxAck(ids)
    if (!ack.ok) {
      throw new YuyiError(`yuyi: hub rejected inbox ack: ${ack.detail ?? 'no detail'}`, 'YUYI_SEND_REJECTED')
    }
  }

  private launchValue(name: string): string | undefined {
    const hit = launchEnvironmentOf(this.ctx).get(name)
    return hit !== undefined && hit.value.length > 0 ? hit.value : undefined
  }

  private async resolveToken(): Promise<string | undefined> {
    const tokenEnv = this.settingsSource().tokenEnv
    const credentials = this.ctx.get('credentials')
    if (credentials !== undefined) {
      const hit = await credentials.resolve(credentialRef(tokenEnv))
      if (hit !== undefined) return hit.value
    }
    // 凭证库未录入（或服务未挂载）。回退到 dsh 专属的设备级路径：
    // ~/.yuyi/dsh-token 文件（Yuyi 安装器 dsh 分支必然写过的 per-agent 文件，
    // 与 ~/.yuyi/omp-token 同约定）。**绝不读**进程 env：opencode 装过的机器上
    // 进程 YUYI_TOKEN 会被其分支的 b7bf367 后用户级 env 占据，读了就是
    // 借用其他 Agent 身份（hub 侧身份错配、吊销联动失效）。
    return yuyiEnvToken()
  }

  /* * 当前设置源下的设备身份；无命名时为主机名。 */
  private resolveDevice(): string {
    return this.settingsSource().device
      ?? this.launchValue('YUYI_DEVICE')
      ?? yuyiEnvFile().YUYI_DEVICE
      ?? hostname()
  }

  /**
    * 按当前解析出的设置停止并重启 hub 连接，
    * 串行化在任何在途周期之后：设置变更落在
    * 仍等待令牌的 start 时，必须叫停该 start 的结果而非与之竞态。
    * 旧连接上未决的等回复等待者以
    * `YUYI_REPLY_ABORTED`。
    * @returns 替换连接尝试完成后的落定。
   */
  private reconnect(): Promise<void> {
    /* v8 ignore next -- the catch arm keeps one failed cycle from poisoning
       the queue; no current start() path rejects, matching the settings write
       queue's chain-past-failure discipline. */
    const run = this.connectionTail.catch(() => undefined).then(async () => {
      if (this.disposed) return
      this.stop()
      await this.start()
    })
    this.connectionTail = run
    return run
  }

  private async start(): Promise<void> {
    this.resolvedDevice = this.resolveDevice()
    const hub = this.settingsSource().hub ?? this.launchValue('YUYI_HUB') ?? yuyiEnvFile().YUYI_HUB ?? ''
    const token = await this.resolveToken().catch((error: unknown) => {
      this.ctx.logger.warn('yuyi: token resolution failed', error)
      return undefined
    })
    // 令牌解析可能跨越拆除；已销毁的运行时让
    // 连接保持断开，而非拉起无人停止的客户端。
    if (this.disposed) return
    this.hubUrl = hub
    this.tokenFound = token !== undefined && token.length > 0
    this.emitStatus()
    if (hub.length === 0 || token === undefined || token.length === 0) {
      // 休眠不是终态：配置可能随时补齐（凭证服务在 boot 竞态中晚到、
      // 用户随后录入令牌、env 文件修复）。30s 的本地重解析在网络静默期
      // 零成本；首轮曾因此永久休眠（boot 时凭证服务未就绪即再未重试）。
      this.retryTimer = setTimeout(() => { void this.reconnect() }, 30_000)
      return
    }
    this.client = new HubClient({
      url: hub,
      device: this.resolvedDevice,
      instanceID: newID('dsh'),
      token,
      agentKind: 'dsh',
      capabilities: { wake: true },
      onDeliver: this.handleDeliver,
      /* v8 ignore next 3 -- hub unread arrives only from the 30s heartbeat
         probe; a real socket cannot advance that clock inside a unit fork. */
      onUnreadMail: (count) => {
        this.hubUnread = count
        this.emitStatus()
      },
      // HubClient 恰在状态转移时打日志；每次之后重算并发出，
      // 使监听器无需轮询即可观察落定字段。
      log: (message) => {
        this.ctx.logger.info(`yuyi: ${message}`)
        this.emitStatus()
      },
    })
    // 新客户端先种入当前 roster 再启动：welcome 后 HubClient 会推一次自己的
    // 名单——服务级重连（新实例，空名单）与休眠期注册（client 当时不存在）
    // 两条路径都靠这一步保证 hub 侧名单不丢。内部自动重连复用同一实例，
    // 其 roster 天然保留。
    this.client.updateRoster(this.currentRosterSessions())
    this.client.start()
  }

  private stop(): void {
    if (this.retryTimer !== undefined) {
      clearTimeout(this.retryTimer)
      this.retryTimer = undefined
    }
    this.client?.stop()
    this.client = undefined
    for (const [, waiter] of this.pendingReplies) {
      clearTimeout(waiter.timer)
      waiter.reject(new YuyiError('yuyi: service stopped', 'YUYI_REPLY_ABORTED'))
    }
    this.pendingReplies.clear()
    this.emitStatus()
  }

  private buildMessage(request: YuyiSendRequest): YuyiMessage {
    const entry = request.fromSession !== undefined ? this.roster.get(request.fromSession) : undefined
    return {
      id: newID('msg'),
      mode: request.mode,
      text: request.text,
      from: {
        device: this.resolvedDevice,
        sessionID: entry?.sessionId ?? 'dsh',
        ...(entry?.name !== undefined ? { name: entry.name } : {}),
      },
      to: parseAddress(request.to),
      time: Date.now(),
      ...(request.taskId !== undefined ? { taskId: request.taskId } : {}),
      ...(request.replyTo !== undefined ? { replyTo: request.replyTo } : {}),
      ...(request.expectReply === true ? { expectReply: true } : {}),
      ...(request.classification !== undefined ? { classification: request.classification } : {}),
      ...(request.contextHint !== undefined ? { contextHint: request.contextHint } : {}),
    }
  }

  private async dispatch(message: YuyiMessage): Promise<{ deliveredAs?: 'notify' | 'mail_fallback'; handlerSessionID?: string }> {
    const ack = await this.requireConnected().send(message)
    if (!ack.ok) {
      throw new YuyiError(
        `yuyi: hub rejected send to "${message.to.target}": ${ack.detail ?? 'no detail'}`,
        'YUYI_SEND_REJECTED',
      )
    }
    if (message.replyTo !== undefined) this.trace(message.id, 'replied', message.taskId)
    return {
      ...(ack.deliveredAs !== undefined ? { deliveredAs: ack.deliveredAs } : {}),
      ...(ack.handlerSessionID !== undefined ? { handlerSessionID: ack.handlerSessionID } : {}),
    }
  }

  private requireConnected(): HubClient {
    const client = this.client
    if (client === undefined || this.hubUrl.length === 0 || !this.tokenFound) {
      throw new YuyiError(
        `yuyi: not configured (hub ${this.hubUrl.length > 0 ? 'set' : 'missing'}, token reference ${this.settingsSource().tokenEnv});`
        + ' set the "hub" config or YUYI_HUB, and store the token through the credentials service'
        + ' or the per-agent token file (~/.yuyi/dsh-token)',
        'YUYI_NOT_CONFIGURED',
      )
    }
    if (!client.connected) {
      throw new YuyiError(`yuyi: hub not connected (${client.lastError ?? this.hubUrl})`, 'YUYI_NOT_CONNECTED')
    }
    return client
  }

  private trace(msgId: string, event: 'injected' | 'replied', detail?: string): void {
    this.client?.trace(msgId, event, detail)
  }

  private toRosterSession(entry: YuyiRosterEntry): RosterSession {
    return {
      sessionID: entry.sessionId,
      title: entry.title,
      directory: entry.directory,
      capabilities: { wake: true },
      ...(entry.name !== undefined ? { name: entry.name } : {}),
    }
  }

  private findByTarget(target: string): YuyiRosterEntry | undefined {
    for (const entry of this.roster.values()) {
      if (matchSession(this.toRosterSession(entry), target)) return entry
    }
    // 统一智能体名称寻址（2026-08-14 定案）：御符权威 agent_name 是唯一
    // 路由身份——Hub 不注册适配器自报别名，agent 级命中只保证「投到本
    // 连接」，由端侧分发。这里把权威名投递分发给最早注册的主会话。
    const agentName = this.client?.agentName
    if (agentName !== undefined && agentName.toLowerCase() === target.toLowerCase()) {
      return this.roster.values().next().value
    }
    return undefined
  }

  private readonly handleDeliver = (message: YuyiMessage): Promise<{ ok: boolean; detail?: string; handlerSessionID?: string }> =>
    Promise.resolve(this.routeDelivery(message))

  private routeDelivery(message: YuyiMessage): { ok: boolean; detail?: string; handlerSessionID?: string } {
    // 回信关联先于路由：命中
    // 等回复等待者的回信被其消费（它作为
    // 阻塞调用方的工具结果），再路由它会
    // 同一段文本被投递两次。
    if (message.replyTo !== undefined) {
      const waiter = this.pendingReplies.get(message.replyTo)
      if (waiter !== undefined) {
        this.pendingReplies.delete(message.replyTo)
        waiter.resolve(message)
        this.trace(message.id, 'injected', 'reply-waiter')
        return { ok: true, detail: 'consumed by expect-reply waiter' }
      }
    }
    if (message.to.target === '*' && message.from.device === this.resolvedDevice) {
      this.emitDelivered(message, 'echo-dropped')
      return { ok: true, detail: 'own-device broadcast echo dropped' }
    }
    const entry = this.findByTarget(message.to.target)
    if (entry === undefined) {
      inboxAppend(DEVICE_INBOX_KEY, message)
      this.emitDelivered(message, 'device-inbox')
      return { ok: true, detail: 'no local roster match; parked in device inbox' }
    }
    if (message.mode === 'mail') {
      inboxAppend(entry.sessionId, message)
      this.emitDelivered(message, 'session-inbox', entry.sessionId)
      return { ok: true, handlerSessionID: entry.sessionId, detail: 'parked in session inbox' }
    }
    const agent: Agent | undefined = this.ctx.agents.get(entry.sessionId)
    if (agent === undefined) {
      inboxAppend(entry.sessionId, message)
      this.emitDelivered(message, 'session-inbox', entry.sessionId)
      return { ok: true, handlerSessionID: entry.sessionId, detail: 'session not live; parked in session inbox' }
    }
    const userMessage = createUserMessage({
      content: [{ type: 'text', text: formatIncoming(message) }],
      source: {
        kind: 'plugin',
        plugin: 'dsh-yuyi',
        form: 'notice',
        summary: deliverySummary(message),
      },
    })
    // 基线先于注入：本回合的助手文本按 seq 边界收集。
    const baselineSeq = agent.session.seq
    if (agent.status === 'idle') {
      agent.followup(userMessage)
      this.trace(message.id, 'injected', 'followup')
      this.emitDelivered(message, 'woken', entry.sessionId)
    } else {
      agent.steer(userMessage)
      this.trace(message.id, 'injected', 'steer')
      this.emitDelivered(message, 'steered', entry.sessionId)
    }
    // 唤醒即回执、回合落定自动回报：发送方从「已投递」到「出结果」不再
    // 是黑箱。自动机制自身产出的消息（yuyi:auto 前缀标记）不再挂机制，防环。
    if (message.contextHint?.startsWith(AUTO_HINT_PREFIX) !== true) {
      void this.autoAcknowledge(message, entry.sessionId)
      this.watchTurnResult(agent, entry.sessionId, message, baselineSeq)
    }
    return { ok: true, handlerSessionID: entry.sessionId }
  }

  /* * 唤醒后的即时回执：mail 入发送方收件箱；不带 replyTo——不消费等回复等待者。 */
  private async autoAcknowledge(message: YuyiMessage, fromSession: SessionId): Promise<void> {
    try {
      await this.send({
        to: replyAddressOf(message, this.resolvedDevice, this.client?.ownerUsername),
        text: `已收到，正在处理。（回执对应 ${message.id}）`,
        mode: 'mail',
        fromSession,
        ...(message.taskId !== undefined ? { taskId: message.taskId } : {}),
        contextHint: `${AUTO_HINT_PREFIX}-ack`,
      })
    } catch (error) {
      this.ctx.logger.warn('yuyi: auto-ack failed', error)
    }
  }

  /* * 观察回合落定，把本回合的助手文本作为处理结果回信。 */
  private watchTurnResult(agent: Agent, sessionId: SessionId, message: YuyiMessage, baselineSeq: number): void {
    if (this.pendingResultWatches.has(sessionId)) return
    this.pendingResultWatches.add(sessionId)
    void (async () => {
      let timer: ReturnType<typeof setTimeout> | undefined
      try {
        await Promise.race([
          agent.whenIdle(),
          new Promise<never>((_resolve, reject) => {
            timer = setTimeout(() => { reject(new Error('auto-result watch timeout')) }, AUTO_RESULT_TIMEOUT_MS)
          }),
        ])
        const text = collectAssistantText(agent.session.events, baselineSeq)
        if (text.length > 0) await this.autoReport(message, sessionId, text)
      } catch {
        // 回合中止/代理销毁/观察超时：静默放弃，等待方按自身超时收敛。
      } finally {
        if (timer !== undefined) clearTimeout(timer)
        this.pendingResultWatches.delete(sessionId)
      }
    })()
  }

  /* * 处理结果回信：带 replyTo（消费发送方的等回复等待者），仍走 mail 不打扰。 */
  private async autoReport(message: YuyiMessage, fromSession: SessionId, text: string): Promise<void> {
    const body = text.length > AUTO_RESULT_TEXT_CAP ? `${text.slice(0, AUTO_RESULT_TEXT_CAP)}…（截断）` : text
    try {
      await this.send({
        to: replyAddressOf(message, this.resolvedDevice, this.client?.ownerUsername),
        text: body,
        mode: 'mail',
        fromSession,
        replyTo: message.id,
        ...(message.taskId !== undefined ? { taskId: message.taskId } : {}),
        contextHint: `${AUTO_HINT_PREFIX}-result`,
      })
      this.trace(message.id, 'replied', 'auto-result')
    } catch (error) {
      this.ctx.logger.warn('yuyi: auto-result failed', error)
    }
  }

  /* * 当前 roster 的协议形态（推送与种入新客户端共用）。 */
  private currentRosterSessions(): RosterSession[] {
    return [...this.roster.values()].map(entry => this.toRosterSession(entry))
  }

  private pushRoster(): void {
    this.client?.updateRoster(this.currentRosterSessions())
  }

  private emitDelivered(message: YuyiMessage, route: YuyiDeliveryRoute, sessionId?: SessionId): void {
    this.ctx.emit('yuyi/delivered', { message, route, ...(sessionId !== undefined ? { sessionId } : {}) })
    if (route === 'session-inbox' || route === 'device-inbox') this.emitStatus()
  }

  private emitStatus(): void {
    const status = this.status()
    const json = JSON.stringify(status)
    if (json === this.lastStatusJson) return
    this.lastStatusJson = json
    this.ctx.emit('yuyi/status', { status })
  }
}
