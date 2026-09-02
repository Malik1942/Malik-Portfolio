# RANGER Twitter Film Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce, verify, and publish a 20.0-second 16:9 RANGER product film with a product-first three-second hook, an airbag-mechanism proof, machine macros, an original frame-locked score, and an X-ready master plus a case-study embed.

**Architecture:** Project-local Swift turns KeyShot stills into CFR-60 holds; product-film `composite2` / stitch / score-render / mux assemble a full-bleed 2560×1440 picture with no cursor. Measured crops, camera plans, and score events live in `shot-manifest.json`. Large intermediates stay in an ignored `artifacts/` tree; only the approved MP4 and poster enter `src/assets`.

**Tech Stack:** AVFoundation Swift (product-film v1.1.1), `sips`, General Sans Semibold TTF, Vite 7, React 18, TypeScript, Vitest.

## Global Constraints

- Use `/Users/malik/Documents/Skills/product-film` at clean `origin/main` (rev `93174868`); `git fetch origin && git pull --ff-only origin main` before production resumes in a later session.
- Follow `docs/superpowers/specs/2026-08-18-ranger-twitter-film-design.md`.
- Master is exactly 2560×1440, 60 fps, 20.0 seconds.
- The first 3.2 seconds contain `ranger-hero.webp` only: no copy, cursor, or UI.
- Stills path only. Do not ScreenCaptureKit the website. Do not use ffmpeg. Do not use `screencapture -v`.
- `FILL=1` and `CURSOR_STYLE=none` on every picture clip. No click rings.
- Shark silhouette and the word `NICE!` must not appear in any frame.
- Do not show sketches, exploded labels, construct, movement, control UI, or Neptune Net.
- Do not animate stills (no fake inflation, gimbal spin, or thruster rotation). Punches then holds.
- Title card copy is exactly `THE NET FLOATS ITSELF UP.` End card must include `CONCEPT`.
- Typeface is General Sans via `moodmuse-assets/fonts/GeneralSans-Semibold.ttf`. Never SF Pro.
- Tier A `cinematic-epic` at 96 BPM, prerolled so the bed exists at t=0. Reveal is inflate start (6.50s on the stitch table).
- Final frame holds; neither picture nor score fades out.
- Preserve unrelated working-tree changes in `src/design-system/reference/content/`, `_to_delete/`, and `src/assets/moodmuse-grab.jpg`.

---

## File Structure

- `.gitignore` — ignores `projects/ranger-film/artifacts/`
- `projects/ranger-film/README.md` — skill path, spec path, canvas, pointer contract, stage order
- `projects/ranger-film/shot-manifest.json` — scenes, crops, camera plans, clip durations
- `projects/ranger-film/stillhold.swift` — PNG → CFR-60 H.264 hold
- `projects/ranger-film/extract-brand.swift` — sample orange from the inflate cell
- `projects/ranger-film/title-card.swift` — project copy of the title-card template
- `projects/ranger-film/end-card.swift` — four-line typeset end card, no logo PNG
- `projects/ranger-film/stitch.swift` — clip order, FADE=0.18, Z=0.50, B=0.10
- `projects/ranger-film/score.json` — measured Tier A contract
- `projects/ranger-film/gap-audit.md` — evidence-based scene audit
- `projects/ranger-film/artifacts/` — ignored generated media
- `src/assets/ranger-film.mp4` / `src/assets/ranger-film-poster.webp` — website copies
- `src/data/projectDetails.ts` — Intro film figure
- `src/data/projectDetails.test.ts` — locks the film into the RANGER document

---

### Task 1: Scaffold the Durable Film Workspace

**Files:**
- Modify: `.gitignore`
- Create: `projects/ranger-film/README.md`
- Create: `projects/ranger-film/shot-manifest.json`

**Interfaces:**
- Produces: a durable project root whose committed files are contracts and whose ignored `artifacts/` subtree holds generated media.
- Preserves: unrelated website files and untracked user work.

- [ ] **Step 1: Add the artifact ignore rule**

Append exactly:

```gitignore

# RANGER product-film intermediates; approved master/poster are copied to src/assets.
projects/ranger-film/artifacts/
```

- [ ] **Step 2: Write README.md**

Create `projects/ranger-film/README.md` with: skill path `/Users/malik/Documents/Skills/product-film` rev `93174868`; spec path `docs/superpowers/specs/2026-08-18-ranger-twitter-film-design.md`; canvas 2560×1440 @ 60 fps / 20.0s; pointer contract `none`; stills path (sips → stillhold → composite2 FILL=1 → stitch → score-render → mux); artifact subdirs `stills/`, `holds/`, `scenes/`, `cards/`, `audio/`, `final/`.

- [ ] **Step 3: Write shot-manifest.json**

Create `projects/ranger-film/shot-manifest.json` with this exact JSON:

