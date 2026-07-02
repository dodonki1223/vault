# サブエージェント並列化とモデル選択

## 背景

情報取得、分類、レビュー、書き込み draft 作成などを、必要に応じてサブエージェントで並列に動かせるようにする。

今後はコストの兼ね合いで、用途に応じて model を適切に選ぶことも重要になる。

## ほしい状態

- Slack、Linear、Notion、GitHub、Google Meet、Google Sheets など、情報源ごとの取得を並列化できる。
- 取得、分類、レビュー、draft 作成の責務を分けたまま、workflow skill 全体の待ち時間を短くできる。
- 単純な取得や形式チェックには軽い model、判断や統合が必要な箇所には強い model を使える。
- サブエージェントの出力は、事実、推測、重要リンク、未解決事項、ユーザー対応待ちなど、後続処理に渡しやすい形に揃える。
- サブエージェントが勝手に書き込みや file 編集をしないように、read-only / write の境界を明確にする。

## 検討すること

- workflow skill ごとに、どの step を並列化できるかを明記する。
- サブエージェントに渡す入力 format と、返してほしい出力 format を揃える。
- model 選択の基準を作る。例: 取得は軽量、分類は中程度、統合判断やレビューは高性能。
- token / cost 可視化とつなげて、重い workflow skill でどの model が使われたか確認できるようにする。
- サブエージェント結果をそのまま note や Linear に貼らず、メイン agent が統合判断を行う。

## 暫定モデル選択ポリシー

| 用途 | Codex | Claude Code |
|---|---|---|
| 通常の実装、コード修正、テスト追加、軽い調査 | GPT-5.5 + Medium | Sonnet |
| 難しい設計判断、難しい調査、難しい実装計画 | GPT-5.5 + High | Opus |
| 仕様が明確な軽作業、文章整形、単純な差分確認、要約 | GPT-5.5 + Low または Medium | 可能なら Haiku |
| 長時間の自律的な作業 | 計画に High。実装は Medium | 計画に Opus。実装は Sonnet |

## 運用方針

- 迷ったら、最初の計画やリスク判定だけ強い model を使い、実装や単純作業は medium / lightweight に落とす。
- 高コスト model を使った場合は、なぜ必要だったかを簡単に説明できる状態にする。
- token usage と合わせて、どの用途でどの model が重かったかを後から見られるようにする。
- model 名や料金は変わるため、この表は固定ルールではなく定期的に見直す。

## 最初に試すなら

1. Project 更新 workflow skill で、情報源ごとの fetch を read-only サブエージェントに分ける。
2. 各サブエージェントの出力を `classify-fetched-materials` に渡しやすい形に揃える。
3. メイン agent が分類結果を統合し、`status.md` 更新や返答を作る。
4. 実行時間、token、確認漏れが改善するかを見る。

## 完了条件

- 並列化できる step とできない step が workflow skill ごとに分かる。
- model 選択の暫定方針が運用に反映されている。
- token usage と model 選択を後から振り返れる。

## 残課題

- Codex / Claude Code で同じ粒度の model 指定ができるか確認する。
