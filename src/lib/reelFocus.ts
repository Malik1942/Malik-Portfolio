/**
 * Which cover reel gets to play on a device that cannot hover.
 *
 * On a phone the reel answers to the scroll instead of the pointer, and a
 * narrow screen can hold several reel cards at once (the Studio grid is two
 * across). Letting all of them run is visual noise and double the decode cost
 * on the weakest device, so cards that are on screen register here and only
 * the one whose cover sits nearest the middle of the viewport is "focused".
 * Scrolling hands focus from card to card, the way a feed does.
 *
 * Registration changes re-pick synchronously; scrolling re-picks once per
 * frame.
 */
type Listener = (focused: Element | null) => void;

const candidates = new Set<Element>();
const listeners = new Set<Listener>();
let focused: Element | null = null;
let frame = 0;

const pick = () => {
  frame = 0;
  const middle = window.innerHeight / 2;
  let best: Element | null = null;
  let bestDistance = Infinity;
  for (const element of candidates) {
    const rect = element.getBoundingClientRect();
    const distance = Math.abs((rect.top + rect.bottom) / 2 - middle);
    if (distance < bestDistance) {
      best = element;
      bestDistance = distance;
    }
  }
  if (best === focused) return;
  focused = best;
  for (const listener of listeners) listener(focused);
};

const schedule = () => {
  if (frame) return;
  frame = window.requestAnimationFrame(pick);
};

const attach = () => {
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
};

const detach = () => {
  window.removeEventListener("scroll", schedule);
  window.removeEventListener("resize", schedule);
  if (frame) window.cancelAnimationFrame(frame);
  frame = 0;
};

/** Put `element` up for focus and hear every change of the focused element.
 *  The listener fires with the current winner immediately. Returns the
 *  matching leave function. */
export function enterReelFocus(element: Element, listener: Listener): () => void {
  if (candidates.size === 0) attach();
  candidates.add(element);
  listeners.add(listener);
  pick();
  listener(focused);
  return () => {
    candidates.delete(element);
    listeners.delete(listener);
    if (candidates.size === 0) {
      detach();
      focused = null;
      return;
    }
    pick();
  };
}

/** The element currently allowed to play, for tests and debugging. */
export function focusedReel(): Element | null {
  return focused;
}
