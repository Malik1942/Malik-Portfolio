import { describe, expect, it } from "vitest";

import { PROJECTS, SKILLS, projectsInSection, projectsWithSkill } from "@/data/projects";
import { SECTIONS, WORK_LABEL } from "@/lib/sections";
import { LENS_ROW, lensCounts, lensHref, lensMatch, lensProjectIds, skillFromSlug, skillSlug } from "./lens";

describe("skill lens", () => {
  it("offers only real, well-populated skills up front, each once", () => {
    expect(new Set(LENS_ROW).size).toBe(LENS_ROW.length);
    expect(LENS_ROW.length).toBeLessThanOrEqual(6);
    for (const skill of LENS_ROW) {
      expect(SKILLS).toContain(skill);
      // A lens offered up front should gather more than a card or two.
      expect(projectsWithSkill(skill).length, skill).toBeGreaterThanOrEqual(3);
    }
  });

  it("gives every skill a distinct URL slug that reads back to the same skill", () => {
    const slugs = SKILLS.map(skillSlug);
    expect(new Set(slugs).size).toBe(SKILLS.length);
    for (const skill of SKILLS) {
      expect(skillSlug(skill)).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(skillFromSlug(skillSlug(skill))).toBe(skill);
    }
    expect(skillSlug("iOS / SwiftUI")).toBe("ios-swiftui");
    expect(skillSlug("AI-Native")).toBe("ai-native");
  });

  it("treats an unknown or missing lens as no lens", () => {
    expect(skillFromSlug(null)).toBeNull();
    expect(skillFromSlug("")).toBeNull();
    expect(skillFromSlug("basket-weaving")).toBeNull();
    expect(skillFromSlug("Industrial Design")).toBeNull();
  });

  it("builds a page href with the lens set, and the plain page without one", () => {
    expect(lensHref("/", "Industrial Design")).toBe("/?lens=industrial-design");
    expect(lensHref(SECTIONS.studio.path, "AI-Native")).toBe("/studio?lens=ai-native");
    expect(lensHref("/", null)).toBe("/");
  });

  it("tells 'no lens' apart from 'outside the lens'", () => {
    expect(lensMatch(["AI-Native"], null)).toBeNull();
    expect(lensMatch(["AI-Native"], "AI-Native")).toBe(true);
    expect(lensMatch(["AI-Native"], "Industrial Design")).toBe(false);
    expect(lensMatch(undefined, "Industrial Design")).toBe(false);
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
    // iOS / SwiftUI is Moti and Oryne, both on the homepage.
    expect(lensCounts("iOS / SwiftUI", "/").elsewhere).toBeNull();
    expect(lensCounts("iOS / SwiftUI", SECTIONS.studio.path)).toMatchObject({ here: 0, elsewhere: { count: 2 } });
  });

  it("keeps every skill reachable: each is on at least one card, and every card carries at least one", () => {
    for (const skill of SKILLS) expect(projectsWithSkill(skill).length, skill).toBeGreaterThan(0);
    for (const project of PROJECTS) expect(project.skills.length, project.id).toBeGreaterThan(0);
  });
});
