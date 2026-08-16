/**
 * The yuyi Remote contribution this plugin's browser half mounts through
 * `ctx.remote.$mount`. Ported from the artifact the harness's typert generator
 * emitted for the same service; the wire namespace and schemas are unchanged,
 * so the Host's source-mode discovery answers these endpoints as-is.
 */
import { z } from 'zod'

const _dsh_yuyi_yuyi_inbox_parameter_0$schema = z.union([z.intersection(z.string(), z.unknown()), z.literal("device")])
const _dsh_yuyi_yuyi_inbox_parameter_1$schema = z.union([z.undefined(), z.literal(false), z.literal(true)])
const _dsh_yuyi_yuyi_inbox_result$schema = z.array(z.object({
  'message': z.object({
  'id': z.string(),
  'mode': z.union([z.literal("notify"), z.literal("mail")]),
  'text': z.string(),
  'from': z.object({
  'device': z.string(),
  'sessionID': z.string(),
  'name': z.string().optional(),
  'agentId': z.string().optional(),
  'ownerUsername': z.string().optional(),
  'role': z.string().optional(),
}),
  'to': z.object({
  'owner': z.string().optional(),
  'device': z.string().optional(),
  'target': z.string(),
}),
  'time': z.number(),
  'replyTo': z.string().optional(),
  'expectReply': z.boolean().optional(),
  'taskId': z.string().optional(),
  'traceId': z.string().optional(),
  'hopCount': z.number().optional(),
  'classification': z.string().optional(),
  'contextHint': z.string().optional(),
  'policyBypass': z.boolean().optional(),
  'contentSignature': z.string().optional(),
  'signatureKeyId': z.string().optional(),
}),
  'receivedAt': z.number(),
}))
const _dsh_yuyi_yuyi_peers_result$schema = z.array(z.object({
  'device': z.string(),
  'instanceID': z.string(),
  'sessions': z.array(z.object({
  'sessionID': z.string(),
  'title': z.string(),
  'directory': z.string(),
  'name': z.string().optional(),
  'capabilities': z.object({
  'sandbox': z.union([z.literal("full"), z.literal("restricted"), z.literal("none")]).optional(),
  'network': z.boolean().optional(),
  'wake': z.boolean().optional(),
}).optional(),
})),
  'agentId': z.string().optional(),
  'role': z.string().optional(),
  'lastActiveAt': z.number().optional(),
}))
const _dsh_yuyi_yuyi_status_result$schema = z.object({
  'configured': z.boolean().readonly(),
  'connected': z.boolean().readonly(),
  'hub': z.string().readonly(),
  'device': z.string().readonly(),
  'agentId': z.string().readonly().optional(),
  'agentName': z.string().readonly().optional(),
  'ownerUsername': z.string().readonly().optional(),
  'role': z.string().readonly().optional(),
  'lastError': z.string().readonly().optional(),
  'hubUnread': z.number().readonly().optional(),
  'deviceUnread': z.number().readonly(),
  'sessions': z.array(z.object({
  'sessionId': z.intersection(z.string(), z.unknown()).readonly(),
  'title': z.string().readonly(),
  'directory': z.string().readonly(),
  'name': z.string().readonly().optional(),
})).readonly(),
})

export const TYPERT_REMOTE = {
  package: 'dsh-yuyi',
  descriptors: [
    {
      id: 'dsh-yuyi#yuyi/inbox',
      service: 'yuyi',
      namespace: 'yuyi',
      method: 'inbox',
      implementation: 'inboxRead',
      invocation: { kind: 'direct' },
      parameters: [
        {
          name: 'target',
          wire: 'target',
          source: 'json',
          codec: {
            mode: 'strict',
            typeSymbol: 'dsh-yuyi#yuyi/inbox:target',
            schema: _dsh_yuyi_yuyi_inbox_parameter_0$schema,
          },
        },
        {
          name: 'peek',
          wire: 'peek',
          source: 'json',
          acceptsUndefined: true,
          codec: {
            mode: 'strict',
            typeSymbol: 'dsh-yuyi#yuyi/inbox:peek',
            schema: _dsh_yuyi_yuyi_inbox_parameter_1$schema,
          },
        },
      ],
      result: {
        mode: 'strict',
        typeSymbol: 'dsh-yuyi#yuyi/inbox:result',
        schema: _dsh_yuyi_yuyi_inbox_result$schema,
      },
      sourceLocation: {"file":"packages/yuyi/yuyi/src/index.ts","line":288,"column":3},
    },
    {
      id: 'dsh-yuyi#yuyi/peers',
      service: 'yuyi',
      namespace: 'yuyi',
      method: 'peers',
      invocation: { kind: 'direct' },
      parameters: [
      ],
      result: {
        mode: 'strict',
        typeSymbol: 'dsh-yuyi#yuyi/peers:result',
        schema: _dsh_yuyi_yuyi_peers_result$schema,
      },
      sourceLocation: {"file":"packages/yuyi/yuyi/src/index.ts","line":298,"column":9},
    },
    {
      id: 'dsh-yuyi#yuyi/status',
      service: 'yuyi',
      namespace: 'yuyi',
      method: 'status',
      invocation: { kind: 'direct' },
      parameters: [
      ],
      result: {
        mode: 'strict',
        typeSymbol: 'dsh-yuyi/types#YuyiStatus',
        schema: _dsh_yuyi_yuyi_status_result$schema,
      },
      sourceLocation: {"file":"packages/yuyi/yuyi/src/index.ts","line":144,"column":3},
    },
  ],
}

export default TYPERT_REMOTE