```json
{
  "canvas": { "width": 2560, "height": 1440, "fps": 60, "duration": 20.0 },
  "pointer": { "style": "none", "recordedCursor": false },
  "fontFile": "moodmuse-assets/fonts/GeneralSans-Semibold.ttf",
  "brand": { "bg": "090A0B", "type": "F4F5F5", "accent": null },
  "transitions": {
    "openingFade": 0.25,
    "breathFade": 0.18,
    "breathBlack": 0.10,
    "zoomThrough": 0.50
  },
  "scenes": [
    {
      "id": "01-hook",
      "asset": "src/assets/ranger-hero.webp",
      "clipDur": 3.10,
      "crop": null,
      "plan": "0 0.50 0.52 1.00 0; 1.10 0.68 0.34 1.55 0; 3.10 0.68 0.34 1.55 0"
    },
    {
      "id": "02-title",
      "asset": null,
      "clipDur": 1.60,
      "copy": "THE NET FLOATS ITSELF UP."
    },
    {
      "id": "03-launch",
      "asset": "src/assets/ranger-usage.webp",
      "clipDur": 2.10,
      "crop": [134, 852, 1624, 208],
      "plan": "0 0.55 0.48 1.05 0; 0.40 0.58 0.50 1.45 0; 2.10 0.58 0.50 1.45 0"
    },
    {
      "id": "04-inflate",
      "asset": "src/assets/ranger-usage.webp",
      "clipDur": 3.10,
      "crop": [861, 852, 897, 208],
      "plan": "0 0.52 0.50 1.40 0; 3.10 0.52 0.50 1.40 0"
    },
    {
      "id": "05-rise",
      "asset": "src/assets/ranger-usage.webp",
      "clipDur": 2.10,
      "crop": [1587, 852, 400, 375],
      "plan": "0 0.46 0.52 1.20 0; 2.10 0.46 0.52 1.20 0"
    },
    {
      "id": "06-front",
      "asset": "src/assets/ranger-front.webp",
      "clipDur": 2.20,
      "crop": null,
      "plan": "0 0.50 0.58 1.00 0; 0.70 0.50 0.66 1.35 0; 2.20 0.50 0.66 1.35 0"
    },
    {
      "id": "07-pod",
      "asset": "src/assets/ranger-detail-pod.webp",
      "clipDur": 2.20,
      "crop": null,
      "plan": "0 0.50 0.55 1.12 0; 2.20 0.50 0.55 1.12 0"
    },
    {
      "id": "08-thruster",
      "asset": "src/assets/ranger-detail-thruster.webp",
      "clipDur": 2.10,
      "crop": null,
      "plan": "0 0.50 0.58 1.18 0; 2.10 0.50 0.58 1.18 0"
    },
    {
      "id": "09-end",
      "asset": null,
      "clipDur": 3.70,
      "copy": [
        "RANGER",
        "UNDERWATER DRONE CONCEPT",
        "SEE THE FULL CASE STUDY",
        "malikzhang.com/project/ranger"
      ]
    }
  ]
}
```

`crop` is `composite2`/`stillhold` `CROP=l,t,r,b` in source pixels. `plan` is `composite2` keyframes `t fx fy scale rot`.

- [ ] **Step 4: Validate the manifest**

Run:

```bash
node -e '
const m=require("./projects/ranger-film/shot-manifest.json");
const d=m.scenes.reduce((s,x)=>s+x.clipDur,0);
const total=d - 5*0.50 + 3*0.10;
if(m.canvas.duration!==20) process.exit(1);
if(Math.abs(total-20)>1e-9) { console.error("stitch math", total); process.exit(1); }
if(m.scenes[0].clipDur!==3.1 || m.scenes.at(-1).clipDur!==3.7) process.exit(1);
if(m.pointer.style!=="none") process.exit(1);
console.log("ok", total);
'
```

Expected: `ok 20`.

- [ ] **Step 5: Commit the scaffold**

```bash
git add .gitignore projects/ranger-film/README.md projects/ranger-film/shot-manifest.json
git commit -m "$(cat <<'EOF'
chore: scaffold RANGER film production

EOF
)"
```

Expected: only those three files committed.

---

### Task 2: Still-Hold Writer and Verified Source Crops

**Files:**
- Create: `projects/ranger-film/stillhold.swift`
- Create: `projects/ranger-film/extract-frame.swift`
- Generate: `projects/ranger-film/artifacts/stills/*.png`
- Generate: `projects/ranger-film/artifacts/holds/*.mov`

**Interfaces:**
- Consumes: a PNG path, duration seconds, optional `CROP=l,t,r,b`.
- Produces: CFR-60 H.264 `.mov` at the cropped source pixel size.

- [ ] **Step 1: Implement stillhold.swift**

Create `projects/ranger-film/stillhold.swift`:

