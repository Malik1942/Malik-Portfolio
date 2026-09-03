import { describe, expect, it } from "vitest";

import { ORB_POSITIONS, heroOrbs } from "./dotGridOrbs";
import { projectIdsWithDots } from "@/data/projects";
import { SECTIONS } from "@/lib/sections";

describe("hero orb positions", () => {
  it("holds exactly the ids that have dots — no orphan positions, no missing orbs", () => {
    expect(Object.keys(ORB_POSITIONS).sort()).toEqual(projectIdsWithDots().sort());
  });

  it("derives one orb per dotted project, tiered by section, with the section label as subtitle", () => {
    const orbs = heroOrbs();
    expect(orbs.map((o) => o.id)).toEqual(projectIdsWithDots());
    for (const orb of orbs) {
      const section = orb.tier === "bright" ? SECTIONS.selected : SECTIONS.more;
      expect(section.dots).toBe(orb.tier);
      expect(orb.subtitle).toBe(section.label);
      expect(orb.label.length).toBeGreaterThan(0);
    }
  });

  it("keeps every position inside the canvas", () => {
    for (const [id, pos] of Object.entries(ORB_POSITIONS)) {
      for (const v of [pos.rx, pos.ry, pos.mrx, pos.mry]) {
        expect(v, `${id} position out of range`).toBeGreaterThan(0);
        expect(v, `${id} position out of range`).toBeLessThan(1);
      }
    }
  });
});
