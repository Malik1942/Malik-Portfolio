import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { noOrphan } from "@/lib/noOrphan";
import {
  ArrowUpRight,
  ArrowRight,
  Waves,
  Layers,
  Zap,
  Ban,
  Cpu,
  AudioLines,
  Cloud,
  Compass,
  CheckCircle2,
  Check,
  Play,
  MessageCircleQuestion,
  Hand,
  Undo2,
  Map,
  DoorOpen,
  Smartphone,
  AlertTriangle,
} from "lucide-react";
import { FigureCaption } from "./FigureCaption";
import { FigureTitle } from "./FigureTitle";
import { VideoLightbox, type LightboxVideo } from "@/components/VideoLightbox";
import { CardGrid, Chips, ModuleCard, PullQuote, SCREEN_FIGURE_WIDTH, type ArtifactItem, type GridItem } from "./MotiModules";
import oryneTide from "@/assets/oryne-tide.webp";
import oryneCaptureTyped from "@/assets/oryne-capture-typed.webp";
import oryneWhisperHold from "@/assets/oryne-whisper-hold.webp";
import oryneToast from "@/assets/oryne-toast.webp";
import oryneThought from "@/assets/oryne-thought.webp";
import oryneLibrary from "@/assets/oryne-library.webp";
import oryneAskAnswer from "@/assets/oryne-ask-answer.webp";
import oryneWatchCaught from "@/assets/oryne-watch-caught.webp";
import oryneOneOcean from "@/assets/oryne-ocean.webp";
import oryneOneCapture from "@/assets/oryne-one-capture.webp";
import oryneOneAsk from "@/assets/oryne-one-ask.webp";
import oryneOneThought from "@/assets/oryne-one-thought.webp";
import oryneStepCatch from "@/assets/oryne-step-catch.mp4";
import oryneStepCatchPoster from "@/assets/oryne-step-catch-poster.webp";
import oryneStepLetgo from "@/assets/oryne-step-letgo.mp4";
import oryneStepLetgoPoster from "@/assets/oryne-step-letgo-poster.webp";
import oryneStepCurrent from "@/assets/oryne-step-current.mp4";
import oryneStepCurrentPoster from "@/assets/oryne-step-current-poster.webp";
import oryneStepRest from "@/assets/oryne-step-rest.mp4";
import oryneStepRestPoster from "@/assets/oryne-step-rest-poster.webp";
import oryneFilm from "@/assets/oryne-film.mp4";
import oryneFilmTilePoster from "@/assets/oryne-film-tile-poster.webp";
import oryneFilmOnboarding from "@/assets/oryne-film-onboarding.mp4";
import oryneFilmOnboardingPoster from "@/assets/oryne-film-onboarding-poster.webp";
import oryneFilmOcean from "@/assets/oryne-film-ocean.mp4";
import oryneFilmOceanPoster from "@/assets/oryne-film-ocean-poster.webp";
import oryneProtoCanvas from "@/assets/oryne-proto-canvas.webp";
import oryneWireOceanLayouts from "@/assets/oryne-wire-ocean-layouts.webp";
import oryneAppStoreCapture from "@/assets/oryne-appstore-1.webp";
import oryneAppStoreOcean from "@/assets/oryne-appstore-2.webp";
import oryneAppStoreAsk from "@/assets/oryne-appstore-8.webp";
import oryneAppStoreLibrary from "@/assets/oryne-appstore-9.webp";
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
 * The page tells one story, the October refocus that took the Ocean map off
 * the phone, and every other section is a short run-up to it or a short
 * consequence of it. The competitive matrix, the principle grid, the wireframe
 * and prototype archive, and the per-release table were cut on 2026-10-27 for
 * weight; they are in git (PR #66) if a longer version is ever wanted again.
 *
 * Screens: every phone still is a 1206x2622 capture of the 2.0 build on an
 * iPhone 17 Pro simulator seeded with the app's own screenshot library, run
 * through the same silver-frame pipeline as the 1.x stills (900x1839), so a
 * 2.0 screen and a 1.5 screen sit at exactly the same size in a pair. The
 * clips are 660x1350 loops in the same frame, cut from continuous simulator
 * takes so every animation plays whole. The watch screen is the App Store
 * set's own capture from the Ultra 3 simulator, shown with no frame, the way
 * the listing shows it.
 * ------------------------------------------------------------------------- */

const ORYNE_APP_STORE_URL = "https://apps.apple.com/us/app/oryne/id6778995892";

function AppStoreLink({ label }: { label: string }) {
  return (
    <Button href={ORYNE_APP_STORE_URL} external icon={<ArrowUpRight strokeWidth={1.8} />}>
      {label}
    </Button>
  );
}

// Column rule shared by the tables in this file.
const TERM_COL_RULE = "md:border-l md:border-case-study-module-divider";

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

/* ── 2) Highlights — the walkthrough and the chips ───────────────────────── */
// The product itself in four steps first, then six credentials a recruiter
// takes in at a glance. The steps lead because the section exists to be
// understood in twenty seconds. The launch film lives in Version 1, where it
// belongs in time, as a poster that opens the video lightbox.
const hookHighlights = [
  "Live on the App Store",
  "First commit to 1.0 in 23 days",
  "Six releases in 15 days",
  "Rebuilt around one gesture in 2.0",
  "Intelligence runs on the device",
  "English and Simplified Chinese",
];

// One thought, caught to returned, as four clips of a few seconds, each
// titled above its clip so the flow reads from the titles alone in the time
// the clips take to play once. Steps 01 and 02 are one continuous take of the
// 2.0 build: the bar tapped, a thought typed in three bursts, released, named
// by the phone, and carried into the sea with its Undo. Step 03 scrolls Tide
// to its currents and opens the one the thought flowed into. Step 04 is Let
// it rest: today's resurfaced thought sinks and the next rises. All four wear
// the iPhone mockup every still wears (660x1350, the plate baked to
// surface-inset), so a step sits at exactly a screen's size and has to stay on
// a surface-inset cell. Silent loops with no controls, like a GIF; under
// reduced motion each is its poster.
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
  return (
    <div className="flex flex-col gap-stack">
      <OryneWalkthrough />
      <Chips items={hookHighlights} />
    </div>
  );
}

