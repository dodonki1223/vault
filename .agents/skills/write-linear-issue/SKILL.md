---
name: write-linear-issue
description: Linear issue の作成・更新を行う。issue title、description、team、assignee、status、label、priority、due date、project、milestone、comment などの変更依頼を受け、実行前に draft と対象を確認してから Linear に書き込む。情報取得だけの場合は fetch-linear-materials を使う。
---

# Linear Issue 書き込み

## 目的

Linear issue の作成・更新だけを担当する。情報取得、Project note への統合、複数対象をまたぐ進行管理は行わない。

## 境界

- fetch 系 skill ではない。read-only の取得だけなら `fetch-linear-materials` を使う。
- Linear Project や Milestone 自体の作成・更新は行わない。
- ユーザーが明示的に依頼していない書き込みは行わない。
- token、OAuth code、API key、cookie を受け取らない・保存しない。
- 書き込み結果を Project note に自動反映しない。

## 事前確認

書き込み前に、次を特定する。

- 操作: create / update / comment / assign / status change / label change など。
- 対象: issue ID / issue URL。新規作成なら team と title。
- タスク種別: 実装タスク / 調査タスク / その他。
- 変更内容: title、description、status、assignee、label、priority、due date、project、milestone、comment。
- 理由: なぜこの変更が必要か。

対象、変更内容、理由のどれかが曖昧な場合は、実行前に短く確認する。

## Issue 本文テンプレート

新規 issue 作成、または description を大きく更新する場合は、タスク種別に応じて次の大項目を使う。分からない項目は無理に埋めず、`未確定` として残すか、実行前に確認する。

## Linear Method の参照

Issue の作成・更新前に、必要に応じて `.agents/references/linear-method-principles.md` の `Issue の原則`、`決定事項・調査結果の扱い`、`レビュー観点` を読む。

### 実装タスク

```markdown
## 背景

-

## 目的

-

## 対応内容

-

## 完了条件

-

## 動作確認

-

## 影響範囲

-

## 補足

-
```

### 調査タスク

```markdown
## 背景

-

## 調査目的

-

## 調査観点

-

## 結論

- 未調査

## 成果物

-

## 完了条件

-

## 補足

-
```

## 本文作成方針

- タイトルだけで分かる内容を本文に重複して長く書かない。
- `対応内容` には実装する作業を箇条書きで書く。設計判断や未確定事項を混ぜない。
- `動作確認` には確認する画面、API、テスト、再現条件などを書く。
- `調査観点` には確認したい問いを書く。調査前の結論を書かない。
- `結論` は調査後に更新する。新規作成時点で未調査なら `未調査` と置くか、見出し自体を省略してよい。
- `成果物` には、調査後に何を残せば完了かを書く。例: 方針案、影響範囲、実装 issue の分割案。
- 社内固有の詳細やアクセス制限のある URL は、ユーザーが明示した場合だけ入れる。

## 決定事項・調査結果の書き込み方針

- 調査途中のメモ、議論、候補案、確認ログは comment に残す。
- 決定した結論、採用方針、実装時に必要な前提は description に短く反映する。
- 長い仕様、詳細な調査結果、比較表、議事録は docs / spec に置き、issue には要点と link だけを残す。
- issue 完了時の成果は comment に残す。必要なら description の `完了条件` や `補足` に要約を反映する。
- comment は時系列の経緯、description は最新の作業前提として使い分ける。

## 参考

- `.agents/references/linear-method-principles.md`

## 実行手順

1. 利用可能な Linear connector / MCP / CLI を確認する。
2. 対象 issue または作成先 team が正しいか read-only で確認する。
3. 実行前に draft を提示する。
4. ユーザーが明示的に承認した場合だけ書き込む。
5. 実行後、変更した対象、変更内容、Linear link を返す。

## Draft フォーマット

```markdown
## Linear issue 書き込み draft

- 操作:
- 対象:
- Team:
- Title:
- タスク種別:
- 変更内容:
- Description:
- 理由:
- 実行後に返す link:

この内容で Linear に書き込んでよいか確認してください。
```

## 返答フォーマット

```markdown
## Linear issue 書き込み結果

- 結果: 成功 / 失敗 / 未実行
- 対象:
- 変更内容:
- Link:
- 補足:
```

## 失敗時

認証切れ、権限不足、対象不明、team 不明、validation error の場合は、追加書き込みを止めて次を返す。

- 失敗した操作。
- 対象。
- 失敗理由。
- ユーザーが次に行うこと。
- 再試行条件。
