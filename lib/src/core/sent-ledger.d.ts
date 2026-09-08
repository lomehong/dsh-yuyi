/** 记一条出站消息的发件窗口。失败静默——账本缺失只损失回信锚定精度。 */
export declare function rememberSentMessage(msgId: string, sessionID: string): void;
/** 反查某条出站消息的发件窗口；无记录返回 undefined。 */
export declare function lookupSentSession(msgId: string): string | undefined;
