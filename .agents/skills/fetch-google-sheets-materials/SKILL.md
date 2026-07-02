---
name: fetch-google-sheets-materials
description: Google Sheets から指定された spreadsheet、sheet、range、named range、filter、キーワード、取得観点、除外条件に関する情報だけを取得する。表の値、更新日時、列構造、集計値、関連リンクを集めたいときに使う。取得した情報の分類や他ファイルへの統合、Google Sheets への書き込みは行わない。
---

# Google Sheets からの情報取得

## 目的

指定された Google Sheets 対象から必要な情報だけを集める。この skill は情報の取得と軽い絞り込みだけを担当し、優先度判断、事実・推測などへの分類、ファイル編集、Google Sheets への書き込みは行わない。

用途は呼び出し側が決める。Note の作成・更新、単発調査、継続テーマの状況確認、数値確認、後続タスク作成など、どの運用でも同じ取得手順を使う。

## 事前に確認する入力

取得前に、呼び出し側から渡された入力またはユーザーの依頼から、できるだけ次を特定する。

- 対象: Google Sheets URL、spreadsheet 名、file ID、sheet / tab 名、range、named range、filter、キーワード。
- 期間: 明示された日付を優先する。指定がなければ、取得範囲を広げずに確認する。
- 観点: 数値、状態、担当、期限、未完了、差分、集計、異常値、関連リンクなど、呼び出し側が渡したもの。
- 除外: 表全体、古い tab、集計に不要な列、非表示行、テストデータ、対象外の spreadsheet など、呼び出し側が渡したもの。

対象 spreadsheet、sheet、range を安全に推測できない場合だけ、短い質問を 1 つする。

## 設定・認証チェック

Google Sheets / Drive tools が見つからない、認証エラー、権限不足、対象不明で取得できない、または connector の状態が不明な場合は、取得を広げる前に次を行う。

1. まず tool discovery で Google Sheets / Google Drive tools を探す。Python、Node、CLI など特定のローカル runtime には依存しない。
2. Google Sheets tool が見つからない場合は、spreadsheet の値、range、sheet 構造を直接確認できないため、Google Sheets connector / plugin / MCP の接続またはインストールが必要であることを返す。
3. Google Drive tool が見つからない場合は、file 検索、共有状態、更新日時、関連ファイルを直接確認できないため、Google Drive connector / plugin / MCP の接続またはインストールが必要であることを返す。
4. tools が見つからない場合だけ、利用中エージェントの connector / MCP / plugin 設定を確認できる範囲で見る。token、OAuth secret、cookie は探さない。
5. tools が未設定または disabled の場合は、必要な Google workspace connector を接続し、新しい thread で再試行するよう案内する。
6. tools は有効だが見つからない場合は、エージェントの再起動または新しい thread での再試行を案内する。
7. tools が見つかる場合は、取得前に必要最小の read-only probe で OAuth 状態を確認する。認証エラーなら追加取得を止める。
8. spreadsheet、sheet、range が見えない場合は、ユーザー本人の Drive 権限、ファイル共有、対象 tab / range の存在、connector の接続先が合っているかを確認事項として返す。

認証そのものはユーザー操作として残す。skill は OAuth フローを代理完了しない。token、OAuth code、API key、cookie を受け取らない・保存しない。

## 取得できなかった場合の返答

Google Sheets から情報を取得できなかった場合も、ユーザーが次に何をすればよいか分かるように、通常の取得結果ではなく次の形で短く返す。

```markdown
## Google Sheets 情報

### 取得範囲

- 対象:
- sheet / range:
- 期間:
- 観点:
- 除外:

### 取得できなかった理由

- 種別: Sheets tool 未検出 / Drive tool 未検出 / connector 未設定 / 再認証が必要 / 権限不足 / 対象不明 / sheet・range 不明 / 該当なし
- 確認したこと:
- 次にユーザーが行うこと:
- 再試行条件:

### 不足している可能性

-
```

