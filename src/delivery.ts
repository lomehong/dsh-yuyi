/**
  * 入站投递的纯展示辅助：被注入的
  * 用户消息携带的内容及其来源摘要。消息的纯函数；
  * 无 I/O、无会话状态——运行在投递数据上，必须
  * 对重放审计保持确定。
 * @module dsh-yuyi/delivery
 */

import type { YuyiMessage } from './core.ts'
import type { SessionEvent } from '@deepseek-ai/dsh-session'

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

/**
 * 回信寻址：发送方别名优先（同设备裸名），跨设备/跨 owner 按 parseAddress
 * 词法补前缀。用于自动回执与自动回报的投递目标推导。
 * @param message - 入站消息（from 字段已由 hub 权威回填）。
 * @param selfDevice - 本机设备名。
 * @param selfOwner - 本连接的 owner 用户名（未知时按同 owner 处理）。
 * @returns 可投递的回信地址。
 */
export function replyAddressOf(message: YuyiMessage, selfDevice: string, selfOwner?: string): string {
  const bare = message.from.name ?? message.from.sessionID
  let address = bare
  if (message.from.device.length > 0 && message.from.device !== selfDevice) address = `${message.from.device}:${bare}`
  if (message.from.ownerUsername !== undefined && message.from.ownerUsername !== selfOwner) {
    address = `${message.from.ownerUsername}/${address}`
  }
  return address
}

/**
 * 收集基线 seq 之后本回合产出的助手文本（最后一个非空助手消息为准）。
 * @param events - 会话事件日志。
 * @param baselineSeq - 注入前的会话 seq。
 * @returns 本回合助手文本；无输出为空串。
 */
export function collectAssistantText(events: readonly SessionEvent[], baselineSeq: number): string {
  let text = ''
  for (const event of events) {
    if (event.seq < baselineSeq || event.type !== 'assistant/message') continue
    const joined = event.data.message.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('')
    if (joined !== '') text = joined
  }
  return text
}
