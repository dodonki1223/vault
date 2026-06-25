---
name: fetch-google-meet-materials
description: Google Meet で行った特定 MTG のメモ、文字起こし、議事録、関連 Docs / Drive ファイルを取得する。meeting title、開催日時、参加者、calendar event、Meet link、Docs / Drive URL、キーワード、取得観点、除外条件を入力として受け取り、後続の分類 skill に渡しやすい粒度で情報を集める。取得した情報の分類や他ファイルへの統合は行わない。
---

# Google Meet メモの情報取得

## 目的

指定された Google Meet の MTG に関するメモ、文字起こし、議事録、関連資料だけを集める。この skill は情報の取得と軽い絞り込みだけを担当し、優先度判断、事実・推測などへの分類、ファイル編集は行わない。

Google Calendar は、対象 MTG を特定し、関連する Google Meet / Docs / Drive の資料へ辿るための入口として扱う。予定一覧、空き時間確認、日程調整など Calendar 全般の取得はこの skill の対象外にする。Slack huddle の情報取得は `fetch-slack-materials`、Notion meeting note の情報取得は `fetch-notion-materials` を使う。

用途は呼び出し側が決める。Project 更新、Note 作成、単発調査、後続タスク作成など、どの運用でも同じ取得手順を使う。

## 事前に確認する入力

取得前に、呼び出し側から渡された入力またはユーザーの依頼から、できるだけ次を特定する。

- 対象: meeting title、開催日時、参加者、calendar event URL、Google Meet URL、Docs / Drive URL、キーワード。
- 期間: 明示された日付を優先する。指定がなければ、取得範囲を広げずに確認する。
- 観点: 決定事項、未決論点、依頼、ユーザー対応待ち、担当、期限、関連リンク、次回確認事項など、呼び出し側が渡したもの。
- 除外: 雑談、逐語録、対象外の会議、古いメモ、既知の背景情報など、呼び出し側が渡したもの。

対象 MTG を安全に特定できない場合だけ、短い質問を 1 つする。

## 設定・認証チェック

Google Calendar / Drive / Docs / Meet transcript を取得できる tools が見つからない、認証エラー、権限不足、対象不明で取得できない、または connector の状態が不明な場合は、取得を広げる前に次を行う。

1. まず tool discovery で Calendar / Drive / Docs / Google workspace 系 tools を探す。Python、Node、CLI など特定のローカル runtime には依存しない。
2. Google Calendar tool が見つからない場合は、Calendar event、開催日時、参加者、Meet link を直接確認できないため、Google Calendar connector / plugin / MCP の接続またはインストールが必要であることを返す。Notion AI や横断検索などの connected search には進まない。
3. Google Drive / Docs tool が見つからない場合は、Gemini メモ、文字起こし、録画、関連 Docs の本文を直接確認できないため、Google Drive / Docs connector / plugin / MCP の接続またはインストールが必要であることを返す。候補検索だけで代替しない。
4. tools が見つからない場合だけ、利用中エージェントの connector / MCP / plugin 設定を確認できる範囲で見る。token、OAuth secret、cookie は探さない。
5. tools が未設定または disabled の場合は、必要な Google workspace connector を接続し、新しい thread で再試行するよう案内する。
6. tools は有効だが見つからない場合は、エージェントの再起動または新しい thread での再試行を案内する。
7. tools が見つかる場合は、取得前に必要最小の read-only probe で OAuth 状態を確認する。認証エラーなら追加取得を止める。
8. calendar event、Docs、Drive file、Meet transcript が見えない場合は、ユーザー本人の calendar 権限、資料共有、Drive / Docs の閲覧権限、connector の接続先が合っているかを確認事項として返す。

認証そのものはユーザー操作として残す。skill は OAuth フローを代理完了しない。token、OAuth code、API key、cookie を受け取らない・保存しない。

## 取得できなかった場合の返答

Google Meet メモを取得できなかった場合も、ユーザーが次に何をすればよいか分かるように、通常の取得結果ではなく次の形で短く返す。

```markdown
## Google Meet メモ情報

### 取得範囲

- 対象:
- 期間:
- 観点:
- 除外:

### 取得できなかった理由

- 種別: Calendar tool 未検出 / Drive・Docs tool 未検出 / connector 未設定 / 再認証が必要 / 権限不足 / 対象不明 / transcript なし / 該当なし
- 確認したこと:
- 次にユーザーが行うこと:
- 再試行条件:

### 不足している可能性

-
```

