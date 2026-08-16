/**
 * dsh-yuyi host plugin entry: re-exports the yuyi communication seam
 * (`ctx.yuyi`) so a profile row `name: dsh-yuyi` mounts the service. The
 * seventeen model-facing tools live under `./tools` for agent-preset rows.
 * @module dsh-yuyi
 */

export { default } from './src/service.ts'
export { default as YuyiRuntime } from './src/service.ts'
export { YuyiError } from './src/types.ts'
export type {
  YuyiConfig, YuyiDeliveryRoute, YuyiErrorCode, YuyiReplyResult, YuyiRosterEntry,
  YuyiSendRequest, YuyiSendResult, YuyiStatus,
} from './src/types.ts'
export { formatIncoming, deliverySummary } from './src/delivery.ts'
export type { InboxEntry, PeerDevice, YuyiMessage } from './src/core.ts'
