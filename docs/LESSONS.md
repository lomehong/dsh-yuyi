# 经验教训（LESSONS LEARNED）

dsh-yuyi 开发与部署中踩过的坑。新增条目请附事故日期与可复现路径。

## 1. 手维护的 remote-contribution 会因 core 升级静默失配（2026-09-18，v0.1.7→v0.1.8）

- 现象：core 升到 0.1.6-alpha.2 后，浏览器端 `remote.yuyi` 命名空间永不挂载，
  御驿设置区块状态行永远「读取中…」，控制台**零报错**（YuyiStatusMirror 的拒绝
  回调是空的——设计如此）。
- 根因：`src/remote-contribution.ts` 是手维护的 strict codec 描述符；新版
  typert-registry 的 `validateCodec` 契约从「codec.schema.parse 可调用」改为
  「codec.create 是函数」（`materializeSchema` 惰性物化）。旧描述符没有 create
  → `$mount` 在 DescriptorStore.validate 被拒 → 整个命名空间不挂载。
- 排障障碍：状态镜像把所有拒绝吞掉（`refresh` 的 `() => {}`），加上 merge-bundle
  把多包合一个 URL，失败点定位花了整整一轮控制台探针。
- 修复：`ensureCodecFactory` 在 export 前给每个 strict codec 幂等补
  `create: () => schema`；并新增依赖卫生与 codec 契约回归守卫
  （tests/client.spec.ts + tests/recap 守卫模式）。
- 教训：**跨包边界的对象形状契约，必须在消费方放守卫测试**；静默吞错的状态
  组件必须带 lastError 上浮。

## 2. `ctx.effect(async () => …)` 在 merge-bundle 场景可能从不执行（2026-09-18）

- 现象：控制台探针证明 apply() 全程跑完（slots/字典都注册了），但唯一的
  async effect 回调一行都没执行——`$mount` 因此从未发起。
- 修复：改为**同步 effect 内发非 awaited promise**，`.then` 接管 dispose，
  `active` 标志防 double-dispose；失败经 ctx.logger.error 显式落日志。
- 教训：**不要依赖 async effect 的调度语义做关键初始化**；关键挂载用同步
  effect + promise 链。若未来 cordis 修了 async 调度，此写法依然正确。

## 3. 依赖卫生：测试图不得拉入 peerDep（同日同款）

- 新 spec 经 memory-autopilot 风格的模块引用把 `@deepseek-ai/dsh-tools`
  （peerDep，`.npmrc legacy-peer-deps` 下 npm ci 不安装）拉进测试图 → CI 上
  ERR_MODULE_NOT_FOUND，本地因历史手装残留而绿。
- 教训：零依赖叶子模块承载跨模块共享的状态/工具；测试图引用前先查传递闭包。
