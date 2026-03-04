#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const TARGET_FILES = [
  'src/services/versionService.ts',
  'src/services/maintenanceService.ts',
  'src/services/announcementService.ts',
  'src/services/contactService.ts',
  'src/services/themeService.ts',
  'src/services/assetService.ts',
];

const fetchPattern = /\bfetch\s*\(/g;

function getLineNumber(content, index) {
  return content.slice(0, index).split('\n').length;
}

async function main() {
  const violations = [];

  for (const relativePath of TARGET_FILES) {
    const fullPath = path.join(ROOT, relativePath);
    let content;
    try {
      content = await fs.readFile(fullPath, 'utf8');
    } catch (error) {
      console.error(`Failed to read ${relativePath}:`, error);
      process.exit(1);
    }

    let match;
    fetchPattern.lastIndex = 0;
    while ((match = fetchPattern.exec(content)) !== null) {
      violations.push({
        file: relativePath,
        line: getLineNumber(content, match.index),
      });
    }
  }

  if (violations.length > 0) {
    console.error('Direct fetch usage detected in config services. Use config client instead.');
    for (const violation of violations) {
      console.error(`- ${violation.file}:${violation.line}`);
    }
    process.exit(1);
  }

  console.log('Config service fetch usage check passed.');
}

main().catch(error => {
  console.error('Failed to run config service fetch usage check:', error);
  process.exit(1);
});
