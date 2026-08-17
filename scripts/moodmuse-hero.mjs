// Mood Muse hero key visual: the product render on a calm ground.
// Replaces the generated in-use photograph, which read as AI imagery.
// Run from repo root with sharp installed (npm i --no-save sharp).
import sharp from "sharp";
import fs from "node:fs";

const M = "moodmuse-assets";
const OUT = process.argv[2] || "src/assets";
const W = 2400;
const H = 1320;

const src = (f) => sharp(`${M}/${f}.png`, { limitInputPixels: false });

// Soft, low-chroma ground: blush → lavender-white. Echoes the deck's palette
// without the vinyl-disk loudness, and stays calm behind a dark page.
const ground = (w, h) => Buffer.from(
  `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
     <defs>
       <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
         <stop offset="0%" stop-color="#FBF1F0"/>
         <stop offset="45%" stop-color="#F6F2F7"/>
         <stop offset="100%" stop-color="#EEF0F8"/>
       </linearGradient>
       <radialGradient id="v" cx="0.5" cy="0.45" r="0.65">
         <stop offset="0%" stop-color="#ffffff" stop-opacity="0.85"/>
         <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
       </radialGradient>
     </defs>
     <rect width="${w}" height="${h}" fill="url(#g)"/>
     <rect width="${w}" height="${h}" fill="url(#v)"/>
   </svg>`
);

// Contact shadow cast from the subject's own alpha.
async function withShadow(buf, { dx = 0, dy = 34, blur = 26, opacity = 0.3 } = {}) {
  const img = sharp(buf);
  const { width, height } = await img.metadata();
  const alpha = await sharp(buf).extractChannel("alpha").blur(blur).toBuffer();
  const shadow = await sharp({
    create: { width, height, channels: 3, background: "#2a2333" },
  })
    .joinChannel(await sharp(alpha).linear(opacity, 0).toBuffer())
    .png()
    .toBuffer();
  const pad = blur * 2 + Math.abs(dy) + Math.abs(dx);
  return sharp({
    create: { width: width + pad * 2, height: height + pad * 2, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([
      { input: shadow, left: pad + dx, top: pad + dy },
      { input: buf, left: pad, top: pad },
    ])
    .png()
    .toBuffer();
}

// Scale to fit inside the canvas box — composite() rejects oversized inputs.
const fit = (buf, h, maxW = W) =>
  sharp(buf)
    .resize({ height: Math.round(h), width: Math.round(maxW), fit: "inside" })
    .png()
    .toBuffer();

async function place(name, parts) {
  const out = await sharp(ground(W, H)).composite(parts).webp({ quality: 88 }).toBuffer();
  const p = `${OUT}/${name}.webp`;
  await fs.promises.writeFile(p, out);
  const m = await sharp(p).metadata();
  console.log(name, m.width + "x" + m.height, ((fs.statSync(p).size / 1024) | 0) + "KB");
}

// ── Final hero: the brush standing beside its four ink cartridges ────────
// Earlier takes were a generated in-use photograph (read as AI imagery) and
// the brush lying near-horizontal (read as a computer mouse). Upright it
// reads as a pen; the cartridges say "changes color" without a caption.
{
  const brush = await src("draft-slide-a-raw-02-MoodMuseV01-render-1134")
    .trim({ threshold: 3 })
    .rotate(-10, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const bSh = await withShadow(brush, { dy: 42, dx: 14, blur: 34, opacity: 0.38 });
  const b = await fit(bSh, H * 0.98, W * 0.5);
  const bm = await sharp(b).metadata();

  // The cartridge render is cut flat at the top in the source. Size it tall,
  // crop that band off, and place it at y=0 so the cut becomes a bleed.
  const inks = await src("tech-structure-raw-03-MoodMuseV01-render-1121")
    .trim({ threshold: 3 })
    .png()
    .toBuffer();
  const kSh = await withShadow(inks, { dy: 30, dx: 10, blur: 28, opacity: 0.32 });
  const k0 = await fit(kSh, H * 0.92, W * 0.4);
  const km0 = await sharp(k0).metadata();
  const cut = Math.round(km0.height * 0.07);
  const k = await sharp(k0).extract({ left: 0, top: cut, width: km0.width, height: km0.height - cut }).png().toBuffer();
  const km = await sharp(k).metadata();

  const gap = 20;
  const x0 = Math.round((W - (bm.width + gap + km.width)) / 2);
  await place("moodmuse-hero", [
    { input: b, left: x0, top: Math.round(H * 0.5 - bm.height / 2) },
    { input: k, left: x0 + bm.width + gap, top: 0 },
  ]);
}
