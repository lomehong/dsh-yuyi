/**
  * 御驿视图数据模型：标签页渲染的快照与 remote 调用
  * 填充它的数据。放在组件旁边，浏览器测试可驱动
  * 无真实 Remote 下的纯投影。
 * @module @deepseek-ai/dsh-client-ui-yuyi/client/model
 */

/* * 标签页渲染视角的一行 roster。 */
export interface YuyiSessionRow {
  name?: string
  sessionId: string
  title: string
}

/* * 标签页渲染视角的一行收件箱。 */
export interface YuyiInboxRow {
  id: string
  from: string
  text: string
}

/* * 标签页展示的全部内容；Remote 读取的纯投影。 */
export interface YuyiTabModel {
  state: 'connected' | 'disconnected' | 'unconfigured'
  device: string
  agentName?: string
  ownerUsername?: string
  sessions: readonly YuyiSessionRow[]
  deviceInbox: readonly YuyiInboxRow[]
  sessionInbox: readonly YuyiInboxRow[]
}

/* * Remote 返回的状态形态，按标签页消费的方式。 */
export interface YuyiStatusRead {
  configured: boolean
  connected: boolean
  device: string
  agentName?: string
  ownerUsername?: string
  sessions: YuyiSessionRow[]
}

/* * Remote 返回的收件箱条目形态，按标签页消费的方式。 */
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
  * 把一次 Remote 收件箱读取映射为标签页的行。
  * @param entries - 原始收件箱条目。
  * @returns 显示行。
 */
export function inboxRows(entries: readonly YuyiInboxEntryRead[]): YuyiInboxRow[] {
  return entries.map(entry => ({ id: entry.message.id, from: inboxSender(entry.message.from), text: entry.message.text }))
}

/**
  * 把一次状态读取折叠进模型的连接块。
  * @param status - 状态派生所依据的字段。
  * @returns 连接状态。
 */
export function connectionState(status: Readonly<Pick<YuyiStatusRead, 'configured' | 'connected'>>): YuyiTabModel['state'] {
  if (status.connected) return 'connected'
  return status.configured ? 'disconnected' : 'unconfigured'
}
