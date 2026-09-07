import type { TaskDataFrame } from "./protocol.ts";
/** 单文件行数上限（§4.6）：正文类事件（request/reply）超限拒绝追加 */
export declare const TASK_FILE_LINE_CAP: number;
/** 目录任务数上限（§4.6）：新建任务文件超限时提示归档 */
export declare const TASK_DIR_FILE_CAP: number;
/** 滚动压缩保留的最近轮次原文数（§4.6 P2：旧轮次压成一条 summary，最近 N 轮保留原文与产物引用） */
export declare const TASK_COMPACT_KEEP_ROUNDS: number;
/** 水合快照单轮文本截断长度（§4.5，P0 不做 LLM 摘要） */
export declare const TASK_SNAPSHOT_TEXT_CAP = 200;
/** 任务文件名白名单：taskId 只允许 [A-Za-z0-9_-]（防路径穿越，§4.3）。依赖声明的上游 id 同此约束。 */
export declare const TASK_ID_RE: RegExp;
/** 模块级计数（可观测性/测试）：坏行、正文超限、reply 幂等跳过、目录上限提示 */
export declare const taskRecordCounters: {
    corruptLines: number;
    bodyAppendCapHit: number;
    replyDuplicateSkipped: number;
    dirCapHint: number;
    compactRuns: number;
    compactRemovedEvents: number;
    closeCount: number;
    /** 验收项通过/失败计数（Phase 1 方向 B 协作效能指标） */
    verifyPassed: number;
    verifyFailed: number;
    /** 成功追加的 reply 事件数（约等于轮次；幂等跳过不计） */
    replyCount: number;
};
export interface TaskOwner {
    agentId?: string;
    name?: string;
    device?: string;
    sessionID?: string;
}
export interface TaskFrom {
    device?: string;
    name?: string;
    sessionID?: string;
    agentId?: string;
    ownerUsername?: string;
}
export type TaskEvent = {
    seq: number;
    at: number;
    kind: "created";
    taskId: string;
    owner: TaskOwner;
} | {
    seq: number;
    at: number;
    kind: "request";
    msgId: string;
    replyTo?: string;
    from: TaskFrom;
    to: {
        device?: string;
        target: string;
    };
    expectReply?: boolean;
    text: string;
} | {
    seq: number;
    at: number;
    kind: "reply";
    msgId: string;
    replyTo?: string;
    from: TaskFrom;
    text: string;
} | {
    seq: number;
    at: number;
    kind: "attach";
    sessionID: string;
    device?: string;
    name?: string;
    note?: string;
} | {
    seq: number;
    at: number;
    kind: "summary";
    by: string;
    text: string;
} | {
    seq: number;
    at: number;
    kind: "artifact";
    ref: string;
    note?: string;
} | {
    seq: number;
    at: number;
    kind: "note";
    text: string;
} | {
    seq: number;
    at: number;
    kind: "close";
    by: string;
    note?: string;
} | {
    seq: number;
    at: number;
    kind: "goal";
    description: string;
    criteria: string[];
} | {
    seq: number;
    at: number;
    kind: "verify";
    criterionIndex: number;
    passed: boolean;
    evidence: string;
    verifier: string;
} | {
    seq: number;
    at: number;
    kind: "phase";
    name: string;
    note?: string;
} | {
    seq: number;
    at: number;
    kind: "assign";
    assignee: string;
    phase?: string;
    note?: string;
} | {
    seq: number;
    at: number;
    kind: "depends";
    on: string;
    note?: string;
};
export interface TaskReadResult {
    events: TaskEvent[];
    /** 逐行解析跳过的坏行数（§4.2 并发容忍） */
    corruptLines: number;
    /** 记录位于归档目录（archive/）时为 true（P3 生命周期：归档后仍可读） */
    archived?: boolean;
}
export interface AppendResult {
    ok: boolean;
    /** 拒绝原因：cap=正文类事件超行数上限；duplicate=reply msgId 幂等命中；io=写盘失败；bad_task_id=非法 taskId */
    reason?: "cap" | "duplicate" | "io" | "bad_task_id";
    /** 提示：新建任务文件时目录任务数已达上限（§4.6 提示归档，不拒绝） */
    note?: "dir_cap";
}
/** 任务记录文件绝对路径；taskId 非法抛错 */
export declare function taskFilePath(taskId: string): string;
/**
 * 读全量事件：逐行解析，坏行跳过并计数（§4.2——并发写入的交错片段不能被一条坏行
 * 堵死整份记录）；按 (at, seq) 排序并容忍重复 seq。
 */
export declare function readTask(taskId: string): TaskReadResult;
/** 分布式 Omit：保持 TaskEvent 联合成员各自的字段（Omit 直接作用于联合会塌缩成公共键） */
type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;
/** 追加事件入参：任一 TaskEvent 成员去除 seq/at 后（at 可选覆盖） */
export type TaskRecordInput = DistributiveOmit<TaskEvent, "seq" | "at"> & {
    at?: number;
};
/** 追加一条事件（一次写调用一行）。正文类事件受 §4.6 行数上限约束；reply 按 msgId 幂等。 */
export declare function appendTaskRecord(taskId: string, event: TaskRecordInput): AppendResult;
/** 归档一条任务记录（P3 生命周期）：从活跃目录移入 ~/.yuyi/tasks/archive/。幂等：已在归档目录视为成功。 */
export interface ArchiveResult {
    ok: boolean;
    reason?: "bad_task_id" | "io" | "not_found";
    archivedPath?: string;
    alreadyArchived?: boolean;
}
export declare function archiveTask(taskId: string): ArchiveResult;
/** 关闭任务（P3 生命周期）：写 close 事件（控制类事件，不受 §4.6 行数上限拒绝）。幂等：重复 close 仅追加一条。 */
export declare function closeTask(taskId: string, by: string, note?: string): AppendResult;
/** 滚动压缩结果 */
export interface CompactResult {
    ok: boolean;
    reason?: "bad_task_id" | "io" | "not_found" | "nothing_to_compact";
    /** 被压缩掉的正文事件（request/reply）条数 */
    removedEvents: number;
    /** 压缩后保留的轮次数（最近 keepRounds） */
    keptRounds: number;
}
/**
 * 滚动压缩（§4.6 P2 可选）：任务记录达行数上限后，把旧轮次压缩为一条 summary、
 * 保留最近 keepRounds 轮原文与全部控制类事件（created/attach/artifact/summary/note/close），
 * 正文详情在 summary 中标记已归档。重写采用 tmp+rename 原子写——这是显式运维操作，
 * 不与并发追加竞争（§4.2 的并发容忍针对 append 路径）。
 */
