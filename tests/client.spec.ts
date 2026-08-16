// 桩服务上的客户端插件注册：Remote 贡献
// 挂载、双字典、双插槽与轮询状态镜像。
import { afterEach, describe, expect, it, vi } from 'vitest'
import { apply, inject, unwrap } from '../src/client/index.ts'
import TYPERT_REMOTE from '../src/remote-contribution.ts'
import { YuyiStatusMirror } from '../src/client/status-mirror.ts'
import type { YuyiStatus } from '../src/types.ts'

const STUB_STATUS: YuyiStatus = {
  configured: true,
  connected: true,
  hub: 'ws://stub',
  device: 'stub-dev',
  deviceUnread: 0,
  sessions: [],
}

interface Stubbed {
  ctx: unknown
  mounted: unknown[]
  slots: Array<{ name: string; options: Record<string, unknown> }>
  namespaces: string[]
  scope: { set: ReturnType<typeof vi.fn>; unset: ReturnType<typeof vi.fn> }
  statusReads: { count: number }
}

function stubbed(): Stubbed {
  const mounted: unknown[] = []
  const slots: Array<{ name: string; options: Record<string, unknown> }> = []
  const namespaces: string[] = []
  const statusReads = { count: 0 }
  const scope = { set: vi.fn(), unset: vi.fn(), getSnapshot: () => ({}), subscribe: () => () => {} }
  const ctx = {
    effect: (fn: () => unknown) => {
      const dispose = fn()
      return () => {
        if (typeof dispose === 'function') void (dispose as () => void)()
      }
    },
    locale: {
      register: (ns: string) => {
        namespaces.push(ns)
        return () => {}
      },
      bind: (ns: string) => (key: string) => `${ns}:${String(key)}`,
    },
    remote: {
      $mount: async (contribution: unknown) => {
        mounted.push(contribution)
        return () => {}
      },
      yuyi: {
        status: () => {
          statusReads.count += 1
          return Promise.resolve({ ok: true, value: STUB_STATUS })
        },
        inbox: () => Promise.resolve({ ok: true, value: [] }),
      },
    },
    settingsScope: {
      bind: (spec: { namespace: string }) => {
        namespaces.push(`scope:${String(spec.namespace)}`)
        return scope
      },
    },
    slots: {
      inject: (_slot: string, register: () => unknown) => { void register() },
      register: (options: Record<string, unknown>) => {
        slots.push({ name: options['name'] as string, options })
        return () => {}
      },
    },
  }
  return { ctx, mounted, slots, namespaces, scope, statusReads }
}

afterEach(() => {
  vi.useRealTimers()
})

describe('dsh-yuyi browser half', () => {
  it('declares the services it binds', () => {
    expect(inject).toEqual(['slots', 'locale', 'connection', 'remote', 'settingsScope'])
  })

  it('mounts the yuyi remote contribution', () => {
    const { ctx, mounted } = stubbed()
    apply(ctx as never)
    expect(mounted).toEqual([TYPERT_REMOTE])
    expect(TYPERT_REMOTE.package).toBe('dsh-yuyi')
    expect(TYPERT_REMOTE.descriptors.map(d => (d as { namespace: string }).namespace))
      .toEqual(['yuyi', 'yuyi', 'yuyi'])
  })

  it('registers both dictionaries, both slots, and the settings namespace', () => {
    const { ctx, slots, namespaces } = stubbed()
    apply(ctx as never)
    expect(namespaces).toEqual(['yuyiTab', 'settings.yuyi', 'scope:yuyi'])
    expect(slots.map(slot => [slot.name, slot.options['id']])).toEqual([
      ['conversation.view', 'yuyi'],
      ['settings.section', 'yuyi'],
    ])
  })

  it('polls the status mirror while the page is visible and stops on dispose', async () => {
    vi.useFakeTimers()
    const reads: YuyiStatus[] = []
    const mirror = new YuyiStatusMirror(async () => {
      reads.push(STUB_STATUS)
      return STUB_STATUS
    })
    const stop = mirror.start(10_000)
    await vi.advanceTimersByTimeAsync(35_000)
    expect(reads.length).toBe(4)
    const seen: YuyiStatus[] = []
    const unsubscribe = mirror.subscribe(() => { seen.push(mirror.getSnapshot().current as YuyiStatus) })
    stop()
    unsubscribe()
  })

  it('unwraps both remote result arms', () => {
    expect(unwrap({ ok: true, value: 7 })).toBe(7)
    expect(() => unwrap({ ok: false, error: { message: 'denied' } })).toThrow('denied')
    expect(() => unwrap({ ok: false, error: {} })).toThrow('yuyi remote call failed')
  })

  it('feeds the tab reads through the mounted namespace', async () => {
    const { ctx, slots, statusReads } = stubbed()
    apply(ctx as never)
    const tab = slots[0]?.options as { inject: (sessionId: string) => { readStatus: () => Promise<YuyiStatus>; readInbox: (target: 'device', peek: boolean) => Promise<unknown[]> } }
    const injected = tab.inject('sess-1')
    await expect(injected.readStatus()).resolves.toEqual(STUB_STATUS)
    await expect(injected.readInbox('device', true)).resolves.toEqual([])
    expect(statusReads.count).toBeGreaterThanOrEqual(1)
  })
})
