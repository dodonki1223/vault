---
name: workflow-create-business-definition-sheet
description: >-
  業務定義シートの元になる資料が Slack、Notion、Docs、GitHub、Google Meet
  など外部システムにある場合に、対応する fetch 系 skill で資料を取得し、
  `create-business-definition-sheet` に渡して業務定義シートを作成する
  workflow skill。資料をユーザーが直接渡す場合や、対話だけで作る場合は
  `create-business-definition-sheet` を直接使う。
---

# 業務定義シート作成 workflow(外部資料から)

## 目的

業務定義シートの元になる資料が外部システムにあるとき、資料の取得と業務定義シートの作成をつなぐ進行役。

この skill は資料取得を fetch 系 skill に、シートの項目抽出・インタビュー・保存先確認・作成を `create-business-definition-sheet` に委譲する。

## 入力

- 対象業務。分かっている範囲の業務名。
- 資料の在り処。Slack channel/thread、Notion page、Docs、GitHub repo/issue/PR、Google Meet 議事録など。
- 取得観点。指定がなければ、業務定義シートの 9 項目(業務名、担当者・関係者、トリガー、所要時間、発生頻度、目的、INPUT、DO、OUTPUT)全体を観点とする。

## 使う skill

- fetch 系 skill(対象に応じて選ぶ): `fetch-slack-materials` / `fetch-notion-materials` / `fetch-github-materials` / `fetch-google-meet-materials` / `fetch-google-sheets-materials` / `fetch-web-materials`
- `classify-fetched-materials`: 資料が複数の情報源にまたがる場合、統合前の整理に使う。単一の資料だけで済む場合は省略してよい。
- `create-business-definition-sheet`: 取得した資料をもとに業務定義シートを作成する。

## 手順

1. 資料の在り処を確認する。
   - すでに資料の場所(URL、channel 名、doc 名など)が分かっている場合は再確認しない。
   - その資料で業務定義シートの 9 項目のうちどこまでカバーできそうかも併せて確認する。

2. 対応する fetch 系 skill を選び、資料を取得する。
   - 対象、期間、取得観点(=業務定義シートの 9 項目に関係する内容)、除外条件を渡す。
   - 資料が複数の情報源にまたがる場合は、情報源ごとに fetch 系 skill を呼び、必要なら `classify-fetched-materials` で整理する。
   - 取得できなかった場合は、該当する fetch 系 skill の「取得できなかった場合の返答」形式をそのまま返し、この先には進まない。

3. 取得結果を `create-business-definition-sheet` に渡す。
   - 取得結果をそのまま渡し、業務定義シートの 9 項目のうちどれをカバーしていそうかを一言添える。
   - 項目の抽出、不足分のインタビュー、保存先確認、ファイル作成は `create-business-definition-sheet` 側の手順に従う。

4. 結果を返す。
   - 取得した資料の情報源。
   - `create-business-definition-sheet` が返した作成結果と、不明・要ヒアリングの項目。

返答には次の形を含める。

```markdown
## 資料取得

- 情報源:
- 取得できなかったもの:

## 作成結果

(create-business-definition-sheet の返答をそのまま含める)
```

## 境界

- この skill 自体は業務定義シートの項目抽出、インタビュー、ファイル作成を行わない。すべて `create-business-definition-sheet` に委譲する。
- 資料取得の認証確認や tool discovery の詳細はこの skill に書かず、各 fetch 系 skill の手順に従う。
- ユーザーが資料をすでに直接渡している場合、この skill を経由せず `create-business-definition-sheet` を直接使ってよい。
