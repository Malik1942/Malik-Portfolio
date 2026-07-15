import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { DESIGN_SYSTEM_GROUPS } from "../sectionModel";
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

    const spacing = getFoundationTokens("foundation-spacing");
    expect(spacing.some((token) => token.path.startsWith("space."))).toBe(true);
    expect(spacing.some((token) => token.path.startsWith("layout."))).toBe(true);
  });

  it("documents the six principles, exact token flow, local boundary, and W3C reports", () => {
    const overview = DESIGN_SYSTEM_GROUPS[0].sections[0];
    render(<>{renderReferenceSection(overview)}</>);

    for (const principle of [
      "One source of truth",
      "Real artifacts over replicas",
      "Focus over catalog density",
      "Show cause and effect",
      "Separate experimentation from authority",
      "Systemize what repeats; preserve what expresses",
    ]) {
      expect(screen.getByText(principle)).toBeInTheDocument();
    }
    expect(screen.getByText("DTCG JSON → generated CSS + typed metadata → portfolio + reference")).toBeInTheDocument();
    expect(screen.getByText(/browser-local draft/i)).toBeInTheDocument();
    for (const report of ["Format report", "Color report", "Resolver report"]) {
      expect(screen.getByRole("link", { name: new RegExp(report) })).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("maps every non-Playground registry entry to rich, section-specific content", () => {
    const sections = DESIGN_SYSTEM_GROUPS.flatMap((group) => group.sections).filter(
      (section) => section.id !== "playground",
    );

    for (const section of sections) {
      const { unmount } = render(<>{renderReferenceSection(section)}</>);
      expect(screen.getByTestId(`reference-${section.id}`)).toBeInTheDocument();
      expect(screen.getByTestId(`reference-${section.id}`).textContent?.length).toBeGreaterThan(120);
      unmount();
    }
  });

  it("gives every component and pattern purpose, usage, responsive, accessibility, and context", () => {
    const sections = DESIGN_SYSTEM_GROUPS.slice(2).flatMap((group) => group.sections);

    for (const section of sections) {
      const { unmount } = render(<>{renderReferenceSection(section)}</>);
      expect(screen.getByRole("heading", { name: "Purpose" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "Use it when" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "Responsive behavior" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "Accessibility" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /View.*in context/i })).toHaveAttribute("href");
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

  it("leaves Playground as an explicit Task 7 handoff", () => {
    const playground = DESIGN_SYSTEM_GROUPS[0].sections[1];
    render(<>{renderReferenceSection(playground)}</>);
    expect(screen.getByText(/live browser-local workbench arrives in the next implementation slice/i)).toBeInTheDocument();
  });
});
