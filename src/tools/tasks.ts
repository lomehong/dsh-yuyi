/**
 * The twelve task-memory tools (`yuyi_task_*`) over the vendored core's
 * durable `~/.yuyi/tasks/` records, with `yuyi_task_continue` routing through
 * the yuyi service for a blocking expect-reply round.
 * @module dsh-yuyi/tools/tasks
 */

import type { Context } from '@deepseek-ai/cordis'
import type { Agent } from '@deepseek-ai/dsh-agent'
import { defineTool } from '@deepseek-ai/dsh-tools'
import type YuyiRuntime from '../service.ts'
import {
  appendTaskRecord,
  archiveTask,
  closeTask,
  compactTask,
  taskSnapshot,
  taskView,
  type TaskRecordInput,
} from '../core.ts'
import { outcomeOf, recordTaskReply, recordTaskRequest, type LocalIdentity, type TaskRecordOutcome } from './task-record.ts'

/** Canonical value shared by the task-event tools. */
export interface TaskEventValue {
  taskId: string
  event: string
  records: TaskRecordOutcome[]
}

/** Canonical value of `yuyi_task_show`: the bounded projection a caller programs against. */
export interface TaskShowValue {
  taskId: string
  round: number
  incomplete: boolean
  closed: boolean
  archived?: boolean
  pendingTarget?: string
  lastRequestText: string
  acceptanceComplete: boolean
  artifacts: Array<{ ref: string; note?: string }>
  summaries: Array<{ by: string; text: string }>
  goal?: { description: string; criteria: string[] }
  verification?: Array<{ criterionIndex: number; passed: boolean; evidence?: string; verifier?: string }>
  phase?: { name: string; note?: string }
  assignee?: { target: string; phase?: string; note?: string }
  snapshot: string
  hubIndex?: string
}

/** Canonical value of `yuyi_task_continue`. */
export interface TaskContinueValue {
  taskId: string
  to: string
  messageId: string
  replyText?: string
  replyFrom?: string
  records: TaskRecordOutcome[]
}

/** The object value schema every task-event tool shares. */
const EVENT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    taskId: { type: 'string', required: true },
    event: { type: 'string', required: true },
    records: {
      type: 'array',
      required: true,
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          recorded: { type: 'boolean', required: true },
          reason: { type: 'string' },
        },
      },
    },
  },
} as const

/** Resolve the calling agent, failing with the contract the tools promise. */
function agentOf(agent: Agent | undefined): Agent {
  if (agent === undefined) {
    throw new Error('yuyi_task_attach/continue require a session-scoped agent; call them from a live session')
  }
  return agent
}

/** The local identity task records carry, from the service status. */
function identityOf(yuyi: YuyiRuntime): LocalIdentity {
  const status = yuyi.status()
  return {
    device: status.device,
    ...(status.agentId !== undefined ? { agentId: status.agentId } : {}),
    ...(status.ownerUsername !== undefined ? { ownerUsername: status.ownerUsername } : {}),
  }
}

/** The author label summary/close/verify events carry. */
function authorOf(yuyi: YuyiRuntime, agent: Agent | undefined): string {
  const alias = agent !== undefined ? yuyi.aliasOf(agent.id) : undefined
  return alias ?? yuyi.status().agentName ?? 'dsh'
}

/** The attach event for the calling session. */
function attachEvent(yuyi: YuyiRuntime, agent: Agent, note?: string): TaskRecordInput {
  const alias = yuyi.aliasOf(agent.id)
  return {
    kind: 'attach',
    sessionID: agent.id,
    device: yuyi.status().device,
    ...(alias !== undefined ? { name: alias } : {}),
    ...(note !== undefined ? { note } : {}),
  }
}

/** The address a continued round targets: explicit, the pending request's target, or the last replier. */
function continueTarget(view: ReturnType<typeof taskView>, explicit: string | undefined): string {
  if (explicit !== undefined && explicit.length > 0) return explicit
  if (view === undefined) throw new Error('yuyi_task_continue: the task has no local record; send yuyi_send with task_id first')
  if (view.pendingTarget !== undefined) return view.pendingTarget
  const from = view.lastReplyFrom
  if (from !== undefined) {
    const identity = from.name ?? from.sessionID ?? 'unknown'
    return from.device !== undefined && from.device.length > 0 ? `${from.device}:${identity}` : identity
  }
  throw new Error('yuyi_task_continue: no pending target and no earlier replier to address; pass "to" explicitly')
}

