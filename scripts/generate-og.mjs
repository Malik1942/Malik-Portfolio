/**
 * Generates public/og-image.png by screenshotting the hero section.
 * Usage: node scripts/generate-og.mjs
 *
 * Requires: @playwright/test installed (already in devDependencies)
 * and Playwright browsers: npx playwright install chromium
 */
import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PORT = 5174;
const BASE_URL = `http://localhost:${PORT}`;

async function waitForServer(url, timeout = 30_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url);
      if (res.status < 500) return;
    } catch { /* not ready yet */ }
    await new Promise(r => setTimeout(r, 400));
  }
  throw new Error(`Server at ${url} did not become ready within ${timeout}ms`);
}

async function main() {
  console.log('Starting Vite dev server on port', PORT, '...');
  const server = spawn(
    'npx', ['vite', '--port', String(PORT)],
    { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'], detached: false }
  );

  server.stdout.on('data', d => process.stdout.write(d));
  server.stderr.on('data', d => process.stderr.write(d));

  try {
    await waitForServer(BASE_URL);
    console.log('Server ready. Launching headless Chromium...');

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // 1200×800 so the bottom nav (absolute bottom-0 of the h-screen hero) sits
    // below the 630px crop boundary and is excluded from the OG image.
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto(BASE_URL, { waitUntil: 'load' });

    // Wait for the loading screen to fade out (dismissed by main.tsx after
    // React renders + document.fonts.ready resolves).
    await page.waitForFunction(() => {
      const ls = document.getElementById('loading-screen');
      if (!ls) return true;
      return parseFloat(ls.style.opacity || '1') < 0.05;
    }, { timeout: 20_000 }).catch(() => {
      console.warn('Loading screen may not have dismissed — continuing anyway');
    });

    // Allow hero animations (DotGrid canvas, name fade-in, particle burst) to settle.
    console.log('Waiting for hero animations...');
    await page.waitForTimeout(3000);

    const outPath = join(ROOT, 'public', 'og-image.png');
    await page.screenshot({
      path: outPath,
      clip: { x: 0, y: 0, width: 1200, height: 630 },
    });

    console.log(`\nOG image saved → ${outPath}`);
    await browser.close();
  } finally {
    server.kill('SIGTERM');
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
