import { tokenBundle } from "../../generated/token-manifest.generated";
import type { DtcgColor, TokenRecord } from "../../tokens/types";

interface ColorRole {
  label: string;
  path: string;
}

interface ColorGroup {
  description: string;
  label: string;
  roles: readonly ColorRole[];
}

const COLOR_GROUPS: readonly ColorGroup[] = [
  {
    label: "Surfaces",
    description: "A restrained dark foundation gives content and media the visual priority.",
    roles: [
      { label: "Canvas", path: "color.background.canvas" },
      { label: "Card", path: "color.surface.card" },
      { label: "Secondary", path: "color.surface.secondary" },
      { label: "Muted", path: "color.surface.muted" },
      { label: "Popover", path: "color.surface.popover" },
    ],
  },
  {
    label: "Text",
    description: "Warm foregrounds keep the near-black portfolio readable without feeling clinical.",
    roles: [
      { label: "Primary", path: "color.text.primary" },
      { label: "Muted", path: "color.text.muted" },
      { label: "On primary", path: "color.text.onPrimary" },
      { label: "On destructive", path: "color.text.onDestructive" },
    ],
  },
  {
    label: "Accents",
    description: "Two collection colors distinguish shipped work from experimental practice.",
    roles: [
      { label: "Selected Work", path: "color.accent.selectedWork" },
      { label: "Workshop", path: "color.accent.workshop" },
    ],
  },
  {
    label: "Actions & boundaries",
    description: "Interaction roles keep emphasis, danger, focus, and separation consistent.",
    roles: [
      { label: "Primary action", path: "color.action.primary" },
      { label: "Destructive action", path: "color.action.destructive" },
      { label: "Border", path: "color.border.default" },
      { label: "Input", path: "color.input.default" },
      { label: "Focus ring", path: "color.focus.ring" },
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

function groupId(label: string): string {
  return `color-${label.replace(/ /g, "-").toLowerCase()}`;
}

export function ColorFoundation() {
  return (
    <div data-testid="reference-foundation-color" className="space-y-12 md:space-y-16">
      <div className="max-w-[720px] space-y-4">
        <p className="text-[17px] leading-[1.7] text-foreground/72 text-body md:text-[19px]">
          Warm foregrounds and deep neutral surfaces carry the portfolio. Two
          accents distinguish Selected Work from Workshop without turning the
          system into a broad palette.
        </p>
        <p className="text-sm leading-relaxed text-foreground/52 text-body">
          These are the semantic roles used in production. Primitive and
          component-owned colors stay in canonical DTCG JSON and appear only
          where their implementation context matters.
        </p>
      </div>

      {COLOR_GROUPS.map((group) => (
        <section key={group.label} aria-labelledby={groupId(group.label)}>
          <div className="mb-5 grid gap-2 sm:grid-cols-[minmax(150px,0.7fr)_minmax(0,1.5fr)] sm:items-end">
            <h2
              id={groupId(group.label)}
              className="text-xl font-medium tracking-[-0.02em] text-foreground text-display"
            >
              {group.label}
            </h2>
            <p className="max-w-[56ch] text-sm leading-relaxed text-foreground/52 text-body">
              {group.description}
            </p>
          </div>

          <ul className="border-t border-border/50">
            {group.roles.map((role) => {
              const token = getColorToken(role.path);
              const value = friendlyColorValue(token);
              return (
                <li
                  key={role.path}
                  data-testid={testId(role.path)}
                  className="grid min-w-0 gap-4 border-b border-border/50 py-5 sm:grid-cols-[88px_minmax(120px,0.6fr)_minmax(0,1.4fr)] sm:items-center sm:gap-6"
                >
                  <span
                    aria-label={`${role.label} color ${value}`}
                    className="block h-16 w-full rounded-sm border border-border/60 sm:h-12 sm:w-16"
                    style={{ background: `hsl(${token.cssValue})` }}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground text-body">{role.label}</p>
                    <code className="mt-1 block break-all text-[10px] text-foreground/42 text-mono">
                      {role.path}
                    </code>
                  </div>
                  <div className="min-w-0 sm:text-right">
                    <code className="text-xs uppercase text-foreground/72 text-mono">{value}</code>
                    <p className="mt-1 text-sm leading-relaxed text-foreground/52 text-body">
                      {token.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
