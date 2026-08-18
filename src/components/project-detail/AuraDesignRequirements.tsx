import { noOrphan } from "@/lib/noOrphan";
const requirements = [
  {
    num: "01",
    title: "Earlier Than Symptoms",
    desc: "Support before nausea becomes hard to manage.",
    accent: "violet" as const,
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M1 8h2.5l1.5-4.5L7.5 13 9.5 6l1.5 3.5H15" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    num: "02",
    title: "Low-Effort in Use",
    desc: "Works quietly without adding another task.",
    accent: "emerald" as const,
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.15"/>
        <circle cx="8" cy="8" r="2.5" fill="currentColor" opacity="0.45"/>
      </svg>
    ),
  },
  {
    num: "03",
    title: "Built on Familiar Behavior",
    desc: "Fits existing travel habits like earbuds and audio.",
    accent: "violet" as const,
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M5 11.5V7.5a3 3 0 016 0v4" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round"/>
        <rect x="3" y="10.5" width="3" height="3.5" rx="1.5" stroke="currentColor" strokeWidth="1.15"/>
        <rect x="10" y="10.5" width="3" height="3.5" rx="1.5" stroke="currentColor" strokeWidth="1.15"/>
      </svg>
    ),
  },
  {
    num: "04",
    title: "Calm by Default",
    desc: "Feels subtle, reassuring, and non-alarming.",
    accent: "emerald" as const,
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M1 8c1.5-3.5 3-4 4.5-4S8 6 8 6s1.5 2 3 2 3-2.5 4-5" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round"/>
        <path d="M1 12c1.5-2 3-2.5 4.5-2.5S8 11 8 11s1.5 1 3 1 3-1.5 4-3" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" opacity="0.3"/>
      </svg>
    ),
  },
  {
    num: "05",
    title: "Socially Wearable",
    desc: "Discreet and comfortable enough for public travel.",
    accent: "slate" as const,
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.15"/>
        <path d="M3 14c0-2.761 2.239-4.5 5-4.5s5 1.739 5 4.5" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round"/>
      </svg>
    ),
  },
];

const accentColor = {
  violet: { icon: "text-accent-violet", num: "text-accent-violet/60", bar: "bg-accent-violet/20" },
  emerald: { icon: "text-accent-emerald", num: "text-accent-emerald/60", bar: "bg-accent-emerald/20" },
  slate: { icon: "text-accent-slate", num: "text-accent-slate/50", bar: "bg-accent-slate/15" },
};

export function AuraDesignRequirements() {
  return (
    <div className="rounded-2xl overflow-hidden bg-surface-inset border border-case-study-module-border">

      {/* Header band */}
      <div className="px-8 pt-8 pb-7 md:px-10 border-b border-case-study-module-divider">
        <p className="text-xs md:text-xl uppercase tracking-eyebrow font-light leading-relaxed text-foreground font-mono">
          Design Requirements
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-case-study-module-divider">
        {requirements.map((r) => {
          const a = accentColor[r.accent];
          return (
            <div key={r.num} className="flex flex-col gap-5 px-6 py-7 md:px-7 md:py-8">

              {/* Top row: number + icon */}
              <div className="flex items-center justify-between">
                <span className={`text-xs font-mono tabular-nums ${a.num}`}>
                  {r.num}
                </span>
                <span className={a.icon}>
                  {r.icon}
                </span>
              </div>

              {/* Text */}
              <div className="flex flex-col gap-2.5">
                <p className="text-base md:text-xl font-medium text-foreground leading-normal md:leading-snug tracking-tight">
                  {noOrphan(r.title)}
                </p>
                <p className="text-sm md:text-base font-light text-foreground/72 leading-relaxed">
                  {noOrphan(r.desc)}
                </p>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
