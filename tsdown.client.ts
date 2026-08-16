/**
 * Browser-bundle build: one CJS artifact in the harness client-module format
 * — `window.__ModuleLoader__.load({ id, factory })` with platform modules
 * (the seed table list) as externals and everything else inlined. CSS
 * Modules compile inside the bundle: importing `x.module.css` yields the
 * hashed class map and auto-injects one <style data-plugin="dsh-yuyi"> tag
 * at factory execution.
 */
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { basename, dirname, resolve } from 'node:path'
import { defineConfig } from 'tsdown'

const ID = 'dsh-yuyi'

/** The browser module table's seed entries (harness packages/client/web/src/platform.ts). */
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

/** Hash one local class name into a collision-free module-scoped name. */
function scopedClass(file: string, cls: string): string {
  return `${createHash('sha256').update(`${file}#${cls}`).digest('hex').slice(0, 10)}_${cls}`
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
  // tsdown auto-externalizes package dependencies; the module table answers
  // only the platform list, so everything else (zod, local helpers) inlines.
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
