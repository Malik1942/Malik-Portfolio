// Mood Muse sensing + ergonomics panel: the GSR window render on the left,
// the four contact callouts (two pressure zones, heart-rate and GSR detection
// areas) drawn on the right, on white. One figure that says where the sensors
// are and why they sit there. Run from repo root: node scripts/moodmuse-sensing.mjs
import sharp from "sharp";
import fs from "node:fs";

const M = "moodmuse-assets";
const OUT = process.argv[2] || "src/assets";
const W = 2400;
const H = 1620;

// Brush: the face render at nearly full height, so at canvas height it lands
// ~940px wide and clears the callout column that starts at x=1074.
const face = await sharp(`${M}/draft-slide-a-raw-03-MoodMuseV01-render-1136.png`, { limitInputPixels: false })
  .trim({ threshold: 3 })
  .png()
  .toBuffer();
const fm = await sharp(face).metadata();
const crop = await sharp(face)
  .extract({ left: 0, top: Math.round(fm.height * 0.03), width: fm.width, height: Math.round(fm.height * 0.97) })
  .resize({ height: H })
  .png()
  .toBuffer();
const cm = await sharp(crop).metadata();

// Callouts. Coordinates authored on the 2400x1620 canvas. Labels are italic,
// each underlined by its own leader that runs out to the dotted contact shape.
const label = "font-family='Inter, Helvetica Neue, Helvetica, Arial, sans-serif' font-style='italic' font-size='30' fill='#111'";
const dots = "fill='none' stroke='#222' stroke-width='3' stroke-dasharray='6 7'";
const lead = "stroke='#222' stroke-width='2.5' fill='none'";
const callouts = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="#ffffff"/>

  <text x="1074" y="226" ${label}>Pressure Zone 1</text>
  <line x1="1074" y1="238" x2="1526" y2="238" ${lead}/>
  <ellipse cx="1785" cy="205" rx="258" ry="82" ${dots}/>

  <text x="1112" y="388" ${label}>Pressure Zone 2</text>
  <line x1="1112" y1="400" x2="2100" y2="400" ${lead}/>
  <circle cx="2161" cy="392" r="62" ${dots}/>

  <text x="1188" y="592" ${label}>Heart Rate Sensor Detection</text>
  <line x1="1188" y1="604" x2="1730" y2="604" ${lead}/>
  <circle cx="1780" cy="696" r="110" ${dots}/>

  <text x="1324" y="925" ${label}>GSR Sensor Detection</text>
  <line x1="1324" y1="937" x2="1890" y2="937" ${lead}/>
  <circle cx="1960" cy="876" r="74" ${dots}/>
</svg>`);

const out = await sharp(callouts)
  .composite([{ input: crop, left: 110, top: 0 }])
  .webp({ quality: 88 })
  .toBuffer();
const p = `${OUT}/moodmuse-sensing-ergonomics.webp`;
await fs.promises.writeFile(p, out);
console.log("moodmuse-sensing-ergonomics", W + "x" + H, "brush " + cm.width + "x" + cm.height, ((fs.statSync(p).size / 1024) | 0) + "KB");
