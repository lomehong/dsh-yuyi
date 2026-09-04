import './env.ts'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Context } from '@deepseek-ai/cordis'
import AgentRegistry from '@deepseek-ai/dsh-agent'
import type { Agent } from '@deepseek-ai/dsh-agent'
import { SessionId } from '@deepseek-ai/dsh-session'
import type { Fiber } from '@deepseek-ai/cordis'
import type { PeerDevice, RosterSession, YuyiMessage } from '../src/core.ts'
import YuyiRuntime, { YuyiError } from '../src/service.ts'
import { deliverySummary, formatIncoming } from '../src/delivery.ts'
import * as CoreFacade from '../src/core.ts'
import { hostname } from 'node:os'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { FixtureHub } from './fixture-hub.ts'
import { StubCredentials } from './fixture-credentials.ts'
import { fakeHome, LAUNCH_TOKEN, stateDir } from './env.ts'

// 模拟多 Agent 设备的污染：通用环境变量 + 共享 ~/.yuyi/env + 安装器写的
// ~/.yuyi/dsh-token 全部被设计堵在门外（token 唯一来源是 dsh 凭证库）。
// 这些污染源即使真存在，也必须全部被忽略——下面的注入就是为这个保证服务的。
process.env.YUYI_TOKEN = 'ambient-other-agent-token'
mkdirSync(join(fakeHome, '.yuyi'), { recursive: true })
writeFileSync(join(fakeHome, '.yuyi', 'dsh-token'), 'ambient-file-other-agent-token')
writeFileSync(join(fakeHome, '.yuyi', 'env'), 'YUYI_TOKEN=ambient-env-file-other-agent-token\n')

/* * 每测试清理：插件 fiber 与 fixture hub，按最新优先销毁。 */
const teardowns: Array<() => Promise<void>> = []

afterEach(async () => {
  while (teardowns.length > 0) {
    const dispose = teardowns.pop()
    if (dispose !== undefined) await dispose()
  }
})

/* * 注册进 ctx.agents 的最小 agent，记录投递调用。 */
interface FakeAgent {
  followup: ReturnType<typeof vi.fn>
  steer: ReturnType<typeof vi.fn>
}

function fakeAgent(ctx: Context, sessionId: string, status: 'idle' | 'running'): FakeAgent {
  const followup = vi.fn<(message: unknown) => void>()
  const steer = vi.fn<(message: unknown) => void>()
  const id = SessionId(sessionId)
  const agent = {
    id,
    ctx,
    followup,
    steer,
    status,
    session: { id, header: { version: 0, id, createdAt: 0 } },
  } as unknown as Agent
  const dispose = ctx.agents.register(agent)
  teardowns.push(async () => { dispose() })
  return { followup, steer }
}

/* * 共享的测试凭证库在 fixture-credentials.ts。同时也保留向后兼容的
 * 旧别名（settings.spec.ts 直接传 fail 这个标记）。 */
type CredentialsArg = { value: string } | { fail: true }

interface SetupOptions {
  hub?: string
  credentials?: CredentialsArg
  /* * 省略显式 device，让解析走过环境链。 */
  deviceless?: boolean
  /* * tokenEnv 指向空位，用于休眠场景。 */
  absentToken?: boolean
}

async function setup(options: SetupOptions = {}): Promise<{ ctx: Context; service: YuyiRuntime; stop: () => Promise<void> }> {
  const ctx = new Context()
  const agentsFiber = await ctx.plugin(AgentRegistry)
  teardowns.push(async () => { await agentsFiber.dispose() })
  let credentialsFiber: Fiber | undefined
  if (options.credentials !== undefined) {
    const credentials = options.credentials
    const stubOptions: { value?: string; fail?: boolean } = 'fail' in credentials
      ? { fail: true }
      : { value: credentials.value }
    credentialsFiber = await ctx.plugin((child: Context) => {
      new StubCredentials(child, stubOptions)
    })
    teardowns.push(async () => { await credentialsFiber!.dispose() })
  }
  const config = {
    tokenEnv: options.absentToken === true ? 'YUYI_ABSENT_TOKEN' : 'YUYI_TOKEN',
    replyTimeoutMs: 150,
    ...(options.deviceless === true ? {} : { device: 'dsh-test-device' }),
    ...(options.hub !== undefined ? { hub: options.hub } : {}),
  }
  const fiber = await ctx.plugin(YuyiRuntime, config)
  const stop = async (): Promise<void> => { await fiber.dispose() }
  teardowns.push(stop)
  return { ctx, service: ctx.yuyi, stop }
}

/* * 启动一个注册进每测试清理的 fixture hub。 */
async function startHub(): Promise<FixtureHub> {
  const hub = await new FixtureHub().start()
  teardowns.push(async () => { await hub.stop() })
  return hub
}

/* * 一条来自远端设备的投递形态消息。 */
function remoteMessage(overrides: Partial<YuyiMessage> = {}): YuyiMessage {
  return {
    id: 'msg_remote_1',
    mode: 'notify',
    text: 'please review the plan',
    from: { device: 'remote-dev', sessionID: 'peer-1', name: 'reviewer' },
    to: { target: 'worker-a' },
    time: 1_700_000_000_000,
    ...overrides,
  }
}

