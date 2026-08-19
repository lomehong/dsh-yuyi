/**
 * 共享测试凭证库：把 dsh 凭证服务的契约以最小依赖的形式复现。
 *
 * 2026-08-19 跨 Agent 串用根治后，service.ts 的 resolveToken 仅读 dsh 凭证库。
 * 测试需要把 token 注入到 ctx 上挂载的 credentials 服务里——解构同 YuyiRuntime
 * 依赖的 `@deepseek-ai/dsh-credentials` 接口（CredentialProvider + 守护式
 * resolve），对应生产等价于"用户在御驿设置界面点保存"。
 */
import { CredentialProvider, type CredentialInfo, type CredentialRef, type ResolvedCredential } from '@deepseek-ai/dsh-credentials'
import type { Context as CordisContext } from '@deepseek-ai/cordis'

export interface StubCredentialsOptions {
  /** 解析 YUYI_TOKEN 时返回的值。空字符串视同未命中。 */
  value?: string
  /**
   * 解析时是否抛错——用于模拟"凭证库自身失败"的场景（resolveToken 的
   * 现有实现会捕捉后返回 undefined，故服务进入休眠）。
   */
  fail?: boolean
  /**
   * 是否把 resolve 挂起到 release() 调用。专门测"boot 时凭证服务晚到"
   * 这条 path（YuyiRuntime 30s 重解析逻辑的触发场景）。
   */
  held?: boolean
}

export class StubCredentials extends CredentialProvider {
  private readonly gate: Promise<void>
  private readonly releaseGate: () => void

  constructor(
    ctx: CordisContext,
    private readonly options: StubCredentialsOptions = {},
  ) {
    super(ctx)
    if (options.held === true) {
      let release!: () => void
      this.gate = new Promise<void>((resolve) => { release = resolve })
      this.releaseGate = () => { release() }
    } else {
      this.gate = Promise.resolve()
      this.releaseGate = () => {}
    }
  }

  release(): void {
    this.releaseGate()
  }

  async resolve(ref: CredentialRef): Promise<ResolvedCredential | undefined> {
    if (this.options.fail === true) throw new Error('stub credentials failure')
    if (ref !== 'YUYI_TOKEN') return undefined
    await this.gate
    const value = this.options.value
    if (value === undefined || value.length === 0) return undefined
    return { value, source: 'stub' }
  }

  async describe(): Promise<CredentialInfo> {
    return { configured: false, writable: false }
  }

  async set(): Promise<void> {
    throw new Error('stub credentials are read-only')
  }

  async unset(): Promise<void> {
    throw new Error('stub credentials are read-only')
  }
}
