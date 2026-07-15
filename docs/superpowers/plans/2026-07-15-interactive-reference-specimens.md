# Interactive Reference Specimens Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Give each public Component and Pattern reference page an interactive visual demonstration of its real portfolio behavior.

**Architecture:** Upgrade the existing Specimen region to contain a live visual stage plus its context-link footer. Component and pattern pages call focused section-id renderers. Metadata and media are first extracted into shared production primitives; the existing full-viewport ImageLightbox is mounted for the lightbox specimen rather than replicated.

**Tech Stack:** React 18, TypeScript, Framer Motion 12, Tailwind CSS, Vitest, Testing Library.

## Global Constraints

- Work in /Users/malik/.codex/worktrees/malik-portfolio-design-system on codex/design-system.
- Do not add dependencies, change DTCG source/generated tokens, or change Admin/GitHub publishing behavior.
- Do not add iframes, screenshots, public token controls, localStorage writes, or specimen navigation.
- Mirror the portfolio's existing local motion values; duration and easing tokens remain unwired.
- Every animated stage calls useReducedMotion and has a stable reduced-motion test.
- Each Component and Pattern page contains one Live specimen landmark before its Guidance grid; the context link is the same landmark's footer.
- No stage may create horizontal overflow at 320px, 768px, 1440px, or 1920px.

---

## File structure

- src/test/setup.ts — controllable matchMedia helper.
- src/design-system/reference/Specimen.tsx — semantic live-stage shell.
- src/components/project-detail/ProjectMetadataSummary.tsx — extracted production metadata primitive.
- src/components/project-detail/ProjectMediaFrame.tsx — extracted production media primitive.
- src/design-system/reference/content/ComponentSpecimen.tsx — component visual stages.
- src/design-system/reference/content/PatternSpecimen.tsx — pattern visual stages.
- src/design-system/reference/content/Components.tsx and Patterns.tsx — put the visual stage before documentation.
- Matching test files — focused behavior and ordering contracts.

### Task 1: Add a live-stage shell and reduced-motion test control

**Files:**

- Modify: src/test/setup.ts
- Modify: src/design-system/reference/Specimen.tsx
- Modify: src/design-system/reference/Specimen.test.tsx

**Interfaces:**

- Produces setReducedMotionPreference(matches: boolean): void for tests.
- Extends Specimen with footer?: ReactNode, preserving label, description, and children.

- [ ] **Step 1: Write the failing tests**

~~~tsx
render(
  <Specimen label="Live specimen" description="A local interaction" footer={<a href="/">Context</a>}>
    <button type="button">Inspect</button>
  </Specimen>,
);
expect(screen.getByRole("region", { name: "Live specimen" })).toContainElement(screen.getByRole("button", { name: "Inspect" }));
expect(screen.getByRole("link", { name: "Context" })).toBeInTheDocument();

setReducedMotionPreference(true);
expect(window.matchMedia("(prefers-reduced-motion: reduce)").matches).toBe(true);
~~~

- [ ] **Step 2: Verify RED**

Run: npx vitest run src/design-system/reference/Specimen.test.tsx

Expected: footer and setReducedMotionPreference are unavailable.

- [ ] **Step 3: Implement the narrow API**

~~~ts
let reducedMotionPreference = false;
export function setReducedMotionPreference(matches: boolean) {
  reducedMotionPreference = matches;
}
~~~

Make the existing matchMedia stub return reducedMotionPreference only for the reduced-motion query and reset it after every test. Render the optional footer within a ruled footer element. Keep one labelled section region—do not create a second landmark.

- [ ] **Step 4: Verify GREEN and commit**

Run: npx vitest run src/design-system/reference/Specimen.test.tsx

~~~bash
git add src/test/setup.ts src/design-system/reference/Specimen.tsx src/design-system/reference/Specimen.test.tsx
git commit -m "feat: add live specimen shell"
~~~

### Task 2: Extract the case-study primitives used by production and reference

**Files:**

- Create: src/components/project-detail/ProjectMetadataSummary.tsx
- Create: src/components/project-detail/ProjectMediaFrame.tsx
- Create: src/components/project-detail/ProjectMetadataSummary.test.tsx
- Create: src/components/project-detail/ProjectMediaFrame.test.tsx
- Modify: src/components/project-detail/ProjectDetailTemplate.tsx

**Interfaces:**

