#!/usr/bin/env node

import { spawn } from "node:child_process";

const allowedSkills = new Set([
  "fetch-slack-materials",
  "fetch-linear-materials",
  "fetch-notion-materials",
  "fetch-github-materials",
  "fetch-google-meet-materials",
  "fetch-google-sheets-materials",
  "fetch-web-materials",
]);

function usage() {
  console.error("Usage: pnpm fetch:materials -- --agent codex --skill fetch-slack-materials --profile fetch-light \"依頼内容\"");
  console.error("       pnpm fetch:materials -- --agent claude --skill fetch-linear-materials --profile fetch-standard \"依頼内容\"");
  console.error("       pnpm codex:fetch:materials -- --skill fetch-slack-materials --profile fetch-light \"依頼内容\"");
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

const args = process.argv.slice(2).filter((arg) => arg !== "--");

const dryRun = args.includes("--dry-run");
if (dryRun) {
  args.splice(args.indexOf("--dry-run"), 1);
}

const agent = takeOption(args, "--agent") ?? "codex";
const skill = takeOption(args, "--skill");
const profile = takeOption(args, "--profile") ?? "fetch-light";

if (!["codex", "claude"].includes(agent)) {
  console.error("Invalid --agent. Use codex or claude.");
  process.exit(1);
}

if (!skill || !allowedSkills.has(skill)) {
  console.error("Invalid --skill.");
  console.error(`Allowed skills: ${Array.from(allowedSkills).join(", ")}`);
  process.exit(1);
}

const request = args.join(" ").trim();
if (!request) {
  usage();
  process.exit(1);
}

const prompt = [
  `$${skill} を使って、以下の依頼に従って情報を取得してください。`,
  "",
  "条件:",
  "- 取得だけを行い、分類、優先度判断、ファイル更新、外部サービスへの書き込みはしないでください。",
  "- 返答は可能な限り `.agents/references/subagent-fetch-contract.md` の出力契約に合わせてください。",
  "- 認証不足や権限不足なら、同契約の失敗時フォーマットで返してください。",
  "",
  "依頼内容:",
  "```text",
  request,
  "```",
].join("\n");

const childArgs = [
  ".agents/scripts/run-agent-profile.mjs",
  "--agent",
  agent,
];

if (dryRun) {
  childArgs.push("--dry-run");
}

childArgs.push(profile, prompt);

const child = spawn("node", childArgs, {
  stdio: "inherit",
  cwd: process.cwd(),
  env: process.env,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});
