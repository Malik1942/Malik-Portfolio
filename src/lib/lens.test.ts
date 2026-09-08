import { describe, expect, it } from "vitest";

import { PROJECTS, SKILLS, projectsInSection, projectsWithSkill } from "@/data/projects";
import { SECTIONS, WORK_LABEL } from "@/lib/sections";
import {
  LENSES,
  LENS_ROW,
  SHIPPED,
  isShipped,
  lensAside,
  lensCounts,
  lensHref,
  lensMatch,
  lensProjectIds,
  lensFromSlug,
  lensSlug,
  lensTitle,
  projectsInLens,
} from "./lens";

describe("skill lens", () => {
  it("offers Shipped first, then real, well-populated skills, each once", () => {
    expect(LENS_ROW[0]).toBe(SHIPPED);
    expect(new Set(LENS_ROW).size).toBe(LENS_ROW.length);
    expect(LENS_ROW.length).toBeLessThanOrEqual(8);
    for (const lens of LENS_ROW) {
      expect(LENSES).toContain(lens);
      // A lens offered up front should gather more than a card or two, unless
      // it has somewhere else on the site to point (the design system page).
      if (!lensAside(lens)) expect(projectsInLens(lens).length, lens).toBeGreaterThanOrEqual(3);
    }
  });

  it("points the Design Systems lens at the site's own system, and no other lens anywhere", () => {
    expect(lensAside("Design Systems")).toEqual({ label: "This site's design system", path: "/design-system" });
    for (const lens of LENSES) if (lens !== "Design Systems") expect(lensAside(lens), lens).toBeNull();
    expect(LENS_ROW).toContain("Design Systems");
  });

  it("never lets Shipped become a chip: it is a lens over the link chips, not a skill", () => {
    expect(SKILLS as readonly string[]).not.toContain(SHIPPED);
    for (const project of PROJECTS) expect(project.skills as readonly string[]).not.toContain(SHIPPED);
  });

  it("gathers the shipped projects as the ones with an outbound link", () => {
    expect([...lensProjectIds(SHIPPED)].sort()).toEqual(["calmmouse", "inkwork", "moti", "oryne"]);
    for (const project of PROJECTS) {
      expect(lensMatch(project, SHIPPED), project.id).toBe(isShipped(project));
    }
    expect(lensMatch({ skills: ["AI-Native"] }, SHIPPED)).toBe(false);
    expect(lensMatch({ links: [{ label: "Live", url: "https://example.com/" }] }, SHIPPED)).toBe(true);
    // Two on each page, so both pages point at the other.
    expect(lensCounts(SHIPPED, "/")).toMatchObject({ here: 2, first: "oryne", elsewhere: { count: 2 } });
    expect(lensCounts(SHIPPED, SECTIONS.studio.path)).toMatchObject({ here: 2, first: "calmmouse", elsewhere: { count: 2 } });
    expect(lensTitle(SHIPPED, false)).toBe("See every project that shipped");
    expect(lensTitle("AI-Native", false)).toBe("See every project with AI-Native");
    expect(lensTitle(SHIPPED, true)).toBe("Clear lens");
  });

  it("gives every lens a distinct URL slug that reads back to the same lens", () => {
    const slugs = LENSES.map(lensSlug);
    expect(new Set(slugs).size).toBe(LENSES.length);
    for (const lens of LENSES) {
      expect(lensSlug(lens)).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(lensFromSlug(lensSlug(lens))).toBe(lens);
    }
    expect(lensSlug("Hardware UX")).toBe("hardware-ux");
    expect(lensSlug("AI-Native")).toBe("ai-native");
    expect(lensSlug(SHIPPED)).toBe("shipped");
  });

  it("treats an unknown or missing lens as no lens", () => {
    expect(lensFromSlug(null)).toBeNull();
    expect(lensFromSlug("")).toBeNull();
    expect(lensFromSlug("basket-weaving")).toBeNull();
    expect(lensFromSlug("Industrial Design")).toBeNull();
  });

  it("builds a page href with the lens set, and the plain page without one", () => {
    expect(lensHref("/", "Industrial Design")).toBe("/?lens=industrial-design");
    expect(lensHref(SECTIONS.studio.path, "AI-Native")).toBe("/studio?lens=ai-native");
    expect(lensHref("/", null)).toBe("/");
  });

  it("tells 'no lens' apart from 'outside the lens'", () => {
    expect(lensMatch({ skills: ["AI-Native"] }, null)).toBeNull();
    expect(lensMatch({ skills: ["AI-Native"] }, "AI-Native")).toBe(true);
    expect(lensMatch({ skills: ["AI-Native"] }, "Industrial Design")).toBe(false);
    expect(lensMatch({}, "Industrial Design")).toBe(false);
  });

  it("gathers a skill across every section", () => {
    const ids = lensProjectIds("Industrial Design");
    expect([...ids].sort()).toEqual(["moodmuse", "ranger", "tubular", "zeat"]);
    expect(lensProjectIds(null).size).toBe(0);
    for (const skill of SKILLS) {
      expect(lensProjectIds(skill)).toEqual(new Set(projectsWithSkill(skill).map((p) => p.id)));
    }
  });

  it("counts matches on this page and points at the rest", () => {
    const homeTotal = projectsInSection("selected").length + projectsInSection("more").length;
    const home = lensCounts("Industrial Design", "/");
    expect(home.total).toBe(homeTotal);
    expect(home.here).toBe(2);
    expect(home.elsewhere).toEqual({ count: 2, label: SECTIONS.studio.label, path: SECTIONS.studio.path });

    const studio = lensCounts("Industrial Design", SECTIONS.studio.path);
    expect(studio.total).toBe(projectsInSection("studio").length);
    expect(studio.here).toBe(2);
    expect(studio.elsewhere).toEqual({ count: 2, label: WORK_LABEL, path: "/" });
  });

  it("drops the cross-page link when the other page has nothing in the lens", () => {
    // UX Research is Aura, Spatial Editor and FlowPrint, all on the homepage.
    expect(lensCounts("UX Research", "/").elsewhere).toBeNull();
    expect(lensCounts("UX Research", SECTIONS.studio.path)).toMatchObject({ here: 0, elsewhere: { count: 3 } });
  });

  it("keeps every skill reachable: each is on at least one card, and every card carries at least one", () => {
    for (const skill of SKILLS) expect(projectsWithSkill(skill).length, skill).toBeGreaterThan(0);
    for (const project of PROJECTS) expect(project.skills.length, project.id).toBeGreaterThan(0);
  });
});
