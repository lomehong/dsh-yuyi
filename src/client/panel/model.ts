/**
  * 协同面板的数据模型：把 status/collab Remote 读取投影为
  * 卡片与 DAG 渲染所需的纯形态。全部函数无副作用，
  * 浏览器测试可在无真实 Remote 下驱动。
 * @module dsh-yuyi/client/panel/model
 */
import type { PeerDevice, TaskView } from '../../types.ts'

/* * 协同面板渲染视角的一行收件箱（旧标签页模型的原位承接）。 */
export interface YuyiInboxRow {
  id: string
  from: string
  text: string
}

/* * Remote 返回的收件箱条目形态，按面板消费的方式。 */
export interface YuyiInboxEntryRead {
  message: { id: string; text: string; from: { name?: string; sessionID: string; device: string } }
}

/**
  * 一个收件箱发送者渲染出的标签。
  * @param from - 一条收件箱消息的背书发送者字段。
  * @returns 显示标签。
 */
export function inboxSender(from: YuyiInboxEntryRead['message']['from']): string {
  const identity = from.name ?? from.sessionID
  return from.device.length > 0 ? `${identity}@${from.device}` : identity
}

/**
  * 把一次 Remote 收件箱读取映射为面板的行。
  * @param entries - 原始收件箱条目。
  * @returns 显示行。
 */
export function inboxRows(entries: readonly YuyiInboxEntryRead[]): YuyiInboxRow[] {
  return entries.map(entry => ({ id: entry.message.id, from: inboxSender(entry.message.from), text: entry.message.text }))
}

/**
  * 极小占位替换：{name} → params.name。宿主 t 不保证支持参数，
  * 面板与卡片统一先取模板再本地替换。
  * @param template - 含占位符的模板。
  * @param params - 占位符值。
  * @returns 渲染文本。
 */
export function interpolate(template: string, params: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (raw, name: string) =>
    name in params ? String(params[name]) : raw)
}

/* * 成员在协同里的呈现状态。 */
export type PresenceState = 'active' | 'awaiting' | 'idle' | 'unknown'

/* * 任务链在面板上的折叠状态。 */
export type TaskCardStatus = 'in_progress' | 'awaiting' | 'deliverable' | 'done' | 'archived'

/* * 一张成员卡：本地 roster 会话、本机身份或远端 peer 会话。 */
export interface MemberCard {
  /* * 稳定 React 键：`self` / `local:<sessionId>` / `peer:<device>/<sessionID>`。 */
  key: string
  /* * 展示名：别名、权威 agent 名或会话 id。 */
  name: string
  /* * 副标签：会话标题或设备名。 */
  title: string
  /* * 御符岗位（avatar/worker/coder）；未设置时缺省。 */
  role?: string
  device: string
  /* * true = 本机（roster 会话或本连接身份）。 */
  local: boolean
  /* * true = 本连接自身的身份卡。 */
  self: boolean
  presence: PresenceState
  /* * 正在执行的任务链数（assignee 指向它且未完结）。 */
  running: number
  /* * 等待它回信的任务链数（pendingTarget 指向它）。 */
  waiting: number
}

/* * 面板渲染所需的聚合计数。 */
export interface PanelCounts {
  members: number
  inProgress: number
  awaiting: number
  deliverable: number
  done: number
}

/* * 面板渲染的全部派生内容。 */
export interface PanelModel {
  state: 'connected' | 'disconnected' | 'unconfigured'
  device: string
  agentName?: string
  ownerUsername?: string
  /* * avatar 主理卡（存在 avatar 岗位成员时）。 */
  avatar?: MemberCard
  /* * 其余成员（worker/coder/未设岗），avatar 之外的平级协作面。 */
  members: MemberCard[]
  counts: PanelCounts
  /* * 本机任务链视图（collab 透传；首次 collab 读取前为空）。 */
  tasks: readonly TaskView[]
}

/* * lastActiveAt 距今多新视为活跃（2 分钟，覆盖一次轮询间隔加迟滞）。 */
const ACTIVE_WINDOW_MS = 2 * 60_000

/* * Remote 返回的状态形态，按面板消费的方式。 */
export interface YuyiStatusRead {
  configured: boolean
  connected: boolean
  device: string
  agentName?: string
  ownerUsername?: string
  role?: string
  sessions: ReadonlyArray<{ sessionId: string; title: string; name?: string }>
}

/**
  * 把一次状态读取折叠成连接三态（旧标签页模型的原位承接）。
  * @param status - 状态派生所依据的字段。
  * @returns 连接状态。
 */
export function connectionState(status: Readonly<Pick<YuyiStatusRead, 'configured' | 'connected'>>): PanelModel['state'] {
  if (status.connected) return 'connected'
  return status.configured ? 'disconnected' : 'unconfigured'
}

/**
  * 一个任务链的面板状态。
  * @param task - 本机任务链视图。
  * @returns 折叠后的状态。
 */
