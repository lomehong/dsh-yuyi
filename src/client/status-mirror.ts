/**
  * 浏览器半的连接状态镜像：一个可订阅 store，
  * 由一次初始 Remote 状态读取与可见性门控轮询供给。harness
  * 只按自身编译期白名单转发宿主事件，因此
  * 外置插件改按间隔刷新；状态快照
  * 在宿主侧是便宜的本地读取。
 */
import type { YuyiStatus } from '../types.ts'

/* * 镜像状态：最近观测到的状态，首次读取前为 undefined。 */
export interface YuyiStatusState {
  current: YuyiStatus | undefined
}

/* * 本插件所消费的 Remote 结果。 */
export type Result<T> = { readonly ok: true; readonly value: T } | { readonly ok: false; readonly error: { message?: string } }

/**
  * 解包一个 Remote 结果，抛出视图要呈现的失败文案。
  * @param result - Remote 调用的结果信封。
  * @returns 成功载荷。
 */
export function unwrap<T>(result: Result<T>): T {
  if (!result.ok) throw new Error(result.error.message ?? 'yuyi remote call failed')
  return result.value
}

/* * 页面可见时的默认刷新间隔。 */
const DEFAULT_POLL_MS = 10_000

/**
  * 把宿主连接状态镜像进一个可订阅 store。
 */
export class YuyiStatusMirror {
  private state: YuyiStatusState = { current: undefined }
  private readonly listeners = new Set<() => void>()
  private timer: ReturnType<typeof setInterval> | undefined

  /**
    * @param readStatus - 一次 Remote 状态读取（由调用方解包）。
   */
  constructor(private readonly readStatus: () => Promise<YuyiStatus>) {}

  /* * @returns 当前同步快照（到下一次变化前引用稳定）。 */
  getSnapshot(): YuyiStatusState {
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
    void this.readStatus().then(
      status => { this.publish(status) },
      // Remote 读取失败时镜像停留在最后一个快照；下一次
      // 轮询会回填，拒绝本身不携带信号。
      () => {},
    )
  }

  private publish(status: YuyiStatus): void {
    if (this.state.current === status) return
    this.state = { current: status }
    for (const listener of [...this.listeners]) listener()
  }
}
