import { useEffect, useRef, type ReactNode } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { noOrphan } from "@/lib/noOrphan";
import {
  ArrowUpRight,
  ArrowRight,
  Waves,
  Layers,
  Zap,
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
  BookOpen,
  FileSearch,
  CheckCircle2,
  Check,
  Minus,
  CircleDashed,
  type LucideIcon,
} from "lucide-react";
import { FigureCaption } from "./FigureCaption";
import { NotionMark } from "./motiBrandMarks";
import { PinterestMark, MilanoteMark, AppleMark, MymindMark } from "./oryneBrandMarks";
import oryneMark from "@/assets/mark-oryne.png";
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
import oryneClipLibrary from "@/assets/oryne-clip-library.mp4";
import oryneClipLibraryPoster from "@/assets/oryne-clip-library-poster.webp";
import oryneClipResurfacing from "@/assets/oryne-clip-resurfacing.mp4";
import oryneClipResurfacingPoster from "@/assets/oryne-clip-resurfacing-poster.webp";
import oryneClipBranch from "@/assets/oryne-clip-branch.mp4";
import oryneClipBranchPoster from "@/assets/oryne-clip-branch-poster.webp";
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

/* ── 2) Highlights — chips + pull-quote (the film sits above, as a figure) ─── */
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

/* ── 3b) Competitive — the three capabilities, and who has which ─────────── */
// This is MALIK'S analysis, not one assembled for the case study. It comes from
// section 10 of the original Oryne vision document, created 2026-02-24 and last
// edited 2026-05-22 (dates from Malik; the file's location is still unrecorded,
// ask him for the path). Those dates are why this section can sit before The
// Idea honestly: the doc was written three and a half months before the first
// commit (2026-06-09) and finished two days before the Claude Design wireframes
// (2026-05-24). It predates the build:
// its five entries are his (Pinterest / Shuffles, Milanote, mymind, Apple
// Freeform, Evernote / Notion / Keep) and so is the conclusion, written there as
// "few tools combine fast capture + spatial visualization + unexpected discovery
// in a mobile-first experience". Those three become the three columns, so the
// matrix argues his point rather than a new one. Do not swap the set for a
// tidier one.
//
// Cells are short Title Case labels, not sentences: the matrix is for scanning,
// and the argument lives in the close. Every word is capitalised by request.
// The per-cell detail was checked against each product's own current material on
// 2026-09-10: mymind.com (Serendipity "resurfaces forgotten things in your mind
// so you can keep or forget them"), milanote.com (boards per project), Apple's
// Freeform announcement (infinite canvas, iCloud, built for collaboration).
// Pinterest's row is deliberately a claim about Pinterest's model only: the
// Shuffles domain would not load, so nothing here asserts its current state.
//
// The finding that makes the module worth its space: every one of them holds at
// most two of the three. mymind is the nearest, and it genuinely resurfaces.
// Never quietly drop it to widen the gap.
type Held = "yes" | "part" | "no";
type Cell = { held: Held; note: string };
type Rival = { name: string; mark: ReactNode; mine?: boolean; capture: Cell; field: Cell; discovery: Cell };
const RIVAL_COLS = "grid-cols-1 md:grid-cols-[minmax(0,1fr)_repeat(3,minmax(0,1.05fr))]";
const MARK = "h-4 w-4 shrink-0";
// One product per row. The vision document grouped three of them
// ("Pinterest / Shuffles", "Evernote / Notion / Keep"); each group is reduced to
// its most representative member, because a slash-joined row cannot be answered
// yes or no in three columns, and "Keep" on its own is ambiguous enough to read
// as the fitness app rather than Google's note app.
const rivals: Rival[] = [
  {
    name: "Pinterest",
    mark: <PinterestMark className={MARK} />,
    capture: { held: "yes", note: "One tap" },
    field: { held: "no", note: "An endless grid" },
    discovery: { held: "part", note: "Other people\u2019s ideas" },
  },
  {
    name: "Milanote",
    mark: <MilanoteMark className={MARK} />,
    capture: { held: "yes", note: "Mobile quick note" },
    field: { held: "yes", note: "Boards you arrange" },
    discovery: { held: "no", note: "Only what you open" },
  },
  {
    name: "mymind",
    mark: <MymindMark className={MARK} />,
    capture: { held: "yes", note: "One click" },
    field: { held: "no", note: "A visual grid" },
    discovery: { held: "yes", note: "Serendipity" },
  },
  {
    name: "Freeform",
    mark: <AppleMark className={MARK} />,
    capture: { held: "no", note: "Place it yourself" },
    field: { held: "yes", note: "An infinite canvas" },
    discovery: { held: "no", note: "Only what you placed" },
  },
  {
    name: "Notion",
    mark: <NotionMark className={MARK} />,
    capture: { held: "part", note: "Quick add, then file" },
    field: { held: "no", note: "Pages and databases" },
    discovery: { held: "no", note: "A search box" },
  },
  {
    name: "Oryne",
    mine: true,
    mark: <img src={oryneMark} alt="" aria-hidden="true" className={`${MARK} rounded-sm`} />,
    capture: { held: "yes", note: "Two seconds, by voice" },
    field: { held: "yes", note: "Currents that drift" },
    discovery: { held: "yes", note: "A thought a day" },
  },
];
function HeldCell({ cell, first }: { cell: Cell; first?: boolean }) {
  const Icon = cell.held === "yes" ? Check : cell.held === "part" ? CircleDashed : Minus;
  const tone = cell.held === "yes" ? "text-success" : "text-foreground-tertiary";
  return (
    <div className={`mt-3 flex items-start gap-2.5 md:mt-0 md:pl-6 ${first ? "" : TERM_COL_RULE}`}>
      <Icon aria-hidden="true" className={`mt-0.5 h-4 w-4 shrink-0 ${tone}`} strokeWidth={1.6} />
      <p className={`text-caption md:text-sm font-normal leading-relaxed ${cell.held === "no" ? "text-foreground-tertiary" : "text-foreground-lead"}`}>
        {cell.note}
      </p>
    </div>
  );
}
export function OryneCompetitive() {
  return (
    <ModuleCard>
      <div className={`hidden md:grid ${RIVAL_COLS} px-8 py-4 border-b border-case-study-module-divider`}>
        <p className="text-label uppercase tracking-eyebrow text-foreground-tertiary font-mono">Tool</p>
        {["Fast capture", "A canvas", "Resurfacing"].map((c) => (
          <p key={c} className={`text-label uppercase tracking-eyebrow text-foreground-tertiary font-mono pl-6 ${TERM_COL_RULE}`}>{c}</p>
        ))}
      </div>
      <div className="divide-y divide-case-study-module-divider">
        {rivals.map((r) => (
          <div key={r.name} className={`grid ${RIVAL_COLS} px-6 py-5 md:px-8 md:py-6 ${r.mine ? "bg-case-study-module-divider" : ""}`}>
            <div className={`flex items-center gap-2.5 md:pr-6 ${r.mine ? "text-foreground" : "text-foreground-lead"}`}>
              {r.mark}
              <p className={`text-sm md:text-base ${r.mine ? "font-medium" : "font-normal"}`}>{r.name}</p>
            </div>
            <HeldCell cell={r.capture} first />
            <HeldCell cell={r.field} />
            <HeldCell cell={r.discovery} />
          </div>
        ))}
      </div>
    </ModuleCard>
  );
}

