import type { ReactNode } from "react";
import { noOrphan } from "@/lib/noOrphan";
import {
  ArrowUpRight,
  Waves,
  Layers,
  Zap,
  Mic,
  Hand,
  MousePointerClick,
  Move,
  Sun,
  GitBranch,
  Anchor,
  Ban,
  Smartphone,
  LayoutGrid,
  SlidersHorizontal,
  Share2,
  Bot,
  Cpu,
  AudioLines,
  Cloud,
  PenLine,
  ShieldCheck,
  Lock,
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
import { ArtifactGallery, CardGrid, Chips, ModuleCard, MotiFigure, PullQuote, SubHead, type GridItem } from "./MotiModules";
import oryneOcean from "@/assets/oryne-ocean.webp";
import oryneCurrent from "@/assets/oryne-current.webp";
import oryneResurface from "@/assets/oryne-resurface.webp";
import oryneAskAnswer from "@/assets/oryne-ask-answer.webp";
import oryneThought from "@/assets/oryne-thought.webp";
import oryneLibrary from "@/assets/oryne-library.webp";
import oryneAsk from "@/assets/oryne-ask.webp";
import oryneBranch from "@/assets/oryne-branch.webp";
import oryneCaptureTyped from "@/assets/oryne-capture-typed.webp";
import oryneWhisperListening from "@/assets/oryne-whisper-listening.webp";
import oryneFastCaptureOverlay from "@/assets/oryne-fast-capture-overlay.webp";
import oryneWidgetsHome from "@/assets/oryne-widgets-home.webp";
import oryneOceanJune from "@/assets/oryne-ocean-june.webp";

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

// A decision block: the tension, what was rejected, what shipped, and the rule
// that came out of it. Mirrors Moti's VersionBlock rhythm without its version tag.
type DecisionPoint = { label: string; text: string };
function DecisionBlock({
  num,
  title,
  points,
  rule,
  children,
}: {
  num: string;
  title: string;
  points: DecisionPoint[];
  rule?: string;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-2xl overflow-hidden border border-case-study-module-border bg-surface-inset">
      <div className="flex items-baseline gap-4 px-6 py-6 md:px-8 md:py-7 border-b border-case-study-module-divider">
        <span className="text-xs font-mono tabular-nums text-accent-violet/70">{num}</span>
        <p className="text-xl font-medium text-foreground leading-snug">{noOrphan(title)}</p>
      </div>
      <div className="flex flex-col gap-6 px-6 py-6 md:px-8 md:py-7">
        <div className="flex flex-col gap-5">
          {points.map((p) => (
            <div key={p.label}>
              <p className="text-label uppercase tracking-eyebrow text-foreground/55 font-mono mb-1.5">{p.label}</p>
              <p className="text-sm md:text-base font-light leading-relaxed text-foreground/72">{noOrphan(p.text)}</p>
            </div>
          ))}
        </div>
        {children}
        {rule ? <PullQuote>{rule}</PullQuote> : null}
      </div>
    </div>
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

/* ── 2) Highlights — chips, pull-quote, artifact gallery ────────────────── */
const hookHighlights = [
  "Live on the App Store",
  "First commit to 1.0 in 23 days",
  "Six releases in the first 15 days",
  "Built solo with Claude Code",
  "Intelligence runs on the device",
  "English and Simplified Chinese",
];
const hookArtifacts = [
  { src: oryneOcean, alt: "The Ocean tab: thoughts gathered into currents, one lit by a long press", label: "The Ocean", caption: "thoughts drift, gather into currents, and light up their relatives on a long press" },
  { src: oryneCaptureTyped, alt: "Capture tab with a typed thought and the Release into the Ocean button", label: "Capture", caption: "type or speak, then release into the Ocean, with no title, folder, or category" },
  { src: oryneLibrary, alt: "Library tab: a masonry waterfall of thought cards with images and text", label: "The Library", caption: "a waterfall of cards for when you know roughly what you are looking for" },
  { src: oryneAskAnswer, alt: "Ask the Ocean answering a question from the user’s own captured thoughts", label: "Ask the Ocean", caption: "an answer composed only from what you captured, never from open sea" },
];
export function OryneHook() {
  return (
    <div className="flex flex-col gap-10 md:gap-12">
      <Chips items={hookHighlights} />
      <PullQuote>Lists are excellent at storing thoughts. They were never meant to remember them.</PullQuote>
      <ArtifactGallery items={hookArtifacts} />
    </div>
  );
}

/* ── 3) The Problem — three pillars ─────────────────────────────────────── */
const problemPillars: GridItem[] = [
  { num: "01", title: "The List Buries", desc: "Every notes app keeps its promise the same way: neatly, chronologically, in a list you never scroll back through.", icon: Layers, accent: "violet" },
  { num: "02", title: "Memory Is Not a Timeline", desc: "A thought from three months ago surfaces because something today rhymes with it, not because you scrolled to March.", icon: Waves, accent: "emerald" },
  { num: "03", title: "The Moment Is Too Short", desc: "Ideas arrive walking, on the bus, half-asleep. Unlock, open, find the right note, and the thought is already gone.", icon: Zap, accent: "slate" },
];
export function OryneProblem() {
  return <CardGrid items={problemPillars} colsClass="grid-cols-1 sm:grid-cols-3" />;
}

/* ── 4) The Metaphor — vocabulary that does work ────────────────────────── */
const vocabulary: Term[] = [
  { term: "Whisper", meaning: "A thought caught by voice. Words appear while you speak; a pause keeps what was already heard.", inApp: "“Catch a whisper”", icon: Mic },
  { term: "Thought", meaning: "One captured fragment. On-device intelligence gives it a title and finds the themes inside it.", inApp: "“Release into the Ocean”", icon: Sparkles },
  { term: "Current", meaning: "Related thoughts drift together. Nothing is filed; a thought flows into a current on its own.", inApp: "“8 thoughts drift here”", icon: Waves },
  { term: "Resurfacing", meaning: "One forgotten thought rises per day, more likely when it echoes what you are exploring now.", inApp: "“Catching a thought that drifted away”", icon: Sun },
  { term: "Ask the Ocean", meaning: "A question answered from your own thoughts, with the sources shown as chips that open the real thing.", inApp: "“Responses come from what you’ve captured.”", icon: Compass },
];
export function OryneVocabulary() {
  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <TermList items={vocabulary} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
        <MotiFigure
          src={oryneCurrent}
          alt="A current opened from the Ocean: its name, how many thoughts drift there, related currents, and the thoughts inside"
          label="A current, opened"
          caption="eight thoughts drift here, and nobody filed them"
          narrow
        />
        <MotiFigure
          src={oryneResurface}
          alt="A resurfaced thought from last month opened over the Ocean, with its themes and nearby thoughts"
          label="Resurfacing"
          caption="a thought from last month drifts back with the thoughts that sat near it"
          narrow
        />
      </div>
    </div>
  );
}

/* ── 5) Felt vs Legible — three spaces ──────────────────────────────────── */
const spaces: GridItem[] = [
  { num: "01", title: "The Ocean Is for Encountering", desc: "The space you enter without a goal. Drift and serendipity are the point, and it deliberately shows a curated fraction of the water.", icon: Waves, accent: "violet" },
  { num: "02", title: "The Library Is for Finding", desc: "A scannable waterfall of cards with search, time order, and a Related arrangement. Finding is a job, and grids are good at it.", icon: LayoutGrid, accent: "emerald" },
  { num: "03", title: "The Thought Is for Working", desc: "One fragment, full attention: edit it, hear the original audio, follow its neighbors, or grow a branch from it.", icon: BookOpen, accent: "slate" },
];
export function OryneSpaces() {
  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <CardGrid items={spaces} colsClass="grid-cols-1 sm:grid-cols-3" />
      <ArtifactGallery
        items={[
          { src: oryneOceanJune, alt: "An early Ocean build: a grid of gray orbs labelled by theme", label: "June build", caption: "legible and dead, a grid of orbs wearing the metaphor as a skin" },
          { src: oryneOcean, alt: "The shipped Ocean: currents spaced along a drifting spine, one lit by kinship", label: "Shipped Ocean", caption: "currents breathe along a drifting spine, and the Library does the finding" },
        ]}
      />
    </div>
  );
}

/* ── 6) Three Decisions ─────────────────────────────────────────────────── */
const gestureBudget: GridItem[] = [
  { num: "01", title: "Pan", desc: "Moves the camera through the water.", icon: Move, accent: "slate" },
  { num: "02", title: "Tap", desc: "Opens a current or a thought.", icon: MousePointerClick, accent: "emerald" },
  { num: "03", title: "Long Press", desc: "Kinship: hold a thought and its relatives light up while everything else recedes.", icon: Hand, accent: "violet" },
  { num: "04", title: "Everything Else", desc: "Refused. Capture, merge, split, and add all live on other surfaces.", icon: Ban, accent: "slate" },
];
export function OryneDecisions() {
  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <DecisionBlock
        num="01"
        title="The Ocean Is a Browsing Space, Not a Capture Space"
        points={[
          { label: "The Temptation", text: "Every feature generated the same first instinct: add a thought by tapping empty water, drag one orb onto another to merge, pinch a current to split it. Each demos beautifully. Together they would destroy the app." },
          { label: "Why Not", text: "The gesture budget was already spent, and gesture conflicts do not degrade gracefully. And gazing at the Ocean is a receptive mode; capture is a productive mode. Mixing them means neither state is ever clean." },
          { label: "What Shipped", text: "Capture has its own tab and its own fast entry points. Adding a thought into a specific current happens from inside that current’s stream, where you are already in a placement mindset." },
        ]}
        rule="No new gestures on the Ocean, ever."
      >
        <CardGrid items={gestureBudget} colsClass="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" />
      </DecisionBlock>

      <DecisionBlock
        num="02"
        title="Killing My Favorite Effect"
        points={[
          { label: "The First Design", text: "Kinship needed a visual language. The first version was a warm radial halo around each related orb, like lights under water." },
          { label: "Why It Was Wrong", text: "The halo was additive atmosphere. At full size it bled across neighboring orbs, so a signal that meant “these specific thoughts are related” read as “this region is warm.” It was also compositing large soft radials over dozens of moving bodies." },
          { label: "What Shipped", text: "Light on the edge instead of around it: a glass rim, orb-sized, the way glass catches a beam underwater. Tighter, cheaper, and more oceanic than the halo." },
        ]}
        rule="When an effect you love is fighting the information it carries, the effect loses."
      >
        <MotiFigure
          src={oryneOcean}
          alt="The shipped kinship treatment: a single lit rim on one orb in the Ocean"
          label="Shipped kinship"
          caption="one lit rim on the held current, no bloom on its neighbors"
          narrow
        />
      </DecisionBlock>

      <DecisionBlock
        num="03"
        title="Branching Is Not Anchoring"
        points={[
          { label: "Two Requests That Looked Like One", text: "Branching is genealogical: a new thought that grows out of an existing one. Anchoring is spatial: placing a new thought into a current. Same surface-level action, different mental models." },
          { label: "What Shipped", text: "Grow a branch lives in the expanded thought, typed as a Question, Concept, Research, or Project. Adding into a current lives in that current’s stream. Where you start the action is the answer to “related how?”, so the app never has to ask." },
        ]}
        rule="When one feature request keeps arriving with two intentions attached, it is two features."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
          <MotiFigure
            src={oryneBranch}
            alt="Grow a branch sheet with Question, Concept, Research, and Project branch types"
            label="Grow a branch"
            caption="from inside a thought, and the original is never overwritten"
            narrow
          />
          <MotiFigure
            src={oryneThought}
            alt="An expanded thought with Grow a branch and Ask Ocean actions at the bottom"
            label="A thought"
            caption="two ways out, grow a branch or ask the Ocean about it"
            narrow
          />
        </div>
      </DecisionBlock>
    </div>
  );
}

