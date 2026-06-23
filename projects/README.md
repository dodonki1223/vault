# projects

このフォルダは、進行中または完了済みのプロジェクトや作業テーマごとの作業記憶を置く場所。

## git 管理方針

`projects/` 配下の各 Project は、個人情報、社内情報、Slack / Linear / Notion / GitHub などの内部リンク、リリース判断、担当者、ブロッカーを含みやすいため、原則として git commit しない。

この `README.md` だけを git 管理し、ディレクトリの目的と運用ルールを残す。

## 置くもの

Project はフォルダ単位で管理する。

```text
projects/
  active/
    project-name/
      README.md
      instructions.md
      status.md
  archive/
    project-name/
      README.md
      instructions.md
      status.md
```

- `README.md`: 目的、読むファイル、運用ルール。
- `instructions.md`: 情報源、対象範囲、除外ルール、更新手順。
- `status.md`: 現在状況、ブロッカー、未解決事項、変更履歴。

## `status.md` の標準フォーマット

`status.md` は、Project の現在状況を同じ品質で読めるように、原則として次の順番で作る。Project の性質に合わない見出しは省略してよいが、`概要`、`現在の状況`、`ブロッカー`、`未解決事項`、`次に見ること`、`変更履歴` はできるだけ残す。

```markdown
# Project 名

最終更新日: YYYY-MM-DD JST

## 概要

- 状態:
- 目的:
- 重要度:
- 現時点の判断:

## 現在の状況

| 項目 | 状態 | 担当 | リリース判断・次アクション |
|---|---|---|---|

## ブロッカー

### 事実

- 

### 推測

- 

## 未解決事項

- 

## 次に見ること

- 

## 情報源

- [表示名](URL)

## 変更履歴

### YYYY-MM-DD

- 
```

`現在の状況` は、Project のダッシュボードとして使う。リリース系ならチケット、横断アサイン系ならメンバー、仕様検討系なら論点を行にする。表の列名は Project に合わせて変えてよいが、状態、担当、次アクションまたはリリース判断の手がかりを分ける。

`ブロッカー` では、確認済みの事実と推測を分ける。決定済みのこと、完了済みのこと、古い懸念は現在のブロッカーに残さない。必要なら `変更履歴` に短く移す。

`未解決事項` は、まだ判断・確認が必要な問いだけにする。すでに決まった仕様、完了したタスク、期限切れの確認事項は残さない。

`次に見ること` は、次回エージェントが確認する観測ポイントだけを書く。調査ログやチケット一覧のコピーにしない。

`情報源` は、次回の更新時に情報を取得できる場所を置く。Slack スレッド、Linear issue、Docs、PR、meeting note など、後で見に行くべき source を表示名付きで残す。単なる URL 集にせず、何を確認する場所なのか分かる名前にする。

## 更新ルール

- Project を更新するときは、その Project フォルダだけを読むことを基本にする。
- 日付が重要な場合は、相対表現ではなく絶対日付で書く。
- 事実と推測を分けて書く。
- 必要に応じて、Linear issue、Slack スレッド、Docs、PR など、次回情報を取得できる source への直接リンクを残す。
- すべてを記録する場所にはしない。残すべきものは、継続的に役立つ文脈、意思決定、ブロッカー、担当者、フォローアップ事項に絞る。
- `status.md` を作成・更新するときは、標準フォーマットを基準にし、最後に `概要`、`現在の状況`、`ブロッカー`、`未解決事項`、`次に見ること` の整合性を確認する。
- `status.md` 更新後は、決定済み・完了済み・古くなった項目が `ブロッカー`、`未解決事項`、`次に見ること` に残っていないか確認する。
- `変更履歴` は監査ログではなく、今回の更新で変わった判断、状態、ブロッカー、次アクションだけを短く残す。

## active と archive

- `projects/active/`: 進行中、定期確認中、または次に見ることが残っている Project を置く。
- `projects/archive/`: 完了、停止、または今後の定期確認が不要になった Project を置く。

Project を閉じるときは、`status.md` に完了日、閉じた理由、残すべき判断、参照すべき最終リンクを短く残してから `projects/archive/` へ移す。再開した場合は `projects/active/` に戻す。

## 新しい Project を作るとき

新しい Project を作る前に、エージェントは短いインタビューを行う。1 問ずつ聞き、Project の輪郭と観測ポイントを確認してから `projects/active/<project-name>/` を作る。最初から完璧に埋めようとせず、継続更新に必要な最小情報だけを集める。

確認すること:

- この Project は何か、なぜ重要か。
- ユーザーの責任範囲はどこまでか。
- 重要な人、チーム、関連 Project は何か。
- 見逃したくない変化、失敗、リスクは何か。
- 重要な Slack channel、DM、Docs、repo、meeting、issue はどれか。
- どんな時に通知してほしいか。
- 逆に通知しなくてよいものは何か。
- 完了条件、または Project を閉じる条件は何か。

インタビュー後、`README.md`、`instructions.md`、`status.md` を最小構成で作る。既存の `notes/` に関連する文脈がある場合は、必要な要点だけを Project に移し、元 note には移管先へのリンクを残すか、不要なら整理する。

## 情報収集の並列化

新しい Project を作るとき、または既存 Project の状況を広く確認するときは、必要に応じて情報源ごとに read-only のサブエージェントを使う。サブエージェントは原則としてファイルを編集しない。各情報源から、事実、推測、重要リンク、未解決事項だけを短く返す。

情報収集 skill を作る場合は、取得と整理を分けて単一責任にする。取得 skill は、Slack / Linear / Notion / GitHub など情報源ごとに分け、指定された対象 channel / issue / doc / 期間 / 観点から必要な情報だけを集める。整理 skill は、取得済みの情報を入力として受け取り、事実、推測、重要リンク、未解決事項、ユーザー対応待ちに分類する。Project 固有の優先度判断や `status.md` への統合は、取得 skill / 整理 skill ではなくメインのエージェントが行う。

- Linear: issue、status、owner、blocker、未完了タスク、最近の更新を確認する。
- Notion / Docs: 仕様、背景、決定事項、scope、除外事項、古くなっていそうな情報を確認する。
- Slack: 最近の議論、ユーザー宛てメンション、DM、pending ask、暗黙の決定、リスク、見逃すと困る thread を確認する。
- GitHub: PR、review request、issue、CI、release に関わる変更を確認する。

メインのエージェントは、サブエージェントの結果をそのまま貼らない。複数の情報源を統合し、durable context、decisions、blockers、owners、follow-ups だけを `projects/` または `notes/` に反映する。情報源ごとの結果が矛盾する場合は、事実と推測を分け、未解決事項として残す。

## 置かないもの

- git に残してよい抽象化済みの workflow や skill 設計。これは `notes/shared/` に置く。
- git に残したくない単発メモ。これは `notes/local/` に置く。
- Slack、Linear、Docs などを見れば分かるログのコピー。

## commit 前の確認

`projects/README.md`、`projects/active/README.md`、`projects/archive/README.md` 以外の `projects/` 配下ファイルは `.gitignore` で無視する。commit 前には `git status --short --ignored` を確認し、Project 本体が staged set に含まれていないことを確認する。
