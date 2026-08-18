# ZEAT Twitter Film Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce, verify, and publish a 30.0-second 16:9 ZEAT product film with a product-first three-second hook, kinetic premium pacing, an original frame-locked soundtrack, and an embedded version on the ZEAT portfolio case study.

**Architecture:** A Playwright driver stages the real ZEAT case-study page while ScreenCaptureKit records cursor-free 16:9 takes. The product-film Swift tools conform, measure, condense, composite, stitch, score, mux, and verify those takes; project-local manifests hold every measured trim, camera keyframe, cue, and score event. Only the approved MP4 and poster enter `src/assets`; large intermediate media remains in an ignored durable workspace.

**Tech Stack:** Playwright/Chromium, ScreenCaptureKit, AVFoundation Swift scripts from `product-film` v1.1.1, General Sans, Vite 7, React 18, TypeScript, Vitest.

## Global Constraints

- Use `/Users/malik/Documents/Skills/product-film` at clean `origin/main`; re-run `git fetch origin && git pull --ff-only origin main` before production resumes in a later session.
- Follow the approved spec at `docs/superpowers/specs/2026-08-18-zeat-twitter-film-design.md`.
- Master is exactly 2560×1440, 60 fps, and 30.0 seconds.
- The first 3.2 seconds contain the stadium rendering only: no copy, cursor, or UI explanation.
- Capture the real ZEAT website surface; do not fake arm motion, pickup motion, compaction motion, or wheel rotation.
- Do not show a stair-crossing image, wireframe, chip, heading, or claim.
- Collection and compaction precede the 360° tight-space turn.
- The arm sequence must visibly communicate seat → arm → intake using only the approved static renders and framing.
- Use desktop `FILL=1`; no browser chrome, black margins, floating card, corner, or shadow may enter the frame.
- Use one film-wide pointer contract: synthetic 64 px black arrow with white outline and click ring; recorded takes contain no OS cursor.
- Every feature reveal after the hook has a visible cursor → press → ring cue before the website response.
- Every payoff remains readable for at least two seconds.
- Generate the end card with the real ZEAT wordmark, General Sans, near-black/white, and cyan sampled from the robot light strip.
- Use Tier A frame-locked, license-free scoring. Do not imitate any recognizable AirPods 4 melody, vocal flow, drum pattern, arrangement, or recording.
- The final frame holds; neither picture nor score fades out.
- Preserve unrelated working-tree changes in `src/design-system/reference/content/Components.tsx`, `src/design-system/reference/content/content.test.tsx`, `_to_delete/`, and `src/design-system/reference/content/ComponentDoc.tsx`.

---

## File Structure

- `.gitignore` — ignores `projects/zeat-film/artifacts/`, the durable large-media workspace.
- `projects/zeat-film/README.md` — exact production commands, skill revision, directory contract, and delivery checklist.
- `projects/zeat-film/shot-manifest.json` — approved scene targets plus measured source trims, click controls, camera keyframes, and output durations.
- `projects/zeat-film/capture-scenes.mjs` — stages each real page image and triggers its lightbox interaction without an on-screen pointer.
- `projects/zeat-film/extract-brand.swift` — crops the real ZEAT wordmark and samples the light-strip cyan from `zeat-hero.webp`.
- `projects/zeat-film/end-card.swift` — project copy of the end-card renderer with the approved three supporting lines laid out separately.
- `projects/zeat-film/stitch.swift` — project copy of the approved stitch template with the ZEAT clip order and transition map.
- `projects/zeat-film/score.json` — measured Tier A music/SFX contract.
- `projects/zeat-film/gap-audit.md` — evidence-based final scene audit.
- `projects/zeat-film/artifacts/takes/` — raw ScreenCaptureKit takes; ignored.
- `projects/zeat-film/artifacts/cfr/` — conformed 60 fps takes; ignored.
- `projects/zeat-film/artifacts/scans/` — contact sheets, diffscan logs, and measurement frames; ignored.
- `projects/zeat-film/artifacts/scenes/` — condensed and composited scene clips; ignored.
- `projects/zeat-film/artifacts/cards/` — wordmark and rendered end card; ignored.
- `projects/zeat-film/artifacts/audio/` — score and probe logs; ignored.
- `projects/zeat-film/artifacts/final/` — stitched picture, muxed master, verification frames, and Twitter delivery copy; ignored.
- `src/assets/zeat-film.mp4` — approved website master.
- `src/assets/zeat-film-poster.webp` — website poster extracted from the approved opening frame.
- `src/data/projectDetails.ts` — embeds the film in the ZEAT Intro section.
- `src/data/projectDetails.test.ts` — locks the ZEAT video and poster into the document model.

