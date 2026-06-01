---
name: fetch-notion-materials
description: Project 更新、仕様確認、リリース準備、不具合対応、面接準備、chief-of-staff 的な作業記憶更新のために、Notion や Docs から必要な材料だけを取得する。指定された Notion ページ、database、Docs、キーワード、期間、Project instructions をもとに、仕様、決定事項、対象範囲、除外事項、更新日時、担当、関連リンクを集めたいときに使う。取得した材料の分類や notes への統合はまだ行わない。
---

# Notion 材料取得

## 目的

後続の Project 更新に必要な Notion / Docs 材料だけを集める。この skill は材料の取得と軽い絞り込みだけを担当し、Project の優先度判断、事実・推測などへの分類、project note の編集は行わない。

## 事前に確認する入力

取得前に、ユーザーの依頼または Project ファイルから、できるだけ次を特定する。

- 対象: Notion URL、page title、database、Docs URL、キーワード、人物、Project 名。
- 期間: 明示された日付を優先する。指定がなければ、依頼内容または Project status から狭い直近期を推測する。
- 観点: 仕様、決定事項、対象範囲、除外事項、未決論点、担当、期限、古くなっていそうな情報、関連リンク。
- 除外: 議事録全文、古い下書き、Project 範囲外のページ、すでに `status.md` に反映済みの背景情報。

対象または期間を安全に推測できない場合だけ、短い質問を 1 つする。

## 取得 Workflow

1. Notion / Docs 対象、キーワード、既知の除外条件を特定する必要がある場合だけ、関連 Project の `README.md`、`instructions.md`、`status.md` を読む。
2. 利用可能な Notion / Docs connector / tools を使う。Notion tools がまだ読み込まれておらず tool discovery が使える場合は、汎用 web search ではなく Notion tools を探す。
3. まず狭く取得する。
   - 明示された Notion / Docs URL を最優先する。
   - 次に、指定された database / page title / キーワードを見る。
   - 次に、Project 名、チケット ID、リリース日、関係者名で検索する。
4. ページごとに、更新日時、作成者または更新者、決定事項、scope、未決論点、関連リンクを確認する。
5. 古い情報らしきものは「古い可能性がある材料」として残し、確定扱いしない。
6. 議事録や仕様ページの全文ではなく、Project 更新に必要な断片だけを取得する。
7. 追加取得しても背景情報や重複しか出なくなったら止める。

## 返答フォーマット

別 skill またはメインの Codex が分類できるように、コンパクトな source materials として返す。

```markdown
## Notion Materials

### Scope

- Targets:
- Time window:
- Viewpoint:
- Exclusions:

### Materials

| Updated | Source | Owner | Material | Link | Why included |
|---|---|---|---|---|---|
| YYYY-MM-DD HH:mm JST | ページ / Docs 名 | Name | source に基づく短い要約 | [display](url) | 取り込んだ理由 |

### Possible Gaps

- 
```

`Material` は短く保つ。仕様や決定事項は、後で検証できるように source と更新日を残す。URL だけで置かず、意味が分かる表示名を付ける。

## 境界

- この skill では `status.md`、`notes/`、Project ファイルを更新しない。
- 材料を最終的な `事実`、`推測`、`重要リンク`、`未解決事項`、`ユーザー対応待ち` へ分類しない。それは `classify-project-materials` に任せる。
- Notion / Docs の全文を貼らない。
- 古いページの内容を最新判断として扱わない。更新日時や矛盾の可能性を残す。
- 呼び出し側が人間向け summary を求めていない限り、定型更新をユーザーへ通知しない。

## 良い材料の例

- 仕様、scope、除外事項、Go / No-Go 条件などの決定事項。
- 未決論点、担当、期限、次回確認事項。
- Linear、GitHub、Slack、Sheets、リリースチェックリストへの重要リンク。
- 古くなっていそうな仕様や、他 source と矛盾しそうな記述。

## 悪い材料の例

- 議事録全文。
- Project 判断に使わない背景説明。
- 更新日時が古く、現在性の確認なしに使えない断片。
- 同じリンクの重複列挙。
