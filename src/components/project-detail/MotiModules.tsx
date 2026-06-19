import type { ReactNode } from "react";
import {
  Inbox,
  Split,
  Compass,
  Mic,
  CalendarClock,
  RefreshCw,
  Gauge,
  Target,
  HeartHandshake,
  MessagesSquare,
  LayoutGrid,
  Eye,
  Activity,
  Ruler,
  Cpu,
  Brain,
  Rocket,
  Sparkles,
  CheckCircle2,
  ArrowUpRight,
  Quote,
  Check,
  Minus,
  type LucideIcon,
} from "lucide-react";
import motiTimelineV1 from "@/assets/moti-timelinev1.png";
import motiVoice from "@/assets/moti-voice.png";
import motiTimelineV2 from "@/assets/moti-timeline-v2.png";
import motiApp from "@/assets/moti-app.png";
import motiSlm from "@/assets/moti-slm.png";
import motiLlm from "@/assets/moti-llm.png";
import motiAi from "@/assets/moti-ai.png";
import motiLlmPlan1 from "@/assets/moti-llm-plan1.png";
import motiLlmPlan2 from "@/assets/moti-llm-plan2.png";

/* ---------------------------------------------------------------------------
 * Moti case-study inline modules.
 * Reuses the existing inline-module visual language (dark #0c0c0d cards, mono
 * 01/02 numbers, lucide icons, violet/emerald/slate accents) and site tokens
 * for prose-level pieces — no new colors or fonts are introduced.
 * Images are imported from src/assets (moti-*.png).
 * ------------------------------------------------------------------------- */

type Accent = "violet" | "emerald" | "slate";
const accentColor: Record<Accent, { icon: string; num: string }> = {
  violet: { icon: "text-violet-400", num: "text-violet-400/60" },
  emerald: { icon: "text-emerald-400", num: "text-emerald-400/60" },
  slate: { icon: "text-slate-400", num: "text-slate-400/50" },
};

type GridItem = { num: string; title: string; desc?: string; icon: LucideIcon; accent: Accent };

// Shared dark card shell — mirrors AuraDesignRequirements / AuraTestingFindings.
function ModuleCard({ children, header }: { children: ReactNode; header?: string }) {
  return (
    <div className="rounded-2xl overflow-hidden bg-[#0c0c0d] border border-white/[0.07]">
      {header ? (
        <div className="px-8 pt-8 pb-7 md:px-10 border-b border-white/[0.05]">
          <p className="text-[12px] md:text-[20px] uppercase tracking-[0.08em] font-light leading-[24px] md:leading-[32px] text-white/85 font-mono">
            {header}
          </p>
        </div>
      ) : null}
      {children}
    </div>
  );
}

