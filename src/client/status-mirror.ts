/**
 * Connection-status mirror for the browser half: one subscribable store fed
 * by an initial Remote status read and a visibility-gated poll. The harness
 * forwards Host events only for its own compile-time allowlist, so an
 * out-of-tree plugin refreshes on an interval instead; the status snapshot
 * is a cheap local read on the Host side.
 */
import type { YuyiStatus } from '../types.ts'

/** Mirror state: the last observed status, undefined until the first read. */
export interface YuyiStatusState {
  current: YuyiStatus | undefined
}

/** One Remote result as this plugin consumes it. */
export type Result<T> = { readonly ok: true; readonly value: T } | { readonly ok: false; readonly error: { message?: string } }

/**
 * Unwrap one Remote result, throwing the failure prose the view surfaces.
 * @param result - the Remote call's result envelope.
 * @returns the successful payload.
 */
export function unwrap<T>(result: Result<T>): T {
  if (!result.ok) throw new Error(result.error.message ?? 'yuyi remote call failed')
  return result.value
}

/** Default refresh interval while the page is visible. */
const DEFAULT_POLL_MS = 10_000

/**
 * Mirror one host connection status into a subscribable store.
 */
export class YuyiStatusMirror {
  private state: YuyiStatusState = { current: undefined }
  private readonly listeners = new Set<() => void>()
  private timer: ReturnType<typeof setInterval> | undefined

  /**
   * @param readStatus - one Remote status read (unwrapped by the caller).
   */
  constructor(private readonly readStatus: () => Promise<YuyiStatus>) {}

  /** @returns the current sync snapshot (stable reference until the next change). */
  getSnapshot(): YuyiStatusState {
    return this.state
  }

  /**
   * Observe snapshot replacements.
   * @param listener - invoked after each change.
   * @returns the disposer removing this listener.
   */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => { this.listeners.delete(listener) }
  }

  /**
   * Seed the store and poll while the page is visible.
   * @param pollMs - refresh interval; defaults to 10s.
   * @returns the disposer stopping the poll.
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
      // A failed Remote read leaves the mirror at its last snapshot; the next
      // poll refills it, so the rejection carries no signal of its own.
      () => {},
    )
  }

  private publish(status: YuyiStatus): void {
    if (this.state.current === status) return
    this.state = { current: status }
    for (const listener of [...this.listeners]) listener()
  }
}
