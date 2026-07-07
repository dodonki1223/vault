# Chief of Staff Vault

## Setup

この vault の運用 tool は Node.js で管理する。

```bash
mise install
pnpm install
```

Node.js の version は `.mise.toml` で固定する。

## Repository Layout

- `improvements/`: vault 全体の改善 backlog と task file。詳しくは `improvements/README.md` を見る。

## Usage

Token usage の確認には `ccusage` を使う。`ccusage` は Codex CLI と Claude Code の両方の local usage file を読める。

```bash
pnpm usage:today
pnpm usage:daily
pnpm usage:weekly
pnpm usage:session
pnpm usage:monthly
```

`usage:*`(agent 指定なし)は検出できた agent(Codex / Claude Code)をまとめて表示する。Codex だけ、Claude Code だけを見たい場合は `:codex` / `:claude` を付ける。

```bash
pnpm usage:daily:codex
pnpm usage:daily:claude
```

`usage:weekly` / `usage:weekly:codex` / `usage:weekly:claude` は直近 7 日分を日別に表示する。

## Commands

リポジトリ内の定型作業は `pnpm` scripts から実行する。script は処理を直接再実装せず、必要な skill を Codex CLI から呼び出す薄い入口にする。

```bash
pnpm check:mcp
pnpm agent:profile -- --agent codex fetch-light "prompt"
pnpm agent:profile -- --agent claude fetch-light "prompt"
pnpm codex:fetch-light -- "prompt"
pnpm codex:fetch-standard -- "prompt"
pnpm claude:fetch-light -- "prompt"
pnpm claude:fetch-standard -- "prompt"
pnpm codex:profile -- fetch-light "prompt"
pnpm claude:profile -- fetch-light "prompt"
pnpm validate:fetch-skills
pnpm notify:slack -- "通知本文"
pnpm notify:slack:codex -- "通知本文"
pnpm notify:slack:claude -- "通知本文"
pnpm notify:slack:claude-code -- "通知本文"
pnpm save:commit
```

`check:mcp` は Codex CLI に設定された MCP の状態を確認する。対象を絞る場合は `pnpm check:mcp -- linear notion` のように指定する。

`agent:profile` は、repository 管理の推奨 model profile を読んで Codex または Claude を起動する。profile 定義は `.agents/model-profiles/` に置く。`codex:fetch-light` / `codex:fetch-standard` / `claude:fetch-light` / `claude:fetch-standard` はその薄い alias。必要なら `pnpm codex:profile -- --model ... --reasoning ... <profile-name> "prompt"` や `pnpm claude:profile -- --model ... --effort ... <profile-name> "prompt"` で local override できる。fetch 系の低コスト実行を固定したいときは、この wrapper を使う。

`validate:fetch-skills` は `fetch-*materials` 系 skill の必須セクション、境界、`agents/openai.yaml` の有無を確認する。最初は warning 出力だけで、commit は止めない。

`notify:slack` は Codex CLI から `slack-outgoing-message` skill を使って、ユーザー本人への mention 付きで Slack DM へ短い通知を送る。Codex を明示する場合は `pnpm notify:slack:codex -- "通知本文"`、Claude Code から送る場合は `pnpm notify:slack:claude-code -- "通知本文"` を使う。`notify:slack:claude` は同じ Claude Code 版の短い alias。送信前の prompt だけ確認したい場合は `pnpm notify:slack -- --dry-run "通知本文"`、`pnpm notify:slack:codex -- --dry-run "通知本文"`、`pnpm notify:slack:claude-code -- --dry-run "通知本文"` を使う。

`save:commit` は `vault-git-commit` skill を使って差分確認、stage、commit を行う。判断に迷う差分がある場合は commit せずに報告する。
commit 作成では `.git` への書き込みが必要なため、この script だけ Codex CLI を `--sandbox danger-full-access` で実行する。
