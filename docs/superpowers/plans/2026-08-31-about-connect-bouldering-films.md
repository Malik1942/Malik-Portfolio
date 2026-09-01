# About Connect Bouldering Films Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce and deliver two verified 16:9 social films of Malik Zhang's live About Connect bouldering game: a simple native-screen cut and an authored product-film cut.

**Architecture:** Two isolated four-take sets capture V0, V2, V4, and the clean Connect state from the live website. Version 1 records the real cursor; Version 2 records cursor-free footage for authored pointer cues. A project-local ScreenCaptureKit recorder extends the authoritative video recorder with synchronized system audio so the browser's real Web Audio effects survive; the existing product-film tools then conform, measure, condense, composite, stitch, score, mux, verify, and audit the two edits independently.

**Tech Stack:** Google Chrome, Playwright 1.59, ScreenCaptureKit, AVFoundation, Core Animation, Swift, Node.js, and `/Users/malik/Documents/Skills/product-film` at revision `ca1b7ba877d032373a93b1006ba83ea438f76af5`.

## Global Constraints

- Follow `docs/superpowers/specs/2026-08-31-about-connect-bouldering-film-design.md` exactly.
- Use the live URL `https://www.malikzhang.com/about/connect` as the product source of truth.
- The third route is V4. Never relabel it V5.
- Both masters are 2560 x 1440, 16:9, 60 fps, and between 15 and 25 seconds.
- Gameplay begins inside the first three seconds.
- Use fresh live captures and preserve the website's real route geometry, chalk counter, completion messages, V4 fall, brush animation, and game sounds.
- Use the verified lines: V0 `a1 -> a3 -> a4 -> top`, V2 `p1 -> p3 -> p4 -> p6 -> top`, V4 pump-out `q2 -> q5 -> q3 -> q4 -> q6 -> q7`.
- Version 1 records and uses the real OS cursor throughout. Version 2 records without the OS cursor and uses one synthetic 64 px black arrow with white outline and click rings. Never mix pointer contracts within a version.
- Version 1 uses native game sound only. Version 2 uses a frame-locked Tier A `apple-pulse` score beneath the native game-sound stem.
- Keep the native step, send, fall, and brush effects louder than the score.
- Version 2 uses desktop `FILL=1`; no browser chrome, black edge, floating card, corner, or shadow may enter the picture.
- Never trim onto the first moving frame of an animation. Preserve each state transition and the complete V4 fall as one unbroken segment.
- Verify added words at full resolution: `SEND IT.`, `TRY V4.`, `CLIMB. CONNECT.`, and `malikzhang.com/about/connect`.
- Do not use ffmpeg, external editors, downloaded music, cloud music services, or external audio services.
- Preserve unrelated working-tree changes. Stage and commit only the files named in each task.

---

## File Structure

- `.gitignore` - ignores `projects/about-connect-film/artifacts/`.
- `projects/about-connect-film/README.md` - production commands and delivery checklist.
- `projects/about-connect-film/capture-manifest.json` - exact route sequences and capture contract.
- `projects/about-connect-film/capture-route.mjs` - stages Chrome, records control boxes, and performs one route.
- `projects/about-connect-film/scripts/sckrecord-audio.swift` - synchronized ScreenCaptureKit video and system-audio recorder.
- `projects/about-connect-film/scripts/extract-audio.swift` - copies captured audio to source-aligned AAC.
- `projects/about-connect-film/scripts/assemble-native-audio.swift` - applies the measured picture edit map to source audio.
- `projects/about-connect-film/scripts/audio-audit.swift` - verifies tracks, timing, level, and event-window energy.
- `projects/about-connect-film/scripts/mix-native-score.swift` - combines native sound and Tier A score with score-only ducking.
- `projects/about-connect-film/scripts/text-overlay.swift` - adds the Version 1 CTA and the Version 2 `SEND IT.` hook without changing other frames.
- `projects/about-connect-film/edit-manifest.json` - measured trims, output ranges, controls, cameras, and audio mapping.
- `projects/about-connect-film/stitch-v1.swift` - Version 1 direct-reset-cut sequence.
- `projects/about-connect-film/stitch-v2.swift` - Version 2 zoom-through, breaths, cards, and gameplay sequence.
- `projects/about-connect-film/score.json` - Version 2 Tier A contract.
- `projects/about-connect-film/gap-audit-v1.md` and `gap-audit-v2.md` - final evidence audits.
- `projects/about-connect-film/artifacts/{takes,cfr,source-audio,scans,scenes,cards,audio,final}/` - ignored media and verification outputs.

