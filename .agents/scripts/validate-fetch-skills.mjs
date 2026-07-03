#!/usr/bin/env node

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const skillsDir = path.join(root, ".agents", "skills");

const requiredSkillSections = [
  "## 目的",
  "## 事前に確認する入力",
  "## 設定・認証チェック",
  "## 取得できなかった場合の返答",
  "## 取得 Workflow",
  "## 返答フォーマット",
  "## 境界",
  "## 良い情報の例",
  "## 悪い情報の例",
];

const requiredOutputSections = [
  "### 取得範囲",
  "### 取得できなかった理由",
  "### 取得結果",
  "### 不足している可能性",
];

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) {
    return null;
  }

  const values = new Map();
  for (const line of match[1].split("\n")) {
    const keyValue = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (keyValue) {
      values.set(keyValue[1], keyValue[2].trim());
    }
  }
  return values;
}

function hasAny(markdown, patterns) {
  return patterns.some((pattern) => pattern.test(markdown));
}

function checkSkill({ dirName, skillMarkdown, openAiYaml }) {
  const warnings = [];
  const frontmatter = parseFrontmatter(skillMarkdown);

  if (!frontmatter) {
    warnings.push("frontmatter がありません。");
  } else {
    const name = frontmatter.get("name");
    const description = frontmatter.get("description");

    if (!name) {
      warnings.push("frontmatter に name がありません。");
    } else if (name !== dirName) {
      warnings.push(`folder 名と frontmatter name が一致していません: ${dirName} != ${name}`);
    }

    if (!description) {
      warnings.push("frontmatter に description がありません。");
    } else {
      if (!description.includes("取得")) {
        warnings.push("description に「取得」の説明がありません。");
      }
      if (!description.includes("分類") || !description.includes("統合")) {
        warnings.push("description に分類や統合を行わない境界が書かれていません。");
      }
    }
  }

  for (const section of requiredSkillSections) {
    if (!skillMarkdown.includes(section)) {
      warnings.push(`必須セクションがありません: ${section}`);
    }
  }

  for (const section of requiredOutputSections) {
    if (!skillMarkdown.includes(section)) {
      warnings.push(`返答フォーマットのセクションがありません: ${section}`);
    }
  }

  if (
    !skillMarkdown.includes("classify-fetched-materials") &&
    !skillMarkdown.includes("後続の分類") &&
    !skillMarkdown.includes("別 skill") &&
    !skillMarkdown.includes("後続の整理処理")
  ) {
    warnings.push("取得結果を classify-fetched-materials など後続の分類に渡す前提が読み取れません。");
  }

  if (!hasAny(skillMarkdown, [/分類[^。\n]*行わない/, /分類[^。\n]*しない/])) {
    warnings.push("分類しない境界が読み取れません。");
  }

  if (!hasAny(skillMarkdown, [/ファイル[^。\n]*更新しない/, /ファイル[^。\n]*編集しない/])) {
    warnings.push("ファイルを更新しない境界が読み取れません。");
  }

  if (!hasAny(skillMarkdown, [/ログ[^。\n]*全文/, /全文[^。\n]*貼/, /全文[^。\n]*コピー/])) {
    warnings.push("ログ全文や表全文を返さない方針が読み取れません。");
  }

  if (!skillMarkdown.includes("認証") || !skillMarkdown.includes("権限")) {
    warnings.push("設定・認証チェックで認証と権限の確認が読み取れません。");
  }

  if (!skillMarkdown.includes("取得できなかった理由") || !skillMarkdown.includes("次にユーザーが行うこと")) {
    warnings.push("取得できなかった時にユーザーが次に何をするか示す形式がありません。");
  }

  if (!openAiYaml) {
    warnings.push("agents/openai.yaml がありません。");
  } else {
    for (const key of ["interface:", "display_name:", "short_description:", "default_prompt:"]) {
      if (!openAiYaml.includes(key)) {
        warnings.push(`agents/openai.yaml に ${key} がありません。`);
      }
    }
  }

  return warnings;
}

async function main() {
  const entries = await readdir(skillsDir, { withFileTypes: true });
  const fetchSkillDirs = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => /^fetch-.+-materials$/.test(name))
    .sort();

  if (fetchSkillDirs.length === 0) {
    console.error("fetch-*materials skill が見つかりません。");
    process.exitCode = 1;
    return;
  }

  const results = [];

  for (const dirName of fetchSkillDirs) {
    const skillPath = path.join(skillsDir, dirName, "SKILL.md");
    const openAiPath = path.join(skillsDir, dirName, "agents", "openai.yaml");
    let skillMarkdown = "";
    let openAiYaml = "";
    const warnings = [];

    try {
      skillMarkdown = await readFile(skillPath, "utf8");
    } catch (error) {
      warnings.push(`SKILL.md を読めません: ${error.message}`);
    }

    try {
      openAiYaml = await readFile(openAiPath, "utf8");
    } catch {
      openAiYaml = "";
    }

    if (skillMarkdown) {
      warnings.push(...checkSkill({ dirName, skillMarkdown, openAiYaml }));
    }

    results.push({ dirName, warnings });
  }

  const warningCount = results.reduce((count, result) => count + result.warnings.length, 0);

  console.log("# Fetch Skill Format Check");
  console.log("");
  console.log(`- checked: ${results.length}`);
  console.log(`- warnings: ${warningCount}`);
  console.log("");

  for (const result of results) {
    if (result.warnings.length === 0) {
      console.log(`## ${result.dirName}`);
      console.log("");
      console.log("- OK");
      console.log("");
      continue;
    }

    console.log(`## ${result.dirName}`);
    console.log("");
    for (const warning of result.warnings) {
      console.log(`- WARN: ${warning}`);
    }
    console.log("");
  }

  if (warningCount > 0) {
    console.log("warning のみです。必要に応じて skill 側を更新してください。");
  }
}

await main();