// number + icon + title + optional desc cell grid (the core Aura card pattern).
// gap-px over a white/[0.05] background renders crisp 1px dividers for any layout.
function CardGrid({ items, header, colsClass }: { items: GridItem[]; header?: string; colsClass: string }) {
  return (
    <ModuleCard header={header}>
      <div className={`grid ${colsClass} gap-px bg-white/[0.05]`}>
        {items.map((it) => {
          const a = accentColor[it.accent];
          const Icon = it.icon;
          return (
            <div key={it.num} className="flex flex-col gap-5 bg-[#0c0c0d] px-6 py-7 md:px-7 md:py-8">
              <div className="flex items-center justify-between">
                <span className={`text-[12px] font-mono tabular-nums ${a.num}`}>{it.num}</span>
                <Icon aria-hidden="true" className={`w-4 h-4 ${a.icon}`} strokeWidth={1.4} />
              </div>
              <div className="flex flex-col gap-2.5">
                <p className="text-[16px] md:text-[20px] font-medium text-white/95 leading-[24px] md:leading-[28px] tracking-[-0.01em]">
                  {it.title}
                </p>
                {it.desc ? (
                  <p className="text-[14px] md:text-[16px] font-light text-white/72 leading-[22px] md:leading-[26px]">
                    {it.desc}
                  </p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </ModuleCard>
  );
}

// Pill chips (tags + highlights). Site tokens, rounded-full.
function Chips({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {items.map((c) => (
        <span
          key={c}
          className="inline-flex items-center rounded-full border border-border/50 bg-secondary/[0.08] px-3.5 py-1.5 text-[12px] md:text-[13px] text-foreground/72 text-body"
        >
          {c}
        </span>
      ))}
    </div>
  );
}

// Pull-quote — reuses the display font + foreground tokens.
function PullQuote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="border-l-2 border-foreground/20 pl-6 md:pl-8">
      <p className="text-[22px] md:text-[32px] font-light leading-[1.3] tracking-[-0.01em] text-foreground/90 text-display">
        {children}
      </p>
    </blockquote>
  );
}

// Single image + caption. Reuses the SectionFigure container styling.
// `narrow` constrains portrait phone screenshots so they don't render full-width.
function MotiFigure({ src, alt, caption, narrow }: { src: string; alt: string; caption: string; narrow?: boolean }) {
  return (
    <figure className={narrow ? "mx-auto w-full max-w-[300px]" : undefined}>
      <div className="overflow-hidden rounded-2xl bg-secondary/10">
        <img src={src} alt={alt} loading="lazy" decoding="async" className="w-full h-auto block" />
      </div>
      <figcaption className="mt-3 text-[13px] md:text-[14px] text-foreground/55 text-body leading-relaxed">
        {caption}
      </figcaption>
    </figure>
  );
}

// Image + caption grid (final-artifact gallery).
function ArtifactGallery({ items }: { items: { src: string; alt: string; caption: string }[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
      {items.map((it) => (
        <MotiFigure key={it.src} {...it} />
      ))}
    </div>
  );
}

// App Store CTA — matches the back-link typography + tokens, with a button affordance.
function AppStoreButton({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-2 self-start rounded-full border border-foreground/25 px-5 py-2.5 text-sm text-body text-foreground/85 hover:text-foreground hover:border-foreground/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 transition-colors duration-200"
    >
      View on the App Store
      <ArrowUpRight
        aria-hidden="true"
        className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        strokeWidth={1.6}
      />
    </a>
  );
}

// Subsection label inside a module — matches the template's `##` subhead style.
function SubHead({ children }: { children: ReactNode }) {
  return (
    <p className="text-[12px] md:text-[20px] uppercase tracking-[0.08em] font-light leading-[24px] md:leading-[32px] text-foreground/85 text-mono">
      {children}
    </p>
  );
}

/* ── 1) Overview — tags ──────────────────────────────────────────────────── */
const tags = ["Personal Project", "AI-native UX", "iOS", "Built & Shipped"];
export function MotiTags() {
  return <Chips items={tags} />;
}

/* ── 2) Hook — highlights, pull-quote, artifact gallery, App Store CTA ────── */
const hookHighlights = [
  "Live on the App Store",
  "Built solo with Claude + Codex",
  "SLM + LLM hybrid intelligence",
  "Spec-first: full PRD before any code",
];
const hookArtifacts = [
  { src: motiTimelineV1, alt: "Moti timeline work map across projects", caption: "One continuous work map, not a flat task list" },
  { src: motiVoice, alt: "Moti natural-language voice capture", caption: "Speak naturally; Moti structures the intent" },
  { src: motiTimelineV2, alt: "Moti proactive guidance when a project is slipping", caption: "Proactive: ‘Portfolio is slipping’ → Make space / Not this week" },
  { src: motiApp, alt: "Moti: Plan app icon", caption: "Moti: Plan, live on the App Store" },
];
export function MotiHook() {
  return (
    <div className="flex flex-col gap-10 md:gap-12">
      <Chips items={hookHighlights} />
      <PullQuote>The problem wasn&rsquo;t planning. It was understanding.</PullQuote>
      <ArtifactGallery items={hookArtifacts} />
      <AppStoreButton href="https://apps.apple.com/us/app/moti-plan/id6770705491" />
    </div>
  );
}

/* ── 3) The Problem — three pillars ──────────────────────────────────────── */
const problemPillars: GridItem[] = [
  { num: "01", title: "Overwhelming Inputs", desc: "Too much arriving from too many places.", icon: Inbox, accent: "violet" },
  { num: "02", title: "Fragmented Thinking", desc: "No single place where it all makes sense.", icon: Split, accent: "emerald" },
  { num: "03", title: "Unclear Action", desc: "A full list, but no idea what to actually do next.", icon: Compass, accent: "slate" },
];
export function MotiProblem() {
  return <CardGrid items={problemPillars} colsClass="grid-cols-1 sm:grid-cols-3" />;
}

/* ── 4) Competitive Analysis — strength / gap rows ───────────────────────── */
const competitors = [
  { name: "Todoist", strength: "Great for capture", gap: "Doesn’t plan for you" },
  { name: "Motion", strength: "AI scheduling", gap: "Can feel rigid" },
  { name: "Sunsama", strength: "Intentional daily planning", gap: "Requires discipline" },
  { name: "Notion", strength: "Flexible and powerful", gap: "Heavy setup" },
  { name: "ChatGPT", strength: "Flexible thinking", gap: "Not timeline-aware" },
];
export function MotiCompetitive() {
  return (
    <ModuleCard>
      <div className="divide-y divide-white/[0.05]">
        {competitors.map((c) => (
          <div key={c.name} className="grid grid-cols-1 md:grid-cols-[1fr_2fr_2fr] gap-2 md:gap-6 px-6 py-5 md:px-8 md:py-6">
            <p className="text-[15px] md:text-[17px] font-medium text-white/95">{c.name}</p>
            <div className="flex items-start gap-2.5">
              <Check aria-hidden="true" className="w-4 h-4 mt-0.5 shrink-0 text-emerald-400" strokeWidth={1.6} />
              <p className="text-[14px] md:text-[15px] font-light text-white/75">{c.strength}</p>
            </div>
            <div className="flex items-start gap-2.5">
              <Minus aria-hidden="true" className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" strokeWidth={1.6} />
              <p className="text-[14px] md:text-[15px] font-light text-white/55">{c.gap}</p>
            </div>
          </div>
        ))}
      </div>
    </ModuleCard>
  );
}

/* ── 5) What Users Told Me — quote cluster ───────────────────────────────── */
const userQuotes = [
  "Entering tasks is so annoying.",
  "I spend more time organizing than doing.",
  "It’s hard to change plans when things change.",
  "AI suggestions don’t get my timeline or real-world constraints.",
  "I end up with more tasks, not more clarity.",
  "I just want a plan that adapts to me, not the other way around.",
];
export function MotiUserQuotes() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
      {userQuotes.map((q, i) => (
        <figure key={i} className="flex flex-col gap-4 rounded-2xl border border-white/[0.07] bg-[#0c0c0d] px-6 py-7">
          <Quote aria-hidden="true" className="w-5 h-5 text-white/25" strokeWidth={1.4} />
          <blockquote className="text-[15px] md:text-[16px] font-light leading-[24px] text-white/85">
            “{q}”
          </blockquote>
        </figure>
      ))}
    </div>
  );
}

/* ── 6) Design Principles — icon + label grid ────────────────────────────── */
const principles: GridItem[] = [
  { num: "01", title: "Natural input", icon: Mic, accent: "violet" },
  { num: "02", title: "Adaptive timelines", icon: CalendarClock, accent: "emerald" },
  { num: "03", title: "Living plans", icon: RefreshCw, accent: "slate" },
  { num: "04", title: "Momentum tracking", icon: Gauge, accent: "violet" },
  { num: "05", title: "Context-aware planning", icon: Target, accent: "emerald" },
  { num: "06", title: "Human-centered planning", icon: HeartHandshake, accent: "slate" },
];
export function MotiPrinciples() {
  return <CardGrid items={principles} colsClass="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" />;
}

/* ── 7) Before Building — behavior / architecture / interaction / visual ──── */
const behaviorItems: GridItem[] = [
  { num: "01", title: "Understand context before planning", icon: Compass, accent: "violet" },
  { num: "02", title: "Preserve timeline continuity", icon: CalendarClock, accent: "emerald" },
  { num: "03", title: "Evolve plans collaboratively", icon: RefreshCw, accent: "slate" },
  { num: "04", title: "Optimize for momentum", icon: Gauge, accent: "violet" },
];
const tierItems: GridItem[] = [
  { num: "01", title: "Rule-Based", desc: "Deterministic logic — due dates, checkpoints, timeline calculations. Fast, reliable, consistent.", icon: Ruler, accent: "slate" },
  { num: "02", title: "Foundational Model · SLM", desc: "Understanding, not planning. Fast, lightweight parsing and low-latency interactions.", icon: Cpu, accent: "emerald" },
  { num: "03", title: "LLM", desc: "Deep reasoning — project-level planning, adaptive refinement, contextual understanding.", icon: Brain, accent: "violet" },
];
const interactionItems: GridItem[] = [
  { num: "01", title: "Conversational Capture", desc: "Natural language in.", icon: MessagesSquare, accent: "violet" },
  { num: "02", title: "Adaptive Refinement", desc: "Plans evolve without restart.", icon: RefreshCw, accent: "emerald" },
  { num: "03", title: "Contextual Views", desc: "Different surfaces, different needs.", icon: LayoutGrid, accent: "slate" },
  { num: "04", title: "Proactive Guidance", desc: "Pace, drift, what matters now.", icon: Compass, accent: "violet" },
];
const visualItems: GridItem[] = [
  { num: "01", title: "Clarity Without Overload", icon: Eye, accent: "violet" },
  { num: "02", title: "Direction Over Precision", icon: Compass, accent: "emerald" },
  { num: "03", title: "Ambient Awareness", icon: Activity, accent: "slate" },
  { num: "04", title: "Unified Spatial System", icon: LayoutGrid, accent: "violet" },
];

export function MotiBeforeBuilding() {
  return (
    <div className="flex flex-col gap-12 md:gap-16">
      {/* A — Product Behavior */}
      <div className="flex flex-col gap-6">
        <SubHead>Define Product Behavior</SubHead>
        <CardGrid items={behaviorItems} colsClass="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" />
      </div>

      {/* B — System Architecture */}
      <div className="flex flex-col gap-6">
        <SubHead>Define System Architecture</SubHead>
        <CardGrid items={tierItems} colsClass="grid-cols-1 sm:grid-cols-3" />
        <div className="rounded-2xl border border-white/[0.07] bg-[#0c0c0d] px-6 py-7 md:px-8 md:py-8">
          <p className="text-[11px] uppercase tracking-[0.16em] text-white/45 font-mono mb-3">Pipeline</p>
          <p className="text-[15px] md:text-[17px] font-light leading-relaxed text-white/80">
            Messy human input → SLM builds structured understanding → LLM turns it into an adaptive, timeline-aware plan. A
            context store and feedback loop run underneath.
          </p>
        </div>
        <MotiFigure
          src={motiSlm}
          alt="Moti stage one: the SLM extracts signals, structures intent, and builds context"
          caption="Stage one — the SLM turns raw, scattered input into structured understanding: fast, lightweight, low-latency."
        />
        <MotiFigure
          src={motiLlm}
          alt="Moti stage two: the LLM planning layer turns structured context into an adaptive plan"
          caption="Stage two — the LLM turns that structured context into an adaptive, timeline-aware plan."
        />
        <MotiFigure
          src={motiAi}
          alt="Moti Settings screen showing the three selectable intelligence modes"
          caption="All three modes ship in the app — rule-based, foundational model (SLM), and LLM."
          narrow
        />
        <div className="flex flex-col gap-4 rounded-2xl border border-white/[0.07] bg-[#0c0c0d] px-6 py-7 md:px-8 md:py-8">
          <div className="flex items-center justify-between">
            <p className="text-[16px] md:text-[18px] font-medium text-white/95">Adaptive Learning Loop</p>
            <Activity aria-hidden="true" className="w-4 h-4 text-violet-400" strokeWidth={1.4} />
          </div>
          <p className="text-[14px] md:text-[16px] font-light leading-relaxed text-white/72">
            Moti checks in at set milestones to learn the user&rsquo;s personal baseline — pace, completion behavior, and
            energy.
          </p>
          <div className="flex flex-wrap gap-2">
            {["25%", "50%", "75%", "100%"].map((p) => (
              <span
                key={p}
                className="inline-flex items-center rounded-full border border-white/[0.12] bg-white/[0.03] px-3 py-1 text-[12px] font-mono tabular-nums text-white/70"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* C — Interaction Grammar */}
      <div className="flex flex-col gap-6">
        <SubHead>Define Interaction Grammar</SubHead>
        <CardGrid items={interactionItems} colsClass="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
          <MotiFigure
            src={motiLlmPlan1}
            alt="Moti Smart Capture asking a clarifying question about the captured intent"
            caption="Capture in plain language; Moti asks one clarifying question to resolve intent."
          />
          <MotiFigure
            src={motiLlmPlan2}
            alt="Moti Smart Capture proposing a structured, timeline-aware task"
            caption="Then it proposes a structured, timeline-aware task — Add to Timeline, Refine, or Dismiss."
          />
        </div>
      </div>

      {/* D — Visual Language */}
      <div className="flex flex-col gap-6">
        <SubHead>Define Visual Language</SubHead>
        <CardGrid items={visualItems} colsClass="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" />
      </div>
    </div>
  );
}

/* ── 8) Build Journey — iterative versions + outcomes ────────────────────── */
type VersionPoint = { label: string; text: string };
function VersionBlock({
  tag,
  title,
  subtitle,
  points,
  quote,
}: {
  tag: string;
  title: string;
  subtitle?: string;
  points: VersionPoint[];
  quote?: string;
}) {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/[0.07] bg-[#0c0c0d]">
      <div className="flex items-baseline gap-4 px-6 py-6 md:px-8 md:py-7 border-b border-white/[0.05]">
        <span className="text-[12px] font-mono tabular-nums text-violet-400/70">{tag}</span>
        <div>
          <p className="text-[18px] md:text-[22px] font-medium text-white/95 leading-snug">{title}</p>
          {subtitle ? <p className="mt-1 text-[13px] md:text-[14px] text-white/55">{subtitle}</p> : null}
        </div>
      </div>
      <div className="flex flex-col gap-5 px-6 py-6 md:px-8 md:py-7">
        {points.map((p) => (
          <div key={p.label}>
            <p className="text-[11px] uppercase tracking-[0.16em] text-white/45 font-mono mb-1.5">{p.label}</p>
            <p className="text-[14px] md:text-[16px] font-light leading-relaxed text-white/80">{p.text}</p>
          </div>
        ))}
        {quote ? <PullQuote>{quote}</PullQuote> : null}
      </div>
    </div>
  );
}

const iterationPoints = [
  "Messy input became natural.",
  "Users needed context, not tasks.",
  "Real behavior exposed planning gaps.",
  "Iteration N introduced proactive guidance: “On current pace, Portfolio and Job Search are slipping” → Make space / Not this week.",
];
export function MotiBuildJourney() {
  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <VersionBlock
        tag="v0"
        title="Rule-Based Prototype"
        subtitle="Testing the core interaction loop"
        points={[
          { label: "What worked", text: "Understood immediately, low cognitive load." },
          { label: "What broke", text: "Trust broke under complexity." },
          { label: "Learning", text: "The interaction model worked; the intelligence layer needed to evolve." },
        ]}
      />
      <VersionBlock
        tag="v1"
        title="Foundational Model for Understanding"
        points={[
          { label: "Why evolve", text: "Temporal blindness, context loss, over-rigid parsing." },
          { label: "Learning", text: "Understanding fidelity is the bottleneck; planning quality depends on input clarity." },
        ]}
        quote="The problem wasn’t planning. It was understanding."
      />
      <VersionBlock
        tag="v1.1"
        title="Constraining the Understanding Layer"
        points={[
          { label: "Flow", text: "Natural language input → context layer → control layer → foundation model → structured understanding." },
          { label: "Stance", text: "Not autonomous planning. Reliable understanding." },
          { label: "Shipped to TestFlight", text: "Internal build, real user feedback, continuous iteration." },
        ]}
      />

      <ModuleCard header="Iterations to the App Store">
        <div className="flex flex-col gap-4 px-6 py-7 md:px-8 md:py-8">
          {iterationPoints.map((p, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-white/30" />
              <p className="text-[14px] md:text-[16px] font-light leading-relaxed text-white/80">{p}</p>
            </div>
          ))}
          <div className="mt-2 flex items-start gap-3">
            <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" strokeWidth={1.6} />
            <p className="text-[14px] md:text-[16px] font-medium leading-relaxed text-white/95">
              Outcome: shipped, live on the App Store.
            </p>
          </div>
        </div>
      </ModuleCard>
    </div>
  );
}

/* ── 9) What Moti Proved — closing takeaways ─────────────────────────────── */
const takeaways: GridItem[] = [
  { num: "01", title: "A real AI-native product, shipped solo", desc: "Designed and built with Claude + Codex, and released on the App Store.", icon: Rocket, accent: "violet" },
  { num: "02", title: "Understanding-first beat planning-first", desc: "Constraining the model to reliable understanding, then planning on top, fixed what broke in v0.", icon: Sparkles, accent: "emerald" },
  { num: "03", title: "Spec-first works", desc: "Defining behavior, architecture, interaction, and visual language before coding produced a coherent product, not a pile of features.", icon: CheckCircle2, accent: "slate" },
];
export function MotiTakeaways() {
  return <CardGrid items={takeaways} colsClass="grid-cols-1 sm:grid-cols-3" />;
}
