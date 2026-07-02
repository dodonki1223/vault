# Vault 改善

この directory は、vault 自体を良くするための改善 backlog を管理する場所。

ここには、特定の Project や一時メモではなく、vault の運用、skill、workflow、script、agent 設定、コスト管理など、repository 全体に関わる改善を置く。

## 構成

- `backlog.md`: 未対応の改善案を一覧する index。状態、優先度、task file link、短い概要だけを書く。
- `tasks/`: 改善案ごとの task file。背景、ほしい状態、最初にやること、関連、完了条件、残課題を書く。

## 運用

- 新しい改善案は、まず既存 task と重複しないか確認する。
- 1 task file につき 1 改善テーマにする。
- `backlog.md` には詳細を書かず、詳細は `tasks/` に置く。
- 完了した task は、原則として `backlog.md` と `tasks/` から削除する。
- 完了 task の判断や運用ルールが後から必要なら、task file には残さず、成果物側へ移す。例: `README.md`、`.agents/README.md`、該当 skill、該当 reference。
- 個人情報、社内限定 URL、具体的な Project 本体の情報は置かない。

## Skill

改善 backlog や task file を更新するときは、`manage-vault-improvements` skill を使う。
