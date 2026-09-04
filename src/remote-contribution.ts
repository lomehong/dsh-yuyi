/**
  * 本插件浏览器半经此挂载的 yuyi Remote 贡献
  * `ctx.remote.$mount`。从 harness typert 生成器
  * 为同一服务发出的产物；线路命名空间与 schema 不变，
  * 因此宿主 source-mode 发现原样应答这些端点。
  *
  * 手工维护注记：`yuyi/collab` 描述符为本仓库手工追加
  * （跟随 service.ts 的 `@Remote('collab')`）。若上游生成器
  * 重新生成本文件，需按 git 历史重放该描述符。
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
// 手工追加（见文件头注记）：跟随 service.ts 的 @Remote('collab')。
const _dsh_yuyi_yuyi_collab_result$schema = z.object({
  'peers': _dsh_yuyi_yuyi_peers_result$schema.readonly(),
  'tasks': z.array(z.object({
  'taskId': z.string(),
  'createdAt': z.number(),
  'owner': z.object({
  'agentId': z.string().optional(),
  'name': z.string().optional(),
  'device': z.string().optional(),
  'sessionID': z.string().optional(),
}).optional(),
  'round': z.number(),
  'lastRequestText': z.string(),
  'lastRequestAt': z.number().optional(),
  'lastReplyMsgId': z.string().optional(),
  'lastReplyFrom': z.object({
  'device': z.string().optional(),
  'name': z.string().optional(),
  'sessionID': z.string().optional(),
  'agentId': z.string().optional(),
  'ownerUsername': z.string().optional(),
}).optional(),
  'pendingTarget': z.string().optional(),
  'artifacts': z.array(z.object({
  'ref': z.string(),
  'note': z.string().optional(),
})),
  'summaries': z.array(z.object({
  'by': z.string(),
  'text': z.string(),
})),
  'latestAttachSession': z.string().optional(),
  'closed': z.boolean().optional(),
  'archived': z.boolean().optional(),
  'goal': z.object({
  'description': z.string(),
  'criteria': z.array(z.string()),
}).optional(),
  'verification': z.array(z.object({
  'criterionIndex': z.number(),
  'passed': z.boolean(),
  'evidence': z.string().optional(),
  'verifier': z.string().optional(),
})).optional(),
  'acceptanceComplete': z.boolean(),
  'phase': z.object({
  'name': z.string(),
  'note': z.string().optional(),
}).optional(),
  'assignee': z.object({
  'target': z.string(),
  'phase': z.string().optional(),
  'note': z.string().optional(),
}).optional(),
  'dependsOn': z.array(z.object({
  'taskId': z.string(),
  'note': z.string().optional(),
})),
  'incomplete': z.boolean(),
})).readonly(),
  'generatedAt': z.number().readonly(),
})
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
    // 手工追加（见文件头注记）：协同面板快照端点。
    {
      id: 'dsh-yuyi#yuyi/collab',
      service: 'yuyi',
      namespace: 'yuyi',
      method: 'collab',
      invocation: { kind: 'direct' },
      parameters: [
      ],
      result: {
        mode: 'strict',
        typeSymbol: 'dsh-yuyi/types#YuyiCollabSnapshot',
        schema: _dsh_yuyi_yuyi_collab_result$schema,
      },
      sourceLocation: {"file":"src/service.ts","line":345,"column":9},
    },
  ],
}

export default TYPERT_REMOTE
