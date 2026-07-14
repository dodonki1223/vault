# skill ごとのモデル自動判定と固定指定

## 背景

現状、skill の実行時にどのモデルを使うかは `.agents/model-profiles/fetch-light.toml` / `fetch-standard.toml` の設定を参照するにとどまり、自動判定や強制指定の仕組みがない。skill の性質に応じたモデル選択が属人化しており、コスト増や判断ミスが起きやすい。

## ほしい状態

- skill の性質（軽作業・判断・書き込み draft・複雑なレビューなど）から、使用モデルを自動推論できる。
- 特定 skill は固定モデルを宣言できる（例: write 系は Sonnet 固定、リスク判定は Opus 固定）。
- 設定箇所が一元化されており、個々の skill 側でモデルを個別に意識しなくてよい。
- 自動判定と固定指定が共存でき、固定指定が優先される。

## 最初にやること

1. skill の性質を分類する軸を決める（例: read-only / write / review / planning）。
2. 分類ごとのデフォルトモデルを定義する場所を決める（設定ファイル or skill metadata）。
3. 固定指定の宣言方法を検討する（skill header に記述 or 外部設定）。
4. 既存の暫定ポリシー表との整合を取る。

## 関連

- `.agents/model-profiles/fetch-light.toml` / `fetch-standard.toml`: 現在の model 選択の実体

## 完了条件

- skill の性質からデフォルトモデルが自動で決まる仕組みが動いている。
- 固定指定が必要な skill に宣言が入っている。
- 設定の一元管理場所が決まっており、README などに記載されている。

## 制約・確認済み挙動

### Claude Code

- セッション途中でのモデル変更は不可。モデルはセッション開始時に固定される。
- `Agent` ツールの `model` パラメータでサブエージェントにモデルを指定できる。
- 「重い判断だけ Opus のサブエージェントに委譲し、軽い処理は Sonnet のまま」という設計が可能。
- ただし `Agent` ツールの `model` は `sonnet` / `opus` / `haiku` / `fable` の alias のみを受け付ける。`claude-sonnet-5` のような正式な model ID や、GPT 系（`gpt-5.6-terra` など）は指定できない。
- `.agents/model-profiles/*.toml` は `Agent` ツールには自動適用されない。適用されるのは `.agents/scripts/run-fetch-skill.mjs` / `run-agent-profile.mjs`（`pnpm fetch:materials` など）を command として明示的に呼んだ場合だけ（2026-07-14 確認、`subagent-parallelization-model-selection.md` の実装時に判明）。

### Codex

- セッション途中でも `/model` コマンドでモデルを変更できる。
- サブエージェントへのモデル指定は `~/.codex/agents/<agent-name>.toml` の `model` フィールドで宣言する方式。
- `model_reasoning_effort`（`low` / `medium` / `high`）も設定可能。
- skill ごとに TOML ファイルを用意してモデルを固定するアプローチが取れる。

## 残課題

- Codex の skill と custom agent の違いを実地確認する。モデル固定は custom agent 側の機能であり、skill に直接モデルを指定できるかは未確認。
- Claude Code と Codex で設定方式が異なるため、一元管理の方法を検討する。
- モデル名変更時の更新コストをどう下げるか検討する。
