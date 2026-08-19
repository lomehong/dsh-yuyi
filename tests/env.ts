/**
  * yuyi 服务套件的测试环境重定向。本模块必须是
  * spec 的第一个导入：yuyi-core 在模块
  * 载入时捕获状态目录，env 文件读取器每 fork 解析一次 `~`。
 *
  * - `YUYI_STATE_DIR` 把收件箱/任务存储指向每次运行的临时目录。
  * - `HOME`/`USERPROFILE` 把固定的 `~/.yuyi/env` 读取器从开发者的
  * 真实 agent 状态（每个 vitest fork 都是新进程，
  * 重定向随套件消亡）。
  * - 清除环境中遗留的 `YUYI_*` 连接变量，使"休眠"场景
  * 不会从启动 shell 意外解析出真实 hub。
 */

import { mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

/* * 承载钉住收件箱/任务存储的每次运行状态目录。 */
export const stateDir = mkdtempSync(join(tmpdir(), 'dsh-yuyi-state-'))
/* * 每次运行的假 home，使 `~/.yuyi/env` 只读到测试写入的内容。 */
export const fakeHome = mkdtempSync(join(tmpdir(), 'dsh-yuyi-home-'))

process.env.YUYI_STATE_DIR = stateDir
process.env.USERPROFILE = fakeHome
process.env.HOME = fakeHome
delete process.env.YUYI_HUB
delete process.env.YUYI_TOKEN
delete process.env.YUYI_DEVICE

/* * per-agent token 文件（~/.yuyi/dsh-token，安装器写入位）的默认内容。 */
export const LAUNCH_TOKEN = 'launch-token-value'

/**
 * 改写 per-agent token 文件（传 undefined 删除）。token 解析兜底只认这个
 * 文件——环境变量与共享 env 文件不再是 token 来源（跨 Agent 串用防护）。
 */
export function writeDshToken(value: string | undefined): void {
  const file = join(stateDir, 'dsh-token')
  if (value === undefined) {
    try { rmSync(file) } catch { /* 已不存在 */ }
    return
  }
  writeFileSync(file, value)
}

writeDshToken(LAUNCH_TOKEN)
