# 良かった記事

直近読んで良かった記事やリポジトリを、リンクと短い要約で残す。あとで人に共有したり、考えを引用したくなったときに探せる状態を保つのが目的。

## 書き方

- 新しいものを上に足す。
- 1 件につき「なぜ良かったか」を 1〜2 行、要点を数行。全文要約はしない。
- 公開されているものだけ置く。社内資料やアクセス制限のあるものは `notes/local/` へ。

---

## 気になる記事

### サブエージェントでコードを調査し、改善アドバイスをまとめる

- [Claude Code: カスタムサブエージェントの作成・コードレビューの例](https://code.claude.com/docs/en/sub-agents)
- [OpenAI: Codex のサブエージェントによる並列調査・レビュー](https://learn.chatgpt.com/docs/agent-configuration/subagents)
- Anthropic / OpenAI 公式ドキュメント / 2026-11-12 追加
- 別々のコンテキストでコードを調査し、結果の要約を親エージェントに返す仕組み。繰り返し使うレビュー観点は専用エージェントとして定義できる。
- 使い方の案: 対象機能を絞り、「設計・保守性」「不具合・データ整合性」「性能・テスト」の3観点に分担する。親が根拠をコードで確認し、重複を除いて重要な提案をまとめる。
- 依頼時は、コード変更の可否と、該当ファイル・問題が起きる条件・影響・改善案を返すことを指定する。確認できた問題と設計上の提案を分ける。
- 各エージェントが個別に調査するため、使用量も増える。小さな対象は単独調査から始める。

### Which Claude model should you build with? Fable, Opus, Sonnet, or Haiku

- [Which Claude model should you build with? Fable, Opus, Sonnet, or Haiku](https://claude.dev/blog/which-claude-model-should-you-build-with/)
- Addy Osmani / claude.dev / 2026-11-09 公開 / 2026-11-12 追加
- Claude のモデルと推論の強度（effort）を、作業の難しさ・待ち時間・完了までの費用で選ぶための記事。
- 記事の推奨: 通常は Opus 5.5 の `medium` を起点にし、範囲が明確な作業は Sonnet 5.5、単純な大量処理は Haiku 5.5、難しい技術課題は Fable 5.2 を検討する。
- 精度が足りなければ、まずテストなどで自己検証できるようにし、次に effort を上げ、さらに必要なら上位モデルを低めの effort から試す。
- 小さいモデルには検証しやすい補助作業を任せる。モデル切り替え時はキャッシュと推論履歴の互換性を確認し、実際の仕事で品質と完了タスク当たりの費用を比較する。
- モデル名・推奨設定は記事公開時点の記載。

### 国内で相次ぐ不正アクセスに対する注意喚起についてまとめてみた

- [国内で相次ぐ不正アクセスに対する注意喚起についてまとめてみた](https://piyolog.hatenadiary.jp/entry/2026/10/11/004353)
- piyokango / piyolog / 2026-10-11 公開 / 2026-10-13 追加
- 状態: 未読・あとで読む
- 国内の不正アクセス・情報漏えいを受けた各機関の注意喚起と、API悪用などの攻撃類型を整理した記事。

### Harness engineering for coding agent users

- [Harness engineering for coding agent users](https://martinfowler.com/articles/harness-engineering.html)
- Birgitta Böckeler / martinfowler.com / 2026-10-13 追加
- 状態: 未読・あとで読む
- コーディングエージェントを支えるガイドと検証・フィードバックの設計を整理する記事。

### ハーネスエンジニアリング：エージェントファーストの世界における Codex の活用

- [ハーネスエンジニアリング：エージェントファーストの世界における Codex の活用](https://openai.com/ja-JP/index/harness-engineering/)
- OpenAI / 2026-10-13 追加
- 状態: 未読・あとで読む
- Codex を前提にした開発で、エージェントが働く環境をどう設計するかを扱う実践記事。

### Effective context engineering for AI agents

- [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- Anthropic / 2026-10-13 追加
- 状態: 未読・あとで読む
- AI エージェントに渡すコンテキストの選択・管理を扱う記事。

### Effective harnesses for long-running agents

- [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- Anthropic / 2026-10-13 追加
- 状態: 未読・あとで読む
- 長時間・複数セッションにまたがるエージェント作業を支える仕組みを扱う記事。

### How we contain Claude across products

- [How we contain Claude across products](https://www.anthropic.com/engineering/how-we-contain-claude)
- Anthropic / 2026-10-13 追加
- 状態: 未読・あとで読む
- 各製品で Claude の動作範囲を制限する仕組みを扱う記事。

### The lethal trifecta for AI agents: private data, untrusted content, and external communication

- [The lethal trifecta for AI agents: private data, untrusted content, and external communication](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/)
- Simon Willison / 2026-10-13 追加
- 状態: 未読・あとで読む
- 機密データへのアクセス、信頼できないコンテンツ、外部通信が組み合わさる際のエージェントのリスクを扱う記事。

### Harness Engineering for AI Coding Agents: Constraints That Ship Reliable Code

- [Harness Engineering for AI Coding Agents: Constraints That Ship Reliable Code](https://www.augmentcode.com/guides/harness-engineering-ai-coding-agents)
- Augment Code / 2026-10-13 追加
- 状態: 未読・あとで読む
- AI コーディングエージェントの出力を安定させる制約とハーネス設計のガイド。

### Language Models for Text Classification: From Bag-of-Words to Jev

- [Language Models for Text Classification: From Bag-of-Words to Jev](https://magazine.sebastianraschka.com/p/classifier-history-and-jev)
- Sebastian Raschka / 2026-09-29 公開 / 2026-10-09 追加
- 状態: 未読・あとで読む
- テキスト分類の歴史を Bag-of-Words、RNN、CNN、Transformer から Jev まで図解する記事。分類モデルの使い分けと確率の較正も扱う。

---

## What Elite Engineering Teams Do Differently in the Age of AI

- https://newsletter.eng-leadership.com/p/what-elite-engineering-teams-do-differently
- Gregor Ojstersek / Engineering Leadership newsletter / 2026-09-03
- OpenAI、Anthropic、Shutterstock、Weave の Engineering Leader に、平均的なチームと優れたチームを分けるものを聞いた記事
- 日本語での紹介: [TAKAKING22 の投稿（記事の Inner Loop / Outer Loop の整理）](https://x.com/TAKAKING22/status/2095659809593053303)

**なぜ良かったか**: AI 時代の差を、コードを速く書く能力ではなく、ユーザーから学んで成果へ近づく「outer loop」の速さとして捉えている。言い換えると、差がつくのは「どれだけ速く作れるか」ではなく **「どれだけ速く学べるか」**。チームの North Star と短期の測定可能な仕事をどう両立させるか、という組織運営の観点も実用的。

**要点**（本文は有料購読者限定。以下は公開部分で確認できた範囲）

- 平均的なチームは、コードの作成・出荷を速める **inner loop** に集中しやすい。優れたチームはそれに加えて、実際のユーザーフィードバックを集め、学び、プロダクトを反復する **outer loop** も最適化する。
- AI によって inner loop が高速化・コモディティ化するほど、**Build → Feedback → Learning → Improvement** という outer loop を短くする能力がチームの競争力になる。
- 重要なのはコード量ではなく、ユーザー利用やエンゲージメントなどの成果。Codex のようなツールをテストと反復にも組み込み、開発とユーザー成果の距離を縮める。
- チームが優れているかを見るシグナルは、長期的な **North Star が明確か**、そこへ到達できているか、進捗を測る具体的な指標があるか。
- 長期化しやすいインフラ仕事は、小さく管理可能な成果へ分解すると進捗が見えやすくなる。
- 短期的に仕事が集中しても、長期目標を見失わず、担当を絞り、予定変更を明確に伝えながら対処できることが強いチームの特徴。

> Anthropic におけるチームの野心、在籍期間とコミットメント、組織のフラットさや投資対価についての節は有料部分のため、内容は未確認。

---

## 採用面接で「AI使ってます！」って言うエンジニアに対してするべき質問10選

- https://x.com/voidwarriorchan/status/2089094496663535618
- VWC / Void戦士ちゃん（@voidwarriorchan）/ 2026-08-17
- 「AI を使っている」の中身を、運用経験の有無で切り分けるための質問リスト

**なぜ良かったか**: 質問がどれも「作った経験」ではなく「壊れたときにどうしたか」を聞く形になっている。面接に限らず、自分が AI 機能を設計するときのチェックリストとしてそのまま使える。

**要点**（10 問の骨子）

| # | 論点 | 聞いていること |
|---|---|---|
| Q1 | モデルとコードの責任分離 | モデルに任せた部分と通常のコードで保証した部分。プロンプト改善以外に何を実装したか |
| Q2 | 更新され続ける知識の扱い | 出典付き回答システムでの、分割 / 検索 / 並べ替え / アクセス制御 / 更新・削除の反映 |
| Q3 | 変更による品質低下の検知 | プロンプト・モデル・検索方式・ツール定義を変えたときの回帰確認。残すテストケースとリリース可否の指標 |
| Q4 | AI 評価をどこまで信用するか | LLM-as-a-judge の偏りと誤判定。自動評価と人手評価の組み合わせ方 |
| Q5 | 副作用のある操作の安全な実行 | 送金・メール送信などの実行フロー。入力検証、権限確認、ユーザー承認、再試行、重複実行の防止 |
| Q6 | 暴走する AI の止め方 | ループの検知と停止条件。時間 / 実行回数 / トークン / 費用 / ツール利用回数の予算設計 |
| Q7 | モデル障害時の継続性 | 別モデルへ切り替える条件。品質・機能が落ちるときの UX の変更 |
| Q8 | 一回の失敗の追跡 | 「遅くて内容も間違っていた」という 1 リクエストをどう追うか（trace の設計） |
| Q9 | 増えたコストの分析 | モデル単位ではなく機能 / 顧客 / ワークフロー / 処理段階で特定する。事業価値と見合うかの判断基準 |
| Q10 | 本番での失敗から得たもの | 最も危険だった失敗について、発生・発見・影響停止・原因特定・再発防止の 5 点 |

観点は「作れるか」ではなく **運用・観測・停止・コスト**に寄っている。Q3・Q6・Q8・Q9 は、そのまま自分の workflow skill やエージェント運用の穴を見つける問いになる。

---

## What the Top 1% of Engineering Teams Do Differently with AI

- https://newsletter.eng-leadership.com/p/what-the-top-1-of-engineering-teams
- Gregor Ojstersek / Engineering Leadership newsletter / 2026-06-15
- San Francisco の Engineering Leadership LIVE での講演をまとめたもの

**なぜ良かったか**: AI 活用の差がチーム構造やレビュー対象の違いとして表れる、という切り口。個人の使い方ではなく組織側の話として読める。

**要点**（本文は有料購読者限定。以下は公開部分と検索結果から取得した範囲で、本文未確認）

- トップ層は AI に **glue work を吸わせ、人間は壊れると困る「判断の層」に集中させる**。
- Weave の調査データとして挙げられていた差分: **組織がフラット**、**チームが小さい**、**code review より spec review**、**AI への支出が多い**。

> 全文は未読。上記は公開されている抜粋と検索結果に基づく。購読して読んだら要点を差し替える。

---

## AI-Native な開発の実践に向けて

- https://engineering.mercari.com/blog/entry/20260630-b22667b4d6/
- YamaguchiToshikazu（becosuke）/ メルカリ NFT チーム / 2026-06-30
- AI エージェントを前提にした開発環境（ハーネス）を、実際のプロダクト開発でどう整えたかの実践報告

**なぜ良かったか**: ハーネスエンジニアリングの話を日本語の実務例で読める。特に「何を外注し、何を自前で持つか」の線引きが具体的。

**要点**

- 中心的な主張は **「機構は外部から調達し、判断基準は自前で保持する」**。ハーネスの「正解を示す」「結果を観測する」「危険を止める」という 3 つの役割のうち、**「判断基準だけは、その案件ならではの価値観そのものなので、外注できません」**。
- **コードの一貫性**。同一概念に 1 つの名前を割り当てる命名ルールの統一で、万単位の行数を削減。AI が読む文脈のノイズを減らすことが目的。
- **判断記録の層別化**。`spec` / `design` は現況を書き、`RDR` / `ADR` は判断の経緯を書く。Git を origin、Notion を読む場所として役割分担する。レビューコメントは職種別 skill に自動反映させる。
- **テストの決定論化**。テスト定義の作成までは AI に任せ、実行フェーズからは推論を排除。Playwright で出品・購入・オファーなど主要フローの回帰テストを自動化。
- **PII の三段防御**。commit / PR / Jira チケット作成の各段階に保護層を置き、一段目を突破しても二段目で止める冗長設計。
- 成果: エンジニア 2 名の体制で PR 数が大幅増加。修正系 PR の割合は抑えたまま新機能 PR が伸びた。アラート調査も AI で自動化。
- 運用観として **「ドメイン知識を skill に集め、agent は薄いラッパーに保つ」**。

---

## サブエージェントなら弱いモデルで十分か？

- https://zenn.dev/knowledgesense/articles/fd754b2a08c3ac
- Atsushi Kadowaki（ナレッジセンス）/ 2026-07-21
- East China Normal University の論文（2026-07）の解説

**なぜ良かったか**: マルチエージェント構成でどこにコストを割くべきかに、数値で答えを出している。workflow skill でモデルを選ぶときの根拠に使える。

**要点**

- AI の役割を **分解役（親エージェント）/ 実行役（サブエージェント）/ 回答役** に分けて検証している。
- タスク分解を入れるだけで **EM が約 8.6 ポイント上昇**。
- **親エージェントを強いモデルにすると EM 27.86 → 39.18、LLM ジャッジ 41.50 → 57.38** と大きく改善する。
- 一方 **サブエージェントを強化しても EM の改善は約 2.6 ポイント**に留まる。
- **「サブエージェントがどれだけ優秀でも、親の指示が間違っていたらリカバリーできない」**。
- 実装への示唆: 親に強いモデルを置き、サブエージェントには小さく自己完結したタスクを割り当てる。これでコストと精度を両立できる。

---

## ハーネスエンジニアリング: エージェントファーストの世界における Codex の活用

- https://openai.com/ja-JP/index/harness-engineering/
- OpenAI（Ryan Lopopolo）/ 2026-02-11
- 「手書きコード禁止」で 5 か月 / 約 100 万行を Codex だけで作った実践報告

**なぜ良かったか**: エージェントに任せる前提でリポジトリをどう設計するか、という問いに具体的な答えを出している。この vault の `AGENTS.md` や `.agents/` の構成を見直すときの基準になる。

**要点**

- **ハーネスエンジニアリング** — コードそのものではなく、エージェントが効率的に働ける環境（scaffold、ドキュメント構造、制約）を設計する仕事。人間は操縦し、エージェントが実行する。
- **エージェントの認識可能性** — **「見えないものは存在しない」**。Google Docs やチャットに知識を置かず、リポジトリ内のバージョン管理された場所に全部書く。
- **段階的開示** — **「Codex には1000ページの取扱説明書ではなくマップを与えよ」**。`AGENTS.md` は 100 行程度の目次に留め、実体は構造化した `docs/` に置いて必要な分だけ辿らせる。
- **制約が増幅器として機能する**。ドメインをレイヤー（型 → 設定 → リポジトリ → サービス → ランタイム → UI）に固定し、依存の向きは custom linter で機械的に強制する。人間の規律ではなく CI で守る。
- 可視性への投資。Chrome DevTools Protocol やログ・メトリクス・トレースをエージェントの実行環境に統合し、エージェント自身が動作を検証できるようにする。
- **技術的負債は高金利のローン**。定期バックグラウンドタスクとして Codex を走らせ、逸脱を検出・修正させる（GC のように継続的に返済する）。
- 成果: 約 1,500 PR で約 100 万行。手書き比で約 1/10 の時間、1 人あたり 1 日平均 3.5 PR。3 人から 7 人に拡大してもスループットは向上した。
- 未解明として、完全にエージェント生成されたシステムの長期的なアーキテクチャ一貫性は残課題としている。

---

## herdr — the runtime your coding agents live on

- https://github.com/herdrdev/herdr
- herdrdev / Rust / Apache-2.0 / 32,093 stars（2026-08-25 時点）
- コーディングエージェントを常駐させるための terminal multiplexer 兼 runtime

**なぜ良かったか**: エージェントに投げっぱなしにした作業を「どこで止まっているか」まで含めて扱える前提を提示している。複数エージェントを並行で回すときの土台として見ておきたい。

**要点**

- **常時稼働**。マシン再起動やネットワーク切断後も処理が継続し、任意のターミナルから再接続できる。SSH 越しの遠隔操作にも対応。
- pane ごとに **稼働中 / ブロック中 / アイドル** の状態を表示する。「エージェントが今どうなっているか」を一覧で見られるのが tmux との差。
- Claude Code、Codex、Cursor など複数エージェントに対応。CLI と Socket API から制御でき、pane 間でのメッセージングもできる。
- tmux 風キーバインドとマウス操作の両方に対応。plugin marketplace で拡張可能。
- **one rust binary, no electron**。`brew install herdr` で入り、既存のターミナル環境の上で動く。

---

## codex chief of staff

- https://gist.github.com/jxnl/e96b08aae7d01abf99b99f4b1ea9a321
- jxnl / 2026-04-16
- エージェントを「作業記憶を持つ chief of staff」として立ち上げる手順書

**なぜ良かったか**: この vault の `AGENTS.md` はこの gist を下敷きにしている。運用に迷ったときの原典として、なぜこの構造にしたのかを確認できる。

**要点**

- 目指すのはチャットボットではなく、**仕事環境を監視し、文脈を保持し、必要なときだけ割り込む**アシスタント。
- 立ち上げは 11 段階。短いインタビュー → `~/vault/{projects,notes}` の作成 → `AGENTS.md` にルールを明文化 → 監視対象の特定 → plugin 選定 → 定期実行 → 通知ポリシー、という順で組む。
- **「The vault is just the durable memory layer」** — vault 自体は永続メモリ層でしかなく、価値は運用ルール側にある。
- plugin は名前ではなく **capability で考える**（"Think in capabilities, not plugin names"）。実際に価値が出るものだけ入れる。
- 通知は本当に重要なものだけ。**「If nothing meaningful changed, stay quiet」**、古い status を再通知しない。
- 繰り返し発生するパターンを見つけたらエージェント側から改善を提案する「自己提案契約」を持たせる。
- 全体を貫くのは **「Do not make it complicated」**。派手な自動化ではなく、意思決定を支える軽量な仕組みに寄せる。

---

## 「モデルが20％良くなったら、Harveyは60％」 その成長の裏には弁護士集団「リーガルエンジニア」がいた

- https://blog.allstarsaas.com/posts/harvey-grow-people
- ALL STAR SAAS FUND（聞き手: 前田ヒロ）/ 2026-08-03
- Harvey COO Katie Burke（元 HubSpot CPO）インタビュー

**なぜ良かったか**: 基盤モデルの進化を前提にしたときに、プロダクト組織側が何を差別化要因として積むのかを、実際の急成長企業の内側から具体的に語っている。

**要点**

- **「モデルが20%良くなれば、Harvey は 60% 良くならないといけない」** — 基盤モデルの進化は全社に等しく効くので、それ自体は優位性にならない。業界特化のプロダクト、セキュリティ、サービスの統合で差をつける必要がある。
- 従業員の約 **25% が弁護士**。「リーガルエンジニア」として法務の専門知識と AI を現場で接続し、顧客の導入を加速させる役割を担う。技術バックグラウンドは必須ではない。
- 1年半で 200人 → 1,000人、拠点 3 → 12、顧客 数百社 → 数千社、ARR 約 3 億ドル。本人はこれを「進化ではなく革命」と表現。
- 人材戦略を **「幸せな職場づくり」から「成長機会の提供」へ** シフト。`Harvey Scholars`、`Raising the Bar` などの育成プログラムに投資し、プレイングコーチ型のマネージャーを求める。
- 高速成長の副作用として「ときどき立ち止まって現状を見極めたい」という声が上がる。**「途中の勝利をどう称え、喜び合うか」** が経営側の宿題になる。