---

### Task 1: Scaffold the Durable Two-Film Workspace

**Files:**
- Modify: `.gitignore`
- Create: `projects/about-connect-film/README.md`
- Create: `projects/about-connect-film/capture-manifest.json`

**Interfaces:**
- Produces: a committed production contract and ignored artifact tree.
- Preserves: every unrelated tracked and untracked workspace change.

- [ ] **Step 1: Add the artifact ignore rule**

Append exactly:

```gitignore

# About Connect product-film intermediates.
projects/about-connect-film/artifacts/
```

- [ ] **Step 2: Create the capture contract**

Create `capture-manifest.json` with:

```json
{
  "canvas": { "width": 2560, "height": 1440, "fps": 60 },
  "sourceUrl": "https://www.malikzhang.com/about/connect",
  "browser": { "viewportWidth": 1280, "viewportHeight": 720, "deviceScaleFactor": 2 },
  "pointer": {
    "v1": { "recordedCursor": true, "compositeStyle": "none" },
    "v2": { "recordedCursor": false, "compositeStyle": "arrow", "sizePx": 64 }
  },
  "takes": [
    { "id": "v0", "buttons": ["V0 hold a1", "V0 hold a3", "V0 hold a4", "V0 top hold"], "moveGapMs": 620, "postRollMs": 1800 },
    { "id": "v2", "buttons": ["V2 hold p1", "V2 hold p3", "V2 hold p4", "V2 hold p6", "V2 top hold"], "moveGapMs": 560, "postRollMs": 1800 },
    { "id": "v4", "buttons": ["V4 hold q2", "V4 hold q5", "V4 hold q3", "V4 hold q4", "V4 hold q6", "V4 hold q7"], "moveGapMs": 650, "postRollMs": 2600 },
    { "id": "connect", "buttons": [], "moveGapMs": 0, "postRollMs": 5000 }
  ],
  "versions": {
    "v1": { "targetDuration": 20.0, "audio": "native-only" },
    "v2": { "targetDuration": 20.5, "audio": "native-plus-tier-a" }
  }
}
```

Create `README.md` with the skill revision, approved spec and plan paths, directory list, fixed route sequences, pointer contract, and stage order.

- [ ] **Step 3: Validate and commit**

```bash
node -e 'const m=require("./projects/about-connect-film/capture-manifest.json"); if(m.takes.length!==4||m.takes[2].id!=="v4"||m.versions.v2.targetDuration!==20.5) process.exit(1)'
git diff --check
git add .gitignore projects/about-connect-film/README.md projects/about-connect-film/capture-manifest.json
git commit -m "chore: scaffold About Connect film production"
```

Expected: exit 0; only these three files are committed.

---

### Task 2: Build and Prove Synchronized Live Capture

**Files:**
- Create: `projects/about-connect-film/capture-route.mjs`
- Create: `projects/about-connect-film/scripts/sckrecord-audio.swift`
- Create: `projects/about-connect-film/scripts/extract-audio.swift`
- Create: `projects/about-connect-film/scripts/audio-audit.swift`
- Modify: `projects/about-connect-film/README.md`
- Generate: `projects/about-connect-film/artifacts/takes/v1-*.mov`
- Generate: `projects/about-connect-film/artifacts/takes/v2-*.mov`
- Generate: `projects/about-connect-film/artifacts/source-audio/*.m4a`

**Interfaces:**
- Consumes: a take id from `capture-manifest.json`.
- Produces: eight captures, each with one 2560 x 1440 H.264 video track, synchronized 48 kHz stereo AAC, control geometry, and an audit.

