/**
 * dsh-yuyi browser half: mounts the yuyi Remote contribution into the
 * gateway client (`ctx.remote.$mount` — the Host's source-mode discovery
 * answers the endpoints), mirrors the connection status by polling (the
 * harness's forwarded-event allowlist is compile-time, so an out-of-tree
 * plugin refreshes on an interval), and registers the two surfaces: the
 * "Yuyi" tab in the conversation view ring and the Yuyi connection section
 * in Settings. The section edits the host `yuyi` settings namespace through
 * the settings-scope service; committed writes land as live reconnects.
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
import { YUYI_SETTINGS_NAMESPACE, type YuyiSettingsValue } from './settings/settings-contract.ts'

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
} from './settings/settings-contract.ts'
export { en as tabEn, zh as tabZh } from './tab/locales.ts'
export type { YuyiTabKey } from './tab/locales.ts'
export { en as sectionEn, zh as sectionZh } from './settings/locales.ts'
export type { YuyiSettingsKey } from './settings/locales.ts'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** Yuyi tab copy. */
    'yuyiTab': YuyiTabKey
    /** Yuyi settings-section copy. */
    'settings.yuyi': YuyiSettingsKey
  }
}

/** The mounted Remote namespace's calling face (types are erased in the bundle). */
interface YuyiRemoteFace {
  status(): Promise<Result<YuyiStatus>>
  inbox(target: string, peek?: boolean): Promise<Result<InboxEntry[]>>
}

/** Required services: the slots, the dictionaries, the settings transport, and the typed Remote. */
export const inject = ['slots', 'locale', 'connection', 'remote', 'settingsScope']

/**
 * Client plugin body: mount the Remote contribution, register the
 * dictionaries, and register the tab and the settings section.
 * @param ctx - client root context.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(async () => {
    const dispose = await ctx.remote.$mount(TYPERT_REMOTE)
    return () => { void dispose() }
  }, 'dsh-yuyi: remote contribution')

  ctx.effect(() => ctx.locale.register(TAB_NS, { zh: tabZh, en: tabEn }), 'dsh-yuyi: tab dictionaries')
  ctx.effect(() => ctx.locale.register(SECTION_NS, { zh: sectionZh, en: sectionEn }), 'dsh-yuyi: section dictionaries')

  // The mounted namespace is runtime state; the compile-time face does not
  // know it, so the call site narrows once, at the boundary.
  const yuyi = (ctx.remote as unknown as { yuyi: YuyiRemoteFace }).yuyi
  const mirror = new YuyiStatusMirror(async () => unwrap(await yuyi.status()))
  ctx.effect(() => mirror.start(), 'dsh-yuyi: status mirror')

  const tabT = ctx.locale.bind(TAB_NS)
  ctx.slots.inject('conversation.view', () => ctx.slots.register({
    name: 'conversation.view',
    id: 'yuyi',
    order: 20,
    locale: TAB_NS,
    label: () => tabT('tab.label'),
    inject: (sessionId: SessionId): YuyiViewInjected => ({
      readStatus: async () => unwrap(await yuyi.status()),
      readInbox: async (target, peek) =>
        inboxRows(unwrap(await yuyi.inbox(target === 'device' ? target : sessionId, peek))),
      onStatusChange: listener => mirror.subscribe(() => { listener() }),
    }),
  }, YuyiView))

  const scope = ctx.settingsScope.bind<YuyiSettingsValue>({ namespace: YUYI_SETTINGS_NAMESPACE })
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
    }),
  }, YuyiSettingsSection))
}
