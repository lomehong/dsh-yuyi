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

/**
 * 兼容 shim：dsh-yuyi 远端贡献用 zod schema 直接作为 strict codec 暴露给
 * typert gateway。新版 runtime 的 validateCodec 要求
 * `typeof codec.schema.parse === 'function'`；zod v3/v4 的部分构造在跨
 * 进程/包边界（比如该包独立的 zod v4 与 host runtime 期望的 codec 形状）
 * 暴露的 `parse` 在 minify 后不可直接被 typeof 判定为 function（原型链被
 * 序列化/包装）。此函数保证每个 strict codec 的 schema 都带可调用的
 * parse（若 schema 自身没有 parse 但有 safeParse 则包一层；最终失败时
 * 抛错显式失败而不静默把整个 $mount 干掉）。
 */
function ensureParse<T>(schema: T): T {
  if (schema === null || typeof schema !== 'object') return schema
  const s = schema as unknown as { parse?: unknown; safeParse?: unknown; _parse?: unknown }
  if (typeof s.parse === 'function') return schema
  if (typeof s.safeParse === 'function') {
    const orig = s as unknown as { safeParse: (v: unknown) => { data: unknown } }
    const wrapped = Object.create(null) as { parse: (v: unknown) => unknown; _wrappedFrom: string }
    wrapped.parse = (v: unknown) => orig.safeParse(v).data
    wrapped._wrappedFrom = 'safeParse'
    return wrapped as unknown as T
  }
  if (typeof s._parse === 'function') {
    const orig = s as unknown as { _parse: (v: unknown) => unknown }
    const wrapped = Object.create(null) as { parse: (v: unknown) => unknown; _wrappedFrom: string }
    wrapped.parse = (v: unknown) => orig._parse(v)
    wrapped._wrappedFrom = '_parse'
    return wrapped as unknown as T
  }
  throw new Error('typert: schema exposes neither parse() nor safeParse() nor _parse() — cannot satisfy strict codec contract')
}

// 注入前对所有 codec 的 schema 做一次兼容处理（保持 descriptors 数组本身浅冻结，
// 避免对 tsdown / 上游生成器的强契约假设做激进变更）。
for (const descriptor of TYPERT_REMOTE.descriptors) {
  if (descriptor.result && descriptor.result.codec) {
    descriptor.result.codec.schema = ensureParse(descriptor.result.codec.schema) as never
  }
  if (Array.isArray(descriptor.parameters)) {
    for (const parameter of descriptor.parameters) {
      if (parameter && parameter.codec) {
        parameter.codec.schema = ensureParse(parameter.codec.schema) as never
      }
    }
  }
  const invocation = (descriptor as { invocation?: { codec?: { schema?: unknown } } }).invocation
  if (invocation && invocation.codec) {
    invocation.codec.schema = ensureParse(invocation.codec.schema) as never
  }
}

export default TYPERT_REMOTE
