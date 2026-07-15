import type { CSSProperties } from "react";
import type { TokenRecord } from "../tokens/types";

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function humanize(path: string) {
  const leaf = path.split(".").at(-1) ?? path;
  return leaf
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/^./, (character) => character.toUpperCase());
}

function TokenVisual({ token }: { token: TokenRecord }) {
  const common = {
    "aria-label": `Visual sample for ${token.path}`,
    "data-token-type": token.type,
  };

  if (token.type === "color") {
    return (
      <span
        {...common}
        className="block h-14 w-full rounded-sm border border-border/50"
        style={{ background: `hsl(${token.cssValue})` }}
      />
    );
  }

  if (token.type === "fontFamily") {
    return (
      <span {...common} className="block truncate text-2xl text-foreground" style={{ fontFamily: token.cssValue }}>
        Aa
      </span>
    );
  }

  if (token.type === "fontWeight") {
    return (
      <span {...common} className="block text-2xl text-foreground" style={{ fontWeight: token.cssValue }}>
        Aa
      </span>
    );
  }

  if (token.type === "dimension") {
    if (token.path.startsWith("font.size.")) {
      return (
        <span {...common} className="flex min-h-14 items-center overflow-hidden text-foreground" style={{ fontSize: token.cssValue }}>
          Aa
        </span>
      );
    }
    const isRadius = token.path.startsWith("radius.");
    const dimensionStyle = isRadius
      ? { width: "48px", height: "48px", borderRadius: token.cssValue }
      : { width: `min(100%, max(2px, ${token.cssValue}))`, height: "10px" };
    return (
      <span {...common} className="flex min-h-14 items-center">
        <span
          className={`${isRadius ? "border border-foreground/45" : "bg-foreground/55"} block`}
          style={dimensionStyle}
        />
      </span>
    );
  }

  if (token.type === "cubicBezier") {
    const values = Array.isArray(token.resolvedValue) ? token.resolvedValue : [0, 0, 1, 1];
    const [x1, y1, x2, y2] = values as number[];
    return (
      <span {...common} className="block h-14 w-24 text-foreground/55">
        <svg viewBox="0 0 100 56" aria-hidden="true" className="h-full w-full overflow-visible">
          <path d={`M 2 54 C ${x1 * 100} ${54 - y1 * 52}, ${x2 * 100} ${54 - y2 * 52}, 98 2`} fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M2 54H98M2 54V2" fill="none" stroke="currentColor" strokeOpacity=".2" />
        </svg>
      </span>
    );
  }

  if (token.type === "duration") {
    return (
      <span {...common} className="flex min-h-14 items-center gap-1" style={{ "--sample-duration": token.cssValue } as CSSProperties}>
        {[0, 1, 2, 3].map((step) => (
          <span key={step} className="h-2 w-2 rounded-full bg-foreground/55" style={{ opacity: 0.25 + step * 0.25 }} />
        ))}
      </span>
    );
  }

  return (
    <span {...common} className="flex min-h-14 items-center text-2xl font-light tabular-nums text-foreground">
      {token.cssValue}
    </span>
  );
}

export function TokenTable({ title, tokens }: { title: string; tokens: readonly TokenRecord[] }) {
  const headingId = `${slug(title)}-heading`;

  return (
    <section aria-labelledby={headingId} className="space-y-5">
      <h2 id={headingId} className="text-xl font-medium tracking-[-0.02em] text-foreground text-display md:text-2xl">
        {title}
      </h2>
      <div role="list" className="grid gap-3">
        {tokens.map((token) => (
          <article
            role="listitem"
            key={token.path}
            className="grid min-w-0 gap-5 rounded-lg border border-border/50 bg-card/30 p-5 sm:grid-cols-[minmax(112px,0.7fr)_minmax(0,1.8fr)] sm:p-6"
          >
            <div className="min-w-0">
              <TokenVisual token={token} />
              <p className="mt-3 text-sm font-medium text-foreground text-body">{humanize(token.path)}</p>
            </div>
            <div className="min-w-0 space-y-3">
              <div className="grid gap-2 text-[11px] leading-relaxed text-mono md:grid-cols-2">
                <code className="min-w-0 break-all text-foreground/78">{token.path}</code>
                <code className="min-w-0 break-all text-foreground/55">{token.cssVariable}</code>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="text-sm text-foreground/88 text-mono">{token.cssValue}</span>
                {token.aliasOf ? (
                  <span className="break-all text-[11px] text-foreground/50 text-mono">Aliases {token.aliasOf}</span>
                ) : null}
              </div>
              <p className="max-w-[62ch] text-sm leading-relaxed text-foreground/65 text-body">{token.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