- [ ] **Step 1: Implement the synchronized recorder**

Start from the authoritative `sckrecord.swift` behavior without modifying it. Keep its region selection, scale, excluded-window filtering, H.264 settings, hidden-cursor default, and SIGINT finalization. Add:

```swift
cfg.capturesAudio = true
cfg.excludesCurrentProcessAudio = true
cfg.sampleRate = 48_000
cfg.channelCount = 2

let audioSettings: [String: Any] = [
    AVFormatIDKey: kAudioFormatMPEG4AAC,
    AVSampleRateKey: 48_000,
    AVNumberOfChannelsKey: 2,
    AVEncoderBitRateKey: 192_000
]
```

Create a real-time audio writer input. Route `.screen` and `.audio` buffers through one serial writer queue. Start at the first complete video PTS, discard earlier audio, preserve later audio PTS, mark both inputs finished, and print `DONE` followed by integer `videoFrames` and `audioSamples` fields. Fail when either count is zero.

- [ ] **Step 2: Implement the clean Chrome route driver**

Use the installed Playwright Chrome channel with a fresh profile, viewport 1280 x 720, device scale factor 2, sound enabled, and the exact live URL. Wait for `document.fonts.ready`, scroll `Coffee or a climb?` into view, and assert all route buttons, `Mute wall sound`, `Email me`, and `LinkedIn` are visible.

For route takes, accept a version plus take id, wait 1.5 seconds, click each exact accessible button from the manifest, and wait `moveGapMs`. Record every button center in viewport pixels and normalized fractions plus `performance.now()`. Assert `flashed` for V0/V2 and `Pumped out on V4` for V4. Keep Chrome still through `postRollMs`. For `connect`, hold five seconds without interaction. Print one JSON line with the version, global content rect, controls, click times, status, and take id.

- [ ] **Step 3: Implement audio extraction and audit**

The exact proof invocation `extract-audio proof.mov proof.m4a` copies the full audio time range into a zero-based AVMutableComposition and exports 48 kHz stereo AAC; production repeats it with the eight version-prefixed take names.

The exact proof invocation `audio-audit proof.mov 1.0 3.0` prints:

```text
audioTracks=1 sampleRate=48000 channels=2 durationSeconds peakDB rmsDB ptsGapsOver50ms windowRMSDB
```

Fail on a missing audio track, duration below one second, RMS below -60 dBFS, peak above -0.1 dBFS, or audio/video duration mismatch above 0.10 seconds.

- [ ] **Step 4: Compile and prove a short capture**

```bash
mkdir -p projects/about-connect-film/artifacts/{bin,takes,source-audio,cfr,scans,scenes,cards,audio,final}
swiftc -O projects/about-connect-film/scripts/sckrecord-audio.swift -o projects/about-connect-film/artifacts/bin/sckrecord-audio
swiftc -O projects/about-connect-film/scripts/extract-audio.swift -o projects/about-connect-film/artifacts/bin/extract-audio
swiftc -O projects/about-connect-film/scripts/audio-audit.swift -o projects/about-connect-film/artifacts/bin/audio-audit
node --check projects/about-connect-film/capture-route.mjs
```

Stage V0, record through two moves, stop with SIGINT, and audit both the capture and extracted AAC. Expected: one video track, one audible 48 kHz stereo track, energy in the click window, 2560 x 1440 cursor-free picture, and only the intended page region. If macOS blocks system audio, stop and request Screen Recording and System Audio permission; do not silently replace the sound.

- [ ] **Step 5: Capture both four-take sets**

Capture `v1-v0`, `v1-v2`, `v1-v4`, and `v1-connect` with `SHOWCURSOR=1`. Capture `v2-v0`, `v2-v2`, `v2-v4`, and `v2-connect` without `SHOWCURSOR`. Every capture is a fresh session. Before each, inspect a passive still of the exact rect. Reject browser chrome, Codex UI, another window, permission prompts, duplicate pointers, wrong route state, or muted wall sound. Extract and audit each audio stem. Each V0 must contain four moves and a send; each V2 five moves and a send; each V4 six moves plus fall/brush; each Connect take must be clean and quiet.

