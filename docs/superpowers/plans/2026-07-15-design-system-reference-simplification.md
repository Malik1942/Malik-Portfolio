# Design System Reference Simplification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the public token Playground with a curated VMedium-inspired foundation reference and component lineup while preserving the unlisted Admin authoring and GitHub PR publishing workflow.

**Architecture:** The public section registry will contain only Overview, curated Foundations, Component Lineup and component documentation, and Patterns. Color and Typography receive focused renderers backed by the generated token manifest. The existing token controls, draft runtime, preview, and publish dialog move behind a footer-triggered Admin authoring dialog and remain absent from the public section sequence.

**Tech Stack:** React 18, TypeScript, React Router, Tailwind CSS, Vitest, Testing Library, Vite, existing DTCG token compiler and PreviewProvider.

## Global Constraints

- Preserve the current portfolio design and generated DTCG token source of truth.
- Borrow VMedium's restrained tables, grouped rail, and contextual component demonstrations without copying its visual identity or generic catalog.
- No public token inputs, numeric HSL editor, production/draft labels, reset/export actions, contrast diagnostics, or embedded full-site preview.
- Preserve `/design-system?admin=1` as an unlisted authoring entry and keep the authenticated GitHub PR endpoint as the only server security boundary.
- Do not add sessions, OAuth, server drafts, databases, version history, rollback UI, or new dependencies.
- Keep every public section usable at 320px, 768px, 1440px, and ultrawide widths with keyboard focus and no horizontal overflow.
- Use test-driven development: establish a failing assertion before each production behavior change.

---

## File structure

- `src/design-system/reference/sectionModel.ts` — public IA and adjacent-section order only.
- `src/design-system/reference/content/ComponentLineup.tsx` — compact index of the seven production components.
- `src/design-system/reference/content/ColorFoundation.tsx` — curated semantic color groups.
- `src/design-system/reference/content/TypographyFoundation.tsx` — families, ruled type scale, and weights.
- `src/design-system/reference/content/Foundations.tsx` — routes Color and Typography to their custom renderers; retains generic token tables for the other foundations.
- `src/design-system/publish/AdminAuthoringDialog.tsx` — unlisted modal shell for token authoring.
- `src/design-system/publish/AdminTokenEditor.tsx` — current workbench composition, relabeled and scoped to Admin.
- `src/pages/DesignSystem.tsx` — separates Admin authoring state from publish-review state.
- `src/design-system/reference/content/Playground.tsx` — deleted after its authoring composition moves to Admin.
- Existing `src/design-system/workbench/*`, `src/design-system/preview/*`, and `src/design-system/publish/PublishDialog.tsx` remain the implementation behind Admin.

---

### Task 1: Remove Playground from public IA and add Component Lineup

**Files:**
- Modify: `src/design-system/reference/sectionModel.ts`
- Modify: `src/design-system/reference/sectionModel.test.ts`
- Modify: `src/design-system/reference/DesignSystemShell.test.tsx`
- Create: `src/design-system/reference/content/ComponentLineup.tsx`
- Create: `src/design-system/reference/content/ComponentLineup.test.tsx`
- Modify: `src/design-system/reference/sections.tsx`
- Modify: `src/design-system/reference/content/content.test.tsx`

**Interfaces:**
- Produces: public section id `component-lineup` and renderer `ComponentLineup(): JSX.Element`.
- Preserves: `resolveSectionHash(hash): DesignSystemSection` and `getAdjacentSections(id)`.

- [ ] **Step 1: Write failing registry and lineup tests**

Update the section-model expectations to assert:

```ts
expect(DESIGN_SYSTEM_GROUPS[0].sections.map((section) => section.id)).toEqual(["overview"]);
expect(resolveSectionHash("#playground").id).toBe("overview");
expect(getAdjacentSections("overview")).toEqual({
  previous: undefined,
  next: expect.objectContaining({ id: "foundation-color" }),
});
expect(DESIGN_SYSTEM_GROUPS[2].sections[0]).toMatchObject({
  id: "component-lineup",
  label: "Component lineup",
});
```

Create `ComponentLineup.test.tsx` and assert all seven component links use the existing hashes:

```tsx
render(<ComponentLineup />);
expect(screen.getByRole("link", { name: /Site header/i })).toHaveAttribute("href", "#component-site-header");
expect(screen.getByRole("link", { name: /Project card/i })).toHaveAttribute("href", "#component-project-card");
expect(screen.getAllByRole("link")).toHaveLength(7);
```