async function connectedService(hub: FixtureHub): Promise<{ ctx: Context; service: YuyiRuntime; stop: () => Promise<void> }> {
  // token 唯一来源是 dsh 凭证库——生产等价于设置界面 "保存 token" 后再启动。
  const handle = await setup({ hub: hub.url, credentials: { value: LAUNCH_TOKEN } })
  await vi.waitFor(() => { expect(handle.service.status().connected).toBe(true) })
  return handle
}

describe('yuyi service', () => {
  it('exposes the vendored core through the facade', () => {
    expect(typeof CoreFacade.HubClient).toBe('function')
    expect(typeof CoreFacade.parseAddress).toBe('function')
  })

  it('stays dormant when hub or token do not resolve', async () => {
    // 凭证库没挂载 + 没有 hub 配置 → 保持休眠，而不是启动失败。
    // （也不捡环境变量里的污染物——这是设计的硬保证。）
    const { service } = await setup({ absentToken: true, credentials: { value: 'other-token' } })
    await vi.waitFor(() => { expect(service.status().hub).toBe('') })
    const status = service.status()
    expect(status).toMatchObject({ configured: false, connected: false, device: 'dsh-test-device', deviceUnread: 0 })
    await expect(service.send({ to: 'peer', text: 'hi', mode: 'notify' })).rejects.toMatchObject({ code: 'YUYI_NOT_CONFIGURED' })
    await expect(service.peers()).rejects.toMatchObject({ code: 'YUYI_NOT_CONFIGURED' })
  })

  it('reports a resolved hub with a missing token distinctly', async () => {
    const hub = await startHub()
    // 凭证库没挂载 = 找不到 token → 报"token 缺失"。与 tokenEnv 指向空位
    // （YUYI_ABSENT_TOKEN）的诊断消息一致。
    const { service } = await setup({ hub: hub.url, absentToken: true })
    await vi.waitFor(() => { expect(service.status().hub).toBe(hub.url) })
    expect(service.status().configured).toBe(false)
    await expect(service.send({ to: 'peer', text: 'hi', mode: 'notify' }))
      .rejects.toThrow(/hub set, token reference YUYI_ABSENT_TOKEN/)
  })

  it('fails sends with YUYI_NOT_CONNECTED while the hub is unreachable', async () => {
    // 注入凭证库 token（设置界面录入），让 service 确实进入"已配置但连接失败"状态。
    const { service } = await setup({ hub: 'ws://127.0.0.1:1', credentials: { value: LAUNCH_TOKEN } })
    await vi.waitFor(() => { expect(service.status().hub).toBe('ws://127.0.0.1:1') })
    expect(service.status().configured).toBe(true)
    await vi.waitFor(() => { expect(service.status().lastError).toBeDefined() })
    await expect(service.send({ to: 'peer', text: 'hi', mode: 'notify' }))
      .rejects.toThrow(`hub not connected (${service.status().lastError ?? ''})`)
  })

  it('connects, reports welcome identity, and stops emitting once settled', async () => {
    const hub = await startHub()
    // token 唯一来源是 dsh 凭证库（用户设置界面写入）。注入 LAUNCH_TOKEN 走
    // dsh 凭证库，文件/env 里的 ambient 全部不能溜进来。
    const { ctx, service } = await setup({ hub: hub.url, credentials: { value: LAUNCH_TOKEN } })
    const statusSeen: boolean[] = []
    ctx.on('yuyi/status', ({ status }) => { statusSeen.push(status.connected) })
    await vi.waitFor(() => { expect(service.status().connected).toBe(true) })
    expect(service.status()).toMatchObject({
      configured: true,
      connected: true,
      hub: hub.url,
      device: 'dsh-test-device',
      agentName: 'fixture-agent',
      ownerUsername: 'fixture-owner',
      role: 'worker',

      deviceUnread: 0,
    })
    expect(service.status().lastError).toBeUndefined()
    const settled = statusSeen.length
    await new Promise((resolve) => { setTimeout(resolve, 80) })
    expect(statusSeen.length).toBe(settled)
    expect(hub.helloFrames[0]).toMatchObject({ device: 'dsh-test-device', token: LAUNCH_TOKEN, agentKind: 'dsh' })
  })

  it('only resolves the token from the credentials seam; ambient env / per-agent file / shared env are all ignored', async () => {
    const hub = await startHub()
    // 凭证库命中 → 用该 token 连接。模块顶部注入的所有 ambient 污染源
    // （进程 env.YUYI_TOKEN、~/.yuyi/dsh-token、~/.yuyi/env）全部不能溜进来。
    const seam = await setup({ hub: hub.url, credentials: { value: 'seam-token' } })
    await vi.waitFor(() => { expect(seam.service.status().connected).toBe(true) })
    expect(hub.helloFrames.at(-1)?.token).toBe('seam-token')
    await seam.stop()

    // 凭证库未挂载 → 即使环境变量 / 安装器文件 / 共享 env 里全部躺着
    // "其他 Agent 的 token"，服务也保持休眠。这种"免配置就连上"的体验
    // 正是我们要堵的——如果这个测试用例连上了，提单。
    const ambient = await setup({ hub: hub.url })
    await vi.waitFor(() => { expect(ambient.service.status().hub).toBe(hub.url) })
    expect(ambient.service.status().configured).toBe(false)
    expect(hub.helloFrames.find(f => f.token === 'ambient-other-agent-token'
      || f.token === 'ambient-file-other-agent-token'
      || f.token === 'ambient-env-file-other-agent-token')).toBeUndefined()
    await ambient.stop()
  })

  it('falls back to ~/.yuyi/dsh-token when the credentials seam is empty; ambient env cannot hijack', async () => {
    const hub = await startHub()
    // 文件路径走 dsh 专属 token（与 ~/.yuyi/omp-token 同约定）。本用例让
    // "红框文件"存在、凭证库没设——验证运行时只读这一个文件拿 token。
    // 进程 env 和 ~/.yuyi/env 里同时躺着 ambient 污染，验证它们不会被拾起。
    const dshTokenFile = join(stateDir, 'dsh-token')
    writeFileSync(dshTokenFile, 'dsh-installer-token-value')

    try {
      const fallback = await setup({ hub: hub.url })
      await vi.waitFor(() => { expect(fallback.service.status().connected).toBe(true) })
      // 命中文件 token，**不是** ambient 三个里任何一个
      expect(hub.helloFrames.at(-1)?.token).toBe('dsh-installer-token-value')
      expect(hub.helloFrames.find(f => f.token === 'ambient-other-agent-token'
        || f.token === 'ambient-file-other-agent-token'
        || f.token === 'ambient-env-file-other-agent-token')).toBeUndefined()
      await fallback.stop()
    } finally {
      try { rmSync(dshTokenFile) } catch { /* 已不存在 */ }
    }
  })

  it('stays dormant when token resolution fails inside the seam', async () => {
    const hub = await startHub()
    const { service } = await setup({ hub: hub.url, credentials: { fail: true } })
    await vi.waitFor(() => { expect(service.status().hub).toBe(hub.url) })
    expect(service.status().configured).toBe(false)
    expect(hub.hasClient()).toBe(false)
  })

  it('resolves the device from the launch environment when unconfigured', async () => {
    const hub = await startHub()
    process.env.YUYI_DEVICE = 'env-device'
    const { service } = await setup({ hub: hub.url, deviceless: true, credentials: { value: LAUNCH_TOKEN } })
    await vi.waitFor(() => { expect(service.status().connected).toBe(true) })
    expect(service.status().device).toBe('env-device')
    delete process.env.YUYI_DEVICE
  })

  it('reports the hub url while the handshake is still pending', async () => {
    const hub = await startHub()
    hub.silent = true
    const { service } = await setup({ hub: hub.url, credentials: { value: LAUNCH_TOKEN } })
    await vi.waitFor(() => { expect(hub.helloFrames.length).toBe(1) })
    expect(service.status().connected).toBe(false)
    expect(service.status().lastError).toBeUndefined()
    await expect(service.send({ to: 'peer', text: 'hi', mode: 'notify' }))
      .rejects.toThrow(`hub not connected (${hub.url})`)
  })

  it('resolves the device from the env file, then the hostname', async () => {
    const hub = await startHub()
    mkdirSync(join(fakeHome, '.yuyi'), { recursive: true })
    writeFileSync(join(fakeHome, '.yuyi', 'env'), 'YUYI_DEVICE=file-device' + String.fromCharCode(10))
    const file = await setup({ hub: hub.url, deviceless: true, credentials: { value: LAUNCH_TOKEN } })
    await vi.waitFor(() => { expect(file.service.status().connected).toBe(true) })
    expect(file.service.status().device).toBe('file-device')
    await file.stop()

    writeFileSync(join(fakeHome, '.yuyi', 'env'), '')
    const host = await setup({ hub: hub.url, deviceless: true, credentials: { value: LAUNCH_TOKEN } })
    await vi.waitFor(() => { expect(host.service.status().connected).toBe(true) })
    expect(host.service.status().device).toBe(hostname())
  })
})

