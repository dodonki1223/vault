---
name: review-linear-structure
description: Linear の Project、milestone、issue が Linear Method の原則に沿っているかレビューする。Project / milestone / issue URL や ID を受け取り、粒度、scope、完了条件、description と comment の使い分け、調査結果の反映、issue 分解の妥当性を確認したいときに使う。Linear への書き込みは行わない。
---

# Linear 構造レビュー

## 目的

Linear の Project、milestone、issue が、作業しやすく、読み返しやすく、Linear Method の考え方に合っているかをレビューする。

この skill はレビュー専用。Linear への書き込み、issue 作成、description 更新、comment 投稿は行わない。

## 境界

- Linear からの取得は read-only に限定する。
- 情報取得だけを行う場合は `fetch-linear-materials` を使う。
- 書き込みが必要になった場合は、レビュー結果として提案だけ返す。実際の書き込みは `write-linear-issue`、`write-linear-milestone`、`write-linear-project` に任せる。
- すべての issue を網羅しようとしない。ユーザーが「一部でよい」と言った場合は、代表 issue だけを見る。
- 社内固有の詳細や長いコメント全文をそのまま貼らない。レビューに必要な要点だけを短く扱う。

## 事前確認

レビュー前に、ユーザーの依頼から次を特定する。

- 対象: Linear Project / milestone / issue URL、ID、Project slug、issue identifier。
- 範囲: 全体レビュー / Project のみ / milestone のみ / issue のみ / 一部サンプル。
- 観点: 粒度、scope、完了条件、調査結果の残し方、description と comment の使い分け、優先度、issue 分解、milestone の依存関係など。

対象や範囲が不明な場合だけ、短く確認する。安全に狭く推測できる場合は、まず狭い範囲で取得する。

## 参照する原則

レビュー時は `.agents/references/linear-method-principles.md` を読み、対象に応じて次のセクションを使う。

- Project: `Project の原則` と `レビュー観点`
- Milestone: `Milestone の原則` と `レビュー観点`
- Issue: `Issue の原則`、`決定事項・調査結果の扱い`、`レビュー観点`

## 取得方針

1. `fetch-linear-materials` の考え方に従い、Linear connector / MCP で対象を read-only 取得する。
2. Project を見る場合は、Project description、status、target date、milestone 一覧を確認する。
3. milestone を見る場合は、description、target date、含まれる代表 issue を確認する。
4. issue を見る場合は、title、description、status、assignee、estimate、comment のうちレビュー観点に必要なものだけを見る。
5. 大きな Project では、代表 issue を数件だけ見る。
   - 調査 issue
   - 実装 issue
   - bug / blocker 系 issue
   - milestone を代表する issue
6. 取得できない場合は、認証、権限、対象不明、該当なしのどれかに分けて、次にユーザーが確認することを返す。

## レビュー観点

- Project が単なる issue の入れ物や時系列ログになっていないか。
- Project に目標、対象範囲、対象外、成功条件、主要 link があるか。
- Project が大きすぎる場合、milestone や段階に分かれているか。
- Project description で、milestone 全体の流れ、並列に進められる範囲、依存関係が分かるか。
- milestone が単なる日付ラベルではなく、中間成果と完了条件を持っているか。
- milestone 同士の前後関係、前提、後続への影響、target date の制約が分かるか。
- milestone の依存関係と target date が矛盾していないか。
- milestone の依存関係が複雑な場合、Mermaid などで並列に進められるものと順番が必要なものが分かるか。
- milestone に含まれる issue が、その milestone のアウトカムに直接つながっているか。
- issue が具体的な task / problem（作業または解くべき問題）になっているか。
- issue が大きすぎる feature、曖昧な idea、議論そのものになっていないか。
- 調査 issue で、調査観点、結論、成果物、後続 issue の要否が分かるか。
- comment にある決定事項や調査結果のうち、作業前提として必要なものが description に反映されているか。
- user experience（ユーザー体験）や product requirement（プロダクト要件）の詳細が issue に入りすぎていないか。
- enabler（実現したい価値を可能にするもの） / blocker（前進を止めている障害）の観点で、優先度や順序の理由が説明できるか。

## 返答フォーマット

```markdown
## Linear レビュー結果

- 結論:
- 取得範囲:

## 良さそうな点

-

## 気になる点

-

## 改善案

-

## 確認が必要な点

-
```

問題が大きくない場合は、`気になる点` に「大きな問題は見つかりませんでした」と書き、軽微な改善だけを短く述べる。

## 失敗時

Linear から取得できなかった場合は、レビュー結果ではなく次を返す。

```markdown
## Linear レビュー未実施

- 対象:
- 理由: tool 未検出 / 再認証が必要 / 権限不足 / 対象不明 / 該当なし
- 確認したこと:
- 次にユーザーが行うこと:
- 再試行条件:
```