```swift
import AVFoundation
import AppKit

let a = CommandLine.arguments
guard a.count >= 4, let seconds = Double(a[3]), seconds > 0 else {
    fputs("usage: stillhold.swift <in.png> <out.mov> <seconds>   env: CROP=l,t,r,b\n", stderr)
    exit(2)
}
let inURL = URL(fileURLWithPath: a[1])
let outURL = URL(fileURLWithPath: a[2])
guard let img = NSImage(contentsOf: inURL),
      var cg = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
    fputs("cannot read \(inURL.path)\n", stderr); exit(1)
}
let env = ProcessInfo.processInfo.environment
let cropPx = (env["CROP"] ?? "").split(separator: ",").compactMap { Double($0) }
if cropPx.count == 4 {
    let l = Int(cropPx[0]), t = Int(cropPx[1]), r = Int(cropPx[2]), b = Int(cropPx[3])
    let w = cg.width - l - r, h = cg.height - t - b
    guard w > 8, h > 8, l >= 0, t >= 0, r >= 0, b >= 0 else {
        fputs("invalid CROP on \(cg.width)x\(cg.height)\n", stderr); exit(1)
    }
    guard let cut = cg.cropping(to: CGRect(x: l, y: t, width: w, height: h)) else {
        fputs("crop failed\n", stderr); exit(1)
    }
    cg = cut
}
let width = cg.width, height = cg.height
let fps: Int32 = 60
let totalFrames = Int((seconds * Double(fps)).rounded())
try? FileManager.default.removeItem(at: outURL)
let writer = try AVAssetWriter(outputURL: outURL, fileType: .mov)
let settings: [String: Any] = [
    AVVideoCodecKey: AVVideoCodecType.h264,
    AVVideoWidthKey: width, AVVideoHeightKey: height,
    AVVideoCompressionPropertiesKey: [
        AVVideoAverageBitRateKey: 18_000_000,
        AVVideoExpectedSourceFrameRateKey: fps,
        AVVideoMaxKeyFrameIntervalKey: fps
    ]
]
let input = AVAssetWriterInput(mediaType: .video, outputSettings: settings)
input.expectsMediaDataInRealTime = false
let adaptor = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: input, sourcePixelBufferAttributes: [
    kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA,
    kCVPixelBufferWidthKey as String: width,
    kCVPixelBufferHeightKey as String: height,
    kCVPixelBufferIOSurfacePropertiesKey as String: [:]
])
writer.add(input)
writer.startWriting()
writer.startSession(atSourceTime: .zero)

func makeBuffer() -> CVPixelBuffer {
    var pb: CVPixelBuffer?
    CVPixelBufferPoolCreatePixelBuffer(nil, adaptor.pixelBufferPool!, &pb)
    let buffer = pb!
    CVPixelBufferLockBaseAddress(buffer, [])
    let ctx = CGContext(
        data: CVPixelBufferGetBaseAddress(buffer),
        width: width, height: height, bitsPerComponent: 8,
        bytesPerRow: CVPixelBufferGetBytesPerRow(buffer),
        space: CGColorSpaceCreateDeviceRGB(),
        bitmapInfo: CGImageAlphaInfo.premultipliedFirst.rawValue | CGBitmapInfo.byteOrder32Little.rawValue
    )!
    ctx.interpolationQuality = .high
    ctx.draw(cg, in: CGRect(x: 0, y: 0, width: width, height: height))
    CVPixelBufferUnlockBaseAddress(buffer, [])
    return buffer
}

for i in 0..<totalFrames {
    while !input.isReadyForMoreMediaData { Thread.sleep(forTimeInterval: 0.002) }
    let buffer = makeBuffer()
    adaptor.append(buffer, withPresentationTime: CMTime(value: Int64(i), timescale: fps))
}
input.markAsFinished()
writer.finishWriting {
    let ok = writer.status == .completed
    print(ok ? "OK \(width)x\(height) \(totalFrames)f \(outURL.lastPathComponent)" : "FAIL \(writer.error?.localizedDescription ?? "?")")
    exit(ok ? 0 : 1)
}
RunLoop.main.run()
```

- [ ] **Step 2: Convert sources with sips and prove stillhold**

```bash
SKILL=/Users/malik/Documents/Skills/product-film
mkdir -p projects/ranger-film/artifacts/{stills,holds,scenes,cards,audio,final,scans}
sips -s format png src/assets/ranger-hero.webp --out projects/ranger-film/artifacts/stills/ranger-hero.png
sips -g pixelWidth -g pixelHeight projects/ranger-film/artifacts/stills/ranger-hero.png
swift projects/ranger-film/stillhold.swift \
  projects/ranger-film/artifacts/stills/ranger-hero.png \
  projects/ranger-film/artifacts/holds/probe.mov 0.5
```

Expected: PNG is 2400×1345; stillhold prints `OK 2400x1345 30f probe.mov`.

Then:

```bash
swift "$SKILL/scripts/scan.swift" projects/ranger-film/artifacts/holds/probe.mov \
  projects/ranger-film/artifacts/scans/probe-scan.png 0.25
```

Expected: contact sheet of identical hero frames, no black, no cursor.

- [ ] **Step 3: Convert remaining stills and write cropped holds**

```bash
for name in ranger-usage ranger-front ranger-detail-pod ranger-detail-thruster; do
  sips -s format png "src/assets/${name}.webp" --out "projects/ranger-film/artifacts/stills/${name}.png"
done

node -e '
const m=require("./projects/ranger-film/shot-manifest.json");
const {execSync}=require("child_process");
for (const s of m.scenes) {
  if (!s.asset || !s.clipDur) continue;
  const png="projects/ranger-film/artifacts/stills/"+s.asset.split("/").pop().replace(".webp",".png");
  const out="projects/ranger-film/artifacts/holds/"+s.id+".mov";
  const env = s.crop ? `CROP=${s.crop.join(",")} ` : "";
  execSync(`${env}swift projects/ranger-film/stillhold.swift ${png} ${out} ${s.clipDur}`, {stdio:"inherit"});
}
'
```

