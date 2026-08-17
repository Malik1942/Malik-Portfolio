// Mood Muse: pair portrait crops into landscape composites so they don't render
// as full-width towers in the case study (figures are w-full h-auto).
// Run from repo root with sharp installed (npm i --no-save sharp).
import sharp from "sharp";
import fs from "node:fs";

const SRC = "moodmuse-assets/curated"; // intermediate crops (gitignored)
const A = "src/assets";
const GUTTER = 64;
const PAD = 0;
const MAX_W = 2400;

async function row(out, names) {
  const inputs = names.map((n) => `${SRC}/moodmuse-${n}.webp`);
  const metas = await Promise.all(inputs.map((p) => sharp(p).metadata()));
  const H = Math.min(...metas.map((m) => m.height));
  const bufs = [];
  let x = PAD;
  const parts = [];
  for (let i = 0; i < inputs.length; i++) {
    const w = Math.round((metas[i].width * H) / metas[i].height);
    const buf = await sharp(inputs[i]).resize({ width: w, height: H }).png().toBuffer();
    parts.push({ input: buf, left: x, top: PAD });
    x += w + GUTTER;
  }
  const W = x - GUTTER + PAD;
  let img = sharp({ create: { width: W, height: H + PAD * 2, channels: 3, background: "#ffffff" } }).composite(parts);
  const png = await img.png().toBuffer();
  const scale = W > MAX_W ? MAX_W / W : 1;
  const final = sharp(png).resize({ width: Math.round(W * scale) }).webp({ quality: 85 });
  await final.toFile(`${A}/moodmuse-${out}.webp`);
  const m = await sharp(`${A}/moodmuse-${out}.webp`).metadata();
  console.log(out, m.width, m.height, (fs.statSync(`${A}/moodmuse-${out}.webp`).size / 1024) | 0, "KB");
}

await row("research-board", ["background", "research-stats", "detect-tech"]);
await row("brush-views", ["render-side", "render-internals", "render-cartridges"]);
await row("brush-detail", ["hand-brush", "render-nose"]);
await row("structure-ergonomic", ["structure", "ergonomic"]);
await row("modules", ["render-diffuser", "fragrance", "charger"]);
await row("prototype-hands", ["prototype-hand", "prototype-grip"]);
await row("system-flow", ["design-system", "user-flow"]);
