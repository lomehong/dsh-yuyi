/**
 * 御驿 Yuyi · 共享日志工具（size-based rotate）
 *
 * 所有适配器的 log 函数都是无限 appendFileSync——长时间运行会无限增长。
 * 本模块提供 createRotatingLog：超过阈值时轮转（rename .log → .log.1，新建 .log）。
 *
 * 用法：
  * const log = createRotatingLog("/path/to/file.log", "yuyi-codex-wake")
  * log("something happened")
 *
 * 轮转策略：单文件 size 超 maxSizeBytes 时，当前文件 rename 为 .1（覆盖旧 .1），
 * 新建空文件继续写。只保留 1 个历史文件（.1），不做多代归档——适配器日志是排查
 * 用的近期上下文，不是长期审计数据（审计走 hub/audit.ts 的 SQLite 持久化）。
 */
import { appendFileSync, mkdirSync, renameSync, statSync } from "node:fs"
import { dirname } from "node:path"

const DEFAULT_MAX_BYTES = 10 * 1024 * 1024 // 10 MB

export function createRotatingLog(
  logFile: string,
  prefix: string,
  maxSizeBytes: number = DEFAULT_MAX_BYTES,
): (msg: string) => void {
  let lastCheck = 0
  return (msg: string) => {
    try {
      const now = Date.now()
      // 每 60s 检查一次 size，避免每次写都 stat
      if (now - lastCheck > 60_000) {
        lastCheck = now
        try {
          const st = statSync(logFile)
          if (st.size > maxSizeBytes) {
            renameSync(logFile, `${logFile}.1`)
          }
        } catch {
          // 文件不存在或 rename 失败：忽略，继续写（最坏情况是文件稍大）
        }
      }
      mkdirSync(dirname(logFile), { recursive: true })
      appendFileSync(logFile, `${new Date().toISOString()} [${prefix}] ${msg}\n`, "utf8")
    } catch {
      // 日志失败不影响主流程
    }
  }
}
