#!/usr/bin/env node

import { execFileSync } from "node:child_process";

function parseArgs(argv) {
  const args = argv.filter((arg) => arg !== "--");
  let agent = "all";

  const agentIndex = args.indexOf("--agent");
  if (agentIndex !== -1) {
    agent = args[agentIndex + 1] ?? agent;
    args.splice(agentIndex, 2);
  }

  if (!["all", "codex", "claude"].includes(agent)) {
    throw new Error(`Invalid --agent: ${agent}. Use all, codex, or claude.`);
  }

  const targetNames = args.map((arg) => arg.trim()).filter(Boolean);
  return { agent, targetNames: targetNames.length > 0 ? new Set(targetNames) : null };
}

function looksLikeSecret(value) {
  if (!value) return false;

  return [
    /^github_pat_[A-Za-z0-9_]+$/,
    /^gh[pousr]_[A-Za-z0-9_]+$/,
    /^sk-[A-Za-z0-9_-]+$/,
  ].some((pattern) => pattern.test(value));
}

// --- Codex adapter -----------------------------------------------------

function runCodexMcpList() {
  return execFileSync("codex", ["mcp", "list"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function parseCodexMcpList(output) {
  const rows = [];

  for (const rawLine of output.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("Name ") || line.startsWith("----")) continue;

    const parts = line.split(/\s{2,}/);
    if (parts.length < 4) continue;

    if (parts[1]?.startsWith("http")) {
      rows.push({
        name: parts[0],
        target: parts[1],
        bearerTokenEnvVar: parts[2] === "-" ? "" : parts[2],
        status: parts[3] || "",
        auth: parts[4] || "",
      });
      continue;
    }

    rows.push({
      name: parts[0],
      target: parts[1] || "",
      bearerTokenEnvVar: "",
      status: parts.at(-2) || "",
      auth: parts.at(-1) || "",
    });
  }

  return rows.filter((row) => row.name !== "node_repl");
}

function classifyCodex(row) {
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

function codexAdapter() {
  const output = runCodexMcpList();
  return parseCodexMcpList(output).map((row) => ({
    agent: "codex",
    name: row.name,
    detail: row.auth || "-",
    ...classifyCodex(row),
  }));
}

// --- Claude Code adapter ------------------------------------------------

function runClaudeMcpList() {
  return execFileSync("claude", ["mcp", "list"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function parseClaudeMcpList(output) {
  const rows = [];

  for (const rawLine of output.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("Checking MCP server health")) continue;

    const match = line.match(/^(.+?):\s(.+?)\s-\s(.+)$/);
    if (!match) continue;

    rows.push({
      name: match[1].trim(),
      target: match[2].trim(),
      statusText: match[3].trim(),
    });
  }

  return rows;
}

function classifyClaude(row) {
  const status = row.statusText;

  if (status.includes("✔") || /connected/i.test(status)) {
    return { level: "ok", reason: "connected", nextAction: "-" };
  }

  if (status.includes("!") || /needs authentication/i.test(status)) {
    return {
      level: "ng",
      reason: "needs authentication",
      nextAction: `claude mcp login ${row.name} を実行してください（claude.ai 管理の connector はブラウザでの認可が必要な場合があります）。`,
    };
  }

  if (status.includes("✘") || /failed to connect/i.test(status)) {
    return {
      level: "ng",
      reason: "failed to connect",
      nextAction: `claude mcp get ${row.name} で詳細を確認してください。generic MCP server が Dynamic Client Registration 非対応のことがあります。`,
    };
  }

  return {
    level: "unknown",
    reason: status || "status unsupported",
    nextAction: "対象 skill の read-only probe で確認してください。",
  };
}

function claudeAdapter() {
  const output = runClaudeMcpList();
  return parseClaudeMcpList(output).map((row) => ({
    agent: "claude",
    name: row.name,
    detail: row.statusText,
    ...classifyClaude(row),
  }));
}

// --- shared formatting ---------------------------------------------------

const ADAPTERS = {
  codex: { run: codexAdapter, label: "Codex", missingHint: (name) => `codex mcp add ${name} ...` },
  claude: { run: claudeAdapter, label: "Claude Code", missingHint: (name) => `claude mcp add ${name} ...` },
};

function collectRows(agent) {
  const agentsToRun = agent === "all" ? ["codex", "claude"] : [agent];
  const rows = [];
  const errors = [];

  for (const agentName of agentsToRun) {
    try {
      rows.push(...ADAPTERS[agentName].run());
    } catch (error) {
      const stderr = error.stderr ? String(error.stderr) : "";
      const stdout = error.stdout ? String(error.stdout) : "";
      const message = [stdout, stderr].filter(Boolean).join("\n").trim() || error.message;
      errors.push({ agent: agentName, message });
    }
  }

  return { rows, errors };
}

function format({ rows, errors }, targetNames) {
  const filtered = targetNames ? rows.filter((row) => targetNames.has(row.name)) : rows;
  const missingByAgent = new Map();

  if (targetNames) {
    for (const agentName of Object.keys(ADAPTERS)) {
      const seen = new Set(rows.filter((row) => row.agent === agentName).map((row) => row.name));
      const missing = [...targetNames].filter((name) => !seen.has(name));
      if (missing.length > 0 && !errors.some((e) => e.agent === agentName)) {
        missingByAgent.set(agentName, missing);
      }
    }
  }

  const lines = ["# MCP Auth Check", ""];

  if (filtered.length > 0) {
    lines.push("| Agent | MCP | 詳細 | 判定 | 理由 | 次にやること |");
    lines.push("|---|---|---|---|---|---|");
    for (const row of filtered) {
      lines.push(
        `| ${ADAPTERS[row.agent].label} | ${row.name} | ${row.detail} | ${row.level} | ${row.reason} | ${row.nextAction} |`,
      );
    }
    lines.push("");
  }

  for (const [agentName, missing] of missingByAgent) {
    lines.push(`## ${ADAPTERS[agentName].label} 未設定`);
    lines.push("");
    for (const name of missing) {
      lines.push(`- ${name}: ${ADAPTERS[agentName].missingHint(name)} または connector / plugin 設定が必要です。`);
    }
    lines.push("");
  }

  if (errors.length > 0) {
    lines.push("## 取得できなかった agent");
    lines.push("");
    for (const err of errors) {
      lines.push(`- ${ADAPTERS[err.agent].label}: ${err.message}`);
    }
    lines.push("");
  }

  lines.push("## 補足");
  lines.push("");
  lines.push("- `ok`: 設定上は利用可能、または live health check で接続確認済みです（Claude Code の `claude mcp list` は接続確認まで行います）。");
  lines.push("- `unknown`: OAuth の実有効性が list だけでは確定できません（Codex の `codex mcp list` は静的な設定表示のみです）。対象 skill の read-only probe で確認してください。");
  lines.push("- `ng`: 設定・環境変数が不足している、または接続に失敗しています。追加取得や書き込みに進まず、次にやることを確認してください。");
  lines.push("- 自動再認証は行いません。OAuth 認証はユーザー本人が実行してください。");
  lines.push("- Slack の generic MCP 登録（`mcp.slack.com/mcp` を `.mcp.json` で直接指定する方式）は Codex / Claude Code どちらも Dynamic Client Registration 非対応のため `ng` になります。Slack は各 agent の account-level connector（Codex: App、Claude: claude.ai connector）を使ってください。詳細は `.agents/references/mcp-connector-notes.md` を参照。");
  lines.push("- 名前フィルタ（`-- <name>...`）は agent ごとの表示名をそのまま使います。Codex は `linear` のような短い名前、Claude Code は `claude.ai Linear` のような connector 名になることが多く、`--agent all` で同じ名前を指定すると片方が誤って `未設定` になります。両方の名前を正確に確認したい場合は、まず名前指定なしで実行して agent ごとの実際の表示名を確認してください。");

  return lines.join("\n");
}

try {
  const { agent, targetNames } = parseArgs(process.argv.slice(2));
  const result = collectRows(agent);
  console.log(format(result, targetNames));
  if (result.rows.length === 0 && result.errors.length > 0) {
    process.exitCode = 1;
  }
} catch (error) {
  console.error("# MCP Auth Check");
  console.error("");
  console.error("- 種別: 実行失敗");
  console.error(`- 理由: ${error.message}`);
  console.error("- 次にやること: --agent には all / codex / claude を指定してください。CLI が利用できるか、PATH とログイン状態も確認してください。");
  process.exit(1);
}
