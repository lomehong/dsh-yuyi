/**
 * 协同面板纯函数投影：成员卡装配（presence/计数/去重）、
 * 任务状态折叠、DAG 分列布局（环容错）与上游闭包。
 */
import { describe, expect, it } from 'vitest'
import {
  dagLayout, interpolate, panelModel, taskStatusOf, upstreamOf,
} from '../src/client/panel/model.ts'
import type { TaskView } from '../src/types.ts'

const NOW = 1_000_000_000_000

function statusFixture(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    configured: true,
    connected: true,
    device: 'dev-a',
    agentName: 'avatar-main',
    ownerUsername: 'alice',
    role: 'avatar',
    sessions: [{ sessionId: 's-local', title: 'Local work', name: 'helper' }],
    ...overrides,
  }
}

function taskFixture(taskId: string, overrides: Partial<TaskView> = {}): TaskView {
  return {
    taskId,
    createdAt: NOW - 1000,
    round: 1,
    lastRequestText: 'req',
    artifacts: [],
    summaries: [],
    dependsOn: [],
    acceptanceComplete: false,
    incomplete: false,
    ...overrides,
  }
}

describe('panelModel', () => {
  it('pins the avatar card first and derives self presence from the connection', () => {
    const model = panelModel(statusFixture() as never, { peers: [], tasks: [] }, NOW)
    expect(model.avatar).toMatchObject({ key: 'self', name: 'avatar-main', role: 'avatar', self: true, presence: 'active' })
    expect(model.members.map(member => member.key)).toEqual(['local:s-local'])
    expect(model.members[0]?.presence).toBe('unknown')
    expect(model.counts.members).toBe(2)
  })

  it('derives peer presence from lastActiveAt freshness and awaiting overrides', () => {
    const model = panelModel(
      statusFixture() as never,
      {
        peers: [{
          device: 'dev-b',
          instanceID: 'i',
          sessions: [{ sessionID: 'p1', title: 'T', directory: '/d', name: 'reviewer' }],
          role: 'worker',
          lastActiveAt: NOW - 30_000,
        }, {
          device: 'dev-c',
          instanceID: 'i',
          sessions: [{ sessionID: 'p2', title: 'T', directory: '/d', name: 'coder-1' }],
        }],
        tasks: [taskFixture('t1', { pendingTarget: 'dev-c:coder-1' })],
      },
      NOW,
    )
    const byKey = new Map(model.members.map(member => [member.key, member]))
    expect(byKey.get('peer:dev-b/p1')).toMatchObject({ presence: 'active', waiting: 0, role: 'worker' })
    expect(byKey.get('peer:dev-c/p2')).toMatchObject({ presence: 'awaiting' })
    // 本机 avatar：presence 由连接态推导（connected=true → active），
    // 与 peer 的 lastActiveAt 通道无关。
    expect(model.avatar?.presence).toBe('active')
  })

  it('counts running/waiting per member from assignee and pendingTarget', () => {
    const model = panelModel(
      statusFixture() as never,
      {
        peers: [],
        tasks: [
          taskFixture('t1', { assignee: { target: 'helper' } }),
          taskFixture('t2', { assignee: { target: 'dev-a:helper' } }),
          taskFixture('t3', { pendingTarget: 'helper' }),
          taskFixture('t4', { closed: true, assignee: { target: 'helper' } }),
        ],
      },
      NOW,
    )
    const local = model.members.find(member => member.key === 'local:s-local')
    expect(local).toMatchObject({ running: 2, waiting: 1 })
  })

  it('drops peer cards that echo a local identity', () => {
    const model = panelModel(
      statusFixture() as never,
      {
        peers: [{
          device: 'dev-a',
          instanceID: 'self-echo',
          sessions: [{ sessionID: 's-local', title: 'Local work', directory: '/d', name: 'helper' }],
        }],
        tasks: [],
      },
      NOW,
    )
    expect(model.members.map(member => member.key)).toEqual(['local:s-local'])
  })
})

describe('taskStatusOf', () => {
  it('folds the view into the five panel states', () => {
    expect(taskStatusOf(taskFixture('a'))).toBe('in_progress')
    expect(taskStatusOf(taskFixture('b', { pendingTarget: 'x' }))).toBe('awaiting')
    expect(taskStatusOf(taskFixture('c', { acceptanceComplete: true }))).toBe('deliverable')
    expect(taskStatusOf(taskFixture('d', { acceptanceComplete: true, closed: true }))).toBe('done')
    expect(taskStatusOf(taskFixture('e', { closed: true }))).toBe('done')
    expect(taskStatusOf(taskFixture('f', { archived: true, closed: true }))).toBe('archived')
  })
})

describe('dagLayout', () => {
  it('layers nodes by the longest upstream path and keeps ghosts', () => {
    const layout = dagLayout([
      taskFixture('down', { dependsOn: [{ taskId: 'mid' }] }),
      taskFixture('mid', { dependsOn: [{ taskId: 'ghost' }] }),
    ])
    expect(layout.cycleEdges).toBe(0)
    expect(layout.columns.map(column => column.map(node => [node.taskId, node.ghost]))).toEqual([
      [['ghost', true]],
      [['mid', false]],
      [['down', false]],
    ])
    // 边序跟随任务数组序：down 先声明其依赖。
    expect(layout.edges).toEqual([
      { from: 'mid', to: 'down' },
      { from: 'ghost', to: 'mid' },
    ])
  })

  it('tolerates dependency cycles without hanging', () => {
    const layout = dagLayout([
      taskFixture('x', { dependsOn: [{ taskId: 'y' }] }),
      taskFixture('y', { dependsOn: [{ taskId: 'x' }] }),
    ])
    expect(layout.cycleEdges).toBeGreaterThan(0)
    expect(layout.columns.flat().map(node => node.taskId).sort()).toEqual(['x', 'y'])
  })

  it('ignores self-dependencies entirely', () => {
    const layout = dagLayout([taskFixture('solo', { dependsOn: [{ taskId: 'solo' }] })])
    expect(layout.edges).toEqual([])
    expect(layout.columns).toEqual([])
  })
})

describe('upstreamOf', () => {
  it('returns the transitive upstream closure of a node', () => {
    const layout = dagLayout([
      taskFixture('c', { dependsOn: [{ taskId: 'b' }] }),
      taskFixture('b', { dependsOn: [{ taskId: 'a' }] }),
      taskFixture('a'),
    ])
    expect(upstreamOf(layout, 'c')).toEqual(new Set(['b', 'a']))
    expect(upstreamOf(layout, 'a')).toEqual(new Set())
  })
})

describe('interpolate', () => {
  it('replaces placeholders and keeps unknown ones verbatim', () => {
    expect(interpolate('{a} + {b}', { a: 1, b: 'x' })).toBe('1 + x')
    expect(interpolate('{missing}', {})).toBe('{missing}')
  })
})
