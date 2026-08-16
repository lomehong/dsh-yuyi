/**
 * Public types of the yuyi capability seam: the status snapshot, roster entry,
 * send request and result, delivery routes, and the seam's error class.
 * @module dsh-yuyi/types
 */

import type { SessionId } from '@deepseek-ai/dsh-session/types'
import { HarnessError } from '@deepseek-ai/dsh-llm'
import type { YuyiMessage } from './core.ts'

/** Stable failure codes of the yuyi seam; route on these, never on message prose. */
export type YuyiErrorCode =
  | 'YUYI_NOT_CONFIGURED'
  | 'YUYI_NOT_CONNECTED'
  | 'YUYI_DUPLICATE_ALIAS'
  | 'YUYI_SEND_REJECTED'
  | 'YUYI_REPLY_TIMEOUT'
  | 'YUYI_REPLY_ABORTED'

/**
 * A failure surfaced by the yuyi seam with a stable machine-routable code.
 * Constructed as `new YuyiError(message, code[, options])`.
 */
export class YuyiError extends HarnessError {}

declare module '@deepseek-ai/cordis' {
  interface Events {
    /**
     * The recomputed yuyi connection snapshot changed (configuration resolved,
     * handshake completed or lost, unread counts moved). Listener failures are
     * contained.
     * @param payload.status - the fresh status snapshot.
     * @mode emit
     */
    'yuyi/status'(payload: { status: YuyiStatus }): void
    /**
     * One delivered message was routed locally. Emitted after the routing
     * decision (wake, steer, or inbox parking) was made; the durable
     * transcript event for a woken session is owned by the agent loop.
     * Listener failures are contained.
     * @param payload.message - the delivered message as the hub endorsed it.
     * @param payload.route - the local routing decision.
     * @param payload.sessionId - the roster session the message targeted, when one matched.
     * @mode emit
     */
    'yuyi/delivered'(payload: { message: YuyiMessage; route: YuyiDeliveryRoute; sessionId?: SessionId }): void
  }
}

/**
 * Config for the yuyi seam. `hub`, `device`, and the token reference resolve
 * from config first, then the launch environment (`YUYI_HUB`, `YUYI_DEVICE`,
 * and the `tokenEnv` name), then the yuyi env file (`~/.yuyi/env`, the file
 * the hub installer writes); the device falls back to the hostname.
 */
export interface YuyiConfig {
  /** Explicit hub WebSocket URL; omitted resolves from the environment chain. */
  readonly hub?: string
  /** Credential reference name holding the Yufu agent token. */
  readonly tokenEnv: string
  /** Explicit device label; omitted resolves from the environment chain or hostname. */
  readonly device?: string
  /** How long `sendExpectingReply` waits before failing with `YUYI_REPLY_TIMEOUT`. */
  readonly replyTimeoutMs: number
}

/** One session registered into the local roster; the addressable unit for delivery. */
export interface YuyiRosterEntry {
  /** The registered session's id; also its plain-string inbox key. */
  readonly sessionId: SessionId
  /** Short human label, shown to remote peers. */
  readonly title: string
  /** Working directory of the session, shown to remote peers. */
  readonly directory: string
  /** Alias other agents may address this session by; unique per process. */
  readonly name?: string
}

/** How one delivered message was routed locally. */
export type YuyiDeliveryRoute =
  | 'woken'
  | 'steered'
  | 'session-inbox'
  | 'device-inbox'
  | 'echo-dropped'

/** Connection-level facts recomputed on every state transition. */
export interface YuyiStatus {
  /** Whether hub and token resolved; false means the seam stays dormant. */
  readonly configured: boolean
  /** Whether the handshake completed (a welcome frame arrived). */
  readonly connected: boolean
  /** The resolved hub WebSocket URL, or the empty string when unresolved. */
  readonly hub: string
  /** The device label this connection reports. */
  readonly device: string
  /** Hub-reported agent id (authoritative identity); absent before welcome. */
  readonly agentId?: string
  /** Hub-reported agent name (authoritative identity); absent before welcome. */
  readonly agentName?: string
  /** Hub-reported owner username; absent before welcome. */
  readonly ownerUsername?: string
  /** Hub-reported role (avatar/worker/coder); absent before welcome. */
  readonly role?: string
  /** The most recent connection error description, if any. */
  readonly lastError?: string
  /** Hub-side unread mail count from the last heartbeat, when known. */
  readonly hubUnread?: number
  /** Local device-inbox unread count (parked messages with no roster match). */
  readonly deviceUnread: number
  /** The current local roster, in registration order. */
  readonly sessions: readonly YuyiRosterEntry[]
}

/** A request to send one message through the hub. */
export interface YuyiSendRequest {
  /** Address: `*`, alias, session id, `device:target`, or `owner/device:target`. */
  readonly to: string
  /** Message body the recipient's model will read. */
  readonly text: string
  /** `notify` wakes the recipient; `mail` parks in an inbox. */
  readonly mode: 'notify' | 'mail'
  /** Sending session; fills the authoritative `from` fields when registered. */
  readonly fromSession?: SessionId
  /** A2A task id the reply thread belongs to. */
  readonly taskId?: string
  /** Message id this message responds to. */
  readonly replyTo?: string
  /** Request an automatic reply from the recipient. */
  readonly expectReply?: boolean
  /** Data classification hint (e.g. `high-risk`) for hub-side policy. */
  readonly classification?: string
  /** Weak delivery hint rendered by peers; never used for routing. */
  readonly contextHint?: string
}

/** The delivery outcome the hub acknowledged for one sent message. */
export interface YuyiSendResult {
  /** The message as built and acknowledged, for durable task records. */
  readonly message: YuyiMessage
  /** The id of the sent message; the idempotency key for retries and task records. */
  readonly messageId: string
  /** `notify` for live delivery, `mail_fallback` when degraded to inbox; absent for other acks. */
  readonly deliveredAs?: 'notify' | 'mail_fallback'
  /** Session id the recipient side reported as handler, when reported. */
  readonly handlerSessionID?: string
}

/** The outcome of one send-with-reply exchange. */
export interface YuyiReplyResult {
  /** The message this side sent, as built and acknowledged. */
  readonly sent: YuyiMessage
  /** The correlated reply, as the hub endorsed it. */
  readonly reply: YuyiMessage
}
