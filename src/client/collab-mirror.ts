/**
  * 浏览器半的协同快照镜像：与 status-mirror 同一形态的
  * 可订阅 store，由一次初始 Remote collab 读取与可见性
  * 门控轮询供给（外置插件不经宿主事件转发，见
  * status-mirror 的说明）。快照在宿主侧是一次本地
  * 任务目录扫描加一帧 peers 请求，轮询代价可控。
 */
import type { YuyiCollabSnapshot } from '../types.ts'

/* * 镜像状态：最近观测到的快照，首次读取前为 undefined。 */
export interface YuyiCollabState {
  current: YuyiCollabSnapshot | undefined
}

/* * 本插件所消费的 Remote 结果。 */
export type Result<T> = { readonly ok: true; readonly value: T } | { readonly ok: false; readonly error: { message?: string } }

/**
  * 解包一个 Remote 结果，抛出视图要呈现的失败文案。
  * @param result - Remote 调用的结果信封。
  * @returns 成功载荷。
 */
export function unwrapCollab<T>(result: Result<T>): T {
  if (!result.ok) throw new Error(result.error.message ?? 'yuyi remote call failed')
  return result.value
}

/* * 页面可见时的默认刷新间隔（与状态镜像同一节奏）。 */
const DEFAULT_POLL_MS = 10_000

/**
  * 把协同快照镜像进一个可订阅 store。
 */
export class YuyiCollabMirror {
  private state: YuyiCollabState = { current: undefined }
  private readonly listeners = new Set<() => void>()
  private timer: ReturnType<typeof setInterval> | undefined

  /**
    * @param readCollab - 一次 Remote collab 读取（由调用方解包）。
   */
  constructor(private readonly readCollab: () => Promise<YuyiCollabSnapshot>) {}

  /* * @returns 当前同步快照（到下一次变化前引用稳定）。 */
  getSnapshot(): YuyiCollabState {
    return this.state
  }

  /**
    * 观察快照替换。
    * @param listener - 每次变化后调用。
    * @returns 移除该监听器的清理函数。
   */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => { this.listeners.delete(listener) }
  }

  /**
    * 播种 store 并在页面可见时轮询。
    * @param pollMs - 刷新间隔；默认 10 秒。
    * @returns 停止轮询的清理函数。
   */
  start(pollMs: number = DEFAULT_POLL_MS): () => void {
    this.refresh()
    this.timer = setInterval(() => {
      const hidden = typeof document !== 'undefined' && document.visibilityState === 'hidden'
      if (!hidden) this.refresh()
    }, pollMs)
    return () => {
      if (this.timer !== undefined) clearInterval(this.timer)
      this.timer = undefined
    }
  }

  private refresh(): void {
    void this.readCollab().then(
      snapshot => { this.publish(snapshot) },
      // Remote 读取失败时镜像停留在最后一个快照；面板渲染
      // 未连接态而非错误，下一次轮询会回填。
      () => {},
    )
  }

  private publish(snapshot: YuyiCollabSnapshot): void {
    if (this.state.current === snapshot) return
    this.state = { current: snapshot }
    for (const listener of [...this.listeners]) listener()
  }
}
