/**
 * yuyi 工具套件的 agent preset 入口：preset 行（`name: dsh-yuyi/tools`）
 * 引用本模块，由该 preset 组合出的会话获得十七个 `yuyi_*` 工具及其
 * prompt 指引。宿主平面服务须经 bundle 补丁另行挂载。
 * @module dsh-yuyi/tools
 */

export * from './src/tools/index.ts'
