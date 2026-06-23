# Linear Method 作成・レビュー原則

Linear の Project、milestone、issue を作成・更新・レビューするときの共通判断基準。

## 共通用語

- goal（目標）: 前進したか判断できる到達点。
- scope（対象範囲）: 今回扱う範囲。大きすぎる場合は削るか段階に分ける。
- outcome（得たい結果）: 完了後に得られている状態。
- enabler（実現したい価値を可能にするもの）: 後続の価値提供や作業を進めるために必要なもの。
- blocker（前進を止めている障害）: 利用、実装、意思決定、リリースを妨げているもの。
- user experience（ユーザー体験）: ユーザーが機能や業務フローを使うときの体験。
- product requirement（プロダクト要件）: プロダクトとして満たすべき仕様や条件。
- task / problem（作業または解くべき問題）: issue として担当者が実行・解決できる単位。

## Project の原則

Project は、方向性、目標、scope（対象範囲）、優先度を揃えて、チームが迷わず実行できる単位として書く。単なる issue の入れ物や議論ログにしない。

- Project は、何を達成するかと、なぜ今やるかを短く説明する。
- goal（目標）は抽象的な願望ではなく、前進したか判断できる形にする。
- 優先度の理由を書く場合は、それが enabler（実現したい価値を可能にするもの）なのか、blocker（前進を止めている障害）なのかを明確にする。
- scope（対象範囲）は小さく保つ。大きすぎる場合は milestone（中間成果）や段階に分ける。
- Project description では、milestone 全体の流れ、並列に進められる範囲、依存関係のある範囲が分かるようにする。
- milestone が複数あり前後関係が重要な場合は、必要に応じて Mermaid などで全体像を図式化する。
- Project description には、背景、目標、対象範囲、対象外、成功条件、主要 link を置く。
- user experience（ユーザー体験）や product requirement（プロダクト要件）の詳細は、必要な docs / spec に置き、Project description には実行に必要な要点と link だけを残す。
- Project 内の issue は、Project の目標を進める具体的な task / problem（作業または解くべき問題）に分解する。

## Milestone の原則

Milestone は、大きな Project を実行可能な段階に分け、継続的に前進していることを確認するために使う。単なる日付ラベルや issue の置き場にしない。

- milestone は、Project の goal（目標）に向かう中間成果として書く。
- milestone ごとに明確な outcome（得たい結果）と完了条件を置く。
- 大きすぎる milestone は scope（対象範囲）を削るか、さらに小さな milestone に分ける。
- 早く feedback（反応・検証結果）を得られる順番に並べる。
- enabler / blocker のどちらを解消する milestone かが重要な場合は description に残す。
- milestone 同士に前後関係がある場合は、前提となる milestone、後続への影響、target date の制約を明確にする。
- milestone の依存関係が複数ある場合は、必要に応じて Mermaid などで前後関係と並列に進められる範囲を図式化する。
- 依存が強すぎる milestone は、scope（対象範囲）を削るか、前提を満たす milestone と後続 milestone に分ける。
- milestone に含める issue は、その milestone の outcome（得たい結果）に直接つながる task / problem（作業または解くべき問題）に絞る。
- milestone の description には、目的、完了条件、対象 issue の考え方、重要 link だけを置く。

## Issue の原則

Issue は user story（ユーザー視点の定型文）ではなく、具体的なタスクまたは問題を平易な言葉で伝えるために書く。目的は、担当者が作業でき、関係者が何の作業か理解できる最小十分な情報を渡すこと。

- title は短く、一覧で見ても何をする issue か分かる形にする。
- issue には明確な outcome（得たい結果）がある task / problem（作業または解くべき問題）だけを書く。
- 大きすぎる feature、曖昧な idea、議論そのものは issue にせず、Project、docs、会話で整理してから小さな issue に分ける。
- description は必須情報を詰め込む場所ではなく、作業に必要な context、判断材料、深い議論への link を置く場所として使う。
- user experience（ユーザー体験）や product requirement（プロダクト要件）の詳細は、task level（タスク単位）に過剰に持ち込まず、Project / spec / docs 側で扱う。
- bug report や依頼を他者向けに書く場合は、解決策を決めつけず、問題または ask として書く。担当者が解法を決められる余地を残す。
- 優先度を説明する必要がある場合は、それが enabler（実現したい価値を可能にするもの）なのか、blocker（前進を止めている障害）なのか、なぜ今やるのかを書く。
- 1 issue が大きすぎる場合は scope（対象範囲）を削るか、段階に分ける。

## 決定事項・調査結果の扱い

Issue に残す情報は、担当者が作業でき、関係者が何の作業か理解できる最小十分な情報に絞る。議論や調査のすべてを description に集約しない。

- 調査途中のメモ、議論、候補案、確認ログは comment に残す。
- 決定した結論、採用方針、実装時に必要な前提は description に短く反映する。
- 長い仕様、詳細な調査結果、比較表、議事録は docs / spec に置き、issue には要点と link だけを残す。
- issue 完了時の成果は comment に残す。必要なら description の `完了条件`、`補足`、関連する前提に要約を反映する。
- comment は時系列の経緯、description は最新の作業前提として使い分ける。
- 調査 issue では、調査結果を comment に残したうえで、後続で実装 issue を切る必要があるかを明記する。

## レビュー観点

既存の Project、milestone、issue を確認するときは、次を短く見る。

- 何を達成するか、なぜ今やるかが分かるか。
- scope（対象範囲）と対象外が分かるか。
- 完了条件があり、前進したか判断できるか。
- Project description で、milestone 全体の流れ、並列に進められる範囲、依存関係が分かるか。
- issue が大きすぎる feature や議論そのものになっていないか。
- milestone が単なる日付ラベルや issue 置き場になっていないか。
- milestone 同士の依存関係、前提、後続への影響、target date が矛盾していないか。
- milestone の依存関係が複雑な場合、並列に進められるものと順番が必要なものが図や文章で分かるか。
- user experience（ユーザー体験）や product requirement（プロダクト要件）の詳細が issue に入りすぎていないか。
- enabler / blocker の観点で、優先度や順序の理由が説明できるか。
- 関連 docs / spec / PR / Slack などは、本文に貼りすぎず重要 link として辿れるか。
- comment にある決定事項や調査結果のうち、作業前提として必要なものが description に反映されているか。

## 参考

- [Linear Method: Set useful goals](https://linear.app/method/set-useful-goals)
- [Linear Method: Prioritize enablers and blockers](https://linear.app/method/prioritize-enablers-and-blockers)
- [Linear Method: Scope projects down](https://linear.app/method/scope-projects)
- [Linear Method: Write issues not user stories](https://linear.app/method/write-issues-not-user-stories)
