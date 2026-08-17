/**
 * vitest 的 '@deepseek-ai/dsh-client-ui-primitives' 桩：真实实现由浏览器
 * 模块表在运行时提供（bundle 外置），测试只需要可渲染的最小组件。
 */
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { createElement } from 'react'

export type StateDotState = 'done' | 'warning' | 'ongoing' | 'error'

export function StateDot(props: { state: StateDotState; size?: number; className?: string }) {
  return createElement('span', { 'data-state': props.state, className: props.className })
}

export function Pill(props: { active?: boolean; className?: string; children?: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  const { active: _active, className, children, ...rest } = props
  return createElement('span', { className, ...rest }, children)
}