- [ ] **Step 2: Run the focused tests and verify RED**

Run:

```bash
npx vitest run src/design-system/reference/sectionModel.test.ts src/design-system/reference/DesignSystemShell.test.tsx src/design-system/reference/content/ComponentLineup.test.tsx
```

Expected: failures because Playground is still registered and `ComponentLineup` does not exist.

- [ ] **Step 3: Implement the public registry and lineup**

Remove the Playground entry from Start. Add Component Lineup before Site header:

```ts
{
  id: "component-lineup",
  label: "Component lineup",
  description: "The production building blocks used across Malik's portfolio.",
}
```

Create a seven-entry catalog in `ComponentLineup.tsx`:

```ts
const COMPONENT_LINEUP = [
  ["component-site-header", "Site header", "Direction-aware navigation shared across portfolio routes."],
  ["component-project-card", "Project card", "Image-led entry point into selected work and workshop projects."],
  ["component-project-list", "Project list", "Responsive editorial grouping for project collections."],
  ["component-metadata-card", "Metadata card", "Compact role, timeline, and project-context summary."],
  ["component-media-frame", "Media frame", "Consistent image, video, embed, and caption boundary."],
  ["component-footer", "Footer", "Secondary navigation, social links, and reference discovery."],
  ["component-lightbox", "Image lightbox", "Focused image inspection without losing narrative position."],
] as const;
```

Render semantic list items with a real hash link, one-line purpose, and quiet `Production component` label. Add `data-testid="reference-component-lineup"`.

Route `component-lineup` explicitly in `renderReferenceSection` before the `component-` prefix branch.

- [ ] **Step 4: Update shell/content expectations and verify GREEN**

Change adjacent-link assertions from Playground to Overview/Color. Include Lineup in rich-content coverage but exclude it from the guidance-grid assertion intended for individual components.

Run the same focused command. Expected: all focused tests pass.

- [ ] **Step 5: Commit Task 1**

```bash
git add src/design-system/reference/sectionModel.ts src/design-system/reference/sectionModel.test.ts src/design-system/reference/DesignSystemShell.test.tsx src/design-system/reference/sections.tsx src/design-system/reference/content/ComponentLineup.tsx src/design-system/reference/content/ComponentLineup.test.tsx src/design-system/reference/content/content.test.tsx
git commit -m "feat: replace playground with component lineup"
```

---

### Task 2: Build curated Color and Typography foundations

**Files:**
- Create: `src/design-system/reference/content/ColorFoundation.tsx`
- Create: `src/design-system/reference/content/ColorFoundation.test.tsx`
- Create: `src/design-system/reference/content/TypographyFoundation.tsx`
- Create: `src/design-system/reference/content/TypographyFoundation.test.tsx`
- Modify: `src/design-system/reference/content/Foundations.tsx`
- Modify: `src/design-system/reference/content/content.test.tsx`

**Interfaces:**
- Consumes: generated `tokenBundle.tokens: TokenRecord[]`.
- Produces: `ColorFoundation(): JSX.Element` and `TypographyFoundation(): JSX.Element`.
- Preserves: `getFoundationTokens(sectionId): TokenRecord[]` for generic/reference tests.

- [ ] **Step 1: Write failing Color tests**

Assert the four groups and curated behavior:

```tsx
render(<ColorFoundation />);
for (const group of ["Surfaces", "Text", "Accents", "Actions & boundaries"]) {
  expect(screen.getByRole("heading", { name: group })).toBeInTheDocument();
}
expect(screen.getByText("color.background.canvas")).toBeInTheDocument();
expect(screen.getByText("color.text.primary")).toBeInTheDocument();
expect(screen.queryByText("color.neutral.950")).not.toBeInTheDocument();
expect(screen.queryByText("color.sidebar.background")).not.toBeInTheDocument();
expect(screen.queryByRole("spinbutton")).not.toBeInTheDocument();
```

Also assert every swatch has an accessible label containing the human role and displayed value.

- [ ] **Step 2: Run Color tests and verify RED**

Run `npx vitest run src/design-system/reference/content/ColorFoundation.test.tsx`.

Expected: import/module failure because the renderer does not exist.