- Produces ProjectMetadataSummary({ items }: { items: Array<{ label: string; value: string }> }).
- Produces ProjectMediaFrame({ fig, onImageClick }: { fig: ProjectSectionFigure; onImageClick?: (image: LightboxImage) => void }).
- Preserves case-study media variants and ImageLightbox behavior.

- [ ] **Step 1: Write failing primitive tests**

~~~tsx
render(<ProjectMetadataSummary items={[{ label: "Role", value: "Product design" }, { label: "Scope", value: "A value that wraps safely" }]} />);
expect(screen.getByText("Role")).toBeInTheDocument();
expect(screen.getByText(/wraps safely/)).toBeInTheDocument();

render(<ProjectMediaFrame fig={{ type: "image", src: "/placeholder.jpg", alt: "Research board" }} />);
expect(screen.getByRole("img", { name: "Research board" })).toBeInTheDocument();
~~~

- [ ] **Step 2: Verify RED**

Run: npx vitest run src/components/project-detail/ProjectMetadataSummary.test.tsx src/components/project-detail/ProjectMediaFrame.test.tsx

Expected: module imports fail.

- [ ] **Step 3: Extract exact production markup**

Move the inline metadata block near ProjectDetailTemplate.tsx:417 into ProjectMetadataSummary, retaining its two-column layout and wrapping. Move the private SectionFigure implementation into ProjectMediaFrame, retaining all media type branches and optional click callback. Replace only the corresponding template usages with the exported primitives.

- [ ] **Step 4: Verify GREEN and commit**

Run: npx vitest run src/components/project-detail/ProjectMetadataSummary.test.tsx src/components/project-detail/ProjectMediaFrame.test.tsx src/App.test.tsx

~~~bash
git add src/components/project-detail/ProjectMetadataSummary.tsx src/components/project-detail/ProjectMediaFrame.tsx src/components/project-detail/ProjectMetadataSummary.test.tsx src/components/project-detail/ProjectMediaFrame.test.tsx src/components/project-detail/ProjectDetailTemplate.tsx
git commit -m "refactor: extract case study reference primitives"
~~~

### Task 3: Build P0 interactive component stages

**Files:**

- Create: src/design-system/reference/content/ComponentSpecimen.tsx
- Create: src/design-system/reference/content/ComponentSpecimen.test.tsx
- Modify: src/design-system/reference/content/Components.tsx

**Interfaces:**

- Produces ComponentSpecimen({ sectionId, contextHref, contextLabel }: ComponentSpecimenProps).
- Supports component-project-card and component-lightbox in this task.
- Mounts existing ImageLightbox for lightbox state.

- [ ] **Step 1: Write failing interaction tests**

~~~tsx
render(<ComponentSpecimen sectionId="component-project-card" contextHref="/#projects" contextLabel="View project cards in context" />);
const card = screen.getByRole("link", { name: /Moti.*Product design/i });
fireEvent.focus(card);
expect(card).toHaveAttribute("data-active", "true");

render(<ComponentSpecimen sectionId="component-lightbox" contextHref="/project/aura" contextLabel="View image lightbox in context" />);
const trigger = screen.getByRole("button", { name: "Open image lightbox" });
fireEvent.click(trigger);
expect(screen.getByRole("dialog")).toBeInTheDocument();
fireEvent.keyDown(document, { key: "Escape" });
expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
expect(trigger).toHaveFocus();
~~~

- [ ] **Step 2: Verify RED**

Run: npx vitest run src/design-system/reference/content/ComponentSpecimen.test.tsx

Expected: module import failure.

- [ ] **Step 3: Implement and compose P0 component stages**

Render a non-navigating project-card anchor with a hover/focus overlay and deterministic data-active state. Render an image thumbnail button that mounts the real ImageLightbox using fixture data; keep its full-viewport portal. Wrap each stage in Specimen label Live specimen, use its footer for the existing context link, place it before Guidance, and remove the old terminal Production context region.

- [ ] **Step 4: Verify GREEN and commit**

Run: npx vitest run src/design-system/reference/content/ComponentSpecimen.test.tsx src/design-system/reference/content/content.test.tsx

~~~bash
git add src/design-system/reference/content/ComponentSpecimen.tsx src/design-system/reference/content/ComponentSpecimen.test.tsx src/design-system/reference/content/Components.tsx src/design-system/reference/content/content.test.tsx
git commit -m "feat: add interactive component specimens"
~~~

