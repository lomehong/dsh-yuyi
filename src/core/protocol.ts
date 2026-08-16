/**
 * 御驿 Yuyi 通信协议
 *
 * 适配器(客户端) <--WebSocket--> Hub(中继) 之间交换 JSON 帧。
 * 每帧一条 JSON 文本消息。
 */

/** 适配器能力声明（顶层 §5.4）。wake=false 时 Hub 自动将 notify 降级为 mail */
export interface Capabilities {
  wake: boolean
}

/** 当前协议版本。缺省（旧客户端/旧 Hub）一律视为 1 */
export const PROTOCOL_VERSION = 2

/** Hub 能力标识，在 welcome.features 中回带，客户端据此决定是否使用新帧。
 *  identity：Hub 已接入御符，hello.token 须为御符签发的 agent token（非共享口令） */
export type HubFeature = "inbox" | "capabilities" | "identity" | "task" | "trace" | "hb_stats"

/** 单次 inbox/fetch 返回条数上限（顶层 §5.3「批次约束」），超出靠游标续拉 */
export const INBOX_FETCH_LIMIT = 50

/** 一个已注册到 roster 的 opencode 会话 */
export interface RosterSession {
  sessionID: string
  title: string
  directory: string
  /** 通过 yuyi_register 起的别名，便于点名投递 */
  name?: string
  /**
   * 会话级能力摘要（Phase 3 评估共识：peers capability 摘要替代独立 Agent Card）。
   * 由适配器按会话实际情况上报；Hub 只透传不校验（信任边界 = 客户端自报，
   * 与 roster 其余字段一致）。端侧据此判断「现在谁能接活」：
   * - sandbox: 会话沙箱等级（"full" | "restricted" | "none"）
   * - network: 是否有网络访问（受限沙箱常见缺失）
   * - wake: 该会话是否可被唤醒注入（false = 入箱降级）
   */
  capabilities?: {
    sandbox?: "full" | "restricted" | "none"
    network?: boolean
    wake?: boolean
  }
}

/** 收件人主键：Phase 2 起为 `agent_id:name`（御符签发的 agentId，强信任）。
 *  agentId 为 UUID（字符集 [0-9a-f-]，不含 ':'），故「首个 ':' 前为主体、之后为别名」
 *  的解析规则继续成立。必须跨进程重启稳定，绝不得含 instanceID（顶层 §5.3「收件人主键」）。 */
export function recipientID(agentId: string, name: string): string {
  return `${agentId}:${name.toLowerCase()}`
}

/** 送达语义 */
export type DeliveryMode = "notify" | "mail"

/** 在会话间传递的消息 */
export interface YuyiMessage {
  id: string
  mode: DeliveryMode
  text: string
  from: {
    device: string
    sessionID: string
    name?: string
    /**
     * 御符验证过的发送方 agentId，**由 Hub 权威回填**（挑战审视 Y-4）：
     * 适配器自报值必须在 Hub 接收侧被剔除后由 Hub 用已验证身份覆写，
     * 端侧据此区分「Hub 背书的发送方」与伪造来源。
     */
    agentId?: string
    /** 发送方 owner 用户名，同样由 Hub 权威回填 */
    ownerUsername?: string
    /** 发送方御符角色（avatar/worker/coder/未设置），由 Hub 权威回填。
     *  端侧据此识别「avatar（Owner 数字分身）消息 = 最高优先级」 */
    role?: string
  }
  to: {
    /** 目标 owner（统一智能体名称寻址：跨 owner 时指定；缺省=发送方 owner，本 owner 寻址） */
    owner?: string
    /** 目标设备；省略表示广播或本设备之外自动匹配 */
    device?: string
    /** "*" 广播 / 会话名 / sessionID */
    target: string
  }
  /** epoch ms */
  time: number

  // ---- 以下为 A2A / EACP 对齐字段（顶层附录 B）。
  //      Phase 1 只落字段与透传，不做任何基于它们的判断。 ----