Expected: seven holds (`01-hook`, `03-launch`, `04-inflate`, `05-rise`, `06-front`, `07-pod`, `08-thruster`). Launch/inflate/rise print widths near 642 / 642 / 413.

- [ ] **Step 4: Add extract-frame.swift and reject shark/NICE**

Create `projects/ranger-film/extract-frame.swift`:

```swift
import AVFoundation
import AppKit
let a = CommandLine.arguments
guard a.count >= 4, let t = Double(a[3]) else {
    fputs("usage: extract-frame.swift <in.mov> <out.jpg> <seconds>\n", stderr); exit(2)
}
let asset = AVURLAsset(url: URL(fileURLWithPath: a[1]))
let gen = AVAssetImageGenerator(asset: asset)
gen.appliesPreferredTrackTransform = true
gen.requestedTimeToleranceBefore = .zero
gen.requestedTimeToleranceAfter = .zero
let cg = try gen.copyCGImage(at: CMTime(seconds: t, preferredTimescale: 600), actualTime: nil)
let img = NSBitmapImageRep(cgImage: cg)
guard let jpg = img.representation(using: .jpeg, properties: [.compressionFactor: 0.92]) else {
    fputs("jpeg failed\n", stderr); exit(1)
}
try jpg.write(to: URL(fileURLWithPath: a[2]))
print("OK \(cg.width)x\(cg.height) -> \(a[2])")
```

Then:

```bash
for id in 03-launch 04-inflate 05-rise; do
  swift projects/ranger-film/extract-frame.swift \
    "projects/ranger-film/artifacts/holds/${id}.mov" \
    "projects/ranger-film/artifacts/scans/${id}.jpg" 0
done
```

Open the three JPEGs. Inflate must show the orange bag in the mesh. Rise must show bag + net + up-arrow and **must not** contain a shark or `NICE!`. If it does, tighten `scenes[id=05-rise].crop` in the manifest, regenerate that hold, and re-extract.

- [ ] **Step 5: Commit the writer**

```bash
git add projects/ranger-film/stillhold.swift \
        projects/ranger-film/extract-frame.swift \
        projects/ranger-film/shot-manifest.json
git commit -m "$(cat <<'EOF'
feat: add RANGER still-hold writer

EOF
)"
```

Do not commit `artifacts/`.

---

### Task 3: Sample Accent and Render Cards

**Files:**
- Create: `projects/ranger-film/extract-brand.swift`
- Create: `projects/ranger-film/title-card.swift`
- Create: `projects/ranger-film/end-card.swift`
- Generate: `projects/ranger-film/artifacts/cards/*`
- Modify: `projects/ranger-film/shot-manifest.json`

**Interfaces:**
- Consumes: inflate-cell pixels on `ranger-usage.webp` and General Sans Semibold.
- Produces: `brand.json` `{ "accent": "RRGGBB" }`, `title.mov` 1.60s, `end-card.mov` 3.70s.

- [ ] **Step 1: Implement extract-brand.swift**

Create `projects/ranger-film/extract-brand.swift`:

```swift
import AppKit
import Foundation

let a = CommandLine.arguments
guard a.count >= 3 else {
    fputs("usage: extract-brand.swift <usage.png> <brand.json>\n", stderr); exit(2)
}
guard let img = NSImage(contentsOf: URL(fileURLWithPath: a[1])),
      let cg = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
    fputs("cannot read \(a[1])\n", stderr); exit(1)
}
precondition(cg.width == 2400 && cg.height == 1455, "usage PNG must be 2400x1455")
let x0 = 1000, y0 = 960, w = 220, h = 160
var px = [UInt8](repeating: 0, count: cg.width * cg.height * 4)
let ctx = CGContext(data: &px, width: cg.width, height: cg.height, bitsPerComponent: 8,
                    bytesPerRow: cg.width * 4, space: CGColorSpaceCreateDeviceRGB(),
                    bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
ctx.draw(cg, in: CGRect(x: 0, y: 0, width: cg.width, height: cg.height))
var rs: [Int] = [], gs: [Int] = [], bs: [Int] = []
for y in y0..<(y0+h) {
    for x in x0..<(x0+w) {
        let i = (y * cg.width + x) * 4
        let r = Int(px[i]), g = Int(px[i+1]), b = Int(px[i+2])
        if r >= 160 && r > g + 25 && r > b + 40 && g >= 40 && g <= 170 && b <= 90 {
            rs.append(r); gs.append(g); bs.append(b)
        }
    }
}
guard rs.count >= 400 else {
    fputs("too few orange pixels (\(rs.count))\n", stderr); exit(1)
}
func median(_ v: [Int]) -> Int {
    let s = v.sorted(); return s[s.count/2]
}
let r = median(rs), g = median(gs), b = median(bs)
guard r >= 160, r > g, r > b else {
    fputs("sampled color is not orange \(r),\(g),\(b)\n", stderr); exit(1)
}
let hex = String(format: "%02X%02X%02X", r, g, b)
let json = "{\"accent\":\"\(hex)\",\"source\":\"ranger-usage.webp\",\"pixels\":\(rs.count)}\n"
try json.write(to: URL(fileURLWithPath: a[2]), atomically: true, encoding: .utf8)
print("accent=\(hex) pixels=\(rs.count)")
```

