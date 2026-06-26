# Linear Project 時系列 document 作成・更新 workflow

## 目的

Linear Project に紐づく issue、milestone、document、MTG メモ、Slack thread、Notion / Docs、GitHub PR などをもとに、後から参画する人が Project の経緯と現在地を把握できる時系列 document を作成・更新する。

この workflow は進行役であり、情報取得、分類、Linear への書き込みの細部は skill や connector に委譲する。

## 前提

- Project description には時系列を置かない。
- Linear Method 的に、Project description は目標、scope、milestone、依存関係を置く場所として扱う。
- 時系列は Linear Project に紐づく document として扱う。
- document の作成・更新は Linear への書き込みなので、必ず draft を提示してユーザー確認を取る。

## 入力

- Linear Project URL / Project name / Project ID。
- 既存の時系列 document がある場合は、その document URL / title。
- 対象期間。指定がなければ既存 document の最終日以降、または Project 開始以降。
- 対象 issue / milestone / resource。指定がなければ Project に紐づく代表 issue と resource から狭く始める。
- 必要に応じて、優先して見る情報源。例: Slack thread、Notion page、Google Meet メモ、GitHub PR。
- 読み手。例: 後から参画する人、PM / EM、実装担当、QA。

## 使う skill

- `fetch-linear-materials`: Linear Project、issue、milestone、linked resource を取得する。
- `fetch-slack-materials`: Slack thread / channel / huddle 周辺の情報を取得する。
- `fetch-notion-materials`: Notion page / database / Docs の情報を取得する。
- `fetch-google-meet-materials`: Google Meet メモ、文字起こし、Calendar 起点の関連 Docs / Drive 情報を取得する。
- `fetch-github-materials`: GitHub PR / issue / repo 周辺の情報を取得する。
- `classify-fetched-materials`: 取得済み情報を事実、決定事項、推測、重要リンク、未解決事項、次アクション、ユーザー対応待ちに分類する。

## 手順

1. 対象 Project と目的を確認する。
   - 対象 Project が不明な場合は短く確認する。
   - 新規作成か既存の時系列 document の更新かを確認する。
   - document の読み手を確認する。指定がなければ「後から参画する人」とする。

2. 既存情報を取得する。
   - `fetch-linear-materials` で Linear Project、milestone、代表 issue、linked resource、既存 document の有無を確認する。
   - 既存の時系列 document がある場合は、現在地、最後の時系列日付、情報源一覧を確認する。
   - 更新時は、既存 document の `現在地` や milestone 状況を正として扱わない。Linear 上の最新 Project / milestone / issue 状態を正として照合する。
   - milestone については、名前、順番、target date、progress、追加 / 改名 / 削除、後続 milestone との依存関係変更を確認する。
   - issue については、status、completedAt、project milestone の移動、新規作成 issue、完了 issue、次に見るべき issue を確認する。
   - Project description は目標、scope、milestone、依存関係の確認に使う。時系列の正本にはしない。

3. 追加で見る情報源を決める。
   - Linear issue / milestone / resource から、必要な Slack、Notion、Google Meet、GitHub の link を拾う。
   - 取得対象、期間、観点、除外条件を情報源ごとに決める。
   - 全情報源を網羅しようとせず、時系列に必要なものだけを取得する。

4. 必要な情報を取得する。
   - 情報源ごとに fetch 系 skill を使う。
   - fetch 系 skill には Project 固有の判断を押し込まない。
   - 取得結果はそのまま時系列 document に貼らない。

5. 取得結果を分類する。
   - `classify-fetched-materials` を使う。
   - 取得済み情報、取得元、取得理由、短い Project 文脈を渡す。
   - 分類 skill には、document への統合や優先度判断をさせない。

6. 時系列に入れる出来事を選ぶ。
   - 後から参画する人の状況理解に役立つ出来事だけを残す。
   - 入れるもの:
     - 方針が変わった日。
     - scope が変わった日。
     - 重要な決定があった MTG / Slack / issue。
     - milestone の前提が変わった日。
     - milestone が完了した日、または Project の現在地が次の milestone へ移った日。
     - blocker が発生 / 解消した日。
     - 後続 issue が作られた日。
     - 仕様や設計判断が固まった日。
   - 入れないもの:
     - ただの status change。
     - bot 通知。
     - issue の細かいコメント全文。
     - 会議の逐語録。
     - 既に反映済みで意味の薄い古い経緯。
   - ただし、milestone の完了、Project の現在地変更、次に読む / 着手する issue の変更につながる status change は「ただの status change」として捨てない。

