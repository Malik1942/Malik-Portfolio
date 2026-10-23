import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
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
  FileSearch,
  CheckCircle2,
  Check,
  Minus,
  CircleDashed,
  Play,
  MessageCircleQuestion,
  Hand,
  Undo2,
  Map,
  DoorOpen,
  Type,
  Square,
  Lightbulb,
  Smartphone,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";
import { FigureCaption } from "./FigureCaption";
import { FigureTitle } from "./FigureTitle";
import { VideoLightbox, type LightboxVideo } from "@/components/VideoLightbox";
import { NotionMark } from "./motiBrandMarks";
import { PinterestMark, MilanoteMark, AppleMark, MymindMark } from "./oryneBrandMarks";
import oryneMark from "@/assets/mark-oryne.png";
import { CardGrid, Chips, ModuleCard, PullQuote, SCREEN_FIGURE_WIDTH, type ArtifactItem, type GridItem } from "./MotiModules";
import oryneTide from "@/assets/oryne-tide.webp";
import oryneCaptureTyped from "@/assets/oryne-capture-typed.webp";
import oryneWhisperHold from "@/assets/oryne-whisper-hold.webp";
import oryneToast from "@/assets/oryne-toast.webp";
import oryneThought from "@/assets/oryne-thought.webp";
import oryneNearby from "@/assets/oryne-nearby.webp";
import oryneCurrent from "@/assets/oryne-current.webp";
import oryneCurrents from "@/assets/oryne-currents.webp";
import oryneLibrary from "@/assets/oryne-library.webp";
import oryneLibraryMenu from "@/assets/oryne-library-menu.webp";
import oryneAskAnswer from "@/assets/oryne-ask-answer.webp";
import oryneAskSummary from "@/assets/oryne-ask-summary.webp";
import oryneWidgetsHome from "@/assets/oryne-widgets-home.webp";
import oryneWatchCaught from "@/assets/oryne-watch-caught.webp";
import oryneOnboarding from "@/assets/oryne-onboarding.webp";
import oryneLockedTake from "@/assets/oryne-locked-take.webp";
import oryneOneOcean from "@/assets/oryne-ocean.webp";
import oryneOneCapture from "@/assets/oryne-one-capture.webp";
import oryneOneAsk from "@/assets/oryne-one-ask.webp";
import oryneOneThought from "@/assets/oryne-one-thought.webp";
import oryneOneLibrary from "@/assets/oryne-one-library.webp";
import oryneProtoCanvas from "@/assets/oryne-proto-canvas.webp";
import oryneProtoRediscover from "@/assets/oryne-proto-rediscover.webp";
import oryneFirstOcean from "@/assets/oryne-first-ocean.webp";
import oryneFirstLibrary from "@/assets/oryne-first-library.webp";
import oryneWireOceanLayouts from "@/assets/oryne-wire-ocean-layouts.webp";
import oryneWireCaptureFlow from "@/assets/oryne-wire-capture-flow.webp";
import oryneWireBranching from "@/assets/oryne-wire-branching.webp";
import oryneStepCatch from "@/assets/oryne-step-catch.mp4";
import oryneStepCatchPoster from "@/assets/oryne-step-catch-poster.webp";
import oryneStepLetgo from "@/assets/oryne-step-letgo.mp4";
import oryneStepLetgoPoster from "@/assets/oryne-step-letgo-poster.webp";
import oryneStepCurrent from "@/assets/oryne-step-current.mp4";
import oryneStepCurrentPoster from "@/assets/oryne-step-current-poster.webp";
import oryneStepRest from "@/assets/oryne-step-rest.mp4";
import oryneStepRestPoster from "@/assets/oryne-step-rest-poster.webp";
import oryneStepAsk from "@/assets/oryne-step-ask.mp4";
import oryneStepAskPoster from "@/assets/oryne-step-ask-poster.webp";
import oryneFilm from "@/assets/oryne-film.mp4";
import oryneFilmPoster from "@/assets/oryne-film-poster.webp";
import { Button } from "@/components/ui/Button";

/* ---------------------------------------------------------------------------
 * Oryne case-study inline modules.
 * Same token-backed module language as Moti (dark cards, mono numbers, lucide
 * icons, violet/emerald/slate accents); the shared shells are imported from
 * MotiModules rather than copied. Every claim here is backed by the app as it
 * runs today (2.0, built 2026-10-17 to 10-20), its App Store listing, its git
 * history, or the documents in its repository. Nothing is a projection.
 *
 * Screens: every phone still is a 1206x2622 capture of the 2.0 build on an
 * iPhone 17 Pro simulator seeded with the app's own screenshot library, run
 * through the same silver-frame pipeline as the 1.x stills (900x1839), so a
 * 2.0 screen and a 1.5 screen sit at exactly the same size in a pair. The
 * clips are 660x1350 loops in the same frame, cut from continuous simulator
 * takes so every animation plays whole; only the still stretches between
 * gestures were dropped. The watch screen is the App Store set's own capture
 * from the Ultra 3 simulator, shown as a clean rounded display with no frame,
 * the way the listing shows it.
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
const tags = ["Selected Work", "AI-Native UX", "iOS & watchOS", "On-Device AI", "Built & Shipped"];
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

/* ── 2) Highlights — the walkthrough, chips, and the film behind a button ── */
// The product itself in four steps first, then six credentials a recruiter
// takes in at a glance, then the film for whoever wants the long version. The
// steps lead because the section exists to be understood in twenty seconds.
const hookHighlights = [
  "Live on the App Store",
  "First commit to 1.0 in 23 days",
  "Six releases in 15 days",
  "Rebuilt around one gesture in 2.0",
  "Intelligence runs on the device",
  "English and Simplified Chinese",
];
const film: LightboxVideo = {
  src: oryneFilm,
  poster: oryneFilmPoster,
  title: "The Oryne film",
  caption: "The version 1 launch film, 80 seconds: catch inspiration before it drifts.",
};

