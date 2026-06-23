# Vault 改善 backlog

## 目的

この note は、vault の運用改善でまだ対応できていないことだけを残す場所。

過去の改善メモにあった内容のうち、すでに skill / workflow / README に反映済みのものはここへ残さない。次に改善するときは、この note を見て候補を選ぶ。

## 対応済みとして扱うもの

- Slack / Linear / Notion / GitHub から指定対象の情報を取得する fetch 系 skill を作成した。
- fetch 系 skill は、取得だけを担当し、分類や Project への統合を行わない形に整理した。
- fetch 系 skill に、設定・認証チェックと、取得できなかった場合の返答方針を追加した。
- `create-project-note` skill を作成した。
- Project 作成テンプレートを `create-project-note/templates/` に外だしした。
- `review-project-status` skill を作成した。
- `status.md` 更新後の品質確認は `review-project-status` に委譲する方針にした。
- Project 更新全体は skill ではなく `.agents/workflows/project-update.md` の workflow として定義した。
- Project 本体は local-only とし、git commit 対象にしない方針を README に整理した。

## 未対応

### 取得情報を分類する skill

候補名: `classify-project-materials`

fetch 系 skill が返した取得結果を入力として受け取り、次の形に分類する。

- 事実
- 推測
- 重要リンク
- 未解決事項
- ユーザー対応待ち

この skill は外部情報を取得しない。Project 固有の優先度判断や `status.md` への統合も行わない。

### fetch 系 skill の出力形式の実地確認

fetch 系 skill の返答が、後続の分類 skill に渡しやすい粒度になっているかを実際の Project 更新で確認する。

見ること:

- 情報が長すぎないか。
- source link が表示名付きで残っているか。
- 取得理由が分類に役立つか。
- Slack / Linear / Notion / GitHub で返答粒度が大きくずれていないか。
- 認証切れや権限不足の返答が、ユーザーの次アクションに直結しているか。

### Project 更新 workflow の実運用テスト

`.agents/workflows/project-update.md` を使って、実際の Project 更新を 1 件試す。

確認すること:

- 対象 Project folder だけを読む運用で足りるか。
- fetch 系 skill に渡す入力を workflow から自然に決められるか。
- 取得結果、分類、`status.md` 更新、レビューの流れが重すぎないか。
- `review-project-status` の指摘が実際に整理に役立つか。

### Project の不足情報を可視化する仕組み

Project 作成時のヒアリングが十分にできなかった場合でも、不足した情報が確認されないまま進まないようにする。

改善案:

- `create-project-note` で、初期作成時に確認できなかった項目を `status.md` の `未解決事項` または `instructions.md` に残す。
- `project-update` workflow で、更新前に Project の不足情報を確認し、ユーザーに分かる形で返す。
- `review-project-status` で、重要な情報源、完了条件、通知条件、対象範囲などが欠けている場合に確認事項として出す。

不足として見たいもの:

- 目的と成功条件。
- ユーザーの責任範囲。
- 重要な情報源。
- 対象範囲と除外範囲。
- 通知してほしい条件。
- 通知しなくてよい条件。
- 完了条件または閉じる条件。

### 定期確認の設計

Project の定期確認を行う場合の最小ルールを決める。

決めること:

- 対象 Project をどう選ぶか。
- 確認頻度をどう決めるか。
- 通知する条件をどこに書くか。
- 変化がない場合に何も通知しない運用をどう明記するか。
- heartbeat / automation を使う場合、workflow とどう接続するか。

## 次にやる候補

1. `classify-project-materials` skill を作る。
2. Project の不足情報を可視化する項目を `create-project-note` / `project-update` / `review-project-status` のどこに入れるか決める。
3. Project 更新 workflow を実際の Project で 1 回使い、重い部分を確認する。

## 判断メモ

- 取得、分類、更新、レビューは混ぜない。
- Project 更新は workflow、個別能力は skill として扱う。
- 新しい構造を増やす前に、既存の skill / workflow で運用できるかを試す。
