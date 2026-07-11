import { Blocks, ShieldCheck } from "lucide-react";

const learnings = [
  {
    num: "01",
    title: "Trust Is an Interaction Design Problem",
    desc: "Aura taught me that proactive systems need more than accurate sensing. Because Aura works before users fully recognize discomfort, trust depends on timing, tone, explanation, and how much control the user keeps.",
    accent: "violet" as const,
    icon: ShieldCheck,
  },
  {
    num: "02",
    title: "Hardware and Software Should Behave as One System",
    desc: "This project clarified my strength in connecting physical form, digital interaction, and system logic. Aura Buds and the Aura App had to express the same intention: stable to wear, easy to read, and calm in use.",
    accent: "emerald" as const,
    icon: Blocks,
  },
];

const accentColor = {
  violet: { icon: "text-violet-400", num: "text-violet-400/60" },
  emerald: { icon: "text-emerald-400", num: "text-emerald-400/60" },
};

export function AuraReflectionLearnings() {
  return (
    <div className="rounded-2xl overflow-hidden bg-[#0c0c0d] border border-white/[0.07]">
      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.05]">
        {learnings.map((learning) => {
          const Icon = learning.icon;
          const accent = accentColor[learning.accent];

          return (
            <div key={learning.num} className="flex flex-col gap-5 px-6 py-7 md:px-7 md:py-8">
              <div className="flex items-center justify-between">
                <span className={`text-[12px] font-mono tabular-nums ${accent.num}`}>
                  {learning.num}
                </span>
                <Icon aria-hidden="true" className={`w-4 h-4 ${accent.icon}`} strokeWidth={1.4} />
              </div>

              <div className="flex flex-col gap-2.5">
                <p className="text-[16px] md:text-[20px] font-medium text-white/95 leading-[24px] md:leading-[28px] tracking-[-0.01em]">
                  {learning.title}
                </p>
                <p className="text-[14px] md:text-[16px] font-light text-white/72 leading-[22px] md:leading-[26px]">
                  {learning.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
