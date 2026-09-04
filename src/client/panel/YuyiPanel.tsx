/**
  * 御驿协同活动面板：shell.overlay 浮层里的右缘停靠卡。
  * 头部连接态、概览与分段进度、avatar 主理卡、成员花名册、
  * 任务链进度与详情、依赖 DAG 与停靠消息。数据走注入的
  * Remote 读取面，可见性门控轮询经 onChange 到达；
  * 面板开合状态经共享 store（右缘拉手与会话内卡片同源）。
  * 面板关闭时渲染右缘拉手（对话区域内的常驻入口，不进
  * 宿主标题栏——header.utilities 在桌面壳里与窗口按钮重叠）。
 */
import { useCallback, useEffect, useState, useSyncExternalStore, type JSX, type ReactNode } from 'react'
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { Pill, StateDot, type StateDotState } from '@deepseek-ai/dsh-client-ui-primitives'
import type { TaskView, YuyiCollabSnapshot, YuyiStatus } from '../../types.ts'
import { NS, type YuyiPanelKey } from './locales.ts'
import type { YuyiPanelStore } from './store.ts'
import {
  inboxRows, panelModel, taskStatusOf, dagLayout, upstreamOf, interpolate,
  type YuyiInboxEntryRead, type YuyiInboxRow,
} from './model.ts'
import css from './YuyiPanel.module.css'

/* * 面板读取所经的注入钩子（remote 命名空间读取 + 开合 store）。 */
export interface YuyiPanelInjected {
  readStatus: () => PromiseLike<YuyiStatus>
  readCollab: () => PromiseLike<YuyiCollabSnapshot>
  readInbox: (target: 'device' | string, peek: boolean) => PromiseLike<YuyiInboxEntryRead[]>
  onChange: (listener: () => void) => () => void
  /* * 面板开合 store：右缘拉手展开，本组件 close。 */
  panel: YuyiPanelStore
}

/* * 面板的完整 props：运行时套件、locale 与注入面。 */
export type YuyiPanelProps =
  PropsRuntime<'shell.overlay'> & PropsLocale<typeof NS> & YuyiPanelInjected

/* * 连接状态到产品 StateDot 四态的映射。 */
const DOT_STATE: Record<'connected' | 'disconnected' | 'unconfigured', StateDotState> = {
  connected: 'done',
  disconnected: 'warning',
  unconfigured: 'error',
}

/* * 面板内部的一次刷新快照：原始读取 + 派生模型 + 停靠消息行。 */
interface PanelSnapshot {
  model: ReturnType<typeof panelModel>
  deviceInbox: YuyiInboxRow[]
}

/* * 首次读取到达前的空快照。 */
const EMPTY: PanelSnapshot = {
  model: panelModel({ configured: false, connected: false, device: '', sessions: [] }, undefined),
  deviceInbox: [],
}

/* * 状态文案键。 */
function stateKey(state: 'connected' | 'disconnected' | 'unconfigured'): YuyiPanelKey {
  return `state.${state}` as YuyiPanelKey
}

/* * 图例段落：kind → counts 字段 → 文案键。 */
const LEGEND: Array<{ kind: 'in_progress' | 'awaiting' | 'deliverable' | 'done'; field: 'inProgress' | 'awaiting' | 'deliverable' | 'done'; label: YuyiPanelKey }> = [
  { kind: 'in_progress', field: 'inProgress', label: 'legend.inProgress' },
  { kind: 'awaiting', field: 'awaiting', label: 'legend.awaiting' },
  { kind: 'deliverable', field: 'deliverable', label: 'legend.deliverable' },
  { kind: 'done', field: 'done', label: 'legend.done' },
]

/* * DAG 节点盒尺寸与间距（px）。 */
const NODE_W = 96
const NODE_H = 26
const NODE_GAP_X = 52
const NODE_GAP_Y = 12

