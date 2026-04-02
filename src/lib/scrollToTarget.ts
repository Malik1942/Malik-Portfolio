const SCROLL_DURATION_MIN = 160;
const SCROLL_DURATION_MAX = 300;
const SCROLL_DURATION_FACTOR = 0.1;

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
    element.scrollIntoView({ block: align === "center" ? "center" : "start" });
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

    window.scrollTo({
      top: startY + distance * easedProgress,
      behavior: "auto",
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
