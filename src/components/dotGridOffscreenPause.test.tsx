import { act, cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import DotGrid from "./DotGrid";

// The hero canvas redraws thousands of dots every frame. That loop must stop
// while the hero is scrolled off-screen (it was costing the project cards half
// of every frame during a scroll) and pick up again when the hero returns, or
// when About or a lens gives it new work while it is out of view.
//
// jsdom has no canvas, fonts, IntersectionObserver or rendering frames, so each
// is stubbed just enough for DotGrid to initialise and run its loop by hand.

type IoCallback = (entries: IntersectionObserverEntry[]) => void;

let frames: FrameRequestCallback[] = [];
let ioCallback: IoCallback | null = null;

/** Run every frame that is currently scheduled, once. */
const tick = () =>
  act(() => {
    const due = frames;
    frames = [];
    due.forEach((cb) => cb(performance.now()));
  });

const setVisible = (isIntersecting: boolean) =>
  act(() => {
    ioCallback?.([{ isIntersecting } as IntersectionObserverEntry]);
  });

beforeEach(() => {
  frames = [];
  ioCallback = null;
  let nextId = 1;
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    frames.push(cb);
    return nextId++;
  });
  vi.stubGlobal("cancelAnimationFrame", () => {});
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(cb: IoCallback) {
        ioCallback = cb;
      }
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    },
  );
  Object.defineProperty(document, "fonts", {
    configurable: true,
    value: { ready: Promise.resolve() },
  });
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
  // A 2D context that accepts every call; getImageData yields a blank bitmap.
  const context = new Proxy(
    {},
    {
      get: (target, key) => {
        if (key === "getImageData") return (_x: number, _y: number, w: number, h: number) => ({ data: new Uint8ClampedArray(w * h * 4) });
        if (key === "createRadialGradient") return () => ({ addColorStop() {} });
        if (key in target) return (target as Record<PropertyKey, unknown>)[key];
        return () => {};
      },
      set: (target, key, value) => {
        (target as Record<PropertyKey, unknown>)[key] = value;
        return true;
      },
    },
  );
  HTMLCanvasElement.prototype.getContext = (() => context) as unknown as typeof HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getBoundingClientRect = () =>
    ({ x: 0, y: 0, top: 0, left: 0, width: 1200, height: 800, right: 1200, bottom: 800, toJSON() {} }) as DOMRect;
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const mount = async (aboutMode = false) => {
  const view = render(<DotGrid aboutMode={aboutMode} />);
  // Let the font-ready promise resolve so the scene initialises.
  await act(async () => {});
  return view;
};

describe("DotGrid off-screen pause", () => {
  it("keeps drawing while the hero is on screen", async () => {
    await mount();
    setVisible(true);
    tick();
    tick();
    expect(frames.length).toBe(1);
  });

  it("stops the frame loop once the hero leaves the viewport", async () => {
    await mount();
    setVisible(true);
    tick();
    setVisible(false);
    // The frame already pending runs, sees the canvas is off-screen, and does
    // not schedule another.
    tick();
    expect(frames.length).toBe(0);
    tick();
    expect(frames.length).toBe(0);
  });

  it("resumes when the hero scrolls back into view", async () => {
    await mount();
    setVisible(false);
    tick();
    expect(frames.length).toBe(0);
    setVisible(true);
    expect(frames.length).toBe(1);
    tick();
    expect(frames.length).toBe(1);
  });

  it("keeps running off-screen while About is open, so its transition plays", async () => {
    const view = await mount();
    setVisible(false);
    tick();
    expect(frames.length).toBe(0);
    view.rerender(<DotGrid aboutMode />);
    expect(frames.length).toBe(1);
    tick();
    tick();
    expect(frames.length).toBe(1);
  });
});
