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
| 未着手 | 高 | [入力情報から必要タスクを分解する skill](tasks/decompose-task-from-materials.md) | 完了条件と関連情報から、実装時に読める粒度のタスク一覧を作る。 |
| 未着手 | 高 | [Project リスク判定 skill](tasks/assess-project-risks.md) | 標準リスクモデルを参考に Project のリスクを構造的に判定する。 |
| 未着手 | 高 | [Project の透明性・検査・適応 skill](tasks/project-transparency-inspection-adaptation.md) | issue 一覧や Timeline document から Project が透明性・検査・適応を回せる状態か確認する。 |
| 未着手 | 中 | [script による体裁チェックの仕組み](tasks/script-based-format-checks.md) | skill や workflow skill の体裁を script で継続的に確認できるようにする。 |
| 未着手 | 中 | [skill のカテゴリ管理](tasks/skill-category-management.md) | flat layout のままカテゴリ別に skill を見つけやすくする。 |
| 未着手 | 中 | [skill の enable / invocation policy 管理](tasks/skill-invocation-policy.md) | skill ごとの自動起動・明示起動・無効化の推奨状態を管理する。 |
| 未着手 | 中 | [token usage 高騰通知 skill](tasks/token-usage-alert-skill.md) | token / cost が一定の目安を超えたら個人 Slack DM へ通知する。 |
| 未着手 | 中 | [skill ごとのモデル自動判定と固定指定](tasks/skill-model-config.md) | skill の性質からモデルを自動推論し、特定 skill は固定モデルを宣言できるようにする。 |
| 未着手 | 中 | [問題解決メソッド skill](tasks/problem-solving-method-skill.md) | 理想と現実のギャップを事実・解釈・真因・課題・優先度に整理するフレームワークを skill 化する。 |
| 未着手 | 低 | [Project 更新 workflow skill の実運用テスト](tasks/project-update-workflow-validation.md) | Project 更新 workflow skill を実際の Project で検証する。 |
| 未着手 | 低 | [定期確認の設計](tasks/recurring-project-check-design.md) | Project の定期確認、通知条件、heartbeat / automation の扱いを決める。 |

## 次にやる候補

1. [入力情報から必要タスクを分解する skill](tasks/decompose-task-from-materials.md)
2. [Project リスク判定 skill](tasks/assess-project-risks.md)
3. [Project の透明性・検査・適応 skill](tasks/project-transparency-inspection-adaptation.md)

## 判断メモ

- 取得、分類、更新、レビューは混ぜない。
- 外部サービスへの書き込みは、read-only の取得 skill と分ける。
- Project 更新のような進行役は workflow skill、個別能力は capability skill として扱う。
- 新しい構造を増やす前に、既存の skill で運用できるかを試す。
