import './env.ts'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Context } from '@deepseek-ai/cordis'
import AgentRegistry from '@deepseek-ai/dsh-agent'
import type { Agent } from '@deepseek-ai/dsh-agent'
import { ToolCallId } from '@deepseek-ai/dsh-llm/brand'
import { SessionId } from '@deepseek-ai/dsh-session'
import SystemPrompt from '@deepseek-ai/dsh-system-prompt'
import ToolRuntime from '@deepseek-ai/dsh-tools'
import type { ToolExecution } from '@deepseek-ai/dsh-tools'
import YuyiRuntime from '../src/service.ts'
import { readTask, type TaskEvent, type YuyiMessage } from '../src/core.ts'
import * as ToolYuyi from '../src/tools/index.ts'
import { FixtureHub } from './fixture-hub.ts'
import { StubCredentials } from './fixture-credentials.ts'
import { LAUNCH_TOKEN } from './env.ts'

// token 唯一来源是 dsh 凭证库。模块顶部注入的环境变量值仅作"污染源存在证据"，
// 不会被解析（这是 2026-08-19 跨 Agent 串用根治的硬保证）。
process.env.YUYI_TOKEN = 'ambient-other-agent-token'

const teardowns: Array<() => Promise<void>> = []

afterEach(async () => {
  while (teardowns.length > 0) {
    const dispose = teardowns.pop()
    if (dispose !== undefined) await dispose()
  }
})

let callCounter = 0
const signal = new AbortController().signal

interface Handle {
  ctx: Context
  execute: (name: string, args: Record<string, unknown>, agent?: Agent) => Promise<unknown>
  agent: Agent
}

async function setupTools(hub: FixtureHub): Promise<Handle> {
  const ctx = new Context()
  await ctx.plugin(SystemPrompt)
  await ctx.plugin(ToolRuntime)
  // 凭证库（stub）等价于"用户在御驿设置界面录入 token 后再启动"。
  const credentialsFiber = await ctx.plugin((child: Context) => {
    new StubCredentials(child, { value: LAUNCH_TOKEN })
  })
  teardowns.push(async () => { await credentialsFiber.dispose() })
  const agentsFiber = await ctx.plugin(AgentRegistry)
  teardowns.push(async () => { await agentsFiber.dispose() })
  const yuyiFiber = await ctx.plugin(YuyiRuntime, { tokenEnv: 'YUYI_TOKEN', device: 'dsh-test-device', hub: hub.url, replyTimeoutMs: 250 })
  teardowns.push(async () => { await yuyiFiber.dispose() })
  const toolsFiber = await ctx.plugin({ ...ToolYuyi })
  teardowns.push(async () => { await toolsFiber.dispose() })
  const id = SessionId('sess-tool-a')
  const agent = {
    id,
    ctx,
    followup: vi.fn(),
    steer: vi.fn(),
    status: 'idle' as const,
    session: { id, header: { version: 0, id, createdAt: 0 } },
  } as unknown as Agent
  const unregister = ctx.agents.register(agent)
  teardowns.push(async () => { unregister() })
  const execute = async (name: string, args: Record<string, unknown>, caller?: Agent): Promise<unknown> => {
    const exec: Partial<ToolExecution> = { signal, callId: ToolCallId(`call-${String(callCounter += 1)}`) }
    void exec
    const result = await ctx.tools.execute({
      signal,
      callId: ToolCallId(`call-${String(callCounter += 1)}`),
      name,
      arguments: args,
      ...(caller !== undefined || agent !== undefined ? { agent: caller ?? agent } : {}),
    })
    if (result.isError) throw new Error(`tool ${name} failed: ${JSON.stringify(result.error)}`)
    return result.value
  }
  await vi.waitFor(() => { expect(ctx.yuyi.status().connected).toBe(true) })
  return { ctx, execute, agent }
}

async function startHub(): Promise<FixtureHub> {
  const hub = await new FixtureHub().start()
  teardowns.push(async () => { await hub.stop() })
  return hub
}

/* * 工具套件完整挂载但 hub 端口不可达。 */
async function startDeadService(): Promise<{
  service: import('@deepseek-ai/dsh-yuyi').default
  execute: (name: string, args: Record<string, unknown>) => Promise<Record<string, unknown>>
  stop: () => Promise<void>
}> {
  const ctx = new Context()
  await ctx.plugin(SystemPrompt)
  await ctx.plugin(ToolRuntime)
  const credentialsFiber = await ctx.plugin((child: Context) => {
    new StubCredentials(child, { value: LAUNCH_TOKEN })
  })
  const agentsFiber = await ctx.plugin(AgentRegistry)
  const yuyiFiber = await ctx.plugin(YuyiRuntime, { tokenEnv: 'YUYI_TOKEN', device: 'dsh-test-device', hub: 'ws://127.0.0.1:1', replyTimeoutMs: 250 })
  const toolsFiber = await ctx.plugin({ ...ToolYuyi })
  const id = SessionId('sess-dead-a')
  const agent = {
    id, ctx, followup: vi.fn(), steer: vi.fn(), status: 'idle' as const,
    session: { id, header: { version: 0, id, createdAt: 0 } },
  } as unknown as import('@deepseek-ai/dsh-agent').Agent
  const unregister = ctx.agents.register(agent)
  const execute = async (name: string, args: Record<string, unknown>): Promise<Record<string, unknown>> => {
    const result = await ctx.tools.execute({
      signal, callId: ToolCallId(`call-dead-${String(callCounter += 1)}`), name, arguments: args, agent,
    })
    if (result.isError) throw new Error(`tool ${name} failed: ${JSON.stringify(result.error)}`)
    return result.value as Record<string, unknown>
  }
  const stop = async (): Promise<void> => {
    unregister()
    await toolsFiber.dispose()
    await yuyiFiber.dispose()
    await agentsFiber.dispose()
    await credentialsFiber.dispose()
  }
  teardowns.push(stop)
  return { service: ctx.yuyi, execute, stop }
}

