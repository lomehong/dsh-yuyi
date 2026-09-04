/**
  * 会话内协同卡片：`tool.call.toolview` 按工具名键控的
  * 四张富卡（send/continue/show/peers）。卡片是纯展示——
  * 运行中显示参数预览，落定后解析结果的规范值；每张卡带
  * 「活动面板」链接，与面板共享开合 store。
  * （面板的常驻入口是 shell.overlay 里的右缘拉手，不在
  * 宿主标题栏——header.utilities 在桌面壳里与窗口按钮重叠。）
 */
import type { JSX } from 'react'
import type { ToolCallBlock } from '@deepseek-ai/dsh-client-runtime/client'
import type { YuyiPanelKey } from './panel/locales.ts'
import { interpolate } from './panel/model.ts'
import type { YuyiPanelStore } from './panel/store.ts'
import css from './panel/YuyiPanel.module.css'

/* * 卡片收到的注入面（宿主 owner props 之外的份额）。 */
export interface CollabCardInjected {
  panel: YuyiPanelStore
}

/* * 一张协同卡的完整 props：宿主 owner props + 注入面 + locale。 */
export type CollabCardProps = CollabCardInjected & {
  t: (key: YuyiPanelKey) => string
  callId: string
  toolName: string
  block: ToolCallBlock
}

/* * 运行中块判定。 */
function isRunning(block: ToolCallBlock): boolean {
  return (block as { kind?: string }).kind !== 'tool-result'
}

/* * 解析调用的参数 JSON（两侧形态都带 argsRaw）。 */
function argsOf(block: ToolCallBlock): Record<string, unknown> {
  const raw = isRunning(block)
    ? (block as { argsRaw: string }).argsRaw
    : (block as { call: { argsRaw: string } | null }).call?.argsRaw
  if (raw === undefined || raw === null) return {}
  try {
    const parsed: unknown = JSON.parse(raw)
    return typeof parsed === 'object' && parsed !== null ? parsed as Record<string, unknown> : {}
  } catch {
    return {}
  }
}

/* * 解析落定结果的正文文本（首个 text 块）。 */
function resultText(block: ToolCallBlock): string | undefined {
  if (isRunning(block)) return undefined
  const { content } = block as { content: ReadonlyArray<{ type: string; text?: string }> }
  const text = content.filter(part => part.type === 'text').map(part => part.text ?? '').join('')
  return text.length > 0 ? text : undefined
}

/* * 解析落定结果的规范值 JSON（失败回 undefined，卡片退回文本预览）。 */
function resultValue<T>(block: ToolCallBlock): T | undefined {
  const text = resultText(block)
  if (text === undefined) return undefined
  try {
    return JSON.parse(text) as T
  } catch {
    return undefined
  }
}

/* * 打开面板的公共链接行。 */
function OpenPanel({ t, panel }: { t: (key: YuyiPanelKey) => string; panel: YuyiPanelStore }): JSX.Element {
  return (
    <button type="button" className={css.openPanelBtn} onClick={() => panel.open()}>
      {t('card.openPanel')}
    </button>
  )
}

/* * 卡头：标题 + 目标地址 + 可选投递徽标。 */
function CardHead({ title, to, badge }: { title: string; to?: string; badge?: { kind: string; label: string } }): JSX.Element {
  return (
    <div className={css.toolCardHead}>
      <span className={css.toolCardTitle}>{title}</span>
      {to !== undefined && <span className={css.toolCardTo}>{to}</span>}
      {badge !== undefined && <span className={css.taskStatus} data-status={badge.kind}>{badge.label}</span>}
    </div>
  )
}

/* * yuyi_send 卡：发给了谁、正文预览、投递方式（实时/入箱）。 */
export function YuyiSendCard(props: CollabCardProps): JSX.Element {
  const { t, panel, block } = props
  const args = argsOf(block) as { to?: string; text?: string }
  const result = resultValue<{ deliveredAs?: 'notify' | 'mail_fallback'; handlerSessionID?: string }>(block)
  const delivered = result?.deliveredAs
  return (
    <div className={css.toolCard}>
      <CardHead
        title={t('card.send')}
        to={args.to}
        badge={delivered !== undefined ? { kind: delivered === 'notify' ? 'done' : 'awaiting', label: t(`card.delivered.${delivered}` as YuyiPanelKey) } : undefined}
      />
      {args.text !== undefined && <div className={css.toolCardPreview}>{args.text}</div>}
      <OpenPanel t={t} panel={panel} />
    </div>
  )
}

