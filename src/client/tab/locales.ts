/* * `yuyiTab` 命名空间字典。 */

/* * 本插件拥有的字典命名空间。 */
export const NS = 'yuyiTab'

/* * 简体中文字典（键集权威来源）。 */
export const zh = {
  'tab.label': '御驿',
  'state.connected': '已连接',
  'state.disconnected': '已断开',
  'state.unconfigured': '未配置',
  'identity.device': '设备',
  'identity.agent': '智能体',
  'identity.owner': '所有者',
  'roster.title': '本机会话',
  'roster.empty': '尚未注册任何会话',
  'inbox.device.title': '设备收件箱',
  'inbox.session.title': '本会话收件箱',
  'inbox.empty': '空',
  'inbox.entry': '{from} · {text}',
  'peers.title': '可达设备',
  'peers.empty': '无在线设备',
  'peers.session': '{name}：{title}',
  'error.title': '读取失败',
} as const

/* * 由中文权威字典派生的文案键联合。 */
export type YuyiTabKey = keyof typeof zh

/* * 英文字典，键集与中文权威字典一致。 */
export const en: Record<YuyiTabKey, string> = {
  'tab.label': 'Yuyi',
  'state.connected': 'connected',
  'state.disconnected': 'disconnected',
  'state.unconfigured': 'not configured',
  'identity.device': 'device',
  'identity.agent': 'agent',
  'identity.owner': 'owner',
  'roster.title': 'Local sessions',
  'roster.empty': 'no session registered yet',
  'inbox.device.title': 'Device inbox',
  'inbox.session.title': 'This session\'s inbox',
  'inbox.empty': 'empty',
  'inbox.entry': '{from} · {text}',
  'peers.title': 'Reachable devices',
  'peers.empty': 'no devices online',
  'peers.session': '{name}: {title}',
  'error.title': 'read failed',
}
