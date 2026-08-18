// Mood Muse therapy-journey panel: painting and music art therapy across the
// four stages they share, an engagement curve for each, and the friction at
// every stage. One idea per row, set in the site's own face. Regenerate with:
//   node scripts/moodmuse-journey.mjs
//
// Text is set in General Sans. libvips on macOS draws text through CoreText,
// which can't see the site's woff2 files, so we hand Pango a fontconfig with
// TTF copies of the face (moodmuse-assets/fonts/, gitignored; decode the woff2
// in public/fonts/general-sans with fontTools if they're missing). The env has
// to be set before sharp loads, hence the dynamic import below.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const FONT_DIR = path.resolve("moodmuse-assets/fonts");
const conf = path.join(os.tmpdir(), "moodmuse-fonts.conf");
fs.writeFileSync(conf, `<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig><dir>${FONT_DIR}</dir><cachedir>${os.tmpdir()}/moodmuse-fc-cache</cachedir></fontconfig>`);
process.env.PANGOCAIRO_BACKEND = "fontconfig";
process.env.FONTCONFIG_FILE = conf;
const { default: sharp } = await import("sharp");

const OUT = process.argv[2] || "src/assets";
const W = 2400;
const H = 1400;

// ── palette ────────────────────────────────────────────────────────────────
const INK = "#17131F";
const MUTED = "#7A7486";
const HAIR = "#E9E5F1";
const PAINT = "#6E4BF2";
const MUSIC = "#E48AC8";

// ── geometry ───────────────────────────────────────────────────────────────
const XS = [380, 927, 1473, 2020];
const BASE = 930; // chart baseline
const RANGE = 500; // baseline → top of chart
const y = (v) => BASE - v * RANGE;

// Engagement over the four stages, read off the source curves: both start
// together, painting climbs higher through expression, both dip into
// reflection, painting ends highest.
const paint = [0.14, 0.86, 0.62, 0.96];
const music = [0.14, 0.62, 0.5, 0.8];