describe('roster registration', () => {
  it('registers aliases, pushes roster frames, and frees them on dispose', async () => {
    const hub = await startHub()
    const { ctx, service } = await connectedService(hub)
    const disposeA = service.register(SessionId('sess-a'), { title: 'A', directory: '/a', name: 'worker-a' })
    service.register(SessionId('sess-b'), { title: 'B', directory: '/b' })
    expect(service.aliasOf(SessionId('sess-a'))).toBe('worker-a')
    expect(service.aliasOf(SessionId('sess-b'))).toBeUndefined()
    expect(service.aliasOf(SessionId('unknown'))).toBeUndefined()
    await vi.waitFor(() => { expect(hub.rosterFrames.length).toBeGreaterThanOrEqual(1) })
    const combined = hub.rosterFrames.at(-1) as RosterSession[]
    expect(combined).toEqual(expect.arrayContaining([
      expect.objectContaining({ sessionID: 'sess-a', name: 'worker-a', capabilities: { wake: true } }),
      expect.objectContaining({ sessionID: 'sess-b', capabilities: { wake: true } }),
    ]))
    disposeA()
    await vi.waitFor(() => {
      const latest = hub.rosterFrames.at(-1) as RosterSession[]
      expect(latest.some(entry => entry.sessionID === 'sess-a')).toBe(false)
    })
    expect(service.aliasOf(SessionId('sess-a'))).toBeUndefined()
    expect(() => service.register(SessionId('sess-c'), { title: 'C', directory: '/c', name: 'WORKER-A' })).not.toThrow()
    void ctx
  })

  it('re-pushes the roster after a service-level reconnect', async () => {
    const hub = await startHub()
    const { service } = await connectedService(hub)
    service.register(SessionId('sess-a'), { title: 'A', directory: '/a', name: 'worker-a' })
    await vi.waitFor(() => { expect(hub.rosterFrames.length).toBeGreaterThanOrEqual(1) })
    const before = hub.rosterFrames.length
    // 服务级重连：stop() 后新建 HubClient（新 instanceID、空内部名单）——
    // start() 必须把当前 roster 种进新客户端，welcome 后才会推给 hub。
    await (service as unknown as { reconnect(): Promise<void> }).reconnect()
    await vi.waitFor(() => { expect(service.status().connected).toBe(true) })
    await vi.waitFor(() => {
      expect(hub.rosterFrames.length).toBeGreaterThan(before)
      const latest = hub.rosterFrames.at(-1) as RosterSession[]
      expect(latest.some(entry => entry.sessionID === 'sess-a' && entry.name === 'worker-a')).toBe(true)
    })
  })

  it('rejects a duplicate alias held by another session', async () => {
    const { service } = await setup()
    const first = service.register(SessionId('sess-a'), { title: 'A', directory: '/a', name: 'solo' })
    expect(() => service.register(SessionId('sess-b'), { title: 'B', directory: '/b', name: 'solo' }))
      .toThrow(YuyiError)
    const second = service.register(SessionId('sess-a'), { title: 'A2', directory: '/a2', name: 'solo' })
    first()
    second()
    expect(service.aliasOf(SessionId('sess-a'))).toBeUndefined()
  })
})

