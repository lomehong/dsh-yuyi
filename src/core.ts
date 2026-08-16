/**
 * Facade over the vendored yuyi client core. This package's consumers import
 * the protocol, inbox, and task-memory helpers here instead of reaching for
 * `@deepseek-ai/yuyi-core` directly, so switching the vendored copy for a
 * published upstream artifact is a change to this one module.
 * @module dsh-yuyi/core
 */

export * from './core/index.ts'