### Task 4: Build P0 interactive pattern stages

**Files:**

- Create: src/design-system/reference/content/PatternSpecimen.tsx
- Create: src/design-system/reference/content/PatternSpecimen.test.tsx
- Modify: src/design-system/reference/content/Patterns.tsx

**Interfaces:**

- Produces PatternSpecimen({ sectionId, contextHref, contextLabel }: PatternSpecimenProps).
- Supports pattern-section-navigation and pattern-transitions in this task.

- [ ] **Step 1: Write failing interaction and motion tests**

~~~tsx
render(<PatternSpecimen sectionId="pattern-section-navigation" contextHref="/project/aura" contextLabel="View section navigation in context" />);
fireEvent.click(screen.getByRole("button", { name: "Final design" }));
expect(screen.getByRole("button", { name: "Final design" })).toHaveAttribute("aria-current", "step");

render(<PatternSpecimen sectionId="pattern-transitions" contextHref="/project/neuralyfe" contextLabel="View loading and transitions in context" />);
fireEvent.click(screen.getByRole("button", { name: "Replay transition" }));
expect(screen.getByTestId("transition-stage")).toHaveAttribute("data-phase", "entering");

setReducedMotionPreference(true);
render(<PatternSpecimen sectionId="pattern-transitions" contextHref="/project/neuralyfe" contextLabel="View loading and transitions in context" />);
expect(screen.getByTestId("transition-stage")).toHaveAttribute("data-reduced-motion", "true");
expect(screen.getByTestId("transition-stage")).toHaveAttribute("data-phase", "settled");
~~~

- [ ] **Step 2: Verify RED**

Run: npx vitest run src/design-system/reference/content/PatternSpecimen.test.tsx

Expected: module import failure.

- [ ] **Step 3: Implement and compose P0 pattern stages**

Render selected-section rail/strip controls using aria-current="step". Use Framer Motion for a replayable entering-to-settled content arrival. With useReducedMotion, render the settled state synchronously and expose data-reduced-motion="true". Use the unified Live specimen region before the guidance grid and remove the old terminal context region.

- [ ] **Step 4: Verify GREEN and commit**

Run: npx vitest run src/design-system/reference/content/PatternSpecimen.test.tsx src/design-system/reference/content/content.test.tsx

~~~bash
git add src/design-system/reference/content/PatternSpecimen.tsx src/design-system/reference/content/PatternSpecimen.test.tsx src/design-system/reference/content/Patterns.tsx src/design-system/reference/content/content.test.tsx
git commit -m "feat: add interactive pattern specimens"
~~~

### Task 5: Complete P1 component stages

**Files:**

- Modify: src/design-system/reference/content/ComponentSpecimen.tsx
- Modify: src/design-system/reference/content/ComponentSpecimen.test.tsx

**Interfaces:**

- Adds component-site-header, component-project-list, component-metadata-card, component-media-frame, and component-footer.
- Uses ProjectMetadataSummary and ProjectMediaFrame for the extracted entries.

- [ ] **Step 1: Write failing coverage tests**

~~~tsx
for (const id of ["component-site-header", "component-project-list", "component-metadata-card", "component-media-frame", "component-footer"]) {
  const view = render(<ComponentSpecimen sectionId={id} contextHref="/" contextLabel="View in context" />);
  expect(screen.getByRole("region", { name: "Live specimen" })).toBeInTheDocument();
  view.unmount();
}
~~~

Add assertions that the metadata specimen exposes Product design and the media specimen exposes an image named Specimen research board.

- [ ] **Step 2: Verify RED**

Run: npx vitest run src/design-system/reference/content/ComponentSpecimen.test.tsx

Expected: unsupported section ids have no visual stage.

- [ ] **Step 3: Implement all five stages**

Add a compact header/replay state, responsive project grid, shared metadata summary, shared media frame, and non-landmark footer link cluster. Buttons and anchors prevent default navigation. Animated stages render their static final state under reduced motion.

- [ ] **Step 4: Verify GREEN and commit**

Run: npx vitest run src/design-system/reference/content/ComponentSpecimen.test.tsx

~~~bash
git add src/design-system/reference/content/ComponentSpecimen.tsx src/design-system/reference/content/ComponentSpecimen.test.tsx
git commit -m "feat: complete component visual specimens"
~~~

### Task 6: Complete P1 pattern stages

**Files:**

