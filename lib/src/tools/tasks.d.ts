/**
  * 十三个任务记忆工具（`yuyi_task_*`），构建在钉住核心的
  * 持久 `~/.yuyi/tasks/` 记录，`yuyi_task_continue` 经
  * yuyi 服务做阻塞式等回复。
 * @module dsh-yuyi/tools/tasks
 */
import type { Context } from '@deepseek-ai/cordis';
import { type TaskRecordOutcome } from './task-record.ts';
export interface TaskEventValue {
    taskId: string;
    event: string;
    records: TaskRecordOutcome[];
}
export interface TaskShowValue {
    taskId: string;
    round: number;
    incomplete: boolean;
    closed: boolean;
    archived?: boolean;
    pendingTarget?: string;
    lastRequestText: string;
    acceptanceComplete: boolean;
    artifacts: Array<{
        ref: string;
        note?: string;
    }>;
    summaries: Array<{
        by: string;
        text: string;
    }>;
    goal?: {
        description: string;
        criteria: string[];
    };
    verification?: Array<{
        criterionIndex: number;
        passed: boolean;
        evidence?: string;
        verifier?: string;
    }>;
    phase?: {
        name: string;
        note?: string;
    };
    assignee?: {
        target: string;
        phase?: string;
        note?: string;
    };
    dependsOn: Array<{
        taskId: string;
        note?: string;
    }>;
    snapshot: string;
    hubIndex?: string;
}
export interface TaskContinueValue {
    taskId: string;
    to: string;
    messageId: string;
    replyText?: string;
    replyFrom?: string;
    records: TaskRecordOutcome[];
}
/**
  * 在调用上下文的工具注册表上注册十三个任务工具。
  * @param ctx - 插件上下文（工具注册表与 yuyi 服务在场）。
 */
export declare function applyTaskTools(ctx: Context): void;
