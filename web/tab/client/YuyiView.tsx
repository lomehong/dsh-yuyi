/**
 * The Yuyi conversation-view tab: connection block, local roster, and the
 * parked device/session inboxes. All reads go through the yuyi Remote and
 * peek (never drain) so the model-facing `yuyi_inbox` tool stays the owner
 * of consumption; `yuyi/status` forwards refresh the connection block live.
 */
import { useCallback, useEffect, useState, type JSX, type ReactNode } from 'react'
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { YuyiStatus } from '../../src/types.ts'
import { NS, type YuyiTabKey } from './locales.ts'
import type { YuyiInboxRow, YuyiTabModel } from './model.ts'
import { connectionState, inboxRows } from './model.ts'
import css from './YuyiView.module.css'

/** Injected hooks the view reads through (the remote namespace reads). */
export interface YuyiViewInjected {
  readStatus: () => PromiseLike<YuyiStatus>
  readInbox: (target: 'device' | 'session', peek: boolean) => PromiseLike<YuyiInboxRow[]>
  onStatusChange: (listener: () => void) => () => void
}

/** Full props for the Yuyi tab: the standard kit, locale, and the flattened injected reads. */
export type YuyiViewProps =
  PropsRuntime<'conversation.view'> & PropsLocale<typeof NS> & YuyiViewInjected

/** The empty model shown before the first read lands. */
const EMPTY: YuyiTabModel = {
  state: 'unconfigured',
  device: '',
  sessions: [],
  deviceInbox: [],
  sessionInbox: [],
}

/** One titled section wrapper. */
function Section({ title, children }: { title: string; children: ReactNode }): JSX.Element {
  return (
    <section className={css.section}>
      <h3 className={css.sectionTitle}>{title}</h3>
      {children}
    </section>
  )
}

/**
 * The tab body.
 * @param props - runtime kit, locale, and the injected remote reads.
 * @returns the rendered tab.
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
  const identity: string[] = []
  if (model.agentName !== undefined) identity.push(`${tKey('identity.agent')} ${model.agentName}`)
  if (model.ownerUsername !== undefined) identity.push(`${tKey('identity.owner')} ${model.ownerUsername}`)
  identity.push(`${tKey('identity.device')} ${model.device}`)

  return (
    <div className={css.yuyiTab}>
      <div className={css.stateLine}>
        <span className={
          model.state === 'connected' ? css.stateConnected
            : model.state === 'disconnected' ? css.stateDisconnected
              : css.stateUnconfigured
        }>
          {tKey(`state.${model.state}`)}
        </span>
        <span className={css.identity}>{identity.join(' · ')}</span>
      </div>

      {error !== undefined && <p className={css.error}>{tKey('error.title')}: {error}</p>}

      <Section title={tKey('roster.title')}>
        {model.sessions.length === 0
          ? <p className={css.muted}>{tKey('roster.empty')}</p>
          : model.sessions.map(session => (
            <p key={session.sessionId} className={css.row}>
              {session.name ?? session.sessionId} — {session.title}
            </p>
          ))}
      </Section>

      <Section title={tKey('inbox.device.title')}>
        {model.deviceInbox.length === 0
          ? <p className={css.muted}>{tKey('inbox.empty')}</p>
          : model.deviceInbox.map(entry => (
            <p key={entry.id} className={css.row}>{tKey('inbox.entry')
              .replace('{from}', entry.from)
              .replace('{text}', entry.text)}</p>
          ))}
      </Section>

      <Section title={tKey('inbox.session.title')}>
        {model.sessionInbox.length === 0
          ? <p className={css.muted}>{tKey('inbox.empty')}</p>
          : model.sessionInbox.map(entry => (
            <p key={entry.id} className={css.row}>{tKey('inbox.entry')
              .replace('{from}', entry.from)
              .replace('{text}', entry.text)}</p>
          ))}
      </Section>
    </div>
  )
}

export { inboxRows }
