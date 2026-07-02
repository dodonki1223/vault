# MCP / connector 認証チェック harness

## 背景

fetch 系 skill や Linear write 系 skill を使う前に、必要な MCP / connector の認証が有効か確認できる仕組みがほしい。

`codex exec` 起動時に、対象 task では使わない Notion / GitHub / Linear などの MCP 認証切れが表示されることがある。root README に個別 connector の認証トラブルを書くと、repository のセットアップ説明と外部 connector 運用が混ざる。

認証切れは `save:commit` のような local-only command ではなく、主に fetch / write 系 skill の前提条件として扱う方が自然。

## ほしい状態

- skill 実行前に、必要な connector だけ認証状態を確認できる。
- 認証切れ、権限不足、token 未設定を検出したら、どの connector が原因かを短く返す。
- 可能なら `codex mcp login <name>` など次に実行すべき操作を提示する。
- 自動再認証は、ブラウザ認証やユーザー操作が必要になる可能性があるため、最初は行わない。
- local-only の command では、不要な connector 認証切れを原因に作業全体を止めない設計を検討する。

## 候補

- `.agents/scripts/check-mcp-auth.mjs`
- `pnpm check:mcp`
- fetch 系 skill の「設定・認証チェック」セクションから共通 harness を参照する。
- write 系 skill では、書き込み前の draft 確認に加えて対象 connector の認証確認を行う。

## 最初にやること

- `codex mcp list` の出力から、対象 MCP が enabled かどうかを確認する script を検討する。
- OAuth の再認証が必要かを、安全な read-only probe で確認できるか調べる。
- connector ごとの次アクション文言を揃える。

## 完了条件

- fetch / write 系 skill が認証切れ時に同じ型の返答を返せる。
- local-only command と connector 必須 command の失敗理由を分けられる。

## 残課題

- Codex / Claude Code で connector 管理方法が異なる場合、共通化できる範囲を確認する。
