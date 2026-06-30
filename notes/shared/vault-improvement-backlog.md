# Vault 改善 backlog

## 目的

この note は、vault の運用改善でまだ対応できていないことだけを残す場所。

過去の改善メモにあった内容のうち、すでに skill / workflow / README に反映済みのものはここへ残さない。次に改善するときは、この note を見て候補を選ぶ。

## 未対応

### fetch 系 skill の出力形式の実地確認

fetch 系 skill の返答が、`classify-fetched-materials` に渡しやすい粒度になっているかを実際の Project 更新で確認する。

見ること:

- 情報が長すぎないか。
- source link が表示名付きで残っているか。
- 取得理由が分類に役立つか。
- Slack / Linear / Notion / GitHub / Google Meet メモで返答粒度が大きくずれていないか。
- 認証切れや権限不足の返答が、ユーザーの次アクションに直結しているか。

### fetch 系 skill の体裁チェック script

fetch 系 skill を変更したときに、全 fetch 系 skill の体裁が揃っているか確認できる script を作る。

方針:

- まずは hook 強制ではなく、手動実行できる検証 script として作る。
- この repository は文章中心なので、Node.js の標準ライブラリだけで動く単一 file script にする。
- 依存 package は増やさず、`npm install` を不要にする。
- Node.js の version は `.mise.toml` で固定済み。
- `package.json` は build や application 化ではなく、vault 運用 script の入口として使う。
- package manager は `pnpm` を使う。
- clone した環境では、検証 script や token usage 確認を使う場合に Node.js が必要であることを README などに書く。

候補 path:

- `.agents/scripts/validate-fetch-skills.mjs`

確認したいこと:

- `fetch-*materials` 系 skill が同じ必須セクションを持っているか。
- frontmatter に `name` と `description` があるか。
- folder 名と skill 名が一致しているか。
- `agents/openai.yaml` があるか。
- 取得、分類、更新、レビューの境界が書かれているか。
- 取得結果を `classify-fetched-materials` に渡す前提になっているか。

将来的に必要になったら、`.githooks/pre-commit` からこの script を呼ぶ。ただし最初から commit を止める hook にはしない。

### MCP / connector 認証チェック harness

fetch 系 skill や Linear write 系 skill を使う前に、必要な MCP / connector の認証が有効か確認できる仕組みを作る。

背景:

- `codex exec` 起動時に、対象 task では使わない Notion / GitHub / Linear などの MCP 認証切れが表示されることがある。
- root README に個別 connector の認証トラブルを書くと、repository のセットアップ説明と外部 connector 運用が混ざる。
- 認証切れは `save:commit` のような local-only command ではなく、主に fetch / write 系 skill の前提条件として扱う方が自然。

ほしい状態:

- skill 実行前に、必要な connector だけ認証状態を確認できる。
- 認証切れ、権限不足、token 未設定を検出したら、どの connector が原因かを短く返す。
- 可能なら `codex mcp login <name>` など次に実行すべき操作を提示する。
- 自動再認証は、ブラウザ認証やユーザー操作が必要になる可能性があるため、最初は行わない。
- local-only の command では、不要な connector 認証切れを原因に作業全体を止めない設計を検討する。

候補:

- `.agents/scripts/check-mcp-auth.mjs`
- `pnpm check:mcp`
- fetch 系 skill の「設定・認証チェック」セクションから共通 harness を参照する。
- write 系 skill では、書き込み前の draft 確認に加えて対象 connector の認証確認を行う。

### skill のカテゴリ管理

skill が `.agents/skills/` に flat に増えてきており、fetch 系、write 系、review 系、workflow 補助系などの役割が一覧で分かりにくくなっている。

現状:

- `.agents/README.md` では、各 tool が `SKILL.md` を発見しやすいように skill は flat layout にするとしている。
- そのため、いきなり `.agents/skills/fetch/<skill-name>/` のような物理的な nested layout にすると、Codex / Claude Code などの skill discovery と合わない可能性がある。

方針:

- まずは skill 本体の配置は flat のまま維持する。
- `.agents/skills/README.md` または `.agents/references/skill-catalog.md` を作り、カテゴリ別に skill を一覧できるようにする。
- カテゴリは directory ではなく metadata / index で管理する。
- 将来、Codex / Claude Code の両方で nested skill discovery が問題なく使えることを確認できたら、物理ディレクトリ分割を検討する。

分類案:

- fetch: `fetch-slack-materials`、`fetch-linear-materials`、`fetch-notion-materials`、`fetch-github-materials`、`fetch-google-meet-materials`
- classify: `classify-fetched-materials`
- write: `write-linear-issue`、`write-linear-project`、`write-linear-milestone`
- review: `review-project-status`、`review-linear-structure`
- project / vault: `create-project-note`、`vault-git-commit`

