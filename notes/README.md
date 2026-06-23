# notes

このフォルダは、短期記憶の仮置き場。一時メモ、下書き、単発の記録、まだ Project 化するほどではない作業の種を置く。

`notes/` は inbox ではなく、失うと困るが継続 Project にするには早い文脈を置く場所。次回も使うことが明らかなものは `projects/` に置く。使うか分からないものは `notes/` に短く置き、使わないものは書かない。

## git 管理方針

`notes/` は git 管理するものとローカル専用のものを分ける。

- `notes/shared/`: git commit で管理してよい note。
- `notes/local/`: git commit に残したくない note。

迷う場合は `notes/local/` に置き、commit してよい粒度に抽象化できたら `notes/shared/` に移す。

commit 前には `git status --short` と staged files を確認し、`notes/local/` 配下のファイルが含まれていないことを確認する。

## shared と local

`notes/shared/` には、vault の運用ルール、workflow、skill 設計など、公開されても問題ない粒度に抽象化された改善メモを置く。

`notes/local/` には、公開したくない情報、アクセス制限のある情報、第三者に関する情報、まだ commit してよいか判断できない文脈を置く。`README.md` 以外は `.gitignore` で無視する。

詳しくは `notes/shared/README.md` と `notes/local/README.md` も見る。

## 置くもの

- 1 回限りの調査メモ、未分類のアイデア、相談から出た判断メモ。
- 複数 Project にまたがる軽い観察や、後で Project 化するかもしれない種。
- まだ Project にするほどではないが、失うと困る文脈。

## 置かないもの

- 継続的に状態管理する必要があるもの。これは `projects/` に置く。
- Slack、Linear、Docs などを見れば分かるログのコピー。
- 使うか分からないまま肥大化する inbox 的なメモ。

notes は短く保ち、必要なら「次に見る条件」を書く。同じ話題が繰り返し出たら Project 化を検討する。
