# Moti case study: coherence restructure

Date: 2026-09-03
Branch: am/moti-case-study-coherence-19ddaa
Files in scope: `src/data/projectDetails.ts` (the `moti` document), `src/components/project-detail/MotiModules.tsx`, `src/components/project-detail/ProjectDetailTemplate.tsx` (module registry only).

## The problem being fixed

Three failures, in order of how much damage they do.

1. **No section argues anything.** Each one states a fact and stops. "Capable people, drowning in their own inputs" leads to three noun cards and then the next section. "The same frustrations, in their own words" leads to six quotes and then nothing. Only Competitive Analysis lands a conclusion. The other eight are captions on a gallery.
2. **Nothing connects to anything.** Six user quotes sit beside six principles with no line drawn between them, although they map one to one. The three-tier architecture appears as a spec grid with no account of why three tiers. V0 "broke under complexity" and V1 follows with no visible causal link.
3. **The product never works.** There is no Final Design section. The Smart Capture screens are buried inside "Define Interaction Grammar" as evidence for a spec bullet. The Timeline screens sit in Highlights as a decorative 2x2. A reader finishes the page having seen six screens and never once seen Moti do a complete job.

A fourth, structural: every section heading is a category word, because `headline` is never set. Aura, Mood Muse and CalmMouse all set it. Moti does not.

## Decisions taken

| Decision | Choice |
| --- | --- |
| Restructure shape | Oryne's spine: product loop before architecture |
| Workflow scope | One project, start to finish |
| Reel vs screens | Reel stays light mode in Highlights, all screens dark |
| The four spec grids | Architecture extracted to its own section, the other three compress to one block |
| Section headings | Every section gains a `headline`; `label` demotes to eyebrow |
| Metrics | Nothing invented. Every claimed result traces to a fact Malik supplied |

## The nine sections

Order changes. Count does not. User Research and Design Principles merge; How Moti Works is new; System Architecture is extracted from Before Building.

### 1. Overview
- Label: `Overview` · Headline: **A Planner That Understands Before It Plans**
- Unchanged: positioning sentence, tags module, App Store button, meta cards.

### 2. Highlights
- Label: `Highlights` · Headline: **One Spoken Sentence, Three Tasks on a Timeline**
- **Add** `moti-card.mp4` as the lead figure, poster `moti-card-poster.webp`, matching Oryne's film treatment. The reel already runs the whole loop in 9.8 seconds: title card, live dictation of "Portfolio review with Kai Thursday, need the case study written before that, and the site live by the 20th", a Thinking state, then the timeline populated with the resulting tasks sorted into Home and Portfolio.
- **Remove** the 2x2 `ArtifactGallery`. All four of those screens become beats in section 6. Showing them twice is the gallery problem itself.
- Keep the chips and the pull-quote.
- Lead: *Ten seconds, one spoken sentence, three tasks on a timeline. What that hides is the part I got wrong twice.*
- Close: the existing pull-quote, *"The problem wasn't planning. It was understanding."*

### 3. The Problem
- Label: `The Problem` · Headline: **The Failure Is Between Capture and Action**
- Three cards stay, reframed as three stages of one failure rather than three separate problems.
- Lead: *The people I watched were not disorganized. They had systems, and the systems were full. What failed was not capture, and not display. It was the step between them.*
- Close: ***Three symptoms, one gap: everything arrives, nothing is understood, so nothing is obvious to do next.***
- Why this line matters: it seeds the understanding-first thesis, which currently appears from nowhere in the Build Journey and again in the takeaways.

### 4. Competitive Analysis
- Label: `Competitive Analysis` · Headline: **Five Tools That Capture Well and Understand Nothing**
- Lightest touch. The strength/gap rows already work and the existing close already lands.
- Lead: *These five are the tools the people I talked to already had open. I looked at each one for a single thing: what happens to a sentence you type into it.*
- Close: unchanged, ***The gap is clarity and momentum, not more capture.***

### 5. From Frustrations to Principles
- Label: `Principles` · Headline: **Six Frustrations Became Six Refusals**
- **Merges** the old User Research and Design Principles sections. Replaces `MotiUserQuotes` and `MotiPrinciples` with one paired module, `moti-principles`: quote with its brand mark on the left, the principle it produced on the right.
- Each principle gains a description and a ruled-out clause. A principle that rules something out is a decision; one that does not is a slogan, and all six are currently slogans (they carry titles only, no descriptions).

| Frustration | Principle | Ruled out |
| --- | --- | --- |
| "Entering tasks is so annoying." (Todoist) | Natural Input | A structured entry form |
| "It's hard to change plans when things change." (Motion) | Adaptive Timelines | Regenerating the plan from scratch |
| "I spend more time organizing than doing." (Notion) | Living Plans | Manual triage and folders |
| "I end up with more tasks, not more clarity." (Todoist) | Momentum Tracking | Task counts and badges |
| "AI suggestions don't get my timeline or real-world constraints." (ChatGPT) | Context-Aware Planning | Context-free suggestions |
| "I just want a plan that adapts to me, not the other way around." (Sunsama) | Human-Centered Planning | Autonomous scheduling |

- Lead: *Six frustrations came back often enough to be structural. Each became a rule Moti had to obey, and each rule ruled something out.*
- Close: ***Every principle is a refusal. That is what kept Moti from becoming another place to put things.***
- **Open slot A:** the lead sentence depends on whether these quotes came from real conversations and how many people. Copy must match what happened.

### 6. How Moti Works  (new)
- Label: `How It Works` · Headline: **One Sentence, and Everything That Happens to It**
- New module `moti-workflow`, built on the `FlowStepFigure` pattern already proven in `OryneModules`. Seven beats, one continuous project, each beat carrying its own why.

