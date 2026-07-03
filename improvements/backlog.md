# Vault 改善 backlog

## 目的

この file は、vault の運用改善でまだ対応できていないことを見つけるための index。

詳細は `improvements/tasks/` 配下の task file に置く。過去の改善メモにあった内容のうち、すでに skill / workflow / README に反映済みのものはここへ残さない。

## 運用

- 1 task file につき 1 改善テーマにする。
- この index には、状態、優先度、task file link だけを残す。
- 完了したものは task file を削除するか、必要な場合だけ完了済みとして短く残す。
- 分割後も、古くなった改善案や実装済みの改善案は定期的に削る。

## 未対応

| 状態 | 優先度 | 改善 | 概要 |
|---|---|---|---|
| 未着手 | 高 | [MCP / connector 認証チェック harness](tasks/mcp-connector-auth-check.md) | fetch / write 系 skill 実行前に必要な connector 認証を確認する。 |
| 未着手 | 高 | [入力情報から必要タスクを分解する skill](tasks/decompose-task-from-materials.md) | 完了条件と関連情報から、実装時に読める粒度のタスク一覧を作る。 |
| 未着手 | 高 | [Project リスク判定 skill](tasks/assess-project-risks.md) | 標準リスクモデルを参考に Project のリスクを構造的に判定する。 |
| 未着手 | 高 | [Project の透明性・検査・適応 skill](tasks/project-transparency-inspection-adaptation.md) | issue 一覧や Timeline document から Project が透明性・検査・適応を回せる状態か確認する。 |
| 未着手 | 中 | [fetch 系 skill の体裁チェック script](tasks/fetch-skill-format-check-script.md) | fetch 系 skill の必須セクションや境界が揃っているか確認する。 |
| 未着手 | 中 | [skill のカテゴリ管理](tasks/skill-category-management.md) | flat layout のままカテゴリ別に skill を見つけやすくする。 |
| 未着手 | 中 | [skill の enable / invocation policy 管理](tasks/skill-invocation-policy.md) | skill ごとの自動起動・明示起動・無効化の推奨状態を管理する。 |
| 未着手 | 中 | [Linear 書き込み skill の実地確認](tasks/linear-write-skill-validation.md) | issue / Project / milestone 書き込み skill を安全な対象で確認する。 |
| 未着手 | 中 | [トークン使用量とコストの可視化](tasks/token-usage-visibility.md) | 依頼単位・日単位で token と概算コストを見られるようにする。 |
| 未着手 | 中 | [token usage 確認 skill](tasks/check-token-usage-skill.md) | 自然言語で token usage と概算コストを確認できる skill を作る。 |
| 未着手 | 中 | [サブエージェント並列化とモデル選択](tasks/subagent-parallelization-model-selection.md) | 情報取得の並列化とコストに応じた model 選択を整える。 |
| 未着手 | 低 | [Project 更新 workflow skill の実運用テスト](tasks/project-update-workflow-validation.md) | Project 更新 workflow skill を実際の Project で検証する。 |
| 未着手 | 低 | [定期確認の設計](tasks/recurring-project-check-design.md) | Project の定期確認、通知条件、heartbeat / automation の扱いを決める。 |

## 次にやる候補

1. [MCP / connector 認証チェック harness](tasks/mcp-connector-auth-check.md)
2. [入力情報から必要タスクを分解する skill](tasks/decompose-task-from-materials.md)
3. [Project リスク判定 skill](tasks/assess-project-risks.md)

## 判断メモ

- 取得、分類、更新、レビューは混ぜない。
- 外部サービスへの書き込みは、read-only の取得 skill と分ける。
- Project 更新のような進行役は workflow skill、個別能力は capability skill として扱う。
- 新しい構造を増やす前に、既存の skill で運用できるかを試す。
