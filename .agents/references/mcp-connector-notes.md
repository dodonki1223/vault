# MCP / connector の既知の制約

`.agents/scripts/check-mcp-auth.mjs` や fetch / write 系 skill を使う前提として、確認済みの MCP / connector 制約をまとめる。

## Slack の generic MCP 登録が使えない (2026-07-06 確認)

Codex / Claude Code どちらでも `mcp_servers.slack` の generic 登録（`url = "https://mcp.slack.com/mcp"` を config / `.mcp.json` に直接書く方式）は使えない。

- Slack の MCP サーバー（`mcp.slack.com/mcp`）は Dynamic Client Registration（DCR）非対応で、事前登録済み client_id / client_secret 方式のみをサポートする。
- Codex CLI・Claude Code CLI とも、generic な MCP OAuth クライアントは DCR にしか対応しておらず、`clientId` を config に書いても DCR を先に試みて失敗する（[openai/codex#13200](https://github.com/openai/codex/issues/13200)、[anthropics/claude-code#53253](https://github.com/anthropics/claude-code/issues/53253)）。plugin 経由でも `.mcp.json` の中身は同じなので結果は変わらない。
- Codex だけ読み取りができるのは、`slack@openai-curated` plugin が「Skill / **App** / MCP server」の3層構成のうち **App**（ChatGPT account-level connector、`chatgpt.com/codex/settings/connectors` で認証）として Slack を実装しているため。account 側の pre-registered OAuth で完結し、CLI の generic DCR 経路を通らない。
- Claude Code 公式の Slack plugin（`slackapi/slack-mcp-plugin`）は `slack-messaging` / `slack-search` skill を同梱しているが、`.mcp.json` の generic MCP server tool（`slack_send_message` 等）を呼ぶだけで、Codex の App に相当する account-level 層を Claude Code CLI 上には持たない。そのため plugin を入れても同じ DCR エラーになる。
- 回避策（自分の Slack App を作り user token を発行し `bearer_token_env_var` / `--header` で bearer 認証する）は技術的には可能だが、セットアップの手間（Slack App 作成、broad scope 付与、手動 OAuth code 交換、workspace の app 作成承認）が見合わないため採用していない。

**結論**: ローカル CLI（`codex` / `claude`）経由での Slack 送信は、Codex は curated **App** 経由でのみ可能、Claude Code は現状手段なし。Claude 側は Cowork / claude.ai の account-level connector（`slack_read_user_profile` などで動作確認済み）を使う運用に一本化する。vault の `.mcp.json`（手動 OAuth clientId 設定）は動かないため置かない。

- 残課題: Codex 側の Slack 送信（App 経由の write skill）が実際に使えるかは未検証。

## Linear MCP の tool 一覧 (2026-07-14 確認)

Codex / Claude Code とも、Linear MCP（`https://mcp.linear.app/mcp`）で提供される tool 一覧は同一。

- `delete_issue` / `delete_project` / `delete_milestone` に相当する tool は存在しない。issue / Project は `save_issue` / `save_project` の `state` を `Canceled` にする soft archive のみ可能で、完全な削除は Linear の Web UI が必要。
- milestone には単独の URL がない（`get_milestone` / `save_milestone` はどちらも `url` を返さない）。link を返す場合は対象 Project の URL を使う。

詳細は `.agents/skills/write-linear-milestone/SKILL.md` の「Linear MCP の制約」を参照。

## `codex mcp list` と `claude mcp list` の違い

- `codex mcp list`: 静的な設定表示のみ。OAuth の実有効性は分からず、`.agents/scripts/check-mcp-auth.mjs` は `unknown` として live probe を促す。
- `claude mcp list`: 実行時に health check（接続確認）まで行う。`✔ Connected` / `! Needs authentication` / `✘ Failed to connect` のいずれかが返るため、`ok` / `ng` を直接判定できる。

## 名前フィルタの制約

`.agents/scripts/check-mcp-auth.mjs` の名前フィルタ（`-- <name>...`）は agent ごとの表示名をそのまま使う。Codex は `linear` のような短い名前、Claude Code は `claude.ai Linear` のような connector 名になることが多く、`--agent all` で同じ名前を指定すると片方が誤って「未設定」と表示される。無理に fuzzy match は実装せず、制約として明記する運用にした。

## 未解決の論点

- Codex 側の Slack 送信（App 経由の write skill）が実際に使えるかは未検証。
- Claude Code の MCP / connector 認証状態を `claude mcp list` 以外の手段でどこまで機械的に取得できるか（例: skill / tool 単位の read/write 権限）は未調査。`fetch-slack-materials` などの skill 側 read-only probe に committed している。
- OAuth の live probe をこの harness script 側でどこまで扱うか（現状は「skill 側の read-only probe に委ねる」という判断で、script 自体は live probe を行わない）。