- [ ] **Step 6: Commit capture tooling only**

Run `git diff --check` and commit only the four source files and README with `feat: capture About Connect gameplay with native sound`.

---

### Task 3: Conform, Measure, and Lock the Edit Manifest

**Files:**
- Create: `projects/about-connect-film/edit-manifest.json`
- Generate: `projects/about-connect-film/artifacts/cfr/*.mp4`
- Generate: `projects/about-connect-film/artifacts/scans/*`

**Interfaces:**
- Consumes: eight raw takes and source-audio stems.
- Produces: CFR 60 pictures and one numeric manifest driving both picture and audio edits.

- [ ] **Step 1: Conform every picture before measurement**

```bash
for id in v1-v0 v1-v2 v1-v4 v1-connect v2-v0 v2-v2 v2-v4 v2-connect; do
  swift /Users/malik/Documents/Skills/product-film/scripts/conform.swift \
    "projects/about-connect-film/artifacts/takes/$id.mov" \
    "projects/about-connect-film/artifacts/cfr/$id.mp4" 60
done
```

Expected: eight 2560 x 1440 CFR 60 files with uniform 1/60-second spacing.

- [ ] **Step 2: Frame-scan and diffscan every source**

Run `scan.swift` at 0.20-second steps and `diffscan2.swift` at 0.05-second steps with threshold 1.2 for all eight sources. Save contact sheets and logs under `artifacts/scans/`. Inspect one raw frame per source. Identify the stable lead, every response frame, send/fall onset, complete animation end, and at least a 0.8-second readable outcome hold. Verify a real cursor in every Version 1 route frame and no recorded cursor in every Version 2 route frame.

- [ ] **Step 3: Write the numeric edit manifest**

Use this schema, replacing all initial zero values and empty arrays with measured data before commit:

```json
{
  "fps": 60,
  "sources": {
    "v1-v0": { "video": "artifacts/cfr/v1-v0.mp4", "audio": "artifacts/source-audio/v1-v0.m4a", "trimStart": 0.0, "trimEnd": 0.0, "responses": [], "controls": [] },
    "v1-v2": { "video": "artifacts/cfr/v1-v2.mp4", "audio": "artifacts/source-audio/v1-v2.m4a", "trimStart": 0.0, "trimEnd": 0.0, "responses": [], "controls": [] },
    "v1-v4": { "video": "artifacts/cfr/v1-v4.mp4", "audio": "artifacts/source-audio/v1-v4.m4a", "trimStart": 0.0, "trimEnd": 0.0, "responses": [], "controls": [] },
    "v1-connect": { "video": "artifacts/cfr/v1-connect.mp4", "audio": "artifacts/source-audio/v1-connect.m4a", "trimStart": 0.0, "trimEnd": 0.0, "responses": [], "controls": [] },
    "v2-v0": { "video": "artifacts/cfr/v2-v0.mp4", "audio": "artifacts/source-audio/v2-v0.m4a", "trimStart": 0.0, "trimEnd": 0.0, "responses": [], "controls": [] },
    "v2-v2": { "video": "artifacts/cfr/v2-v2.mp4", "audio": "artifacts/source-audio/v2-v2.m4a", "trimStart": 0.0, "trimEnd": 0.0, "responses": [], "controls": [] },
    "v2-v4": { "video": "artifacts/cfr/v2-v4.mp4", "audio": "artifacts/source-audio/v2-v4.m4a", "trimStart": 0.0, "trimEnd": 0.0, "responses": [], "controls": [] },
    "v2-connect": { "video": "artifacts/cfr/v2-connect.mp4", "audio": "artifacts/source-audio/v2-connect.m4a", "trimStart": 0.0, "trimEnd": 0.0, "responses": [], "controls": [] }
  },
  "v1": { "duration": 20.0, "clips": [] },
  "v2": { "duration": 20.5, "clips": [], "challengeCard": [6.30, 6.85], "endCard": [18.10, 20.50] }
}
```

