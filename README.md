# Chief of Staff Vault

## Setup

この vault の運用 tool は Node.js で管理する。

```bash
mise install
pnpm install
```

Node.js の version は `.mise.toml` で固定する。

## Usage

Token usage の確認には `ccusage` を使う。

```bash
pnpm usage:daily
pnpm usage:session
pnpm usage:monthly
```

## Commands

リポジトリ内の定型作業は `pnpm` scripts から実行する。script は処理を直接再実装せず、必要な skill を Codex CLI から呼び出す薄い入口にする。

```bash
pnpm save:commit
```

`save:commit` は `vault-git-commit` skill を使って差分確認、stage、commit を行う。判断に迷う差分がある場合は commit せずに報告する。
commit 作成では `.git` への書き込みが必要なため、この script だけ Codex CLI を `--sandbox danger-full-access` で実行する。
