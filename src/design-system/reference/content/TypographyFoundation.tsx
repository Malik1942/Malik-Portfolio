import { tokenBundle } from "../../generated/token-manifest.generated";
import type { TokenRecord } from "../../tokens/types";

const TOKENS_BY_PATH = new Map(tokenBundle.tokens.map((token) => [token.path, token]));

const SIZE_ROLES = [
  { id: "label", label: "Label", path: "font.size.label", sample: "Selected work" },
  { id: "caption", label: "Caption", path: "font.size.caption", sample: "Product designer · 2026" },
  { id: "body-small", label: "Body small", path: "font.size.bodySmall", sample: "Built with clarity and restraint." },
  { id: "body", label: "Body", path: "font.size.body", sample: "Designing useful systems for real people." },
  { id: "body-large", label: "Body large", path: "font.size.bodyLarge", sample: "From the real problem to a shipped experience." },
  { id: "heading", label: "Heading", path: "font.size.heading", sample: "Selected Work" },
  { id: "display", label: "Display", path: "font.size.display", sample: "Malik Zhang" },
] as const;

const FAMILY_ROLES = [
  { id: "display", label: "Display", path: "font.family.display", sample: "Malik Zhang" },
  { id: "body", label: "Body", path: "font.family.body", sample: "Product design, built end to end." },
  { id: "mono", label: "Mono", path: "font.family.mono", sample: "ROLE · TIMELINE · 2026" },
] as const;

const WEIGHT_ROLES = [
  { id: "light", label: "Light", path: "font.weight.light" },
  { id: "regular", label: "Regular", path: "font.weight.regular" },
  { id: "medium", label: "Medium", path: "font.weight.medium" },
  { id: "semibold", label: "Semibold", path: "font.weight.semibold" },
] as const;

function getToken(path: string, type: TokenRecord["type"]): TokenRecord {
  const token = TOKENS_BY_PATH.get(path);
  if (!token || token.type !== type) {
    throw new Error(`Missing approved ${type} token: ${path}`);
  }
  return token;
}

function TechnicalLabel({ token }: { token: TokenRecord }) {
  return (
    <div className="min-w-0">
      <code className="block break-all text-[10px] text-foreground/42 text-mono">{token.path}</code>
      <code className="mt-1 block text-xs text-foreground/65 text-mono">{token.cssValue}</code>
    </div>
  );
}

export function TypographyFoundation() {
  return (
    <div data-testid="reference-foundation-typography" className="space-y-14 md:space-y-20">
      <div className="max-w-[720px] space-y-4">
        <p className="text-[17px] leading-[1.7] text-foreground/72 text-body md:text-[19px]">
          General Sans carries editorial hierarchy and reading. JetBrains Mono
          marks technical metadata without competing with the work.
        </p>
        <p className="text-sm leading-relaxed text-foreground/52 text-body">
          The scale is compact by design: seven roles cover navigation,
          narrative copy, section headings, and the portfolio's largest moments.
        </p>
      </div>

      <section aria-labelledby="type-families-heading">
        <h2 id="type-families-heading" className="text-xl font-medium tracking-[-0.02em] text-foreground text-display">
          Families
        </h2>
        <ul className="mt-5 border-t border-border/50">
          {FAMILY_ROLES.map((role) => {
            const token = getToken(role.path, "fontFamily");
            return (
              <li
                key={role.path}
                data-testid={`type-family-${role.id}`}
                className="grid min-w-0 gap-5 border-b border-border/50 py-6 sm:grid-cols-[120px_minmax(150px,0.75fr)_minmax(0,1.4fr)] sm:items-center"
              >
                <p className="text-sm font-medium text-foreground text-body">{role.label}</p>
                <TechnicalLabel token={token} />
                <p className="min-w-0 overflow-hidden text-2xl leading-tight text-foreground" style={{ fontFamily: token.cssValue }}>
                  {role.sample}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="type-scale-heading">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="type-scale-heading" className="text-xl font-medium tracking-[-0.02em] text-foreground text-display">
            Type scale
          </h2>
          <p className="text-[10px] uppercase tracking-[0.16em] text-foreground/40 text-body">
            Production roles · px
          </p>
        </div>
        <ul className="mt-5 border-t border-border/50">
          {SIZE_ROLES.map((role) => {
            const token = getToken(role.path, "dimension");
            return (
              <li
                key={role.path}
                data-testid={`type-scale-${role.id}`}
                className="grid min-w-0 gap-5 border-b border-border/50 py-6 sm:grid-cols-[120px_minmax(150px,0.75fr)_minmax(0,1.4fr)] sm:items-center"
              >
                <p className="text-sm font-medium text-foreground text-body">{role.label}</p>
                <TechnicalLabel token={token} />
                <p
                  data-testid={`type-scale-${role.id}-specimen`}
                  className="min-w-0 overflow-hidden text-foreground text-display"
                  style={{ fontSize: token.cssValue, lineHeight: 1.05 }}
                >
                  {role.sample}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="type-weights-heading">
        <h2 id="type-weights-heading" className="text-xl font-medium tracking-[-0.02em] text-foreground text-display">
          Weights
        </h2>
        <ul className="mt-5 border-t border-border/50">
          {WEIGHT_ROLES.map((role) => {
            const token = getToken(role.path, "fontWeight");
            return (
              <li
                key={role.path}
                data-testid={`type-weight-${role.id}`}
                className="grid min-w-0 gap-5 border-b border-border/50 py-6 sm:grid-cols-[120px_minmax(150px,0.75fr)_minmax(0,1.4fr)] sm:items-center"
              >
                <p className="text-sm font-medium text-foreground text-body">{role.label}</p>
                <TechnicalLabel token={token} />
                <p className="min-w-0 text-2xl text-foreground text-display" style={{ fontWeight: token.cssValue }}>
                  Product design, built end to end.
                </p>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
