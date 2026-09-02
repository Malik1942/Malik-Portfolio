# Homepage Tiers: Selected Work / More Work / Workshop

**Status:** Decisions approved by Malik in chat on 2026-09-02. This file is the handoff for implementation. Open items are listed at the end and must be answered by Malik before the code that depends on them is written; everything else is locked.

**Goal:** A recruiter opening malikzhang.com should know within one scroll which 4 projects matter, see that Malik ships real things, and see that his range (industrial design, physical prototyping, AI-native software) is backed by case studies. Today the homepage shows 11 projects at nearly equal weight, the hero has 11 labeled dots with no hierarchy, and the two sections mix two organizing rules (Selected Work is by importance, Workshop is by tool), which is why ZEAT and RANGER read as misfiled.

## Principles (locked)

1. **One organizing axis for sections: scale and narrative focus.** Selected Work is full case studies. More Work is full-scale design projects whose story is the process. Workshop is small solo-built things whose story is the artifact. The test for a project: "when someone clicks, are they mainly looking at the process or at the thing?" Process goes to More Work, thing goes to Workshop.
2. **"Shipped" is an attribute, never a section.** Moti (Selected) and CalmMouse (Workshop) are both shipped. Shipped status is shown as an outbound link chip on the card metadata in any section, never as a section name or a tag.
3. **Skill tags are a second facet on the card, not a third section.** Sections answer "how deep", tags answer "which skills". Controlled vocabulary, max 3 per card.
4. **No dead cards.** Every card on the homepage is clickable. A project that cannot be opened is not shown. The `wip` non-clickable pattern is retired.
5. **Hierarchy is carried by density and brightness, not by hue or labels.** Selected Work cards are large and editorial. More Work is a uniform dimmed grid. Workshop is a denser, smaller, uniform tile grid. Hero dots: 4 bright, 5 dim, 0 for Workshop.
6. **One source of truth for sections.** Nav, footer, section eyebrows, case-study `listSection` eyebrows, hero dot subtitles and project grouping all derive from a single `SECTIONS` definition. Today the same label is hand-written in at least five places ("Main Projects" in the dot canvas and `projectDetails.ts` vs "Selected Work" in the nav), which is how they drifted.

## Sections and assignments (locked)

| Section | Eyebrow | Nav | Hero dots | Projects (order) |
|---|---|---|---|---|
| `selected` | Selected Work | yes | bright red, labeled | NeuraLyfe, Spatial Editor, Moti, Aura |
| `more` | More Work | no (footer only) | dim gold, label on hover | ZEAT, RANGER, Mood Muse, Tubular, FlowPrint |
| `workshop` | Workshop | yes | none | CalmMouse, Inkwork, Studio Waters, robot arm (new), Oryne (see open items) |

Notes:
- Order inside Selected Work matches the Sep 2026 resume exactly (NeuraLyfe, Spatial Editor, Moti, Aura). Spatial Editor has no case study yet; until it exists, Selected Work shows 3 (see open items for the fourth slot). Do not pad with a WIP card.
- Tubular is an MHCI+D project, not industrial design. It sits in More Work because it is full-scale, not because of discipline.
- FlowPrint and Tubular already have documents in `src/data/projectDetails.ts`; unlock them (drop `wip`) so their cards link to those pages.
- Nav stays four items: Selected Work, Workshop, About, Resume. Same count as today; only Workshop's contents change. More Work is reached by scrolling and is listed in the footer.
- Footer "Explore" becomes the full table of contents: Selected Work, More Work, Workshop, About, Resume, Design System.
- Section subtitles (`sectionSubtitle`) are currently accepted and ignored by `ProjectList`. Either render them or delete the prop; do not leave the dead prop.

## Data model (locked)

Create `src/lib/sections.ts` and make it the only place section identity lives. Replace `src/lib/sectionLabels.ts` (currently exports only `WORKSHOP_SECTION_LABEL`) with this, keeping a re-export of `WORKSHOP_SECTION_LABEL` only if a one-step migration is simpler.

```ts
export const SECTIONS = {
  selected: { id: "projects",  label: "Selected Work", nav: true,  dots: "bright" },
  more:     { id: "more-work", label: "More Work",     nav: false, dots: "dim" },
  workshop: { id: "workshop",  label: "Workshop",      nav: true,  dots: "none" },
} as const;
export type SectionKey = keyof typeof SECTIONS;
```

Note the DOM id for `selected` stays `projects` so existing `#projects` links, `scrollTo: "projects"` router state and the scroll indicator keep working. The `ai-projects` id is retired in favor of `workshop`; grep for it.