| # | Beat | Screen | Why it exists |
| --- | --- | --- | --- |
| 01 | Say it | `moti-voice` | The input has to cost less than the thought |
| 02 | Ask one thing | `moti-llm-plan1` | V0 guessed. Guessing is what broke trust |
| 03 | Propose, don't commit | `moti-llm-plan2` | Three answers, and one of them is no |
| 04 | It lands | **needs capture** | The proposal becomes a commitment only here |
| 05 | Work has a shape | `moti-timelinev1` | A list cannot show pace. A timeline can |
| 06 | Check in | **needs capture** | The baseline is learned, not assumed |
| 07 | It says when you're drifting | `moti-timeline-v2` | The payoff: the plan acts on you |

- Lead: *One sentence, spoken on the way somewhere, and everything that happens to it.*
- Close: ***Nothing in this loop asks you to organize. You speak, you answer one question, and you accept or refuse. Everything in between is Moti's job.***

### 7. Why Three Kinds of Intelligence
- Label: `Intelligence` · Headline: **Three Jobs That No Single Model Does Well**
- **Extracted** from the old Before Building. Now sits after the product works, so the diagrams explain something the reader has already seen instead of preceding it.
- Keeps the tier cards, both system diagrams, the Settings screen, the adaptive learning loop.
- **Adds** the trust decision the Settings screen already shows and the copy never mentions: your own Gemini key, held in the iOS Keychain, requests to a single endpoint.
- Lead: *The loop above contains three jobs with nothing in common. A due date has to be exactly right. Parsing has to be instant. Planning has to reason. One model doing all three is one model doing two of them badly.*
- Close: ***The tiers are not a hedge. Each one exists because the tier above it would have been the wrong tool for that job.***
- **Open slot B:** whether rule-based mode runs fully offline. Claim only if true.

### 8. Build Journey
- Label: `Build Journey` · Headline: **Specified First, Then Broken by Real Use**
- **Absorbs** the spec-first claim. `behaviorItems`, `interactionItems` and `visualItems` (twelve cards across three grids) compress into one short block naming what was specified before any code existed. The claim is differentiating; the wall is not.
- V0 / V1 / V1.1 blocks stay. They already carry the page's best reasoning (Why Evolve, What Broke, Learning).
- **Open slot C:** TestFlight feedback becomes the causal link between "V0 broke under complexity" and "V1 exists", which is the weakest joint on the page.
- **Open slot D:** the outcome line gains real numbers if Malik supplies them, otherwise stays at shipping facts.

### 9. What Moti Proved
- Label: `What It Proved` · Headline: **Understanding First Was the Whole Bet**
- Three takeaways sharpened against the arc the page now has.
- **Adds** the closing App Store button. Oryne closes with one; Moti currently offers its only link at the very top.

## Module changes

| Module | Change |
| --- | --- |
| `MotiTags` | unchanged |
| `MotiHook` | reel added, `ArtifactGallery` removed |
| `MotiProblem` | copy only |
| `MotiCompetitive` | unchanged |
| `MotiUserQuotes` | **merged into** `MotiPrinciples`, registry key retired |
| `MotiPrinciples` | **rewritten** as paired quote/principle rows with ruled-out clauses |
| `MotiWorkflow` | **new**, seven beats |
| `MotiIntelligence` | **new**, extracted from `MotiBeforeBuilding` |
| `MotiBeforeBuilding` | **retired**, its non-architecture content compressed into the build journey |
| `MotiBuildJourney` | spec-first block added, TestFlight link added |
| `MotiTakeaways` | sharpened, closing CTA added |

`ArtifactGallery` and `MotiUserQuotes` become unused once merged. Both are local to `MotiModules.tsx`; delete rather than leave orphaned, which is exactly how the `.project-row-arriving` keyframes were lost per `CLAUDE.md`.

## Blocked on Malik

Captures, dark mode to match the existing six:
1. A task landing on the Timeline, the moment after Add to Timeline (beat 04)
2. The Review tab, ideally mid check-in (beat 06)
3. The Projects tab, if quick

Facts, none of which will be invented:
4. TestFlight feedback: the actual observations, and which version change each caused (slot C)
5. App Store numbers he is willing to publish (slot D)
6. Whether the six user quotes came from real conversations, and how many people (slot A)
7. How long he has run his own work through Moti, and whether the Job Search / Portfolio / Personal streams are real
8. Whether rule-based mode runs fully offline (slot B)

Sections 1 through 4, 6 (five of seven beats), 7 and 9 can be written before any of this arrives.

## Explicitly not changing

- The hero dot to project card animation and its four wired pieces, per `CLAUDE.md`.
- `src/data/projects.ts`: the homepage Moti card, its cover video and aspect ratio.
- The token-backed visual language: no new colors, fonts or unmanaged values.
- Any other case study. Oryne also sets no `headline` and has the same table-of-contents heading problem, but that is out of scope here.

## House rules this must respect

- No em dash as a clause break in prose or titles. Comma and and, colon, or two sentences.
- No line of copy ending in a single orphan word. `noOrphan` covers headlines and body paragraphs automatically; module strings need it applied explicitly.
- Every project card keeps `coverAspect`.

---

## Corrections made during implementation (2026-09-04)

Six drafting agents and six adversarial verifiers produced the copy and modules; a fabrication sweep then audited every claim against the assets. It caught a factual error in this spec itself, plus several claims the drafts had asserted beyond their evidence. What changed, and why:

### The reel fact in this spec was wrong

