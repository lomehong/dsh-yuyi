/**
 * The five messaging tools (`yuyi_status`, `yuyi_register`, `yuyi_peers`,
 * `yuyi_send`, `yuyi_inbox`) over `ctx.yuyi`. Canonical values are the
 * structured facts; `output.render` carries the model-facing prose.
 * @module dsh-yuyi/tools/messaging
 */

import type { Context } from '@deepseek-ai/cordis'
import type { Agent } from '@deepseek-ai/dsh-agent'
import type { SessionId } from '@deepseek-ai/dsh-session/types'
import { defineTool } from '@deepseek-ai/dsh-tools'
import type { InboxEntry, PeerDevice, YuyiStatus } from '../service.ts'
import type YuyiRuntime from '../service.ts'
import { recordTaskReply, recordTaskRequest, type TaskRecordOutcome } from './task-record.ts'

/** One roster row as the model sees it in `yuyi_status`. */
export interface StatusSessionRow {
  sessionId: string
  title: string
  name?: string
}

/** Canonical value of `yuyi_status`. */
export interface StatusValue {
  configured: boolean
  connected: boolean
  hub: string
  device: string
  agentName?: string
  ownerUsername?: string
  role?: string
  lastError?: string
  deviceUnread: number
  sessions: StatusSessionRow[]
}

/** Canonical value of `yuyi_peers`. */
export interface PeersValue {
  devices: PeerDevice[]
}

/** One inbox row as the model sees it. */
export interface InboxRow {
  id: string
  from: string
  to: string
  mode: string
  text: string
  receivedAt: number
}

/** Canonical value of `yuyi_inbox`. */
export interface InboxValue {
  target: 'session' | 'device' | 'hub'
  entries: InboxRow[]
}

/** Canonical value of `yuyi_send`. */
export interface SendValue {
  messageId: string
  deliveredAs?: 'notify' | 'mail_fallback'
  handlerSessionID?: string
  replyText?: string
  replyFrom?: string
  taskRecords?: TaskRecordOutcome[]
}

/** Resolve the calling agent's session id, or fail with the contract the tools promise. */
function sessionOf(agent: Agent | undefined, tool: string): SessionId {
  if (agent === undefined) {
    throw new Error(`${tool} requires a session-scoped agent; call it from a live session`)
  }
  return agent.id
}

/**
 * Render the status snapshot as compact prose.
 * @param value - the status snapshot.
 * @returns the rendered text.
 */
export function renderStatus(value: StatusValue): string {
  const identity = [`device ${value.device}`]
  if (value.agentName !== undefined) identity.push(`agent ${value.agentName}`)
  if (value.ownerUsername !== undefined) identity.push(`owner ${value.ownerUsername}`)
  if (value.role !== undefined) identity.push(`role ${value.role}`)
  const lines = [
    `yuyi ${value.connected ? 'connected' : value.configured ? 'configured, disconnected' : 'not configured'}`,
    identity.join(' · '),
  ]
  if (value.lastError !== undefined) lines.push(`last error: ${value.lastError}`)
  lines.push(`device inbox unread: ${String(value.deviceUnread)}`)
  for (const session of value.sessions) {
    lines.push(`session ${session.name ?? session.sessionId} — ${session.title}`)
  }
  return lines.join('\n')
}

/**
 * Render one peer listing.
 * @param value - the devices and sessions.
 * @returns the rendered text.
 */
export function renderPeers(value: PeersValue): string {
  if (value.devices.length === 0) return 'no devices are reachable through the hub'
  const lines: string[] = []
  for (const device of value.devices) {
    lines.push(`device ${device.device}${device.role !== undefined ? ` (role ${device.role})` : ''}`)
    for (const session of device.sessions) {
      lines.push(`  - ${session.name ?? session.sessionID}: ${session.title}`)
    }
  }
  return lines.join('\n')
}

/**
 * Render one inbox read.
 * @param value - the inbox target and entries.
 * @returns the rendered text.
 */
export function renderInbox(value: InboxValue): string {
  if (value.entries.length === 0) return `${value.target} inbox is empty`
  const blocks = value.entries.map(entry => `[${entry.id}] from ${entry.from} (${entry.mode})\n${entry.text}`)
  return blocks.join('\n---\n')
}

/** Map one inbox entry to its canonical row. */
function inboxRow(entry: InboxEntry): InboxRow {
  const from = entry.message.from
  const identity = from.name ?? from.sessionID
  return {
    id: entry.message.id,
    from: from.device.length > 0 ? `${identity}@${from.device}` : identity,
    to: entry.message.to.target,
    mode: entry.message.mode,
    text: entry.message.text,
    receivedAt: entry.receivedAt,
  }
}

