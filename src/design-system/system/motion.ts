import { tokenBundle } from "../generated/token-manifest.generated";
import type { DtcgCubicBezier, DtcgDuration } from "../tokens/types";

/**
 * Motion tokens for JavaScript-driven animation (Framer Motion).
 *
 * CSS transitions read the same tokens through `var(--duration-*)` and
 * `var(--ease-*)`, and Tailwind exposes them as `duration-fast` and
 * `ease-enter`. Framer cannot read a CSS variable for a transition, so the
 * values are lifted from the generated manifest here: one source, two outputs.
 *
 * Durations are in seconds because that is Framer's unit.
 */

function read<T>(path: string): T {
  const token = tokenBundle.tokens.find((candidate) => candidate.path === path);
  if (!token) throw new Error(`Missing motion token: ${path}`);
  return token.resolvedValue as T;
}

function seconds(path: string): number {
  const { value, unit } = read<DtcgDuration>(path);
  return unit === "s" ? value : value / 1000;
}

export const DURATION = {
  /** 200ms. Hover color, arrow nudges, anything that answers the pointer. */
  fast: seconds("duration.fast"),
  /** 300ms. Standard state changes: guide highlights, overlays fading in. */
  medium: seconds("duration.medium"),
  /** 500ms. Deliberate reveals and header color changes. */
  slow: seconds("duration.slow"),
  /** 450ms. Route transitions and header movement. */
  page: seconds("duration.page"),
  /** 750ms. Content entering the viewport: cards, editorial staggers. */
  reveal: seconds("duration.reveal"),
  /** 3s. Repeating decorative motion. */
  ambient: seconds("duration.ambient"),
} as const;

export const EASE = {
  /** Expressive deceleration: content arrives and settles with a long tail. */
  enter: read<DtcgCubicBezier>("ease.enter"),
  /** Spatial movement: page transitions, lightbox scale, card hover. */
  move: read<DtcgCubicBezier>("ease.move"),
  /** Balanced state change (the material standard curve). */
  standard: read<DtcgCubicBezier>("ease.standard"),
  /** Plain deceleration (CSS ease-settle): fades and small hover moves. */
  settle: read<DtcgCubicBezier>("ease.settle"),
  /** Acceleration, the CSS easeIn curve: something leaving. */
  exit: read<DtcgCubicBezier>("ease.exit"),
  /** Symmetric curve for calm repeating motion. */
  ambient: read<DtcgCubicBezier>("ease.ambient"),
} as const;

/**
 * Named recipes: a duration and a curve that always travel together. Spread
 * one into a Framer `transition` and add only what is local (delay, repeat).
 */
export const MOTION = {
  /** Something enters the viewport. */
  enter: { duration: DURATION.reveal, ease: EASE.enter },
  /** Something moves between two positions or scales. */
  move: { duration: DURATION.page, ease: EASE.move },
  /** Something fades in or out without moving. */
  fade: { duration: DURATION.medium, ease: EASE.settle },
  /** Something answers a hover or press. */
  respond: { duration: DURATION.fast, ease: EASE.settle },
  /** Decorative motion that repeats. */
  ambient: { duration: DURATION.ambient, ease: EASE.ambient, repeat: Infinity },
  /** Something unfolds in place and settles without a bounce. A fluid spring
   *  rather than a curve: about half a second to settle, damped just short
   *  of critical, the response iOS uses for a sheet or a fold, so a lift,
   *  a rise, a fade, and a blur driven by the same spring read as one
   *  gesture that slows into place instead of three timers ending. */
  unfold: { type: "spring", stiffness: 160, damping: 24, mass: 1 },
} as const;