CGImage y is top-down after this draw. If the sampler returns 0 pixels, invert `y0` to `cg.height - 960 - 160` and re-run — do not guess the hex.

- [ ] **Step 2: Run the sampler and store the accent**

```bash
swift projects/ranger-film/extract-brand.swift \
  projects/ranger-film/artifacts/stills/ranger-usage.png \
  projects/ranger-film/artifacts/cards/brand.json
node -e '
const b=require("./projects/ranger-film/artifacts/cards/brand.json");
const m=require("./projects/ranger-film/shot-manifest.json");
if(!/^[0-9A-F]{6}$/.test(b.accent)) process.exit(1);
m.brand.accent=b.accent;
require("fs").writeFileSync("projects/ranger-film/shot-manifest.json", JSON.stringify(m,null,2)+"\n");
console.log(b.accent);
'
```

Expected: a six-digit orange hex in the manifest.

- [ ] **Step 3: Copy and specialize the title card**

```bash
cp /Users/malik/Documents/Skills/product-film/scripts/title-card-template.swift \
   projects/ranger-film/title-card.swift
```

Keep font registration, knob validation, 2560×1440 writer, and smoothstep entrance. Change only the title draw so a long sentence wraps on two lines:

- Title font size `118 * sx` (not 160/196).
- Draw rect `CGRect(x: 0.08*Wc, y: 0.40*H + rise, width: 0.84*Wc, height: 0.28*H)`.
- Paragraph style: center, `lineSpacing = 8 * sx`.
- No subtitle argument required for this film.

Render:

```bash
accent="$(node -p 'require("./projects/ranger-film/artifacts/cards/brand.json").accent')"
FONT_FILE=/Users/malik/Documents/malik-portfolio/moodmuse-assets/fonts/GeneralSans-Semibold.ttf \
BG=090A0B TITLE_COLOR=F4F5F5 ACCENTS="$accent" \
ENTRANCE=0.34 RISE=-18 W=2560 H=1440 FPS=60 \
swift projects/ranger-film/title-card.swift \
  projects/ranger-film/artifacts/cards/title.mov 1.6 \
  "THE NET FLOATS ITSELF UP."
```

Read the printed `card style:` line. Reject font fallback to SF and any warning.

- [ ] **Step 4: Copy and specialize the end card**

```bash
cp /Users/malik/Documents/Skills/product-film/scripts/end-card-template.swift \
   projects/ranger-film/end-card.swift
```

Replace the logo-file CLI with four string arguments and **delete the logo load/keying block**. CLI:

```text
swift projects/ranger-film/end-card.swift OUTPUT_MOV SECONDS TITLE LINE2 LINE3 LINE4
```

Draw, centered, with the same 0.34s / −18px entrance:

| Line | Size | Color | y origin (unflipped) |
|---|---|---|---|
| TITLE (`RANGER`) | 160 px Semibold | `F4F5F5` | `0.56*H` |
| LINE2 | 44 px | `F4F5F5` | `0.47*H` |
| LINE3 | 40 px | sampled orange | `0.40*H` |
| LINE4 | 36 px | `F4F5F5` | `0.34*H` |

Accent bars stay under LINE4 using the template’s bar drawing, y `0.28*H`.

Render:

```bash
accent="$(node -p 'require("./projects/ranger-film/artifacts/cards/brand.json").accent')"
FONT_FILE=/Users/malik/Documents/malik-portfolio/moodmuse-assets/fonts/GeneralSans-Semibold.ttf \
BG=090A0B LINE_COLOR=F4F5F5 ACCENTS="$accent" \
ENTRANCE=0.34 RISE=-18 W=2560 H=1440 FPS=60 \
swift projects/ranger-film/end-card.swift \
  projects/ranger-film/artifacts/cards/end-card.mov 3.7 \
  "RANGER" \
  "UNDERWATER DRONE CONCEPT" \
  "SEE THE FULL CASE STUDY" \
  "malikzhang.com/project/ranger"
```

- [ ] **Step 5: Read both cards at full resolution**

Extract frame 48 (0.80s) of the title card and frame 72 (1.20s) of the end card to JPEGs in `artifacts/scans/`. Confirm exact Words-block copy, General Sans (not SF), near-black ground, orange accent, no extra punctuation, and `CONCEPT` on the end card.

- [ ] **Step 6: Commit card contracts**

```bash
git add projects/ranger-film/extract-brand.swift \
        projects/ranger-film/title-card.swift \
        projects/ranger-film/end-card.swift \
        projects/ranger-film/shot-manifest.json
git commit -m "$(cat <<'EOF'
feat: render RANGER film title and end cards

EOF
)"
```

