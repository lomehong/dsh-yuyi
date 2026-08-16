/**
 * Pure projections over the yuyi settings section: field display strings,
 * draft validation, the write a draft maps to, and the user-override set
 * read off the raw settings user layer.
 */
import type { YuyiConnectionField, YuyiSettingsValue } from './settings-contract.ts'

/**
 * The draft string one field's input shows.
 * @param value - resolved settings section; undefined before the first acceptance.
 * @param field - the field to display.
 * @returns the field's current value as input text, empty when unset or unresolved.
 */
export function fieldDraft(value: YuyiSettingsValue | undefined, field: YuyiConnectionField): string {
  const raw = value?.[field]
  return raw === undefined ? '' : String(raw)
}

/**
 * Whether a draft can be written. `tokenEnv` must stay non-empty; the timeout
 * must be a positive integer.
 * @param field - the field being edited.
 * @param draft - the input's current text.
 * @returns whether {@link draftWrite} would produce a write.
 */
export function draftValid(field: YuyiConnectionField, draft: string): boolean {
  if (field === 'replyTimeoutMs') return /^\d+$/.test(draft.trim()) && Number(draft.trim()) > 0
  if (field === 'tokenEnv') return draft.trim().length > 0
  return true
}

/** The write one valid draft maps to: a set, or the unset an emptied optional field re-inherits through. */
export type DraftWrite =
  | { readonly op: 'set'; readonly value: string | number }
  | { readonly op: 'unset' }

/**
 * Map one valid draft to its settings write. Emptying `hub` or `device`
 * clears the override (the environment chain resumes); the timeout is
 * coerced to a number.
 * @param field - the field being committed.
 * @param draft - the input's text (validated by {@link draftValid}).
 * @returns the write the section routes into the scope.
 */
export function draftWrite(field: YuyiConnectionField, draft: string): DraftWrite {
  if (field === 'replyTimeoutMs') return { op: 'set', value: Number(draft.trim()) }
  if (field === 'tokenEnv') return { op: 'set', value: draft.trim() }
  return draft.trim().length === 0 ? { op: 'unset' } : { op: 'set', value: draft.trim() }
}

/**
 * Read the user-override set off the raw settings user layer.
 * @param user - the snapshot's raw user layer (`unknown`: wire data).
 * @returns the fields present in the layer — presence, not value, marks an override.
 */
export function userOverrides(user: unknown): ReadonlySet<YuyiConnectionField> {
  if (typeof user !== 'object' || user === null) return new Set()
  const record = user as Record<string, unknown>
  const fields: YuyiConnectionField[] = ['hub', 'device', 'tokenEnv', 'replyTimeoutMs']
  return new Set(fields.filter(field => record[field] !== undefined))
}
