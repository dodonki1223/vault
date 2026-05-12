---
name: vault-git-commit
description: vault repository の変更を安全に確認し、焦点の合った git commit を作成する。ユーザーが vault のノート変更、特に projects/ や notes/ 配下の作業記憶更新について、差分確認、stage、commit、amend、commit 準備を依頼したときに使う。
---

# Vault Git Commit

## 概要

この skill は、`vault repository` の変更を小さく意図のある git commit にまとめるために使う。この vault はユーザーの作業記憶なので、commit では継続的に役立つ文脈を残しつつ、無関係なノートをまとめて巻き込まない。

## 手順

1. vault repository だけを対象にする。
   - ユーザーが別の path を明示しない限り、`vault repository` を使う。
   - scope や文言を決める前に `vault repository/AGENTS.md` を読む。
   - `.git/index.lock` がある場合は自動で削除しない。git process が動いているか確認し、判断できない場合は stage する前にユーザーへ伝える。

2. local state を確認する。
   - `git status --short --branch` を実行する。
   - `git diff --stat`、unstaged diff、staged diff があればそれ、`git log --oneline -n 10` を確認する。
   - 現在の task で自分が作った変更以外は、すべてユーザーの変更として扱う。

3. commit scope を決める。
   - 1 commit につき 1 project folder を基本にする。例: `projects/attendance-release-2026-05-15/`
   - `notes/` の変更は、同じ継続的な更新に含まれる場合を除き、`projects/` の変更とは分けて commit する。
   - 無関係な編集は staged にしない。
   - 1 file に無関係な更新が混ざっている場合、hunk が明確に分けられ、かつユーザーが commit を依頼しているとき以外は partial staging を避ける。
   - きれいな commit にするためだけに、ノート内容を revert、discard、rewrite しない。

4. note content を review で確認する。
   - この vault には通常 automated test はない。
   - 重要な日付がある場合、"today" や "tomorrow" のような相対表現ではなく絶対日付になっているか確認する。
   - 事実と推測が混ざっていないか確認する。
   - 勤怠リリースの note では、まず「リリース判定に必要な未完了タスク」と「QAで見つかった不具合」に集中する。
   - 今後の作業に役立つ場合は、Linear issue、Slack thread、docs、PR への直接 link を残す。

5. stage して commit する。
   - 選んだ files または hunks だけを stage する。
   - `git status --short` を再実行して staged set を確認する。
   - recent vault history に合う message で commit を作る。
   - ユーザーが依頼していない限り、push、tag、PR 作成はしない。

## Commit Message

recent commits から style を推測する。強い local convention がない場合は、以下のいずれかを使う。

```text
docs(vault): update attendance release status
docs(project): update <project-name> notes
docs(notes): add <topic> note
chore(vault): update vault workflow
```

subject は簡潔かつ事実ベースにする。body は、blocker がなぜ重要か、どの follow-up が残っているかなど、diff だけでは分からない文脈を説明するときだけ使う。

## 最終報告

commit が成功したら、以下を報告する。

- commit hash と subject
- 含めた files の概要
- 実施した verification。通常は diff/content review
- 残っている unstaged または untracked changes

Codex desktop 内で実行して commit を作成した場合は、final response に必要な git commit directive を含める。
