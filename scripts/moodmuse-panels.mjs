// Mood Muse: convert the high-resolution Figma panel exports in
// moodmuse-assets/hires/ into shipping WebP.
//
// Why these exist: the first pass cropped these panels out of a 4096px-capped
// export of a 9921px-wide slide, so each panel arrived at roughly 800-1000px
// and was upscaled into place — visibly soft at the 900px column the page
// renders them in. These are re-exported from their own Figma nodes (or from a
// native-resolution 9921px slide render) instead.
//
// Run from repo root with sharp installed (npm i --no-save sharp).
import sharp from "sharp";
import fs from "node:fs";

const H = "moodmuse-assets/hires";
const OUT = "src/assets";
const MAX = 2400;

async function ship(srcFile, outName, { trim = false, top = 0 } = {}) {
  let img = sharp(`${H}/${srcFile}`, { limitInputPixels: false }).flatten({ background: "#ffffff" });
  if (top) {
    const m = await sharp(`${H}/${srcFile}`, { limitInputPixels: false }).metadata();
    img = img.extract({ left: 0, top, width: m.width, height: m.height - top });
  }
  if (trim) img = img.trim({ threshold: 4 });
  const buf = await img
    .resize({ width: MAX, withoutEnlargement: true })
    .webp({ quality: 88 })
    .toBuffer();
  const p = `${OUT}/moodmuse-${outName}.webp`;
  fs.writeFileSync(p, buf);
  const m = await sharp(p).metadata();
  console.log(outName.padEnd(20), m.width + "x" + m.height, ((fs.statSync(p).size / 1024) | 0) + "KB");
}

// The four ink cartridges with their JOY / CALM / UPSET / ANXIOUS swatches —
// this is what the "Color as Feedback" copy is actually about.
await ship("ink-cartridges.png", "color-feedback");

// Exploded body with the nine component callouts.
await ship("structure-panel.png", "structure");

// Node 2:2081 on its own: the open palm with the pressure and sensor zones.
// Exported alone so no neighbouring panel bleeds into the crop.
await ship("ergonomic-frame.png", "ergonomic", { trim: true });

// The whole left column of the tech slide, at native slide resolution.
await ship("detect-tech-column.png", "detect-mechanism");

// Cropped from a native 9921px render of the design-system slide.
await ship("design-system-panel.png", "design-system");
