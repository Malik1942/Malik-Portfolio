// The scroll itself is run by the browser (`behavior: "smooth"`), not by a raf
// loop here. A loop calling scrollTo() every frame puts the whole animation on
// the main thread, so it stutters against anything else running there — lazy
// cover images decoding as they enter view, card reveal renders, analytics.
// A native smooth scroll is driven on the compositor and stays fluid regardless.
//
// The cost of handing it off is that we no longer know when it finishes, so we
// watch for the end instead of assuming it. Assuming was the original bug.

/** Give up waiting and announce anyway; the browser picks the real duration. */
const SETTLE_TIMEOUT_MS = 2000;
/** Consecutive still frames accepted as "stopped" when `scrollend` is missing. */
const STABLE_FRAMES = 3;
/** Stillness before this is just the scroll not having started yet — ignore it. */
const MIN_SETTLE_MS = 150;
/** Landing within this of the target counts as arrived. */
const ARRIVAL_TOLERANCE_PX = 2;

let cancelActiveWatch: (() => void) | null = null;

/**
 * Resolve once the page has actually stopped moving. Prefers the `scrollend`
 * event and falls back to watching the scroll position settle, because Safari
 * only gained `scrollend` recently. Reading `window.scrollY` per frame is a
 * cheap scalar read — unlike a rect read it forces no layout — and it stops as
 * soon as we land.
 */
const announceOnScrollEnd = (targetY: number, announce: () => void) => {
  cancelActiveWatch?.();

  let settled = false;
  let raf = 0;
  let timeout = 0;
  let lastY = window.scrollY;
  let stable = 0;
  const startedAt = performance.now();

  const cleanup = () => {
    window.removeEventListener("scrollend", onScrollEnd);
    cancelAnimationFrame(raf);
    window.clearTimeout(timeout);
    if (cancelActiveWatch === cancel) cancelActiveWatch = null;
  };

  const settle = () => {
    if (settled) return;
    settled = true;
    cleanup();
    announce();
  };

  // Used when a newer scroll supersedes this one — drop it without announcing.
  const cancel = () => {
    if (settled) return;
    settled = true;
    cleanup();
  };

  function onScrollEnd() {
    settle();
  }

  const poll = () => {
    const y = window.scrollY;
    if (Math.abs(y - targetY) <= ARRIVAL_TOLERANCE_PX) {
      settle();
      return;
    }
    if (y === lastY) {
      stable += 1;
    } else {
      stable = 0;
      lastY = y;
    }
    // Only trust stillness once the browser has had time to get moving, and
    // only then treat it as "stopped short" — e.g. the user grabbed the page,
    // or images loading mid-flight shifted the target out from under us.
    if (stable >= STABLE_FRAMES && performance.now() - startedAt > MIN_SETTLE_MS) {
      settle();
      return;
    }
    raf = requestAnimationFrame(poll);
  };

  window.addEventListener("scrollend", onScrollEnd);
  timeout = window.setTimeout(settle, SETTLE_TIMEOUT_MS);
  raf = requestAnimationFrame(poll);

  cancelActiveWatch = cancel;
};

interface ScrollTargetOptions {
  element: HTMLElement;
  align?: "center" | "start";
  startOffset?: number;
  arrivalEventName: string;
  arrivalDetail: Record<string, string>;
}

export const scrollToTarget = ({
  element,
  align = "center",
  startOffset,
  arrivalEventName,
  arrivalDetail,
}: ScrollTargetOptions) => {
  const announce = () =>
    window.dispatchEvent(new CustomEvent(arrivalEventName, { detail: arrivalDetail }));

  const startY = window.scrollY;
  const rect = element.getBoundingClientRect();
  const viewportOffset =
    align === "center"
      ? (window.innerHeight - rect.height) / 2
      : startOffset ?? Math.min(window.innerHeight * 0.12, 96);
  const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const targetY = Math.max(0, Math.min(startY + rect.top - viewportOffset, maxScroll));

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    cancelActiveWatch?.();
    // Explicit "instant": a bare scrollTo would inherit
    // `html { scroll-behavior: smooth }` and animate anyway.
    window.scrollTo({ top: targetY, behavior: "instant" });
    announce();
    return;
  }

  if (Math.abs(targetY - startY) < 2) {
    cancelActiveWatch?.();
    announce();
    return;
  }

  window.scrollTo({ top: targetY, behavior: "smooth" });
  announceOnScrollEnd(targetY, announce);
};

/** Scroll to a `<section id="…">` using the same header target + offset as hero nav. */
export const scrollToSectionNavTarget = (sectionId: string) => {
  const section = document.getElementById(sectionId);
  if (!section) return;
  const target =
    (section.querySelector("[data-section-header='true']") as HTMLElement | null) ?? section;

  scrollToTarget({
    element: target,
    align: "start",
    startOffset: 72,
    arrivalEventName: "section-nav-arrive",
    arrivalDetail: { id: sectionId },
  });
};
