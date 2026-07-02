# skill のカテゴリ管理

## 背景

skill が `.agents/skills/` に flat に増えてきており、fetch 系、write 系、review 系、workflow 補助系などの役割が一覧で分かりにくくなっている。

## 現状

- `.agents/README.md` では、各 tool が `SKILL.md` を発見しやすいように skill は flat layout にするとしている。
- そのため、いきなり `.agents/skills/fetch/<skill-name>/` のような物理的な nested layout にすると、Codex / Claude Code などの skill discovery と合わない可能性がある。

## 方針

- まずは skill 本体の配置は flat のまま維持する。
- `.agents/skills/README.md` または `.agents/references/skill-catalog.md` を作り、カテゴリ別に skill を一覧できるようにする。
- カテゴリは directory ではなく metadata / index で管理する。
- 将来、Codex / Claude Code の両方で nested skill discovery が問題なく使えることを確認できたら、物理ディレクトリ分割を検討する。

## 分類案

- fetch: `fetch-slack-materials`、`fetch-linear-materials`、`fetch-notion-materials`、`fetch-github-materials`、`fetch-google-meet-materials`、`fetch-google-sheets-materials`
- classify: `classify-fetched-materials`
- write: `write-linear-issue`、`write-linear-project`、`write-linear-milestone`
- review: `review-project-status`、`review-linear-structure`
- project / vault: `create-project-note`、`vault-git-commit`

## 確認したいこと

- `SKILL.md` の frontmatter にカテゴリを持たせるか。これは別途検討し、今は行わない。
- index を手動管理するか、script で生成するか。
- workflow skill から capability skill を探すときに、カテゴリ別 index があると十分か。
- `.agents/README.md` に「flat layout だがカテゴリ index で探す」と明記するか。

## 完了条件

- 人間がカテゴリ別に skill を見つけられる。
- 新しい skill を追加したときの catalog 更新ルールが明確になっている。

## 残課題

- metadata 運用は別途検討し、勝手には追加しない。