---

### Task 4: Composite Full-Bleed Scene Clips

**Files:**
- Generate: `projects/ranger-film/artifacts/scenes/*-comp.mp4`
- Modify: `projects/ranger-film/shot-manifest.json` (only if a punch lands on the wrong subject)
- Use: `projects/ranger-film/extract-frame.swift`

**Interfaces:**
- Consumes: still holds + camera `plan` strings.
- Produces: seven 2560×1440 composites with legal FILL framing and no cursor.

- [ ] **Step 1: Composite every picture scene**

```bash
SKILL=/Users/malik/Documents/Skills/product-film
node -e '
const m=require("./projects/ranger-film/shot-manifest.json");
const {execSync}=require("child_process");
for (const s of m.scenes) {
  if (!s.plan) continue;
  const env = [
    "FILL=1",
    "CURSOR_STYLE=none"
  ].join(" ");
  execSync(
    `${env} swift ${process.env.SKILL||"/Users/malik/Documents/Skills/product-film"}/scripts/composite2.swift ` +
    `projects/ranger-film/artifacts/holds/${s.id}.mov ` +
    `projects/ranger-film/artifacts/scenes/${s.id}-comp.mp4 ` +
    `0 ${s.clipDur} "${s.plan}"`,
    {stdio:"inherit", env:{...process.env, FILL:"1", CURSOR_STYLE:"none"}}
  );
}
'
```

Copy cards into the scenes dir so stitch can use one folder:

```bash
cp projects/ranger-film/artifacts/cards/title.mov \
   projects/ranger-film/artifacts/scenes/02-title.mov
cp projects/ranger-film/artifacts/cards/end-card.mov \
   projects/ranger-film/artifacts/scenes/09-end.mov
```

- [ ] **Step 2: Extract punch and hold frames**

From each composite, extract t=0 and (if present) the first plan keyframe after t=0, plus the last frame. Also extract 1.10s of `01-hook`. Save under `artifacts/scans/comp-*.jpg`.

Confirm:

- every frame is 2560×1440 and edge-flush (no black bar, no rounded card);
- no cursor, no click ring;
- hook t=0 is the wide underwater still; t=1.10 is punched toward the drone, not the empty water;
- launch includes the canister; inflate includes the orange bag; rise has no shark/`NICE!`;
- front shows the isolated vehicle; pod is the underside bay; thruster is the vectoring pod;
- inflate’s start and end crops are identical (no idle drift).

If a punch is wrong, edit only that scene’s `plan` in the manifest and re-composite that clip.

- [ ] **Step 3: Commit the locked plans**

```bash
git add projects/ranger-film/shot-manifest.json
git commit -m "$(cat <<'EOF'
docs: lock RANGER film camera plans

EOF
)"
```

---

### Task 5: Stitch the 20-Second Picture

**Files:**
- Create: `projects/ranger-film/stitch.swift`
- Generate: `projects/ranger-film/artifacts/final/ranger-picture.mp4`

**Interfaces:**
- Consumes: the nine scene clips.
- Produces: a silent 1200-frame 2560×1440 H.264 picture.

- [ ] **Step 1: Copy and specialize the stitcher**

```bash
cp /Users/malik/Documents/Skills/product-film/scripts/stitch-template.swift \
   projects/ranger-film/stitch.swift
```

Replace `clips` with:

```swift
let clips = [P + "01-hook-comp.mp4", P + "02-title.mov",
             P + "03-launch-comp.mp4", P + "04-inflate-comp.mp4", P + "05-rise-comp.mp4",
             P + "06-front-comp.mp4", P + "07-pod-comp.mp4", P + "08-thruster-comp.mp4",
             P + "09-end.mov"]
```

Replace `trans` with:

```swift
let trans: [Trans] = [
    Trans(kind: "B", dur: 0.1),
    Trans(kind: "B", dur: 0.1),
    Trans(kind: "Z", dur: 0.50),
    Trans(kind: "Z", dur: 0.50),
    Trans(kind: "Z", dur: 0.50),
    Trans(kind: "Z", dur: 0.50),
    Trans(kind: "Z", dur: 0.50),
    Trans(kind: "B", dur: 0.1)
]
```

Set `let FADE = 0.18`.

Immediately after `var t0 = 0.0` and before the segment loop, the first visible instruction must fade the hook from 0 → 1 over 0.25s. Implement by inserting, as the first instruction when `i == 0`, an opacity ramp on `segs[0]` for `tr(0.0, 0.25)`, then set `t0 = 0.25` so the rest of the loop continues from there. Do not use transition kind `F` for this — `F` in the template is a between-clip fade.

- [ ] **Step 2: Render and prove duration**

```bash
CLIPS_DIR="$(pwd)/projects/ranger-film/artifacts/scenes" \
OUT="$(pwd)/projects/ranger-film/artifacts/final/ranger-picture.mp4" \
swift projects/ranger-film/stitch.swift
```

Expected: stitch prints `OK 20.0s`. Then prove the last frame exists and is the end card:

```bash
swift projects/ranger-film/extract-frame.swift \
  projects/ranger-film/artifacts/final/ranger-picture.mp4 \
  projects/ranger-film/artifacts/scans/picture-1998.jpg 19.98
sips -g pixelWidth -g pixelHeight projects/ranger-film/artifacts/scans/picture-1998.jpg
```

Expected: 2560×1440 JPEG of the held end card, not black. If stitch duration is not 20.0, change only a static hold (`clipDur` + stillhold + composite) of a non-card scene; do not retime punches or card entrances.

- [ ] **Step 3: Extract the stitch proof frames**

Extract 0.00, 1.10, 3.10, 3.30, 4.00, 4.90, 6.50, 8.00, 9.10, 10.70, 12.40, 14.10, 16.20, 16.40, 17.20, 19.98 seconds. Confirm opening has no type, title copy is exact, inflate is the orange bag, end card holds on the last frame, no fade to black.

- [ ] **Step 4: Commit the stitcher**

```bash
git add projects/ranger-film/stitch.swift
git commit -m "$(cat <<'EOF'
feat: assemble RANGER film picture

EOF
)"
```

---

### Task 6: Compose and Gate the Score

**Files:**
- Create: `projects/ranger-film/score.json`
- Generate: `projects/ranger-film/artifacts/audio/ranger-score.m4a`
- Generate: `projects/ranger-film/artifacts/audio/probe.txt`

**Interfaces:**
- Consumes: the measured 20s picture timeline.
- Produces: a 20s Tier A score.

- [ ] **Step 1: Write score.json**

Create `projects/ranger-film/score.json`:

```json
{
  "style": "cinematic-epic",
  "duration": 20.0,
  "reveal": 6.5,
  "tier": "A",
  "overrides": {
    "bpm": 96,
    "filterMax": 4400,
    "bellLead": 0.14,
    "subEntrance": -3,
    "padEntrance": -7,
    "arpEntrance": -6
  },
  "level_nodes": [
    [0.0, -11],
    [3.2, -11],
    [3.3, -22],
    [4.8, -22],
    [4.9, -12],
    [6.5, -8],
    [10.7, -9],
    [16.2, -22],
    [16.3, -16],
    [17.0, -13],
    [20.0, -13]
  ],
  "build_nodes": [
    [0.0, 0.36],
    [3.2, 0.42],
    [4.9, 0.55],
    [6.5, 1.0],
    [10.7, 0.78],
    [16.2, 0.70],
    [20.0, 0.70]
  ],
  "sfx": {
    "swells": [
      { "endAt": 3.2, "dur": 0.5, "peakDB": -24 },
      { "endAt": 6.5, "dur": 0.8, "peakDB": -16 },
      { "endAt": 16.2, "dur": 0.4, "peakDB": -24 }
    ],
    "blooms": [
      { "at": 1.1, "peakDB": -14, "dur": 0.8 },
      { "at": 6.5, "peakDB": -10, "dur": 1.6 },
      { "at": 16.3, "peakDB": -16, "dur": 0.8 }
    ],
    "ticks": [4.9, 10.7, 12.4]
  },
  "seed": 2024,
  "loudnessTarget": -16.5,
  "leveler": 0.6
}
```

If Task 5’s measured inflate start differs from 6.50 by more than 0.05s, rewrite `reveal`, the 6.5 level/build/sfx entries, and this paragraph’s ticks from the actual stitch starts. Do not guess.

- [ ] **Step 2: Compile, render, probe**

```bash
SKILL=/Users/malik/Documents/Skills/product-film
swiftc -O "$SKILL/scripts/score-dsp.swift" "$SKILL/scripts/score-render.swift" \
  -o projects/ranger-film/artifacts/score-render
OUT=projects/ranger-film/artifacts/audio/ranger-score.m4a \
  projects/ranger-film/artifacts/score-render projects/ranger-film/score.json
MAX_CORR=0.98 MIN_RT60=0.30 MIN_RICHNESS=2498 LOUD_TARGET=-16.5 \
  swift "$SKILL/scripts/probe.swift" \
  projects/ranger-film/artifacts/audio/ranger-score.m4a \
  | tee projects/ranger-film/artifacts/audio/probe.txt
```

Required: `PASS`; duration 20.00 ± 0.05; gated loudness −16.5 ± 1.0; hf_corr < 0.98; richness ≥ 2498; RT60 ≥ 0.30; mono-sum ≤ 4.6 dB.

- [ ] **Step 3: Commit the score contract**

```bash
git add projects/ranger-film/score.json
git commit -m "$(cat <<'EOF'
feat: score RANGER film

EOF
)"
```

---

### Task 7: Mux, Verify, and Gap-Audit

**Files:**
- Generate: `projects/ranger-film/artifacts/final/ranger-twitter-20s.mp4`
- Generate: `projects/ranger-film/artifacts/final/frames/*`
- Create: `projects/ranger-film/gap-audit.md`

**Interfaces:**
- Consumes: untouched picture + gated score.
- Produces: H.264/AAC master, proof frames, written audit.

- [ ] **Step 1: Mux without re-encoding picture**