確認したいこと:

- `SKILL.md` の frontmatter にカテゴリを持たせるか。これは別途検討し、今は行わない。
- index を手動管理するか、script で生成するか。
- workflow skill から capability skill を探すときに、カテゴリ別 index があると十分か。
- `.agents/README.md` に「flat layout だがカテゴリ index で探す」と明記するか。

### Linear 書き込み skill の実地確認

Linear の issue、Project、Milestone を作成・更新する write 系 skill を、実際の安全な対象で確認する。

見ること:

- fetch 系 skill は read-only のままにし、Linear 書き込み機能とは分ける。
- 書き込み前の draft とユーザー確認が十分に安全か。
- issue / Project / Milestone ごとに責務が分かれているか。
- 実行後に、変更した対象、変更内容、Linear link、失敗理由が返るか。
- Linear connector / MCP / CLI のどれを標準の write 経路にするか。
- 誤更新を避けるための confirmation format をどうするか。

### 入力情報から必要タスクを分解する skill

完了条件、関連情報、制約、既存の仕様や実装方針を入力として受け取り、作業時に読むだけで何をすればよいか分かる粒度のタスク一覧を作る skill を検討する。

ほしい状態:

- タスク達成に必要な完了条件が明確になっている。
- 関連情報をもとに、実装、調査、確認、レビュー、QA などの必要タスクが抜け漏れなく出る。
- 実装時に、そのタスク一覧を見れば必要な作業が把握できる。
- `API を実装する` のような大きすぎる単位ではなく、domain 層、validation、controller、test、migration、feature flag、ログ、権限、ドキュメントなどの作業単位に分解できる。
- タスク同士の依存関係や、並列に進められるものが分かる。
- Linear に書き込む前の draft として使える。

入力として渡したいもの:

- 達成したいこと。
- 完了条件。
- 関連する仕様、決定事項、制約。
- 既存 issue / Project / milestone。
- 関連するコード、設計、ドキュメント。
- 除外すること。
- どの粒度で分解したいか。例: 実装者が作業開始できる粒度、Linear issue としてチームで確認できる粒度、PR 分割できる粒度、実装 checklist の粒度。

出力案:

````markdown
## タスク一覧

### 1. <タスク名>

- 目的:
- 完了条件:
- 作業内容:
- 依存:
- 関連情報:
- Linear issue 候補: yes / no
- 実装 checklist 候補: yes / no

## 依存関係

```mermaid
graph TD
```

## 確認が必要な点

-
````

Linear Method との扱い:

- `linear-method-principles.md` では、team で確認できる単位は issue として扱う。
- sub issue は現時点では共通原則に含めず、個人の作業分解や実装 checklist に近い補助的なものとして扱う。
- Linear Method は、issue として切る粒度が妥当かを見る reference として使う。
- 細かくしすぎて管理コストが上がらないように、Linear に書く粒度と実装時に読む粒度を分ける。
- `write-linear-issue` に直接含めるのではなく、`decompose-task-from-materials` のような read-only skill にして、Linear 書き込みは別 workflow skill に渡すか。

### トークン使用量とコストの可視化

1 回の依頼でどれだけ token を使ったのか、概算でいくらかかったのか、今日どれくらい使ったのかを把握できるようにする。

ほしい状態:

- 依頼単位で、入力 token、出力 token、合計 token、概算コストが分かる。
- 1 日単位で、合計 token、概算コスト、重かった依頼が分かる。
- Project 更新、Linear 書き込み、外部情報取得など、どの workflow skill / capability skill が重いのか見える。
- 使いすぎている場合に、情報取得範囲を狭める、分割する、要約を挟むなどの改善につなげられる。

検討すること:

- Codex / Claude Code など、利用する agent ごとに token usage を取得できる場所があるか確認する。
- Claude Code / Codex CLI の local usage を見るために `ccusage` を使う。
- session / turn / command ごとの usage log を local に残せるか確認する。
- 料金は model ごとに変わるため、価格表を直接埋め込まず、model 名、入力 token、出力 token、計算日時を残す。
- 概算コスト計算は、手動更新できる小さな設定 file に分ける。
- local-only の使用量 log は git commit 対象にしない。

候補:

- `pnpm usage:daily`
- `pnpm usage:monthly`
- `pnpm usage:session`
- `.agents/scripts/summarize-token-usage.mjs`
- `.agents/references/token-cost-config.example.json`
- `notes/local/token-usage/` または `.agents/local/token-usage/`

最初に作るなら:

1. `ccusage` で Claude Code / Codex CLI の usage がどこまで見えるか確認する。
2. `ccusage` で足りる場合は、独自 script は作らず README か workflow skill に利用方法だけ残す。
3. 足りない場合だけ、今日の合計 token と依頼単位の上位を表示する read-only script を検討する。
4. コスト計算は概算として扱い、model 単価が不明な場合は token 数だけ表示する。
5. Project 更新 workflow skill など、重い workflow skill の最後に token usage を返せるか検討する。

