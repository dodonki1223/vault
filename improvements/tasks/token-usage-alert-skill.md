# token usage 高騰通知 skill

## 背景

同じ session を長く使い続けると context が肥大化し、token 使用量や cost が大きくなる可能性がある。

ユーザーが毎回手動で `pnpm usage:*` を確認しなくても、一定の目安を超えたタイミングで「この session は使いすぎかもしれない」「別 session を開始した方がよい」と分かるようにしたい。

## ほしい状態

- token usage / cost を裏で定期的に確認できる。
- session 単位、日単位、直近 7 日など、通知に使う観点を選べる。
- 一定の目安を超えた場合だけ、個人 Slack DM に短く通知できる。
- 通知内容には、対象期間、token、推定 cost、別 session を開始すべきか、次に取る行動だけを含める。
- 請求額の正本ではなく、local usage log と `ccusage` による推定であることを明記する。
- Codex / Claude のどちらからでも、Slack 送信が可能かを事前にチェックできる。

## 通知する条件

- session の total tokens または推定 cost が設定した閾値を超えた。
- 直近の session が急に重くなった。
- 日次 cost が設定した目安を超えた。
- 長い自律作業や Project 更新 workflow skill の後に、usage が大きく増えた。

## 通知しない条件

- 閾値未満の通常利用。
- 同じ内容を短時間に繰り返すだけの通知。
- cost が推定できず、token 数だけでは判断できない場合。ただし token 数が明確に大きい場合は通知候補にする。

## 最初にやること

1. `check-token-usage` skill と `pnpm usage:session` / `pnpm usage:today` で、通知判定に必要な値を取得できるか確認する。
2. 閾値をどこに置くか決める。例: repository に commit しない local config、または skill 内の仮基準。
3. Slack DM への通知は、既存 Slack connector / skill で実行できるか確認する。
   - Codex: 既存 Slack connector / `slack-outgoing-message` を使えるか。
   - Claude: Slack MCP / 送信用 tool が設定されているか。
   - どちらも secret や MCP 設定は repository に含めない。
4. 自動実行の入口を検討する。例: heartbeat automation、cron、手動 command、重い workflow skill の最後。
5. まずは dry-run で通知文だけ作り、実際の Slack 送信はユーザー確認後にする。

## 通知文のイメージ

```markdown
Token usage が大きくなっています。

- 対象: session / YYYY-MM-DD JST
- total tokens:
- estimated cost:
- 判断: 別 session を開始した方がよさそうです
- 理由:

cost は ccusage による推定です。
```

## 関連

- `check-token-usage`
- `pnpm usage:session`
- `pnpm usage:today`
- `slack-outgoing-message`
- `トークン使用量とコストの可視化`
- `MCP / connector 認証チェック harness の multi-agent 対応`

## 完了条件

- 通知判定に使う token / cost の取得方法が決まっている。
- 閾値と通知抑制の考え方が決まっている。
- 個人 Slack DM へ送る文面を生成できる。
- Slack 送信前に、Codex / Claude それぞれで送信可能かを確認できる。
- 実送信する前に dry-run / ユーザー確認を挟める。

## 残課題

- 自動実行をどの仕組みに乗せるか。
- Codex / Claude Code / desktop app の usage の見え方の差分。
- Slack DM の宛先を local-only にするかどうか。