This spec described `moti-card.mp4` as a spoken sentence producing the tasks on the timeline, and the Highlights headline claimed "Three Tasks on a Timeline". Verified frame by frame, that is false:

- At **0.4s**, before the capture sheet opens, the Timeline already holds six items: Fix the kitchen tap 6%, Renew the lease 1%, Shoot new project photos 2%, Rewrite the about page 1%, Send Aurora the revised scope 10%, Invoice Aurora for July.
- Its project pills are All Projects / Home / Portfolio / Aurora / Writing, not the Job Search / Portfolio / Personal of the dark screenshots.
- By **7.4s** the dictated sentence has added exactly **two** visible items, both into Portfolio: "Case study" as a bar at 0%, and "Portfolio review" as a bare milestone dot. "The site live by the 20th" produces nothing visible in frame.

The Highlights copy now says the timeline was already full before he spoke, and makes the point that deciding a review is an event while a case study is work with a duration is the hard part. That is both true and a stronger claim than the count was.

### Headlines that overclaimed

| Was | Now | Why |
| --- | --- | --- |
| One Spoken Sentence, Three Tasks on a Timeline | One Spoken Sentence, Sorted Onto the Timeline | The count was wrong |
| One Sentence, and Everything That Happens to It | Seven Steps From Spoken to Scheduled | The seven beats come from three different sessions and datasets, so no copy may promise one literal sentence followed end to end |
| Specified First, Then Broken by Real Use | Specified First, Then Rebuilt Twice | "Real use" attributes the rebuilds to testers. Nothing in the repo supports that; it is slot C written before slot C arrived |

### Claims pulled back to their evidence

- **Principles row 03** ruled out "an inbox to triage". Contradicted by the shipped app: the tab bar in every captured screen carries a Review tab with an inbox-tray icon. Now "Sorting the work yourself before the timeline is usable."
- **Intelligence** said choosing LLM mode means pasting your own Gemini key. Contradicted by `moti-ai.webp`, where LLM is selected while the key field is empty and Status reads "Using DEBUG fallback". The copy now describes what the screen says without claiming a key is required.
- **How It Works** claimed Moti stops and asks wherever it could decide for you. Refuted by the reel, where it silently chooses the project, the dates, and whether an item is a bar or a point. Now: Moti does the structuring, all of it, and the one thing it will not decide is that the work is yours to take on.
- **How It Works** closed with "nothing in this loop asks you to organize", two clauses before conceding you answer its question. Now "asks you to file anything".
- **The Problem** asserted people were observed running full systems, which draws on slot A. Now a design premise: not built for people who lack a system, built for the moment one is already full.
- **The Problem** said "nothing does that job". Scoped to the five tools in the next section.
- **Competitive** claimed all five tools require you to arrive already knowing what the sentence means, which is false for at least Todoist and Motion. Narrowed to what the gap cells support.

### Slot A is held without shipping a placeholder

The drafter put a visible "NOT FOR PUBLICATION" placeholder in the Principles lead. That would have rendered on the live page. The lead now claims a design position only, and a code comment on the section marks where one sentence of provenance belongs once Malik confirms it.

### Implementation notes

- `MotiAppStoreCta` gained a `label` prop, with `MotiAppStoreCtaClose` rendering "Get Moti: Plan on the App Store". Two identical buttons at both ends of the page read as one repeated element; Oryne already varies its two.
- `testFlightNotes` is a deliberately empty typed array. `MotiTestFlightNotes` returns null while it is empty, so the live page never carries a placeholder for slot C. Filling the array makes the block appear in place.
- Workflow beats 04 and 06 render a dashed `PendingScreen` sized by `flex-1` to the exact height of the captured screen beside them, so the grid does not move when the images land. Adding a screen is a data change only.

### Verified after applying

- `tsc --noEmit`: clean.
- `eslint`: 0 errors (4 pre-existing warnings in untouched files).
- `vitest`: 460 passed, 1 failed. The failure is pre-existing on `main` and unrelated: `homepageSections.test.tsx` requires every project card to have a click target, and the `spatial` card is a deliberate coming-soon placeholder. Introduced by d903d1f, tracked separately.
- Rendered at 1440px and 375px: nine headlines correct, no unresolved `[[module:]]` or `[[fig:]]` refs, no literal `\n`, no em dashes, no horizontal overflow, beat 07 spans both columns, principles collapse to one column with the derivation arrow rotating to point downward.

## Second audit round, after applying (2026-09-04)

Three agents audited the applied files: a cross-section through-line lens, a fabrication sweep, and a code review. 50 findings. The code review's verdict was "structurally sound, one shipping bug"; the through-line lens returned "fails as a continuous argument", which is the same criticism Malik made of the original page, now aimed at the restructure. Both were right.

### A shipping bug, measured

`noOrphan` glues the last two words of a string with a non-breaking space, making them one unbreakable token. In `CardGrid` at `sm:grid-cols-3` that token can be wider than the cell and bleeds outside it. Measured with Playwright, `scrollWidth` vs `clientWidth`:

| Width | "Reliable Understanding Beat Autonomous Planning" (new) | "…adaptive refinement, contextual understanding." (pre-existing) |
| --- | --- | --- |
| 640px | 9px over | 14px over |
| 768px | 24px | 13px |
| 1024px | **48px** | **37px** |
| 1150px | 6px | clean |

Fixed three ways: the new title shortened to "Understanding Beat Autonomy", the pre-existing description shortened to end on "and context.", and `[overflow-wrap:anywhere]` added to `CardGrid`'s title and description as a floor so a glued pair can never bleed again. Now zero overflow at every width from 375px to 1440px.