---

### Task 1: Scaffold the Durable Film Workspace

**Files:**
- Modify: `.gitignore`
- Create: `projects/zeat-film/README.md`
- Create: `projects/zeat-film/shot-manifest.json`

**Interfaces:**
- Produces: one durable project root whose committed files are reproducible contracts and whose ignored `artifacts/` subtree holds generated media.
- Preserves: all unrelated website files and untracked user work.

- [ ] **Step 1: Add the artifact ignore rule**

Append exactly:

```gitignore

# ZEAT product-film intermediates; approved master/poster are copied to src/assets.
projects/zeat-film/artifacts/
```

- [ ] **Step 2: Create the directory contract and manifest**

Create `README.md` with the skill path/version, approved spec path, canvas/fps/duration, pointer contract, stage order, and the exact artifact subdirectories listed above.

Create `shot-manifest.json` with these top-level scene records and immutable target windows:

```json
{
  "canvas": { "width": 2560, "height": 1440, "fps": 60, "duration": 30.0 },
  "sourceUrl": "https://www.malikzhang.com/project/zeat",
  "pointer": { "style": "arrow", "sizePx": 64, "recordedCursor": false },
  "scenes": [
    { "id": "01-hook", "start": 0.0, "end": 3.2, "asset": "zeat-in-context.webp", "click": false },
    { "id": "02-floors-seats", "start": 3.2, "end": 6.0, "asset": "zeat-in-context.webp", "click": true },
    { "id": "03a-arm", "start": 6.0, "end": 8.2, "asset": "zeat-arm.webp", "click": true },
    { "id": "03b-intake", "start": 8.2, "end": 10.6, "asset": "zeat-intake.webp", "click": true },
    { "id": "04-compaction", "start": 10.6, "end": 14.3, "asset": "zeat-structure.webp", "click": true },
    { "id": "05-turn", "start": 14.3, "end": 17.9, "asset": "zeat-turn.webp", "click": true },
    { "id": "06-service", "start": 17.9, "end": 21.7, "asset": "zeat-service-topdown.webp", "click": true },
    { "id": "07a-prototype", "start": 21.7, "end": 24.2, "asset": "zeat-prototype.webp", "click": true },
    { "id": "07b-booth", "start": 24.2, "end": 26.3, "asset": "zeat-prototype-booth.webp", "click": true },
    { "id": "08-end-card", "start": 26.4, "end": 30.0, "asset": "zeat-wordmark.png", "click": false }
  ]
}
```

The 0.1-second interval from 26.3–26.4 is the intentional black breath.

- [ ] **Step 3: Validate the manifest and commit**

Run:

```bash
node -e 'const m=require("./projects/zeat-film/shot-manifest.json"); if(m.canvas.duration!==30||m.scenes[0].end!==3.2||m.scenes.at(-1).end!==30) process.exit(1)'
git diff --check
git add .gitignore projects/zeat-film/README.md projects/zeat-film/shot-manifest.json
git commit -m "chore: scaffold ZEAT film production"
```

Expected: exit 0; only the three named files are committed.

---

### Task 2: Extract Verified ZEAT Brand Assets

**Files:**
- Create: `projects/zeat-film/extract-brand.swift`
- Modify: `projects/zeat-film/shot-manifest.json`
- Generate: `projects/zeat-film/artifacts/cards/zeat-wordmark.png`
- Generate: `projects/zeat-film/artifacts/cards/brand.json`

**Interfaces:**
- Consumes: `src/assets/zeat-hero.webp` at 4725×2993.
- Produces: an opaque white wordmark crop that `end-card-template.swift` keys by inverse luminance, plus a sampled cyan hex in `brand.json`.

- [ ] **Step 1: Implement deterministic extraction**

Create a Swift utility with this CLI:

```text
swift projects/zeat-film/extract-brand.swift src/assets/zeat-hero.webp projects/zeat-film/artifacts/cards/zeat-wordmark.png projects/zeat-film/artifacts/cards/brand.json
```

It must:

1. Load the hero through `NSImage`/`CGImage` and fail unless it is 4725×2993.
2. Crop the top-left wordmark using top-left source coordinates `x=190, y=190, width=1700, height=500`.
3. Write the crop as PNG without recoloring it.
4. Inspect pixels in the robot light-strip sampling rectangle `x=1030, y=1400, width=1250, height=220`.
5. Keep pixels where green and blue each exceed red by at least 25 and brightness exceeds 150; take the median R/G/B of the retained pixels.
6. Fail if fewer than 500 pixels qualify or if the result is not cyan-like (`G >= R + 20` and `B >= R + 20`).
7. Write `{"accent":"RRGGBB","source":"zeat-hero.webp"}`.

- [ ] **Step 2: Run and visually verify**

Run:

```bash
mkdir -p projects/zeat-film/artifacts/cards
swift projects/zeat-film/extract-brand.swift src/assets/zeat-hero.webp projects/zeat-film/artifacts/cards/zeat-wordmark.png projects/zeat-film/artifacts/cards/brand.json
sips -g pixelWidth -g pixelHeight projects/zeat-film/artifacts/cards/zeat-wordmark.png
cat projects/zeat-film/artifacts/cards/brand.json
```

Expected: wordmark is 1700×500; the PNG contains the complete real `ZEAT` mark with no subtitle or feature icons; `accent` passes the cyan-like assertion.

- [ ] **Step 3: Record the sampled accent and commit the utility**

Copy the generated `accent` string into `shot-manifest.json` under `brand.accent`; do not commit generated PNG/JSON artifacts.

Run `git diff --check`, then commit only `extract-brand.swift` and `shot-manifest.json` with `feat: extract ZEAT film brand assets`.

---

### Task 3: Build the Real-Page Capture Driver

**Files:**
- Create: `projects/zeat-film/capture-scenes.mjs`
- Modify: `projects/zeat-film/README.md`

**Interfaces:**
- Consumes: a scene id from `shot-manifest.json` and a Chromium CDP endpoint in `CDP_URL`.
- Produces: a staged, stationary webpage and an action sequence; no screenshot or browser-recording API is used.

- [ ] **Step 1: Define exact scene selectors**

Use these alt-text selectors:

```js
export const sceneSelectors = {
  "01-hook": 'img[alt="ZEAT working a littered grandstand, arm raised and collection lid open"]',
  "02-floors-seats": 'img[alt="ZEAT working a littered grandstand, arm raised and collection lid open"]',
  "03a-arm": 'img[alt="Articulated arm raised above the garbage inlet, lid open"]',
  "03b-intake": 'img[alt="Detail of the top deck — open hopper, clear intake cover, and indicator light"]',
  "04-compaction": 'img[alt="Ghosted side view revealing the internal layout — intake path, collection volume, and drive components"]',
  "05-turn": 'img[alt="Top-down view with rotation arrows showing ZEAT pivoting in place on its four independently driven wheels"]',
  "06-service": 'img[alt="Top-down service view — dust bag, battery compartment, and garbage inlet, with the rear status screen reading Sector 01, 92%"]',
  "07a-prototype": 'img[alt="The finished physical model in three-quarter view — printed, hand-finished, sprayed, and assembled, with the intake mouth and CMF split visible"]',
  "07b-booth": 'img[alt="The physical ZEAT model on the exhibition stand, shown with the project poster and printed brochure"]'
};
```

- [ ] **Step 2: Implement the staging/action contract**

The driver must connect to an already-open headed Chromium instance, set reduced motion to `no-preference`, disable translation UI, navigate to the exact source URL, wait for `document.fonts.ready`, and assert exactly one selected image is visible after `scrollIntoViewIfNeeded()`.

For `01-hook`, click the image before printing `READY`, wait for the expanded-image dialog, then hold for 5 seconds without further interaction.

For every other scene, print `READY` while the page image is visible, hold 1.5 seconds, invoke `locator.click({position:{x:width/2,y:height/2}})`, wait for the expanded-image dialog, then hold 4 seconds. Print the image bounding box and click center in viewport fractions so the compositor cue uses control geometry rather than diffscan centroids.

