#!/usr/bin/env node

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { spawn } from "node:child_process";

function usage() {
  console.error("Usage: pnpm agent:profile -- --agent codex <profile-name> \"prompt\"");
  console.error("       pnpm agent:profile -- --agent claude <profile-name> \"prompt\"");
  console.error("       pnpm agent:profile -- --dry-run --agent codex <profile-name> \"prompt\"");
  console.error("       pnpm codex:fetch-light -- \"prompt\"");
  console.error("       pnpm claude:fetch-light -- \"prompt\"");
}

function parseProfile(filePath) {
  const source = readFileSync(filePath, "utf8");
  const profile = {};
  let currentSection = null;

  for (const rawLine of source.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const sectionMatch = line.match(/^\[([A-Za-z0-9_-]+)\]$/);
    if (sectionMatch) {
      currentSection = sectionMatch[1];
      profile[currentSection] = profile[currentSection] ?? {};
      continue;
    }

    const match = line.match(/^([A-Za-z0-9_]+)\s*=\s*"([^"]*)"$/);
    if (!match || !currentSection) continue;

    profile[currentSection][match[1]] = match[2];
  }

  return profile;
}

const rawArgs = process.argv.slice(2);
let dryRun = false;
let agent = "codex";
let overrideModel = null;
let overrideReasoning = null;
let overrideEffort = null;
const positional = [];

for (let i = 0; i < rawArgs.length; i += 1) {
  const arg = rawArgs[i];

  if (arg === "--") continue;

  if (arg === "--dry-run") {
    dryRun = true;
    continue;
  }

  if (arg === "--agent") {
    agent = rawArgs[i + 1] ?? agent;
    i += 1;
    continue;
  }

  if (arg === "--model") {
    overrideModel = rawArgs[i + 1] ?? null;
    i += 1;
    continue;
  }

  if (arg === "--reasoning") {
    overrideReasoning = rawArgs[i + 1] ?? null;
    i += 1;
    continue;
  }

  if (arg === "--effort") {
    overrideEffort = rawArgs[i + 1] ?? null;
    i += 1;
    continue;
  }

  positional.push(arg);
}

if (!["codex", "claude"].includes(agent)) {
  console.error("Invalid --agent. Use codex or claude.");
  process.exit(1);
}

if (positional.length < 2) {
  usage();
  process.exit(1);
}

const [profileName, ...promptParts] = positional;
const prompt = promptParts.join(" ").trim();

if (!prompt) {
  usage();
  process.exit(1);
}

const profilePath = resolve(".agents", "model-profiles", `${profileName}.toml`);
if (!existsSync(profilePath)) {
  console.error(`Profile not found: ${profilePath}`);
  process.exit(1);
}

const profile = parseProfile(profilePath);
const providerConfig = profile[agent];

if (!providerConfig) {
  console.error(`Profile ${profileName} does not define [${agent}] settings.`);
  process.exit(1);
}

const model = overrideModel ?? providerConfig.model;
const reasoning = overrideReasoning ?? providerConfig.model_reasoning_effort ?? null;
const effort = overrideEffort ?? providerConfig.effort ?? null;

if (!model) {
  console.error(`Invalid profile: ${profilePath}`);
  process.exit(1);
}

const command =
  agent === "codex"
    ? buildCodexCommand({ model, reasoning, prompt })
    : buildClaudeCommand({ model, effort, prompt });

if (dryRun) {
  console.log(JSON.stringify({
    agent,
    profile: profileName,
    profilePath,
    model,
    model_reasoning_effort: reasoning,
    effort,
    command,
  }, null, 2));
  process.exit(0);
}

const [bin, ...args] = command;
const child = spawn(bin, args, {
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

function buildCodexCommand({ model, reasoning, prompt }) {
  const args = ["exec", "-C", ".", "-c", `model="${model}"`];
  if (reasoning) {
    args.push("-c", `model_reasoning_effort="${reasoning}"`);
  }
  args.push(prompt);
  return ["codex", ...args];
}

function buildClaudeCommand({ model, effort, prompt }) {
  const args = ["--print", "--model", model];
  if (effort) {
    args.push("--effort", effort);
  }
  args.push(prompt);
  return ["claude", ...args];
}