/* ── 7) Capture Before Consciousness — entry points ─────────────────────── */
const entryPoints: GridItem[] = [
  { num: "01", title: "Capture Tab", desc: "Thought or Whisper, a camera-style swipe apart.", icon: PenLine, accent: "violet" },
  { num: "02", title: "Action Button", desc: "One press starts a Whisper from the lock screen. Camera Control too.", icon: Zap, accent: "emerald" },
  { num: "03", title: "Home Screen Widgets", desc: "Fast Capture, plus the day’s resurfacing thought.", icon: Smartphone, accent: "slate" },
  { num: "04", title: "Control Center", desc: "A capture control next to the flashlight.", icon: SlidersHorizontal, accent: "violet" },
  { num: "05", title: "Share Sheet", desc: "Links and images from any app, read into the Ocean.", icon: Share2, accent: "emerald" },
  { num: "06", title: "Siri and Shortcuts", desc: "Capture by intent, no app in the foreground.", icon: Bot, accent: "slate" },
];
export function OryneCapture() {
  return (
    <div className="flex flex-col gap-10 md:gap-12">
      <CardGrid items={entryPoints} colsClass="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" />
      <ArtifactGallery
        items={[
          { src: oryneWhisperListening, alt: "Whisper capture listening, with a live waveform and a stop button", label: "Whisper", caption: "words appear as you speak, and the take is caught the moment recording stops" },
          { src: oryneFastCaptureOverlay, alt: "Fast Capture overlay floating over the Ocean tab", label: "Fast Capture", caption: "the overlay lands on whatever you were doing and leaves the moment it is released" },
          { src: oryneWidgetsHome, alt: "Home screen with the Oryne Fast Capture widget and a resurfacing widget", label: "Widgets", caption: "a Thought or Whisper button one tap from the home screen" },
          { src: oryneCaptureTyped, alt: "Typed capture ready to release", label: "Typed", caption: "one field, one button, and the title arrives after you let go" },
        ]}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-case-study-module-border bg-surface-inset px-6 py-7 md:px-8 md:py-8">
          <div className="flex items-center justify-between">
            <p className="text-base md:text-xl font-medium text-foreground">The Two-Second Rule</p>
            <Zap aria-hidden="true" className="w-4 h-4 text-accent-violet" strokeWidth={1.4} />
          </div>
          <p className="text-sm md:text-base font-light leading-relaxed text-foreground/72">
            {noOrphan("Capture must work in under two seconds from any entry point. A required field, a category picker, a confirmation step: each is a regression, whatever it adds. Review refines what was caught; it never gates whether it was caught.")}
          </p>
        </div>
        <div className="flex flex-col gap-4 rounded-2xl border border-case-study-module-border bg-surface-inset px-6 py-7 md:px-8 md:py-8">
          <div className="flex items-center justify-between">
            <p className="text-base md:text-xl font-medium text-foreground">Two Languages, Nothing to Set Up</p>
            <Languages aria-hidden="true" className="w-4 h-4 text-accent-emerald" strokeWidth={1.4} />
          </div>
          <p className="text-sm md:text-base font-light leading-relaxed text-foreground/72">
            {noOrphan("Speak English or 中文 and Oryne transcribes it live, on the device, following the iPhone’s language. I think in both, so the app had to as well.")}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── 8) Privacy as a Design Position ────────────────────────────────────── */
const privacyItems: GridItem[] = [
  { num: "01", title: "On-Device Intelligence", desc: "Apple’s Foundation Models name each thought, find its themes, relate it to its neighbors, and answer Ask. Nothing you capture is mined, profiled, or sold.", icon: Cpu, accent: "violet" },
  { num: "02", title: "Local Speech", desc: "Live transcription runs on the phone, in both languages. Audio stays as provenance so the words can be checked and re-heard.", icon: AudioLines, accent: "emerald" },
  { num: "03", title: "Your Own iCloud", desc: "Thoughts sync through private CloudKit, tied to your Apple Account. They reach your other devices without living on a server I can read.", icon: Cloud, accent: "slate" },
];
export function OrynePrivacy() {
  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <CardGrid items={privacyItems} colsClass="grid-cols-1 sm:grid-cols-3" />
      <div className="flex flex-col gap-4 rounded-2xl border border-case-study-module-border bg-surface-inset px-6 py-7 md:px-8 md:py-8">
        <div className="flex items-center justify-between">
          <p className="text-base md:text-xl font-medium text-foreground">Why This Is in the Design Story</p>
          <Lock aria-hidden="true" className="w-4 h-4 text-accent-violet" strokeWidth={1.4} />
        </div>
        <p className="text-sm md:text-base font-light leading-relaxed text-foreground/72">
          {noOrphan("What you are willing to capture depends on where you believe it goes. An inspiration tool only works if you will feed it your half-formed, embarrassing, 2 a.m. thoughts. The moment a user hesitates before capturing, the product is dead, whatever its features. On-device processing is the precondition for that honesty. It also meant designing classification and resurfacing around what a local model can actually do, and I would make the same trade again.")}
        </p>
      </div>
    </div>
  );
}