- [ ] **Step 3: Implement ColorFoundation**

Define exact semantic path groups from the approved spec. Resolve tokens through a `Map<string, TokenRecord>`. Render each group as a section and each role as a ruled row containing swatch, human label, token path, friendly hex (from `resolvedValue.hex` when present), and description.

Do not render primitive, sidebar, or component paths. Throw during module initialization if an approved semantic path is missing so generated-token drift is caught during tests/build.

- [ ] **Step 4: Write failing Typography tests**

Assert:

```tsx
render(<TypographyFoundation />);
for (const id of ["label", "caption", "body-small", "body", "body-large", "heading", "display"]) {
  expect(screen.getByTestId(`type-scale-${id}`)).toBeInTheDocument();
}
expect(screen.getAllByTestId(/^type-family-/)).toHaveLength(3);
expect(screen.getAllByTestId(/^type-weight-/)).toHaveLength(4);
expect(screen.queryByRole("spinbutton")).not.toBeInTheDocument();
expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
```

Verify the 56px Display specimen uses `font.size.display`, the 11px Label specimen uses `font.size.label`, and each family specimen uses its generated CSS value.

- [ ] **Step 5: Run Typography tests and verify RED**

Run `npx vitest run src/design-system/reference/content/TypographyFoundation.test.tsx`.

Expected: import/module failure because the renderer does not exist.

- [ ] **Step 6: Implement TypographyFoundation**

Use these exact path arrays:

```ts
const SIZE_PATHS = [
  "font.size.label",
  "font.size.caption",
  "font.size.bodySmall",
  "font.size.body",
  "font.size.bodyLarge",
  "font.size.heading",
  "font.size.display",
] as const;
const FAMILY_PATHS = ["font.family.display", "font.family.body", "font.family.mono"] as const;
const WEIGHT_PATHS = ["font.weight.light", "font.weight.regular", "font.weight.medium", "font.weight.semibold"] as const;
```

Render Families, Type scale, and Weights. Use ruled rows with columns for role, path, value, and a width-contained live specimen. Use real phrases: `Malik Zhang`, `Product designer`, and `Selected work`. Apply the generated `cssValue` inline only for the property being demonstrated.

- [ ] **Step 7: Route the custom foundation renderers and verify GREEN**

In `FoundationContent`, return `<ColorFoundation />` for `foundation-color` and `<TypographyFoundation />` for `foundation-typography`; retain the existing intro plus `TokenTable` for spacing, radius, and motion.

Run:

```bash
npx vitest run src/design-system/reference/content/ColorFoundation.test.tsx src/design-system/reference/content/TypographyFoundation.test.tsx src/design-system/reference/content/content.test.tsx
```

Expected: all tests pass and no public foundation contains form controls.

- [ ] **Step 8: Commit Task 2**

```bash
git add src/design-system/reference/content/ColorFoundation.tsx src/design-system/reference/content/ColorFoundation.test.tsx src/design-system/reference/content/TypographyFoundation.tsx src/design-system/reference/content/TypographyFoundation.test.tsx src/design-system/reference/content/Foundations.tsx src/design-system/reference/content/content.test.tsx
git commit -m "feat: curate color and typography foundations"
```

---

### Task 3: Move token authoring behind Admin

**Files:**
- Create: `src/design-system/publish/AdminTokenEditor.tsx`
- Create: `src/design-system/publish/AdminAuthoringDialog.tsx`
- Create: `src/design-system/publish/AdminAuthoringDialog.test.tsx`
- Modify: `src/pages/DesignSystem.tsx`
- Modify: `src/design-system/publish/PublishDialog.tsx`
- Modify: `src/design-system/publish/PublishDialog.test.tsx`
- Modify: `src/components/Footer.tsx`
- Delete: `src/design-system/reference/content/Playground.tsx`
- Modify: `src/design-system/reference/sections.tsx`

**Interfaces:**
- Produces: `AdminAuthoringDialog({ open, onClose, onReviewPublish })`.
- Produces: `AdminTokenEditor({ onReviewPublish })` using existing PreviewProvider draft actions.
- Preserves: `PublishDialog({ open, onClose })` and `/api/design-system/publish` behavior.

- [ ] **Step 1: Write failing Admin authoring tests**

Render the dialog inside `PreviewProvider` and assert:

