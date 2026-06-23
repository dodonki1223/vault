---
name: fetch-slack-materials
description: Slack から指定された対象に関する情報だけを取得する。channel、DM、thread、message URL、期間、キーワード、取得観点、除外条件を入力として受け取り、関連する Slack メッセージ、スレッド、メンション、依頼、決定事項、リンクを集めたいときに使う。取得した情報の分類や他ファイルへの統合は行わない。
---

# Slack からの情報取得

## 目的

指定された Slack 対象から必要な情報だけを集める。この skill は情報の取得と軽い絞り込みだけを担当し、優先度判断、事実・推測などへの分類、ファイル編集は行わない。

用途は呼び出し側が決める。Note の作成・更新、単発調査、継続テーマの状況確認など、どの運用でも同じ取得手順を使う。

## 事前に確認する入力

取得前に、呼び出し側から渡された入力またはユーザーの依頼から、できるだけ次を特定する。

- 対象: channel、DM、thread URL、message URL、キーワード、人物。
- 期間: 明示された日付を優先する。指定がなければ、取得範囲を広げずに確認する。
- 観点: 依頼、決定事項、ブロッカー、担当変更、レビュー依頼、ユーザー宛てメンションなど、呼び出し側が渡したもの。
- 除外: 定型的な雑談、既知の状態、bot 通知、広すぎるログ、関係ない channel など、呼び出し側が渡したもの。

対象または期間を安全に推測できない場合だけ、短い質問を 1 つする。

## 設定・認証チェック

Slack tools が見つからない、認証エラー、権限不足、対象不明で取得できない、または Slack connector の状態が不明な場合は、取得を広げる前に次を行う。

1. まず tool discovery で Slack tools を探す。Python、Node、CLI など特定のローカル runtime には依存しない。
2. Slack tools が見つからない場合だけ、`~/.codex/config.toml` の `slack@openai-curated` plugin 設定を確認できる範囲で見る。token、OAuth secret、cookie は探さない。
3. Slack plugin が未設定または disabled の場合は、Codex の plugin directory で Slack plugin を install / enable し、新しい thread で再試行するよう案内する。
4. Slack plugin は有効だが Slack tools が見つからない場合は、Codex の再起動または新しい thread での再試行を案内する。
5. Slack tools が見つかる場合は、取得前に必要最小の read-only probe を使って OAuth 状態を確認する。例: `_slack_read_user_profile` を `response_format: concise` で呼ぶ。
6. probe または取得 tool が `reauthentication required`、`not_authed`、`invalid_auth`、connector 未接続などの認証エラーを返した場合は、追加取得を止める。対象、失敗した tool、再認証が必要なこと、再認証後に同じ対象で再試行することだけを短く返す。

7. channel、DM、private channel、thread が見えない場合は、ユーザー本人の Slack 権限、channel 参加状態、connector の workspace が合っているかを確認事項として返す。

認証そのものはユーザー操作として残す。skill は OAuth フローを代理完了しない。認証後は、対象や期間を広げず、失敗した同じ Slack 対象から再試行する。

## 取得できなかった場合の返答

Slack から情報を取得できなかった場合も、ユーザーが次に何をすればよいか分かるように、通常の取得結果ではなく次の形で短く返す。

```markdown
## Slack 情報

### 取得範囲

- 対象:
- 期間:
- 観点:
- 除外:

### 取得できなかった理由

- 種別: tool 未検出 / plugin 未設定 / 再認証が必要 / 権限不足 / 対象不明 / 該当なし
- 確認したこと:
- 次にユーザーが行うこと:
- 再試行条件:

### 不足している可能性

- 
```

`次にユーザーが行うこと` には、Slack plugin の install / enable、connector の再認証、対象 workspace の確認、channel 参加、thread URL や期間の再指定など、実際に必要なものだけを書く。secret、token、cookie の値は求めない。

## 取得 Workflow

1. 呼び出し側から渡された Slack 対象、キーワード、関係者、期間、観点、除外条件を確認する。
2. 利用可能な Slack connector / tools を使う。Slack tools がまだ読み込まれておらず tool discovery が使える場合は、汎用 web search ではなく Slack tools を探す。tools がない、または認証状態が不明な場合は、先に `設定・認証チェック` を行う。
3. まず狭く取得する。
   - 明示された thread URL または message URL を最優先する。
   - 次に、指定された channel / DM と期間を見る。
   - 次に、渡されたキーワード、チケット ID、PR 番号、日付、人物名で検索する。
4. 観点に関係しそうな thread だけを追う。関係ない議論を再帰的に広げすぎない。
5. 重複した告知、コピーされたリンク、cross-post は重複排除する。一番分かりやすい source だけを残す。
6. 追加取得しても定型更新や重複しか出なくなったら止める。

## 返答フォーマット

別 skill またはメインの Codex が分類できるように、コンパクトな取得情報として返す。

```markdown
## Slack 情報

### 取得範囲

- 対象:
- 期間:
- 観点:
- 除外:

### 取得結果

| 時刻 | 情報源 | 発言者 | 情報 | リンク | 取得理由 |
|---|---|---|---|---|---|
| YYYY-MM-DD HH:mm JST | #channel / DM / thread | Name | source に基づく短い要約または短い引用 | [display](url) | 取り込んだ理由 |

### 不足している可能性

- 
```

`情報` は短く保つ。長い引用より、source に忠実な要約を優先する。可能な限り直接リンクを残す。URL だけで置かず、意味が分かる表示名を付ける。

## 境界

- この skill ではファイルを更新しない。
- 取得した情報を最終的な `事実`、`推測`、`重要リンク`、`未解決事項`、`ユーザー対応待ち` へ分類しない。それは後続の整理処理に任せる。
- Slack ログ全文を貼らない。
- Slack connector の認証切れを検知した場合は、追加取得や推測による補完をしない。
- 呼び出し側が人間向け summary を求めていない限り、定型更新をユーザーへ通知しない。
- Linear、GitHub、Docs の方が正本になりそうな場合、Slack を正本扱いしない。Slack の文脈を取得し、後続確認のために外部 source へのリンクを残す。

## 良い情報の例

- thread での決定事項。決定した人と時刻が分かるもの。
- ユーザーまたはユーザーのチームへの直接依頼。
- ブロッカー、担当変更、期限変更、QA 結果、レビュー依頼、デプロイに関する情報。
- 指定された観点に関係する Linear、GitHub、Notion、Docs、Sheets へのリンク。

## 悪い情報の例

- 新しい判断がない定型 status ping。
- メッセージ全文の貼り付け。
- 指定されたキーワードを含むだけの雑談。
- Linear / GitHub のリンク先だけで十分な bot 通知。ただし Slack thread に人間の判断が追加されている場合は残す。