function remoteMessage(overrides: Partial<YuyiMessage> = {}): YuyiMessage {
  return {
    id: 'msg_remote_1',
    mode: 'notify',
    text: 'please review',
    from: { device: 'remote-dev', sessionID: 'peer-1', name: 'reviewer' },
    to: { target: 'sess-tool-a' },
    time: 1_700_000_000_000,
    ...overrides,
  }
}

describe('messaging tools', () => {
  it('yuyi_status reports the connection and roster', async () => {
    const hub = await startHub()
    const { execute } = await setupTools(hub)
    await execute('yuyi_register', { name: 'coder-a' })
    const status = await execute('yuyi_status', {}) as { connected: boolean; device: string; agentName: string; sessions: Array<{ name?: string }> }
    expect(status.connected).toBe(true)
    expect(status.device).toBe('dsh-test-device')
    expect(status.agentName).toBe('fixture-agent')
    expect(status.sessions).toEqual([expect.objectContaining({ name: 'coder-a', sessionId: 'sess-tool-a' })])
  })

  it('yuyi_register requires a live session and registers the alias', async () => {
    const hub = await startHub()
    const { ctx, execute } = await setupTools(hub)
    await execute('yuyi_register', { name: 'coder-a', title: 'Main' })
    expect(ctx.yuyi.aliasOf(SessionId('sess-tool-a'))).toBe('coder-a')
    const result = await ctx.tools.execute({
      signal, callId: ToolCallId('call-x'), name: 'yuyi_register', arguments: { name: 'other' },
    })
    expect(result.isError).toBe(true)
  })

  it('yuyi_peers lists fixture devices', async () => {
    const hub = await startHub()
    hub.peersDevices = [{ device: 'remote-dev', instanceID: 'inst-1', sessions: [{ sessionID: 'peer-1', title: 'Reviewer', directory: '/r', name: 'reviewer' }] }]
    const { execute } = await setupTools(hub)
    const peers = await execute('yuyi_peers', {}) as { devices: Array<{ device: string; sessions: Array<{ name?: string }> }> }
    expect(peers.devices[0]?.device).toBe('remote-dev')
    expect(peers.devices[0]?.sessions[0]).toMatchObject({ name: 'reviewer' })
  })

  it('yuyi_inbox reads session, device, and hub inboxes', async () => {
    const hub = await startHub()
    const { ctx, execute } = await setupTools(hub)
    await execute('yuyi_register', { name: 'coder-a' })
    await hub.deliver(remoteMessage({ id: 'msg_m1', mode: 'mail' }))
    const sessionRead = await execute('yuyi_inbox', {}) as { target: string; entries: Array<{ id: string }> }
    expect(sessionRead.target).toBe('session')
    expect(sessionRead.entries.map(entry => entry.id)).toEqual(['msg_m1'])
    expect(await execute('yuyi_inbox', { target: 'session' })).toMatchObject({ entries: [] })

    await hub.deliver(remoteMessage({ id: 'msg_m2', to: { target: 'unknown-one' } }))
    const deviceRead = await execute('yuyi_inbox', { target: 'device', peek: true }) as { target: string; entries: Array<{ id: string }> }
    expect(deviceRead.target).toBe('device')
    expect(deviceRead.entries.map(entry => entry.id)).toEqual(['msg_m2'])

    hub.inboxEntries = [{ message: remoteMessage({ id: 'msg_hub_1' }), receivedAt: 4 }]
    const hubRead = await execute('yuyi_inbox', { target: 'hub' }) as { target: string; entries: Array<{ id: string }> }
    expect(hubRead.entries.map(entry => entry.id)).toEqual(['msg_hub_1'])
    const drainedAgain = await execute('yuyi_inbox', { target: 'hub' }) as { entries: unknown[] }
    expect(drainedAgain.entries).toEqual([])
    void ctx
  })

  it('yuyi_send sends with the roster identity and optional fields', async () => {
    const hub = await startHub()
    const { execute } = await setupTools(hub)
    await execute('yuyi_register', { name: 'coder-a' })
    const sent = await execute('yuyi_send', {
      to: 'remote-dev:reviewer',
      text: 'status please',
      mode: 'mail',
      reply_to: 'msg_prev_1',
      classification: 'info',
      context_hint: 'checklist',
    }) as { messageId: string; deliveredAs?: string }
    expect(sent.messageId).toBe(hub.sentMessages[0]!.id)
    expect(hub.sentMessages[0]).toMatchObject({
      mode: 'mail',
      from: { name: 'coder-a', sessionID: 'sess-tool-a', device: 'dsh-test-device' },
      to: { device: 'remote-dev', target: 'reviewer' },
      replyTo: 'msg_prev_1',
      classification: 'info',
      contextHint: 'checklist',
    })
    expect(sent.deliveredAs).toBe('notify')
  })

  it('yuyi_send with task_id and expect_reply records the full round', async () => {
    const hub = await startHub()
    const { execute } = await setupTools(hub)
    await execute('yuyi_register', { name: 'coder-a' })
    const pending = execute('yuyi_send', {
      to: 'reviewer',
      text: 'review the plan',
      task_id: 'task-round-1',
      expect_reply: true,
    }) as Promise<{ messageId: string; replyText: string; replyFrom: string; taskRecords: Array<{ recorded: boolean }> }>
    await vi.waitFor(() => { expect(hub.sentMessages.length).toBe(1) })
    void hub.deliver(remoteMessage({ id: 'msg_reply_9', text: 'looks good', replyTo: hub.sentMessages[0]!.id }))
    const value = await pending
    expect(value.replyText).toBe('looks good')
    expect(value.replyFrom).toBe('reviewer@remote-dev')
    expect(value.taskRecords.every(record => record.recorded)).toBe(true)
    const kinds = readTask('task-round-1').events.map((event: TaskEvent) => event.kind)
    expect(kinds).toEqual(['created', 'request', 'reply'])
  })

  it('yuyi_send rejects an invalid task id in the record, not the send', async () => {
    const hub = await startHub()
    const { execute } = await setupTools(hub)
    const value = await execute('yuyi_send', { to: 'reviewer', text: 'hi', task_id: 'bad id!' }) as { messageId: string; taskRecords: Array<{ recorded: boolean; reason?: string }> }
    expect(value.messageId).toBe(hub.sentMessages[0]!.id)
    expect(value.taskRecords.every(record => !record.recorded)).toBe(true)
    expect(value.taskRecords[0]?.reason).toBe('bad_task_id')
  })
})