Each control is `{ "t": number, "fx": number, "fy": number }`. Each clip has source id, source start/end, output start/end, playback rate, and transition. V1 totals 20.0 seconds; V2 totals 20.5 seconds.

- [ ] **Step 4: Validate and commit measurement metadata**

Add a README validation command rejecting zero trims, empty route responses, wrong durations, any hard-route label other than V4, or illegal output overlaps. Run it with `git diff --check` and commit only the manifest and README as `docs: lock About Connect film measurements`.

---

### Task 4: Build the Simple Screen-Recording Version

**Files:**
- Create: `projects/about-connect-film/scripts/assemble-native-audio.swift`
- Create: `projects/about-connect-film/scripts/text-overlay.swift`
- Create: `projects/about-connect-film/stitch-v1.swift`
- Generate: `projects/about-connect-film/artifacts/final/about-connect-screen.mp4`

**Interfaces:**
- Consumes: V1 picture and audio ranges from `edit-manifest.json`.
- Produces: a 20.0-second pure-screen picture and native-only audio.

- [ ] **Step 1: Condense the route clips and Connect hold**

Use authoritative `condense.swift` with measured ranges only. Preserve every live transition and outcome. Use the approved direct reset cuts between V0, V2, V4, and Connect. Add no zoom-through, title card, or music.

- [ ] **Step 2: Implement source-aligned audio assembly**

The exact Version 1 invocation `assemble-native-audio projects/about-connect-film/edit-manifest.json v1 projects/about-connect-film/artifacts/audio/v1-native.m4a` inserts the source-audio ranges used by the picture at matching output starts, applies identical playback rates, inserts silence for visual-only gaps, exports 48 kHz stereo AAC, and fails unless duration matches within 0.05 seconds.

- [ ] **Step 3: Add the CTA overlay**

The exact invocation `text-overlay projects/about-connect-film/artifacts/final/v1-base-picture.mp4 projects/about-connect-film/artifacts/final/v1-picture.mp4 v1-cta` leaves frames before 15.80 seconds unchanged and adds these General Sans lines from 15.80 to 20.00:

```text
Your move. Try it + connect
malikzhang.com/about/connect
```

Use `rgb(231,230,228)`, a 65 percent near-black backing, 96 px safe margins, and a 0.18-second opacity ease. Keep the live `Coffee or a climb?`, `Email me`, and `LinkedIn` readable.

- [ ] **Step 4: Stitch, assemble, and mux Version 1**

Copy the authoritative stitch template into `stitch-v1.swift`, encode the measured clips with zero-overlap boundaries, render picture, apply CTA, assemble native audio, and run:

```bash
swift /Users/malik/Documents/Skills/product-film/scripts/mux.swift \
  projects/about-connect-film/artifacts/final/v1-picture.mp4 \
  projects/about-connect-film/artifacts/audio/v1-native.m4a \
  projects/about-connect-film/artifacts/final/about-connect-screen.mp4
```

Expected: 20.00 seconds, 2560 x 1440, 60 fps, one H.264 video track, one stereo AAC track, both sends, V4 fall/brush, and no music.

- [ ] **Step 5: Commit reproducible Version 1 sources**

Run Swift compile checks and `git diff --check`; commit only the three new source files with `feat: build simple About Connect screen film`.

---

### Task 5: Build the Authored Product-Film Version

**Files:**
- Create: `projects/about-connect-film/stitch-v2.swift`
- Create: `projects/about-connect-film/score.json`
- Create: `projects/about-connect-film/scripts/mix-native-score.swift`
- Modify: `projects/about-connect-film/scripts/text-overlay.swift`
- Generate: `projects/about-connect-film/artifacts/cards/try-v4.mov`
- Generate: `projects/about-connect-film/artifacts/cards/climb-connect.mov`
- Generate: `projects/about-connect-film/artifacts/final/about-connect-product-film.mp4`

