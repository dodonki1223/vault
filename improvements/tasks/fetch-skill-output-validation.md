# fetch 系 skill の出力形式の実地確認

## 背景

fetch 系 skill の返答が、`classify-fetched-materials` に渡しやすい粒度になっているかを実際の Project 更新で確認する必要がある。

## ほしい状態

- 情報が長すぎない。
- source link が表示名付きで残っている。
- 取得理由が分類に役立つ。
- Slack / Linear / Notion / GitHub / Google Meet / Google Sheets で返答粒度が大きくずれていない。
- 認証切れや権限不足の返答が、ユーザーの次アクションに直結している。

## 最初にやること

- 実際の Project 更新で fetch 系 skill を 1 つずつ使う。
- 出力を `classify-fetched-materials` に渡し、分類しやすいか確認する。
- 粒度や不足している欄があれば fetch 系 skill に反映する。

## 関連

- `.agents/skills/fetch-slack-materials/`
- `.agents/skills/fetch-linear-materials/`
- `.agents/skills/fetch-notion-materials/`
- `.agents/skills/fetch-github-materials/`
- `.agents/skills/fetch-google-meet-materials/`
- `.agents/skills/fetch-google-sheets-materials/`
- `.agents/skills/classify-fetched-materials/`

## 完了条件

- 主要な fetch 系 skill の返答粒度が揃っている。
- 取得失敗時の返答が、ユーザーの次アクションに直結している。
- `classify-fetched-materials` に渡したときに余計なログ整理が必要ない。

## 残課題

- Google Sheets など新しく追加した fetch skill は、追加後に同じ観点で確認する。
