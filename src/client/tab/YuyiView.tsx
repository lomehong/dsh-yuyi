/**
  * 御驿会话视图标签页：连接块、本地 roster 与
  * 停靠的设备/会话收件箱。所有读取都走 yuyi Remote 并
  * 只窥视（绝不取走），使模型侧 `yuyi_inbox` 工具保持
  * 消费的归属；`yuyi/status` 转发实时刷新连接块。
  * 视觉全面走产品原语（StateDot/Pill）与 --dsw-alias-* 令牌。
  */
import { useCallback, useEffect, useState, type JSX, type ReactNode } from 'react'
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { Pill, StateDot, type StateDotState } from '@deepseek-ai/dsh-client-ui-primitives'
import type { YuyiStatus } from '../../types.ts'
import { NS, type YuyiTabKey } from './locales.ts'
import type { YuyiInboxRow, YuyiTabModel } from './model.ts'
import { connectionState, inboxRows } from './model.ts'
import css from './YuyiView.module.css'

/* * 视图读取所经的注入钩子（remote 命名空间读取）。 */
export interface YuyiViewInjected {
  readStatus: () => PromiseLike<YuyiStatus>
  readInbox: (target: 'device' | 'session', peek: boolean) => PromiseLike<YuyiInboxRow[]>
  onStatusChange: (listener: () => void) => () => void
}

/* * 御驿标签页的完整 props：标准套件、locale 与扁平化注入的读取面。 */
export type YuyiViewProps =
  PropsRuntime<'conversation.view'> & PropsLocale<typeof NS> & YuyiViewInjected

/* * 首次读取到达前展示的空模型。 */
const EMPTY: YuyiTabModel = {
  state: 'unconfigured',
  device: '',
  sessions: [],
  deviceInbox: [],
  sessionInbox: [],
}

/* * 连接状态到产品 StateDot 四态的映射。 */
const DOT_STATE: Record<YuyiTabModel['state'], StateDotState> = {
  connected: 'done',
  disconnected: 'warning',
  unconfigured: 'error',
}

/* * 一个带标题与计数徽标的区块包装。 */
function Section({ title, count, children }: { title: string; count: number; children: ReactNode }): JSX.Element {
  return (
    <section className={css.section}>
      <div className={css.sectionHead}>
        <h3 className={css.sectionTitle}>{title}</h3>
        <span className={css.count}>{count}</span>
      </div>
      {children}
    </section>
  )
}

/* * 空态井（虚线，读作“内容将出现的位置”，不是错误）。 */
function EmptyWell({ text }: { text: string }): JSX.Element {
  return <div className={css.emptyWell}>{text}</div>
}

/**
  * 标签页主体。
  * @param props - 运行时套件、locale 与注入的 remote 读取面。
  * @returns 渲染出的标签页。
  */
export function YuyiView(props: YuyiViewProps): JSX.Element {
  const { t, readStatus, readInbox, onStatusChange } = props
  const [model, setModel] = useState<YuyiTabModel>(EMPTY)
  const [error, setError] = useState<string | undefined>(undefined)

  const refresh = useCallback(() => {
    void (async () => {
      try {
        const status = await readStatus()
        const [deviceInbox, sessionInbox] = await Promise.all([
          readInbox('device', true),
          readInbox('session', true),
        ])
        setModel({
          state: connectionState(status),
          device: status.device,
          ...(status.agentName !== undefined ? { agentName: status.agentName } : {}),
          ...(status.ownerUsername !== undefined ? { ownerUsername: status.ownerUsername } : {}),
          sessions: status.sessions.map(session => ({
            sessionId: session.sessionId,
            title: session.title,
            ...(session.name !== undefined ? { name: session.name } : {}),
          })),
          deviceInbox,
          sessionInbox,
        })
        setError(undefined)
      } catch (cause) {
        setError(String(cause))
      }
    })()
  }, [readStatus, readInbox])

  useEffect(() => {
    refresh()
    return onStatusChange(refresh)
  }, [onStatusChange, refresh])

  const tKey = t as (key: YuyiTabKey) => string

  return (
    <div className={css.yuyiTab}>
      <header className={css.statusCard}>
        <div className={css.statusHead}>
          <StateDot state={DOT_STATE[model.state]} />
          <span className={css.stateLabel} data-state={model.state}>{tKey(`state.${model.state}`)}</span>
          {model.device !== '' && (
            <Pill className={css.devicePill}><span className={css.deviceName}>{model.device}</span></Pill>
          )}
        </div>
        {(model.agentName !== undefined || model.ownerUsername !== undefined) && (
          <p className={css.facts}>
            {model.agentName !== undefined && (
              <span><span className={css.factKey}>{tKey('identity.agent')} </span><span className={css.factValue}>{model.agentName}</span></span>
            )}
            {model.ownerUsername !== undefined && (
              <span><span className={css.factKey}>{tKey('identity.owner')} </span><span className={css.factValue}>{model.ownerUsername}</span></span>
            )}
          </p>
        )}
      </header>

      {error !== undefined && <p className={css.errorBanner}>{tKey('error.title')}: {error}</p>}

      <Section title={tKey('roster.title')} count={model.sessions.length}>
        {model.sessions.length === 0
          ? <EmptyWell text={tKey('roster.empty')} />
          : (
            <div className={css.rows}>
              {model.sessions.map(session => (
                <div key={session.sessionId} className={css.sessionRow}>
                  <span className={css.avatar} aria-hidden="true">
                    {(session.name ?? session.sessionId).slice(0, 1).toUpperCase()}
                  </span>
                  <span className={css.sessionMain}>
                    <span className={css.sessionName}>{session.name ?? session.sessionId}</span>
                    <span className={css.sessionTitle}>{session.title}</span>
                  </span>
                </div>
              ))}
            </div>
          )}
      </Section>

      <Section title={tKey('inbox.device.title')} count={model.deviceInbox.length}>
        {model.deviceInbox.length === 0
          ? <EmptyWell text={tKey('inbox.empty')} />
          : (
            <div className={css.rows}>
              {model.deviceInbox.map(entry => (
                <div key={entry.id} className={css.inboxRow}>
                  <span className={css.inboxFrom}>{entry.from}</span>
                  <span className={css.inboxText}>{entry.text}</span>
                </div>
              ))}
            </div>
          )}
      </Section>

      <Section title={tKey('inbox.session.title')} count={model.sessionInbox.length}>
        {model.sessionInbox.length === 0
          ? <EmptyWell text={tKey('inbox.empty')} />
          : (
            <div className={css.rows}>
              {model.sessionInbox.map(entry => (
                <div key={entry.id} className={css.inboxRow}>
                  <span className={css.inboxFrom}>{entry.from}</span>
                  <span className={css.inboxText}>{entry.text}</span>
                </div>
              ))}
            </div>
          )}
      </Section>
    </div>
  )
}

export { inboxRows }
