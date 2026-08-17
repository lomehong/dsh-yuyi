/**
  * 御驿设置区块：基于 `yuyi/status`
  * Remote 事件；连接字段走 `yuyi` 设置命名空间，
  * 草稿暂存后由页脚的保存一次性提交（产品插件卡的
  * 交互模型）。令牌按御驿一机多 Agent 的约定是本适配器
  * （dsh）专属的值：经凭证域只写不读地存入宿主凭证库，
  * 区块只报告其存在性，绝不回显。
  */
import { useEffect, useState } from 'react'
import type { HostObservable, InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { Pill, StateDot, type StateDotState } from '@deepseek-ai/dsh-client-ui-primitives'
import { CONNECTION_FIELDS, type YuyiConnectionField, type YuyiSettingsValue, type YuyiTokenState, type YuyiTokenStore } from './settings-contract.ts'
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
  /* * 本适配器专属令牌的操作面（只写不读）。 */
  token: YuyiTokenStore
}

/* * 完整组件 props。 */
export type YuyiSettingsSectionProps =
  PropsRuntime<'settings.section'>
  & PropsLocale<'settings.yuyi'>
  & InjectFace<YuyiSettingsSectionInjected>

/* * 连接状态到产品 StateDot 四态的映射。 */
const DOT_STATE: Record<'connected' | 'disconnected' | 'unconfigured', StateDotState> = {
  connected: 'done',
  disconnected: 'warning',
  unconfigured: 'error',
}

/**
  * 渲染御驿连接设置区块。
  * @param props - 组合插槽 props。
  * @returns 区块元素树。
  */
