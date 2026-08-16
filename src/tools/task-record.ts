/**
 * Task-record glue shared by `yuyi_send` and the task tools: appends
 * request/reply events into the durable `~/.yuyi/tasks/` record through the
 * vendored core, keeping file-format parity with the other Yuyi adapters.
 * @module dsh-yuyi/tools/task-record
 */

import {
  appendTaskRecord,
  readTask,
  type AppendResult,
  type TaskFrom,
  type YuyiMessage,
} from '../core.ts'

/** Identity facts of the local connection, filled from the service status. */
export interface LocalIdentity {
  readonly agentId?: string
  readonly ownerUsername?: string
  readonly device: string
}

/** Append-result summary surfaced in tool values. */
export interface TaskRecordOutcome {
  recorded: boolean
  reason?: 'cap' | 'duplicate' | 'io' | 'bad_task_id'
}

/**
 * Translate one append result for a canonical value.
 * @param result - the core append outcome.
 * @returns the canonical record outcome.
 */
export function outcomeOf(result: AppendResult): TaskRecordOutcome {
  return result.ok ? { recorded: true } : { recorded: false, ...(result.reason !== undefined ? { reason: result.reason } : {}) }
}

/**
 * Ensure the task record exists (append a `created` event on first touch) and
 * append this send as a `request` round.
 * @param taskId - the task the send belongs to.
 * @param identity - local connection identity recorded as the owner/author.
 * @param message - the outgoing message.
 * @param text - the message body.
 * @returns the request append outcome.
 */
export function recordTaskRequest(taskId: string, identity: LocalIdentity, message: YuyiMessage, text: string): TaskRecordOutcome[] {
  const results: TaskRecordOutcome[] = []
  const existing = readTask(taskId)
  if (existing.events.length === 0) {
    results.push(outcomeOf(appendTaskRecord(taskId, {
      kind: 'created',
      taskId,
      owner: {
        ...(identity.agentId !== undefined ? { agentId: identity.agentId } : {}),
        device: identity.device,
      },
    })))
  }
  const from: TaskFrom = {
    device: message.from.device,
    ...(message.from.name !== undefined ? { name: message.from.name } : {}),
    sessionID: message.from.sessionID,
    ...(identity.agentId !== undefined ? { agentId: identity.agentId } : {}),
    ...(identity.ownerUsername !== undefined ? { ownerUsername: identity.ownerUsername } : {}),
  }
  results.push(outcomeOf(appendTaskRecord(taskId, {
    kind: 'request',
    msgId: message.id,
    ...(message.replyTo !== undefined ? { replyTo: message.replyTo } : {}),
    from,
    to: message.to,
    ...(message.expectReply === true ? { expectReply: true } : {}),
    text,
  })))
  return results
}

/**
 * Append one arrived reply into the task record (idempotent by msgId).
 * @param taskId - the task the reply belongs to.
 * @param reply - the reply message as the hub endorsed it.
 * @returns the reply append outcome, or undefined when the task has no record.
 */
export function recordTaskReply(taskId: string, reply: YuyiMessage): TaskRecordOutcome | undefined {
  if (readTask(taskId).events.length === 0) return undefined
  const from: TaskFrom = {
    device: reply.from.device,
    ...(reply.from.name !== undefined ? { name: reply.from.name } : {}),
    sessionID: reply.from.sessionID,
    ...(reply.from.agentId !== undefined ? { agentId: reply.from.agentId } : {}),
    ...(reply.from.ownerUsername !== undefined ? { ownerUsername: reply.from.ownerUsername } : {}),
  }
  return outcomeOf(appendTaskRecord(taskId, {
    kind: 'reply',
    msgId: reply.id,
    ...(reply.replyTo !== undefined ? { replyTo: reply.replyTo } : {}),
    from,
    text: reply.text,
  }))
}