describe('task tools', () => {
  it('attach, artifact, summary, goal, verify, phase, and assign append their events', async () => {
    const hub = await startHub()
    const { execute } = await setupTools(hub)
    await execute('yuyi_register', { name: 'coder-a' })
    await execute('yuyi_task_attach', { task_id: 'task-life-1', note: 'taking over' })
    await execute('yuyi_task_artifact', { task_id: 'task-life-1', ref: 'PR #41', note: 'the plan' })
    await execute('yuyi_task_summary', { task_id: 'task-life-1', text: 'round one summarized' })
    await execute('yuyi_task_goal', { task_id: 'task-life-1', description: 'plan accepted', criteria: ['reviewer approves'] })
    await execute('yuyi_task_verify', { task_id: 'task-life-1', criterion_index: 0, passed: true, evidence: 'reviewer said ok' })
    await execute('yuyi_task_phase', { task_id: 'task-life-1', phase: 'verification', note: 'final pass' })
    await execute('yuyi_task_assign', { task_id: 'task-life-1', assignee: 'reviewer', phase: 'verification' })
    const events = readTask('task-life-1').events
    const kinds = events.map((event: TaskEvent) => event.kind)
    expect(kinds).toEqual(['attach', 'artifact', 'summary', 'goal', 'verify', 'phase', 'assign'])
    expect(events[0]).toMatchObject({ kind: 'attach', sessionID: 'sess-tool-a', name: 'coder-a', note: 'taking over' })
    expect(events[1]).toMatchObject({ kind: 'artifact', ref: 'PR #41' })
    expect(events[2]).toMatchObject({ kind: 'summary', by: 'coder-a' })
    expect(events[3]).toMatchObject({ kind: 'goal', criteria: ['reviewer approves'] })
    expect(events[4]).toMatchObject({ kind: 'verify', passed: true, verifier: 'coder-a' })
    expect(events[5]).toMatchObject({ kind: 'phase', name: 'verification' })
    expect(events[6]).toMatchObject({ kind: 'assign', assignee: 'reviewer' })
  })

  it('yuyi_task_show renders the record and the hub index fallback', async () => {
    const hub = await startHub()
    const { execute } = await setupTools(hub)
    await execute('yuyi_register', { name: 'coder-a' })
    await execute('yuyi_send', { to: 'reviewer', text: 'first round', task_id: 'task-show-1', expect_reply: false })
    const shown = await execute('yuyi_task_show', { task_id: 'task-show-1' }) as { round: number; incomplete: boolean; snapshot: string }
    expect(shown.round).toBe(0)
    expect(shown.incomplete).toBe(false)
    expect(shown.snapshot).toContain('task-show-1')

    // 仅 attach 的记录不完整；hub 索引有记录时自会回答。
    await execute('yuyi_task_attach', { task_id: 'task-show-2' })
    hub.taskIndexTask = { taskId: 'task-show-2', participants: ['a', 'b'], messageCount: 3, firstAt: 1, lastAt: 2 }
    const incomplete = await execute('yuyi_task_show', { task_id: 'task-show-2' }) as { hubIndex?: string }
    expect(incomplete.hubIndex).toContain('task-show-2')

    hub.taskIndexTask = undefined
    const noIndex = await execute('yuyi_task_show', { task_id: 'task-show-2' }) as { hubIndex?: string }
    expect(noIndex.hubIndex).toBeUndefined()
  })

  it('yuyi_task_show fails for an unknown task', async () => {
    const hub = await startHub()
    const { execute } = await setupTools(hub)
    await expect(execute('yuyi_task_show', { task_id: 'task-none' })).rejects.toThrow(/no local record/)
  })

  it('yuyi_task_continue threads replyTo and targets the pending addressee', async () => {
    const hub = await startHub()
    const { execute } = await setupTools(hub)
    await execute('yuyi_register', { name: 'coder-a' })
    const first = execute('yuyi_send', { to: 'reviewer', text: 'first', task_id: 'task-cont-1', expect_reply: true }) as Promise<{ messageId: string }>
    await vi.waitFor(() => { expect(hub.sentMessages.length).toBe(1) })
    void hub.deliver(remoteMessage({ id: 'msg_reply_1', text: 'answer one', replyTo: hub.sentMessages[0]!.id }))
    await first

    const second = execute('yuyi_task_continue', { task_id: 'task-cont-1', message: 'second round' }) as Promise<{ to: string; replyText: string; messageId: string }>
    await vi.waitFor(() => { expect(hub.sentMessages.length).toBe(2) })
    void hub.deliver(remoteMessage({ id: 'msg_reply_2', text: 'answer two', replyTo: hub.sentMessages[1]!.id }))
    const value = await second
    expect(value.to).toBe('remote-dev:reviewer')
    expect(value.replyText).toBe('answer two')
    expect(hub.sentMessages[1]).toMatchObject({ taskId: 'task-cont-1', replyTo: 'msg_reply_1' })
  })

  it('yuyi_task_continue honors an explicit target and fails without any target', async () => {
    const hub = await startHub()
    const { execute } = await setupTools(hub)
    await execute('yuyi_register', { name: 'coder-a' })
    await expect(execute('yuyi_task_continue', { task_id: 'task-cont-2', message: 'x' })).rejects.toThrow(/no local record/)
    await execute('yuyi_task_attach', { task_id: 'task-cont-2' })
    await expect(execute('yuyi_task_continue', { task_id: 'task-cont-2', message: 'x' })).rejects.toThrow(/explicitly/)
    const pending = execute('yuyi_task_continue', { task_id: 'task-cont-2', message: 'direct', to: 'reviewer' }) as Promise<{ messageId: string }>
    await vi.waitFor(() => { expect(hub.sentMessages.length).toBe(1) })
    void hub.deliver(remoteMessage({ id: 'msg_reply_d', replyTo: hub.sentMessages[0]!.id }))
    const value = await pending
    expect(value.messageId).toBe(hub.sentMessages[0]!.id)
  })

  it('compact, close, and archive move the record through its lifecycle', async () => {
    const hub = await startHub()
    const { execute } = await setupTools(hub)
    await execute('yuyi_register', { name: 'coder-a' })
    for (let i = 0; i < 7; i += 1) {
      const round = execute('yuyi_send', {
        to: 'reviewer', text: `round ${String(i)}`, task_id: 'task-life-2', expect_reply: true,
      }) as Promise<{ messageId: string }>
      await vi.waitFor(() => { expect(hub.sentMessages.length).toBe(i + 1) })
      void hub.deliver(remoteMessage({ id: `msg_r${String(i)}`, replyTo: hub.sentMessages[hub.sentMessages.length - 1]!.id }))
      await round
    }
    const compacted = await execute('yuyi_task_compact', { task_id: 'task-life-2' }) as { records: Array<{ recorded: boolean }> }
    expect(compacted.records[0]?.recorded).toBe(true)
    const closed = await execute('yuyi_task_close', { task_id: 'task-life-2', note: 'done' }) as { records: Array<{ recorded: boolean }> }
    expect(closed.records[0]?.recorded).toBe(true)
    const archived = await execute('yuyi_task_archive', { task_id: 'task-life-2' }) as { records: Array<{ recorded: boolean }> }
    expect(archived.records[0]?.recorded).toBe(true)
    const shown = await execute('yuyi_task_show', { task_id: 'task-life-2' }) as { archived?: boolean }
    expect(shown.archived).toBe(true)
  })
})

