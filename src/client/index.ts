/**
  * dsh-yuyi 浏览器半：把 yuyi Remote 贡献挂进
  * 网关客户端（`ctx.remote.$mount` —— 宿主 source-mode 发现
  * 应答端点），以轮询镜像连接状态与协同快照（
  * harness 的转发事件白名单是编译期的，因此外置
  * 插件按间隔刷新），并注册两组表面：
  * shell.overlay 里的协同活动面板（关闭态为右缘拉手，
  * 不占宿主标题栏）与四张 `tool.call.toolview` 协同卡片，
  * 外加御驿连接设置区块。旧的会话标签页已由活动面板取代。
 */
import type { ClientContext, SessionId } from '@deepseek-ai/dsh-client-runtime/client'
import { useCallback, createElement, useSyncExternalStore } from 'react'
import TYPERT_REMOTE from '../remote-contribution.ts'
import type { InboxEntry } from '../core.ts'
import type { YuyiCollabSnapshot } from '../types.ts'
import type { YuyiStatus } from '../types.ts'
import { YuyiStatusMirror, unwrap, type Result, type YuyiStatusState } from './status-mirror.ts'
import { YuyiCollabMirror, unwrapCollab } from './collab-mirror.ts'
import { YuyiPanel, type YuyiPanelInjected, type YuyiPanelProps } from './panel/YuyiPanel.tsx'
import { NS as PANEL_NS, en as panelEn, zh as panelZh, type YuyiPanelKey } from './panel/locales.ts'
import { createPanelStore } from './panel/store.ts'
import {
  dagLayout, inboxRows, inboxSender, interpolate, panelModel, taskStatusOf, upstreamOf,
  type MemberCard, type PanelCounts, type PanelModel, type PresenceState,
  type TaskCardStatus, type YuyiInboxEntryRead, type YuyiInboxRow,
} from './panel/model.ts'
import { COLLAB_CARDS } from './cards.tsx'
import { YuyiSettingsSection, type YuyiSettingsView } from './settings/YuyiSettingsSection.tsx'
import { en as sectionEn, NS as SECTION_NS, zh as sectionZh, type YuyiSettingsKey } from './settings/locales.ts'
import { YUYI_SETTINGS_NAMESPACE, type YuyiSettingsValue, type YuyiTokenStore } from './settings/settings-contract.ts'
import type { YuyiConnectionField } from './settings/settings-contract.ts'

export { YuyiStatusMirror, unwrap } from './status-mirror.ts'
export { YuyiCollabMirror, unwrapCollab } from './collab-mirror.ts'
export type { Result, YuyiStatusState } from './status-mirror.ts'
export type { YuyiCollabState } from './collab-mirror.ts'
export { YuyiPanel } from './panel/YuyiPanel.tsx'
export type { YuyiPanelInjected, YuyiPanelProps } from './panel/YuyiPanel.tsx'
export { connectionState, dagLayout, inboxRows, inboxSender, interpolate, panelModel, taskStatusOf, upstreamOf } from './panel/model.ts'
export type {
  DagLayout, DagNode, MemberCard, PanelCounts, PanelModel,
  PresenceState, TaskCardStatus, YuyiInboxEntryRead, YuyiInboxRow,
} from './panel/model.ts'
export { createPanelStore, type YuyiPanelStore } from './panel/store.ts'
export { COLLAB_CARDS } from './cards.tsx'
export type { CollabCardInjected, CollabCardProps } from './cards.tsx'
export { panelEn, panelZh, PANEL_NS }
export type { YuyiPanelKey }
export { YuyiSettingsSection } from './settings/YuyiSettingsSection.tsx'
export type { YuyiSettingsSectionInjected, YuyiSettingsSectionProps } from './settings/YuyiSettingsSection.tsx'
export { draftValid, draftWrite, fieldDraft, userOverrides } from './settings/model.ts'
export type { DraftWrite } from './settings/model.ts'
export {
  CONNECTION_FIELDS, YUYI_SETTINGS_NAMESPACE,
  type YuyiConnectionField, type YuyiFieldDescriptor, type YuyiSettingsValue,
  type YuyiTokenState, type YuyiTokenStore,
} from './settings/settings-contract.ts'
export { en as sectionEn, zh as sectionZh } from './settings/locales.ts'
export type { YuyiSettingsKey } from './settings/locales.ts'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /* * 协同活动面板与会话内卡片文案。 */
    'yuyiPanel': YuyiPanelKey
    /* * 御驿设置区块文案。 */
    'settings.yuyi': YuyiSettingsKey
  }
}

/* * 已挂载 Remote 命名空间的调用面（类型在 bundle 中擦除）。 */
interface YuyiRemoteFace {
  status(): Promise<Result<YuyiStatus>>
  inbox(target: string, peek?: boolean): Promise<Result<InboxEntry[]>>
  collab(): Promise<Result<YuyiCollabSnapshot>>
}

/* * 所需服务：插槽、字典、设置传输与类型化 Remote。 */
export const inject = ['slots', 'locale', 'connection', 'remote', 'remote.credentials', 'configForms']

