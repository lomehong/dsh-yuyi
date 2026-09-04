/**
 * Hub WebSocket 客户端：负责与中继 Hub 的长连接、自动重连、请求-应答关联。
 */
import type {
  AckFrame,
  Capabilities,
  ClientFrame,
  HubFeature,
  TraceEvent,
  HubFrame,
  InboxDataFrame,
  PeerDevice,
  TaskDataFrame,
  RosterSession,
  YuyiMessage,
} from "./protocol.ts"
import { INBOX_FETCH_LIMIT, PROTOCOL_VERSION, newID, parseFrame } from "./protocol.ts"

export interface HubClientOptions {
  url: string
  device: string
  instanceID: string
  token?: string
  /** 形态标识，如 "opencode" | "mcp"，仅用于 Hub 侧指标分组 */
  agentKind?: string
  /** 适配器自身版本（如 "yuyi-omp-2.1.0"），hello 上报供 Hub 排查旧插件连接 */
  adapterVersion?: string
  /** 本适配器能力声明；wake=false 时 Hub 不再尝试唤醒，直接入箱 */
  capabilities?: Capabilities
  /** 收到 deliver 帧时回调；返回 ack 结果（handlerSessionID = 实际承接会话，可选） */
  onDeliver: (message: YuyiMessage) => Promise<{ ok: boolean; detail?: string; handlerSessionID?: string }>
  /** 心跳检测到未读邮件数 >0 时回调（适配器据此提醒用户查收 / 主动拉取） */
  onUnreadMail?: (count: number) => void
  /** 心跳帧附加字段（如 dsh-remote 网关状态 remoteGateway 透传——address 上报契约 §2，
    *  通道只透传不解释）；每次心跳重取，返回 undefined 则不加字段 */
  heartbeatExtra?: () => Record<string, unknown> | undefined
  /** 心跳间隔覆盖（毫秒）；供测试加速，缺省 30_000 */
  heartbeatIntervalMs?: number
  log?: (msg: string) => void
}

interface Pending {
  resolve: (frame: HubFrame) => void
  reject: (err: Error) => void
  timer: ReturnType<typeof setTimeout>
}

/** 请求默认超时 */
const REQUEST_TIMEOUT_MS = 15_000
// 应用层心跳间隔：30s 一次 inbox/fetch {limit:0}，兼做保活（防 NAT/中间设备断空闲 TCP）
// + 兜底消息拉取。协议无 ping/pong，靠业务帧维持连接活性。
const HEARTBEAT_INTERVAL_MS = 30_000
/** 心跳连续失败阈值：达到即主动断开重连（坏连接不永久持有，转为 Hub 侧可观测的 churn） */
const HEARTBEAT_FAIL_LIMIT = 3
/** 心跳统计上报周期：每 N 次心跳上报一次 ok/fail 增量（约 N*30s） */
const HEARTBEAT_STATS_INTERVAL = 5
const RECONNECT_MIN_MS = 1_000
const RECONNECT_MAX_MS = 30_000

// 运行环境为 Bun（opencode 运行时），全局自带 WebSocket；
// @types/node 不含该声明，故从 globalThis 取。
const WS: typeof globalThis extends { WebSocket: infer T } ? T : any = (globalThis as any).WebSocket

export class HubClient {
  private ws: any = null
  private heartbeatTimer: ReturnType<typeof setTimeout> | null = null
  private closed = false
  private reconnectDelay = RECONNECT_MIN_MS
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private heartbeatFailStreak = 0
  private heartbeatOk = 0
  private heartbeatFail = 0
  private welcomeTimer: ReturnType<typeof setTimeout> | null = null
  private pending = new Map<string, Pending>()
  private roster: RosterSession[] = []
  private opts: HubClientOptions



