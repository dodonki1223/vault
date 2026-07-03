# Project の透明性・検査・適応 skill

## 背景

Project に紐づく issue 一覧、Timeline document、昨日行ったこと、関連する MTG メモや Slack / Linear / GitHub の更新を見て、Project が透明性、検査、適応を回せる状態になっているか確認したい。

単に進捗を要約するのではなく、Project の現在地が見えるか、実態を検査できる材料があるか、検査結果から次の行動を適応できているかを判断する skill がほしい。

## ほしい状態

- Project の issue 一覧、milestone、Timeline document、昨日行ったことから、Project の現在地が分かる。
- 透明性が足りない箇所を指摘できる。例: 何が終わったか不明、誰が見ても状態が分からない、判断材料へのリンクがない。
- 検査が足りない箇所を指摘できる。例: 実績や事実に基づく確認がない、最新 issue / PR / MTG メモを見ていない、リスクや未解決事項が検査されていない。
- 適応が足りない箇所を指摘できる。例: 検査結果から次アクションが変わっていない、優先度変更や scope 調整が反映されていない。
- 「昨日行ったこと」から、Project の Timeline や issue / status に反映すべき durable な変化を見つけられる。
- ユーザーに、今すぐ直すべきこと、次回確認すべきこと、Project note / Linear / Timeline document に反映すべきことを分けて返せる。

## 入力として渡したいもの

- Project の目的と完了条件。
- Linear Project / milestone / issue 一覧。
- Timeline document。
- 昨日行ったこと、または直近の作業ログ。
- 関連する MTG メモ、Slack thread、GitHub PR、Notion / Docs。
- 現在の `status.md` または Project note。

## 出力案

```markdown
## 透明性・検査・適応レビュー

### 透明性

- 状態:
- 足りない情報:
- 改善案:

### 検査

- 確認できた事実:
- 検査できていないこと:
- 次に見るべき情報:

### 適応

- 反映すべき変化:
- 変えるべき次アクション:
- Project note / Linear / Timeline document への反映候補:

### ユーザー確認が必要なこと

-
```

## 最初にやること

1. `review-project-empirical-control` または `review-project-transparency-inspection-adaptation` のような read-only skill として作る。
2. `workflow-update-linear-project-timeline`、`workflow-update-project-note`、`fetch-linear-materials`、`classify-fetched-materials` とどう接続するか決める。
3. Project の issue 一覧と Timeline document を入力にした小さいレビューから試す。
4. 結果を Project note にそのまま貼るのではなく、ユーザーへのレビュー結果として返し、必要なものだけ反映する。

## 関連

- `.agents/skills/workflow-update-linear-project-timeline/`
- `.agents/skills/workflow-update-project-note/`
- `.agents/skills/fetch-linear-materials/`
- `.agents/skills/classify-fetched-materials/`
- `improvements/tasks/assess-project-risks.md`
- `improvements/tasks/project-update-workflow-validation.md`

## 完了条件

- read-only skill として作成されている。
- 透明性、検査、適応の 3 観点で Project の状態をレビューできる。
- issue 一覧、Timeline document、昨日行ったことから、反映すべき durable な変化を抽出できる。
- Project note / Linear / Timeline document に反映すべき候補と、ユーザー確認が必要なことを分けられる。

## 残課題

- 「昨日行ったこと」をどこから取得するか。
- Timeline document の正本を Linear document にするか、Project note にするか。
- Project リスク判定 skill と重複する観点をどう分けるか。
