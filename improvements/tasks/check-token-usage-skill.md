# token usage 確認 skill

## 背景

`ccusage` を直接叩かなくても、「昨日はいくら使った？」「今日の token は？」「今月どれくらい？」のような自然言語で token usage と概算コストを確認できる skill を作る。

## 候補 skill

- `check-token-usage`

## やること

- 「今日」「昨日」「今月」などの相対表現を JST の絶対日付に変換する。
- 対象に応じて `pnpm usage:daily`、`pnpm usage:session`、`pnpm usage:monthly` を使い分ける。
- 必要に応じて `--since YYYY-MM-DD`、`--until YYYY-MM-DD`、`--json` を付ける。
- 結果を total tokens、input tokens、output tokens、cache read tokens、reasoning output tokens、estimated cost に絞って返す。
- 請求額の正本ではなく、local usage log と `ccusage` による推定であることを明記する。

## 返答イメージ

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

- cost は推定。
- 対象は local usage log に残っている Codex / Claude Code CLI usage。
```

## 最初にやること

- 最初は script を作らず、skill から `pnpm usage:*` を呼ぶだけで始める。
- 整形や比較が必要になったら `.agents/scripts/check-token-usage.mjs` を検討する。

## 完了条件

- 自然言語の期間指定から usage command を選べる。
- 出力が必要な指標に絞られている。
- 推定 cost であることが明記されている。

## 残課題

- Claude Code の usage と Codex CLI の usage を同じ skill で扱うか。
