# fetch-web-materials skill の追加

## 背景

現在の fetch 系 skill は特定サービスの connector を前提にしている（`fetch-slack-materials`、`fetch-linear-materials`、`fetch-notion-materials`、`fetch-github-materials`、`fetch-google-meet-materials`、`fetch-google-sheets-materials`）。

一般的な Web ページ、ブログ記事、ニュース、公式ドキュメントなど、特定サービスの connector に依存しない Web からの情報取得を担う skill がなく、その都度アドホックに `WebFetch` / `WebSearch` を使っている。取得観点の絞り方、除外条件、返答フォーマットが他の fetch 系 skill と揃っていない。

## ほしい状態

- 既存 fetch 系 skill と同じ入出力パターンで、Web ページ・ブログ・ニュース・公式ドキュメントなどを取得できる。
  - 入力: 対象 URL または検索したい対象、期間、取得観点、除外条件。
  - 取得手段: `WebFetch` / `WebSearch` などの汎用ツール。特定サービス専用 connector は使わない（それは他の fetch skill の役割）。
  - 出力: 他の fetch 系 skill と同じ「取得範囲 / 取得結果 / 不足している可能性」形式。
- 取得のみ行い、事実・推測などへの分類や他ファイルへの統合は行わない（既存 fetch 系 skill と同じ境界）。
- URL が明示されている場合と、キーワードで検索する場合の両方に対応する。
- 取得できなかった場合（404、アクセス不可、ページ構造が読めないなど）の返答形式を他の fetch skill と揃える。

## 最初にやること

- `fetch-github-materials` など既存 fetch skill の SKILL.md 構成（事前確認する入力 / 取得 Workflow / 返答フォーマット / 境界 / 良い情報・悪い情報の例）をテンプレートとして流用する。
- `workflow-fetch-and-classify-materials` から呼び出せるように、他の fetch 系 skill と同じ粒度で組み込む。
- 特定サービス（GitHub の Web UI、Notion の公開ページなど）と重複する URL が来た場合に、専用 skill があればそちらを優先する旨を明記する。

## 関連

- `.agents/skills/fetch-github-materials/`
- `.agents/skills/fetch-slack-materials/`
- `.agents/skills/workflow-fetch-and-classify-materials/`
- `.agents/skills/classify-fetched-materials/`

## 完了条件

- read-only skill として `fetch-web-materials`（仮称）が作成されている。
- 他の fetch 系 skill と同じ返答フォーマット・境界を持つ。
- `workflow-fetch-and-classify-materials` から呼び出せる。

## 残課題

- skill 名（`fetch-web-materials` で確定するか）。
- 特定サービス専用 skill と URL が重複したときの優先順位の書き方。