/* ── Film loops — two moments cut from the version 1 launch film ────────── */
// The 1.0 app no longer runs anywhere, so these are the only moving record of
// it: cut from oryne-film.mp4 (1920x1080) as a 640x1080 column centred on the
// phone, with the film's own black ground and glow. Onboarding is 4.5 to 11.4
// s, the three pages before Fast Capture. The Ocean is 28 to 35 s: an orb held
// on the 1.0 field, its current opening, and the film's own push into the
// sheet. Re-cut from the film, never re-rendered, so what is shown is what
// shipped. Silent loops, played only while on screen; the poster stands in
// under reduced motion.
type FilmLoopClip = { src: string; poster: string; alt: string; label: string; caption: string };
const FILM_LOOP_WIDTH = 640;
const FILM_LOOP_HEIGHT = 1080;
function FilmLoop({ clip }: { clip: FilmLoopClip }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const near = useInView(videoRef, { once: true, margin: "100% 0px 100% 0px" });
  const onScreen = useInView(videoRef, { amount: 0.4 });

  useEffect(() => {
    const loop = videoRef.current;
    if (!loop || !near || reduced) return;
    if (onScreen) loop.play().catch(() => {});
    else loop.pause();
  }, [near, onScreen, reduced]);

  return (
    <figure className={`${SCREEN_FIGURE_WIDTH} flex flex-col`}>
      <div className="overflow-hidden rounded-2xl bg-secondary/10">
        {reduced ? (
          <img src={clip.poster} alt={clip.alt} width={FILM_LOOP_WIDTH} height={FILM_LOOP_HEIGHT} loading="lazy" decoding="async" className="w-full h-auto block" />
        ) : (
          <video
            ref={videoRef}
            src={near ? clip.src : undefined}
            poster={clip.poster}
            width={FILM_LOOP_WIDTH}
            height={FILM_LOOP_HEIGHT}
            muted
            loop
            playsInline
            preload="none"
            aria-label={clip.alt}
            className="w-full h-auto block"
          />
        )}
      </div>
      <FigureCaption label={clip.label}>{clip.caption}</FigureCaption>
    </figure>
  );
}
const onboardingLoop: FilmLoopClip = {
  src: oryneFilmOnboarding,
  poster: oryneFilmOnboardingPoster,
  alt: "Version 1 onboarding: Not another notes app, then Catch fragments before they disappear, then The Ocean gives back",
  label: "Onboarding, 1.0",
  caption: "the first thing the app says is what it is not",
};
const oceanLoop: FilmLoopClip = {
  src: oryneFilmOcean,
  poster: oryneFilmOceanPoster,
  alt: "The 1.0 Ocean: orbs on a dark field, one held until it glows, and its current, Creative Direction, opening as a sheet of eight thoughts",
  label: "The first build",
  caption: "hold an orb, and the current it belongs to opens",
};