// Column rule shared by the two-column tables further down the file.
const TERM_COL_RULE = "md:border-l md:border-case-study-module-divider";

/* ── 5) The Idea — the four moments first, then the words for them ──────── */
// The four moments are the section's spine, so they lead and everything else
// hangs off them. Capture is one of them because "under two seconds, from
// anywhere" is the promise the rest of the product is built to protect; it is
// the door rather than a room, and its card says so. The principles two
// sections later are tagged by the same four.
const moments: GridItem[] = [
  { num: "01", title: "Capture, for Catching", desc: "Two seconds, before you judge it. Not a room, the door.", icon: Zap, accent: "violet" },
  { num: "02", title: "The Ocean, for Encountering", desc: "Enter with no goal. Drifting past things is the point.", icon: Waves, accent: "emerald" },
  { num: "03", title: "The Library, for Finding", desc: "A waterfall of cards you can scan. Finding is a job.", icon: LayoutGrid, accent: "slate" },
  { num: "04", title: "The Thought, for Working", desc: "One fragment, your full attention. Edit it or grow a branch.", icon: BookOpen, accent: "violet" },
];
// The vocabulary as a specimen board: each cell leads with the string the app
// itself shows, so the metaphor is seen doing work rather than claimed, and the
// term and its meaning sit around it as the label. Six words, one cell each.
type VocabularyTerm = { term: string; meaning: string; inApp: string };
const vocabulary: VocabularyTerm[] = [
  { term: "Thought", meaning: "One captured fragment, named and themed on the device.", inApp: "“Release into the Ocean”" },
  { term: "Whisper", meaning: "A thought caught by voice. Words appear while you speak.", inApp: "“Catch a whisper”" },
  { term: "Current", meaning: "Related thoughts drift together. Nothing is filed.", inApp: "“8 thoughts drift here”" },
  { term: "Resurfacing", meaning: "One forgotten thought rises per day.", inApp: "“Catching a thought that drifted away”" },
  { term: "Ask the Ocean", meaning: "A question answered only from your own thoughts.", inApp: "“Responses come from what you’ve captured.”" },
  { term: "Grow a Branch", meaning: "A new thought grows out of this one, as a question, a concept, research, or a project.", inApp: "“Grow a branch”" },
];
// Same hairline grid as OryneClips: the divider colour shows through the 1px
// gaps, and each cell paints the card surface back over it.
function VocabularyGrid() {
  return (
    <ModuleCard>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-px bg-case-study-module-divider">
        {vocabulary.map((t) => (
          <div key={t.term} className="bg-surface-inset px-4 py-5 md:px-8 md:py-6">
            <p className="text-label uppercase tracking-eyebrow text-foreground-tertiary font-mono">{t.term}</p>
            <p className="mt-2 text-sm md:text-base font-medium text-foreground">{noOrphan(t.inApp)}</p>
            <p className="mt-2 text-sm md:text-base font-light leading-relaxed text-foreground-secondary">{noOrphan(t.meaning)}</p>
          </div>
        ))}
      </div>
    </ModuleCard>
  );
}
// Three moments a still cannot carry: each one is a gesture and its answer, so
// a screenshot can only ever show you one end of it. Recorded off the shipped
// build on a simulator, 4 seconds each, silent.
//
// Composited into the same iPhone 17 Pro silver mockup every screenshot in this
// case study wears (product-film's assets/iphone-17-pro-silver.png). The
// geometry is derived from the existing stills so the clips sit at exactly the
// same size: still canvas 900x1839 with the device silhouette at (48,93)
// to (852,1745), which is the 1120x2289 frame PNG at 0.7336. The frame's screen
// cutout measured 60,57,1000x2174 with a ~165px corner radius, and the video is
// laid in behind the frame so the bezel provides the rounded corners rather than
// a second guess at the radius. MP4 carries no alpha, so the plate is baked to
// the rendered value of surface-inset, sampled off the page at 12,12,13 in RGB:
// the figure it sits on is that colour, so the clip reads as cut out. Change the
// figure's background and the clips have to be re-rendered. (Written in words
// rather than as a hex literal on purpose; the boundary test rejects colour
// literals anywhere in these files, comments included.)
//
// They play once when they reach the viewport and replay on hover. Under
// prefers-reduced-motion neither happens: the poster stands until the reader
// asks for it, which is the same bargain the rest of the site makes.
type Clip = { src: string; poster: string; moment: string; caption: string };
const clips: Clip[] = [
  {
    src: oryneClipResurfacing,
    poster: oryneClipResurfacingPoster,
    moment: "The Ocean",
    caption: "a forgotten thought rises on its own",
  },
  {
    src: oryneClipLibrary,
    poster: oryneClipLibraryPoster,
    moment: "The Library",
    caption: "long press, and the waterfall reorders by kinship",
  },
  {
    src: oryneClipBranch,
    poster: oryneClipBranchPoster,
    moment: "The Thought",
    caption: "a new thought grows out of this one",
  },
];
function FeatureClip({ clip }: { clip: Clip }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(frameRef, { once: true, amount: 0.5 });
  // Buffer a viewport early so the clip plays on arrival instead of stalling
  // on its poster while the first bytes land.
  const near = useInView(frameRef, { once: true, margin: "100% 0px 100% 0px" });

  useEffect(() => {
    if (!inView || reduced) return;
    videoRef.current?.play().catch(() => {});
  }, [inView, reduced]);

  const replay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => {});
  };

  return (
    <div className="flex flex-col bg-surface-inset px-6 py-7 md:px-8 md:py-8">
      {/* The caption sits inside the media column, not the cell: a centred
          caption wider than the phone above it reads as a stray paragraph.
          All three clips are the same height, so the three captions start on
          the same line without an mt-auto push. */}
      <figure className={`${SCREEN_FIGURE_WIDTH} flex flex-col`}>
      <div
        ref={frameRef}
        onMouseEnter={replay}
        onFocus={replay}
        tabIndex={0}
        className="rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      >
        <video
          ref={videoRef}
          src={clip.src}
          poster={clip.poster}
          preload={near ? "auto" : "none"}
          muted
          playsInline
          controls={reduced ?? false}
          className="w-full h-auto block"
        />
      </div>
        <FigureCaption label={clip.moment}>{clip.caption}</FigureCaption>
      </figure>
    </div>
  );
}
function OryneClips() {
  return (
    <ModuleCard header="A Thought Comes Back, Gathers, and Grows">
      <div className="grid grid-cols-1 gap-px bg-case-study-module-divider lg:grid-cols-3">
        {clips.map((clip) => (
          <FeatureClip key={clip.moment} clip={clip} />
        ))}
      </div>
    </ModuleCard>
  );
}
export function OryneIdea() {
  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <CardGrid
        items={moments}
        header="Felt vs Legible: Four Places, Not One Compromise"
        colsClass="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      />
      <OryneClips />
      <VocabularyGrid />
    </div>
  );
}

