/**
  * yuyi 能力接缝的公开类型：状态快照、roster 条目、
  * 发送请求与结果、投递路由与接缝的错误类。
 * @module dsh-yuyi/types
 */
import { HarnessError } from '@deepseek-ai/dsh-llm';
/**
  * yuyi 接缝抛出的失败，带稳定的机器可路由错误码。
  * 以 `new YuyiError(message, code[, options])` 构造。
 */
export class YuyiError extends HarnessError {
}
