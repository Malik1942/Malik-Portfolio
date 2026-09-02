# RANGER 20-Second Twitter Film

**Story approval:** Approved by Malik on 2026-08-18

**Written-spec review:** This file is the approved chat script, written down.

**Pipeline:** `product-film` v1.1.1 at `/Users/malik/Documents/Skills/product-film` (clean `origin/main`, rev `93174868`).

**Goal:** Make a 20-second, image-first Twitter/X film from RANGER’s KeyShot stills and three cropped usage-board cells. The first three seconds must stop the scroll; the rest must prove the airbag idea and that the vehicle is a resolved object, then name it as a 2024 concept.

## Vibe and Energy

- **Feeling:** Fast Apple-hardware promo translated into RANGER: cold, underwater, precise, product-first.
- **Reference boundary:** Borrow only the high-level rhythm grammar — an immediate product-first hook, beat-locked close-up punches, bold contrast, elastic pacing, and confident negative space. Do not reproduce Apple’s shots, choreography, typography, or soundtrack.
- **Opening rule:** `ranger-hero.webp` owns the opening. No sentence, title, cursor, or interface explanation appears before 3.2 seconds.
- **Energy curve:** Begin fully awake on frame zero, punch at ~1.1s, duck through the title card, rebuild through launch, give the inflated bag the largest musical and visual payoff, sustain through machine macros, resolve on the end card.
- **Avoid:** Screen Studio / cursor grammar, browser chrome, floating cards, cross-dissolves, side-pushes, idle Ken Burns drift, fake inflation or thruster animation, sketches, labeled spec sheets, the cartoon shark and “NICE!”, implying the drone was built or tested, Apple pastiche, cheap EDM, trailer braams, vocals.

## Frame

- **Film:** RANGER — underwater drone concept.
- **Surface:** Portfolio stills in `src/assets/ranger-*.webp`, converted to CFR-60 holds. Not the live website.
- **Placement:** Twitter/X. Mute autoplay. Master is 16:9 (X’s landscape timeline), not 9:16.
- **Master:** 2560×1440, 16:9, 60 fps, exactly 20.0 seconds.
- **Presentation path:** Desktop full-bleed (`FILL=1`). Each still *is* the frame at every zoom; no floating card, shadow, rounded frame, browser chrome, or black margin may enter the image.
- **Pointer contract:** None. `CURSOR_STYLE=none`. No synthetic arrow, no recorded OS cursor, no click rings. Camera punches are the only interaction grammar. This is a project-local override of product-film’s click-cue law, locked at script time.
- **Voiceover:** None. The film must remain intelligible during silent autoplay.

## Capture grammar (stills path)

This film has no interactive product to record. Do **not** ScreenCaptureKit the case-study page.

1. Convert each source WebP to PNG with `sips` (not ffmpeg).
2. Write a CFR-60 H.264 hold with project `stillhold.swift`.
3. Apply usage-board crops in `stillhold` via `CROP=l,t,r,b` (source pixels).
4. Composite with `composite2.swift` `FILL=1 CURSOR_STYLE=none` and a camera plan. No `CUES`.
5. Stills are already CFR 60, so skip VFR `conform.swift` and `diffscan2.swift`. Verify by extracting frames, not by transition logs.

## Scene List

All timings are script targets. Final clip durations are the stitch table in the implementation plan, which must land on 20.000s.

### 1. Hook — 0.0–3.2s

- **Idea:** Show the product before explaining it.
- **Start:** `ranger-hero.webp` composed so the drone, the net, and the god rays are all legible.
- **Interaction:** None. A 0.25-second opacity rise from black; at approximately 1.1 seconds the camera punches sharply toward RANGER (upper-right of the still) on the first musical impact. Hold. Do not drift after the punch settles.
- **Payoff:** A machine hunting a net, before any words.
- **Data needed:** `ranger-hero.webp` (2400×1345).
- **Constraint:** No words, cursor, or UI. No other still in this window.

### 2. Title card — 3.2–5.0s

- **Idea:** Name the mechanism in one sentence, then prove it.
- **Start:** Black.
- **Interaction:** 0.1s black breath, 1.6s card, 0.1s black breath. Fast low-travel rise-and-fade (0.34s, −18px). No cursor.
- **Payoff:** The viewer knows what to watch for in the next three stills.
- **Exact words:**

```text
THE NET FLOATS ITSELF UP.
```

Layout may break the sentence across two lines (`THE NET FLOATS` / `ITSELF UP.`). Do not add, drop, or reorder words.

### 3. Launch — 5.0–6.8s

