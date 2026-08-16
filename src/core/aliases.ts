/**
 * 会话别名持久化：~/.yuyi/aliases.json，结构 Record<sessionID, name>。
 *
 * 为什么必须落盘：Hub 侧收件箱以 `device:name` 为主键（顶层 §5.3「收件人主键」），
 * 别名存在内存里意味着 opencode 重启后本会话的收件人标识消失，此前投递的离线
 * mail 再也收不到——与 yuyi-mcp 面临的是同一个问题。
 *
 * 这不违反 P6「身份不得自动派生」：别名仍由用户通过 yuyi_register **显式给出**，
 * 落盘只是记住用户的显式决定，不是自动生成一个身份。持久化的是配置意图而非消息
 * 数据，量级为每会话数十字节。
 */
import { readFileSync, writeFileSync, mkdirSync, renameSync } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"

// 状态目录（YUYI_STATE_DIR 可隔离，默认 ~/.yuyi；与 inbox/reply-loop 同源）
const DIR = process.env.YUYI_STATE_DIR ?? join(homedir(), ".yuyi")
const FILE = join(DIR, "aliases.json")

export type AliasMap = Record<string, string>

export function load(): AliasMap {
  try {
    const parsed = JSON.parse(readFileSync(FILE, "utf8"))
    if (typeof parsed !== "object" || parsed === null) return {}
    const out: AliasMap = {}
    for (const [sessionID, name] of Object.entries(parsed)) {
      if (typeof name === "string" && name) out[sessionID] = name
    }
    return out
  } catch {
    // 文件不存在或损坏，视为无别名
    return {}
  }
}

function save(map: AliasMap): void {
  mkdirSync(DIR, { recursive: true })
  // 先写临时文件再改名，避免写一半损坏（与 inbox.ts 同一约定）
  const tmp = FILE + ".tmp"
  writeFileSync(tmp, JSON.stringify(map, null, 2), "utf8")
  renameSync(tmp, FILE)
}

/**
 * 记录一个会话别名。
 * 先重新读盘再写，避免同设备多个 opencode 实例并发注册时相互覆盖。
 */
export function set(sessionID: string, name: string): void {
  const map = load()
  map[sessionID] = name
  save(map)
}

export function remove(sessionID: string): void {
  const map = load()
  if (!(sessionID in map)) return
  delete map[sessionID]
  save(map)
}
