# Skills

この directory は、repository-local な agent skill の置き場。

skill は discovery のため flat layout にする。物理 directory では分類せず、workflow skill は `workflow-` prefix、通常 skill は責務が分かる名前、この catalog で役割を確認する。

## Workflow skills

複数の capability skill を組み合わせる進行役。ユーザーが明示的に起動したい繰り返し workflow はここに置く。

- `workflow-update-project-note`: 既存 Project note の状況確認、情報取得、分類、`status.md` 更新、更新後レビューを進行する。
- `workflow-update-linear-project-timeline`: Linear Project に紐づく情報から、後から参画する人向けの時系列 document を作成・更新する。
- `workflow-write-and-review-linear`: Linear への書き込み draft、実行、Linear Method に沿ったレビューを進行する。

## Capability skills

単一責任の部品。workflow skill やユーザー依頼から直接使う。

### fetch

外部サービスから指定対象の情報だけを取得する read-only skill。分類や更新は行わない。

- `fetch-slack-materials`: Slack から指定対象の情報を取得する。
- `fetch-linear-materials`: Linear から指定対象の情報を取得する。
- `fetch-notion-materials`: Notion / Docs から指定対象の情報を取得する。
- `fetch-github-materials`: GitHub から指定対象の情報を取得する。
- `fetch-google-meet-materials`: Google Meet の MTG メモや関連 Docs / Drive 情報を取得する。

### classify

取得済み情報を後続処理に渡しやすい形に整理する。

- `classify-fetched-materials`: 取得済み情報を事実、決定事項、推測、重要リンク、未解決事項、次アクション、ユーザー対応待ちなどに分類する。

### write

外部サービスに書き込む skill。必ず draft とユーザー確認を挟む。

- `write-linear-issue`: Linear issue を作成・更新する。
- `write-linear-project`: Linear Project を作成・更新する。
- `write-linear-milestone`: Linear milestone を作成・更新する。

### review

更新後の内容や構造を確認する read-only skill。

- `review-project-status`: Project `status.md` 更新後に品質レビューを行う。
- `review-linear-structure`: Linear の Project、milestone、issue が Linear Method に沿っているかレビューする。

### project / vault

vault の構造や Project note を扱う skill。

- `create-project-note`: 新しい Project note を `projects/active/` に作成する。
- `vault-git-commit`: vault repository の変更を安全に確認して commit する。
