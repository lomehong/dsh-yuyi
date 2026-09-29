/**
  * 模型可用的 yuyi 工具（`yuyi_status`、`yuyi_register`、`yuyi_peers`、
  * `yuyi_send`、`yuyi_inbox` 与十三个 `yuyi_task_*` 生命周期工具）
  * 构建在 `ctx.yuyi` 上。本包拥有 schema、校验、prompt
  * 指引与展示；连接接缝拥有可达性。未配置时
  * 已注册工具在接缝休眠期间保持可见，执行时以
  * 接缝的结构化 `YuyiError` 错误码失败。
 * @module dsh-yuyi/tools
 */
import type { Context } from '@deepseek-ai/cordis';
import type YuyiRuntime from '../service.ts';
export { renderStatus, renderPeers, renderInbox } from './messaging.ts';
export type { InboxRow, InboxValue, PeersValue, SendValue, StatusSessionRow, StatusValue, } from './messaging.ts';
export type { TaskContinueValue, TaskEventValue, TaskShowValue } from './tasks.ts';
export { outcomeOf } from './task-record.ts';
export type { LocalIdentity, TaskRecordOutcome } from './task-record.ts';
export declare const name = "tool-yuyi";
export declare const inject: string[];
/**
  * 注册十八个 yuyi 工具，以及让其在
  * 目录契约中的使用保持指引。
  * @param ctx - 携带工具注册表、yuyi 服务与系统提示服务的插件上下文。
 */
/**
  * 注册十八个 yuyi 工具，以及让其在
  * 目录契约中的使用保持指引。
  * @param ctx - 携带工具注册表、yuyi 服务与系统提示服务的插件上下文。
  * @param yuyiOverride - yuyi 运行时实例：全模式注册路径（宿主插件加载即注册，
  *  不依赖预设行挂载）由 YuyiRuntime 直接传入自身；缺省回落 `ctx.yuyi`
  *  （预设行挂载路径兼容）。
 */
export declare function registerYuyiTools(ctx: Context, yuyiOverride?: YuyiRuntime): void;
export declare function apply(ctx: Context): void;
