import { noOrphan } from "@/lib/noOrphan";
import {
  ArrowUpRight,
  Waves,
  Layers,
  Zap,
  Mic,
  Sun,
  Anchor,
  Ban,
  LayoutGrid,
  Cpu,
  AudioLines,
  Cloud,
  PenLine,
  ShieldCheck,
  Scale,
  Compass,
  Sparkles,
  BookOpen,
  FileSearch,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { FigureCaption } from "./FigureCaption";
import { CardGrid, Chips, ModuleCard, PullQuote, SCREEN_FIGURE_WIDTH, type ArtifactItem, type GridItem } from "./MotiModules";
import oryneOcean from "@/assets/oryne-ocean.webp";
import oryneCurrent from "@/assets/oryne-current.webp";
import oryneResurface from "@/assets/oryne-resurface.webp";
import oryneAskAnswer from "@/assets/oryne-ask-answer.webp";
import oryneThought from "@/assets/oryne-thought.webp";
import oryneLibrary from "@/assets/oryne-library.webp";
import oryneCaptureTyped from "@/assets/oryne-capture-typed.webp";
import oryneWhisperListening from "@/assets/oryne-whisper-listening.webp";
import oryneShowRelated from "@/assets/oryne-show-related.webp";
import oryneFastCaptureOverlay from "@/assets/oryne-fast-capture-overlay.webp";
import oryneWidgetsHome from "@/assets/oryne-widgets-home.webp";
import oryneBranch from "@/assets/oryne-branch.webp";
import oryneProtoCanvas from "@/assets/oryne-proto-canvas.webp";
import oryneProtoRediscover from "@/assets/oryne-proto-rediscover.webp";
import oryneFirstOcean from "@/assets/oryne-first-ocean.webp";
import oryneFirstLibrary from "@/assets/oryne-first-library.webp";
import oryneWireOceanLayouts from "@/assets/oryne-wire-ocean-layouts.webp";
import oryneWireCaptureFlow from "@/assets/oryne-wire-capture-flow.webp";
import oryneWireBranching from "@/assets/oryne-wire-branching.webp";
import { Button } from "@/components/ui/Button";

/* ---------------------------------------------------------------------------
 * Oryne case-study inline modules.
 * Same token-backed module language as Moti (dark cards, mono numbers, lucide
 * icons, violet/emerald/slate accents); the shared shells are imported from
 * MotiModules rather than copied. Every claim here is backed by the shipped
 * app, its App Store listing, or its git history. Nothing is a projection.
 * ------------------------------------------------------------------------- */

const ORYNE_APP_STORE_URL = "https://apps.apple.com/us/app/oryne/id6778995892";

function AppStoreLink({ label }: { label: string }) {
  return (
    <Button href={ORYNE_APP_STORE_URL} external icon={<ArrowUpRight strokeWidth={1.8} />}>
      {label}
    </Button>
  );
}

// Term rows: the product's own vocabulary, each pinned to the copy that
// actually appears in the app, so the metaphor is shown doing work, not claimed.
// The same three-column shell carries the principles table, where the mono
// third column holds the test each principle has to pass instead of app copy.
type Term = { term: string; meaning: string; inApp: string; icon: LucideIcon };
type TermColumns = [string, string, string];
const VOCABULARY_COLUMNS: TermColumns = ["Term", "Meaning", "In the app"];
const TERM_COLS = "grid-cols-1 md:grid-cols-[minmax(0,1fr)_2fr_minmax(0,1.4fr)]";
const TERM_COL_RULE = "md:border-l md:border-case-study-module-divider";
function TermList({ items, columns = VOCABULARY_COLUMNS }: { items: Term[]; columns?: TermColumns }) {
  return (
    <ModuleCard>
      <div className={`hidden md:grid ${TERM_COLS} px-8 py-4 border-b border-case-study-module-divider`}>
        <p className="text-label uppercase tracking-eyebrow text-foreground-tertiary font-mono">{columns[0]}</p>
        <p className={`text-label uppercase tracking-eyebrow text-foreground-tertiary font-mono pl-6 ${TERM_COL_RULE}`}>{columns[1]}</p>
        <p className={`text-label uppercase tracking-eyebrow text-foreground-tertiary font-mono pl-6 ${TERM_COL_RULE}`}>{columns[2]}</p>
      </div>
      <div className="divide-y divide-case-study-module-divider">
        {items.map((t) => {
          const Icon = t.icon;
          return (
            <div key={t.term} className={`grid ${TERM_COLS} px-6 py-5 md:px-8 md:py-6`}>
              <div className="flex items-center gap-2.5">
                <Icon aria-hidden="true" className="w-4 h-4 shrink-0 text-accent-violet" strokeWidth={1.4} />
                <p className="text-sm md:text-base font-medium text-foreground">{t.term}</p>
              </div>
              <p className={`mt-2 md:mt-0 md:pl-6 text-sm font-light leading-relaxed text-foreground-secondary ${TERM_COL_RULE}`}>{noOrphan(t.meaning)}</p>
              <p className={`mt-2 md:mt-0 md:pl-6 text-caption md:text-sm font-mono leading-relaxed text-foreground-tertiary ${TERM_COL_RULE}`}>{noOrphan(t.inApp)}</p>
            </div>
          );
        })}
      </div>
    </ModuleCard>
  );
}

/* ── 1) Overview — tags + App Store CTA ─────────────────────────────────── */
const tags = ["Selected Work", "AI-Native UX", "iOS", "On-Device AI", "Built & Shipped"];
export function OryneTags() {
  return <Chips items={tags} />;
}

export function OryneAppStoreCta() {
  return (
    <div className="flex justify-center">
      <AppStoreLink label="View on the App Store" />
    </div>
  );
}

/* ── 2) Highlights — chips + pull-quote (the film sits above, as a figure) ── */
const hookHighlights = [
  "Live on the App Store",
  "First commit to 1.0 in 23 days",
  "Six releases in 15 days",
  "Built with Claude Code",
  "Intelligence runs on the device",
  "English and Simplified Chinese",
];
export function OryneHook() {
  return (
    <div className="flex flex-col gap-stack">
      <Chips items={hookHighlights} />
      <PullQuote>Lists are excellent at storing thoughts. They were never meant to remember them.</PullQuote>
    </div>
  );
}

/* ── 3) The Problem — three pillars ─────────────────────────────────────── */
const problemPillars: GridItem[] = [
  { num: "01", title: "The List Buries", desc: "Neat, chronological, and never scrolled back through.", icon: Layers, accent: "violet" },
  { num: "02", title: "Memory Is Not a Timeline", desc: "A thought returns because something today rhymes with it.", icon: Waves, accent: "emerald" },
  { num: "03", title: "The Moment Is Too Short", desc: "Unlock, open, find the note. The thought is already gone.", icon: Zap, accent: "slate" },
];
export function OryneProblem() {
  return <CardGrid items={problemPillars} colsClass="grid-cols-1 sm:grid-cols-3" />;
}

/* ── 4) The Idea — vocabulary that does work, and three spaces ──────────── */
const vocabulary: Term[] = [
  { term: "Whisper", meaning: "A thought caught by voice. Words appear while you speak.", inApp: "“Catch a whisper”", icon: Mic },
  { term: "Thought", meaning: "One captured fragment, named and themed on the device.", inApp: "“Release into the Ocean”", icon: Sparkles },
  { term: "Current", meaning: "Related thoughts drift together. Nothing is filed.", inApp: "“8 thoughts drift here”", icon: Waves },
  { term: "Resurfacing", meaning: "One forgotten thought rises per day.", inApp: "“Catching a thought that drifted away”", icon: Sun },
  { term: "Ask the Ocean", meaning: "A question answered only from your own thoughts.", inApp: "“Responses come from what you’ve captured.”", icon: Compass },
];
const spaces: GridItem[] = [
  { num: "01", title: "The Ocean, for Encountering", desc: "Enter without a goal. Drift is the point.", icon: Waves, accent: "violet" },
  { num: "02", title: "The Library, for Finding", desc: "A scannable waterfall of cards. Finding is a job.", icon: LayoutGrid, accent: "emerald" },
  { num: "03", title: "The Thought, for Working", desc: "One fragment, full attention. Edit it or grow a branch.", icon: BookOpen, accent: "slate" },
];
export function OryneIdea() {
  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <TermList items={vocabulary} />
      <CardGrid
        items={spaces}
        header="Felt vs Legible: Three Spaces, Not One Compromise"
        colsClass="grid-cols-1 sm:grid-cols-3"
      />
    </div>
  );
}

