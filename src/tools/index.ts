/**
  * 模型可用的 yuyi 工具（`yuyi_status`、`yuyi_register`、`yuyi_peers`、
  * `yuyi_send`、`yuyi_inbox` 与十三个 `yuyi_task_*` 生命周期工具）
  * 构建在 `ctx.yuyi` 上。本包拥有 schema、校验、prompt
  * 指引与展示；连接接缝拥有可达性。未配置时
  * 已注册工具在接缝休眠期间保持可见，执行时以
  * 接缝的结构化 `YuyiError` 错误码失败。
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

/* * loader 诊断使用的 cordis 插件名。 */
export const name = 'tool-yuyi'

/* * yuyi 工具套件所需的服务。 */
export const inject = ['tools', 'yuyi', 'systemPrompt']

/**
  * 注册十八个 yuyi 工具，以及让其在
  * 目录契约中的使用保持指引。
  * @param ctx - 携带工具注册表、yuyi 服务与系统提示服务的插件上下文。
 */
export function apply(ctx: Context): void {
  applyMessagingTools(ctx)
  applyTaskTools(ctx)
  ctx.systemPrompt.section({
    name: 'tool:yuyi',
    order: 107,
    text: 'The yuyi_* tools reach other agents through the hub relay. Address peers by their '
      + 'authoritative yufu agent name (see yuyi_peers) or a session id; when this agent has an '
      + 'authoritative name, aliases from yuyi_register are local labels only and do not route. '
      + 'Register this session (yuyi_register) before expecting wake deliveries: an agent-level '
      + 'delivery lands on the earliest registered session. A woken session auto-acknowledges '
      + 'immediately and mails its turn result back when the turn settles (auto messages carry '
      + 'a yuyi:auto context hint and never re-arm the machinery). Prefer yuyi_task_continue over bare '
      + 'yuyi_send for multi-round work: it keeps the durable task record threaded. Check '
      + 'yuyi_status first when a send fails; mail and unwakeable deliveries park in inboxes '
      + 'the yuyi_inbox tool reads.',
  })
}