Reject any scene whose viewport contains text matching `Crosses grandstand steps` at the prepared capture state.

- [ ] **Step 3: Dry-run every selector without recording**

Launch Chromium with remote debugging and a clean temporary profile, then run all nine scene ids. Expected for each: one `READY`, one valid image box, no selector ambiguity, no translation or permission dialog, and no visible stair-crossing chip.

- [ ] **Step 4: Commit the capture contract**

Run `node --check projects/zeat-film/capture-scenes.mjs` and `git diff --check`; commit the driver and README as `feat: add ZEAT real-page capture driver`.

---

### Task 4: Capture, Conform, and Measure Every Take

**Files:**
- Generate: `projects/zeat-film/artifacts/takes/*.mov`
- Generate: `projects/zeat-film/artifacts/cfr/*.mov`
- Generate: `projects/zeat-film/artifacts/scans/*`
- Modify: `projects/zeat-film/shot-manifest.json`

**Interfaces:**
- Consumes: prepared page states and ScreenCaptureKit content-region geometry.
- Produces: nine verified 2560×1440 CFR 60 takes and measured response/click data.

- [ ] **Step 1: Compile and prove the recorder path**

Compile once:

```bash
mkdir -p projects/zeat-film/artifacts/{takes,cfr,scans,scenes,cards,audio,final}
swiftc -O /Users/malik/Documents/Skills/product-film/scripts/sckrecord.swift -o projects/zeat-film/artifacts/sckrecord
```

Launch the clean Chromium window, print `screenX`, `screenY`, `innerWidth`, `innerHeight`, `outerWidth`, `outerHeight`, and `devicePixelRatio`, and derive the exact content rectangle. Record a 3-second cursor-wiggle test with `SHOWCURSOR=1`; inspect it to prove the region contains page pixels only and is exactly 2560×1440 at scale 2. Delete the wiggle test after it passes.

- [ ] **Step 2: Record nine cursor-free takes**

Store the exact content origin proved in Step 1 as shell variables `content_x` and `content_y`. For each scene id in the manifest, start `projects/zeat-film/artifacts/sckrecord "$content_x" "$content_y" 1280 720 "projects/zeat-film/artifacts/takes/$id.mov" 2`, wait for its `RECORDING` line, run the matching driver action, then send SIGINT to the recorder and wait for its `DONE frames=` line. Do not set `SHOWCURSOR`.

Before each take, take a passive still of the exact region and inspect it for the intended Chrome content, no Codex overlay, and no browser chrome.

- [ ] **Step 3: Conform every source before measurement**

Run for each take:

```bash
for id in 01-hook 02-floors-seats 03a-arm 03b-intake 04-compaction 05-turn 06-service 07a-prototype 07b-booth; do
  swift /Users/malik/Documents/Skills/product-film/scripts/conform.swift \
    "projects/zeat-film/artifacts/takes/$id.mov" \
    "projects/zeat-film/artifacts/cfr/$id.mov" 60
done
```

Expected: 2560×1440, CFR 60, duration at least 4 seconds, no negative/non-monotonic timestamps.

- [ ] **Step 4: Scan and diffscan every conformed take**

Run `scan.swift` at 0.25-second steps and `diffscan2.swift` at 0.05-second steps with threshold 1.2. Save full console output per take in `artifacts/scans/$id-diff.txt`, where `$id` is one of the nine explicit scene ids in the preceding loop.

Extract and inspect one raw frame from every source to verify content, not filename. Record in `shot-manifest.json`:

- the measured stable pre-click frame,
- the click control center from the driver,
- the first response frame from diffscan2,
- the end of the whole lightbox animation,
- a static-tail interval of at least two seconds.

- [ ] **Step 5: Commit measurement metadata only**

Validate that all nine scene records have numeric `trimStart`, `response`, `animationEnd`, `controlFx`, and `controlFy` values (`01-hook` omits click values). Commit only `shot-manifest.json` as `docs: measure ZEAT film takes`.

---

### Task 5: Condense and Composite the Full-Bleed Scene Clips

