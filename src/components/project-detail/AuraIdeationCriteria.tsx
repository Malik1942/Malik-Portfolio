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
  violet: { icon: "text-violet-400", num: "text-violet-400/60" },
  emerald: { icon: "text-emerald-400", num: "text-emerald-400/60" },
  slate: { icon: "text-slate-400", num: "text-slate-400/50" },
};

export function AuraIdeationCriteria() {
  return (
    <div className="rounded-2xl overflow-hidden bg-surface-inset border border-white/[0.07]">
      <div className="px-8 pt-8 pb-7 md:px-10 border-b border-white/[0.05]">
        <p className="text-[12px] md:text-[20px] uppercase tracking-[0.08em] font-light leading-[24px] md:leading-[32px] text-white/85 font-mono">
          Why I pushed for the earbud direction
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:[&>*:nth-child(n+3)]:border-t sm:[&>*:nth-child(even)]:border-l divide-white/[0.05]">
        {criteria.map((criterion) => {
          const Icon = criterion.icon;
          const accent = accentColor[criterion.accent];

          return (
            <div key={criterion.num} className="flex flex-col gap-5 px-6 py-7 md:px-7 md:py-8 border-white/[0.05]">
              <div className="flex items-center justify-between">
                <span className={`text-[12px] font-mono tabular-nums ${accent.num}`}>
                  {criterion.num}
                </span>
                <Icon aria-hidden="true" className={`w-4 h-4 ${accent.icon}`} strokeWidth={1.4} />
              </div>

              <div className="flex flex-col gap-2.5">
                <p className="text-[16px] md:text-[20px] font-medium text-white/95 leading-[24px] md:leading-[28px] tracking-[-0.01em]">
                  {criterion.title}
                </p>
                <p className="text-[14px] md:text-[16px] font-light text-white/72 leading-[22px] md:leading-[26px]">
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
