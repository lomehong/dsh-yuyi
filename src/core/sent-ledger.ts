/**
 * 出站消息账本（0.1.4，v0.2.9 部署指令漂移事故）：
 * ~/.yuyi/sent-messages.jsonl 记「本机哪个窗口发了哪条出站消息」。
 *
 * 为什么需要：不带 taskId 的 yuyi_send，对端回信时会**代铸新 taskId**
 * （ReplyLoop.finalizeTurn 的 `taskId ?? newTaskId()`）——回信到达时
 * taskId 是本机从未见过的，任务锚点无记录可查，消息被 hub 的 roster
 * 首窗改写兜底，实测漂进无关会话。replyTo 是唯一可靠的线索：回信的
 * replyTo 指向我方出站消息 id，账本把它映射回发件窗口。
 *
 * 设计：
 * - append-only JSONL，一次写调用落一整行（与任务记录同纪律）
 * - 尺寸护栏：超 1MB 裁到最近 2000 行（低频写，stat 即可，不逐行计数）
 * - 查询从尾部反向扫描，命中即返回（同一 msgId 重发取最新）
 * - 任何 I/O 失败静默：账本是投递的辅助线索，不是通道本身
 */
import { appendFileSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'

/** 账本文件（YUYI_STATE_DIR 可隔离；与任务记录/收件箱同源） */
const FILE = join(process.env.YUYI_STATE_DIR ?? join(homedir(), '.yuyi'), 'sent-messages.jsonl')

/** 尺寸护栏：账本超过该字节数时裁剪 */
const MAX_BYTES = 1_000_000
/** 裁剪后保留的最近行数 */
const KEEP_LINES = 2_000

/** 记一条出站消息的发件窗口。失败静默——账本缺失只损失回信锚定精度。 */
export function rememberSentMessage(msgId: string, sessionID: string): void {
  try {
    mkdirSync(dirname(FILE), { recursive: true })
    appendFileSync(FILE, `${JSON.stringify({ id: msgId, s: sessionID, at: Date.now() })}\n`, 'utf8')
    if (statSync(FILE).size > MAX_BYTES) {
      const lines = readFileSync(FILE, 'utf8').trimEnd().split('\n')
      writeFileSync(FILE, `${lines.slice(-KEEP_LINES).join('\n')}\n`, 'utf8')
    }
  } catch {
    // 静默：见模块注释
  }
}

/** 反查某条出站消息的发件窗口；无记录返回 undefined。 */
export function lookupSentSession(msgId: string): string | undefined {
  try {
    const lines = readFileSync(FILE, 'utf8').split('\n')
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i]!.trim()
      if (!line) continue
      try {
        const rec = JSON.parse(line) as { id?: string; s?: string }
        if (rec.id === msgId && rec.s !== undefined) return rec.s
      } catch {
        continue
      }
    }
    return undefined
  } catch {
    return undefined
  }
}
