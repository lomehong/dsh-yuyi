/**
 * dsh 适配器运行时的 YUYI_* 配置读取器（与 omp/opencode/codex/mavis 同地对接）。
 *
 * 关键：`yuyiEnv`（从 @yuyi/core 导出）优先读进程 env，是跨 Agent 串用根因——
 * 安装器 opencode 分支（b7bf367 后）会把 opencode 自己的 token 写进用户级
 * YUYI_TOKEN，dsh 进程继承后被 yuyiEnv 误读为"自己的 token"。本文件**不**
 * 重新导出 yuyiEnv（删去避免任何回归）。运行时只用 yuyiEnvToken（见下）。
 *
 * 仍保留 ~/.yuyi/env 文件读取能力（loadYuyiEnvFile / yuyiEnvFile）——供
 * 设备级 YUYI_HUB / YUYI_DEVICE / YUYI_YUFU_URL 的读取（这些 KEY 写在文件里
 * 是公共安全的，不会被任何一个 Agent 独占）。但 YUYI_TOKEN 这一行**永远**
 * 不从该文件读——多 Agent 设备上 opencode 装过的机器即便在该文件残留部分
 * token 路径，dsh 端也视而不见。
 */

import { homedir } from "node:os"
import { join } from "node:path"
import { existsSync, readFileSync } from "node:fs"

let cached: Record<string, string> | undefined
let cachedMtimeMs = -1

function loadEnvFile(): Record<string, string> {
  const file = join(homedir(), ".yuyi", "env")
  let mtime = -1
  try {
    mtime = existsSync(file) ? Number(readFileSync(file, "utf8").length) : -1
  } catch {
    mtime = -1
  }
  // 简单失效：文件不存在/内容变化时重读（进程内缓存，验签是低频调用）
  if (cached !== undefined && cachedMtimeMs === mtime) return cached
  const out: Record<string, string> = {}
  try {
    if (existsSync(file)) {
      const raw = readFileSync(file, "utf8")
      for (const line of raw.split("\n")) {
        const t = line.trim()
        if (!t || t.startsWith("#")) continue
        const eq = t.indexOf("=")
        if (eq <= 0) continue
        const k = t.slice(0, eq).trim()
        const v = t.slice(eq + 1).trim().replace(/^["']|["']$/g, "")
        if (k) out[k] = v
      }
    }
  } catch {
    // 读失败视为无文件回退
  }
  cached = out
  cachedMtimeMs = mtime
  return out
}

/** 设备级 YUYI_* 配置（仅 ~/.yuyi/env 文件；不读进程 env）。 */
export function yuyiEnvFile(): Record<string, string> {
  return loadEnvFile()
}

/**
 * dsh 适配器 token 解析（与 omp/opencode/codex/mavis 一致：每 Agent 各自专属）。
 *
 * 唯一来源：`~/.yuyi/dsh-token` 文件（Yuyi 安装器 dsh 分支写入，与
 * `~/.yuyi/omp-token` 同约定：纯文本单行）。YUYI_STATE_DIR 优先于 ~。
 *
 * 为什么不读 ~/.yuyi/env 的 YUYI_TOKEN：安装器只把 YUYI_HUB / YUYI_DEVICE /
 * YUYI_YUFU_URL 写进该文件（见 install.ps1 末段），从不写 YUYI_TOKEN——
 * 这是多 Agent 设备上 per-agent 文件与共享 env 文件的边界。一旦从 env 文件
 * 读 YUYI_TOKEN，opencode 装过的机器上若有路径残留就会污染（即多 Agent
 * 设备上这种残留实际存在，是污染根因）。
 *
 * 为什么不读进程 env：opencode 安装器把 opencode 自己的 token 写进用户级
 * YUYI_TOKEN（b7bf367 后），任何继承该 env 的 dsh 进程都会读到这个非
 * dsh 自己的 token。是同一类污染源。
 *
 * 设备级共享配置（YUYI_HUB / YUYI_DEVICE / YUYI_YUFU_URL）走 yuyiEnvFile
 * 即可，与 token 是不同关切，分开访问。
 */
export function yuyiEnvToken(): string | undefined {
  const dir = process.env.YUYI_STATE_DIR ?? join(homedir(), ".yuyi")
  try {
    const raw = readFileSync(join(dir, "dsh-token"), "utf8").trim()
    return raw.length > 0 ? raw : undefined
  } catch {
    return undefined
  }
}

/** 测试辅助：清空缓存（进程内）。 */
export function _clearYuyiEnvCache(): void {
  cached = undefined
  cachedMtimeMs = -1
}

/**
 * 读取内容签名 sign_key（方案 1，2026-08-14 per-agent 修复）。
 *
 * 御符侧 AgentSignKey 是 **Agent 级**（每个御符 Agent 主体独立签发，模型含 AgentID）。
 * 一台设备装多个 Agent（不同御符 token）时，各 Agent 必须用自己主体的 sign_key，
 * 共用同一 key 会导致：验签返回的 AgentID 与实际发送方错配、key 泄露范围扩大、
 * 吊销联动失效。
 *
 * 读取顺序（多 Agent 设备 per-agent 文件优先，单 Agent 旧配置回退）：
 *   1. 进程环境变量 YUYI_SIGN_KEY_ID / YUYI_SIGN_SECRET（最高优先，手动覆盖）
 *   2. ~/.yuyi/sign-key-<agentKind>.env（per-agent，安装脚本按 Agent 分别写入）
 *   3. ~/.yuyi/sign-key.env（旧单文件，单 Agent 设备兼容）
 */
export function loadSignKeyEnv(agentKind?: string): { id?: string; secret?: string } {
  const envId = process.env.YUYI_SIGN_KEY_ID
  const envSecret = process.env.YUYI_SIGN_SECRET
  if (envId && envSecret) return { id: envId, secret: envSecret }
  const dir = process.env.YUYI_STATE_DIR ?? join(homedir(), ".yuyi")
  const files = agentKind
    ? [join(dir, `sign-key-${agentKind}.env`), join(dir, "sign-key.env")]
    : [join(dir, "sign-key.env")]
  for (const file of files) {
    try {
      const text = readFileSync(file, "utf8")
      const mId = text.match(/^YUYI_SIGN_KEY_ID=(.+)$/m)
      const mSec = text.match(/^YUYI_SIGN_SECRET=(.+)$/m)
      if (mId && mSec) return { id: mId[1]!.trim(), secret: mSec[1]!.trim() }
    } catch {
      // 文件不存在/读失败 → 尝试下一个
    }
  }
  return {}
}
