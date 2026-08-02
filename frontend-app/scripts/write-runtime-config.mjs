import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const apiBaseUrl = process.env.NG_APP_API_BASE_URL
  ?? process.env.API_BASE_URL
  ?? (process.env.VERCEL ? '' : 'http://localhost:8080');

if (!apiBaseUrl) {
  console.error('Set NG_APP_API_BASE_URL to the public HTTPS backend URL before building for Vercel.');
  process.exit(1);
}

const outputPath = resolve('src/assets/runtime-config.json');
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(`${outputPath}`, `${JSON.stringify({ apiBaseUrl }, null, 2)}\n`);
