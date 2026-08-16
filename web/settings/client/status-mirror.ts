/**
 * Connection-status mirror: one snapshot store fed by the `yuyi/status`
 * forwarded event and seeded by one Remote status read.
 */
import { createSnapshotStore, type SnapshotStore } from '@deepseek-ai/dsh-client-runtime/client'
import type { YuyiStatus } from '../../src/types.ts'

/** Mirror state: the last observed status, undefined until the first read or event. */
export interface YuyiStatusState {
  current: YuyiStatus | undefined
}

/** Event payload of the forwarded `yuyi/status` event. */
export interface YuyiStatusEvent {
  status: YuyiStatus
}

/**
 * Mirror one host connection status into a subscribable store.
 */
export class YuyiStatusMirror {
  /** The store the section's hook consumes. */
  readonly store: SnapshotStore<YuyiStatusState>

  /**
   * @param readStatus - one Remote status read seeding the store.
   * @param onStatusChange - subscription to the forwarded `yuyi/status` event.
   */
  constructor(
    private readonly readStatus: () => Promise<YuyiStatus>,
    private readonly onStatusChange: (listener: (event: YuyiStatusEvent) => void) => () => void,
  ) {
    this.store = createSnapshotStore<YuyiStatusState>({ current: undefined })
  }

  /**
   * Subscribe to status events and seed the store with one read.
   * @returns the disposer removing the subscription.
   */
  start(): () => void {
    const off = this.onStatusChange((event) => {
      this.store.update((draft) => { draft.current = event.status })
    })
    void this.readStatus().then(
      (status) => { this.store.update((draft) => { draft.current = status }) },
      // A failed Remote read leaves the mirror at its last snapshot; the
      // forwarded event refills it, so the rejection carries no signal of
      // its own.
      () => {},
    )
    return off
  }
}
