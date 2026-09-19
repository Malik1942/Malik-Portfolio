# Locant case study: first draft

Date: 2026-09-17
Branch: `am/locant-case-study-draft-06cca2` (branch only; nothing merges to main in this piece of work)
Files in scope: `src/data/projectDetails.ts` (a new `locant` document), `src/components/project-detail/LocantModules.tsx` (new), `src/components/project-detail/ProjectDetailTemplate.tsx` (module registry only), `src/assets/locant-*` (new stills and clips).

## What this is

Locant has sat in Selected Work since 2026-09-16 as the one card that leaves the site: it opens locant.malikzhang.com, because the product page already told the product story. Malik now wants a case study drafted for it, modelled on the other case studies (NeuraLyfe named), and **not connected to the card yet**.

The product site answers *what Locant does*. The case study answers what the site does not: *why it exists, what was decided and why, and how it was built*. It follows the spine of Malik's own Palantir pitch (`~/Documents/Deixis/docs/video/01-full-script.md`): frustration, the landscape, the decisions, what fought back, the build, the product, the measurement.

## Decisions taken

| Decision | Choice |
| --- | --- |
| Spine | The pitch's: why, the problem, landscape, decisions, build, final design, measured, reflection |
| Weight | NeuraLyfe's: nine sections, every one with a `headline` that is a claim |
| Trim | Direction (sketches, principles) folds into Decisions. The Problem stays its own section (Malik reversed that half of the trim) |
| The problem's framing | The cost was cognitive: attention spent describing *which* element and getting the agent to understand *what* should change, instead of on the change. Locant splits the two: a click says which, the note says what. Intro and Problem are both written around that split |
| Palantir | Named, as the product site's ribbon already does: "Made for Palantir's Product Design Show & Tell" |
| Pitch film | Linked out, not embedded. Its voice-over script says "I build my own apps alone" and "I'm the only author", which the no-solo rule keeps out of copy. The button appears once Malik supplies the URL |
| Visibility | `/project/locant` exists on this branch only. The card keeps `destination: { kind: "external" }`; `projects.ts`, NextUp, the sitemap rules and main are untouched |
| Metrics | Nothing invented. Every number is Malik's published measurement or a git timestamp |

## Evidence base

Every claim traces to one of these. Nothing else is stated as fact.

- `~/Documents/Deixis/README.md`, `docs/PRD.md` (v0.5, Sep 13), `docs/brand.md`, `specs/v0.1.md` to `specs/v0.8.md`.
- `docs/video/01-full-script.md` and `04-voiceover.md`: Malik's own lines. Quotable in his voice with the no-solo edit.
- `docs/video/10-measurement-v3.md`: the measurement. 30 runs, Claude Code 2.1.272, `claude-opus-5` at medium effort.
- `~/Desktop/locant-film/v4/measure/v3/run-claude-opus-5-nobuild-shot-1.jsonl`: the agent's verbatim reply to the screenshot and the note, quoted in the Problem section.
- `site/index.html` and `site/assets/`: the product site's copy and its real captures.
- Git: first commit 2026-09-13 15:37; tags v0.1 17:07, v0.2-region 17:17, v0.3 17:45, v0.3-actions 17:58, v0.4 18:08 (all Sep 13), v0.5 Sep 14 16:25, v0.6 18:58, v0.6.1 19:16, v0.7 23:13 (the rename: "the first build named Locant"), v0.7.1 Sep 15 00:21, v0.7.2 13:18, v0.7.3 Sep 16 16:47, v0.8 19:23. 213 commits over four days.
- Build recording `~/Movies/2026-09-13 15-24-58.mov` and its cuts in `~/Desktop/locant-film/v4/build/`: the menu-bar timer reads "Design Challenge: -2:59:57" at 15:27 over the Claude Design canvas, and "-1:42:55" when the first Oryne orb capture returns "No element information available".
- Oryne repo `~/Documents/inspire-ocean`: `bafa7df` 2026-09-13 17:02, "Ocean: expose orbs to accessibility through SwiftUI overlays with identifiers".
- Whiteboard photos `docs/sketch-01..03.HEIC`, taken 14:58 to 15:24 on Sep 13, before the first commit.

## The nine sections

Copy below is the draft direction. Leads and closes are written in Malik's voice from the pitch. Final wording is tuned in the browser against the orphan rule.