// One thought, caught to returned, as four clips of a few seconds, each
// titled above its clip so the flow reads from the titles alone in the time
// the clips take to play once. Steps 01 and 02 are one continuous take of the
// 2.0 build: the bar tapped, a thought typed in three bursts, released, named
// by the phone, and carried into the sea with its Undo. Step 03 scrolls Tide
// to its currents and opens the one the thought flowed into. Step 04 is Let
// it rest: today's resurfaced thought sinks and the next rises. All four wear
// the iPhone mockup every still wears, at the geometry FeatureClip documents
// below (660x1350, the plate baked to surface-inset), so a step sits at
// exactly a screen's size and has to stay on a surface-inset cell. Silent
// loops with no controls, like a GIF; under reduced motion each is its poster.
type Step = { num: string; label: string; title: string; src: string; poster: string; alt: string };
const steps: Step[] = [
  {
    num: "01",
    label: "Catch",
    title: "Tap the bar to type, or hold the disc to whisper",
    src: oryneStepCatch,
    poster: oryneStepCatchPoster,
    alt: "Tide, the capture bar tapped, and a sentence typed into its capsule above the keyboard: The room feels slower when the light turns warm",
  },
  {
    num: "02",
    label: "Let go",
    title: "Release it, and it is carried into the sea",
    src: oryneStepLetgo,
    poster: oryneStepLetgoPoster,
    alt: "The release arrow is tapped, the words settle, and a toast reads Carried into the sea with an Undo, as the named thought appears under Drifted in",
  },
  {
    num: "03",
    label: "Drift",
    title: "It joins a current of related thoughts",
    src: oryneStepCurrent,
    poster: oryneStepCurrentPoster,
    alt: "Tide scrolled to its Currents, Light And Color tapped, and its sheet opening with the new thought first among five",
  },
  {
    num: "04",
    label: "Return",
    title: "One thought comes back a day. Rest it, and the next rises",
    src: oryneStepRest,
    poster: oryneStepRestPoster,
    alt: "Let it rest is tapped on Tide: today's resurfaced thought sinks and fades, and Warm to cool, not a filter rises in its place",
  },
];
const STEP_CLIP_WIDTH = 660;
const STEP_CLIP_HEIGHT = 1350;
function StepClip({ step }: { step: Step }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  // Buffer a viewport early so the loop plays on arrival instead of stalling
  // on its poster; play only while on screen, so four loops never run unseen.
  const near = useInView(videoRef, { once: true, margin: "100% 0px 100% 0px" });
  const onScreen = useInView(videoRef, { amount: 0.4 });

  useEffect(() => {
    const loop = videoRef.current;
    if (!loop || !near || reduced) return;
    if (onScreen) loop.play().catch(() => {});
    else loop.pause();
  }, [near, onScreen, reduced]);

  return (
    /* A subgrid of the walkthrough's two rows, so a title that wraps on a
       narrow cell still leaves every phone on one top edge; the cell keeps
       no gap of its own between title and clip, the title's margin sets it. */
    <figure className="grid grid-rows-subgrid row-span-2 gap-y-0 bg-surface-inset px-6 py-7 md:px-8 md:py-8">
      <FigureTitle num={step.num} label={step.label}>{step.title}</FigureTitle>
      <div className={SCREEN_FIGURE_WIDTH}>
        {reduced ? (
          <img
            src={step.poster}
            alt={step.alt}
            width={STEP_CLIP_WIDTH}
            height={STEP_CLIP_HEIGHT}
            loading="lazy"
            decoding="async"
            className="w-full h-auto block"
          />
        ) : (
          <video
            ref={videoRef}
            src={near ? step.src : undefined}
            poster={step.poster}
            width={STEP_CLIP_WIDTH}
            height={STEP_CLIP_HEIGHT}
            muted
            loop
            playsInline
            preload="none"
            aria-label={step.alt}
            className="w-full h-auto block"
          />
        )}
      </div>
    </figure>
  );
}
export function OryneWalkthrough() {
  return (
    <ModuleCard>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-case-study-module-divider">
        {steps.map((step) => (
          <StepClip key={step.num} step={step} />
        ))}
      </div>
    </ModuleCard>
  );
}
export function OryneHook() {
  const [open, setOpen] = useState<LightboxVideo | null>(null);
  const close = useCallback(() => setOpen(null), []);
  return (
    <div className="flex flex-col gap-stack">
      <OryneWalkthrough />
      <Chips items={hookHighlights} />
      <div className="flex justify-center">
        <Button tone="secondary" icon={<Play strokeWidth={1.8} />} iconPosition="leading" onClick={() => setOpen(film)}>
          Watch the 80-second film
        </Button>
      </div>
      <VideoLightbox video={open} onClose={close} />
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
// Never quietly drop it to widen the gap. The middle column is "a place" rather
// than "a canvas" since 2.0: the phone's place is Tide and its currents, which
// is still somewhere to look around in, and no longer a map.
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
    discovery: { held: "part", note: "Other people’s ideas" },
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
    capture: { held: "yes", note: "Hold to speak, let go" },
    field: { held: "yes", note: "Currents that gather" },
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
        {["Fast capture", "A place", "Resurfacing"].map((c) => (
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

/* ── 5) The Idea — the four places first, then the words for them ───────── */
// The four places are the section's spine, so they lead and everything else
// hangs off them. Capture is one of them because "one gesture, from anywhere"
// is the promise the rest of the product is built to protect; it is the door
// rather than a room, and its card says so. In 2.0 the places are the three
// tabs and the bar: Tide replaced the Ocean map as the place for encountering,
// and Ask earned a card of its own once the Library could no longer be scanned.
const moments: GridItem[] = [
  { num: "01", title: "Capture, for Catching", desc: "Tap to type, hold to whisper. Not a room, the door.", icon: Zap, accent: "violet" },
  { num: "02", title: "Tide, for Encountering", desc: "What came back today, what drifted in, your currents.", icon: Waves, accent: "emerald" },
  { num: "03", title: "The Library, for Finding", desc: "Search, Recent, and Related. Finding is a job.", icon: LayoutGrid, accent: "slate" },
  { num: "04", title: "Ask, for Asking", desc: "One question, one answer drawn from your own thoughts.", icon: MessageCircleQuestion, accent: "violet" },
];
// The vocabulary as a specimen board: each cell leads with the string the app
// itself shows, so the metaphor is seen doing work rather than claimed, and the
// term and its meaning sit around it as the label. Six words, one cell each,
// every quoted string copied from the 2.0 build's string catalog.
type VocabularyTerm = { term: string; meaning: string; inApp: string };
const vocabulary: VocabularyTerm[] = [
  { term: "Thought", meaning: "One captured fragment, named and themed on the device.", inApp: "“Carried into the sea”" },
  { term: "Whisper", meaning: "A thought caught by voice, in one gesture.", inApp: "“Tap to type. Hold to whisper. Slide up to keep listening.”" },
  { term: "Current", meaning: "Related thoughts gather on their own. Nothing is filed.", inApp: "“Flows into “Light And Color””" },
  { term: "Tide", meaning: "The surface of the Ocean, read in a glance.", inApp: "“The tide brings them back.”" },
  { term: "Resurfacing", meaning: "One forgotten thought rises per day. Rest it, and the next does.", inApp: "“Let it rest”" },
  { term: "Ask the Ocean", meaning: "A question answered only from your own thoughts.", inApp: "“Nothing in your Ocean matches this yet”" },
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
// Two moments a still cannot carry: each one is a gesture and its answer, so
// a screenshot can only ever show you one end of it. Recorded off the 2.0
// build on a simulator, silent.
//
// Composited into the same iPhone 17 Pro silver mockup every screenshot in this
// case study wears. The geometry is derived from the existing stills so the
// clips sit at exactly the same size: still canvas 900x1839 with the device
// silhouette at (48,93) to (852,1745), which is the 1120x2289 frame PNG at
// 0.7336. The frame's screen cutout measured 61,58,998x2172 with a ~150px
// corner radius, and the video is laid in behind the frame so the bezel
// provides the rounded corners rather than a second guess at the radius. MP4
// carries no alpha, so the plate is baked to the rendered value of
// surface-inset, sampled off the page at 12,12,13 in RGB: the figure it sits
// on is that colour, so the clip reads as cut out. Change the figure's
// background and the clips have to be re-rendered. (Written in words rather
// than as a hex literal on purpose; the boundary test rejects colour literals
// anywhere in these files, comments included.)
//
// They play once when they reach the viewport and replay on hover. Under
// prefers-reduced-motion neither happens: the poster stands until the reader
// asks for it, which is the same bargain the rest of the site makes.
type Clip = { src: string; poster: string; moment: string; caption: string };
const clips: Clip[] = [
  {
    src: oryneStepRest,
    poster: oryneStepRestPoster,
    moment: "Tide",
    caption: "let it rest, and today's thought sinks as the next one rises",
  },
  {
    src: oryneStepAsk,
    poster: oryneStepAskPoster,
    moment: "Ask",
    caption: "one question, a warm light while it reads, and the thoughts it drew from",
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
          Both clips are the same height, so the two captions start on the
          same line without an mt-auto push. */}
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
    <ModuleCard header="A Thought Comes Back, and a Question Is Answered">
      <div className="grid grid-cols-1 gap-px bg-case-study-module-divider sm:grid-cols-2">
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
// The ninth cell is the phone test the refocus spec added to the Calm section
// on 2026-10-17, before any 2.0 code landed; it spans the row because it is an
// amendment, not a tenth principle.
type Principle = { name: string; moment: string; test: string; icon: LucideIcon };
const principles: Principle[] = [
  { name: "Capture", moment: "Capture", test: "Would this make someone hesitate before capturing?", icon: Zap },
  { name: "Motion", moment: "Tide", test: "If every animation froze, would the app lose any meaning?", icon: Waves },
  { name: "Memory", moment: "Tide", test: "Does this make old thoughts return, or make the user go get them?", icon: Sun },
  { name: "Retrieval", moment: "The Library", test: "Can someone who never learned the field's layout reach every thought?", icon: LayoutGrid },
  { name: "Ownership", moment: "The Thought", test: "Can the system ever silently replace something the user wrote?", icon: PenLine },
  { name: "AI Behavior", moment: "Everywhere", test: "If the network died mid-session, would the user be told anything untrue, by words or by omission?", icon: Compass },
  { name: "Trust", moment: "Everywhere", test: "Does the UI ever say done before the system knows it is done?", icon: ShieldCheck },
  { name: "Calm", moment: "Everywhere", test: "Would this make Oryne feel like a tool that needs tending?", icon: Anchor },
];
const phoneTest: Principle = {
  name: "The phone test",
  moment: "Added October 17, 2026",
  test: "Does this need more than a glance or one gesture on a phone? Then it belongs on the desk, and the phone's job is to get the thought there.",
  icon: Smartphone,
};
function PrincipleCell({ p, wide }: { p: Principle; wide?: boolean }) {
  const Icon = p.icon;
  return (
    <div className={`flex flex-col gap-4 md:gap-5 bg-surface-inset px-4 py-5 md:px-7 md:py-8 ${wide ? "col-span-2 lg:col-span-4" : ""}`}>
      <div className="flex items-center justify-between">
        <span className="text-label uppercase tracking-eyebrow font-mono text-foreground-tertiary">{p.moment}</span>
        <Icon aria-hidden="true" className="w-4 h-4 text-accent-violet" strokeWidth={1.4} />
      </div>
      <div className={`flex flex-col gap-2.5 ${wide ? "max-w-measure" : ""}`}>
        <p className="text-base md:text-xl font-medium text-foreground leading-normal md:leading-snug tracking-tight">{p.name}</p>
        <p className="text-sm md:text-base font-light leading-relaxed text-foreground-secondary [overflow-wrap:anywhere]">{noOrphan(p.test)}</p>
      </div>
    </div>
  );
}
export function OrynePrinciples() {
  return (
    <ModuleCard>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-case-study-module-divider">
        {principles.map((p) => (
          <PrincipleCell key={p.name} p={p} />
        ))}
        <PrincipleCell p={phoneTest} wide />
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
    kept: "Four tabs named for the four verbs, Capture, Ocean, Ask, and Library, and long press as the canonical gesture: chosen there for branching, kept in 1.0 for kinship.",
    changed: "The Ocean Field question was never settled by picking one. The build went Cluster first, on day two, and drift arrived in July. The 1.0 Ocean was both: currents that move.",
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
// simulator on 2026-09-08 (see the memory note). The 1.0 side is the app as it
// shipped in July, captured in September. Ask, Capture, Thought, Branch, and
// Whisper were compared too and shipped nearly as built, so they are not
// shown as pairs.
const pairs: Pair[] = [
  {
    title: "Ocean",
    before: { src: oryneFirstOcean, alt: "Version 1’s Ocean: ten gray orbs with icons scattered on a dark field", label: "Version 1", caption: "gray orbs scattered on a dark field, and no currents yet" },
    after: { src: oryneOneOcean, alt: "The 1.0 Ocean: glass orbs drifting in currents, one lit by a long press", label: "1.0", caption: "glass bodies in currents, relatives lit on a long press" },
  },
  {
    title: "Library",
    before: { src: oryneFirstLibrary, alt: "Version 1’s Library: a single-column list grouped by week", label: "Version 1", caption: "a list, newest first, one thought per row" },
    after: { src: oryneOneLibrary, alt: "The 1.0 Library: a masonry waterfall of cards", label: "1.0", caption: "a waterfall of cards, by time or by meaning" },
  },
];
// Wireframe rows, cropped from the rendered Claude Design file at 2x. Only the
// rows where the shipped app departed from the drawing: Ocean Field, Drift
// Capture, and Branching. Entry points, Dialogue, Navigation, and Library
// shipped as drawn, so they are a sentence in the stage card, not a figure.
type WireRow = ArtifactItem;
const wireRows: WireRow[] = [
  { src: oryneWireOceanLayouts, alt: "Wireframe row: four Ocean Field layouts side by side, Drift, Cluster, Depth, and Timeline, each as a phone screen", label: "Ocean Field", caption: "four layouts from most spatial to most legible; 1.0 shipped Drift and Cluster together, and 2.0 chose legible" },
  { src: oryneWireCaptureFlow, alt: "Wireframe storyboard: idle Ocean, a radial mode picker, a two-second capture, and a ripple confirming release", label: "Drift Capture", caption: "thought to Ocean in under two seconds, and release as the verb; both shipped, and the mode picker is gone since 2.0" },
  { src: oryneWireBranching, alt: "Wireframe row: four branching gestures, long-press radial, directional swipe, an inline button, and a bottom sheet", label: "Branching", caption: "four gestures for the same four kinds; the recommended radial lost to the bottom sheet, and the long press went to kinship instead" },
];
// The two notes under a stage. The icon carries the verdict so the eye can
// sort survived from changed before reading: a check for what shipped as it
// was, and the same arrow that stands between Version 1 and 1.0 below.
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
// One side of a before-and-after pair. The figure is display: contents so
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
// Before, an arrow, after. Across on two columns; down the page on one, where
// the arrow turns to point at the next phone, the same move Moti's principle
// rows make. Full ink and a heavier stroke than the icon set: at 28px between
// two phone frames it has to carry itself, and Malik chose this over a disc
// and over a hairline connector.
function PairRow({ pair }: { pair: Pair }) {
  return (
    <div className="bg-surface-inset px-6 py-7 md:px-8 md:py-8">
      <p className="text-base md:text-xl font-medium text-foreground">{pair.title}</p>
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:gap-x-4">
        <PairScreen item={pair.before} col="sm:col-start-1" />
        <div className="flex items-center justify-center py-6 sm:py-0 sm:col-start-2 sm:row-start-1 sm:px-2">
          <ArrowRight aria-hidden="true" className="h-7 w-7 shrink-0 rotate-90 sm:rotate-0 text-foreground" strokeWidth={2} />
        </div>
        <PairScreen item={pair.after} col="sm:col-start-3" />
      </div>
    </div>
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
      <ModuleCard header="Version 1 Against 1.0">
        <div className="divide-y divide-case-study-module-divider">
          {pairs.map((pair) => (
            <PairRow key={pair.title} pair={pair} />
          ))}
        </div>
      </ModuleCard>
    </div>
  );
}

/* ── 7b) Iterations, continued — the releases and the review ────────────── */
// This used to be its own "Shipping It" section. It renders inside Iterations
// now, because the releases are the iteration continuing past 1.0: each row is
// what that version changed, not a feature list. The July rows are the App
// Store version history; the October rows are the two 2.0 builds tagged in the
// repository (Release 2.0 build 1 on 10-19, build 2 with the watch app on
// 10-20). The listing still showed 1.5 when this was written, so the close
// says prepared, not shipped. Do not add a "why" to a row that the history
// does not say.
const releases = [
  { date: "Jun 9", tag: "First commit", text: "Fast Capture, widgets, and the Ocean field by day two." },
  { date: "Jul 2", tag: "1.0", text: "On the App Store, 23 days in." },
  { date: "Jul 4", tag: "1.1", text: "Currents that breathe. Kinship on long press." },
  { date: "Jul 6", tag: "1.2", text: "Export the Ocean as a readable archive." },
  { date: "Jul 8", tag: "1.3", text: "Masonry Library. Add a thought into an open current." },
  { date: "Jul 16", tag: "1.4", text: "Chinese and English, transcribed live on the device." },
  { date: "Jul 17", tag: "1.5", text: "Waterfall Library, Recent and Related." },
  { date: "Oct 19", tag: "2.0", text: "Three tabs, one gesture, Ask as one answer. Built over a weekend." },
  { date: "Oct 20", tag: "2.0 (2)", text: "Oryne on Apple Watch: a whisper from the wrist reaches the phone on its own." },
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
      <ModuleCard header="Six Releases in Fifteen Days, Then 2.0">
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
            <p className="text-sm md:text-base font-medium leading-relaxed text-foreground">1.5 live on the App Store. 2.0 built, screenshotted, and written up for it.</p>
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

/* ── 7c) The Refocus — the six decisions, and 1.5 against 2.0 ───────────── */
// The decisions are the spec's own list (docs/plans/phone-refocus/SPEC.md,
// 2026-10-17, "decisions recorded from the 2026-10-15 to 10-17 product
// conversation"), in its order and nearly its words. Five of the six are
// built; the sixth, exits to the desk, is direction, and its card says so
// rather than implying it shipped. The pairs put a 1.5 screen captured in
// September beside the 2.0 screen captured in October, same frame, same size.
const decisions: GridItem[] = [
  { num: "01", title: "Capture Is a Bar, Not a Tab", desc: "A field and a disc above the tab bar, like a message composer.", icon: DoorOpen, accent: "violet" },
  { num: "02", title: "Voice Is a Gesture, Not a Mode", desc: "Hold to whisper, lift to catch, slide up to lock. No picker.", icon: Hand, accent: "emerald" },
  { num: "03", title: "The Review Beat Goes Away", desc: "Caught the moment the finger lifts. What remains is Undo.", icon: Undo2, accent: "slate" },
  { num: "04", title: "Ask Stays, as One Mode", desc: "Four lenses become one question and one grounded answer.", icon: MessageCircleQuestion, accent: "violet" },
  { num: "05", title: "The Ocean Is a Surface, Not a Map", desc: "Tide: today's thought, what drifted in, your currents. No pan, no zoom.", icon: Map, accent: "emerald" },
  { num: "06", title: "Exits Matter (Direction)", desc: "A current should be able to leave for the desk. Scoped, not built.", icon: ArrowUpRight, accent: "slate" },
];
const refocusPairs: Pair[] = [
  {
    title: "Home",
    before: { src: oryneOneOcean, alt: "The 1.5 Ocean: glass orbs drifting in currents on a dark field, one lit by a long press", label: "1.5", caption: "the Ocean, a map of orbs to pan and long press" },
    after: { src: oryneTide, alt: "2.0's Tide: a New York title, the resurfacing thought with its picture, Nearby and Let it rest, then Drifted in and the capture bar", label: "2.0", caption: "Tide, a page read in three seconds: what came back, what drifted in" },
  },
  {
    title: "Capture",
    before: { src: oryneOneCapture, alt: "The 1.5 Capture tab: a Thought and Whisper toggle, a text field, and a Release into the Ocean button", label: "1.5", caption: "a tab, a Thought or Whisper picker, and a Release button" },
    after: { src: oryneCaptureTyped, alt: "2.0's capture bar risen above the keyboard with a sentence typed into it, a release arrow and the whisper disc at its end", label: "2.0", caption: "the bar: tap to type, hold the disc to whisper, one arrow to release" },
  },
  {
    title: "Ask",
    before: { src: oryneOneAsk, alt: "The 1.5 Ask: four lens chips above a chat-style answer with its sources", label: "1.5", caption: "four lenses, Search, Synthesis, Expansion, Research, over a chat" },
    after: { src: oryneAskAnswer, alt: "2.0's Ask: the question in New York, a short answer, and every thought it was drawn from as lines that open the real thing", label: "2.0", caption: "one question, one answer, and every thought it was drawn from" },
  },
];
// What left the phone and what it cost in code, from git: the Swift files
// between the last 1.x commit (8a4325b) and the refocus merge (4dc4332) lost
// 5,646 lines and gained 3,467. The named files are the ones deleted outright.
const removed = [
  { what: "The Ocean map", detail: "OceanLayout and the six SpriteKit scene files, about 2,400 lines" },
  { what: "The Capture tab", detail: "CaptureView and the post-capture moment, about 1,000 lines" },
  { what: "The four Ask modes", detail: "Search, Synthesis, Expansion, and Research behind one entry" },
  { what: "The review beat", detail: "Captured, Keep, Edit, the countdown, and the transcript editor at capture time" },
];
export function OryneRefocus() {
  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <CardGrid items={decisions} header="Six Decisions, Written Down Before the Code" colsClass="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" />
      <ModuleCard header="What Left the Phone">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-case-study-module-divider">
          {removed.map((r) => (
            <div key={r.what} className="flex gap-3 bg-surface-inset px-6 py-5 md:px-8 md:py-6">
              <Minus aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-foreground-tertiary" strokeWidth={1.6} />
              <div>
                <p className="text-sm md:text-base font-medium text-foreground">{r.what}</p>
                <p className="mt-1 text-sm md:text-base font-light leading-relaxed text-foreground-secondary">{noOrphan(r.detail)}</p>
              </div>
            </div>
          ))}
          <div className="sm:col-span-2 flex items-start gap-3 bg-surface-inset px-6 py-4 md:px-8 md:py-5">
            <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-success" strokeWidth={1.6} />
            <p className="text-sm md:text-base font-medium leading-relaxed text-foreground">The Swift came out 2,179 lines smaller than it went in.</p>
          </div>
        </div>
      </ModuleCard>
      <ModuleCard header="1.5 Against 2.0">
        <div className="divide-y divide-case-study-module-divider">
          {refocusPairs.map((pair) => (
            <PairRow key={pair.title} pair={pair} />
          ))}
        </div>
      </ModuleCard>
    </div>
  );
}

/* ── 7d) The material — the 2.0 visual language ─────────────────────────── */
// The rules are the spec's "Visual language" and "Materials by layer" notes
// (2026-10-17 and 10-18), decided on wireframes and mocks before code, each
// time. The pair is the thought page, the one screen both versions share
// almost item for item, so the material change reads without a layout change
// in the way.
const material: GridItem[] = [
  { num: "01", title: "New York, Three Times", desc: "Page titles, the italic section labels, and the resurfacing title. System type everywhere else.", icon: Type, accent: "violet" },
  { num: "02", title: "Flat Fills, No Hairlines", desc: "Every surface is one fill on a soft shadow. No rendered glass in content, no rims, no top-down light.", icon: Square, accent: "emerald" },
  { num: "03", title: "Glass Only Where It Floats", desc: "Liquid Glass on the tab bar, the capture bar, the toast, and sheet chrome. Matte capsules in content.", icon: Layers, accent: "slate" },
  { num: "04", title: "One Lamp", desc: "A single light in the water behind Resurfacing, and its label the only warm colour on the page.", icon: Lightbulb, accent: "violet" },
];
const materialPair: Pair = {
  title: "A thought",
  before: { src: oryneOneThought, alt: "The 1.5 thought page: a glass card with the title, themes as capsules, nearby thoughts in a rendered panel", label: "1.5", caption: "glass panels, capsule tags, and a halo of light" },
  after: { src: oryneThought, alt: "2.0's thought page: one meta line, the title in New York, the words, Themes, Nearby with a Summarize button, and Grow a branch and Ask Ocean at the bottom", label: "2.0", caption: "text on the water, one order for every kind, type doing the grouping" },
};
export function OryneMaterial() {
  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <CardGrid items={material} colsClass="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" />
      <ModuleCard>
        <PairRow pair={materialPair} />
      </ModuleCard>
    </div>
  );
}

/* ── 7e) The usability test — three AI testers, one list ────────────────── */
// Everything here is docs/plans/phone-refocus/USABILITY-2026-10-18.md in the
// app repository: the three profiles and devices, the verdict sentence, and
// the fixed and open items, condensed. The testers were agents driving
// simulators, which the copy says plainly; nobody human has run 2.0 yet.
type Tester = { id: string; profile: string; device: string; method: string };
const testers: Tester[] = [
  { id: "P1", profile: "First-time user, English only", device: "iPhone 17", method: "Eight tasks, from onboarding to delete" },
  { id: "P2", profile: "Returning bilingual user, zh and en", device: "iPhone 17e", method: "Eight retrieval tasks: Tide, Currents, search, Summarize, Move, export" },
  { id: "P3", profile: "Heuristic reviewer", device: "iPhone 17 Pro Max", method: "Nielsen's ten heuristics and the HIG, plus Dynamic Type, Chinese and Calm Mode" },
];
const fixed = [
  "Undo was unreachable under 44 pt and lost the tap to the tab bar: now one centered toast for the whole undo window.",
  "The save phrase rotated among four lines: now one, Carried into the sea.",
  "A thought's page never showed its title or its current: the title leads, the meta line names the current.",
  "The capture bar sat over the search keyboard: it steps aside while another field has the keyboard.",
  "Destructive confirms anchored to the wrong control with no Cancel: every one is the centered system alert.",
  "Two composer bars in one slot looked alike but differed: Ask's bar is the capture bar's twin.",
  "Three title treatments for three tabs, five ways to dismiss a sheet: one of each.",
];
const open = [
  "A deleted thought is gone for good: no undo, no recently deleted.",
  "Ask cannot reliably re-find the user's own idea, and without the on-device model its answer is a fixed template.",
  "A capture can still be lost: the overlay's X discards words and audio without asking.",
  "Hold-to-whisper cannot be discovered from the screen, and a denied microphone looks like nothing happened.",
  "Currents rename themselves as understanding lands, and the daily resurfacing changes during the day.",
  "The New York display type does not scale with Dynamic Type.",
];
export function OryneUsability() {
  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <ModuleCard header="Three Testers, Three Simulators, One Build">
        <div className="divide-y divide-case-study-module-divider">
          {testers.map((t) => (
            <div key={t.id} className="grid grid-cols-[3rem_minmax(0,1fr)] md:grid-cols-[4rem_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.4fr)] gap-x-4 px-6 py-4 md:px-8 md:py-5">
              <p className="text-caption md:text-sm font-mono tabular-nums text-accent-violet/70">{t.id}</p>
              <p className="text-sm md:text-base font-medium text-foreground">{t.profile}</p>
              <p className="col-start-2 md:col-start-3 text-sm md:text-base font-light text-foreground-secondary">{t.device}</p>
              <p className="col-start-2 md:col-start-4 text-sm md:text-base font-light leading-relaxed text-foreground-secondary">{noOrphan(t.method)}</p>
            </div>
          ))}
        </div>
      </ModuleCard>
      <ModuleCard>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-case-study-module-divider">
          <div className="bg-surface-inset px-6 py-6 md:px-8 md:py-7">
            <div className="flex items-center gap-2">
              <Check aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-success" strokeWidth={1.6} />
              <p className="text-label uppercase tracking-eyebrow text-foreground-secondary font-mono">Fixed in the pass that followed</p>
            </div>
            <ul className="mt-4 flex flex-col gap-3">
              {fixed.map((f) => (
                <li key={f} className="text-sm md:text-base font-light leading-relaxed text-foreground-secondary">{noOrphan(f)}</li>
              ))}
            </ul>
          </div>
          <div className="bg-surface-inset px-6 py-6 md:px-8 md:py-7">
            <div className="flex items-center gap-2">
              <AlertTriangle aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-accent-violet/70" strokeWidth={1.6} />
              <p className="text-label uppercase tracking-eyebrow text-foreground-secondary font-mono">Still open, the two blockers first</p>
            </div>
            <ul className="mt-4 flex flex-col gap-3">
              {open.map((o) => (
                <li key={o} className="text-sm md:text-base font-light leading-relaxed text-foreground-secondary">{noOrphan(o)}</li>
              ))}
            </ul>
          </div>
        </div>
      </ModuleCard>
    </div>
  );
}

/* ── 8) Final Design — one thought, start to finish, in four acts ───────── */
// The whole product as one journey. Each step is a real screen from the 2.0
// build and the caption says what happens on it. The acts are the product's
// promise in order: you catch it, the Tide works on it, you go looking, and
// the entry points around that loop. Step 02 shows the simulator's listening
// state; a simulator hears no speech, so the line under the disc is the app's
// own "Words will follow." rather than live words, and the caption stays
// honest about what the still can show.
type FlowStep = ArtifactItem & { num: string; title: string };
type FlowAct = { title: string; lead: string; steps: FlowStep[]; quote?: string };
const acts: FlowAct[] = [
  {
    title: "Act One: You Catch It",
    lead: "Capture is built for the moment a thought arrives, before you have judged it. One bar, one gesture.",
    steps: [
      { num: "01", title: "Type", src: oryneCaptureTyped, alt: "The capture bar risen above the keyboard with a sentence typed into its capsule, a release arrow and the whisper disc at its end", label: "The bar", caption: "tap it to type; the capsule grows with the words and the arrow appears" },
      { num: "02", title: "Hold", src: oryneWhisperHold, alt: "The capture bar while the disc is held: an X at the leading end, the line Words will follow, and the disc showing level bars", label: "Hold", caption: "hold the disc and the phone listens; lift, and the whisper is caught" },
      { num: "03", title: "Let go", src: oryneToast, alt: "Tide after a release: a toast reading Carried into the sea with an Undo, and the new thought already under Drifted in", label: "Carried into the sea", caption: "saved before anything says so, then one toast with ten seconds to undo" },
      { num: "04", title: "Name", src: oryneThought, alt: "The thought's page: Thought, 47 seconds ago, Light And Color, the title Warmth turns slow room in New York, the words, three themes, and Nearby", label: "Thought", caption: "the device names it, finds its themes, and places it in a current" },
    ],
  },
  {
    title: "Act Two: The Tide Works",
    lead: "Everything you never get around to happens on the device after you let go. Then, one day, it comes back.",
    steps: [
      { num: "05", title: "Return", src: oryneTide, alt: "Tide: Resurfacing, a thought from three weeks ago with its picture, Nearby and Let it rest, then Drifted in and the capture bar", label: "Tide", caption: "the home page: what came back today, what drifted in, your currents" },
      { num: "06", title: "Nearby", src: oryneNearby, alt: "Tide with Nearby open: three thoughts listed under the resurfaced one", label: "Nearby", caption: "the three thoughts that sit closest to today's" },
      { num: "07", title: "Gather", src: oryneCurrent, alt: "The Light And Color current opened as a sheet: Summarize and Add a thought, then five thoughts with the newest first", label: "Current", caption: "five thoughts drift here, and nobody filed them" },
      { num: "08", title: "Currents", src: oryneCurrents, alt: "Tide scrolled to its Currents: four tiles, Light And Color, Product Ideas, Cooking, Sound & Music, and All currents", label: "Currents", caption: "the four most active, each with its newest thought, and all of them one tap away" },
    ],
    quote: "Would this need more than a glance or one gesture on a phone? Then it belongs on the desk.",
  },
  {
    title: "Act Three: When You Go Looking",
    lead: "Rediscovery is a rhythm, not a search. When you do go looking, or the Ocean has grown past scanning, there is a place for that.",
    steps: [
      { num: "09", title: "Find", src: oryneLibrary, alt: "The Library sorted by Related: a masonry of cards with the newest thought first beside its sunset neighbours", label: "Library", caption: "a waterfall of cards, by time or by meaning" },
      { num: "10", title: "Filter", src: oryneLibraryMenu, alt: "The Library's one menu: Recent or Related, All kinds, Thought, Whisper, Image, Link, Show archived, and Currents", label: "One menu", caption: "every sort and filter in one place, and no gear" },
      { num: "11", title: "Ask", src: oryneAskAnswer, alt: "Ask: the question What keeps coming back about light in New York, a four-sentence answer, and seven thoughts under Drawn from", label: "Ask", caption: "one question, one answer, and every thought it was drawn from" },
      { num: "12", title: "Summarize", src: oryneAskSummary, alt: "Ask answering Summarize Light And Color: two short paragraphs and the five thoughts of the current under Drawn from", label: "Summarize", caption: "a whole current read in one tap, through the same answer shape" },
    ],
  },
  {
    title: "Act Four: Around the Loop",
    lead: "The entry points, each built so the thought reaches the Ocean without opening the app first.",
    steps: [
      { num: "13", title: "Widgets", src: oryneWidgetsHome, alt: "Home screen with the Oryne Fast Capture widget and a resurfacing widget", label: "Widgets", caption: "a Thought or Whisper button one tap from the home screen" },
      { num: "14", title: "The Wrist", src: oryneWatchCaught, alt: "The Oryne watch app after a whisper: a check mark, Caught, and an Undo button", label: "Apple Watch", caption: "press, speak, lift; the whisper reaches the phone on its own" },
      { num: "15", title: "First Run", src: oryneOnboarding, alt: "The first onboarding page: Not another notes app, in New York, over a lamp in the water", label: "Onboarding", caption: "the first screen, in the new type, and no tour after it" },
      { num: "16", title: "Entry Points", src: oryneLockedTake, alt: "Tide with a locked take running in the capture bar: an X, the line Words will follow, and a Stop disc", label: "Fast Capture", caption: "the Action Button, Control Center, and Siri open a locked take; the disc is Stop" },
    ],
    quote: "Capture must work in under two seconds from any entry point.",
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
  { num: "01", title: "On-Device Intelligence", desc: "Apple’s Foundation Models name, theme, relate, summarize, and answer.", icon: Cpu, accent: "violet" },
  { num: "02", title: "Local Speech", desc: "Transcription on the phone, in both languages. A bilingual take runs both ways and the better one wins.", icon: AudioLines, accent: "emerald" },
  { num: "03", title: "Your Own iCloud", desc: "Private CloudKit sync, phone to watch to phone. No server I can read.", icon: Cloud, accent: "slate" },
];
export function OrynePrivacy() {
  return <CardGrid items={privacyItems} colsClass="grid-cols-1 sm:grid-cols-3" />;
}

/* ── 10) What the Ocean Taught Me — takeaways + closing CTA ─────────────── */
const takeaways: GridItem[] = [
  { num: "01", title: "A Metaphor Is a Decision Machine", desc: "It answered questions about gestures, copy, and motion. Or it is decoration.", icon: Compass, accent: "violet" },
  { num: "02", title: "A Phone Is a Glance", desc: "Anything that needed more than one gesture belonged on the desk. Including the map.", icon: Smartphone, accent: "emerald" },
  { num: "03", title: "The Best Features Are Refusals", desc: "Restraint does not demo well. It ships well. 2.0 shipped by taking out 2,000 lines.", icon: Ban, accent: "slate" },
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
