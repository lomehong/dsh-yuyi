/**
 * Model-facing yuyi tools (`yuyi_status`, `yuyi_register`, `yuyi_peers`,
 * `yuyi_send`, `yuyi_inbox`, and the twelve `yuyi_task_*` lifecycle tools)
 * over `ctx.yuyi`. This package owns the schemas, validation, prompt
 * guidance, and presentation; the connection seam owns reachability. A
 * registered tool stays visible while the seam is dormant and fails with the
 * seam's structured `YuyiError` codes at execution time.
 * @module dsh-yuyi/tools
 */

import type { Context } from '@deepseek-ai/cordis'
import type {} from '../service.ts'
import { applyMessagingTools } from './messaging.ts'
import { applyTaskTools } from './tasks.ts'

export { renderStatus, renderPeers, renderInbox } from './messaging.ts'
export type {
  InboxRow, InboxValue, PeersValue, SendValue, StatusSessionRow, StatusValue,
} from './messaging.ts'
export type { TaskContinueValue, TaskEventValue, TaskShowValue } from './tasks.ts'
export { outcomeOf } from './task-record.ts'
export type { LocalIdentity, TaskRecordOutcome } from './task-record.ts'

/** Cordis plugin name used by loader diagnostics. */
export const name = 'tool-yuyi'

/** Services required by the yuyi tool suite. */
export const inject = ['tools', 'yuyi', 'systemPrompt']

/**
 * Register the seventeen yuyi tools and the prompt guidance that keeps their
 * use in the catalog's contract.
 * @param ctx - plugin context carrying the tool registry, the yuyi service, and the system-prompt service.
 */
export function apply(ctx: Context): void {
  applyMessagingTools(ctx)
  applyTaskTools(ctx)
  ctx.systemPrompt.section({
    name: 'tool:yuyi',
    order: 107,
    text: 'The yuyi_* tools reach other agents through the hub relay. Register this session '
      + '(yuyi_register) before expecting wake deliveries. Prefer yuyi_task_continue over bare '
      + 'yuyi_send for multi-round work: it keeps the durable task record threaded. Check '
      + 'yuyi_status first when a send fails; mail and unwakeable deliveries park in inboxes '
      + 'the yuyi_inbox tool reads.',
  })
}