/* ── 3) The Problem — the app's first screen, then three pillars ───────── */
const problemPillars: GridItem[] = [
  { num: "01", title: "The List Buries", desc: "Neat, chronological, and never scrolled back through.", icon: Layers, accent: "violet" },
  { num: "02", title: "Memory Is Not a Timeline", desc: "A thought returns because something today rhymes with it.", icon: Waves, accent: "emerald" },
  { num: "03", title: "The Moment Is Too Short", desc: "Unlock, open, find the note. The thought is already gone.", icon: Zap, accent: "slate" },
];
export function OryneProblem() {
  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <ModuleCard>
        <div className="bg-surface-inset px-6 py-7 md:px-8 md:py-8">
          <FilmLoop clip={onboardingLoop} />
        </div>
      </ModuleCard>
      <CardGrid items={problemPillars} colsClass="grid-cols-1 sm:grid-cols-3" />
    </div>
  );
}

/* ── 4) The Idea — the vocabulary as a specimen board ───────────────────── */
// Each cell leads with the string the app itself shows, so the metaphor is
// seen doing work rather than claimed, and the term and its meaning sit around
// it as the label. Six words, one cell each, every quoted string copied from
// the 2.0 build's string catalog. This is the one module the section keeps:
// the four-places grid and the two feature clips went with the trim, because
// the walkthrough above already shows the same two moments moving.
type VocabularyTerm = { term: string; meaning: string; inApp: string };
const vocabulary: VocabularyTerm[] = [
  { term: "Thought", meaning: "One captured fragment, named and themed on the device.", inApp: "“Carried into the sea”" },
  { term: "Whisper", meaning: "A thought caught by voice, in one gesture.", inApp: "“Tap to type. Hold to whisper. Slide up to keep listening.”" },
  { term: "Current", meaning: "Related thoughts gather on their own. Nothing is filed.", inApp: "“Flows into “Light And Color””" },
  { term: "Tide", meaning: "The surface of the Ocean, read in a glance.", inApp: "“The tide brings them back.”" },
  { term: "Resurfacing", meaning: "One forgotten thought rises per day. Rest it, and the next does.", inApp: "“Let it rest”" },
  { term: "Ask the Ocean", meaning: "A question answered only from your own thoughts.", inApp: "“Nothing in your Ocean matches this yet”" },
];
// The metaphor took three tries to look like water, shown in order: the
// Lovable web prototype captured live on 2026-09-08, the Claude Design
// wireframe row of four Ocean layouts (2026-05-24, rendered at 2x), and the
// first build's Ocean in motion from the launch film.
function WideFigure({ src, alt, label, caption }: ArtifactItem) {
  return (
    <figure className="bg-surface-inset px-6 py-7 md:px-8 md:py-8">
      <div className="overflow-hidden rounded-2xl bg-secondary/10">
        <img src={src} alt={alt} loading="lazy" decoding="async" className="w-full h-auto block" />
      </div>
      <FigureCaption label={label}>{caption}</FigureCaption>
    </figure>
  );
}
function IdeaTries() {
  return (
    <ModuleCard header="Three Tries Before It Looked Like Water">
      <div className="flex flex-col divide-y divide-case-study-module-divider">
        <WideFigure
          src={oryneProtoCanvas}
          alt="The InspireOcean web prototype: note cards scattered on a dotted canvas with a search bar and Add and Rediscover buttons"
          label="Web prototype"
          caption="cards wherever you dropped them, a whiteboard rather than water"
        />
        <WideFigure
          src={oryneWireOceanLayouts}
          alt="Wireframe row: four Ocean layouts side by side, Drift, Cluster, Depth, and Timeline, each as a phone screen"
          label="Wireframes"
          caption="four layouts for the Ocean, from most like water to most legible"
        />
        <div className="bg-surface-inset px-6 py-7 md:px-8 md:py-8">
          <FilmLoop clip={oceanLoop} />
        </div>
      </div>
    </ModuleCard>
  );
}
// Hairline grid: the divider colour shows through the 1px gaps, and each cell
// paints the card surface back over it.
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
export function OryneIdea() {
  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <IdeaTries />
      <VocabularyGrid />
    </div>
  );
}

