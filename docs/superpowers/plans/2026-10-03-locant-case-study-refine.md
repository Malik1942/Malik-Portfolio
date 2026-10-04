# Locant Case Study Refine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Locant case study's copy, evidence and design-decision modules from the Palantir deck (Presentation Final v2), keeping its nine sections and settled media.

**Architecture:** Copy lives in the `locant` document in `src/data/projectDetails.ts`; inline modules live in `src/components/project-detail/LocantModules.tsx` and are registered by key in `INLINE_MODULES` (`ProjectDetailTemplate.tsx`). Every module renders from a typed data array at the top of its block, so the tests can assert the data the page shows. New stills go to `src/assets/locant-*.webp`.

**Tech Stack:** React 18, TypeScript, Tailwind (token-only, see `src/design-system/boundary.test.ts`), Vitest + Testing Library, ffmpeg/cwebp/sips for stills.

Spec: `docs/superpowers/specs/2026-10-03-locant-case-study-refine-design.md` (copy direction per section, facts checked, decisions).

## Global Constraints

- No `—` or `–` in copy; `locantDraft.test.ts` fails on them in section text.
- No "solo", "alone", "by myself" anywhere in copy.
- No line may end on one word: `noOrphan()` on every rendered string; check 1440 and 375 in the browser.
- No meta headers: a subhead names something in this product.
- Tokens only: ink ladder (`text-foreground`, `-lead`, `-secondary`, `-tertiary`, `-quiet`), `border-case-study-module-*`, `bg-surface-inset`, no colour literals, no off-scale opacity, sizes from the type scale.
- Numbers only from the spec's "Facts checked" list.
- The hero reel, the Highlights clip and 2x2, every Final Design clip, and the film link do not change.

---

### Task 1: The three new stills and the Settings refresh

**Files:**
- Create: `src/assets/locant-screenshot.webp`, `src/assets/locant-sketch-first.webp`, `src/assets/locant-element.webp`
- Replace: `src/assets/locant-settings.webp`

- [ ] `locant-screenshot.webp` from `~/Desktop/locant-film/v4/measure/screenshot-crop.png` (912×1944), resized to 684×1458, webp q82, alpha kept.
- [ ] `locant-sketch-first.webp` from `~/Documents/Locant/docs/sketch-01.HEIC` (5712×4284), 1600×1200, webp q80.
- [ ] `locant-element.webp`: frame at 14.6 s of `~/Desktop/locant-film/v10/sceneA-cut.mp4` (the orb outlined, label `button · oceanCurrent.product ideas` under the cursor), crop 4:3 around the phone's upper half, 1600×1200, webp q82. Check by eye: outline and label fully inside, no clipped text.
- [ ] `locant-settings.webp` from the site's `settings-dark.png` (Locant origin/main, 0.8.1 General tab), 1800 wide, alpha kept.
- [ ] Commit: `git add src/assets/locant-screenshot.webp src/assets/locant-sketch-first.webp src/assets/locant-element.webp src/assets/locant-settings.webp && git commit -m "Add the Locant refine stills"`

### Task 2: Modules, rewritten and new, with their tests

**Files:**
- Modify: `src/components/project-detail/LocantModules.tsx`, `src/components/project-detail/LocantModules.test.tsx`, `src/components/project-detail/ProjectDetailTemplate.tsx` (registry)

**Interfaces (exports consumed by the template and the tests):**
`LocantHighlights`, `LocantQuestion` + `AGENT_REPLY`, `LocantLandscape`, `LocantTurn`, `LocantOverlay`, `LocantPayload` + `PAYLOAD_TEXT`, `LocantLadder`, `LocantBall`, `LocantRing`, `LocantPlan`, `LocantLoop`, `LocantReleases`, `LocantTestSetup`, `LocantFix` + `PROJECT_ADVICE`, `LocantMeasured`, `LocantPairs` + `PAIRS`, `LocantCalls`, `LocantLinks` + `LOCANT_FILM_URL`.
Registry keys: `locant-turn`, `locant-ring`, `locant-plan`, `locant-loop`, `locant-test-setup`, `locant-fix`, `locant-pairs`, `locant-calls` added beside the existing ten.

- [ ] Update the tests first, so they describe the new page:
  - chips: `["The element, not a screenshot", "Any Mac app, any agent", "Right file in half the time", "v0.1 to v0.4 in three hours"]`.
  - `AGENT_REPLY.opening === "I haven't changed anything yet: I can't tell from the screenshot which orb you mean."` (curly apostrophes as in the transcript), the five candidates in order (Product Ideas, Cooking, Sound & Music, Interface Design, Reading), and the screenshot image is present with width 684.
  - ladder rungs `["Identifier", "Label", "A frame you draw", "Text and neighbors", "The image alone"]`.
  - releases: four lists, `"The three-hour build, Sep 13"` = v0.1…v0.4 as today; `"Ready for other people, Sep 14 to 15"` = v0.5, v0.6, v0.7.1; `"Fixes from daily use, Sep 16 to 21"` = v0.8, v0.8.1; `"The release candidate, Sep 29 to Oct 1"` = v0.9.0, v0.9.1, v0.9.2.
  - `PROJECT_ADVICE` equals Locant's `MarkdownBuilder.projectAdvice` verbatim.
  - `PAIRS`: 20 entries, 4 per task T1–T5; screenshot `null` exactly on the four T3 pairs; Locant never `null`; medians recomputed in the test are 79.75 and 38.55; Locant faster in 17 of 20 pairs.
  - measured tiles show "39 s", "80 s", "0 of 20", "14 of 20", "19 of 20", "4 of 20", "$0.55", "$1.26", and the report link `https://github.com/Malik1942/locant/blob/main/docs/video/11-measurement-worktrees.md`.
  - ring: five layouts, exactly one marked shipped ("Ring").
  - plan: six slots, the rule sentence verbatim.
  - every new module renders without throwing and every registry key resolves (`projectDetailRefs.test.ts` already checks `[[module:…]]` keys exist).
- [ ] Run `npx vitest run src/components/project-detail/LocantModules.test.tsx` and see the new assertions fail.
- [ ] Write the modules (spec, "Modules"), each data-first; chart per the dataviz skill (load it first); register keys.
- [ ] Run the same test file until green, then `npm run typecheck` and `npx vitest run src/design-system/boundary.test.ts`.
- [ ] Commit: `git commit -am "Rebuild the Locant modules around the deck: the reply, the ring, the plan, the worktree test"` (plus new files).

### Task 3: The copy, the card, and the document test

**Files:**
- Modify: `src/data/projectDetails.ts` (the `locant` document and its imports), `src/data/projects.ts:215-217`, `src/data/locantDraft.test.ts` (only if a rule needs a new line, e.g. the figure count)

- [ ] Rewrite the nine sections per the spec; update meta cards, figures (Settings alt text, Landscape figures), and the comment block above the document.
- [ ] Card description to the site's proof line.
- [ ] Run `npx vitest run src/data` and `npm test`.
- [ ] Commit: `git commit -am "Refine the Locant case study from the Palantir deck"`.

### Task 4: Browser verification

- [ ] Start a strict-port dev server (worktree trick), open `/project/locant`.
- [ ] Playwright at 1440×900 and 375×812: screenshot every section, measure every headline, caption, chip, module line and bold close for a lone last word; console clean; no horizontal scroll at 375.
- [ ] Homepage: the Locant card still opens locant.malikzhang.com and shows the new sentence.
- [ ] Fix, re-run, commit.
- [ ] `npm run build` green.
