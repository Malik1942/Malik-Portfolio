import { describe, expect, it } from "vitest";

import {
  MAX_SKILLS,
  PROJECTS,
  SKILLS,
  STUDIO_GROUPS,
  projectIdsWithDots,
  projectReturn,
  projectsInSection,
  studioGroups,
} from "./projects";
import { SECTIONS, SECTION_ORDER } from "@/lib/sections";

// The homepage is generated from this list, so a malformed entry is a card that
// renders wrong (or a dead card) rather than a compile error.
describe("homepage project list", () => {
  it("gives every project a unique id", () => {
    const ids = PROJECTS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(PROJECTS)("$id has a valid section, 0 to 3 known skills, and a destination", (project) => {
    expect(Object.keys(SECTIONS)).toContain(project.section);
    expect(project.skills.length).toBeLessThanOrEqual(MAX_SKILLS);
    for (const skill of project.skills) expect(SKILLS).toContain(skill);
    expect(project.destination.kind).toMatch(/^(case-study|video|external|placeholder)$/);
  });

  it("returns each case study to the surface it is listed on", () => {
    expect(projectReturn("moti")).toEqual({ to: "/", state: { scrollTo: SECTIONS.selected.id } });
    expect(projectReturn("flowprint")).toEqual({ to: "/", state: { scrollTo: SECTIONS.more.id } });
    expect(projectReturn("oryne")).toEqual({ to: "/", state: { scrollTo: SECTIONS.selected.id } });
    expect(projectReturn("zeat")).toEqual({ to: SECTIONS.studio.path });
  });

  it("keeps the skill vocabulary within the cap of 12", () => {
    expect(SKILLS.length).toBeLessThanOrEqual(12);
  });

  it("puts every project in exactly one rendered section", () => {
    const rendered = SECTION_ORDER.flatMap((key) => projectsInSection(key).map((p) => p.id));
    expect([...rendered].sort()).toEqual(PROJECTS.map((p) => p.id).sort());
  });

  it("holds the locked section assignments", () => {
    expect(projectsInSection("selected").map((p) => p.id)).toEqual(["oryne", "neuralyfe", "aura", "moti"]);
    expect(projectsInSection("more").map((p) => p.id)).toEqual(["spatial", "moodmuse", "tubular", "flowprint"]);
    expect(projectsInSection("studio").map((p) => p.id)).toEqual([
      "calmmouse",
      "inkwork",
      "studiowaters",
      "zeat",
      "ranger",
    ]);
  });

  it("puts every Studio project in a group, and no other project in one", () => {
    for (const project of PROJECTS) {
      if (project.section === "studio") {
        expect(project.studioGroup, `${project.id} needs a studioGroup`).toBeDefined();
        expect(STUDIO_GROUPS.map((g) => g.key)).toContain(project.studioGroup);
      } else {
        expect(project.studioGroup, `${project.id} is not in Studio`).toBeUndefined();
      }
    }
    const grouped = studioGroups().flatMap((group) => group.projects.map((p) => p.id));
    expect(grouped).toEqual(projectsInSection("studio").map((p) => p.id));
  });

  it("holds the locked Studio grouping: the software first, then the machines", () => {
    expect(studioGroups().map((group) => [group.key, group.projects.map((p) => p.id)])).toEqual([
      ["software", ["calmmouse", "inkwork", "studiowaters"]],
      ["machines", ["zeat", "ranger"]],
    ]);
  });

  it("draws hero dots for Selected Work and More Work only", () => {
    expect(projectIdsWithDots()).toEqual([
      ...projectsInSection("selected").map((p) => p.id),
      ...projectsInSection("more").map((p) => p.id),
    ]);
  });

  it("gives every shipped chip an https url", () => {
    for (const project of PROJECTS) {
      for (const link of project.links ?? []) expect(link.url).toMatch(/^https:\/\//);
    }
  });
});