### 1. Intro
- id `intro` · Label `Intro` · Headline: **A click says which element. The note says what to change.**
- `showProjectMeta: true`.
- Lead (bold): Locant is a free, open-source Mac app for pointing a coding agent at the exact element you mean. Click it in any app, type what should change, and the agent gets the element itself: its identifier, its frame, its place in the tree, and a crop.
- Why, in one paragraph, on the cognitive load: I design and build my own apps end to end, and a coding agent does most of the typing. Seeing what was wrong took a second. Describing it took the rest: which screen, which component, where it sits in the tree, and then the change itself, in words the agent would read the way I meant them. That attention went into translation, not design.
- Context: made for Palantir's Product Design Show & Tell. Versions 0.1 to 0.4 were built inside the three-hour window, timer running; four days later it was at 0.8, signed, notarized, public on GitHub, and an MCP server as well.
- Role line: designed and built end to end, from a spec for every version to the overlay, the ball, the site, and the measurement.
- Meta cards: **Role** 0→1 Product Designer & Builder · **Timeline** 3 Hours to v0.4 / 4 Days to v0.8, Sep 13 to 16, 2026 · **Made For** Palantir Product Design Show & Tell · **Tools** Swift 6 · AppKit + SwiftUI / Claude Design · Claude Code · **Output** Free and Open Source · v0.8 / Signed, Notarized · MCP Server.

### 2. Highlights
- id `highlights` · Headline: **One capture, and the agent goes straight to the right file** (changed while planning: the loop takes about 20 s from ball to paste because it tours the hover labels, so "three seconds" would contradict its own clip)
- Figure 0: the loop clip (ball wakes, overlay dims, hover on the orb shows `button · oceanCurrent.product ideas`, note, toast, paste into Cursor, the agent edits).
- `locant-highlights`: four chips. Identifier, not pixels · Any Mac app, any agent · Asked which element: 0 of 12 · v0.1 to v0.4 in three hours.

### 3. The Problem
- id `problem` · Label `The Problem` · Headline: **Every fix needed two descriptions, and the first ate the second**
- Lead: UI polish starts as something seen, a button that should be rounder, a card that needs room. A coding agent works in text and code. Every fix meant translating one into the other, and the translation was mine to do.
- The two descriptions: first *which* element (which screen, which component, where it sits in the tree, in names the agent could match to the code), then *what* should change. The first kept eating the second. By the time I had written which button, I had lost what I was actually going to say about it. When the agent still read it differently, it opened the wrong file and I described it again.
- A screenshot does not remove the work; it hands the first half to the agent, which then has to work out which view drew those pixels.
- `locant-question`: the agent's verbatim reply from v3 screenshot run 1, excerpted with an ellipsis and nothing reworded: "I haven't changed anything yet, because the screenshot doesn't show which orb you mean. … Which orb should get them?" Attribution line: Claude Code on Opus 5, given a crop of the phone and the same note, Sep 15, 2026. Styled as a quoted reply on the inset surface, not a chat mockup.
- Close (bold): It understood the change, down to the mechanism. It could not know which orb. Pointing is how people resolve "this", so that is the half Locant takes.

### 4. Landscape
- id `landscape` · Label `Landscape` · Headline: **Web tools point at elements. Mac tools send the window.**
- Lead: as of September 2026, tools that hand a screen to a coding agent split three ways, and none let a person point at one element in a native app and give it to any agent.
- `locant-landscape`: a rival grid on the Oryne competitive pattern. Columns: Who points · What the agent gets · Where it goes · Where it works. Rows, from PRD Appendix A:
  - Codex Appshots, Claude Desktop quick entry: you · the whole window · one agent · any Mac app
  - Agentation, Stagewise, Cursor Design Mode: you · the element (DOM) · clipboard or their own agent · web pages only
  - Peekaboo, Xcode 27 Device Hub: the agent · the element (accessibility tree) · MCP · Mac, Simulator
  - CleanShot X, Shottr: you · pixels · clipboard, file · any Mac app
  - **Locant** (highlighted row): you · the element, with your note · clipboard and MCP, any agent · any Mac app, the Simulator, web pages
- Close (bold): Appshots gives your agent the window. Locant gives it the element. Then the three things the research changed before any code (spec v0.1 §0): no window capture; text plus an image path, because MCP image blocks were unreliable across agents; field names with no AX prefix, so another platform could write the same shape.

### 5. Decisions
- id `decisions` · Label `Decisions` · Headline: **A pixel is a guess. An identifier can be grepped.**
- Direction first (folded in): the feel in one line from PRD §6.0 (something macOS grew, in the family of ⌘⇧4's crosshair, Live Text and Spotlight), the three principles as `·` bullets (Borrow, don't brand · Nothing lingers · Quiet until approached), then two figures:
  - Figure 0: whiteboard sketch (`sketch-02`), captioned. The ball at rest and docked, and a six-segment ring that opened on hover.
  - Figure 1: the Claude Design canvas with the overlay states, drawn before any code (build-canvas frame, timer visible).