- Modify: src/design-system/reference/content/PatternSpecimen.tsx
- Modify: src/design-system/reference/content/PatternSpecimen.test.tsx

**Interfaces:**

- Adds pattern-homepage-hero, pattern-case-study, pattern-responsive, pattern-expressive, and pattern-accessibility.

- [ ] **Step 1: Write failing interaction tests**

~~~tsx
render(<PatternSpecimen sectionId="pattern-responsive" contextHref="/" contextLabel="View in context" />);
fireEvent.click(screen.getByRole("button", { name: "Compact layout" }));
expect(screen.getByTestId("responsive-stage")).toHaveAttribute("data-layout", "compact");

render(<PatternSpecimen sectionId="pattern-expressive" contextHref="/" contextLabel="View in context" />);
fireEvent.click(screen.getByRole("button", { name: "Pause ambient motion" }));
expect(screen.getByTestId("expressive-stage")).toHaveAttribute("data-paused", "true");

render(<PatternSpecimen sectionId="pattern-accessibility" contextHref="/" contextLabel="View in context" />);
fireEvent.focus(screen.getByRole("button", { name: "Open case study" }));
expect(screen.getByRole("status")).toHaveTextContent("Open case study is focused");
~~~

- [ ] **Step 2: Verify RED**

Run: npx vitest run src/design-system/reference/content/PatternSpecimen.test.tsx

Expected: missing P1 stage assertions fail.

- [ ] **Step 3: Implement all five stages**

Add a reduced-density decorative hero field, case-study narrative modules, explicit compact/wide composition switch, pauseable expressive field, and a three-button keyboard focus path with role="status". Every animation must render a stable data-reduced-motion="true" state under reduced motion.

- [ ] **Step 4: Verify GREEN and commit**

Run: npx vitest run src/design-system/reference/content/PatternSpecimen.test.tsx

~~~bash
git add src/design-system/reference/content/PatternSpecimen.tsx src/design-system/reference/content/PatternSpecimen.test.tsx
git commit -m "feat: complete pattern visual specimens"
~~~

### Task 7: Verify ordering and public boundaries

**Files:**

- Modify: src/design-system/reference/content/content.test.tsx

**Interfaces:**

- Every public Component and Pattern section has one Live specimen region before its Purpose heading and retains token dependencies/context link.

- [ ] **Step 1: Write failing ordering assertions**

~~~tsx
const specimen = screen.getByRole("region", { name: "Live specimen" });
const purpose = screen.getByRole("heading", { name: "Purpose" });
expect(specimen.compareDocumentPosition(purpose) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
expect(container.querySelector("iframe")).toBeNull();
expect(screen.queryByRole("button", { name: "Export JSON" })).not.toBeInTheDocument();
~~~

Run this for every Component and Pattern section rather than a representative sample.

- [ ] **Step 2: Verify RED, implement only necessary composition corrections, then GREEN**

Run: npx vitest run src/design-system/reference/content/content.test.tsx

Expected: every section passes once the unified visual region is first and no authoring boundary leaks into public content.

- [ ] **Step 3: Commit**

~~~bash
git add src/design-system/reference/content/content.test.tsx src/design-system/reference/content/Components.tsx src/design-system/reference/content/Patterns.tsx
git commit -m "test: verify visual reference coverage"
~~~

### Task 8: Full verification and browser QA

**Files:** Modify only if verification exposes a defect.

- [ ] **Step 1: Run automated verification**

~~~bash
npm test
npx tsc -b
npm run lint
npm run build
git diff --check
xmllint --noout public/sitemap.xml
git diff --exit-code -- src/styles/tokens.generated.css src/design-system/generated/token-manifest.generated.ts
~~~

Expected: tests, TypeScript, and build pass; lint has no errors; generated artifacts are unchanged.

- [ ] **Step 2: Browser QA**

At 320px, 768px, 1440px, and 1920px inspect project card, lightbox, section navigation, transitions, responsive behavior, expressive visuals, and accessibility. Verify no horizontal overflow, working Escape/focus restoration, replay/pause/selection actions, reduced-motion stable states, no iframe/token editor, and no console errors.

## Completion criteria

- P0 and P1 visual stages cover all fourteen Component and Pattern pages.
- Metadata/media specimens reuse extracted production components.
- Lightbox invokes the existing full-viewport production overlay.
- Every animated stage has a verified reduced-motion stable state.
- Full verification and responsive browser QA pass without public authoring controls.
