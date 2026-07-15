import { describe, expect, it } from "vitest";
import {
  DESIGN_SYSTEM_GROUPS,
  getAdjacentSections,
  resolveSectionHash,
} from "./sectionModel";

describe("design system section model", () => {
  it("resolves a stable hash and falls back to overview", () => {
    expect(resolveSectionHash("#foundation-color").id).toBe("foundation-color");
    expect(resolveSectionHash("#unknown").id).toBe("overview");
    expect(resolveSectionHash("").id).toBe("overview");
  });

  it("returns linear previous and next sections", () => {
    expect(getAdjacentSections("foundation-color")).toEqual({
      previous: expect.objectContaining({ id: "playground" }),
      next: expect.objectContaining({ id: "foundation-typography" }),
    });
  });

  it("declares the complete grouped registry in stable order", () => {
    expect(DESIGN_SYSTEM_GROUPS.map((group) => group.id)).toEqual([
      "start",
      "foundations",
      "components",
      "patterns",
    ]);
    expect(DESIGN_SYSTEM_GROUPS.flatMap((group) => group.sections)).toHaveLength(21);
    expect(DESIGN_SYSTEM_GROUPS.at(-1)?.sections.at(-1)?.id).toBe("pattern-accessibility");
  });

  it("omits unavailable adjacent directions at the registry edges", () => {
    expect(getAdjacentSections("overview")).toEqual({
      previous: undefined,
      next: expect.objectContaining({ id: "playground" }),
    });
    expect(getAdjacentSections("pattern-accessibility")).toEqual({
      previous: expect.objectContaining({ id: "pattern-expressive" }),
      next: undefined,
    });
  });
});
