/**
  * 入站投递的纯展示辅助：被注入的
  * 用户消息携带的内容及其来源摘要。消息的纯函数；
  * 无 I/O、无会话状态——运行在投递数据上，必须
  * 对重放审计保持确定。
 * @module dsh-yuyi/delivery
 */
import type { YuyiMessage } from './core.ts';
import type { SessionEvent } from '@deepseek-ai/dsh-session';
/**
  * 把一条入站消息格式化为被唤醒会话的模型所读文本。
  * 先一行携带背书身份与线程字段的头部，然后
  * 正文原样。
  * @param message - 已投递的消息，hub 权威字段已就位。
  * @returns 注入的文本。
 */
export declare function formatIncoming(message: YuyiMessage): string;
/**
  * 供消息来源元数据使用的一行投递摘要。
  * @param message - 已投递的消息。
  * @returns 摘要字符串。
 */
export declare function deliverySummary(message: YuyiMessage): string;
/**
 * 回信寻址：发送方别名优先（同设备裸名），跨设备/跨 owner 按 parseAddress
 * 词法补前缀。用于自动回执与自动回报的投递目标推导。
 * @param message - 入站消息（from 字段已由 hub 权威回填）。
 * @param selfDevice - 本机设备名。
 * @param selfOwner - 本连接的 owner 用户名（未知时按同 owner 处理）。
 * @returns 可投递的回信地址。
 */
export declare function replyAddressOf(message: YuyiMessage, selfDevice: string, selfOwner?: string): string;
/**
 * 收集基线 seq 之后本回合产出的助手文本（最后一个非空助手消息为准）。
 * @param events - 会话事件日志。
 * @param baselineSeq - 注入前的会话 seq。
 * @returns 本回合助手文本；无输出为空串。
 */
export declare function collectAssistantText(events: readonly SessionEvent[], baselineSeq: number): string;