```tsx
expect(screen.getByRole("dialog", { name: "Admin token authoring" })).toBeInTheDocument();
expect(screen.getByRole("heading", { name: "Token authoring" })).toBeInTheDocument();
expect(screen.getByTitle("Live portfolio preview")).toBeInTheDocument();
expect(screen.getByRole("button", { name: "Review and publish" })).toBeDisabled();
```

Apply one override through a semantic color control and expect Review and publish to enable. Verify Escape closes, body scroll restores, and focus returns.

- [ ] **Step 2: Run the focused test and verify RED**

Run `npx vitest run src/design-system/publish/AdminAuthoringDialog.test.tsx`.

Expected: module failure because the Admin authoring components do not exist.

- [ ] **Step 3: Extract AdminTokenEditor from Playground**

Move the existing workbench composition into `AdminTokenEditor`. Remove the public Playground introduction. Keep PortfolioPreview, token category controls, reset/export, TokenDiff, and ContrastChecks because they are now an internal authoring utility.

Add an Admin header and a primary action:

```tsx
<button type="button" disabled={Object.keys(draft.overrides).length === 0} onClick={onReviewPublish}>
  Review and publish
</button>
```

Delete `Playground.tsx` and its public renderer branch.

- [ ] **Step 4: Implement AdminAuthoringDialog**

Use a body portal with `role="dialog"`, `aria-modal="true"`, a labeled heading, Close button, body scroll lock, Escape dismissal, focus containment, and focus restoration following the established `PublishDialog` pattern. The dialog may use a wide full-height surface because its iframe and controls are authoring tools.

- [ ] **Step 5: Wire separate authoring and publish-review state**

In `DesignSystem.tsx`:

```ts
const [authoringOpen, setAuthoringOpen] = useState(() => params.get("admin") === "1");
const [publishOpen, setPublishOpen] = useState(false);
```

The one-shot query opens authoring, removes only `admin`, and preserves other query/hash values. Footer Admin opens authoring. `onReviewPublish` closes authoring and opens `PublishDialog`.

Change the Footer fallback href to `/design-system?admin=1` with no Playground hash. Update PublishDialog copy from `Your local editing tools stay public` to `Your token draft stays in this browser until this authenticated publish request.`

- [ ] **Step 6: Update integration tests and verify GREEN**

Change Admin integration expectations so the public Overview remains visible behind the modal, authoring controls exist only while the Admin dialog is open, closing the dialog removes them, and Review and publish opens the existing publish dialog after a draft change.

Run:

```bash
npx vitest run src/design-system/publish/AdminAuthoringDialog.test.tsx src/design-system/publish/PublishDialog.test.tsx src/design-system/reference/DesignSystemShell.test.tsx
```

Expected: all tests pass.

- [ ] **Step 7: Commit Task 3**

```bash
git add src/design-system/publish/AdminTokenEditor.tsx src/design-system/publish/AdminAuthoringDialog.tsx src/design-system/publish/AdminAuthoringDialog.test.tsx src/design-system/publish/PublishDialog.tsx src/design-system/publish/PublishDialog.test.tsx src/pages/DesignSystem.tsx src/components/Footer.tsx src/design-system/reference/sections.tsx
git rm src/design-system/reference/content/Playground.tsx
git commit -m "feat: move token authoring behind admin"
```

---

### Task 4: Remove public workbench language and contracts

**Files:**
- Modify: `src/design-system/reference/content/Overview.tsx`
- Modify: `src/design-system/reference/content/content.test.tsx`
- Modify: `src/design-system/reference/useDesignSystemMetadata.ts`
- Modify: `src/design-system/reference/useDesignSystemMetadata.test.tsx`
- Modify: `README.md`
- Modify: `src/design-system/reference/DesignSystemShell.test.tsx`

**Interfaces:**
- Public metadata and Overview describe a living portfolio reference, curated foundations, production components, and Git-backed Admin publishing without advertising visitor token editing.

- [ ] **Step 1: Write failing public-absence tests**

Render the baseline public shell at Overview, Color, Typography, and Component Lineup and assert the combined public output has none of:

```ts
expect(screen.queryByRole("button", { name: "Export JSON" })).not.toBeInTheDocument();
expect(screen.queryByRole("button", { name: "Reset all" })).not.toBeInTheDocument();
expect(screen.queryByTitle("Live portfolio preview")).not.toBeInTheDocument();
expect(screen.queryByText(/browser-local token playground/i)).not.toBeInTheDocument();
```