export function YuyiSettingsSection({ useSettings, useStatus, save, reset, token, t }: YuyiSettingsSectionProps) {
  const settings = useSettings(snapshot => snapshot)
  const statusState = useStatus(snapshot => snapshot)
  const [drafts, setDrafts] = useState<Partial<Record<YuyiConnectionField, string>>>({})
  // 宿主新接受会替换每个字段的基准，被取代节里
  // 挂起草稿被丢弃而非静默沿用。
  useEffect(() => { setDrafts({}) }, [settings.value])

  const [tokenState, setTokenState] = useState<YuyiTokenState | undefined>(undefined)
  const [tokenDraft, setTokenDraft] = useState('')
  const [saveError, setSaveError] = useState<string | undefined>(undefined)
  const refreshToken = (): void => { void token.read().then(setTokenState, () => setTokenState(undefined)) }
  useEffect(() => {
    refreshToken()
    return token.onChange(refreshToken)
    // token store 引用在区块存活期稳定；refreshToken 随渲染重建但读取幂等。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const status = statusState.current
  const editable = settings.status === 'ready' && settings.writable
  const overrides = userOverrides(settings.user)

  /* * 一个字段当前的基准值（设备名的自动回落已计入）。 */
  const basisOf = (field: YuyiConnectionField): string => {
    if (field === 'device' && (settings.value?.device ?? '') === '' && status !== undefined) return status.device
    return fieldDraft(settings.value, field)
  }
  const draftOf = (field: YuyiConnectionField): string => drafts[field] ?? basisOf(field)
  const dirtyFields = CONNECTION_FIELDS.filter(({ field }) => draftOf(field) !== basisOf(field))
  const hasInvalid = dirtyFields.some(({ field }) => !draftValid(field, draftOf(field)))
  const tokenDirty = tokenDraft.trim() !== ''
  const canSave = editable && (dirtyFields.length > 0 || tokenDirty) && !hasInvalid

  const saveAll = async (): Promise<void> => {
    if (!canSave) return
    try {
      for (const { field } of dirtyFields) {
        const write = draftWrite(field, draftOf(field))
        await (write.op === 'set' ? save(field, write.value) : reset(field))
      }
      if (tokenDirty) {
        await token.save(tokenDraft.trim())
        setTokenDraft('')
      }
      setSaveError(undefined)
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : String(error))
    }
    refreshToken()
  }
  const discardAll = (): void => {
    setDrafts({})
    setTokenDraft('')
    setSaveError(undefined)
  }
  const clearToken = async (): Promise<void> => {
    try {
      await token.clear()
      setSaveError(undefined)
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : String(error))
    }
    refreshToken()
  }

  const connection = status === undefined ? 'unconfigured' : status.connected ? 'connected' : status.configured ? 'disconnected' : 'unconfigured'

  return (
    <div className={css.section}>
      <h2 className={css.title}>{t('title')}</h2>
      <p className={css.intro}>{t('description')}</p>

      <div className={css.statusCard}>
        <div className={css.statusHead}>
          <StateDot state={DOT_STATE[connection]} />
          <span className={css.stateLabel} data-state={connection}>
            {status === undefined ? t('status.loading') : status.connected ? t('status.connected') : status.configured ? t('status.disconnected') : t('status.unconfigured')}
          </span>
          {status !== undefined && status.device !== '' && (
            <Pill className={css.devicePill}><span className={css.deviceName}>{status.device}</span></Pill>
          )}
        </div>
        {status !== undefined && (
          <dl className={css.facts}>
            <div className={css.fact}><dt className={css.factKey}>{t('status.hub')}</dt><dd className={css.factValue}>{status.hub.length > 0 ? status.hub : '—'}</dd></div>
            {status.agentName !== undefined && <div className={css.fact}><dt className={css.factKey}>{t('status.agent')}</dt><dd className={css.factValue}>{status.agentName}</dd></div>}
            {status.ownerUsername !== undefined && <div className={css.fact}><dt className={css.factKey}>{t('status.owner')}</dt><dd className={css.factValue}>{status.ownerUsername}</dd></div>}
          </dl>
        )}
        {status?.lastError !== undefined && (
          <p className={css.lastError} role="alert">{t('status.lastError')}: {status.lastError}</p>
        )}
      </div>

      {settings.status === 'unavailable' && <p className={css.note}>{t('note.unavailable')}</p>}
      {settings.status === 'loading' && <p className={css.note}>{t('note.loading')}</p>}

      <div className={css.fields}>
        {CONNECTION_FIELDS.map(({ field, kind }) => {
          const basis = basisOf(field)
          const draft = drafts[field] ?? basis
          const changed = draft !== basis
          const invalid = changed && !draftValid(field, draft)
          return (
            <div key={field} className={css.field}>
              <div className={css.fieldHead}>
                <label className={css.fieldLabel} htmlFor={`yuyi-${field}`}>{t(fieldLabelKey(field))}</label>
                {overrides.has(field) && (
                  <span className={css.badges}>
                    <span className={css.badge}>{t('field.overridden')}</span>
                    <button type="button" className={css.textButton} disabled={!editable} onClick={() => { void reset(field) }}>
                      {t('action.reset')}
                    </button>
                  </span>
                )}
              </div>
              <input
                id={`yuyi-${field}`}
                className={invalid ? css.inputInvalid : css.input}
                type={kind === 'number' ? 'number' : 'text'}
                value={draft}
                disabled={!editable}
                spellCheck={false}
                {...invalid ? { 'aria-invalid': true } : {}}
                onChange={(event) => { setDrafts(current => ({ ...current, [field]: event.target.value })) }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') void saveAll()
                }}
              />
              <p className={invalid ? css.invalidHint : css.hint}>
                {invalid ? t('field.invalidNumber') : t(`hint.${field}`)}
              </p>
            </div>
          )
        })}

        <div className={css.field}>
          <div className={css.fieldHead}>
            <label className={css.fieldLabel} htmlFor="yuyi-token">{t('field.token')}</label>
            <span className={css.badges}>
              <span className={tokenState?.configured === true ? css.badge : css.badgeMuted}>
                {tokenState === undefined ? t('status.loading') : tokenState.configured ? t('token.configured') : t('token.missing')}
              </span>
              {tokenState?.configured === true && (
                <button type="button" className={css.textButton} disabled={tokenState.writable === false} onClick={() => { void clearToken() }}>
                  {t('action.clear')}
                </button>
              )}
            </span>
          </div>
          <input
            id="yuyi-token"
            className={css.input}
            type="password"
            value={tokenDraft}
            disabled={!editable || tokenState?.writable === false}
            spellCheck={false}
            autoComplete="off"
            onChange={(event) => { setTokenDraft(event.target.value) }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') void saveAll()
            }}
          />
          <p className={css.hint}>{t('token.hint')}</p>
        </div>
      </div>

      <footer className={css.footer}>
        {saveError !== undefined && <p className={css.failed} role="alert">{saveError}</p>}
        <button
          type="button"
          className={css.discard}
          disabled={!editable || (dirtyFields.length === 0 && !tokenDirty)}
          onClick={discardAll}
        >
          {t('action.discard')}
        </button>
        <button
          type="button"
          className={css.save}
          disabled={!canSave}
          onClick={() => { void saveAll() }}
        >
          {t('action.save')}
        </button>
      </footer>
    </div>
  )
}
