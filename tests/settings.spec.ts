import './env.ts'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Context, type Context as CordisContext } from '@deepseek-ai/cordis'
import AgentRegistry from '@deepseek-ai/dsh-agent'
import { CredentialProvider, type CredentialInfo, type CredentialRef, type ResolvedCredential } from '@deepseek-ai/dsh-credentials'
import { FileSettingsProvider } from '@deepseek-ai/dsh-settings-file'
import type { Fiber } from '@deepseek-ai/cordis'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import YuyiRuntime from '../src/service.ts'
import { FixtureHub } from './fixture-hub.ts'
import { settingsNamespace } from '@deepseek-ai/dsh-settings'

process.env.YUYI_TOKEN = 'settings-token-value'

const NS = settingsNamespace('yuyi')

/** Per-test teardown: plugin fibers and fixture hubs, disposed newest-first. */
const teardowns: Array<() => Promise<void>> = []

afterEach(async () => {
  while (teardowns.length > 0) {
    const dispose = teardowns.pop()
    if (dispose !== undefined) await dispose()
  }
})

/** A credentials provider whose resolution stays held until the test releases it. */
class ManualCredentials extends CredentialProvider {
  private readonly gate: Promise<void>
  private readonly releaseGate: () => void

  constructor(ctx: CordisContext, private readonly value: string, held: boolean) {
    super(ctx)
    if (!held) {
      this.gate = Promise.resolve()
      this.releaseGate = () => {}
      return
    }
    let release!: () => void
    this.gate = new Promise<void>((resolve) => { release = resolve })
    this.releaseGate = () => { release() }
  }

  /** Let held resolutions through. */
  release(): void {
    this.releaseGate()
  }

  async resolve(ref: CredentialRef): Promise<ResolvedCredential | undefined> {
    if (ref !== 'YUYI_TOKEN') return undefined
    await this.gate
    return { value: this.value, source: 'stub' }
  }

  async describe(): Promise<CredentialInfo> {
    return { configured: false, writable: false }
  }

  async set(): Promise<void> {
    throw new Error('manual credentials are read-only')
  }

  async unset(): Promise<void> {
    throw new Error('manual credentials are read-only')
  }
}

interface BootOptions {
  hub?: string
  /** Hold token resolution from construction until `releaseToken` runs. */
  heldToken?: boolean
}

interface Booted {
  ctx: Context
  service: YuyiRuntime
  settingsFiber: Fiber
  stop: () => Promise<void>
  releaseToken: () => void
}

async function boot(options: BootOptions = {}): Promise<Booted> {
  const ctx = new Context()
  teardowns.push(async () => { await ctx.fiber.dispose() })
  const agentsFiber = await ctx.plugin(AgentRegistry)
  teardowns.push(async () => { await agentsFiber.dispose() })
  const home = mkdtempSync(join(tmpdir(), 'dsh-yuyi-settings-'))
  const settingsFiber = ctx.plugin(FileSettingsProvider, { path: join(home, 'settings.yaml'), watch: false })
  await settingsFiber
  teardowns.push(async () => { await settingsFiber.dispose() })
  let credentials: ManualCredentials | undefined
  if (options.heldToken === true) {
    const fiber = await ctx.plugin((child: Context) => {
      credentials = new ManualCredentials(child, 'manual-token-value', true)
    })
    teardowns.push(async () => { await fiber.dispose() })
  }
  const fiber = await ctx.plugin(YuyiRuntime, {
    tokenEnv: 'YUYI_TOKEN',
    replyTimeoutMs: 150,
    device: 'dsh-test-device',
    ...(options.hub !== undefined ? { hub: options.hub } : {}),
  })
  const stop = async (): Promise<void> => { await fiber.dispose() }
  teardowns.push(stop)
  return { ctx, service: ctx.yuyi, settingsFiber, stop, releaseToken: () => { credentials?.release() } }
}

/** Start a fixture hub registered for per-test teardown. */
async function startHub(): Promise<FixtureHub> {
  const hub = await new FixtureHub().start()
  teardowns.push(async () => { await hub.stop() })
  return hub
}

describe('yuyi settings namespace', () => {
  it('registers the yuyi namespace with the composition entry as its base layer', async () => {
    const { ctx } = await boot()
    const descriptor = ctx.settings.describe().find(candidate => candidate.ns === NS)
    expect(descriptor).toMatchObject({
      ns: NS,
      applies: 'live',
      base: { tokenEnv: 'YUYI_TOKEN', replyTimeoutMs: 150, device: 'dsh-test-device' },
    })
    expect(descriptor?.value).toMatchObject({ tokenEnv: 'YUYI_TOKEN', replyTimeoutMs: 150 })
  })

  it('reconnects under a settings-written hub and device', async () => {
    const hubA = await startHub()
    const hubB = await startHub()
    const { ctx, service } = await boot({ hub: hubA.url })
    await vi.waitFor(() => { expect(service.status().connected).toBe(true) })
    expect(hubA.helloFrames).toHaveLength(1)

    await ctx.settings.update(NS, { hub: hubB.url, device: 'renamed-device' })
    await vi.waitFor(() => { expect(service.status().hub).toBe(hubB.url) })
    expect(service.status().device).toBe('renamed-device')
    await vi.waitFor(() => {
      expect(service.status().connected).toBe(true)
      expect(hubB.helloFrames.at(-1)?.device).toBe('renamed-device')
    })
  })

  it('falls back to the composition entry when the settings provider detaches', async () => {
    const hubA = await startHub()
    const hubB = await startHub()
    const { ctx, service, settingsFiber } = await boot({ hub: hubA.url })
    await vi.waitFor(() => { expect(service.status().connected).toBe(true) })
    await ctx.settings.update(NS, { hub: hubB.url })
    await vi.waitFor(() => { expect(service.status().hub).toBe(hubB.url) })

    await settingsFiber.dispose()
    await vi.waitFor(() => { expect(service.status().hub).toBe(hubA.url) })
    await vi.waitFor(() => { expect(service.status().connected).toBe(true) })
  })

  it('abandons in-flight and queued reconnects once the plugin unloads', async () => {
    const hub = await startHub()
    // Token resolution is held from construction, so the runtime's initial
    // reconnect awaits inside start() while the settings attach queues a
    // second cycle behind it; unloading mid-resolution must leave both
    // unable to raise a client.
    const { service, stop, releaseToken } = await boot({ hub: hub.url, heldToken: true })
    await stop()
    releaseToken()
    await new Promise((resolve) => { setTimeout(resolve, 50) })
    // The resolution resumes into a disposed runtime: both cycles stop dead
    // before resolving the hub or raising a client.
    expect(service.status()).toMatchObject({ hub: '', configured: false, connected: false })
    expect(hub.helloFrames).toHaveLength(0)
  })
})