describe('sending', () => {
  it('maps the ack outcome onto the send result', async () => {
    const hub = await startHub()
    hub.sendDeliveredAs = 'mail_fallback'
    hub.sendHandlerSessionID = 'sess-remote'
    const { service } = await connectedService(hub)
    service.register(SessionId('sess-a'), { title: 'A', directory: '/a', name: 'worker-a' })
    const result = await service.send({
      to: 'peer-dev:reviewer',
      text: 'status?',
      mode: 'notify',
      fromSession: SessionId('sess-a'),
      taskId: 'task-1',
      classification: 'info',
      contextHint: 'checklist',
    })
    expect(result).toMatchObject({ messageId: hub.sentMessages[0]!.id, deliveredAs: 'mail_fallback', handlerSessionID: 'sess-remote' })
    expect(result.message.id).toBe(hub.sentMessages[0]!.id)
    expect(hub.sentMessages[0]).toMatchObject({
      mode: 'notify',
      text: 'status?',
      from: { device: 'dsh-test-device', sessionID: 'sess-a', name: 'worker-a' },
      to: { device: 'peer-dev', target: 'reviewer' },
      taskId: 'task-1',
      classification: 'info',
      contextHint: 'checklist',
    })
    expect(hub.sentMessages[0]!.expectReply).toBeUndefined()
  })

  it('falls back to a device-level origin for unregistered senders', async () => {
    const hub = await startHub()
    hub.sendDeliveredAs = undefined
    const { service } = await connectedService(hub)
    const result = await service.send({ to: '*', text: 'hello all', mode: 'mail' })
    expect(result.messageId).toBe(hub.sentMessages[0]!.id)
    expect(result.deliveredAs).toBeUndefined()
    expect(hub.sentMessages[0]).toMatchObject({ from: { sessionID: 'dsh' }, to: { target: '*' } })
  })

  it('surfaces a hub rejection as YUYI_SEND_REJECTED', async () => {
    const hub = await startHub()
    hub.sendAckOk = false
    hub.sendAckDetail = 'broadcast denied by policy'
    const { service } = await connectedService(hub)
    let refusal: YuyiError | undefined
    try {
      await service.send({ to: '*', text: 'hi', mode: 'notify' })
      expect.unreachable('send should have been rejected')
    } catch (error) {
      refusal = error as YuyiError
    }
    expect(refusal?.code).toBe('YUYI_SEND_REJECTED')
    expect(refusal?.message).toContain('broadcast denied by policy')
    hub.sendAckDetail = undefined
    await expect(service.send({ to: '*', text: 'hi', mode: 'notify' }))
      .rejects.toThrow(/no detail/)
  })

  it('traces a replied frame when the send answers another message', async () => {
    const hub = await startHub()
    const { service } = await connectedService(hub)
    await service.send({ to: 'reviewer', text: 'done', mode: 'notify', replyTo: 'msg_remote_1', taskId: 'task-1' })
    await vi.waitFor(() => {
      expect(hub.traceFrames).toEqual([expect.objectContaining({ event: 'replied', detail: 'task-1' })])
    })
    expect(hub.traceFrames[0]!.msgId).toBe(hub.sentMessages[0]!.id)
  })
})

