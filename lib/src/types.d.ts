/**
  * yuyi 能力接缝的公开类型：状态快照、roster 条目、
  * 发送请求与结果、投递路由与接缝的错误类。
 * @module dsh-yuyi/types
 */
import type { SessionId } from '@deepseek-ai/dsh-session/types';
import { HarnessError } from '@deepseek-ai/dsh-llm';
import type { PeerDevice, YuyiMessage } from './core.ts';
import type { TaskView } from './core/yuyi-task.ts';
export type { PeerDevice } from './core/protocol.ts';
export type { TaskView } from './core/yuyi-task.ts';
export type YuyiErrorCode = 'YUYI_NOT_CONFIGURED' | 'YUYI_NOT_CONNECTED' | 'YUYI_DUPLICATE_ALIAS' | 'YUYI_SEND_REJECTED' | 'YUYI_REPLY_TIMEOUT' | 'YUYI_REPLY_ABORTED';
/**
  * yuyi 接缝抛出的失败，带稳定的机器可路由错误码。
  * 以 `new YuyiError(message, code[, options])` 构造。
 */
export declare class YuyiError extends HarnessError {
}
declare module '@deepseek-ai/cordis' {
    interface Events {
        /**
          * 重算后的 yuyi 连接快照发生变化（配置已解析、
          * 握手完成或丢失、未读数移动）。监听器失败
          * 被遏制。
          * @param payload.status - 新鲜的状态快照。
         * @mode emit
         */
        'yuyi/status'(payload: {
            status: YuyiStatus;
        }): void;
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
        'yuyi/delivered'(payload: {
            message: YuyiMessage;
            route: YuyiDeliveryRoute;
            sessionId?: SessionId;
        }): void;
    }
}
/**
  * yuyi 接缝的配置。`hub`、`device` 与令牌引用
  * 先从 config，再启动环境（`YUYI_HUB`、`YUYI_DEVICE`、
  * 与 `tokenEnv` 名）之后是 yuyi 环境文件（`~/.yuyi/env`，
  * hub 安装器写的文件）；device 回落主机名。
 */
export interface YuyiConfig {
    readonly hub?: string;
    readonly tokenEnv: string;
    readonly device?: string;
    readonly replyTimeoutMs: number;
}
export interface YuyiRosterEntry {
    readonly sessionId: SessionId;
    readonly title: string;
    readonly directory: string;
    readonly name?: string;
}
export type YuyiDeliveryRoute = 'woken' | 'steered' | 'session-inbox' | 'device-inbox' | 'echo-dropped';
export interface YuyiStatus {
    readonly configured: boolean;
    readonly connected: boolean;
    readonly hub: string;
    readonly device: string;
    readonly agentId?: string;
    readonly agentName?: string;
    readonly ownerUsername?: string;
    readonly role?: string;
    readonly lastError?: string;
    readonly hubUnread?: number;
    readonly deviceUnread: number;
    readonly sessions: readonly YuyiRosterEntry[];
}
export interface YuyiSendRequest {
    readonly to: string;
    readonly text: string;
    readonly mode: 'notify' | 'mail';
    readonly fromSession?: SessionId;
    readonly taskId?: string;
    readonly replyTo?: string;
    readonly expectReply?: boolean;
    readonly classification?: string;
    readonly contextHint?: string;
}
export interface YuyiSendResult {
    readonly message: YuyiMessage;
    readonly messageId: string;
    readonly deliveredAs?: 'notify' | 'mail_fallback';
    readonly handlerSessionID?: string;
}
export interface YuyiReplyResult {
    readonly sent: YuyiMessage;
    readonly reply: YuyiMessage;
}
/**
  * 协同面板快照（`yuyi/collab` 端点）：hub 可达的远端
  * peer 与本机全部任务链视图，一次轮询一个往返。
  * peers 尽力而为——hub 未连接或抖动时为空数组，
  * 任务链始终来自本机 `~/.yuyi/tasks/` 记录。
 */
export interface YuyiCollabSnapshot {
    readonly peers: readonly PeerDevice[];
    readonly tasks: readonly TaskView[];
    readonly generatedAt: number;
}
