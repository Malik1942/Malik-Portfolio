# ZEAT 30-Second Twitter Film

**Story approval:** Approved by Malik on 2026-08-18

**Written-spec review:** Pending

**Pipeline:** `product-film` v1.1.1

**Goal:** Make a 30-second, image-first Twitter film from the live ZEAT portfolio case study. The first three seconds must stop the scroll; the remaining film must quickly prove what the robot does and that it became a physical model.

## Vibe and Energy

- **Feeling:** Energetic, technical, premium, confident.
- **Opening rule:** The stadium rendering owns the opening. No sentence, title, cursor, or interface explanation appears before 3.2 seconds.
- **Energy curve:** Immediate visual and musical hook, escalating mechanism reveals, then the largest musical moment on the physical prototype.
- **Avoid:** Cheap EDM, retro-neon styling, corporate trailer music, vocals, excessive text, frantic scrolling, fake mechanism animation, idle camera drift, cross-dissolves, and side-push transitions.

## Frame

- **Film:** ZEAT — Stadium Cleaning Robot.
- **Surface:** Live desktop website at `https://www.malikzhang.com/project/zeat`.
- **Placement:** Twitter/X.
- **Master:** 2560×1440, 16:9, 60 fps, exactly 30.0 seconds.
- **Presentation path:** Desktop full-bleed (`FILL=1`). The website fills the canvas at every zoom level; no floating browser card, shadow, rounded frame, browser chrome, or black margin may enter the image.
- **Pointer contract:** Synthetic black arrow with white outline and click ring. Capture footage contains no recorded pointer. The opening scene contains no pointer.
- **Voiceover:** None. The film must remain intelligible during silent autoplay.

## Scene List

All timings are script targets. Capture latency and final trim points are measured from conformed footage before editing.

### 1. Stadium Rendering Hook — 0.0–3.2s

- **Idea:** Show the product before explaining it.
- **Start:** The page is pre-positioned on `zeat-in-context.webp`, composed so the stadium seats, discarded cups and bottles, and ZEAT are all legible.
- **Interaction:** None. A 0.3-second exposure rise brings the image to full brightness; at approximately 1.1 seconds, the camera punches sharply toward ZEAT on the first musical impact.
- **Payoff:** The viewer immediately sees a robot working among stadium seats and trash.
- **Data needed:** `zeat-in-context.webp`; no copy or overlay.
- **Constraint:** No words, cursor, or UI explanation before the scene ends.

### 2. Floors and Seats — 3.2–6.0s

- **Idea:** ZEAT addresses trash on both the aisle and the seats.
- **Start:** The same stadium rendering sits inside the live case-study page with its caption available to read.
- **Interaction:** The cursor clicks the rendering; the image expands. The camera reframes the floor intake, seat trash, and raised arm as one composition.
- **Payoff:** The frame proves ZEAT is not an ordinary floor-cleaning machine.
- **Data needed:** `zeat-in-context.webp` and the existing caption, “Working the rows — floor, seats, and everything wedged between.”
- **Constraint:** Do not show the Highlights chip “Crosses grandstand steps.” The film contains no stair-crossing imagery or claim.

### 3. Arm Pickup and Dedicated Intake — 6.0–10.6s

- **Idea:** Trash left on seats follows a separate arm-to-intake path.
- **Start:** Begin on the stadium rendering framed around seat trash and the raised arm.
- **Interaction:** Zoom-through to `zeat-arm.webp`; the cursor click reveals the arm and open “Garbage Inlet.” The camera travels from the gripper toward the inlet, then zoom-throughs to `zeat-intake.webp` and holds on the dedicated top opening.
- **Payoff:** ZEAT reaches trash on seats with a folding arm and drops it through a dedicated upper intake.
- **Data needed:** `zeat-arm.webp`, `zeat-intake.webp`, and the seat-trash context in `zeat-in-context.webp`.
- **Constraint:** Do not animate the arm or fabricate a pickup action. The real static renders communicate seat → arm → intake through framing and sequence.

### 4. Collection and Compaction — 10.6–14.3s

- **Idea:** The body is organized around moving oversized event trash into a large central collection volume.
- **Start:** The structure rendering is visible in the Final Design section.
- **Interaction:** The cursor clicks `zeat-structure.webp`; the expanded image is framed first on the front intake path, then on the central volume and internal roller. A measured follow-pan connects those subjects.
- **Payoff:** The viewer can read where cups and boxes enter, where they are compacted, and why the center of the machine remains open for collection.
- **Data needed:** `zeat-structure.webp`; use `zeat-underbody.webp` only if its roller and conveyor remain readable within the allotted time.
- **Constraint:** This scene precedes the turning scene.

### 5. 360° Tight-Space Turn — 14.3–17.9s

- **Idea:** ZEAT can reverse direction inside an aisle it nearly fills.
- **Start:** `zeat-turn.webp` is visible inside the Final Design section.
- **Interaction:** The cursor clicks the figure; it expands. The camera follows the red circular arrows across the ghosted rotation states and lands on the four independently driven wheels.
- **Payoff:** The nearly one-meter-long robot rotates in place within its own footprint.
- **Data needed:** `zeat-turn.webp` and the existing supporting copy: “Four wheels, four motors: the body rotates in place.”
- **Constraint:** Describe this as in-place rotation or a 360° tight-space turn, not stair crossing.

