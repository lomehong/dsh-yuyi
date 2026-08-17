/**
  * dsh-yuyi 浏览器半：把 yuyi Remote 贡献挂进
  * 网关客户端（`ctx.remote.$mount` —— 宿主 source-mode 发现
  * 应答端点），并以轮询镜像连接状态（
  * harness 的转发事件白名单是编译期的，因此外置
  * 插件按间隔刷新），并注册两个面：
  * 会话视图环里的"御驿"标签页与御驿连接设置区块
  * 进设置面板。区块经
  * settings-scope 服务；提交的写入即时落地为重连。
 */
import type { ClientContext, SessionId } from '@deepseek-ai/dsh-client-runtime/client'
import TYPERT_REMOTE from '../remote-contribution.ts'
import type { InboxEntry } from '../core.ts'
import type { YuyiStatus } from '../types.ts'
import { YuyiStatusMirror, unwrap, type Result } from './status-mirror.ts'
import { YuyiView, type YuyiViewInjected } from './tab/YuyiView.tsx'
import { inboxRows } from './tab/model.ts'
import { en as tabEn, NS as TAB_NS, zh as tabZh, type YuyiTabKey } from './tab/locales.ts'
import { YuyiSettingsSection, type YuyiSettingsSectionInjected } from './settings/YuyiSettingsSection.tsx'
import { en as sectionEn, NS as SECTION_NS, zh as sectionZh, type YuyiSettingsKey } from './settings/locales.ts'
import { YUYI_SETTINGS_NAMESPACE, type YuyiSettingsValue, type YuyiTokenStore } from './settings/settings-contract.ts'

export { YuyiStatusMirror, unwrap } from './status-mirror.ts'
export type { Result, YuyiStatusState } from './status-mirror.ts'
export { YuyiView } from './tab/YuyiView.tsx'
export type { YuyiViewInjected, YuyiViewProps } from './tab/YuyiView.tsx'
export { connectionState, inboxRows, inboxSender } from './tab/model.ts'
export type { YuyiInboxRow, YuyiSessionRow, YuyiTabModel } from './tab/model.ts'
export { YuyiSettingsSection } from './settings/YuyiSettingsSection.tsx'
export type { YuyiSettingsSectionInjected, YuyiSettingsSectionProps } from './settings/YuyiSettingsSection.tsx'
export { draftValid, draftWrite, fieldDraft, userOverrides } from './settings/model.ts'
export type { DraftWrite } from './settings/model.ts'
export {
  CONNECTION_FIELDS, YUYI_SETTINGS_NAMESPACE,
  type YuyiConnectionField, type YuyiFieldDescriptor, type YuyiSettingsValue,
  type YuyiTokenState, type YuyiTokenStore,
} from './settings/settings-contract.ts'
export { en as tabEn, zh as tabZh } from './tab/locales.ts'
export type { YuyiTabKey } from './tab/locales.ts'
export { en as sectionEn, zh as sectionZh } from './settings/locales.ts'
export type { YuyiSettingsKey } from './settings/locales.ts'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /* * 御驿标签页文案。 */
    'yuyiTab': YuyiTabKey
    /* * 御驿设置区块文案。 */
    'settings.yuyi': YuyiSettingsKey
  }
}

/* * 已挂载 Remote 命名空间的调用面（类型在 bundle 中擦除）。 */
interface YuyiRemoteFace {
  status(): Promise<Result<YuyiStatus>>
  inbox(target: string, peek?: boolean): Promise<Result<InboxEntry[]>>
}

/* * 所需服务：插槽、字典、设置传输与类型化 Remote。 */
export const inject = ['slots', 'locale', 'connection', 'remote', 'settingsScope']

/**
  * 客户端插件主体：挂载 Remote 贡献，注册
  * 字典，并注册标签页与设置区块。
  * @param ctx - 客户端根上下文。
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(async () => {
    const dispose = await ctx.remote.$mount(TYPERT_REMOTE)
    return () => { void dispose() }
  }, 'dsh-yuyi: remote contribution')

  ctx.effect(() => ctx.locale.register(TAB_NS, { zh: tabZh, en: tabEn }), 'dsh-yuyi: tab dictionaries')
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
  const mirror = new YuyiStatusMirror(async () => unwrap(await yuyiFace().status()))
  ctx.effect(() => mirror.start(), 'dsh-yuyi: status mirror')

  const tabT = ctx.locale.bind(TAB_NS)
  ctx.slots.inject('conversation.view', () => ctx.slots.register({
    name: 'conversation.view',
    id: 'yuyi',
    order: 20,
    locale: TAB_NS,
    label: () => tabT('tab.label'),
    inject: (sessionId: SessionId): YuyiViewInjected => ({
      readStatus: async () => unwrap(await yuyiFace().status()),
      readInbox: async (target, peek) =>
        inboxRows(unwrap(await yuyiFace().inbox(target === 'device' ? target : sessionId, peek))),
      onStatusChange: listener => mirror.subscribe(() => { listener() }),
    }),
  }, YuyiView))

  const scope = ctx.settingsScope.bind<YuyiSettingsValue>({ namespace: YUYI_SETTINGS_NAMESPACE })
  // 令牌操作面：值经凭证域只写不读，引用名取当前 tokenEnv 设置（默认
  // YUYI_TOKEN）。宿主凭证库（.credentials.yaml）是 dsh 适配器的专属
  // 存储——不与其他 Agent 共享环境变量；凭证写入经 `credentials/updated`
  // 转发回来驱动区块徽标刷新，宿主侧同名事件触发即时重连。
  const credentials = ctx.connection.api.credentials
  const tokenRef = (): string => scope.getSnapshot().value?.tokenEnv ?? 'YUYI_TOKEN'
  const tokenStore: YuyiTokenStore = {
    async read() {
      const ref = tokenRef()
      const response = await credentials.describe({ refs: [ref] })
      if (!response.result.ok) throw new Error(response.result.error.message ?? 'credentials describe failed')
      return response.result.value.credentials[ref] ?? { configured: false, writable: true }
    },
    async save(value) {
      const response = await credentials.set({ ref: tokenRef(), value })
      if (!response.result.ok) throw new Error(response.result.error.message ?? 'credentials set failed')
    },
    async clear() {
      const response = await credentials.unset({ ref: tokenRef() })
      if (!response.result.ok) throw new Error(response.result.error.message ?? 'credentials unset failed')
    },
    onChange(listener) {
      return ctx.remote.$on('credentials/updated', (ref: unknown) => { if (String(ref) === tokenRef()) listener() })
    },
  }
  const sectionT = ctx.locale.bind(SECTION_NS)
  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'yuyi',
    order: 30,
    label: () => sectionT('nav'),
    locale: SECTION_NS,
    inject: (): YuyiSettingsSectionInjected => ({
      hooks: { settings: scope, status: mirror },
      save: (field, value) => scope.set(field, value),
      reset: field => scope.unset(field),
      token: tokenStore,
    }),
  }, YuyiSettingsSection))
}
