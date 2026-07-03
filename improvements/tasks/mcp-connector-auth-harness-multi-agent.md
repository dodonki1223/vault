# MCP / connector 認証チェック harness の multi-agent 対応

## 背景

`.agents/scripts/check-mcp-auth.mjs` により、Codex CLI の `codex mcp list` を使った MCP 設定確認はできるようになった。

ただし現状の script は Codex 専用であり、Claude Code ではそのまま使えない。vault の skill は Codex と Claude Code の両方で使う想定なので、MCP / connector 認証チェック harness も agent ごとの差分を扱える形にしたい。

## 現状

- Codex: `pnpm check:mcp` で `codex mcp list` を読み、設定状態を確認できる。
- Codex: bearer token 環境変数未設定、OAuth は live probe が必要、未設定 MCP を同じ形式で返せる。
- Claude Code: 未対応。
- OAuth の実有効性は、Codex / Claude Code どちらも list 系 command だけでは確定できない可能性がある。

## ほしい状態

- `pnpm check:mcp` が Codex 専用であることが分かる。
- 必要なら `pnpm check:mcp:codex` と `pnpm check:mcp:claude` のように agent ごとに分けられる。
- Claude Code で MCP / connector / skill access の状態をどう確認できるかが分かる。
- Codex と Claude Code の出力形式を揃えられる。
- fetch / write 系 skill が、どの agent でも「認証切れ・権限不足・未設定」を同じ型で返せる。

## 最初にやること

1. Claude Code で MCP / connector の一覧や認証状態を確認する標準手段を調べる。
2. `.agents/scripts/check-mcp-auth.mjs` を provider adapter 方式にできるか検討する。
   - `codex` adapter: 現在の `codex mcp list` 実装。
   - `claude` adapter: Claude Code の確認手段が分かり次第追加。
3. `package.json` の script 名を整理する。
   - 例: `check:mcp:codex`
   - 例: `check:mcp:claude`
   - 例: `check:mcp` は利用可能 agent を自動判定するか、Codex 専用であることを明記する。
4. README と `.agents/skills/README.md` に、現時点の対応範囲を明記する。

## 関連

- `.agents/scripts/check-mcp-auth.mjs`
- `package.json`
- `README.md`
- `.agents/skills/README.md`
- `improvements/tasks/skill-invocation-policy.md`

## 完了条件

- Codex / Claude Code のどちらに対応しているかが README から分かる。
- Claude Code の対応方針が決まっている。
- 少なくとも Codex 専用 script を共通 harness と誤解しない名前または説明になっている。
- 将来 Claude Code adapter を追加しても出力形式が崩れない。

## 残課題

- Claude Code の MCP / connector 認証状態をどの粒度まで機械的に取得できるか。
- OAuth の live probe を harness 側でどこまで扱うか。
