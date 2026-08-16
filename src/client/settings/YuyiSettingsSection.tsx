/**
 * Yuyi settings section: a live connection-status card over the `yuyi/status`
 * Remote event, and one input row per connection field over the `yuyi`
 * settings namespace. The token itself is never shown or stored here — the
 * `tokenEnv` field only names the environment variable the host resolves
 * through, so the section reports token presence, never its value.
 */
import { useEffect, useState } from 'react'
import type { HostObservable, InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { CONNECTION_FIELDS, type YuyiConnectionField, type YuyiSettingsValue } from './settings-contract.ts'
import type { YuyiStatusState } from '../status-mirror.ts'
import { fieldLabelKey } from './locales.ts'
import { draftValid, draftWrite, fieldDraft, userOverrides } from './model.ts'
import css from './YuyiSettingsSection.module.css'

/** The settings-snapshot fields the section consumes. */
export interface YuyiSettingsView {
  /** `loading` until the first acceptance, `unavailable` to read-only clients. */
  status: 'loading' | 'ready' | 'unavailable'
  /** Last accepted schema-resolved section; undefined before the first acceptance. */
  value: YuyiSettingsValue | undefined
  /** Raw user layer; field presence marks an override. */
  user: unknown
  /** Whether the Host document accepts writes. */
  writable: boolean
}

/** Registration-side business face for the section. */
export interface YuyiSettingsSectionInjected {
  hooks: {
    /** `yuyi` settings scope bound by the renderer as useSettings. */
    settings: HostObservable<YuyiSettingsView>
    /** Connection-status mirror bound by the renderer as useStatus. */
    status: HostObservable<YuyiStatusState>
  }
  /** Commit one field's new value into the settings user layer. */
  save: (field: YuyiConnectionField, value: string | number) => Promise<void>
  /** Clear one field's user override so it re-inherits the composition layer. */
  reset: (field: YuyiConnectionField) => Promise<void>
}

/** Full component props. */
export type YuyiSettingsSectionProps =
  PropsRuntime<'settings.section'>
  & PropsLocale<'settings.yuyi'>
  & InjectFace<YuyiSettingsSectionInjected>

/**
 * Render the Yuyi connection settings section.
 * @param props - composed slot props.
 * @returns the section element tree.
 */
export function YuyiSettingsSection({ useSettings, useStatus, save, reset, t }: YuyiSettingsSectionProps) {
  const settings = useSettings(snapshot => snapshot)
  const statusState = useStatus(snapshot => snapshot)
  const [drafts, setDrafts] = useState<Partial<Record<YuyiConnectionField, string>>>({})
  // A fresh Host acceptance replaces every field's basis, so pending drafts
  // from the superseded section are discarded rather than silently carried.
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
