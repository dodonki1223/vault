# fetch 系 skill の体裁チェック script

## 背景

fetch 系 skill を変更したときに、全 fetch 系 skill の体裁が揃っているか確認できる script がほしい。

## 方針

- まずは hook 強制ではなく、手動実行できる検証 script として作る。
- この repository は文章中心なので、Node.js の標準ライブラリだけで動く単一 file script にする。
- 依存 package は増やさず、`pnpm install` 以外を不要にする。
- Node.js の version は `.mise.toml` で固定済み。
- `package.json` は build や application 化ではなく、vault 運用 script の入口として使う。
- package manager は `pnpm` を使う。
- clone した環境では、検証 script や token usage 確認を使う場合に Node.js が必要であることを README などに書く。

## 候補 path

- `.agents/scripts/validate-fetch-skills.mjs`

## 確認したいこと

- `fetch-*materials` 系 skill が同じ必須セクションを持っているか。
- frontmatter に `name` と `description` があるか。
- folder 名と skill 名が一致しているか。
- `agents/openai.yaml` があるか。
- 取得、分類、更新、レビューの境界が書かれているか。
- 取得結果を `classify-fetched-materials` に渡す前提になっているか。

## 最初にやること

- Node.js 標準ライブラリだけで `SKILL.md` と `agents/openai.yaml` を検査する script を作る。
- `pnpm validate:fetch-skills` のような script を追加する。
- 最初は warning 出力だけにする。

## 完了条件

- fetch 系 skill の追加・変更時に手動で体裁チェックできる。
- どの skill のどのセクションが足りないかが分かる。

## 残課題

- 将来的に必要になったら、`.githooks/pre-commit` からこの script を呼ぶ。ただし最初から commit を止める hook にはしない。
