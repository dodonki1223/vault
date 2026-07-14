# Linear issue フォーマットの共通化

## 背景

- Linear issue を作成するときに、description のフォーマットが依頼ごとにばらつき、共通のテンプレートに揃わない。
- 背景、完了条件、対象範囲、関連リンクなどの並びや見出しが毎回変わり、後から読む人が探しにくい。
- `write-linear-issue` skill には issue 作成機能はあるが、description の標準フォーマットが定義されていない。

## ほしい状態

- issue description の標準フォーマット（見出しと順序）が 1 つ定義されている。
- issue 作成時に、その標準フォーマットが自動で下敷きになる。
- 背景 / 完了条件 / 対象範囲 / 関連リンクなど、最低限そろえたい項目が毎回同じ位置にある。
- description と comment の使い分け（`review-linear-structure` / Linear Method の原則）と矛盾しない。
- テンプレートを空欄のまま埋めずに書き込むことがない。

## 最初にやること

- 現状の `write-linear-issue` skill の draft 生成部分を確認し、フォーマット定義がどこに入るか見る。
- そろえたい項目（背景、完了条件、対象範囲、関連リンク、除外事項など）を洗い出す。
- 標準テンプレートを 1 つ決め、skill 側に template として持たせるか、reference に置くか決める。

## 関連

- `.agents/skills/write-linear-issue/`
- `.agents/skills/workflow-write-and-review-linear/`
- `.agents/skills/review-linear-structure/`
- `.agents/references/linear-method-principles.md`
- [Linear 書き込み skill の実地確認](linear-write-skill-validation.md)
- [入力情報から必要タスクを分解する skill](decompose-task-from-materials.md)

## 完了条件

- issue description の標準フォーマットが定義され、参照場所が決まっている。
- `write-linear-issue` の draft がそのフォーマットに沿って生成される。
- description と comment の使い分け原則と整合している。

## 残課題

- Linear 側の issue template 機能を使うか、skill 側で持つか。
- Project / チームごとにフォーマットを分ける必要があるか。