export function taskStatusOf(task: TaskView): TaskCardStatus {
  if (task.archived === true) return 'archived'
  if (task.closed === true) return 'done'
  if (task.acceptanceComplete) return 'deliverable'
  if (task.pendingTarget !== undefined) return 'awaiting'
  return 'in_progress'
}

/*
  * assignee/pendingTarget 是自由地址（别名、`device:别名`、会话 id 或
  * `别名@设备`）；这里对成员的候选标识做宽容匹配，绝不参与寻址，
  * 只影响面板计数，匹配错最多差一个徽标。
 */
function targetMatches(target: string, member: { name: string; device: string }): boolean {
  const t = target.trim().toLowerCase()
  if (t.length === 0) return false
  const name = member.name.toLowerCase()
  const device = member.device.toLowerCase()
  return t === name || t.endsWith(`:${name}`) || t === `${name}@${device}` || (device.length > 0 && t === `${device}:${name}`)
}

function activityOf(member: { presenceBase: PresenceState; lastActiveAt?: number; now: number }): PresenceState {
  if (member.lastActiveAt !== undefined) {
    return member.now - member.lastActiveAt <= ACTIVE_WINDOW_MS ? 'active' : 'idle'
  }
  return member.presenceBase
}

/**
  * 把 status 与 collab 快照投影为面板模型。
  * @param status - 最新状态读取。
  * @param collab - 最新协同快照（可能 undefined——首次读取前）。
  * @param now - 活跃度判定的当前时刻（测试可注入）。
  * @returns 面板模型。
 */
export function panelModel(status: YuyiStatusRead, collab: Readonly<{ peers: readonly PeerDevice[]; tasks: readonly TaskView[] }> | undefined, now: number = Date.now()): PanelModel {
  const tasks = collab?.tasks ?? []
  const statusOf = new Map(tasks.map(task => [task.taskId, taskStatusOf(task)]))
  const runningOrOpen = (task: TaskView): boolean => statusOf.get(task.taskId) !== 'done' && statusOf.get(task.taskId) !== 'archived'
  const countsFor = (member: { name: string; device: string }): { running: number; waiting: number } => {
    let running = 0
    let waiting = 0
    for (const task of tasks) {
      if (task.assignee !== undefined && targetMatches(task.assignee.target, member) && runningOrOpen(task)) running += 1
      if (task.pendingTarget !== undefined && targetMatches(task.pendingTarget, member)) waiting += 1
    }
    return { running, waiting }
  }
  const presenceFor = (base: PresenceState, lastActiveAt: number | undefined, member: { name: string; device: string }): PresenceState => {
    const presence = activityOf({ presenceBase: base, lastActiveAt, now })
    if (presence !== 'active') {
      for (const task of tasks) {
        if (task.pendingTarget !== undefined && targetMatches(task.pendingTarget, member)) return 'awaiting'
      }
    }
    return presence
  }

  const self: MemberCard = {
    key: 'self',
    name: status.agentName ?? status.device,
    title: status.ownerUsername !== undefined ? status.ownerUsername : status.device,
    ...(status.role !== undefined ? { role: status.role } : {}),
    device: status.device,
    local: true,
    self: true,
    presence: status.connected ? 'active' : 'unknown',
    ...countsFor({ name: status.agentName ?? status.device, device: status.device }),
  }

  const rosterCards: MemberCard[] = status.sessions.map(session => {
    const member = { name: session.name ?? session.sessionId, device: status.device }
    return {
      key: `local:${session.sessionId}`,
      name: member.name,
      title: session.title,
      device: status.device,
      local: true,
      self: false,
      presence: presenceFor('unknown', undefined, member),
      ...countsFor(member),
    }
  })

  const peerCards: MemberCard[] = (collab?.peers ?? []).flatMap((device: PeerDevice) =>
    device.sessions.map(session => {
      const member = { name: session.name ?? session.sessionID, device: device.device }
      return {
        key: `peer:${device.device}/${session.sessionID}`,
        name: member.name,
        title: session.title,
        ...(device.role !== undefined ? { role: device.role } : {}),
        device: device.device,
        local: false,
        self: false,
        presence: presenceFor('idle', device.lastActiveAt, member),
        ...countsFor(member),
      }
    }),
  )

  // 同名去重：peer 列表可能回显本机连接（同 device 同名），以本机卡优先。
  const seen = new Set<string>([self.name.toLowerCase(), ...rosterCards.map(card => card.name.toLowerCase())])
  const uniquePeers = peerCards.filter(card => {
    const id = `${card.name.toLowerCase()}@${card.device.toLowerCase()}`
    const localHit = card.local || seen.has(card.name.toLowerCase())
    if (localHit) return false
    seen.add(id)
    return true
  })

  const all = [self, ...rosterCards, ...uniquePeers]
  const avatar = all.find(card => card.role === 'avatar')
  const members = avatar !== undefined ? all.filter(card => card !== avatar) : all

  const counts: PanelCounts = {
    members: all.length,
    inProgress: 0,
    awaiting: 0,
    deliverable: 0,
    done: 0,
  }
  for (const task of tasks) {
    const card = taskStatusOf(task)
    if (card === 'in_progress') counts.inProgress += 1
    else if (card === 'awaiting') counts.awaiting += 1
    else if (card === 'deliverable') counts.deliverable += 1
    else if (card === 'done') counts.done += 1
  }

  return {
    state: connectionState(status),
    device: status.device,
    ...(status.agentName !== undefined ? { agentName: status.agentName } : {}),
    ...(status.ownerUsername !== undefined ? { ownerUsername: status.ownerUsername } : {}),
    ...(avatar !== undefined ? { avatar } : {}),
    members,
    counts,
    tasks,
  }
}

