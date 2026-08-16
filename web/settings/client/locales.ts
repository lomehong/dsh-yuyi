/** Yuyi settings-section copy. */
import type { YuyiConnectionField } from './settings-contract.ts'

/** The section's Chinese dictionary; its keys define the copy contract. */
const zh = {
  'nav': '御驿',
  'title': '御驿连接',
  'description': 'Hub 地址、设备身份、令牌引用与等回复超时；保存后立即重连。',
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
  'field.device': '设备名',
  'field.tokenEnv': '令牌环境变量',
  'field.replyTimeoutMs': '等回复超时（毫秒）',
  'field.overridden': '已覆盖',
  'action.save': '保存',
  'action.reset': '重置',
  'note.unavailable': '设置需要本机连接（loopback）才能编辑；远程浏览器连接为只读。',
  'note.loading': '正在读取设置…',
} as const

/** A copy key of the section's dictionary. */
export type YuyiSettingsKey = keyof typeof zh

/** One dictionary's values over the shared key set. */
export type YuyiSettingsDictionary = Record<YuyiSettingsKey, string>

/** The section's English dictionary. */
const en: YuyiSettingsDictionary = {
  'nav': 'Yuyi',
  'title': 'Yuyi connection',
  'description': 'Hub URL, device identity, token reference, and reply timeout; saving reconnects live.',
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
  'field.device': 'Device name',
  'field.tokenEnv': 'Token environment variable',
  'field.replyTimeoutMs': 'Reply timeout (ms)',
  'field.overridden': 'overridden',
  'action.save': 'Save',
  'action.reset': 'Reset',
  'note.unavailable': 'Editing settings requires a loopback connection; remote browsers are read-only.',
  'note.loading': 'Loading settings…',
}

/** Namespace owning this section's copy. */
export const NS = 'settings.yuyi'
/** The section's Chinese dictionary. */
export { zh }
/** The section's English dictionary. */
export { en }

/**
 * One field's label key, addressed as the component renders it.
 * @param field - the connection field whose label key to return.
 * @returns the dictionary key carrying the field's label.
 */
export function fieldLabelKey(field: YuyiConnectionField): YuyiSettingsKey {
  return `field.${field}`
}