  /**
   * 已完成握手（收到 welcome）。
   * 注意：WS 已连上但未收到 welcome 时不算 connected——此时尚不知道
   * Hub 支持哪些能力，发任何业务帧都是试错（顶层 §4.2）。
   */
  connected = false
  /** 最近一次连接错误描述 */
  lastError: string | undefined
  /** Hub 自报协议版本（welcome 缺省时为 1） */
  hubProtocolVersion = 1
  /** Hub 已启用能力；使用新帧前必须先查此表 */
  hubFeatures: HubFeature[] = []
  /** Hub 回带的本连接 agentId（v0.8 §3 预留，P1 不消费；老 Hub 不回带时 undefined） */
  agentId: string | undefined
  /** Hub 回带的御符智能体名称（统一智能体名称寻址：权威身份；老 Hub 不回带时 undefined） */
  agentName: string | undefined
  /** Hub 回带的所属 Owner 用户名（御符权威）——Agent 据此知道为谁工作 */
  ownerUsername: string | undefined
  /** Hub 回带的所属 Owner userId（御符权威） */
  ownerUserId: string | undefined
  /** Hub 回带的御符角色（avatar/worker/coder/未设置）——通信体系内分工标签 */
  role: string | undefined

  constructor(opts: HubClientOptions) {
    this.opts = opts
  }

  /** Hub 是否支持指定能力（能力协商优先于试错） */
  supports(feature: HubFeature): boolean {
    return this.connected && this.hubFeatures.includes(feature)
  }

  start(): void {
    this.closed = false
    this.connect()
  }