### 6. Service and Fleet Operation — 17.9–21.7s

- **Idea:** ZEAT is designed for repeated fleet operation, not a single isolated cleaning pass.
- **Start:** The System section is positioned on `zeat-service-topdown.webp` and the headline “One Robot Is a Gadget. A Fleet Is Infrastructure.”
- **Interaction:** The cursor clicks the service rendering; the camera frames the dust bag, battery, garbage inlet, and rear status display together.
- **Payoff:** The service layout supports fast turnaround, while the page copy establishes dispatched fleet operation and reporting.
- **Data needed:** `zeat-service-topdown.webp` and the live System-section copy.

### 7. Built, Not Just Rendered — 21.7–26.4s

- **Idea:** End the product story with physical proof.
- **Start:** The finished-model image is visible in the Built subsection.
- **Interaction:** The cursor clicks `zeat-prototype.webp`; the physical model expands on the largest musical reveal. A final zoom-through lands on `zeat-prototype-booth.webp`.
- **Payoff:** ZEAT became a fabricated, hand-finished, painted, and assembled physical model shown in an exhibition setting.
- **Data needed:** `zeat-prototype.webp` and `zeat-prototype-booth.webp`.
- **Constraint:** This is the longest physical-proof payoff and the music’s largest moment.

### 8. End Card — 26.4–30.0s

- **Idea:** Name the project and give one direct destination.
- **Start:** A brief black breath separates the live website from the card.
- **Interaction:** Fast, low-travel rise-and-fade entrance; no cursor.
- **Payoff:** The viewer leaves with the project name and case-study URL.
- **Data needed:** ZEAT wordmark extracted from the project artwork; General Sans font files; cyan sampled from the robot light strip.
- **Constraint:** Hold the final frame. Do not fade out.

## Words

### Opening

No copy before 3.2 seconds.

### Mid-film

No standalone title cards. The live website’s existing captions, headings, and supporting copy carry the story. No stair-crossing wording may be visible in the selected crops.

### End card — exact copy

```text
ZEAT
STADIUM CLEANING ROBOT
SEE THE FULL CASE STUDY
malikzhang.com/project/zeat
```

## Brand

- **Typeface:** General Sans, matching the portfolio.
- **Palette:** Near-black background, white typography, one cyan accent sampled directly from ZEAT’s light strip. Do not guess the cyan value during scripting; sample it from the source render during implementation.
- **Wordmark:** Extract the real ZEAT mark from the project artwork rather than recreating it in a substitute typeface.
- **Motion:** Fast and controlled. Camera moves only to reveal a readable mechanism or relationship.
- **Cards:** Programmatic Swift end card, styled for ZEAT. No mid-film cards.

## Sound

- **Tier:** Tier A, frame-locked and license-free. It is preferred over ACE-Step for this cut because the 1.1-second opening punch, visible clicks, scene reveals, and prototype drop must hit exact frames.
- **Direction:** Energetic but premium; technical and optimistic.
- **Base contract:** Refined `synthwave` arrangement at approximately 108 BPM, with a controlled kick, softened snare, syncopated low end, warm FM accents, restrained mechanical ticks, and no vocals.
- **Opening:** Music begins immediately. The first impact lands on the approximately 1.1-second camera punch.
- **Arm scene:** Three related accents mark seat → arm → intake.
- **Build:** Collection/compaction precedes and feeds the 360° turn; the arrangement continues rising through service.
- **Reveal:** The largest drop lands on the physical prototype at approximately 21.7 seconds.
- **End:** Music ducks under the end card and resolves without a fade-out.
- **Avoid:** Retro-neon character, aggressive 16th-note hats, trailer braams, spa ambience, cheap corporate uplift, watermarked audio, and stock previews.
- **Implementation:** Write the final `score.json` only after the picture timeline has been measured. Run the mandatory `probe.swift` gate before muxing.

## Transition and Capture Grammar

- Opening uses a fast fade-up from black; every within-act boundary uses a zoom-through.
- The end card receives a short black breath.
- Every feature reveal after the opening has a visible cursor → press → ring cue before the website response.
- The synthetic cursor uses one consistent style and size in every scene.
- ScreenCaptureKit is the only capture path. Conform every take to CFR 60 before measuring or trimming.
- Frame-scan and run `diffscan2.swift` before choosing any splice boundary.
- Never splice onto the first moving frame of a website animation.

## Acceptance and Verification

- Final duration is 30.0 seconds at 60 fps.
- The first 3.2 seconds contain no words or cursor.
- No stair-crossing image, wireframe, chip, heading, or claim appears.
- Collection and compaction appear before the 360° turn.
- The arm sequence visibly communicates seat → arm → intake using the approved real assets.
- Every click target is measured from the control geometry, not from a redraw centroid.
- The website fills every frame with no black margins, browser chrome, floating-card treatment, or duplicated pointer.
- Every payoff remains readable for at least two seconds.
- Extract and inspect frames at every reveal, click, transition, and card.
- Read the full-resolution end card against the exact Words block.
- The score passes duration, loudness, correlation, richness, and mono-sum gates.
- Deliver the final MP4 with a scene-by-scene gap audit graded against this script.
