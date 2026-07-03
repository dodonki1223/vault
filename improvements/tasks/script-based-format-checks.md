# script による体裁チェックの仕組み

## 背景

fetch 系 skill の体裁チェック script を作ったことで、文章中心の repository でも script による軽い検証が有効そうだと分かった。

今後、skill や workflow skill が増えると、人の目だけでは必須セクション、境界、agent 設定、README / catalog との整合が崩れやすい。

## ほしい状態

- skill や workflow skill を変更した後、手動で体裁チェックを実行できる。
- どの file のどの観点が崩れているかが分かる。
- 最初は warning に留め、commit を止める hook にはしない。
- check の基準は script 内に散らしすぎず、必要なら README や reference に移せる。

## 最初にやること

- 既存の `validate:fetch-skills` を参考に、他の skill 種別にも広げるべきか検討する。
- 対象候補を分ける。
  - fetch 系 skill。
  - write 系 skill。
  - review 系 skill。
  - workflow skill。
  - catalog / README / symlink 整合。
- `pnpm validate:*` の命名を揃える。
- warning と error の使い分けを決める。

## 関連

- `.agents/scripts/validate-fetch-skills.mjs`
- `pnpm validate:fetch-skills`
- `.agents/skills/README.md`
- `.agents/README.md`

## 完了条件

- 体裁チェック対象と責務が明確になる。
- 必要な script が `pnpm` から実行できる。
- README に実行方法と、warning の扱いが書かれている。
- 既存 skill に対して実行し、結果が確認できている。

## 残課題

- 将来的に必要になった場合だけ pre-commit hook 化を検討する。
- Claude Code 側でも同じ script を使えるか確認する。