**Files:**
- Generate: `projects/zeat-film/artifacts/scenes/*-condensed.mp4`
- Generate: `projects/zeat-film/artifacts/scenes/*-comp.mp4`
- Modify: `projects/zeat-film/shot-manifest.json`

**Interfaces:**
- Consumes: measured CFR takes.
- Produces: ten timed 2560×1440 composite clips—nine website clips plus the later end card—with legal full-bleed framing and consistent pointer cues.

- [ ] **Step 1: Condense from measured frames only**

Use `condense.swift` to retain the stable pre-click lead, the entire unbroken lightbox transition, and at least a two-second expanded-image payoff. Use hold mode only on static tails; never splice onto the first moving frame.

Set the website clip source durations so the stitched scene boundaries land exactly at 3.2, 6.0, 8.2, 10.6, 14.3, 17.9, 21.7, 24.2, and 26.3 seconds after the specified overlaps are applied.

- [ ] **Step 2: Write camera plans from readable subjects**

Record camera keyframes in `shot-manifest.json` and pass them verbatim to `composite2.swift`:

- `01-hook`: wide stadium context at scale 1.00, then sharp punch toward ZEAT at 1.1 seconds, settling between 1.45–1.60.
- `02-floors-seats`: frame floor intake, seat trash, and raised arm together; do not crop the caption until after it has been readable.
- `03a-arm`: arrive on the arm/control before the cue, then follow-pan from gripper to Garbage Inlet at constant scale.
- `03b-intake`: land on the dedicated top opening and hold.
- `04-compaction`: pan from front intake path to central collection volume/internal roller without passing through stair content.
- `05-turn`: follow the red circular arrows across ghosted states, then settle on the four wheels.
- `06-service`: include dust bag, battery, garbage inlet, and rear status display in one readable composition.
- `07a-prototype`: largest image punch at the 21.7-second reveal.
- `07b-booth`: settle on the exhibition proof and hold through the black breath.

- [ ] **Step 3: Composite with one pointer contract**

For the hook, use `FILL=1 CURSOR_STYLE=none` and no `CUES`.

For every feature take, read `response`, `controlFx`, `controlFy`, `duration`, and the semicolon-delimited camera plan from its `shot-manifest.json` record into shell variables, then use:

```bash
FILL=1 CURSOR_STYLE=arrow CURSOR_PX=64 \
CUES="$response $control_fx $control_fy 1" \
swift /Users/malik/Documents/Skills/product-film/scripts/composite2.swift \
"$condensed_path" "$composite_path" 0 "$duration" "$camera_plan"
```

All click coordinates come from the image control geometry printed by the driver, never diffscan centroids.

- [ ] **Step 4: Verify frames before stitching**

Extract a click frame and payoff frame from every scene. Confirm:

- page fills all four edges,
- arrow direction, size, ring, and outline match across all eight clicked clips,
- no recorded pointer exists,
- click ring precedes the visible response,
- no stair chip/image/copy is visible,
- each payoff remains readable for at least two seconds.

Fix and re-render any failing clip before continuing.

- [ ] **Step 5: Commit the final measured plans**

Commit only `shot-manifest.json` as `docs: lock ZEAT film camera and cue plans`.

---

### Task 6: Render the Branded End Card and Stitch the 30-Second Picture

**Files:**
- Create: `projects/zeat-film/end-card.swift`
- Create: `projects/zeat-film/stitch.swift`
- Generate: `projects/zeat-film/artifacts/cards/end-card.mov`
- Generate: `projects/zeat-film/artifacts/final/zeat-picture.mp4`

**Interfaces:**
- Consumes: composited scene clips, sampled brand accent, real wordmark, and General Sans Semibold TTF.
- Produces: an exact 1800-frame silent picture master.

- [ ] **Step 1: Specialize the end-card renderer**

Copy `/Users/malik/Documents/Skills/product-film/scripts/end-card-template.swift` to `projects/zeat-film/end-card.swift`. Preserve its logo keying, font registration, color validation, 2560×1440 writer, smoothstep entrance, and exact 60 fps frame loop. Replace the one-line CLI with:

```text
swift projects/zeat-film/end-card.swift OUTPUT_MOV 3.6 WORDMARK_PNG "STADIUM CLEANING ROBOT" "SEE THE FULL CASE STUDY" "malikzhang.com/project/zeat"
```

