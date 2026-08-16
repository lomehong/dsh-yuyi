/**
 * 御驿 Yuyi · Admin API 请求/响应类型（管理台设计 §5：单一事实源）。
 *
 * admin-web 前端直接引用本文件，杜绝前后端各写一份漂移。因此本文件必须保持
 * **零运行时依赖**（只有类型与纯常量），前端打包时不会把 Hub 侧代码拖进产物。
 *
 * 契约口径见 docs/御驿-Hub管理台-设计.md §4：
 *   - 所有响应顶层携带 hub 实例标识（§4 hubId 决策）
 *   - 错误体 { error: { code, message } }，code 为封闭枚举
 *   - cursor 即消息表 seq（§4.1 游标语义）
 */

// ---------- 通用 ----------

/** 每个 admin 响应顶层携带的实例标识（§4/§10.2 分布式地基） */
export interface HubIdentity {
  id: string
  /** 当前恒为 "standalone"；预留扩展，消费方必须容忍未知新值（§4 版本策略） */
  mode: string
}

/** 错误码封闭枚举（§4）：前端据 code 分支而非解析文案 */
export type AdminErrorCode =
  | "NOT_FOUND"
  | "OUT_OF_SCOPE"
  | "RATE_LIMITED"
  | "REVIEW_LOCKED"
  | "BAD_REQUEST"
  | "INTERNAL"

export interface AdminError {
  error: { code: AdminErrorCode; message: string }
}

// ---------- 观测端点（§4.1） ----------

export interface OverviewResponse {
  hub: HubIdentity
  version: string
  startedAt: number
  uptimeMs: number
  connections: number
  sessions: number
  recipients: number
  unreadTotal: number
  storageBytes: number
  pendingReviews: number
  /** 未配置御衡时 audit/policy 为 null（定案 5：治理旁路可缺席） */
  audit: { queueDepth: number; logSequence: number; dropped: number } | null
  policy: { degraded: boolean; degradedSeconds: number; failClosed: boolean } | null
  yufuURL: string
  yuhengURL: string | null
}

export interface ConnectionSummary {
  device: string
  instanceID: string
  agentId: string
  /** 御符权威 agent_name（hello 时 verify 返回，同 owner 唯一）；老御符未返回时缺省。
   *  admin 页面显示 Agent 名必须用它，不用适配器自报的会话别名/设备名。 */
  agentName?: string
  /** 御符角色（avatar/worker/coder/未设置）——通信体系内分工标签 */
  role?: string
  ownerUsername: string
  permissionCount: number
  agentKind?: string
  /** 适配器自身版本（hello.adapterVersion 上报），排查旧插件连新 Hub */
  adapterVersion?: string
  wake?: boolean
  verifiedAt: number
  sessions: Array<{ sessionID: string; name?: string; title: string }>
}

export interface ConnectionsResponse {
  hub: HubIdentity
  connections: ConnectionSummary[]
}

export interface RecipientSummary {
  recipientID: string
  name: string
  agentId: string
  device: string
  unread: number
  /** 最早未读的 received_at；无未读时缺省（积压年龄指标） */
  oldestUnreadAt?: number
  online: boolean
}

export interface RecipientsResponse {
  hub: HubIdentity
  recipients: RecipientSummary[]
}

/** §4.1：只给元数据与摘要，v0.1 不提供任何完整正文读取 */
export interface InboxEntrySummary {
  id: string
  seq: number
  from: string
  mode: string
  receivedAt: number
  /** 正文摘要，截断 200 字 */
  textPreview: string
  byteSize: number
  policyBypass: boolean
  /** 是否关联 review 挂起（§4.2 REVIEW_LOCKED 的判定依据） */
  reviewLocked: boolean
}

export interface InboxResponse {
  hub: HubIdentity
  recipientID: string
  entries: InboxEntrySummary[]
  /** 还有更多时给出，下一页原样回传（§4.1 游标语义：即消息表 seq） */
  nextCursor?: number
  remaining: number
}

export interface ReviewSummary {
  id: string
  senderAgent: string
  target: string
  mode: string
  policyId?: string
  createdAt: number
  pendingMs: number
  ttlRemainingMs: number
}

export interface ReviewsResponse {
  hub: HubIdentity
  reviews: ReviewSummary[]
}

/** 任务索引视图（任务记忆层 P3 §5.2：复用 Hub delivered_index 的轻量聚合，非全文） */
export interface TaskIndexResponse {
  hub: HubIdentity
  /** 无投递记录时省略（与 task/fetch 语义一致：无记录 = 无索引） */
  task?: {
    taskId: string
    participants: string[]
    messageCount: number
    firstAt: number
    lastAt: number
  }
}

export interface GovernanceResponse {
  hub: HubIdentity
  audit: {
    counters: Record<string, number>
    queueDepth: number
    logSequence: number
    endpoint: string
  } | null
  policy: {
    counters: Record<string, number>
    cacheSize: number
    policyVersion: string
    degraded: boolean
    degradedSeconds: number
    failClosed: boolean
    endpoint: string
  } | null
}

export interface MetricsSummaryResponse {
  hub: HubIdentity
  counters: Record<string, number>
  inbox: Record<string, number>
  gauges: Record<string, number>
}

// ---------- 可观测性闭环：告警（告警引擎，hub/alerting.ts） ----------

/** 一条告警事件（活跃集或历史） */
export interface AlertEvent {
  id: string
  /** 规则 id（stable，如 mail_fallback_rate） */
  ruleId: string
  /** 规则名（展示） */
  name: string
  severity: "warning" | "critical"
  description: string
  at: number
}

/** GET /admin/api/v1/alerts 响应 */
export interface AlertsResponse {
  hub: HubIdentity
  /** 当前活跃告警（触发中） */
  active: AlertEvent[]
  /** 历史告警（最近 N 条，含已解除） */
  history: AlertEvent[]
  activeCount: number
}

// ---------- 运维动作端点（§4.2，全部幂等：影响数 0 属正常成功） ----------

export interface ActionResponse {
  hub: HubIdentity
  ok: true
  /** 实际影响数（踢线/删除/失效条数）；幂等重放为 0 不报错（§10.2） */
  affected: number
  detail?: string
}

/** POST /connections/:instanceID/revalidate 的结果三态（§5.4 定案 2 同一口径） */
export interface RevalidateResponse {
  hub: HubIdentity
  ok: true
  affected: number
  outcome: "valid" | "invalid_kicked" | "unavailable_kept" | "not_found"
  detail?: string
}

// ---------- SSE 事件（§4.3） ----------

export type AdminSSEEvent =
  | { event: "connection"; data: { hubId: string; action: "open" | "close"; instanceID: string } }
  | { event: "review"; data: { hubId: string; action: "added" | "resolved" | "expired"; id: string } }
  | { event: "degraded"; data: { hubId: string; plane: "policy" | "audit"; state: "enter" | "exit" } }
  | { event: "stats"; data: { hubId: string } & Record<string, number | string> }
