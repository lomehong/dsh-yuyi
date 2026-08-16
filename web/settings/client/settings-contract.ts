/**
 * Browser mirror of the `yuyi` host settings namespace (`dsh-yuyi`'s Config):
 * the connection fields this section edits. The host schema stays the
 * authority; this structural mirror exists because a browser bundle must not
 * reference the host capability package's program (only its type-only
 * `/types` seat, which carries no settings contract).
 */

/** Settings namespace the host `dsh-yuyi` plugin registers. */
export const YUYI_SETTINGS_NAMESPACE = 'yuyi'

/** One connection field this section edits. */
export type YuyiConnectionField = 'hub' | 'device' | 'tokenEnv' | 'replyTimeoutMs'

/** Resolved `yuyi` settings section, as the wire schema admits it. */
export interface YuyiSettingsValue {
  /** Hub WebSocket URL; absent falls through to the environment chain. */
  hub?: string
  /** Device identity; absent falls back to the hostname. */
  device?: string
  /** Environment variable name the token resolves through. */
  tokenEnv: string
  /** Expect-reply wait budget in milliseconds. */
  replyTimeoutMs: number
}

/** One editable field's rendering kind. */
export interface YuyiFieldDescriptor {
  field: YuyiConnectionField
  kind: 'text' | 'number'
}

/** Every field the section renders, in display order. */
export const CONNECTION_FIELDS: readonly YuyiFieldDescriptor[] = [
  { field: 'hub', kind: 'text' },
  { field: 'device', kind: 'text' },
  { field: 'tokenEnv', kind: 'text' },
  { field: 'replyTimeoutMs', kind: 'number' },
]