  /** 请求-响应闭环（v0.8 设计 §3）：本条消息所回应的原消息 id。回应必填；新请求缺省 */
  replyTo?: string
  /** 请求-响应闭环：是否期望收信方处理完成后自动回信。默认 false（单程通知）。自动回信恒不带此字段 */
  expectReply?: boolean
  /** A2A Task.id，回信/审批补投时关联；请求-响应闭环的聚合键（回应/追问必须继承） */
  taskId?: string
  /** EACP traceContext，贯穿审计链 */
  traceId?: string
  /** EACP §16.3 委派深度，缺省 0 */
  hopCount?: number
  /** EACP 数据分级，DLP/策略输入 */
  classification?: string
  /**
   * 任务记忆层（P2）：可选投递提示（如任务记录引用）。Hub 只透传、不回填、
   * 不校验（与 traceId 同级）；端侧仅用于渲染提示，不参与寻址、不透传执行。
   * 与 attach 的关系（评审发现 7）：attach 是端侧权威锚点，contextHint 是
   * 弱提示，两者冲突时 attach 优先。老客户端不带此字段时 Hub 正常投递（P5）。
   */
  contextHint?: string
  /**
   * 标识该消息在策略降级窗口内放行（R3）。
   * **由 Hub 权威填充**：适配器自报值必须在 Hub 接收侧被剔除，
   * 否则适配器可自行标记降级放行，污染 Phase 4 的审计。
   */
  policyBypass?: boolean
  /**
   * 内容签名（端到端完整性，方案 1 协议占位——评审定案：御符 bcrypt 阻塞暂缓，
   * 待御符 sign_key 表实现后激活）。HMAC-SHA256 签名，密钥为御符派生的内容签名
   * 专用密钥（sign_key_id/sign_secret，独立于身份 token）。
   * Hub 只透传不校验（Hub 不持有明文密钥）；接收方验签（调御符 verify-signature）。
   * 缺省 = 未签名（兼容老 Agent，接收方不验签）。
   */
  contentSignature?: string
  /** 签名所用密钥 id（御符 sign_key 表定位，verify-signature 用） */
  signatureKeyId?: string
}

/** 剔除客户端不得自报的 Hub 权威字段（顶层附录 B；挑战审视 Y-4 扩至 from 背签字段） */
export function stripHubAuthoritativeFields(message: YuyiMessage): YuyiMessage {
  const needStripFrom = message.from.agentId !== undefined || message.from.ownerUsername !== undefined
  if (message.policyBypass === undefined && !needStripFrom) return message
  const { policyBypass: _dropped, ...rest } = message
  if (!needStripFrom) return rest
  const { agentId: _a, ownerUsername: _o, ...fromRest } = rest.from
  return { ...rest, from: fromRest }
}

// ---------- 客户端 -> Hub ----------

export interface HelloFrame {
  type: "hello"
  device: string
  /** 同一设备可能跑多个 opencode 实例，用于区分连接；不参与寻址与存储主键 */
  instanceID: string
  token?: string
  /** 客户端协议版本，缺省视为 1 */
  protocolVersion?: number
  /** 形态标识，如 "opencode" | "mcp" | "acp-bridge"，用于指标分组 */
  agentKind?: string
  /** 适配器自身版本（如 "yuyi-omp-2.1.0"），Hub 记录用于排查「旧插件连新 Hub」 */
  adapterVersion?: string
  capabilities?: Capabilities
}

export interface RosterFrame {
  type: "roster"
  sessions: RosterSession[]
}

export interface SendFrame {
  type: "send"
  id: string
  message: YuyiMessage
}

export interface PeersRequestFrame {
  type: "peers"
  id: string
}

export interface AckFrame {
  type: "ack"
  id: string
  ok: boolean
  detail?: string
  /** 谁在处理（跨端承接可见性）：承接方处理 deliver 后回执实际承接会话 id。
   *  缺省 undefined → Hub 兜底（接收连接首个具名 roster 会话或 device）。 */
  handlerSessionID?: string
  /** 投递结果标注（P1 优化）：区分实时送达 vs 降级入箱，消除 ack ok:true 语义混淆。
   *  - "notify"：实时唤醒送达（deliver 帧）
   *  - "mail_fallback"：目标离线/无 wake 权限，降级入箱（ack ok:true 但非实时）
   *  - undefined：非投递类 ack（权限拒绝等），无投递模式含义 */
  deliveredAs?: "notify" | "mail_fallback"
}

