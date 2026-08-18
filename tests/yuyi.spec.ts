import './env.ts'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Context, type Context as CordisContext } from '@deepseek-ai/cordis'
import AgentRegistry from '@deepseek-ai/dsh-agent'
import type { Agent } from '@deepseek-ai/dsh-agent'
import { CredentialProvider, type CredentialInfo, type CredentialRef, type ResolvedCredential } from '@deepseek-ai/dsh-credentials'
import { SessionId } from '@deepseek-ai/dsh-session'
import type { Fiber } from '@deepseek-ai/cordis'
import type { PeerDevice, RosterSession, YuyiMessage } from '../src/core.ts'
import YuyiRuntime, { YuyiError } from '../src/service.ts'
import { deliverySummary, formatIncoming } from '../src/delivery.ts'
import * as CoreFacade from '../src/core.ts'
import { hostname } from 'node:os'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { FixtureHub } from './fixture-hub.ts'
import { fakeHome, LAUNCH_TOKEN } from './env.ts'

process.env.YUYI_TOKEN = LAUNCH_TOKEN

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

/* * 解析固定令牌值、或按需失败的凭证提供者。 */
class StubCredentials extends CredentialProvider {
  constructor(
    ctx: CordisContext,
    private readonly fail: boolean,
    private readonly value: string | undefined,
  ) {
    super(ctx)
  }

  async resolve(ref: CredentialRef): Promise<ResolvedCredential | undefined> {
    if (this.fail) throw new Error('stub credentials failure')
    if (ref !== 'YUYI_TOKEN' || this.value === undefined) return undefined
    return { value: this.value, source: 'stub' }
  }

  async describe(): Promise<CredentialInfo> {
    return { configured: false, writable: false }
  }

  async set(): Promise<void> {
    throw new Error('stub credentials are read-only')
  }

  async unset(): Promise<void> {
    throw new Error('stub credentials are read-only')
  }
}

interface SetupOptions {
  hub?: string
  credentials?: { value: string } | { fail: true }
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
    credentialsFiber = await ctx.plugin((child: Context) => {
      new StubCredentials(child, 'fail' in credentials, 'fail' in credentials ? undefined : credentials.value)
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
  const handle = await setup({ hub: hub.url })
  await vi.waitFor(() => { expect(handle.service.status().connected).toBe(true) })
  return handle
}

describe('yuyi service', () => {
  it('exposes the vendored core through the facade', () => {
    expect(typeof CoreFacade.HubClient).toBe('function')
    expect(typeof CoreFacade.parseAddress).toBe('function')
  })

  it('stays dormant when hub or token do not resolve', async () => {
    // 已挂载的凭证接缝未命中引用时，穿透到
    // 启动环境与 env 文件，而不是启动失败。
    const { service } = await setup({ absentToken: true, credentials: { value: 'other-token' } })
    await vi.waitFor(() => { expect(service.status().hub).toBe('') })
    const status = service.status()
    expect(status).toMatchObject({ configured: false, connected: false, device: 'dsh-test-device', deviceUnread: 0 })
    await expect(service.send({ to: 'peer', text: 'hi', mode: 'notify' })).rejects.toMatchObject({ code: 'YUYI_NOT_CONFIGURED' })
    await expect(service.peers()).rejects.toMatchObject({ code: 'YUYI_NOT_CONFIGURED' })
  })

  it('reports a resolved hub with a missing token distinctly', async () => {
    const hub = await startHub()
    const { service } = await setup({ hub: hub.url, absentToken: true })
    await vi.waitFor(() => { expect(service.status().hub).toBe(hub.url) })
    expect(service.status().configured).toBe(false)
    await expect(service.send({ to: 'peer', text: 'hi', mode: 'notify' }))
      .rejects.toThrow(/hub set, token reference YUYI_ABSENT_TOKEN/)
  })

  it('fails sends with YUYI_NOT_CONNECTED while the hub is unreachable', async () => {
    const { service } = await setup({ hub: 'ws://127.0.0.1:1' })
    await vi.waitFor(() => { expect(service.status().hub).toBe('ws://127.0.0.1:1') })
    expect(service.status().configured).toBe(true)
    await vi.waitFor(() => { expect(service.status().lastError).toBeDefined() })
    await expect(service.send({ to: 'peer', text: 'hi', mode: 'notify' }))
      .rejects.toThrow(`hub not connected (${service.status().lastError ?? ''})`)
  })

  it('connects, reports welcome identity, and stops emitting once settled', async () => {
    const hub = await startHub()
    const { ctx, service } = await setup({ hub: hub.url })
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

  it('resolves the token through the credentials seam, then launch env, then env file', async () => {
    const hub = await startHub()
    // 凭证接缝挂载期间优先。
    delete process.env.YUYI_TOKEN
    const seam = await setup({ hub: hub.url, credentials: { value: 'seam-token' } })
    await vi.waitFor(() => { expect(seam.service.status().connected).toBe(true) })
    expect(hub.helloFrames.at(-1)?.token).toBe('seam-token')
    await seam.stop()

    // 启动环境在无接缝时解析。
    process.env.YUYI_TOKEN = LAUNCH_TOKEN
    const launch = await setup({ hub: hub.url })
    await vi.waitFor(() => { expect(launch.service.status().connected).toBe(true) })
    expect(hub.helloFrames.at(-1)?.token).toBe(LAUNCH_TOKEN)
    await launch.stop()

    // yuyi 环境文件是最后的兜底。
    delete process.env.YUYI_TOKEN
    mkdirSync(join(fakeHome, '.yuyi'), { recursive: true })
    writeFileSync(join(fakeHome, '.yuyi', 'env'), 'YUYI_TOKEN=file-token-value\n')
    const file = await setup({ hub: hub.url })
    await vi.waitFor(() => { expect(file.service.status().connected).toBe(true) })
    expect(hub.helloFrames.at(-1)?.token).toBe('file-token-value')
    process.env.YUYI_TOKEN = LAUNCH_TOKEN
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
    const { service } = await setup({ hub: hub.url, deviceless: true })
    await vi.waitFor(() => { expect(service.status().connected).toBe(true) })
    expect(service.status().device).toBe('env-device')
    delete process.env.YUYI_DEVICE
  })

  it('reports the hub url while the handshake is still pending', async () => {
    const hub = await startHub()
    hub.silent = true
    const { service } = await setup({ hub: hub.url })
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
    const file = await setup({ hub: hub.url, deviceless: true })
    await vi.waitFor(() => { expect(file.service.status().connected).toBe(true) })
    expect(file.service.status().device).toBe('file-device')
    await file.stop()

    writeFileSync(join(fakeHome, '.yuyi', 'env'), '')
    const host = await setup({ hub: hub.url, deviceless: true })
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
