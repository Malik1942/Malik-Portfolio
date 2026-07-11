import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useHideOnScroll } from "./useHideOnScroll";

function setScrollY(y: number) {
  Object.defineProperty(window, "scrollY", { value: y, configurable: true, writable: true });
}
function fireScroll() {
  act(() => {
    window.dispatchEvent(new Event("scroll"));
  });
}

describe("useHideOnScroll", () => {
  let rafSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    setScrollY(0);
    // Run the rAF-throttled update synchronously so assertions are deterministic.
    rafSpy = vi
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((cb: FrameRequestCallback) => {
        cb(0);
        return 1;
      });
  });

  afterEach(() => {
    rafSpy.mockRestore();
  });

  it("starts visible (not hidden)", () => {
    const { result } = renderHook(() => useHideOnScroll());
    expect(result.current).toBe(false);
  });

  it("hides when scrolling down past the top zone", () => {
    const { result } = renderHook(() => useHideOnScroll({ threshold: 8, nearTop: 80 }));
    setScrollY(300);
    fireScroll();
    expect(result.current).toBe(true);
  });

  it("reveals again when scrolling back up past the threshold", () => {
    const { result } = renderHook(() => useHideOnScroll({ threshold: 8, nearTop: 80 }));
    setScrollY(300);
    fireScroll();
    expect(result.current).toBe(true);

    setScrollY(260); // up 40px > threshold
    fireScroll();
    expect(result.current).toBe(false);
  });

  it("always shows near the very top regardless of direction", () => {
    const { result } = renderHook(() => useHideOnScroll({ nearTop: 80 }));
    setScrollY(300);
    fireScroll();
    expect(result.current).toBe(true);

    setScrollY(40); // within nearTop zone
    fireScroll();
    expect(result.current).toBe(false);
  });

  it("ignores sub-threshold movement to prevent flicker", () => {
    const { result } = renderHook(() => useHideOnScroll({ threshold: 8, nearTop: 80 }));
    setScrollY(300);
    fireScroll();
    expect(result.current).toBe(true);

    setScrollY(295); // up only 5px < threshold
    fireScroll();
    expect(result.current).toBe(true); // unchanged
  });

  it("uses a passive scroll listener and cleans it up on unmount", () => {
    const add = vi.spyOn(window, "addEventListener");
    const remove = vi.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => useHideOnScroll());

    expect(add).toHaveBeenCalledWith("scroll", expect.any(Function), { passive: true });
    unmount();
    expect(remove).toHaveBeenCalledWith("scroll", expect.any(Function));

    add.mockRestore();
    remove.mockRestore();
  });
});
