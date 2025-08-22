#!/usr/bin/env node
/**
 * Verifies that no SCSS files in the repo use deprecated `@import`.
 * Exits with code 1 if any occurrence is found.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const TARGET_DIRS = [path.join(ROOT, "packages")];
const SCSS_EXT = ".scss";
let violations = [];

function stripBlockComments(content) {
  return content.replace(/\/\*[\s\S]*?\*\//g, "");
}

function scanFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const noBlocks = stripBlockComments(raw);
  const lines = noBlocks.split(/\r?\n/);
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("//")) return; // ignore line comments
    if (/^@import\b|[^A-Za-z-]@import\b/.test(trimmed)) {
      if (/^@import/.test(trimmed)) {
        violations.push({ file: filePath, line: idx + 1, code: line });
      }
    }
  });
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (entry.isFile() && full.endsWith(SCSS_EXT)) {
      scanFile(full);
    }
  }
}

TARGET_DIRS.forEach((d) => {
  if (fs.existsSync(d)) walk(d);
});

if (violations.length) {
  console.error("\n❌ Disallowed SCSS @import statements found:");
  for (const v of violations) {
    console.error(` - ${v.file}:${v.line}\n     ${v.code.trim()}`);
  }
  console.error("\nUse `@use` / `@forward` instead.");
  process.exit(1);
} else {
  console.log("✅ No SCSS @import statements detected.");
}
