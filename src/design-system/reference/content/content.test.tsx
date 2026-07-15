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

  it("leaves Playground as an explicit Task 7 handoff", () => {
    const playground = DESIGN_SYSTEM_GROUPS[0].sections[1];
    render(<>{renderReferenceSection(playground)}</>);
    expect(screen.getByText(/live browser-local workbench arrives in the next implementation slice/i)).toBeInTheDocument();
  });
});
