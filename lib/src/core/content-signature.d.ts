/** 计算签名数据串（确定性拼接，与御符验签侧一致——验签时御符只收 data 串，
 *  拼接由发送方完成，御符按收到的 data 原样 HMAC） */
export declare function signatureData(text: string, taskId: string | undefined, time: number): string;
/**
 * Agent 侧签名：用御符签发的 sign_secret 对消息内容做 HMAC-SHA256。
 * sign_secret 是 32 字节随机值的 hex 编码（64 字符）——HMAC 密钥必须是
 * hex-decode 后的原始 32 字节，不是 hex 字符串本身（御符 VerifySignature
 * 同契约：hex.DecodeString(secret) → hmac.New）。
 * 返回 hex 签名（填入 contentSignature），配合 signatureKeyId 使用。
 */
export declare function signContent(signSecret: string, text: string, taskId: string | undefined, time: number): string;
/**
 * 端到端验签（接收方）：调御符 verify-signature API。
 * @param yufuVerifyURL 御符网关地址（如 http://172.20.10.91:18085）
 * @returns { valid, agentId?, reason? }——valid=false 时 reason 说明（签名不匹配/密钥吊销/不存在）
 */
export declare function verifyContentSignature(yufuVerifyURL: string, signKeyId: string, data: string, signature: string, timeoutMs?: number): Promise<{
    valid: boolean;
    agentId?: string;
    reason?: string;
}>;