/** 拉取 Hub 侧收件箱（至少一次语义：不删除，靠 inbox/ack 清读） */
export interface InboxFetchFrame {
  type: "inbox/fetch"
  id: string
  /** 收件人标识；缺省为本连接注册的唯一收件人（yuyi-mcp 场景） */
  recipient?: string
  /** 续拉游标，取上次响应的 cursor；缺省从最早未读开始 */
  cursor?: number
  /** 期望条数，Hub 侧硬上限 INBOX_FETCH_LIMIT；传 **0 表示只问未读数**
   *  （entries 为空、不推进游标、不标记已下发，未读数在 remaining） */
  limit?: number
}

/** 清读：确认已消费，Hub 据此删除 */
export interface InboxAckFrame {
  type: "inbox/ack"
  id: string
  recipient?: string
  /** 已消费的 message.id 列表 */
  ids: string[]
}

/** 任务记忆层 P3：按 taskId 聚合 delivered_index 的轻量索引查询（不存全文、不推断状态机） */
export interface TaskFetchFrame {
  type: "task/fetch"
  id: string
  taskId: string
}

/** 消息生命周期 trace 事件（适配器上报：注入会话 / 已发回信） */
export type TraceEvent = "injected" | "replied" | "turn_timeout"

/** 适配器 → Hub：消息生命周期事件上报（best-effort 可观测性，不影响投递语义） */
export interface TraceFrame {
  type: "trace"
  id: string
  msgId: string
  event: TraceEvent
  detail?: string
}

/** 适配器 → Hub：心跳统计周期上报（best-effort 可观测性，不影响投递语义）。
 *  客户端周期上报「心跳成功/失败次数」增量，Hub 聚合为 heartbeatOk/heartbeatFail
 *  计数器，供告警引擎计算心跳失败率（严格度量，非连接 churn 代理）。 */
export interface HeartbeatStatsFrame {
  type: "heartbeat/stats"
  id: string
  /** 本周期心跳成功次数（收到 inbox/data 响应） */
  ok: number
  /** 本周期心跳失败次数（请求超时/无响应） */
  fail: number
}

export type ClientFrame =
  | HelloFrame
  | RosterFrame
  | SendFrame
  | PeersRequestFrame
  | AckFrame
  | InboxFetchFrame
  | InboxAckFrame
  | TaskFetchFrame
  | TraceFrame
  | HeartbeatStatsFrame

// ---------- Hub -> 客户端 ----------

export interface WelcomeFrame {
  type: "welcome"
  /** Hub 支持的协议版本，缺省视为 1 */
  protocolVersion?: number
  /** 本连接已验证的 agentId（v0.8 §3：预留，P1 不消费；老 Hub 不回带时 undefined） */
  agentId?: string
  /** 御符设置的智能体名称（统一智能体名称寻址：权威身份，同 owner 唯一；老 Hub 不回带时 undefined） */
  agentName?: string
  /** 本连接所属 Owner 用户名（御符权威，hello 时 verify 返回）——Agent 据此知道为谁工作 */
  ownerUsername?: string
  /** 本连接所属 Owner userId（御符权威） */
  ownerUserId?: string
  /** 本连接御符角色（avatar/worker/coder/未设置）——通信体系内分工标签 */
  role?: string
  /** Hub 已启用的能力，客户端据此决定是否使用新帧（能力协商优先于试错） */
  features?: HubFeature[]
}

export interface ErrorFrame {
  type: "error"
  detail: string
}

export interface DeliverFrame {
  type: "deliver"
  id: string
  message: YuyiMessage
}