/* ── 6) Principles — the philosophy file, one test per principle ────────── */
// PHILOSOPHY.md landed in the app repository on 2026-06-11, two days after the
// first commit, and every principle in it ends with a test. Only the test is
// shown, quoted nearly verbatim, because the test is the part reviews cite and
// the part a reader can judge at a glance. Eight cards, four across, each
// tagged with the moment it protects; the last three are tagged Everywhere,
// because three of eight belonging to no single moment is itself worth seeing.
type Principle = { name: string; moment: string; test: string; icon: LucideIcon };
const principles: Principle[] = [
  { name: "Capture", moment: "Capture", test: "Would this make someone hesitate before capturing?", icon: Zap },
  { name: "Motion", moment: "The Ocean", test: "If every animation froze, would the app lose any meaning?", icon: Waves },
  { name: "Memory", moment: "The Ocean", test: "Does this make old thoughts return, or make the user go get them?", icon: Sun },
  { name: "Retrieval", moment: "The Library", test: "Can someone who never learned the field's layout reach every thought?", icon: LayoutGrid },
  { name: "Ownership", moment: "The Thought", test: "Can the system ever silently replace something the user wrote?", icon: PenLine },
  { name: "AI Behavior", moment: "Everywhere", test: "If the network died mid-session, would the user be told anything untrue, by words or by omission?", icon: Compass },
  { name: "Trust", moment: "Everywhere", test: "Does the UI ever say done before the system knows it is done?", icon: ShieldCheck },
  { name: "Calm", moment: "Everywhere", test: "Would this make Oryne feel like a tool that needs tending?", icon: Anchor },
];
export function OrynePrinciples() {
  return (
    <ModuleCard>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-case-study-module-divider">
        {principles.map((p) => {
          const Icon = p.icon;
          return (
            <div key={p.name} className="flex flex-col gap-4 md:gap-5 bg-surface-inset px-4 py-5 md:px-7 md:py-8">
              <div className="flex items-center justify-between">
                <span className="text-label uppercase tracking-eyebrow font-mono text-foreground-tertiary">{p.moment}</span>
                <Icon aria-hidden="true" className="w-4 h-4 text-accent-violet" strokeWidth={1.4} />
              </div>
              <div className="flex flex-col gap-2.5">
                <p className="text-base md:text-xl font-medium text-foreground leading-normal md:leading-snug tracking-tight">{p.name}</p>
                <p className="text-sm md:text-base font-light leading-relaxed text-foreground-secondary [overflow-wrap:anywhere]">{noOrphan(p.test)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </ModuleCard>
  );
}

/* ── 7a) Iterations — the versions before the shipped one ───────────────── */
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
    title: "Version 1: The First Build",
    when: "SwiftUI, from June 9",
    lead: "By the end of day one the four tabs existed. The Ocean was a handful of gray orbs on a dark field, the Library a list, Whisper a mic and a timer, and Ask a chat with four lenses. Fast Capture and the widgets followed on day two.",
    kept: "The skeleton shipped as it was: the four tabs, Thought and Whisper capture, Grow a Branch, Ask answering only from the water.",
    changed: "Orbs became glass bodies that drift in currents and light up their relatives on a long press. The Library became a waterfall you can sort by meaning. Ask kept its lenses and gained a floor under which it admits it has nothing.",
  },
];
type Pair = { title: string; before: ArtifactItem; after: ArtifactItem };
// Only the screens that visibly changed. The Version 1 screens come from the
// initial commit of ~/Documents/inspire-ocean (2026-06-09), built for the
// simulator on 2026-09-08 (see the memory note). Ask, Capture, Thought, Branch,
// and Whisper were compared too and shipped nearly as built, so they are not
// shown as pairs; Whisper's real change, live words, has no screenshot yet.
const pairs: Pair[] = [
  {
    title: "Ocean",
    before: { src: oryneFirstOcean, alt: "Version 1’s Ocean: ten gray orbs with icons scattered on a dark field", label: "Version 1", caption: "gray orbs scattered on a dark field, and no currents yet" },
    after: { src: oryneOcean, alt: "The shipped Ocean: glass orbs drifting in currents, one lit by a long press", label: "Shipped", caption: "glass bodies in currents, relatives lit on a long press" },
  },
  {
    title: "Library",
    before: { src: oryneFirstLibrary, alt: "Version 1’s Library: a single-column list grouped by week", label: "Version 1", caption: "a list, newest first, one thought per row" },
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
// The two notes under a stage. The icon carries the verdict so the eye can
// sort survived from changed before reading: a check for what shipped as it
// was, and the same arrow that stands between Version 1 and Shipped below.
function StageNote({ icon: Icon, tone, label, children }: { icon: LucideIcon; tone: string; label: string; children: string }) {
  return (
    <div className="bg-surface-inset px-6 py-6 md:px-8 md:py-7">
      <div className="flex items-center gap-2">
        <Icon aria-hidden="true" className={`h-3.5 w-3.5 shrink-0 ${tone}`} strokeWidth={1.6} />
        <p className="text-label uppercase tracking-eyebrow text-foreground-secondary font-mono">{label}</p>
      </div>
      <p className="mt-3 text-sm md:text-base font-light leading-relaxed text-foreground-secondary">{noOrphan(children)}</p>
    </div>
  );
}
// A stage card reads like a CardGrid cell scaled up: a rail with the numeral
// on the left and the tool-and-date on the right, then a sans title, then the
// lead. The mono uppercase header style stays reserved for ModuleCard headers,
// so a stage title and a module title no longer compete in the same voice.
function StageCard({ stage }: { stage: Stage }) {
  return (
    <ModuleCard>
      <div className="px-6 pt-7 pb-6 md:px-8 md:pt-8 md:pb-7 border-b border-case-study-module-divider">
        <div className="flex items-center justify-between gap-4">
          <span className="text-caption font-mono tabular-nums text-accent-violet/70">{stage.num}</span>
          <p className="text-label uppercase tracking-eyebrow text-foreground-tertiary font-mono text-right">{stage.when}</p>
        </div>
        <p className="mt-4 text-xl md:text-title font-medium text-foreground">{noOrphan(stage.title)}</p>
        <p className="mt-3 text-sm md:text-base font-light leading-relaxed text-foreground-secondary max-w-measure">{noOrphan(stage.lead)}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-case-study-module-divider">
        <StageNote icon={Check} tone="text-success" label="What survived">{stage.kept}</StageNote>
        <StageNote icon={ArrowRight} tone="text-accent-violet/70" label="What changed">{stage.changed}</StageNote>
      </div>
    </ModuleCard>
  );
}
function WideFigure({ item }: { item: ArtifactItem }) {
  return (
    <figure className="bg-surface-inset px-6 py-7 md:px-8 md:py-8">
      <div className="overflow-hidden rounded-2xl bg-secondary/10">
        <img src={item.src} alt={item.alt} loading="lazy" decoding="async" className="w-full h-auto block" />
      </div>
      <FigureCaption label={item.label}>{item.caption}</FigureCaption>
    </figure>
  );
}
// One side of a Version 1 / Shipped pair. The figure is display: contents so
// the phone and the caption become items of the pair's own grid: phones on
// row one, captions on row two, and the arrow between them centred on the
// phones alone rather than on phone-plus-caption. Both screens are the same
// 900x1839 frame, so the captions start on the same line without a push.
function PairScreen({ item, col }: { item: ArtifactItem; col: string }) {
  return (
    <figure className="contents">
      <div className={`${SCREEN_FIGURE_WIDTH} ${col} sm:row-start-1 overflow-hidden rounded-2xl bg-secondary/10`}>
        <img src={item.src} alt={item.alt} loading="lazy" decoding="async" className="w-full h-auto block" />
      </div>
      <div className={`${SCREEN_FIGURE_WIDTH} ${col} sm:row-start-2`}>
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
      <ModuleCard header="Version 1 Against Shipped">
        <div className="divide-y divide-case-study-module-divider">
          {pairs.map((pair) => (
            <div key={pair.title} className="bg-surface-inset px-6 py-7 md:px-8 md:py-8">
              <p className="text-base md:text-xl font-medium text-foreground">{pair.title}</p>
              {/* Version 1, an arrow, Shipped. Across on two columns; down the
                  page on one, where the arrow turns to point at the next phone,
                  the same move Moti's principle rows make. */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:gap-x-4">
                <PairScreen item={pair.before} col="sm:col-start-1" />
                <div className="flex items-center justify-center py-5 sm:py-0 sm:col-start-2 sm:row-start-1 sm:px-2">
                  {/* A hairline disc keeps the arrow legible against two bright
                      phone frames; a bare 16px glyph at 70% vanished between them. */}
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-hairline bg-secondary/10">
                    <ArrowRight aria-hidden="true" className="h-5 w-5 rotate-90 sm:rotate-0 text-accent-violet" strokeWidth={1.75} />
                  </span>
                </div>
                <PairScreen item={pair.after} col="sm:col-start-3" />
              </div>
            </div>
          ))}
        </div>
      </ModuleCard>
    </div>
  );
}

/* ── 7b) Iterations, continued — the releases and the review ────────────── */
// This used to be its own "Shipping It" section. It renders inside Iterations
// now, because the releases are the iteration continuing past 1.0: each row is
// what that version changed, not a feature list. The "try to make the AI lie"
// tests used to sit here as a third grid; they are the Research section now,
// with the measurements behind them. Every date and version is the App Store
// version history; do not add a "why" to a row that the history does not say.
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
          <p className={`text-label uppercase tracking-eyebrow text-foreground-tertiary font-mono pl-4 ${TERM_COL_RULE}`}>What changed</p>
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

/* ── 8) Final Design — one thought, start to finish, in four acts ───────── */
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
      { num: "09", title: "Fast Capture", src: oryneFastCaptureOverlay, alt: "The Fast Capture overlay floating over the Ocean tab", label: "Fast Capture", caption: "from the Action Button, Control Center, or a widget, over anything" },
      { num: "10", title: "Widgets", src: oryneWidgetsHome, alt: "Home screen with the Oryne Fast Capture widget and a resurfacing widget", label: "Widgets", caption: "a Thought or Whisper button one tap from the home screen" },
      { num: "11", title: "Grow a Branch", src: oryneBranch, alt: "The Grow a branch sheet with Question, Concept, Research, and Project types", label: "Branch", caption: "a new thought grows out of this one, in one of four kinds" },
      { num: "12", title: "Show Related", src: oryneShowRelated, alt: "The Library after a long press: the chosen thought’s closest companions rise to the top", label: "Show related", caption: "long press, and its closest companions rise to the top" },
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
      {/* Every step is the same 900x1839 frame, so the phones already share a
          bottom edge. Do not pin the caption to the cell bottom with mt-auto:
          a two-line caption would drop one line below its three-line
          neighbour and the gap above it would go uneven. Left to start right
          under the phone, the captions begin on the same line and the spare
          height falls into the cell's bottom padding, where nobody sees it. */}
      <figure className={`${SCREEN_FIGURE_WIDTH} mt-5 flex flex-col`}>
        <div className="overflow-hidden rounded-2xl bg-secondary/10">
          <img src={step.src} alt={step.alt} loading="lazy" decoding="async" className="w-full h-auto block" />
        </div>
        <FigureCaption label={step.label}>{step.caption}</FigureCaption>
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

/* ── 9) Privacy — on the device, as a design position ───────────────────── */
const privacyItems: GridItem[] = [
  { num: "01", title: "On-Device Intelligence", desc: "Apple’s Foundation Models name, theme, relate, and answer.", icon: Cpu, accent: "violet" },
  { num: "02", title: "Local Speech", desc: "Live transcription on the phone, in both languages.", icon: AudioLines, accent: "emerald" },
  { num: "03", title: "Your Own iCloud", desc: "Private CloudKit sync. No server I can read.", icon: Cloud, accent: "slate" },
];
export function OrynePrivacy() {
  return <CardGrid items={privacyItems} colsClass="grid-cols-1 sm:grid-cols-3" />;
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