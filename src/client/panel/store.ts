/**
  * 面板开合 store：shell.overlay 面板、头部工具钮与会话内
  * 卡片的「活动面板」链接共用的同一真源。每次客户端
  * apply 创建一个实例（无模块级单例，随宿主生命周期走）。
  *
  * 用户的开合选择持久化在 localStorage（`dsh-yuyi/panel`）；
  * 未做过选择时 store 保持关闭，由 apply 侧的「已配置即
  * 首次展开」逻辑接管——未配置御驿的用户永远不被空面板打扰。
 * @module dsh-yuyi/client/panel/store
 */

/* * localStorage 持久化键（浏览器半专属；node/测试环境无此 API）。 */
const STORAGE_KEY = 'dsh-yuyi/panel'

/* * 面板开合的最小可观察面。 */
export interface YuyiPanelStore {
  /* * @returns 当前面板是否展开（引用稳定到下一次变化）。 */
  getSnapshot(): boolean
  /**
    * 观察开合变化。
    * @param listener - 每次变化后调用。
    * @returns 移除该监听器的清理函数。
   */
  subscribe(listener: () => void): () => void
  /* * 展开面板（写入持久化选择）。 */
  open(): void
  /* * 收起面板（写入持久化选择）。 */
  close(): void
  /* * 切换开合（写入持久化选择）。 */
  toggle(): void
  /* * 用户是否已显式选择过关合（未选择时 apply 侧可代为首次展开）。 */
  hasUserChoice(): boolean
}

/* * 读取持久化的选择；无存储 API 或未存储时返回 undefined。 */
function readStored(): boolean | undefined {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
    if (raw === 'open') return true
    if (raw === 'closed') return false
    return undefined
  } catch {
    return undefined // 隐私模式等存储拒绝：退化为会话内状态
  }
}

/* * 写入持久化的选择；存储不可用时静默跳过。 */
function writeStored(open: boolean): void {
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, open ? 'open' : 'closed')
  } catch {
    // 同上：忽略存储失败。
  }
}

/**
  * 创建一个面板开合 store（每次调用新实例）。
  * @returns 可观察的开合 store。
 */
export function createPanelStore(): YuyiPanelStore {
  let open = readStored() ?? false
  /* * 用户在本实例上交互过（存储不可用时的防抢夺兜底）。 */
  let touched = false
  const listeners = new Set<() => void>()
  const publish = (): void => {
    for (const listener of [...listeners]) listener()
  }
  const set = (next: boolean): void => {
    touched = true
    if (open === next) return
    open = next
    writeStored(next)
    publish()
  }
  return {
    getSnapshot: () => open,
    subscribe: listener => {
      listeners.add(listener)
      return () => { listeners.delete(listener) }
    },
    open: () => { set(true) },
    close: () => { set(false) },
    toggle: () => { set(!open) },
    hasUserChoice: () => touched || readStored() !== undefined,
  }
}
