import './env.ts'
import { appendTaskRecord, readTask } from '../src/core.ts'
import { outcomeOf, recordTaskReply } from '../src/tools/task-record.ts'
import type { AppendResult, YuyiMessage } from '../src/core.ts'
import { describe, expect, it } from 'vitest'

function reply(overrides: Partial<YuyiMessage> = {}): YuyiMessage {
  return {
    id: 'msg_unit_1',
    mode: 'notify',
    text: 'unit reply',
    from: { device: 'remote-dev', sessionID: 'peer-1', name: 'reviewer' },
    to: { target: 'worker-a' },
    time: 1,
    ...overrides,
  }
}

describe('task-record helpers', () => {
  it('outcomeOf maps failure with and without a reason', () => {
    expect(outcomeOf({ ok: true } satisfies AppendResult)).toEqual({ recorded: true })
    expect(outcomeOf({ ok: false, reason: 'cap' } satisfies AppendResult)).toEqual({ recorded: false, reason: 'cap' })
    expect(outcomeOf({ ok: false } satisfies AppendResult)).toEqual({ recorded: false })
  })

  it('recordTaskReply returns undefined for an empty record and maps a reply without replyTo', () => {
    expect(recordTaskReply('task-empty-unit', reply())).toBeUndefined()
    appendTaskRecord('task-shape-unit', { kind: 'created', taskId: 'task-shape-unit', owner: {} })
    const noReplyTo = reply()
    delete (noReplyTo as { replyTo?: string }).replyTo
    const outcome = recordTaskReply('task-shape-unit', noReplyTo)
    expect(outcome).toEqual({ recorded: true })
    const events = readTask('task-shape-unit').events
    expect(events[1]).toMatchObject({ kind: 'reply', msgId: 'msg_unit_1', from: { device: 'remote-dev', name: 'reviewer' } })
  })
})
