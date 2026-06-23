# Project 改善メモ

## 概要

この vault を、進行中の仕事を見失わないための小さな作業記憶として育てる。目的は、ログの保存ではなく、次に何を見るべきか、誰が何を待っているか、どの判断が変わったかを短く把握できる状態にすること。

## 事実

- 2026-05-19 時点で、`projects/` には勤怠リリース、勤怠給与連携不具合、チームアサイン容量に関する project がある。
- `AGENTS.md` では、プロジェクトノートを小さく保ち、継続的に役立つ文脈、意思決定、ブロッカー、担当者、フォローアップ事項だけを残す方針になっている。
- 勤怠リリースについては、まず「リリース判定に必要な未完了タスク」と「QAで見つかった不具合」に集中する運用が明記されている。
- 2026-05-28 に、Slack から指定観点の材料を取得する skill として `fetch-slack-materials` を作成した。配置先は `.agents/skills/fetch-slack-materials`。
- 2026-05-28 に、Linear / Notion / GitHub から指定観点の材料を取得する skill として `fetch-linear-materials`、`fetch-notion-materials`、`fetch-github-materials` を作成した。配置先は `.agents/skills/`。
- 2026-06-08 に、Linear connector が `401: Reauthentication required` を返す場合、skill で OAuth の本人確認を代理完了することはできず、skill 側でできるのは認証切れの検知、再認証案内、再認証後の同一対象リトライまでだと確認した。
- 2026-06-08 に、Codex MCP は Streamable HTTP server と OAuth login を扱えること、Linear 公式 MCP endpoint は `https://mcp.linear.app/mcp` で Codex から `codex mcp add linear --url https://mcp.linear.app/mcp` により登録できることを確認した。
- 2026-06-08 に、Codex CLI が未インストールまたは PATH から見つからない場合は、[Codex CLI 公式ドキュメント](https://developers.openai.com/codex/cli) を参照して CLI を導入してから MCP 登録 / 再認証を行う方針にすることを確認した。macOS / Linux の standalone installer は `curl -fsSL https://chatgpt.com/codex/install.sh | sh`。
- 2026-06-09 に、Slack connector は `mcp_servers.slack` ではなく `slack@openai-curated` plugin と Codex app connector 管理で使われていることを確認した。`fetch-slack-materials` に、特定 runtime に依存しない Slack connector 確認と認証切れ時の停止・再認証案内フローを追加した。

## 改善したいこと

- project ごとに「次に見ること」が明確な状態を保つ。特に、Slack / Linear / GitHub / Docs のどこを見るべきかがすぐ分かるようにする。
- status の更新では、過去ログの要約よりも、リリース判断・ブロッカー・未対応依頼・担当の変化を優先する。
- `status.md` を更新した後に、すでに決まったこと、完了したこと、古くなった未解決事項が残っていないかを必ず確認する。
- `status.md` は [status.md 標準フォーマットと更新 Workflow](status-md-format-workflow.md) を元に作り、Project ごとの品質と読みやすさを揃える。
- Project 更新後に情報量が増えすぎた場合は、[Project 更新後レビュー skill 案](project-update-review-skill-idea.md) の観点で、削除・圧縮・移動・残す情報を見直す。
- `notes/` は増やしすぎず、繰り返し出てくる話題は project 化するか、既存 project に移す。
- 定期確認を使う場合は、通知する条件を project ごとに絞り、定型更新や古い状況の再通知を避ける。
- 外部リンクは、後から読み返して意味が分かる表示名にする。Linear は ID とタイトル、GitHub は repo 名または文脈と PR 番号を必ず残す。
- 新しい project を作る前のインタビューを軽量化し、最初から完璧な構成にせず、観測ポイントだけ決めて始められるようにする。

## 情報収集 skill の設計方針

- skill は単一責任にする。Project 更新全体を 1 つの巨大 skill にせず、取得 skill と整理 skill を分ける。
- 取得 skill は、Slack / Linear / Notion / GitHub など情報源ごとに分ける。役割は、指定された対象から必要な材料を取ってくること。
- 何を取得しに行くかは、呼び出し側から渡す。例: 対象 channel、thread、issue、doc、期間、確認したい観点、除外したい情報。
- 整理 skill は、取得済みの材料を入力として受け取り、事実、推測、重要リンク、未解決事項、ユーザー対応待ちに分類する。
- 整理 skill は、ログ全文や雑な要約を作らない。Project 更新に使う判断材料だけを短く返す。
- Project 固有の判断、優先度付け、`status.md` への反映はメインの Codex が行う。
- 複数情報源を見る場合は、メインの Codex が取得 skill / サブエージェントを並列に呼び、整理 skill の結果を統合して durable な変化だけを note / project に反映する。
- 外部 connector の認証切れは、取得 skill の共通エラーとして扱う。`Reauthentication required` のような認証エラーを検知したら、追加調査を続けず、対象、失敗した tool、再認証が必要なこと、再認証後に同じ対象で再試行することだけを短く返す。token や OAuth フローを skill に保存・自動代行させない。
- MCP 対応済みの外部 connector では、認証エラー時に `mcp_servers.<name>` の有無を確認し、未設定なら MCP 登録コマンド、設定済みなら `codex mcp login <name>` を案内する。`codex` が PATH にない場合は、Codex.app 内の bundled CLI path も併記する。
- `codex` が PATH になく、Codex.app 内の bundled CLI も使えない場合は、[Codex CLI 公式ドキュメント](https://developers.openai.com/codex/cli) の install 手順を先に案内する。非対話インストールが必要な運用では、公式 docs の `CODEX_NON_INTERACTIVE=1` を使う。

## 対応済みの改善

- 2026-05-28: Slack から指定観点の材料を取得する `fetch-slack-materials` を作成済み。配置先は `.agents/skills/fetch-slack-materials`。
- 2026-05-28: Linear から指定観点の材料を取得する `fetch-linear-materials` を作成済み。配置先は `.agents/skills/fetch-linear-materials`。
- 2026-05-28: Notion / Docs から指定観点の材料を取得する `fetch-notion-materials` を作成済み。配置先は `.agents/skills/fetch-notion-materials`。
- 2026-05-28: GitHub から指定観点の材料を取得する `fetch-github-materials` を作成済み。配置先は `.agents/skills/fetch-github-materials`。
- 2026-05-28: 上記 4 つの取得 skill は、`skill-creator` で初期化し、`quick_validate.py` で `Skill is valid!` を確認済み。
- 2026-06-09: `fetch-slack-materials` に Slack connector 設定・認証チェックを追加した。まず tool discovery と read-only probe を使い、必要な場合だけ `~/.codex/config.toml` の plugin 設定を確認する。Python / Node など特定 runtime には依存しない。

## 未対応 / 次の候補

- `classify-project-materials`: 取得済みの材料を、事実、推測、重要リンク、未解決事項、ユーザー対応待ちに分類する。
- `review-project-update`: 更新後の `status.md` を読み、読みやすさ、鮮度、重複、古い情報、セクション配置の問題を指摘する。
- `fetch-linear-materials` の認証切れハンドリング: Linear tool が `401: Reauthentication required` を返した場合に、失敗 tool 名、対象 issue ID、MCP 登録済みかどうか、Codex CLI が使えるか、再認証後の再試行手順を定型で返す。再認証そのものはユーザー操作として残す。

## status.md 更新後チェック Workflow

詳細なテンプレートは [status.md 標準フォーマットと更新 Workflow](status-md-format-workflow.md) を参照する。

`status.md` を更新したら、最後に次を確認する。

1. 決定済みのことが、まだ「未解決事項」や「次に見ること」に残っていないか確認する。
2. 完了済みのタスクや対応済みのブロッカーを、現在のブロッカーとして残していないか確認する。
3. 古いリリース判断、古い担当、古い日付、すでに無効なリンクが残っていないか確認する。
4. 新しく分かった事実と、推測・未確認事項が混ざっていないか確認する。
5. 変更履歴には、今回の更新で何が変わったかだけを短く残す。
6. 最後に `status.md` を読み返し、「今この project は何が問題で、次に何を見るべきか」が 1 分で分かるか確認する。

このチェックで見つけた古い情報は、削除するか、必要なら変更履歴に短く移す。判断材料としてまだ必要なものだけを残す。

## 次に見ること

- 既存 project の `status.md` に、現在のブロッカー、未解決事項、次に見ることが短く残っているか確認する。
- 既存 project の `status.md` で、決定済み・完了済み・古くなった項目が未解決扱いで残っていないか確認する。
- 勤怠リリース系 project で、重複している情報や古くなったリリース判断がないか確認する。
- 作成済みの `fetch-slack-materials` を実際の Project 更新で試し、取得結果の粒度が大きすぎないか確認する。
- 作成済みの `fetch-slack-materials` で、Slack connector の未接続 / 再認証エラー時に tool discovery、read-only probe、再認証案内、同一対象リトライの流れが過不足なく出るか実地確認する。
- 作成済みの `fetch-linear-materials`、`fetch-notion-materials`、`fetch-github-materials` を実際の Project 更新で試し、取得結果の粒度が大きすぎないか確認する。
- 作成済みの `fetch-linear-materials` で、Linear connector の 401 再認証エラー時に MCP 登録 / Codex CLI 導入 / 再認証案内が過不足なく出るか実地確認する。
- 次に、取得済み材料を分類する `classify-project-materials` を試作するか検討する。
- 情報量が多い project を 1 つ選び、`review-project-update` の観点で整理提案を試す。
- 定期確認を設定するなら、まず対象 project と通知条件を 1 つに絞って試す。

## 未解決事項

- この改善メモを vault 全体の運用メモとして残すか、特定 project に昇格するか。
- 定期確認の頻度と対象情報源をどうするか。
- `fetch-slack-materials` の出力を、そのまま `classify-project-materials` に渡せる形式にするには何が足りないか。
- 取得 skill 群の出力フォーマットを `classify-project-materials` に渡しやすい形へ揃えるには何が足りないか。
- Linear connector の再認証導線を、Codex App plugin connector と Codex MCP server のどちらを標準にして案内するか。MCP server を標準にする場合は、`experimental_use_rmcp_client` の有効化をどこまで自動化するか。
