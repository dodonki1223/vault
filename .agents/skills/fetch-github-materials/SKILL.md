---
name: fetch-github-materials
description: Project 更新、リリース追跡、不具合対応、レビュー状況確認、CI 確認、chief-of-staff 的な作業記憶更新のために、GitHub から必要な材料だけを取得する。指定された repo、PR、issue、branch、commit、release、workflow run、期間、キーワード、Project instructions をもとに、レビュー待ち、CI、マージ可否、リリース影響、関連リンクを集めたいときに使う。取得した材料の分類や notes への統合はまだ行わない。
---

# GitHub 材料取得

## 目的

後続の Project 更新に必要な GitHub 材料だけを集める。この skill は材料の取得と軽い絞り込みだけを担当し、Project の優先度判断、事実・推測などへの分類、project note の編集は行わない。

## 事前に確認する入力

取得前に、ユーザーの依頼または Project ファイルから、できるだけ次を特定する。

- 対象: repo、PR URL / 番号、issue URL / 番号、branch、commit、release、workflow run、キーワード、Project 名。
- 期間: 明示された日付を優先する。指定がなければ、依頼内容または Project status から狭い直近期を推測する。
- 観点: review request、未解決 review comment、CI 失敗、merge blocker、release 影響、担当変更、関連 Linear / Slack / Docs。
- 除外: Project 範囲外の PR、古い closed PR、bot だけの noisy な更新、ソースコード全文、関係ない workflow。
- アクセス: private repo、organization 内 repo、GitHub connector では見えない repo の可能性があるか。

対象または期間を安全に推測できない場合だけ、短い質問を 1 つする。

## 取得 Workflow

1. GitHub 対象、repo、PR 番号、既知の除外条件を特定する必要がある場合だけ、関連 Project の `README.md`、`instructions.md`、`status.md` を読む。
2. 利用可能な GitHub connector / tools または `gh` を使う。GitHub tools がまだ読み込まれておらず tool discovery が使える場合は、汎用 web search ではなく GitHub tools を探す。
3. private repo や organization 内 repo の場合は、GitHub connector だけに頼らない。ローカルで `gh auth status` を確認し、認証済みなら `gh` を優先して使う。未認証・権限不足・SSO 未承認などで取得できない場合は、その事実を `Possible Gaps` に残す。
4. `gh` を使う場合は、取得範囲を狭く保つ。
   - PR / issue: `gh pr view`、`gh issue view`、必要に応じて `--comments` や `--json` を使う。
   - review / merge 状態: `gh pr view --json state,reviewDecision,mergeable,reviewRequests,statusCheckRollup,latestReviews` など、必要項目だけ取得する。
   - CI / workflow: `gh run view` や `gh run list` で対象 workflow / run だけを見る。log 全文は貼らず、失敗 job 名・失敗時刻・リンクだけ残す。
   - repo 横断検索: `gh search prs` / `gh search issues` を使う場合も、repo、期間、keyword を必ず絞る。
5. `gh` の出力に private なコード、diff、log が含まれる場合は、Project 更新に必要な状態・判断材料だけに圧縮する。
6. まず狭く取得する。
   - 明示された PR / issue / workflow run URL を最優先する。
   - 次に、指定された repo / branch / release / assignee / reviewer を見る。
   - 次に、Project キーワード、Linear issue ID、リリース日、関係者名で検索する。
7. PR ごとに、状態、review 状況、未解決コメント、CI、mergeability、関連 issue / Linear / Slack / Docs を確認する。
8. CI 失敗は、失敗 job 名、失敗時刻、ログへのリンク、Project 影響が分かる範囲だけ残す。
9. closed / merged PR は、現在判断に必要なものだけ残す。不要な履歴は落とす。
10. 追加取得しても bot 更新や重複しか出なくなったら止める。

## 返答フォーマット

別 skill またはメインの Codex が分類できるように、コンパクトな source materials として返す。

```markdown
## GitHub Materials

### Scope

- Targets:
- Time window:
- Viewpoint:
- Exclusions:

### Materials

| Updated | Source | State | Actor | Material | Link | Why included |
|---|---|---|---|---|---|---|
| YYYY-MM-DD HH:mm JST | repo#123 / issue / workflow | 状態 | Name | source に基づく短い要約 | [display](url) | 取り込んだ理由 |

### Possible Gaps

- 
```

`Source` には repo 名または文脈と PR / issue 番号を入れる。`Material` は短く保ち、review / CI / merge / release 判断に関係する差分だけを書く。URL だけで置かず、意味が分かる表示名を付ける。

## 境界

- この skill では `status.md`、`notes/`、Project ファイルを更新しない。
- 材料を最終的な `事実`、`推測`、`重要リンク`、`未解決事項`、`ユーザー対応待ち` へ分類しない。それは `classify-project-materials` に任せる。
- ソースコード全文、diff 全文、CI log 全文を貼らない。
- private repo の内容を扱う場合も、返答には code / diff / log の実体を含めず、状態・判断材料・リンク・不足している権限だけを残す。
- GitHub だけでは仕様決定やリリース判断を確定扱いしない。必要なら Linear / Slack / Docs への関連リンクを残す。
- 呼び出し側が人間向け summary を求めていない限り、定型更新をユーザーへ通知しない。

## 良い材料の例

- review request、requested changes、未解決 review thread。
- CI 失敗、merge conflict、required check 未完了。
- merge 済み / deploy 済み / release branch 取り込み済みなど、リリース判断に関係する状態。
- Linear issue、Slack thread、Docs と紐づく PR / issue。

## 悪い材料の例

- Project 判断に不要な merged PR の詳細。
- bot のラベル付けや自動通知だけの履歴。
- diff や CI log の全文貼り付け。
- repo 横断検索で偶然ヒットした無関係 PR。
