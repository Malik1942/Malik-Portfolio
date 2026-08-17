import sharp from "sharp";
import fs from "fs";
import path from "path";

const SRC = "/Users/malik/Documents/malik-portfolio/moodmuse-assets/";
const OUT = "/Users/malik/Documents/malik-portfolio/src/assets/";
const MAX = 2400;
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };

const s = (f) => sharp(SRC + f, { limitInputPixels: false });

async function save(name, pipeline) {
  const buf = await pipeline.png().toBuffer();
  const out = OUT + `moodmuse-${name}.webp`;
  await sharp(buf)
    .resize({ width: MAX, height: MAX, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(out);
  const m = await sharp(out).metadata();
  const kb = Math.round(fs.statSync(out).size / 1024);
  console.log(`${path.basename(out)}\t${m.width}x${m.height}\t${kb} KB`);
}

// crop from a slide export, flatten on white
function crop(file, left, top, width, height) {
  return s(file).extract({ left, top, width, height }).flatten({ background: WHITE });
}

// trim empty margins of a render/photo, then add breathing room (pct of longer side)
async function trimmed(file, pct = 0.05, threshold = 12) {
  const t = await s(file).flatten({ background: WHITE }).trim({ threshold }).png().toBuffer();
  const m = await sharp(t).metadata();
  const pad = Math.round(Math.max(m.width, m.height) * pct);
  return sharp(t).extend({ top: pad, bottom: pad, left: pad, right: pad, background: WHITE });
}

async function main() {
  // 1. hero: full cover
  await save("hero", s("cover.png").flatten({ background: WHITE }));

  // 2. scenario: plain child-drawing photo (1792x1024; prototyping raw-13 is actually the hand render dup)
  await save("scenario", s("cover-raw-02-scenario2-photo.png").flatten({ background: WHITE }));

  // 3. hand-brush: hero-raw-06 (only hand-holding render available; 2560x4096 renders are device-only)
  await save("hand-brush", await trimmed("hero-raw-06-scenario2.png", 0.04));

  // 4-6. insights crops (4096x1448)
  await save("research-stats", crop("insights.png", 2135, 140, 905, 1260));
  await save("detect-tech", crop("insights.png", 3140, 130, 950, 1215));
  await save("background", crop("insights.png", 0, 0, 1022, 1448));

  // 7-8. persona / journey (persona half = 4494/9921 of width)
  const personaW = Math.round((4494 / 9921) * 4096); // 1855
  await save("persona", crop("persona-journey.png", 0, 0, personaW, 1449));
  await save("journey", crop("persona-journey.png", personaW, 0, 4096 - personaW, 1449));

  // 9. usage process: usage-ui-board.png top region (more legible than user-flow-usage right half)
  await save("usage-process", crop("usage-ui-board.png", 110, 140, 3880, 1830));

  // 10. user flow tree: user-flow-usage.png left white half
  await save("user-flow", crop("user-flow-usage.png", 0, 0, 1290, 1460));

  // 11. renders (verified by viewing)
  await save("render-side", await trimmed("draft-slide-a-raw-01-MoodMuseV01-render-1133.png", 0.05));       // clean opaque side view
  await save("render-internals", await trimmed("tech-structure-raw-01-MoodMuseV01-render-1117.png", 0.05)); // translucent-shell x-ray view
  await save("render-exploded", await trimmed("tech-structure-raw-02-MoodMuseV01-render-1114.png", 0.05));  // cutaway shell w/ internals
  await save("render-cartridges", await trimmed("tech-structure-raw-03-MoodMuseV01-render-1121.png", 0.06));
  await save("render-nose", await trimmed("tech-structure-raw-04-MoodMuseV01-render-1119.png", 0.05));
  await save("render-diffuser", await trimmed("tech-structure-raw-05-MoodMuseV01-render-1122.png", 0.05));  // 3 essential-oil pods (not patches)

  // 12-14. tech-structure crops (4096x1449)
  await save("structure", crop("tech-structure.png", 2180, 0, 692, 1140));
  await save("ergonomic", crop("tech-structure.png", 2935, 0, 4096 - 2935, 1449));
  await save("detect-mechanism", crop("tech-structure.png", 0, 0, 2170, 1449));

  // 15. sensors 3-up composite
  {
    const files = [
      "tech-structure-raw-13-GSR-sensor.png",
      "tech-structure-raw-14-MAX30102-heart-rate-sensor.png",
      "tech-structure-raw-15-HC-06-bluetooth-module.png",
    ];
    const H = 640, GUT = 48, PAD = 48;
    const tiles = [];
    for (const f of files) {
      const t = await s(f).flatten({ background: WHITE }).trim({ threshold: 12 }).png().toBuffer();
      const b = await sharp(t).resize({ height: H, withoutEnlargement: false }).png().toBuffer();
      const m = await sharp(b).metadata();
      tiles.push({ b, w: m.width, h: m.height });
    }
    const W = PAD * 2 + tiles.reduce((a, t) => a + t.w, 0) + GUT * (tiles.length - 1);
    let x = PAD;
    const comps = tiles.map((t) => { const c = { input: t.b, left: x, top: PAD + Math.round((H - t.h) / 2) }; x += t.w + GUT; return c; });
    await save("sensors", sharp({ create: { width: W, height: H + PAD * 2, channels: 3, background: WHITE } }).composite(comps));
  }

  // 16. prototyping grid (left part of prototyping-scenario.png; Using Scenario half is blank in export)
  await save("prototyping", crop("prototyping-scenario.png", 60, 20, 1915, 1385));

  // 17. prototype photos
  await save("prototype-hand", s("prototyping-scenario-raw-07-prototype-testing.jpeg").rotate());
  await save("prototype-grip", s("prototyping-scenario-raw-11-ergonomic-demonstrating.jpeg").rotate());

  // 18. flat illustrations
  await save("fragrance", await trimmed("tech-structure-raw-27-fragrance-diffuser.png", 0.05));
  await save("charger", await trimmed("tech-structure-raw-26-mag-charger.png", 0.05));
}

main().catch((e) => { console.error(e); process.exit(1); });
