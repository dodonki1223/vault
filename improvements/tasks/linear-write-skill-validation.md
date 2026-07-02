# Linear 書き込み skill の実地確認

## 背景

Linear の issue、Project、Milestone を作成・更新する write 系 skill を、実際の安全な対象で確認する必要がある。

## 見ること

- fetch 系 skill は read-only のままにし、Linear 書き込み機能とは分ける。
- 書き込み前の draft とユーザー確認が十分に安全か。
- issue / Project / Milestone ごとに責務が分かれているか。
- 実行後に、変更した対象、変更内容、Linear link、失敗理由が返るか。
- Linear connector / MCP / CLI のどれを標準の write 経路にするか。
- 誤更新を避けるための confirmation format をどうするか。

## 関連

- `.agents/skills/write-linear-issue/`
- `.agents/skills/write-linear-project/`
- `.agents/skills/write-linear-milestone/`
- `.agents/skills/workflow-write-and-review-linear/`
- `.agents/skills/review-linear-structure/`

## 完了条件

- 安全な対象で各 write skill を最低 1 回確認できている。
- draft、確認、実行、レビューの流れが過不足なく動く。
- 失敗時に次にユーザーが行うことが分かる。

## 残課題

- connector 認証チェック harness と組み合わせる。
