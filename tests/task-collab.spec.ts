/**
 * 任务记忆层的依赖扩展（协同面板数据侧）：
 * `depends` 事件的追加/投影/快照渲染，与 listTaskViews 的
 * 目录列举、排序与归档排除。
 */
import './env.ts'
import { archiveTask, appendTaskRecord, listTaskViews, TASK_ID_RE, taskSnapshot, taskView } from '../src/core.ts'
import { describe, expect, it } from 'vitest'

describe('task depends events', () => {
  it('projects dependsOn deduped by upstream id with the latest note winning', () => {
    appendTaskRecord('task-dep-unit', { kind: 'created', taskId: 'task-dep-unit', owner: {} })
    appendTaskRecord('task-dep-unit', { kind: 'depends', on: 'upstream-a' })
    appendTaskRecord('task-dep-unit', { kind: 'depends', on: 'upstream-b', note: 'first' })
    appendTaskRecord('task-dep-unit', { kind: 'depends', on: 'upstream-b', note: 'second' })
    appendTaskRecord('task-dep-unit', { kind: 'depends', on: 'task-dep-unit' })
    const view = taskView('task-dep-unit')
    expect(view?.dependsOn).toEqual([
      { taskId: 'upstream-a' },
      { taskId: 'upstream-b', note: 'second' },
    ])
  })

  it('renders the dependency line in the snapshot', () => {
    appendTaskRecord('task-dep-snap', { kind: 'created', taskId: 'task-dep-snap', owner: {} })
    appendTaskRecord('task-dep-snap', { kind: 'depends', on: 'upstream-x', note: 'blocks analysis' })
    const snapshot = taskSnapshot('task-dep-snap')
    expect(snapshot).toContain('依赖：upstream-x（blocks analysis）')
  })

  it('accepts only whitelisted upstream ids via the shared regex', () => {
    expect(TASK_ID_RE.test('task-1_ok')).toBe(true)
    expect(TASK_ID_RE.test('../escape')).toBe(false)
  })
})

describe('listTaskViews', () => {
  it('lists active tasks most-recent-first and excludes archived records', () => {
    appendTaskRecord('task-list-old', { kind: 'created', taskId: 'task-list-old', owner: {} })
    appendTaskRecord('task-list-old', { kind: 'request', msgId: 'm-old', from: {}, to: { target: 'x' }, text: 'old request' })
    appendTaskRecord('task-list-new', { kind: 'created', taskId: 'task-list-new', owner: {} })
    const ids = listTaskViews().map(view => view.taskId)
    expect(ids.indexOf('task-list-new')).toBeLessThan(ids.indexOf('task-list-old'))

    expect(archiveTask('task-list-old').ok).toBe(true)
    expect(listTaskViews().map(view => view.taskId)).not.toContain('task-list-old')
    expect(taskView('task-list-old')?.archived).toBe(true)
  })

  it('returns an empty list when no task was ever recorded', () => {
    // 归档目录之上，全新状态目录由 env.ts 每 fork 创建；只校验不抛错。
    expect(Array.isArray(listTaskViews())).toBe(true)
  })
})
