// Render scene.html frame by frame: render(t) is a pure function of time, so
// every frame is exact and the loop seam is clean. Scene a is the thought lost
// in the moment, scene b the thought buried in the list (the Oryne case
// study's Problem section).
//
//   node scripts/oryne-problem-scenes/render.mjs a /tmp/scene-a 7 30
//   ffmpeg -framerate 30 -i /tmp/scene-a/f%04d.png -c:v libx264 -preset slower \
//     -crf 18 -tune animation -pix_fmt yuv420p -color_range tv -colorspace bt709 \
//     -movflags +faststart src/assets/oryne-problem-moment.mp4
//
// Posters are single frames through cwebp: scene a at frame 141, b at 96.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
const [, , scene, outDir, seconds = "7", fps = "30", only] = process.argv;
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 660, height: 1350 }, deviceScaleFactor: 1 });
await page.goto(`file://${new URL("./scene.html", import.meta.url).pathname}?scene=${scene}`);
await page.evaluate(() => document.fonts.ready);
const total = Math.round(Number(seconds) * Number(fps));
const frames = only ? only.split(",").map(Number) : [...Array(total).keys()];
for (const f of frames) {
  await page.evaluate((t) => window.render(t), f / Number(fps));
  await page.screenshot({ path: `${outDir}/f${String(f).padStart(4, "0")}.png` });
}
await browser.close();
