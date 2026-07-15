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

function HomepageHeroStage() {
  const reduce = useReducedMotion();
  return (
    <div className="relative overflow-hidden rounded-sm border border-border/45 bg-secondary/[0.08] p-6 sm:p-8">
      <motion.div aria-hidden="true" animate={reduce ? { opacity: 0.45 } : { opacity: [0.28, 0.55, 0.28] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute inset-0 opacity-45 [background-image:radial-gradient(circle_at_1px_1px,hsl(var(--foreground)/0.4)_1px,transparent_0)] [background-size:18px_18px]" />
      <div className="relative max-w-[44ch]"><p className="text-[10px] uppercase tracking-[0.18em] text-foreground/48 text-mono">malik@portfolio:~$</p><p className="mt-5 text-2xl leading-tight text-foreground text-display sm:text-3xl">I design useful systems for people and the work around them.</p></div>
    </div>
  );
}

function CaseStudyStage() {
  return (
    <div className="space-y-3">
      {["Premise", "Context", "Decisions", "Outcome"].map((label, index) => (
        <article key={label} className={`rounded-sm border border-border/45 p-4 ${index === 2 ? "bg-secondary/[0.11]" : "bg-secondary/[0.05]"}`}><p className="text-[10px] uppercase tracking-[0.18em] text-foreground/42 text-mono">0{index + 1} · {label}</p><p className="mt-3 max-w-[54ch] text-sm leading-relaxed text-foreground/74 text-body">{index === 2 ? "A decisive artifact pairs a short explanation with the evidence that supports it." : "A paced narrative layer keeps the reader oriented without flattening project detail."}</p></article>
      ))}
    </div>
  );
}

function ResponsiveStage() {
  const [layout, setLayout] = useState<"wide" | "compact">("wide");
  return (
    <div data-testid="responsive-stage" data-layout={layout} className="space-y-5">
      <div className="flex gap-2"><button type="button" onClick={() => setLayout("wide")} className={`min-h-[40px] rounded-sm border px-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${layout === "wide" ? "border-foreground/60 text-foreground" : "border-border/50 text-foreground/55"}`}>Wide layout</button><button type="button" onClick={() => setLayout("compact")} className={`min-h-[40px] rounded-sm border px-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${layout === "compact" ? "border-foreground/60 text-foreground" : "border-border/50 text-foreground/55"}`}>Compact layout</button></div>
      <div className={layout === "wide" ? "grid gap-3 sm:grid-cols-2" : "space-y-3"}>{["Evidence", "Reflection"].map((title) => <article key={title} className="min-h-[110px] rounded-sm border border-border/45 bg-secondary/[0.08] p-4"><p className="text-[10px] uppercase tracking-[0.18em] text-foreground/42 text-mono">{title}</p><p className="mt-4 text-sm text-foreground/74 text-body">The same content keeps its order while the relationship changes.</p></article>)}</div>
    </div>
  );
}

function ExpressiveStage() {
  const reduce = useReducedMotion();
  const [paused, setPaused] = useState(reduce);
  return (
    <div data-testid="expressive-stage" data-paused={paused ? "true" : "false"} data-reduced-motion={reduce ? "true" : "false"} className="space-y-5">
      <div className="relative h-40 overflow-hidden rounded-sm border border-border/45 bg-secondary/[0.08]">
        {[0, 1, 2].map((index) => <motion.span key={index} aria-hidden="true" animate={paused ? { x: 0, y: 0, opacity: 0.5 } : { x: [0, 22 - index * 8, 0], y: [0, -10 + index * 7, 0], opacity: [0.35, 0.85, 0.35] }} transition={{ duration: 3.6 + index * 0.4, repeat: Infinity, ease: "easeInOut" }} className="absolute h-24 w-24 rounded-full bg-foreground/15 blur-xl" style={{ left: `${18 + index * 28}%`, top: `${30 + (index % 2) * 20}%` }} />)}
        <p className="relative z-10 p-5 text-sm text-foreground/72 text-body">Expression remains art-directed rather than promoted to a generic primitive.</p>
      </div>
      <button type="button" onClick={() => setPaused((value) => !value)} className="min-h-[44px] rounded-sm border border-border/60 px-4 text-sm text-foreground/72 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{paused ? "Resume ambient motion" : "Pause ambient motion"}</button>
    </div>
  );
}

function AccessibilityStage() {
  const [focused, setFocused] = useState("None");
  const controls = ["Open case study", "Inspect image", "Return to work"];
  return (
    <div className="space-y-5"><div className="flex flex-wrap gap-3">{controls.map((label) => <button key={label} type="button" onFocus={() => setFocused(label)} className="min-h-[44px] rounded-sm border border-border/60 px-4 text-sm text-foreground/72 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{label}</button>)}</div><p role="status" className="text-sm text-foreground/62 text-body">{focused === "None" ? "Tab through the controls to inspect the visible focus path." : `${focused} is focused`}</p></div>
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
  "pattern-homepage-hero": { description: "A compact terminal statement sits in a decorative, reduced-density identity field.", render: HomepageHeroStage },
  "pattern-case-study": { description: "Narrative modules show the order that turns project evidence into an editorial case study.", render: CaseStudyStage },
  "pattern-responsive": { description: "Switch between wide and compact compositions without changing the browser viewport.", render: ResponsiveStage },
  "pattern-expressive": { description: "Pause the ambient field to inspect the stable expressive composition.", render: ExpressiveStage },
  "pattern-accessibility": { description: "Tab through the labelled controls to see keyboard focus communicated live.", render: AccessibilityStage },
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
