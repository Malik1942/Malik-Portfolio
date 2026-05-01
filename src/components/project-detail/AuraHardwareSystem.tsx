import auraBud1 from "@/assets/aura-bud-1.png";
import auraBud2 from "@/assets/aura-bud-2.png";
import auraBud3 from "@/assets/aura-bud-3.gif";

const features = [
  { label: "Sense",   desc: "HR, HRV, motion, proximity" },
  { label: "Predict", desc: "Early motion-sickness risk" },
  { label: "Support", desc: "100 Hz tone, breathing guidance, soundscapes" },
  { label: "Signal",  desc: "At-a-glance wellness status" },
];

export function AuraHardwareSystem() {
  return (
    <div>
      {/* Section label */}
      <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground/40 text-body mb-6">
        Hardware System
      </p>

      {/* Two-column grid: ~60% left / ~40% right */}
      <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-10 md:gap-12 items-center">

        {/* Left: product visuals */}
        <div className="flex flex-col gap-5">
          <div className="overflow-hidden rounded-xl bg-secondary/[0.07]">
            <img
              src={auraBud1}
              alt="Aura Buds product render"
              className="w-full h-auto block"
            />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="overflow-hidden rounded-lg bg-secondary/[0.07]">
              <img src={auraBud2} alt="Aura Buds detail" className="w-full h-auto block" />
            </div>
            <div className="overflow-hidden rounded-lg bg-secondary/[0.07]">
              <img src={auraBud3} alt="Aura Buds interaction" className="w-full h-auto block" />
            </div>
          </div>
        </div>

        {/* Right: compact feature list with thin dividers */}
        <div className="divide-y divide-border/15">
          {features.map((f) => (
            <div key={f.label} className="py-5 first:pt-0">
              <p className="text-[10px] uppercase tracking-[0.18em] font-medium text-foreground text-body mb-1.5">
                {f.label}
              </p>
              <p className="text-[12px] md:text-[13px] font-light leading-snug text-foreground/50 text-body">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
