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

## active と archive

- `projects/active/`: 進行中、定期確認中、または次に見ることが残っている Project を置く。
- `projects/archive/`: 完了、停止、または今後の定期確認が不要になった Project を置く。

Project を閉じるときは、`status.md` に完了日、閉じた理由、残すべき判断、参照すべき最終リンクを短く残してから `projects/archive/` へ移す。再開した場合は `projects/active/` に戻す。

## 置かないもの

- git に残してよい抽象化済みの workflow や skill 設計。これは `notes/shared/` に置く。
- git に残したくない単発メモ。これは `notes/local/` に置く。
- Slack、Linear、Docs などを見れば分かるログのコピー。

## commit 前の確認

`projects/README.md`、`projects/active/README.md`、`projects/archive/README.md` 以外の `projects/` 配下ファイルは `.gitignore` で無視する。commit 前には `git status --short --ignored` を確認し、Project 本体が staged set に含まれていないことを確認する。
