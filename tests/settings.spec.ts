import './env.ts'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Context } from '@deepseek-ai/cordis'
import AgentRegistry from '@deepseek-ai/dsh-agent'
import YuyiRuntime from '../src/service.ts'
import { FixtureHub } from './fixture-hub.ts'
import { StubCredentials } from './fixture-credentials.ts'

// token 唯一来源是 dsh 凭证库。环境变量里再写一个 ambient 不会改变什么。
process.env.YUYI_TOKEN = 'ambient-other-agent-token'

/* * 每测试清理：插件 fiber 与 fixture hub，按最新优先销毁。 */
const teardowns: Array<() => Promise<void>> = []

afterEach(async () => {
  while (teardowns.length > 0) {
    const dispose = teardowns.pop()
    if (dispose !== undefined) await dispose()
  }
})

interface BootOptions {
  hub?: string
  /* * 从构造起挂起令牌解析，直至 `releaseToken` 执行。 */
  heldToken?: boolean
}

interface Booted {
  ctx: Context
  service: YuyiRuntime
  stop: () => Promise<void>
  releaseToken: () => void
}

const SEED_TOKEN = 'manual-token-value'

async function boot(options: BootOptions = {}): Promise<Booted> {
  const ctx = new Context()
  teardowns.push(async () => { await ctx.fiber.dispose() })
  const agentsFiber = await ctx.plugin(AgentRegistry)
  teardowns.push(async () => { await agentsFiber.dispose() })
  // 凭证库（stub）等价于"用户在御驿设置界面录入 token"；held 模式测
  // boot 时凭证服务晚到 / 解析期间 attach 的真实场景。
  let credentials: StubCredentials | undefined
  const credentialsFiber = await ctx.plugin((child: Context) => {
    credentials = new StubCredentials(child, { value: SEED_TOKEN, held: options.heldToken === true })
  })
  teardowns.push(async () => { await credentialsFiber.dispose() })
  const fiber = await ctx.plugin(YuyiRuntime, {
    tokenEnv: 'YUYI_TOKEN',
    replyTimeoutMs: 150,
    device: 'dsh-test-device',
    ...(options.hub !== undefined ? { hub: options.hub } : {}),
  })
  const stop = async (): Promise<void> => { await fiber.dispose() }
  teardowns.push(stop)
  return { ctx, service: ctx.yuyi, stop, releaseToken: () => { credentials?.release() } }
}

/* * 启动一个注册进每测试清理的 fixture hub。 */
async function startHub(): Promise<FixtureHub> {
  const hub = await new FixtureHub().start()
  teardowns.push(async () => { await hub.stop() })
  return hub
}

describe('yuyi 配置热更（0.1.7 loader/volatile-update）', () => {
  it('reconnects when the loader commits volatile config in place', async () => {
    const hubA = await startHub()
    const hubB = await startHub()
    const { ctx, service } = await boot({ hub: hubA.url })
    await vi.waitFor(() => { expect(service.status().connected).toBe(true) })
    expect(hubA.helloFrames).toHaveLength(1)

    // 模拟 0.1.7 loader 的原位提交：把运行中 config 的 hub/device 换成新的
    // Volatile 引用（.get() 返回新快照），随后 loader 在拥有 fiber 上广播
    // volatile-update，服务据此重连。
    const volatile = (value: unknown) => ({ get: () => value })
    const configArg = service as unknown as { configArg: Record<string, unknown> }
    configArg.configArg = {
      hub: volatile(hubB.url),
      device: volatile('renamed-device'),
      tokenEnv: 'YUYI_TOKEN',
      replyTimeoutMs: 150,
    }
    ;(service as unknown as { ctx: Context }).ctx.emit('loader/volatile-update', [])
    await vi.waitFor(() => { expect(service.status().hub).toBe(hubB.url) })
    expect(service.status().device).toBe('renamed-device')
    await vi.waitFor(() => {
      expect(service.status().connected).toBe(true)
      expect(hubB.helloFrames.at(-1)?.device).toBe('renamed-device')
    })
  })

  it('abandons in-flight and queued reconnects once the plugin unloads', async () => {
    const hub = await startHub()
    // 令牌解析从构造起被挂起，因此运行时最初的重连在 start() 内等待令牌；
    // 解析中途卸载必须让它无法拉起客户端。
    const { service, stop, releaseToken } = await boot({ hub: hub.url, heldToken: true })
    await stop()
    releaseToken()
    await new Promise((resolve) => { setTimeout(resolve, 50) })
    // 解析恢复进一个已销毁的运行时：周期戛然而止，既不解析 hub 也不拉起客户端。
    expect(service.status()).toMatchObject({ hub: '', configured: false, connected: false })
    expect(hub.helloFrames).toHaveLength(0)
  })
})
