import { tokenBundle } from "../../generated/token-manifest.generated";
import type { DtcgColor, TokenRecord } from "../../tokens/types";
import { contrastRatio } from "../../workbench/ContrastChecks";
import { Eyebrow } from "@/components/ui/Eyebrow";

/**
 * Material is everything about a surface and the ink on it: the canvas and
 * the surfaces raised from it, the five-tier ink ladder, the rules that bound
 * a region, the rings that show focus, and the two collection accents.
 */

interface ColorRole {
  label: string;
  path: string;
  note?: string;
}

interface ColorGroup {
  id: string;
  label: string;
  description: string;
  roles: readonly ColorRole[];
}

const INK_LADDER: readonly ColorRole[] = [
  { label: "Primary", path: "color.text.primary", note: "Headings, lead sentences, the active state of any control." },
  { label: "Lead", path: "color.text.lead", note: "Body paragraphs after the lead; the active item in a guide or chip set." },
  { label: "Secondary", path: "color.text.secondary", note: "Descriptions, metadata values, navigation at rest, captions. Held at full strength today." },
  { label: "Tertiary", path: "color.text.tertiary", note: "Eyebrows, labels, inactive guide items, footnotes." },
  { label: "Quiet", path: "color.text.quiet", note: "Decorative only: bullets, quote marks, hairline glyphs. Never words." },
];

const COLOR_GROUPS: readonly ColorGroup[] = [
  {
    id: "surfaces",
    label: "Surfaces",
    description: "A restrained dark foundation gives content and media the visual priority.",
    roles: [
      { label: "Canvas", path: "color.background.canvas" },
      { label: "Card", path: "color.surface.card" },
      { label: "Secondary", path: "color.surface.secondary" },
      { label: "Muted", path: "color.surface.muted" },
      { label: "Accent", path: "color.surface.accent" },
      { label: "Popover", path: "color.surface.popover" },
    ],
  },
  {
    id: "boundaries",
    label: "Boundaries & focus",
    description: "Rules bound a region; rings show where the keyboard is. Both are tints of a token, so they follow it.",
    roles: [
      { label: "Border", path: "color.border.default" },
      { label: "Hairline", path: "color.border.hairline" },
      { label: "Faint rule", path: "color.border.faint" },
      { label: "Focus ring", path: "color.focus.ring" },
      { label: "Strong focus ring", path: "color.focus.ringStrong" },
    ],
  },
  {
    id: "accents",
    label: "Accents & status",
    description: "Two collection colors distinguish shipped work from experimental practice; two status colors say yes and stop.",
    roles: [
      { label: "Selected Work", path: "color.accent.selectedWork" },
      { label: "Workshop", path: "color.accent.workshop" },
      { label: "Positive", path: "color.status.positive" },
      { label: "Destructive", path: "color.action.destructive" },
      { label: "Primary action", path: "color.action.primary" },
      { label: "Ink on primary", path: "color.text.onPrimary" },
    ],
  },
] as const;

const TOKENS_BY_PATH = new Map(tokenBundle.tokens.map((token) => [token.path, token]));

function getColorToken(path: string): TokenRecord {
  const token = TOKENS_BY_PATH.get(path);
  if (!token || token.type !== "color") {
    throw new Error(`Missing approved semantic color token: ${path}`);
  }
  return token;
}

function friendlyColorValue(token: TokenRecord): string {
  const value = token.resolvedValue as DtcgColor;
  return value.hex ?? `hsl(${token.cssValue})`;
}

function testId(path: string): string {
  return `color-role-${path.replace(/\./g, "-")}`;
}

