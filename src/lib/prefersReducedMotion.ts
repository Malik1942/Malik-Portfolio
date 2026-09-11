/**
 * Does this reader want motion held back?
 *
 * The counterpart to Framer's `useReducedMotion` for code that is not a
 * component — the scroll modules run from event handlers, not from render.
 *
 * Anything that reads this is expected to honour it, and the answer is always
 * `"instant"` rather than `"auto"`: per CSSOM-View `"auto"` asks the browser to
 * *defer to CSS*, and `html { scroll-behavior: smooth }` in index.css is waiting
 * to claim exactly that. `src/lib/scrollCallSites.test.ts` holds the line.
 */
export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
