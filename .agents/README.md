# .agents

repository-local な agent assets の canonical home。

Codex、Claude Code など複数のエージェントで共通利用する skill / command / reference は、ここを正として管理する。各エージェント固有のディレクトリには、同じ内容をコピーしない。

## Skills

- skill は `.agents/skills/<skill-name>/` を編集する。
- 各 tool が `SKILL.md` を発見しやすいように、skill は flat layout にする。
- 繰り返し実行する workflow も skill として置く。workflow skill は `workflow-` prefix を付け、通常 skill と名前で区別する。
- 人間向けの一覧は `.agents/skills/README.md` を見る。新しい skill を追加したら catalog も更新する。
- Codex 用に `.codex/skills` が `../.agents/skills` を指している。
- `.codex/skills` 配下に見える skill は symlink 経由の同じ実体なので、直接編集しない。
- 将来 Claude Code も対応する場合は、`.claude/skills` も `.agents/skills` を指す symlink にする。
- エージェントごとの都合で別形式が必要な場合は、共通 skill をコピーせず、薄い wrapper から `.agents/skills` を参照する。
- `.codex/skills` や `.claude/skills` が実ディレクトリになっていたら二重管理の兆候なので、編集前に symlink へ戻す方針を確認する。

## Commands

- スラッシュコマンド的な入口も、基本は workflow skill として `.agents/skills/` に置く。
- Codex や Claude Code 側で専用の command / prompt wrapper が必要な場合は、共通 skill をコピーせず、薄い wrapper から `.agents/skills/<skill-name>/SKILL.md` を参照する。
- `.agents/workflows/` は実行用の置き場として使わない。実行したいものは workflow skill にする。

## References

- 複数の skill / workflow から参照する共通チェックリストや基準は `.agents/references/` に置く。
- reference は実行手順ではなく、判断基準や共通フォーマットを置く場所にする。
