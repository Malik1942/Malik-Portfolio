# Malik Portfolio Design System — Design Specification

**Status:** Approved direction, written for implementation review

**Date:** 2026-07-14

**Public destination:** `https://www.malikzhang.com/design-system`

## 1. Summary

Build a public, living design-system reference extracted from the current portfolio. The reference uses the structure and philosophy of [VMedium's design system](https://www.vmedium.xyz/design-system): one generated source of truth, a sticky grouped rail, one hash-addressable section rendered at a time, previous/next navigation, concise guidance, and specimens made from production components.

The distinguishing feature is a public browser-local workbench. Anyone can adjust supported design tokens and watch the real portfolio respond. Those changes stay in the visitor's browser, can be reset, and can be exported as DTCG JSON.

Publishing is the only privileged operation. Malik authenticates at publish time; a Vercel serverless function validates the draft, creates a branch through the GitHub API, commits only allowlisted token files, and opens a pull request against `main`. Vercel's pull-request preview is the final visual check. Git provides history and rollback.

## 2. Goals

- Extract the system that already exists without redesigning it.
- Make design intent legible through foundations, components, patterns, and usage guidance.
- Use DTCG-compatible JSON as the canonical source of truth.
- Generate browser-ready CSS variables and typed metadata rather than hand-maintaining duplicates.
- Render production components in documentation specimens.
- Let visitors safely experiment with local token overrides across the real portfolio.
- Let Malik convert a validated local draft into a reviewable GitHub pull request.
- Preserve accessibility, reduced-motion behavior, responsiveness, performance, and current visual fidelity.

## 3. Non-goals

- A portfolio redesign.
- A generic design system containing unused form, overlay, or data-display controls.
- Public accounts or remote visitor drafts.
- A protected editor route or secret client bundle.
- Direct writes to `main`.
- Runtime production tokens stored in a database.
- Server-side draft autosave.
- Custom release history, rollback, or changelog interfaces in v1.
- A new light theme without a separate product decision.
- Cross-platform generation beyond web in v1.

## 4. Design philosophy

### 4.1 One source of truth

DTCG JSON owns token values, types, descriptions, aliases, and deprecation metadata. CSS variables and TypeScript metadata are generated outputs and must not be hand-edited.

### 4.2 Real artifacts over replicas

Documentation imports the production components wherever a reusable component boundary exists. If a specimen and the portfolio can drift independently, the boundary is wrong.

### 4.3 Focus over catalog density

Like VMedium, the page presents one selected section at a time. A sticky rail provides the complete hierarchy, the URL hash preserves deep links, and previous/next actions maintain a guided reading path.

### 4.4 Show cause and effect

The workbench does more than list values. It connects an adjustment to the real interface so visitors can understand what a token controls and why it exists.

### 4.5 Separate experimentation from authority

Sliders and local CSS-variable overrides are public. Only the server-side operation that opens a pull request requires authentication.

### 4.6 Systemize what repeats; preserve what expresses

Repeated decisions become foundations, semantic tokens, or reusable components. DotGrid, the About experience, and art-directed case-study moments remain expressive patterns with only their genuinely shared inputs tokenized.

## 5. Audiences and journeys

### 5.1 Visitor learns the system

1. Open `/design-system`.
2. Read the overview, system principles, and standards explanation.
3. Use the grouped rail to open a foundation, component, or pattern.
4. Inspect production values, intent, examples, states, and usage guidance.
5. Copy a token name or exported example if useful.

### 5.2 Visitor experiments

1. Open the first-class Playground section.
2. Change a supported token using a type-appropriate control.
3. See the embedded production preview update immediately.
4. Open the full portfolio in explicit local-preview mode.
5. Move across homepage and case-study routes while a persistent preview bar communicates that a local draft is active.
6. Inspect the before/after diff and contrast warnings.
7. Reset selected changes or export the modified DTCG JSON.

### 5.3 Malik publishes

1. Prepare a local draft using the same public workbench.
2. Select `Admin` in the footer.
3. Enter the publish credential and review the final token diff.
4. Add a pull-request title and concise rationale.
5. Submit the publish request.
6. Receive the new GitHub pull-request URL.
7. Review the Vercel preview attached to the PR.
8. Merge through GitHub when satisfied.

## 6. Information architecture

The global structure follows VMedium's focused, grouped rail. The visual treatment follows Malik's portfolio rather than imitating VMedium.

### Overview

- Philosophy
- How it works
- DTCG standards
- Token flow
- How local preview differs from production

### Playground

- Token controls
- Embedded real-portfolio preview
- Responsive viewport selection
- Changed-token diff
- Contrast and validation feedback
- Reset and export

### Foundations

- Color
- Typography
- Spacing
- Layout
- Radius and borders
- Motion

### Components

- Site header
- Project card
- Project list and section heading
- Metadata card
- Media frame
- Footer
- Image lightbox

### Patterns

- Homepage hero
- Case-study structure
- Section navigation
- Responsive behavior
- Loading and page transitions
- DotGrid and expressive visuals
- Accessibility behavior

Changelog is omitted in v1 and added only after there is meaningful history to communicate.

## 7. Page behavior

### 7.1 Rail and routing

- The portfolio footer links to the public Design System route; the primary site header remains unchanged.
- The rail is sticky on desktop and available through an accessible disclosure on small screens.
- Groups expand and collapse independently.
- Exactly one documentation section is active and rendered in the main content area.
- Each section owns a stable hash such as `#foundation-color` or `#component-project-card`.
- Loading a hash opens the correct group and section.
- Browser back/forward restores the previous selection.
- Previous and next actions appear at the beginning and end of the content.
- Section changes move focus to the new section heading without producing an unexpected full-page scroll.
- The route has its own title, description, canonical URL, social metadata, and sitemap entry.

### 7.2 Foundation specimens

Each token row shows:

- Human-readable name
- Canonical DTCG path
- Generated CSS custom property
- Production value
- Visual sample
- Short intent description
- Alias source, where applicable
- Usage count or representative consumers when useful

Production rows are reference content. The Playground operates on a separate local draft so an experiment is never mistaken for the shipped value.

### 7.3 Component specimens

Each component page contains only what serves the existing portfolio:

- Purpose and appropriate usage
- Production specimen
- Meaningful variants
- Hover, focus, active, disabled, loading, empty, or overflow states when the component supports them
- Responsive behavior
- Accessibility notes
- Relevant token dependencies
- A compact prop playground where variants exist
- A code example sourced from the real public API

### 7.4 Expressive patterns

DotGrid and the About experience are documented through intent, inputs, motion behavior, accessibility fallbacks, and responsive constraints. Their internal animation constants are tokenized only when they represent shared decisions. Particle-by-particle or art-direction values remain implementation details.

## 8. Token architecture

### 8.1 Canonical files

The source is organized by responsibility rather than by output platform:

```text
tokens/
  primitive.tokens.json
  semantic.tokens.json
  component.tokens.json
```

Generated outputs are conceptually:

```text
src/styles/tokens.generated.css
src/design-system/generated/token-metadata.generated.ts
```

The exact generator configuration belongs in the implementation plan. Generated files carry a clear header and are recreated during development, test, and production builds.

### 8.2 Layers

#### Primitive tokens

Raw reusable scales and ingredients:

- Neutral and accent colors
- Font families and weights
- Dimension and spacing scales
- Radius scale
- Duration scale
- Cubic Bézier curves
- Unitless values such as line-height multipliers

Primitive names describe the value or ordered position, not UI usage.

#### Semantic tokens

Intent-based decisions that components consume:

- Canvas and surface backgrounds
- Primary, secondary, muted, and inverse text
- Subtle and strong borders
- Focus ring
- Selected Work and Workshop accents
- Content and page widths
- Section spacing
- Enter, exit, hover, and ambient motion roles

Semantic tokens normally alias primitives.

#### Component tokens

Values owned by a specific reusable component and not meaningful globally:

- Site-header scrim
- Project-card hover surface
- Project-section arrival treatment
- Lightbox backdrop

A component token is introduced only when multiple internal uses must change together or when the value is intentionally part of that component's public design contract.

### 8.3 DTCG rules

- Every token has `$value`.
- Every token has an explicit `$type` or inherits one from its closest typed group.
- Tools never infer a type from a value.
- `$description` explains purpose rather than restating the value.
- Aliases use canonical token references and must resolve to compatible types.
- Circular aliases fail validation.
- `$deprecated` marks replacements without immediately breaking consumers.
- `$extensions` is optional, namespaced, and never required to understand the token.
- Color values use the DTCG Color Module structure with `colorSpace`, `components`, optional `alpha`, and a compatible `hex` fallback.
- Dimensions use `{ "value": number, "unit": "px" | "rem" }`.
- Durations use `{ "value": number, "unit": "ms" | "s" }`.
- Cubic Bézier values use four-number arrays.
- Resolver contexts are introduced only when a real theme or accessibility mode exists; v1 remains the current dark visual system.

Illustrative structure:

```json
{
  "color": {
    "neutral": {
      "$type": "color",
      "950": {
        "$description": "Deep neutral used as the portfolio canvas primitive.",
        "$value": {
          "colorSpace": "srgb",
          "components": [0.0392, 0.0392, 0.0392],
          "hex": "#0a0a0a"
        }
      }
    },
    "background": {
      "canvas": {
        "$type": "color",
        "$description": "Default page background.",
        "$value": "{color.neutral.950}"
      }
    }
  }
}
```

### 8.4 Extraction rule

A current value becomes a token when at least one condition is true:

- It is repeated and should change with its other uses.
- It expresses semantic intent.
- It is likely to be tuned through the public workbench.
- It is part of a reusable component's stable design contract.

One-off geometry, content-driven measurements, and art-direction constants remain local and are documented as intentional exceptions when necessary.

## 9. Generated runtime contract

The build pipeline performs:

1. JSON parsing and DTCG structural validation.
2. Type inheritance and alias resolution.
3. Circular-reference and missing-reference detection.
4. Platform transformation to CSS-safe values.
5. CSS custom-property generation.
6. TypeScript metadata generation for documentation and controls.
7. Stable token-manifest hashing for local-draft compatibility and publish conflict detection.

Tailwind maps semantic utilities to generated variables. Framer Motion consumes generated duration and easing metadata or CSS variables through a typed adapter. Production components do not import raw JSON.

## 10. Public workbench

### 10.1 Draft model

The browser stores only a patch over production:

```ts
interface LocalTokenDraft {
  schemaVersion: 1;
  baseTokenHash: string;
  updatedAt: string;
  overrides: Record<TokenPath, DtcgValue>;
}
```

- `schemaVersion` permits future migration.
- `baseTokenHash` identifies the production token set the draft started from.
- `overrides` contains only changed, supported token values.
- The draft contains no credential or remote identifier.

When production changes, known compatible overrides are rebased onto the new manifest. Removed, renamed, or type-changed tokens are discarded with an explicit warning and included in the export report.

### 10.2 Controls

Controls are generated from token type and bounded by metadata:

- Color: color-space-aware picker and alpha where supported
- Dimension: numeric field, appropriate unit, and bounded slider when a meaningful range exists
- Font family and weight: select from supported loaded values
- Number: numeric field or bounded slider
- Duration: numeric field with milliseconds display
- Cubic Bézier: control-point editor plus curve preview
- Composite tokens: structured controls only when every field can be safely represented

The UI never accepts arbitrary CSS text. Unsupported token types remain visible but read-only.

### 10.3 Applying overrides

- The workbench converts validated DTCG draft values through the same browser transformer used by generated metadata.
- It sets only known generated CSS properties.
- Changes update the design-system page and embedded preview immediately.
- A same-origin preview frame receives updates through `postMessage`; localStorage remains the persistence mechanism.
- Opening the full portfolio adds explicit local-preview state, such as `?design-preview=local`.
- Ordinary portfolio visits do not apply a stored draft unless preview mode is active.
- A persistent preview bar appears across routes while active and offers return, reset, export, and exit actions.
- Exiting preview removes runtime properties but preserves the draft until reset.

### 10.4 Diff and validation

The client computes:

- Production value versus draft value
- Direct and aliased dependents
- Affected representative components
- Contrast changes for registered foreground/background pairs
- Structural/type errors
- Warnings for extreme but technically valid values

Blocking errors prevent export as “valid” and prevent publish. Non-blocking warnings remain visible in the exported report and pull-request body.

### 10.5 Export

Export produces a complete DTCG JSON bundle with the local overrides applied while preserving descriptions, aliases, deprecation metadata, and supported extensions. It also records the production token hash and warnings in a separate non-authoritative report. Exporting never contacts the server.

## 11. Publishing boundary

### 11.1 Client behavior

The footer contains a discreet `Admin` action, echoing VMedium's separation of reference content from publishing authority. Selecting it opens the publish dialog.

The v1 dialog requests:

- Publish password
- Pull-request title
- Rationale/summary
- Confirmation of the final changed-token diff

The password is held only in memory for the request and is never written to localStorage, logs, analytics, or exported JSON.

### 11.2 Endpoint

V1 uses one serverless endpoint:

```text
POST /api/design-system/publish
```

Conceptual request:

```ts
interface PublishRequest {
  password: string;
  baseCommitSha: string;
  baseTokenHash: string;
  title: string;
  summary: string;
  overrides: Record<TokenPath, DtcgValue>;
}
```

The endpoint never accepts arbitrary repository paths or arbitrary file bodies.

### 11.3 Server validation

The function performs, in order:

1. Enforce method, content type, request-size limit, and rate limit.
2. Compare the credential against a server-side Vercel environment secret using a constant-time comparison of derived values.
3. Validate required strings, lengths, and token-path allowlist.
4. Fetch the current permitted token files and `main` commit from GitHub.
5. Reject a stale `baseCommitSha` or `baseTokenHash` with a conflict response.
6. Apply overrides only to known tokens with compatible types.
7. Run the same DTCG, alias, cycle, and range validation as the build.
8. Generate the exact allowlisted token-file content server-side.
9. Create a uniquely named `design-system/...` branch from the validated base SHA.
10. Commit the changed token files to that branch.
11. Open a pull request against `main`.
12. Return the pull-request URL, number, branch, and changed-token summary.

The GitHub credential is a fine-grained token restricted to this repository and the minimum contents and pull-request permissions needed for the workflow. It exists only in the server environment.

### 11.4 Pull-request content

The generated PR contains:

- Admin-provided rationale
- Base token hash
- Changed token paths with old and new values
- Validation result and non-blocking warnings
- Manual review checklist for desktop, mobile, contrast, and reduced motion
- A note that Vercel will attach the preview deployment

The endpoint never merges the pull request and never writes directly to `main`.

### 11.5 Failures

- Invalid credential: generic unauthorized response without revealing which check failed.
- Rate limit: retry guidance without processing GitHub operations.
- Stale base: conflict response; the client rebases compatible overrides and asks for another review.
- Invalid token: field-level errors and no GitHub operation.
- GitHub branch or commit failure: actionable error and safe retry behavior.
- Pull-request creation failure after commit: return the created branch name so the admin can recover or retry without duplicating token commits.
- Vercel preview failure: handled through the existing GitHub/Vercel integration and visible on the PR; the design-system endpoint does not emulate deployment state.

## 12. Accessibility

- Rail, disclosures, previous/next controls, playground controls, dialog, and preview bar are fully keyboard accessible.
- Hash navigation moves focus predictably and announces the new section.
- Every token control has a persistent label, production value, and draft value.
- Color is never the only indicator of changed, invalid, or warning state.
- Registered foreground/background pairs show WCAG contrast results.
- Existing minimum 44px interaction targets are retained where appropriate.
- Reduced-motion mode removes decorative transitions and provides static specimens.
- Motion editing cannot force animation onto a visitor who prefers reduced motion.
- Specimens cover overflow, long text, empty content, and narrow viewports where relevant.

## 13. Performance and resilience

- Secondary design-system sections are code-split so the homepage bundle does not absorb the documentation UI.
- Only the active documentation section renders.
- Expensive specimens, canvas experiences, and the portfolio preview load on demand.
- Generated token CSS loads with the base application and introduces no runtime network dependency.
- The publish function and GitHub availability have no effect on the public portfolio or local playground.
- A malformed local draft is quarantined, reported, and ignored rather than breaking page rendering.

## 14. Testing strategy

### Token pipeline

- Valid DTCG parsing and generation
- Explicit and inherited types
- Whole-token aliases and chains
- Missing and circular references
- Color, dimension, duration, number, and cubic Bézier transformations
- Stable manifest hashes
- Generated output snapshot or fixture tests

### Draft and preview

- Serialization and restoration
- Schema-version rejection/migration
- Rebase onto a changed production manifest
- Type-safe override application
- Reset one, reset category, and reset all
- Export retains metadata and aliases
- Preview mode is explicit and persists across same-origin routes
- Ordinary visits ignore stored drafts

### Documentation UI

- Hash deep links open the correct group and section
- Back/forward navigation
- Previous/next sequence
- Keyboard rail and mobile disclosure
- Production versus draft labeling
- Component state and responsive specimens

### Publishing

- Unauthenticated and rate-limited requests
- Request-size, token-path, and type allowlists
- Stale base conflicts
- Server-side revalidation independent of client claims
- GitHub branch, commit, and pull-request request sequence
- Partial GitHub failure recovery
- Response never contains credentials
- No code path can update `main` directly; `main` is used only as the pull-request base

### Visual and accessibility QA

- Baselines before token migration and comparisons after each migration slice
- 320px, tablet, desktop, and ultrawide layouts
- Homepage, About, project lists, representative case studies, resume, and design-system route
- Keyboard-only pass
- Reduced-motion pass
- Contrast checks for registered pairs
- Real short, long, and overflowing content

## 15. Delivery sequence

1. **Inventory and baselines** — record current decisions, consumers, and representative screenshots.
2. **Token foundation** — author DTCG files, validation, generation, and typed metadata.
3. **No-drift migration** — move existing color, typography, spacing/layout, radius/border, and motion consumers onto generated tokens in reviewable slices.
4. **Reference shell** — add `/design-system`, VMedium-inspired rail, hashes, overview, and section navigation.
5. **Foundations and specimens** — document real values and production components.
6. **Public workbench** — add local drafts, controls, embedded preview, full-site preview mode, diff, validation, reset, and export.
7. **PR publishing** — add the single authenticated serverless function and GitHub pull-request workflow.
8. **QA and launch** — visual regression, accessibility, responsive, failure, metadata, sitemap, and production verification.

Each migration slice must pass its relevant tests and visual comparison before the next category begins.

## 16. Acceptance criteria

- `/design-system` is directly accessible and deep-linkable by section hash.
- The portfolio footer exposes the route without adding another primary-header item.
- Route-specific metadata, canonical URL, and sitemap entry identify the public reference correctly.
- Its grouped rail, single-section rendering, and previous/next behavior follow the approved VMedium-inspired model.
- The page documents Malik's actual foundations, components, and patterns rather than a generic inventory.
- DTCG token files are the only hand-edited source of supported design values.
- Invalid tokens, type mismatches, missing aliases, and cycles fail the build.
- Existing portfolio pages retain their approved appearance and behavior after migration.
- Any visitor can create, persist locally, reset, and export a token draft.
- A visitor can see the real portfolio respond without affecting other browsers or production.
- Ordinary portfolio visits do not silently apply a stored draft.
- Contrast warnings and production-versus-draft differences are legible and keyboard accessible.
- The browser cannot publish without valid server-side authentication.
- The server accepts only known token paths and independently revalidates all changes.
- Publishing creates a new branch and pull request through the GitHub API and never commits to `main`.
- The resulting PR receives the repository's normal Vercel preview workflow.
- No server-side drafts, custom version history, rollback UI, or changelog are included in v1.

## 17. Standards references

- [Design Tokens Community Group](https://www.w3.org/community/design-tokens/)
- [Design Tokens Format Module 2025.10](https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/)
- [Design Tokens Color Module 2025.10](https://www.w3.org/community/reports/design-tokens/CG-FINAL-color-20251028/)
- [Design Tokens Resolver Module 2025.10](https://www.w3.org/community/reports/design-tokens/CG-FINAL-resolver-20251028/)
