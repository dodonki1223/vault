# Project 更新 workflow skill の実運用テスト

## 背景

`workflow-update-project-note` skill を使って、実際の Project 更新を 1 件試す。

## 確認すること

- 対象 Project folder だけを読む運用で足りるか。
- fetch 系 skill に渡す入力を workflow skill から自然に決められるか。
- 取得結果、分類、`status.md` 更新、レビューの流れが重すぎないか。
- `review-project-status` の指摘が実際に整理に役立つか。

## 関連

- `.agents/skills/workflow-update-project-note/`
- `.agents/skills/classify-fetched-materials/`
- `.agents/skills/review-project-status/`
- `.agents/skills/fetch-*`

## 完了条件

- 実際の Project で workflow を 1 回通している。
- 重い step、曖昧な step、抜けやすい step が分かっている。
- 必要な改善が task file か skill に反映されている。

## 残課題

- token usage / model selection と合わせて見る。
