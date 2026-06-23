# Project 更新 workflow

## 目的

既存 Project の状況を確認し、継続的に役立つ変化だけを Project note に反映する。

この workflow は進行役であり、情報取得やレビューの細部は skill に委譲する。

## 入力

- 対象 Project path。例: `projects/active/<project-name>/`
- 確認したい観点。指定がなければ `instructions.md` と `status.md` から判断する。
- 必要に応じて、対象期間、情報源、優先して見る論点。

## 使う skill

- `fetch-slack-materials`: Slack から指定対象の情報を取得する。
- `fetch-linear-materials`: Linear から指定対象の情報を取得する。
- `fetch-notion-materials`: Notion / Docs から指定対象の情報を取得する。
- `fetch-github-materials`: GitHub から指定対象の情報を取得する。
- `review-project-status`: `status.md` 更新後に品質レビューを行う。

## 手順

1. 対象 Project を確認する。
   - path が不明な場合は、対象 Project を短く確認する。
   - `projects/README.md` を読み、Project の更新ルールを確認する。

2. Project folder だけを読む。
   - `README.md`、`instructions.md`、`status.md` を読む。
   - 原則として、対象 Project folder 外の Project は読まない。
   - 既存の `status.md` から、現在の状態、未解決事項、次に見ること、情報源を把握する。

3. 更新に必要な情報源を決める。
   - `instructions.md` と `status.md` の `情報源` を優先する。
   - 情報源ごとに、対象、期間、取得観点、除外条件を明確にする。
   - 外部情報が不要な場合は、ユーザー入力と既存 note だけで更新する。

4. 必要な情報を取得する。
   - 情報源ごとに fetch 系 skill を使う。
   - fetch 系 skill には Project 固有の判断を押し込まない。
   - fetch 系 skill の出力は、取得結果として扱い、そのまま `status.md` に貼らない。

5. 取得結果を統合する。
   - 事実、推測、重要リンク、未解決事項、ユーザー対応待ちを分ける。
   - 複数の情報源が矛盾する場合は、事実と推測を分け、未解決事項として残す。
   - 古い情報、決定済みの懸念、完了済みタスクは現在のブロッカーや未解決事項に残さない。

6. `status.md` を更新する。
   - durable な変化だけを反映する。
   - `概要`、`現在の状況`、`ブロッカー`、`未解決事項`、`次に見ること`、`情報源`、`変更履歴` の整合性を保つ。
   - `変更履歴` は監査ログではなく、今回変わった判断、状態、ブロッカー、次アクションだけを短く残す。
   - 日付が重要な場合は、相対表現ではなく絶対日付で書く。

7. 更新後レビューを行う。
   - `review-project-status` skill を使って `status.md` を確認する。
   - レビューで安全に直せる指摘は修正する。
   - 外部確認が必要なもの、削除判断が必要なものは勝手に消さず、確認事項として残す。

8. 結果を返す。
   - 更新した Project path。
   - 変更した判断、状態、ブロッカー、次アクション。
   - 確認が必要な点。
   - 次に見る情報源。

## 境界

- この workflow は、Project 作成を行わない。新規作成は `create-project-note` skill を使う。
- Project 本体は local-only なので、commit 対象にしない。
- ログ全文、チケット一覧、メッセージ全文を `status.md` に貼らない。
- fetch 系 skill、整理、更新、レビューの責務を混ぜない。
- workflow 本体には、Slack / Linear / Notion / GitHub の取得手順の詳細を書かない。
