import { applyOverrides } from "../tokens/compiler";
import type { DtcgColor } from "../tokens/types";
import { usePreviewDraft } from "../preview/PreviewProvider";

const PAIRS = [
  { label: "Primary text on canvas", foreground: "color.text.primary", background: "color.background.canvas", threshold: 4.5, result: "AA" },
  { label: "Muted text on canvas", foreground: "color.text.muted", background: "color.background.canvas", threshold: 4.5, result: "AA" },
  { label: "Primary text on card", foreground: "color.text.primary", background: "color.surface.card", threshold: 4.5, result: "AA" },
  { label: "Focus ring on canvas", foreground: "color.focus.ring", background: "color.background.canvas", threshold: 3, result: "3:1" },
] as const;

function luminance(color: DtcgColor): number {
  const [hValue, sValue, lValue] = color.components;
  const h = typeof hValue === "number" ? hValue / 360 : 0;
  const s = typeof sValue === "number" ? sValue / 100 : 0;
  const l = typeof lValue === "number" ? lValue / 100 : 0;
  const hue = (p: number, q: number, t: number) => {
    let channel = t;
    if (channel < 0) channel += 1;
    if (channel > 1) channel -= 1;
    if (channel < 1 / 6) return p + (q - p) * 6 * channel;
    if (channel < 1 / 2) return q;
    if (channel < 2 / 3) return p + (q - p) * (2 / 3 - channel) * 6;
    return p;
  };
  const rgb = s === 0 ? [l, l, l] : (() => {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    return [hue(p, q, h + 1 / 3), hue(p, q, h), hue(p, q, h - 1 / 3)];
  })();
  const linear = rgb.map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}

export function ContrastChecks() {
  const { bundle, draft } = usePreviewDraft();
  const tokens = new Map(applyOverrides(bundle, draft.overrides).tokens.map((token) => [token.path, token]));
  return (
    <section aria-labelledby="contrast-heading">
      <h2 id="contrast-heading" className="text-lg font-medium text-foreground text-body">Contrast checks</h2>
      <p className="mt-1 text-sm text-foreground/55 text-body">Advisory WCAG checks update with the compiled draft and never block export.</p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {PAIRS.map((pair) => {
          const foreground = luminance(tokens.get(pair.foreground)!.resolvedValue as DtcgColor);
          const background = luminance(tokens.get(pair.background)!.resolvedValue as DtcgColor);
          const ratio = (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05);
          const passes = ratio >= pair.threshold;
          return (
            <li key={pair.label} className="rounded-lg border border-border/50 p-4 text-body">
              <p className="text-sm text-foreground/80">{pair.label}</p>
              <p className="mt-2 font-mono text-xs text-foreground">{ratio.toFixed(2)}:1</p>
              <p className={`mt-1 text-xs ${passes ? "text-foreground/60" : "text-destructive"}`}>{passes ? `Pass ${pair.result}` : `Fail ${pair.result}`}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
