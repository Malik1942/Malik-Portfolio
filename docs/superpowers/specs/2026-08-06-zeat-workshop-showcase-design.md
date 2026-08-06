# ZEAT Workshop Showcase Design

**Goal:** Add ZEAT — a stadium cleaning robot, and the only industrial design work in the
portfolio — to the Workshop section as a tagged, full-weight case study.

## Scope

Workshop currently holds three projects, all software built solo with AI tools, rendered as a
uniform two-column grid at 88% opacity. ZEAT is a different kind of object: a hardware system
with CAD renders, a mechanism story, field research, and a companion app. It joins Workshop
rather than Selected Work, distinguished by an `Industrial Design` tag.

This spans the homepage section, the card component, the hero canvas, and a new case study
document. It must not alter Selected Work, and must not touch the hero dot → project arrival
animation chain that `CLAUDE.md` protects.

## Decisions

**Placement.** ZEAT sits in Workshop, tagged, as a full-width hero row above the existing grid.
Two alternatives were rejected: making it one more grid card (a thesis-scale hardware system at
thumbnail scale and 88% opacity), and splitting Workshop into two labeled tracks (real structure
built for a single project). The hero-plus-grid shape upgrades to two tracks cheaply when a
second industrial design project lands — the tag is already doing the labeling.

**Tagging.** A general `tag` field on `Project`. Only projects that set it render a chip. ZEAT
sets it; the three AI projects do not, because they already carry `Built with {builtWith}` on the
metadata line and a chip would say the same thing twice. The distinction reads through contrast.

**Register.** Case study copy is rewritten in English, not translated. The source deck is a
graduation thesis: it leads with nominalized subsystem lists and closes on abstract benefit
claims. Portfolio copy leads with the constraint and makes design decisions legible.

## Architecture

### Data model

Two optional fields on `Project` in `src/components/ProjectList.tsx`:

```ts
/** Renders an uppercase eyebrow chip above the card title. */
tag?: string;
/** Renders this project as a full-width hero row above its section's grid. */
sectionHero?: boolean;
```

Both are additive and optional, so every existing project entry stays valid unchanged.

`sectionHero` is declarative rather than positional. `MainProjectList` selects its heroes by
index (`projects[0]`, `[1]`, `[2]`), which silently reassigns hero status if the array is ever
reordered. Workshop should not inherit that coupling.

### Tag chip

The chip renders inside `ProjectCard`'s text block, above the title, as an uppercase eyebrow
using the existing `tracking-eyebrow` treatment that `SectionLabel` already uses. Both card
layouts — the vertical grid card and the horizontal/`imageRight` hero row — render it.

It does not render as a badge over the media. That position is already occupied by the
`In Progress` badge at `left-3 top-3`, and stacking two chips there reads as clutter.

### Workshop layout

`AIProjectList` partitions its `projects` array on `sectionHero`. Flagged projects render above
the grid via `ProjectCard` with `horizontal` (image left, text right); the remainder render in
the existing `TwoColGrid`. No new card component — `ProjectCard` already accepts every prop this
needs.

The `opacity: 0.88` wrapper currently at `ProjectList.tsx:618` moves from the section wrapper
onto the `TwoColGrid` only. Workshop keeps its secondary feel; the hero row reads at full
strength.

`sectionSubtitle` is destructured as `sectionSubtitle: _unused` and never rendered — dead since
before this change. It is removed from `ProjectListProps` and from both call sites in
`src/pages/Index.tsx`. Workshop's framing lives in its section label; a third line of framing
text under it would be noise.

### Hero canvas

One entry added to `ORB_DEFS` in `src/components/DotGrid.tsx`:

```ts
{ label: "ZEAT", subtitle: WORKSHOP_SECTION_LABEL, color: "gold" as const, rx: ?, ry: ?, mrx: ?, mry: ?, id: "zeat" }
```

Coordinates are selected during implementation against the existing exclusion-zone helpers, not
guessed here. The constraints: the desktop position must not collide with the eight current orbs
or the centered title cluster; the mobile position must not collide with the top band
(0.14 / 0.21 / 0.28 / 0.35, all four slots occupied) or the lower band (0.64 / 0.72 / 0.80 /
0.88, all four occupied), which means mobile needs a genuinely new slot rather than a fifth entry
squeezed into a full band. Acceptance is a passing exclusion check plus visual confirmation at
both breakpoints.

This is a data entry only. `scrollToProjectCard`, `scrollToTarget`, the `project-dot-arrive`
event, and the `.project-row-arriving` keyframes are not touched — `CLAUDE.md` records that this
chain has been broken silently twice.

## Copy

Card fields:

