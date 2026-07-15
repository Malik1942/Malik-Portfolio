# Design System Reference Simplification

**Date:** 2026-07-15  
**Status:** Approved direction; implementation pending  
**Supersedes:** The public-workbench presentation in `2026-07-14-portfolio-design-system-design.md`. The token compiler, runtime, authenticated GitHub PR endpoint, and publishing security boundary remain valid.

## 1. Problem

The public Playground exposes the token implementation rather than explaining the design system. Its Color category alone renders 36 fieldsets and produces a panel almost 10,000 pixels tall. Semantic colors, primitive colors, sidebar compatibility tokens, component tokens, aliases, and four numeric HSL channels all appear with equal visual weight. Typography inherits the same catalog structure.

This is accurate as internal tooling but weak as a portfolio artifact. Visitors need to understand the hierarchy, character, and production use of Malik's system. They do not need to operate every token.

## 2. Decision

Remove Playground from the public information architecture. Do not rename the existing workbench and preserve its contents. Replace its public value through three focused changes:

1. Curated, non-editable Color and Typography foundation presentations.
2. A Component Lineup inside the Components group.
3. Small, component-specific state demonstrations only where they clarify real production behavior.

The existing Footer Admin entry remains. It opens an unlisted authoring surface for Malik; the publish endpoint remains the only server-enforced security boundary. No public navigation, foundation page, component page, or pattern page exposes token editing.

## 3. Success criteria

- The Start group contains only Overview.
- No public section is named Playground, Workbench, Lab, or Editor.
- A visitor never encounters numeric color inputs, production/draft labels, token reset/export actions, contrast diagnostics, or an embedded full-site preview.
- Color can be scanned by semantic purpose without opening disclosures.
- Typography communicates family, scale, and weight through live specimens in one coherent reading flow.
- The Components group begins with a compact lineup of the seven components that exist in the portfolio.
- Each component page shows purpose, usage, responsive behavior, accessibility, dependencies, and a truthful production example or relevant state demonstration.
- Admin token editing and pull-request publishing remain reachable from the footer and remain absent from the public section registry.
- The design remains usable at 320px, tablet, desktop, and ultrawide widths.

## 4. Public information architecture

### Start

- Overview

### Foundations

- Color
- Typography
- Spacing & layout
- Radius & borders
- Motion

### Components

- Component lineup
- Site header
- Project card
- Project list
- Metadata card
- Media frame
- Footer
- Image lightbox

### Patterns

The existing pattern sections remain unchanged except for copy that refers to the public workbench.

Hash behavior remains one-section-at-a-time with previous/next navigation. A legacy `#playground` hash resolves to Overview rather than rendering a hidden or empty section.

## 5. Color foundation

Color becomes a purpose-first reference, not a token editor or exhaustive primitive catalog.

### Groups

- **Surfaces:** canvas, card, secondary, muted, and popover.
- **Text:** primary, muted, on-primary, and on-destructive.
- **Accents:** Selected Work and Workshop.
- **Actions & boundaries:** primary action, destructive action, border, input, and focus ring.

Each row contains:

- A generous swatch.
- A human role name.
- The semantic token path in quiet monospace text.
- A single friendly production value, preferably the canonical hex value when available.
- One sentence describing use.

Primitive neutrals, warm primitives, compatibility sidebar tokens, aliases, and component-owned colors do not appear in the main Color foundation. Component-owned colors remain documented on their component pages. Canonical JSON remains the source of truth; the presentation is a curated projection of it.

There are no inputs, sliders, HSL channels, reset actions, draft values, or Advanced disclosure in the public Color page.

## 6. Typography foundation

Typography borrows VMedium's structural restraint: thin ruled rows, stable columns, quiet technical labels, and a live specimen whose scale is the dominant information.

### Type scale

Display the seven production roles in ascending order:

- Label — 11px
- Caption — 12px
- Body small — 14px
- Body — 16px
- Body large — 20px
- Heading — 40px
- Display — 56px

Desktop rows use four columns: role, token, value, and specimen. The specimen uses real portfolio language and its production font size. Mobile rows stack metadata above a width-contained specimen; oversized samples must wrap or clip deliberately without horizontal page overflow.

