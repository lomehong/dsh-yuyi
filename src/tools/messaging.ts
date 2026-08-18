/**
  * 五个消息工具（`yuyi_status`、`yuyi_register`、`yuyi_peers`、
  * `yuyi_send`、`yuyi_inbox`），构建在 `ctx.yuyi` 上。规范值是
  * 结构化事实；`output.render` 承载模型侧文案。
 * @module dsh-yuyi/tools/messaging
 */

import type { Context } from '@deepseek-ai/cordis'
import type { Agent } from '@deepseek-ai/dsh-agent'
import type { SessionId } from '@deepseek-ai/dsh-session/types'
import { defineTool } from '@deepseek-ai/dsh-tools'
import type { InboxEntry, PeerDevice, YuyiStatus } from '../service.ts'
import type YuyiRuntime from '../service.ts'
import { recordTaskReply, recordTaskRequest, type TaskRecordOutcome } from './task-record.ts'

/* * `yuyi_status` 中模型视角的一行 roster。 */
export interface StatusSessionRow {
  sessionId: string
  title: string
  name?: string
}

/* * `yuyi_status` 的规范值。 */
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

/* * `yuyi_peers` 的规范值。 */
export interface PeersValue {
  devices: PeerDevice[]
}

/* * 模型视角的一行收件箱。 */
export interface InboxRow {
  id: string
  from: string
  to: string
  mode: string
  text: string
  receivedAt: number
}

/* * `yuyi_inbox` 的规范值。 */
export interface InboxValue {
  target: 'session' | 'device' | 'hub'
  entries: InboxRow[]
}

/* * `yuyi_send` 的规范值。 */
export interface SendValue {
  messageId: string
  deliveredAs?: 'notify' | 'mail_fallback'
  handlerSessionID?: string
  replyText?: string
  replyFrom?: string
  taskRecords?: TaskRecordOutcome[]
}

/* * 解析调用方 agent 的会话 id，否则以工具承诺的契约失败。 */
function sessionOf(agent: Agent | undefined, tool: string): SessionId {
  if (agent === undefined) {
    throw new Error(`${tool} requires a session-scoped agent; call it from a live session`)
  }
  return agent.id
}

/**
  * 把状态快照渲染为紧凑散文。
  * @param value - 状态快照。
  * @returns 渲染出的文本。
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
  * 渲染一份 peer 列表。
  * @param value - 设备与会话。
  * @returns 渲染出的文本。
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
  * 渲染一次收件箱读取。
  * @param value - 收件箱目标与条目。
  * @returns 渲染出的文本。
 */
export function renderInbox(value: InboxValue): string {
  if (value.entries.length === 0) return `${value.target} inbox is empty`
  const blocks = value.entries.map(entry => `[${entry.id}] from ${entry.from} (${entry.mode})\n${entry.text}`)
  return blocks.join('\n---\n')
}

/* * 把一个收件箱条目映射为其规范行。 */
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

/* * peer 身份渲染出的标签；不带身份的线路消息为 `unknown`。 */
function peerLabel(from: { name?: string; sessionID?: string; device: string }): string {
  const identity = from.name ?? from.sessionID ?? 'unknown'
  return from.device.length > 0 ? `${identity}@${from.device}` : identity
}

/**
  * 在调用上下文的工具注册表上注册五个消息工具。
  * @param ctx - 插件上下文（工具注册表与 yuyi 服务在场）。
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
    description: 'Register this session into the yuyi roster so agent-level deliveries have a '
      + 'session to land on. With an authoritative yufu agent name the alias is a local label '
      + 'only: peers address you by that agent name (see yuyi_status), never by this alias.',
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
      + 'blocks until the reply arrives or the configured timeout. Addressing: the peer\'s '
      + 'authoritative yufu agent name (see yuyi_peers), a session id, `device:target`, '
      + '`owner/device:target`, or `*` for broadcast.',
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
          // 请求事件创建记录；回信事件随后而至。
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
