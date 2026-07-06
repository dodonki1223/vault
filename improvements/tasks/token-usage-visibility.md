# トークン使用量とコストの可視化

## 背景

1 回の依頼でどれだけ token を使ったのか、概算でいくらかかったのか、今日どれくらい使ったのかを把握できるようにする。

## ほしい状態

- 依頼単位で、入力 token、出力 token、合計 token、概算コストが分かる。
- 1 日単位で、合計 token、概算コスト、重かった依頼が分かる。
- session 単位で token / cost が大きくなっている場合に、別 session へ切り替える目安が分かる。
- Project 更新、Linear 書き込み、外部情報取得など、どの workflow skill / capability skill が重いのか見える。
- 使いすぎている場合に、情報取得範囲を狭める、分割する、要約を挟むなどの改善につなげられる。

## 検討すること

- ~~Codex / Claude Code など、利用する agent ごとに token usage を取得できる場所があるか確認する。~~ → 解決。`ccusage` は `claude` / `codex` を data source ID として持ち、`ccusage claude daily` / `ccusage codex daily` のように agent 別に絞れる。agent 指定なしの `ccusage daily` は検出できた全 source を合算する。`package.json` の `usage:*` (合算) と `usage:*:codex` / `usage:*:claude` (agent 別) に反映済み (2026-07-06)。
- Claude Code / Codex CLI の local usage を見るために `ccusage` を使う。
- session / turn / command ごとの usage log を local に残せるか確認する。
- 同じ session を使い続けることで context が肥大化し、token / cost が増えているか確認する。
- session ごとの token / cost が一定の目安を超えた場合に「別 session を開始してください」と知らせる仕組みを検討する。
- 自動通知が必要な場合は、別 task の `token usage 高騰通知 skill` で扱う。
- 料金は model ごとに変わるため、価格表を直接埋め込まず、model 名、入力 token、出力 token、計算日時を残す。
- 概算コスト計算は、手動更新できる小さな設定 file に分ける。
- local-only の使用量 log は git commit 対象にしない。

## 候補

- `pnpm usage:today`
- `pnpm usage:daily`
- `pnpm usage:weekly`
- `pnpm usage:monthly`
- `pnpm usage:session`
- `.agents/scripts/summarize-token-usage.mjs`
- `.agents/references/token-cost-config.example.json`
- `notes/local/token-usage/` または `.agents/local/token-usage/`
- `token usage 高騰通知 skill`

## 最初にやること

1. `ccusage` で Claude Code / Codex CLI の usage がどこまで見えるか確認する。
2. `ccusage` で足りる場合は、独自 script は作らず README か workflow skill に利用方法だけ残す。
3. 足りない場合だけ、今日の合計 token と依頼単位の上位を表示する read-only script を検討する。
4. コスト計算は概算として扱い、model 単価が不明な場合は token 数だけ表示する。
5. session ごとの token / cost を見て、別 session へ切り替える警告条件を決める。
6. Project 更新 workflow skill など、重い workflow skill の最後に token usage を返せるか検討する。

## 完了条件

- 今日、直近 7 日、月次、session 単位の usage を確認できる。
- session が重くなっている場合に、別 session へ切り替えるべきか判断できる。
- cost は推定であることが明記されている。
- local usage log を git 管理しない。

## 残課題

- model 単価の追従方法。
