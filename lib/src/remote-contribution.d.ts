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
import { z } from 'zod';
export declare const TYPERT_REMOTE: {
    package: string;
    descriptors: ({
        id: string;
        service: string;
        namespace: string;
        method: string;
        implementation: string;
        invocation: {
            kind: string;
        };
        parameters: ({
            name: string;
            wire: string;
            source: string;
            codec: {
                mode: string;
                typeSymbol: string;
                schema: z.ZodUnion<readonly [z.ZodIntersection<z.ZodString, z.ZodUnknown>, z.ZodLiteral<"device">]>;
            };
            acceptsUndefined?: undefined;
        } | {
            name: string;
            wire: string;
            source: string;
            acceptsUndefined: boolean;
            codec: {
                mode: string;
                typeSymbol: string;
                schema: z.ZodUnion<readonly [z.ZodUndefined, z.ZodLiteral<false>, z.ZodLiteral<true>]>;
            };
        })[];
        result: {
            mode: string;
            typeSymbol: string;
            schema: z.ZodArray<z.ZodObject<{
                message: z.ZodObject<{
                    id: z.ZodString;
                    mode: z.ZodUnion<readonly [z.ZodLiteral<"notify">, z.ZodLiteral<"mail">]>;
                    text: z.ZodString;
                    from: z.ZodObject<{
                        device: z.ZodString;
                        sessionID: z.ZodString;
                        name: z.ZodOptional<z.ZodString>;
                        agentId: z.ZodOptional<z.ZodString>;
                        ownerUsername: z.ZodOptional<z.ZodString>;
                        role: z.ZodOptional<z.ZodString>;
                    }, z.core.$strip>;
                    to: z.ZodObject<{
                        owner: z.ZodOptional<z.ZodString>;
                        device: z.ZodOptional<z.ZodString>;
                        target: z.ZodString;
                    }, z.core.$strip>;
                    time: z.ZodNumber;
                    replyTo: z.ZodOptional<z.ZodString>;
                    expectReply: z.ZodOptional<z.ZodBoolean>;
                    taskId: z.ZodOptional<z.ZodString>;
                    traceId: z.ZodOptional<z.ZodString>;
                    hopCount: z.ZodOptional<z.ZodNumber>;
                    classification: z.ZodOptional<z.ZodString>;
                    contextHint: z.ZodOptional<z.ZodString>;
                    policyBypass: z.ZodOptional<z.ZodBoolean>;
                    contentSignature: z.ZodOptional<z.ZodString>;
                    signatureKeyId: z.ZodOptional<z.ZodString>;
                }, z.core.$strip>;
                receivedAt: z.ZodNumber;
            }, z.core.$strip>>;
        };
        sourceLocation: {
            file: string;
            line: number;
            column: number;
        };
    } | {
        id: string;
        service: string;
        namespace: string;
        method: string;
        invocation: {
            kind: string;
        };
        parameters: never[];
        result: {
            mode: string;
            typeSymbol: string;
            schema: z.ZodArray<z.ZodObject<{
                device: z.ZodString;
                instanceID: z.ZodString;
                sessions: z.ZodArray<z.ZodObject<{
                    sessionID: z.ZodString;
                    title: z.ZodString;
                    directory: z.ZodString;
                    name: z.ZodOptional<z.ZodString>;
                    capabilities: z.ZodOptional<z.ZodObject<{
                        sandbox: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"full">, z.ZodLiteral<"restricted">, z.ZodLiteral<"none">]>>;
                        network: z.ZodOptional<z.ZodBoolean>;
                        wake: z.ZodOptional<z.ZodBoolean>;
                    }, z.core.$strip>>;
                }, z.core.$strip>>;
                agentId: z.ZodOptional<z.ZodString>;
                role: z.ZodOptional<z.ZodString>;
                lastActiveAt: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>>;
        };
        sourceLocation: {
            file: string;
            line: number;
            column: number;
        };
        implementation?: undefined;
    } | {
        id: string;
        service: string;
        namespace: string;
        method: string;
        invocation: {
            kind: string;
        };
        parameters: never[];
        result: {
            mode: string;
            typeSymbol: string;
            schema: z.ZodObject<{
                configured: z.ZodReadonly<z.ZodBoolean>;
                connected: z.ZodReadonly<z.ZodBoolean>;
                hub: z.ZodReadonly<z.ZodString>;
                device: z.ZodReadonly<z.ZodString>;
                agentId: z.ZodOptional<z.ZodReadonly<z.ZodString>>;
                agentName: z.ZodOptional<z.ZodReadonly<z.ZodString>>;
                ownerUsername: z.ZodOptional<z.ZodReadonly<z.ZodString>>;
                role: z.ZodOptional<z.ZodReadonly<z.ZodString>>;
                lastError: z.ZodOptional<z.ZodReadonly<z.ZodString>>;
                hubUnread: z.ZodOptional<z.ZodReadonly<z.ZodNumber>>;
                deviceUnread: z.ZodReadonly<z.ZodNumber>;
                sessions: z.ZodReadonly<z.ZodArray<z.ZodObject<{
                    sessionId: z.ZodReadonly<z.ZodIntersection<z.ZodString, z.ZodUnknown>>;
                    title: z.ZodReadonly<z.ZodString>;
                    directory: z.ZodReadonly<z.ZodString>;
                    name: z.ZodOptional<z.ZodReadonly<z.ZodString>>;
                }, z.core.$strip>>>;
            }, z.core.$strip>;
        };
        sourceLocation: {
            file: string;
            line: number;
            column: number;
        };
        implementation?: undefined;
    } | {
        id: string;
        service: string;
        namespace: string;
        method: string;
        invocation: {
            kind: string;
        };
        parameters: never[];
        result: {
            mode: string;
            typeSymbol: string;
            schema: z.ZodObject<{
                peers: z.ZodReadonly<z.ZodArray<z.ZodObject<{
                    device: z.ZodString;
                    instanceID: z.ZodString;
                    sessions: z.ZodArray<z.ZodObject<{
                        sessionID: z.ZodString;
                        title: z.ZodString;
                        directory: z.ZodString;
                        name: z.ZodOptional<z.ZodString>;
                        capabilities: z.ZodOptional<z.ZodObject<{
                            sandbox: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"full">, z.ZodLiteral<"restricted">, z.ZodLiteral<"none">]>>;
                            network: z.ZodOptional<z.ZodBoolean>;
                            wake: z.ZodOptional<z.ZodBoolean>;
                        }, z.core.$strip>>;
                    }, z.core.$strip>>;
                    agentId: z.ZodOptional<z.ZodString>;
                    role: z.ZodOptional<z.ZodString>;
                    lastActiveAt: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strip>>>;
                tasks: z.ZodReadonly<z.ZodArray<z.ZodObject<{
                    taskId: z.ZodString;
                    createdAt: z.ZodNumber;
                    owner: z.ZodOptional<z.ZodObject<{
                        agentId: z.ZodOptional<z.ZodString>;
                        name: z.ZodOptional<z.ZodString>;
                        device: z.ZodOptional<z.ZodString>;
                        sessionID: z.ZodOptional<z.ZodString>;
                    }, z.core.$strip>>;
                    round: z.ZodNumber;
                    lastRequestText: z.ZodString;
                    lastRequestAt: z.ZodOptional<z.ZodNumber>;
                    lastReplyMsgId: z.ZodOptional<z.ZodString>;
                    lastReplyFrom: z.ZodOptional<z.ZodObject<{
                        device: z.ZodOptional<z.ZodString>;
                        name: z.ZodOptional<z.ZodString>;
                        sessionID: z.ZodOptional<z.ZodString>;
                        agentId: z.ZodOptional<z.ZodString>;
                        ownerUsername: z.ZodOptional<z.ZodString>;
                    }, z.core.$strip>>;
                    pendingTarget: z.ZodOptional<z.ZodString>;
                    artifacts: z.ZodArray<z.ZodObject<{
                        ref: z.ZodString;
                        note: z.ZodOptional<z.ZodString>;
                    }, z.core.$strip>>;
                    summaries: z.ZodArray<z.ZodObject<{
                        by: z.ZodString;
                        text: z.ZodString;
                    }, z.core.$strip>>;
                    latestAttachSession: z.ZodOptional<z.ZodString>;
                    closed: z.ZodOptional<z.ZodBoolean>;
                    archived: z.ZodOptional<z.ZodBoolean>;
                    goal: z.ZodOptional<z.ZodObject<{
                        description: z.ZodString;
                        criteria: z.ZodArray<z.ZodString>;
                    }, z.core.$strip>>;
                    verification: z.ZodOptional<z.ZodArray<z.ZodObject<{
                        criterionIndex: z.ZodNumber;
                        passed: z.ZodBoolean;
                        evidence: z.ZodOptional<z.ZodString>;
                        verifier: z.ZodOptional<z.ZodString>;
                    }, z.core.$strip>>>;
                    acceptanceComplete: z.ZodBoolean;
                    phase: z.ZodOptional<z.ZodObject<{
                        name: z.ZodString;
                        note: z.ZodOptional<z.ZodString>;
                    }, z.core.$strip>>;
                    assignee: z.ZodOptional<z.ZodObject<{
                        target: z.ZodString;
                        phase: z.ZodOptional<z.ZodString>;
                        note: z.ZodOptional<z.ZodString>;
                    }, z.core.$strip>>;
                    dependsOn: z.ZodArray<z.ZodObject<{
                        taskId: z.ZodString;
                        note: z.ZodOptional<z.ZodString>;
                    }, z.core.$strip>>;
                    incomplete: z.ZodBoolean;
                }, z.core.$strip>>>;
                generatedAt: z.ZodReadonly<z.ZodNumber>;
            }, z.core.$strip>;
        };
        sourceLocation: {
            file: string;
            line: number;
            column: number;
        };
        implementation?: undefined;
    })[];
};
export default TYPERT_REMOTE;