/** Register one single-task-id lifecycle tool whose core call returns an ok/reason result. */
function registerResultTool(ctx: Context, options: {
  name: string
  description: string
  event: string
  run: (taskId: string) => { ok: boolean; reason?: string }
}): void {
  ctx.tools.register(defineTool({
    name: options.name,
    description: options.description,
    parameters: {
      task_id: { type: 'string', required: true, description: 'The task id.' },
    },
    output: {
      schema: EVENT_SCHEMA,
      render: (_args, value: TaskEventValue) => [{ type: 'text', text: renderEvent(value) }],
    },
    async execute(args) {
      const result = options.run(args.task_id)
      return {
        taskId: args.task_id,
        event: options.event,
        records: [{ recorded: result.ok, ...(result.reason !== undefined ? { reason: result.reason } : {}) }],
      }
    },
  }))
}

/** Render one task-event tool outcome. */
function renderEvent(value: TaskEventValue): string {
  const failed = value.records.filter(record => !record.recorded)
  const suffix = failed.length > 0 ? ` (record rejected: ${failed.map(record => record.reason ?? 'unknown').join(', ')})` : ''
  return `${value.event} recorded for task ${value.taskId}${suffix}`
}

/**
 * Register the twelve task tools on the calling context's tool registry.
 * @param ctx - the plugin context (tool registry and yuyi service present).
 */