Render the real wordmark centered at 760 px wide. Below it, draw the three arguments on separate centered lines using General Sans Semibold: descriptor at 52 px, CTA at 40 px with the sampled cyan, and URL at 38 px. Use 1.25 line-height, no added punctuation, and the same 0.34-second low-travel rise/fade on every element.

- [ ] **Step 2: Render the 3.6-second end card**

Read the sampled accent from `brand.json`, then run:

```bash
accent="$(node -p 'require("./projects/zeat-film/artifacts/cards/brand.json").accent')"
FONT_FILE=/Users/malik/Documents/malik-portfolio/moodmuse-assets/fonts/GeneralSans-Semibold.ttf \
BG=090A0B LINE_COLOR=F4F5F5 LOGO_COLOR=F4F5F5 ACCENTS="$accent" \
ENTRANCE=0.34 RISE=-18 LOGO_W=760 W=2560 H=1440 FPS=60 \
swift projects/zeat-film/end-card.swift \
projects/zeat-film/artifacts/cards/end-card.mov 3.6 \
projects/zeat-film/artifacts/cards/zeat-wordmark.png \
"STADIUM CLEANING ROBOT" "SEE THE FULL CASE STUDY" "malikzhang.com/project/zeat"
```

Read the rendered style line and reject any warning or font fallback.

- [ ] **Step 3: Read the full-resolution card copy**

Extract a frame at 27.2 seconds-equivalent within the card and verify the real ZEAT wordmark plus these exact content units are readable:

```text
ZEAT
STADIUM CLEANING ROBOT
SEE THE FULL CASE STUDY
malikzhang.com/project/zeat
```

The three supporting lines must remain separate and contain no separator glyphs or extra copy.

- [ ] **Step 4: Copy and specialize the stitch template**

Copy `/Users/malik/Documents/Skills/product-film/scripts/stitch-template.swift` to `projects/zeat-film/stitch.swift`. Replace the clip list with the nine website composites plus `end-card.mov`. Use beat-locked `Z` overlaps within the website sequence, including arm→intake and prototype→booth. Use `B` with `dur: 0.1` only for booth→end card. Add an initial 0.18-second opacity ramp so the first rendering rises from black without delaying the first visible product frame.

- [ ] **Step 5: Render and prove exact picture timing**

Run the stitcher with `CLIPS_DIR` and `OUT` pointing at the artifact directories. Verify with AVFoundation metadata:

- duration `30.000 ± 0.001` seconds,
- 1800 frames at 60 fps,
- 2560×1440 H.264,
- no audio track,
- first 3.2 seconds contain no text/cursor,
- frame 1799 is the held end card, not black.

If duration differs, adjust only the static tail of the preceding scene or end-card hold; do not retime interaction animations.

- [ ] **Step 6: Commit the card and stitch contracts**

Commit `projects/zeat-film/end-card.swift` and `projects/zeat-film/stitch.swift` as `feat: assemble ZEAT film picture`.

---

### Task 7: Compose and Gate the Original Frame-Locked Score

**Files:**
- Create: `projects/zeat-film/score.json`
- Generate: `projects/zeat-film/artifacts/audio/zeat-score.m4a`
- Generate: `projects/zeat-film/artifacts/audio/probe.txt`

**Interfaces:**
- Consumes: the measured 30-second picture timeline and named click/reveal events.
- Produces: a 30-second Tier A score aligned to exact frames.

- [ ] **Step 1: Write the measured music contract**

Use `synthwave` as the energetic engine but remove its retro/dance-floor character with these exact overrides:

