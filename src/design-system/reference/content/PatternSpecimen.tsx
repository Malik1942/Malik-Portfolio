import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Specimen } from "../Specimen";

interface PatternSpecimenProps {
  sectionId: string;
  contextHref: string;
  contextLabel: string;
}

function ContextLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} className="inline-flex min-h-[44px] items-center text-sm text-foreground/64 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      {label} <span aria-hidden="true" className="ml-2">→</span>
    </a>
  );
}

function SectionNavigationStage() {
  const sections = ["Research", "Direction", "Final design"];
  const [active, setActive] = useState(sections[0]);
  return (
    <div className="grid gap-5 md:grid-cols-[180px_minmax(0,1fr)]">
      <div className="flex gap-2 overflow-x-auto border-b border-border/40 pb-3 md:block md:space-y-1 md:border-b-0 md:border-r md:pb-0 md:pr-5">
        {sections.map((section) => (
          <button
            key={section}
            type="button"
            aria-current={active === section ? "step" : undefined}
            onClick={() => setActive(section)}
            className={`min-h-[40px] shrink-0 rounded-sm px-3 text-left text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:block md:w-full ${active === section ? "bg-foreground/[0.09] text-foreground" : "text-foreground/50 hover:text-foreground/78"}`}
          >
            {section}
          </button>
        ))}
      </div>
      <div className="min-h-[150px] rounded-sm border border-border/45 bg-secondary/[0.08] p-5 sm:p-6">
        <p className="text-[10px] uppercase tracking-[0.18em] text-foreground/42 text-mono">{active}</p>
        <p className="mt-5 max-w-[42ch] text-lg leading-snug text-foreground text-display">
          {active === "Research" ? "Evidence turns uncertainty into a shared point of view." : active === "Direction" ? "A clear design direction keeps decisions connected." : "Final artifacts make the outcome and its reasoning visible."}
        </p>
      </div>
    </div>
  );
}

function TransitionStage() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<"entering" | "settled">("settled");

  useEffect(() => {
    if (phase !== "entering" || reduce) return;
    const timer = window.setTimeout(() => setPhase("settled"), 220);
    return () => window.clearTimeout(timer);
  }, [phase, reduce]);

  const replay = () => setPhase(reduce ? "settled" : "entering");

  return (
    <div data-testid="transition-stage" data-phase={phase} data-reduced-motion={reduce ? "true" : "false"} className="space-y-5">
      <div className="min-h-[144px] overflow-hidden rounded-sm border border-border/45 bg-secondary/[0.08] p-5 sm:p-6">
        <motion.div
          initial={false}
          animate={phase === "settled" || reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ duration: reduce ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[10px] uppercase tracking-[0.18em] text-foreground/42 text-mono">Project arrival</p>
          <p className="mt-5 text-2xl text-foreground text-display">A page enters without making the work wait.</p>
        </motion.div>
      </div>
      <button type="button" onClick={replay} className="min-h-[44px] rounded-sm border border-border/60 px-4 text-sm text-foreground/72 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        Replay transition
      </button>
    </div>
  );
}

const PATTERN_STAGES: Record<string, { description: string; render: () => JSX.Element }> = {
  "pattern-section-navigation": {
    description: "Select a section to inspect the rail and content relationship across responsive layouts.",
    render: SectionNavigationStage,
  },
  "pattern-transitions": {
    description: "Replay a compact content-arrival state. Reduced motion resolves to the stable final state.",
    render: TransitionStage,
  },
};

export function hasPatternSpecimen(sectionId: string): boolean {
  return sectionId in PATTERN_STAGES;
}

export function PatternSpecimen({ sectionId, contextHref, contextLabel }: PatternSpecimenProps) {
  const stage = PATTERN_STAGES[sectionId];
  if (!stage) return null;
  const Stage = stage.render;
  return <Specimen label="Live specimen" description={stage.description} footer={<ContextLink href={contextHref} label={contextLabel} />}><Stage /></Specimen>;
}
