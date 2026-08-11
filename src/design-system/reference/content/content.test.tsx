import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { DESIGN_SYSTEM_GROUPS, OVERVIEW_SECTION } from "../sectionModel";
import { getFoundationTokens } from "./Foundations";
import { renderReferenceSection } from "../sections";

describe("design-system reference content", () => {
  afterEach(cleanup);

  it("filters generated token families by canonical path", () => {
    const typography = getFoundationTokens("foundation-typography");
    expect(typography.length).toBeGreaterThan(0);
    expect(typography.every((token) => token.path.startsWith("font."))).toBe(true);
    expect(typography.map((token) => token.path)).toContain("font.family.display");
    expect(typography.map((token) => token.path)).not.toContain("space.4");

    const tokens = getFoundationTokens("foundation-tokens");
    expect(tokens.some((token) => token.path.startsWith("space."))).toBe(true);
    expect(tokens.some((token) => token.path.startsWith("layout."))).toBe(true);
    expect(tokens.some((token) => token.path.startsWith("radius."))).toBe(true);
    expect(tokens.some((token) => token.path.startsWith("duration."))).toBe(true);
  });

  it("documents the six curated-reference principles, exact token flow, and W3C reports", () => {
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
    expect(screen.getByText("DTCG JSON → generated CSS + typed metadata → portfolio + reference")).toBeInTheDocument();
    expect(screen.queryByText(/visitor browser-local draft/i)).not.toBeInTheDocument();
    for (const report of ["Format report", "Color report", "Resolver report"]) {
      expect(screen.getByRole("link", { name: new RegExp(report) })).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("keeps public reference sections free of authoring and preview controls", () => {
    const ids = [
      "overview",
      "foundation-color",
      "foundation-typography",
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

  it("gives every component and pattern a live specimen before its guidance without authoring controls", () => {
    const sections = DESIGN_SYSTEM_GROUPS.slice(1)
      .flatMap((group) => group.sections)
      .filter((section) => section.id !== "component-lineup");

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

  it("lists only canonical tokens that the documented production artifacts consume", () => {
    const expectedTokens: Record<string, string[]> = {
      "component-site-header": [
        "component.siteHeader.scrimColor",
        "color.text.primary",
        "color.border.default",
        "font.family.body",
      ],
      "component-project-card": [
        "component.projectCard.surface",
        "component.projectCard.hoverOverlay",
        "color.text.primary",
        "color.background.canvas",
        "color.border.default",
        "font.family.display",
        "font.family.body",
      ],
      "component-project-list": [
        "color.accent.selectedWork",
        "color.accent.workshop",
        "color.text.primary",
        "font.family.body",
      ],
      "component-metadata-card": [
        "color.border.default",
        "color.surface.secondary",
        "color.text.primary",
        "radius.small",
        "font.family.body",
      ],
      "component-media-frame": ["color.surface.secondary"],
      "component-footer": ["color.text.primary", "color.border.default", "font.family.body"],
      "component-lightbox": ["component.lightbox.backdrop", "color.text.primary", "radius.base"],
      "pattern-homepage-hero": [
        "color.background.canvas",
        "color.text.primary",
        "color.accent.selectedWork",
        "font.family.body",
        "font.family.mono",
        "component.siteHeader.scrimColor",
      ],
      "pattern-case-study": [
        "color.background.canvas",
        "color.text.primary",
        "color.border.default",
        "color.surface.secondary",
        "font.family.body",
        "font.family.display",
        "font.family.mono",
        "component.caseStudyModule.surface",
        "component.caseStudyModule.border",
        "component.caseStudyModule.divider",
      ],
      "pattern-section-navigation": [
        "color.background.canvas",
        "color.text.primary",
        "color.border.default",
        "radius.small",
        "font.family.body",
      ],
      "pattern-responsive": ["color.background.canvas", "color.text.primary", "font.family.body"],
      "pattern-transitions": ["color.text.primary"],
      "pattern-expressive": [
        "color.background.canvas",
        "color.text.primary",
        "font.family.body",
        "font.family.display",
      ],
      "pattern-accessibility": [
        "color.text.primary",
        "color.background.canvas",
        "color.border.default",
        "component.lightbox.backdrop",
      ],
    };

    for (const [sectionId, expected] of Object.entries(expectedTokens)) {
      const section = DESIGN_SYSTEM_GROUPS.flatMap((group) => group.sections).find(
        (candidate) => candidate.id === sectionId,
      );
      if (!section) throw new Error(`Missing section fixture: ${sectionId}`);
      const { unmount } = render(<>{renderReferenceSection(section)}</>);
      const root = screen.getByTestId(`reference-${sectionId}`);
      const tokenSection = root.querySelector(`section[aria-labelledby="${sectionId}-tokens"]`);
      expect(Array.from(tokenSection?.querySelectorAll("code") ?? []).map((node) => node.textContent)).toEqual(expected);
      unmount();
    }
  });

  it("documents partial reduced-motion support and current target-size gaps", () => {
    const renderSection = (id: string) => {
      const section = DESIGN_SYSTEM_GROUPS.flatMap((group) => group.sections).find(
        (candidate) => candidate.id === id,
      );
      if (!section) throw new Error(`Missing section fixture: ${id}`);
      return render(<>{renderReferenceSection(section)}</>);
    };

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
    expect(transitions).toHaveTextContent(/duration and easing tokens.*not wired/i);
    expect(transitions).toHaveTextContent(/PageTransition.*ProjectCard.*SiteHeader inner entrance.*still animate/i);
    view.unmount();

    view = renderSection("pattern-expressive");
    expect(screen.getByTestId("reference-pattern-expressive")).toHaveTextContent(/DotGrid freezes ambient.*morph.*About.*still animate/i);
    view.unmount();

    view = renderSection("pattern-accessibility");
    const accessibility = screen.getByTestId("reference-pattern-accessibility");
    expect(accessibility).toHaveTextContent(/focus ring.*touch target.*not wired/i);
    expect(accessibility).toHaveTextContent(/header and footer inline links.*44px/i);
    expect(accessibility).toHaveTextContent(/reduced-motion coverage is partial/i);
    view.unmount();
  });

  it("describes the metadata cards as a persistent two-column grid", () => {
    const section = DESIGN_SYSTEM_GROUPS.flatMap((group) => group.sections).find(
      (candidate) => candidate.id === "component-metadata-card",
    );
    if (!section) throw new Error("Missing metadata-card section fixture");

    render(<>{renderReferenceSection(section)}</>);

    const metadata = screen.getByTestId("reference-component-metadata-card");
    expect(metadata).toHaveTextContent(/two-column grid at every breakpoint/i);
    expect(metadata).toHaveTextContent(/compact spacing and type on smaller screens/i);
    expect(metadata).not.toHaveTextContent(/four columns to two or one/i);
  });

});
