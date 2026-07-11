import { Glasses, Scale, ScanText } from "lucide-react";

const findings = [
  {
    num: "01",
    title: "Fit and Stability",
    desc: "Ear shape, glasses, hairstyles, and head movement affected how securely the buds stayed in place.",
    accent: "violet" as const,
    icon: Glasses,
  },
  {
    num: "02",
    title: "Weight Distribution",
    desc: "The first in-ear structure felt uneven and less stable during movement.",
    accent: "emerald" as const,
    icon: Scale,
  },
  {
    num: "03",
    title: "Interaction Clarity",
    desc: "The app needed to communicate status without requiring too much reading or active management.",
    accent: "slate" as const,
    icon: ScanText,
  },
];

const accentColor = {
  violet: { icon: "text-violet-400", num: "text-violet-400/60" },
  emerald: { icon: "text-emerald-400", num: "text-emerald-400/60" },
  slate: { icon: "text-slate-400", num: "text-slate-400/50" },
};

export function AuraTestingFindings() {
  return (
    <div className="rounded-2xl overflow-hidden bg-[#0c0c0d] border border-white/[0.07]">
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.05]">
        {findings.map((finding) => {
          const Icon = finding.icon;
          const accent = accentColor[finding.accent];

          return (
            <div key={finding.num} className="flex flex-col gap-5 px-6 py-7 md:px-7 md:py-8">
              <div className="flex items-center justify-between">
                <span className={`text-[12px] font-mono tabular-nums ${accent.num}`}>
                  {finding.num}
                </span>
                <Icon aria-hidden="true" className={`w-4 h-4 ${accent.icon}`} strokeWidth={1.4} />
              </div>

              <div className="flex flex-col gap-2.5">
                <p className="text-[16px] md:text-[20px] font-medium text-white/95 leading-[24px] md:leading-[28px] tracking-[-0.01em]">
                  {finding.title}
                </p>
                <p className="text-[14px] md:text-[16px] font-light text-white/72 leading-[22px] md:leading-[26px]">
                  {finding.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
