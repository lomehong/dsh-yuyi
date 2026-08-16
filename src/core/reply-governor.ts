/**
 * ReplyGovernor：请求-响应闭环的共享限流策略（每会话/分钟 + 实例级全局预算）。
 *
 * ReplyLoop（opencode/omp）与 ACP-bridge 原本各有一套限流实现，语义漂移风险已知。
 * 本模块把「限流判定与计数」收敛为同一份实现，让两端得到完全一致的预算口径。
 * 轮数上限与在队超时因两端持久化模型不同（任务记录 vs state 文件）仍由适配器自持，
 * 不在本模块范围内（见 reply-loop.ts / acp-bridge bridge.ts 各自实现）。
 *
 * 判定与记录分离：rateLimitOk 纯判定不记录；调用方在**实际注入开始后**调 recordInject。
 * 若在 rateLimitOk 处自动记录，轮数超限/会话未就绪等「通过判定但未注入」的提前返回
 * 路径会空耗预算（d1caf93 自动记录引入的语义漂移，评审修复）。
 *
 * 常量从 reply-loop.ts 导出（REPLY_*），两端已同源，本模块只复用不重定义。
 */
import { REPLY_RATE_PER_SESSION_PER_MIN, REPLY_RATE_INSTANCE_PER_MIN } from "./reply-loop.ts"

export {
  REPLY_RATE_PER_SESSION_PER_MIN,
  REPLY_RATE_INSTANCE_PER_MIN,
  REPLY_MAX_ROUNDS_PER_TASK,
  REPLY_QUEUE_TIMEOUT_NOTIFY_MS,
  REPLY_RATE_RETRY_MS,
  REPLY_PENDING_TIMEOUT_MS,
  REPLY_GRACE_MS,
  REPLY_RETENTION_MS,
} from "./reply-loop.ts"

/** 共享限流状态机。每个适配器持有一个实例。单进程单线程（Bun），无需锁。 */
export class ReplyGovernor {
  private sessionInjectTimes = new Map<string, number[]>()
  private instanceInjectTimes: number[] = []
  private ratePerSession: number
  private rateInstance: number

  constructor(opts: { ratePerSession?: number; rateInstance?: number } = {}) {
    this.ratePerSession = opts.ratePerSession ?? REPLY_RATE_PER_SESSION_PER_MIN
    this.rateInstance = opts.rateInstance ?? REPLY_RATE_INSTANCE_PER_MIN
  }

  /** 双层注入限流判定（每会话/分钟 + 实例级全局预算）。纯判定不记录。 */
  rateLimitOk(sessionID: string): boolean {
    const now = Date.now()
    const cutoff = now - 60_000
    const session = (this.sessionInjectTimes.get(sessionID) ?? []).filter((t) => t > cutoff)
    if (session.length >= this.ratePerSession) {
      this.sessionInjectTimes.set(sessionID, session)
      return false
    }
    const instance = this.instanceInjectTimes.filter((t) => t > cutoff)
    if (instance.length >= this.rateInstance) {
      this.instanceInjectTimes = instance
      return false
    }
    this.sessionInjectTimes.set(sessionID, session)
    this.instanceInjectTimes = instance
    return true
  }

  /** 记录一次实际注入（rateLimitOk 通过且注入真正开始后调用） */
  recordInject(sessionID: string): void {
    const now = Date.now()
    const arr = this.sessionInjectTimes.get(sessionID) ?? []
    arr.push(now)
    this.sessionInjectTimes.set(sessionID, arr)
    this.instanceInjectTimes.push(now)
  }
}
