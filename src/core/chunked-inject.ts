/**
 * 御驿 Yuyi · 长文本分段注入工具
 *
 * 问题记录 #1.3：长消息（命令输出拼接等）经宿主 steer 注入时可能被单次调用截断。
 * 本工具把长文本按固定块大小分段，逐段调用注入函数，保证消息完整性。
 */
export const INJECT_CHUNK_SIZE = 3000 // 单段字符数（约 6KB UTF-8，低于常见 steer 限制）

/**
 * 分段注入：text 超过 chunkSize 时分段依次调用 inject(chunk)。
 * 返回注入成功的段数（0 = text 为空）。
 */
export async function injectChunked(
  text: string,
  inject: (chunk: string) => Promise<unknown> | void,
  chunkSize: number = INJECT_CHUNK_SIZE,
): Promise<number> {
  const content = text ?? ""
  if (content.length === 0) return 0
  let count = 0
  for (let i = 0; i < content.length; i += chunkSize) {
    const chunk = content.slice(i, i + chunkSize)
    await inject(chunk)
    count++
  }
  return count
}