export declare function compactTask(taskId: string, opts?: {
    keepRounds?: number;
}): CompactResult;
/**
 * P3 §9-2：show 时补 Hub 侧索引（本机记录缺失/不完整时调用）。失败（非参与者被拒/网络
 * 异常）静默降级为无索引——task/fetch 的鉴权边界是「无记录与无权统一回空/抛错」，端侧
 * 一律按「没有索引」处理，不把鉴权失败误报为任务存在。Hub 未启用 task 能力时同样返回空。
 */
export declare function fetchHubTaskIndex(hub: {
    taskFetch(taskId: string): Promise<TaskDataFrame["task"] | undefined>;
} | null | undefined, taskId: string): Promise<TaskDataFrame["task"] | undefined>;
/**
 * 渲染 Hub task/fetch 索引为展示文本（P3 §9-2：本机记录不完整/缺失时的跨设备协作可见性）。
 * 纯渲染，不含正文；返回空串表示无索引数据。
 */
export declare function formatHubTaskIndex(task: TaskDataFrame["task"]): string;
/** 最近一次 attach 事件（活动锚点依据，§6.2）；无 attach 返回 undefined。从文件尾部反向扫描。 */
export declare function latestAttach(taskId: string): {
    sessionID: string;
} | undefined;
export interface TaskView {
    taskId: string;
    createdAt: number;
    owner?: TaskOwner;
    /** 已回复轮次（msgId 去重后的 reply 事件数） */
    round: number;
    lastRequestText: string;
    lastRequestAt?: number;
    lastReplyMsgId?: string;
    lastReplyFrom?: TaskFrom;
    /** 未决请求（最后一条 request 无对应 reply）的目标 */
    pendingTarget?: string;
    artifacts: Array<{
        ref: string;
        note?: string;
    }>;
    summaries: Array<{
        by: string;
        text: string;
    }>;
    latestAttachSession?: string;
    /** 是否已写 close 事件（P3 生命周期：已关闭任务不再视为未决） */
    closed?: boolean;
    archived?: boolean;
    /** 验收目标（Phase 1 方向 A）：goal 事件定义的验收标准 */
    goal?: {
        description: string;
        criteria: string[];
    };
    /** 验收进度：每条标准是否有对应 verify 事件且 passed=true */
    verification?: Array<{
        criterionIndex: number;
        passed: boolean;
        evidence?: string;
        verifier?: string;
    }>;
    /** 验收是否全部通过（goal 存在且所有 criteria 均有 passed=true 的 verify）——自动判定，非手工标注 */
    acceptanceComplete: boolean;
    /** 当前阶段（Phase 3 phase/assign：协调者本地写入的阶段标记） */
    phase?: {
        name: string;
        note?: string;
    };
    /** 当前归属（最近 assign 事件） */
    assignee?: {
        target: string;
        phase?: string;
        note?: string;
    };
    /** 上游依赖（depends 事件，按 on 去重取最近一条 note；不含自引用） */
    dependsOn: Array<{
        taskId: string;
        note?: string;
    }>;
    /** 本机记录是否不完整（有事件但无 created/request 轮次，跨设备视图） */
    incomplete: boolean;
}
/**
 * 结构化任务视图：供 pending 水合与 yuyi_task_continue 取最近 replyTo。
 * 无 created 且无 request（仅 attach/note 等）时仍返回视图（incomplete=true）；
 * 完全无事件（文件不存在/全坏行）返回 undefined。
 */
export declare function taskView(taskId: string): TaskView | undefined;
export interface TaskSnapshotOptions {
    maxRounds?: number;
}
/**
 * 列出本机全部任务链视图（协同面板数据源）：活跃目录逐个 taskView，
 * 归档不入列（yuyi_task_show 仍可按 id 读历史）；按最近活动降序——
 * 排序键取最后一条 request 时间，无 request 时回退创建时间。
 */
export declare function listTaskViews(): TaskView[];
/**
 * 组装投递弱提示（Phase 2 方向 C.2）：taskId + 状态摘要（轮次/验收进度/最近回复摘要）。
 * contextHint 语义：接收方仅渲染，不参与寻址、不携带执行（协议不变，内容增强）。
 */
export declare function taskHint(taskId: string, maxSummary?: number): string | undefined;
/**
 * 组装水合文本（§4.5）：任务状态 + 最近轮次 + 产物引用 + 未决请求 + 验收进度 + 阻塞项。
 * 文件不存在返回 undefined。注入前调用方必须保留「外部消息框定」。
 */
export declare function taskSnapshot(taskId: string, opts?: TaskSnapshotOptions): string | undefined;
export {};
