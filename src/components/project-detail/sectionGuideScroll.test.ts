import { describe, expect, it } from "vitest";
import { centeredScrollLeft } from "./sectionGuideScroll";

// A phone-sized guide: 375px of visible row over 1320px of chips.
const track = { trackWidth: 327, maxScrollLeft: 993 };

describe("centeredScrollLeft", () => {
  it("centres a chip from the middle of the row", () => {
    const left = centeredScrollLeft({ chipStart: 600, chipWidth: 90, ...track });

    // The chip's own centre (600 + 45) lands on the track's centre (327 / 2).
    expect(left + track.trackWidth / 2).toBeCloseTo(600 + 45);
  });

  it("rests at the start rather than pulling in a gutter before the first chip", () => {
    expect(centeredScrollLeft({ chipStart: 0, chipWidth: 80, ...track })).toBe(0);
  });

  it("rests at the end rather than scrolling past the last chip", () => {
    expect(centeredScrollLeft({ chipStart: 1240, chipWidth: 80, ...track })).toBe(
      track.maxScrollLeft,
    );
  });

  it("stays at 0 when the whole row already fits", () => {
    expect(
      centeredScrollLeft({ chipStart: 120, chipWidth: 80, trackWidth: 327, maxScrollLeft: 0 }),
    ).toBe(0);
  });
});
