---
name: fetch-linear-materials
description: Linear から指定された対象に関する情報だけを取得する。issue、view、Linear project、label、team、assignee、期間、キーワード、取得観点、除外条件を入力として受け取り、状態、担当、期限、コメント、最近の更新、ブロッカー、関連リンクを集めたいときに使う。取得した情報の分類や他ファイルへの統合は行わない。
---

# Linear からの情報取得

## 目的

指定された Linear 対象から必要な情報だけを集める。この skill は情報の取得と軽い絞り込みだけを担当し、優先度判断、事実・推測などへの分類、ファイル編集は行わない。

用途は呼び出し側が決める。Note の作成・更新、単発調査、継続テーマの状況確認など、どの運用でも同じ取得手順を使う。

## 事前に確認する入力

取得前に、呼び出し側から渡された入力またはユーザーの依頼から、できるだけ次を特定する。

- 対象: issue ID、Linear URL、view、Linear project、label、team、assignee、キーワード。
- 期間: 明示された日付を優先する。指定がなければ、取得範囲を広げずに確認する。
- 観点: 未完了タスク、ブロッカー、担当変更、期限変更、状態変更、コメント、関連 PR / Docs など、呼び出し側が渡したもの。
- 除外: 完了済み issue、古い重複 issue、bot 的な更新、対象外の team / project / issue など、呼び出し側が渡したもの。

対象または期間を安全に推測できない場合だけ、短い質問を 1 つする。

## 設定・認証チェック

Linear tools / MCP が見つからない、認証エラー、権限不足、対象不明で取得できない、または Linear connector の状態が不明な場合は、取得を広げる前に次を行う。

1. まず tool discovery で Linear tools を探す。Python、Node、CLI など特定のローカル runtime には依存しない。
2. Linear tools が見つからない場合だけ、`~/.codex/config.toml` の `mcp_servers.linear` 設定を確認できる範囲で見る。token、OAuth secret、cookie は探さない。
3. Linear MCP が設定済みの場合は、必要最小の read-only probe で OAuth 状態を確認する。認証エラーなら追加取得を止める。
4. Linear MCP が未設定の場合は、Linear の公式 MCP endpoint を Codex に登録する手順として、`codex mcp add linear --url https://mcp.linear.app/mcp` を案内する。`codex` が PATH にない環境では `/Applications/Codex.app/Contents/Resources/codex mcp add linear --url https://mcp.linear.app/mcp` を案内する。
5. `401: Reauthentication required`、`Unauthorized`、`Authentication required` などが返った場合は、`codex mcp login linear` を再実行してから同じ対象を再取得するよう案内する。`codex` が PATH にない環境では `/Applications/Codex.app/Contents/Resources/codex mcp login linear` を案内する。
6. issue、team、project、view が見えない場合は、ユーザー本人の Linear workspace、team 権限、issue / project の閲覧権限が合っているかを確認事項として返す。

OAuth のブラウザ承認はユーザー本人の操作として残す。skill は token、OAuth code、API key を受け取らない・保存しない。非対話化が必要な場合だけ、ユーザーが安全に管理する環境変数を使った bearer token 設定を別途検討し、secret の値は note や skill に書かない。

## 取得できなかった場合の返答

Linear から情報を取得できなかった場合も、ユーザーが次に何をすればよいか分かるように、通常の取得結果ではなく次の形で短く返す。

```markdown
## Linear 情報

### 取得範囲

- 対象:
- 期間:
- 観点:
- 除外:

### 取得できなかった理由

- 種別: tool 未検出 / MCP 未設定 / 再認証が必要 / 権限不足 / 対象不明 / 該当なし
- 確認したこと:
- 次にユーザーが行うこと:
- 再試行条件:

### 不足している可能性

- 
```

`次にユーザーが行うこと` には、MCP 登録、`codex mcp login linear`、workspace / team 権限の確認、issue URL や view の再指定など、実際に必要なものだけを書く。secret、token、cookie の値は求めない。

## 取得 Workflow

1. 呼び出し側から渡された Linear 対象、label、view、issue ID、期間、観点、除外条件を確認する。
2. 利用可能な Linear connector / tools を使う。Linear tools がまだ読み込まれておらず tool discovery が使える場合は、汎用 web search ではなく Linear tools を探す。tools がない、または認証状態が不明な場合は、先に `設定・認証チェック` を行う。
3. まず狭く取得する。
   - 明示された issue URL / issue ID を最優先する。
   - 次に、指定された view / project / label / team / assignee を見る。
   - 次に、渡されたキーワード、日付、関連 PR 番号、関係者名で検索する。
4. issue ごとに、状態、担当、期限、優先度、label、最近のコメント、関連リンクを確認する。
5. 完了済み issue は、指定された観点に必要なものだけ残す。完了した事実が重要でなければ取得結果から落とす。
6. 重複 issue、同じ内容のコメント、古い状態変更は重複排除する。
7. 追加取得しても定型更新や重複しか出なくなったら止める。

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

`Issue` には必ず issue ID とタイトルを入れる。`情報` は短く保ち、指定された観点に関係する差分だけを書く。URL だけで置かず、意味が分かる表示名を付ける。

## 境界

- この skill ではファイルを更新しない。
- 取得した情報を最終的な `事実`、`推測`、`重要リンク`、`未解決事項`、`ユーザー対応待ち` へ分類しない。それは後続の整理処理に任せる。
- Linear の全 issue 一覧やコメント全文を貼らない。
- Slack や Docs にある意思決定を Linear だけで確定扱いしない。必要なら関連リンクを残し、後続確認に回す。
- 呼び出し側が人間向け summary を求めていない限り、定型更新をユーザーへ通知しない。

## 良い情報の例

- 指定された観点に関係する issue の状態、担当、期限、直近コメント。
- 担当者、期限、優先度、label、scope が変わった issue。
- ユーザーやチームの対応待ちになっている issue。
- 関連 PR、Slack thread、Notion / Docs が紐づいた issue。

## 悪い情報の例

- 指定された観点に不要な完了済み issue の詳細。
- ラベル変更や自動更新だけで意味のない履歴。
- 指定された対象範囲外の issue。
- コメント全文の貼り付け。