/** The label a peer's identity renders as; `unknown` for a wire message carrying no identity. */
function peerLabel(from: { name?: string; sessionID?: string; device: string }): string {
  const identity = from.name ?? from.sessionID ?? 'unknown'
  return from.device.length > 0 ? `${identity}@${from.device}` : identity
}

/**
 * Register the five messaging tools on the calling context's tool registry.
 * @param ctx - the plugin context (tool registry and yuyi service present).
 */
export function applyMessagingTools(ctx: Context): void {
  const yuyi: YuyiRuntime = ctx.yuyi

  ctx.tools.register(defineTool({
    name: 'yuyi_status',
    description: 'Show the yuyi communication status: hub connection, this device\'s identity, '
      + 'the local roster sessions, and unread parked mail. Call this first when yuyi tools fail.',
    parameters: {},
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          configured: { type: 'boolean', required: true },
          connected: { type: 'boolean', required: true },
          hub: { type: 'string', required: true },
          device: { type: 'string', required: true },
          agentName: { type: 'string' },
          ownerUsername: { type: 'string' },
          role: { type: 'string' },
          lastError: { type: 'string' },
          deviceUnread: { type: 'integer', required: true },
          sessions: {
            type: 'array',
            required: true,
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                sessionId: { type: 'string', required: true },
                title: { type: 'string', required: true },
                name: { type: 'string' },
              },
            },
          },
        },
      },
      render: (_args, value: StatusValue) => [{ type: 'text', text: renderStatus(value) }],
    },
    async execute() {
      const status: YuyiStatus = yuyi.status()
      return {
        configured: status.configured,
        connected: status.connected,
        hub: status.hub,
        device: status.device,
        ...(status.agentName !== undefined ? { agentName: status.agentName } : {}),
        ...(status.ownerUsername !== undefined ? { ownerUsername: status.ownerUsername } : {}),
        ...(status.role !== undefined ? { role: status.role } : {}),
        ...(status.lastError !== undefined ? { lastError: status.lastError } : {}),
        deviceUnread: status.deviceUnread,
        sessions: status.sessions.map(session => ({
          sessionId: session.sessionId,
          title: session.title,
          ...(session.name !== undefined ? { name: session.name } : {}),
        })),
      }
    },
  }))

  ctx.tools.register(defineTool({
    name: 'yuyi_register',
    description: 'Register this session into the yuyi roster under an alias so other agents can '
      + 'address it. Register before expecting wake deliveries; the alias must be unique on this device.',
    parameters: {
      name: { type: 'string', required: true, description: 'Alias other agents address this session by (e.g. "coder-1").' },
      title: { type: 'string', description: 'Short human label shown to peers. Defaults to a session-derived label.' },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          sessionId: { type: 'string', required: true },
          name: { type: 'string', required: true },
        },
      },
      render: (args, value) => [{
        type: 'text',
        text: `registered session ${value.sessionId} as "${value.name}"${args.title !== undefined ? ` (${args.title})` : ''}`,
      }],
    },
    async execute(args, exec) {
      const agent = sessionOf(exec.agent, 'yuyi_register')
      const title = args.title ?? `dsh session ${agent.slice(0, 8)}`
      yuyi.register(agent, { title, directory: '', name: args.name })
      return { sessionId: agent, name: args.name }
    },
  }))

  ctx.tools.register(defineTool({
    name: 'yuyi_peers',
    description: 'List devices and sessions currently reachable through the yuyi hub, grouped by device.',
    parameters: {},
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          devices: {
            type: 'array',
            required: true,
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                device: { type: 'string', required: true },
                instanceID: { type: 'string', required: true },
                agentId: { type: 'string' },
                role: { type: 'string' },
                lastActiveAt: { type: 'integer' },
                sessions: {
                  type: 'array',
                  required: true,
                  items: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      sessionID: { type: 'string', required: true },
                      title: { type: 'string', required: true },
                      directory: { type: 'string', required: true },
                      name: { type: 'string' },
                      capabilities: {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          sandbox: { type: 'string' },
                          network: { type: 'boolean' },
                          wake: { type: 'boolean' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      render: (_args, value: PeersValue) => [{ type: 'text', text: renderPeers(value) }],
    },
    async execute() {
      return { devices: await yuyi.peers() }
    },
  }))

  ctx.tools.register(defineTool({
    name: 'yuyi_inbox',
    description: 'Read parked yuyi mail. `session` reads this session\'s inbox, `device` the '
      + 'device-level inbox for unmatched deliveries, `hub` drains and clears the hub-side agent inbox.',
    parameters: {
      target: { type: 'string', description: 'Which inbox: "session" (default), "device", or "hub".' },
      peek: { type: 'boolean', description: 'Read without clearing the local inbox. Hub reads always clear.' },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          target: { type: 'string', required: true },
          entries: {
            type: 'array',
            required: true,
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                id: { type: 'string', required: true },
                from: { type: 'string', required: true },
                to: { type: 'string', required: true },
                mode: { type: 'string', required: true },
                text: { type: 'string', required: true },
                receivedAt: { type: 'integer', required: true },
              },
            },
          },
        },
      },
      render: (_args, value: InboxValue) => [{ type: 'text', text: renderInbox(value) }],
    },
    async execute(args, exec) {
      const target = args.target === 'device' || args.target === 'hub' ? args.target : 'session'
      let entries: InboxEntry[]
      if (target === 'hub') {
        entries = await yuyi.hubInboxDrain()
        if (entries.length > 0) {
          await yuyi.hubInboxAck(entries.map(entry => entry.message.id))
        }
      } else {
        entries = yuyi.inboxRead(target === 'device' ? 'device' : sessionOf(exec.agent, 'yuyi_inbox'), args.peek === true)
      }
      return { target, entries: entries.map(inboxRow) }
    },
  }))

  ctx.tools.register(defineTool({
    name: 'yuyi_send',
    description: 'Send a yuyi message. `notify` wakes the addressed session (falling back to its '
      + 'inbox when it cannot be woken); `mail` always parks in an inbox. With `expect_reply` the call '
      + 'blocks until the reply arrives or the configured timeout. Addressing: alias, session id, '
      + '`device:target`, `owner/device:target`, or `*` for broadcast.',
    parameters: {
      to: { type: 'string', required: true, description: 'Recipient address.' },
      text: { type: 'string', required: true, description: 'Message body the recipient reads.' },
      mode: { type: 'string', description: '"notify" (default) or "mail".' },
      expect_reply: { type: 'boolean', description: 'Block until the recipient replies.' },
      task_id: { type: 'string', description: 'Record this exchange as a round of a durable task.' },
      reply_to: { type: 'string', description: 'Message id this send responds to.' },
      classification: { type: 'string', description: 'Data classification hint, e.g. "high-risk".' },
      context_hint: { type: 'string', description: 'Weak rendering hint carried alongside the message.' },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          messageId: { type: 'string', required: true },
          deliveredAs: { type: 'string' },
          handlerSessionID: { type: 'string' },
          replyText: { type: 'string' },
          replyFrom: { type: 'string' },
          taskRecords: {
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                recorded: { type: 'boolean', required: true },
                reason: { type: 'string' },
              },
            },
          },
        },
      },
      render: (_args, value: SendValue) => [{
        type: 'text',
        text: value.replyText !== undefined
          ? `reply from ${value.replyFrom as string}:\n${value.replyText}`
          : `sent ${value.messageId}${value.deliveredAs === 'mail_fallback' ? ' (parked in recipient inbox)' : ''}`,
      }],
    },
    async execute(args, exec) {
      const status = yuyi.status()
      const identity = {
        device: status.device,
        ...(status.agentId !== undefined ? { agentId: status.agentId } : {}),
        ...(status.ownerUsername !== undefined ? { ownerUsername: status.ownerUsername } : {}),
      }
      const request = {
        to: args.to,
        text: args.text,
        mode: args.mode === 'mail' ? 'mail' as const : 'notify' as const,
        ...(exec.agent !== undefined ? { fromSession: exec.agent.id } : {}),
        ...(args.task_id !== undefined ? { taskId: args.task_id } : {}),
        ...(args.reply_to !== undefined ? { replyTo: args.reply_to } : {}),
        ...(args.expect_reply === true ? { expectReply: true } : {}),
        ...(args.classification !== undefined ? { classification: args.classification } : {}),
        ...(args.context_hint !== undefined ? { contextHint: args.context_hint } : {}),
      }
      if (args.expect_reply === true) {
        const { sent, reply } = await yuyi.sendExpectingReply(request, exec.signal)
        const value: SendValue = {
          messageId: sent.id,
          replyText: reply.text,
          replyFrom: peerLabel(reply.from),
        }
        if (args.task_id !== undefined) {
          // The request event creates the record; the reply event follows it.
          const outcomes = recordTaskRequest(args.task_id, identity, sent, args.text)
          const replyOutcome = recordTaskReply(args.task_id, reply)
          if (replyOutcome !== undefined) outcomes.push(replyOutcome)
          value.taskRecords = outcomes
        }
        return value
      }
      const result = await yuyi.send(request)
      const value: SendValue = {
        messageId: result.messageId,
        ...(result.deliveredAs !== undefined ? { deliveredAs: result.deliveredAs } : {}),
        ...(result.handlerSessionID !== undefined ? { handlerSessionID: result.handlerSessionID } : {}),
        ...(args.task_id !== undefined ? { taskRecords: recordTaskRequest(args.task_id, identity, result.message, args.text) } : {}),
      }
      return value
    },
  }))
}