/**
  * 面板主体。
  * @param props - 运行时套件、locale 与注入面。
  * @returns 渲染出的面板；关闭时渲染 null。
 */
export function YuyiPanel(props: YuyiPanelProps): JSX.Element | null {
  const { t, readStatus, readCollab, readInbox, onChange, panel } = props
  const open = useSyncExternalStore(panel.subscribe, panel.getSnapshot)
  const [snapshot, setSnapshot] = useState<PanelSnapshot>(EMPTY)
  const [error, setError] = useState<string | undefined>(undefined)
  const [selected, setSelected] = useState<string | undefined>(undefined)
  const [hot, setHot] = useState<string | undefined>(undefined)

  const refresh = useCallback(() => {
    void (async () => {
      try {
        const status = await readStatus()
        // collab/收件箱各自尽力而为：失败降级为空，不让面板白屏。
        let collab: YuyiCollabSnapshot | undefined
        try {
          collab = await readCollab()
        } catch {
          collab = undefined
        }
        let entries: YuyiInboxEntryRead[]
        try {
          entries = await readInbox('device', true)
        } catch {
          entries = []
        }
        setSnapshot({
          model: panelModel(status, collab),
          deviceInbox: inboxRows(entries),
        })
        setError(undefined)
      } catch (cause) {
        setError(String(cause))
      }
    })()
  }, [readStatus, readCollab, readInbox])

  useEffect(() => {
    refresh()
    return onChange(refresh)
  }, [onChange, refresh])

  const tKey = t as (key: YuyiPanelKey) => string

  // 关闭态：右缘拉手（对话区域内的常驻入口，不占标题栏）。
  // 状态点复用既有的轮询快照：configured/connected 才点亮。
  if (!open) {
    return (
      <button
        type="button"
        className={css.railTab}
        aria-label={tKey('toggle.open')}
        title={tKey('toggle.open')}
        onClick={() => panel.open()}
      >
        <span className={css.railDot} data-configured={snapshot.model.state !== 'unconfigured'} />
        <span className={css.railText}>{tKey('panel.title')}</span>
      </button>
    )
  }

  const { model } = snapshot
  const tasks: readonly TaskView[] = model.tasks
  const layout = dagLayout(tasks)
  const hotSet = hot !== undefined ? upstreamOf(layout, hot) : undefined
  const selectedTask = tasks.find(task => task.taskId === selected)
  const totalTasks = LEGEND.reduce((sum, entry) => sum + model.counts[entry.field], 0)

  return (
    <div className={css.panel} role="complementary" aria-label={tKey('panel.title')}>
      <header className={css.head}>
        <StateDot state={DOT_STATE[model.state]} />
        <span className={css.stateLabel} data-state={model.state}>{tKey('panel.title')} · {tKey(stateKey(model.state))}</span>
        {model.device !== '' && (
          <Pill className={css.devicePill}><span className={css.deviceName}>{model.device}</span></Pill>
        )}
        <button type="button" className={css.closeBtn} aria-label="close" onClick={panel.close}>✕</button>
      </header>

      {error !== undefined && <p className={css.errorBanner}>{tKey('error.title')}: {error}</p>}

      <div className={css.overview}>
        <span><span className={css.overviewStrong}>{model.counts.members}</span> {tKey('overview.members')}</span>
        <span><span className={css.overviewStrong}>{model.counts.done}</span> {tKey('overview.done')}</span>
        <span><span className={css.overviewStrong}>{model.counts.awaiting}</span> {tKey('overview.pending')}</span>
      </div>

      {totalTasks > 0 && (
        <>
          <div className={css.progress} aria-hidden="true">
            {LEGEND.map(({ kind, field }) => {
              const count = model.counts[field]
              if (count === 0) return null
              return (
                <div key={kind} className={css.progressSegment} data-kind={kind} style={{ width: `${(count / totalTasks) * 100}%` }} />
              )
            })}
          </div>
          <div className={css.legend}>
            {LEGEND.map(({ kind, field, label }) => (
              <span key={kind} className={css.legendItem}>
                <span className={css.legendDot} data-kind={kind} />
                {tKey(label)} {model.counts[field]}
              </span>
            ))}
          </div>
        </>
      )}

      {model.avatar !== undefined && (
        <section className={css.avatarCard} aria-label={tKey('role.avatar')}>
          <span className={css.avatarGlyph} aria-hidden="true">{model.avatar.name.slice(0, 1).toUpperCase()}</span>
          <span className={css.avatarMain}>
            <span className={css.avatarNameRow}>
              <span className={css.avatarName}>{model.avatar.name}</span>
              {model.avatar.self && <span className={css.selfTag}>self</span>}
            </span>
            <span className={css.avatarSub}>
              {interpolate(tKey('member.running'), { count: model.avatar.running })}
              {' · '}
              {interpolate(tKey('member.waiting'), { count: model.avatar.waiting })}
            </span>
          </span>
        </section>
      )}

      <Section title={tKey('roster.title')} count={model.members.length}>
        {model.members.length === 0
          ? <EmptyWell text={tKey('roster.empty')} />
          : (
            <div className={css.cards}>
              {model.members.map(member => (
                <div key={member.key} className={css.memberRow}>
                  <span className={css.avatar} aria-hidden="true">{member.name.slice(0, 1).toUpperCase()}</span>
                  <span className={css.memberMain}>
                    <span className={css.memberNameRow}>
                      <span className={css.memberName}>{member.name}</span>
                      {member.self && <span className={css.selfTag}>self</span>}
                    </span>
                    <span className={css.memberSub}>
                      {member.title !== member.name ? `${member.title} · ` : ''}{member.device}
                    </span>
                  </span>
                  <span className={css.memberBadges}>
                    <span className={css.badgeRow}>
                      {member.role !== undefined && member.role !== 'avatar' && (
                        <span className={css.badge} data-kind="role">{tKey(`role.${member.role}` as YuyiPanelKey)}</span>
                      )}
                      <span className={css.badge} data-kind={member.presence === 'awaiting' ? 'waiting' : 'presence'}>
                        {tKey(`presence.${member.presence}` as YuyiPanelKey)}
                      </span>
                    </span>
                    {member.running > 0 && (
                      <span className={css.badge} data-kind="running">{interpolate(tKey('member.running'), { count: member.running })}</span>
                    )}
                    {member.waiting > 0 && (
                      <span className={css.badge} data-kind="waiting">{interpolate(tKey('member.waiting'), { count: member.waiting })}</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          )}
      </Section>

      <Section title={tKey('tasks.title')} count={tasks.length}>
        {tasks.length === 0
          ? <EmptyWell text={tKey('tasks.empty')} />
          : (
            <div className={css.detail}>
              {tasks.map(task => {
                const status = taskStatusOf(task)
                return (
                  <button
                    key={task.taskId}
                    type="button"
                    className={css.taskRow}
                    data-selected={task.taskId === selected}
                    onClick={() => setSelected(previous => previous === task.taskId ? undefined : task.taskId)}
                  >
                    <span className={css.taskHead}>
                      <span className={css.taskId}>{task.taskId}</span>
                      <span className={css.taskStatus} data-status={status}>{tKey(`task.${status}` as YuyiPanelKey)}</span>
                    </span>
                    <span className={css.taskGoal}>
                      {task.goal?.description !== undefined ? task.goal.description : interpolate(tKey('task.round'), { round: task.round })}
                    </span>
                    <span className={css.taskMeta}>
                      {task.pendingTarget !== undefined && <span>{interpolate(tKey('task.pendingTo'), { target: task.pendingTarget })}</span>}
                      {task.goal !== undefined && (
                        <span>{interpolate(tKey('task.acceptance'), {
                          passed: task.verification?.filter(entry => entry.passed).length ?? 0,
                          total: task.goal.criteria.length,
                        })}</span>
                      )}
                      {task.dependsOn.length > 0 && <span>{tKey('task.depends')}: {task.dependsOn.map(dep => dep.taskId).join(', ')}</span>}
                    </span>
                  </button>
                )
              })}
              {selectedTask !== undefined && <TaskDetail task={selectedTask} tKey={tKey} onJump={setSelected} />}
            </div>
          )}
      </Section>

      {layout.edges.length > 0 && (
        <Section title={tKey('graph.title')} count={layout.edges.length}>
          <p className={css.graphHint}>
            {tKey('graph.hint')}
            {layout.cycleEdges > 0 && ` · ${interpolate(tKey('graph.cycle'), { count: layout.cycleEdges })}`}
          </p>
          <div className={css.graphScroll}>
            <GraphSvg layout={layout} selected={selected} hot={hot} hotSet={hotSet}
              onSelect={setSelected} onHot={setHot} />
          </div>
        </Section>
      )}

      <Section title={tKey('messages.title')} count={snapshot.deviceInbox.length}>
        {snapshot.deviceInbox.length === 0
          ? <EmptyWell text={tKey('messages.empty')} />
          : (
            <div className={css.cards}>
              {snapshot.deviceInbox.map(entry => (
                <div key={entry.id} className={css.inboxRow}>
                  <span className={css.inboxFrom}>{entry.from}</span>
                  <span className={css.inboxText}>{entry.text}</span>
                </div>
              ))}
            </div>
          )}
      </Section>
    </div>
  )
}

/* * 区块包装：标题 + 计数徽标。 */
function Section({ title, count, children }: { title: string; count: number; children: ReactNode }): JSX.Element {
  return (
    <section className={css.section}>
      <div className={css.sectionHead}>
        <h3 className={css.sectionTitle}>{title}</h3>
        <span className={css.count}>{count}</span>
      </div>
      {children}
    </section>
  )
}

/* * 空态井（虚线）。 */
function EmptyWell({ text }: { text: string }): JSX.Element {
  return <div className={css.emptyWell}>{text}</div>
}

/* * 选中任务的详情卡：验收清单、归属、依赖（可跳转）、产物。 */
function TaskDetail({ task, tKey, onJump }: {
  task: TaskView
  tKey: (key: YuyiPanelKey) => string
  onJump: (taskId: string | undefined) => void
}): JSX.Element {
  return (
    <div className={css.detail}>
      {task.goal !== undefined ? (
        <div className={css.detailBlock}>
          <span className={css.detailLabel}>{interpolate(tKey('task.acceptance'), {
            passed: task.verification?.filter(entry => entry.passed).length ?? 0,
            total: task.goal.criteria.length,
          })}</span>
          {task.goal.criteria.map((criterion, index) => {
            const verification = task.verification?.[index]
            return (
              <span key={index} className={css.criterion}>
                <span className={css.criterionMark}>{verification?.passed === true ? '✅' : '⏳'}</span>
                <span className={css.criterionText}>
                  {criterion}
                  {verification?.evidence !== undefined && (
                    <span className={css.criterionEvidence}> — {verification.evidence}</span>
                  )}
                </span>
              </span>
            )
          })}
          {task.acceptanceComplete && task.closed !== true && (
            <span className={css.detailText}>{tKey('task.acceptanceDone')}</span>
          )}
        </div>
      ) : (
        <div className={css.detailBlock}>
          <span className={css.detailLabel}>{tKey('task.goalEmpty')}</span>
        </div>
      )}
      {task.assignee !== undefined && (
        <div className={css.detailBlock}>
          <span className={css.detailLabel}>{tKey('task.assignee')}</span>
          <p className={css.detailText}>{task.assignee.target}{task.assignee.phase !== undefined ? ` · ${task.assignee.phase}` : ''}</p>
        </div>
      )}
      {task.dependsOn.length > 0 && (
        <div className={css.detailBlock}>
          <span className={css.detailLabel}>{tKey('task.depends')}</span>
          <p className={css.detailText}>
            {task.dependsOn.map((dep, index) => (
              <span key={dep.taskId}>
                {index > 0 && '、'}
                <button type="button" className={css.depLink} onClick={() => onJump(dep.taskId)}>{dep.taskId}</button>
                {dep.note !== undefined && `（${dep.note}）`}
              </span>
            ))}
          </p>
        </div>
      )}
      {task.artifacts.length > 0 && (
        <div className={css.detailBlock}>
          <span className={css.detailLabel}>{tKey('task.artifacts')}</span>
          {task.artifacts.map(artifact => (
            <p key={artifact.ref} className={css.detailText}>
              {artifact.ref}{artifact.note !== undefined ? `（${artifact.note}）` : ''}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

/* * DAG SVG：列从左到右为上游→下游，悬停高亮上游传递链。 */
function GraphSvg({ layout, selected, hot, hotSet, onSelect, onHot }: {
  layout: ReturnType<typeof dagLayout>
  selected: string | undefined
  hot: string | undefined
  hotSet: Set<string> | undefined
  onSelect: (taskId: string | undefined) => void
  onHot: (taskId: string | undefined) => void
}): JSX.Element {
  const positions = new Map<string, { x: number; y: number }>()
  layout.columns.forEach((column, columnIndex) => {
    column.forEach((node, rowIndex) => {
      positions.set(node.taskId, { x: columnIndex * (NODE_W + NODE_GAP_X), y: rowIndex * (NODE_H + NODE_GAP_Y) })
    })
  })
  const svgWidth = layout.columns.length * (NODE_W + NODE_GAP_X) - NODE_GAP_X
  const svgHeight = Math.max(...layout.columns.map(column => column.length), 1) * (NODE_H + NODE_GAP_Y) - NODE_GAP_Y
  const active = hot ?? selected
  // 高亮集合：活跃节点自身 + 其全部上游；边两端都在集合内即点亮。
  const chain = active === undefined ? undefined : new Set<string>([active, ...(hotSet ?? [])])
  const edgeHot = (from: string, to: string): boolean =>
    chain !== undefined && chain.has(from) && (chain.has(to) || to === active)
  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      role="img"
      onMouseLeave={() => onHot(undefined)}
    >
      {layout.edges.map(edge => {
        const from = positions.get(edge.from)
        const to = positions.get(edge.to)
        if (from === undefined || to === undefined) return null
        const x1 = from.x + NODE_W
        const y1 = from.y + NODE_H / 2
        const x2 = to.x
        const y2 = to.y + NODE_H / 2
        const mid = (x1 + x2) / 2
        return (
          <path
            key={`${edge.from}->${edge.to}`}
            className={css.graphEdge}
            data-hot={edgeHot(edge.from, edge.to)}
            d={`M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`}
          />
        )
      })}
      {layout.columns.map((column, columnIndex) => (
        column.map((node, rowIndex) => {
          const position = positions.get(node.taskId)
          if (position === undefined) return null
          const isSelected = node.taskId === selected
          const isHot = active !== undefined && (node.taskId === active || chain?.has(node.taskId) === true)
          return (
            <g
              key={node.taskId}
              className={`${css.graphNode} ${node.ghost ? css.graphNodeGhost : ''}`}
              data-selected={isSelected}
              data-hot={isHot}
              transform={`translate(${position.x}, ${position.y})`}
              onClick={() => onSelect(isSelected ? undefined : node.taskId)}
              onMouseEnter={() => onHot(node.taskId)}
            >
              <rect className={css.graphNodeRect} width={NODE_W} height={NODE_H} rx={8} />
              <text className={css.graphNodeText} x={10} y={17}>
                {node.taskId.length > 12 ? `${node.taskId.slice(0, 11)}…` : node.taskId}
                {node.ghost ? ' ∅' : ''}
              </text>
            </g>
          )
        })
      ))}
    </svg>
  )
}
