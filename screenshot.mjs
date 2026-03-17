// Screenshot a URL using Puppeteer and save to ./temporary screenshots/
// Usage: node screenshot.mjs <url> [label]
// Example: node screenshot.mjs http://localhost:3000
// Example: node screenshot.mjs http://localhost:3000 hero-section
//
// Output: ./temporary screenshots/screenshot-N.png (or screenshot-N-label.png)
// Auto-increments — never overwrites existing screenshots.
//
// Puppeteer Chrome cache: ~/.cache/puppeteer/chrome/mac_arm-146.0.7680.76

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const url = process.argv[2];
const label = process.argv[3] || '';

if (!url) {
  console.error('Usage: node screenshot.mjs <url> [label]');
  process.exit(1);
}

const outputDir = path.join(process.cwd(), 'temporary screenshots');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

// Auto-increment filename
let n = 1;
let filename;
do {
  filename = label
    ? path.join(outputDir, `screenshot-${n}-${label}.png`)
    : path.join(outputDir, `screenshot-${n}.png`);
  n++;
} while (fs.existsSync(filename));

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
await page.screenshot({ path: filename, fullPage: true });
await browser.close();

console.log(`Saved: ${filename}`);
