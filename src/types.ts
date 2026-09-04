/**
  * yuyi 能力接缝的公开类型：状态快照、roster 条目、
  * 发送请求与结果、投递路由与接缝的错误类。
 * @module dsh-yuyi/types
 */

import type { SessionId } from '@deepseek-ai/dsh-session/types'
import { HarnessError } from '@deepseek-ai/dsh-llm'
import type { PeerDevice, YuyiMessage } from './core.ts'
import type { TaskView } from './core/yuyi-task.ts'

/* * 客户端（协同面板）消费的 peer 与任务链视图形态。 */
export type { PeerDevice } from './core/protocol.ts'
export type { TaskView } from './core/yuyi-task.ts'

/* * yuyi 接缝的稳定失败码；按这些路由，绝不按消息文案。 */
export type YuyiErrorCode =
  | 'YUYI_NOT_CONFIGURED'
  | 'YUYI_NOT_CONNECTED'
  | 'YUYI_DUPLICATE_ALIAS'
  | 'YUYI_SEND_REJECTED'
  | 'YUYI_REPLY_TIMEOUT'
  | 'YUYI_REPLY_ABORTED'

/**
  * yuyi 接缝抛出的失败，带稳定的机器可路由错误码。
  * 以 `new YuyiError(message, code[, options])` 构造。
 */
export class YuyiError extends HarnessError {}

declare module '@deepseek-ai/cordis' {
  interface Events {
    /**
      * 重算后的 yuyi 连接快照发生变化（配置已解析、
      * 握手完成或丢失、未读数移动）。监听器失败
      * 被遏制。
      * @param payload.status - 新鲜的状态快照。
     * @mode emit
     */
    'yuyi/status'(payload: { status: YuyiStatus }): void
    /**
      * 一条已投递消息在本地被路由。路由决策
      * 决策（唤醒、steer 或入箱停靠）做出后发出；持久
      * 被唤醒会话的转录事件由 agent 循环拥有。
      * 监听器失败被遏制。
      * @param payload.message - 按 hub 背书形态的已投递消息。
      * @param payload.route - 本地路由决策。
      * @param payload.sessionId - 消息命中的 roster 会话（有命中时）。
     * @mode emit
     */
    'yuyi/delivered'(payload: { message: YuyiMessage; route: YuyiDeliveryRoute; sessionId?: SessionId }): void
  }
}

/**
  * yuyi 接缝的配置。`hub`、`device` 与令牌引用
  * 先从 config，再启动环境（`YUYI_HUB`、`YUYI_DEVICE`、
  * 与 `tokenEnv` 名）之后是 yuyi 环境文件（`~/.yuyi/env`，
  * hub 安装器写的文件）；device 回落主机名。
 */
export interface YuyiConfig {
  /* * 显式 hub WebSocket URL；省略则经环境链解析。 */
  readonly hub?: string
  /* * 持有御符 agent 令牌的凭证引用名。 */
  readonly tokenEnv: string
  /* * 显式设备名；省略则经环境链或主机名解析。 */
  readonly device?: string
  /* * `sendExpectingReply` 在以 `YUYI_REPLY_TIMEOUT` 失败前等待多久。 */
  readonly replyTimeoutMs: number
}

/* * 注册进本地 roster 的一个会话；投递的可寻址单元。 */
export interface YuyiRosterEntry {
  /* * 已注册会话的 id；也是其纯字符串收件箱键。 */
  readonly sessionId: SessionId
  /* * 展示给远端 peer 的简短人类可读名。 */
  readonly title: string
  /* * 会话的工作目录，展示给远端 peer。 */
  readonly directory: string
  /* * 其他 agent 寻址本会话所用的别名；进程内唯一。 */
  readonly name?: string
}

/* * 一条已投递消息在本地被如何路由。 */
export type YuyiDeliveryRoute =
  | 'woken'
  | 'steered'
  | 'session-inbox'
  | 'device-inbox'
  | 'echo-dropped'

