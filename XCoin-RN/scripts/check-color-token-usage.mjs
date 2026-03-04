#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const TARGET_DIRS = ['app', 'src'];
const VALID_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']);
const COLORS_FILE = path.join(ROOT, 'src/constants/colors.ts');

const nestedColorAccessPattern = /\bcolors\.([A-Za-z_][A-Za-z0-9_]*)\.([A-Za-z_][A-Za-z0-9_]*)\b/g;
const colorAccessPattern = /\bcolors\.([A-Za-z_][A-Za-z0-9_]*)\b/g;
const classTokenPattern = /\b(?:bg|text|border)-([A-Za-z0-9_-]+)\b/g;

function getLineNumber(content, index) {
  return content.slice(0, index).split('\n').length;
}

async function collectFiles(directory) {
  let entries;
  try {
    entries = await fs.readdir(directory, { withFileTypes: true });
  } catch {
    return [];
  }

  const files = [];
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) {
      continue;
    }

    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(fullPath)));
      continue;
    }

    if (entry.isFile() && VALID_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

async function loadColorKeys() {
  const content = await fs.readFile(COLORS_FILE, 'utf8');
  const keys = new Set();
  const keyPattern = /^\s*([A-Za-z_][A-Za-z0-9_]*):/gm;

  let match;
  while ((match = keyPattern.exec(content)) !== null) {
    keys.add(match[1]);
  }

  return keys;
}

function isLegacyToken(token) {
  return (
    token === 'primaryBlue' ||
    token === 'accent' ||
    token.startsWith('tab-') ||
    token.startsWith('coin-') ||
    token.startsWith('crypto-')
  );
}

async function main() {
  const colorKeys = await loadColorKeys();
  const files = (
    await Promise.all(TARGET_DIRS.map(dir => collectFiles(path.join(ROOT, dir))))
  ).flat();

  const violations = [];
  const seen = new Set();

  for (const filePath of files) {
    const content = await fs.readFile(filePath, 'utf8');
    const relativePath = path.relative(ROOT, filePath);

    let match;
    nestedColorAccessPattern.lastIndex = 0;
    while ((match = nestedColorAccessPattern.exec(content)) !== null) {
      const line = getLineNumber(content, match.index);
      const signature = `${relativePath}:${line}:nested:${match[0]}`;
      if (seen.has(signature)) {
        continue;
      }
      seen.add(signature);
      violations.push({
        file: relativePath,
        line,
        rule: 'nested-colors-access',
        detail: match[0],
      });
    }

    colorAccessPattern.lastIndex = 0;
    while ((match = colorAccessPattern.exec(content)) !== null) {
      const key = match[1];
      if (colorKeys.has(key)) {
        continue;
      }

      const line = getLineNumber(content, match.index);
      const signature = `${relativePath}:${line}:unknown:${key}`;
      if (seen.has(signature)) {
        continue;
      }
      seen.add(signature);
      violations.push({
        file: relativePath,
        line,
        rule: 'unknown-colors-key',
        detail: `colors.${key}`,
      });
    }

    classTokenPattern.lastIndex = 0;
    while ((match = classTokenPattern.exec(content)) !== null) {
      const token = match[1];
      if (!isLegacyToken(token)) {
        continue;
      }

      const line = getLineNumber(content, match.index);
      const signature = `${relativePath}:${line}:legacy:${token}`;
      if (seen.has(signature)) {
        continue;
      }
      seen.add(signature);
      violations.push({
        file: relativePath,
        line,
        rule: 'legacy-tailwind-token',
        detail: token,
      });
    }
  }

  if (violations.length > 0) {
    console.error('Invalid color usage detected. Replace legacy tokens and invalid colors access.');
    for (const violation of violations) {
      console.error(`- ${violation.file}:${violation.line} [${violation.rule}] ${violation.detail}`);
    }
    process.exit(1);
  }

  console.log('Color token usage check passed.');
}

main().catch(error => {
  console.error('Failed to run color token usage check:', error);
  process.exit(1);
});
