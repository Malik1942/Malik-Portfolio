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

    // Viewport height 700 centers the name in the 630px crop: DotGrid draws
    // "Malik Zhang" at 0.45 × viewport-height (DotGrid.tsx: centerY = h * 0.45),
    // so 0.45 × 700 = 315 = the vertical middle of the 630px OG image. This keeps
    // the top nav fully in frame (crop starts at y=0) while the hero's bottom
    // scroll hint stays below the 630 boundary and is excluded.
    await page.setViewportSize({ width: 1200, height: 700 });
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
    // The tagline types in character-by-character over ~5s, so a fixed short wait
    // caught it mid-sentence. Poll until the hero's visible text stops growing —
    // copy-agnostic, so it stays correct if the tagline is ever reworded — then a
    // brief final settle for the DotGrid dots.
    console.log('Waiting for hero animations + typewriter tagline...');
    await page.waitForFunction(() => {
      const hero = document.querySelector('section');
      if (!hero) return false;
      const text = hero.innerText || '';
      const w = window;
      if (w.__ogText !== text) {
        w.__ogText = text;
        w.__ogTextAt = Date.now();
        return false;
      }
      // Stable once the text has been unchanged for 900ms.
      return Date.now() - (w.__ogTextAt || 0) > 900;
    }, { timeout: 15_000, polling: 100 }).catch(() => {
      console.warn('Hero text did not stabilize — continuing anyway');
    });
    await page.waitForTimeout(800);

    // The hero's bottom scroll hint lands right on the 630px crop line at this
    // viewport height and would peek into the frame. It's a navigation
    // affordance with no meaning in a static preview, so hide it for the shot.
    await page.addStyleTag({
      content: '[aria-label="Scroll to projects"] { display: none !important; }',
    });

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