```bash
swift /Users/malik/Documents/Skills/product-film/scripts/mux.swift \
  projects/ranger-film/artifacts/final/ranger-picture.mp4 \
  projects/ranger-film/artifacts/audio/ranger-score.m4a \
  projects/ranger-film/artifacts/final/ranger-twitter-20s.mp4
```

Expected: `OK muxed`; video duration matches the picture; audio present.

- [ ] **Step 2: Extract mandatory frames from the muxed master**

Extract at least: 0.00, 1.10, 3.10, 4.00, 4.90, 6.50, 8.00, 9.10, 10.70, 12.40, 14.10, 16.20, 16.40, 17.20, 19.98. Inspect full resolution.

Reject on: black edge, cursor, shark/`NICE!`, wrong card copy, SF Pro, missing `CONCEPT`, fade-out on the last frame, browser chrome, floating card.

- [ ] **Step 3: Write gap-audit.md**

Create `projects/ranger-film/gap-audit.md` with seven scene rows (hook, title, launch, inflate, rise, machine, end). Each row: script promise, what the extracted payoff frame shows, frame timestamp/path, unqualified verdict `MET` / `PARTIAL` / `CONTRADICTED` / `MISSING` / `DEVIATES`. Fix editing gaps and remux before delivery. Capture gaps name the missing still.

- [ ] **Step 4: Commit the audit**

```bash
git add projects/ranger-film/gap-audit.md
git commit -m "$(cat <<'EOF'
docs: audit RANGER film delivery

EOF
)"
```

---

### Task 8: Publish the Film on the RANGER Case Study

**Files:**
- Create: `src/assets/ranger-film.mp4`
- Create: `src/assets/ranger-film-poster.webp`
- Modify: `src/data/projectDetails.ts`
- Create: `src/data/projectDetails.test.ts`

**Interfaces:**
- Consumes: the verified X master and the 1.1s punch frame.
- Produces: Intro video figure using existing `ProjectMediaFrame` video support.

- [ ] **Step 1: Write the failing document-model test**

Create `src/data/projectDetails.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getProjectDetail } from "./projectDetails";

describe("RANGER project film", () => {
  it("publishes the approved product film at the start of the intro story", () => {
    const ranger = getProjectDetail("ranger");
    const intro = ranger?.sections.find((section) => section.id === "intro");

    expect(intro?.figures?.[0]).toMatchObject({
      type: "video",
      src: expect.stringContaining("ranger-film"),
      poster: expect.stringContaining("ranger-film-poster"),
    });
    expect(intro?.body).toContain("[[fig:0]]");
  });
});
```

- [ ] **Step 2: Verify RED**

```bash
npx vitest run src/data/projectDetails.test.ts
```

Expected: FAIL because RANGER Intro has no film figure.

- [ ] **Step 3: Copy master and poster**

Copy `projects/ranger-film/artifacts/final/ranger-twitter-20s.mp4` byte-for-byte to `src/assets/ranger-film.mp4`.

Extract the 1.10s frame from that master, convert to 2560×1440 WebP, save as `src/assets/ranger-film-poster.webp`. Visually match it to the approved 1.10s verification frame.

- [ ] **Step 4: Wire the Intro**

In `src/data/projectDetails.ts`, add:

```ts
import rangerFilm from "@/assets/ranger-film.mp4";
import rangerFilmPoster from "@/assets/ranger-film-poster.webp";
```

Set the RANGER Intro `figures` to `[{ type: "video", src: rangerFilm, poster: rangerFilmPoster }]` and insert `[[fig:0]]` immediately after the opening bold paragraph, before “Ghost gear is fishing equipment”.

- [ ] **Step 5: Verify GREEN**

```bash
npx vitest run src/data/projectDetails.test.ts src/components/project-detail/ProjectMediaFrame.test.tsx
npm run build
```

Expected: PASS; production build succeeds.

- [ ] **Step 6: Commit publication**

```bash
git add src/assets/ranger-film.mp4 src/assets/ranger-film-poster.webp \
        src/data/projectDetails.ts src/data/projectDetails.test.ts
git commit -m "$(cat <<'EOF'
feat: publish RANGER product film

EOF
)"
```

---

### Task 9: Final Repository and Delivery Verification

**Files:**
- Verify: committed contracts, website assets, audit.

- [ ] **Step 1: Run repo checks without touching unrelated work**

```bash
npx vitest run src/data/projectDetails.test.ts src/components/project-detail/ProjectMediaFrame.test.tsx
npm run build
git diff --check
git status --short
```

Report pre-existing failures separately. Do not edit design-system files or `_to_delete/`.

- [ ] **Step 2: Re-verify the website master**

Probe `src/assets/ranger-film.mp4` duration/size; extract 1.10s / inflate / end-card frames again; `shasum` must match `artifacts/final/ranger-twitter-20s.mp4`.

- [ ] **Step 3: Hand off**

Deliver:

- `projects/ranger-film/artifacts/final/ranger-twitter-20s.mp4` (tweet this),
- `projects/ranger-film/gap-audit.md`,
- the commit list,
- probe/test results,
- any remaining capture gap stated plainly.

Do not claim completion without fresh passing evidence from the commands above.
