import type { YuyiMessage } from "./protocol.ts";
export declare const REPLY_GRACE_MS = 3000;
export declare const REPLY_QUEUE_TIMEOUT_NOTIFY_MS: number;
export declare const REPLY_PENDING_TIMEOUT_MS: number;
export declare const REPLY_RATE_PER_SESSION_PER_MIN = 10;
export declare const REPLY_RATE_INSTANCE_PER_MIN = 30;
export declare const REPLY_MAX_ROUNDS_PER_TASK = 10;
export declare const REPLY_RETENTION_MS: number;
export declare const REPLY_RATE_RETRY_MS = 60000;
export interface ReplyLoopOptions {
    autoRespond: boolean;
    taskFile?: string;
    /** inTurn 超时兜底（ms）：宿主 idle 缺失/延迟时强制释放，防唤醒永久失效。
     *  缺省 YUYI_REPLY_TURN_TIMEOUT_MS 或 10min；测试注入短值验证 */
    turnTimeoutMs?: number;
    /** inTurn 超时触发回调（可观测性）：适配器接上 trace/日志，运维可查「哪些设备曾卡死」 */
    onTurnTimeout?: (sessionID: string, msgId: string) => void;
    /** ctx.msgId = 被注入的原消息 id（供适配器上报生命周期事件） */
    inject(text: string, sessionID: string, ctx?: {
        msgId?: string;
    }): Promise<void>;
    sendReply(reply: YuyiMessage): Promise<boolean>;
    notify(sessionID: string, text: string): Promise<boolean>;
    log(msg: string): void;
}
export declare class ReplyLoop {
    private autoRespond;
    private taskFile;
    private turnTimeoutMs;
    private onTurnTimeout?;
    private inject;
    private sendReply;
    private notify;
    private log;
    private turnQueues;
    private inTurn;
    private resolvedSet;
    /** resolved 时间戳（7 天留存裁剪依据；与 resolvedSet 同步维护） */
    private resolvedAt;
    private taskRoundCounts;
    private pendingRequests;
    private shownReplies;
    private localDeliveredIds;
    /** 共享治理策略（限流/轮数判定，与 ACP-bridge 同源） */
    private governor;
    private timers;
    /** 活动锚点缓存（taskId → 文件 mtime + 锚点会话）：任务记录 append-only，文件未变则复用，避免每 60s 全量读（§6.2） */
    private anchorCache;
    /** 任务已关闭判定缓存（stale-state 修复：close 事件后不再播报） */
    private closedCache;
    /** 上次运行中 TTL 清理时刻（不只启动时清理） */
    private lastStaleScan;
    /** 锚点通知投递失败累计计数（评审运维项：区分「无 attach」与「attach 但投递失败」） */
    private notifyDropped;
    constructor(opts: ReplyLoopOptions);
    /** 锚点通知投递失败累计计数 */
    get droppedNotifyCount(): number;
    /** 收到 expectReply 消息（Hub deliver 或同机投递或 mail 拉箱）→ 入 FIFO */
    enqueue(msg: YuyiMessage, sessionID: string, fromLocal: boolean, senderSessionID: string): void;
    /**
     * 宿主 turn 事件：updated（收集文本）/ idle（触发收尾计时）/ error（失败回信）。
     *
     * 收尾语义（v0.8 §5.1-3 修订）：
     *  - updated 出现（模型产出文本）→ 追加收集（按 message id 去重），并取消收尾计时（续收）
     *  - idle 出现 → 启动 3s 宽限计时；宽限内任何 busy/retry（工具执行）或 updated 都取消计时
     *  - 只有「idle 且宽限内无任何活动」才真正收尾——修复工具间隙 idle 误收尾
     */
    onTurnEvent(type: "updated" | "idle" | "error", sessionID: string, info: unknown): void;
    /**
     * 会话状态事件（opencode session.status / omp busy-idle）：
     * busy / retry = turn 仍在执行（如工具调用）→ 取消收尾计时续收；
     * idle 经 onTurnEvent("idle") 处理。修复「工具间隙 idle 误收尾」。
     */
    onTurnStatus(status: "busy" | "retry", sessionID: string): void;
    /** 手工回信抑制：turn 内 agent 主动回复同 replyTo → 抑制收尾自动回信。
     *  短延迟释放 inTurn（2026-08-14 修复）：opencode 某些版本/模式下 session.idle
     *  不触发，finalizeTurn 永不执行 → inTurn 挂到 watchdog，期间该会话后续消息被
     *  pumpQueue 的 inTurn.has 挡住（实测 xiao-xin 第二条消息延迟 55s）。
     *  Agent 已明确回复该 replyTo，turn 使命完成——REPLY_GRACE_MS 后释放并泵下一条
     *  （短延迟让 yuyi_send 发送完成；busy/retry 会经 onTurnStatus 取消续收）。
     *  匹配键修正（2026-08-14）：Agent 回信 replyTo = 原消息 id = inTurn.msgId。
     *  旧实现 state.replyTo === replyTo 只在「原消息本身是回信」时命中，对新请求
     *  （inTurn.replyTo=undefined）永远不匹配 → inTurn 不释放（实测 60s watchdog）。 */
    markManualReply(sessionID: string, replyTo: string): void;
    /**
     * 标记 turn 内 agent 已通过 yuyi_send 发出消息。
     *
     * 语义（codex 评审修正）：设置 manualSent=true，但 finalizeTurn 的抑制逻辑
     * 精确区分——manualSent 时只抑制**空回信**（collector 无实质输出），不抑制
     * **有实质输出的回信**（collector 有文本 = agent 产生了回复内容应回传）。
     *
     * 这解决了两个矛盾场景：
     * - 问题记录 #1.1：turn 内发了无关消息 → 不应吞掉 expectReply 回信 → 有实质输出时仍回信
     * - codex 反馈：turn 内已主动回复 → 不应再补发脏回信 → 无实质输出时抑制
     */
    markTurnSent(sessionID: string): void;
    /**
     * codex 评审修正：不生成随机 taskId（会被 TASK_ID_MISMATCH 拒投），
     * 而是从 ReplyLoop 的 inTurn 状态取真实 taskId。
     */
    getInTurnTaskId(sessionID: string): string | undefined;
    /**
     * 当前 turn 的回复目标（turn 内 agent 用 yuyi_send 回信时自动关联用）：
     * 返回正在响应的原消息 msgId + taskId，无活跃 turn 返回 undefined。
     * 系统性改进（2026-08-14）：Agent 用 yuyi_send 工具回信若不传 replyTo，
     * 发起方 pending 永不 resolve（御驿无限「仍在执行中」提醒）；此处让工具
     * 自动补 replyTo=原消息 id，request-response 闭环完整。
     */
    getInTurnReplyTarget(sessionID: string): {
        msgId: string;
        taskId?: string;
    } | undefined;
    /** A 侧 pending 登记（ack 成功后调用）。opts 携带发起方收件人/设备，写入任务记录 created 事件（任务记忆层 §4.4） */
    registerPending(taskId: string, sessionID: string, summary: string, opts?: {
        name?: string;
        agentId?: string;
        device?: string;
    }): void;
    /**
     * 从任务记录水合 pending 投影（任务记忆层 §6.2，评审发现 1 定案）：
     * pending 是任务记录的物化视图，跨会话没有共享 pending——attach 不是「更新现有
     * pending」，而是「重建投影」。记录不存在 → 明确失败，不静默。
     */
    hydratePending(taskId: string, sessionID: string, opts?: {
        device?: string;
        name?: string;
        note?: string;
    }): {
        ok: boolean;
        detail?: string;
    };
    /**
     * 续接新一轮（yuyi_task_continue 用，任务记忆层 §6.1）：attach 水合后的投影保留
     * 轮次/收件人，仅重置计时与摘要——新一轮的 45 分钟超时/心跳窗口从本轮请求发出
     * 起算，而不是任务创建时刻（hydratePending 的 at=created.at 只适用于「attach 等
     * 回信」场景）。无投影时退化为 registerPending（首轮/跨进程兜底）。
     */
    continuePending(taskId: string, sessionID: string, summary: string, opts?: {
        name?: string;
        agentId?: string;
        device?: string;
    }): void;
    /** 回信到达感知：replyTo 命中 pending → 返回注入文本（null = 未命中） */
    handleReplyArrival(msg: YuyiMessage): string | null;
    /** 标记已回信：记录时间戳供 7 天留存裁剪（对齐 pending/mail 留存） */
    private markResolved;
    /**
     * 关闭任务时清除 pending：从内存与持久化同时移除，心跳/超时扫描立即停止。
     * 与 yuyi_task_close 配合——任务已关闭就不该再有「仍在执行/超时」提示。
     */
    clearPending(taskId: string): void;
    /**
     * 清理超时且未回复的 pending（批量）：移除所有 at 超过 maxAge 且 repliedAt 未设置的 pending。
     * 用于启动时清理历史遗留（如 P0 修复前的回信断裂遗留），避免每次重启重复发超时通知。
     * 返回被清理的 taskId 列表。
     */
    clearStalePending(maxAgeMs?: number): string[];
    /** 本机会话消息是否被 resolved（防重处理） */
    isResolved(msgId: string, from: string): boolean;
    /**
     * 关停清理：清扫描 timer（60s pending 超时扫描）。任何持有 ReplyLoop 的宿主
     * （opencode/omp/ACP-bridge/测试）在退出路径都必须调用，否则 setInterval 泄漏、
     * 进程不退出。FIFO 转 mail 由 drainOnShutdown 单独负责。
     */
    dispose(): void;
    /** 关停：FIFO 未处理 expectReply 转自投 mail（best-effort）；先清 timer 再转 mail */
    drainOnShutdown(convertToMail: (msg: YuyiMessage) => Promise<void>): void;
    private pumpQueue;
    /** 生成 taskId（与 newID("task") 同规则）；回信/失败回信对无 taskId 原消息兜底 */
    private newTaskId;
    private finalizeTurn;
    private deliverReply;
    private sendFailureReply;
    private shiftAndPump;
    private rateLimitOk;
    private recordInject;
    private scanPendingTimeout;
    /**
     * 活动锚点判定（任务记忆层 §6.2）：任务记录最近 attach 会话即锚点（缺省 = 发起会话）；
     * 本投影锚点 = attachSession ?? sessionID。判定结果按文件 mtime 缓存——append-only
     * 记录只在写入时变化，稳态下每次扫描零内容读取。
     */
    private isActiveAnchor;
    /**
     * 任务记录是否已 close（stale-state 修复 2026-08-14）：close 事件后该任务不该再有
     * 「仍在执行/超时」播报。跨设备：close 是端侧本地事件，本机记录有 close 即跳过。
     * 按文件 mtime 缓存（与 isActiveAnchor 同模式，稳态零内容读取）。
     */
    private isTaskClosed;
    /** 锚点通知：投递失败（notify 返回 false / 抛错）计数并记日志（评审运维项） */
    private notifySafely;
    private resolvedKey;
    private endorsement;
    private loadState;
    private persistState;
}
/** 便捷：把消息格式化为注入文本（Y-4 背书 + 外部消息框定） */
export declare function formatExternalMessage(msg: YuyiMessage, extraNote?: string, signatureVerification?: {
    valid: boolean;
    agentId?: string;
    reason?: string;
}): string;