function InkLadder() {
  const canvas = getColorToken("color.background.canvas").resolvedValue as DtcgColor;
  return (
    <section aria-labelledby="material-ink" data-testid="material-ink-ladder">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-hairline pb-3">
        <Eyebrow as="h2" id="material-ink" tone="secondary">Ink</Eyebrow>
        <p className="max-w-measure text-caption leading-relaxed text-foreground-tertiary">
          One warm foreground, five roles. Every tier is an alias of the primary
          with its own alpha, so the whole ladder retunes when the primary moves.
          Secondary was authored at 72% but never rendered, so the site was
          approved at full strength; its alpha is the one lever that dims every
          supporting line at once. The ratio is measured against the canvas.
        </p>
      </div>
      <ul className="border-t border-hairline">
        {INK_LADDER.map((role) => {
          const token = getColorToken(role.path);
          const ratio = contrastRatio(token.resolvedValue as DtcgColor, canvas);
          const passes = ratio >= 4.5;
          return (
            <li
              key={role.path}
              data-testid={testId(role.path)}
              title={token.description}
              className="grid min-w-0 gap-3 border-b border-hairline py-5 sm:grid-cols-[120px_minmax(0,1.4fr)_minmax(150px,0.8fr)] sm:items-center"
            >
              <p className="text-sm font-medium text-foreground">{role.label}</p>
              <p className="min-w-0 text-xl leading-snug" style={{ color: `hsl(${token.cssValue})` }}>
                {role.note}
              </p>
              <div className="min-w-0 font-mono text-label">
                <code className="block truncate text-foreground-tertiary">{role.path}</code>
                <code className="mt-1 block text-foreground-secondary">
                  {token.aliasAlpha === undefined ? "100%" : `${Math.round(token.aliasAlpha * 100)}%`} · {ratio.toFixed(1)}:1{" "}
                  {passes ? "AA" : "decorative"}
                </code>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function MaterialFoundation() {
  return (
    <div data-testid="reference-foundation-material" className="space-y-10 md:space-y-14">
      <p className="max-w-reading text-base leading-relaxed text-foreground-secondary md:text-xl">
        Warm ink and deep neutral surfaces carry the portfolio. Two accents
        distinguish Selected Work from Workshop without turning the system into
        a broad palette. These are the semantic roles used in production;
        primitives and component-owned colors stay in the generated source.
      </p>

      <InkLadder />

      {COLOR_GROUPS.map((group) => (
        <section key={group.id} aria-labelledby={`material-${group.id}`}>
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-hairline pb-3">
            <Eyebrow as="h2" id={`material-${group.id}`} tone="secondary">{group.label}</Eyebrow>
            <p className="max-w-measure text-caption leading-relaxed text-foreground-tertiary">
              {group.description}
            </p>
          </div>

          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {group.roles.map((role) => {
              const token = getColorToken(role.path);
              const value = friendlyColorValue(token);
              return (
                <li
                  key={role.path}
                  data-testid={testId(role.path)}
                  title={token.description}
                  className="min-w-0 rounded-lg border border-hairline bg-card/40 p-2.5"
                >
                  <span
                    aria-label={`${role.label} color ${value}`}
                    className="mb-3 block h-14 w-full rounded-sm border border-hairline"
                    style={{ background: `hsl(${token.cssValue})` }}
                  />
                  <p className="truncate text-sm font-medium text-foreground">{role.label}</p>
                  <code className="mt-1 block truncate text-label text-foreground-tertiary font-mono">
                    {role.path}
                  </code>
                  <code className="mt-0.5 block text-caption uppercase text-foreground-secondary font-mono">
                    {value}
                  </code>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <section aria-labelledby="material-components" className="max-w-reading space-y-3">
        <Eyebrow as="h2" id="material-components" tone="secondary">Component materials</Eyebrow>
        <p className="text-sm leading-relaxed text-foreground-tertiary">
          A few surfaces belong to one component and nothing else: the project
          card wash and hover overlay, the case-study module surface and its
          border and divider, the lightbox backdrop, the header scrim, and the
          About timeline markers. They live in the component token layer and
          appear on the component pages that own them.
        </p>
      </section>
    </div>
  );
}
