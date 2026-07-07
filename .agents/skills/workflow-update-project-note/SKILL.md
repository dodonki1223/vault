---
name: workflow-update-project-note
description: 既存 Project note の状況を確認し、情報取得と分類 workflow、review 系 skill を組み合わせて status.md を更新する workflow skill。Project 更新、status.md 更新、継続確認、情報源確認を依頼されたときに使う。新規 Project 作成は行わない。
---

# Project note 更新 workflow

## 目的

既存 Project の状況を確認し、継続的に役立つ変化だけを Project note に反映する。

この skill は進行役であり、情報取得と分類は `workflow-fetch-and-classify-materials` に、レビューは `review-project-status` に委譲する。

## 入力

- 対象 Project path。例: `projects/active/<project-name>/`
- 確認したい観点。指定がなければ `instructions.md` と `status.md` から判断する。
- 必要に応じて、対象期間、情報源、優先して見る論点。

## 使う skill

- `workflow-fetch-and-classify-materials`: 必要な情報源を見極め、取得結果を分類する。
- `review-project-status`: `status.md` 更新後に品質レビューを行う。

## 手順

1. 対象 Project を確認する。
   - path が不明な場合は、対象 Project を短く確認する。
   - `projects/README.md` を読み、Project の更新ルールを確認する。
   - `.agents/references/project-required-info.md` を読み、不足情報の確認項目を把握する。

2. Project folder だけを読む。
   - `README.md`、`instructions.md`、`status.md` を読む。
   - 原則として、対象 Project folder 外の Project は読まない。
   - 既存の `status.md` から、現在の状態、未解決事項、次に見ること、情報源を把握する。

3. 更新に必要な情報源を決める。
   - `instructions.md` と `status.md` の `情報源` を優先する。
   - 情報源ごとに、対象、期間、取得観点、除外条件を明確にする。
   - 外部情報が不要な場合は、ユーザー入力と既存 note だけで更新する。

4. 必要な情報を取得して分類する。
   - 外部情報が必要な場合は `workflow-fetch-and-classify-materials` を使う。
   - 対象、期間、観点、除外条件、取得理由、必要な短い Project 文脈を渡す。
   - 個別の fetch 系 skill や `classify-fetched-materials` をこの workflow から直接ばらばらに呼ぶのではなく、原則として情報取得と分類 workflow に委譲する。
   - 取得結果と分類結果は、そのまま `status.md` に貼らず、統合前の材料として扱う。

5. 分類結果を Project 文脈に統合する。
   - 分類結果をそのまま貼らず、Project の現在状況として継続的に役立つものだけを選ぶ。
   - 複数の情報源が矛盾する場合は、事実、決定事項、推測を分け、未解決事項として残す。
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

8. 不足している情報を確認する。
   - `.agents/references/project-required-info.md` の項目を見て、Project に不足している情報を確認する。
   - 不足があっても更新を止めない。
   - 不足項目は推測で埋めず、ユーザーへの返答に `不足している情報` として出す。

9. 結果を返す。
   - 更新した Project path。
   - 変更した判断、状態、ブロッカー、次アクション。
   - 不足している情報。
   - 確認が必要な点。
   - 次に見る情報源。

返答には次の形を含める。

```markdown
## 更新結果

- 更新した Project:
- 反映した変更:

## 不足している情報

-

## 確認が必要な点

-

## 次に見る情報源

-
```

## 境界

- この skill は、Project 作成を行わない。新規作成は `create-project-note` skill を使う。
- Project 本体は local-only なので、commit 対象にしない。
- ログ全文、チケット一覧、メッセージ全文を `status.md` に貼らない。
- 情報取得と分類、更新、レビューの責務を混ぜない。
- この workflow では分類結果の統合と更新判断だけを行い、取得と分類そのものは `workflow-fetch-and-classify-materials` に委譲する。
- この skill 本体には、Slack / Linear / Notion / GitHub など個別情報源の取得手順の詳細を書かない。