/* * DAG 节点：真实任务链，或被依赖但本机无记录的上游（幽灵节点）。 */
export interface DagNode {
  taskId: string
  ghost: boolean
}

/* * DAG 布局：按最长上游路径分列（上游在左，下游在右）。 */
export interface DagLayout {
  columns: DagNode[][]
  edges: Array<{ from: string; to: string }>
  /* * 依赖环上被忽略的边数（容错计数，不参与布局）。 */
  cycleEdges: number
}

/**
  * 依赖图布局：任务为节点、dependsOn 为边。列号 = 上游最长路径，
  * 依赖环上的回边忽略（计入 cycleEdges），幽灵上游（本机无记录）
  * 只作端点渲染。
  * @param tasks - 本机任务链视图（面板已按最近活动排序）。
  * @returns 分列布局；无依赖时 edges 为空。
 */
export function dagLayout(tasks: readonly TaskView[]): DagLayout {
  const depsOf = new Map<string, string[]>()
  const known = new Set<string>()
  const edges: DagLayout['edges'] = []
  for (const task of tasks) {
    known.add(task.taskId)
  }
  for (const task of tasks) {
    const deps: string[] = []
    for (const dep of task.dependsOn) {
      if (dep.taskId === task.taskId) continue
      deps.push(dep.taskId)
      edges.push({ from: dep.taskId, to: task.taskId })
      if (!known.has(dep.taskId)) known.add(dep.taskId)
    }
    depsOf.set(task.taskId, deps)
  }
  if (edges.length === 0) return { columns: [], edges, cycleEdges: 0 }

  const columnOf = new Map<string, number>()
  const visiting = new Set<string>()
  let cycleEdges = 0
  const measure = (id: string): number => {
    const settled = columnOf.get(id)
    if (settled !== undefined) return settled
    if (visiting.has(id)) {
      cycleEdges += 1
      return -1 // 回边：不参与父节点列号计算
    }
    visiting.add(id)
    const deps = depsOf.get(id) ?? []
    let base = -1
    for (const dep of deps) {
      base = Math.max(base, measure(dep))
    }
    visiting.delete(id)
    const column = base + 1
    columnOf.set(id, column)
    return column
  }
  for (const id of known) measure(id)

  const byId = new Map(tasks.map(task => [task.taskId, task]))
  const maxColumn = Math.max(...columnOf.values(), 0)
  const columns: DagNode[][] = Array.from({ length: maxColumn + 1 }, () => [])
  const pushed = new Set<string>()
  const push = (node: DagNode, column: number): void => {
    if (pushed.has(node.taskId)) return
    pushed.add(node.taskId)
    ;(columns[Math.min(Math.max(column, 0), maxColumn)] ?? columns[0]!).push(node)
  }
  // 真实节点按面板序（最近活动优先）入列，幽灵节点垫在本列尾部。
  for (const task of tasks) {
    push({ taskId: task.taskId, ghost: false }, columnOf.get(task.taskId) ?? 0)
  }
  for (const id of known) {
    if (byId.has(id)) continue
    push({ taskId: id, ghost: true }, columnOf.get(id) ?? 0)
  }
  return { columns, edges, cycleEdges }
}

/**
  * 从选中节点出发的全部上游传递闭包（DAG 悬停高亮路径）。
  * @param layout - dagLayout 的产物。
  * @param taskId - 悬停/选中的下游节点。
  * @returns 该节点依赖的全部上游 id（含间接），不含自身。
 */
export function upstreamOf(layout: DagLayout, taskId: string): Set<string> {
  const byTo = new Map<string, string[]>()
  for (const edge of layout.edges) {
    const list = byTo.get(edge.to) ?? []
    list.push(edge.from)
    byTo.set(edge.to, list)
  }
  const seen = new Set<string>()
  const walk = (id: string): void => {
    for (const from of byTo.get(id) ?? []) {
      if (seen.has(from)) continue
      seen.add(from)
      walk(from)
    }
  }
  walk(taskId)
  return seen
}
