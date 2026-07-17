import { AudioLines, Ear, Route, UsersRound } from "lucide-react";

const criteria = [
  {
    num: "01",
    title: "Wearability",
    desc: "Earbuds stay close to the body, making them suitable for sensing early signals and delivering support in the moment.",
    accent: "violet" as const,
    icon: Ear,
  },
  {
    num: "02",
    title: "Social Acceptance",
    desc: "Earbuds are already familiar in public travel, making Aura feel less like a medical device or speculative gadget.",
    accent: "emerald" as const,
    icon: UsersRound,
  },
  {
    num: "03",
    title: "Beyond Travel",
    desc: "The direction had room to extend beyond flights into broader moments of motion discomfort.",
    accent: "slate" as const,
    icon: Route,
  },
  {
    num: "04",
    title: "100 Hz Audio Intervention",
    desc: "The research made audio more than a calming feature. It gave Aura a credible intervention mechanism.",
    accent: "violet" as const,
    icon: AudioLines,
  },
];

const accentColor = {
  violet: { icon: "text-accent-violet", num: "text-accent-violet/60" },
  emerald: { icon: "text-accent-emerald", num: "text-accent-emerald/60" },
  slate: { icon: "text-accent-slate", num: "text-accent-slate/50" },
};

export function AuraIdeationCriteria() {
  return (
    <div className="rounded-2xl overflow-hidden bg-surface-inset border border-case-study-module-border">
      <div className="px-8 pt-8 pb-7 md:px-10 border-b border-case-study-module-divider">
        <p className="text-xs md:text-xl uppercase tracking-eyebrow font-light leading-relaxed text-foreground font-mono">
          Why I pushed for the earbud direction
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:[&>*:nth-child(n+3)]:border-t sm:[&>*:nth-child(even)]:border-l divide-case-study-module-divider">
        {criteria.map((criterion) => {
          const Icon = criterion.icon;
          const accent = accentColor[criterion.accent];

          return (
            <div key={criterion.num} className="flex flex-col gap-5 px-6 py-7 md:px-7 md:py-8 border-case-study-module-divider">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-mono tabular-nums ${accent.num}`}>
                  {criterion.num}
                </span>
                <Icon aria-hidden="true" className={`w-4 h-4 ${accent.icon}`} strokeWidth={1.4} />
              </div>

              <div className="flex flex-col gap-2.5">
                <p className="text-base md:text-xl font-medium text-foreground leading-normal md:leading-snug tracking-tight">
                  {criterion.title}
                </p>
                <p className="text-sm md:text-base font-light text-foreground/72 leading-relaxed">
                  {criterion.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
