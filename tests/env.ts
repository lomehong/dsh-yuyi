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
 *
 * 关于 token：设置界面是 dsh 唯一合规的 token 入口（service.ts 的
 * resolveToken 只读 dsh 凭证库，对环境变量 / ~/.yuyi/env /
 * ~/.yuyi/dsh-token 全部免疫——这是 2026-08-19 跨 Agent 串用
 * 修复后的设计）。本测试套件仅在 dsh 凭证库层注入 token（通过
 * `StubCredentials`），**不**经任何文件或环境变量路径。
 */

import { mkdtempSync } from 'node:fs'
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

/* * 凭证库命中时的 token 测试值。 */
export const LAUNCH_TOKEN = 'launch-token-value'
