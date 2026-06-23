---
name: create-project-note
description: vault の `projects/active/` に新しい Project note を作る。ユーザーが新規 Project、作業テーマ、継続確認対象を作りたいときに使う。短いインタビューで目的、責任範囲、観測ポイント、情報源、通知条件、完了条件を確認し、`README.md`、`instructions.md`、`status.md` を最小構成で作成する。Project 作成後の情報取得や status 更新レビューは行わない。
---

# Project Note 作成

## 目的

新しい Project を `projects/active/<project-name>/` に作る。この skill は Project note の初期作成だけを担当する。情報取得、取得情報の分類、作成後の `status.md` レビューは別 skill またはメインのエージェントに任せる。

## 事前確認

作業前に `projects/README.md` を読み、最新の Project 構成、git 管理方針、更新ルールに従う。

Project 名は、ローカルで扱いやすく読み返しやすい短い kebab-case にする。

## インタビュー

新しい Project を作る前に、1 問ずつ短く確認する。すでにユーザーの依頼文や既存 note から分かるものは再質問しない。

- この Project は何か、なぜ重要か。
- ユーザーの責任範囲はどこまでか。
- 重要な人、チーム、関連 Project は何か。
- 見逃したくない変化、失敗、リスクは何か。
- 重要な情報源はどれか。
- どんな時に通知してほしいか。
- 逆に通知しなくてよいものは何か。
- 完了条件、または Project を閉じる条件は何か。

すべてを完璧に埋めようとしない。継続更新に必要な最小情報が揃ったら作成する。

## 作成するファイル

`projects/active/<project-name>/` に次を作る。

```text
README.md
instructions.md
status.md
```

- `README.md`: Project の目的、読むべきファイル、運用ルールを置く入口。
- `instructions.md`: 情報源、対象範囲、除外ルール、更新手順、通知条件、完了条件を置く作業指示。
- `status.md`: 現在状況、ブロッカー、未解決事項、次に見ること、情報源、変更履歴を置く現在地。

`templates/` 配下のファイルを元に作成する。

- `templates/README.md`: Project の入口テンプレート。
- `templates/instructions.md`: 作業指示テンプレート。
- `templates/status.md`: 現在地テンプレート。これを `status.md` の標準フォーマットとする。

テンプレート内の `Project 名`、`YYYY-MM-DD`、空の箇条書きは、インタビューで分かった範囲だけ埋める。分からない項目を無理に埋めず、未確定の問いは `status.md` の `未解決事項` に置く。

## 情報源の扱い

`情報源` には、次回の更新時に再取得できるリンク付きの source だけを置く。Notion / Docs / Linear / Slack / GitHub / local file など、表示名付き Markdown link にできるものを情報源とする。

リンクがない会話内の背景、ユーザーが貼った要約、インタビューで得た内容、`YYYY-MM-DD ユーザー提供...` のような項目は、情報源として扱わない。必要な内容は `概要`、`現在の状況`、`ブロッカー`、`未解決事項`、`変更履歴` に統合する。

リンク付きの情報源がまだ分からない場合、`情報源` には「現時点では未設定。リンク付きの正本が分かったら追加する。」とだけ書き、リンクなしの箇条書きを作らない。

情報源に追加してよい例:

- `[Linear Project: マスターデータ改善プロジェクト](https://linear.app/...)`
- `[Notion: オンボーディング時に会話した内容](https://app.notion.com/...)`
- `[関連メモ](../notes/shared/example.md)`

情報源に追加しない例:

- `2026-06-23 ユーザー提供背景: ...`
- `ユーザー提供の過去まとめ`
- `会話で確認した内容`

## 既存 note の扱い

既存の `notes/` に関連する文脈がある場合は、必要な要点だけを Project に移す。元 note を編集するかどうかはユーザーの意図と git 管理方針を確認してから行う。

`notes/local/` の内容を git 管理対象へ移す場合は、公開されても問題ない粒度に抽象化する。具体的な内部リンク、個人情報、第三者に関する情報、アクセス制限のある情報は Project 本体または local-only の置き場に残す。

## 境界

- この skill では外部情報源を読みに行かない。
- この skill では `status.md` 更新後レビューを行わない。
- Project 本体は local-only なので、作成した Project ファイルを commit 対象にしない。
- 作成結果には、作成した path、未解決事項、次に情報取得すべき情報源だけを短く返す。
