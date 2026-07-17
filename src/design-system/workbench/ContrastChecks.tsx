import { applyOverrides } from "../tokens/compiler";
import type { DtcgColor } from "../tokens/types";
import { usePreviewDraft } from "../preview/PreviewProvider";

type Rgb = [number, number, number];
const SITE_BOOT_CANVAS: Rgb = [10 / 255, 10 / 255, 10 / 255];

const PAIRS = [
  { label: "Primary text on canvas", foreground: "color.text.primary", background: "color.background.canvas", threshold: 4.5, result: "AA" },
  { label: "Muted text on canvas", foreground: "color.text.muted", background: "color.background.canvas", threshold: 4.5, result: "AA" },
  { label: "Primary text on card", foreground: "color.text.primary", background: "color.surface.card", threshold: 4.5, result: "AA" },
  { label: "Focus ring on canvas", foreground: "color.focus.ring", background: "color.background.canvas", threshold: 3, result: "3:1" },
  // Emphasis ladder: text tiers are primary-foreground opacities. /55 is the
  // dimmest tier approved for readable text; /44 is decorative-only.
  { label: "Secondary text (85%) on canvas", foreground: "color.text.primary", foregroundAlpha: 0.85, background: "color.background.canvas", threshold: 4.5, result: "AA" },
  { label: "Supporting text (72%) on canvas", foreground: "color.text.primary", foregroundAlpha: 0.72, background: "color.background.canvas", threshold: 4.5, result: "AA" },
  { label: "Muted tier (55%) on canvas", foreground: "color.text.primary", foregroundAlpha: 0.55, background: "color.background.canvas", threshold: 4.5, result: "AA" },
] as const;

function hslToSrgb(color: DtcgColor): Rgb {
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
  return s === 0 ? [l, l, l] : (() => {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    return [hue(p, q, h + 1 / 3), hue(p, q, h), hue(p, q, h - 1 / 3)];
  })();
}

function composite(foreground: Rgb, background: Rgb, alpha = 1): Rgb {
  return foreground.map((channel, index) => (
    channel * alpha + background[index] * (1 - alpha)
  )) as Rgb;
}

function luminance(rgb: Rgb): number {
  const linear = rgb.map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}

// Translucent backgrounds are deterministic because index.html boots on
// #0a0a0a before its canvas token paints. Approved contrast-pair backgrounds
// are currently opaque; this substrate defines safe behavior if that changes.
// eslint-disable-next-line react-refresh/only-export-components
export function contrastRatio(foreground: DtcgColor, background: DtcgColor): number {
  const effectiveBackground = composite(
    hslToSrgb(background),
    SITE_BOOT_CANVAS,
    background.alpha ?? 1,
  );
  const effectiveForeground = composite(
    hslToSrgb(foreground),
    effectiveBackground,
    foreground.alpha ?? 1,
  );
  const foregroundLuminance = luminance(effectiveForeground);
  const backgroundLuminance = luminance(effectiveBackground);
  return (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
    (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);
}

export function ContrastChecks() {
  const { bundle, draft } = usePreviewDraft();
  const tokens = new Map(applyOverrides(bundle, draft.overrides).tokens.map((token) => [token.path, token]));
  return (
    <section aria-labelledby="contrast-heading">
      <h2 id="contrast-heading" className="text-xl font-medium text-foreground">Contrast checks</h2>
      <p className="mt-1 text-sm text-foreground/55">Advisory WCAG checks update with the compiled draft and never block export. Transparency is composited in sRGB over the effective background; translucent backgrounds use the site's #0a0a0a boot canvas as a deterministic substrate.</p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {PAIRS.map((pair) => {
          const foregroundValue = tokens.get(pair.foreground)!.resolvedValue as DtcgColor;
          const tierAlpha = "foregroundAlpha" in pair ? pair.foregroundAlpha : undefined;
          const ratio = contrastRatio(
            tierAlpha === undefined ? foregroundValue : { ...foregroundValue, alpha: tierAlpha },
            tokens.get(pair.background)!.resolvedValue as DtcgColor,
          );
          const passes = ratio >= pair.threshold;
          return (
            <li key={pair.label} className="rounded-lg border border-border/50 p-4">
              <p className="text-sm text-foreground/72">{pair.label}</p>
              <p className="mt-2 font-mono text-xs text-foreground">{ratio.toFixed(2)}:1</p>
              <p className={`mt-1 text-xs ${passes ? "text-foreground/72" : "text-destructive"}`}>{passes ? `Pass ${pair.result}` : `Fail ${pair.result}`}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
