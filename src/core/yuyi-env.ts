/**
 * ~/.yuyi/env 读取（统一智能体名称/验签等 YUYI_* 配置的文件回退）。
 *
 * 背景：安装脚本把 YUYI_HUB / YUYI_DEVICE / YUYI_YUFU_URL / YUYI_NAME 写入
 * shell profile（.bashrc / 用户级 env），但非登录 shell / 服务方式启动的
 * Agent 进程可能不加载这些 env——导致 YUYI_YUFU_URL（验签必需）缺失。
 * 根治：安装脚本同时写 ~/.yuyi/env（KEY=VALUE，chmod 600），插件运行时
 * 读取该文件回退（process.env.X ?? readYuyiEnv("X")），不依赖进程 env
 * 加载机制，Windows / Linux 通吃。
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

/** 读 YUYI_* 配置：优先进程 env，回退 ~/.yuyi/env 文件。 */
export function yuyiEnv(key: string): string | undefined {
  const fromProcess = process.env[key]
  if (fromProcess !== undefined && fromProcess !== "") return fromProcess
  return loadEnvFile()[key] || undefined
}

/**
 * 读取 dsh 专属 token 文件 `~/.yuyi/dsh-token`（Yuyi 安装器 per-agent 写入，
 * 与 ~/.yuyi/omp-token 同约定：纯文本单行）。YUYI_STATE_DIR 优先于 ~。
 *
 * 历史教训：token 曾回退读启动环境变量与共享 ~/.yuyi/env——多 Agent 设备上
 * 安装器（opencode 分支 / 旧版本）设置的用户级 YUYI_TOKEN 会被 dsh 进程继承，
 * 造成跨 Agent 串用 token（hub 侧身份错配、吊销联动失效、sign_key 主体错配）。
 * 因此 token 的兜底只认本 Agent 专属文件；通用环境变量与共享 env 文件仅保留
 * 给设备级配置（YUYI_HUB / YUYI_DEVICE / YUYI_YUFU_URL）。
 */
export function readDshTokenFile(): string | undefined {
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
