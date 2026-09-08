/**
  * yuyi 通信能力接缝的服务定义（`ctx.yuyi`）：
  * 拥有进程唯一的 Hub WebSocket 连接、本地会话
  * roster、进活跃 dsh agent 的唤醒投递路由与等回复
  * 关联。连接字段经 `yuyi`
  * 用户设置命名空间（覆盖组合条目）；提交的变更
  * 即时重连。未配置的部署保持休眠——每个
  * 方法以 `YUYI_NOT_CONFIGURED` 失败，而非静默降级。
 *
  * 投递路由遵循 `dsh-tool-jobs` 的唤醒模式：命中 roster 中
  * 空闲 agent 的 notify 提交 follow-up 回合（唤醒它）；
  * 运行中的 agent 在下一个步边界收到 steer。agent 循环
  * 在认领消息时拥有持久 `user/message` 事件，因此本
  * 接缝绝不自行追加会话日志事件。
 * @module dsh-yuyi
 */
import type { Context } from '@deepseek-ai/cordis';
import { TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import z from '@deepseek-ai/schemastery';
import type { SessionId } from '@deepseek-ai/dsh-session/types';
import { type InboxEntry, type PeerDevice } from './core.ts';
import { YuyiError } from './types.ts';
import type { YuyiCollabSnapshot, YuyiConfig, YuyiReplyResult, YuyiSendRequest, YuyiSendResult, YuyiStatus } from './types.ts';
export { YuyiError };
export type { YuyiConfig, YuyiDeliveryRoute, YuyiErrorCode, YuyiReplyResult, YuyiRosterEntry, YuyiSendRequest, YuyiSendResult, YuyiStatus, } from './types.ts';
export { formatIncoming, deliverySummary } from './delivery.ts';
export type { InboxEntry, PeerDevice, YuyiMessage } from './core.ts';
declare module '@deepseek-ai/cordis' {
    interface Context {
        yuyi: YuyiRuntime;
    }
}
/**
  * yuyi 通信服务，注册为 `ctx.yuyi`（每进程一个
  * 实例；挂载在宿主平面）。hub 与
  * token 解析前服务休眠；{@link YuyiRuntime.status} 报告解析结果，每个
  * 触达 hub 的方法都以带稳定错误码的 {@link YuyiError} 失败。
 */
export default class YuyiRuntime extends TypertRemoteService {
    static Config: z<YuyiConfig>;
    static inject: string[];
    private settingsSource;
    private readonly roster;
    private readonly aliasToSession;
    private readonly pendingReplies;
    private client;
    private hubUrl;
    private tokenFound;
    private hubUnread;
    private lastStatusJson;
    private disposed;
    private connectionTail;
    private retryTimer;
    private readonly pendingResultWatches;
    private resolvedDevice;
    /**
      * @param ctx - 携带 agent 注册表的插件上下文。
      * @param config - 已校验的插件配置；兼任构造器所注册的
      * 用户设置节之下的 `base` 层，由本构造器注册。
     */
    constructor(ctx: Context, config: YuyiConfig);
    /**
      * 重算后的连接快照。
      * @returns 当前状态。
     */
    status(): YuyiStatus;
    /**
      * 把一个会话注册进本地 roster 并推送到 hub。别的
      * 若别的会话已持有该别名，抛
      * 持有别名。清理函数注销会话。
      * @param sessionId - 要注册的会话。
      * @param info - 展示给 peer、并用于别名寻址的 roster 事实。
      * @returns 注销会话的清理函数。
     */
    register(sessionId: SessionId, info: {
        readonly title: string;
        readonly directory: string;
        readonly name?: string;
    }): () => void;
    /**
      * 会话注册时使用的别名（如有）。
      * @param sessionId - 要查的会话。
      * @returns 别名；未注册或匿名会话为 undefined。
     */
    aliasOf(sessionId: SessionId): string | undefined;
    /**
      * 经 hub 发送一条消息并等待其投递 ack。
      * @param request - 消息请求；`from` 字段由 roster 填充。
      * @returns ack 的投递结果。
      * @throws {YuyiError} `YUYI_NOT_CONFIGURED`、`YUYI_NOT_CONNECTED` 或 `YUYI_SEND_REJECTED`。
     */
    send(request: YuyiSendRequest): Promise<YuyiSendResult>;
    /**
      * 任务记忆播种（0.1.4，v0.2.9 部署指令漂移事故）：用户发起、带 taskId 的
      * 出站消息落一条 request 事件到本机任务记录——让每条线程在出生时刻就被
      * 锚点系统看见。此前只有 yuyi_task_continue 会写记录，纯 yuyi_send 开的
      * 线程对本机锚定不可见，对端回信（taskId 在手、本机无记录）被 hub 的
      * roster 首窗改写兜底，实测漂进无关会话。两类豁免：
      * ① 自动机制（autoAcknowledge/watchTurnResult，contextHint 带 yuyi:auto
      *    前缀）——它们携带的是被唤醒窗口的身份，落记录会把锚点劫到无关窗口；
      * ② 无真实发件会话（fromSession 缺省，from.sessionID 解析为 'dsh'）——
      *    没有可归属的窗口，锚无可锚。
      * 写失败不阻断发送：记录是投递的辅助账本，不是通道本身。
      */
    private seedTaskRequest;
    /**
      * 出站账本登记（0.1.4，与 seedTaskRequest 同批事故）：记住「哪条出站消息
      * 是哪个窗口发的」，对端回信凭 replyTo 反查发件窗口——覆盖对端代铸新
      * taskId 的场景（无 taskId 发送时，任务锚点对该线程失明）。豁免口径与
      * seedTaskRequest 一致：自动机制不记（防锚点被无关窗口劫走）、无真实
      * 发件会话不记。失败静默（账本只影响锚定精度）。
      */
    private rememberSentMessage;
    /**
      * 发送一条 `expectReply` 消息并等待匹配的回信投递。
      * 等待在以下最先发生者处结束：回信到达、`replyTimeoutMs` 到期
      * （`YUYI_REPLY_TIMEOUT`），或 `signal` 中止（`YUYI_REPLY_ABORTED`）。
      * @param request - 消息请求；强制开启 `expectReply`。
      * @param signal - 等待的可选中止信号。
      * @returns 已发送消息与关联回信。
      * @throws {YuyiError} `send` 的各失败、`YUYI_REPLY_TIMEOUT` 或 `YUYI_REPLY_ABORTED`。
     */
    sendExpectingReply(request: YuyiSendRequest, signal?: AbortSignal): Promise<YuyiReplyResult>;
    /**
      * 读一个本地收件箱：某会话的停靠消息或设备收件箱。
      * @param target - 要读收件箱的会话，或 `'device'`。
      * @param peek - true 保留收件箱消息；false 清除。
      * @returns 收件箱条目，按最旧在前。
     */
    inboxRead(target: SessionId | 'device', peek?: boolean): InboxEntry[];
    /**
      * 列出当前经 hub 可达的设备与会话。
      * @returns 每个已连接设备一条，含其 roster 会话。
      * @throws {YuyiError} `YUYI_NOT_CONFIGURED` 或 `YUYI_NOT_CONNECTED`。
     */
    peers(): Promise<PeerDevice[]>;
    /**
      * 协同面板快照：hub 可达的远端 peer 加本机全部任务链视图，
      * 一次轮询一个往返。peers 尽力而为——hub 未连接或抖动时
      * 降级为空数组，任务链始终来自本机 `~/.yuyi/tasks/` 记录，
      * 因此未配置的部署仍能为面板提供本机视图。
      * @returns 协同快照。
     */
    collab(): Promise<YuyiCollabSnapshot>;
    /**
      * 拉取本连接 agent 的 hub 侧收件箱（至少一次；
      * 条目保留至 {@link YuyiRuntime.hubInboxAck} 清除）。
      * @returns 全部挂起的 hub 收件箱条目。
      * @throws {YuyiError} `YUYI_NOT_CONFIGURED` 或 `YUYI_NOT_CONNECTED`。
     */
    hubInboxDrain(): Promise<InboxEntry[]>;
    /**
      * 拉取一个任务的 hub 侧参与索引（参与者、轮数、
      * 轮数、时间窗）格式化供展示。需要 hub `task` 特性。
      * @param taskId - 要查的任务。
      * @returns 格式化索引；hub 无记录时为 undefined。
      * @throws {YuyiError} `YUYI_NOT_CONFIGURED` 或 `YUYI_NOT_CONNECTED`。
     */
    taskIndex(taskId: string): Promise<string | undefined>;
    /**
      * 确认已消费 hub 收件箱消息；hub 会删除它们。
      * @param ids - 已消费的消息 id。
      * @throws {YuyiError} `YUYI_NOT_CONFIGURED`、`YUYI_NOT_CONNECTED`，或 hub 拒收时的 `YUYI_SEND_REJECTED`。
     */
    hubInboxAck(ids: string[]): Promise<void>;
    private launchValue;
    private resolveToken;
    private resolveDevice;
    /**
      * dsh-remote 网关状态读取（address 上报契约 §1+§2，
      * docs/plans/2026-09-04-instance-address-report.md）：
      * 状态文件 `<DSH_HOME>/plugins/dsh-remote/gateway-state.json` 由 dsh-remote 原子写，
      * 本通道只透传不解释——读不到/未装 dsh-remote → undefined（心跳帧不加字段）；
      * enabled:false → `{ remoteGateway: { enabled: false } }`（区分「未安装」与「已停用」）。
      * 损坏容忍：任何读异常静默返回 undefined，绝不影响心跳。
      */
    private readRemoteGatewayState;
    /**
      * 按当前解析出的设置停止并重启 hub 连接，
      * 串行化在任何在途周期之后：设置变更落在
      * 仍等待令牌的 start 时，必须叫停该 start 的结果而非与之竞态。
      * 旧连接上未决的等回复等待者以
      * `YUYI_REPLY_ABORTED`。
      * @returns 替换连接尝试完成后的落定。
     */
    private reconnect;
    private start;
    private stop;
    private buildMessage;
    private dispatch;
    private requireConnected;
    private trace;
    private toRosterSession;
    private findByTarget;
    /**
      * 任务锚点会话：读本机任务记录（~/.yuyi/tasks/<taskId>.jsonl）推导该任务
      * 的归属会话。候选按优先级排列——最新 attach（显式「回这里」信号，用户
      * 接管线程的意志，不被隐式发言冲掉）、最后一条 request 的发起会话（0.1.4
      * 起纯 yuyi_send 也落 request，无 attach 线程的锚）、created owner 会话；
      * **活候选优先**（0.1.3：首候选死亡时不得直接放弃记录——线程里可能还有
      * 活着的发言窗口，如重启后重开的原会话——0.1.2 在此场景把消息兜底给了
      * roster 首个无关窗口，即 faf87be2 二次漂移）。候选全死时返回首候选：由
      * 调用方停靠进该会话收件箱，宁停靠不漂移。记录不存在/非法 taskId 返回
      * undefined。同步读小文件，投递路径可承受。
      */
    private taskAnchorSession;
    /**
      * 从 ctx.agents 动态挑一个 live 会话作为 wake 兜底目标。优先 idle 以避免
      * 与正在跑的 turn 抢上下文；其次任意 live；无 live 返回 undefined 让上层
      * 落 inbox。
      * 不写回 roster（避免污染显式 yuyi_register 状态），但保证返回 entry 与
      * 后续 wake 路径期待的形状一致（sessionId 可在 ctx.agents.get 命中）。
      */
    private pickAnyLiveSession;
    private readonly handleDeliver;
    private routeDelivery;
    /**
      * 向一个 entry 投递消息：mail 入箱；notify 走 agent.followup（idle）/ steer（running）。
      * entry.sessionId 不必在 roster 里显式注册——只要 ctx.agents.get 命中就行
      * （agentName 兜底 + 跨设备 * 兜底都可能返回这种 live-only entry）。
      * 唤醒后的 autoResult / autoAcknowledge 沿用既有逻辑。
      */
    private deliverToEntry;
    private autoAcknowledge;
    private watchTurnResult;
    private autoReport;
    private currentRosterSessions;
    /**
      * 启动时把当前进程已存在的 live agent 一次性纳入 roster。构造器订阅的
      * agent/created 只接未来事件，启动时已经创建的 opencode session 会漏——
      * 直接 list() 一遍补齐。
      */
    private syncRosterFromLiveAgents;
    private pushRoster;
    private emitDelivered;
    private emitStatus;
}