- **`signal`** — `Autonomous Grandstand Cleaning Between Events`
- **`description`** — `A cleaning robot for stadium grandstands — designed around the eight-hour gap between events, when three tons of trash have to disappear.`
- **`role`** — `Industrial Designer`
- **`year`** — `2025`
- **`tag`** — `Industrial Design`

Case study opening:

> A large stadium hosts twenty to thirty matches and a dozen concerts a year. Each one leaves
> three to four tons of trash behind, and the building has eight to twelve hours to be clean
> again before the next crowd arrives. Today that gap is closed by people — dozens of them,
> overnight, at a cost that shows up as one of the largest lines in a venue's operating budget.
>
> ZEAT is a ground-based cleaning robot built for that window. It runs the aisles between seat
> rows, sweeps and vacuums the floor, and reaches onto seat surfaces with an articulated arm to
> collect what the crowd left. A deformable wheel set lets it cross grandstand steps instead of
> being trapped on one tier, and a dispatch app assigns it zones by how dirty they actually are.

The ideation section carries the decision that turns a product description into a case study:

> Two other structures got there first and were rejected. One rode the seat backs like a rail;
> one hung from track above the stands. Both cleaned well. Neither could cross a step, and
> neither worked in a seating layout it wasn't built for. Going to the ground cost complexity and
> bought the machine the run of the building.

**No claim enters the copy that cannot be traced to the source deck.** ZEAT holds no patent. The
patent appearing on the technology-survey frame is prior art reviewed during research and is
framed as such — a competent prior-art scan is a legitimate research artifact, and presenting it
as the project's own would be a fabrication.

## Case study document

A `ProjectDetailDocument` in `src/data/projectDetails.ts`, `slug: "zeat"`,
`listSection: WORKSHOP_SECTION_LABEL`. It reuses the existing template — no new modules.

| Section | Content |
| --- | --- |
| `intro` | `introBlock`: opening paragraph, hero render, info cards, what I did |
| `context` | Events per year, tonnage per event, the 8–12 hour window, labor as an operating-budget line |
| `research` | Field research, seat survey, interviews, questionnaire, common trash types, competitive and prior-art scan |
| `users` | Persona, pain points converted to design points |
| `ideation` | Three structures, their pros and cons, why ground-based won |
| `final-design` | Dimensions rationale, four-wheel tank turn, underbody layout, compaction, articulated arm, stair crossing |
| `base-station` | Self-cleaning base station |
| `system` | Dispatch app — calendar, floor-plan heat zones, device management |
| `reflection` | What would change, and the labor-displacement tradeoff recorded in the original concept evaluation |

The `system` section ships as description only. Its three source screens are 675–733×1381 renders
with Chinese UI text baked into the image, which does not survive translation. Rebuilding them in
English is deferred to separate work; the section is written so it reads complete without them.

## Assets

Masters were pulled from the source Figma file into `zeat-assets/img/` — 84 unique PNG/JPEG,
75 MB, after deduplicating by content hash and dropping sub-400px icons and UI chrome. That
directory is gitignored. Only converted derivatives ship.

Roughly fourteen images are selected, resized, and converted to WebP into `src/assets/` as
`zeat-*.webp`, matching the existing `aura-*` / `moti-*` convention. The six hero-grade renders
are 3840×2159 and named on inspection: `product-hero-34` (case study hero), `product-side-profile`,
`product-topdown-arm`, `product-intake-detail`, `product-arm-closeup`, and
`context-grandstand-linedrawing`.

The three app screens (`s47-ui-01`, `s91-ui-01`, `s92-ui-01`) are explicitly excluded from this
change.

## Change Set

- `src/components/ProjectList.tsx` — add `tag` and `sectionHero` to `Project`; render the tag chip in both card layouts; partition on `sectionHero` in `AIProjectList`; move the opacity wrapper onto the grid; remove `sectionSubtitle`.
- `src/pages/Index.tsx` — add the ZEAT entry to `aiProjects`; drop both `sectionSubtitle` props.
- `src/components/DotGrid.tsx` — one `ORB_DEFS` entry.
- `src/data/projectDetails.ts` — the ZEAT document.
- `src/assets/zeat-*.webp` — converted imagery.
- `.gitignore` — ignore `zeat-assets/`.

## Testing

Following the existing vitest patterns:

- The tag chip renders when `tag` is set and is absent when it is not.
- `sectionHero` places ZEAT in the hero slot and leaves the remaining projects in the grid.
- The dimming wrapper encloses the grid and not the hero row.
- ZEAT's dot → card arrival fires `project-dot-arrive` and applies `.project-row-arriving`, extending the guard in `src/components/projectDotArrival.test.tsx`.

## Non-Goals

- No change to Selected Work, its projects, or its layout.
- No change to Tubular, which stays as it is.
- No modification to the scroll or arrival animation chain.
- No English rebuild of the app screens.
- No PNG masters committed to the repository.