- `## The accessibility tree, not the pixels`: every native app already carries a role, a label, and often the identifier the code uses. Plain Markdown, image path first, because terminal agents get only text on paste.
  - `locant-overlay`: the four real overlay captures, 2×2 (Hover `button · Eight` · Option steps to `group · CalculatorKeypadView` · Drag lists every element in the frame · Note).
  - `locant-payload`: the exact payload pasted in every Locant run of the measurement (`measure/locant-payload.md`), verbatim in mono.
- `## A ladder when there is no element`: SpriteKit, Canvas and Metal draw pixels nobody named, so a capture steps down and says which rung it reached. `locant-ladder`: five rungs (identifier, label only, drawn frame, text and neighbors, image) on the NeuraLyfe protocol pattern. Close: the agent always gets something to grep, or an honest null.
- `## One gesture instead of a screenshot tool`: it had to replace the screenshot tool or the polishing would keep switching apps. Snap, Text, Color, Cut on the same gesture, and the one rule for disk: an action that makes an image keeps a file for 30 days; text or a value keeps nothing.
- `## A ball that wakes when you reach for it`: a hotkey is invisible and the menu bar is far. `locant-ball`: the four real ball states (Docked, Awake, Ready, The ring). The iteration from the sketch: hover-to-expand was rejected because it collided with edge docking and opened by accident; it shipped as press and hold with four segments at the cardinal directions, and Settings moved to the menu bar as "not ring material".

### 6. Build
- id `build` · Label `Build` · Headline: **Four versions inside the three-hour window**
- Lead: AI came in everywhere except the decisions. One spec per version, written with Claude; the Swift by Claude Code; the overlay drawn in Claude Design first.
- `locant-releases`: two groups. *Inside the window, Sep 13*: v0.1 17:07 the pointing flow · v0.2-region 17:17 the ladder · v0.3 17:45 usable by someone else (mode inferred, Settings, the ball) · v0.3-actions 17:58 Snap, Text, Color, Cut and the ring · v0.4 18:08 before and after. *After it*: v0.5 the first minute (no tour; hints that appear once and fade) · v0.6 a download that works · v0.7 renamed Locant · v0.7.1 the agent fetches it (MCP inside the app) · v0.8 web handles and Shift for several elements.
- `## What fought back`: at 1:42 left, the first capture of Oryne's orbs came back "No element information available". The ladder came out of that, and so did an Oryne fix at 17:02 exposing the orbs to accessibility with identifiers. Second: Locant must never see itself, so every capture filters its own windows out. Figure 0: the null-element frame from the build recording.
- The MCP reversal, one paragraph: the PRD planned a TypeScript package run with `npx`; v0.7.1 put the server inside the app, started with `--mcp`, because the sidecars live on the Mac, the app is already signed and updated, and no Node is required.
- Close: I used Locant to build Locant. Figure 1: the build-v04-timer frame, the agent reading a Locant capture of Locant's own overlay, included only if it reads at column width; otherwise the line stands alone.

### 7. Final Design
- id `final-design` · Label `Final Design` · Headline: **One element, from pointed at to verified**
- Captioned clips, each `Label: one clause`:
  - Hover: the label says what the agent will get before you click (Calculator, a CalmMouse slider with no identifier, the orb; then a web page)
  - Any agent: the same payload pasted into Codex and into Claude Code. One paragraph on MCP: connect in Settings › Agents, say "fix what I just pointed at", and the agent fetches it.
  - Before & After: the same element found again after the rebuild, with the diff beneath
  - The ring: hold the ball, release on Color, pick a value
  - Settings (still, dark): the one place Locant is a window, built from system controls only
- Close (bold): point, note, paste, see what changed. Nothing waits for you, and the only window is Settings.

### 8. Measured
- id `measured` · Label `Measured` · Headline: **What Locant saves is the question**
- Lead: same fix, same model, same repo, same note; the only difference is what gets pasted (a ⌘⇧4 crop of the phone, or one Locant capture of the orb). The method in one sentence.
- `locant-measured`: four tiles on the NeuraLyfe impact pattern, each a before and after pair. Asked which orb: 17 of 18 → 0 of 12 · Time to the edit, median without a build: 39 s → 22 s · Session tokens, median without a build: 312k → 253k · Correct edit: 30 of 30. Under the tiles, the caveat line: one task, one app, one model.
- Figure 0: the site's comparison figure (`measured-comparison.png`).
- Close (bold): Locant does not make the agent smarter. It removes the one thing the agent could not know from pixels.
- `locant-links`: Visit locant.malikzhang.com (primary pill) · View on GitHub (secondary) · Watch the film (secondary, only once the URL exists).

