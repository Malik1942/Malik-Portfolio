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
  violet: { icon: "text-violet-400", num: "text-violet-400/60", bar: "bg-violet-500/20" },
  emerald: { icon: "text-emerald-400", num: "text-emerald-400/60", bar: "bg-emerald-500/20" },
  slate:   { icon: "text-slate-400",  num: "text-slate-400/50",  bar: "bg-slate-500/15"  },
};

export function AuraDesignRequirements() {
  return (
    <div className="rounded-2xl overflow-hidden bg-surface-inset border border-white/[0.07]">

      {/* Header band */}
      <div className="px-8 pt-8 pb-7 md:px-10 border-b border-white/[0.05]">
        <p className="text-[12px] md:text-[20px] uppercase tracking-[0.08em] font-light leading-[24px] md:leading-[32px] text-white/85 font-mono">
          Design Requirements
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.05]">
        {requirements.map((r) => {
          const a = accentColor[r.accent];
          return (
            <div key={r.num} className="flex flex-col gap-5 px-6 py-7 md:px-7 md:py-8">

              {/* Top row: number + icon */}
              <div className="flex items-center justify-between">
                <span className={`text-[12px] font-mono tabular-nums ${a.num}`}>
                  {r.num}
                </span>
                <span className={a.icon}>
                  {r.icon}
                </span>
              </div>

              {/* Text */}
              <div className="flex flex-col gap-2.5">
                <p className="text-[16px] md:text-[20px] font-medium text-white/95 leading-[24px] md:leading-[28px] tracking-[-0.01em]">
                  {r.title}
                </p>
                <p className="text-[14px] md:text-[16px] font-light text-white/72 leading-[22px] md:leading-[26px]">
                  {r.desc}
                </p>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
