---
name: check-token-usage
description: ccusage と repository の pnpm script を使って token usage と推定 cost を確認する。ユーザーが「今日の token 使用量」「昨日はいくら使ったか」「今週 / 今月の usage」「session ごとの usage」など、Codex / Claude Code CLI の local usage log に基づく利用量確認を依頼したときに使う。請求額の正本確認や外部 billing 取得は行わない。
---

# Token Usage 確認

## 概要

`ccusage` を直接叩かず、自然言語の期間指定から適切な `pnpm usage:*` を選んで token usage と推定 cost を確認する。

この skill は local usage log に基づく read-only 確認だけを行う。請求額の正本確認、料金表の更新、usage log の保存、外部 billing の取得は行わない。

## 期間の扱い

日付が重要なため、相対表現は必ず JST の絶対日付に変換してから実行する。

- 今日: 現在日の `YYYY-MM-DD JST`。
- 昨日: 現在日の 1 日前。
- 直近 7 日 / 今週: 必要に応じて `pnpm usage:weekly` を使う。これは直近 7 日分の日別表示。
- 今月: `pnpm usage:monthly` を使う。
- session ごと: `pnpm usage:session` を使う。
- 期間指定が曖昧な場合は、対象期間を 1 つだけ確認する。

## コマンド選択

基本は repository の `pnpm` script を使う。

```bash
pnpm usage:today
pnpm usage:daily
pnpm usage:weekly
pnpm usage:session
pnpm usage:monthly
```

任意の日付範囲を指定する場合は、`usage:daily` に `--` 経由で `ccusage` の option を渡す。

```bash
pnpm usage:daily -- --since YYYY-MM-DD --until YYYY-MM-DD
pnpm usage:daily -- --since YYYY-MM-DD --until YYYY-MM-DD --json
```

出力整形が必要な場合だけ `--json` を使う。まずは通常出力を読み、足りない場合に JSON を使う。

## 返答フォーマット

返答は必要な指標だけに絞る。取得できない指標は `不明` と書き、推測で埋めない。

```markdown
## Token Usage

対象: YYYY-MM-DD JST
source: ccusage codex daily

- total tokens:
- input tokens:
- output tokens:
- cache read tokens:
- reasoning output tokens:
- estimated cost:

## 補足

- cost は local usage log と ccusage による推定。
- 請求額の正本ではない。
```

週次や月次の場合は、合計と日別の大きな傾向だけを返す。長い table 全体を貼る必要はない。

## session が重くなっているかの判断

`pnpm usage:session` で他の直近 session と並べて比較する。絶対的な token 数・cost の閾値はユーザーの予算次第でこの skill では固定しない。

- 対象 session の total tokens または推定 cost が、直近の session に比べて明らかに大きい（目安: 2〜3 倍以上）場合、別 session への切り替えを一言だけ添える。
- 判断材料が乏しい場合（session 数が少ない、比較対象がないなど）は、切り替え判断を避けて数値だけ返す。
- 固定の閾値を決めて自動的に知らせたい場合は、別 task の `token usage 高騰通知 skill` を案内する。この skill では自動通知は行わない。

## 実行後の確認

- 対象期間がユーザーの依頼と一致しているか確認する。
- `estimated cost` は必ず推定であると明記する。
- `ccusage` が local log を見つけられない場合は、取得できなかった理由と次に確認することを短く返す。
- Codex / Claude Code / desktop app など、どの usage が含まれるか不明な場合は、source の制約として明記する。

## 境界

- この skill では usage log を保存しない。
- この skill では billing portal や外部請求情報を取得しない。
- この skill では model 単価を独自に更新しない。
- この skill では token usage の改善提案を長く展開しない。必要なら別 task として扱う。