export interface PeerDevice {
  device: string
  instanceID: string
  sessions: RosterSession[]
  /** 本连接已验证的 agentId（任务记忆层 §5.3，P1）：端侧按 Agent 分组展示；
   *  老 Hub 不回带时按设备平铺降级（P5 兼容） */
  agentId?: string
  /** 发送方御符角色（avatar/worker/coder/未设置），端侧据此识别 avatar（最高优先级） */
  role?: string
  /** 最近活跃时间（epoch ms，P4 优化）：端侧据此判断别名新鲜度，
   *  主动刷新缓存避免用过期别名投递（降级 mail）。老 Hub 不回带时 undefined */
  lastActiveAt?: number
}

export interface PeersResponseFrame {
  type: "peers"
  id: string
  devices: PeerDevice[]
}

/** inbox/fetch 的响应 */
export interface InboxDataFrame {
  type: "inbox/data"
  id: string
  entries: Array<{ message: YuyiMessage; receivedAt: number }>
  /** 还有更多时给出下次游标；省略表示已到末尾 */
  cursor?: number
  /** 该收件人剩余未读条数（不含本批） */
  remaining: number
}

/** task/fetch 的响应：参与者/消息数/时间窗（轻量索引，不含正文） */
export interface TaskDataFrame {
  type: "task/data"
  id: string
  /** 该 taskId 无投递记录时省略（或返回 task: undefined 由客户端提示） */
  task?: {
    taskId: string
    /** 参与方 agentId 集合（sender/recipient 去重） */
    participants: string[]
    /** 该 taskId 名下的投递消息条数（轮次近似，非权威状态） */
    messageCount: number
    firstAt: number
    lastAt: number
    /** 谁在处理（跨端承接可见性）：承接会话（handler_session 去重取最近）。
     *  仅参与者可见（沿用 task/fetch 鉴权）；无承接数据时省略。 */
    handlers?: Array<{ sessionID: string; lastAt: number }>
  }
}

export type HubFrame =
  | WelcomeFrame
  | ErrorFrame
  | DeliverFrame
  | AckFrame
  | PeersResponseFrame
  | InboxDataFrame
  | TaskDataFrame

// ---------- 工具函数 ----------

/**
 * 解析地址字符串（统一智能体名称寻址）：
 *   "*"                     -> 广播
 *   "agent_name"            -> 本 owner 裸名（同 owner 唯一）
 *   "device:target"         -> 指定设备上的会话（name 或 sessionID）
 *   "owner/device:target"   -> 跨 owner 完整寻址（owner 前缀可选）
 *   "owner/target"          -> 跨 owner 裸名
 */
export function parseAddress(input: string): { owner?: string; device?: string; target: string } {
  const trimmed = input.trim()
  if (trimmed === "*") return { target: "*" }
  let rest = trimmed
  let owner: string | undefined
  // owner/ 前缀（跨 owner 消歧，agent_name 同 owner 唯一已够定位）
  const slashIdx = rest.indexOf("/")
  if (slashIdx > 0) {
    owner = rest.slice(0, slashIdx).trim()
    rest = rest.slice(slashIdx + 1).trim()
  }
  const idx = rest.indexOf(":")
  if (idx > 0) {
    return { owner, device: rest.slice(0, idx).trim(), target: rest.slice(idx + 1).trim() }
  }
  return { owner, target: rest }
}

/** 判断 roster 中的会话是否匹配 target（name 或 sessionID，name 不区分大小写） */
export function matchSession(session: RosterSession, target: string): boolean {
  if (session.sessionID === target) return true
  if (session.name && session.name.toLowerCase() === target.toLowerCase()) return true
  return false
}

/** 生成消息/请求 ID */
export function newID(prefix = "msg"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
}

/** 安全解析一条 JSON 帧 */
export function parseFrame<T>(raw: unknown): T | undefined {
  if (typeof raw !== "string") return undefined
  try {
    const parsed = JSON.parse(raw)
    if (typeof parsed === "object" && parsed !== null && typeof parsed.type === "string") {
      return parsed as T
    }
  } catch {
    // 忽略非法帧
  }
  return undefined
}