/* ── 5) Version 1 — the launch film, the 1.0 listing, the releases ─────── */
// The film is media, so it renders the way the design system renders a reel
// on a case study: a poster in the media frame (large radius, secondary wash)
// that opens the video lightbox with sound. The tile's poster is the film's
// opening title card (3.5 s), not its end card: the end card carries an App
// Store badge that would read as a second link. The play disc is the project
// card's corner video glyph at poster size, same material, same corner, so
// it never sits on the title. The click stops at the tile so the page's
// delegated image lightbox never opens the poster too.
const film: LightboxVideo = {
  src: oryneFilm,
  poster: oryneFilmPoster,
  title: "The Oryne film",
  caption: "The version 1 launch film, 80 seconds: catch inspiration before it drifts.",
};
function FilmTile() {
  const [open, setOpen] = useState<LightboxVideo | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const play = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setOpen(film);
  };
  return (
    <figure>
      <button
        type="button"
        onClick={play}
        aria-label="Watch the 80-second film"
        className="group relative block w-full overflow-hidden rounded-2xl bg-secondary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <img src={oryneFilmTilePoster} alt="" width={1920} height={1080} loading="lazy" decoding="async" className="w-full h-auto block" />
        <span
          aria-hidden="true"
          className="absolute left-4 bottom-4 md:left-6 md:bottom-6 flex h-12 w-12 items-center justify-center rounded-full border border-hairline bg-background/75 text-foreground-secondary backdrop-blur-sm transition-colors duration-fast ease-settle group-hover:border-border group-hover:text-foreground"
        >
          <Play className="ml-0.5 h-4 w-4" strokeWidth={2} fill="currentColor" />
        </span>
      </button>
      <FigureCaption label="Launch film">80 seconds of version 1, with sound</FigureCaption>
      <VideoLightbox video={open} onClose={close} />
    </figure>
  );
}
// The 1.0 App Store set, exported 2026-06-28 for the July 2 release (the
// originals are in ~/Documents/Oryne App Store, Frames 1, 2, 8, and 9),
// resized to 900 wide. One frame per tab, in tab order, so the row reads as
// the four-tab app the refocus later took apart. The marketing lines are
// baked into the frames, so each frame carries only its tab name, as a small
// mono label above it, the vocabulary grid's label style.
type ListingFrame = { src: string; alt: string; tab: string };
const listing: ListingFrame[] = [
  { src: oryneAppStoreCapture, alt: "1.0 App Store frame: the Capture tab with a typed thought and Release into the Ocean, titled Never lose a fleeting idea", tab: "Capture" },
  { src: oryneAppStoreOcean, alt: "1.0 App Store frame: the Ocean as a field of named orbs, titled Watch your thinking take shape", tab: "Ocean" },
  { src: oryneAppStoreAsk, alt: "1.0 App Store frame: Ask the Ocean with Search, Synthesis, Expansion, and Research lenses, titled Talk to your second brain", tab: "Ask" },
  { src: oryneAppStoreLibrary, alt: "1.0 App Store frame: the Library as a list grouped by day, titled Every idea, back when you need it", tab: "Library" },
];
export function OryneLaunch() {
  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <FilmTile />
      <ModuleCard header="The 1.0 Listing, One Frame per Tab">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-case-study-module-divider">
          {listing.map((frame) => (
            <figure key={frame.tab} className="flex flex-col gap-3 bg-surface-inset px-4 py-5 md:px-5 md:py-6">
              <figcaption className="text-label uppercase tracking-eyebrow text-foreground-tertiary font-mono text-center">{frame.tab}</figcaption>
              <div className="overflow-hidden rounded-2xl bg-secondary/10">
                <img src={frame.src} alt={frame.alt} width={900} height={1948} loading="lazy" decoding="async" className="w-full h-auto block" />
              </div>
            </figure>
          ))}
        </div>
      </ModuleCard>
    </div>
  );
}

