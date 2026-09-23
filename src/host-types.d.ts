/**
 * 0.1.7 宿主类型接缝：dsh-yuyi 向宿主的 merge-extensible 联合注册自己的身份
 * 与监听面（对照 dsh-agent model-selection 的注册方式）。纯类型，无运行时。
 * 顶层 import 使本文件成为模块——declare module 由此是「扩充」而非环境声明。
 */
import type { ContextFormed } from '@deepseek-ai/dsh-llm'

/* * 本插件作为消息生产者的身份注册（消费者按 kind 分派、未知 kind 降级透传）。 */
declare module '@deepseek-ai/dsh-llm' {
  interface MessageSourceMap {
    yuyi: { kind: 'yuyi' } & ContextFormed
  }
}

/* * 0.1.7 loader 的 volatile 配置原位提交事件；仅在拥有 fiber 上分发，外部插件以此触发重连。 */
declare module '@deepseek-ai/cordis' {
  interface Events {
    'loader/volatile-update'(paths: readonly (readonly (string | number)[])[]): void
  }
}
