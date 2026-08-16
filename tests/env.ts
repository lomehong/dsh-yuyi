/**
 * Test-environment redirect for the yuyi service suites. This module must be
 * the FIRST import of a spec: yuyi-core captures its state directory at module
 * load, and the env-file reader resolves `~` once per fork.
 *
 * - `YUYI_STATE_DIR` points the inbox/task stores at a per-run temp dir.
 * - `HOME`/`USERPROFILE` redirect the fixed `~/.yuyi/env` reader away from the
 *   developer's real agent state (each vitest fork is a fresh process, so the
 *   redirect dies with the suite).
 * - Any ambient `YUYI_*` connection variables are cleared so "dormant" cases
 *   cannot accidentally resolve a real hub from the launching shell.
 */

import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

/** Per-run state dir backing the vendored inbox/task stores. */
export const stateDir = mkdtempSync(join(tmpdir(), 'dsh-yuyi-state-'))
/** Per-run fake home so `~/.yuyi/env` reads only what a test wrote. */
export const fakeHome = mkdtempSync(join(tmpdir(), 'dsh-yuyi-home-'))

process.env.YUYI_STATE_DIR = stateDir
process.env.USERPROFILE = fakeHome
process.env.HOME = fakeHome
delete process.env.YUYI_HUB
delete process.env.YUYI_TOKEN
delete process.env.YUYI_DEVICE

/** The token value launch-environment resolution tests install. */
export const LAUNCH_TOKEN = 'launch-token-value'
