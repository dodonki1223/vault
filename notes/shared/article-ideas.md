# 技術記事のアイデア

技術記事にできそうなテーマの置き場。1 テーマ 1 セクションで、主張、構成案、書く前に必要なこと、参考リンクを短く残す。社内固有の構成や数値は書かず、必要なら抽象化したサンプルで再現する前提で書く。

書き始めたもの・公開したものは、状態を更新する。

---

## CI でフォルダを見て判断するのをやめて、Go に任せる

- 状態: アイデア（2026-11-13 追加）
- きっかけ: Go のモノレポの CI 構成を見直したとき。

### 主張

モノレポの CI は「どのフォルダが変わったか」（paths-filter など）でテストを絞りがちだが、これは Go の外で依存を推測していて、逆向きの依存を見落とす。Go はすでに依存グラフと内容ハッシュのキャッシュを持っているので、CI はキャッシュを正しく受け渡すことに集中すればよい。そして、良いパッケージ設計は速い CI になる。

### Go らしさのうち、この記事に関係するもの

- **ディレクトリ = パッケージ = ビルド、テスト、キャッシュの単位。** フォルダの分け方はパッケージ設計そのもので、CI の速さに直結する。
- **依存は設定ではなく `import` から決まる。** Makefile などに依存を書かない。`go list -deps` で依存グラフを機械的に出せる。
- **ビルドとテストの結果は、中身のハッシュでキャッシュされる（Go 1.10 から）。** 日時ではなく内容で判定するので、Bazel のようなことを標準ツールだけで実現している。
- **テストキャッシュは、テストが同じモジュール内で開いたファイルと、参照した環境変数も判定に含む。** 見落とされるのは、モジュールの外のファイルと、外のプロセス（DB コンテナなど）が読むものだけ。
- **シンプルさと明示性。** 仕組みを足すより、言語とツールの既定の動きに乗る（"Clear is better than clever"）。

### 構成案

1. **よくある構成:** paths-filter でフォルダ単位にジョブを出し分ける。その限界は、逆向きの依存の見落としと、フォルダ一覧のメンテナンス。
2. **Go がすでに持っているもの:** 依存グラフ、内容ハッシュのビルドキャッシュとテストキャッシュ。
3. **落とし穴:** Go が見えない入力（DB コンテナのイメージ、マイグレーション、モジュール外のファイル）。そのため、`-count=1` でキャッシュを全部捨てる運用になりがち。
4. **対策:** 見えない入力を、テストから環境変数やファイルとして読んで Go に見せる。例として、DB イメージの digest を環境変数で渡し、helper で `os.Getenv` する。こうすると `-count=1` を外せる。
5. **GitHub Actions での受け渡し:** PR はデフォルトブランチのキャッシュを使い、デフォルトブランチへの push でテスト結果を含めて作り直し、使っていないものは消す。merge queue のキャッシュは一時ブランチにしか残らない、という制約にも触れる。
6. **影響範囲だけを動かす:** `go list -deps` で変更の影響を受けるパッケージを出し、関係のないジョブを起動しない。
7. **締め:** 良いパッケージ設計は速い CI になる。

### 書く前に必要なこと

- [ ] 小さなサンプルで、環境変数やファイルの変更によってテストキャッシュが無効になることを確かめる（記事にもそのまま載せる）。
- [ ] before / after の実測値（キャッシュの当たる割合、テスト時間）。社外向けには、サンプルリポジトリで測った値を使う。
- [ ] 社内の事例として書くなら、どこまで出してよいかを確認する。

### 関連する話題（別記事か、節にできそう）

- **plan / gate パターン:** 変更検出ジョブと、必須チェックを 1 つに集約するジョブ。skip されたジョブは成功扱いになるので、gate で前段の結果を明示的に確認する必要がある。
- **標準ランナーの同時実行枠:** 組織全体で共有されるため、軽いジョブほど起動待ちに支配される。plan / gate のような必須経路のジョブを、枠が別の larger runner に置く判断。

### 参考リンク

Go の思想

- [Go Proverbs](https://go-proverbs.github.io/): "Clear is better than clever" などの格言集（Rob Pike）
- [Go at Google: Language Design in the Service of Software Engineering](https://go.dev/talks/2012/splash.article): 大規模開発でのビルド速度と依存管理が、言語設計の動機になったことの説明
- [Effective Go](https://go.dev/doc/effective_go): Go らしい書き方の公式ガイド
- [Package names（Go Blog）](https://go.dev/blog/package-names): パッケージの分け方と名前の付け方
- [Organizing a Go module](https://go.dev/doc/modules/layout): ディレクトリ構成の公式ガイド

Go のビルドキャッシュとテストキャッシュ

- [Go 1.10 リリースノート: ビルドキャッシュ](https://go.dev/doc/go1.10#build) / [テストキャッシュ](https://go.dev/doc/go1.10#test): キャッシュが導入されたときの説明
- [cmd/go: Test packages](https://pkg.go.dev/cmd/go#hdr-Test_packages): テスト結果がキャッシュされる条件（ファイルと環境変数の扱い）
- [cmd/go: Build and test caching](https://pkg.go.dev/cmd/go#hdr-Build_and_test_caching): `GOCACHE` の仕組み

GitHub Actions

- [GitHub-hosted runners](https://docs.github.com/en/actions/reference/runners/github-hosted-runners): 標準ランナーのラベルとスペック
- [Actions limits](https://docs.github.com/en/actions/reference/limits): 同時実行数の上限
- [Managing a merge queue](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue): merge queue と `merge_group` イベント
- [Dependency caching](https://docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching): キャッシュを読めるブランチの範囲
- [Using conditions to control job execution](https://docs.github.com/en/actions/using-jobs/using-conditions-to-control-job-execution): skip されたジョブが成功として扱われること
- [dorny/paths-filter](https://github.com/dorny/paths-filter): フォルダ単位の変更検出の Action
- [re-actors/alls-green](https://github.com/re-actors/alls-green): gate のような集約ジョブを 1 行で書く Action
