/**
  * 浏览器 bundle 构建：产出一个 harness client-module 格式的 CJS 产物
  * —— `window.__ModuleLoader__.load({ id, factory })`，平台模块
  * （种子表清单）作为外置依赖，其余全部内联。CSS
  * 模块在 bundle 内编译：导入 `x.module.css` 得到
  * 哈希类名映射，并自动注入一个 <style data-plugin="dsh-yuyi"> 标签
  * 在工厂执行时。
 */
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { basename, dirname, resolve } from 'node:path'
import { defineConfig } from 'tsdown'

const ID = 'dsh-yuyi'

/* * 浏览器模块表的种子条目（harness packages/client/web/src/platform.ts）。 */
const PLATFORM_MODULES = [
  'react', 'react/jsx-runtime', 'react-dom', 'react-dom/client', '@deepseek-ai/cordis',
  '@deepseek-ai/dsh-client-ui-slots',
  '@deepseek-ai/dsh-client-web-react',
  '@deepseek-ai/dsh-client-ui-primitives',
  '@deepseek-ai/dsh-client-ui-attachment',
  '@deepseek-ai/dsh-client-schema-form',
] as const

const CSS_VIRTUAL_PREFIX = '\0dsh-yuyi-css:'
const CSS_VIRTUAL_SUFFIX = '.mjs'

/* * 把一个本地类名哈希为模块作用域内无冲突的名字。
   下划线前缀是必需的：裸十六进制哈希有 ~60% 概率以数字开头，
   而 CSS 类选择器不得以数字开头——`.5c6a…_input` 这类规则会被
   CSSOM 静默丢弃，导致大片样式随机失效。 */
function scopedClass(file: string, cls: string): string {
  return `_${createHash('sha256').update(`${file}#${cls}`).digest('hex').slice(0, 10)}_${cls}`
}

export default defineConfig({
  name: `${ID}/client`,
  entry: { client: 'src/client/index.ts' },
  outDir: 'lib',
  format: ['cjs'],
  platform: 'browser',
  target: 'es2022',
  dts: false,
  clean: false,
  sourcemap: true,
  external: [...PLATFORM_MODULES],
  // tsdown 会自动外置包依赖；模块表
  // 只应答平台清单，其余（zod、本地辅助）一律内联。
  noExternal: (id: string) => (PLATFORM_MODULES as readonly string[]).includes(id) ? false : true,
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'production'),
  },
  plugins: [{
    name: 'dsh-yuyi-css-modules',
    resolveId(source: string, importer: string | undefined) {
      if (!source.endsWith('.module.css')) return null
      const abs = importer !== undefined ? resolve(dirname(importer), source) : source
      return CSS_VIRTUAL_PREFIX + abs + CSS_VIRTUAL_SUFFIX
    },
    async load(virtualId: string) {
      if (!virtualId.startsWith(CSS_VIRTUAL_PREFIX)) return null
      const file = virtualId.slice(CSS_VIRTUAL_PREFIX.length, -CSS_VIRTUAL_SUFFIX.length)
      this.addWatchFile(file)
      const source = await readFile(file, 'utf8')
      const classes = new Set<string>()
      const compiled = source.replace(/\.([A-Za-z_][A-Za-z0-9_-]*)/g, (_match, cls: string) => {
        classes.add(cls)
        return `.${scopedClass(file, cls)}`
      })
      const classMap: Record<string, string> = {}
      for (const cls of classes) classMap[cls] = scopedClass(file, cls)
      return [
        `const css = ${JSON.stringify(compiled)};`,
        `const tagId = ${JSON.stringify(`${ID}/${basename(file)}`)};`,
        'if (typeof document !== \'undefined\' && document.querySelector(\'style[data-plugin-css=\' + JSON.stringify(tagId) + \']\') === null) {',
        '  const tag = document.createElement(\'style\');',
        `  tag.dataset.plugin = ${JSON.stringify(ID)};`,
        '  tag.dataset.pluginCss = tagId;',
        '  tag.textContent = css;',
        '  document.head.appendChild(tag);',
        '}',
        `export default ${JSON.stringify(classMap)};`,
      ].join('\n')
    },
  }],
  outputOptions: {
    entryFileNames: 'client.js',
    banner: `window.__ModuleLoader__.load({ id: ${JSON.stringify(ID)}, factory: (require) => {`,
    footer: 'return module.exports; } });',
    intro: 'var module = { exports: {} }; var exports = module.exports;',
  },
})
