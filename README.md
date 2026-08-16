# dsh-yuyi

English | [中文](README.zh.md)

Yuyi (御驿) communication plugin for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness): the Hub WebSocket seam with wake delivery, the session roster, seventeen model-facing `yuyi_*` tools, and the cross-session task memory — as an out-of-tree profile bundle.

## What you get

| Piece | Entry | Where it mounts |
|---|---|---|
| Connection seam (`ctx.yuyi`) | `dsh-yuyi` (default export) | Host plane, via this bundle's `cordis.patch.yml` |
| `yuyi_status` / `yuyi_register` / `yuyi_peers` / `yuyi_send` / `yuyi_inbox` + twelve `yuyi_task_*` tools | `dsh-yuyi/tools` | Agent presets — add the row from [`presets/yuyi.cordis.yml`](presets/yuyi.cordis.yml) |

Delivery follows the harness wake pattern: a notify whose roster session has a live idle agent submits a follow-up turn (waking it); a running agent receives steering. `mail`, unwakeable deliveries, and foreign broadcasts park in local inboxes; own-device broadcast echoes are dropped. `yuyi_send` supports `expectReply` with a timeout and abort.

## Install

```sh
dsh plugin --profile <name> add github:lomehong/dsh-yuyi
```

The bundle layer mounts the dormant service. Then give sessions the tools by adding the preset row:

```yaml
- id: tool-yuyi
  name: dsh-yuyi/tools
```

## Configuration

`hub`, `tokenEnv` (default `YUYI_TOKEN`), `device`, `replyTimeoutMs` — on the host row's `config`, or through the `yuyi` user-settings namespace this service registers (edits land as live reconnects). Resolution order: explicit config → launch environment (`YUYI_HUB`, `YUYI_DEVICE`, the `tokenEnv` name) → `~/.yuyi/env` (the file the Yuyi installer writes); the device falls back to the hostname. The token resolves through the credentials service per connection attempt and is never stored by this plugin. Unconfigured deployments stay dormant: every hub-reaching method fails with a stable `YuyiError` code instead of degrading silently.

## Repository layout

- `src/core/` — the vendored Yuyi client core (protocol v2 Hub client, inboxes, task memory), pinned from the Yuyi workspace.
- `src/service.ts` — `YuyiRuntime`, the host-plane seam.
- `src/tools/` — the tool suite and its prompt guidance.
- `tests/` — service and tool suites over an in-process protocol-v2 fixture hub.
- `web/` — browser halves (conversation tab, Settings section) parked as source: they need the harness's compile-time Remote client mounting and activate only once the harness grows an out-of-tree browser Remote face.

## Provenance

Extracted from an in-repo integration branch of deepseek-harness (commits `f1ef91e616`, `c72b47cdc2`, `b280979e19`), re-packaged as an out-of-tree bundle. The in-repo catalog entries, generated Typert artifacts, and Agent Notes stayed with the harness.
