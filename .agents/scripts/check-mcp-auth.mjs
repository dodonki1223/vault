#!/usr/bin/env node

import { execFileSync } from "node:child_process";

const requested = process.argv
  .slice(2)
  .filter((arg) => arg !== "--")
  .map((arg) => arg.trim())
  .filter(Boolean);

const targetNames = requested.length > 0 ? new Set(requested) : null;

function runCodexMcpList() {
  try {
    return execFileSync("codex", ["mcp", "list"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (error) {
    const stderr = error.stderr ? String(error.stderr) : "";
    const stdout = error.stdout ? String(error.stdout) : "";
    throw new Error([stdout, stderr].filter(Boolean).join("\n").trim() || error.message);
  }
}

function parseMcpList(output) {
  const rows = [];

  for (const rawLine of output.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("Name ") || line.startsWith("----")) continue;

    const parts = line.split(/\s{2,}/);
    if (parts.length < 4) continue;

    if (parts[1]?.startsWith("http")) {
      rows.push({
        name: parts[0],
        type: "remote",
        target: parts[1],
        bearerTokenEnvVar: parts[2] === "-" ? "" : parts[2],
        status: parts[3] || "",
        auth: parts[4] || "",
      });
      continue;
    }

    rows.push({
      name: parts[0],
      type: "local",
      target: parts[1] || "",
      bearerTokenEnvVar: "",
      status: parts.at(-2) || "",
      auth: parts.at(-1) || "",
    });
  }

  return rows;
}

function classify(row) {
  if (row.status !== "enabled") {
    return {
      level: "ng",
      reason: "disabled",
      nextAction: `MCP '${row.name}' を有効化してください。`,
    };
  }

  if (looksLikeSecret(row.bearerTokenEnvVar)) {
    return {
      level: "ng",
      reason: "bearer token value configured where env var name is expected",
      nextAction: `MCP '${row.name}' の bearer token 設定を環境変数名に変更してください。`,
    };
  }

  if (row.bearerTokenEnvVar && !process.env[row.bearerTokenEnvVar]) {
    return {
      level: "ng",
      reason: "bearer token env missing",
      nextAction: `環境変数 ${row.bearerTokenEnvVar} を設定してから再実行してください。`,
    };
  }

  if (row.auth === "OAuth") {
    return {
      level: "unknown",
      reason: "OAuth configured; live probe required",
      nextAction: `認証エラーが出る場合は codex mcp login ${row.name} を実行してください。`,
    };
  }

  if (row.auth === "Bearer token") {
    return {
      level: "ok",
      reason: "bearer token env configured",
      nextAction: "-",
    };
  }

  return {
    level: "unknown",
    reason: row.auth || "auth status unsupported",
    nextAction: "対象 skill の read-only probe で確認してください。",
  };
}

function looksLikeSecret(value) {
  if (!value) return false;

  return [
    /^github_pat_[A-Za-z0-9_]+$/,
    /^gh[pousr]_[A-Za-z0-9_]+$/,
    /^sk-[A-Za-z0-9_-]+$/,
  ].some((pattern) => pattern.test(value));
}

function format(rows) {
  const filtered = targetNames ? rows.filter((row) => targetNames.has(row.name)) : rows;
  const missing = targetNames
    ? [...targetNames].filter((name) => !rows.some((row) => row.name === name))
    : [];

  const lines = ["# MCP Auth Check", ""];

  if (filtered.length > 0) {
    lines.push("| MCP | Status | Auth | 判定 | 理由 | 次にやること |");
    lines.push("|---|---|---|---|---|---|");
    for (const row of filtered) {
      const result = classify(row);
      lines.push(
        `| ${row.name} | ${row.status || "-"} | ${row.auth || "-"} | ${result.level} | ${result.reason} | ${result.nextAction} |`,
      );
    }
    lines.push("");
  }

  if (missing.length > 0) {
    lines.push("## 未設定");
    lines.push("");
    for (const name of missing) {
      lines.push(`- ${name}: codex mcp add または connector / plugin 設定が必要です。`);
    }
    lines.push("");
  }

  lines.push("## 補足");
  lines.push("");
  lines.push("- `ok`: 設定上は利用可能です。");
  lines.push("- `unknown`: OAuth の実有効性は `codex mcp list` だけでは確定できません。対象 skill の read-only probe で確認してください。");
  lines.push("- `ng`: 設定または環境変数が不足しています。追加取得や書き込みに進まず、次にやることを確認してください。");
  lines.push("- 自動再認証は行いません。OAuth 認証はユーザー本人が実行してください。");

  return lines.join("\n");
}

try {
  const output = runCodexMcpList();
  const rows = parseMcpList(output).filter((row) => row.name !== "node_repl");
  console.log(format(rows));
} catch (error) {
  console.error("# MCP Auth Check");
  console.error("");
  console.error("- 種別: codex mcp list 実行失敗");
  console.error(`- 理由: ${error.message}`);
  console.error("- 次にやること: Codex CLI が利用できるか、PATH とログイン状態を確認してください。");
  process.exit(1);
}
