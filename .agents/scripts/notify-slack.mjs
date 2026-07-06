#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import process from "node:process";

const args = process.argv.slice(2).filter((arg) => arg !== "--");
const dryRunIndex = args.indexOf("--dry-run");
const dryRun = dryRunIndex !== -1;

if (dryRun) {
  args.splice(dryRunIndex, 1);
}

const agent = takeOption(args, "--agent") ?? process.env.VAULT_NOTIFY_AGENT ?? "codex";

if (!["codex", "claude"].includes(agent)) {
  console.error("Invalid --agent. Use codex or claude.");
  process.exit(1);
}

const message = args.join(" ").trim();

if (!message) {
  console.error("Usage: pnpm notify:slack -- \"通知本文\"");
  console.error("       pnpm notify:slack -- --dry-run \"通知本文\"");
  console.error("       pnpm notify:slack -- --agent codex \"通知本文\"");
  console.error("       pnpm notify:slack -- --agent claude \"通知本文\"");
  process.exit(1);
}

const prompt = buildPrompt({ agent, message });

if (dryRun) {
  console.log(prompt);
  process.exit(0);
}

try {
  if (agent === "codex") {
    execFileSync("codex", ["exec", "-C", ".", "--sandbox", "danger-full-access", prompt], {
      stdio: "inherit",
    });
  } else {
    execFileSync("claude", ["--print", prompt], {
      stdio: "inherit",
    });
  }
} catch (error) {
  process.exit(error.status ?? 1);
}

function takeOption(args, name) {
  const equalsPrefix = `${name}=`;
  const equalsIndex = args.findIndex((arg) => arg.startsWith(equalsPrefix));
  if (equalsIndex !== -1) {
    const value = args[equalsIndex].slice(equalsPrefix.length);
    args.splice(equalsIndex, 1);
    return value;
  }

  const index = args.indexOf(name);
  if (index === -1) return null;

  const value = args[index + 1];
  args.splice(index, value ? 2 : 1);
  return value ?? "";
}

function buildPrompt({ agent, message }) {
  const firstLine =
    agent === "codex"
      ? "slack-outgoing-message skill を使って、以下の通知文をユーザー本人への Slack DM として送信してください。"
      : "Claude Code で利用できる Slack skill / MCP / tool を使って、以下の通知文をユーザー本人への Slack DM として送信してください。";

  return [
    firstLine,
    "",
    "条件:",
    "- 宛先はユーザー本人の DM です。",
    "- 通知文の先頭にユーザー本人への Slack mention を付けてください。例: `<@U123456> ...`。",
    "- ユーザー本人の Slack user ID を解決できない場合は、mention なしで送らず、送信せずに理由を報告してください。",
    "- ユーザー本人の Slack DM 宛先を解決できない場合は、送信せずに理由を報告してください。",
    "- Slack connector / MCP / tool の認証エラーが出た場合は、送信せずに次に必要な対応を報告してください。",
    "- Slack 送信機能がこの環境で使えない場合は、送信せずに不足している設定を報告してください。",
    "- 通知文を勝手に長くしないでください。",
    "- push、git 操作、ファイル編集はしないでください。",
    "",
    "通知文:",
    "```text",
    message,
    "```",
  ].join("\n");
}
