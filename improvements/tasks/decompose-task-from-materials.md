# 入力情報から必要タスクを分解する skill

## 背景

完了条件、関連情報、制約、既存の仕様や実装方針を入力として受け取り、作業時に読むだけで何をすればよいか分かる粒度のタスク一覧を作る skill を検討する。

## ほしい状態

- タスク達成に必要な完了条件が明確になっている。
- 関連情報をもとに、実装、調査、確認、レビュー、QA などの必要タスクが抜け漏れなく出る。
- 実装時に、そのタスク一覧を見れば必要な作業が把握できる。
- `API を実装する` のような大きすぎる単位ではなく、domain 層、validation、controller、test、migration、feature flag、ログ、権限、ドキュメントなどの作業単位に分解できる。
- タスク同士の依存関係や、並列に進められるものが分かる。
- Linear に書き込む前の draft として使える。

## 入力として渡したいもの

- 達成したいこと。
- 完了条件。
- 関連する仕様、決定事項、制約。
- 既存 issue / Project / milestone。
- 関連するコード、設計、ドキュメント。
- 除外すること。
- どの粒度で分解したいか。例: 実装者が作業開始できる粒度、Linear issue としてチームで確認できる粒度、PR 分割できる粒度、実装 checklist の粒度。

## 出力案

````markdown
## タスク一覧

### 1. <タスク名>

- 目的:
- 完了条件:
- 作業内容:
- 依存:
- 関連情報:
- Linear issue 候補: yes / no
- 実装 checklist 候補: yes / no

## 依存関係

```mermaid
graph TD
```

## 確認が必要な点

-
````

## Linear Method との扱い

- `linear-method-principles.md` では、team で確認できる単位は issue として扱う。
- sub issue は現時点では共通原則に含めず、個人の作業分解や実装 checklist に近い補助的なものとして扱う。
- Linear Method は、issue として切る粒度が妥当かを見る reference として使う。
- 細かくしすぎて管理コストが上がらないように、Linear に書く粒度と実装時に読む粒度を分ける。
- `write-linear-issue` に直接含めるのではなく、`decompose-task-from-materials` のような read-only skill にして、Linear 書き込みは別 workflow skill に渡すか。

## 完了条件

- read-only skill として作成されている。
- Linear に書く粒度と、実装時に読む checklist 粒度を分けられる。
- 出力から依存関係と並列化できる作業が分かる。

## 残課題

- review-linear-structure とどう接続するか。
