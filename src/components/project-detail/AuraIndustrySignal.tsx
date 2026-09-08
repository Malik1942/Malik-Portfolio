import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { noOrphan } from "@/lib/noOrphan";

// Aura's audio intervention set against the one Samsung shipped a few months
// later. Same paper, same form factor, same frequency; the rows are where the two
// converge and the one row (timing) where Aura goes a step further. Every Samsung
// figure here is from its March 2026 Hearapy launch coverage, linked below.
const SOURCE_URL = "https://9to5google.com/2026/03/30/samsung-built-a-motion-sickness-app-for-galaxy-buds/";

// Below md the header carries only the date: the team and the earbud already
// appear in the first two rows, and the full meta wraps to three lines at 390px.
const columns = [
  { key: "aura", name: "Aura", meta: "Student concept · Fall 2025", date: "Fall 2025" },
  { key: "samsung", name: "Samsung Hearapy", meta: "Galaxy Buds4 Pro · March 2026", date: "March 2026" },
] as const;

const rows = [
  {
    label: "Team",
    aura: "Five students, five weeks, no lab",
    samsung: "Samsung Electronics",
  },
  {
    label: "Form",
    aura: "Ear-worn buds designed around low-frequency audio",
    samsung: "Galaxy Buds4 Pro, with a wider bass driver to reproduce the tone",
  },
  {
    label: "Intervention",
    aura: "100 Hz tone and calming soundscapes",
    samsung: "100 Hz sine tone for 60 seconds, at about 85 dB",
  },
  {
    label: "Timing",
    aura: "Before symptoms, triggered by sensed risk",
    samsung: "Before the trip, started by the user",
  },
  {
    label: "Evidence",
    aura: "Nagoya University, published 2025",
    samsung: "The same study",
  },
];

// Below md the label takes its own line and the two columns sit side by side,
// so a row is one label plus one pair of cells rather than five stacked lines.
const ROW_COLS = "grid-cols-2 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,2fr)]";

export function AuraIndustrySignal() {
  return (
    <div className="rounded-2xl overflow-hidden bg-surface-inset border border-case-study-module-border">
      <div className={`grid ${ROW_COLS} gap-x-4 md:gap-6 px-5 py-5 md:px-8 md:py-6 border-b border-case-study-module-divider`}>
        <span aria-hidden="true" className="hidden md:block" />
        {columns.map((col) => (
          <div key={col.key} className="flex flex-col gap-1">
            <p className="text-base md:text-xl font-medium text-foreground leading-snug tracking-tight">
              {noOrphan(col.name)}
            </p>
            <p className="text-caption font-mono uppercase tracking-eyebrow text-foreground-tertiary">
              <span className="md:hidden">{col.date}</span>
              <span className="hidden md:inline">{col.meta}</span>
            </p>
          </div>
        ))}
      </div>

      <div className="divide-y divide-case-study-module-divider">
        {rows.map((row) => (
          <div key={row.label} className={`grid ${ROW_COLS} gap-x-4 gap-y-2 md:gap-6 px-5 py-4 md:px-8 md:py-6`}>
            <p className="col-span-2 md:col-span-1 text-caption font-mono uppercase tracking-eyebrow text-foreground-tertiary md:pt-1">
              {row.label}
            </p>
            {columns.map((col) => (
              <p key={col.key} className="text-sm md:text-base font-light text-foreground-secondary leading-relaxed">
                {noOrphan(row[col.key])}
              </p>
            ))}
          </div>
        ))}
      </div>

      <div className="flex justify-center px-5 py-5 md:px-8 md:py-7 border-t border-case-study-module-divider">
        <Button tone="secondary" href={SOURCE_URL} external icon={<ArrowUpRight strokeWidth={1.8} />}>
          Read the launch coverage
        </Button>
      </div>
    </div>
  );
}