/**
  * 客户端插件主体：挂载 Remote 贡献，注册
  * 字典，并注册活动面板、头部工具钮、协同卡片
  * 与设置区块。
  * @param ctx - 客户端根上下文。
 */
export function apply(ctx: ClientContext): void {
  // 挂载远端贡献。注意：必须用同步 effect 内发非 awaited promise——
  // 实测（0.1.6-alpha.2，merge-bundle 场景）`ctx.effect(async () => ...)`
  // 的异步回调不会被调度执行（sync effect 均正常），$mount 因此永不发起，
  // remote.yuyi 永不挂载，状态行卡「读取中」。同步 effect 100% 被调度；
  // mount 完成前后各防一次 double-dispose。
  ctx.effect(() => {
    let dispose: (() => void) | undefined
    let active = true
    ctx.remote.$mount(TYPERT_REMOTE).then(
      (d) => {
        if (!active) {
          void d()
          return
        }
        dispose = d
      },
      (err) => {
        // ClientContext 类型面没有 logger——防御式读取，类型转换与 dsh-twin 同款
        const logger = (ctx as unknown as { logger?: { error?: (...args: unknown[]) => void } }).logger
        logger?.error?.('[dsh-yuyi] $mount 失败（remote.yuyi 将不可用）:', err)
      },
    )
    return () => {
      active = false
      if (typeof dispose === 'function') dispose()
    }
  }, 'dsh-yuyi: remote contribution')

  ctx.effect(() => ctx.locale.register(PANEL_NS, { zh: panelZh, en: panelEn }), 'dsh-yuyi: panel dictionaries')
  ctx.effect(() => ctx.locale.register(SECTION_NS, { zh: sectionZh, en: sectionEn }), 'dsh-yuyi: section dictionaries')

  // 已挂载命名空间是运行时状态：上面的 $mount 异步落定后 `remote.yuyi`
  // 服务才存在，因此每个调用点都惰性解析，而不是在 apply 时捕获一次
  // （apply 时刻捕获会永远拿到 undefined —— cordis 的属性访问是活解析，
  // 但捕获的是当时的解析结果值）。且不能用 `(ctx.remote).yuyi` 属性路径：
  // cordis 对嵌套服务的属性访问强制 inject 声明（"cannot get property
  // "remote.yuyi" without inject"），而该服务由本插件自己的 $mount 提供，
  // 提前 inject 会死锁——`ctx.get` 是官方豁免注入声明的可选服务读取口。
  const yuyiFace = (): YuyiRemoteFace => {
    const face = (ctx as unknown as { get(name: string): unknown }).get('remote.yuyi') as YuyiRemoteFace | undefined
    if (face === undefined) throw new Error('yuyi remote namespace is not mounted yet')
    return face
  }
  const readStatus = async (): Promise<YuyiStatus> => unwrap(await yuyiFace().status())
  const readCollab = async (): Promise<YuyiCollabSnapshot> => unwrapCollab(await yuyiFace().collab())
  const readInbox = async (target: 'device' | SessionId, peek: boolean): Promise<YuyiInboxEntryRead[]> =>
    unwrap(await yuyiFace().inbox(target === 'device' ? target : sessionIdKey(target), peek))

  const mirror = new YuyiStatusMirror(readStatus)
  ctx.effect(() => mirror.start(), 'dsh-yuyi: status mirror')
  const collabMirror = new YuyiCollabMirror(readCollab)
  ctx.effect(() => collabMirror.start(), 'dsh-yuyi: collab mirror')

  // 面板注入面的 onChange：两个镜像任一发布即触发刷新。
  const onChange = (listener: () => void): (() => void) => {
    const offStatus = mirror.subscribe(listener)
    const offCollab = collabMirror.subscribe(listener)
    return () => { offStatus(); offCollab() }
  }
  const panelStore = createPanelStore()

  // 已配置御驿但用户从未选择过关合 → 首个状态快照到达时自动展开
  // 面板（协同可视化是本插件的核心可见面，不能只靠一个隐蔽的
  // 头部小钮）。用户一旦手动开合过（localStorage 有记录），
  // 以用户的选择为准，绝不抢夺。
  ctx.effect(() => mirror.subscribe(() => {
    const status = mirror.getSnapshot().current
    if (status?.configured === true && !panelStore.hasUserChoice()) panelStore.open()
  }), 'dsh-yuyi: panel auto-open')

  // 协同活动面板：shell.overlay 是宿主给外置 bundle 的加性浮层席位。
  // 关闭态渲染右缘拉手（对话区域内常驻入口），展开态渲染面板本体；
  // 会话内卡片的「活动面板」链接与拉手同源开合。刻意不用
  // conversation.session.header.utilities——桌面壳把它排进标题栏，
  // 与窗口最小化/关闭按钮重叠。
  ctx.slots.inject('shell.overlay', () => ctx.slots.register({
    name: 'shell.overlay',
    id: 'yuyi-panel',
    order: 20,
    locale: PANEL_NS,
    inject: (): YuyiPanelInjected => ({
      readStatus,
      readCollab,
      readInbox,
      onChange,
      panel: panelStore,
    }),
  }, YuyiPanel))

  // 四张协同卡片：按 wire 工具名键控的 tool.call.toolview，
  // 卡片只渲染该次调用的参数与结果，带「活动面板」链接。
  for (const [toolName, Card] of Object.entries(COLLAB_CARDS)) {
    ctx.slots.inject('tool.call.toolview', () => ctx.slots.register({
      name: 'tool.call.toolview',
      key: toolName,
      id: `yuyi-${toolName}`,
      locale: PANEL_NS,
      inject: () => ({ panel: panelStore }),
    }, Card))
  }

  // 0.1.7 配置面：configForms 按宿主 profile 条目 id 取表单（cordis.patch.yml
  // 的 `- id: yuyi`，与设置命名空间同名）；可编辑字段 = schema 上 .volatile() 的键。
  const scope = ctx.configForms.get<YuyiSettingsValue>(YUYI_SETTINGS_NAMESPACE)
  // 令牌操作面：值经凭证域只写不读，引用名取当前 tokenEnv 设置（默认
  // YUYI_TOKEN）。宿主凭证库（.credentials.yaml）是 dsh 适配器的专属
  // 存储——不与其他 Agent 共享环境变量；凭证写入经 `credentials/updated`
  // 转发回来驱动区块徽标刷新，宿主侧同名事件触发即时重连。
  const credentials = ctx.remote.credentials
  const tokenRef = (): string => scope.getSnapshot().value?.tokenEnv ?? 'YUYI_TOKEN'
  const tokenStore: YuyiTokenStore = {
    async read() {
      const ref = tokenRef()
      const response = await credentials.describe([ref])
      if (!response.ok) throw new Error(response.error.message ?? 'credentials describe failed')
      return response.value[ref] ?? { configured: false, writable: true }
    },
    async save(value) {
      const response = await credentials.set(tokenRef(), value)
      if (!response.ok) throw new Error(response.error.message ?? 'credentials set failed')
    },
    async clear() {
      const response = await credentials.unset(tokenRef())
      if (!response.ok) throw new Error(response.error.message ?? 'credentials unset failed')
    },
    onChange(listener) {
      // alpha.3 起凭证事件名更换：rc.2 是 'credentials/updated'，alpha.3 用
      // 'credentials/reference-updated'（ref 参数为 CredentialRef 类型），
      // 与服务端 service.ts 的 ctx.on('credentials/reference-updated', ...) 对齐。
      return ctx.remote.$on('credentials/reference-updated', (ref: unknown) => { if (String(ref) === tokenRef()) listener() })
    },
  }
  const sectionT = ctx.locale.bind(SECTION_NS)
  // 插件页配置入口：settings.section 渲染器此前代劳的「hooks→useX 绑定 + locale t」
  // 在此手工补齐（useSyncExternalStore 把作用域/镜像绑成 selector hooks；绑定函数
  // 在 apply 作用域只建一次，组件生命周期内身份稳定）。
  const subscribeScope = (notify: () => void): (() => void) => scope.subscribe(notify)
  const subscribeMirror = (notify: () => void): (() => void) => mirror.subscribe(notify)
  const useSettings = function useSettings<R>(selector: (snapshot: YuyiSettingsView) => R): R {
    return useSyncExternalStore(subscribeScope, () => selector(scope.getSnapshot()))
  }
  const useStatus = function useStatus<R>(selector: (snapshot: YuyiStatusState) => R): R {
    return useSyncExternalStore(subscribeMirror, () => selector(mirror.getSnapshot()))
  }
  const sectionProps = {
    t: sectionT,
    useSettings,
    useStatus,
    save: async (field: YuyiConnectionField, value: string | number) => {
      if (!(await scope.set(field, value))) throw new Error('保存未生效（配置版本冲突，请重试）')
    },
    reset: async (field: YuyiConnectionField) => {
      if (!(await scope.unset(field))) throw new Error('还原未生效（配置版本冲突，请重试）')
    },
      token: tokenStore,
  }
  ctx.slots.inject('plugins.bundle.config', () => ctx.slots.register(
    {
      name: 'plugins.bundle.config',
      key: 'dsh-yuyi',
    },
    (props: { view: 'summary' | 'page' }) => {
      if (props.view !== 'page') {
        return createElement('span', { style: { fontSize: 12, color: 'var(--dsw-alias-label-secondary)' } }, '御驿通信：跨 Agent 寻址、收件箱与任务协作；点开配置 Hub 接入与令牌。')
      }
      return createElement(YuyiSettingsSection as unknown as (props: Record<string, unknown>) => JSX.Element, sectionProps)
    },
  ))
}

/* * inbox 端点的 target 参数按收件人字符串走线路；SessionId 是品牌类型。 */
function sessionIdKey(sessionId: SessionId): string {
  return String(sessionId)
}