`次にユーザーが行うこと` には、connector の接続・再認証、spreadsheet の共有、URL / sheet / range / filter の再指定など、実際に必要なものだけを書く。secret、token、cookie の値は求めない。

## 取得 Workflow

1. 呼び出し側から渡された spreadsheet URL、file ID、sheet / tab、range、named range、filter、期間、観点、除外条件を確認する。
2. 利用可能な Google Sheets / Drive connector / tools を使う。tools がない、または認証状態が不明な場合は、先に `設定・認証チェック` を行う。
3. まず狭く対象を特定する。
   - 明示された spreadsheet URL、file ID、range を最優先する。
   - 次に、spreadsheet 名、sheet / tab 名、named range を見る。
   - 次に、渡されたキーワード、列名、日付、人物名、関連 ID で該当範囲を探す。
4. 取得対象ごとに、spreadsheet 名、sheet / tab、range、更新日時、列構造、フィルタ条件、関連リンクを確認する。
5. 表全体を読む必要がない場合は、見出し行、指定列、該当行、集計に必要な範囲だけを取得する。
6. 数式セルがある場合は、値と数式のどちらを見たか分かるようにする。判断に必要な場合だけ数式を確認する。
7. 非表示行、フィルタ済み行、保護範囲、古い tab などが判断に影響しそうな場合は、不足している可能性として残す。
8. 追加取得しても背景情報や重複しか出なくなったら止める。

## 返答フォーマット

別 skill またはメインのエージェントが分類できるように、コンパクトな取得情報として返す。

```markdown
## Google Sheets 情報

### 取得範囲

- 対象:
- sheet / range:
- 期間:
- 観点:
- 除外:

### 取得結果

| 更新日時 | Spreadsheet | Sheet / Range | 列・条件 | 情報 | リンク | 取得理由 |
|---|---|---|---|---|---|---|
| YYYY-MM-DD HH:mm JST | Spreadsheet 名 | Sheet1!A1:F20 | 列名 / filter | source に基づく短い要約または値 | [display](url) | 取り込んだ理由 |

### 不足している可能性

-
```

`情報` は短く保つ。表の全文貼り付けではなく、指定された観点に必要な値、行、列、集計だけを残す。URL だけで置かず、意味が分かる表示名を付ける。

## 境界

- この skill ではファイルを更新しない。
- Google Sheets に書き込まない。セル編集、行追加、コメント追加、共有設定変更、フィルタ変更、並び替えは行わない。
- 取得した情報を最終的な `事実`、`決定事項`、`推測`、`重要リンク`、`未解決事項`、`ユーザー対応待ち` へ分類しない。それは `classify-fetched-materials` または後続 workflow に任せる。
- spreadsheet 全体、全 tab、全行を貼らない。
- 数値や集計値を、source の範囲や条件なしに確定扱いしない。
- Google Sheets の値から人や組織の状態を推測しすぎない。必要なら source と確認余地を残す。
- Google Docs、Notion、Slack、Linear などの本文取得は行わない。Sheets 内のリンク先が必要な場合は、後続の適切な fetch skill に渡す。
- 呼び出し側が人間向け summary を求めていない限り、定型的な表更新をユーザーへ通知しない。

## 良い情報の例

- 指定された観点に関係する行、列、値、集計、更新日時。
- 担当、期限、状態、未完了、異常値、差分が分かる表の断片。
- 関連する Linear、GitHub、Notion、Docs、Slack への重要リンク。
- 範囲やフィルタ条件が不明、非表示行がある、権限不足など、取得上の制約。

## 悪い情報の例

- spreadsheet 全文や巨大な表の貼り付け。
- 指定された観点に使わない列や行。
- 古い tab の値を現在値として扱うこと。
- 同じリンクや同じ行の重複列挙。
- 数式や集計条件を確認せずに出した断定的な結論。
