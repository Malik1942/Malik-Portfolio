/**
 * Prints public/malik-resume-2026.pdf from the /resume page.
 * Usage: npm run generate:resume
 *
 * The page renders src/data/resume.ts as semantic HTML; Chromium's print
 * pipeline turns that into a PDF with real Unicode text, embedded subset
 * fonts, link annotations, and a tagged structure tree, so an applicant
 * tracking system reads it in the same order a person does. Run it after
 * any edit to the resume data or stylesheet and commit the PDF with them.
 * It refuses to write a PDF that runs past one Letter page.
 *
 * Requires Playwright's Chromium: npx playwright install chromium
 */
import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PORT = 5175;
const BASE_URL = `http://localhost:${PORT}`;
const OUT_PATH = join(ROOT, "public", "malik-resume-2026.pdf");
const PAGE_HEIGHT_PX = 11 * 96;

async function waitForServer(url, timeout = 30_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url);
      if (res.status < 500) return;
    } catch {
      /* not ready yet */
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error(`Server at ${url} did not become ready within ${timeout}ms`);
}

async function main() {
  console.log("Starting Vite dev server on port", PORT, "...");
  const server = spawn("npx", ["vite", "--port", String(PORT)], {
    cwd: ROOT,
    stdio: ["ignore", "pipe", "pipe"],
  });
  server.stderr.on("data", (d) => process.stderr.write(d));

  try {
    await waitForServer(BASE_URL);
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.emulateMedia({ media: "print" });
    await page.goto(`${BASE_URL}/resume`, { waitUntil: "load" });
    await page.waitForSelector(".resume-sheet");
    await page.evaluate(() => document.fonts.ready);
    // The loading screen removes itself once fonts are ready; give it the
    // 500ms its fade takes so nothing but the document is on the page.
    await page.waitForFunction(() => !document.getElementById("loading-screen"), { timeout: 10_000 });

    const title = await page.title();
    const sheetHeight = await page.evaluate(
      () => document.querySelector(".resume-sheet").getBoundingClientRect().height,
    );
    if (sheetHeight > PAGE_HEIGHT_PX) {
      throw new Error(
        `The sheet is ${Math.round(sheetHeight)}px tall in print media, more than one Letter page (${PAGE_HEIGHT_PX}px). ` +
          "Tighten the print rules in src/styles/resume.css before regenerating; the resume is one page.",
      );
    }

    await page.pdf({
      path: OUT_PATH,
      preferCSSPageSize: true,
      printBackground: true,
      tagged: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
    await browser.close();

    const { size } = await stat(OUT_PATH);
    console.log(`\nResume PDF saved → ${OUT_PATH}`);
    console.log(`Title: ${title}; sheet ${Math.round(sheetHeight)}px of ${PAGE_HEIGHT_PX}px; ${Math.round(size / 1024)} KB`);
  } finally {
    server.kill("SIGTERM");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
