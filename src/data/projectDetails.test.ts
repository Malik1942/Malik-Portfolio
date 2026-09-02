import { describe, expect, it } from "vitest";

import { PROJECT_DETAILS } from "./projectDetails";
import { PROJECTS, getProject } from "./projects";
import { SECTIONS } from "@/lib/sections";

describe("case-study documents", () => {
  it.each(Object.values(PROJECT_DETAILS))(
    "$slug carries the eyebrow of its homepage section",
    (doc) => {
      const project = getProject(doc.slug);
      expect(project, `no homepage project for case study "${doc.slug}"`).toBeDefined();
      expect(doc.listSection).toBe(SECTIONS[project!.section].label);
    },
  );

  it("has a document for every homepage card that routes to a case study (no dead cards)", () => {
    const missing = PROJECTS.filter(
      (p) => p.destination.kind === "case-study" && !PROJECT_DETAILS[p.id],
    ).map((p) => p.id);
    expect(missing).toEqual([]);
  });
});
