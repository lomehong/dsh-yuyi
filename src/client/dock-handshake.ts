/**
 * 套件状态坞握手（dsh-twin suite-dock 契约，客户端侧感知端）。
 *
 * 常量为 dsh-twin/src/client/suite-dock-model.ts 的拷贝（宪章 §3.1：套件包
 * 之间零运行时共享）。语义：dock 挂载期写 localStorage 心跳 `dsh-suite-dock`；
 * 本侧见新鲜心跳 → 右缘拉手让位（dock 的御驿行代为入口，经
 * `suite-dock:yuyi-open` 事件回开本面板）；dock 缺席 → 拉手自动回归。
 */
import { useEffect, useState } from 'react'

export const DOCK_STORAGE_KEY = 'dsh-suite-dock'
export const DOCK_FRESH_MS = 90_000
export const EV_READY = 'suite-dock:ready'
export const EV_GONE = 'suite-dock:gone'

/** 心跳新鲜判定：90s 内的 ISO 时间戳 = dock 在场。 */
export function dockFresh(raw: string | null | undefined, now = Date.now()): boolean {
  if (raw === null || raw === undefined || raw === '') return false
  const t = Date.parse(raw)
  return Number.isFinite(t) && now - t >= 0 && now - t < DOCK_FRESH_MS
}

function safeGet(): string | null {
  try {
    return typeof localStorage !== 'undefined' ? localStorage.getItem(DOCK_STORAGE_KEY) : null
  } catch {
    return null
  }
}

/** dock 是否在场（挂载时读心跳 + 监听 ready/gone + 30s 兜底复查）。 */
export function useDockPresent(): boolean {
  const [present, setPresent] = useState(() => dockFresh(safeGet()))
  useEffect(() => {
    const recheck = (): void => { setPresent(dockFresh(safeGet())) }
    window.addEventListener(EV_READY, recheck)
    window.addEventListener(EV_GONE, recheck)
    const t = window.setInterval(recheck, 30_000)
    return () => {
      window.removeEventListener(EV_READY, recheck)
      window.removeEventListener(EV_GONE, recheck)
      window.clearInterval(t)
    }
  }, [])
  return present
}
