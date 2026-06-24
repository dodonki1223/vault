# Vault 改善 backlog

## 目的

この note は、vault の運用改善でまだ対応できていないことだけを残す場所。

過去の改善メモにあった内容のうち、すでに skill / workflow / README に反映済みのものはここへ残さない。次に改善するときは、この note を見て候補を選ぶ。

## 未対応

### fetch 系 skill の出力形式の実地確認

fetch 系 skill の返答が、`classify-fetched-materials` に渡しやすい粒度になっているかを実際の Project 更新で確認する。

見ること:

- 情報が長すぎないか。
- source link が表示名付きで残っているか。
- 取得理由が分類に役立つか。
- Slack / Linear / Notion / GitHub で返答粒度が大きくずれていないか。
- 認証切れや権限不足の返答が、ユーザーの次アクションに直結しているか。

### Linear 書き込み skill の実地確認

Linear の issue、Project、Milestone を作成・更新する write 系 skill を、実際の安全な対象で確認する。

見ること:

- fetch 系 skill は read-only のままにし、Linear 書き込み機能とは分ける。
- 書き込み前の draft とユーザー確認が十分に安全か。
- issue / Project / Milestone ごとに責務が分かれているか。
- 実行後に、変更した対象、変更内容、Linear link、失敗理由が返るか。
- Linear connector / MCP / CLI のどれを標準の write 経路にするか。
- 誤更新を避けるための confirmation format をどうするか。

### Project 更新 workflow の実運用テスト

`.agents/workflows/project-update.md` を使って、実際の Project 更新を 1 件試す。

確認すること:

- 対象 Project folder だけを読む運用で足りるか。
- fetch 系 skill に渡す入力を workflow から自然に決められるか。
- 取得結果、分類、`status.md` 更新、レビューの流れが重すぎないか。
- `review-project-status` の指摘が実際に整理に役立つか。

### 定期確認の設計

Project の定期確認を行う場合の最小ルールを決める。

決めること:

- 対象 Project をどう選ぶか。
- 確認頻度をどう決めるか。
- heartbeat / automation を使う場合、workflow とどう接続するか。

heartbeat / automation を設計する段階では、次の通知ポリシーも決める。

- 通知する条件。
  - ユーザー宛ての依頼やメンションが来た。
  - ブロッカー、期限変更、担当変更、重要な判断変更が出た。
  - 指定した Slack thread、Linear issue、GitHub PR に動きがあった。
- 通知しない条件。
  - 定型更新だけ。
  - bot 通知だけ。
  - 既に把握済みの状態確認だけ。
  - 対象外 channel や対象外 issue の更新。
  - 変化がない場合。

今の段階では、通知条件は Project 必須情報チェックリストには含めない。

## 次にやる候補

1. Linear 書き込み skill を安全な対象で実地確認する。
2. Project 更新 workflow を実際の Project で 1 回使い、重い部分を確認する。

## 判断メモ

- 取得、分類、更新、レビューは混ぜない。
- 外部サービスへの書き込みは、read-only の取得 skill と分ける。
- Project 更新は workflow、個別能力は skill として扱う。
- 新しい構造を増やす前に、既存の skill / workflow で運用できるかを試す。