**Interfaces:**
- Consumes: measured controls, responses, trims, and final event times.
- Produces: a 20.5-second full-bleed authored film with native sound and Tier A score.

- [ ] **Step 1: Condense and composite gameplay**

Use measured ranges only. Run `autoplan.py --desktop`, then ensure a distinct constant-scale keyframe at every hold arrival. Composite with `FILL=1 CURSOR_STYLE=arrow CURSOR_PX=64` and measured `CUES`. V0 begins moving immediately; V2 follow-pans; V4 keeps route label and chalk readable, then holds still through the fall. Extract one click frame per scene and reject pointer inconsistency.

Run `text-overlay projects/about-connect-film/artifacts/scenes/v2-v0-comp.mp4 projects/about-connect-film/artifacts/scenes/v2-v0-hook.mp4 v2-hook`. The `v2-hook` mode adds `SEND IT.` in General Sans for 0.00 to 0.70 seconds with the same warm off-white color, no backing card, and a 0.12-second fade. Pixel-diff frames after 0.70 seconds to prove the rest of the scene is unchanged.

- [ ] **Step 2: Render exact cards**

```bash
FONT_NAME="General Sans" BG=0A0A0A TITLE_COLOR=E7E6E4 ACCENTS=9A805C W=2560 H=1440 FPS=60 ENTRANCE=0.18 RISE=-20 \
swift /Users/malik/Documents/Skills/product-film/scripts/title-card-template.swift \
  projects/about-connect-film/artifacts/cards/try-v4.mov 0.55 "TRY V4."

FONT_NAME="General Sans" BG=0A0A0A TITLE_COLOR=E7E6E4 SUB_COLOR=E7E6E4 ACCENTS=9A805C W=2560 H=1440 FPS=60 ENTRANCE=0.22 RISE=-20 \
swift /Users/malik/Documents/Skills/product-film/scripts/title-card-template.swift \
  projects/about-connect-film/artifacts/cards/climb-connect.mov 2.40 \
  "CLIMB. CONNECT." "malikzhang.com/about/connect"
```

Read both cards at full resolution against the spec.

- [ ] **Step 3: Stitch the 20.50-second picture**

Copy the authoritative stitch template into `stitch-v2.swift`. V0 to V2 uses one zoom-through; V2 to `TRY V4.` uses a black breath; V4 to the invitation uses a black breath; the final 2.40 seconds are the end card. Use no dissolve or side push. Hold the final card without fading.

- [ ] **Step 4: Render and gate the Tier A score**

Create `score.json`, replacing only event-duck timestamps with measured final times:

```json
{
  "style": "apple-pulse",
  "duration": 20.5,
  "reveal": 12.1,
  "tier": "A",
  "overrides": { "bpm": 116, "sidechain": 0.30, "drumLevel": 0.62, "filterMax": 3000, "bellLead": 0.12, "subEntrance": -3, "padEntrance": -7, "arpEntrance": -6, "drumEntrance": -4 },
  "level_nodes": [[0.0,-16],[6.20,-18],[6.30,-50],[6.85,-17],[11.90,-17],[12.05,-34],[12.90,-18],[14.45,-50],[15.00,-18],[18.10,-48],[18.50,-20],[20.50,-20]],
  "build_nodes": [[0.0,0.45],[3.15,0.58],[6.30,0.68],[6.85,0.72],[12.10,1.0],[14.45,0.82],[18.10,0.70],[20.50,0.70]],
  "sfx": { "swells": [{"endAt":6.30,"dur":0.8,"peakDB":-24},{"endAt":14.45,"dur":0.8,"peakDB":-25}], "blooms": [], "ticks": [] },
  "seed": 1942,
  "loudnessTarget": -16.5,
  "leveler": 0.55
}
```

Compile `score-dsp.swift` plus `score-render.swift`, render `v2-score.m4a`, and gate it with:

```bash
MAX_CORR=0.98 MIN_RT60=0.30 MIN_RICHNESS=2498 LOUD_TARGET=-16.5 \
swift /Users/malik/Documents/Skills/product-film/scripts/probe.swift \
  projects/about-connect-film/artifacts/audio/v2-score.m4a
```

