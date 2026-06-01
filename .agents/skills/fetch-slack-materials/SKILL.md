---
name: fetch-slack-materials
description: Project 更新、リリース追跡、不具合対応、面接メモ、chief-of-staff 的な作業記憶更新のために、Slack から必要な材料だけを取得する。指定された channel、DM、thread、期間、キーワード、Project instructions をもとに、関連する Slack メッセージ、スレッド、メンション、依頼、決定事項、ブロッカー、リンクを集めたいときに使う。取得した材料の分類や notes への統合はまだ行わない。
---

# Slack 材料取得

## 目的

後続の Project 更新に必要な Slack 材料だけを集める。この skill は材料の取得と軽い絞り込みだけを担当し、Project の優先度判断、事実・推測などへの分類、project note の編集は行わない。

## 事前に確認する入力

取得前に、ユーザーの依頼または Project ファイルから、できるだけ次を特定する。

- 対象: channel、DM、thread URL、message URL、キーワード、人物、Project 名。
- 期間: 明示された日付を優先する。指定がなければ、依頼内容または Project status から狭い直近期を推測する。
- 観点: ブロッカー、未対応依頼、リリース判断、レビュー依頼、QA 結果、担当変更、ユーザー宛てメンションなど。
- 除外: 定型的な雑談、既知の状態、bot 通知、広すぎるログ、関係ない channel。

対象または期間を安全に推測できない場合だけ、短い質問を 1 つする。

## 取得 Workflow

1. Slack 対象、キーワード、関係者、既知の除外条件を特定する必要がある場合だけ、関連 Project の `README.md`、`instructions.md`、`status.md` を読む。
2. 利用可能な Slack connector / tools を使う。Slack tools がまだ読み込まれておらず tool discovery が使える場合は、汎用 web search ではなく Slack tools を探す。
3. まず狭く取得する。
   - 明示された thread URL または message URL を最優先する。
   - 次に、指定された channel / DM と期間を見る。
   - 次に、Project キーワード、チケット ID、PR 番号、リリース日、人物名で検索する。
4. 観点に関係しそうな thread だけを追う。関係ない議論を再帰的に広げすぎない。
5. 重複した告知、コピーされたリンク、cross-post は重複排除する。一番分かりやすい source だけを残す。
6. 追加取得しても定型更新や重複しか出なくなったら止める。

## 返答フォーマット

別 skill またはメインの Codex が分類できるように、コンパクトな source materials として返す。

```markdown
## Slack Materials

### Scope

- Targets:
- Time window:
- Viewpoint:
- Exclusions:

### Materials

| Time | Source | Actor | Material | Link | Why included |
|---|---|---|---|---|---|
| YYYY-MM-DD HH:mm JST | #channel / DM / thread | Name | source に基づく短い要約または短い引用 | [display](url) | 取り込んだ理由 |

### Possible Gaps

- 
```

`Material` は短く保つ。長い引用より、source に忠実な要約を優先する。可能な限り直接リンクを残す。URL だけで置かず、意味が分かる表示名を付ける。

## 境界

- この skill では `status.md`、`notes/`、Project ファイルを更新しない。
- 材料を最終的な `事実`、`推測`、`重要リンク`、`未解決事項`、`ユーザー対応待ち` へ分類しない。それは `classify-project-materials` に任せる。
- Slack ログ全文を貼らない。
- 呼び出し側が人間向け summary を求めていない限り、定型更新をユーザーへ通知しない。
- Linear、GitHub、Docs の方が正本になりそうな場合、Slack を正本扱いしない。Slack の文脈を取得し、後続確認のために外部 source へのリンクを残す。

## 良い材料の例

- リリース thread での決定事項。決定した人と時刻が分かるもの。
- ユーザーまたはユーザーのチームへの直接依頼。
- ブロッカー、担当変更、期限変更、QA 結果、レビュー依頼、デプロイに関する情報。
- Project の中心になりそうな Linear、GitHub、Notion、Docs、Sheets、リリースチェックリストへのリンク。

## 悪い材料の例

- 新しい判断がない定型 status ping。
- メッセージ全文の貼り付け。
- Project キーワードを含むだけの雑談。
- Linear / GitHub のリンク先だけで十分な bot 通知。ただし Slack thread に人間の判断が追加されている場合は残す。
