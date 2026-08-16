/**
 * Yuyi settings-section plugin, browser half: registers the "yuyi" entry on
 * the settings section list. Fields edit the host `yuyi` settings namespace
 * through the settings-scope service (writes land as live reconnects), and
 * the connection card mirrors the `yuyi/status` forwarded event.
 */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
// Type-only: pulls the ctx.settingsScope Context merge (the settings
// surface's transport) and the settings shell's SlotMap row
// ('settings.section') into this program. Cross-plugin collaboration goes
// through the service, never a value import (client bundle purity gate).
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
// Type-only: pulls the ctx.remote merge and the forwarded-event key face
// ('yuyi/status' rides the allowlist) into this program.
import type {} from '@deepseek-ai/dsh-api-remotes/client'
// Type-only: pulls the locale plugin's Context merge (ctx.locale).
import type {} from '@deepseek-ai/dsh-client-locale/client'
import { YuyiSettingsSection, type YuyiSettingsSectionInjected } from './YuyiSettingsSection.tsx'
import { YuyiStatusMirror } from './status-mirror.ts'
import { YUYI_SETTINGS_NAMESPACE, type YuyiSettingsValue } from './settings-contract.ts'
import { en, NS, zh, type YuyiSettingsKey } from './locales.ts'

export { YuyiSettingsSection } from './YuyiSettingsSection.tsx'
export type { YuyiSettingsSectionInjected, YuyiSettingsSectionProps } from './YuyiSettingsSection.tsx'
export { YuyiStatusMirror, type YuyiStatusState } from './status-mirror.ts'
export { en, NS, zh } from './locales.ts'
export type { YuyiSettingsKey } from './locales.ts'
export {
  draftValid, draftWrite, fieldDraft, userOverrides,
  type DraftWrite,
} from './model.ts'
export {
  CONNECTION_FIELDS, YUYI_SETTINGS_NAMESPACE,
  type YuyiConnectionField, type YuyiFieldDescriptor, type YuyiSettingsValue,
} from './settings-contract.ts'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** Yuyi settings-section copy. */
    'settings.yuyi': YuyiSettingsKey
  }
}

/** One Remote result as this plugin consumes it. */
export type Result<T> = { readonly ok: true; readonly value: T } | { readonly ok: false; readonly error: { message?: string } }

/**
 * Unwrap one Remote result, throwing the failure prose the section surfaces.
 * @param result - the Remote call's result envelope.
 * @returns the successful payload.
 */
export function unwrap<T>(result: Result<T>): T {
  if (!result.ok) throw new Error(result.error.message ?? 'yuyi remote call failed')
  return result.value
}

/** Required services: the settings shell's slots, the locale dictionaries, the settings transport, and the typed Remote. */
export const inject = ['slots', 'locale', 'connection', 'remote', 'settingsScope']

/**
 * Client plugin body: register the dictionaries and the settings section.
 * @param ctx - client root context.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'ui-settings-yuyi: dictionaries')

  const scope = ctx.settingsScope.bind<YuyiSettingsValue>({ namespace: YUYI_SETTINGS_NAMESPACE })
  const mirror = new YuyiStatusMirror(
    async () => unwrap(await ctx.remote.yuyi.status()),
    listener => ctx.remote.$on('yuyi/status', listener),
  )
  ctx.effect(() => mirror.start(), 'ui-settings-yuyi: status mirror')

  const t = ctx.locale.bind(NS)
  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'yuyi',
    order: 30,
    label: () => t('nav'),
    locale: NS,
    inject: (): YuyiSettingsSectionInjected => ({
      hooks: { settings: scope, status: mirror.store },
      save: (field, value) => scope.set(field, value),
      reset: field => scope.unset(field),
    }),
  }, YuyiSettingsSection))
}
