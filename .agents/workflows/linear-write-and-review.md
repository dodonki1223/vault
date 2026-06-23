# Linear 書き込み後レビュー workflow

## 目的

Linear の issue、Project、milestone を作成・更新したあと、Linear Method の原則に沿っているかを確認する。

この workflow は進行役であり、書き込みとレビューの細部は skill に委譲する。

## 入力

- 対象: Linear issue / Project / milestone。
- 操作: create / update / comment / status change / assign / date change など。
- 変更内容と理由。
- 必要に応じて、レビューで特に見たい観点。例: 粒度、scope、完了条件、調査結果の扱い、description と comment の使い分け。

## 使う skill

- `write-linear-issue`: Linear issue の作成・更新を行う。
- `write-linear-project`: Linear Project の作成・更新を行う。
- `write-linear-milestone`: Linear milestone の作成・更新を行う。
- `review-linear-structure`: 作成・更新後に Linear Method の原則に沿っているかレビューする。

## 手順

1. 書き込み対象を確認する。
   - issue、Project、milestone のどれかを特定する。
   - 操作内容、変更理由、対象 URL / ID / name を確認する。
   - 対象や理由が曖昧な場合は、実行前に短く確認する。

2. 対応する write skill を選ぶ。
   - issue の作成・更新・comment・status change は `write-linear-issue` を使う。
   - Project の作成・更新は `write-linear-project` を使う。
   - milestone の作成・更新は `write-linear-milestone` を使う。

3. 書き込み前に draft を提示する。
   - write skill の draft フォーマットに従う。
   - 対象、変更内容、理由、実行後に返す link を明確にする。
   - ユーザーが明示的に承認した場合だけ Linear に書き込む。

4. Linear に書き込む。
   - write skill の実行手順に従う。
   - 認証切れ、権限不足、対象不明、validation error の場合は追加書き込みを止める。
   - 書き込み結果として、対象、変更内容、Linear link を返せる状態にする。

5. 書き込み後レビューを行う。
   - `review-linear-structure` を使う。
   - 作成・更新した対象だけを狭く確認する。
   - 必要なら、関連する milestone や代表 issue を一部だけ見る。
   - レビュー観点は、粒度、scope、完了条件、description と comment の使い分け、調査結果の反映、issue 分解の妥当性を優先する。

6. レビュー結果を判断する。
   - 問題がなければ、そのまま完了として返す。
   - 軽微な改善があれば、提案として返す。
   - 修正が必要そうな場合でも、勝手に再書き込みしない。

7. 追加修正が必要な場合は、再度 draft を提示する。
   - 追加の Linear 書き込みは、必ずユーザーの明示承認を取る。
   - 承認された場合だけ、対応する write skill を再度使う。
   - 再書き込み後も、必要に応じて `review-linear-structure` で確認する。

8. 結果を返す。
   - 書き込んだ対象。
   - 実施した変更。
   - レビュー結果。
   - 追加提案または確認が必要な点。

返答には次の形を含める。

```markdown
## Linear 書き込み結果

- 対象:
- 変更内容:
- Link:

## レビュー結果

- 結論:

## 追加提案

-

## 確認が必要な点

-
```

## 境界

- この workflow は Linear への書き込みを含むため、書き込み前に必ずユーザー確認を取る。
- レビュー後に自動で再書き込みしない。
- 全 issue の網羅レビューを目的にしない。必要な範囲だけを狭く見る。
- Linear の詳細な取得手順や API 操作の細部は workflow に書かず、各 skill に委譲する。
- vault の Project note や notes は自動更新しない。必要なら別 workflow として扱う。
