/**
 * Pure presentation helpers for incoming deliveries: the text an injected
 * user message carries and its source summary. Pure functions of the message;
 * no I/O, no session state — they run on live delivery and must stay
 * deterministic for replayed audits.
 * @module dsh-yuyi/delivery
 */

import type { YuyiMessage } from './core.ts'

/** Label the sender by the most specific identity the hub endorsed. */
function senderLabel(message: YuyiMessage): string {
  const from = message.from
  const identity = from.name ?? from.sessionID
  return from.device.length > 0 ? `${identity}@${from.device}` : identity
}

/**
 * Format one incoming message as the text a woken session's model reads.
 * One header line carrying the endorsed identity and threading fields, then
 * the body verbatim.
 * @param message - the delivered message, hub-authoritative fields already set.
 * @returns the injected text.
 */
export function formatIncoming(message: YuyiMessage): string {
  const parts: string[] = [`[yuyi] from ${senderLabel(message)}`]
  if (message.from.ownerUsername !== undefined) parts.push(`owner ${message.from.ownerUsername}`)
  if (message.from.role !== undefined) parts.push(`role ${message.from.role}`)
  if (message.replyTo !== undefined) parts.push(`reply-to ${message.replyTo}`)
  if (message.taskId !== undefined) parts.push(`task ${message.taskId}`)
  return `${parts.join(' · ')}\n${message.text}`
}

/**
 * One-line summary of a delivery for the message-source metadata.
 * @param message - the delivered message.
 * @returns the summary string.
 */
export function deliverySummary(message: YuyiMessage): string {
  return `${senderLabel(message)} → ${message.to.target}`
}