describe('optional-branch coverage', () => {
  it('status reports a bare welcome without identity fields', async () => {
    const hub = await startHub()
    hub.bareWelcome = true
    const { execute } = await setupTools(hub)
    const status = await execute('yuyi_status', {}) as Record<string, unknown>
    expect(status.agentName).toBeUndefined()
    expect(status.ownerUsername).toBeUndefined()
    expect(status.role).toBeUndefined()
    expect(status.lastError).toBeUndefined()
  })

  it('send without a task id omits taskRecords and absent ack fields', async () => {
    const hub = await startHub()
    hub.sendDeliveredAs = undefined
    const { execute } = await setupTools(hub)
    const value = await execute('yuyi_send', { to: 'reviewer', text: 'no tasks here' }) as Record<string, unknown>
    expect(value.taskRecords).toBeUndefined()
    expect(value.deliveredAs).toBeUndefined()
    expect(value.handlerSessionID).toBeUndefined()
  })

  it('expect-reply without a task id resolves without task records', async () => {
    const hub = await startHub()
    const { execute } = await setupTools(hub)
    const pending = execute('yuyi_send', { to: 'reviewer', text: 'quick', expect_reply: true }) as Promise<Record<string, unknown>>
    await vi.waitFor(() => { expect(hub.sentMessages.length).toBe(1) })
    void hub.deliver(remoteMessage({ id: 'msg_qr', replyTo: hub.sentMessages[0]!.id }))
    const value = await pending
    expect(value.taskRecords).toBeUndefined()
    expect(value.replyText).toBe('please review')
  })

  it('inbox rows render a device-less sender', async () => {
    const hub = await startHub()
    const { execute } = await setupTools(hub)
    await execute('yuyi_register', { name: 'coder-a' })
    await hub.deliver(remoteMessage({ id: 'msg_local', mode: 'mail', from: { device: '', sessionID: 's-origin' } }))
    const read = await execute('yuyi_inbox', { peek: true }) as { entries: Array<{ from: string }> }
    expect(read.entries[0]?.from).toBe('s-origin')
  })

  it('peers devices without roles render unnamed sessions', async () => {
    const hub = await startHub()
    hub.peersDevices = [
      { device: 'bare-dev', instanceID: 'i', sessions: [{ sessionID: 's9', title: 'Nine', directory: '/n' }] },
    ]
    const { execute } = await setupTools(hub)
    const peers = await execute('yuyi_peers', {}) as { devices: Array<{ sessions: Array<{ name?: string }> }> }
    expect(peers.devices[0]?.sessions[0]?.name).toBeUndefined()
  })
})

