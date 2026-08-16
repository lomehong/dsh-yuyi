/**
 * Service Definition for the yuyi communication capability seam (`ctx.yuyi`):
 * owns the single Hub WebSocket connection for the process, the local session
 * roster, wake delivery routing into live dsh agents, and the expect-reply
 * correlation. Connection fields are user-editable through the `yuyi`
 * user-settings namespace (over the composition entry); committed changes
 * restart the connection live. Unconfigured deployments stay dormant — every
 * method fails with `YUYI_NOT_CONFIGURED` instead of degrading silently.
 *
 * Delivery routing follows the wake pattern of `dsh-tool-jobs`: a notify for a
 * roster session whose agent is idle submits a follow-up turn (waking it); a
 * running agent receives steering for its next step boundary. The agent loop
 * owns the durable `user/message` event when it claims the message, so this
 * seam never appends session-log events itself.
 * @module dsh-yuyi
 */

import { hostname } from 'node:os'
import type { Context } from '@deepseek-ai/cordis'
import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import z from '@deepseek-ai/schemastery'
import { credentialRef } from '@deepseek-ai/dsh-credentials'
import { installSettingsSection, settingsNamespace } from '@deepseek-ai/dsh-settings'
import { launchEnvironmentOf } from '@deepseek-ai/dsh-launch-environment'
import type { Agent } from '@deepseek-ai/dsh-agent'
import { createUserMessage } from '@deepseek-ai/dsh-llm'
import type { SessionId } from '@deepseek-ai/dsh-session/types'
import {
  HubClient,
  formatHubTaskIndex,
  matchSession,
  newID,
  parseAddress,
  yuyiEnv,
  append as inboxAppend,
  count as inboxCount,
  take as inboxTake,
  type InboxEntry,
  type PeerDevice,
  type RosterSession,
  type YuyiMessage,
} from './core.ts'
import { deliverySummary, formatIncoming } from './delivery.ts'
import { YuyiError } from './types.ts'
import type {
  YuyiConfig, YuyiDeliveryRoute, YuyiReplyResult, YuyiRosterEntry,
  YuyiSendRequest, YuyiSendResult, YuyiStatus,
} from './types.ts'


export { YuyiError }
export type {
  YuyiConfig, YuyiDeliveryRoute, YuyiErrorCode, YuyiReplyResult, YuyiRosterEntry,
  YuyiSendRequest, YuyiSendResult, YuyiStatus,
} from './types.ts'
export { formatIncoming, deliverySummary } from './delivery.ts'
export type { InboxEntry, PeerDevice, YuyiMessage } from './core.ts'


declare module '@deepseek-ai/cordis' {
  interface Context {
    /** The yuyi communication service (provided by this package's plugin). */
    yuyi: YuyiRuntime
  }
}

/** Default wait for an expected reply before the send-with-reply method fails. */
const DEFAULT_REPLY_TIMEOUT_MS = 300_000

/** Settings namespace this seam registers; user edits land as live reconnects. */
const SETTINGS_NAMESPACE = settingsNamespace('yuyi')

/** Inbox key for messages that match no roster session (device-level parking). */
const DEVICE_INBOX_KEY = 'device'

/** One registered expect-reply waiter. */
interface PendingReply {
  resolve: (message: YuyiMessage) => void
  reject: (err: Error) => void
  timer: ReturnType<typeof setTimeout>
}

/**
 * The yuyi communication service, registered as `ctx.yuyi` (one instance per
 * process; mounted on the host plane). The service is dormant until hub and
 * token resolve; {@link YuyiRuntime.status} reports the resolution, and every
 * hub-reaching method throws {@link YuyiError} with a stable code otherwise.
 */
export default class YuyiRuntime extends TypertRemoteService {
  /** Plugin configuration schema; defaults live on the schema fields. */
  static Config: z<YuyiConfig> = z.object({
    hub: z.string(),
    tokenEnv: z.string().default('YUYI_TOKEN'),
    device: z.string(),
    replyTimeoutMs: z.number().default(DEFAULT_REPLY_TIMEOUT_MS),
  })

