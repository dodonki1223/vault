# Chief of Staff Vault

## Setup

この vault の運用 tool は Node.js で管理する。

```bash
mise install
pnpm install
```

Node.js の version は `.mise.toml` で固定する。

## Usage

Token usage の確認には `ccusage` を使う。

```bash
pnpm usage:daily
pnpm usage:session
pnpm usage:monthly
```
