# dsh-yuyi

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的御驿通信插件：带唤醒投递的 Hub WebSocket 接缝、会话 roster、十七个模型可用的 `yuyi_*` 工具与跨会话任务记忆——以仓库外 profile bundle 形式交付。

## 内容

| 组件 | 入口 | 挂载位置 |
|---|---|---|
| 连接接缝（`ctx.yuyi`） | `dsh-yuyi`（默认导出） | 宿主平面，经本 bundle 的 `cordis.patch.yml` |
| Web 标签页 + 设置区块 | `dsh-yuyi/client`（浏览器半） | 同一行经包的 `dsh.client` 声明自动服务 |
| `yuyi_status` / `yuyi_register` / `yuyi_peers` / `yuyi_send` / `yuyi_inbox` + 十二个 `yuyi_task_*` 工具 | `dsh-yuyi/tools` | agent preset——加 [`presets/yuyi.cordis.yml`](presets/yuyi.cordis.yml) 里的行 |

投递遵循 harness 的唤醒模式：notify 命中 roster 中空闲的活跃会话即提交 follow-up 回合（唤醒它）；运行中的会话收到 steer。`mail`、无法唤醒的投递与外来广播停入本地收件箱；本设备广播回显被丢弃。`yuyi_send` 支持 `expectReply`（超时 + 中止）。

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

- `src/core/` —— 钉住的御驿客户端核心（协议 v2 Hub 客户端、收件箱、任务记忆）。
- `src/service.ts` —— `YuyiRuntime`，宿主平面接缝。
- `src/tools/` —— 工具套件及其 prompt 指引。
- `tests/` —— 基于进程内协议 v2 fixture hub 的服务与工具套件。
- `src/client/` —— 浏览器半：经公开的 `ctx.remote.$mount` 挂载御驿 Remote 贡献（宿主 source-mode 发现自动应答端点），注册会话标签页与设置区块；连接状态以可见性门控的轮询刷新——harness 只经自身编译期白名单转发宿主事件，外置插件因此用轮询。

## 出处

自 deepseek-harness 的仓库内集成分支提取（提交 `f1ef91e616`、`c72b47cdc2`、`b280979e19`），重新打包为仓库外 bundle。仓库内目录条目、生成的 Typert 产物与 Agent Notes 留在 harness。
