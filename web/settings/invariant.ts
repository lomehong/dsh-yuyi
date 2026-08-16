/**
 * Package-owned invariant companion for `@deepseek-ai/dsh-client-ui-settings-yuyi`.
 * @module @deepseek-ai/dsh-client-ui-settings-yuyi/invariant
 */

/* jscpd:ignore-start */
import type { Context } from '@deepseek-ai/cordis'
import type { InvariantInstaller } from '@deepseek-ai/dsh-invariants'

const PACKAGE_NAME = '@deepseek-ai/dsh-client-ui-settings-yuyi'

/** Cordis companion plugin name. */
export const name = 'ui-settings-yuyi-invariant'
/** Service required before the companion can reserve package ownership. */
export const inject = ['invariants']

/**
 * No runtime invariant: the section edits user settings through the settings
 * scope and reads connection state through the yuyi Remote; it owns no
 * durable session data.
 */
const install: InvariantInstaller = () => {}

/**
 * Register this package's invariant companion.
 * @param ctx - Cordis context carrying the invariant service.
 * @returns the installed registration's disposer after setup succeeds.
 */
export const apply = (ctx: Context): Promise<() => void> =>
  Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install))
/* jscpd:ignore-end */