Update metadata expectations to the exact description:

```text
Malik Zhang's living portfolio design reference: curated foundations, production components, responsive patterns, and standards-aligned design tokens.
```

- [ ] **Step 2: Run focused tests and verify RED**

Run:

```bash
npx vitest run src/design-system/reference/content/content.test.tsx src/design-system/reference/useDesignSystemMetadata.test.tsx src/design-system/reference/DesignSystemShell.test.tsx
```

Expected: old Playground/local-experiment copy causes failures.

- [ ] **Step 3: Rewrite public copy and README**

Overview principles become:

- One source of truth.
- Real artifacts over replicas.
- Focus over catalog density.
- Roles before raw values.
- Context before controls.
- Systemize what repeats; preserve what expresses.

Document the public IA and explain that authoring is unlisted under Footer Admin. Remove claims that visitors can edit, reset, export, or preview token drafts. Keep DTCG generation, Vercel, GitHub permissions, PR flow, manual merge, and git-revert rollback documentation.

- [ ] **Step 4: Verify focused tests and commit Task 4**

Run the focused command from Step 2. Expected: all pass.

```bash
git add src/design-system/reference/content/Overview.tsx src/design-system/reference/content/content.test.tsx src/design-system/reference/useDesignSystemMetadata.ts src/design-system/reference/useDesignSystemMetadata.test.tsx README.md src/design-system/reference/DesignSystemShell.test.tsx
git commit -m "docs: align reference copy with curated public IA"
```

---

### Task 5: Full verification and responsive browser QA

**Files:**
- Modify only if verification exposes a defect.

**Interfaces:**
- Validates the complete public and Admin contracts without changing the GitHub endpoint.

- [ ] **Step 1: Run the complete automated suite**

```bash
npm test
npx tsc -b
npx tsc --noEmit --target ES2022 --module ESNext --moduleResolution bundler --strict --skipLibCheck --types node,vitest/globals --lib ES2023,DOM,DOM.Iterable api/design-system/github.ts api/design-system/publish-core.ts api/design-system/publish.ts api/design-system/publish-core.test.ts
npm run lint
npm run build
git diff --check
xmllint --noout public/sitemap.xml
```

Expected: all tests and builds pass; lint has no errors. Existing unrelated warnings may remain documented.

- [ ] **Step 2: Verify generated artifacts and incomplete markers**

```bash
git diff --exit-code -- src/styles/tokens.generated.css src/design-system/generated/token-manifest.generated.ts
if rg -n 'TO[D]O|FIX[M]E|TB[D]' src api tokens scripts; then exit 1; fi
```

Expected: no generated drift and no incomplete markers.

- [ ] **Step 3: Browser QA public reference**

Using the production build or verified dev server, inspect 320, 768, 1440, and 1920 widths:

- Start contains only Overview.
- `#playground` resolves to Overview.
- Color shows four semantic groups, no inputs, and no horizontal overflow.
- Typography shows families, seven scale rows, four weights, and width-contained large specimens.
- Component Lineup links to all seven component pages.
- Previous/next, rail disclosures, hash back/forward, heading focus, and keyboard navigation work.
- No public Export, Reset, token controls, contrast cards, iframe, or console errors exist.

- [ ] **Step 4: Browser QA Admin boundary**

- Footer Admin and direct `?admin=1` open Admin token authoring.
- Query cleanup preserves unrelated search/hash state.
- Editing one semantic token updates the internal preview.
- Review and publish opens the existing publish dialog.
- Close/Escape restores focus and body scrolling.
- Do not send a real publish request or create a GitHub branch/PR.

- [ ] **Step 5: Request final review and commit any QA fix**

Review the complete diff from `880d4a3` to HEAD for public IA, accessibility, responsive behavior, Admin availability, and unchanged publish security. Address every Critical or Important finding, rerun the complete suite, and commit fixes with a narrowly scoped message.

---

## Completion criteria

- All five tasks are committed on `codex/design-system`.
- Public `/design-system` contains no Playground or token editing controls.
- Color, Typography, and Component Lineup meet the approved spec.
- Footer Admin still supports local authoring and authenticated PR review.
- Automated verification, responsive browser QA, and final code review are green.