7. 時系列 document の draft を作る。
   - 新規作成の場合は `document 構成` に沿って作る。
   - 更新の場合は、既存 document の形式を優先しつつ、前回以降の重要な出来事を追記する。
   - `現在地` は必ず Linear の最新 milestone / issue 状態で更新する。古い progress、古い issue status、完了済み issue の In Progress 表記を残さない。
   - milestone の進捗や順番が読み手の理解に必要な場合は、`マイルストーン状況` セクションを追加 / 更新する。
   - 時系列は table ではなく、日付見出し + 箇条書きにする。
   - 情報源一覧は table にする。

8. 書き込み前に確認する。
   - Linear に書き込む前に、document title、対象 Project、作成 / 更新内容、主要な追記箇所を draft として提示する。
   - draft には、最新の milestone 進捗、完了 issue、次に進める milestone / issue が反映されていることを明示する。
   - 書き込み前チェック:
     - Project の milestone 一覧と document の milestone 表記が一致している。
     - issue の DONE / In Progress / Backlog などの状態が Linear と一致している。
     - `現在地` が過去の時系列や既存 document の古い状態を参照したままになっていない。
     - `後から読む順番` と `情報源一覧` の link が、別 issue への誤リンクや崩れた markdown になっていない。
   - ユーザーが明示的に承認した場合だけ Linear に書き込む。
   - 既存 document の大幅な書き換えや削除は、明示承認なしに行わない。

9. Linear Project document として作成・更新する。
   - Linear connector / MCP の document 作成・更新機能を使う。
   - document 書き込み専用 skill がまだない場合は、この workflow 内で実行する。
   - document 作成・更新が繰り返し発生する場合は、`write-linear-document` skill への切り出しを検討する。

10. 結果を返す。
    - 作成・更新した document link。
    - 反映した主な出来事。
    - 反映しなかった情報と理由。
    - 次回更新時に見る情報源。
    - 確認が必要な点。

## document 構成

```markdown
# Project Timeline

## 目的

後から参画する人が、これまで何が起きて、今どこにいるのかを把握するための document。

## 現在地

- 現在の状態:
- 今も効いている前提:
- 今も未解決の問い:
- 次に見るべきもの:

## マイルストーン状況

| Milestone | 目標日 | 進捗 | 状態 |
|---|---|---|---|

## 時系列

### YYYY-MM-DD

- 出来事 / 判断 / 決定 / 持ち越し。
- 詳細は [情報源](...) を参照。

## 情報源一覧

| 種別 | 名前 | 用途 | Link |
|---|---|---|---|

## 後から読む順番

1.
2.
3.
```

## 継続更新ルール

- 既存の時系列 document を読み、前回以降に増えた重要な出来事だけを追記する。
- `現在地` は時系列の重複ではなく、今読む人の入口として更新する。
- `現在地` と `マイルストーン状況` は、既存 document ではなく Linear の最新 Project / milestone / issue 状態を正として更新する。
- milestone が完了した、Project の現在地が次の milestone へ移った、次に見るべき issue が変わった、という変化は必ず反映する。
- 古い判断が無効になった場合は、過去の時系列を消さず、後日の項目で上書きされたことを書く。
- 決定事項、重要な論点、未解決事項を独立セクションとして重複管理しない。必要な内容は `現在地` と `時系列` に集約する。
- 情報源一覧は、後から辿る価値がある link だけを残す。
- 更新後は、代表 issue link と `後から読む順番` の link が正しい issue を指しているかを軽く確認する。

## 返答フォーマット

```markdown
## Linear Project 時系列 document

- 結果: 作成 / 更新 / 未実行
- 対象 Project:
- document:
- 反映した主な出来事:

## 確認が必要な点

-

## 次回更新時に見る情報源

-
```

## 境界

- Project description に時系列を追記しない。
- Linear issue、milestone、Project description の作成・更新はこの workflow では行わない。
- ログ全文、議事録全文、コメント全文、チケット一覧を document に貼らない。
- Linear への書き込み前に必ず draft とユーザー確認を挟む。
- 書き込み後の構造レビューが必要な場合は、別途 `review-linear-structure` を使う。