describe('optional-branch coverage: task identity and target fallbacks', () => {
  it('task attach and continue fail without a session-scoped agent', async () => {
    const hub = await startHub()
    const { ctx } = await setupTools(hub)
    const result = await ctx.tools.execute({
      signal, callId: ToolCallId('call-na1'), name: 'yuyi_task_attach', arguments: { task_id: 'task-na' },
    })
    expect(JSON.stringify(result.error)).toContain('session-scoped')
    const cont = await ctx.tools.execute({
      signal, callId: ToolCallId('call-na2'), name: 'yuyi_task_continue', arguments: { task_id: 'task-na', message: 'x' },
    })
    expect(cont.isError).toBe(true)
  })

  it('summary and verify fall back to the agent name then dsh without an agent', async () => {
    const hub = await startHub()
    const { ctx } = await setupTools(hub)
    await ctx.tools.execute({
      signal, callId: ToolCallId('call-au1'), name: 'yuyi_task_summary', arguments: { task_id: 'task-au', text: 's' },
    })
    await ctx.tools.execute({
      signal, callId: ToolCallId('call-au2'), name: 'yuyi_task_verify',
      arguments: { task_id: 'task-au', criterion_index: 0, passed: false, evidence: 'none' },
    })
    const events = readTask('task-au').events
    expect(events[0]).toMatchObject({ kind: 'summary', by: 'fixture-agent' })
    expect(events[1]).toMatchObject({ kind: 'verify', passed: false, verifier: 'fixture-agent' })

    hub.bareWelcome = false
    const bare = await startHub()
    bare.bareWelcome = true
    const { ctx: bareCtx } = await setupTools(bare)
    await bareCtx.tools.execute({
      signal, callId: ToolCallId('call-au3'), name: 'yuyi_task_summary', arguments: { task_id: 'task-au2', text: 's' },
    })
    expect(readTask('task-au2').events[0]).toMatchObject({ kind: 'summary', by: 'dsh' })
  })

  it('record task rounds under a bare welcome and a device-less reply', async () => {
    const hub = await startHub()
    hub.bareWelcome = true
    const { execute } = await setupTools(hub)
    await execute('yuyi_register', { name: 'coder-a' })
    const pending = execute('yuyi_send', {
      to: 'reviewer', text: 'round', task_id: 'task-bare-1', expect_reply: true,
    }) as Promise<{ replyFrom?: string; taskRecords: Array<{ recorded: boolean }> }>
    await vi.waitFor(() => { expect(hub.sentMessages.length).toBe(1) })
    void hub.deliver(remoteMessage({
      id: 'msg_br1', text: 'bare reply', replyTo: hub.sentMessages[0]!.id,
      from: { device: '', sessionID: 's-bare' },
    }))
    const value = await pending
    expect(value.replyFrom).toBe('s-bare')
    expect(value.taskRecords.every(record => record.recorded)).toBe(true)
    expect(readTask('task-bare-1').events.map(event => event.kind)).toEqual(['created', 'request', 'reply'])
  })

  it('attach records an unregistered session without an alias', async () => {
    const hub = await startHub()
    const { execute } = await setupTools(hub)
    const value = await execute('yuyi_task_attach', { task_id: 'task-noalias' }) as { records: Array<{ recorded: boolean }> }
    expect(value.records[0]?.recorded).toBe(true)
    expect(readTask('task-noalias').events[0]).toMatchObject({ kind: 'attach', sessionID: 'sess-tool-a' })
  })

  it('continueTarget ignores an empty explicit target and handles unknown repliers', async () => {
    const hub = await startHub()
    const { execute } = await setupTools(hub)
    await execute('yuyi_register', { name: 'coder-a' })
    const first = execute('yuyi_send', {
      to: 'reviewer', text: 'first', task_id: 'task-tgt-1', expect_reply: true,
    }) as Promise<{ messageId: string }>
    await vi.waitFor(() => { expect(hub.sentMessages.length).toBe(1) })
    void hub.deliver(remoteMessage({
      id: 'msg_tr1', replyTo: hub.sentMessages[0]!.id,
      from: { device: '' } as unknown as YuyiMessage['from'],
    }))
    await first
    const second = execute('yuyi_task_continue', { task_id: 'task-tgt-1', message: 'next', to: '' }) as Promise<{ to: string }>
    await vi.waitFor(() => { expect(hub.sentMessages.length).toBe(2) })
    void hub.deliver(remoteMessage({ id: 'msg_tr2', replyTo: hub.sentMessages[1]!.id }))
    await expect(second).resolves.toMatchObject({ to: 'unknown' })
  })
})

