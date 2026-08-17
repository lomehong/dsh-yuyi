import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  resolve: {
    alias: {
      // 平台外置包：运行时由浏览器模块表提供，测试走最小桩。
      '@deepseek-ai/dsh-client-ui-primitives': fileURLToPath(new URL('./tests/primitives-stub.tsx', import.meta.url)),
    },
  },
  test: {
    include: ['tests/**/*.spec.ts'],
    testTimeout: 20_000,
  },
})
