/**
 * 一次性冒烟脚本（用后即删）：把 dsh-yuyi 的 yuyi_* 工具套件挂到进程内
 * fixture hub 上真跑一遍，打印每个工具模型可见的渲染文本。
 */

import './tests/env.ts'
import { Context } from '@deepseek-ai/cordis'
import AgentRegistry from '@deepseek-ai/dsh-agent'
import type { Agent } from '@deepseek-ai/dsh-agent'
import { ToolCallId } from '@deepseek-ai/dsh-llm/brand'
import { SessionId } from '@deepseek-ai/dsh-session'
import SystemPrompt from '@deepseek-ai/dsh-system-prompt'
import ToolRuntime from '@deepseek-ai/dsh-tools'
import YuyiRuntime from './src/service.ts'
import * as ToolYuyi from './src/tools/index.ts'
import { FixtureHub } from './tests/fixture-hub.ts'
import { StubCredentials } from './tests/fixture-credentials.ts'
import { LAUNCH_TOKEN } from './tests/env.ts'
import type { YuyiMessage } from './src/core.ts'

const signal = new AbortController().signal
let calls = 0

function delay(ms: number): Promise<void> {
  const { promise, resolve } = Promise.withResolvers<void>()
  setTimeout(resolve, ms)
  return promise
}

const EXPECTED = [
  'yuyi_status', 'yuyi_register', 'yuyi_peers', 'yuyi_send', 'yuyi_inbox',
  'yuyi_task_attach', 'yuyi_task_show', 'yuyi_task_continue', 'yuyi_task_artifact',
  'yuyi_task_summary', 'yuyi_task_compact', 'yuyi_task_close', 'yuyi_task_archive',
  'yuyi_task_goal', 'yuyi_task_verify', 'yuyi_task_phase', 'yuyi_task_assign',
  'yuyi_task_depend',
]

function remoteMessage(overrides: Partial<YuyiMessage> = {}): YuyiMessage {
  return {
    id: 'msg_remote_1',
    mode: 'notify',
    text: 'please review',
    from: { device: 'remote-dev', sessionID: 'peer-1', name: 'reviewer' },
    to: { target: 'sess-try-a' },
    time: 1_700_000_000_000,
    ...overrides,
  }
}

const hub = await new FixtureHub().start()
hub.peersDevices = [
  {
    device: 'remote-dev',
    instanceID: 'inst-1',
    agentId: 'agent-peer-1',
    role: 'worker',
    lastActiveAt: 1_700_000_000_000,
    sessions: [
      { sessionID: 'peer-1', title: 'Reviewer', directory: '/r', name: 'reviewer', capabilities: { wake: true } },
    ],
  },
]
hub.inboxEntries = [
  {
    message: {
      id: 'msg_hub_1',
      mode: 'mail',
      text: 'hub parked note',
      from: { device: 'remote-dev', sessionID: 'peer-2', name: 'planner' },
      to: { target: 'fixture-agent' },
      time: 1_700_000_000_000,
      hubEndorsed: true,
    },
    receivedAt: 1_700_000_000_001,
  },
]

const ctx = new Context()
await ctx.plugin(SystemPrompt)
await ctx.plugin(ToolRuntime)
await ctx.plugin((child: Context) => { new StubCredentials(child, { value: LAUNCH_TOKEN }) })
await ctx.plugin(AgentRegistry)
const yuyiFiber = await ctx.plugin(YuyiRuntime, {
  tokenEnv: 'YUYI_TOKEN', device: 'try-device', hub: hub.url, replyTimeoutMs: 3000,
})
const toolsFiber = await ctx.plugin({ ...ToolYuyi })

const missing = EXPECTED.filter(name => ctx.tools.get(name) === undefined)
console.log(`registered ${String(EXPECTED.length - missing.length)}/${String(EXPECTED.length)} yuyi_* tools`
  + (missing.length > 0 ? `; MISSING: ${missing.join(', ')}` : ''))

const id = SessionId('sess-try-a')
const agent = {
  id,
  ctx,
  followup: (): void => {},
  steer: (): void => {},
  status: 'idle' as const,
  session: { id, header: { version: 0, id, createdAt: 0 } },
} as unknown as Agent
const unregister = ctx.agents.register(agent)

async function call(name: string, args: Record<string, unknown> = {}): Promise<Record<string, unknown> | undefined> {
  const result = await ctx.tools.execute({
    signal, callId: ToolCallId(`try-${String(calls += 1)}`), name, arguments: args, agent,
  })
  console.log(`\n▶ ${name} ${JSON.stringify(args)}`)
  if (result.isError) {
    console.log(`  ✗ ${JSON.stringify(result.error)}`)
    return undefined
  }
  for (const block of result.content) console.log(`  ${block.type === 'text' ? block.text : `[${block.type}]`}`)
  return result.value as Record<string, unknown>
}