Replace the two exported arrays in `src/pages/Index.tsx` (`selectedWork`, `aiProjects`) with one array in a data module (suggest `src/data/projects.ts`), and update `MoreProjects.tsx`, which currently imports the arrays from the page. Each entry carries:

```ts
section: SectionKey;
skills: Skill[];                 // 0 to 3, from the controlled vocabulary
links?: { label: "App Store" | "GitHub" | "Live"; url: string }[]; // shipped chips
destination:
  | { kind: "case-study" }                       // routes to /project/:id
  | { kind: "video"; src: string; poster: string } // opens an in-place lightbox, no route change
  | { kind: "external"; url: string };           // leaves the site
```

Remove from `Project`: `sectionHero`, `tag`, `wip`, `builtWith` as a free string (fold "Built with Claude Code" into either a skill tag or the metadata line; pick one and apply it to every Workshop card), and `externalUrl` (subsumed by `destination`).

Skill vocabulary, as a TS union so a typo fails typecheck. Words match the Sep 2026 resume so the site and the resume use the same terms:

```ts
export type Skill =
  | "Data-Dense UI" | "Interaction Design" | "User Research" | "Prototyping in Code"
  | "AI-Native" | "Industrial Design" | "Physical Prototyping" | "Visual Design"
  | "Design Systems" | "iOS / SwiftUI";
```

Malik may trim or rename entries (open item), but the cap is 12 and every word must appear on the resume or be added to it.

`src/types/projectDetail.ts` currently defines `ListSection` as a hand-written union ("Main Projects" / "Personal Project" / Workshop). Derive it from `SECTIONS[...].label` and set each document's `listSection` from the project's `section`, so the case-study eyebrow can never disagree with the homepage.

## Hero dots (locked, and see CLAUDE.md)

- Dots are generated from the project list: every project whose section has `dots !== "none"`. That is 4 bright + 5 dim = 9 orbs, down from 11 hand-listed.
- Bright orbs: current red treatment, label always visible, subtitle = `SECTIONS.selected.label` (this fixes the current "Main Projects" subtitle).
- Dim orbs: smaller radius, lower alpha, no breathing or reduced breathing, label and subtitle drawn only while hovered. On mobile (< 768) dim orbs draw as slightly brighter background stars with no label at all; if they still crowd the two-column mobile layout, drop them from mobile entirely rather than shrinking the bright four.
- The `rx/ry/mrx/mry` coordinates stay a hand-tuned table keyed by project id (`ORB_POSITIONS`), since they are art direction. The table must contain exactly the ids that have dots; add a test.
- **Do not touch the dot-click scroll and arrival pulse.** `scrollToProjectCard` → `scrollToTarget` → `project-dot-arrive` → `.project-row-arriving` stays exactly as documented in CLAUDE.md. Dim orbs must route through the same handler. Run `projectDotArrival.test.tsx` and `dotGridSize.test.ts` before and after.

## Layout (locked)

**Selected Work.** Keep the current editorial treatment: full-width alternating image-side rows, signal line, description, metadata. All 4 (or 3) are hero rows; no grid tail in this section. Section stays bright (no opacity wrap).

**More Work.** Uniform 2-column grid using the existing `TwoColGrid` rhythm (alternating aspect, right-column stagger, parallax), wrapped in the current 0.88 dimming. No `sectionHero` rows: ZEAT and RANGER lose their full-width treatment, which is the point. No signal line. Metadata line: role, year, then up to 3 skill chips.

**Workshop.** A new, denser variant that reads as a different kind of thing without a label:
- Desktop 3 columns, mobile 2 columns. Equal-size tiles, square or 4:3. No stagger, no parallax, no alternating aspect. Those rhythms are reserved for case-study sections.
- Tile content, three layers only: cover (keep the existing hover/arrival reel behavior from `CardMedia` for CalmMouse and Inkwork), title plus one line, one metadata line. Type one step smaller than More Work.
- Metadata line: link chips first ("App Store ↗", "GitHub ↗", "Live ↗", each an `<a target=_blank>` with `stopPropagation`), then up to 2 skill chips, then year.
- Dim by size and type, not by an extra opacity layer stacked on 0.88; pick one. Hover video over stacked dimming looks muddy.
- Corner glyph in the top-left slot where the "In Progress" chip lives today, derived from `destination.kind`: nothing for `case-study`, a small ▶ for `video`, a small ↗ for `external`.
- Click behavior by `destination.kind`: `case-study` routes to `/project/:id` (whole tile is a `<Link>`, as today via `CardLink`); `video` opens an in-place lightbox (full-size video, one caption line, optional link chips, Escape and click-outside close, scroll position preserved, focus returned to the tile); `external` is a plain `<a target=_blank rel=noopener>`. Do not create one-video detail pages just to make every tile route somewhere.

