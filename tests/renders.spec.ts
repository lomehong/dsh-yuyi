import './env.ts'
import { describe, expect, it } from 'vitest'
import { renderInbox, renderPeers, renderStatus, type InboxValue, type PeersValue, type StatusValue } from '../src/tools/messaging.ts'

describe('messaging render projections', () => {
  it('renderStatus covers every identity, error, and roster combination', () => {
    const full: StatusValue = {
      configured: true,
      connected: true,
      hub: 'ws://hub',
      device: 'dev',
      agentName: 'agent-a',
      ownerUsername: 'alice',
      role: 'avatar',
      lastError: 'boom',
      deviceUnread: 2,
      sessions: [
        { sessionId: 's1', title: 'One', name: 'worker-a' },
        { sessionId: 's2', title: 'Two' },
      ],
    }
    expect(renderStatus(full)).toBe([
      'yuyi connected',
      'device dev · agent agent-a · owner alice · role avatar',
      'last error: boom',
      'device inbox unread: 2',
      'session worker-a — One',
      'session s2 — Two',
    ].join('\n'))

    const bare: StatusValue = {
      configured: false,
      connected: false,
      hub: '',
      device: 'dev',
      deviceUnread: 0,
      sessions: [],
    }
    expect(renderStatus(bare)).toBe('yuyi not configured\ndevice dev\ndevice inbox unread: 0')

    const configuredOnly: StatusValue = { ...bare, configured: true }
    expect(renderStatus(configuredOnly)).toContain('configured, disconnected')
  })

  it('renderPeers covers empty listings, roles, and unnamed sessions', () => {
    expect(renderPeers({ devices: [] })).toBe('no devices are reachable through the hub')
    const value: PeersValue = {
      devices: [
        { device: 'd1', instanceID: 'i1', sessions: [{ sessionID: 's1', title: 'One', directory: '/a', name: 'worker-a' }] },
        { device: 'd2', instanceID: 'i2', role: 'avatar', sessions: [{ sessionID: 's2', title: 'Two', directory: '/b' }] },
      ],
    }
    expect(renderPeers(value)).toBe([
      'device d1',
      '  - worker-a: One',
      'device d2 (role avatar)',
      '  - s2: Two',
    ].join('\n'))
  })

  it('renderInbox covers empty and populated inboxes', () => {
    const empty: InboxValue = { target: 'device', entries: [] }
    expect(renderInbox(empty)).toBe('device inbox is empty')
    const full: InboxValue = {
      target: 'session',
      entries: [
        { id: 'm1', from: 'reviewer@remote-dev', to: 'worker-a', mode: 'mail', text: 'first', receivedAt: 1 },
        { id: 'm2', from: 's-plain', to: '*', mode: 'notify', text: 'second', receivedAt: 2 },
      ],
    }
    expect(renderInbox(full)).toBe('[m1] from reviewer@remote-dev (mail)\nfirst\n---\n[m2] from s-plain (notify)\nsecond')
  })
})