### 9. Reflection
- id `reflection` · Label `Reflection` · Headline: **Every payload has two readers**
- The person who points and the model that reads. The overlay label tells the person what the agent will get before the click; the image path leads because the model on the other end only sees text.
- `## Honest by default`: the ladder names its rung; the agent table says "untested" until someone tests it; when the update check broke "no network calls", every sentence that promised it was rewritten to say what was true instead (spec v0.6).
- `## What I would do next`: **owed by Malik.** Until he answers, only documented facts: Safari exposes the same web attributes and is untested; the schema has no AX prefix, so another platform could write the same shape.

## Modules (`LocantModules.tsx`)

Built from the existing primitives (`ModuleCard`, `CardGrid`, `Chips` from MotiModules; `FigureCaption`; `noOrphan`; `Button`). Class names stay on the design system (the boundary test scans this file). Every image module reserves its box with width and height so nothing reflows.

| Key | Content | Pattern it borrows |
| --- | --- | --- |
| `locant-highlights` | Four chips | NeuraLyfe highlights |
| `locant-question` | The agent's verbatim question, with its attribution line | `PullQuote` on a `ModuleCard` |
| `locant-landscape` | Rival grid, Locant row highlighted | `OryneCompetitive` |
| `locant-overlay` | 2×2 real overlay captures with `Label: clause` captions | Oryne pair grid |
| `locant-payload` | The measurement payload in mono on the inset surface | `ModuleCard` |
| `locant-ladder` | Five rungs, stacking below `sm` | `NeuraLyfeProtocol` |
| `locant-ball` | Four ball states, 4 across from `md`, 2 below | `CardGrid` cell |
| `locant-releases` | Two groups of tag, time, one-line scope | Moti build journey |
| `locant-measured` | Four before/after tiles and a caveat line | `NeuraLyfeImpact` |
| `locant-links` | Website, GitHub, film (URL-gated) | `NeuraLyfeLinks` |

## Assets

All derived from Malik's own files. Stills become WebP; clips become H.264 MP4, yuv420p, `tv` range, bt709 tags (see the card-reel colour note), 1920×1080. Frame rate stays at 60 where the cursor moves on screen, and drops to 30 only if a clip exceeds its budget. Budget: each clip ≤ 4 MB, all clips together ≤ 15 MB (NeuraLyfe's four total about 13 MB).

| Output | Source |
| --- | --- |
| `locant-hero.webp` | A frame from `v4/sceneA-comp.mp4` or `v4/sceneD-comp.mp4`, picked with Malik from a side-by-side against the card cover so the same picture is not used twice |
| `locant-loop.mp4` + poster | `v4/sceneA-comp.mp4`, trimmed to ball → paste → edit |
| `locant-hover.mp4` | `v4/sceneD-comp.mp4` + `v4/sceneD2-comp.mp4` |
| `locant-agents.mp4` | `v4/sceneE1-comp.mp4` + `v4/sceneE2-comp.mp4` |
| `locant-verify.mp4` | `v4/sceneB-comp.mp4` |
| `locant-ring.mp4` | `v4/sceneC-comp.mp4` |
| `locant-sketch.webp` | `docs/sketch-02.HEIC`, cropped to the drawing |
| `locant-canvas.webp` | `v4/build/build-canvas.mp4` frame |
| `locant-null-element.webp` | `v4/build/build-null-element.mp4` frame |
| `locant-dogfood.webp` (optional) | `v4/build/build-v04-timer.mp4` frame |
| `locant-overlay-{hover,option,drag,note}.webp` | `site/assets/overlay-*.jpg` |
| `locant-ball-{docked,awake,ready,ring}.webp` | `site/assets/ball-*.png` |
| `locant-settings.webp` | `site/assets/settings-dark.png` |
| `locant-measured.webp` | `site/assets/measured-comparison.png` |

## Registration

- `projectDetails.ts`: import the assets, add the `locant` document, list it in `SOURCES` after `oryne` (homepage order).
- `ProjectDetailTemplate.tsx`: register the ten module keys in `INLINE_MODULES`.
- Consequences, accepted for a branch-only draft: `/project/locant` is prerendered and listed in this branch's sitemap, the route test covers it, and its share image falls back to the site-wide one with a build warning until `public/og/locant.jpg` is generated at wiring time.
- Not touched: `src/data/projects.ts` (the card stays external), `NextUp`, `public/og`, main.