while (!ctx.yuyi.status().connected) await delay(20)
console.log(`\nconnected to ${hub.url} as device ${ctx.yuyi.status().device}`)

await call('yuyi_status')
await call('yuyi_register', { name: 'architect-1', title: '架构师主会话' })
await call('yuyi_status')
await call('yuyi_peers')

await call('yuyi_send', {
  to: 'remote-dev:reviewer', text: '请评审 v2 方案', mode: 'mail',
  task_id: 'task_try_1', classification: 'info', context_hint: 'checklist',
})
console.log(`  wire frame → ${JSON.stringify(hub.sentMessages[hub.sentMessages.length - 1])}`)

await call('yuyi_inbox', { target: 'hub' })
await call('yuyi_inbox', { target: 'hub' })

await hub.deliver(remoteMessage({ id: 'msg_mail_in', mode: 'mail', text: 'peer 回信停在会话收件箱' }))
await call('yuyi_inbox', {})
await call('yuyi_inbox', { target: 'device' })

const pending = ctx.tools.execute({
  signal, callId: ToolCallId(`try-${String(calls += 1)}`),
  name: 'yuyi_send',
  arguments: { to: 'reviewer', text: '第二问：验收清单齐了吗', task_id: 'task_try_1', expect_reply: true },
  agent,
}).then((result) => {
  console.log('\n▶ yuyi_send {expect_reply: true}')
  for (const block of result.content) console.log(`  ${block.type === 'text' ? block.text : `[${block.type}]`}`)
  return result
})
while (hub.sentMessages.length < 2) await delay(20)
await hub.deliver(remoteMessage({
  id: 'msg_reply_1', text: '清单齐了，缺第 3 项证据', replyTo: hub.sentMessages[1]!.id,
}))
await pending

await call('yuyi_task_show', { task_id: 'task_try_1' })
await call('yuyi_task_goal', {
  task_id: 'task_try_1',
  description: 'v2 方案通过评审',
  criteria: ['六维度覆盖', '证据可回源', '评审结论明确'],
})
await call('yuyi_task_verify', { task_id: 'task_try_1', criterion_index: 0, passed: true, evidence: '方案 §3 逐条列出六维度' })
await call('yuyi_task_phase', { task_id: 'task_try_1', phase: 'review', note: '等 reviewer 回信' })
await call('yuyi_task_assign', { task_id: 'task_try_1', assignee: 'reviewer', phase: 'review' })
await call('yuyi_task_artifact', { task_id: 'task_try_1', ref: 'docs/digital-twin-design-v2.html', note: 'v2 方案' })
await call('yuyi_task_summary', { task_id: 'task_try_1', text: '评审首轮已回收，待补第 3 项证据' })
await call('yuyi_send', { to: 'reviewer', text: '上游任务', task_id: 'task_try_0', mode: 'mail' })
await call('yuyi_task_depend', { task_id: 'task_try_1', on: 'task_try_0', note: '依赖上游简报' })
await call('yuyi_task_compact', { task_id: 'task_try_1' })

const cont = ctx.tools.execute({
  signal, callId: ToolCallId(`try-${String(calls += 1)}`),
  name: 'yuyi_task_continue',
  arguments: { task_id: 'task_try_1', message: '第 3 项证据已补：见 docs/reports/' },
  agent,
}).then((result) => {
  console.log('\n▶ yuyi_task_continue {task_id: task_try_1}')
  for (const block of result.content) console.log(`  ${block.type === 'text' ? block.text : `[${block.type}]`}`)
  return result
})
while (hub.sentMessages.length < 4) await delay(20)
await hub.deliver(remoteMessage({
  id: 'msg_reply_2', text: '收到，评审通过', replyTo: hub.sentMessages[3]!.id,
}))
await cont

await call('yuyi_task_show', { task_id: 'task_try_1' })
await call('yuyi_task_close', { task_id: 'task_try_1' })
await call('yuyi_task_archive', { task_id: 'task_try_1' })
await call('yuyi_task_show', { task_id: 'task_try_1' })
await call('yuyi_task_attach', { task_id: 'task_try_1', note: '归档后重挂' })
await call('yuyi_task_show', { task_id: 'nope_missing' })

unregister()
await toolsFiber.dispose()
await yuyiFiber.dispose()
await hub.stop()
console.log('\nsmoke run complete')
