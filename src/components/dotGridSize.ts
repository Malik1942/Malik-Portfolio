export interface DotGridCanvasSize {
  w: number;
  h: number;
}

export function nextDotGridCanvasSize(
  width: number,
  height: number,
  previous: DotGridCanvasSize,
): DotGridCanvasSize | null {
  const w = Math.round(width);
  const h = Math.round(height);
  if (w <= 0 || h <= 0 || w === previous.w && h === previous.h) return null;
  return { w, h };
}
