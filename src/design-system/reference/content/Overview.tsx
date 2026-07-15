const PRINCIPLES = [
  ["One source of truth", "DTCG JSON owns supported values and intent. CSS and typed metadata are generated artifacts."],
  ["Real artifacts over replicas", "Reference production boundaries and evaluate expressive work in the portfolio context where it actually lives."],
  ["Focus over catalog density", "One selected section, a stable hash, and a guided reading sequence keep the system legible."],
  ["Roles before raw values", "Semantic foundations lead the reference; primitive and compatibility values stay in the generated source where they belong."],
  ["Context before controls", "Components are explained through production behavior and relevant states instead of one universal editor."],
  ["Systemize what repeats; preserve what expresses", "Shared decisions become tokens and components. Art-directed moments keep the implementation freedom they need."],
] as const;

const REPORTS = [
  ["Format report", "https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/"],
  ["Color report", "https://www.w3.org/community/reports/design-tokens/CG-FINAL-color-20251028/"],
  ["Resolver report", "https://www.w3.org/community/reports/design-tokens/CG-FINAL-resolver-20251028/"],
] as const;

export function OverviewContent() {
  return (
    <div data-testid="reference-overview" className="space-y-14 md:space-y-16">
      <div className="max-w-[720px] space-y-5 text-[17px] leading-[1.7] text-foreground/72 text-body md:text-[19px]">
        <p>This is the working language behind Malik’s portfolio: the decisions that repeat, the artifacts that carry them, and the expressive patterns that remain intentionally art-directed.</p>
        <p>Its structure follows VMedium’s focused-reference philosophy, but its content, rhythm, and specimens come from this portfolio’s production system.</p>
      </div>

      <section aria-labelledby="principles-heading">
        <h2 id="principles-heading" className="text-2xl font-medium text-display">Principles</h2>
        <div className="mt-6 grid gap-px overflow-hidden rounded-lg border border-border/50 bg-border/50 md:grid-cols-2">
          {PRINCIPLES.map(([title, copy], index) => (
            <article key={title} className="bg-background p-6 md:p-7">
              <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/40 text-mono">0{index + 1}</p>
              <h3 className="mt-3 text-lg font-medium text-foreground text-display">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/62 text-body">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="flow-heading" className="space-y-5">
        <h2 id="flow-heading" className="text-2xl font-medium text-display">How it works</h2>
        <p className="overflow-x-auto rounded-lg border border-border/50 bg-card/25 p-5 text-sm leading-relaxed text-foreground/82 text-mono sm:p-6">
          DTCG JSON → generated CSS + typed metadata → portfolio + reference
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-lg border border-border/50 p-5">
            <h3 className="text-sm font-medium text-foreground text-body">Shipped production values</h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground/62 text-body">Generated at build time and used by both the public site and this reference. These values change only through reviewed source files.</p>
          </article>
          <article className="rounded-lg border border-border/50 p-5">
            <h3 className="text-sm font-medium text-foreground text-body">Curated public reference</h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground/62 text-body">Foundations, components, and patterns are selected from the production token graph and shown without public authoring controls.</p>
          </article>
        </div>
      </section>

      <section aria-labelledby="standards-heading" className="space-y-4">
        <h2 id="standards-heading" className="text-2xl font-medium text-display">Standards reference</h2>
        <p className="max-w-[70ch] text-sm leading-relaxed text-foreground/62 text-body">The compiler implements a documented subset of the current Design Tokens Community Group modules: explicit types, whole-token aliases, the supported color structure, and deterministic resolution. It does not claim complete support for every module feature.</p>
        <ul className="flex flex-wrap gap-3">
          {REPORTS.map(([label, href]) => (
            <li key={href}>
              <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center rounded-sm border border-border/60 px-4 text-sm text-foreground/72 transition-colors hover:border-foreground/35 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40">{label} ↗</a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