describe('output render projections', () => {
  it('renders every task tool outcome through the registered definitions', async () => {
    const hub = await startHub()
    const { ctx } = await setupTools(hub)
    const render = (name: string, args: Record<string, unknown>, value: unknown): string => {
      const definition = ctx.tools.get(name)
      expect(definition, name).toBeDefined()
      type RenderFn = (a: unknown, v: unknown) => Array<{ type: string; text?: string }>
      const renderFn = definition?.output?.render?.bind(definition.output) as unknown as RenderFn
      const content = renderFn?.(args, value)
      return content?.[0]?.type === 'text' ? (content[0]?.text ?? '') : ''
    }
    const event = { taskId: 't1', event: 'phase done', records: [{ recorded: true }] }
    expect(render('yuyi_task_attach', { task_id: 't1' }, event)).toContain('attach recorded'.replace('attach', 'phase done'))
    expect(render('yuyi_task_attach', { task_id: 't1' }, { taskId: 't1', event: 'e', records: [{ recorded: false, reason: 'cap' }] })).toContain('rejected: cap')
    const shown = { snapshot: 'SNAP', hubIndex: 'IDX' } as never
    expect(render('yuyi_task_show', { task_id: 't1' }, shown)).toContain('hub index: IDX')
    expect(render('yuyi_task_show', { task_id: 't1' }, { snapshot: 'SNAP' })).toBe('SNAP')
    expect(render('yuyi_task_continue', { task_id: 't1', message: 'm' }, {
      taskId: 't1', to: 'peer', messageId: 'm1', replyText: 'answer', replyFrom: 'peer@dev', records: [],
    })).toContain('reply from peer@dev')
    expect(render('yuyi_task_continue', { task_id: 't1', message: 'm' }, {
      taskId: 't1', to: 'peer', messageId: 'm1', records: [],
    })).toBe('round m1 to peer')
  })

  it('renders register and send outcomes through the registered definitions', async () => {
    const hub = await startHub()
    const { ctx } = await setupTools(hub)
    const render = (name: string, args: Record<string, unknown>, value: unknown): string => {
      const definition = ctx.tools.get(name)
      type RenderFn = (a: unknown, v: unknown) => Array<{ type: string; text?: string }>
      const renderFn = definition?.output?.render?.bind(definition.output) as unknown as RenderFn
      const content = renderFn?.(args, value)
      return content?.[0]?.type === 'text' ? (content[0]?.text ?? '') : ''
    }
    expect(render('yuyi_register', { name: 'a' }, { sessionId: 's1', name: 'a' })).toBe('registered session s1 as "a"')
    expect(render('yuyi_register', { name: 'a', title: 'T' }, { sessionId: 's1', name: 'a' })).toContain('(T)')
    expect(render('yuyi_send', {}, { messageId: 'm1', deliveredAs: 'mail_fallback' })).toContain('parked in recipient inbox')
    expect(render('yuyi_send', {}, { messageId: 'm1' })).toBe('sent m1')
  })
})

