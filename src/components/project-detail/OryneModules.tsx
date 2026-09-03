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
  FileText,
  Scale,
  Languages,
  Compass,
  Sparkles,
  BookOpen,
  FileSearch,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { CardGrid, Chips, ModuleCard, MotiFigure, PullQuote, SubHead, type ArtifactItem, type GridItem } from "./MotiModules";
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
    <a
      href={ORYNE_APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-2.5 rounded-full bg-foreground px-8 py-4 text-base md:text-lg font-medium text-background hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors duration-200"
    >
      {label}
      <ArrowUpRight
        aria-hidden="true"
        className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        strokeWidth={1.8}
      />
    </a>
  );
}

// Term rows: the product's own vocabulary, each pinned to the copy that
// actually appears in the app, so the metaphor is shown doing work, not claimed.
type Term = { term: string; meaning: string; inApp: string; icon: LucideIcon };
function TermList({ items }: { items: Term[] }) {
  return (
    <ModuleCard>
      <div className="divide-y divide-case-study-module-divider">
        {items.map((t) => {
          const Icon = t.icon;
          return (
            <div key={t.term} className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_2fr_minmax(0,1.4fr)] gap-2 md:gap-6 px-6 py-5 md:px-8 md:py-6">
              <div className="flex items-center gap-2.5">
                <Icon aria-hidden="true" className="w-4 h-4 shrink-0 text-accent-violet" strokeWidth={1.4} />
                <p className="text-sm md:text-base font-medium text-foreground">{t.term}</p>
              </div>
              <p className="text-sm font-light leading-relaxed text-foreground/72">{noOrphan(t.meaning)}</p>
              <p className="text-xs md:text-sm font-mono leading-relaxed text-foreground/55">{noOrphan(t.inApp)}</p>
            </div>
          );
        })}
      </div>
    </ModuleCard>
  );
}

/* ── 1) Overview — tags + App Store CTA ─────────────────────────────────── */
const tags = ["More Work", "AI-Native UX", "iOS", "On-Device AI", "Built & Shipped"];
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
  "Built solo with Claude Code",
  "Intelligence runs on the device",
  "English and Simplified Chinese",
];
export function OryneHook() {
  return (
    <div className="flex flex-col gap-10 md:gap-12">
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
    <div className="flex flex-col gap-10 md:gap-12">
      <TermList items={vocabulary} />
      <div className="flex flex-col gap-6">
        <SubHead>Felt vs Legible: Three Spaces, Not One Compromise</SubHead>
        <CardGrid items={spaces} colsClass="grid-cols-1 sm:grid-cols-3" />
      </div>
    </div>
  );
}

/* ── 5) Final Design — one thought, start to finish, in four acts ───────── */
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
    <div className="flex flex-col gap-5">
      <div className="mx-auto w-full max-w-[400px] flex items-baseline gap-3">
        <span className="text-xs font-mono tabular-nums text-accent-violet/70">{step.num}</span>
        <p className="text-base md:text-xl font-medium text-foreground">{step.title}</p>
      </div>
      <MotiFigure src={step.src} alt={step.alt} label={step.label} caption={step.caption} screen />
    </div>
  );
}
export function OryneFlow() {
  return (
    <div className="flex flex-col gap-14 md:gap-20">
      {acts.map((act) => (
        <div key={act.title} className="flex flex-col gap-8 md:gap-10">
          <div className="flex flex-col gap-3">
            <SubHead>{act.title}</SubHead>
            <p className="text-base md:text-xl font-light leading-relaxed text-foreground/72 max-w-[60ch]">{noOrphan(act.lead)}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-12 md:gap-x-8 md:gap-y-16">
            {act.steps.map((step) => (
              <FlowStepFigure key={step.num} step={step} />
            ))}
          </div>
          {act.quote ? <PullQuote>{act.quote}</PullQuote> : null}
        </div>
      ))}
    </div>
  );
}