describe('expect-reply correlation', () => {
  it('resolves when the reply arrives and consumes it without re-routing', async () => {
    const hub = await startHub()
    const { service } = await connectedService(hub)
    const pending = service.sendExpectingReply({ to: 'reviewer', text: 'review please', mode: 'notify' })
    await vi.waitFor(() => { expect(hub.sentMessages.length).toBe(1) })
    const sentId = hub.sentMessages[0]!.id
    expect(hub.sentMessages[0]).toMatchObject({ expectReply: true })
    const deliver = hub.deliver(remoteMessage({ id: 'msg_reply_1', replyTo: sentId, to: { target: 'worker-a' } }))
    const exchange = await pending
    expect(exchange.sent.id).toBe(sentId)
    expect(exchange.reply.id).toBe('msg_reply_1')
    // 等待者消费了回信；即便此处没有名为 worker-a 的
    // roster 会话，设备收件箱也一无所获。
    expect(await deliver).toMatchObject({ ok: true, detail: 'consumed by expect-reply waiter' })
    expect(service.inboxRead('device', true)).toHaveLength(0)
  })

  it('rejects an expect-reply wait whose send the hub refuses', async () => {
    const hub = await startHub()
    hub.sendAckOk = false
    hub.sendAckDetail = 'policy refuses expect-reply'
    const { service } = await connectedService(hub)
    await expect(service.sendExpectingReply({ to: 'reviewer', text: 'review please', mode: 'notify' }))
      .rejects.toMatchObject({ code: 'YUYI_SEND_REJECTED', message: /policy refuses expect-reply/ })
  })

  it('rejects with YUYI_REPLY_TIMEOUT when no reply arrives', async () => {
    const hub = await startHub()
    const { service } = await connectedService(hub)
    await expect(service.sendExpectingReply({ to: 'reviewer', text: 'anyone?', mode: 'notify' }))
      .rejects.toMatchObject({ code: 'YUYI_REPLY_TIMEOUT' })
  })

  it('rejects with YUYI_REPLY_ABORTED on caller abort and on service stop', async () => {
    const hub = await startHub()
    const { service, stop } = await connectedService(hub)
    const controller = new AbortController()
    const pending = service.sendExpectingReply({ to: 'reviewer', text: 'urgent', mode: 'notify' }, controller.signal)
    await vi.waitFor(() => { expect(hub.sentMessages.length).toBe(1) })
    controller.abort()
    await expect(pending).rejects.toMatchObject({ code: 'YUYI_REPLY_ABORTED' })

    const stopping = service.sendExpectingReply({ to: 'reviewer', text: 'urgent 2', mode: 'notify' })
    await vi.waitFor(() => { expect(hub.sentMessages.length).toBe(2) })
    await stop()
    await expect(stopping).rejects.toMatchObject({ code: 'YUYI_REPLY_ABORTED' })
  })

  it('routes a reply whose waiter is already gone', async () => {
    const hub = await startHub()
    const { service } = await connectedService(hub)
    const ack = await hub.deliver(remoteMessage({ replyTo: 'msg_nobody', to: { target: 'nobody-here' } }))
    expect(ack).toMatchObject({ ok: true })
    expect(service.inboxRead('device')).toHaveLength(1)
  })
})

