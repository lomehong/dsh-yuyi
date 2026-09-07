/**
 * 御驿 Yuyi 通信协议
 *
 * 适配器(客户端) <--WebSocket--> Hub(中继) 之间交换 JSON 帧。
 * 每帧一条 JSON 文本消息。
 */
/** 当前协议版本。缺省（旧客户端/旧 Hub）一律视为 1 */
export const PROTOCOL_VERSION = 2;
/** 单次 inbox/fetch 返回条数上限（顶层 §5.3「批次约束」），超出靠游标续拉 */
export const INBOX_FETCH_LIMIT = 50;
/** 收件人主键：Phase 2 起为 `agent_id:name`（御符签发的 agentId，强信任）。
 *  agentId 为 UUID（字符集 [0-9a-f-]，不含 ':'），故「首个 ':' 前为主体、之后为别名」
 *  的解析规则继续成立。必须跨进程重启稳定，绝不得含 instanceID（顶层 §5.3「收件人主键」）。 */
export function recipientID(agentId, name) {
    return `${agentId}:${name.toLowerCase()}`;
}
/** 剔除客户端不得自报的 Hub 权威字段（顶层附录 B；挑战审视 Y-4 扩至 from 背签字段） */
export function stripHubAuthoritativeFields(message) {
    const needStripFrom = message.from.agentId !== undefined || message.from.ownerUsername !== undefined;
    if (message.policyBypass === undefined && !needStripFrom)
        return message;
    const { policyBypass: _dropped, ...rest } = message;
    if (!needStripFrom)
        return rest;
    const { agentId: _a, ownerUsername: _o, ...fromRest } = rest.from;
    return { ...rest, from: fromRest };
}
// ---------- 工具函数 ----------
/**
 * 解析地址字符串（统一智能体名称寻址）：
 *   "*"                     -> 广播
 *   "agent_name"            -> 本 owner 裸名（同 owner 唯一）
 *   "device:target"         -> 指定设备上的会话（name 或 sessionID）
 *   "owner/device:target"   -> 跨 owner 完整寻址（owner 前缀可选）
 *   "owner/target"          -> 跨 owner 裸名
 */
export function parseAddress(input) {
    const trimmed = input.trim();
    if (trimmed === "*")
        return { target: "*" };
    let rest = trimmed;
    let owner;
    // owner/ 前缀（跨 owner 消歧，agent_name 同 owner 唯一已够定位）
    const slashIdx = rest.indexOf("/");
    if (slashIdx > 0) {
        owner = rest.slice(0, slashIdx).trim();
        rest = rest.slice(slashIdx + 1).trim();
    }
    const idx = rest.indexOf(":");
    if (idx > 0) {
        return { owner, device: rest.slice(0, idx).trim(), target: rest.slice(idx + 1).trim() };
    }
    return { owner, target: rest };
}
/** 判断 roster 中的会话是否匹配 target（name 或 sessionID，name 不区分大小写） */
export function matchSession(session, target) {
    if (session.sessionID === target)
        return true;
    if (session.name && session.name.toLowerCase() === target.toLowerCase())
        return true;
    return false;
}
/** 生成消息/请求 ID */
export function newID(prefix = "msg") {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}
/** 安全解析一条 JSON 帧 */
export function parseFrame(raw) {
    if (typeof raw !== "string")
        return undefined;
    try {
        const parsed = JSON.parse(raw);
        if (typeof parsed === "object" && parsed !== null && typeof parsed.type === "string") {
            return parsed;
        }
    }
    catch {
        // 忽略非法帧
    }
    return undefined;
}