describe('optional-branch coverage: identity and endorsement tails', () => {
  it('continues a task under a bare welcome', async () => {
    const hub = await startHub()
    hub.bareWelcome = true
    const { execute } = await setupTools(hub)
    await execute('yuyi_register', { name: 'coder-a' })
    const first = execute('yuyi_send', {
      to: 'reviewer', text: 'r1', task_id: 'task-bc-1', expect_reply: true,
    }) as Promise<{ messageId: string }>
    await vi.waitFor(() => { expect(hub.sentMessages.length).toBe(1) })
    void hub.deliver(remoteMessage({ id: 'msg_bc1', replyTo: hub.sentMessages[0]!.id }))
    await first
    const second = execute('yuyi_task_continue', { task_id: 'task-bc-1', message: 'r2' }) as Promise<{ records: Array<{ recorded: boolean }>; replyFrom?: string }>
    await vi.waitFor(() => { expect(hub.sentMessages.length).toBe(2) })
    void hub.deliver(remoteMessage({
      id: 'msg_bc2', replyTo: hub.sentMessages[1]!.id, from: { device: '', sessionID: 's-bc' },
    }))
    const value = await second
    expect(value.records.every(record => record.recorded)).toBe(true)
    expect(value.replyFrom).toBe('s-bc')
  })

  it('records hub-endorsed identity fields on replies', async () => {
    const hub = await startHub()
    const { execute } = await setupTools(hub)
    const pending = execute('yuyi_send', {
      to: 'reviewer', text: 'endorsed', task_id: 'task-end-1', expect_reply: true,
    }) as Promise<{ messageId: string }>
    await vi.waitFor(() => { expect(hub.sentMessages.length).toBe(1) })
    void hub.deliver(remoteMessage({
      id: 'msg_en1', replyTo: hub.sentMessages[0]!.id,
      from: { device: 'remote-dev', sessionID: 'peer-9', name: 'reviewer', agentId: 'ag-1', ownerUsername: 'alice' },
    }))
    await pending
    const replyEvent = readTask('task-end-1').events.find(event => event.kind === 'reply')
    expect(replyEvent).toMatchObject({ kind: 'reply', from: { agentId: 'ag-1', ownerUsername: 'alice', name: 'reviewer' } })
  })
})