### Families

Show Display, Body, and Mono as three compact specimens with their production stacks. Display and Body may resolve to the same family but remain separate semantic roles.

### Weights

Show Light, Regular, Medium, and Semibold in a single ruled comparison using the same phrase so weight—not content—changes.

Typography remains read-only. There are no numeric inputs or editable family selectors in the public reference.

## 7. Component lineup and contextual demonstrations

The first Components section is **Component lineup**, following VMedium's group-overview idea without reproducing its generic UI catalog.

The lineup presents the seven portfolio components in a compact list or grid. Each entry contains name, one-line purpose, maturity/context, and a hash link to its documentation page. It uses real portfolio vocabulary and no placeholder components.

Individual component pages retain the existing four guidance blocks:

- Purpose
- Use it when
- Responsive behavior
- Accessibility

Token dependencies remain visible but secondary. The existing production-context link remains the canonical specimen when the component depends on scroll, routing, portals, media loading, or full-page composition.

Add a small state demonstration only where isolation is honest and useful. Controls are named for component intent, not raw token values. Examples include default/hover/focus presentation for Project Card or open/closed behavior for Image Lightbox. Do not build generic buttons, inputs, dropdowns, or other controls that are not part of this portfolio.

No component page contains a universal token editor.

## 8. Admin authoring boundary

The public workbench is removed, but the previously implemented authoring and publishing capability is preserved for Malik.

- Footer Admin opens an unlisted Admin authoring surface at `/design-system?admin=1`.
- The authoring surface is not part of the rail, adjacent-section sequence, sitemap, or public overview.
- Local draft behavior remains browser-local.
- Authentication still occurs at publish time.
- The serverless endpoint still validates the password and opens a GitHub pull request from a new branch; it never writes to `main`.
- Client-side concealment is not treated as security. The authenticated endpoint remains the security boundary.

This revision does not expand the backend or add sessions, server drafts, OAuth, version history, or rollback UI.

## 9. Removal scope

Remove from the public experience:

- Playground section and hash entry.
- Token category accordions.
- Color and typography editing controls.
- Production-versus-draft rows.
- Per-token and per-category reset actions.
- Export JSON.
- Contrast diagnostics.
- Embedded portfolio iframe and viewport controls.
- Full-site preview link and preview-oriented public copy.
- Public documentation that describes visitor token experimentation as a core feature.

Preview and draft infrastructure may remain when required by the unlisted Admin authoring workflow. Unused public-only components and tests should be deleted rather than orphaned.

## 10. Accessibility and responsive behavior

- Foundation rows use semantic lists or tables with headers that remain understandable when stacked.
- Swatches have accessible names that include their role and value; color is never the only carrier of meaning.
- Type specimens do not use text smaller than the production role merely to fit a row.
- The Component Lineup uses real links and visible focus states.
- Any contextual component controls are keyboard reachable, have 44px targets, and expose pressed/expanded state where applicable.
- Motion demonstrations respect `prefers-reduced-motion`.
- No foundation specimen causes horizontal overflow at 320px.

## 11. Testing and QA

Automated coverage must prove:

- The public registry contains no Playground section.
- Legacy `#playground` falls back to Overview.
- Color renders the approved semantic groups and excludes primitive/sidebar editing controls.
- Typography renders all seven size roles, three family roles, and four weight roles with accessible specimens.
- Component Lineup links to every existing component section.
- Public design-system rendering contains no token inputs, Export JSON action, Reset all action, or live portfolio iframe.
- `/design-system?admin=1` still reaches the authoring/publish workflow.
- Existing publish endpoint security and GitHub PR tests remain green.

Browser QA covers 320, 768, 1440, and ultrawide widths; keyboard navigation; hash back/forward; component lineup links; oversized type specimens; public absence of editing controls; Admin entry; and console errors.

## 12. Explicit non-goals

- A generic component library matching VMedium's catalog.
- Copying VMedium's visual design, type scale, or component APIs.
- Editing production portfolio components unrelated to reference presentation.
- Removing DTCG tokens or generated CSS from the portfolio.
- Changing the GitHub PR publishing contract.
- Adding a new backend, database, authentication session, or deployment workflow.
