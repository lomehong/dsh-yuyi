export { REPLY_RATE_PER_SESSION_PER_MIN, REPLY_RATE_INSTANCE_PER_MIN, REPLY_MAX_ROUNDS_PER_TASK, REPLY_QUEUE_TIMEOUT_NOTIFY_MS, REPLY_RATE_RETRY_MS, REPLY_PENDING_TIMEOUT_MS, REPLY_GRACE_MS, REPLY_RETENTION_MS, } from "./reply-loop.ts";
/** 共享限流状态机。每个适配器持有一个实例。单进程单线程（Bun），无需锁。 */
export declare class ReplyGovernor {
    private sessionInjectTimes;
    private instanceInjectTimes;
    private ratePerSession;
    private rateInstance;
    constructor(opts?: {
        ratePerSession?: number;
        rateInstance?: number;
    });
    /** 双层注入限流判定（每会话/分钟 + 实例级全局预算）。纯判定不记录。 */
    rateLimitOk(sessionID: string): boolean;
    /** 记录一次实际注入（rateLimitOk 通过且注入真正开始后调用） */
    recordInject(sessionID: string): void;
}
