# Linear OAuth 再認証フロー

Linear の情報取得・レビュー・書き込みでは、ローカルに登録した直接 MCP（`mcp__linear__*`、server name: `linear`）を優先する。hosted plugin（`mcp__codex_apps__linear_*`）とは OAuth 接続が別なので、画面上の ON 表示だけで認証済みと判断しない。

## 認証が必要なとき

必要最小の read-only リクエストで `401: Reauthentication required`、`Unauthorized`、`Authentication required`、`oauth_token_invalid_grant`、`This app connection requires reauthentication` などが返った場合は、次の順で対応する。

1. hosted plugin 側だけが失敗し、直接 MCP が利用可能なら、認証済みの直接 MCP で同じ read-only リクエストを確認する。
2. 直接 MCP も未認証または認証切れなら、TTY を有効にして `codex mcp login linear` を実行し、OAuth の待受セッションを維持する。
3. コマンドが出力した `https://mcp.linear.app/authorize...` URL をそのまま OS の `open` で開く。URLを組み立て直さず、note、comment、skill、最終回答へ保存しない。
4. ユーザーには、ブラウザに表示された Linear の認可画面で `Authorize` / `Allow` を押すよう促す。OAuth code、token、cookie の貼り付けは求めない。
5. 待受セッションを60秒以内の間隔で確認する。認証成功後、最初に失敗した対象へ同じ read-only リクエストを再実行する。
6. 疎通が確認できたら、元の取得・レビュー・書き込み作業を自動的に再開する。

`codex` が PATH にない場合は `/Applications/Codex.app/Contents/Resources/codex mcp login linear` を使う。直接 MCP 自体が未登録の場合は、`codex mcp add linear --url https://mcp.linear.app/mcp` で登録してから上記を実施する。

## 停止条件

- ブラウザを開く OS 権限やネットワーク許可が必要な場合は、その承認だけをユーザーへ求める。
- OAuth 画面で workspace 管理者の承認が必要、権限が拒否された、callback が完了しないなど、ユーザーの認可操作後もログインが成功しない場合は停止し、確認できた失敗理由と再試行条件を返す。
- 認証前に別の tool で書き込みを試さない。OAuth 認証は、元の依頼で許可されていない Linear 更新まで許可するものではない。
- OAuth の一時 URL、code、token、cookie を vault や外部サービスへ記録しない。

