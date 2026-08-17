/* * 御驿设置区块文案。 */
import type { YuyiConnectionField } from './settings-contract.ts'

/* * 区块的简体中文字典；其键定义文案契约。 */
const zh = {
  'nav': '御驿',
  'title': '御驿连接',
  'description': 'Hub 地址、设备身份、令牌与等回复超时；保存后立即重连。',
  'status.heading': '连接状态',
  'status.loading': '读取中…',
  'status.connected': '已连接',
  'status.disconnected': '未连接',
  'status.unconfigured': '未配置',
  'status.hub': 'Hub',
  'status.device': '设备',
  'status.agent': '智能体',
  'status.owner': '所有者',
  'status.token': '令牌',
  'status.tokenFound': '已解析',
  'status.tokenMissing': '未找到',
  'status.lastError': '最近错误',
  'field.hub': 'Hub 地址',
  'field.device': '设备名（默认自动填入本机名）',
  'field.tokenEnv': '令牌环境变量名（填变量名，不是令牌值）',
  'field.token': '令牌（本适配器专属）',
  'token.configured': '已配置',
  'token.missing': '未配置',
  'token.hint': '只写不读：存入本机凭证库，界面永不回显。御驿一机多 Agent，令牌按 Agent 签发，此处只写 dsh 适配器自己的。',
  'action.clear': '清除',
  'field.replyTimeoutMs': '等回复超时（毫秒）',
  'field.overridden': '已覆盖',
  'field.invalidNumber': '需要正整数（毫秒）',
  'hint.hub': 'Hub 的 WebSocket 地址，如 ws://主机:7377；清空保存后回退到环境链。',
  'hint.device': '本机对外身份名；默认自动填入当前设备名，清空保存即恢复自动。',
  'hint.replyTimeoutMs': '等待对端回复的毫秒预算，超时按失败处理。',
  'action.save': '保存',
  'action.discard': '放弃',
  'action.reset': '重置',
  'note.unavailable': '设置需要本机连接（loopback）才能编辑；远程浏览器连接为只读。',
  'note.loading': '正在读取设置…',
} as const

/* * 区块字典的一个文案键。 */
export type YuyiSettingsKey = keyof typeof zh

/* * 一份字典在共享键集上的取值。 */
export type YuyiSettingsDictionary = Record<YuyiSettingsKey, string>

/* * 区块的英文字典。 */
const en: YuyiSettingsDictionary = {
  'nav': 'Yuyi',
  'title': 'Yuyi connection',
  'description': 'Hub URL, device identity, token, and reply timeout; saving reconnects live.',
  'status.heading': 'Connection',
  'status.loading': 'Reading…',
  'status.connected': 'Connected',
  'status.disconnected': 'Disconnected',
  'status.unconfigured': 'Not configured',
  'status.hub': 'Hub',
  'status.device': 'Device',
  'status.agent': 'Agent',
  'status.owner': 'Owner',
  'status.token': 'Token',
  'status.tokenFound': 'resolved',
  'status.tokenMissing': 'not found',
  'status.lastError': 'Last error',
  'field.hub': 'Hub URL',
  'field.device': 'Device name (auto-filled from this machine)',
  'field.tokenEnv': 'Token env var name (the NAME, not the token itself)',
  'field.token': 'Token (this adapter only)',
  'token.configured': 'Configured',
  'token.missing': 'Not configured',
  'token.hint': 'Write-only: stored in the local credential store, never echoed back. Yuyi hosts multiple agents per machine with per-agent tokens — this writes only the dsh adapter\'s own.',
  'action.clear': 'Clear',
  'field.replyTimeoutMs': 'Reply timeout (ms)',
  'field.overridden': 'overridden',
  'field.invalidNumber': 'Must be a positive integer (ms)',
  'hint.hub': 'The hub\'s WebSocket URL, e.g. ws://host:7377; clear and save to fall back to the environment chain.',
  'hint.device': 'This machine\'s public identity; auto-filled with the current device name — clear and save to return to automatic.',
  'hint.replyTimeoutMs': 'How long to wait for a peer\'s reply, in milliseconds; a timeout counts as failure.',
  'action.save': 'Save',
  'action.discard': 'Discard',
  'action.reset': 'Reset',
  'note.unavailable': 'Editing settings requires a loopback connection; remote browsers are read-only.',
  'note.loading': 'Loading settings…',
}

/* * 本区块文案的命名空间。 */
export const NS = 'settings.yuyi'
/* * 区块的简体中文字典。 */
export { zh }
/* * 区块的英文字典。 */
export { en }

/**
  * 一个字段的文案键，按组件渲染的方式寻址。
  * @param field - 要返回文案键的连接字段。
  * @returns 承载字段文案的字典键。
 */
export function fieldLabelKey(field: YuyiConnectionField): YuyiSettingsKey {
  return `field.${field}`
}
