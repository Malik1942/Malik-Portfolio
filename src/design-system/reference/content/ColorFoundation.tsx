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
    description: "Interaction roles keep emphasis, danger, success, focus, and separation consistent.",
    roles: [
      { label: "Primary action", path: "color.action.primary" },
      { label: "Destructive action", path: "color.action.destructive" },
      { label: "Positive status", path: "color.status.positive" },
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
    <div data-testid="reference-foundation-color" className="space-y-10 md:space-y-14">
      <p className="max-w-reading text-base leading-relaxed text-foreground/72 md:text-xl">
        Warm foregrounds and deep neutral surfaces carry the portfolio. Two
        accents distinguish Selected Work from Workshop without turning the
        system into a broad palette. These are the semantic roles used in
        production; primitives and component-owned colors stay in the generated
        source.
      </p>

      {COLOR_GROUPS.map((group) => (
        <section key={group.label} aria-labelledby={groupId(group.label)}>
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-border/50 pb-3">
            <h2
              id={groupId(group.label)}
              className="text-label uppercase tracking-eyebrow text-foreground/72"
            >
              {group.label}
            </h2>
            <p className="max-w-[52ch] text-xs leading-relaxed text-foreground/55">
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
                  className="min-w-0 rounded-lg border border-border/50 bg-surface-card/40 p-2.5"
                >
                  <span
                    aria-label={`${role.label} color ${value}`}
                    className="mb-3 block h-14 w-full rounded-sm border border-border/60"
                    style={{ background: `hsl(${token.cssValue})` }}
                  />
                  <p className="truncate text-sm font-medium text-foreground">{role.label}</p>
                  <code className="mt-1 block truncate text-label text-foreground/55 font-mono">
                    {role.path}
                  </code>
                  <code className="mt-0.5 block text-xs uppercase text-foreground/72 font-mono">
                    {value}
                  </code>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