- **Idea:** RANGER fires a chamber through the mesh; it does not grab.
- **Start:** Usage-board **step 4 cell only** (bottom-left illustration), not the six-up sheet.
- **Interaction:** Arrive wide enough to read vehicle + canister + net; punch onto the canister in flight. Hold.
- **Payoff:** A chamber is leaving the hull toward the net.
- **Data needed:** `ranger-usage.webp` crop `CROP=134,852,1624,208` on the 2400×1455 source (keep x 134–776, y 852–1247).
- **Constraint:** No step caption, no other cells.

### 4. Inflate — 6.8–9.4s

- **Idea:** Once through the mesh, the bag cannot return. This is the film’s reveal.
- **Start:** Usage-board **step 5 cell only**.
- **Interaction:** Land already framed on the orange bag in the net. Hold still. No idle zoom.
- **Payoff:** An orange inflated bag is locked in the mesh; RANGER is not carrying the net.
- **Data needed:** `ranger-usage.webp` crop `CROP=861,852,897,208` (keep x 861–1503, y 852–1247).
- **Constraint:** Stable readable hold ≥2.0s after any incoming zoom-through.

### 5. Rise — 9.4–11.2s

- **Idea:** The net is going up; a boat can collect it.
- **Start:** Usage-board **step 6 cell, tightened** so the cartoon shark and the word `NICE!` are outside the frame.
- **Interaction:** Hold on the orange bag, the net, the upward arrow, and the surface/boat. No punch required if that crop is already the subject.
- **Payoff:** Buoyancy, not a gripper, is doing the lift.
- **Data needed:** `ranger-usage.webp` crop `CROP=1587,852,400,375` (keep x 1587–2000, y 852–1080). Verify on an extracted still before compositing; if shark/`NICE!` remains, tighten further and record the new crop in `shot-manifest.json`.
- **Constraint:** Shark silhouette and `NICE!` must not appear in any frame of the film.

### 6. Machine — 11.2–16.2s

- **Idea:** It is a resolved vehicle, not a diagram.
- **Start:** `ranger-front.webp` isolated on white.
- **Interaction:** Wide front (readable hull + thruster pods + gimbals), then zoom-through to `ranger-detail-pod.webp` (underside sensor bay), then zoom-through to `ranger-detail-thruster.webp` (vectoring pod). Each settled framing holds. No rotation, no fake gimbal spin.
- **Payoff:** Macro proof of a designed object.
- **Data needed:** `ranger-front.webp`, `ranger-detail-pod.webp`, `ranger-detail-thruster.webp`.
- **Constraint:** Do not show exploded labels, construct sheet, movement triptych, sketches, control UI, or Neptune Net.

### 7. End card — 16.2–20.0s

- **Idea:** Name the project honestly and give one destination.
- **Start:** 0.1s black breath, then the card. Hold the final frame. Do not fade out.
- **Interaction:** Same 0.34s / −18px entrance as the title card. No cursor. No logo file — typeset `RANGER` in General Sans Semibold.
- **Payoff:** Project name, concept status, URL.
- **Exact copy:**

```text
RANGER
UNDERWATER DRONE CONCEPT
SEE THE FULL CASE STUDY
malikzhang.com/project/ranger
```

- **Constraint:** The word `CONCEPT` is required. Do not imply a prototype, a test, or a shipping product.

## Words

### Opening

No copy before 3.2 seconds.

### Title card — exact copy

```text
THE NET FLOATS ITSELF UP.
```

### End card — exact copy

```text
RANGER
UNDERWATER DRONE CONCEPT
SEE THE FULL CASE STUDY
malikzhang.com/project/ranger
```

### Banned in-frame copy

`NICE!`, usage-board step captions, exploded-view leader labels, construct/movement sheet copy, any “built / tested / recovered N tons” claim.

## Brand

- **Typeface:** General Sans, matching the portfolio. Font files: `moodmuse-assets/fonts/GeneralSans-Semibold.ttf` (gitignored locally; do not commit the font). Never SF Pro.
- **Palette:** Near-black background `#090A0B`, white typography `#F4F5F5`, one accent sampled from the **inflated orange bag** in the step-5 crop. Do not guess the orange during scripting; sample it during implementation and store it in `brand.json`.
- **Wordmark:** There is no separate RANGER mark in the artwork. Typeset the four letters.
- **Motion:** Snap–settle punches. Camera moves only to a new readable subject, then holds. Cards: `ENTRANCE=0.34`, `RISE=-18`.
- **Cards:** Project copies of the Swift title-card and end-card templates, styled for RANGER.

## Sound