describe('delivery routing', () => {
  it('wakes an idle agent with a follow-up carrying formatted text', async () => {
    const hub = await startHub()
    const { ctx, service } = await connectedService(hub)
    service.register(SessionId('sess-a'), { title: 'A', directory: '/a', name: 'worker-a' })
    const delivered: string[] = []
    ctx.on('yuyi/delivered', ({ route, sessionId }) => { delivered.push(`${route}:${sessionId ?? 'none'}`) })
    const idle = fakeAgent(ctx, 'sess-a', 'idle')
    const ack = await hub.deliver(remoteMessage({
      from: { device: 'remote-dev', sessionID: 'peer-1', name: 'reviewer', ownerUsername: 'alice', role: 'avatar' },
    }))
    expect(ack).toEqual({ ok: true, handlerSessionID: 'sess-a' })
    expect(idle.followup).toHaveBeenCalledTimes(1)
    expect(idle.steer).not.toHaveBeenCalled()
    const message = idle.followup.mock.calls[0]![0] as {
      content: Array<{ type: string; text: string }>
      source: { kind: string; plugin: string; form: string; summary: string }
    }
    expect(message.content[0]!.text).toBe(
      '[yuyi] from reviewer@remote-dev · owner alice · role avatar\nplease review the plan',
    )
    expect(message.source).toMatchObject({ kind: 'plugin', plugin: 'dsh-yuyi', form: 'notice' })
    expect(delivered).toEqual(['woken:sess-a'])
    await vi.waitFor(() => { expect(hub.traceFrames).toEqual([expect.objectContaining({ event: 'injected', detail: 'followup' })]) })
  })

  it('steers a running agent instead of waking it', async () => {
    const hub = await startHub()
    const { ctx, service } = await connectedService(hub)
    service.register(SessionId('sess-b'), { title: 'B', directory: '/b', name: 'worker-b' })
    const running = fakeAgent(ctx, 'sess-b', 'running')
    const ack = await hub.deliver(remoteMessage({ to: { target: 'WORKER-B' } }))
    expect(ack).toMatchObject({ ok: true, handlerSessionID: 'sess-b' })
    expect(running.steer).toHaveBeenCalledTimes(1)
    expect(running.followup).not.toHaveBeenCalled()
  })

  it('parks mail and notify-to-dead-sessions in the session inbox', async () => {
    const hub = await startHub()
    const { service } = await connectedService(hub)
    service.register(SessionId('sess-a'), { title: 'A', directory: '/a', name: 'worker-a' })
    const mailAck = await hub.deliver(remoteMessage({ id: 'msg_mail', mode: 'mail' }))
    expect(mailAck).toMatchObject({ ok: true, handlerSessionID: 'sess-a', detail: 'parked in session inbox' })
    const notifyAck = await hub.deliver(remoteMessage({ id: 'msg_dead' }))
    expect(notifyAck).toMatchObject({ detail: 'session not live; parked in session inbox' })
    const peeked = service.inboxRead(SessionId('sess-a'), true)
    expect(peeked.map(entry => entry.message.id)).toEqual(['msg_mail', 'msg_dead'])
    expect(service.inboxRead(SessionId('sess-a'))).toHaveLength(2)
    expect(service.inboxRead(SessionId('sess-a'))).toHaveLength(0)
  })

  it('drops own-device broadcast echoes and parks unmatched targets in the device inbox', async () => {
    const hub = await startHub()
    const { ctx, service } = await connectedService(hub)
    service.register(SessionId('sess-a'), { title: 'A', directory: '/a', name: 'worker-a' })
    const routes: string[] = []
    ctx.on('yuyi/delivered', ({ route }) => { routes.push(route) })
    const echo = await hub.deliver(remoteMessage({
      from: { device: 'dsh-test-device', sessionID: 'peer-1' },
      to: { target: '*' },
    }))
    expect(echo).toMatchObject({ ok: true, detail: 'own-device broadcast echo dropped' })
    const foreign = await hub.deliver(remoteMessage({ to: { target: 'not-registered' } }))
    expect(foreign).toMatchObject({ ok: true, detail: 'no local roster match; parked in device inbox' })
    expect(routes).toEqual(['echo-dropped', 'device-inbox'])
    expect(service.status().deviceUnread).toBe(1)
    expect(service.inboxRead('device').map(entry => entry.message.to.target)).toEqual(['not-registered'])
  })

  it('wakes a live session via agentName fallback when no alias matches', async () => {
    // 修复：opencode session 没显式 yuyi_register 时，收到发给本 agentName 的
    // notify 也能被唤醒——通过 ctx.agents.list() 动态兜底挑一个 live session。
    const hub = await startHub()
    const { ctx, service } = await connectedService(hub)
    const live = fakeAgent(ctx, 'sess-live', 'idle')
    // 注意：没调用 service.register()——roster 是空的
    expect([...ctx.agents.list()].length).toBe(1)
    const ack = await hub.deliver(remoteMessage({
      from: { device: 'remote-dev', sessionID: 'peer-1', name: 'reviewer', ownerUsername: 'alice', role: 'avatar' },
      to: { target: 'fixture-agent' },  // fixture hub 的 agentName（hub welcome 帧）
    }))
    expect(ack).toMatchObject({ ok: true, handlerSessionID: 'sess-live' })
    expect(live.followup).toHaveBeenCalledTimes(1)
  })

  it('wakes a live session via cross-device * broadcast', async () => {
    // 修复：跨设备 * 广播不再落 device inbox，而是唤醒任意 live session。
    const hub = await startHub()
    const { ctx, service } = await connectedService(hub)
    const live = fakeAgent(ctx, 'sess-bc', 'idle')
    const delivered: string[] = []
    ctx.on('yuyi/delivered', ({ route, sessionId }) => { delivered.push(`${route}:${sessionId ?? 'none'}`) })
    const ack = await hub.deliver(remoteMessage({
      from: { device: 'OTHER-DEVICE', sessionID: 'peer-1' },
      to: { target: '*' },
    }))
    expect(ack).toMatchObject({ ok: true, handlerSessionID: 'sess-bc' })
    expect(live.followup).toHaveBeenCalledTimes(1)
    expect(delivered).toEqual(['woken:sess-bc'])
  })

  it('still drops * broadcast to device inbox when no live session exists', async () => {
    // 跨设备 * 广播且本进程没有任何 live session——走 device inbox（合理兜底）。
    const hub = await startHub()
    const { ctx, service } = await connectedService(hub)
    expect(ctx.agents.list().length).toBe(0) // no live agents registered
    const ack = await hub.deliver(remoteMessage({
      from: { device: 'OTHER-DEVICE', sessionID: 'peer-1' },
      to: { target: '*' },
    }))
    expect(ack).toMatchObject({ ok: true, detail: 'cross-device broadcast but no live session; parked' })
    expect(service.inboxRead('device')).toHaveLength(1)
  })

  it('still drops own-device * broadcast echoes', async () => {
    // 回归：自己设备发来的 * 仍是回声丢弃（不能自我唤醒成循环）。
    const hub = await startHub()
    const { ctx } = await connectedService(hub)
    fakeAgent(ctx, 'sess-self', 'idle')
    const ack = await hub.deliver(remoteMessage({
      from: { device: 'dsh-test-device', sessionID: 'self' },
      to: { target: '*' },
    }))
    expect(ack).toMatchObject({ ok: true, detail: 'own-device broadcast echo dropped' })
  })

  it('heartbeat carries heartbeatExtra fields (remoteGateway 透传)', async () => {
    // address 上报契约 §2：心跳帧透传 dsh-remote 网关状态（通道只透传不解释）
    const hub = await startHub()
    const { HubClient } = await import('../src/core.ts')
    const client = new HubClient({
      url: hub.url, device: 'hb-dev', instanceID: 'hb-1', token: 't',
      agentKind: 'dsh-probe', capabilities: { wake: false },
      onDeliver: async () => ({ ok: true }),
      heartbeatIntervalMs: 60,
      heartbeatExtra: () => ({ remoteGateway: { address: '192.168.1.146:3090', enabled: true } }),
      log: () => {},
    })
    client.start()
    await vi.waitFor(() => { expect(hub.heartbeatFrames.length).toBeGreaterThanOrEqual(1) }, { timeout: 3000, interval: 20 })
    client.stop()
    expect(hub.heartbeatFrames[0]!.remoteGateway).toEqual({ address: '192.168.1.146:3090', enabled: true })
  })

  it('heartbeat omits remoteGateway when heartbeatExtra is absent', async () => {
    const hub = await startHub()
    const { HubClient } = await import('../src/core.ts')
    const client = new HubClient({
      url: hub.url, device: 'hb-dev', instanceID: 'hb-2', token: 't',
      agentKind: 'dsh-probe', capabilities: { wake: false },
      onDeliver: async () => ({ ok: true }),
      heartbeatIntervalMs: 60,
      log: () => {},
    })
    client.start()
    await vi.waitFor(() => { expect(hub.heartbeatFrames.length).toBeGreaterThanOrEqual(1) }, { timeout: 3000, interval: 20 })
    client.stop()
    expect('remoteGateway' in hub.heartbeatFrames[0]!).toBe(false)
  })

  it('matches a roster entry by session id when no alias exists', async () => {
    const hub = await startHub()
    const { ctx, service } = await connectedService(hub)
    service.register(SessionId('sess-plain'), { title: 'P', directory: '/p' })
    const plain = fakeAgent(ctx, 'sess-plain', 'idle')
    const ack = await hub.deliver(remoteMessage({ to: { target: 'sess-plain' } }))
    expect(ack).toMatchObject({ ok: true, handlerSessionID: 'sess-plain' })
    expect(plain.followup).toHaveBeenCalledTimes(1)
  })

  it('routes a delivery addressed to the authoritative agent name to the primary session', async () => {
    const hub = await startHub()
    const { ctx, service } = await connectedService(hub)
    service.register(SessionId('sess-main'), { title: 'Main', directory: '/m', name: 'local-alias' })
    const idle = fakeAgent(ctx, 'sess-main', 'idle')
    // 统一智能体名称寻址：权威名（fixture welcome 的 agentName）命中的投递
    // 由端侧分发给最早注册的主会话，而不是按别名/sessionID 匹配失败停箱。
    const ack = await hub.deliver(remoteMessage({ to: { target: 'Fixture-Agent' } }))
    expect(ack).toMatchObject({ ok: true, handlerSessionID: 'sess-main' })
    expect(idle.followup).toHaveBeenCalledTimes(1)
  })

  it('still parks agent-name deliveries in the device inbox when no session is registered', async () => {
    const hub = await startHub()
    const { service } = await connectedService(hub)
    const ack = await hub.deliver(remoteMessage({ to: { target: 'fixture-agent' } }))
    expect(ack).toMatchObject({ ok: true, detail: 'no local roster match; parked in device inbox' })
    expect(service.inboxRead('device').map(entry => entry.message.to.target)).toEqual(['fixture-agent'])
  })

  it('returns live agents that exist before service start via syncRosterFromLiveAgents', async () => {
    // 修复：构造器订阅 agent/created 只接未来事件；如果 opencode session 是在
    // dsh-yuheng 服务装好之前就被 register 进 AgentRegistry 的（例如用户已打开
    // GUI session、或工具调用挂载的 session），新 wake 会因 roster 空而落 inbox。
    // startInternal 末尾的 syncRosterFromLiveAgents 在 hub welcome 后枚举
    // ctx.agents.list()，把这些「幽灵 live agent」补进 roster。
    //
    // 这个测试在 yuyi.spec.ts 的 connectedService 流程里已经隐含覆盖：
    // connectedService 里 hub 与 service 都在同一个新进程上启动，没有「先后」
    // 之分，syncRosterFromLiveAgents 跑在 connectedService 的 setup 之后。
    // 这里我们直接验证：先 fakeAgent 一个 live agent，再连 service，delivery
    // 经 agentName fallback 命中该 live agent。
    const hub = await startHub()
    // 模拟 service 启动之前已经 live 的 agent
    //（实际测试中 setup() 会建立新的 cordis Context，但 hub fake hub 是独立的）
    const idle = vi.fn<(message: unknown) => void>()
    const id = SessionId('sess-pre-existing')
    // 通过一个独立的 ctx 来 pre-create agent（绕过 connectedService 的 setup）
    const { ctx: ctxA } = await connectedService(hub)  // 先连上 hub 拿到 setup 后的 ctx
    const agentA = {
      id, ctx: ctxA, followup: idle, steer: vi.fn(), status: 'idle',
      session: { id, header: { version: 0, id, createdAt: 0 } },
    } as unknown as Agent
    const dispose = ctxA.agents.register(agentA)
    teardowns.push(async () => { dispose() })
    // 现在再来一次 deliver，让 syncRosterFromLiveAgents（虽然已经跑过了）的结果生效
    const ack = await hub.deliver(remoteMessage({
      from: { device: 'remote-dev', sessionID: 'peer-1', name: 'reviewer', ownerUsername: 'alice', role: 'avatar' },
      to: { target: 'fixture-agent' },
    }))
    expect(ack).toMatchObject({ ok: true, handlerSessionID: 'sess-pre-existing' })
    expect(idle).toHaveBeenCalledTimes(1)
  })

  it('acknowledges a wake immediately and mails the turn result when it settles', async () => {
    const hub = await startHub()
    const { ctx, service } = await connectedService(hub)
    service.register(SessionId('sess-auto'), { title: 'A', directory: '/a', name: 'worker-auto' })
    let releaseIdle!: () => void
    const id = SessionId('sess-auto')
    const events: unknown[] = []
    const agent = {
      id,
      ctx,
      followup: vi.fn(),
      steer: vi.fn(),
      status: 'idle' as const,
      whenIdle: () => new Promise<void>((resolve) => { releaseIdle = resolve }),
      session: { id, header: { version: 0, id, createdAt: 0 }, seq: 0, events },
    } as unknown as Agent
    const dispose = ctx.agents.register(agent)
    teardowns.push(async () => { dispose() })

    await hub.deliver(remoteMessage({ id: 'msg_auto', taskId: 'task-auto-1', to: { target: 'worker-auto' } }))
    // 即时回执：mail 回发送方（带设备+owner 前缀），挂任务链与自动标记，不带 replyTo（不消费等待者）
    await vi.waitFor(() => {
      expect(hub.sentMessages.some(message =>
        message.mode === 'mail' && message.contextHint === 'yuyi:auto-ack'
        && message.taskId === 'task-auto-1'
        && message.replyTo === undefined)).toBe(true)
    }, { timeout: 5_000, interval: 20 })
    // 回合未落定前不产生结果回报
    expect(hub.sentMessages.some(message => message.contextHint === 'yuyi:auto-result')).toBe(false)
    // 回合产出并落定：结果带 replyTo 回报（消费等待者）
    events.push({ seq: 1, type: 'assistant/message', data: { message: { content: [{ type: 'text', text: '处理完成：已核对' }] } } })
    releaseIdle()
    await vi.waitFor(() => {
      expect(hub.sentMessages.some(message =>
        message.contextHint === 'yuyi:auto-result' && message.replyTo === 'msg_auto'
        && message.text.includes('处理完成'))).toBe(true)
    }, { timeout: 5_000, interval: 20 })
  })

  it('never arms auto machinery for auto-produced messages', async () => {
    const hub = await startHub()
    const { ctx, service } = await connectedService(hub)
    service.register(SessionId('sess-auto2'), { title: 'A2', directory: '/a2', name: 'worker-auto2' })
    const idle = fakeAgent(ctx, 'sess-auto2', 'idle')
    const before = hub.sentMessages.length
    await hub.deliver(remoteMessage({ id: 'msg_loop', to: { target: 'worker-auto2' }, contextHint: 'yuyi:auto-ack' }))
    expect(idle.followup).toHaveBeenCalledTimes(1)
    await new Promise(resolve => { setTimeout(resolve, 100) })
    // 自动机制产出的消息不再触发回执/回报（防环）
    expect(hub.sentMessages.length).toBe(before)
  })
})