```json
{
  "style": "synthwave",
  "duration": 30.0,
  "reveal": 21.7,
  "tier": "A",
  "overrides": {
    "bpm": 110,
    "delayTime": 0.409,
    "sidechain": 0.28,
    "snareDecay": 0.20,
    "snareSend": 0.15,
    "drumLevel": 0.82,
    "filterMax": 4800,
    "bellLead": 0.14
  },
  "level_nodes": [[0.0,-11],[3.2,-10.5],[6.0,-10],[10.6,-9.5],[14.3,-9],[17.9,-8.5],[20.9,-13],[21.7,-7],[26.3,-22],[26.4,-17],[27.0,-13],[30.0,-13]],
  "build_nodes": [[0.0,0.34],[3.2,0.42],[6.0,0.50],[10.6,0.61],[14.3,0.70],[17.9,0.80],[20.9,0.72],[21.7,1.0],[26.3,0.76],[30.0,0.76]],
  "sfx": {
    "swells": [{"endAt":21.7,"dur":0.8,"peakDB":-18},{"endAt":26.3,"dur":0.45,"peakDB":-24}],
    "blooms": [{"at":1.1,"peakDB":-14,"dur":0.8},{"at":21.7,"peakDB":-10,"dur":1.6},{"at":26.4,"peakDB":-16,"dur":0.8}],
    "ticks": []
  },
  "seed": 1942,
  "loudnessTarget": -16.5,
  "leveler": 0.6
}
```

Populate `sfx.ticks` from the exact global response-frame times in `shot-manifest.json`; include every clicked feature reveal and no hook/end-card tick.

- [ ] **Step 2: Compile and render Tier A**

Run:

```bash
swiftc -O /Users/malik/Documents/Skills/product-film/scripts/score-dsp.swift /Users/malik/Documents/Skills/product-film/scripts/score-render.swift -o projects/zeat-film/artifacts/score-render
OUT=projects/zeat-film/artifacts/audio/zeat-score.m4a projects/zeat-film/artifacts/score-render projects/zeat-film/score.json
```

Expected: music starts fully formed on frame zero, the 1.1-second hook impact lands on the camera punch, arm/intake ticks form one family, energy briefly contracts before 21.7, and the prototype receives the largest hit/widest moment.

- [ ] **Step 3: Run the mandatory audio gate**

Run and tee the output:

```bash
MAX_CORR=0.98 MIN_RT60=0.30 MIN_RICHNESS=2498 LOUD_TARGET=-16.5 \
swift /Users/malik/Documents/Skills/product-film/scripts/probe.swift projects/zeat-film/artifacts/audio/zeat-score.m4a | tee projects/zeat-film/artifacts/audio/probe.txt
```

Required: PASS; duration within ±0.05 seconds, gated loudness within ±1.0 dB of −16.5 dB, high-frequency correlation below 0.98, richness at least 2498 Hz, RT60 at least 0.30 seconds, and mono-sum no more than 4.6 dB.

- [ ] **Step 4: Commit the score contract**

Commit only `projects/zeat-film/score.json` as `feat: score ZEAT film`.

---

### Task 8: Mux, Verify Every Reveal, and Complete the Gap Audit

**Files:**
- Generate: `projects/zeat-film/artifacts/final/zeat-twitter-30s.mp4`
- Generate: `projects/zeat-film/artifacts/final/frames/*`
- Create: `projects/zeat-film/gap-audit.md`

**Interfaces:**
- Consumes: untouched stitched picture and gated score.
- Produces: final H.264/AAC MP4 plus evidence frames and written audit.

- [ ] **Step 1: Mux without re-encoding picture**

Run:

```bash
swift /Users/malik/Documents/Skills/product-film/scripts/mux.swift \
projects/zeat-film/artifacts/final/zeat-picture.mp4 \
projects/zeat-film/artifacts/audio/zeat-score.m4a \
projects/zeat-film/artifacts/final/zeat-twitter-30s.mp4
```

Verify video duration/frame count match the silent picture and audio is AAC stereo.

- [ ] **Step 2: Extract the mandatory verification frames**

Extract at least: 0.0, 1.1, 3.1, every click cue, every response, every scene payoff, 21.7, 26.3, 26.4, 27.2, and 29.983 seconds. Inspect full resolution.

Reject on any black edge, browser chrome, duplicate/mixed pointer, missed click, cropped payoff, stair content, wrong card copy, wrong font, or blank final frame.

- [ ] **Step 3: Write the evidence-based gap audit**

Create `gap-audit.md` with all eight approved scenes. Each row states the promise, what the extracted payoff frame actually shows, frame timestamp/path, and one unqualified verdict: `MET`, `PARTIAL`, `CONTRADICTED`, `MISSING`, or `DEVIATES`.

Fix all editing gaps and regenerate before delivery. For any capture gap, name the exact missing shot and do not label the scene `MET`.

- [ ] **Step 4: Run final media gates**

Confirm:

