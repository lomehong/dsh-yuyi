# dsh-yuyi

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的御驿通信插件：带唤醒投递的 Hub WebSocket 接缝、会话 roster、十八个模型可用的 `yuyi_*` 工具、跨会话任务记忆与协同活动面板（shell.overlay 浮层 + 会话内工具卡片）——以仓库外 profile bundle 形式交付。

## 内容

| 组件 | 入口 | 挂载位置 |
|---|---|---|
| 连接接缝（`ctx.yuyi`） | `dsh-yuyi`（默认导出） | 宿主平面，经本 bundle 的 `cordis.patch.yml` |
| 协同活动面板 + 会话内协同卡片 + 设置区块 | `dsh-yuyi/client`（浏览器半） | 同一行经包的 `dsh.client` 声明自动服务 |
| `yuyi_status` / `yuyi_register` / `yuyi_peers` / `yuyi_send` / `yuyi_inbox` + 十三个 `yuyi_task_*` 工具 | `dsh-yuyi/tools` | agent preset——加 [`presets/yuyi.cordis.yml`](presets/yuyi.cordis.yml) 里的行 |

投递遵循 harness 的唤醒模式：notify 命中 roster 中空闲的活跃会话即提交 follow-up 回合（唤醒它）；运行中的会话收到 steer。`mail`、无法唤醒的投递与外来广播停入本地收件箱；本设备广播回显被丢弃。`yuyi_send` 支持 `expectReply`（超时 + 中止）。

## 协同活动面板

浏览器半在宿主 `shell.overlay`（外置 bundle 的官方加性浮层）里渲染右缘停靠的活动面板。关闭态渲染**右缘拉手**（对话区域内的常驻入口，带配置状态点；刻意不用 `conversation.session.header.utilities`——桌面壳把它排进标题栏，与窗口按钮重叠），配合两个入口：

- **四张会话内协同卡片**（`tool.call.toolview` 按工具名键控：`yuyi_send` / `yuyi_task_continue` / `yuyi_task_show` / `yuyi_peers`），卡片带「活动面板」链接；
- 面板自身带关闭钮，开合状态同源并持久化（localStorage）；**御驿已配置且用户未手动关过时自动展开**。

面板内容自上而下：连接态、成员/完成/未决概览、分段任务进度与图例、avatar 主理卡（御符 `role: avatar` 的成员置顶）、成员花名册（presence：活跃/等待回信/空闲/未知，含正在执行与被等待的任务链计数）、任务链进度卡与选中详情（验收清单、归属、依赖、产物）、**任务依赖图**（按 `yuyi_task_depend` 声明的 `depends` 事件分列布局，悬停高亮上游链）与停靠消息（设备收件箱 peek）。

数据语义与边界：

- **轮询**：外置插件不经宿主事件转发，面板数据（`yuyi/collab` 端点：远端 peers + 本机任务链 `TaskView` 列表）与连接状态走可见性门控的 10 秒轮询；"实时"为秒级近似。
- **降级链**：老 Hub 不回带 `agentId`/`role`/`lastActiveAt` 时成员按设备平铺、presence 显示「未知」；hub 不可达时 peers 为空、面板仍渲染本机任务链；任务链无 `depends` 事件时不出现依赖图。
- **任务依赖**是任务记忆层的本机扩展（`depends` 事件，append-only jsonl，不动 Hub 线路协议）；跨设备视角下被依赖任务可能只以幽灵节点出现在图中。

## 安装

```sh
dsh plugin --profile <name> add github:lomehong/dsh-yuyi
```

bundle 层挂载休眠的服务。再把 preset 行加进你的 preset，让会话获得工具：

```yaml
- id: tool-yuyi
  name: dsh-yuyi/tools
```

## 配置

`hub`、`tokenEnv`（默认 `YUYI_TOKEN`）、`device`、`replyTimeoutMs`——写在宿主行的 `config`，或走本服务注册的 `yuyi` 用户设置命名空间（编辑即即时重连）。

- **hub / device**：显式配置 → 启动环境（`YUYI_HUB`、`YUYI_DEVICE`）→ `~/.yuyi/env`（Yuyi 安装器写的设备级文件）；device 最终回退主机名。
- **token**（与 omp/opencode/codex/mavis 一致：每个 Agent 独立、从自己的专属路径读）：
  1. **dsh 凭证服务**（网页「设置 → 御驿」录入，存 `~/.dsh/.credentials.yaml`）—— 用户在设置界面主动保存。
  2. **`~/.yuyi/dsh-token`** 文件（Yuyi 安装器 dsh 分支写入，与 `~/.yuyi/omp-token` 同约定：纯文本单行）—— 主要的"免配置"入口。
  3. **缺以上两者 → 服务保持休眠**。

  **为什么坚决不读进程 env / 共享 `~/.yuyi/env` 的 YUYI_TOKEN**：安装器 opencode 分支（b7bf367 后）把 opencode 自己的 token 写进用户级 `YUYI_TOKEN`；多 Agent 设备上 dsh 进程继承后误读即"自己用 opencode 身份连上 hub"——hub 侧身份错配、吊销联动失效、sign_key 主体错配。共享 `~/.yuyi/env` 文件在 opencode 装过的机器上也可能有路径残留。**每个 Yuyi Agent 的 token 严格独立、不共享。**

  **安装器必须做的事**：选 `-Agent dsh`（或带 `-TokenDsh`）写 `~/.yuyi/dsh-token`（不要写用户级 `YUYI_TOKEN`）。`dsh plugin --profile web add` 装的旧版本（launcher 副本）会自带老插件的兜底链——新版必须用 `dsh-launcher` v1.3.1+ 重装以清掉那份缓存。

## 仓库结构

- `src/core/` —— 钉住的御驿客户端核心（协议 v2 Hub 客户端、收件箱、任务记忆，含 `depends` 依赖事件与 `listTaskViews`）。
- `src/service.ts` —— `YuyiRuntime`，宿主平面接缝（`status`/`inbox`/`peers`/`collab` 四个 Remote 端点）。
- `src/tools/` —— 工具套件及其 prompt 指引。
- `tests/` —— 基于进程内协议 v2 fixture hub 的服务与工具套件。
- `src/client/` —— 浏览器半：经公开的 `ctx.remote.$mount` 挂载御驿 Remote 贡献（宿主 source-mode 发现自动应答端点），注册 shell.overlay 协同面板、会话头部工具钮、`tool.call.toolview` 协同卡片与设置区块；连接状态与协同快照以可见性门控的轮询刷新——harness 只经自身编译期白名单转发宿主事件，外置插件因此用轮询。

## 出处

自 deepseek-harness 的仓库内集成分支提取（提交 `f1ef91e616`、`c72b47cdc2`、`b280979e19`），重新打包为仓库外 bundle。仓库内目录条目、生成的 Typert 产物与 Agent Notes 留在 harness。