  stop(): void {
    this.closed = true
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer)
    this.reconnectTimer = null
    if (this.welcomeTimer) clearTimeout(this.welcomeTimer)
    this.welcomeTimer = null
    if (this.heartbeatTimer) { clearTimeout(this.heartbeatTimer); this.heartbeatTimer = null }
    this.failAllPending(new Error("hub client stopped"))
    try {
      this.ws?.close()
    } catch {}
    this.ws = null
    this.connected = false
  }

  /** 更新本实例会话名单并推送给 Hub */
  updateRoster(sessions: RosterSession[]): void {
    this.roster = sessions
    if (this.connected) {
      this.sendFrame({ type: "roster", sessions })
    }
  }

  /**
   * 发送消息，等 Hub/对端 ack。
   *
   * 请求 id 与 message.id 刻意解耦（C8）：message.id 是**幂等键**，重发同一消息
   * 必须保持不变；而请求 id 是**关联键**，每次请求必须唯一，否则重试会与
   * pending 表中未完成的同 id 请求撞键。
   */
  async send(message: YuyiMessage): Promise<AckFrame> {
    if (!this.connected) throw new Error(`hub not connected (${this.lastError ?? this.opts.url})`)
    const id = newID("req")
    const frame = await this.request(id, { type: "send", id, message })
    if (frame.type !== "ack") throw new Error(`unexpected reply: ${frame.type}`)
    return frame
  }

  /** 查询在线设备与会话 */
  async peers(): Promise<PeerDevice[]> {
    if (!this.connected) throw new Error(`hub not connected (${this.lastError ?? this.opts.url})`)
    const id = newID("req")
    const frame = await this.request(id, { type: "peers", id })
    if (frame.type !== "peers") throw new Error(`unexpected reply: ${frame.type}`)
    return frame.devices
  }

  /** 拉取一批 Hub 侧收件箱消息（不删除，需后续 inboxAck 清读） */
  async inboxFetch(recipient?: string, cursor?: number, limit = INBOX_FETCH_LIMIT): Promise<InboxDataFrame> {
    if (!this.supports("inbox")) throw new Error("hub 不支持 inbox 能力")
    const id = newID("req")
    const frame = await this.request(id, { type: "inbox/fetch", id, recipient, cursor, limit })
    // Hub 用 ack(ok=false) 表达拒绝（收件人未注册、无权访问等），detail 是唯一的
    // 原因说明，不能吞掉
    if (frame.type === "ack") throw new Error(frame.detail ?? "hub 拒绝了 inbox/fetch")
    if (frame.type !== "inbox/data") throw new Error(`unexpected reply: ${frame.type}`)
    return frame
  }

  /**
   * 按游标续拉至末尾，返回全部条目。
   * maxBatches 是兜底：Hub 侧容量上限远小于它，触顶说明游标推进有问题，
   * 此时宁可少拉一部分也不能在此处死循环。
   */
  async inboxDrain(recipient?: string, maxBatches = 20): Promise<InboxDataFrame["entries"]> {
    const all: InboxDataFrame["entries"] = []
    let cursor: number | undefined
    for (let i = 0; i < maxBatches; i++) {
      const batch = await this.inboxFetch(recipient, cursor)
      all.push(...batch.entries)
      if (batch.cursor === undefined) break
      cursor = batch.cursor
    }
    return all
  }

  /**
   * 只问 Hub 侧未读数，不取内容、不标记已下发（`limit=0`）。供空闲提醒这类
   * 高频探测使用。
   *
   * 返回 `undefined` 表示**这一来源当前不可用**（未连接 / Hub 不支持 inbox /
   * 查询失败）。调用方不得把它当成 0：否则「没有未读」是个假结论。
   * 计数只是辅助信息，故失败在此吸掉而不向上抛。
   */
  async inboxCount(recipient?: string): Promise<number | undefined> {
    if (!this.supports("inbox")) return undefined
    try {
      const data = await this.inboxFetch(recipient, 0, 0)
      return data.remaining
    } catch (err) {
      this.opts.log?.(`inbox count failed: ${String(err)}`)
      return undefined
    }
  }

  /**
   * 任务记忆层 P3：按 taskId 查 Hub 轻量索引（参与者/消息数/时间窗）。
   * 返回 undefined = 无投递记录或无权限（Hub 对两者统一回空，防枚举探测）。
   * 索引不含正文——跨设备可见性只到「参与链」，全文仍只在端侧任务记录。
   */
  async taskFetch(taskId: string): Promise<TaskDataFrame["task"] | undefined> {
    if (!this.supports("task")) throw new Error("hub 不支持 task 能力")
    const id = newID("req")
    const frame = await this.request(id, { type: "task/fetch", id, taskId })
    if (frame.type === "ack") throw new Error(frame.detail ?? "hub 拒绝了 task/fetch")
    if (frame.type !== "task/data") throw new Error(`unexpected reply: ${frame.type}`)
    return frame.task
  }

  /**
   * 消息生命周期事件上报（适配器埋点：注入会话 / 已发回信）。
   * best-effort：未连接或 Hub 不支持 trace 帧时静默跳过，失败只记日志，
   * 绝不抛给调用方——可观测性不能影响投递主链路。
   */
  trace(msgId: string, event: TraceEvent, detail?: string): void {
    if (!this.connected || !this.supports("trace")) return
    const id = newID("req")
    void this.request(id, { type: "trace", id, msgId, event, detail }).catch((err) => {
      this.opts.log?.("trace event failed (" + msgId + "/" + event + "): " + String(err))
    })
  }
  /** 清读：确认已消费这批 message.id，Hub 据此删除 */
  async inboxAck(ids: string[], recipient?: string): Promise<AckFrame> {
    if (!this.supports("inbox")) throw new Error("hub 不支持 inbox 能力")
    if (ids.length === 0) return { type: "ack", id: "", ok: true }
    const id = newID("req")
    const frame = await this.request(id, { type: "inbox/ack", id, recipient, ids })
    if (frame.type !== "ack") throw new Error(`unexpected reply: ${frame.type}`)
    return frame
  }

  // ---------- 内部 ----------

  private connect(): void {
    if (this.closed) return
    if (!WS) {
      this.lastError = "WebSocket unavailable in this runtime"
      this.opts.log?.(this.lastError)
      return
    }
    let ws: any
    try {
      ws = new WS(this.opts.url)
    } catch (err) {
      this.lastError = String(err)
      this.scheduleReconnect()
      return
    }
    this.ws = ws

    ws.onopen = () => {
      // 只发 hello，不发 roster。connected 推迟到收到 welcome（见 handleFrame）：
      // 未完成能力协商前发业务帧属于试错；附带收益是 token 无效时不再白发一帧 roster。
      this.lastError = undefined
      this.opts.log?.(`connected to hub ${this.opts.url}, waiting for welcome`)
      this.sendFrame({
        type: "hello",
        device: this.opts.device,
        instanceID: this.opts.instanceID,
        token: this.opts.token,
        protocolVersion: PROTOCOL_VERSION,
        agentKind: this.opts.agentKind,
        adapterVersion: this.opts.adapterVersion,
        capabilities: this.opts.capabilities,
      })
      // 握手超时：旧 Hub 不会不回 welcome（现有实现一直回），但若对端卡住
      // 或回了一个我们不认识的帧，必须有明确失败而非永久悬置。
      if (this.welcomeTimer) clearTimeout(this.welcomeTimer)
      this.welcomeTimer = setTimeout(() => {
        this.welcomeTimer = null
        if (this.connected) return
        this.lastError = "handshake timed out (no welcome)"
        this.opts.log?.(this.lastError)
        try {
          ws.close()
        } catch {}
      }, REQUEST_TIMEOUT_MS)
    }

    ws.onmessage = (ev: { data: unknown }) => {
      const frame = parseFrame<HubFrame>(ev.data)
      if (frame) this.handleFrame(frame)
    }

    ws.onerror = (ev: any) => {
      this.lastError = ev?.message ? String(ev.message) : "websocket error"
    }

    ws.onclose = (ev: { code?: number; reason?: string }) => {
      const wasConnected = this.connected
      this.connected = false
      this.ws = null
      if (this.welcomeTimer) clearTimeout(this.welcomeTimer)
      this.welcomeTimer = null
      this.hubFeatures = []
      this.hubProtocolVersion = 1
      this.ownerUsername = undefined
      this.ownerUserId = undefined
      this.role = undefined
      if (this.heartbeatTimer) clearTimeout(this.heartbeatTimer)
      this.heartbeatTimer = null
      this.heartbeatFailStreak = 0
      this.failAllPending(new Error("hub connection closed"))
      // 只在状态变化时记一条，避免重连失败刷日志
      if (wasConnected) {
        this.opts.log?.(`hub disconnected (${ev?.code ?? "?"}) ${ev?.reason ?? ""}`.trimEnd())
      }
      // 服务器主动关闭（4009 replaced / 4008 kicked）：不重连——服务器明确拒绝/
      // 替换本连接，重连只会形成风暴（实测踢旧逻辑曾引发每秒数万次连接风暴）。
      if (ev?.code === 4009 || ev?.code === 4008) {
        this.closed = true
        this.opts.log?.(`hub 主动关闭（code=${ev.code}），停止重连（${ev?.reason ?? ""}）`)
        return
      }
      this.scheduleReconnect()
    }
  }

  /** 应用层心跳：每 30s 发 inbox/fetch {limit:0}，兼做保活（防 NAT 断空闲 TCP）
   *  + 未读邮件检测（remaining >0 触发 onUnreadMail 回调，适配器提醒用户查收）。
   *  + 心跳统计：成功/失败计数，每 N 次上报一次 heartbeat/stats（严格失败率度量）。 */
  private startHeartbeat(): void {
    const interval = this.opts.heartbeatIntervalMs ?? HEARTBEAT_INTERVAL_MS
    if (this.heartbeatTimer) clearTimeout(this.heartbeatTimer)
    this.heartbeatTimer = setTimeout(() => {
      if (!this.closed && this.connected) {
        const id = newID("hb")
        // heartbeatExtra：适配器级透传字段（如 dsh-remote 网关状态），随每次心跳上报
        const extra = this.opts.heartbeatExtra?.() ?? {}
        this.request(id, { type: "inbox/fetch", id, limit: 0, ...extra })
          .then((frame) => {
            this.heartbeatFailStreak = 0
            this.heartbeatOk++
            if (frame.type === "inbox/data" && frame.remaining > 0) {
              this.opts.onUnreadMail?.(frame.remaining)
            }
            this.maybeReportHeartbeatStats()
          })
          .catch(() => {
            // 心跳无响应：连续失败达阈值 → 主动断开坏连接触发重连。
            // 不静默持有半死连接（TCP 在但 Hub 不响应/路由失效），
            // 断开后 Hub 侧 disconnected 计数器即反映心跳失败（连接 churn）。
            this.heartbeatFailStreak++
            this.heartbeatFail++
            this.maybeReportHeartbeatStats()
            if (this.heartbeatFailStreak >= HEARTBEAT_FAIL_LIMIT) {
              this.heartbeatFailStreak = 0
              this.opts.log?.(`心跳连续 ${HEARTBEAT_FAIL_LIMIT} 次无响应，主动断开重连`)
              try {
                this.ws?.close()
              } catch {}
            }
          })
        this.startHeartbeat()
      }
    }, interval)
  }

  /** 每 HEARTBEAT_STATS_INTERVAL 次心跳上报一次 ok/fail 增量（best-effort，失败只记日志） */
  private maybeReportHeartbeatStats(): void {
    if (this.heartbeatOk + this.heartbeatFail < HEARTBEAT_STATS_INTERVAL) return
    if (!this.connected || !this.supports("hb_stats")) {
      // Hub 不支持上报：清零避免无限累积（老 Hub 兼容）
      this.heartbeatOk = 0
      this.heartbeatFail = 0
      return
    }
    const ok = this.heartbeatOk
    const fail = this.heartbeatFail
    this.heartbeatOk = 0
    this.heartbeatFail = 0
    const id = newID("hbs")
    void this.request(id, { type: "heartbeat/stats", id, ok, fail }).catch((err) => {
      this.opts.log?.("heartbeat stats report failed: " + String(err))
    })
  }

  private scheduleReconnect(): void {
    if (this.closed || this.reconnectTimer) return
    const delay = this.reconnectDelay
    this.reconnectDelay = Math.min(this.reconnectDelay * 2, RECONNECT_MAX_MS)
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null
      this.connect()
    }, delay)
  }

  private sendFrame(frame: ClientFrame): void {
    try {
      this.ws?.send(JSON.stringify(frame))
    } catch (err) {
      this.lastError = String(err)
    }
  }

  private request(id: string, frame: ClientFrame): Promise<HubFrame> {
    return new Promise<HubFrame>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id)
        reject(new Error("hub request timed out"))
      }, REQUEST_TIMEOUT_MS)
      this.pending.set(id, { resolve, reject, timer })
      this.sendFrame(frame)
    })
  }

  private handleFrame(frame: HubFrame): void {
    switch (frame.type) {
      case "welcome": {
        // 握手完成点：先记下 Hub 能力，再置 connected，最后才推 roster。
        if (this.welcomeTimer) clearTimeout(this.welcomeTimer)
        this.welcomeTimer = null
        this.hubProtocolVersion = frame.protocolVersion ?? 1
        this.hubFeatures = frame.features ?? []
        this.agentId = frame.agentId
        this.agentName = frame.agentName
        this.ownerUsername = frame.ownerUsername
        this.ownerUserId = frame.ownerUserId
        this.role = frame.role
        this.connected = true
        this.reconnectDelay = RECONNECT_MIN_MS
        this.opts.log?.(
          `hub welcome: protocolVersion=${this.hubProtocolVersion} features=[${this.hubFeatures.join(",")}]${this.agentName ? ` agent=${this.agentName}` : ""}`,
        )
        if (this.roster.length > 0) {
          this.sendFrame({ type: "roster", sessions: this.roster })
        }
        this.startHeartbeat()
        return
      }
      case "error":
        this.lastError = frame.detail
        this.opts.log?.(`hub error: ${frame.detail}`)
        return
      case "ack":
      case "peers":
      case "inbox/data":
      case "task/data": {
        const pending = this.pending.get(frame.id)
        if (pending) {
          this.pending.delete(frame.id)
          clearTimeout(pending.timer)
          pending.resolve(frame)
        }
        return
      }
      case "deliver": {
        this.opts
          .onDeliver(frame.message)
          .then((result) => {
            this.sendFrame({ type: "ack", id: frame.id, ok: result.ok, detail: result.detail, handlerSessionID: result.handlerSessionID })
          })
          .catch((err) => {
            this.sendFrame({ type: "ack", id: frame.id, ok: false, detail: String(err) })
          })
        return
      }
    }
  }

  private failAllPending(err: Error): void {
    for (const [, pending] of this.pending) {
      clearTimeout(pending.timer)
      pending.reject(err)
    }
    this.pending.clear()
  }
}