- exactly 30.0 seconds / 1800 frames / 60 fps / 2560×1440,
- H.264 video and AAC stereo audio,
- opening 0.0–3.2 has no words or cursor,
- collection/compaction precedes the turn,
- no stair content exists anywhere,
- final end-card copy matches the spec exactly,
- final frame holds,
- score probe remains PASS after mux.

- [ ] **Step 5: Commit the audit**

Commit `projects/zeat-film/gap-audit.md` as `docs: audit ZEAT film delivery`.

---

### Task 9: Publish the Approved Film on the ZEAT Case Study

**Files:**
- Create: `src/assets/zeat-film.mp4`
- Create: `src/assets/zeat-film-poster.webp`
- Modify: `src/data/projectDetails.ts`
- Create: `src/data/projectDetails.test.ts`

**Interfaces:**
- Consumes: the verified final MP4 and opening-frame poster.
- Produces: a first-class video figure in the ZEAT Intro section using the existing in-view playback and controls behavior.

- [ ] **Step 1: Write the failing document-model test**

Create:

```ts
import { describe, expect, it } from "vitest";
import { getProjectDetail } from "./projectDetails";

describe("ZEAT project film", () => {
  it("publishes the approved product film at the start of the intro story", () => {
    const zeat = getProjectDetail("zeat");
    const intro = zeat?.sections.find((section) => section.id === "intro");

    expect(intro?.figures?.[0]).toMatchObject({
      type: "video",
      src: expect.stringContaining("zeat-film"),
      poster: expect.stringContaining("zeat-film-poster"),
    });
    expect(intro?.body).toContain("[[fig:0]]");
  });
});
```

- [ ] **Step 2: Verify RED**

Run `npx vitest run src/data/projectDetails.test.ts`.

Expected: FAIL because the ZEAT Intro has no film figure.

- [ ] **Step 3: Copy the approved deliverables**

Copy the verified final MP4 byte-for-byte to `src/assets/zeat-film.mp4`.

Extract the poster from the approved master at 1.1 seconds, convert to 2560×1440 WebP at high quality, and save as `src/assets/zeat-film-poster.webp`. Compare the poster visually to the approved 1.1-second verification frame.

- [ ] **Step 4: Add the film to the ZEAT Intro**

Import both assets in `src/data/projectDetails.ts`. Set the Intro `figures` to:

```ts
figures: [{ type: "video", src: zeatFilm, poster: zeatFilmPoster }],
```

Insert `[[fig:0]]` immediately after the opening bold ZEAT overview paragraph, before the paragraph beginning “Every event leaves three to four tons of trash”.

- [ ] **Step 5: Verify GREEN, build, and visually inspect**

Run:

```bash
npx vitest run src/data/projectDetails.test.ts src/components/project-detail/ProjectMediaFrame.test.tsx
npm run build
```

Open `/project/zeat` at desktop and mobile widths. Verify the poster paints before playback, the film begins when half visible, controls work, audio remains user-controlled, aspect ratio is 16:9, and no layout overflow occurs.

- [ ] **Step 6: Commit the website publication**

Stage only the two approved assets, `src/data/projectDetails.ts`, and its test. Commit as `feat: publish ZEAT product film`.

---

### Task 10: Final Repository and Delivery Verification

**Files:**
- Verify: all committed project-film contracts, website assets, and audit.

**Interfaces:**
- Produces: a clean evidence-backed handoff without touching unrelated user work.

- [ ] **Step 1: Run focused and repository-wide checks**

Run:

```bash
npm test
npm run lint
npm run build
git diff --check
git status --short
```

Report pre-existing failures separately; do not alter unrelated design-system files to make this film task appear clean.

- [ ] **Step 2: Re-run media verification from the final website asset**

Probe `src/assets/zeat-film.mp4`, extract the opening/click/prototype/end frames again, and compare its checksum with `artifacts/final/zeat-twitter-30s.mp4`. They must be byte-identical.

- [ ] **Step 3: Deliver both artifacts**

Hand off:

- the playable `src/assets/zeat-film.mp4`,
- `projects/zeat-film/gap-audit.md`,
- the commit list,
- the final media/probe/test results,
- any remaining capture gap stated plainly.

Do not claim completion until every command above has fresh passing evidence.
