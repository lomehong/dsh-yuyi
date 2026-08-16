/**
 * 端侧收件箱：本机投递的终点 + Hub 拉取结果的离线展示缓存。
 *
 * 存储位置：~/.yuyi/inbox.json
 * 结构：Record<sessionID, InboxEntry[]>
 *
 * **与 Hub 侧收件箱的定位差异**（docs/御驿-Phase1-实施设计.md §7.3）：
 * 跨设备 mail 的可靠性由 Hub 侧 SQLite 收件箱承担（hub/inbox-store.ts），本文件
 * 只服务无 Hub 的单机场景与本机会话间投递。因此下面两处行为**刻意**与顶层 §5.3
 * 规定的 Hub 侧语义相反，不是遗漏，请勿「修正」：
 *   1. 溢出丢弃最旧（Hub 侧是拒收不淘汰）——作为缓存，丢最旧比拒收合理
 *   2. take() 整箱取出、无游标（Hub 侧是批次 50 + 游标 + 清读 ack）
 */
import { readFileSync, writeFileSync, mkdirSync, renameSync } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"

import type { YuyiMessage } from "./protocol.ts"

export interface InboxEntry {
  message: YuyiMessage
  /** 入箱时间 epoch ms */
  receivedAt: number
}

type InboxStore = Record<string, InboxEntry[]>

// 状态目录（YUYI_STATE_DIR 可隔离，默认 ~/.yuyi；与 aliases/reply-loop 同源）
const DIR = process.env.YUYI_STATE_DIR ?? join(homedir(), ".yuyi")
const FILE = join(DIR, "inbox.json")

/** 每个会话收件箱上限，防止无人查收时无限膨胀 */
const MAX_PER_SESSION = 200

function load(): InboxStore {
  try {
    const raw = readFileSync(FILE, "utf8")
    const parsed = JSON.parse(raw)
    if (typeof parsed === "object" && parsed !== null) return parsed as InboxStore
  } catch {
    // 文件不存在或损坏，视为空箱
  }
  return {}
}

function save(store: InboxStore): void {
  mkdirSync(DIR, { recursive: true })
  // 先写临时文件再改名，避免写一半损坏
  const tmp = FILE + ".tmp"
  writeFileSync(tmp, JSON.stringify(store, null, 2), "utf8")
  renameSync(tmp, FILE)
}

/** 追加一封邮件到目标会话的收件箱 */
export function append(sessionID: string, message: YuyiMessage): void {
  const store = load()
  const list = store[sessionID] ?? []
  list.push({ message, receivedAt: Date.now() })
  if (list.length > MAX_PER_SESSION) list.splice(0, list.length - MAX_PER_SESSION)
  store[sessionID] = list
  save(store)
}

/**
 * 取出某会话的邮件。
 * @param peek true 时只读不清除
 */
export function take(sessionID: string, peek = false): InboxEntry[] {
  const store = load()
  const list = store[sessionID] ?? []
  if (!peek && list.length > 0) {
    delete store[sessionID]
    save(store)
  }
  return list
}

/** 某会话未读邮件数 */
export function count(sessionID: string): number {
  const store = load()
  return (store[sessionID] ?? []).length
}
