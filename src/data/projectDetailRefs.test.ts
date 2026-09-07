import { describe, expect, it } from "vitest";

import { PROJECT_DETAILS } from "./projectDetails";
import { INLINE_MODULE_KEYS } from "@/components/project-detail/ProjectDetailTemplate";

// The [[module:key]] and [[fig:N]] refs in a case-study body are resolved by a
// hand-rolled parser in SectionBody, and an unresolved ref does not throw. It falls
// through to the plain-paragraph branch and renders "[[module:moti-workflow]]" as
// visible text on the live page. Nothing else in the suite covers that contract, so a
// renamed registry key or a figure index off by one ships silently. CLAUDE.md records
// this exact failure mode costing the hero-dot animation months of being quietly dead.
const MODULE_REF = /^\[\[module:([^\]]+)\]\]$/;
const FIG_REF = /^\[\[fig:(\d+)\]\]$/;

const sections = Object.values(PROJECT_DETAILS).flatMap((doc) =>
  doc.sections.map((section) => ({ slug: doc.slug, section })),
);

describe("case-study inline refs", () => {
  it("resolves every [[module:key]] to a registered module", () => {
    const known = new Set(INLINE_MODULE_KEYS);
    const unresolved: string[] = [];
    for (const { slug, section } of sections) {
      for (const para of section.body.split(/\n\n+/)) {
        const key = para.trim().match(MODULE_REF)?.[1];
        if (key && !known.has(key)) unresolved.push(`${slug}/${section.id}: ${key}`);
      }
      if (section.afterMetaModule && !known.has(section.afterMetaModule)) {
        unresolved.push(`${slug}/${section.id}: afterMetaModule ${section.afterMetaModule}`);
      }
    }
    expect(unresolved).toEqual([]);
  });

  it("resolves every [[fig:N]] to a figure that exists on its section", () => {
    const unresolved: string[] = [];
    for (const { slug, section } of sections) {
      const count = section.figures?.length ?? 0;
      for (const para of section.body.split(/\n\n+/)) {
        const idx = para.trim().match(FIG_REF)?.[1];
        if (idx !== undefined && Number(idx) >= count) {
          unresolved.push(`${slug}/${section.id}: fig ${idx} of ${count}`);
        }
      }
    }
    expect(unresolved).toEqual([]);
  });

  it("renders every registered module somewhere (no orphans left behind)", () => {
    const referenced = new Set<string>();
    for (const { section } of sections) {
      for (const para of section.body.split(/\n\n+/)) {
        const key = para.trim().match(MODULE_REF)?.[1];
        if (key) referenced.add(key);
      }
      if (section.afterMetaModule) referenced.add(section.afterMetaModule);
    }
    const orphaned = INLINE_MODULE_KEYS.filter((key) => !referenced.has(key));
    expect(orphaned).toEqual([]);
  });
});
