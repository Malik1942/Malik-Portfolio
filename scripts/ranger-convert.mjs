// RANGER asset conversion. Source masters live outside the repo in
// ~/Documents/ranger-assets (Behance exports, PNG/JPG up to 5017px wide); this
// writes the web-ready src/assets/ranger-*.webp the case study imports.
//
// Why each image gets a named background instead of one blanket flatten:
// the Behance boards were authored on three different grounds. The layout
// boards are black, the two data boards are white, and the product renders and
// line art shipped with alpha. Flattening everything onto one color would put a
// white halo behind the line art or a black box behind the white boards. So:
//
//   • "keep"  — already opaque; the board carries its own ground
//   • "dark"  — alpha, meant to sit on black; flattened onto the page canvas
//               (hsl(0 0% 4%) = #0a0a0a) so the figure edge disappears into the page
//   • "white" — alpha over a light vignette; flattened white like the ZEAT and
//               Mood Muse data boards already are
//
// Run: npm i -D sharp && node scripts/ranger-convert.mjs && npm uninstall sharp
// (kept out of package.json for the same reason as scripts/optimize-assets.mjs —
// sharp is ~80MB and this is a one-off.)
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const SRC = path.join(os.homedir(), "Documents/ranger-assets");
const OUT = "src/assets";
const MAX = 2400;
const QUALITY = 85;

const CANVAS = { r: 10, g: 10, b: 10, alpha: 1 }; // --color-background-canvas
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };

const B = "Ranger - Ghost nets marker and catcher  Behance";
const I = "ghost nets marine conservation industrial design  product robot Intera";

// [source file, output name, background treatment]
const JOBS = [
  [`${I}.jpg`, "hero", "keep"],
  [`${I}.png`, "movement", "keep"],
  [`${I} 2.png`, "exploded", "dark"],
  [`${I} 3.png`, "control", "keep"],
  [`${I} 4.png`, "platform", "keep"],
  [`${I} 5.png`, "usage", "keep"],
  [`${I} 6.png`, "construct", "keep"],
  [`${I} 7.png`, "sketches", "keep"],
  [`${I} 8.png`, "airbag-research", "keep"],
  [`${I} 9.png`, "front", "white"],
  // "Intera 10.png" (the three-quarter line drawing) is deliberately not
  // converted: the front elevation leads the highlights gallery instead. Add
  // [`${I} 10.png`, "lineart", "dark"] back here if it is ever wanted.
  [`${B}.png`, "detail-gimbal", "dark"],
  [`${B} 2.png`, "detail-pod", "dark"],
  [`${B}.jpg`, "detail-charge", "keep"],
  [`${B} 2.jpg`, "detail-thruster", "keep"],
];

let total = 0;
for (const [file, name, bg] of JOBS) {
  const src = path.join(SRC, file);
  if (!fs.existsSync(src)) throw new Error(`missing source: ${src}`);

  let pipeline = sharp(src, { limitInputPixels: false });
  if (bg === "dark") pipeline = pipeline.flatten({ background: CANVAS });
  if (bg === "white") pipeline = pipeline.flatten({ background: WHITE });

  const out = path.join(OUT, `ranger-${name}.webp`);
  await pipeline
    .resize({ width: MAX, height: MAX, fit: "inside", withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(out);

  const meta = await sharp(out).metadata();
  const kb = Math.round(fs.statSync(out).size / 1024);
  total += kb;
  console.log(`${path.basename(out).padEnd(30)} ${meta.width}x${meta.height}\t${kb} KB\t(${bg})`);
}
console.log(`\n${JOBS.length} files, ${total} KB total`);
