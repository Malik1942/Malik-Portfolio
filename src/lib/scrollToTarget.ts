// Tuned to match the glide this helper actually produced before the `behavior`
// fix below. The old values (160/300/0.1) never took effect: every frame handed
// off to the browser's native smooth scroll, which paced the journey at roughly
// 800ms for a full-page jump. Now that the raf loop genuinely owns the timing,
// these keep that same felt duration instead of collapsing it to a hard cut.
const SCROLL_DURATION_MIN = 220;
const SCROLL_DURATION_MAX = 720;
const SCROLL_DURATION_FACTOR = 0.5;

let activeScrollRaf: number | null = null;

const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

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
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    // Explicit "instant" for the same reason as the loop below — the bare call
    // would inherit `html { scroll-behavior: smooth }` and animate anyway.
    element.scrollIntoView({ block: align === "center" ? "center" : "start", behavior: "instant" });
    window.dispatchEvent(new CustomEvent(arrivalEventName, { detail: arrivalDetail }));
    return;
  }

  if (activeScrollRaf !== null) {
    cancelAnimationFrame(activeScrollRaf);
    activeScrollRaf = null;
  }

  const startY = window.scrollY;
  const rect = element.getBoundingClientRect();
  const viewportOffset =
    align === "center"
      ? (window.innerHeight - rect.height) / 2
      : startOffset ?? Math.min(window.innerHeight * 0.12, 96);
  const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const targetY = Math.max(0, Math.min(startY + rect.top - viewportOffset, maxScroll));
  const distance = targetY - startY;

  if (Math.abs(distance) < 2) {
    window.dispatchEvent(new CustomEvent(arrivalEventName, { detail: arrivalDetail }));
    return;
  }

  const duration = Math.min(
    SCROLL_DURATION_MAX,
    Math.max(SCROLL_DURATION_MIN, Math.abs(distance) * SCROLL_DURATION_FACTOR)
  );
  const startTime = performance.now();

  const step = (now: number) => {
    const progress = Math.min(1, (now - startTime) / duration);
    const easedProgress = easeInOutSine(progress);

    // "instant", not "auto": per CSSOM-View, "auto" defers to the element's CSS
    // scroll-behavior — and `html` sets `scroll-behavior: smooth`. That turned
    // every frame of this loop into its own native smooth scroll, so the page was
    // still gliding ~800ms after the loop had finished and announced arrival.
    // This loop owns the easing; each frame must land immediately.
    window.scrollTo({
      top: startY + distance * easedProgress,
      behavior: "instant",
    });

    if (progress < 1) {
      activeScrollRaf = requestAnimationFrame(step);
      return;
    }

    activeScrollRaf = null;
    window.dispatchEvent(new CustomEvent(arrivalEventName, { detail: arrivalDetail }));
  };

  activeScrollRaf = requestAnimationFrame(step);
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
