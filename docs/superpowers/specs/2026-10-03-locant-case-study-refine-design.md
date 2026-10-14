# Locant case study: the refine from the Palantir deck

Date: 2026-10-03
Branch: `am/locant-case-study-refine-a0c488`
Source: Figma "Portfolio Presentation 2026", page "Locant deck" (`11:2`), section **Presentation Final v2** (`203:2`): the `v7/*` slides and the backups B1 to B4.
Files in scope: `src/data/projectDetails.ts` (the `locant` document), `src/components/project-detail/LocantModules.tsx` (+ its test), `src/components/project-detail/ProjectDetailTemplate.tsx` (module registry only), `src/data/projects.ts` (the card's description sentence), `src/assets/locant-*` (three new stills, one replaced).

## What this is

Malik asked for the case study to be refined from his newest deck: its context, its testing results, and its storytelling, keeping the page's structure. The nine sections, every settled clip, the hero reel, the 2x2 agent tile and the film link stay. What changes is the copy, the evidence, and the design decisions the page shows.

## Decisions taken (2026-10-02)

| Question | Answer |
| --- | --- |
| New 0.9.2 loops for Final Design from the Oct 1 4K take | **No.** Copy and modules only. The hero and Highlights already show the loop |
| How much of the worktree test goes on the page | **Both rounds.** Round one found 0.9.0 short, one sentence fixed it, round two confirms. The product site already says so |
| The homepage card's description | **Match the site:** 14 of 20 against 0 of 20. The card keeps linking out |

## Facts checked against the sources

Every number below was traced; where the deck and a source disagree, the source wins.

- **The timer.** The build recording starts 15:24:58; the menu-bar countdown reads 2:12:54 at offset 0:50, so it started about 15:28 and ran to about 18:28. v0.4 was tagged 18:08:07: **about 19 minutes left**, as the page already says. The deck's "v0.4 at 2 h 31 min, with 29 minutes to spare" counts from the first commit (15:37:06); "29 minutes to spare" is not true of the timer and stays off the page.
- **"123 tests on the pure parts"** was the README's count on Sep 15 (ff103b7); the README dropped the number on Sep 29 as stale (afd3060). The page says tests cover the pure functions, with no count.
- **"Solo developers"** cannot appear (no-solo rule; `locantDraft.test.ts` fails on it). The audience reads "indie developers".
- **Codex as a second opinion** is not recorded in the Locant repo. It is used on Malik's word, from the deck.
- **The agent's reply** in the Problem is verbatim from v3 run `build-shot-2` (`~/Desktop/locant-film/v4/measure/v3/run-claude-opus-5-build-shot-2.jsonl`, the `result` field), the run the deck's slide 04 quotes. The screenshot it was given is `~/Desktop/locant-film/v4/measure/screenshot-crop.png` (912×1944, md5 60360e23…), the whole Simulator window.
- **"17 of 18 stopped; the one that didn't guessed"**: v3 `REPORT.md`, "Reading it": the one screenshot run that did not ask (build, pair 1) guessed Product Ideas and happened to be right.
- **MCP saved one paste**: `specs/v0.9.md` R59 as written Sep 17 (2a6e5aa): "either way three steps remain, and the MCP route removes only the paste."
- **Auto-send**: commit a9996ad (Sep 19 02:56): "In the first dogfood on Sep 19 an automatic send went to the last-used chat, a live one, and interrupted it; a send cannot be taken back." The switch never reached a release; 0.8.1 (tag Sep 21) shipped Paste into your agent, off by default, and never sends. 0.9.2 (Oct 1): a ⌘V in Cursor, Codex, or Grok Bot pastes the text and Locant adds the image; "Locant still never sends."
- **The worktree test**: `docs/video/11-measurement-worktrees.md` (e8062df) and the raw data in `~/Desktop/locant-film/v4/measure/v7` and `v8`. Recomputed from `v8/results.tsv` with the report's own `stats.load`: time to the first change in the right file, medians 79.75 s and 38.55 s (shown as 80 s and 39 s; Locant first in 17 of 20 pairs); changed a wrong copy 14 and 0; right with no reply 4 and 19; passed after at most one reply 16 and 20; cost per run, **medians** $1.258 and $0.549 (totals $22.54 and $10.95 for 20 runs). Round one (v7, Locant 0.9.0): Locant changed the wrong copy in 9 of 20, the screenshot in 13 of 20.
- **The fix sentence** is `MarkdownBuilder.projectAdvice`, verbatim, and appears in the v8 T3 capture (`v8/captures/T3.md`) under its `Project:` line.
- **Releases**: tag times v0.1 17:07, v0.2-region 17:17, v0.3 17:45, v0.3-actions 17:58, v0.4 18:08 (Sep 13); v0.5 Sep 14 16:25; v0.6 Sep 14 18:58; v0.7.1 Sep 15 00:21; v0.8 Sep 16 19:23; v0.8.1 Sep 21 19:57; v0.9.0 Sep 29; v0.9.1 and v0.9.2 Oct 1. Nine versions in nine days is v0.1 to v0.8.1, Sep 13 to 21, as the deck lists them (v0.7 and the patch releases are folded in).
- **License** MIT (LICENSE). **Homebrew** since 0.9.0.

## The nine sections

Section ids, labels and order do not change. Headlines are claims.

1. **Intro.** Headline kept: "A click says which element. The note says what to change." The last paragraph now runs past 0.8: daily use took it through nine versions in nine days, and a blind test found where it still fell short; one sentence fixed it. Meta cards: Timeline "3 Hours to v0.4 · 9 Days to v0.8.1 / Sep 13 to Oct 1, 2026"; Tools adds Codex; Output "Free and Open Source · v0.9.2 / Signed, Notarized · MIT · Homebrew".
2. **Highlights.** Clip and 2x2 unchanged. The chip "Asked which orb: 0 of 12 runs" (the superseded v3 test) becomes "Right file in half the time".
3. **The Problem.** Headline from the deck: "The hard part wasn't the fix. It was saying which one." Opens on who it is for (makers who build with agents: designers who prototype in code, design engineers, indie developers) and where it started (Malik's own friction building Oryne). The two-descriptions paragraphs and the Before clip stay. `locant-question` becomes the screenshot the agent was given beside its reply, verbatim, with the five orbs it could not choose between, and "17 of 18 screenshot runs stopped here. The one that didn't guessed."
4. **Landscape.** Headline and table kept. New: the scope turn. It began on the whiteboard as a screenshot tool for AI design; the research turned it toward one element before any code. `locant-turn` pairs whiteboard sketch-01 (before) with the Product Ideas orb outlined by its identifier (after, a still from the Oct 1 take). The "three things it changed" paragraph and the Appshots close stay.
5. **Decisions.** Headline kept. The payload gains margin notes for its order (path first, identifier, path, the Project line, note last). The ladder reads "each rung asks less of the app", with Locant's real fallback lines. New: "Four actions, and where to put them": the ring against a square panel, a pop-up list, a stack and a picker, each drawn and each with its reason to lose (the deck's slide 10), before the whiteboard history.
6. **Build.** Headline kept. New: the v0.1 time plan as written before the timer (six slots, each with an exit condition, and the rule "cut the next slot's polish, not its core"); the loop every version followed (spec, build, check, use); the releases regrouped into the deck's phases (the three-hour build, ready for other people, fixes from daily use) plus the release candidate; and a new subsection, "Daily use broke my own assumption about MCP", ending on "Locant pastes. The person sends." The empty-capture, self-exclusion and product-first stories stay.
7. **Final Design.** Headline, clips and order kept. Copy brought to 0.9.2: what it reads (Device Hub on Xcode 27), the paste that waits for the person, the ⌘V hand-off, and the MCP server as the way an agent looks back. The Settings still is replaced by 0.8.1's General tab (the site's `settings-dark.png`), which shows the taps and sounds.
8. **Measured.** Rebuilt on the worktree test. Headline from the deck: "Half the time, and never the wrong copy". Order: the setup (`locant-test-setup`: the three checkouts and the question), round one finding Locant short, the sentence (`locant-fix`, from the real T3 capture), round two's four results (`locant-measured`: time to the right file, changed a wrong copy, right with no reply, cost per run, each with both bars), all 20 pairs task by task (`locant-pairs`, drawn from the raw data), the T3 look-alike, the close, then the links. The report link moves to `11-measurement-worktrees.md`.
9. **Reflection.** Headline from the deck: "Three calls I'd make again" (`locant-calls`: the element not the window, before any code; cutting MCP for text and an image path, inside the three hours; removing auto-send, in daily use). Then the lesson as a subhead ("Understand the constraints. Scope, then build."), "Every payload has two readers" kept, "Honest by default" kept with the published round one added, and "After 1.0": the release candidate is for other Macs; then promote it, get more people using it, and polish from their feedback.

