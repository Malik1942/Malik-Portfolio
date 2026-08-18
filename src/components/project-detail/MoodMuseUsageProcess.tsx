import { Bluetooth, ClipboardList, Paintbrush, Activity, Sparkles, Palette } from "lucide-react";
import { noOrphan } from "@/lib/noOrphan";

// Same grid module Aura uses for its design-requirements and ideation-criteria
// panels: header band, numbered cards, interior dividers only. Six steps
// divide evenly into 3 columns × 2 rows, so the breakpoint jumps straight
// from a 1-col stack to the 3-col grid — no intermediate 2-col tablet state
// to reconcile divider math against.
//
// Dividers are set per card by index rather than with `divide-y` plus an
// arbitrary nth-child variant. The two collide: `sm:divide-y-0` is emitted as
// `.divide-y > :not([hidden]) ~ :not([hidden])`, which out-specifies a
// `[&>*:nth-child(n+4)]:border-t` and silently zeroes the row-2 top border.
const steps = [
  {
    num: "01",
    title: "Pair",
    desc: "The indicator light flashes while the brush pairs with the phone, then turns green when it's connected.",
    accent: "violet" as const,
    icon: Bluetooth,
  },
  {
    num: "02",
    title: "Choose a Treatment",
    desc: "A questionnaire selects a program. Parents can bring in a therapist to read the child's development and adjust it.",
    accent: "emerald" as const,
    icon: ClipboardList,
  },
  {
    num: "03",
    title: "Paint",
    desc: "On first use the brush sets an emotional baseline. Then the child paints, following the program or freely, while the sensors keep reading.",
    accent: "slate" as const,
    icon: Paintbrush,
  },
  {
    num: "04",
    title: "Process",
    desc: "When the painting is done, the brush sends the session to the app, which summarizes it into a mood spectrum and graph.",
    accent: "violet" as const,
    icon: Activity,
  },
  {
    num: "05",
    title: "Scent",
    desc: "When a positive state is detected, the brush releases a gentle fragrance, a reward that helps the child connect the feeling to the moment.",
    accent: "emerald" as const,
    icon: Sparkles,
  },
  {
    num: "06",
    title: "Color",
    desc: "When the state changes, an internal motor smoothly changes the ink color, and the child sees their own shift on the paper.",
    accent: "slate" as const,
    icon: Palette,
  },
];

const accentColor = {
  violet: { icon: "text-accent-violet", num: "text-accent-violet/60" },
  emerald: { icon: "text-accent-emerald", num: "text-accent-emerald/60" },
  slate: { icon: "text-accent-slate", num: "text-accent-slate/50" },
};

export function MoodMuseUsageProcess() {
  return (
    <div className="rounded-2xl overflow-hidden bg-surface-inset border border-case-study-module-border">
      <div className="px-8 pt-8 pb-7 md:px-10 border-b border-case-study-module-divider">
        <p className="text-xs md:text-xl uppercase tracking-eyebrow font-light leading-relaxed text-foreground font-mono">
          The Usage Loop
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const accent = accentColor[step.accent];
          // Stacked: every card after the first gets a top rule. In the grid:
          // row 1 drops it, row 2 keeps it, and columns 2–3 get a left rule.
          const rules = [
            i > 0 ? "border-t" : "",
            i > 0 && i < 3 ? "sm:border-t-0" : "",
            i % 3 !== 0 ? "sm:border-l" : "",
          ].join(" ");

          return (
            <div key={step.num} className={`flex flex-col gap-5 px-6 py-7 md:px-7 md:py-8 border-case-study-module-divider ${rules}`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-mono tabular-nums ${accent.num}`}>
                  {step.num}
                </span>
                <Icon aria-hidden="true" className={`w-4 h-4 ${accent.icon}`} strokeWidth={1.4} />
              </div>

              <div className="flex flex-col gap-2.5">
                <p className="text-base md:text-xl font-medium text-foreground leading-normal md:leading-snug tracking-tight">
                  {noOrphan(step.title)}
                </p>
                <p className="text-sm md:text-base font-light text-foreground/72 leading-relaxed">
                  {noOrphan(step.desc)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
