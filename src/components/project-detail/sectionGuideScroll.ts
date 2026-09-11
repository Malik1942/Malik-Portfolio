/**
 * Where the mobile section guide has to sit horizontally for the active chip
 * to be readable.
 *
 * The guide is a single scrolling row of every section in the case study —
 * eleven of them on the longer ones, roughly three screens wide on a phone.
 * Reading down the page moves the highlight along that row, so without this
 * the active chip walks off the right edge within a few sections and the bar
 * stops answering the only question it exists to answer.
 *
 * Centring, not "scroll it barely into view": the chip after the active one is
 * the likeliest next tap, and a centred highlight keeps its neighbours on both
 * sides visible. The clamp matters as much as the centring — at the first and
 * last chips there is nothing to centre against, and scrolling past the ends
 * would park the row against an empty gutter.
 */
export function centeredScrollLeft({
  chipStart,
  chipWidth,
  trackWidth,
  maxScrollLeft,
}: {
  /** The chip's left edge, measured from the start of the row's content. */
  chipStart: number;
  chipWidth: number;
  /** The visible width of the row. */
  trackWidth: number;
  /** `scrollWidth - clientWidth`: the furthest the row can scroll. */
  maxScrollLeft: number;
}): number {
  const centered = chipStart - (trackWidth - chipWidth) / 2;
  return Math.max(0, Math.min(centered, Math.max(0, maxScrollLeft)));
}
