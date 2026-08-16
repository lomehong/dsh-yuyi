/**
  * 入站投递的纯展示辅助：被注入的
  * 用户消息携带的内容及其来源摘要。消息的纯函数；
  * 无 I/O、无会话状态——运行在投递数据上，必须
  * 对重放审计保持确定。
 * @module dsh-yuyi/delivery
 */

import type { YuyiMessage } from './core.ts'

/* * 以 hub 背书的最具体身份标注发送者。 */
function senderLabel(message: YuyiMessage): string {
  const from = message.from
  const identity = from.name ?? from.sessionID
  return from.device.length > 0 ? `${identity}@${from.device}` : identity
}

/**
  * 把一条入站消息格式化为被唤醒会话的模型所读文本。
  * 先一行携带背书身份与线程字段的头部，然后
  * 正文原样。
  * @param message - 已投递的消息，hub 权威字段已就位。
  * @returns 注入的文本。
 */
export function formatIncoming(message: YuyiMessage): string {
  const parts: string[] = [`[yuyi] from ${senderLabel(message)}`]
  if (message.from.ownerUsername !== undefined) parts.push(`owner ${message.from.ownerUsername}`)
  if (message.from.role !== undefined) parts.push(`role ${message.from.role}`)
  if (message.replyTo !== undefined) parts.push(`reply-to ${message.replyTo}`)
  if (message.taskId !== undefined) parts.push(`task ${message.taskId}`)
  return `${parts.join(' · ')}\n${message.text}`
}

/**
  * 供消息来源元数据使用的一行投递摘要。
  * @param message - 已投递的消息。
  * @returns 摘要字符串。
 */
export function deliverySummary(message: YuyiMessage): string {
  return `${senderLabel(message)} → ${message.to.target}`
}
