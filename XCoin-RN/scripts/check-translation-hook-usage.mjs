#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const TARGET_DIRS = ['app', 'src'];
const VALID_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']);

const importPattern = /from\s+['"][^'"]*hooks\/useTranslation['"]/;
const legacyCallPattern = /\buseTranslation\s*\(\s*['"]/g;

async function collectFiles(directory) {
  let entries;
  try {
    entries = await fs.readdir(directory, { withFileTypes: true });
  } catch {
    return [];
  }

  const files = [];
  for (const entry of entries) {
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

function getLineNumber(content, index) {
  return content.slice(0, index).split('\n').length;
}

async function main() {
  const files = (
    await Promise.all(TARGET_DIRS.map(dir => collectFiles(path.join(ROOT, dir))))
  ).flat();

  const violations = [];

  for (const filePath of files) {
    const content = await fs.readFile(filePath, 'utf8');
    if (!importPattern.test(content)) {
      continue;
    }

    let match;
    while ((match = legacyCallPattern.exec(content)) !== null) {
      violations.push({
        file: path.relative(ROOT, filePath),
        line: getLineNumber(content, match.index),
      });
    }
  }

  if (violations.length > 0) {
    console.error('Legacy translation hook usage detected. Use `const { t } = useTranslation();` + `t(...)` instead.');
    for (const violation of violations) {
      console.error(`- ${violation.file}:${violation.line}`);
    }
    process.exit(1);
  }

  console.log('Translation hook usage check passed.');
}

main().catch(error => {
  console.error('Failed to run translation hook usage check:', error);
  process.exit(1);
});
