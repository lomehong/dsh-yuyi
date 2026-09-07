/**
 * Hub WebSocket 客户端：负责与中继 Hub 的长连接、自动重连、请求-应答关联。
 */
import type { AckFrame, Capabilities, HubFeature, TraceEvent, InboxDataFrame, PeerDevice, TaskDataFrame, RosterSession, YuyiMessage } from "./protocol.ts";
export interface HubClientOptions {
    url: string;
    device: string;
    instanceID: string;
    token?: string;
    /** 形态标识，如 "opencode" | "mcp"，仅用于 Hub 侧指标分组 */
    agentKind?: string;
    /** 适配器自身版本（如 "yuyi-omp-2.1.0"），hello 上报供 Hub 排查旧插件连接 */
    adapterVersion?: string;
    /** 本适配器能力声明；wake=false 时 Hub 不再尝试唤醒，直接入箱 */
    capabilities?: Capabilities;
    /** 收到 deliver 帧时回调；返回 ack 结果（handlerSessionID = 实际承接会话，可选） */
    onDeliver: (message: YuyiMessage) => Promise<{
        ok: boolean;
        detail?: string;
        handlerSessionID?: string;
    }>;
    /** 心跳检测到未读邮件数 >0 时回调（适配器据此提醒用户查收 / 主动拉取） */
    onUnreadMail?: (count: number) => void;
    /** 心跳帧附加字段（如 dsh-remote 网关状态 remoteGateway 透传——address 上报契约 §2，
      *  通道只透传不解释）；每次心跳重取，返回 undefined 则不加字段 */
    heartbeatExtra?: () => Record<string, unknown> | undefined;
    /** 心跳间隔覆盖（毫秒）；供测试加速，缺省 30_000 */
    heartbeatIntervalMs?: number;
    log?: (msg: string) => void;
}
export declare class HubClient {
    private ws;
    private heartbeatTimer;
    private closed;
    private reconnectDelay;
    private reconnectTimer;
    private heartbeatFailStreak;
    private heartbeatOk;
    private heartbeatFail;
    private welcomeTimer;
    private pending;
    private roster;
    private opts;
    /**
     * 已完成握手（收到 welcome）。
     * 注意：WS 已连上但未收到 welcome 时不算 connected——此时尚不知道
     * Hub 支持哪些能力，发任何业务帧都是试错（顶层 §4.2）。
     */
    connected: boolean;
    /** 最近一次连接错误描述 */
    lastError: string | undefined;
    /** Hub 自报协议版本（welcome 缺省时为 1） */
    hubProtocolVersion: number;
    /** Hub 已启用能力；使用新帧前必须先查此表 */
    hubFeatures: HubFeature[];
    /** Hub 回带的本连接 agentId（v0.8 §3 预留，P1 不消费；老 Hub 不回带时 undefined） */
    agentId: string | undefined;
    /** Hub 回带的御符智能体名称（统一智能体名称寻址：权威身份；老 Hub 不回带时 undefined） */
    agentName: string | undefined;
    /** Hub 回带的所属 Owner 用户名（御符权威）——Agent 据此知道为谁工作 */
    ownerUsername: string | undefined;
    /** Hub 回带的所属 Owner userId（御符权威） */
    ownerUserId: string | undefined;
    /** Hub 回带的御符角色（avatar/worker/coder/未设置）——通信体系内分工标签 */
    role: string | undefined;
    constructor(opts: HubClientOptions);
    /** Hub 是否支持指定能力（能力协商优先于试错） */
    supports(feature: HubFeature): boolean;
    start(): void;
    stop(): void;
    /** 更新本实例会话名单并推送给 Hub */
    updateRoster(sessions: RosterSession[]): void;
    /**
     * 发送消息，等 Hub/对端 ack。
     *
     * 请求 id 与 message.id 刻意解耦（C8）：message.id 是**幂等键**，重发同一消息
     * 必须保持不变；而请求 id 是**关联键**，每次请求必须唯一，否则重试会与
     * pending 表中未完成的同 id 请求撞键。
     */
    send(message: YuyiMessage): Promise<AckFrame>;
    /** 查询在线设备与会话 */
    peers(): Promise<PeerDevice[]>;
    /** 拉取一批 Hub 侧收件箱消息（不删除，需后续 inboxAck 清读） */
    inboxFetch(recipient?: string, cursor?: number, limit?: number): Promise<InboxDataFrame>;
    /**
     * 按游标续拉至末尾，返回全部条目。
     * maxBatches 是兜底：Hub 侧容量上限远小于它，触顶说明游标推进有问题，
     * 此时宁可少拉一部分也不能在此处死循环。
     */
    inboxDrain(recipient?: string, maxBatches?: number): Promise<InboxDataFrame["entries"]>;
    /**
     * 只问 Hub 侧未读数，不取内容、不标记已下发（`limit=0`）。供空闲提醒这类
     * 高频探测使用。
     *
     * 返回 `undefined` 表示**这一来源当前不可用**（未连接 / Hub 不支持 inbox /
     * 查询失败）。调用方不得把它当成 0：否则「没有未读」是个假结论。
     * 计数只是辅助信息，故失败在此吸掉而不向上抛。
     */
    inboxCount(recipient?: string): Promise<number | undefined>;
    /**
     * 任务记忆层 P3：按 taskId 查 Hub 轻量索引（参与者/消息数/时间窗）。
     * 返回 undefined = 无投递记录或无权限（Hub 对两者统一回空，防枚举探测）。
     * 索引不含正文——跨设备可见性只到「参与链」，全文仍只在端侧任务记录。
     */
    taskFetch(taskId: string): Promise<TaskDataFrame["task"] | undefined>;
    /**
     * 消息生命周期事件上报（适配器埋点：注入会话 / 已发回信）。
     * best-effort：未连接或 Hub 不支持 trace 帧时静默跳过，失败只记日志，
     * 绝不抛给调用方——可观测性不能影响投递主链路。
     */
    trace(msgId: string, event: TraceEvent, detail?: string): void;
    /** 清读：确认已消费这批 message.id，Hub 据此删除 */
    inboxAck(ids: string[], recipient?: string): Promise<AckFrame>;
    private connect;
    /** 应用层心跳：每 30s 发 inbox/fetch {limit:0}，兼做保活（防 NAT 断空闲 TCP）
     *  + 未读邮件检测（remaining >0 触发 onUnreadMail 回调，适配器提醒用户查收）。
     *  + 心跳统计：成功/失败计数，每 N 次上报一次 heartbeat/stats（严格失败率度量）。 */
    private startHeartbeat;
    /** 每 HEARTBEAT_STATS_INTERVAL 次心跳上报一次 ok/fail 增量（best-effort，失败只记日志） */
    private maybeReportHeartbeatStats;
    private scheduleReconnect;
    private sendFrame;
    private request;
    private handleFrame;
    private failAllPending;
}
