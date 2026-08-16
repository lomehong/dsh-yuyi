/**
 * Yuyi view data model: the snapshot the tab renders and the remote calls
 * that fill it. Kept beside the component so the browser test can drive the
 * pure projection without a live Remote.
 * @module @deepseek-ai/dsh-client-ui-yuyi/client/model
 */

/** One roster row as the tab renders it. */
export interface YuyiSessionRow {
  name?: string
  sessionId: string
  title: string
}

/** One inbox row as the tab renders it. */
export interface YuyiInboxRow {
  id: string
  from: string
  text: string
}

/** Everything the tab shows; a pure projection of the Remote reads. */
export interface YuyiTabModel {
  state: 'connected' | 'disconnected' | 'unconfigured'
  device: string
  agentName?: string
  ownerUsername?: string
  sessions: readonly YuyiSessionRow[]
  deviceInbox: readonly YuyiInboxRow[]
  sessionInbox: readonly YuyiInboxRow[]
}

/** Shape the status Remote returns, as the tab consumes it. */
export interface YuyiStatusRead {
  configured: boolean
  connected: boolean
  device: string
  agentName?: string
  ownerUsername?: string
  sessions: YuyiSessionRow[]
}

/** Shape one inbox entry Remote returns, as the tab consumes it. */
export interface YuyiInboxEntryRead {
  message: { id: string; text: string; from: { name?: string; sessionID: string; device: string } }
}

/**
 * The label one inbox sender renders as.
 * @param from - the endorsed sender fields of one inbox message.
 * @returns the display label.
 */
export function inboxSender(from: YuyiInboxEntryRead['message']['from']): string {
  const identity = from.name ?? from.sessionID
  return from.device.length > 0 ? `${identity}@${from.device}` : identity
}

/**
 * Map one Remote inbox read into the tab's rows.
 * @param entries - the raw inbox entries.
 * @returns the display rows.
 */
export function inboxRows(entries: readonly YuyiInboxEntryRead[]): YuyiInboxRow[] {
  return entries.map(entry => ({ id: entry.message.id, from: inboxSender(entry.message.from), text: entry.message.text }))
}

/**
 * Fold a status read into the model's connection block.
 * @param status - the status fields the state derives from.
 * @returns the connection state.
 */
export function connectionState(status: Readonly<Pick<YuyiStatusRead, 'configured' | 'connected'>>): YuyiTabModel['state'] {
  if (status.connected) return 'connected'
  return status.configured ? 'disconnected' : 'unconfigured'
}
