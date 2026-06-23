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
   - scope や文言を決める前に `AGENTS.md` を読む。
   - `.git/index.lock` がある場合は自動で削除しない。git process が動いているか確認し、判断できない場合は stage する前にユーザーへ伝える。

2. local state を確認する。
   - `git status --short --branch` を実行する。
   - `git diff --stat`、unstaged diff、staged diff があればそれ、`git log --oneline -n 10` を確認する。
   - 現在の task で自分が作った変更以外は、すべてユーザーの変更として扱う。

3. commit scope を決める。
   - `projects/` 配下の Project 本体は local-only であり、通常は commit 対象にしない。`projects/README.md`、`projects/active/README.md`、`projects/archive/README.md` のような置き場説明だけ commit 対象にしてよい。
   - 1 commit につき 1 つの意図を基本にする。例: `notes/shared/` の workflow 更新、`.agents/skills/<skill-name>/` の skill 更新、`.gitignore` / README による保存場所ルール更新。
   - `notes/shared/` の変更は、同じ継続的な更新に含まれる場合を除き、`.agents/skills/` や repository 設定変更とは分けて commit する。
   - `.gitignore`、`projects/README.md`、`notes/*/README.md` のような保存場所ルール更新と、`.agents/skills/` の skill 更新は別 commit にする。片方は repository structure の変更、もう片方は agent behavior の変更であり、why が異なるため。
   - `notes/local/` は git commit に残したくない note の置き場なので、絶対に stage しない。`notes/local/README.md` だけは置き場の説明として commit 対象にしてよい。
   - 無関係な編集は staged にしない。
   - 1 file に無関係な更新が混ざっている場合、hunk が明確に分けられ、かつユーザーが commit を依頼しているとき以外は partial staging を避ける。
   - きれいな commit にするためだけに、ノート内容を revert、discard、rewrite しない。

4. note content を review で確認する。
   - この vault には通常 automated test はない。
   - 重要な日付がある場合、"today" や "tomorrow" のような相対表現ではなく絶対日付になっているか確認する。
   - 事実と推測が混ざっていないか確認する。
   - git 管理対象に、個人情報、候補者情報、顧客情報、社内限定 URL、社内固有の運用詳細が含まれていないか確認する。
   - 具体的な内部リンクや固有名詞を残す必要がある場合は、git 管理対象ではなく `notes/local/` や local-only project に置く。

5. stage して commit する。
   - 選んだ files または hunks だけを stage する。
   - `git status --short` を再実行して staged set を確認する。
   - staged set に `notes/local/` 配下のファイルが入っていないことを確認する。
   - recent vault history に合う message で commit を作る。
   - ユーザーが依頼していない限り、push、tag、PR 作成はしない。

## Commit Message

recent commits から style を推測する。強い local convention がない場合は、以下のいずれかを使う。

```text
chore(vault): update commit workflow
chore(vault): update note storage rules
chore(vault): update project directory guide
chore(skill): update <skill-name>
docs(notes): update shared workflow note
docs(projects): update project directory readme
```

commit message は、次の方針を参考にする。

```text
コードには How
テストコードには What
コミットログには Why
コードコメントには Why not
```

参考: [t_wada さんの投稿](https://x.com/t_wada/status/904916106153828352?lang=ja)

subject は簡潔かつ事実ベースにする。何を変えたかを短く表し、diff を読めば分かる細部を詰め込まない。

commit message では、diff から読み取れる what / how よりも、後から読む人が失いやすい why を優先する。body は必要なときだけ書き、次のような diff だけでは分からない文脈を残す。

- なぜこの変更が必要だったか。
- なぜこの単位で commit したか。
- なぜ別案ではなくこの運用・構成にしたか。
- どのリスクを避けるための変更か。
- どの follow-up が残っているか。

body が単に変更ファイルや diff の内容を言い換えるだけなら書かない。逆に、背景・判断・制約・残課題が future reader の助けになるなら、2〜5 行程度で短く書く。

## 最終報告

commit が成功したら、以下を報告する。

- commit hash と subject
- 含めた files の概要
- 実施した verification。通常は diff/content review
- 残っている unstaged または untracked changes

Codex desktop 内で実行して commit を作成した場合は、final response に必要な git commit directive を含める。
