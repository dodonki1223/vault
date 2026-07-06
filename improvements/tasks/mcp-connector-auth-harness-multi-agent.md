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
- Slack のような書き込み系 connector も、実行前に「読み取り可能か」「書き込み可能か」「送信 tool があるか」を確認できる。
- MCP server 設定、Bot token、OAuth token、workspace 固有設定は repository に含めず、local / user settings 側に置く。

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
5. Slack については、少なくとも次をチェックできるようにする。
   - Slack MCP / connector が設定されているか。
   - 読み取り tool があるか。
   - DM / scheduled message / message send など、書き込み tool があるか。
   - ユーザー本人の Slack user ID または DM 宛先を解決できるか。
   - 書き込み permission が足りない場合に、必要な設定だけを返せるか。

## 関連

- `.agents/scripts/check-mcp-auth.mjs`
- `package.json`
- `README.md`
- `.agents/skills/README.md`
- `improvements/tasks/skill-invocation-policy.md`
- `improvements/tasks/token-usage-alert-skill.md`

## 完了条件

- Codex / Claude Code のどちらに対応しているかが README から分かる。
- Claude Code の対応方針が決まっている。
- 少なくとも Codex 専用 script を共通 harness と誤解しない名前または説明になっている。
- 将来 Claude Code adapter を追加しても出力形式が崩れない。
- repository に secret や user-local MCP 設定を含めず、チェック結果だけを返せる。

## Slack 固有の調査結果 (2026-07-06)

Codex / Claude Code どちらでも `mcp_servers.slack` の generic 登録（`url = "https://mcp.slack.com/mcp"`）は使えないことを確認した。原因と結論は次の通り。

- Slack の MCP サーバー (`mcp.slack.com/mcp`) は Dynamic Client Registration (DCR) 非対応で、事前登録済み client_id/client_secret 方式のみをサポートする。
- Codex CLI・Claude Code CLI とも、generic な MCP OAuth クライアントは DCR にしか対応しておらず、`clientId` を config に書いても DCR を先に試みて失敗する（[openai/codex#13200](https://github.com/openai/codex/issues/13200)、[anthropics/claude-code#53253](https://github.com/anthropics/claude-code/issues/53253)）。plugin 経由でも `.mcp.json` の中身は同じなので結果は変わらない。
- Codex だけ読み取りができていたのは、`slack@openai-curated` plugin が「Skill / **App** / MCP server」の3層構成のうち **App**（ChatGPT account-level connector、`chatgpt.com/codex/settings/connectors` で認証）として Slack を実装しているため。account 側の pre-registered OAuth で完結し、CLI の generic DCR 経路を通らない。
- Claude Code 公式の Slack plugin（`slackapi/slack-mcp-plugin`）は `slack-messaging` / `slack-search` という skill を同梱しているが、これらは `.mcp.json` の generic MCP server tool（`slack_send_message` 等）を呼ぶだけで、Codex の App に相当する account-level 層を Claude Code CLI 上には持たない。そのため plugin を入れても同じ DCR エラーになる。
- 回避策（自分の Slack App を作り user token を発行し `bearer_token_env_var` / `--header` で bearer 認証する）は Codex・Claude Code どちらでも技術的には可能だが、セットアップの手間（Slack App 作成、broad scope 付与、手動 OAuth code 交換、workspace の app 作成承認）が見合わないと判断し、今回は採用しなかった。
- 結論: ローカル CLI（`codex` / `claude`）経由での Slack 送信は、Codex は curated **App** 経由でのみ可能、Claude Code は現状手段なし。Claude 側は Cowork / claude.ai の account-level connector（このセッションで `slack_read_user_profile` により動作確認済み）を使う運用に一本化する。vault の `.mcp.json`（手動 OAuth clientId 設定）は動かないため削除した。

## 残課題

- Claude Code の MCP / connector 認証状態をどの粒度まで機械的に取得できるか。
- OAuth の live probe を harness 側でどこまで扱うか。
- ~~Slack 送信について、Claude Code 側でどの MCP / plugin / tool を標準にするか。~~ → 上記の通り解決（Claude Code CLI では不可、Cowork/claude.ai の account-level connector を使う）。
- Codex 側の Slack 送信（App 経由の write skill）が実際に使えるかは未検証。
