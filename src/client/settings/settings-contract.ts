/**
  * 宿主 `yuyi` 设置命名空间（`dsh-yuyi` 的 Config）的浏览器镜像：
  * 本区块编辑的连接字段。宿主 schema 仍为
  * 为权威；这份结构镜像存在是因为浏览器 bundle 不得
  * 引用宿主能力包的程序（只有其纯类型
  * `/types` 座位，它不携带设置契约）。
 */

/* * 宿主 `dsh-yuyi` 插件注册的设置命名空间。 */
export const YUYI_SETTINGS_NAMESPACE = 'yuyi'

/* * 本区块编辑的一个连接字段。 */
export type YuyiConnectionField = 'hub' | 'device' | 'tokenEnv' | 'replyTimeoutMs'

/* * 解析后的 `yuyi` 设置节，按线路 schema 所接纳的形态。 */
export interface YuyiSettingsValue {
  /* * Hub WebSocket URL；缺省穿透到环境链。 */
  hub?: string
  /* * 设备身份；缺省回落主机名。 */
  device?: string
  /* * 令牌解析所经的环境变量名。 */
  tokenEnv: string
  /* * 等回复的等待预算（毫秒）。 */
  replyTimeoutMs: number
}

/* * 一个可编辑字段的渲染种类。 */
export interface YuyiFieldDescriptor {
  field: YuyiConnectionField
  kind: 'text' | 'number'
}

/* * 区块渲染的全部字段，按显示顺序。 */
export const CONNECTION_FIELDS: readonly YuyiFieldDescriptor[] = [
  { field: 'hub', kind: 'text' },
  { field: 'device', kind: 'text' },
  { field: 'tokenEnv', kind: 'text' },
  { field: 'replyTimeoutMs', kind: 'number' },
]