/* ── 9) Shipping It — releases, workflow, testing the AI ────────────────── */
const releases = [
  { date: "Jun 9", tag: "First commit", text: "Inspire Ocean, a codename. Fast Capture, widgets, Control Center, and the Ocean field over a semantic layer by the second day." },
  { date: "Jul 2", tag: "1.0", text: "On the App Store, 23 days in." },
  { date: "Jul 4", tag: "1.1", text: "The Ocean comes alive: thoughts gather into currents that breathe with their own energy. Kinship on long press." },
  { date: "Jul 6", tag: "1.2", text: "Export the Ocean as a shareable archive, readable Markdown plus a full backup. Your thoughts always have a clean way out." },
  { date: "Jul 8", tag: "1.3", text: "Masonry Library with a Related view; add a thought directly into an open current; starter examples you can clear." },
  { date: "Jul 16", tag: "1.4", text: "Chinese and English, transcribed live on the device, following the phone’s language." },
  { date: "Jul 17", tag: "1.5", text: "The waterfall Library: Recent and Related arrangements, and long press to raise a thought’s closest companions." },
];
const workflow: GridItem[] = [
  { num: "01", title: "Author", desc: "Writes the code with full project context, design intent, and momentum.", icon: PenLine, accent: "violet" },
  { num: "02", title: "Auditor", desc: "Reviews from an isolated subagent with fresh context: the diff and the requirements, cold. No persuasion channel from the author.", icon: FileSearch, accent: "emerald" },
  { num: "03", title: "The Ship Gate", desc: "Nothing irreversible happens without an explicit human command. Speed is the agent’s job; judgment stays mine.", icon: ShieldCheck, accent: "slate" },
  { num: "04", title: "Rules as Contracts", desc: "After an agent treated “report and wait” as advisory, the rule became countable: zero commits until the human replies. No adverbs.", icon: Scale, accent: "violet" },
];
const askTests: GridItem[] = [
  { num: "01", title: "A Relevance Floor", desc: "Below the threshold the honest answer is that you have not captured anything about that, and the product says so. A choice between looking smart and being trustworthy.", icon: Anchor, accent: "violet" },
  { num: "02", title: "Provenance in Words", desc: "An answer composed offline says so. Knowledge from beyond your notes is marked “Beyond your Ocean.” Grounded water and open sea never share one voice.", icon: FileText, accent: "emerald" },
  { num: "03", title: "Parity in Both Languages", desc: "The model was measurably weaker in Simplified Chinese on the same tasks. No English-only test plan would have found it.", icon: Languages, accent: "slate" },
];
export function OryneShipping() {
  return (
    <div className="flex flex-col gap-12 md:gap-16">
      <div className="flex flex-col gap-6">
        <SubHead>Six Releases in Fifteen Days</SubHead>
        <ModuleCard>
          <div className="divide-y divide-case-study-module-divider">
            {releases.map((r) => (
              <div key={r.date + r.tag} className="grid grid-cols-[4.5rem_minmax(0,1fr)] md:grid-cols-[6rem_6rem_minmax(0,1fr)] gap-x-4 gap-y-1 px-6 py-5 md:px-8 md:py-6">
                <p className="text-xs md:text-sm font-mono tabular-nums text-foreground/55">{r.date}</p>
                <p className="text-sm md:text-base font-medium text-foreground">{r.tag}</p>
                <p className="col-span-2 md:col-span-1 text-sm font-light leading-relaxed text-foreground/72">{noOrphan(r.text)}</p>
              </div>
            ))}
            <div className="flex items-start gap-3 px-6 py-5 md:px-8 md:py-6">
              <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-success" strokeWidth={1.6} />
              <p className="text-sm md:text-base font-medium leading-relaxed text-foreground">
                Live on the App Store. Free, 5 MB, iPhone, Mac, and Apple Vision.
              </p>
            </div>
          </div>
        </ModuleCard>
      </div>

      <div className="flex flex-col gap-6">
        <SubHead>Don’t Review the Work. Design the Review.</SubHead>
        <CardGrid items={workflow} colsClass="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" />
        <div className="rounded-2xl border border-case-study-module-border bg-surface-inset px-6 py-7 md:px-8 md:py-8">
          <p className="text-label uppercase tracking-eyebrow text-foreground/55 font-mono mb-3">What the Designer Was For</p>
          <p className="text-sm md:text-base font-light leading-relaxed text-foreground/72">
            {noOrphan("The auditor catches incorrectness. It does not catch wrongness: code that is technically fine and implements a worse product. The feel of the Ocean at full frame rate, the exact character of the kinship rim, the difference between an animation that is alive and one that is busy. That review only exists if someone with an opinion is looking, and the philosophy document those opinions live in outranks the code when they conflict.")}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <SubHead>Testing the AI Meant Trying to Make It Lie</SubHead>
        <CardGrid items={askTests} colsClass="grid-cols-1 sm:grid-cols-3" />
        <MotiFigure
          src={oryneAsk}
          alt="Ask the Ocean with its four modes and three suggested questions"
          label="Ask the Ocean"
          caption="four modes that genuinely diverge, and every answer names what it found"
          narrow
        />
      </div>
    </div>
  );
}

/* ── 10) What the Ocean Taught Me — takeaways + closing CTA ─────────────── */
const takeaways: GridItem[] = [
  { num: "01", title: "A Metaphor Is a Decision-Making Machine or It Is Decoration", desc: "The ocean earned its place by answering questions: about gestures, copy, motion, and what belongs where.", icon: Compass, accent: "violet" },
  { num: "02", title: "Spaces Beat Compromises", desc: "Felt versus legible never got resolved on one screen. It got resolved by letting different screens want different things.", icon: GitBranch, accent: "emerald" },
  { num: "03", title: "The Best Features Are Refusals", desc: "The Ocean surface works because of everything it declined to do. Restraint does not demo well. It ships well.", icon: Ban, accent: "slate" },
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
