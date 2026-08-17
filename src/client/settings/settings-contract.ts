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
  { field: 'replyTimeoutMs', kind: 'number' },
]

/* * 令牌凭证的一次状态（值永不回读，只有配置/可写事实）。 */
export interface YuyiTokenState {
  configured: boolean
  writable: boolean
}

/**
 * 本适配器专属令牌的操作面。御驿一机多 Agent、令牌按 Agent 签发，
 * 因此 dsh 适配器的令牌直接写入宿主凭证库（.credentials.yaml，经
 * `tokenEnv` 命名的引用），绝不读取共享环境变量——那是其他 Agent 的。
 */
export interface YuyiTokenStore {
  /* * 查询当前引用下的令牌状态。 */
  read(): Promise<YuyiTokenState>
  /* * 写入令牌值（只写不读）。 */
  save(value: string): Promise<void>
  /* * 清除已存令牌。 */
  clear(): Promise<void>
  /* * 订阅该引用的令牌变更（写入、清除或外部改动）。 */
  onChange(listener: () => void): () => void
}
