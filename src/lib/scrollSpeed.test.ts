import { afterEach, describe, expect, it } from "vitest";

import { outrunsEntrance, resetScrollSpeed, sampleScroll, scrollSpeed } from "./scrollSpeed";

describe("scrollSpeed", () => {
  afterEach(resetScrollSpeed);

  it("reads zero before the page has scrolled", () => {
    expect(scrollSpeed(1000)).toBe(0);
  });

  it("reads zero from a single sample, since one position has no speed", () => {
    sampleScroll(0, 1000);
    expect(scrollSpeed(1000)).toBe(0);
  });

  it("averages the recent samples into px per second", () => {
    // 30px every 10ms is 3000px/s.
    for (let i = 0; i <= 10; i++) sampleScroll(i * 30, 1000 + i * 10);
    expect(scrollSpeed(1100)).toBeCloseTo(3000, 0);
  });

  it("reads scrolling up as the same speed as scrolling down", () => {
    for (let i = 0; i <= 10; i++) sampleScroll(5000 - i * 30, 1000 + i * 10);
    expect(scrollSpeed(1100)).toBeCloseTo(3000, 0);
  });

  it("forgets a flick once the page has stood still", () => {
    for (let i = 0; i <= 10; i++) sampleScroll(i * 30, 1000 + i * 10);
    expect(scrollSpeed(1400)).toBe(0);
  });

  it("measures a new flick without the pause before it", () => {
    sampleScroll(0, 0);
    // Two seconds later the visitor flicks: 50px every 10ms, 5000px/s.
    for (let i = 0; i <= 5; i++) sampleScroll(100 + i * 50, 2000 + i * 10);
    expect(scrollSpeed(2050)).toBeCloseTo(5000, 0);
  });
});

describe("outrunsEntrance", () => {
  it("is true when the page travels more than a screen while the entrance plays", () => {
    // 2000px/s for 0.75s is 1500px, past a 982px screen.
    expect(outrunsEntrance(2000, 982, 0.75)).toBe(true);
  });

  it("is false at a reading pace, where the entrance settles in view", () => {
    // 1200px/s for 0.75s is 900px, inside the screen.
    expect(outrunsEntrance(1200, 982, 0.75)).toBe(false);
  });

  it("is false when the page is standing still", () => {
    expect(outrunsEntrance(0, 982, 0.75)).toBe(false);
  });
});