### token usage 確認 skill

`ccusage` を直接叩かなくても、「昨日はいくら使った？」「今日の token は？」「今月どれくらい？」のような自然言語で token usage と概算コストを確認できる skill を作る。

候補 skill:

- `check-token-usage`

やること:

- 「今日」「昨日」「今月」などの相対表現を JST の絶対日付に変換する。
- 対象に応じて `pnpm usage:daily`、`pnpm usage:session`、`pnpm usage:monthly` を使い分ける。
- 必要に応じて `--since YYYY-MM-DD`、`--until YYYY-MM-DD`、`--json` を付ける。
- 結果を total tokens、input tokens、output tokens、cache read tokens、reasoning output tokens、estimated cost に絞って返す。
- 請求額の正本ではなく、local usage log と `ccusage` による推定であることを明記する。

返答イメージ:

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

最初は script を作らず、skill から `pnpm usage:*` を呼ぶだけで始める。整形や比較が必要になったら `.agents/scripts/check-token-usage.mjs` を検討する。

### Project 更新 workflow skill の実運用テスト

`workflow-update-project-note` skill を使って、実際の Project 更新を 1 件試す。

確認すること:

- 対象 Project folder だけを読む運用で足りるか。
- fetch 系 skill に渡す入力を workflow skill から自然に決められるか。
- 取得結果、分類、`status.md` 更新、レビューの流れが重すぎないか。
- `review-project-status` の指摘が実際に整理に役立つか。

### サブエージェント並列化とモデル選択

情報取得、分類、レビュー、書き込み draft 作成などを、必要に応じてサブエージェントで並列に動かせるようにする。

ほしい状態:

- Slack、Linear、Notion、GitHub、Google Meet など、情報源ごとの取得を並列化できる。
- 取得、分類、レビュー、draft 作成の責務を分けたまま、workflow skill 全体の待ち時間を短くできる。
- 単純な取得や形式チェックには軽い model、判断や統合が必要な箇所には強い model を使える。
- サブエージェントの出力は、事実、推測、重要リンク、未解決事項、ユーザー対応待ちなど、後続処理に渡しやすい形に揃える。
- サブエージェントが勝手に書き込みや file 編集をしないように、read-only / write の境界を明確にする。

検討すること:

- workflow skill ごとに、どの step を並列化できるかを明記する。
- サブエージェントに渡す入力 format と、返してほしい出力 format を揃える。
- model 選択の基準を作る。例: 取得は軽量、分類は中程度、統合判断やレビューは高性能。
- token / cost 可視化とつなげて、重い workflow skill でどの model が使われたか確認できるようにする。
- サブエージェント結果をそのまま note や Linear に貼らず、メイン agent が統合判断を行う。

最初に試すなら:

1. Project 更新 workflow skill で、情報源ごとの fetch を read-only サブエージェントに分ける。
2. 各サブエージェントの出力を `classify-fetched-materials` に渡しやすい形に揃える。
3. メイン agent が分類結果を統合し、`status.md` 更新や返答を作る。
4. 実行時間、token、確認漏れが改善するかを見る。

### 定期確認の設計

Project の定期確認を行う場合の最小ルールを決める。

決めること:

- 対象 Project をどう選ぶか。
- 確認頻度をどう決めるか。
- heartbeat / automation を使う場合、workflow skill とどう接続するか。

heartbeat / automation を設計する段階では、次の通知ポリシーも決める。

- 通知する条件。
  - ユーザー宛ての依頼やメンションが来た。
  - ブロッカー、期限変更、担当変更、重要な判断変更が出た。
  - 指定した Slack thread、Linear issue、GitHub PR に動きがあった。
- 通知しない条件。
  - 定型更新だけ。
  - bot 通知だけ。
  - 既に把握済みの状態確認だけ。
  - 対象外 channel や対象外 issue の更新。
  - 変化がない場合。

今の段階では、通知条件は Project 必須情報チェックリストには含めない。

## 次にやる候補

1. `workflow-update-linear-project-timeline` skill を実際の Project で 1 回使い、document 作成・更新の重さを確認する。
2. Linear 書き込み skill を安全な対象で実地確認する。
3. `workflow-update-project-note` skill を実際の Project で 1 回使い、重い部分を確認する。

## 判断メモ

- 取得、分類、更新、レビューは混ぜない。
- 外部サービスへの書き込みは、read-only の取得 skill と分ける。
- Project 更新のような進行役は workflow skill、個別能力は capability skill として扱う。
- 新しい構造を増やす前に、既存の skill で運用できるかを試す。
