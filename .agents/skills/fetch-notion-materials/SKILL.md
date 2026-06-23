---
name: fetch-notion-materials
description: Project 更新、仕様確認、リリース準備、不具合対応、面接準備、chief-of-staff 的な作業記憶更新のために、Notion や Docs から必要な情報だけを取得する。指定された Notion ページ、database、Docs、キーワード、期間、Project instructions をもとに、仕様、決定事項、対象範囲、除外事項、更新日時、担当、関連リンクを集めたいときに使う。取得した情報の分類や notes への統合はまだ行わない。
---

# Notion / Docs からの情報取得

## 目的

後続の Project 更新に必要な Notion / Docs 情報だけを集める。この skill は情報の取得と軽い絞り込みだけを担当し、Project の優先度判断、事実・推測などへの分類、project note の編集は行わない。

## 事前に確認する入力

取得前に、ユーザーの依頼または Project ファイルから、できるだけ次を特定する。

- 対象: Notion URL、page title、database、Docs URL、キーワード、人物、Project 名。
- 期間: 明示された日付を優先する。指定がなければ、依頼内容または Project status から狭い直近期を推測する。
- 観点: 仕様、決定事項、対象範囲、除外事項、未決論点、担当、期限、古くなっていそうな情報、関連リンク。
- 除外: 議事録全文、古い下書き、Project 範囲外のページ、すでに `status.md` に反映済みの背景情報。

対象または期間を安全に推測できない場合だけ、短い質問を 1 つする。

## 設定・認証チェック

Notion / Docs tools が見つからない、認証エラー、権限不足、対象不明で取得できない、または connector の状態が不明な場合は、取得を広げる前に次を行う。

1. まず tool discovery で Notion / Docs tools を探す。Python、Node、CLI など特定のローカル runtime には依存しない。
2. Notion / Docs tools が見つからない場合だけ、`~/.codex/config.toml` の Notion / Docs plugin または MCP 設定を確認できる範囲で見る。token、OAuth secret、cookie は探さない。
3. tools が未設定または disabled の場合は、Codex の plugin directory で Notion plugin を install / enable するか、必要な Docs connector を接続し、新しい thread で再試行するよう案内する。
4. tools は有効だが見つからない場合は、Codex の再起動または新しい thread での再試行を案内する。
5. tools が見つかる場合は、取得前に必要最小の read-only probe で OAuth 状態を確認する。認証エラーなら追加取得を止める。
6. page、database、Docs が見えない場合は、ユーザー本人の workspace、ページ共有、database 権限、Docs の閲覧権限、connector の接続先が合っているかを確認事項として返す。

認証そのものはユーザー操作として残す。skill は OAuth フローを代理完了しない。認証後は、対象や期間を広げず、失敗した同じ Notion / Docs 対象から再試行する。

## 取得できなかった場合の返答

Notion / Docs から情報を取得できなかった場合も、ユーザーが次に何をすればよいか分かるように、通常の取得結果ではなく次の形で短く返す。

```markdown
## Notion / Docs 情報

### 取得範囲

- 対象:
- 期間:
- 観点:
- 除外:

### 取得できなかった理由

- 種別: tool 未検出 / connector 未設定 / 再認証が必要 / 権限不足 / 対象不明 / 該当なし
- 確認したこと:
- 次にユーザーが行うこと:
- 再試行条件:

### 不足している可能性

- 
```

`次にユーザーが行うこと` には、Notion plugin の install / enable、connector の再認証、ページや database の共有、Docs の閲覧権限確認、URL や期間の再指定など、実際に必要なものだけを書く。secret、token、cookie の値は求めない。

## 取得 Workflow

1. Notion / Docs 対象、キーワード、既知の除外条件を特定する必要がある場合だけ、関連 Project の `README.md`、`instructions.md`、`status.md` を読む。
2. 利用可能な Notion / Docs connector / tools を使う。Notion tools がまだ読み込まれておらず tool discovery が使える場合は、汎用 web search ではなく Notion tools を探す。tools がない、または認証状態が不明な場合は、先に `設定・認証チェック` を行う。
3. まず狭く取得する。
   - 明示された Notion / Docs URL を最優先する。
   - 次に、指定された database / page title / キーワードを見る。
   - 次に、Project 名、チケット ID、リリース日、関係者名で検索する。
4. ページごとに、更新日時、作成者または更新者、決定事項、scope、未決論点、関連リンクを確認する。
5. 古い情報らしきものは「古い可能性がある情報」として残し、確定扱いしない。
6. 議事録や仕様ページの全文ではなく、Project 更新に必要な断片だけを取得する。
7. 追加取得しても背景情報や重複しか出なくなったら止める。

## 返答フォーマット

別 skill またはメインの Codex が分類できるように、コンパクトな取得情報として返す。

```markdown
## Notion / Docs 情報

### 取得範囲

- 対象:
- 期間:
- 観点:
- 除外:

### 取得結果

| 更新日時 | 情報源 | 担当 | 情報 | リンク | 取得理由 |
|---|---|---|---|---|---|
| YYYY-MM-DD HH:mm JST | ページ / Docs 名 | Name | source に基づく短い要約 | [display](url) | 取り込んだ理由 |

### 不足している可能性

- 
```

`情報` は短く保つ。仕様や決定事項は、後で検証できるように source と更新日を残す。URL だけで置かず、意味が分かる表示名を付ける。

## 境界

- この skill では `status.md`、`notes/`、Project ファイルを更新しない。
- 取得した情報を最終的な `事実`、`推測`、`重要リンク`、`未解決事項`、`ユーザー対応待ち` へ分類しない。それは `classify-project-materials` に任せる。
- Notion / Docs の全文を貼らない。
- 古いページの内容を最新判断として扱わない。更新日時や矛盾の可能性を残す。
- 呼び出し側が人間向け summary を求めていない限り、定型更新をユーザーへ通知しない。

## 良い情報の例

- 仕様、scope、除外事項、Go / No-Go 条件などの決定事項。
- 未決論点、担当、期限、次回確認事項。
- Linear、GitHub、Slack、Sheets、リリースチェックリストへの重要リンク。
- 古くなっていそうな仕様や、他 source と矛盾しそうな記述。

## 悪い情報の例

- 議事録全文。
- Project 判断に使わない背景説明。
- 更新日時が古く、現在性の確認なしに使えない断片。
- 同じリンクの重複列挙。