/* * yuyi_task_continue 卡：任务轮次——目标、回信人与回信预览。 */
export function YuyiTaskContinueCard(props: CollabCardProps): JSX.Element {
  const { t, panel, block } = props
  const args = argsOf(block) as { task_id?: string; message?: string; to?: string }
  const result = resultValue<{ to?: string; replyText?: string; replyFrom?: string }>(block)
  const to = result?.to ?? args.to
  return (
    <div className={css.toolCard}>
      <CardHead title={args.task_id ?? ''} to={to} />
      {result?.replyText !== undefined ? (
        <div className={css.toolCardBody}>
          <span className={css.toolCardTo}>{result.replyFrom ?? ''}</span>
          <div className={css.toolCardPreview}>{result.replyText}</div>
        </div>
      ) : args.message !== undefined ? (
        <div className={css.toolCardPreview}>{args.message}</div>
      ) : null}
      <OpenPanel t={t} panel={panel} />
    </div>
  )
}

/* * yuyi_task_show 卡：任务链投影——轮次、验收进度、依赖。 */
export function YuyiTaskShowCard(props: CollabCardProps): JSX.Element {
  const { t, panel, block } = props
  const args = argsOf(block) as { task_id?: string }
  const result = resultValue<{
    taskId?: string; round?: number; pendingTarget?: string; closed?: boolean; archived?: boolean
    goal?: { description?: string; criteria?: string[] }
    verification?: Array<{ passed: boolean }>
    acceptanceComplete?: boolean
    dependsOn?: Array<{ taskId: string }>
  }>(block)
  const taskId = result?.taskId ?? args.task_id
  const passed = result?.verification?.filter(entry => entry.passed).length ?? 0
  const total = result?.goal?.criteria?.length ?? 0
  const status = result === undefined
    ? undefined
    : result.archived === true ? 'archived' : result.closed === true ? 'done' : 'in_progress'
  return (
    <div className={css.toolCard}>
      <CardHead
        title={taskId ?? ''}
        badge={status !== undefined && status !== 'in_progress' ? { kind: status, label: t(`task.${status}` as YuyiPanelKey) } : undefined}
      />
      {result?.goal?.description !== undefined && <div className={css.toolCardPreview}>{result.goal.description}</div>}
      <div className={css.taskMeta}>
        {result?.round !== undefined && <span>{interpolate(t('task.round'), { round: result.round })}</span>}
        {result?.pendingTarget !== undefined && <span>{interpolate(t('task.pendingTo'), { target: result.pendingTarget })}</span>}
        {total > 0 && <span>{interpolate(t('task.acceptance'), { passed, total })}</span>}
        {result?.dependsOn !== undefined && result.dependsOn.length > 0 && (
          <span>{t('task.depends')}: {result.dependsOn.map(dep => dep.taskId).join(', ')}</span>
        )}
      </div>
      <OpenPanel t={t} panel={panel} />
    </div>
  )
}

/* * yuyi_peers 卡：可达成员一览（设备 + 会话 + 岗位）。 */
export function YuyiPeersCard(props: CollabCardProps): JSX.Element {
  const { t, panel, block } = props
  const result = resultValue<{
    devices?: Array<{ device: string; role?: string; sessions?: Array<{ name?: string; sessionID: string; title: string }> }>
  }>(block)
  const devices = result?.devices ?? []
  return (
    <div className={css.toolCard}>
      <CardHead title={t('card.peers')} />
      <div className={css.cards}>
        {devices.map(device => (
          <div key={`${device.device}`} className={css.memberRow}>
            <span className={css.avatar} aria-hidden="true">{device.device.slice(0, 1).toUpperCase()}</span>
            <span className={css.memberMain}>
              <span className={css.memberNameRow}>
                <span className={css.memberName}>{device.device}</span>
                {device.role !== undefined && (
                  <span className={css.badge} data-kind="role">{t(`role.${device.role}` as YuyiPanelKey)}</span>
                )}
              </span>
              <span className={css.memberSub}>
                {(device.sessions ?? []).map(session => session.name ?? session.sessionID).join(', ')}
              </span>
            </span>
          </div>
        ))}
      </div>
      <OpenPanel t={t} panel={panel} />
    </div>
  )
}

/* * 工具名 → 卡片组件的注册表（apply 据此注册 tool.call.toolview 键）。 */
export const COLLAB_CARDS: Record<string, (props: CollabCardProps) => JSX.Element> = {
  yuyi_send: YuyiSendCard,
  yuyi_task_continue: YuyiTaskContinueCard,
  yuyi_task_show: YuyiTaskShowCard,
  yuyi_peers: YuyiPeersCard,
}
