import type { YuyiMessage } from "./protocol.ts";
export interface InboxEntry {
    message: YuyiMessage;
    /** 入箱时间 epoch ms */
    receivedAt: number;
}
/** 追加一封邮件到目标会话的收件箱 */
export declare function append(sessionID: string, message: YuyiMessage): void;
/**
 * 取出某会话的邮件。
 * @param peek true 时只读不清除
 */
export declare function take(sessionID: string, peek?: boolean): InboxEntry[];
/** 某会话未读邮件数 */
export declare function count(sessionID: string): number;
