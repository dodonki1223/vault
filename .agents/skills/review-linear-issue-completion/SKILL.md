---
name: review-linear-issue-completion
description: Linear issue の実装が完了した後に、description の完了条件（動作確認欄があればそれも含む）を実際に満たしているかをレビューする。issue URL や ID を受け取り、comment に残された完了報告や、関連 PR / commit の diff と突き合わせて、完了条件ごとに満たしている / 未達 / 判断不可を判定する。完了条件自体の書き方や issue の構造レビューは行わない。Linear への書き込みや status 変更、GitHub への書き込みは行わない。
---

# Linear Issue 完了条件レビュー

## 目的

実装がひと通り終わった Linear issue について、description の完了条件を実際の成果物（comment の完了報告、関連 PR / commit の diff など）と突き合わせ、前進したと判断できるかをレビューする。

この skill はレビュー専用。Linear や GitHub への書き込み、issue の status 変更は行わない。

## 境界

- 完了条件そのものの書き方・粒度・issue の構造レビューは `review-linear-structure` に任せる。
- Linear への書き込み（comment 追加、status 変更、description 更新）は `write-linear-issue` に任せる。
- 情報取得だけで足りる場合は `fetch-linear-materials` を使う。
- GitHub 側の詳細な取得（PR diff、CI 状態など）が必要な場合は `fetch-github-materials` を使う。
- 完了条件が曖昧・未記載の issue を、この skill が推測で埋めない。

## 事前確認

レビュー前に、ユーザーの依頼から次を特定する。

- 対象: issue URL または ID。
- 関連する PR / commit があれば、その情報（分かる範囲でよい）。
- 観点: 完了条件全体を見るか、特定の条件だけ見るか、動作確認の実施有無まで見るか。

対象が不明な場合だけ、短く確認する。

## 取得方針

1. `fetch-linear-materials` の考え方に従い、対象 issue の description（完了条件、動作確認欄を含む）、status、comment を read-only で取得する。
2. Linear 側で diff を確認できる tool（`list_diffs` / `get_diff` / `get_diff_threads` など）が使える場合、issue に紐づく PR の diff を取得し、実装内容を確認する。
3. Linear 側で diff が見えない、または情報が不足する場合は、description や comment にある GitHub PR / commit の link を確認し、必要なら `fetch-github-materials` で diff や CI 状態を取得する。
4. 認証エラー、権限不足、対象不明の場合は、レビュー結果ではなく `失敗時` のフォーマットで返す。

## 完了条件の解釈

- description の `完了条件` 見出しの箇条書きを判定単位にする。
- `動作確認` 欄がある場合は、実施すべき確認事項として扱い、実施済みかどうかも合わせて確認する。
- `完了条件` が書かれていない、または曖昧で判定単位に分解できない場合は、無理に推測して判定しない。`確認が必要な点` に「完了条件が明確でない」と残し、必要なら `review-linear-structure` や `write-linear-issue` で先に完了条件を明確にすることを提案する。

## 判定基準

各完了条件を、次のいずれかで判定する。

- 満たしている: comment の完了報告、diff の内容、動作確認の記録など、具体的な根拠がある。
- 未達: 実装や確認が行われていない、または反対の証拠がある。
- 判断不可: 根拠となる情報が取得できない、または内容が曖昧で判断できない。

status（Done / In Progress など）と判定結果が矛盾する場合は、その旨を明記する。

- 全条件が「満たしている」で、status がまだ完了扱いでない場合は、完了扱いにできる候補として提示する。
- status がすでに完了扱いなのに、未達または判断不可の条件が残る場合は `気になる点` に明記する。

## 返答フォーマット

```markdown
## Issue 完了条件レビュー結果

- 対象 issue:
- 現在の status:
- 結論: 完了条件を満たしている / 一部未達 / 判断保留

## 完了条件ごとの判定

- <完了条件 1>: 満たしている / 未達 / 判断不可 — 根拠:
- <完了条件 2>: 満たしている / 未達 / 判断不可 — 根拠:

## 確認した根拠

-

## 気になる点

-

## 確認が必要な点

-

## 推奨する次のアクション

-
```

大きな問題がない場合は `気になる点` に「大きな問題は見つかりませんでした」と書く。

## 失敗時

Linear や関連 PR から必要な情報が取得できなかった場合は、レビュー結果ではなく次を返す。

```markdown
## Issue 完了条件レビュー未実施

- 対象:
- 理由: tool 未検出 / 再認証が必要 / 権限不足 / 対象不明 / 完了条件が記載されていない
- 確認したこと:
- 次にユーザーが行うこと:
- 再試行条件:
```
