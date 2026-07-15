# Interactive Design-System Specimens

## Goal

Give every public Component and Pattern reference page a visual, interactive
specimen so the design system demonstrates the portfolio's behavior as well as
documenting it. The reference must stay restrained and focused: specimens make
one production behavior legible at a time rather than becoming a second
portfolio or a generic component catalog.

## Build location and scope

Build this work on the `codex/design-system` branch in
`/Users/malik/.codex/worktrees/malik-portfolio-design-system`. The primary
portfolio worktree and its `codex/fix-mobile-about-layout` branch do not
contain these reference files.

### Included

- A `Live specimen` region on each Component and Pattern page, positioned before
  written guidance.
- Seven component demonstrations: Site header, Project card, Project list,
  Metadata card, Media frame, Footer, and Image lightbox.
- Seven pattern demonstrations: Homepage hero, Case-study structure, Section
  navigation, Responsive behavior, Loading & transitions, Expressive visuals,
  and Accessibility.
- Real local interaction where it conveys the documented behavior: hover/focus,
  selected navigation state, responsive comparison, open/close lightbox,
  replayable transitions, and keyboard focus.
- Contained motion that mirrors the existing portfolio's visual language and
  local implementation values.
- A stable reduced-motion state for every animated specimen.

### Excluded

- Screenshots or iframes of portfolio pages.
- Public token controls, draft editing, publishing, or other Admin capabilities.
- Network navigation from inside a specimen.
- Duplicating full production routes or recreating every portfolio feature.
- New dependencies, source token changes, or changes to the GitHub publishing
  boundary.

Extracting an existing inline metadata summary and `SectionFigure` from
`ProjectDetailTemplate` into small shared production components is explicitly
in scope. It removes drift for the two entries already documented as components
and keeps their live reference specimens backed by the same code used in case
studies.

## Visual direction

Specimens use the reference's dark canvas, thin ruled boundaries, General Sans
for interface content, and JetBrains Mono for technical labels. Each is a
full-width contained stage with a quiet header:

- `Live specimen` label
- a one-line description of the interaction to inspect
- an optional compact control only when a state cannot be revealed naturally

The stage must look like an evidence window into the production system. It
should not look like a colorful dashboard, a collection of isolated controls,
or a second navigation system. Each stage keeps a deliberate max height and
uses `overflow-hidden` so that small viewports remain stable.

## Architecture

Extend the current `Specimen` semantic region with a visual-stage slot,
supporting description, optional controls, and an explicit reduced-motion-safe
state. A page has one `Live specimen` landmark: the visual stage and the
existing `View … in context` link are children of that same region, with the
link presented as a quiet footer after the stage. Create two focused renderers:

- `ComponentSpecimen` receives one component section id and renders a local,
  non-navigating demonstration.
- `PatternSpecimen` receives one pattern section id and renders its local
  demonstration.

`ComponentContent` and `PatternContent` render their respective visual
specimen ahead of Guidance and token dependencies. The existing external
`View … in context` link remains below the visual stage as a route to the full
production artifact.

`ProjectMetadataSummary` and `ProjectMediaFrame` are first extracted from
`src/components/project-detail/ProjectDetailTemplate.tsx` into exported shared
components, then used both by the production template and their design-system
specimens. The visual stage for `component-lightbox` uses a local thumbnail
trigger but mounts the existing `ImageLightbox` production component. The
overlay deliberately remains full viewport, because that is the behavior being
documented; it is not constrained inside the specimen stage.

Specimen data lives alongside the renderer rather than expanding the existing
documentation records into a mixed content-and-UI structure. Every public
section retains its current hash, title, token list, written guidance, and
reference navigation.

## Component demonstrations

| Component | Live behavior |
| --- | --- |
| Site header | Direction-aware compact nav; focus/hover reveal and a subtle entrance replay. |
| Project card | Image-led card with overlay, metadata, and hover/focus elevation. |
| Project list | Two selected-work cards that reflow from paired to stacked layout. |
| Metadata card | The extracted production `ProjectMetadataSummary` with long-content wrapping. |
| Media frame | The extracted production `ProjectMediaFrame` with caption and frame boundaries. |
| Footer | Secondary link cluster and reference discovery state without a duplicate page landmark. |
| Image lightbox | A local thumbnail trigger opening the production full-viewport `ImageLightbox`; Escape and Close restore focus. |

