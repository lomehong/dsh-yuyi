/**
 * Yuyi tab plugin, browser half: contributes one entry to the conversation
 * view ring. All data arrives through the yuyi Remote namespace (status and
 * inbox reads, both peeking), and the `yuyi/status` forwarded event refreshes
 * the connection block live.
 */
import type { ClientContext, SessionId } from '@deepseek-ai/dsh-client-runtime/client'
// Type-only: pulls the generated Remote API and ctx.remote merge through the Client assembly boundary.
import type {} from '@deepseek-ai/dsh-api-remotes/client'
// Type-only: the 'conversation.view' SlotMap row (declared by the slot's owning package).
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
// Type-only: pulls the locale plugin's Context merge (ctx.locale).
import type {} from '@deepseek-ai/dsh-client-locale/client'
import { en, NS, zh, type YuyiTabKey } from './locales.ts'
import { YuyiView, type YuyiViewInjected } from './YuyiView.tsx'
import { inboxRows } from './model.ts'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** Yuyi tab copy. */
    'yuyiTab': YuyiTabKey
  }
}

export { YuyiView } from './YuyiView.tsx'
export type { YuyiViewInjected, YuyiViewProps } from './YuyiView.tsx'
export type { YuyiInboxRow, YuyiSessionRow, YuyiTabModel } from './model.ts'
export { connectionState, inboxRows, inboxSender } from './model.ts'
export { en, NS, zh } from './locales.ts'
export type { YuyiTabKey } from './locales.ts'

/** One Remote result as the adapter consumes it. */
export type Result<T> = { readonly ok: true; readonly value: T } | { readonly ok: false; readonly error: { message?: string } }

/**
 * Unwrap one Remote result, throwing the failure prose the view surfaces.
 * @param result - the Remote call's result envelope.
 * @returns the successful payload.
 */
export function unwrap<T>(result: Result<T>): T {
  if (!result.ok) throw new Error(result.error.message ?? 'yuyi remote call failed')
  return result.value
}

/** Required services: the view slot, the locale dictionaries, and the typed Remote. */
export const inject = ['slots', 'locale', 'remote', 'remote.yuyi']

/**
 * Client plugin body: register the dictionaries and the view-tab entry.
 * @param ctx - client root context.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'ui-yuyi: dictionaries')
  const t = ctx.locale.bind(NS)
  ctx.slots.inject('conversation.view', () => ctx.slots.register({
    name: 'conversation.view',
    id: 'yuyi',
    order: 20,
    locale: NS,
    label: () => t('tab.label'),
    inject: (sessionId: SessionId): YuyiViewInjected => ({
      readStatus: async () => unwrap(await ctx.remote.yuyi.status()),
      readInbox: async (target, peek) =>
        inboxRows(unwrap(await ctx.remote.yuyi.inbox(target === 'device' ? target : sessionId, peek))),
      onStatusChange: listener => ctx.remote.$on('yuyi/status', listener),
    }),
  }, YuyiView))
}
