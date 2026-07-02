# skill の enable / invocation policy 管理

## 背景

skill が増えてきたため、すべての skill が常に自動起動候補になると、意図しない skill が使われたり、context cost が増えたりする。Codex と Claude Code の両方で使う前提で、skill ごとに「自動起動してよい」「明示起動だけ」「ローカルでは無効」などの推奨状態を管理したい。

## ほしい状態

- repo 内で skill ごとの推奨 invocation policy が分かる。
- Codex と Claude Code で実際にどう設定するかが分かる。
- 副作用がある skill、書き込み系 skill、commit 系 skill は、原則として明示起動に寄せられる。
- read-only の fetch / review 系 skill は、自動起動を許可するか、必要に応じて明示起動にできる。
- 共通 `SKILL.md` に tool 固有の設定を混ぜすぎない。

## 方針案

- 共有 skill の `SKILL.md` は、原則として `name` / `description` のみを frontmatter に置く。
- Codex の自動起動制御は `agents/openai.yaml` の `policy.allow_implicit_invocation` を使う。
- Claude Code の自動起動制御は `disable-model-invocation: true` または `skillOverrides` を使う。
- 完全な enable / disable は、基本的にユーザー個人設定に寄せる。
  - Codex: `~/.codex/config.toml` の `[[skills.config]]`
  - Claude Code: `.claude/settings.local.json` の `skillOverrides`
- repo 内には、実設定ではなく「推奨状態」を catalog として持つ。

## 推奨状態の候補

- `auto`: 自動起動してよい。
- `explicit-only`: 明示起動だけにしたい。
- `disabled-local`: ローカル設定で無効化してよい。

## 最初にやること

1. `.agents/skills/README.md` に skill ごとの推奨 invocation policy 欄を追加するか検討する。
2. 書き込み系 skill と commit 系 skill を `explicit-only` にする候補として整理する。
3. Codex 用に `agents/openai.yaml` の `allow_implicit_invocation: false` をどの skill に入れるか決める。
4. Claude Code 用の `skillOverrides` は repo に commit せず、設定例だけ残すか検討する。

## 関連

- [Codex Skills: Enable or disable skills](https://developers.openai.com/codex/skills)
- [Claude Code Skills: Restrict Claude's skill access](https://code.claude.com/docs/en/skills)
- [Claude Code context costs](https://code.claude.com/docs/en/features-overview)
- `.agents/skills/README.md`

## 完了条件

- skill ごとの推奨 invocation policy が一覧できる。
- Codex / Claude Code それぞれの設定方法が明文化されている。
- 副作用がある skill が意図せず自動起動しにくい状態になっている。

## 残課題

- repo に tool 固有設定をどこまで入れるか。
- Codex / Claude Code の設定差分をどこに残すか。