### The hero reel refutes the loop the page described

Verified frame by frame: at 6.2s Submit is tapped, 6.5s shows "Thinking…", and by 7.0s the work is on the Timeline. **There is no Quick question and no Proposed task card anywhere in the 9.8 second clip.** So beats 02 and 03 are conditional, not mandatory steps of every pass, and the closing line "you answer the one question it asks" was refuted by the page's own opening film. Now: "When Moti is unsure it asks instead of guessing, and when it proposes, one of the three answers is no."

### Claims about named companies, pulled back

- Headline "Five Tools That Capture Well and Understand Nothing" asserted a blanket capability absence about five real products, contradicted by the module's own rows for ChatGPT ("Flexible thinking") and Motion ("AI scheduling"). Now "Five Tools, Five Strengths, Five Different Gaps", which is exactly what the rows establish.
- "Not one of them sets the sentence against everything else you already owe" was refuted two paragraphs later by Motion's own row. Now "five different things still left for you to do once the sentence arrives", which is the gap column and nothing more.

### Two architectures that could not both be true

An unconditional SLM → LLM pipeline card sat about 400px from a Settings screen showing an exclusive Active picker. The diagrams are design artifacts and the picker is what shipped, so the card is now headed "The Architecture I Specified" and says explicitly that the picker decides which tier is active. Relatedly, `tierReasons[0]` claimed the deterministic tier "owns" dates, which asserts a rules layer running underneath the model tiers; it is now scoped to rule-based mode.

### Slot B was being filled by implication

"…where your sentences go when the model reading them is not on the phone" presupposes the other two modes run locally, which is exactly what slot B has not confirmed. Replaced with a claim about the named endpoint only.

### The page argued the same points twice

The through-line lens found four load-bearing duplications, all of them the defect this restructure exists to remove:

1. **Principles rows 01, 04 and 06 vs workflow beats 01, 05 and 03.** Each `why` re-argued its own principle in near-identical words one section later. Each `why` now says what the shipped *screen* had to do to keep the rule, which the principle could not say.
2. **The Adaptive Learning Loop card** repeated beat 06's sentence verbatim, with a second hardcoded copy of the same four milestone chips. Deleted from Intelligence; it is a step in the loop, not an architecture fact.
3. **"What Reached the App Store"** was a four-bullet recap of beats 02, 03 and 07. What belongs there is what the three versions changed, which is slot C, so the card now holds only the outcome line until slot C arrives.
4. **The Problem** pre-stated Competitive's verdict, so the five-row table became evidence for a point already conceded. The forward reference is gone.

### The thesis had no middle, and the last sentence changed subject

`intelligence` is the designated middle leg of the understanding-first argument and closed about tiering instead, and `proved` ended on refusability, a point already made three times, under a headline about the understanding bet. Both closes rewritten. The chain now reads: section 3 "only the middle one is worth fixing" → section 7 "Understanding is the middle step this page opened on" → section 9 "V0 asked the machine to plan, and trust broke. What shipped asks it to understand."

### New test: the inline-ref contract

`SectionBody` resolves `[[module:key]]` and `[[fig:N]]` with a hand-rolled parser, and an unresolved ref does not throw. It falls through to the plain-paragraph branch and renders the literal `[[module:moti-workflow]]` as visible text. Nothing covered that, and this change renamed two registry keys and added the Moti document's first `[[fig:0]]`. `src/data/projectDetailRefs.test.ts` now asserts three things across every case study: every module ref resolves, every figure index exists, and no registered module is orphaned. Verified it fails on a deliberately broken key and names the offending section. This is the same silent-breakage class `CLAUDE.md` records costing the hero-dot animation months of being quietly dead.

### Final verification

- `tsc --noEmit` clean; `eslint` 0 errors, 4 warnings, unchanged from baseline.
- `vitest`: 463 passed, 1 failed. Baseline was 460 passed, 1 failed. The +3 are the new ref tests; the failure is the same unrelated pre-existing `spatial` placeholder assertion.
- Playwright at 375, 414, 640, 768, 800, 1024, 1100, 1150, 1280 and 1440px: no text overflow anywhere, no document overflow, no console errors.
- No unresolved refs, no em dashes, the milestone chips render exactly once.
- Oryne (8 sections) and Ranger (10 sections, chips and pull-quote intact) unaffected, as they import the shared card shells.

## Round three: the product film (2026-09-04)

Malik supplied `~/Desktop/Moti Product Film v5.mp4`, renamed the workflow section, and asked for more to explore in Highlights.

### The film

2560×1080 at 60fps, 87 seconds, 138 MB. Compressed to 1920×1080 at 30fps, CRF 28, audio at 128k: **5.98 MB**, in line with `oryne-film.mp4` (4.96 MB) and well under the 11.5 MB ceiling `studio-waters-demo.mp4` already sets. Shipped as `src/assets/moti-film.mp4` with a poster from its opening title card.

It is a four-act film: capture it rough, Moti makes it a plan, while there's still time, it learns your pace. It contains two things the case study did not have:

- **The proposed-plan card**, which states its *assumptions* ("Thursday" means the next upcoming Thursday) above the three deliverables it derived, before anything is committed. This is the understanding-first thesis visible in the product's own UI.
- **The replan flow**, an entire act the case study never covered.

### Section renamed

`how-it-works` → `final-design`, label "How It Works" → **"Final Design"**, matching Oryne. The headline stays as the claim.

### Highlights, rebuilt

The 10-second reel is replaced by the film. The reel still runs on the homepage card in `src/data/projects.ts`, untouched. New headline, since the film shows typing rather than speech and the old one asserted a count that was wrong: **"One Rough Sentence, and a Dated Plan"**.