`次にユーザーが行うこと` には、connector の接続・再認証、calendar event URL の指定、Docs / Drive の共有、対象日時や meeting title の再指定など、実際に必要なものだけを書く。secret、token、cookie の値は求めない。

## 取得 Workflow

1. 呼び出し側から渡された meeting title、開催日時、参加者、URL、期間、観点、除外条件を確認する。
2. 利用可能な Calendar / Drive / Docs / Google workspace connector / tools を使う。tools がない、または認証状態が不明な場合は、先に `設定・認証チェック` を行う。
3. まず狭く対象 MTG を特定する。
   - 明示された calendar event URL、Google Meet URL、Docs / Drive URL を最優先する。
   - 次に、meeting title、開催日時、参加者で calendar event を探す。
   - 次に、calendar event に紐づく Docs、Drive file、Meet transcript、添付資料、関連リンクを見る。
   - 次に、渡されたキーワード、日付、関係者名で関連 Docs / Drive file を探す。
4. Notion AI、Gmail 検索、横断検索、Slack などで Google Meet メモの候補が見つかっても、それだけでは `Google Meet から取得できた` とは扱わない。候補が見えたことは補足として返してよいが、本文取得に必要な Google connector / MCP がなければ、先に接続・インストールを促す。
5. 対象 MTG ごとに、開催日時、参加者、情報源、更新日時、メモの種類、関連リンクを確認する。
6. 議事録や文字起こしの全文ではなく、指定された観点に必要な断片だけを取得する。
7. 文字起こしがある場合でも、話者ごとの全文を貼らず、参照 link と該当箇所の短い要点だけを残す。
8. 追加取得しても背景情報や重複しか出なくなったら止める。

## 返答フォーマット

別 skill またはメインのエージェントが分類できるように、コンパクトな取得情報として返す。

```markdown
## Google Meet メモ情報

### 取得範囲

- 対象:
- 期間:
- 観点:
- 除外:

### 取得結果

| 開催日時 | Google Meet | 情報源 | 参加者 | 情報 | リンク | 取得理由 |
|---|---|---|---|---|---|---|
| YYYY-MM-DD HH:mm JST | Google Meet title | Calendar / Meet transcript / Docs / Drive | Name | source に基づく短い要約 | [display](url) | 取り込んだ理由 |

### 不足している可能性

-
```

`情報` は短く保つ。決定事項らしきもの、未決論点、依頼、期限、担当は、後で検証できるように source と link を残す。URL だけで置かず、意味が分かる表示名を付ける。

## 境界

- この skill ではファイルを更新しない。
- 取得した情報を最終的な `事実`、`決定事項`、`推測`、`重要リンク`、`未解決事項`、`ユーザー対応待ち` へ分類しない。それは `classify-fetched-materials` または後続 workflow に任せる。
- Calendar 全般の予定一覧、空き時間確認、日程調整、定期予定の監視は行わない。
- Slack huddle の情報取得は行わない。Slack huddle、Slack thread、Slack channel にある MTG 文脈は `fetch-slack-materials` を使う。
- Notion meeting note の情報取得は行わない。Notion page、database、Docs として管理されている MTG 文脈は `fetch-notion-materials` を使う。
- Google Meet メモ、文字起こし、Docs の全文を貼らない。
- Notion AI、Gmail 検索、横断検索、Slack などで見えた Google Meet メモの候補は補助情報として扱う。Calendar event や Google Docs 本文を直接取得できていない場合は、取得成功扱いにしない。
- 会議中の発言を、明示的な合意や決定として確定扱いしない。必要なら source とともに後続分類へ渡す。
- 呼び出し側が人間向け summary を求めていない限り、定型的な会議情報をユーザーへ通知しない。

## 良い情報の例

- 会議で合意されたように見える方針、ただし source と確認余地を残したもの。
- 未決論点、担当、期限、次回確認事項。
- ユーザーへの依頼、確認待ち、承認待ち。
- 関連する Docs、Linear、GitHub、Slack、Sheets への重要リンク。
- transcript なし、メモ未共有、権限不足など、取得上の制約。

## 悪い情報の例

- 文字起こし全文。
- 雑談や相づち。
- 指定された観点に使わない背景説明。
- 対象外の会議や同名会議の情報。
- 同じリンクの重複列挙。