- **Tier:** Tier A, frame-locked, license-free. Required because the 1.1s punch, title-card duck, inflate reveal, and end-card resolve must hit exact frames.
- **Direction:** Underwater weight with Apple-hardware punch — cold, precise, kinetic. Not the calm 70 BPM piano `apple-promo` bed (that stalling a 20s punch cut).
- **Base contract:** Preset `cinematic-epic` at **96 BPM**, D minor. Preroll `subEntrance -3`, `padEntrance -7`, `arpEntrance -6` so the bed is fully formed on frame zero. `bellLead 0.14` from the reveal. `filterMax 4400`. Taiko hits at `reveal`. No synthwave 4-on-the-floor, no retro neon.
- **Originality boundary:** Evoke Apple-launch *energy*, not a recognizable Apple melody, drum pattern, or recording.
- **Opening:** Music starts fully formed. First major impact (bloom) at the ~1.1s camera punch.
- **Title card:** Deep duck (level ≈ −22 dB) across 3.2–4.8s; hall tail may ring in. That bleed is required.
- **Reveal:** `reveal` = inflate scene start on the measured stitch timeline (script target 6.8s). BUILD hits 1.0 there. Largest low-end hit.
- **Ticks:** Soft ticks on launch start and the two machine zoom-throughs. No ticks on hook, title, or end card.
- **End:** Strip during the 0.1s breath; branded resolve on the card; sustain while the final frame holds. Do not fade out.
- **Avoid:** Apple melody cribs, cheap EDM, trailer braams, spa ambience, vocals, watermarked stock.
- **Implementation:** Write `score.json` only after the picture timeline is measured. Gate with `probe.swift` before muxing.

## Transition grammar

- Hook opens with a 0.25s fade-up from black, implemented as the first stitch instruction (product-film `F` is a *between-clip* fade, not an opening rise).
- Title card and end card are bounded by `B` breaths with **FADE=0.18** (the template default 0.5s is too slow for 20s) and `dur: 0.1`.
- Launch → inflate → rise → front → pod → thruster use beat-locked `Z` zoom-throughs at **0.50s**.
- No hard cuts, cross-dissolves, or side-pushes.

## Stitch duration contract

Clips and transitions must satisfy:

```
sum(clip durations) − sum(Z durations) + sum(B durations) = 20.000
```

Locked table (seconds):

| Clip | Duration |
|---|---|
| 01-hook | 3.10 |
| 02-title | 1.60 |
| 03-launch | 2.10 |
| 04-inflate | 3.10 |
| 05-rise | 2.10 |
| 06-front | 2.20 |
| 07-pod | 2.20 |
| 08-thruster | 2.10 |
| 09-end | 3.70 |

Transitions in order: `B 0.10`, `B 0.10`, `Z 0.50` × 5, `B 0.10`.

Resulting scene starts: hook 0.00, title 3.20, launch 4.90, inflate 6.50, rise 9.10, front 10.70, pod 12.40, thruster 14.10, end 16.30.

If a clip must change, adjust only a static hold. Do not retime a punch window or a card entrance.

## Honesty

RANGER was never physically prototyped. The film may not imply a working vehicle, a tank test, a recovery count, or a shipping product. `CONCEPT` on the end card is the only required honesty line; the first 16s stay product-first.

## Out of picture

`ranger-sketches.webp`, `ranger-airbag-research.webp` (full board), `ranger-exploded.webp`, `ranger-construct.webp`, `ranger-movement.webp`, `ranger-control.webp`, `ranger-platform.webp`, `ranger-detail-charge.webp`, `ranger-detail-gimbal.webp` (pod already covers the underside), the six-up usage sheet, any live webpage chrome.

## Acceptance and verification

- Final duration is 20.0 seconds at 60 fps, 2560×1440, H.264 + AAC stereo.
- The first 3.2 seconds contain no words or cursor.
- No pointer appears in any frame.
- The page-or-still fills every frame; no black margins, cards, or chrome.
- Shark and `NICE!` are absent from every frame.
- Inflate payoff remains readable ≥2.0s.
- Title-card and end-card copy match the Words block at full resolution (contact-sheet type is too small to trust).
- End card includes `CONCEPT`.
- Camera punches, inflate reveal, and end-card resolve are named events in the frame-locked score.
- Score passes duration, loudness (−16.5 dB ±1.0), correlation, richness (≥2498), RT60, and mono-sum (≤4.6 dB) gates.
- Deliver the final MP4 with a scene-by-scene gap audit graded MET / PARTIAL / CONTRADICTED / MISSING / DEVIATES from extracted frames.

## Deliverables

- X master: `projects/ranger-film/artifacts/final/ranger-twitter-20s.mp4`
- Gap audit: `projects/ranger-film/gap-audit.md`
- Website copy of the same master + a 1.1s poster, embedded at the start of the RANGER Intro (`[[fig:0]]`), matching Inkwork’s film figure.
