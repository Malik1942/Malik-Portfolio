import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { scrollToTarget } from "./scrollToTarget";
import { setReducedMotionPreference } from "@/test/setup";

const frame = () => new Promise((res) => requestAnimationFrame(() => res(null)));
const frames = async (n: number) => {
  for (let i = 0; i < n; i += 1) await frame();
};

let scrollToSpy: ReturnType<typeof vi.fn>;

const makeTarget = (top: number, height = 400) => {
  const el = document.createElement("div");
  el.getBoundingClientRect = () =>
    ({ top, height, bottom: top + height, left: 0, right: 0, width: 0, x: 0, y: top }) as DOMRect;
  document.body.appendChild(el);
  return el;
};

const setScrollY = (y: number) => {
  Object.defineProperty(window, "scrollY", { configurable: true, value: y });
};

beforeEach(() => {
  scrollToSpy = vi.fn();
  Object.defineProperty(window, "scrollTo", { configurable: true, value: scrollToSpy });
  Object.defineProperty(window, "innerHeight", { configurable: true, value: 1000 });
  // jsdom reports scrollHeight 0, which would clamp every computed target to 0
  // and make each case look like "already there".
  Object.defineProperty(document.documentElement, "scrollHeight", {
    configurable: true,
    value: 5000,
  });
  setScrollY(0);
});

afterEach(() => {
  document.body.innerHTML = "";
  vi.useRealTimers();
});

describe("scrollToTarget", () => {
  it("hands the animation to the browser instead of driving it frame by frame", async () => {
    scrollToTarget({
      element: makeTarget(2000),
      arrivalEventName: "test-arrive",
      arrivalDetail: { id: "x" },
    });

    // A raf loop would issue a scrollTo per frame — that is main-thread work that
    // competes with image decode and reveal renders, which is what made the
    // scroll stutter. One smooth call keeps the animation on the compositor.
    await frames(5);

    expect(scrollToSpy).toHaveBeenCalledTimes(1);
    expect(scrollToSpy.mock.calls[0][0]).toMatchObject({ behavior: "smooth" });
  });

  it("waits for the scroll to actually settle before announcing arrival", async () => {
    const onArrive = vi.fn();
    window.addEventListener("test-arrive", onArrive);

    scrollToTarget({
      element: makeTarget(2000),
      arrivalEventName: "test-arrive",
      arrivalDetail: { id: "x" },
    });

    // Must NOT fire on the call tick — the browser has not moved the page yet.
    expect(onArrive).not.toHaveBeenCalled();

    // Nor while the page is still short of the target, even if it briefly
    // holds position: a smooth scroll does not begin on the very next frame.
    await frames(3);
    expect(onArrive).not.toHaveBeenCalled();

    setScrollY(1800); // arrived (targetY = 2000 - (1000-400)/2 = 1700, tolerance applies)
    setScrollY(1700);
    await frames(2);

    expect(onArrive).toHaveBeenCalledTimes(1);
    window.removeEventListener("test-arrive", onArrive);
  });

  it("announces on the scrollend event when the browser provides one", async () => {
    const onArrive = vi.fn();
    window.addEventListener("test-arrive", onArrive);

    scrollToTarget({
      element: makeTarget(3000),
      arrivalEventName: "test-arrive",
      arrivalDetail: { id: "x" },
    });
    expect(onArrive).not.toHaveBeenCalled();

    window.dispatchEvent(new Event("scrollend"));

    expect(onArrive).toHaveBeenCalledTimes(1);
    window.removeEventListener("test-arrive", onArrive);
  });

  it("jumps without animating and announces immediately under reduced motion", () => {
    setReducedMotionPreference(true);
    const onArrive = vi.fn();
    window.addEventListener("test-arrive", onArrive);

    scrollToTarget({
      element: makeTarget(2000),
      arrivalEventName: "test-arrive",
      arrivalDetail: { id: "x" },
    });

    expect(scrollToSpy).toHaveBeenCalledTimes(1);
    expect(scrollToSpy.mock.calls[0][0]).toMatchObject({ behavior: "instant" });
    expect(onArrive).toHaveBeenCalledTimes(1);
    window.removeEventListener("test-arrive", onArrive);
  });

  it("announces immediately and does not scroll when already at the target", () => {
    const onArrive = vi.fn();
    window.addEventListener("test-arrive", onArrive);

    // targetY == scrollY: rect.top 300 with height 400 in a 1000px viewport
    scrollToTarget({
      element: makeTarget(300),
      arrivalEventName: "test-arrive",
      arrivalDetail: { id: "x" },
    });

    expect(scrollToSpy).not.toHaveBeenCalled();
    expect(onArrive).toHaveBeenCalledTimes(1);
    window.removeEventListener("test-arrive", onArrive);
  });
});
