/**
 * How fast the page is scrolling right now, in px per second.
 *
 * Content that animates in on arrival needs to know whether the visitor is
 * reading or flicking past. A card entrance takes most of a second; on a fast
 * flick the card is gone before it finishes, so what the visitor sees is the
 * page scrolling through empty space and the content turning up after they
 * stop. `outrunsEntrance` turns the speed into that one decision.
 *
 * The speed is the distance covered across the last WINDOW_MS of scroll
 * events, so one uneven frame does not swing it. A page that has not moved
 * for SETTLE_MS reads as still, and a new flick after a pause is measured
 * from its own samples, not averaged with the pause before it.
 */

const WINDOW_MS = 100;
const SETTLE_MS = 100;

let samples: { y: number; t: number }[] = [];
let tracking = false;

/** Record a scroll position. Exported so tests can drive it without a DOM scroll. */
export function sampleScroll(y: number, t: number) {
  const last = samples[samples.length - 1];
  if (last && t - last.t > SETTLE_MS) samples = [];
  samples.push({ y, t });
  while (samples.length > 2 && t - samples[0].t > WINDOW_MS) samples.shift();
}

export function scrollSpeed(now: number = performance.now()): number {
  const last = samples[samples.length - 1];
  if (!last || samples.length < 2 || now - last.t > SETTLE_MS) return 0;
  const first = samples[0];
  const elapsed = last.t - first.t;
  return elapsed > 0 ? (Math.abs(last.y - first.y) / elapsed) * 1000 : 0;
}

/** Start listening. Idempotent; safe to call from every card's mount. */
export function trackScrollSpeed() {
  if (tracking || typeof window === "undefined") return;
  tracking = true;
  window.addEventListener(
    "scroll",
    () => sampleScroll(window.scrollY, performance.now()),
    { passive: true },
  );
}

export function resetScrollSpeed() {
  samples = [];
}

/**
 * True when, at `speed`, the page moves more than a screen while an entrance
 * of `entranceSeconds` plays. The visitor can then never see it settle in
 * place: by the time it would have, the content is off the top.
 */
export const outrunsEntrance = (speed: number, viewportHeight: number, entranceSeconds: number) =>
  speed * entranceSeconds > viewportHeight;
