import { describe, expect, it } from "vitest";
import {
  DESIGN_SYSTEM_GROUPS,
  OVERVIEW_SECTION,
  getAdjacentSections,
  resolveSectionHash,
} from "./sectionModel";

describe("design system section model", () => {
  it("resolves a stable hash and falls back to overview", () => {
    expect(resolveSectionHash("#foundation-color").id).toBe("foundation-color");
    expect(resolveSectionHash("#playground").id).toBe("overview");
    expect(resolveSectionHash("#unknown").id).toBe("overview");
    expect(resolveSectionHash("").id).toBe("overview");
  });

  it("returns linear previous and next sections", () => {
    expect(getAdjacentSections("foundation-color")).toEqual({
      previous: expect.objectContaining({ id: "foundation-typography" }),
      next: expect.objectContaining({ id: "foundation-tokens" }),
    });
  });

  it("keeps overview as a top-level section above the groups", () => {
    expect(OVERVIEW_SECTION).toMatchObject({ id: "overview", label: "Overview" });
    const groupedIds = DESIGN_SYSTEM_GROUPS.flatMap((group) =>
      group.sections.map((section) => section.id),
    );
    expect(groupedIds).not.toContain("overview");
    // It still leads the linear reading sequence.
    expect(getAdjacentSections("overview").previous).toBeUndefined();
    expect(getAdjacentSections("overview").next).toMatchObject({
      id: "foundation-typography",
    });
  });

  it("declares the complete grouped registry in stable order", () => {
    expect(DESIGN_SYSTEM_GROUPS.map((group) => group.id)).toEqual([
      "foundations",
      "components",
      "patterns",
    ]);
    expect(DESIGN_SYSTEM_GROUPS.flatMap((group) => group.sections)).toHaveLength(19);
    expect(DESIGN_SYSTEM_GROUPS[0].sections.map((section) => section.id)).toEqual([
      "foundation-typography",
      "foundation-color",
      "foundation-tokens",
      "foundation-icons",
    ]);
    expect(DESIGN_SYSTEM_GROUPS[0].sections.map((section) => section.label)).toEqual([
      "Type",
      "Color",
      "Spacing & motion",
      "Icons",
    ]);
    expect(DESIGN_SYSTEM_GROUPS[1].sections[0]).toMatchObject({
      id: "component-lineup",
      label: "Component lineup",
    });
    expect(DESIGN_SYSTEM_GROUPS.at(-1)?.sections.at(-1)?.id).toBe("pattern-accessibility");
  });

  it("omits unavailable adjacent directions at the registry edges", () => {
    expect(getAdjacentSections("overview")).toEqual({
      previous: undefined,
      next: expect.objectContaining({ id: "foundation-typography" }),
    });
    expect(getAdjacentSections("pattern-accessibility")).toEqual({
      previous: expect.objectContaining({ id: "pattern-expressive" }),
      next: undefined,
    });
  });
});
