/**
  * `yuyi_send` 与任务工具共享的任务记录粘合：把
  * 请求/回信事件写进持久 `~/.yuyi/tasks/` 记录，经
  * 钉住核心，与其他 Yuyi 适配器保持文件格式一致。
 * @module dsh-yuyi/tools/task-record
 */
import { type AppendResult, type YuyiMessage } from '../core.ts';
export interface LocalIdentity {
    readonly agentId?: string;
    readonly ownerUsername?: string;
    readonly device: string;
}
export interface TaskRecordOutcome {
    recorded: boolean;
    reason?: 'cap' | 'duplicate' | 'io' | 'bad_task_id';
}
/**
  * 把一个追加结果转译为规范值。
  * @param result - 核心追加结果。
  * @returns 规范的记录结果。
 */
export declare function outcomeOf(result: AppendResult): TaskRecordOutcome;
/**
  * 确保任务记录存在（首次触碰追加 `created` 事件），并
  * 把本次发送作为一轮 `request` 追加。
  * @param taskId - 发送所属的任务。
  * @param identity - 记录为所有者/作者的本地连接身份。
  * @param message - 发出的消息。
  * @param text - 消息正文。
  * @returns 请求追加结果。
 */
export declare function recordTaskRequest(taskId: string, identity: LocalIdentity, message: YuyiMessage, text: string): TaskRecordOutcome[];
/**
  * 把到达的回信追加进任务记录（按 msgId 幂等）。
  * @param taskId - 回信所属的任务。
  * @param reply - 按 hub 背书形态的回信。
  * @returns 回信追加结果；任务无记录时为 undefined。
 */
export declare function recordTaskReply(taskId: string, reply: YuyiMessage): TaskRecordOutcome | undefined;