## Pattern demonstrations

| Pattern | Live behavior |
| --- | --- |
| Homepage hero | Compact terminal statement with a decorative, reduced-density DotGrid-inspired field. |
| Case-study structure | Ordered narrative modules showing prose/media rhythm. |
| Section navigation | Desktop rail and compact mobile-strip representation with selectable active sections. |
| Responsive behavior | Side-by-side compact/wide card composition that switches representation without changing page viewport. |
| Loading & transitions | Replayable content arrival sequence; reduced-motion version displays immediately. |
| Expressive visuals | Decorative animated field with a pause/replay affordance and a static reduced-motion state. |
| Accessibility | A labeled three-control focus path; Tab and Shift+Tab move visibly through it while a live status label announces the focused step. |

## Interaction and motion

- Use semantic buttons and links for interactive elements, with visible focus
  rings and 44px minimum targets where a specimen exposes a control.
- Use local React state only; no interactions write to localStorage, mutate
  tokens, or navigate the portfolio.
- Hover interactions also have focus-visible equivalents.
- Motion mirrors the actual portfolio's local Framer Motion/CSS values; it does
  not consume duration or easing tokens because production components do not
  consume them today. This keeps the existing `Current wiring gap` notes true.
  Motion is limited to opacity and transform, normally 180–240ms for these
  contained demonstrations. Ambient expressive movement may run at a slower
  cadence only inside its stage.
- `useReducedMotion` disables nonessential motion and renders the meaningful
  final state. The replay/pause control remains usable but becomes a no-op or
  resolves instantly under reduced motion.
- The lightbox must be keyboard-operable, lock interaction to its local dialog,
  dismiss with Escape/Close/backdrop, and restore focus to its trigger.

## Responsive behavior

- At 320px, every stage is one column, never horizontally scrolls, and keeps
  text readable without clipped controls.
- At tablet and desktop sizes, specimens can use paired cards, rails, and
  wider media frames to demonstrate layout relationships.
- Visual stages have an intentional minimum height but no fixed height that
  clips text when user font scaling is applied.

## Delivery priority

### P0 — first complete, reviewable slice

- Project card hover/focus state.
- Image lightbox using the production overlay.
- Section navigation active-state interaction.
- Loading & transitions replay and reduced-motion stable state.
- Shared `Specimen` visual-stage API and match-media test helper.

### P1 — complete reference coverage

- Site header, Project list, extracted Metadata card, extracted Media frame,
  Footer, Homepage hero, Case-study structure, Responsive behavior, Expressive
  visuals, and Accessibility focus path.

The release is complete only when P0 and P1 are present. P0 is a useful
checkpoint if implementation is interrupted; it covers the most behavior-rich
pages a hiring reviewer is likely to inspect.

## Testing and verification

- Add renderer tests for every component and pattern specimen: correct visual
  stage, semantic controls, and no public editing/iframe capabilities.
- Test key interactions: project-card focus state, section-nav selection,
  responsive comparison switch, transition replay, expressive pause, and
  lightbox open/Escape/focus restoration.
- Add `setReducedMotionPreference(matches: boolean)` to the test setup. It
  replaces the current fixed-false `matchMedia` stub for a single test and is
  reset after each test, allowing each animated specimen's stable
  reduced-motion state to be asserted.
- Update the existing content tests because the live specimen moves from the
  final region to the first region of each Component and Pattern page.
- Run the existing full test suite, typechecks, lint, production build, token
  drift checks, and sitemap validation.
- Perform browser QA at 320px, 768px, 1440px, and 1920px for representative
  components and patterns, including keyboard navigation and console errors.

## Acceptance criteria

- Every Component and Pattern page begins with a visible visual specimen.
- Every Component and Pattern page contains one `Live specimen` region with a
  visible visual stage before its Guidance grid.
- Each of the following interactions has a test: project-card focus state,
  production lightbox open/Escape/focus restoration, section-navigation
  selection, responsive comparison switch, transition replay,
  expressive-motion pause, and accessibility focus-path status.
- The public reference has no Admin/token-authoring controls, iframe, or
  publishing access beyond the existing unlisted Footer Admin entry.
- Every specimen with motion has an explicit test asserting its
  reduced-motion stable state.
- All visual stages are usable without horizontal overflow at the target
  breakpoints.
