/**
 * Generates a 1200×630 share image for every case study from its card cover,
 * into public/og/<slug>.jpg. The prerender stamps these as each project
 * page's og:image, so a shared case-study link previews as that project
 * rather than the homepage.
 *
 * Usage: npm run generate:og:projects
 * (runs `npm run build` first: the covers are read from the built assets.)
 *
 * Requires Playwright's Chromium: npx playwright install chromium
 */
import { chromium } from "@playwright/test";
import { mkdir, readFile } from "node:fs/promises";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { screenshotOgJpeg } from "./og-jpeg.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const OUT_DIR = join(ROOT, "public", "og");
const WIDTH = 1200;
const HEIGHT = 630;

const MIME = { ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg" };

async function main() {
  // src/prerender/ogSources.ts, built so each cover is its hashed dist URL.
  const { OG_SOURCES } = await import(join(ROOT, "dist-ssr-og", "ogSources.js"));

  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: WIDTH, height: HEIGHT });

  for (const { slug, cover, fit, background } of OG_SOURCES) {
    const file = join(DIST, cover);
    const data = await readFile(file);
    const mime = MIME[extname(file)] ?? "image/webp";
    const src = `data:${mime};base64,${data.toString("base64")}`;
    await page.setContent(
      `<!doctype html><html><body style="margin:0;background:${background}">
         <img src="${src}" style="display:block;width:${WIDTH}px;height:${HEIGHT}px;object-fit:${fit};object-position:center">
       </body></html>`,
    );
    await page.waitForFunction(() => document.images[0]?.complete);
    const out = join(OUT_DIR, `${slug}.jpg`);
    const { quality, bytes, width } = await screenshotOgJpeg(page, { x: 0, y: 0, width: WIDTH, height: HEIGHT }, out);
    console.log(`  ${slug.padEnd(14)} ← ${cover}  (${width}px q${quality}, ${(bytes / 1024).toFixed(1)} KB)`);
  }

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