## Copy rules

No clause-breaking dashes. No "solo", "alone", "by myself" (the pitch's "I build my own apps alone" becomes "I design and build my own apps end to end"). No line ending on a single word, checked at desktop and 375 px. No meta headers. Sentence-case headlines. Verified facts only; "Palantir" appears only as the site already uses it, and nothing is said about the outcome of the Show & Tell.

## Verification

- `npm test` (runs the typecheck and the design-system boundary test) and `npm run build`, both green.
- Preview on a strict-port dev server; Playwright (`domcontentloaded`, wheel scroll, `img.decode()`) captures every section at 1440×900 and 375×812.
- A script measures every headline, caption and bold close for a lone last word at both widths.
- The homepage Locant card still opens `https://locant.malikzhang.com` (a test already asserts its outbound arrow and accessible name).
- The console is clean on `/project/locant`.

## Owed by Malik

1. The film URL (the Links row ships without the film button until then).
2. What comes next (Reflection's last subsection stays on documented facts until then).
3. The hero pick from the side-by-side.
4. A read of the copy, especially Reflection, which is the least directly sourced section.

## Changes made while planning

- Problem gains its own clip: scene G, the orb described by hand in Cursor's chat, cut at 9.95 s before the change is typed.
- Build gains two figures: the self-exclusion clip (scene F) and the build-recording frame of the "product first, MCP later" call at 1:12:55 left. The dogfood frame is dropped: its capture is too small to read at column width.
- The payload module shows capture `20260915-021609-zwec`, the one pasted in the loop, taken from Locant's own `get_capture`.
- Six meta cards instead of five (a two-column grid leaves an odd card alone): Scope is added.
- The Final Design close no longer says Settings is the only window: Before & After and Help are windows too.

## Revision after the first review (2026-09-17)

Malik asked why the hero was a still, and for the Highlights section to carry more images than one video.

- **Hero is a reel.** A still can only show what the pointing left behind, and the pointing is the product. `locant-hero-loop.mp4`: one continuous take from scene A, 13.1 s to 23.25 s (the orb outlined with `button · oceanCurrent.product ideas` under the cursor, the click, "What should change?", the note typed, "Copied"), no camera move, cropped `1792x1008` at `(0, 420)` so the orb, the label and the note sit in the upper half, which is what shows above the fold at 1440x900. Its last half second dissolves into its first, so the loop has no seam. `locant-hero.webp` is its first frame: the poster, so nothing swaps on play, and the reduced-motion still.
- **Highlights splits the story with the hero.** The clip now starts at the paste (`locant-agent.mp4`, scene A 27.0 s to 39.0 s: the payload in Cursor, the agent's first move, the diff in `SeedScreenshot.swift`), which is exactly what the headline claims. Under the chips, a 2x2 gallery of 4:3 stills carries the rest of the product: Any agent (Claude Code, scene E2), Before & After (scene B), The ring and Color (scene C). The old full-loop clip `locant-loop.mp4` is gone.
- Decisions now says "the capture in the clips above", since the capture is taken in the hero and pasted in Highlights.
- **The four gallery tiles loop (Malik: "make each of them a little gif showing the short core interaction").** MP4, not GIF: 1200x900 at 60 fps, 580 KB for all four, where GIFs would run to megabytes with banded colour. Each loops the one interaction it names: Claude Code (paste, send, Stewing; the static paste hold at 2x), Before & After (Flip: after, before, after), the ring (hold, unfold, release on Color), Color (magnifier on the card, click, Copied). Each file opens on its most telling frame, which is also its poster and the reduced-motion still, and the single 0.4 s dissolve sits where the take resets. Tiles fetch within a screen of the viewport, play only while on screen, and never show controls.
- **"Any agent" shows three agents, not one terminal (Malik: a single Claude Code terminal "shows nothing about the info").** `locant-tile-agent.mp4` is three takes in one frame on one clock: Cursor (scene A) tall on the left, where the pasted payload stays legible at tile size, and Claude Code (E2) and Codex (E1) stacked on the right, recognisable by their own chrome. All three paste and send the same payload together; the paste-to-send hold plays at 2x. It opens one second after the send, on Cursor's "I'll start from the Locant capture you pointed at", and the dissolve to the empty prompts finishes before the paste. Three rather than the four Malik suggested: Cursor, Claude Code and Codex are the agents the product site lists as verified and the only ones ever recorded taking a capture; Gemini CLI and Antigravity are untested, and showing them would claim a test that never happened. Built by `agents_tile.py` (session scratchpad, not in the repo).