/* ── 7) Privacy — on the device, as a design position ───────────────────── */
const privacyItems: GridItem[] = [
  { num: "01", title: "On-Device Intelligence", desc: "Apple’s Foundation Models name, theme, relate, and answer.", icon: Cpu, accent: "violet" },
  { num: "02", title: "Local Speech", desc: "Live transcription on the phone, in both languages.", icon: AudioLines, accent: "emerald" },
  { num: "03", title: "Your Own iCloud", desc: "Private CloudKit sync. No server I can read.", icon: Cloud, accent: "slate" },
];
export function OrynePrivacy() {
  return <CardGrid items={privacyItems} colsClass="grid-cols-1 sm:grid-cols-3" />;
}

/* ── 8) Shipping It — releases, workflow, testing the AI ────────────────── */
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
const askTests: GridItem[] = [
  { num: "01", title: "A Relevance Floor", desc: "Below it, the honest answer is “nothing captured about that.”", icon: Anchor, accent: "violet" },
  { num: "02", title: "Provenance in Words", desc: "“Composed offline.” “Beyond your Ocean.” Never one voice.", icon: FileText, accent: "emerald" },
  { num: "03", title: "Parity in Both Languages", desc: "Weaker in Chinese on the same tasks. English-only tests would never have found it.", icon: Languages, accent: "slate" },
];
export function OryneShipping() {
  return (
    <div className="flex flex-col gap-12 md:gap-16">
      <div className="flex flex-col gap-6">
        <SubHead>Six Releases in Fifteen Days</SubHead>
        <ModuleCard>
          <div className="divide-y divide-case-study-module-divider">
            {releases.map((r) => (
              <div key={r.date + r.tag} className="grid grid-cols-[4.5rem_minmax(0,1fr)] md:grid-cols-[6rem_6rem_minmax(0,1fr)] gap-x-4 gap-y-1 px-6 py-4 md:px-8 md:py-5">
                <p className="text-xs md:text-sm font-mono tabular-nums text-foreground/55">{r.date}</p>
                <p className="text-sm md:text-base font-medium text-foreground">{r.tag}</p>
                <p className="col-span-2 md:col-span-1 text-sm font-light leading-relaxed text-foreground/72">{noOrphan(r.text)}</p>
              </div>
            ))}
            <div className="flex items-start gap-3 px-6 py-4 md:px-8 md:py-5">
              <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-success" strokeWidth={1.6} />
              <p className="text-sm md:text-base font-medium leading-relaxed text-foreground">Live on the App Store. Free, 5 MB.</p>
            </div>
          </div>
        </ModuleCard>
      </div>
      <div className="flex flex-col gap-6">
        <SubHead>Don’t Review the Work. Design the Review.</SubHead>
        <CardGrid items={workflow} colsClass="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" />
      </div>
      <div className="flex flex-col gap-6">
        <SubHead>Testing the AI Meant Trying to Make It Lie</SubHead>
        <CardGrid items={askTests} colsClass="grid-cols-1 sm:grid-cols-3" />
      </div>
    </div>
  );
}

/* ── 9) What the Ocean Taught Me — takeaways + closing CTA ──────────────── */
const takeaways: GridItem[] = [
  { num: "01", title: "A Metaphor Is a Decision Machine", desc: "It answered questions about gestures, copy, and motion. Or it is decoration.", icon: Compass, accent: "violet" },
  { num: "02", title: "Spaces Beat Compromises", desc: "Felt and legible were never resolved on one screen.", icon: Ban, accent: "emerald" },
  { num: "03", title: "The Best Features Are Refusals", desc: "Restraint does not demo well. It ships well.", icon: Zap, accent: "slate" },
];
export function OryneTakeaways() {
  return (
    <div className="flex flex-col gap-10 md:gap-12">
      <CardGrid items={takeaways} colsClass="grid-cols-1 sm:grid-cols-3" />
      <div className="flex justify-center">
        <AppStoreLink label="Get Oryne on the App Store" />
      </div>
    </div>
  );
}