/* * 每次状态转移时重算的连接级事实。 */
export interface YuyiStatus {
  /* * hub 与 token 是否已解析；false 表示接缝保持休眠。 */
  readonly configured: boolean
  /* * 握手是否完成（welcome 帧已到达）。 */
  readonly connected: boolean
  /* * 已解析的 hub WebSocket URL，未解析时为空串。 */
  readonly hub: string
  /* * 本连接上报的设备名。 */
  readonly device: string
  /* * Hub 上报的 agent id（权威身份）；welcome 前缺省。 */
  readonly agentId?: string
  /* * Hub 上报的 agent 名（权威身份）；welcome 前缺省。 */
  readonly agentName?: string
  /* * Hub 上报的所有者用户名；welcome 前缺省。 */
  readonly ownerUsername?: string
  /* * Hub 上报的角色（avatar/worker/coder）；welcome 前缺省。 */
  readonly role?: string
  /* * 最近的连接错误描述（如有）。 */
  readonly lastError?: string
  /* * 最近一次心跳得到的 hub 侧未读邮件数（已知时）。 */
  readonly hubUnread?: number
  /* * 本地设备收件箱未读数（无 roster 命中的停靠消息）。 */
  readonly deviceUnread: number
  /* * 当前本地 roster，按注册顺序。 */
  readonly sessions: readonly YuyiRosterEntry[]
}

/* * 经 hub 发送一条消息的请求。 */
export interface YuyiSendRequest {
  /* * 地址：`*`、别名、会话 id、`device:target` 或 `owner/device:target`。 */
  readonly to: string
  /* * 接收方模型将读取的消息正文。 */
  readonly text: string
  /* * `notify` 唤醒接收方；`mail` 停入收件箱。 */
  readonly mode: 'notify' | 'mail'
  /* * 发送会话；注册后填充权威 `from` 字段。 */
  readonly fromSession?: SessionId
  /* * 回信线程所属的 A2A 任务 id。 */
  readonly taskId?: string
  /* * 本消息回应的消息 id。 */
  readonly replyTo?: string
  /* * 请求接收方自动回信。 */
  readonly expectReply?: boolean
  /* * 供 hub 侧策略使用的数据分级提示（如 `high-risk`）。 */
  readonly classification?: string
  /* * peer 渲染的弱投递提示；绝不用于路由。 */
  readonly contextHint?: string
}

/* * hub 为一条已发送消息确认的投递结果。 */
export interface YuyiSendResult {
  /* * 按构建并确认的消息形态，供持久任务记录。 */
  readonly message: YuyiMessage
  /* * 已发送消息的 id；重试与任务记录的幂等键。 */
  readonly messageId: string
  /* * 实时投递为 `notify`，降级入箱为 `mail_fallback`；其他 ack 缺省。 */
  readonly deliveredAs?: 'notify' | 'mail_fallback'
  /* * 接收方上报为处理者的会话 id（有上报时）。 */
  readonly handlerSessionID?: string
}

/* * 一次发送并等回复交互的结果。 */
export interface YuyiReplyResult {
  /* * 本侧发送的消息，按构建并确认的形态。 */
  readonly sent: YuyiMessage
  /* * 关联的回信，按 hub 背书的形态。 */
  readonly reply: YuyiMessage
}

/**
  * 协同面板快照（`yuyi/collab` 端点）：hub 可达的远端
  * peer 与本机全部任务链视图，一次轮询一个往返。
  * peers 尽力而为——hub 未连接或抖动时为空数组，
  * 任务链始终来自本机 `~/.yuyi/tasks/` 记录。
 */
export interface YuyiCollabSnapshot {
  /* * 每个已连接远端设备一条（含 roster 会话、role 与最近活跃）。 */
  readonly peers: readonly PeerDevice[]
  /* * 本机任务链视图，按最近活动降序；归档不入列。 */
  readonly tasks: readonly TaskView[]
  /* * 快照生成时刻（epoch ms）。 */
  readonly generatedAt: number
}