  /** Required services: the agent registry delivery routing resolves against. */
  static inject = ['agents']

  private settingsSource: () => YuyiConfig
  private readonly roster = new Map<string, YuyiRosterEntry>()
  private readonly aliasToSession = new Map<string, string>()
  private readonly pendingReplies = new Map<string, PendingReply>()
  private client: HubClient | undefined
  private hubUrl = ''
  private tokenFound = false
  private hubUnread: number | undefined
  private lastStatusJson: string | undefined
  /** Set when the connection teardown ran; a queued reconnect must not raise a client after it. */
  private disposed = false
  /** Serializes connection cycles so a settings change racing a pending start cannot leak a client. */
  private connectionTail: Promise<void> = Promise.resolve()
  private resolvedDevice: string

  /**
   * @param ctx - plugin context carrying the agent registry.
   * @param config - validated plugin configuration; doubles as the composition
   * `base` layer under the user-settings section this constructor registers.
   */
  constructor(ctx: Context, config: YuyiConfig) {
    super(ctx, 'yuyi')
    this.settingsSource = () => config
    this.resolvedDevice = this.resolveDevice()
    // The user-settings document owns the editable layer over the composition
    // entry: every committed change — and a settings provider attaching or
    // detaching — restarts the hub connection under the newly resolved values.
    installSettingsSection(ctx, SETTINGS_NAMESPACE, YuyiRuntime.Config, config, {
      setSource: (source) => { this.settingsSource = source },
      onChange: () => { void this.reconnect() },
    })
    ctx.effect(() => () => {
      this.disposed = true
      this.stop()
    }, 'dsh-yuyi: connection')
    void this.reconnect()
  }

  /**
   * The recomputed connection snapshot.
   * @returns the current status.
   */
  @Remote('status')
  status(): YuyiStatus {
    const client = this.client
    return {
      configured: this.hubUrl.length > 0 && this.tokenFound,
      connected: client?.connected === true,
      hub: this.hubUrl,
      device: this.resolvedDevice,
      ...(client?.agentId !== undefined ? { agentId: client.agentId } : {}),
      ...(client?.agentName !== undefined ? { agentName: client.agentName } : {}),
      ...(client?.ownerUsername !== undefined ? { ownerUsername: client.ownerUsername } : {}),
      ...(client?.role !== undefined ? { role: client.role } : {}),
      ...(client?.lastError !== undefined ? { lastError: client.lastError } : {}),
      /* v8 ignore next -- hubUnread becomes defined only through the 30s
         heartbeat callback ignored above; no unit fork can advance it. */
      ...(this.hubUnread !== undefined ? { hubUnread: this.hubUnread } : {}),
      deviceUnread: inboxCount(DEVICE_INBOX_KEY),
      sessions: [...this.roster.values()],
    }
  }

  /**
   * Register one session into the local roster and push it to the hub. Throws
   * {@link YuyiError} `YUYI_DUPLICATE_ALIAS` when another session already
   * holds the alias. The disposer unregisters the session.
   * @param sessionId - the session to register.
   * @param info - roster facts shown to peers and used for alias addressing.
   * @returns the disposer that unregisters the session.
   */
  register(sessionId: SessionId, info: { readonly title: string; readonly directory: string; readonly name?: string }): () => void {
    const aliasKey = info.name?.toLowerCase()
    if (aliasKey !== undefined) {
      const holder = this.aliasToSession.get(aliasKey)
      if (holder !== undefined && holder !== sessionId) {
        throw new YuyiError(
          `yuyi: alias "${info.name}" is already registered by session "${holder}"`,
          'YUYI_DUPLICATE_ALIAS',
        )
      }
    }
    const dispose = this.ctx.effect(() => {
      this.roster.set(sessionId, { sessionId, ...info })
      if (aliasKey !== undefined) this.aliasToSession.set(aliasKey, sessionId)
      this.pushRoster()
      this.emitStatus()
      return () => {
        this.roster.delete(sessionId)
        if (aliasKey !== undefined && this.aliasToSession.get(aliasKey) === sessionId) {
          this.aliasToSession.delete(aliasKey)
        }
        this.pushRoster()
        this.emitStatus()
      }
    }, 'dsh-yuyi: roster registration')
    // ctx.effect's disposer resolves when unloaded; the roster API is a
    // synchronous fire-and-forget disposer, so discard the settled promise.
    return () => { void dispose() }
  }