Expected: PASS, duration within 0.05 seconds, gated loudness within 1 dB of -16.5, correlation at or below 0.98, richness at or above 2498 Hz, and mono sum at or below 4.6 dB.

- [ ] **Step 5: Mix native sound over score and mux**

Assemble `v2-native.m4a`. The exact mix invocation is `mix-native-score projects/about-connect-film/artifacts/audio/v2-native.m4a projects/about-connect-film/artifacts/audio/v2-score.m4a projects/about-connect-film/edit-manifest.json projects/about-connect-film/artifacts/audio/v2-mix.m4a`. Apply score-only AVAudioMix ramps: 6 to 8 dB down around steps, 8 to 10 dB down around sends, 12 dB down from 0.10 seconds before fall through 0.80 seconds after brush, and near silence during cards/breaths. Never reduce the native stem. Audit the mix and mux against the untouched picture using authoritative `mux.swift`.

- [ ] **Step 6: Commit reproducible Version 2 sources**

Run JSON validation, Swift compile checks, and `git diff --check`; commit only `stitch-v2.swift`, `score.json`, `mix-native-score.swift`, and `text-overlay.swift` with `feat: build authored About Connect product film`.

---

### Task 6: Verify, Audit, and Deliver Both Films

**Files:**
- Create: `projects/about-connect-film/gap-audit-v1.md`
- Create: `projects/about-connect-film/gap-audit-v2.md`
- Generate: `projects/about-connect-film/artifacts/final/about-connect-screen.mp4`
- Generate: `projects/about-connect-film/artifacts/final/about-connect-product-film.mp4`
- Generate: `projects/about-connect-film/artifacts/final/*-contact-sheet.png`
- Generate: `projects/about-connect-film/artifacts/final/*-sha256.txt`

**Interfaces:**
- Consumes: both final muxed masters and the approved script.
- Produces: two evidence-verified MP4s and written audits.

- [ ] **Step 1: Run technical verification**

Verify Version 1 at 20.00 seconds and Version 2 at 20.50 seconds, each within 0.05 seconds; 2560 x 1440; 60 fps; H.264 High; one video track; one stereo AAC track; no black edge, browser chrome, floating card, duplicate pointer, or mid-animation splice; native energy at both sends and V4 fall/brush; and pixel-identical picture before and after mux at representative timestamps.

- [ ] **Step 2: Verify story and words from extracted frames**

Extract full-resolution frames at V0 top-out, V2 top-out, V4 final move, V4 falling, post-brush, Version 1 CTA, `TRY V4.`, and the Version 2 end card. Read every word against the spec. Generate contact sheets for pacing only.

- [ ] **Step 3: Write both mandatory gap audits**

Use only `MET`, `PARTIAL`, `CONTRADICTED`, `MISSING`, `DEVIATES`, or `CUT/CHANGED BY DIRECTION`. Grade hook, V0, V2, V4, native sound, and CTA from final evidence. Fix all editing gaps before delivery; name any capture gap and exact missing shot.

- [ ] **Step 4: Compute checksums and commit audits**

```bash
shasum -a 256 projects/about-connect-film/artifacts/final/about-connect-screen.mp4 > projects/about-connect-film/artifacts/final/about-connect-screen-sha256.txt
shasum -a 256 projects/about-connect-film/artifacts/final/about-connect-product-film.mp4 > projects/about-connect-film/artifacts/final/about-connect-product-film-sha256.txt
git diff --check
git add projects/about-connect-film/gap-audit-v1.md projects/about-connect-film/gap-audit-v2.md projects/about-connect-film/README.md
git commit -m "docs: verify About Connect social films"
```

Expected: only audits and README are committed; generated media stays ignored.

- [ ] **Step 5: Deliver the verified files**

Open both MP4s in Codex and report absolute paths, durations, technical properties, SHA-256 values, and audit verdict totals. Do not claim posting or platform playback QA.