**Skill chips** (all sections): small, uppercase-tracked or plain, low-contrast (around the current `text-foreground/60`), rendered after role and year, never above the title. The old `tag` eyebrow slot above the title is removed.

## Derived surfaces checklist

Every one of these must read from `SECTIONS` or the project list after this change. Grep for the literals `"Main Projects"`, `"Selected Work"`, `"Workshop"`, `"ai-projects"`, `WORKSHOP_SECTION_LABEL`, `selectedWork`, `aiProjects`, `sectionHero`, `wip`, `builtWith`, `externalUrl` and resolve each hit.

- `src/components/SiteHeader.tsx` desktop and mobile nav (items where `nav: true`, plus About and Resume)
- `src/components/Footer.tsx` Explore column (all sections, plus About, Resume, Design System)
- `src/pages/Index.tsx` section rendering and `navigateToSection` targets
- `src/components/ProjectList.tsx` section eyebrows and variants
- `src/components/DotGrid.tsx` orb list and subtitles
- `src/data/projectDetails.ts` `listSection` on every document
- `src/components/project-detail/MoreProjects.tsx` (imports from the page today)
- `src/components/project-detail/ProjectDetailTemplate.tsx` header nav callbacks
- `public/sitemap.xml` if any section anchors are listed
- OG image regeneration (`scripts/generate-og.mjs`) if the hero composition changes visibly

Naming collision to resolve: the case-study page already has a related-projects strip titled "More work" (`MoreProjects.tsx`). With a homepage section named More Work, rename the strip to "Next up" so the two never share a name.

## Tests to add

- Every project has a valid `section`, 0 to 3 `skills`, and a `destination`.
- `ORB_POSITIONS` keys equal exactly the set of project ids whose section has dots.
- Every `nav: true` section id exists as a DOM id on the homepage.
- Every `projectDetails` document's `listSection` equals the label of its project's section.
- Existing: `coverAspect.test.ts`, `projectDotArrival.test.tsx`, `dotGridSize.test.ts`, `coverVideoPlayback.test.tsx` all still pass.

## Out of scope

- Any change to the dot-click scroll animation (CLAUDE.md).
- A separate `/playground` route. Revisit only when Workshop holds more than 6 pure experiments; at that point the experiments split out as Playground and Workshop keeps the shipped software.
- A "Featured" or "Shipped" tag. Featured is the section; shipped is the link chip.
- Clickable tags that filter projects. Maybe later.
- Rewriting case-study content.

## Open items for Malik (answer before the dependent step)

1. **Hero one-liner vs resume positioning.** The resume now says "turns dense, technical data into interfaces people can act on in seconds, prototyping in code alongside engineers and researchers." The site still says "AI-native product designer. I find the real problem, decide where AI belongs, and build it end to end." Pick one direction; the Selected Work `signal` lines get rewritten to match (for example NeuraLyfe from "Brain Impact Visualization" toward "helmet data to a sideline decision in seconds"). Blocks: signal copy only; structure work can proceed.
2. **Oryne placement.** Workshop with an App Store chip now, or More Work once a process-oriented case study exists. Blocks: Workshop tile list.
3. **Fourth Selected Work slot until Spatial Editor ships.** Run with 3, or temporarily promote Aura's neighbor (Mood Muse if targeting hardware-software teams, otherwise keep 3). Blocks: nothing; default is 3.
4. **Final skill vocabulary.** Confirm or edit the 10-word list above. Blocks: tag data entry.
5. **Robot arm assets.** Video file, poster, and whether it has a GitHub link. Blocks: its Workshop tile.

## Suggested order

1. `sections.ts`, single project array, `Skill` and `destination` types, migrate data, tests. No visual change yet; nav and eyebrows now derive.
2. Regroup: unlock FlowPrint and Tubular, move ZEAT/RANGER/Mood Muse to More Work, drop hero rows there, Selected Work to the resume order.
3. Workshop tile variant, link chips, corner glyphs, video lightbox.
4. Skill chips on all cards.
5. Hero dots: derive from projects, bright/dim tiers, mobile behavior. Run the dot arrival tests last.
6. Footer, sitemap, OG image, "Next up" rename on case-study pages.
