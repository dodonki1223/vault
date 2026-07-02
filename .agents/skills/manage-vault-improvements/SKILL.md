---
name: manage-vault-improvements
description: vault repository の `improvements/` 配下にある改善 backlog と task file を管理する。ユーザーが新しい改善案の追加、既存 task の更新、優先度や状態の変更、完了済み task の削除、重複整理、backlog index の整合確認を依頼したときに使う。実際の改善実装、外部サービスへの書き込み、Project 本体の更新は行わない。
---

# Vault 改善管理

## 概要

`improvements/` は vault 全体の改善 backlog を管理する場所。`improvements/backlog.md` は index、`improvements/tasks/` は 1 task file 1 改善テーマの詳細置き場として扱う。

この skill は改善 backlog の衛生管理だけを担当する。改善そのものの実装、skill / script の作成、外部サービスへの書き込み、Project note の更新は別の依頼または別 skill で行う。

## 対象ファイル

- `improvements/backlog.md`: 改善案の index。状態、優先度、task file link、短い概要だけを置く。
- `improvements/tasks/README.md`: task file の書き方。
- `improvements/tasks/<task-name>.md`: 改善テーマごとの詳細。

`notes/` や `projects/` に改善 backlog を増やさない。vault 全体の改善案は `improvements/` に集約する。

## 基本ルール

- 1 task file につき 1 改善テーマにする。
- `backlog.md` には詳細を書かない。詳細は task file に置く。
- task file には、背景、ほしい状態、最初にやること、関連、完了条件、残課題を必要に応じて置く。
- 完了済み task は原則として `backlog.md` と `tasks/` から削除する。
- 完了 task の判断や運用ルールが後から必要なら、task file に残さず、成果物側へ移す。例: `README.md`、`.agents/README.md`、該当 skill、該当 reference。
- 完了理由や why は、必要なら commit message に残す。
- 個人情報、社内限定 URL、具体的な Project 本体の情報は入れない。

## 新しい改善案を追加する

1. 既存の `improvements/backlog.md` と `improvements/tasks/` を確認し、重複や近い task がないか見る。
2. 既存 task に追記すれば足りる場合は、新規 task を作らず既存 task を更新する。
3. 新規 task が必要な場合は、短い kebab-case の file 名を決める。
4. `improvements/tasks/<task-name>.md` を作成する。
5. `improvements/backlog.md` の `未対応` table に、状態、優先度、link、短い概要を 1 行追加する。
6. 優先度は `高`、`中`、`低` のいずれかにする。迷う場合は `中` にする。
7. `次にやる候補` に入れるのは、直近で本当に着手したい上位 3 件だけにする。

task file の最小形:

```markdown
# <改善テーマ>

## 背景

-

## ほしい状態

-

## 最初にやること

-

## 関連

-

## 完了条件

-

## 残課題

-
```

## 既存 task を更新する

1. `backlog.md` の index 行と task file の内容を両方確認する。
2. task の意図が変わる場合は、file 名や title も必要に応じて変更する。
3. backlog の概要は 1 文に保つ。詳細や議論は task file に移す。
4. 優先度や状態を変える場合は、理由が task file に残っているか確認する。
5. task 同士が重複してきた場合は、片方へ統合し、backlog から重複行を削除する。

状態は必要になるまで増やさない。基本は次の 3 つにする。

- `未着手`
- `進行中`
- `保留`

完了済みは backlog に残さない。削除する。

## task を完了扱いにする

1. task の完了条件を確認する。
2. 成果物側へ移すべき判断や運用ルールがないか確認する。
   - repository の使い方なら `README.md`
   - agent / skill 運用なら `.agents/README.md` または該当 skill
   - 共通原則なら `.agents/references/`
3. 必要な移管が済んでいる場合、`improvements/backlog.md` から該当行を削除する。
4. `improvements/tasks/<task-name>.md` を削除する。
5. `次にやる候補` に残っていれば削除または差し替える。
6. 削除後、リンク切れがないか確認する。

完了済み task の archive directory は作らない。完了履歴は git log に任せる。

## 整合性チェック

backlog を更新したら、次を確認する。

- `backlog.md` の link が存在する task file を指している。
- `tasks/` に、backlog から参照されていない不要な task file がない。ただし `tasks/README.md` は除く。
- `backlog.md` に長い詳細説明が入り込んでいない。
- 状態と優先度の表記が揃っている。
- 完了済み task が残っていない。
- `notes/shared/` に vault 改善 task が増えていない。
- 個人情報、社内限定 URL、具体的な Project 本体の情報が入っていない。

## 境界

- この skill では改善実装をしない。
- この skill では skill / script の中身を新規作成・大幅更新しない。必要なら別途ユーザーに確認して、該当 skill を使う。
- この skill では Linear、Notion、Slack、GitHub など外部サービスへ書き込まない。
- この skill では `projects/` 本体を更新しない。
- 完了済み task を archive として溜めない。
