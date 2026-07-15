import { describe, expect, it } from "vitest";
import { nextDotGridCanvasSize } from "./dotGridSize";

describe("nextDotGridCanvasSize", () => {
  it.each([
    [0, 720],
    [1280, 0],
    [0.4, 720],
    [1280, 0.4],
  ])("ignores a transient non-drawable %sx%s canvas observation", (width, height) => {
    expect(nextDotGridCanvasSize(width, height, { w: 1280, h: 720 })).toBeNull();
  });

  it("ignores redundant observations and returns a rounded positive resize", () => {
    expect(nextDotGridCanvasSize(1280, 720, { w: 1280, h: 720 })).toBeNull();
    expect(nextDotGridCanvasSize(767.6, 899.5, { w: 320, h: 900 })).toEqual({
      w: 768,
      h: 900,
    });
  });
});