describe('optional-branch coverage: complementary sides', () => {
  it('status surfaces a roster entry without an alias and a settled lastError', async () => {
    const hub = await startHub()
    const { ctx, execute } = await setupTools(hub)
    ctx.yuyi.register(SessionId('sess-bare-roster'), { title: 'Bare', directory: '' })
    const status = await execute('yuyi_status', {}) as { sessions: Array<{ name?: string }>; lastError?: string }
    expect(status.sessions.some(session => session.name === undefined)).toBe(true)
    expect(status.lastError).toBeUndefined()

    const dead = await startDeadService()
    await vi.waitFor(() => { expect(dead.service.status().lastError).toBeDefined() })
    const errored = await dead.execute('yuyi_status', {}) as { lastError?: string }
    expect(errored.lastError).toBeDefined()
    await dead.stop()
  })

  it('send works without a session agent and maps a handler ack', async () => {
    const hub = await startHub()
    hub.sendHandlerSessionID = 'sess-remote'
    const { ctx, execute } = await setupTools(hub)
    const result = await ctx.tools.execute({
      signal, callId: ToolCallId('call-noagent'), name: 'yuyi_send', arguments: { to: 'reviewer', text: 'anonymous' },
    })
    expect(result.isError).toBe(false)
    const handled = await execute('yuyi_send', { to: 'reviewer', text: 'handled' }) as { handlerSessionID?: string }
    expect(handled.handlerSessionID).toBe('sess-remote')
  })

  it('expect-reply with an unrecordable task id leaves the reply unrecorded', async () => {
    const hub = await startHub()
    const { execute } = await setupTools(hub)
    const pending = execute('yuyi_send', {
      to: 'reviewer', text: 'x', task_id: 'bad id!', expect_reply: true,
    }) as Promise<{ taskRecords: Array<{ recorded: boolean }> }>
    await vi.waitFor(() => { expect(hub.sentMessages.length).toBe(1) })
    void hub.deliver(remoteMessage({ id: 'msg_bi', replyTo: hub.sentMessages[0]!.id }))
    const value = await pending
    expect(value.taskRecords.every(record => !record.recorded)).toBe(true)
  })

  it('continue targets the pending addressee when the last round went unanswered', async () => {
    const hub = await startHub()
    const { execute } = await setupTools(hub)
    await execute('yuyi_send', { to: 'reviewer', text: 'unanswered', task_id: 'task-pend-1' })
    const round = execute('yuyi_task_continue', { task_id: 'task-pend-1', message: 'follow-up' }) as Promise<{ to: string }>
    await vi.waitFor(() => { expect(hub.sentMessages.length).toBe(2) })
    void hub.deliver(remoteMessage({ id: 'msg_pu', replyTo: hub.sentMessages[1]!.id }))
    await expect(round).resolves.toMatchObject({ to: 'reviewer' })
  })

  it('show carries goal, verification, phase, assignee, and noted artifacts', async () => {
    const hub = await startHub()
    const { execute } = await setupTools(hub)
    await execute('yuyi_register', { name: 'coder-a' })
    await execute('yuyi_send', { to: 'reviewer', text: 'seed', task_id: 'task-full-1' })
    await execute('yuyi_task_artifact', { task_id: 'task-full-1', ref: 'PR #42', note: 'noted' })
    await execute('yuyi_task_goal', { task_id: 'task-full-1', description: 'done means done', criteria: ['a', 'b'] })
    await execute('yuyi_task_verify', { task_id: 'task-full-1', criterion_index: 1, passed: true, evidence: 'checked', verifier: 'auditor' })
    await execute('yuyi_task_phase', { task_id: 'task-full-1', phase: 'review', note: 'final gate' })
    await execute('yuyi_task_assign', { task_id: 'task-full-1', assignee: 'reviewer', phase: 'review', note: 'owns review' })
    const shown = await execute('yuyi_task_show', { task_id: 'task-full-1' }) as {
      artifacts: Array<{ ref: string; note?: string }>
      goal?: { criteria: string[] }
      verification?: Array<{ verifier?: string }>
      phase?: { name: string }
      assignee?: { target: string }
    }
    expect(shown.artifacts[0]).toEqual({ ref: 'PR #42', note: 'noted' })
    expect(shown.goal?.criteria).toEqual(['a', 'b'])
    expect(shown.verification?.[1]?.verifier).toBe('auditor')
    expect(shown.phase).toEqual({ name: 'review', note: 'final gate' })
    expect(shown.assignee).toEqual({ target: 'reviewer', phase: 'review', note: 'owns review' })
  })

  it('event tools omit optional fields and render a reasonless failure', async () => {
    const hub = await startHub()
    const { ctx, execute } = await setupTools(hub)
    await execute('yuyi_task_artifact', { task_id: 'task-opt-1', ref: 'PR #43' })
    await execute('yuyi_task_phase', { task_id: 'task-opt-1', phase: 'build' })
    await execute('yuyi_task_assign', { task_id: 'task-opt-1', assignee: 'reviewer' })
    const events = readTask('task-opt-1').events
    expect(events[0]).toMatchObject({ kind: 'artifact', ref: 'PR #43' })
    expect(events[0]).not.toHaveProperty('note')
    expect(events[1]).not.toHaveProperty('note')
    expect(events[2]).not.toHaveProperty('phase')
    expect(events[2]).not.toHaveProperty('note')
    const plain = await execute('yuyi_task_show', { task_id: 'task-opt-1' }) as {
      artifacts: Array<{ ref: string; note?: string }>
    }
    expect(plain.artifacts[0]).toEqual({ ref: 'PR #43' })

    const definition = ctx.tools.get('yuyi_task_phase')
    const content = definition?.output?.render?.({}, {
      taskId: 't', event: 'e', records: [{ recorded: false }],
    })
    expect(content?.[0]?.type === 'text' ? content[0].text : '').toContain('rejected: unknown')

    const missing = await execute('yuyi_task_compact', { task_id: 'task-absent-9' }) as { records: Array<{ recorded: boolean; reason?: string }> }
    expect(missing.records[0]?.recorded).toBe(false)
    expect(missing.records[0]?.reason).toBe('not_found')
    // close 与 archive 对缺失任务幂等；拒绝的是无效 id。
    await execute('yuyi_task_close', { task_id: 'task-absent-9' })
    await execute('yuyi_task_archive', { task_id: 'task-absent-9' })
    const badClose = await execute('yuyi_task_close', { task_id: 'bad id!' }) as { records: Array<{ recorded: boolean; reason?: string }> }
    expect(badClose.records[0]?.recorded).toBe(false)
    expect(badClose.records[0]?.reason).toBe('bad_task_id')
    const badArchive = await execute('yuyi_task_archive', { task_id: 'bad id!' }) as { records: Array<{ recorded: boolean; reason?: string }> }
    expect(badArchive.records[0]?.recorded).toBe(false)
    expect(badArchive.records[0]?.reason).toBe('bad_task_id')
  })

  it('continue with an unrecordable task id and an identity-less device reply', async () => {
    const hub = await startHub()
    const { execute } = await setupTools(hub)
    const round = execute('yuyi_task_continue', {
      task_id: 'bad id!', message: 'dead record', to: 'remote-dev',
    }) as Promise<{ replyFrom?: string; records: Array<{ recorded: boolean }> }>
    await vi.waitFor(() => { expect(hub.sentMessages.length).toBe(1) })
    void hub.deliver(remoteMessage({
      id: 'msg_idless', replyTo: hub.sentMessages[0]!.id,
      from: { device: 'remote-dev' } as unknown as YuyiMessage['from'],
    }))
    const value = await round
    expect(value.replyFrom).toBe('unknown@remote-dev')
    expect(value.records.every(record => !record.recorded)).toBe(true)
  })
})
