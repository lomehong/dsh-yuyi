/**
  * 浏览器半经类型导入引用的平台模块的最小环境类型面。
  * 的类型导入引用。已发布的 @deepseek-ai client 包
  * 依赖尚未发布到 npm 的家族成员，因此独立构建
  * 装不了它们；这些声明精确建模
  * 本插件消费的面（bundle 时擦除，且有意窄于真实面
  * 有意为之）。待家族发布完毕，`pnpm add` 真实
  * 包并删除本文件。
 */

declare module '@deepseek-ai/dsh-client-runtime/client' {
  /* * 传给会话作用域插槽注入 thunk 的不透明会话 id。 */
  export type SessionId = string
  /* * 一个命名空间节上的设置作用域（宿主接缝的浏览器镜像）。 */
  export interface SettingsScope<T> {
    getSnapshot(): { status: 'loading' | 'ready' | 'unavailable'; value: T | undefined; user: unknown; writable: boolean }
    subscribe(listener: () => void): () => void
    set(field: string, value: unknown): Promise<void>
    unset(field: string): Promise<void>
  }
  /* * 线路结果信封（Remote 与 api 域共用）。 */
  export type WireResult<T> = { ok: true; value: T } | { ok: false; error: { message?: string } }
  /* * 本插件使用的浏览器根上下文。 */
  export interface ClientContext {
    effect(register: () => unknown, name?: string): () => void
    locale: {
      register(ns: string, dictionaries: { zh: object; en: object }): () => void
      bind(ns: string): (key: string) => string
    }
    remote: {
      $mount(contribution: unknown): Promise<() => void>
      $on(event: string, listener: (...args: never[]) => void): () => void
      // alpha.3 路径（参考 dsh-client-ui-settings-models.storeCredential 等同名实现）：
      // 走 typert remote 的 `credentials` 命名空间，方法直接返回 WireResult，无包装 .result。
      credentials: {
        describe(refs: string[]): Promise<WireResult<Record<string, { configured: boolean; writable: boolean; source?: string }>>>
        set(ref: string, value: string): Promise<WireResult<unknown>>
        unset(ref: string): Promise<WireResult<unknown>>
      }
      [namespace: string]: unknown
    }
    connection: {
      api: {
        // rc.2 路径（已迁到 remote.credentials，保留以备回滚）。
        credentials: {
          describe(args: { refs: string[] }): Promise<{ result: WireResult<{ credentials: Record<string, { configured: boolean; writable: boolean } | undefined> }> }>
          set(args: { ref: string; value: string }): Promise<{ result: WireResult<unknown> }>
          unset(args: { ref: string }): Promise<{ result: WireResult<unknown> }>
        }
      }
    }
    settingsScope: {
      bind<T>(spec: { namespace: string }): SettingsScope<T>
    }
    slots: {
      inject(slot: string, register: () => unknown): void
      register(options: { name: string } & Record<string, unknown>, component: unknown): () => void
    }
  }
}

declare module '@deepseek-ai/dsh-client-ui-primitives' {
  import type { ButtonHTMLAttributes, JSX, ReactNode } from 'react'
  /* * 四态状态点（产品原语：halo + solid core，颜色全走 --dsw-* 令牌）。 */
  export type StateDotState = 'done' | 'warning' | 'ongoing' | 'error'
  export function StateDot(props: { state: StateDotState; size?: number; className?: string }): JSX.Element
  /* * 小圆角胶囊标签（产品原语）。 */
  export function Pill(props: { active?: boolean; className?: string; children?: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>): JSX.Element
}

declare module '@deepseek-ai/dsh-client-ui-slots' {
  /* * 裸可观察源（getSnapshot + subscribe 对）。 */
  export interface HostObservable<T> {
    getSnapshot(): T
    subscribe(listener: () => void): () => void
  }
  /* * locale 席位：绑定到注册命名空间的翻译函数。 */
  export type PropsLocale<NS extends string> = { t: (key: string) => string }
  /* * 除属主声明外无子插槽声明的插槽的运行时份额。 */
  export type PropsRuntime<K extends string> = object
  /**
    * 注入面在组件侧的视图：保留的 `hooks`
    * 舱室以绑定的 `use<Name>` 选择器钩子到达；其余
    * 成员原样透传。
   */
  export type InjectFace<I extends object> = I extends { hooks: infer HS extends object }
    ? Omit<I, 'hooks'> & {
        [N in keyof HS & string as `use${Capitalize<N>}`]:
          HS[N] extends HostObservable<infer T> ? <R>(selector: (snapshot: T) => R) => R : never
      }
    : I
}
