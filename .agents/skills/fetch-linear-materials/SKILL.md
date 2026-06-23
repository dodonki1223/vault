---
name: fetch-linear-materials
description: Project 更新、リリース追跡、不具合対応、タスク棚卸し、chief-of-staff 的な作業記憶更新のために、Linear から必要な情報だけを取得する。指定された issue、view、project、label、team、assignee、期間、キーワード、Project instructions をもとに、状態、担当、期限、コメント、最近の更新、ブロッカー、関連リンクを集めたいときに使う。取得した情報の分類や notes への統合はまだ行わない。
---

# Linear からの情報取得

## 目的

後続の Project 更新に必要な Linear 情報だけを集める。この skill は情報の取得と軽い絞り込みだけを担当し、Project の優先度判断、事実・推測などへの分類、project note の編集は行わない。

## 事前に確認する入力

取得前に、ユーザーの依頼または Project ファイルから、できるだけ次を特定する。

- 対象: issue ID、Linear URL、view、project、label、team、assignee、キーワード、Project 名。
- 期間: 明示された日付を優先する。指定がなければ、依頼内容または Project status から狭い直近期を推測する。
- 観点: 未完了タスク、リリースブロッカー、担当変更、期限変更、状態変更、コメント、関連 PR / Docs、ユーザー対応待ち。
- 除外: 完了済みで現在判断に不要な issue、古い重複 issue、bot 的な更新、Project 範囲外の issue。

対象または期間を安全に推測できない場合だけ、短い質問を 1 つする。

## 取得 Workflow

1. Linear 対象、label、view、issue ID、既知の除外条件を特定する必要がある場合だけ、関連 Project の `README.md`、`instructions.md`、`status.md` を読む。
2. 利用可能な Linear connector / tools を使う。Linear tools がまだ読み込まれておらず tool discovery が使える場合は、汎用 web search ではなく Linear tools を探す。
3. まず狭く取得する。
   - 明示された issue URL / issue ID を最優先する。
   - 次に、指定された view / project / label / team / assignee を見る。
   - 次に、Project キーワード、リリース日、関連 PR 番号、関係者名で検索する。
4. issue ごとに、状態、担当、期限、優先度、label、最近のコメント、関連リンクを確認する。
5. 完了済み issue は、現在判断に必要なものだけ残す。完了した事実が重要でなければ取得結果から落とす。
6. 重複 issue、同じ内容のコメント、古い状態変更は重複排除する。
7. 追加取得しても定型更新や重複しか出なくなったら止める。

## 認証切れ / MCP 未設定時の扱い

Linear connector / MCP tool が `401: Reauthentication required`、`Unauthorized`、`Authentication required` を返した場合は、追加取得を続けずに認証エラーとして止める。返答には、失敗した対象、失敗した tool、再認証後に同じ対象で再試行することだけを書く。

可能であれば、Codex MCP の設定状態を確認し、次のどちらかに分けて案内する。

- `mcp_servers.linear` が設定済みの場合: `codex mcp login linear` を再実行してから同じ対象を再取得するよう案内する。`codex` が PATH にない環境では `/Applications/Codex.app/Contents/Resources/codex mcp login linear` を案内する。
- `mcp_servers.linear` が未設定の場合: Linear の公式 MCP endpoint を Codex に登録する手順として、`/Applications/Codex.app/Contents/Resources/codex mcp add linear --url https://mcp.linear.app/mcp` を案内する。Codex の remote MCP client が未有効な場合は、`~/.codex/config.toml` の `[features]` に `experimental_use_rmcp_client = true` が必要なことも添える。
- `codex` command も Codex.app 内の bundled CLI path も使えない場合: [Codex CLI 公式ドキュメント](https://developers.openai.com/codex/cli) を参照して Codex CLI を導入してから、MCP 登録または `codex mcp login linear` を行うよう案内する。macOS / Linux では `curl -fsSL https://chatgpt.com/codex/install.sh | sh`、非対話インストールが必要な場合は `curl -fsSL https://chatgpt.com/codex/install.sh | CODEX_NON_INTERACTIVE=1 sh` を使う。

OAuth のブラウザ承認はユーザー本人の操作として残す。skill は token、OAuth code、API key を受け取らない・保存しない。非対話化が必要な場合だけ、ユーザーが安全に管理する環境変数を使った bearer token 設定を別途検討し、secret の値は note や skill に書かない。

## 返答フォーマット

別 skill またはメインの Codex が分類できるように、コンパクトな取得情報として返す。

```markdown
## Linear 情報

### 取得範囲

- 対象:
- 期間:
- 観点:
- 除外:

### 取得結果

| 更新日時 | Issue | 状態 | 担当 | 期限 | 情報 | リンク | 取得理由 |
|---|---|---|---|---|---|---|---|
| YYYY-MM-DD HH:mm JST | KEY-123: タイトル | 状態 | Name | YYYY-MM-DD | source に基づく短い要約 | [display](url) | 取り込んだ理由 |

### 不足している可能性

- 
```

`Issue` には必ず issue ID とタイトルを入れる。`情報` は短く保ち、現在判断に関係する差分だけを書く。URL だけで置かず、意味が分かる表示名を付ける。

## 境界

- この skill では `status.md`、`notes/`、Project ファイルを更新しない。
- 取得した情報を最終的な `事実`、`推測`、`重要リンク`、`未解決事項`、`ユーザー対応待ち` へ分類しない。それは `classify-project-materials` に任せる。
- Linear の全 issue 一覧やコメント全文を貼らない。
- Slack や Docs にある意思決定を Linear だけで確定扱いしない。必要なら関連リンクを残し、後続確認に回す。
- 呼び出し側が人間向け summary を求めていない限り、定型更新をユーザーへ通知しない。

## 良い情報の例

- リリースブロッカー issue の状態、担当、期限、直近コメント。
- 担当者、期限、優先度、label、scope が変わった issue。
- ユーザーやチームの対応待ちになっている issue。
- 関連 PR、Slack thread、Notion / Docs が紐づいた issue。

## 悪い情報の例

- 現在判断に不要な完了済み issue の詳細。
- ラベル変更や自動更新だけで意味のない履歴。
- Project 範囲外の issue。
- コメント全文の貼り付け。
