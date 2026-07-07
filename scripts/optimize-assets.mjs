// One-off asset optimizer: shrinks oversized media without visible quality loss.
//   • PNG/JPG in src/assets      → WebP q85, capped at 2400px — alpha channels are
//     preserved (WebP supports transparency), retina-safe for the 900–1400px layout
//     (rewrites imports across src/, deletes the original)
//   • MP4 in src/assets          → H.264 CRF 23, capped at 1920px, audio stripped
//     (in place — UI recordings keep text legible at this cap)
//   • GIF in src/assets          → animated WebP q80 — keeps transparency AND stays
//     an <img>, so no component changes (rewrites imports, deletes the original)
//   • JPG in public/images/photography → WebP q85, capped at 2000px
//     (rewrites the string paths in src/, deletes the original)
//
// The tooling is intentionally NOT a permanent dependency (ffmpeg-static is ~80MB).
// To re-run when you add new assets:
//   npm i -D sharp ffmpeg-static && node scripts/optimize-assets.mjs && npm uninstall sharp ffmpeg-static
import sharp from "sharp";
import ffmpegPath from "ffmpeg-static";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ASSETS = "src/assets";
const PHOTOS = "public/images/photography";
const SRC_DIRS = ["src"];
const IMG_MAX = 2400;
const PHOTO_MAX = 2000;
const VID_MAX = 1920;
const IMG_QUALITY = 85;
const GIF_QUALITY = 80;
const VID_CRF = "23";
const kb = (p) => (fs.statSync(p).size / 1024) | 0;

const all = fs.readdirSync(ASSETS);
const images = all.filter((f) => /\.(png|jpe?g)$/i.test(f));
const videos = all.filter((f) => /\.mp4$/i.test(f));
const gifs = all.filter((f) => /\.gif$/i.test(f));
const photos = fs.existsSync(PHOTOS)
  ? fs.readdirSync(PHOTOS).filter((f) => /\.jpe?g$/i.test(f))
  : [];

// Collect every source file once for import rewriting.
const sourceFiles = [];
const walk = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(ts|tsx)$/.test(e.name)) sourceFiles.push(p);
  }
};
SRC_DIRS.forEach(walk);

const rewriteImport = (oldName, newName) => {
  for (const f of sourceFiles) {
    const txt = fs.readFileSync(f, "utf8");
    if (txt.includes(oldName)) {
      fs.writeFileSync(f, txt.split(oldName).join(newName));
    }
  }
};

let before = 0;
let after = 0;

// ── Images → WebP (alpha preserved) ──
for (const f of images) {
  const inPath = path.join(ASSETS, f);
  const outName = f.replace(/\.(png|jpe?g)$/i, ".webp");
  const outPath = path.join(ASSETS, outName);
  const b = kb(inPath);
  await sharp(inPath)
    .rotate()
    .resize(IMG_MAX, IMG_MAX, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: IMG_QUALITY })
    .toFile(outPath);
  const a = kb(outPath);
  before += b;
  after += a;
  rewriteImport(f, outName);
  fs.unlinkSync(inPath);
  console.log(`img  ${String(b).padStart(6)}KB → ${String(a).padStart(5)}KB  ${f} → ${outName}`);
}

// ── Videos → H.264 (in place via temp) ──
for (const f of videos) {
  const inPath = path.join(ASSETS, f);
  const tmp = path.join(ASSETS, `__tmp_${f}`);
  const b = kb(inPath);
  execFileSync(ffmpegPath, [
    "-y", "-i", inPath,
    "-vf", `scale='min(${VID_MAX},iw)':-2`,
    "-c:v", "libx264", "-crf", VID_CRF, "-preset", "medium",
    "-pix_fmt", "yuv420p", "-an", "-movflags", "+faststart",
    tmp,
  ], { stdio: "ignore" });
  // Keep whichever is smaller — re-encoding an already-tight file can grow it.
  if (kb(tmp) < b) fs.renameSync(tmp, inPath);
  else fs.unlinkSync(tmp);
  const a = kb(inPath);
  before += b;
  after += a;
  console.log(`vid  ${String(b).padStart(6)}KB → ${String(a).padStart(5)}KB  ${f}`);
}

// ── GIF → animated WebP (alpha preserved, stays an <img>) ──
for (const f of gifs) {
  const inPath = path.join(ASSETS, f);
  const outName = f.replace(/\.gif$/i, ".webp");
  const outPath = path.join(ASSETS, outName);
  const b = kb(inPath);
  await sharp(inPath, { animated: true })
    .resize(IMG_MAX, undefined, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: GIF_QUALITY })
    .toFile(outPath);
  const a = kb(outPath);
  before += b;
  after += a;
  rewriteImport(f, outName);
  fs.unlinkSync(inPath);
  console.log(`gif  ${String(b).padStart(6)}KB → ${String(a).padStart(5)}KB  ${f} → ${outName}`);
}

// ── Photography JPGs → WebP (string-path rewrite) ──
for (const f of photos) {
  const inPath = path.join(PHOTOS, f);
  const outName = f.replace(/\.jpe?g$/i, ".webp");
  const outPath = path.join(PHOTOS, outName);
  const b = kb(inPath);
  await sharp(inPath)
    .rotate()
    .resize(PHOTO_MAX, PHOTO_MAX, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: IMG_QUALITY })
    .toFile(outPath);
  const a = kb(outPath);
  before += b;
  after += a;
  rewriteImport(`/images/photography/${f}`, `/images/photography/${outName}`);
  fs.unlinkSync(inPath);
  console.log(`pht  ${String(b).padStart(6)}KB → ${String(a).padStart(5)}KB  ${f} → ${outName}`);
}

console.log(`\nTOTAL  ${(before / 1024).toFixed(1)}MB → ${(after / 1024).toFixed(1)}MB`);