/* ── 5b) Version 1 — the releases, in five rows ─────────────────────────── */
// The July rows are the App Store version history, with 1.1 to 1.5 folded
// into one row because what matters to the story is the pace, not each
// change. The October rows are the two 2.0 builds tagged in the repository
// (Release 2.0 build 1 on 10-19, build 2 with the watch app on 10-20). The
// listing still showed 1.5 when this was written, so the close says prepared,
// not shipped. Do not add a "why" to a row that the history does not say.
const releases = [
  { date: "Jun 9", tag: "First commit", text: "Four tabs by the end of day one: Capture, Ocean, Ask, and Library." },
  { date: "Jul 2", tag: "1.0", text: "On the App Store, 23 days in." },
  { date: "Jul 4–17", tag: "1.1 to 1.5", text: "Five releases in two weeks: currents that breathe, export, a waterfall Library, Chinese and English transcribed on the device." },
  { date: "Oct 19", tag: "2.0", text: "Three tabs, one gesture, Ask as one answer. Built over a weekend." },
  { date: "Oct 20", tag: "2.0 (2)", text: "Oryne on Apple Watch: a whisper from the wrist reaches the phone on its own." },
];
export function OryneReleases() {
  return (
    <ModuleCard>
      <div className="hidden md:grid md:grid-cols-[6rem_7rem_minmax(0,1fr)] px-8 py-4 border-b border-case-study-module-divider">
        <p className="text-label uppercase tracking-eyebrow text-foreground-tertiary font-mono">Date</p>
        <p className={`text-label uppercase tracking-eyebrow text-foreground-tertiary font-mono pl-4 ${TERM_COL_RULE}`}>Release</p>
        <p className={`text-label uppercase tracking-eyebrow text-foreground-tertiary font-mono pl-4 ${TERM_COL_RULE}`}>What changed</p>
      </div>
      <div className="divide-y divide-case-study-module-divider">
        {releases.map((r) => (
          <div key={r.date + r.tag} className="grid grid-cols-[4.5rem_minmax(0,1fr)] md:grid-cols-[6rem_7rem_minmax(0,1fr)] px-6 py-4 md:px-8 md:py-5">
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
  );
}

/* ── 6) The Refocus — the test, 1.5 against 2.0, and the decisions ──────── */
// The story of the page. The phone test is the one principle shown in full,
// quoted from the Calm section of the app's PHILOSOPHY.md as amended on
// 2026-10-17, before any 2.0 code landed. The pairs put a 1.5 screen captured
// in September beside the 2.0 screen captured in October, same frame, same
// size. The decisions are the spec's own list (docs/plans/phone-refocus/
// SPEC.md), in its order and nearly its words; the five shown are the five
// that were built, and the sixth, exits to the desk, stays out because it is
// direction rather than a change a reader can see.
const PHONE_TEST = "Does this need more than a glance or one gesture on a phone? Then it belongs on the desk, and the phone's job is to get the thought there.";
type Pair = { title: string; before: ArtifactItem; after: ArtifactItem };
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
const decisions: GridItem[] = [
  { num: "01", title: "The Ocean Is a Surface, Not a Map", desc: "Tide: today's thought, what drifted in, your currents. No pan, no zoom.", icon: Map, accent: "violet" },
  { num: "02", title: "Capture Is a Bar, Not a Tab", desc: "A field and a disc above the tab bar, like a message composer.", icon: DoorOpen, accent: "emerald" },
  { num: "03", title: "Voice Is a Gesture, Not a Mode", desc: "Hold to whisper, lift to catch, slide up to lock. No picker.", icon: Hand, accent: "slate" },
  { num: "04", title: "The Review Beat Goes Away", desc: "Caught the moment the finger lifts. What remains is Undo.", icon: Undo2, accent: "violet" },
  { num: "05", title: "Ask Stays, as One Mode", desc: "Four lenses become one question and one grounded answer.", icon: MessageCircleQuestion, accent: "emerald" },
  { num: "06", title: "2,179 Lines Fewer", desc: "The map, the Capture tab, the Ask modes, and the review beat left. The Swift came out smaller than it went in.", icon: Ban, accent: "slate" },
];
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
export function OryneRefocus() {
  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <PullQuote>{PHONE_TEST}</PullQuote>
      <ModuleCard header="1.5 Against 2.0">
        <div className="divide-y divide-case-study-module-divider">
          {refocusPairs.map((pair) => (
            <PairRow key={pair.title} pair={pair} />
          ))}
        </div>
      </ModuleCard>
      <CardGrid items={decisions} header="Written Down Before the Code" colsClass="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" />
    </div>
  );
}

/* ── 6b) The material — one pair, the thought page ──────────────────────── */
// The thought page is the one screen both versions share almost item for
// item, so the material change reads without a layout change in the way. The
// rules themselves are in the section copy; the four-card grid that used to
// spell them out went with the trim.
const materialPair: Pair = {
  title: "A thought",
  before: { src: oryneOneThought, alt: "The 1.5 thought page: a glass card with the title, themes as capsules, nearby thoughts in a rendered panel", label: "1.5", caption: "glass panels, capsule tags, and a halo of light" },
  after: { src: oryneThought, alt: "2.0's thought page: one meta line, the title in New York, the words, Themes, Nearby with a Summarize button, and Grow a branch and Ask Ocean at the bottom", label: "2.0", caption: "text on the water, one order for every kind, type doing the grouping" },
};
export function OryneMaterial() {
  return (
    <ModuleCard>
      <PairRow pair={materialPair} />
    </ModuleCard>
  );
}

/* ── 6c) The usability test — three fixed, three open ───────────────────── */
// From docs/plans/phone-refocus/USABILITY-2026-10-18.md in the app repository,
// cut to the three findings on each side that a reader can picture. The
// testers were agents driving simulators, which the section copy says
// plainly; nobody human has run 2.0 yet. The two blockers lead the open list.
const fixed = [
  "Undo lost the tap to the tab bar: now one centered toast for the whole undo window.",
  "The save phrase rotated among four lines: now one, Carried into the sea.",
  "Destructive confirms anchored to the wrong control with no Cancel: every one is the centered system alert.",
];
const open = [
  "A deleted thought is gone for good: no undo, no recently deleted.",
  "Ask cannot reliably re-find the user's own idea.",
  "Hold-to-whisper cannot be discovered from the screen.",
];
function FindingList({ icon: Icon, tone, label, items }: { icon: typeof Check; tone: string; label: string; items: string[] }) {
  return (
    <div className="bg-surface-inset px-6 py-6 md:px-8 md:py-7">
      <div className="flex items-center gap-2">
        <Icon aria-hidden="true" className={`h-3.5 w-3.5 shrink-0 ${tone}`} strokeWidth={1.6} />
        <p className="text-label uppercase tracking-eyebrow text-foreground-secondary font-mono">{label}</p>
      </div>
      <ul className="mt-4 flex flex-col gap-3">
        {items.map((f) => (
          <li key={f} className="text-sm md:text-base font-light leading-relaxed text-foreground-secondary">{noOrphan(f)}</li>
        ))}
      </ul>
    </div>
  );
}
export function OryneUsability() {
  return (
    <ModuleCard>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-case-study-module-divider">
        <FindingList icon={Check} tone="text-success" label="Fixed in the pass that followed" items={fixed} />
        <FindingList icon={AlertTriangle} tone="text-accent-violet/70" label="Still open, the two blockers first" items={open} />
      </div>
    </ModuleCard>
  );
}

/* ── 7) Final Design — one thought, six screens ───────────────────────── */
// The whole product as six screens, two across, in the order a thought meets
// them. Each is a real screen from the 2.0 build and the caption says what
// happens on it. Step 01 shows the simulator's listening state; a simulator
// hears no speech, so the line under the disc is the app's own "Words will
// follow." rather than live words, and the caption stays honest about what
// the still can show. Six, not sixteen: the entry points, onboarding, Nearby,
// the Library menu, and Summarize were cut for weight, and a current opening
// and Ask answering are already on the page, in the walkthrough and in the
// 1.5-against-2.0 pairs. Two columns, not four: at the reading width a
// four-across phone is a thumbnail and its caption wraps a word per line.
type FlowStep = ArtifactItem & { num: string; title: string };
const flow: FlowStep[] = [
  { num: "01", title: "Hold", src: oryneWhisperHold, alt: "The capture bar while the disc is held: an X at the leading end, the line Words will follow, and the disc showing level bars", label: "Whisper", caption: "hold the disc and the phone listens; lift, and the whisper is caught" },
  { num: "02", title: "Let go", src: oryneToast, alt: "Tide after a release: a toast reading Carried into the sea with an Undo, and the new thought already under Drifted in", label: "Carried into the sea", caption: "saved before anything says so, then ten seconds to undo" },
  { num: "03", title: "Name", src: oryneThought, alt: "The thought's page: Thought, 47 seconds ago, Light And Color, the title Warmth turns slow room in New York, the words, three themes, and Nearby", label: "Thought", caption: "the device names it, finds its themes, and places it in a current" },
  { num: "04", title: "Return", src: oryneTide, alt: "Tide: Resurfacing, a thought from three weeks ago with its picture, Nearby and Let it rest, then Drifted in and the capture bar", label: "Tide", caption: "the home page: what came back today, what drifted in, your currents" },
  { num: "05", title: "Find", src: oryneLibrary, alt: "The Library sorted by Related: a masonry of cards with the newest thought first beside its sunset neighbours", label: "Library", caption: "a waterfall of cards, by time or by meaning" },
  { num: "06", title: "The Wrist", src: oryneWatchCaught, alt: "The Oryne watch app after a whisper: a check mark, Caught, and an Undo button", label: "Apple Watch", caption: "press, speak, lift; the whisper reaches the phone on its own" },
];
function FlowStepFigure({ step }: { step: FlowStep }) {
  return (
    <div className="flex h-full flex-col bg-surface-inset px-6 py-7 md:px-8 md:py-8">
      <div className="flex items-baseline gap-3">
        <span className="text-caption font-mono tabular-nums text-accent-violet/70">{step.num}</span>
        <p className="text-base md:text-xl font-medium text-foreground">{step.title}</p>
      </div>
      {/* The phones share a top edge under their titles; the caption starts
          right under each phone, and any spare height falls into the cell's
          bottom padding. Do not pin the caption to the bottom with mt-auto. */}
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
    <ModuleCard>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-case-study-module-divider">
        {flow.map((step) => (
          <FlowStepFigure key={step.num} step={step} />
        ))}
      </div>
    </ModuleCard>
  );
}

/* ── 8) Privacy — on the device, as a design position ───────────────────── */
const privacyItems: GridItem[] = [
  { num: "01", title: "On-Device Intelligence", desc: "Apple’s Foundation Models name, theme, relate, summarize, and answer.", icon: Cpu, accent: "violet" },
  { num: "02", title: "Local Speech", desc: "Transcription on the phone, in both languages. A bilingual take runs both ways and the better one wins.", icon: AudioLines, accent: "emerald" },
  { num: "03", title: "Your Own iCloud", desc: "Private CloudKit sync, phone to watch to phone. No server I can read.", icon: Cloud, accent: "slate" },
];
export function OrynePrivacy() {
  return <CardGrid items={privacyItems} colsClass="grid-cols-1 sm:grid-cols-3" />;
}

/* ── 9) What the Ocean Taught Me — takeaways + closing CTA ──────────────── */
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
