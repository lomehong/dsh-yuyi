/**
  * 五个消息工具（`yuyi_status`、`yuyi_register`、`yuyi_peers`、
  * `yuyi_send`、`yuyi_inbox`），构建在 `ctx.yuyi` 上。规范值是
  * 结构化事实；`output.render` 承载模型侧文案。
 * @module dsh-yuyi/tools/messaging
 */
import type { Context } from '@deepseek-ai/cordis';
import type { PeerDevice } from '../service.ts';
import { type TaskRecordOutcome } from './task-record.ts';
export interface StatusSessionRow {
    sessionId: string;
    title: string;
    name?: string;
}
export interface StatusValue {
    configured: boolean;
    connected: boolean;
    hub: string;
    device: string;
    agentName?: string;
    ownerUsername?: string;
    role?: string;
    lastError?: string;
    deviceUnread: number;
    sessions: StatusSessionRow[];
}
export interface PeersValue {
    devices: PeerDevice[];
}
export interface InboxRow {
    id: string;
    from: string;
    to: string;
    mode: string;
    text: string;
    receivedAt: number;
}
export interface InboxValue {
    target: 'session' | 'device' | 'hub';
    entries: InboxRow[];
}
export interface SendValue {
    messageId: string;
    deliveredAs?: 'notify' | 'mail_fallback';
    handlerSessionID?: string;
    replyText?: string;
    replyFrom?: string;
    taskRecords?: TaskRecordOutcome[];
}
/**
  * 把状态快照渲染为紧凑散文。
  * @param value - 状态快照。
  * @returns 渲染出的文本。
 */
export declare function renderStatus(value: StatusValue): string;
/**
  * 渲染一份 peer 列表。
  * @param value - 设备与会话。
  * @returns 渲染出的文本。
 */
export declare function renderPeers(value: PeersValue): string;
/**
  * 渲染一次收件箱读取。
  * @param value - 收件箱目标与条目。
  * @returns 渲染出的文本。
 */
export declare function renderInbox(value: InboxValue): string;
/**
  * 在调用上下文的工具注册表上注册五个消息工具。
  * @param ctx - 插件上下文（工具注册表与 yuyi 服务在场）。
 */
export declare function applyMessagingTools(ctx: Context): void;