export function applyTaskTools(ctx: Context): void {
  const yuyi: YuyiRuntime = ctx.yuyi

  ctx.tools.register(defineTool({
    name: 'yuyi_task_attach',
    description: 'Attach this session to a durable yuyi task: the pending projection rehydrates here '
      + 'and later replies for the task reach this session.',
    parameters: {
      task_id: { type: 'string', required: true, description: 'The task id from yuyi_send or a peer.' },
      note: { type: 'string', description: 'Why this session attaches.' },
    },
    output: {
      schema: EVENT_SCHEMA,
      render: (_args, value: TaskEventValue) => [{ type: 'text', text: renderEvent(value) }],
    },
    async execute(args, exec) {
      const agent = agentOf(exec.agent)
      return {
        taskId: args.task_id,
        event: 'attach',
        records: [outcomeOf(appendTaskRecord(args.task_id, attachEvent(yuyi, agent, args.note)))],
      }
    },
  }))

  ctx.tools.register(defineTool({
    name: 'yuyi_task_show',
    description: 'Show a durable yuyi task record: rounds, pending request, artifacts, summaries, '
      + 'acceptance goal and verification progress, phase and assignee. Falls back to the hub\'s '
      + 'participation index when the local record is incomplete.',
    parameters: {
      task_id: { type: 'string', required: true, description: 'The task id to show.' },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          taskId: { type: 'string', required: true },
          round: { type: 'integer', required: true },
          incomplete: { type: 'boolean', required: true },
          closed: { type: 'boolean', required: true },
          archived: { type: 'boolean' },
          pendingTarget: { type: 'string' },
          lastRequestText: { type: 'string', required: true },
          acceptanceComplete: { type: 'boolean', required: true },
          artifacts: {
            type: 'array',
            required: true,
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                ref: { type: 'string', required: true },
                note: { type: 'string' },
              },
            },
          },
          summaries: {
            type: 'array',
            required: true,
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                by: { type: 'string', required: true },
                text: { type: 'string', required: true },
              },
            },
          },
          goal: {
            type: 'object',
            additionalProperties: false,
            properties: {
              description: { type: 'string', required: true },
              criteria: { type: 'array', required: true, items: { type: 'string' } },
            },
          },
          verification: {
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                criterionIndex: { type: 'integer', required: true },
                passed: { type: 'boolean', required: true },
                evidence: { type: 'string' },
                verifier: { type: 'string' },
              },
            },
          },
          phase: {
            type: 'object',
            additionalProperties: false,
            properties: {
              name: { type: 'string', required: true },
              note: { type: 'string' },
            },
          },
          assignee: {
            type: 'object',
            additionalProperties: false,
            properties: {
              target: { type: 'string', required: true },
              phase: { type: 'string' },
              note: { type: 'string' },
            },
          },
          snapshot: { type: 'string', required: true },
          hubIndex: { type: 'string' },
        },
      },
      render: (_args, value: TaskShowValue) => [{
        type: 'text',
        text: value.snapshot + (value.hubIndex !== undefined ? `\nhub index: ${value.hubIndex}` : ''),
      }],
    },
    async execute(args) {
      const view = taskView(args.task_id)
      if (view === undefined) {
        throw new Error(`yuyi_task_show: no local record for task ${args.task_id}`)
      }
      let hubIndex: string | undefined
      if (view.incomplete && yuyi.status().connected) {
        hubIndex = await yuyi.taskIndex(args.task_id)
      }
      return {
        taskId: args.task_id,
        round: view.round,
        incomplete: view.incomplete,
        closed: view.closed === true,
        ...(view.archived === true ? { archived: true } : {}),
        ...(view.pendingTarget !== undefined ? { pendingTarget: view.pendingTarget } : {}),
        lastRequestText: view.lastRequestText,
        acceptanceComplete: view.acceptanceComplete,
        artifacts: view.artifacts.map(artifact => ({
          ref: artifact.ref,
          ...(artifact.note !== undefined ? { note: artifact.note } : {}),
        })),
        summaries: view.summaries.map(summary => ({ by: summary.by, text: summary.text })),
        ...(view.goal !== undefined ? { goal: view.goal } : {}),
        ...(view.verification !== undefined ? {
          verification: view.verification.map(entry => ({
            criterionIndex: entry.criterionIndex,
            passed: entry.passed,
            ...(entry.evidence !== undefined ? { evidence: entry.evidence } : {}),
            ...(entry.verifier !== undefined ? { verifier: entry.verifier } : {}),
          })),
        } : {}),
        ...(view.phase !== undefined ? {
          phase: { name: view.phase.name, ...(view.phase.note !== undefined ? { note: view.phase.note } : {}) },
        } : {}),
        ...(view.assignee !== undefined ? {
          assignee: {
            target: view.assignee.target,
            ...(view.assignee.phase !== undefined ? { phase: view.assignee.phase } : {}),
            ...(view.assignee.note !== undefined ? { note: view.assignee.note } : {}),
          },
        } : {}),
        /* v8 ignore next -- a view exists only when the record has events, and
           taskSnapshot then renders; the empty arm is defensive. */
        snapshot: taskSnapshot(args.task_id) ?? '',
        ...(hubIndex !== undefined ? { hubIndex } : {}),
      }
    },
  }))

  ctx.tools.register(defineTool({
    name: 'yuyi_task_continue',
    description: 'Continue a durable yuyi task: attach this session, then send one expect-reply round '
      + 'under the same task id (replyTo follows the task\'s last reply; the target defaults to the '
      + 'pending request\'s addressee or the last replier).',
    parameters: {
      task_id: { type: 'string', required: true, description: 'The task id to continue.' },
      message: { type: 'string', required: true, description: 'The round\'s request text.' },
      to: { type: 'string', description: 'Explicit recipient address; defaults from the task record.' },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          taskId: { type: 'string', required: true },
          to: { type: 'string', required: true },
          messageId: { type: 'string', required: true },
          replyText: { type: 'string' },
          replyFrom: { type: 'string' },
          records: {
            type: 'array',
            required: true,
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                recorded: { type: 'boolean', required: true },
                reason: { type: 'string' },
              },
            },
          },
        },
      },
      render: (_args, value: TaskContinueValue) => [{
        type: 'text',
        text: value.replyText !== undefined
          ? `round ${value.messageId} to ${value.to}; reply from ${value.replyFrom as string}:\n${value.replyText}`
          : `round ${value.messageId} to ${value.to}`,
      }],
    },
    async execute(args, exec) {
      const agent = agentOf(exec.agent)
      const view = taskView(args.task_id)
      const target = continueTarget(view, args.to)
      const records: TaskRecordOutcome[] = [outcomeOf(appendTaskRecord(args.task_id, attachEvent(yuyi, agent)))]
      const { sent, reply } = await yuyi.sendExpectingReply({
        to: target,
        text: args.message,
        mode: 'notify',
        fromSession: agent.id,
        taskId: args.task_id,
        ...(view?.lastReplyMsgId !== undefined ? { replyTo: view.lastReplyMsgId } : {}),
      }, exec.signal)
      records.push(...recordTaskRequest(args.task_id, identityOf(yuyi), sent, args.message))
      const replyOutcome = recordTaskReply(args.task_id, reply)
      if (replyOutcome !== undefined) records.push(replyOutcome)
      // The from fields cross the wire boundary as parsed JSON; identity facts can be absent.
      const replyFrom = reply.from as { name?: string; sessionID?: string; device: string }
      const replyIdentity = replyFrom.name ?? replyFrom.sessionID ?? 'unknown'
      return {
        taskId: args.task_id,
        to: target,
        messageId: sent.id,
        replyText: reply.text,
        replyFrom: replyFrom.device.length > 0 ? `${replyIdentity}@${replyFrom.device}` : replyIdentity,
        records,
      }
    },
  }))

  ctx.tools.register(defineTool({
    name: 'yuyi_task_artifact',
    description: 'Record an artifact reference (a document path, PR number, URL) into the task record.',
    parameters: {
      task_id: { type: 'string', required: true, description: 'The task id.' },
      ref: { type: 'string', required: true, description: 'The artifact reference, e.g. "PR #12" or "design/spec.md".' },
      note: { type: 'string', description: 'One-line note about the artifact.' },
    },
    output: {
      schema: EVENT_SCHEMA,
      render: (_args, value: TaskEventValue) => [{ type: 'text', text: renderEvent(value) }],
    },
    async execute(args) {
      return {
        taskId: args.task_id,
        event: `artifact ${args.ref}`,
        records: [outcomeOf(appendTaskRecord(args.task_id, {
          kind: 'artifact',
          ref: args.ref,
          ...(args.note !== undefined ? { note: args.note } : {}),
        }))],
      }
    },
  }))

  ctx.tools.register(defineTool({
    name: 'yuyi_task_summary',
    description: 'Write an explicit summary line into the task record (immune to the rolling compaction cap).',
    parameters: {
      task_id: { type: 'string', required: true, description: 'The task id.' },
      text: { type: 'string', required: true, description: 'The summary text.' },
    },
    output: {
      schema: EVENT_SCHEMA,
      render: (_args, value: TaskEventValue) => [{ type: 'text', text: renderEvent(value) }],
    },
    async execute(args, exec) {
      return {
        taskId: args.task_id,
        event: 'summary',
        records: [outcomeOf(appendTaskRecord(args.task_id, {
          kind: 'summary',
          by: authorOf(yuyi, exec.agent),
          text: args.text,
        }))],
      }
    },
  }))

  registerResultTool(ctx, {
    name: 'yuyi_task_compact',
    description: 'Rolling-compaction for a task record: old rounds collapse into one summary event; '
      + 'the last five rounds and all artifacts stay verbatim.',
    event: 'compact',
    run: taskId => compactTask(taskId),
  })

  ctx.tools.register(defineTool({
    name: 'yuyi_task_close',
    description: 'Close a task\'s lifecycle: pending heartbeats and timeout nagging stop. Idempotent.',
    parameters: {
      task_id: { type: 'string', required: true, description: 'The task id.' },
      note: { type: 'string', description: 'Closing note.' },
    },
    output: {
      schema: EVENT_SCHEMA,
      render: (_args, value: TaskEventValue) => [{ type: 'text', text: renderEvent(value) }],
    },
    async execute(args, exec) {
      const result = closeTask(args.task_id, authorOf(yuyi, exec.agent), args.note)
      return {
        taskId: args.task_id,
        event: 'close',
        records: [{ recorded: result.ok, ...(result.reason !== undefined ? { reason: result.reason } : {}) }],
      }
    },
  }))

  registerResultTool(ctx, {
    name: 'yuyi_task_archive',
    description: 'Move a closed task record from the active directory into the archive; it stays '
      + 'readable through yuyi_task_show.',
    event: 'archive',
    run: taskId => archiveTask(taskId),
  })

  ctx.tools.register(defineTool({
    name: 'yuyi_task_goal',
    description: 'Set the task\'s acceptance goal: a description plus the checklist later verified '
      + 'criterion by criterion with yuyi_task_verify.',
    parameters: {
      task_id: { type: 'string', required: true, description: 'The task id.' },
      description: { type: 'string', required: true, description: 'What acceptance means for this task.' },
      criteria: { type: 'array', required: true, items: { type: 'string' }, description: 'Ordered acceptance criteria.' },
    },
    output: {
      schema: EVENT_SCHEMA,
      render: (_args, value: TaskEventValue) => [{ type: 'text', text: renderEvent(value) }],
    },
    async execute(args) {
      return {
        taskId: args.task_id,
        event: 'goal',
        records: [outcomeOf(appendTaskRecord(args.task_id, {
          kind: 'goal',
          description: args.description,
          criteria: args.criteria,
        }))],
      }
    },
  }))

  ctx.tools.register(defineTool({
    name: 'yuyi_task_verify',
    description: 'Record pass/fail with evidence for one acceptance criterion of the task\'s goal.',
    parameters: {
      task_id: { type: 'string', required: true, description: 'The task id.' },
      criterion_index: { type: 'number', required: true, description: 'Zero-based index into the goal criteria.' },
      passed: { type: 'boolean', required: true, description: 'Whether the criterion passed.' },
      evidence: { type: 'string', required: true, description: 'What was checked and observed.' },
      verifier: { type: 'string', description: 'Who verified. Defaults to this agent\'s roster alias.' },
    },
    output: {
      schema: EVENT_SCHEMA,
      render: (_args, value: TaskEventValue) => [{ type: 'text', text: renderEvent(value) }],
    },
    async execute(args, exec) {
      return {
        taskId: args.task_id,
        event: `verify #${String(args.criterion_index)} ${args.passed ? 'passed' : 'failed'}`,
        records: [outcomeOf(appendTaskRecord(args.task_id, {
          kind: 'verify',
          criterionIndex: args.criterion_index,
          passed: args.passed,
          evidence: args.evidence,
          ...(args.verifier !== undefined ? { verifier: args.verifier } : { verifier: authorOf(yuyi, exec.agent) }),
        }))],
      }
    },
  }))

  ctx.tools.register(defineTool({
    name: 'yuyi_task_phase',
    description: 'Mark the task\'s current phase (e.g. analysis, implementation, verification).',
    parameters: {
      task_id: { type: 'string', required: true, description: 'The task id.' },
      phase: { type: 'string', required: true, description: 'The phase name.' },
      note: { type: 'string', description: 'Optional phase note.' },
    },
    output: {
      schema: EVENT_SCHEMA,
      render: (_args, value: TaskEventValue) => [{ type: 'text', text: renderEvent(value) }],
    },
    async execute(args) {
      return {
        taskId: args.task_id,
        event: `phase ${args.phase}`,
        records: [outcomeOf(appendTaskRecord(args.task_id, {
          kind: 'phase',
          name: args.phase,
          ...(args.note !== undefined ? { note: args.note } : {}),
        }))],
      }
    },
  }))

  ctx.tools.register(defineTool({
    name: 'yuyi_task_assign',
    description: 'Mark task ownership: who is responsible for the current phase of the work.',
    parameters: {
      task_id: { type: 'string', required: true, description: 'The task id.' },
      assignee: { type: 'string', required: true, description: 'The responsible peer (alias or address).' },
      phase: { type: 'string', description: 'The phase the assignment covers.' },
      note: { type: 'string', description: 'Optional assignment note.' },
    },
    output: {
      schema: EVENT_SCHEMA,
      render: (_args, value: TaskEventValue) => [{ type: 'text', text: renderEvent(value) }],
    },
    async execute(args) {
      return {
        taskId: args.task_id,
        event: `assign ${args.assignee}`,
        records: [outcomeOf(appendTaskRecord(args.task_id, {
          kind: 'assign',
          assignee: args.assignee,
          ...(args.phase !== undefined ? { phase: args.phase } : {}),
          ...(args.note !== undefined ? { note: args.note } : {}),
        }))],
      }
    },
  }))
}
