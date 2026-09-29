/**
 * 回归测试：YUYI_TOKEN 的来源裁决（生产事故 2026-09-28）。
 *
 * 事故形态：凭证库里已是 hub 认可的有效令牌，每次应用重启后连接仍报
 * "invalid or revoked agent token"——凭证服务 resolve 的 env 继承层
 * （launchEnvironment "process"）优先于凭证库，而进程 env 里正是被吊销的
 * 旧令牌（opencode 安装器写用户级 env、dsh 应用启动时冻结继承）。
 * selectTokenSource 固定新优先级：凭证库（非 env 层）> dsh-token 文件 > env。
 */
import { describe, expect, it } from 'vitest'
import { selectTokenSource } from '../src/service.ts'

describe('selectTokenSource', () => {
  it('凭证库命中（file 层）优先于 dsh-token 文件', () => {
    const hit = { value: 'agent-valid', source: 'file' }
    expect(selectTokenSource(hit, 'agent-stale-file')).toBe('agent-valid')
  })

  it('env 继承层不得遮蔽凭证库与文件（事故回归）', () => {
    const hit = { value: 'agent-revoked-from-env', source: 'env' }
    expect(selectTokenSource(hit, 'agent-installer-file')).toBe('agent-installer-file')
  })

  it('凭证库与文件都缺席时才回落 env 继承值', () => {
    const hit = { value: 'agent-env-only', source: 'env' }
    expect(selectTokenSource(hit, undefined)).toBe('agent-env-only')
    expect(selectTokenSource(undefined, undefined)).toBeUndefined()
  })

  it('文件令牌为空串视为缺席', () => {
    expect(selectTokenSource({ value: 'agent-env-only', source: 'env' }, '   ')).toBe('agent-env-only')
  })

  it('无任何来源时返回 undefined（保持休眠语义）', () => {
    expect(selectTokenSource(undefined, '')).toBeUndefined()
  })
})