A four-still gallery returns to Highlights. This is *not* the 2×2 that was cut in round one: every one of these four is a surface Final Design never shows, so the section rewards looking around instead of previewing what is coming. They are the on-device capture, the proposed plan with its assumptions, the replan, and the progress check.

First cut of these stills used whole 16:9 film frames and the phone content was illegible, which defeats the point. Recropped tight to the device via column-density detection (a naive bright-pixel bounding box swallowed the film's side annotations and produced a landscape crop) to a consistent 4:5 at 1200px wide, 26–53 KB each.

### Beat 04 filled, beat 06 cannot be

Scanning all 5,234 frames for pulled-back full-device shots found only five windows: 7.5–9.5s, 16.5s, 23.5s, 30.0–34.5s and 59.5–62.5s. The 31s frame's device measures 581×1198, aspect 0.485, which matches the existing screenshots' 0.489 almost exactly. Cropped to 1105×2260 it fills **beat 04, "It Lands"**, showing all three derived deliverables on the Timeline at 0% beside work that was already there. It is labelled "Product film" so its provenance is explicit, and a light screen beside a dark one reads as one device in two modes rather than as a mistake.

**Beat 06 stays pending, and this is now a verified limitation rather than an outstanding task.** The film never pulls back during the pace check: at every such frame the device fills the full 1440px height, so no portrait crop at 0.489 can contain the sheet without clipping the Good / Normal / Bad buttons (the sheet alone spans 861px, and a full-height portrait crop is only 704px wide). The 223 raw captures in `~/Desktop/moti-film/` are from an older build with a blue accent and a "Plan" tab rather than "Review", so they cannot be mixed in either. This needs one fresh dark-mode capture of the Review tab or the pace check.

### Remaining audit findings closed

- Beat 02's `why` restated V1's "Learning" almost verbatim two sections apart; rewritten to be about the screen.
- `tierReasons[0]` asserted a general property of models; reframed as Malik's design position.
- "What Reached the App Store" promised a list and held one line; retitled "What Shipped".

### Verified

`tsc` clean, `eslint` 0 errors, `vitest` 463 passed with the one unrelated pre-existing failure. No text or document overflow at 375, 414, 640, 768, 800, 1024, 1100, 1150, 1280 or 1440px. No unresolved refs, no em dashes, no console errors. Mobile collapses both grids to one column. `moti-app.webp` is now unreferenced but left in place rather than deleted.

## Round four: recaptured from the simulator (2026-09-04)

Malik rejected the product-film assets and asked for dark-mode screens recaptured from the Xcode simulator against the launched build.

### Which build is actually launched

The App Store is on **2.0**, released 2026-07-07 (`itunes.apple.com/lookup?id=6770705491`). The local checkout was on `film/moti-product-film-v3` with uncommitted film instrumentation, and both local and remote `main` read `MARKETING_VERSION = 1.1`. Building `main` produced a **blue** UI with a **"Plan"** tab, which is not the shipped app.

`origin/feature/timeline-redesign` @ `3ab427b` is the only branch carrying `MARKETING_VERSION = 2.0` and the only one whose tab bar says "Review" with no "Plan". Building it produced the purple / Review UI that matches the App Store listing.

**The listing's own screenshots are the case study's existing assets.** The three images on the App Store page are `moti-timeline-v2`, `moti-timelinev1` and `moti-voice`, down to the clock (21:17, 21:18, 21:24). They came from one session, so the dark screenshots already on the page were the launched build all along. What was missing were the screens no asset covered.

### Capture setup

iPhone 17 Pro simulator, iOS 26.5, `xcrun simctl ui … appearance dark`. Data came from the app's own DEBUG hook, `-MotiSeedLifelines YES` (`Moti/Utilities/LifelineSampleData.swift`), which seeds Move / Launch / Parents / Fitness / Reading — the same dataset the product film used. Built from an isolated `git worktree` so Malik's checkout and its uncommitted film changes were never touched; the worktree was removed afterwards.

Captured: the Pulse check-in, the Review inbox, Projects, the Settings intelligence picker, and the typed capture sheet.

### Two corrections to what the case study claimed

- **The film's flow is not the shipped flow.** The film showed Create Plan writing straight to the Timeline. The shipped app decomposes a captured sentence into items that land in **Review** as *Unassigned*, each carrying a suggested project, and nothing reaches the timeline until a person assigns it. Beat 04 changed from "It Lands" to **"It Waits for You"** and now shows that inbox, which is both accurate and a better fit for the propose-don't-commit thesis.
- **The Review tab is a triage inbox, not the milestone check-in.** The check-in is a "Pulse" sheet reached from a work item. Beat 06, pending since the first spec, is now filled with it.

### Not capturable

The two Smart Capture states (`moti-llm-plan1`, `moti-llm-plan2`) need LLM mode, and Settings reports the Gemini key as **Not configured**. Handling an API key is out of scope, so those two assets stay as they are. They are from the launched build, so this costs nothing in accuracy.

### Phone frames

The recaptured screens were bare `simctl` output while the originals sat in a device mockup, so beats 05 and 06 rendered with different treatments. The frame was recovered from the existing assets rather than rebuilt:

- Diffing two framed assets isolates the screen content area. Its top edge reads low because only the clock digits differ up there, but the bezel is 43px thick and symmetric, which puts the screen at **987x2146 inset at (59, 59)** in the 1105x2259 canvas.
- That screen aspect is 0.4599 against a 1206x2622 capture's 0.4600, so screenshots drop in with no distortion.
- Compositing uses a rounded-rectangle mask at radius 135 (55pt of a 402pt screen, scaled), over a slightly wider black fill so no arc of the old screen survives in the corners.
- The **Dynamic Island** is drawn into the mockup and absent from `simctl` screenshots, so it is copied back from the template. Its box clears the clock (ends x300) and the status icons (start x761).

Script: `frame.py` in the session scratchpad. Every phone screen asset in use is now 1105x2259 with an identical bezel, corner radius and island.

### Status bar override

The first pass read 9:41 (the simulator default) against the originals' 21:17 / 21:18 / 21:24, so the five screens were recaptured with the status bar pinned:

```
xcrun simctl status_bar <udid> override --time "21:20" \
  --dataNetwork wifi --wifiMode active --wifiBars 3 \
  --cellularMode active --cellularBars 4 \
  --batteryState discharging --batteryLevel 100
```

Two gotchas. The override does not survive an app reinstall, so it has to be applied after the install. And `--time "21:20"` renders as **9:20** unless the device is in 24-hour mode: set `AppleICUForce24HourTime` via `simctl spawn <udid> defaults write -g …` and then **reboot the device**, because terminating SpringBoard alone does not pick it up. Pinning the radio and battery flags matters too, since some earlier captures had picked up a green charging battery and others had not.

Every clock across the ten phone assets now sits in one 13-minute window: the originals at 21:17 / 21:18 / 21:24 / 21:27 / 21:30, the recaptures at 21:20. The 24-hour setting also applies inside the app, so due dates read "16:33" rather than "4:33 PM", matching the originals.

The recapture also produced a better Review shot: the same sentence yielded **three** items this time, one per clause (Live site, Write case study, Portfolio review with Kai), each suggested to Portfolio. Beat 04's caption and why were updated from two items to three.

### Verification

`tsc` clean, `eslint` 0 errors, `vitest` 463 passed with the one unrelated pre-existing failure. Zero pending slots, all seven beats carry a screen, no film references anywhere in `src/`, no text or document overflow at 375 through 1440px, no console errors. `moti-ai.webp` and `moti-app.webp` are now unreferenced and were left in place rather than deleted.

## Round five: text contrast (2026-09-04)

Malik reported the grey text in the competitive table as hard to read.

### Measured, not guessed

Foreground is `rgb(231, 230, 228)` on a module surface of `rgb(12, 12, 13)`. Contrast by opacity step:

| Step | Ratio | | Step | Ratio |
| --- | --- | --- | --- | --- |
| /40 | 3.27 | | /75 | 8.97 |
| /55 | **5.23** | | /80 | 10.13 |
| /60 | 6.04 | | /85 | 11.37 |
| /70 | 7.91 | | /90 | 12.71 |
| /72 | 8.32 | | full | 15.68 |

The gap column sat at `/55` = 5.23:1, which **passes WCAG AA** (4.5:1 for normal text). The ratio flatters it: at 14px in `font-light` (300) the strokes are thin enough that legibility is worse than the number implies. WCAG's contrast model takes no account of stroke weight, so a passing ratio is a floor, not a verdict.

### A bug found underneath it

`text-foreground/72` **generates no CSS at all**. Tailwind only emits opacity modifiers on its scale, which runs in steps of 5; `/72` is not on it, so the utility is never created and the element falls back to inherited full-strength foreground. Confirmed against the production build: `dist` contains `/40 /55 /60 /75 /80 /85 /90` and zero occurrences of `foreground\/72`.

It is the most-used step in the repo, **165 call sites**, none rendering as written. `/44`, `/78` and `/92` have the same problem, one use each. In the competitive table this meant the strength column asked for 72% and rendered at 100%, flattening the row's hierarchy against the competitor name.

Fixing it globally would make 165 sites *dimmer*, which is the opposite of the reported complaint, so it was left alone and raised as its own task. A note above `accentColor` in `MotiModules.tsx` records the trap.

### The fix

Two places pair `/55` with `font-light` on running prose: the competitive gap column and the Principles "Ruled out" clause. Both moved to `/75` with `font-normal`. The competitive strength column moved off the dead `/72` to `/85`.

The row now reads as a real three-step hierarchy, all comfortably above AA:

| | Before | After |
| --- | --- | --- |
| Competitor name | 15.68 | 15.68 |
| Strength | 15.68 (asked for 8.32) | 11.37 |
| Gap | 5.23, weight 300 | 8.97, weight 400 |

Untouched: the 12px uppercase eyebrow labels ("WHY", "Version", "The frustration") still sit at `/55` = 5.23:1. They are a label role rather than prose, uppercase at 0.18em tracking, and raising them would shift hierarchy across every module. Worth a separate decision if they read weak too.

## Round six: Final Design layout (2026-09-04)

Malik: the WHY block in Final Design was "all over the place, not aligned well, not following grids or columns," and asked for a check of the rest of the page.

### What was wrong

Measured against the live DOM, not eyeballed. Three separate defects stacked on one cell:

1. **Rows drifted.** Each cell stacked title, phone, caption, rule, WHY, with the figure set to `flex-1` and the caption on `mt-auto`. Captions ran two or three lines and WHYs three to five, so the rule above WHY landed at a different y in the two cells of a row. Nothing across a row lined up except the titles.
2. **The seventh beat was a mess.** It spanned both columns with a single 400px phone centred in an ~900px cell and a `max-w-[60ch]` WHY hanging off the left edge: the only place on the page where that measure actually bound.
3. **Beats 04 and 06 showed a faint box behind the phone.** The five original mockups are RGBA with a transparent surround; the round-four composites had been saved RGB, so their black corners painted over the cell's `bg-secondary/10` tint. 01, 02, 03 and 05 did not.

Also confirmed: the content column is capped at 900px, so cells never exceed ~450px and the 400px `SCREEN_FIGURE_WIDTH` cap never binds inside a beat. The phone already spanned the cell; the horizontal issue was purely the centred house caption sitting above a left-flush WHY.

### The fix

`WorkflowBeatCell` was split into `BeatHeader`, `BeatFigure` and `BeatWhy`, and rebuilt on one rule: **every fixed-height part sits above every variable-height part.** Title is one line; every screen is 1105×2259, so at a given width they are all the same height; the caption is held to three lines with `[min-height:3lh]` on a wrapper carrying the caption's own type classes, so `lh` resolves against the right line-height. That puts the rule above WHY at the same y in both cells of a row. WHY, the only thing that varies, sits below the rule where variance is invisible. Verified: at 1440 the rules measure `9599/9599`, `10814/10814`, `12052/12052`; at 760 `8792/8792`, `9803/9803`, `10837/10837`.

`FigureCaption` stays centred. It is shared by NeuraLyfe, Oryne and Moti and centred by design, and since the phone spans the column a centred caption is centred on the phone.

The wide seventh beat now takes both grid columns **as two cells**: the screen in column one, its WHY in column two, separated by the same 1px rule that divides every other pair, with the WHY centred against the phone. On one column they stack, screen then WHY, in the same order as every other beat. `max-w-[60ch]` is gone.

The five composites were regenerated from the RGBA template so their surround is transparent like the originals. WHY text moved off the dead `/72` (see round five) to `/85`.

### The rest of the page

Every other section was captured at 1440 and reviewed. One layout flaw: **What It Proved** ended with the bolded consequence *below* the App Store button, because the button was baked into `MotiTakeaways`. Prose hanging under a pill as the page's last element. The button is now its own module, `moti-app-store-close`, placed after the close in the section body, so the section runs cards → consequence → button.

Not a layout flaw but noted: the two Intelligence diagrams carry their own baked-in footer sentence ("The SLM prepares structured understanding before planning begins.") beneath which a `FigureCaption` says nearly the same thing. Double captioning. Left for a content pass.

Highlights, The Problem, Competitive Analysis, Principles, Intelligence, Build Journey and Overview: no alignment defects found.

### Verified

`tsc` clean, `eslint` 0 errors, `vitest` 463 passed with the one unrelated pre-existing failure. The `projectDetailRefs` test covers the new registry key. No overflow at any width, no console errors.

## Round seven: the deferred items (2026-09-04)

Malik: "fix all." Everything deferred earlier in the session, taken as a set.

- **Eyebrow labels.** Every remaining `/55` in `MotiModules.tsx` (twelve: the WHY label, "Version", "The frustration", the version-block subtitles, the pending-slot label) moved to `/75`, 5.23:1 to 8.97:1, so they stay one weight. The template's page-level section eyebrow moved with them so Moti does not carry two eyebrow weights. That one line affects every case study's eyebrow; it is a pure legibility gain at 12px.
- **Double captions on the Intelligence diagrams.** Both images carry a baked-in footer sentence, and the `FigureCaption` under each said nearly the same thing. Each caption now tells the reader where to look in the diagram instead of restating its footer: the SLM's middle column that only understands, and the review/refine/adjust/learn loop under the LLM.
- **Orphaned assets.** `moti-ai.webp` (superseded by the recaptured picker) and `moti-app.webp` (the icon from the removed gallery) deleted. Every remaining `moti-*` asset is referenced.

Left alone on purpose: the dead `text-foreground/72` class, which Malik is resolving in a separate session, and the four facts only he can supply.

## Round eight: the WHY blocks go (2026-09-06)

Malik: the labelled WHY under each Final Design step is redundant. The reasoning should be carried by the sequence, so that seeing the next step tells the reader why the last one happened, rather than a block that says "Why".

He is right, and it was the last piece of "telling" on the page: a WHY paragraph under a screen is the same defect as a section that states a fact and stops. OryneFlow, the pattern Final Design borrows, has no prose in its step cells at all, number, screen, caption, and carries its story in the order and the captions.

### What changed

- `BeatWhy`, the `why` and `milestones` fields, the rule, the `[min-height:3lh]` caption wrapper and the split wide cell are all gone. A cell is number and title, the screen, the caption. Nothing else.
- **Every caption is rewritten as a link in a chain.** Each says what is on screen and what it leaves undecided, and the next step is the answer to that: the input is rough (01), so the sentence names a deadline but no deliverable and Moti asks one question (02); it flags what it inferred and offers a no (03); accepted pieces wait with a suggested project, none on the timeline yet (04); once accepted, work runs as streams with a percentage (05); a percentage cannot say whether the pace is realistic, so Moti asks how it feels at 25, 50, 75 and 100 percent (06); the check-ins feed a projection that names what is slipping and hands the decision back (07). Every caption was checked against its screen; beat 02 in particular asks about the *deliverable*, not the date, and the caption says so.
- The seventh beat is a normal cell again. The open eighth slot takes the module's one pull-quote, "A plan you can refuse is a plan you can trust," the way OryneFlow ends an act on a line, so the grid closes on the loop's thesis rather than on a blank cell.
- The section body no longer says "read the reasons"; the module lead is "Each step picks up what the one before it left undecided."
- The 25/50/75/100 milestone chips are gone as a widget; the fact moved into caption 06.

### Alignment holds, more simply

The caption is now the last element in the cell, so its length varies where nothing follows it. Phones in a row sit at the same y with no min-height trick. Measured at 1440 and 760.

Follow-up the same day: Malik asked what the pull-quote meant. It was trying to say that a plan you have no way to reject is one you stop trusting and tune out, which is why every Moti proposal carries a no (Dismiss, the Review inbox, Not this week). The metaphor "stop reading" did not survive without that explanation, so it is now the plain, positive form: "A plan you can refuse is a plan you can trust."

## Round nine: trimming Intelligence, Build Journey, What It Proved (2026-09-06)

Malik: trim these three, remove useless text, keep or add only the images that make it coherent.

The audit render had already shown the problem: Intelligence was 8,264px tall at 2x and said the architecture four ways (tier cards, a "why not one model" block, a pipeline text card, then the two diagrams that are the pipeline), plus a key-facts block restating the Settings screenshot. Build Journey opened on a twelve-rule spec card and closed on a one-line "outcome" card. What It Proved re-narrated Build Journey before its cards.

### What was cut

- **Intelligence.** Each tier's reason folded into its card, so the "Why Not One Model" block is gone. The pipeline text card is gone; the two diagrams are the pipeline. The "Where the Key Lives" block is gone; the Settings caption now carries the one fact that matters (the LLM key stays in the Keychain on the device). The section body's second paragraph, which duplicated that block, is gone. What remains: lead, three cards, two diagrams, one screen, close. 5,454px.
- **Build Journey.** The spec card (`MotiSpecFirst`, twelve rules in three rows) is gone; the spec-first claim is one sentence in the body. Each version block keeps two lines. The "What Shipped" card is gone; the App Store button at the end of the page is the outcome. `testFlightNotes` stays as the slot-C mechanism, still rendering nothing until filled. 2,456px.
- **What It Proved.** The lead is one sentence, the bet itself; the three-sentence recap of Build Journey is gone. Card descriptions trimmed to one line each. 1,526px.

### Images

None added. Everything captured this session is already placed, and the one unused capture (the seeded five-stream projection) carries the 9:41 clock. The assets that make Intelligence coherent are the two architecture diagrams and the Settings screen, and they are the section now.

### Verified

`tsc` clean, `eslint` 0 errors, `vitest` 463 passed with the one unrelated pre-existing failure. No unused imports (`CheckCircle2` removed with the card that used it), no orphaned symbols, no overflow at any width, no console errors.

## Round ten: the joints (2026-09-06)

Malik: make sure the connections between sections hold, so it reads as a whole.

Read in order off the rendered page. The argument held section to section; the defects were at the joints, where rounds of trimming and rewriting one section at a time had left referents dangling. Seven one-sentence fixes:

1. **Overview** said a sentence "comes back as work on a timeline," which Highlights ("not one of them filed") and beat 04 (Review) contradict, and said *say* where Highlights says *type*. Now: "Say it or type it, and it comes back as work already sorted by project, waiting for your yes." True to the loop, and it seeds the refusal thread in the first sentence.
2. **Competitive** opened on "five answers to the same question" without naming it. Now "Five tools answer that middle step five different ways," picking up Problem's close.
3. **Competitive** closed on "clarity and momentum," words the page never set up. Now "The gap is not capture. It is the step after: understanding what arrived, and keeping it moving." Same vocabulary as the thesis, and "keeping it moving" sets up Momentum Tracking and the pace beats.
4. **Principles** said "a planner already on the market"; each quote is pinned by brand mark to one of the five tools just tabled, so it now says so.
5. **Intelligence** closed on "the middle step this page opened on." The page opened on Overview; Problem introduced the step and said it "has no owner." Now "Understanding is the step nobody owned."
6. **Build Journey** opened cold after the tiers and never said the versions are the tiers, though V0, V1 and V1.1 are titled Rule-Based, Foundational Model, and Constraining the Understanding Layer. Now: "All three tiers were in the spec before any code existed… What no spec could settle was how far to trust the model. The three versions below are that question, answered with real builds." That is the historically true version: the tiers were specified; trust was not.
7. **Proved** opened on "the bet under all of this" with no link to the versions it follows. Now "Three versions later, the bet held."

Threads now run end to end without a gap: *understanding* (Highlights quote → Problem's "step nobody owns" → Intelligence close → Proved), *refusal* (Overview's "waiting for your yes" → Principles → Final Design's quote and close → Proved's "a proposal you answer"), and *the versions* (Highlights' "got wrong twice" → Build Journey → Proved's "three versions later").

## Round eleven: highlights on the key decisions (2026-09-06)

Malik: add highlights on the key things or key design decisions.

Every sibling case study uses the same Highlights anatomy, chips then pull-quote then artifacts, and the chips are the scannable key things (Aura: "Proactive, not reactive", "Sense → predict → support"). Moti's chips were the one place spending that slot on credentials ("Live on the App Store", "Built solo with Claude + Codex", "SLM + LLM hybrid intelligence", "Spec-first: full PRD before any code"), all of which the meta cards, the button and Build Journey already state.

The chips are now the five design decisions that define Moti, in story order, each traceable to the section that makes it:

| Chip | Where it is decided |
| --- | --- |
| Understanding gets its own model | Intelligence close |
| Asks instead of guessing | Beat 02, Final Design close |
| Every proposal can be refused | Beats 03, 04, 07, the grid quote |
| Pace, not task counts | Principles row 04, beats 05 and 06 |
| Three tiers, and you pick which runs | Settings, Intelligence cards |

No new list, no new component: a skim of the chips and then the bolded section closes now reads the whole argument. "Rules own the dates" was considered and rejected for the same reason the round-two audit scoped the tier copy: in LLM mode the model handled "before June 25" itself, so the unscoped claim would be false.
