// One-off asset optimizer: shrinks oversized media in src/assets.
//   • PNG/JPG  → WebP, capped at 1600px (rewrites imports across src/)
//   • MP4      → H.264 re-encode, capped at 1280px, audio stripped (in place)
//   • GIF      → MP4 (component swap done by hand; import left for manual edit)
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
const SRC_DIRS = ["src"];
const IMG_MAX = 1600;
const VID_MAX = 1280;
const kb = (p) => (fs.statSync(p).size / 1024) | 0;

const all = fs.readdirSync(ASSETS);
const images = all.filter((f) => /\.(png|jpe?g)$/i.test(f));
const videos = all.filter((f) => /\.mp4$/i.test(f));
const gifs = all.filter((f) => /\.gif$/i.test(f));

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

// ── Images → WebP ──
for (const f of images) {
  const inPath = path.join(ASSETS, f);
  const outName = f.replace(/\.(png|jpe?g)$/i, ".webp");
  const outPath = path.join(ASSETS, outName);
  const b = kb(inPath);
  await sharp(inPath)
    .rotate()
    .resize(IMG_MAX, IMG_MAX, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(outPath);
  const a = kb(outPath);
  before += b;
  after += a;
  rewriteImport(f, outName);
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
    "-c:v", "libx264", "-crf", "27", "-preset", "medium",
    "-pix_fmt", "yuv420p", "-an", "-movflags", "+faststart",
    tmp,
  ], { stdio: "ignore" });
  fs.renameSync(tmp, inPath);
  const a = kb(inPath);
  before += b;
  after += a;
  console.log(`vid  ${String(b).padStart(6)}KB → ${String(a).padStart(5)}KB  ${f}`);
}

// ── GIF → MP4 (import + <video> swap handled manually) ──
for (const f of gifs) {
  const inPath = path.join(ASSETS, f);
  const outName = f.replace(/\.gif$/i, ".mp4");
  const outPath = path.join(ASSETS, outName);
  const b = kb(inPath);
  execFileSync(ffmpegPath, [
    "-y", "-i", inPath,
    "-vf", `scale='min(${VID_MAX},iw)':-2`,
    "-c:v", "libx264", "-crf", "27", "-preset", "medium",
    "-pix_fmt", "yuv420p", "-an", "-movflags", "+faststart",
    outPath,
  ], { stdio: "ignore" });
  const a = kb(outPath);
  before += b;
  after += a;
  console.log(`gif  ${String(b).padStart(6)}KB → ${String(a).padStart(5)}KB  ${f} → ${outName} (update component + delete gif by hand)`);
}

console.log(`\nTOTAL  ${(before / 1024).toFixed(1)}MB → ${(after / 1024).toFixed(1)}MB`);
