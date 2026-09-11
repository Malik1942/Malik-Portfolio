import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { DESIGN_SYSTEM_GROUPS, OVERVIEW_SECTION } from "../sectionModel";
import { getFoundationTokens } from "./Foundations";
import { renderReferenceSection } from "../sections";
import { COMPONENT_DOCS } from "./ComponentDoc";

const findSection = (id: string) => {
  const section = DESIGN_SYSTEM_GROUPS.flatMap((group) => group.sections).find(
    (candidate) => candidate.id === id,
  );
  if (!section) throw new Error(`Missing section fixture: ${id}`);
  return section;
};

describe("design-system reference content", () => {
  afterEach(cleanup);

  it("filters generated token families by canonical path into the three facets", () => {
    const typography = getFoundationTokens("foundation-typography");
    expect(typography.length).toBeGreaterThan(0);
    expect(typography.every((token) => token.path.startsWith("font."))).toBe(true);
    expect(typography.map((token) => token.path)).toContain("font.family.display");
    expect(typography.map((token) => token.path)).not.toContain("rhythm.section.compact");

    const form = getFoundationTokens("foundation-form");
    expect(form.some((token) => token.path.startsWith("rhythm."))).toBe(true);
    expect(form.some((token) => token.path.startsWith("layer."))).toBe(true);
    expect(form.some((token) => token.path.startsWith("space."))).toBe(false);
    expect(form.some((token) => token.path.startsWith("layout."))).toBe(true);
    expect(form.some((token) => token.path.startsWith("measure."))).toBe(true);
    expect(form.some((token) => token.path.startsWith("radius."))).toBe(true);
    expect(form.some((token) => token.path.startsWith("duration."))).toBe(false);

    const motion = getFoundationTokens("foundation-motion");
    expect(motion.some((token) => token.path.startsWith("duration."))).toBe(true);
    expect(motion.some((token) => token.path.startsWith("ease."))).toBe(true);
    expect(motion.some((token) => token.path.startsWith("color."))).toBe(false);
  });

  it("documents the six curated-reference principles, the three facets, exact token flow, and W3C reports", () => {
    render(<>{renderReferenceSection(OVERVIEW_SECTION)}</>);

    for (const principle of [
      "One source of truth",
      "Real artifacts over replicas",
      "Focus over catalog density",
      "Roles before raw values",
      "Context before controls",
      "Systemize what repeats; preserve what expresses",
    ]) {
      expect(screen.getByText(principle)).toBeInTheDocument();
    }
    for (const facet of ["Form", "Material", "Motion"]) {
      expect(screen.getByRole("heading", { name: facet, level: 3 })).toBeInTheDocument();
    }
    expect(screen.getByText("DTCG JSON → generated CSS + typed metadata → portfolio + reference")).toBeInTheDocument();
    expect(screen.queryByText(/visitor browser-local draft/i)).not.toBeInTheDocument();
    for (const report of ["Format report", "Color report", "Resolver report"]) {
      expect(screen.getByRole("link", { name: new RegExp(report) })).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("keeps public reference sections free of authoring and preview controls", () => {
    const ids = [
      "overview",
      "foundation-material",
      "foundation-typography",
      "foundation-motion",
      "component-lineup",
    ];
    const sections = [
      OVERVIEW_SECTION,
      ...DESIGN_SYSTEM_GROUPS.flatMap((group) => group.sections),
    ].filter((section) => ids.includes(section.id));

    render(<>{sections.map((section) => (
      <div key={section.id}>{renderReferenceSection(section)}</div>
    ))}</>);

    expect(screen.queryByRole("button", { name: "Export JSON" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Reset all" })).not.toBeInTheDocument();
    expect(screen.queryByTitle("Live portfolio preview")).not.toBeInTheDocument();
    expect(screen.queryByRole("spinbutton")).not.toBeInTheDocument();
    expect(screen.queryByText(/browser-local token playground/i)).not.toBeInTheDocument();
  });

  it("maps every public registry entry to rich, section-specific content", () => {
    const sections = [
      OVERVIEW_SECTION,
      ...DESIGN_SYSTEM_GROUPS.flatMap((group) => group.sections),
    ];

    for (const section of sections) {
      const { unmount } = render(<>{renderReferenceSection(section)}</>);
      expect(screen.getByTestId(`reference-${section.id}`)).toBeInTheDocument();
      expect(screen.getByTestId(`reference-${section.id}`).textContent?.length).toBeGreaterThan(120);
      unmount();
    }
  });

  it("documents every component in the lineup through ComponentDoc", () => {
    const componentIds = DESIGN_SYSTEM_GROUPS[1].sections
      .map((section) => section.id)
      .filter((id) => id !== "component-lineup");
    expect(Object.keys(COMPONENT_DOCS).sort()).toEqual([...componentIds].sort());
  });

  it("gives every pattern a live specimen before its guidance without authoring controls", () => {
    const sections = DESIGN_SYSTEM_GROUPS[2].sections;

    for (const section of sections) {
      const { container, unmount } = render(<>{renderReferenceSection(section)}</>);
      const specimen = screen.getByRole("region", { name: "Live specimen" });
      const purpose = screen.getByRole("heading", { name: "Purpose" });
      expect(specimen.compareDocumentPosition(purpose) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      expect(screen.getByRole("heading", { name: "Use it when" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "Responsive behavior" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "Accessibility" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /View.*in context/i })).toHaveAttribute("href");
      expect(container.querySelector("iframe")).toBeNull();
      expect(screen.queryByRole("button", { name: "Export JSON" })).not.toBeInTheDocument();
      unmount();
    }
  });

  it("orders documented components as Preview, Recipe, API, Pairings, Accessibility, Testing", () => {
    for (const sectionId of Object.keys(COMPONENT_DOCS)) {
      const { container, unmount } = render(<>{renderReferenceSection(findSection(sectionId))}</>);
      const root = screen.getByTestId(`reference-${sectionId}`);

      const order = ["Preview", "Recipe", "API", "Pairings", "Accessibility", "Testing"];
      expect(
        Array.from(root.querySelectorAll("h2[data-doc-heading]")).map((heading) => heading.textContent),
      ).toEqual(order);

      // The live specimen opens the page, ahead of the recipe and the API table.
      const specimen = screen.getByRole("region", { name: "Live specimen" });
      const api = screen.getByRole("heading", { name: "API", level: 2 });
      expect(specimen.compareDocumentPosition(api) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      expect(screen.getByRole("link", { name: /View.*in context/i })).toHaveAttribute("href");

      // The recipe states all three facets.
      const recipe = within(root).getByTestId("doc-recipe");
      for (const facet of ["Form", "Material", "Motion"]) {
        expect(within(recipe).getByText(facet)).toBeInTheDocument();
      }

      // Sub-sections must not expose their own hash anchors: the shell resolves
      // an unknown hash back to Overview, so an in-page jump would drop the reader.
      const subSectionIds = Array.from(root.querySelectorAll("h2[data-doc-heading], h3[id]")).map(
        (heading) => heading.id,
      );
      const linkedHashes = Array.from(root.querySelectorAll("a[href]"))
        .map((link) => link.getAttribute("href") ?? "")
        .filter((href) => href.startsWith("#"))
        .map((href) => href.slice(1));
      expect(linkedHashes.filter((hash) => subSectionIds.includes(hash))).toEqual([]);

      // Every prop row is a real table row with a name, type, and notes.
      for (const table of Array.from(root.querySelectorAll("table"))) {
        expect(table.querySelectorAll("tbody tr").length).toBeGreaterThan(0);
        expect(table.querySelectorAll('thead th[scope="col"]').length).toBe(4);
        expect(table.querySelectorAll('tbody th[scope="row"]').length).toBe(
          table.querySelectorAll("tbody tr").length,
        );
      }

      expect(screen.getByRole("heading", { name: "Do not pair" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "Not covered" })).toBeInTheDocument();
      expect(root).toHaveTextContent(/\.test\.tsx?/);
      expect(container.querySelector("iframe")).toBeNull();
      expect(screen.queryByRole("button", { name: "Export JSON" })).not.toBeInTheDocument();
      unmount();
    }
  });

  it("documents the project card's real props, pairings, and test coverage", () => {
    render(<>{renderReferenceSection(findSection("component-project-card"))}</>);
    const root = screen.getByTestId("reference-component-project-card");

    for (const prop of ["project", "projectId", "dotClass", "globalIndex", "sectionHero", "destination"]) {
      expect(screen.getAllByRole("rowheader", { name: new RegExp(`^${prop}`) }).length).toBeGreaterThan(0);
    }
    expect(root).toHaveTextContent(/Project list/);
    expect(root).toHaveTextContent(/project-dot-arrive/);
    expect(root).toHaveTextContent(/src\/components\/projectDotArrival\.test\.tsx/);
    expect(root).toHaveTextContent(/src\/components\/coverVideoPlayback\.test\.tsx/);
    // The known gaps stay on the page rather than being quietly dropped.
    expect(root).toHaveTextContent(/entrance.*hover.*do not yet respond to reduced motion/i);
    expect(root).toHaveTextContent(/arrival pulse keeps its own 0\.28s keyframe/i);
  });

  it("documents the primitives with their variant axes", () => {
    render(<>{renderReferenceSection(findSection("component-button"))}</>);
    const button = screen.getByTestId("reference-component-button");
    for (const prop of ["tone", "href", "external", "icon", "iconPosition"]) {
      expect(within(button).getAllByRole("rowheader", { name: new RegExp(`^${prop}`) }).length).toBeGreaterThan(0);
    }
    expect(button).toHaveTextContent(/does not exist in the type scale/);
    cleanup();

    render(<>{renderReferenceSection(findSection("component-chip"))}</>);
    const chip = screen.getByTestId("reference-component-chip");
    expect(within(chip).getAllByRole("rowheader", { name: /^link/ }).length).toBeGreaterThan(0);
    expect(chip).toHaveTextContent(/not nested in the card link/i);
    cleanup();

    render(<>{renderReferenceSection(findSection("component-eyebrow"))}</>);
    expect(screen.getByTestId("reference-component-eyebrow")).toHaveTextContent(/tone changes material only/i);
    cleanup();

    render(<>{renderReferenceSection(findSection("component-back-link"))}</>);
    expect(screen.getByTestId("reference-component-back-link")).toHaveTextContent(/44px touch-target token/i);
  });

  it("lists only canonical tokens that the documented production artifacts consume", () => {
    const expectedTokens: Record<string, string[]> = {
      "component-eyebrow": ["font.size.label", "font.size.bodySmall", "color.text.tertiary", "color.text.secondary", "color.text.primary", "font.family.body", "font.family.mono"],
      "component-chip": ["font.size.label", "font.size.bodySmall", "color.border.hairline", "color.text.tertiary", "color.text.lead", "color.text.primary", "color.focus.ringStrong", "radius.round", "duration.medium", "ease.settle"],
      "component-button": ["color.text.primary", "color.text.lead", "color.background.canvas", "color.border.hairline", "color.border.default", "color.focus.ring", "radius.round", "radius.small", "font.size.body", "font.size.bodySmall", "font.family.mono", "duration.fast", "ease.settle"],
      "component-back-link": ["color.text.secondary", "color.text.primary", "color.focus.ring", "layout.touchTarget", "font.size.bodySmall", "font.family.mono", "radius.small", "duration.fast", "ease.settle"],
      "component-text-link": ["color.text.secondary", "color.text.tertiary", "color.text.primary", "font.size.bodySmall", "font.size.caption", "duration.slow", "ease.settle", "ease.enter"],
      "component-site-header": ["component.siteHeader.scrimColor", "color.text.secondary", "color.text.primary", "color.border.default", "duration.slow", "ease.enter", "ease.standard", "ease.move", "font.family.body"],
      "component-project-card": ["component.projectCard.surface", "component.projectCard.hoverOverlay", "color.text.primary", "color.text.lead", "color.text.secondary", "color.background.canvas", "color.focus.ringStrong", "radius.large", "duration.reveal", "duration.medium", "ease.enter", "ease.move", "font.family.display", "font.family.body"],
      "component-project-list": ["color.accent.selectedWork", "color.accent.workshop", "color.text.primary", "color.text.tertiary", "duration.reveal", "ease.enter", "font.family.body"],
      "component-metadata-card": ["color.border.hairline", "color.surface.secondary", "color.text.tertiary", "color.text.secondary", "radius.small", "font.size.label", "font.size.bodySmall", "font.family.body"],
      "component-media-frame": ["color.surface.secondary", "color.background.canvas", "radius.large"],
      "component-footer": ["color.text.secondary", "color.text.primary", "color.text.tertiary", "color.border.default", "duration.slow", "ease.enter", "font.size.bodySmall", "font.size.caption", "font.family.body"],
      "component-lightbox": ["component.lightbox.backdrop", "color.text.tertiary", "color.text.primary", "radius.base", "duration.fast", "duration.medium", "ease.settle", "ease.move"],
      "pattern-homepage-hero": ["color.background.canvas", "color.text.primary", "color.accent.selectedWork", "font.family.body", "font.family.mono", "component.siteHeader.scrimColor"],
      "pattern-case-study": ["color.background.canvas", "color.text.primary", "color.border.default", "color.surface.secondary", "font.family.body", "font.family.display", "font.family.mono", "component.caseStudyModule.surface", "component.caseStudyModule.border", "component.caseStudyModule.divider"],
      "pattern-section-navigation": ["color.background.canvas", "color.text.primary", "color.text.tertiary", "color.border.default", "radius.small", "duration.medium", "font.family.body"],
      "pattern-responsive": ["color.background.canvas", "color.text.primary", "font.family.body"],
      "pattern-transitions": ["color.text.primary", "duration.page", "duration.reveal", "ease.enter", "ease.move"],
      "pattern-expressive": ["color.background.canvas", "color.text.primary", "font.family.body", "font.family.display"],
      "pattern-accessibility": ["color.text.primary", "color.background.canvas", "color.border.default", "color.focus.ring", "color.focus.ringStrong", "layout.touchTarget", "component.lightbox.backdrop"],
    };

    for (const [sectionId, expected] of Object.entries(expectedTokens)) {
      const { unmount } = render(<>{renderReferenceSection(findSection(sectionId))}</>);
      const root = screen.getByTestId(`reference-${sectionId}`);
      const tokenSection = root.querySelector(`section[aria-labelledby="${sectionId}-tokens"]`);
      expect(Array.from(tokenSection?.querySelectorAll("code") ?? []).map((node) => node.textContent)).toEqual(expected);
      unmount();
    }
  });

  it("documents partial reduced-motion support and current target-size gaps", () => {
    const renderSection = (id: string) => render(<>{renderReferenceSection(findSection(id))}</>);

    let view = renderSection("component-site-header");
    expect(screen.getByTestId("reference-component-site-header")).toHaveTextContent(/outer hide-and-reveal.*reduced motion/i);
    expect(screen.getByTestId("reference-component-site-header")).toHaveTextContent(/inner entrance.*still animates/i);
    expect(screen.getByTestId("reference-component-site-header")).toHaveTextContent(/inline links.*44px/i);
    view.unmount();

    view = renderSection("component-lightbox");
    expect(screen.getByTestId("reference-component-lightbox")).toHaveTextContent(/reduced motion.*backdrop.*image/i);
    expect(screen.getByTestId("reference-component-lightbox")).toHaveTextContent(/close.*40px.*44px/i);
    view.unmount();

    view = renderSection("pattern-transitions");
    const transitions = screen.getByTestId("reference-pattern-transitions");
    expect(transitions).toHaveTextContent(/duration and easing tokens through Tailwind and the MOTION recipes/i);
    expect(transitions).toHaveTextContent(/hero entrance keeps its choreographed local durations/i);
    expect(transitions).toHaveTextContent(/PageTransition.*ProjectCard.*SiteHeader inner entrance.*still animate/i);
    view.unmount();

    view = renderSection("pattern-expressive");
    expect(screen.getByTestId("reference-pattern-expressive")).toHaveTextContent(/DotGrid freezes ambient.*morph.*About.*still animate/i);
    view.unmount();

    view = renderSection("pattern-accessibility");
    const accessibility = screen.getByTestId("reference-pattern-accessibility");
    expect(accessibility).toHaveTextContent(/focus rings are wired/i);
    expect(accessibility).toHaveTextContent(/header and footer inline links.*44px/i);
    expect(accessibility).toHaveTextContent(/reduced-motion coverage is partial/i);
    view.unmount();
  });

  it("describes the metadata cards as a persistent two-column grid", () => {
    render(<>{renderReferenceSection(findSection("component-metadata-card"))}</>);

    const metadata = screen.getByTestId("reference-component-metadata-card");
    expect(metadata).toHaveTextContent(/two-column grid at every breakpoint/i);
    expect(metadata).toHaveTextContent(/compact spacing and type on smaller screens/i);
    expect(metadata).not.toHaveTextContent(/four columns to two or one/i);
  });
});
