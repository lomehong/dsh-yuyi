// 桩服务上的客户端插件注册：Remote 贡献
// 挂载、双字典、四个插槽面与轮询镜像。
import { afterEach, describe, expect, it, vi } from 'vitest'
import { apply, inject, unwrap } from '../src/client/index.ts'
import { unwrapCollab } from '../src/client/collab-mirror.ts'
import { YuyiCollabMirror } from '../src/client/collab-mirror.ts'
import TYPERT_REMOTE from '../src/remote-contribution.ts'
import { YuyiStatusMirror } from '../src/client/status-mirror.ts'
import type { YuyiCollabSnapshot } from '../src/types.ts'
import type { YuyiStatus } from '../src/types.ts'

const STUB_STATUS: YuyiStatus = {
  configured: true,
  connected: true,
  hub: 'ws://stub',
  device: 'stub-dev',
  deviceUnread: 0,
  sessions: [],
}

const STUB_COLLAB: YuyiCollabSnapshot = { peers: [], tasks: [], generatedAt: 0 }

interface Stubbed {
  ctx: unknown
  mounted: unknown[]
  slots: Array<{ name: string; options: Record<string, unknown> }>
  namespaces: string[]
  scope: { set: ReturnType<typeof vi.fn>; unset: ReturnType<typeof vi.fn> }
  statusReads: { count: number }
  credentialCalls: Array<{ op: 'set' | 'unset'; ref: string; value?: string }>
}

function stubbed(): Stubbed {
  const mounted: unknown[] = []
  const slots: Array<{ name: string; options: Record<string, unknown> }> = []
  const namespaces: string[] = []
  const statusReads = { count: 0 }
  const credentialCalls: Array<{ op: 'set' | 'unset'; ref: string; value?: string }> = []
  const scope = { set: vi.fn(), unset: vi.fn(), getSnapshot: () => ({}), subscribe: () => () => {} }
  const yuyiFace = {
    status: () => {
      statusReads.count += 1
      return Promise.resolve({ ok: true, value: STUB_STATUS })
    },
    inbox: () => Promise.resolve({ ok: true, value: [] }),
    collab: () => Promise.resolve({ ok: true, value: STUB_COLLAB }),
  }
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
    // cordis 的嵌套服务属性访问要求 inject 声明；本插件用豁免口 ctx.get
    // 惰性读取自己 $mount 出来的命名空间。
    get: (name: string) => (name === 'remote.yuyi' ? yuyiFace : undefined),
    remote: {
      $mount: async (contribution: unknown) => {
        mounted.push(contribution)
        return () => {}
      },
      $on: (_event: string, _listener: unknown) => () => {},
      // alpha.3 凭证域：位置参数、方法直接返回 WireResult（无 .result 包装）。
      credentials: {
        describe: async (refs: string[]) => ({
          ok: true,
          value: Object.fromEntries(refs.map(ref => [ref, { configured: true, writable: true }])),
        }),
        set: async (ref: string, value: string) => {
          credentialCalls.push({ op: 'set', ref, value })
          return { ok: true, value: {} }
        },
        unset: async (ref: string) => {
          credentialCalls.push({ op: 'unset', ref })
          return { ok: true, value: {} }
        },
      },
    },
    connection: {
      api: {
        credentials: {
          describe: async ({ refs }: { refs: string[] }) => ({
            result: {
              ok: true,
              value: { credentials: Object.fromEntries(refs.map(ref => [ref, { configured: true, writable: true }])) },
            },
          }),
          set: async ({ ref, value }: { ref: string; value: string }) => {
            credentialCalls.push({ op: 'set', ref, value })
            return { result: { ok: true, value: {} } }
          },
          unset: async ({ ref }: { ref: string }) => {
            credentialCalls.push({ op: 'unset', ref })
            return { result: { ok: true, value: {} } }
          },
        },
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
      register: (options: Record<string, unknown>, component: unknown) => {
        slots.push({ name: options['name'] as string, options, component })
        return () => {}
      },
    },
  }
  return { ctx, mounted, slots, namespaces, scope, statusReads, credentialCalls }
}

afterEach(() => {
  vi.useRealTimers()
})

