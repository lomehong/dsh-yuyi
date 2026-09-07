/**
 * dsh-yuyi 宿主插件入口：再导出御驿通信接缝（`ctx.yuyi`），
 * 供 profile 行 `name: dsh-yuyi` 挂载服务。十七个模型工具在 `./tools`
 * 子路径下，供 agent preset 行引用。
 * @module dsh-yuyi
 */
export { default } from "./src/service.js";
export { default as YuyiRuntime } from "./src/service.js";
export { YuyiError } from "./src/types.js";
export { formatIncoming, deliverySummary } from "./src/delivery.js";
