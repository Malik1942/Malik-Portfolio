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
       <radialGradient id="v" cx="0.62" cy="0.52" r="0.62">
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

// ── Final hero: variant D, written to the shipping name ───────────────────
{
  const brush = await src("draft-slide-a-raw-02-MoodMuseV01-render-1134")
    .trim({ threshold: 3 })
    .rotate(-72, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const withSh = await withShadow(brush, { dy: 46, dx: 10, blur: 34, opacity: 0.42 });
  const scaled = await fit(withSh, H * 1.0, W * 0.9);
  const m = await sharp(scaled).metadata();
  await place("moodmuse-hero", [
    { input: scaled, left: Math.round((W - m.width) / 2), top: Math.round(H * 0.58 - m.height / 2) },
  ]);
}

// ── The sensing surface: macro band on the GSR window ─────────────────────
{
  const face = await src("draft-slide-a-raw-03-MoodMuseV01-render-1136")
    .trim({ threshold: 3 })
    .png()
    .toBuffer();
  const fm = await sharp(face).metadata();
  const bandH = Math.round(fm.width / 1.75);
  const top = Math.max(0, Math.round(fm.height * 0.53 - bandH / 2));
  const band = await sharp(face)
    .extract({ left: 0, top, width: fm.width, height: Math.min(bandH, fm.height - top) })
    .resize({ width: 2400 })
    .png()
    .toBuffer();
  const bm = await sharp(band).metadata();
  const out = await sharp(ground(2400, bm.height))
    .composite([{ input: band, left: 0, top: 0 }])
    .webp({ quality: 88 })
    .toBuffer();
  await fs.promises.writeFile(`${OUT}/moodmuse-sensor-face.webp`, out);
  console.log("moodmuse-sensor-face", 2400 + "x" + bm.height, ((fs.statSync(`${OUT}/moodmuse-sensor-face.webp`).size / 1024) | 0) + "KB");
}