/* ── 4b) Iterations — the versions before the shipped one ────────────────── */
// Three verified stages before the App Store build. The web prototype is the
// Lovable app at inspired-sea-drift.lovable.app, captured live on 2026-09-08.
// The wireframe stage is described from the Claude Design project's own
// transcript (eight flows, four Ocean Field directions, 2026-05-24); its
// screens were rendered from its source files with Playwright. The June 9
// screens are the app's initial commit, built and captured on a clean
// simulator, run through the same phone-frame pipeline as every other screen.
type Stage = { num: string; title: string; when: string; lead: string; kept: string; changed: string };
const stages: Stage[] = [
  {
    num: "01",
    title: "A Web Prototype Called InspireOcean",
    when: "Lovable, the first version",
    lead: "Cards on a dotted canvas, a list view one keystroke away, and a Rediscover panel that surfaced older ideas not opened recently.",
    kept: "The three verbs were already here: capture, browse spatially, and let old ideas come back on their own.",
    changed: "The canvas was a whiteboard, not water. Cards sat wherever they were dropped, nothing moved, and nothing was related to anything.",
  },
  {
    num: "02",
    title: "Wireframes That Argued With Themselves",
    when: "Claude Design, May 24",
    lead: "Eight flows as storyboard rows, and under each hard question a row of side-by-side alternatives. Navigation, the Ask surface, the Library, and the capture entry points shipped as drawn. The three rows below did not.",
    kept: "Four tabs named for the four verbs, Capture, Ocean, Ask, and Library, and long press as the canonical gesture: chosen there for branching, kept in the shipped app for kinship.",
    changed: "The Ocean Field question was never settled by picking one. The build went Cluster first, on day two, and drift arrived in July. The shipped Ocean is both: currents that move.",
  },
  {
    num: "03",
    title: "Iteration 1: The First Build",
    when: "SwiftUI, from June 9",
    lead: "By the end of day one the four tabs existed. The Ocean was a handful of gray orbs on a dark field, the Library a list, Whisper a mic and a timer, and Ask a chat with four lenses. Fast Capture and the widgets followed on day two.",
    kept: "The skeleton shipped as it was: the four tabs, Thought and Whisper capture, Grow a Branch, Ask answering only from the water.",
    changed: "Orbs became glass bodies that drift in currents and light up their relatives on a long press. The Library became a waterfall you can sort by meaning. Ask kept its lenses and gained a floor under which it admits it has nothing.",
  },
];
type Pair = { title: string; before: ArtifactItem; after: ArtifactItem };
// Only the screens that visibly changed. The Iteration 1 screens come from the
// initial commit of ~/Documents/inspire-ocean (2026-06-09), built for the
// simulator on 2026-09-08 (see the memory note). Ask, Capture, Thought, Branch,
// and Whisper were compared too and shipped nearly as built, so they are not
// shown as pairs; Whisper's real change, live words, has no screenshot yet.
const pairs: Pair[] = [
  {
    title: "Ocean",
    before: { src: oryneFirstOcean, alt: "Iteration 1’s Ocean: ten gray orbs with icons scattered on a dark field", label: "Iteration 1", caption: "gray orbs scattered on a dark field, and no currents yet" },
    after: { src: oryneOcean, alt: "The shipped Ocean: glass orbs drifting in currents, one lit by a long press", label: "Shipped", caption: "glass bodies in currents, relatives lit on a long press" },
  },
  {
    title: "Library",
    before: { src: oryneFirstLibrary, alt: "Iteration 1’s Library: a single-column list grouped by week", label: "Iteration 1", caption: "a list, newest first, one thought per row" },
    after: { src: oryneLibrary, alt: "The shipped Library: a masonry waterfall of cards", label: "Shipped", caption: "a waterfall of cards, by time or by meaning" },
  },
];
// Wireframe rows, cropped from the rendered Claude Design file at 2x. Only the
// rows where the shipped app departed from the drawing: Ocean Field, Drift
// Capture, and Branching. Entry points, Dialogue, Navigation, and Library
// shipped as drawn, so they are a sentence in the stage card, not a figure.
type WireRow = ArtifactItem;
const wireRows: WireRow[] = [
  { src: oryneWireOceanLayouts, alt: "Wireframe row: four Ocean Field layouts side by side, Drift, Cluster, Depth, and Timeline, each as a phone screen", label: "Ocean Field", caption: "four layouts from most spatial to most legible, and the shipped Ocean is Drift and Cluster together" },
  { src: oryneWireCaptureFlow, alt: "Wireframe storyboard: idle Ocean, a radial mode picker, a two-second capture, and a ripple confirming release", label: "Drift Capture", caption: "thought to Ocean in under two seconds, and release as the verb; both shipped, the radial picker became a Thought and Whisper toggle" },
  { src: oryneWireBranching, alt: "Wireframe row: four branching gestures, long-press radial, directional swipe, an inline button, and a bottom sheet", label: "Branching", caption: "four gestures for the same four kinds; the recommended radial lost to the bottom sheet, and the long press went to kinship instead" },
];
function StageCard({ stage }: { stage: Stage }) {
  return (
    <ModuleCard>
      <div className="px-6 pt-7 pb-6 md:px-8 md:pt-8 md:pb-7 border-b border-case-study-module-divider">
        <div className="flex items-baseline gap-3">
          <span className="text-caption font-mono tabular-nums text-accent-violet/70">{stage.num}</span>
          <p className="text-caption md:text-xl uppercase tracking-eyebrow font-light leading-relaxed text-foreground font-mono">{stage.title}</p>
        </div>
        <p className="mt-1 text-caption md:text-sm font-mono text-foreground-tertiary">{stage.when}</p>
        <p className="mt-3 text-sm md:text-base font-light leading-relaxed text-foreground-secondary max-w-measure">{noOrphan(stage.lead)}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-case-study-module-divider">
        <div className="bg-surface-inset px-6 py-6 md:px-8 md:py-7">
          <p className="text-label uppercase tracking-eyebrow text-foreground-tertiary font-mono">What survived</p>
          <p className="mt-3 text-sm md:text-base font-light leading-relaxed text-foreground-secondary">{noOrphan(stage.kept)}</p>
        </div>
        <div className="bg-surface-inset px-6 py-6 md:px-8 md:py-7">
          <p className="text-label uppercase tracking-eyebrow text-foreground-tertiary font-mono">What changed</p>
          <p className="mt-3 text-sm md:text-base font-light leading-relaxed text-foreground-secondary">{noOrphan(stage.changed)}</p>
        </div>
      </div>
    </ModuleCard>
  );
}
function WideFigure({ item }: { item: ArtifactItem }) {
  return (
    <figure className="bg-surface-inset px-6 py-7 md:px-8 md:py-8">
      <div className="overflow-hidden rounded-2xl">
        <img src={item.src} alt={item.alt} loading="lazy" decoding="async" className="w-full h-auto block" />
      </div>
      <FigureCaption label={item.label}>{item.caption}</FigureCaption>
    </figure>
  );
}
function PairFigure({ item }: { item: ArtifactItem }) {
  return (
    <figure className={`${SCREEN_FIGURE_WIDTH} flex h-full flex-col`}>
      <div className="overflow-hidden rounded-2xl">
        <img src={item.src} alt={item.alt} loading="lazy" decoding="async" className="w-full h-auto block" />
      </div>
      <div className="mt-auto">
        <FigureCaption label={item.label}>{item.caption}</FigureCaption>
      </div>
    </figure>
  );
}
export function OryneIterations() {
  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <StageCard stage={stages[0]} />
      <ModuleCard>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-case-study-module-divider">
          <WideFigure item={{ src: oryneProtoCanvas, alt: "The InspireOcean web prototype: note cards scattered on a dotted canvas with a search bar and Add and Rediscover buttons", label: "Canvas", caption: "cards wherever you dropped them, on a dotted field" }} />
          <WideFigure item={{ src: oryneProtoRediscover, alt: "The InspireOcean web prototype’s Rediscover panel listing older ideas not opened recently", label: "Rediscover", caption: "older ideas not opened recently, the seed of resurfacing" }} />
        </div>
      </ModuleCard>
      <StageCard stage={stages[1]} />
      <ModuleCard header="Three Rows That Did Not Ship as Drawn">
        <div className="flex flex-col divide-y divide-case-study-module-divider">
          {wireRows.map((row) => (
            <WideFigure key={row.label} item={row} />
          ))}
        </div>
      </ModuleCard>
      <StageCard stage={stages[2]} />
      <ModuleCard header="Iteration 1 Against Shipped">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-case-study-module-divider">
          {pairs.map((pair) => (
            <div key={pair.title} className="contents">
              <div className="flex flex-col bg-surface-inset px-6 py-7 md:px-8 md:py-8">
                <p className="text-base md:text-xl font-medium text-foreground">{pair.title}</p>
                <div className="mt-5 flex flex-1 flex-col">
                  <PairFigure item={pair.before} />
                </div>
              </div>
              <div className="flex flex-col bg-surface-inset px-6 py-7 md:px-8 md:py-8">
                <p className="text-base md:text-xl font-medium text-foreground-tertiary" aria-hidden="true">&nbsp;</p>
                <div className="mt-5 flex flex-1 flex-col">
                  <PairFigure item={pair.after} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </ModuleCard>
    </div>
  );
}

/* ── 5) Principles — the philosophy file, one test per principle ─────────── */
// PHILOSOPHY.md landed in the app repository on 2026-06-11, two days after the
// first commit, and every principle in it ends with a test. The rule column
// condenses each principle's opening line; the test column quotes its test
// nearly verbatim, because the test is the part reviews cite.
const principles: Term[] = [
  { term: "Capture", meaning: "Capture before consciousness. Under two seconds from any entry point, and nothing gates whether a thought was caught.", inApp: "Would this make someone hesitate before capturing?", icon: Zap },
  { term: "Ownership", meaning: "The user owns meaning. AI fills untouched fields only; anything you edit is yours forever.", inApp: "Can the system ever silently replace something the user wrote?", icon: PenLine },
  { term: "AI Behavior", meaning: "Grounded, modest, and honest about where words come from.", inApp: "If the network died mid-session, would the user be told anything untrue, by words or by omission?", icon: Compass },
  { term: "Motion", meaning: "Motion is atmosphere, never information. A stilled Ocean is the same Ocean.", inApp: "If every animation froze, would the app lose any meaning?", icon: Waves },
  { term: "Trust", meaning: "Never claim more certainty than the system has. Success is stated only after it is verified.", inApp: "Does the UI ever say done before the system knows it is done?", icon: ShieldCheck },
  { term: "Memory", meaning: "Rediscovery is a rhythm, not a queue. One fragment resurfaces per day.", inApp: "Does this make old thoughts return, or make the user go get them?", icon: Sun },
  { term: "Retrieval", meaning: "The Ocean is atmosphere; the Library is the contract. Position is never the only path to a thought.", inApp: "Can someone who never learned the field's layout reach every thought?", icon: LayoutGrid },
  { term: "Calm", meaning: "Oryne competes with nothing for attention. No badges, streaks, folders, or dashboards.", inApp: "Would this make Oryne feel like a tool that needs tending?", icon: Anchor },
];
export function OrynePrinciples() {
  return <TermList items={principles} columns={["Principle", "Rule", "The test"]} />;
}

/* ── 6) Final Design — one thought, start to finish, in four acts ───────── */
// The whole product as one journey. Each step is a real screen from the shipped
// app and the caption says what happens on it. The acts are the product's
// promise in order: you catch it, the Ocean works on it, you go looking, and
// the features around that loop.
type FlowStep = ArtifactItem & { num: string; title: string };
type FlowAct = { title: string; lead: string; steps: FlowStep[]; quote?: string };
const acts: FlowAct[] = [
  {
    title: "Act One: You Catch It",
    lead: "Capture is built for the moment a thought arrives, before you have judged it.",
    steps: [
      { num: "01", title: "Catch", src: oryneWhisperListening, alt: "Whisper capture listening, with a live waveform and a stop button", label: "Whisper", caption: "speak or type, and the words appear while you are still talking" },
      { num: "02", title: "Release", src: oryneCaptureTyped, alt: "A typed thought above the Release into the Ocean button", label: "Release", caption: "one button, no title, no folder, no category" },
    ],
  },
  {
    title: "Act Two: The Ocean Works",
    lead: "Everything you never get around to happens on the device after you let go. Then, one day, it comes back.",
    steps: [
      { num: "03", title: "Understand", src: oryneThought, alt: "An expanded thought with its title, themes, and nearby thoughts", label: "Thought", caption: "the device names it and finds its themes, and anything you edit stays yours" },
      { num: "04", title: "Drift", src: oryneOcean, alt: "The Ocean: currents as glass orbs, one lit by a long press", label: "Ocean", caption: "it flows into a current, and a long press lights up its relatives" },
      { num: "05", title: "Gather", src: oryneCurrent, alt: "A current opened: eight thoughts drift here, with related currents above", label: "Current", caption: "eight thoughts drift here, and nobody filed them" },
      { num: "06", title: "Return", src: oryneResurface, alt: "A resurfaced thought from last month, opened over the Ocean", label: "Resurfacing", caption: "one forgotten thought a day, more likely when it echoes what you are exploring" },
    ],
    quote: "When an effect you love is fighting the information it carries, the effect loses.",
  },
  {
    title: "Act Three: When You Go Looking",
    lead: "Rediscovery is a rhythm, not a search. When you do go looking, there is a place for that.",
    steps: [
      { num: "07", title: "Find", src: oryneLibrary, alt: "The Library: a masonry waterfall of thought cards", label: "Library", caption: "a waterfall of cards, by time or by meaning" },
      { num: "08", title: "Ask", src: oryneAskAnswer, alt: "Ask the Ocean answering a question from the user’s own thoughts", label: "Ask", caption: "an answer composed only from what you captured, with its sources named" },
    ],
  },
  {
    title: "Act Four: Around the Loop",
    lead: "Four more features, each built to keep the Ocean simple.",
    steps: [
      { num: "09", title: "Fast Capture", src: oryneFastCaptureOverlay, alt: "The Fast Capture overlay floating over the Ocean tab", label: "Fast Capture", caption: "from the Action Button, Control Center, or a widget, over whatever you were doing" },
      { num: "10", title: "Widgets", src: oryneWidgetsHome, alt: "Home screen with the Oryne Fast Capture widget and a resurfacing widget", label: "Widgets", caption: "a Thought or Whisper button one tap from the home screen" },
      { num: "11", title: "Grow a Branch", src: oryneBranch, alt: "The Grow a branch sheet with Question, Concept, Research, and Project types", label: "Branch", caption: "a new thought grows out of this one, as a question, a concept, research, or a project" },
      { num: "12", title: "Show Related", src: oryneShowRelated, alt: "The Library after a long press: the chosen thought’s closest companions rise to the top", label: "Show related", caption: "long press a thought in the Library and its closest companions rise to the top" },
    ],
    quote: "No new gestures on the Ocean, ever.",
  },
];
function FlowStepFigure({ step }: { step: FlowStep }) {
  return (
    <div className="flex h-full flex-col bg-surface-inset px-6 py-7 md:px-8 md:py-8">
      <div className="flex items-baseline gap-3">
        <span className="text-caption font-mono tabular-nums text-accent-violet/70">{step.num}</span>
        <p className="text-base md:text-xl font-medium text-foreground">{step.title}</p>
      </div>
      <figure className={`${SCREEN_FIGURE_WIDTH} mt-5 flex flex-1 flex-col`}>
        <div className="overflow-hidden rounded-2xl">
          <img src={step.src} alt={step.alt} loading="lazy" decoding="async" className="w-full h-auto block" />
        </div>
        <div className="mt-auto">
          <FigureCaption label={step.label}>{step.caption}</FigureCaption>
        </div>
      </figure>
    </div>
  );
}
export function OryneFlow() {
  return (
    <div className="flex flex-col gap-8 md:gap-10">
      {acts.map((act) => (
        <ModuleCard key={act.title}>
          <div className="px-6 pt-7 pb-6 md:px-8 md:pt-8 md:pb-7 border-b border-case-study-module-divider">
            <p className="text-caption md:text-xl uppercase tracking-eyebrow font-light leading-relaxed text-foreground font-mono">
              {act.title}
            </p>
            <p className="mt-3 text-sm md:text-base font-light leading-relaxed text-foreground-secondary max-w-measure">
              {noOrphan(act.lead)}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-case-study-module-divider">
            {act.steps.map((step) => (
              <FlowStepFigure key={step.num} step={step} />
            ))}
            {act.quote ? (
              <div className="sm:col-span-2 bg-surface-inset px-6 py-7 md:px-8 md:py-8">
                <PullQuote>{act.quote}</PullQuote>
              </div>
            ) : null}
          </div>
        </ModuleCard>
      ))}
    </div>
  );
}

/* ── 7) Research — three measurements against the device ────────────────── */
// Every number here is copied from the app repository, not remembered:
// Scripts/embedding-floor-sweep/README.md (the Ask floor corridor, measured
// 2026-07-03 against the 60-fragment audit store, and the bilingual candidate
// sweep of 2026-07-09), and the merged bilingual-voice pull request, which
// records the Gate 1 device answers. Nothing is rounded beyond the source.
type MeasureRow = { label: string; detail?: string; value: string; meaning: string };
type Measure = { header: string; lead: string; columns: [string, string, string]; rows: MeasureRow[]; note: string };
// The middle column is fixed at 11rem so a paired value ("0.0006 · 0.0000") and
// its two-word header stay on one line at the reading width.
const MEASURE_COLS = "grid-cols-1 md:grid-cols-[minmax(0,1.2fr)_11rem_minmax(0,1.5fr)]";
const measures: Measure[] = [
  {
    header: "Where the Honesty Floor Sits",
    lead: "Ask retrieves fragments by cosine similarity from Apple’s on-device word embeddings. Against a 60-fragment audit store, 48 synthetic drifts and 12 known targets, three anchor queries show where a floor can sit.",
    columns: ["Anchor query", "Score", "What it means"],
    rows: [
      { label: "Nonsense", detail: "“quantum accounting standards”", value: "0.6725", meaning: "The highest pure noise reaches. The floor has to sit above it, so the query lands the empty state." },
      { label: "Keyword-free paraphrase", detail: "“why do I put off beginning work”, target: Blank page judgment", value: "0.7404", meaning: "Shares no words with its target. The floor has to sit below it, so the paraphrase still recalls it." },
      { label: "Terse phrasing", detail: "“notifications interrupt attention”, target: Attention Drain", value: "0.685", meaning: "The one accepted loss. Natural phrasings of the same thought clear the floor; only this wording falls short." },
    ],
    note: "The floor is 0.70: about 0.03 above the noise and 0.04 below the paraphrase. Averaged word vectors compress every score into 0.5 to 0.84, so the corridor is narrow by nature. Below it, Ask says you have not captured anything about that, and anything from beyond your notes is marked apart, never in the same voice.",
  },
  {
    header: "Do Chinese and English Share a Space?",
    lead: "The bilingual plan assumed Apple’s contextual embedding puts both languages in one vector space, so a Chinese thought could find an English relative. A hand-built set of Chinese, English, and mixed pairs, scored under both candidate backends, said otherwise.",
    columns: ["Pair", "Contextual · dual", "What it means"],
    rows: [
      { label: "English with English", detail: "related pairs against unrelated ones", value: "0.886 · 0.847", meaning: "A clean corridor under either backend. Same-language kinship works." },
      { label: "Chinese with Chinese", detail: "related pairs against unrelated ones", value: "0.678 · 0.414", meaning: "A clean corridor too, at a different level from English. Kinship works within Chinese, where it had been fully broken before." },
      { label: "Chinese with English", detail: "“我对职业选择感到很焦虑” with “I feel anxious about my career”", value: "0.0006 · 0.0000", meaning: "A translated pair scores the same as an unrelated one. There is no shared space." },
    ],
    note: "Apple groups languages by script family: English resolves to a Latin-script model and Chinese to a CJK model. Cross-language kinship was cut from scope in writing, in the design brief itself, and same-language kinship shipped in both languages.",
  },
  {
    header: "Two Questions Only a Phone Could Answer",
    lead: "Before any capture code changed, a throwaway harness recorded three takes on a physical iPhone, pure Mandarin, pure English, and one sentence that switches midway, and ran them through both speech APIs.",
    columns: ["Question", "On device", "What it changed"],
    rows: [
      { label: "Does the iOS 26 transcriber follow a sentence that switches language midway?", value: "Yes", meaning: "One transcriber per capture on iOS 26. The planned bake-off between two recognizers was never built there." },
      { label: "Can two on-device recognizers, Chinese and English, run from one tap on iOS 18?", value: "No", meaning: "They throttle each other. The live bake-off was dropped; the alternate language runs as a second pass after capture, only when the first transcript shows failure signals." },
    ],
    note: "The tie-break goes to Chinese, because the Chinese model survives embedded English while the English model produces confident nonsense on Chinese. Every capture records audio first, so a transcript that lands in the wrong language can be redone in either one from the thought itself.",
  },
];
function MeasureTable({ measure }: { measure: Measure }) {
  return (
    <ModuleCard>
      <div className="px-6 pt-7 pb-6 md:px-8 md:pt-8 md:pb-7 border-b border-case-study-module-divider">
        <p className="text-caption md:text-xl uppercase tracking-eyebrow font-light leading-relaxed text-foreground font-mono">
          {measure.header}
        </p>
        <p className="mt-3 text-sm md:text-base font-light leading-relaxed text-foreground-secondary max-w-measure">
          {noOrphan(measure.lead)}
        </p>
      </div>
      <div className={`hidden md:grid ${MEASURE_COLS} px-8 py-4 border-b border-case-study-module-divider`}>
        <p className="text-label uppercase tracking-eyebrow text-foreground-tertiary font-mono">{measure.columns[0]}</p>
        <p className={`text-label uppercase tracking-eyebrow text-foreground-tertiary font-mono pl-6 ${TERM_COL_RULE}`}>{measure.columns[1]}</p>
        <p className={`text-label uppercase tracking-eyebrow text-foreground-tertiary font-mono pl-6 ${TERM_COL_RULE}`}>{measure.columns[2]}</p>
      </div>
      <div className="divide-y divide-case-study-module-divider">
        {measure.rows.map((row) => (
          <div key={row.label} className={`grid ${MEASURE_COLS} px-6 py-5 md:px-8 md:py-6`}>
            <div>
              <p className="text-sm md:text-base font-medium text-foreground">{noOrphan(row.label)}</p>
              {row.detail ? (
                <p className="mt-1.5 text-caption md:text-sm font-mono leading-relaxed text-foreground-tertiary">{noOrphan(row.detail)}</p>
              ) : null}
            </div>
            <p className={`mt-2 md:mt-0 md:pl-6 text-base font-mono tabular-nums whitespace-nowrap text-foreground ${TERM_COL_RULE}`}>{row.value}</p>
            <p className={`mt-2 md:mt-0 md:pl-6 text-sm font-light leading-relaxed text-foreground-secondary ${TERM_COL_RULE}`}>{noOrphan(row.meaning)}</p>
          </div>
        ))}
        <div className="flex items-start gap-3 px-6 py-5 md:px-8 md:py-6">
          <CheckCircle2 aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-success" strokeWidth={1.6} />
          <p className="text-sm md:text-base font-normal leading-relaxed text-foreground-lead max-w-measure">{noOrphan(measure.note)}</p>
        </div>
      </div>
    </ModuleCard>
  );
}
export function OryneResearch() {
  return (
    <div className="flex flex-col gap-8 md:gap-10">
      {measures.map((measure) => (
        <MeasureTable key={measure.header} measure={measure} />
      ))}
      <PullQuote>You cannot validate an AI feature by using it the way you hope users will. You validate it by trying to make it lie.</PullQuote>
    </div>
  );
}

/* ── 8) Privacy — on the device, as a design position ───────────────────── */
const privacyItems: GridItem[] = [
  { num: "01", title: "On-Device Intelligence", desc: "Apple’s Foundation Models name, theme, relate, and answer.", icon: Cpu, accent: "violet" },
  { num: "02", title: "Local Speech", desc: "Live transcription on the phone, in both languages.", icon: AudioLines, accent: "emerald" },
  { num: "03", title: "Your Own iCloud", desc: "Private CloudKit sync. No server I can read.", icon: Cloud, accent: "slate" },
];
export function OrynePrivacy() {
  return <CardGrid items={privacyItems} colsClass="grid-cols-1 sm:grid-cols-3" />;
}

/* ── 9) Shipping It — releases and the review workflow ───────────────────── */
// The "try to make the AI lie" tests used to sit here as a third grid; they
// are the Research section now, with the measurements behind them.
const releases = [
  { date: "Jun 9", tag: "First commit", text: "Fast Capture, widgets, and the Ocean field by day two." },
  { date: "Jul 2", tag: "1.0", text: "On the App Store, 23 days in." },
  { date: "Jul 4", tag: "1.1", text: "Currents that breathe. Kinship on long press." },
  { date: "Jul 6", tag: "1.2", text: "Export the Ocean as a readable archive." },
  { date: "Jul 8", tag: "1.3", text: "Masonry Library. Add a thought into an open current." },
  { date: "Jul 16", tag: "1.4", text: "Chinese and English, transcribed live on the device." },
  { date: "Jul 17", tag: "1.5", text: "Waterfall Library, Recent and Related." },
];
const workflow: GridItem[] = [
  { num: "01", title: "Author", desc: "Writes the code with the full design intent.", icon: PenLine, accent: "violet" },
  { num: "02", title: "Auditor", desc: "Reviews cold, from an isolated context. No persuasion channel.", icon: FileSearch, accent: "emerald" },
  { num: "03", title: "The Ship Gate", desc: "Nothing irreversible without a human command.", icon: ShieldCheck, accent: "slate" },
  { num: "04", title: "Rules as Contracts", desc: "“Zero commits until the human replies.” No adverbs.", icon: Scale, accent: "violet" },
];
export function OryneShipping() {
  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <ModuleCard header="Six Releases in Fifteen Days">
        <div className="hidden md:grid md:grid-cols-[6rem_6rem_minmax(0,1fr)] px-8 py-4 border-b border-case-study-module-divider">
          <p className="text-label uppercase tracking-eyebrow text-foreground-tertiary font-mono">Date</p>
          <p className={`text-label uppercase tracking-eyebrow text-foreground-tertiary font-mono pl-4 ${TERM_COL_RULE}`}>Release</p>
          <p className={`text-label uppercase tracking-eyebrow text-foreground-tertiary font-mono pl-4 ${TERM_COL_RULE}`}>What shipped</p>
        </div>
        <div className="divide-y divide-case-study-module-divider">
          {releases.map((r) => (
            <div key={r.date + r.tag} className="grid grid-cols-[4.5rem_minmax(0,1fr)] md:grid-cols-[6rem_6rem_minmax(0,1fr)] px-6 py-4 md:px-8 md:py-5">
              <p className="text-caption md:text-sm font-mono tabular-nums text-foreground-tertiary">{r.date}</p>
              <p className={`text-sm md:text-base font-medium text-foreground md:pl-4 ${TERM_COL_RULE}`}>{r.tag}</p>
              <p className={`col-span-2 md:col-span-1 mt-1 md:mt-0 text-sm font-light leading-relaxed text-foreground-secondary md:pl-4 ${TERM_COL_RULE}`}>{noOrphan(r.text)}</p>
            </div>
          ))}
          <div className="flex items-start gap-3 px-6 py-4 md:px-8 md:py-5">
            <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-success" strokeWidth={1.6} />
            <p className="text-sm md:text-base font-medium leading-relaxed text-foreground">Live on the App Store. Free, 5 MB.</p>
          </div>
        </div>
      </ModuleCard>
      <CardGrid
        items={workflow}
        header="Don’t Review the Work. Design the Review."
        colsClass="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      />
    </div>
  );
}

/* ── 10) What the Ocean Taught Me — takeaways + closing CTA ─────────────── */
const takeaways: GridItem[] = [
  { num: "01", title: "A Metaphor Is a Decision Machine", desc: "It answered questions about gestures, copy, and motion. Or it is decoration.", icon: Compass, accent: "violet" },
  { num: "02", title: "Spaces Beat Compromises", desc: "Felt and legible were never resolved on one screen.", icon: Ban, accent: "emerald" },
  { num: "03", title: "The Best Features Are Refusals", desc: "Restraint does not demo well. It ships well.", icon: Zap, accent: "slate" },
];
export function OryneTakeaways() {
  return (
    <div className="flex flex-col gap-stack">
      <CardGrid items={takeaways} colsClass="grid-cols-1 sm:grid-cols-3" />
      <div className="flex justify-center">
        <AppStoreLink label="Get Oryne on the App Store" />
      </div>
    </div>
  );
}
