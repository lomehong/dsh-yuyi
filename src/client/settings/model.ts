/**
  * yuyi 设置节上的纯投影：字段显示串、
  * 草稿校验、草稿映射的写入与用户覆盖集合
  * 从原始设置用户层读出。
 */
import type { YuyiConnectionField, YuyiSettingsValue } from './settings-contract.ts'

/**
  * 一个字段输入框显示的草稿串。
  * @param value - 解析后的设置节；首次接受前为 undefined。
  * @param field - 要显示的字段。
  * @returns 字段当前值对应的输入文本，未设或未解析时为空。
 */
export function fieldDraft(value: YuyiSettingsValue | undefined, field: YuyiConnectionField): string {
  const raw = value?.[field]
  return raw === undefined ? '' : String(raw)
}

/**
  * 草稿是否可写。`tokenEnv` 必须是合法的环境变量名（POSIX 标识符）——令牌值
  * 不属于这里，误粘令牌会被拦下；超时必须是正整数。
  * @param field - 正在编辑的字段。
  * @param draft - 输入框当前文本。
  * @returns {@link draftWrite} 是否会产生写入。
 */
export function draftValid(field: YuyiConnectionField, draft: string): boolean {
  if (field === 'replyTimeoutMs') return /^\d+$/.test(draft.trim()) && Number(draft.trim()) > 0
  if (field === 'tokenEnv') return /^[A-Za-z_][A-Za-z0-9_]*$/.test(draft.trim())
  return true
}

/* * 一个有效草稿映射到的写入：set，或清空可选字段后重新继承所经的 unset。 */
export type DraftWrite =
  | { readonly op: 'set'; readonly value: string | number }
  | { readonly op: 'unset' }

/**
  * 把一个有效草稿映射为其设置写入。清空 `hub` 或 `device`
  * 即清除覆盖（环境链接管）；超时
  * 被强转为数字。
  * @param field - 正在提交的字段。
  * @param draft - 输入框文本（已经 {@link draftValid} 校验）。
  * @returns 区块路由进作用域的写入。
 */
export function draftWrite(field: YuyiConnectionField, draft: string): DraftWrite {
  if (field === 'replyTimeoutMs') return { op: 'set', value: Number(draft.trim()) }
  if (field === 'tokenEnv') return { op: 'set', value: draft.trim() }
  return draft.trim().length === 0 ? { op: 'unset' } : { op: 'set', value: draft.trim() }
}

/**
  * 从原始设置用户层读出用户覆盖集合。
  * @param user - 快照的原始用户层（`unknown`：线路数据）。
  * @returns 该层中存在的字段——存在性而非取值标记覆盖。
 */
export function userOverrides(user: unknown): ReadonlySet<YuyiConnectionField> {
  if (typeof user !== 'object' || user === null) return new Set()
  const record = user as Record<string, unknown>
  const fields: YuyiConnectionField[] = ['hub', 'device', 'tokenEnv', 'replyTimeoutMs']
  return new Set(fields.filter(field => record[field] !== undefined))
}