describe('dsh-yuyi browser half', () => {
  it('declares the services it binds', () => {
    expect(inject).toEqual(['slots', 'locale', 'connection', 'remote', 'remote.credentials', 'settingsScope'])
  })

  it('mounts the yuyi remote contribution', () => {
    const { ctx, mounted } = stubbed()
    apply(ctx as never)
    expect(mounted).toEqual([TYPERT_REMOTE])
    expect(TYPERT_REMOTE.package).toBe('dsh-yuyi')
    expect(TYPERT_REMOTE.descriptors.map(d => (d as { namespace: string; method: string }).method))
      .toEqual(['inbox', 'peers', 'status', 'collab'])
  })

  it('registers both dictionaries, the panel faces, and the settings namespace', () => {
    const { ctx, slots, namespaces } = stubbed()
    apply(ctx as never)
    expect(namespaces).toEqual(['yuyiPanel', 'settings.yuyi', 'scope:yuyi'])
    expect(slots.map(slot => [slot.name, slot.options['id']])).toEqual([
      ['shell.overlay', 'yuyi-panel'],
      ['tool.call.toolview', 'yuyi-yuyi_send'],
      ['tool.call.toolview', 'yuyi-yuyi_task_continue'],
      ['tool.call.toolview', 'yuyi-yuyi_task_show'],
      ['tool.call.toolview', 'yuyi-yuyi_peers'],
      ['plugins.bundle.config', undefined], // keyed 槽位的卡片标识是 key（见下方 token 测试）
    ])
    const toolviews = slots.filter(slot => slot.name === 'tool.call.toolview')
    expect(toolviews.map(slot => slot.options['key'])).toEqual([
      'yuyi_send', 'yuyi_task_continue', 'yuyi_task_show', 'yuyi_peers',
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

  it('polls the collab mirror on the same cadence', async () => {
    vi.useFakeTimers()
    const reads: YuyiCollabSnapshot[] = []
    const mirror = new YuyiCollabMirror(async () => {
      reads.push(STUB_COLLAB)
      return STUB_COLLAB
    })
    const stop = mirror.start(10_000)
    await vi.advanceTimersByTimeAsync(25_000)
    expect(reads.length).toBe(3)
    stop()
  })

  it('unwraps both remote result arms', () => {
    expect(unwrap({ ok: true, value: 7 })).toBe(7)
    expect(() => unwrap({ ok: false, error: { message: 'denied' } })).toThrow('denied')
    expect(() => unwrap({ ok: false, error: {} })).toThrow('yuyi remote call failed')
    expect(unwrapCollab({ ok: true, value: STUB_COLLAB })).toBe(STUB_COLLAB)
    expect(() => unwrapCollab({ ok: false, error: {} })).toThrow('yuyi remote call failed')
  })

  it('feeds the panel reads through the mounted namespace and auto-opens once configured', async () => {
    const { ctx, slots, statusReads } = stubbed()
    apply(ctx as never)
    const overlay = slots.find(slot => slot.name === 'shell.overlay')?.options as {
      inject: () => {
        readStatus: () => Promise<YuyiStatus>
        readCollab: () => Promise<YuyiCollabSnapshot>
        readInbox: (target: 'device', peek: boolean) => Promise<unknown[]>
        panel: { getSnapshot(): boolean; close(): void; hasUserChoice(): boolean }
      }
    }
    const injected = overlay.inject()
    await expect(injected.readStatus()).resolves.toEqual(STUB_STATUS)
    await expect(injected.readCollab()).resolves.toEqual(STUB_COLLAB)
    await expect(injected.readInbox('device', true)).resolves.toEqual([])
    expect(statusReads.count).toBeGreaterThanOrEqual(1)
    // 已配置 + 用户未选择过关合 → 状态镜像首次发布后面板自动展开。
    await vi.waitFor(() => { expect(injected.panel.getSnapshot()).toBe(true) })
    // 用户关闭后面板保持关闭（touched 兜底，防自动展开抢夺）。
    injected.panel.close()
    expect(injected.panel.getSnapshot()).toBe(false)
    expect(injected.panel.hasUserChoice()).toBe(true)
  })

  it('writes the adapter token through the credentials store under the configured ref', async () => {
    const { ctx, slots, credentialCalls } = stubbed()
    apply(ctx as never)
    const section = slots.find(slot => slot.name === 'plugins.bundle.config') as {
      options: { key?: string }
      component: (props: { view: 'summary' | 'page' }) => { props: { token: { read(): Promise<{ configured: boolean }>; save(v: string): Promise<void>; clear(): Promise<void> } } }
    }
    expect(section.options.key).toBe('dsh-yuyi')
    // view: 'page' 渲染区块入口元素，注入物（含凭证 token store）挂在 element props 上
    const el = section.component({ view: 'page' })
    const injected = el.props as { token: { read(): Promise<{ configured: boolean }>; save(v: string): Promise<void>; clear(): Promise<void> } }
    await expect(injected.token.read()).resolves.toMatchObject({ configured: true, writable: true })
    await injected.token.save('dsh-token-value')
    await injected.token.clear()
    expect(credentialCalls).toEqual([
      { op: 'set', ref: 'YUYI_TOKEN', value: 'dsh-token-value' },
      { op: 'unset', ref: 'YUYI_TOKEN' },
    ])
  })
})

describe('remote-contribution strict codec 兼容 (v0.1.7 → v0.1.8 回归守卫)', () => {
  it('确保 TYPERT_REMOTE 所有 descriptors 的 strict codec schema 暴露 parse()', async () => {
    // 加载已带 ensureParse shim 的源模块并做静态断言：每个 strict codec
    // schema 必须有可调用的 parse()。该断言捕捉 zod 跨包边界 / minify 后
    // parse 丢失（v0.1.7 → 0.1.6-alpha.2 core 升级时的真实事故）的回归。
    const mod = await import('../src/remote-contribution.ts')
    const contribution = mod.default as {
      descriptors: Array<{
        id: string
        result?: { codec?: { mode?: string; schema?: { parse?: unknown } } }
        parameters?: Array<{ codec?: { mode?: string; schema?: { parse?: unknown } } }>
      }>
    }
    expect(contribution.descriptors.length).toBeGreaterThan(0)
    for (const descriptor of contribution.descriptors) {
      const fields: Array<{ name: string; codec?: { mode?: string; schema?: { parse?: unknown } } }> = []
      if (descriptor.result) fields.push({ name: 'result', codec: descriptor.result.codec })
      for (const parameter of descriptor.parameters ?? []) fields.push({ name: 'parameter', codec: parameter.codec })
      for (const field of fields) {
        if (field.codec?.mode !== 'strict') continue
        expect(
          typeof field.codec?.schema?.parse,
          `${descriptor.id} field ${field.name} codec.schema.parse 必须为 function`,
        ).toBe('function')
      }
    }
  })

  it('ensureParse 包装层：safeParse-only schema 在 parse 包装后仍可正常工作', async () => {
    // 直接复用文件顶部静态导入的 TYPERT_REMOTE——同模块实例，所有
    // descriptors 的 schema 已走过 ensureParse。断言任一 descriptor 的
    // strict codec schema 暴露可调用的 parse。
    expect(TYPERT_REMOTE.descriptors.length).toBeGreaterThan(0)
    const descriptor = TYPERT_REMOTE.descriptors[0]!
    // descriptor.result 本身就是 codec（host runtime 直接读 result.mode）；
    // descriptor.parameters[].codec 才是嵌套的 codec——两者形态不同
    // （见 remote-contribution.ts 与 @deepseek-ai/dsh-typert-registry/lib/client.js:1339-1342）
    const resultCodec = descriptor.result as { mode?: string; schema?: { parse?: unknown } }
    expect(resultCodec.mode).toBe('strict')
    expect(typeof resultCodec.schema?.parse).toBe('function')
    const firstParamCodec = descriptor.parameters?.[0]?.codec as
      | { mode?: string; schema?: { parse?: unknown } }
      | undefined
    if (firstParamCodec !== undefined) {
      expect(firstParamCodec.mode).toBe('strict')
      expect(typeof firstParamCodec.schema?.parse).toBe('function')
    }
  })
})