  /**
   * The alias a session registered under, if any.
   * @param sessionId - the session to look up.
   * @returns the alias, or undefined for an unregistered or anonymous session.
   */
  aliasOf(sessionId: SessionId): string | undefined {
    return this.roster.get(sessionId)?.name
  }

  /**
   * Send one message through the hub and await its delivery ack.
   * @param request - the message request; `from` fields fill from the roster.
   * @returns the ack's delivery outcome.
   * @throws {YuyiError} `YUYI_NOT_CONFIGURED`, `YUYI_NOT_CONNECTED`, or `YUYI_SEND_REJECTED`.
   */
  async send(request: YuyiSendRequest): Promise<YuyiSendResult> {
    const message = this.buildMessage(request)
    const ack = await this.dispatch(message)
    const result: YuyiSendResult = {
      message,
      messageId: message.id,
      ...(ack.deliveredAs !== undefined ? { deliveredAs: ack.deliveredAs } : {}),
      ...(ack.handlerSessionID !== undefined ? { handlerSessionID: ack.handlerSessionID } : {}),
    }
    return result
  }

  /**
   * Send one `expectReply` message and wait for the matching reply delivery.
   * The wait ends at the first of: the reply arrives, `replyTimeoutMs` elapses
   * (`YUYI_REPLY_TIMEOUT`), or `signal` aborts (`YUYI_REPLY_ABORTED`).
   * @param request - the message request; `expectReply` is forced on.
   * @param signal - optional cancellation signal for the wait.
   * @returns the sent message and the correlated reply.
   * @throws {YuyiError} the `send` failures, `YUYI_REPLY_TIMEOUT`, or `YUYI_REPLY_ABORTED`.
   */
  async sendExpectingReply(request: YuyiSendRequest, signal?: AbortSignal): Promise<YuyiReplyResult> {
    const message = this.buildMessage({ ...request, expectReply: true })
    const timeoutMs = this.settingsSource().replyTimeoutMs
    // The waiter registers BEFORE the send: a fast hub may deliver the reply
    // immediately after the ack, and a waiter registered only after `dispatch`
    // resolves would miss that delivery entirely.
    const reply = await new Promise<YuyiMessage>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pendingReplies.delete(message.id)
        reject(new YuyiError(
          `yuyi: no reply to message "${message.id}" within ${String(timeoutMs)}ms`,
          'YUYI_REPLY_TIMEOUT',
        ))
      }, timeoutMs)
      const waiter: PendingReply = {
        resolve: (value) => {
          clearTimeout(timer)
          signal?.removeEventListener('abort', onAbort)
          resolve(value)
        },
        reject: (err) => {
          clearTimeout(timer)
          signal?.removeEventListener('abort', onAbort)
          reject(err)
        },
        timer,
      }
      const onAbort = (): void => {
        this.pendingReplies.delete(message.id)
        waiter.reject(new YuyiError('yuyi: reply wait aborted', 'YUYI_REPLY_ABORTED'))
      }
      signal?.addEventListener('abort', onAbort, { once: true })
      this.pendingReplies.set(message.id, waiter)
      this.dispatch(message).catch((error: unknown) => {
        this.pendingReplies.delete(message.id)
        /* v8 ignore next -- the non-Error fallback arm: dispatch rejects only
           with YuyiError at this typed same-process boundary. */
        waiter.reject(error instanceof Error ? error : new Error(String(error)))
      })
    })
    return { sent: message, reply }
  }

  /**
   * Read one local inbox: a session's parked messages or the device inbox.
   * @param target - the session whose inbox to read, or `'device'`.
   * @param peek - true to leave messages in the inbox; false clears them.
   * @returns the inbox entries, oldest first.
   */
  @Remote('inbox')
  inboxRead(target: SessionId | 'device', peek?: boolean): InboxEntry[] {
    return inboxTake(target, peek === true)
  }

  /**
   * List the devices and sessions currently reachable through the hub.
   * @returns one entry per connected device with its roster sessions.
   * @throws {YuyiError} `YUYI_NOT_CONFIGURED` or `YUYI_NOT_CONNECTED`.
   */
  @Remote('peers')
  async peers(): Promise<PeerDevice[]> {
    return await this.requireConnected().peers()
  }

  /**
   * Drain the hub-side inbox for this connection's agent (at-least-once;
   * entries stay until {@link YuyiRuntime.hubInboxAck} clears them).
   * @returns every pending hub inbox entry.
   * @throws {YuyiError} `YUYI_NOT_CONFIGURED` or `YUYI_NOT_CONNECTED`.
   */
  async hubInboxDrain(): Promise<InboxEntry[]> {
    const frame = await this.requireConnected().inboxDrain()
    return frame.map(entry => ({ message: entry.message, receivedAt: entry.receivedAt }))
  }

  /**
   * Fetch the hub-side participation index for one task (participants, round
   * count, time window) formatted for display. Requires the hub `task` feature.
   * @param taskId - the task to look up.
   * @returns the formatted index, or undefined when the hub has no record.
   * @throws {YuyiError} `YUYI_NOT_CONFIGURED` or `YUYI_NOT_CONNECTED`.
   */
  async taskIndex(taskId: string): Promise<string | undefined> {
    const task = await this.requireConnected().taskFetch(taskId)
    return task !== undefined ? formatHubTaskIndex(task) : undefined
  }

  /**
   * Acknowledge hub inbox messages as consumed; the hub deletes them.
   * @param ids - the message ids consumed.
   * @throws {YuyiError} `YUYI_NOT_CONFIGURED`, `YUYI_NOT_CONNECTED`, or `YUYI_SEND_REJECTED` on a hub refusal.
   */
  async hubInboxAck(ids: string[]): Promise<void> {
    const ack = await this.requireConnected().inboxAck(ids)
    if (!ack.ok) {
      throw new YuyiError(`yuyi: hub rejected inbox ack: ${ack.detail ?? 'no detail'}`, 'YUYI_SEND_REJECTED')
    }
  }

  private launchValue(name: string): string | undefined {
    const hit = launchEnvironmentOf(this.ctx).get(name)
    return hit !== undefined && hit.value.length > 0 ? hit.value : undefined
  }

  private async resolveToken(): Promise<string | undefined> {
    const tokenEnv = this.settingsSource().tokenEnv
    const credentials = this.ctx.get('credentials')
    if (credentials !== undefined) {
      const hit = await credentials.resolve(credentialRef(tokenEnv))
      if (hit !== undefined) return hit.value
    }
    return this.launchValue(tokenEnv) ?? yuyiEnv(tokenEnv)
  }

  /** The device identity under the current settings source; hostname when nothing names one. */
  private resolveDevice(): string {
    return this.settingsSource().device
      ?? this.launchValue('YUYI_DEVICE')
      ?? yuyiEnv('YUYI_DEVICE')
      ?? hostname()
  }

  /**
   * Stop and start the hub connection under the currently resolved settings,
   * serialized behind any in-flight cycle: a settings change landing while a
   * start still awaits its token must stop that start's outcome, not race it.
   * Expect-reply waiters outstanding on the old connection abort with
   * `YUYI_REPLY_ABORTED`.
   * @returns settlement after the replacement connection attempt finishes.
   */
  private reconnect(): Promise<void> {
    /* v8 ignore next -- the catch arm keeps one failed cycle from poisoning
       the queue; no current start() path rejects, matching the settings write
       queue's chain-past-failure discipline. */
    const run = this.connectionTail.catch(() => undefined).then(async () => {
      if (this.disposed) return
      this.stop()
      await this.start()
    })
    this.connectionTail = run
    return run
  }

  private async start(): Promise<void> {
    this.resolvedDevice = this.resolveDevice()
    const hub = this.settingsSource().hub ?? this.launchValue('YUYI_HUB') ?? yuyiEnv('YUYI_HUB') ?? ''
    const token = await this.resolveToken().catch((error: unknown) => {
      this.ctx.logger.warn('yuyi: token resolution failed', error)
      return undefined
    })
    // Token resolution can straddle the teardown; a disposed runtime leaves
    // the connection down instead of raising a client nothing will stop.
    if (this.disposed) return
    this.hubUrl = hub
    this.tokenFound = token !== undefined && token.length > 0
    this.emitStatus()
    if (hub.length === 0 || token === undefined || token.length === 0) return
    this.client = new HubClient({
      url: hub,
      device: this.resolvedDevice,
      instanceID: newID('dsh'),
      token,
      agentKind: 'dsh',
      capabilities: { wake: true },
      onDeliver: this.handleDeliver,
      /* v8 ignore next 3 -- hub unread arrives only from the 30s heartbeat
         probe; a real socket cannot advance that clock inside a unit fork. */
      onUnreadMail: (count) => {
        this.hubUnread = count
        this.emitStatus()
      },
      // HubClient logs exactly at state transitions; recompute and emit after
      // each so listeners observe settled fields without polling.
      log: (message) => {
        this.ctx.logger.info(`yuyi: ${message}`)
        this.emitStatus()
      },
    })
    this.client.start()
  }

  private stop(): void {
    this.client?.stop()
    this.client = undefined
    for (const [, waiter] of this.pendingReplies) {
      clearTimeout(waiter.timer)
      waiter.reject(new YuyiError('yuyi: service stopped', 'YUYI_REPLY_ABORTED'))
    }
    this.pendingReplies.clear()
    this.emitStatus()
  }

  private buildMessage(request: YuyiSendRequest): YuyiMessage {
    const entry = request.fromSession !== undefined ? this.roster.get(request.fromSession) : undefined
    return {
      id: newID('msg'),
      mode: request.mode,
      text: request.text,
      from: {
        device: this.resolvedDevice,
        sessionID: entry?.sessionId ?? 'dsh',
        ...(entry?.name !== undefined ? { name: entry.name } : {}),
      },
      to: parseAddress(request.to),
      time: Date.now(),
      ...(request.taskId !== undefined ? { taskId: request.taskId } : {}),
      ...(request.replyTo !== undefined ? { replyTo: request.replyTo } : {}),
      ...(request.expectReply === true ? { expectReply: true } : {}),
      ...(request.classification !== undefined ? { classification: request.classification } : {}),
      ...(request.contextHint !== undefined ? { contextHint: request.contextHint } : {}),
    }
  }

  private async dispatch(message: YuyiMessage): Promise<{ deliveredAs?: 'notify' | 'mail_fallback'; handlerSessionID?: string }> {
    const ack = await this.requireConnected().send(message)
    if (!ack.ok) {
      throw new YuyiError(
        `yuyi: hub rejected send to "${message.to.target}": ${ack.detail ?? 'no detail'}`,
        'YUYI_SEND_REJECTED',
      )
    }
    if (message.replyTo !== undefined) this.trace(message.id, 'replied', message.taskId)
    return {
      ...(ack.deliveredAs !== undefined ? { deliveredAs: ack.deliveredAs } : {}),
      ...(ack.handlerSessionID !== undefined ? { handlerSessionID: ack.handlerSessionID } : {}),
    }
  }

  private requireConnected(): HubClient {
    const client = this.client
    if (client === undefined || this.hubUrl.length === 0 || !this.tokenFound) {
      throw new YuyiError(
        `yuyi: not configured (hub ${this.hubUrl.length > 0 ? 'set' : 'missing'}, token reference ${this.settingsSource().tokenEnv});`
        + ' set the "hub" config or YUYI_HUB, and store the token through the credentials service or the environment',
        'YUYI_NOT_CONFIGURED',
      )
    }
    if (!client.connected) {
      throw new YuyiError(`yuyi: hub not connected (${client.lastError ?? this.hubUrl})`, 'YUYI_NOT_CONNECTED')
    }
    return client
  }

  private trace(msgId: string, event: 'injected' | 'replied', detail?: string): void {
    this.client?.trace(msgId, event, detail)
  }

  private toRosterSession(entry: YuyiRosterEntry): RosterSession {
    return {
      sessionID: entry.sessionId,
      title: entry.title,
      directory: entry.directory,
      capabilities: { wake: true },
      ...(entry.name !== undefined ? { name: entry.name } : {}),
    }
  }

  private findByTarget(target: string): YuyiRosterEntry | undefined {
    for (const entry of this.roster.values()) {
      if (matchSession(this.toRosterSession(entry), target)) return entry
    }
    return undefined
  }

  private readonly handleDeliver = (message: YuyiMessage): Promise<{ ok: boolean; detail?: string; handlerSessionID?: string }> =>
    Promise.resolve(this.routeDelivery(message))

  private routeDelivery(message: YuyiMessage): { ok: boolean; detail?: string; handlerSessionID?: string } {
    // Reply correlation runs before routing: a reply that matches an
    // expect-reply waiter is consumed by that waiter (it returns as the
    // blocked caller's tool result), so routing it again would deliver the
    // same text twice.
    if (message.replyTo !== undefined) {
      const waiter = this.pendingReplies.get(message.replyTo)
      if (waiter !== undefined) {
        this.pendingReplies.delete(message.replyTo)
        waiter.resolve(message)
        this.trace(message.id, 'injected', 'reply-waiter')
        return { ok: true, detail: 'consumed by expect-reply waiter' }
      }
    }
    if (message.to.target === '*' && message.from.device === this.resolvedDevice) {
      this.emitDelivered(message, 'echo-dropped')
      return { ok: true, detail: 'own-device broadcast echo dropped' }
    }
    const entry = this.findByTarget(message.to.target)
    if (entry === undefined) {
      inboxAppend(DEVICE_INBOX_KEY, message)
      this.emitDelivered(message, 'device-inbox')
      return { ok: true, detail: 'no local roster match; parked in device inbox' }
    }
    if (message.mode === 'mail') {
      inboxAppend(entry.sessionId, message)
      this.emitDelivered(message, 'session-inbox', entry.sessionId)
      return { ok: true, handlerSessionID: entry.sessionId, detail: 'parked in session inbox' }
    }
    const agent: Agent | undefined = this.ctx.agents.get(entry.sessionId)
    if (agent === undefined) {
      inboxAppend(entry.sessionId, message)
      this.emitDelivered(message, 'session-inbox', entry.sessionId)
      return { ok: true, handlerSessionID: entry.sessionId, detail: 'session not live; parked in session inbox' }
    }
    const userMessage = createUserMessage({
      content: [{ type: 'text', text: formatIncoming(message) }],
      source: {
        kind: 'plugin',
        plugin: 'dsh-yuyi',
        form: 'notice',
        summary: deliverySummary(message),
      },
    })
    if (agent.status === 'idle') {
      agent.followup(userMessage)
      this.trace(message.id, 'injected', 'followup')
      this.emitDelivered(message, 'woken', entry.sessionId)
    } else {
      agent.steer(userMessage)
      this.trace(message.id, 'injected', 'steer')
      this.emitDelivered(message, 'steered', entry.sessionId)
    }
    return { ok: true, handlerSessionID: entry.sessionId }
  }

  private pushRoster(): void {
    this.client?.updateRoster([...this.roster.values()].map(entry => this.toRosterSession(entry)))
  }

  private emitDelivered(message: YuyiMessage, route: YuyiDeliveryRoute, sessionId?: SessionId): void {
    this.ctx.emit('yuyi/delivered', { message, route, ...(sessionId !== undefined ? { sessionId } : {}) })
    if (route === 'session-inbox' || route === 'device-inbox') this.emitStatus()
  }

  private emitStatus(): void {
    const status = this.status()
    const json = JSON.stringify(status)
    if (json === this.lastStatusJson) return
    this.lastStatusJson = json
    this.ctx.emit('yuyi/status', { status })
  }
}