describe('hub inbox and peers', () => {
  it('drains hub inbox entries and acknowledges consumption', async () => {
    const hub = await startHub()
    hub.inboxEntries = [{ message: remoteMessage({ id: 'msg_hub_1' }), receivedAt: 5 }]
    hub.inboxRemaining = 1
    const { service } = await connectedService(hub)
    const entries = await service.hubInboxDrain()
    expect(entries).toHaveLength(1)
    expect(entries[0]?.receivedAt).toBe(5)
    expect(entries[0]?.message.id).toBe('msg_hub_1')
    await service.hubInboxAck(['msg_hub_1'])
    hub.inboxAckOk = false
    await expect(service.hubInboxAck(['msg_x'])).rejects.toMatchObject({ code: 'YUYI_SEND_REJECTED' })
  })

  it('lists reachable peers', async () => {
    const hub = await startHub()
    const device: PeerDevice = { device: 'remote-dev', instanceID: 'inst-1', sessions: [] }
    hub.peersDevices = [device]
    const { service } = await connectedService(hub)
    await expect(service.peers()).resolves.toEqual([device])
  })

  it('strips hub-internal markers from peer sessions', async () => {
    const hub = await startHub()
    hub.peersDevices = [{
      device: 'remote-dev',
      instanceID: 'inst-1',
      sessions: [{ sessionID: 's1', title: 'T', directory: '/d', agentNameHit: true } as never],
    }]
    const { service } = await connectedService(hub)
    const devices = await service.peers()
    expect(devices[0]!.sessions[0]).toEqual({ sessionID: 's1', title: 'T', directory: '/d' })
    expect('agentNameHit' in (devices[0]!.sessions[0] as object)).toBe(false)
  })
})

describe('delivery presentation helpers', () => {
  it('formats the full threading header when every field is present', () => {
    expect(formatIncoming(remoteMessage({
      from: { device: 'dev', sessionID: 's1', name: 'reviewer', ownerUsername: 'alice', role: 'avatar' },
      replyTo: 'msg_0',
      taskId: 'task_9',
    }))).toBe('[yuyi] from reviewer@dev · owner alice · role avatar · reply-to msg_0 · task task_9\nplease review the plan')
    expect(deliverySummary(remoteMessage())).toBe('reviewer@remote-dev → worker-a')
  })

  it('falls back to the session id and omits absent fields', () => {
    const bare = remoteMessage({
      id: 'msg_bare',
      from: { device: '', sessionID: 's-plain' },
      to: { target: '*' },
    })
    expect(formatIncoming(bare)).toBe('[yuyi] from s-plain\nplease review the plan')
    expect(deliverySummary(bare)).toBe('s-plain → *')
  })
})
