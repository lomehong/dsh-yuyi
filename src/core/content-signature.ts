/**
 * 内容签名（端到端完整性，方案 1 激活）
 *
 * 御符 sign_key 模型：Agent 持 sign_secret（HMAC-SHA256 密钥），对消息内容做
 * 确定性拼接后签名；接收方调御符 /api/v1/auth/agent/verify-signature 验签。
 *
 * 签名数据（确定性拼接，防歧义）：
  * data = text + "\x00" + (taskId ?? "") + "\x00" + String(time)
 *
 * 字段（YuyiMessage）：
  * contentSignature —— HMAC-SHA256 十六进制
 *   signatureKeyId    — 御符 sign_key 表定位
 *
 *  Hub 只透传不校验；接收方验签。缺省 = 未签名（老 Agent 兼容）。
 */
import { createHmac } from "node:crypto"

/** 计算签名数据串（确定性拼接，与御符验签侧一致——验签时御符只收 data 串，
 *  拼接由发送方完成，御符按收到的 data 原样 HMAC） */
export function signatureData(text: string, taskId: string | undefined, time: number): string {
  return `${text}\x00${taskId ?? ""}\x00${String(time)}`
}

/**
 * Agent 侧签名：用御符签发的 sign_secret 对消息内容做 HMAC-SHA256。
 * sign_secret 是 32 字节随机值的 hex 编码（64 字符）——HMAC 密钥必须是
 * hex-decode 后的原始 32 字节，不是 hex 字符串本身（御符 VerifySignature
 * 同契约：hex.DecodeString(secret) → hmac.New）。
 * 返回 hex 签名（填入 contentSignature），配合 signatureKeyId 使用。
 */
export function signContent(signSecret: string, text: string, taskId: string | undefined, time: number): string {
  const keyBytes = Buffer.from(signSecret, "hex")
  const mac = createHmac("sha256", keyBytes)
  mac.update(signatureData(text, taskId, time))
  return mac.digest("hex")
}

/**
 * 端到端验签（接收方）：调御符 verify-signature API。
 * @param yufuVerifyURL 御符网关地址（如 http://172.20.10.91:18085）
 * @returns { valid, agentId?, reason? }——valid=false 时 reason 说明（签名不匹配/密钥吊销/不存在）
 */
export async function verifyContentSignature(
  yufuVerifyURL: string,
  signKeyId: string,
  data: string,
  signature: string,
  timeoutMs = 5000,
): Promise<{ valid: boolean; agentId?: string; reason?: string }> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeoutMs)
  let res: any
  try {
    res = await fetch(`${yufuVerifyURL.replace(/\/$/, "")}/api/v1/auth/agent/verify-signature`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ sign_key_id: signKeyId, data, signature }),
      signal: ctrl.signal,
    })
  } catch (err) {
    return { valid: false, reason: `verify request failed: ${String(err)}` }
  } finally {
    clearTimeout(timer)
  }
  let body: any
  try {
    body = await res.json()
  } catch {
    return { valid: false, reason: `yufu returned unparseable body (http ${res.status})` }
  }
  // 网关错误体 { code, message } 无 valid；成功体 { success, valid, agent_id, reason }
  if (body?.valid === true) return { valid: true, agentId: String(body.agent_id ?? "") }
  if (body?.valid === false) return { valid: false, reason: body.reason ?? "signature mismatch" }
  return { valid: false, reason: body?.message ?? `unexpected response (http ${res.status})` }
}