## Modules

Kept as they are: `locant-highlights` (chips text only), `locant-landscape`, `locant-overlay`, `locant-ball`, `locant-links`.
Changed: `locant-question`, `locant-payload`, `locant-ladder`, `locant-releases`, `locant-measured`.
New: `locant-turn`, `locant-ring`, `locant-plan`, `locant-loop`, `locant-test-setup`, `locant-fix`, `locant-pairs`, `locant-calls`.

All new modules use the existing shells (`ModuleCard`, `StillGrid`, `FigureCaption`) and tokens only: the chart's two series are full ink (Locant) and the tertiary tier (screenshot), a hollow ring marks "never", and nothing introduces a colour literal. Diagrams are inline SVG in `currentColor`.

## Assets

- `locant-screenshot.webp`: the v3 screenshot-side stimulus, the whole Simulator window, from `screenshot-crop.png`.
- `locant-sketch-first.webp`: `docs/sketch-01.HEIC` (Sep 13, before the first commit), the screenshot-tool idea with its hover ring.
- `locant-element.webp`: one frame of `~/Desktop/locant-film/v10/sceneA-cut.mp4` (Locant 0.9.2, Oct 1 21:30), the Product Ideas orb outlined with `button · oceanCurrent.product ideas`, cropped 4:3. The pointer is the interaction there, so it stays.
- `locant-settings.webp`: replaced by the site's `settings-dark.png` (0.8.1, General tab).

## Card

`projects.ts` description: "Free and open source for macOS. Given a screenshot, the agent changed the wrong worktree's code in 14 of 20 runs; given a Locant capture, 0 of 20." The product site's proof line, word for word. The card still opens locant.malikzhang.com.

## Copy rules

No clause-breaking dashes (the payload's own window title is the one verbatim exception, and the new fix module leaves that line out). No "solo", "alone", "by myself". No line ending on a single word at 1440 and 375. No meta headers: every subhead names something in this product. Verified facts only; Palantir named only as the site does, nothing about the outcome.

## Verification

`npm test` (typecheck, boundary, the Locant tests) and `npm run build`. Preview on a strict-port server; Playwright at 1440×900 and 375×812 through every section; the orphan scan on headlines, captions and bold closes; console clean on `/project/locant`; the homepage card still external.

## Not in scope, flagged

- `src/data/resume.ts` still quotes the v3 numbers (17 of 18 to 0 of 12). The resume is its own pipeline; left for Malik.
- The deck's "29 minutes to spare" and "123 tests" are worth fixing before it is presented again.