// Monotone cubic (Fritsch–Carlson) → bezier: passes through every point and
// never overshoots between them, so a drop reads as a slope, not a cliff.
function smooth(vals) {
  const p = vals.map((v, i) => [XS[i], y(v)]);
  const n = p.length;
  const dx = [], dy = [], m = [];
  for (let i = 0; i < n - 1; i++) { dx.push(p[i + 1][0] - p[i][0]); dy.push((p[i + 1][1] - p[i][1]) / dx[i]); }
  m[0] = dy[0]; m[n - 1] = dy[n - 2];
  for (let i = 1; i < n - 1; i++) m[i] = dy[i - 1] * dy[i] <= 0 ? 0 : (dy[i - 1] + dy[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (dy[i] === 0) { m[i] = 0; m[i + 1] = 0; continue; }
    const a = m[i] / dy[i], b = m[i + 1] / dy[i], h = Math.hypot(a, b);
    if (h > 3) { m[i] = 3 * a / h * dy[i]; m[i + 1] = 3 * b / h * dy[i]; }
  }
  let d = `M ${p[0][0]} ${p[0][1]}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += ` C ${p[i][0] + h} ${p[i][1] + m[i] * h}, ${p[i + 1][0] - h} ${p[i + 1][1] - m[i + 1] * h}, ${p[i + 1][0]} ${p[i + 1][1]}`;
  }
  return d;
}
const paintPath = smooth(paint);
const musicPath = smooth(music);
const paintArea = `${paintPath} L ${XS[3]} ${BASE} L ${XS[0]} ${BASE} Z`;

const F = `font-family="General Sans"`;
const t = (x, yy, size, weight, fill, text, extra = "") =>
  `<text x="${x}" y="${yy}" ${F} font-size="${size}" font-weight="${weight}" fill="${fill}" ${extra}>${text}</text>`;
const dot = (x, yy, color) => `<circle cx="${x}" cy="${yy}" r="11" fill="#fff" stroke="${color}" stroke-width="5"/>`;

const stages = [
  { name: "Assessment", sub: "Therapist reads sensory preferences", friction: ["Sensory preferences", "are hard to read"] },
  { name: "Expression", sub: "Making, then finding meaning in it", friction: ["Communication barriers", "block self-expression"] },
  { name: "Reflection", sub: "Talking about what was made", friction: ["Verbalizing the feeling", "is the hardest step"] },
  { name: "Integration", sub: "Carrying it into daily life", friction: ["Gains rarely transfer", "to everyday life"] },
];

const svg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${PAINT}" stop-opacity="0.16"/>
      <stop offset="1" stop-color="${PAINT}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#ffffff"/>

  <!-- header -->
  ${t(260, 168, 22, 500, MUTED, "THERAPY JOURNEY", 'letter-spacing="4"')}
  ${t(260, 248, 60, 600, INK, "Two therapies, one arc.", 'letter-spacing="-1"')}
  ${t(260, 306, 30, 400, MUTED, "Both move through the same four stages. Painting wins on access: it leaves an artifact")}
  ${t(260, 348, 30, 400, MUTED, "the child made, and that is where the sensing can live.")}

  <!-- legend -->
  <line x1="1880" y1="240" x2="1944" y2="240" stroke="${PAINT}" stroke-width="6" stroke-linecap="round"/>
  ${t(1962, 250, 28, 500, INK, "Painting")}
  <line x1="1880" y1="296" x2="1944" y2="296" stroke="${MUSIC}" stroke-width="4" stroke-linecap="round" stroke-dasharray="10 9"/>
  ${t(1962, 306, 28, 500, INK, "Music")}

  ${t(260, 432, 22, 500, MUTED, "ENGAGEMENT", 'letter-spacing="4"')}

  <!-- stage guides + baseline -->
  ${XS.map((x) => `<line x1="${x}" y1="410" x2="${x}" y2="960" stroke="${HAIR}" stroke-width="2"/>`).join("")}
  <line x1="260" y1="960" x2="2140" y2="960" stroke="${HAIR}" stroke-width="2"/>

  <!-- curves -->
  <path d="${paintArea}" fill="url(#fill)"/>
  <path d="${musicPath}" fill="none" stroke="${MUSIC}" stroke-width="4" stroke-linecap="round" stroke-dasharray="10 9"/>
  <path d="${paintPath}" fill="none" stroke="${PAINT}" stroke-width="6" stroke-linecap="round"/>
  ${music.map((v, i) => dot(XS[i], y(v), MUSIC)).join("")}
  ${paint.map((v, i) => dot(XS[i], y(v), PAINT)).join("")}

  <!-- the branch: what "expression" means on each path -->
  ${t(XS[1], y(paint[1]) - 34, 26, 500, PAINT, "Creative expression, then symbolism", 'text-anchor="middle"')}
  ${t(XS[1], y(music[1]) + 92, 26, 500, MUSIC, "Engagement, then expression", 'text-anchor="middle"')}

  <!-- stages -->
  ${stages.map((s, i) => t(XS[i], 1035, 36, 600, INK, s.name, 'text-anchor="middle"')).join("")}
  ${stages.map((s, i) => t(XS[i], 1080, 26, 400, MUTED, s.sub, 'text-anchor="middle"')).join("")}

  <!-- friction -->
  ${t(260, 1152, 22, 500, MUTED, "WHERE IT BREAKS DOWN", 'letter-spacing="4"')}
  <line x1="260" y1="1172" x2="2140" y2="1172" stroke="${HAIR}" stroke-width="2"/>
  ${stages
    .map((s, i) => `<text x="${XS[i]}" y="1228" ${F} font-size="27" font-weight="400" fill="${INK}" text-anchor="middle">
      <tspan x="${XS[i]}" dy="0">${s.friction[0]}</tspan><tspan x="${XS[i]}" dy="36">${s.friction[1]}</tspan></text>`)
    .join("")}
</svg>`;

const out = path.join(OUT, "moodmuse-journey.webp");
await sharp(Buffer.from(svg)).webp({ quality: 90 }).toFile(out);
const m = await sharp(out).metadata();
console.log("moodmuse-journey", m.width + "x" + m.height, ((fs.statSync(out).size / 1024) | 0) + "KB");
