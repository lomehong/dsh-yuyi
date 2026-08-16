/**
  * 御驿设置区块：基于 `yuyi/status`
  * Remote 事件；每个连接字段一行输入，走 `yuyi`
  * 设置命名空间。令牌本身从不在此展示或存储——
  * `tokenEnv` 字段只命名宿主解析所用的环境变量，
  * 穿过，因此区块只报告令牌存在性，绝不显示其值。
 */
import { useEffect, useState } from 'react'
import type { HostObservable, InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { CONNECTION_FIELDS, type YuyiConnectionField, type YuyiSettingsValue } from './settings-contract.ts'
import type { YuyiStatusState } from '../status-mirror.ts'
import { fieldLabelKey } from './locales.ts'
import { draftValid, draftWrite, fieldDraft, userOverrides } from './model.ts'
import css from './YuyiSettingsSection.module.css'

/* * 区块消费的设置快照字段。 */
export interface YuyiSettingsView {
  /* * 首次接受前为 `loading`，只读客户端为 `unavailable`。 */
  status: 'loading' | 'ready' | 'unavailable'
  /* * 最近一次接受的经 schema 解析的节；首次接受前为 undefined。 */
  value: YuyiSettingsValue | undefined
  /* * 原始用户层；字段存在即覆盖。 */
  user: unknown
  /* * 宿主文档是否接受写入。 */
  writable: boolean
}

/* * 区块注册侧的业务面。 */
export interface YuyiSettingsSectionInjected {
  hooks: {
    /* * 渲染器绑定为 useSettings 的 `yuyi` 设置作用域。 */
    settings: HostObservable<YuyiSettingsView>
    /* * 渲染器绑定为 useStatus 的连接状态镜像。 */
    status: HostObservable<YuyiStatusState>
  }
  /* * 把一个字段的新值提交进设置用户层。 */
  save: (field: YuyiConnectionField, value: string | number) => Promise<void>
  /* * 清除一个字段的用户覆盖，使其重新继承组合层。 */
  reset: (field: YuyiConnectionField) => Promise<void>
}

/* * 完整组件 props。 */
export type YuyiSettingsSectionProps =
  PropsRuntime<'settings.section'>
  & PropsLocale<'settings.yuyi'>
  & InjectFace<YuyiSettingsSectionInjected>

/**
  * 渲染御驿连接设置区块。
  * @param props - 组合插槽 props。
  * @returns 区块元素树。
 */
export function YuyiSettingsSection({ useSettings, useStatus, save, reset, t }: YuyiSettingsSectionProps) {
  const settings = useSettings(snapshot => snapshot)
  const statusState = useStatus(snapshot => snapshot)
  const [drafts, setDrafts] = useState<Partial<Record<YuyiConnectionField, string>>>({})
  // 宿主新接受会替换每个字段的基准，被取代节里
  // 挂起草稿被丢弃而非静默沿用。
  useEffect(() => { setDrafts({}) }, [settings.value])

  const status = statusState.current
  const editable = settings.status === 'ready' && settings.writable
  const overrides = userOverrides(settings.user)

  const commit = (field: YuyiConnectionField, draft: string): void => {
    const write = draftWrite(field, draft)
    void (write.op === 'set' ? save(field, write.value) : reset(field))
  }

  return (
    <div className={css.section}>
      <h3 className={css.title}>{t('title')}</h3>
      <p className={css.description}>{t('description')}</p>

      <div className={css.statusCard}>
        <div className={css.statusHeading}>
          <span>{t('status.heading')}</span>
          <span
            className={css.badge}
            data-state={status === undefined ? 'loading' : status.connected ? 'connected' : status.configured ? 'disconnected' : 'unconfigured'}
          >
            {status === undefined ? t('status.loading') : status.connected ? t('status.connected') : status.configured ? t('status.disconnected') : t('status.unconfigured')}
          </span>
        </div>
        {status !== undefined && (
          <dl className={css.statusFacts}>
            <div><dt>{t('status.hub')}</dt><dd>{status.hub.length > 0 ? status.hub : '—'}</dd></div>
            <div><dt>{t('status.device')}</dt><dd>{status.device}</dd></div>
            <div>
              <dt>{t('status.token')}</dt>
              <dd>{status.configured ? t('status.tokenFound') : status.hub.length > 0 ? t('status.tokenMissing') : '—'}</dd>
            </div>
            {status.agentName !== undefined && <div><dt>{t('status.agent')}</dt><dd>{status.agentName}</dd></div>}
            {status.ownerUsername !== undefined && <div><dt>{t('status.owner')}</dt><dd>{status.ownerUsername}</dd></div>}
            {status.lastError !== undefined && (
              <div className={css.lastError}><dt>{t('status.lastError')}</dt><dd role="alert">{status.lastError}</dd></div>
            )}
          </dl>
        )}
      </div>

      {settings.status === 'unavailable' && <p className={css.note}>{t('note.unavailable')}</p>}
      {settings.status === 'loading' && <p className={css.note}>{t('note.loading')}</p>}

      <div className={css.fields}>
        {CONNECTION_FIELDS.map(({ field, kind }) => {
          const basis = fieldDraft(settings.value, field)
          const draft = drafts[field] ?? basis
          const changed = draft !== basis
          const valid = draftValid(field, draft)
          return (
            <div key={field} className={css.field}>
              <label className={css.fieldLabel} htmlFor={`yuyi-${field}`}>
                {t(fieldLabelKey(field))}
                {overrides.has(field) && <span className={css.overridden}>{t('field.overridden')}</span>}
              </label>
              <input
                id={`yuyi-${field}`}
                className={css.input}
                type={kind === 'number' ? 'number' : 'text'}
                value={draft}
                disabled={!editable}
                spellCheck={false}
                onChange={(event) => { setDrafts(current => ({ ...current, [field]: event.target.value })) }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && changed && valid) commit(field, draft)
                }}
              />
              {changed && valid && (
                <button type="button" className={css.action} disabled={!editable} onClick={() => { commit(field, draft) }}>
                  {t('action.save')}
                </button>
              )}
              {overrides.has(field) && (
                <button type="button" className={css.action} disabled={!editable} onClick={() => { void reset(field) }}>
                  {t('action.reset')}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
