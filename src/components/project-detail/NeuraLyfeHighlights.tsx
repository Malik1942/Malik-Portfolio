import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import neuralyfeRoster from "@/assets/neuralyfe-roster.mp4";
import neuralyfeBrain from "@/assets/neuralyfe-brain.mp4";
import neuralyfeReplay from "@/assets/neuralyfe-replay.mp4";
import neuralyfeHalo from "@/assets/neuralyfe-halo.mp4";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Chips, PullQuote } from "./MotiModules";
import { FigureCaption } from "./FigureCaption";
import { noOrphan } from "@/lib/noOrphan";

// NeuraLyfe's case-study hook — mirrors Moti's / Aura's hook (highlight chips →
// pull-quote → artifact gallery). NeuraLyfe's artifacts are its interactive
// screens, so the gallery autoplays the four product videos stacked one per row,
// each a full-width main visual at its natural landscape ratio (no crop). Copy is
// drawn from the case study + the Devpost submission.
const highlights = [
  "CTE in 91% of examined NFL players",
  "Cumulative impact, not just big hits",
  "Halo: EEG · biomarkers · impact camera",
  "Roster → Brain → Impact Replay",
];

// width/height are the encoded frame size of each clip. They reserve the box at
// the clip's exact ratio before any bytes arrive, so the page never reflows as
// the videos come in.
const artifacts = [
  { src: neuralyfeRoster, width: 1396, height: 1080, label: "Roster View", caption: "triage the whole team at a glance" },
  { src: neuralyfeBrain, width: 1472, height: 1080, label: "Brain View", caption: "where neurological stress is building" },
  { src: neuralyfeReplay, width: 1636, height: 1080, label: "Impact Replay", caption: "trace an alert back to the play" },
  { src: neuralyfeHalo, width: 1920, height: 1200, label: "Halo", caption: "the sensing layer of EEG, biomarkers, and an impact camera" },
];

// The four clips add up to ~13 MB. With `autoPlay` on the elements they all began
// downloading the moment the page mounted — before the hero image, before the
// copy — for a gallery that sits well below the fold.
//
// They are no longer on that critical path, but they are NOT left to load only
// when you reach them: fetching a 7 MB clip as its box crosses the fold means
// arriving at a grey rectangle, or at a reel that stalls part-way through, which
// is a worse gallery than the one that cost a slow first paint. So the clips are
// warmed as soon as the page itself has finished loading and the main thread
// goes idle — several viewports and several seconds before anyone scrolls to
// them — and the near-viewport trigger below is only the backstop for a visitor
// who gets there first. Muted playback can be started from script, so `autoPlay`
// on the element is not needed.
function NeuraLyfeArtifact({
  src,
  width,
  height,
  label,
  caption,
}: {
  src: string;
  width: number;
  height: number;
  label: string;
  caption: string;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const near = useInView(boxRef, { margin: "100% 0px 100% 0px" });
  const onScreen = useInView(boxRef);

  // Latched: once the src is attached it stays attached, so scrolling back up
  // past a clip does not tear down a video that is mid-loop.
  const [fetchVideo, setFetchVideo] = useState(false);
  useEffect(() => {
    if (near || onScreen) setFetchVideo(true);
  }, [near, onScreen]);

  // Warm-up, once the page has loaded and the main thread is free. `load` has
  // already fired by the time this route's chunk mounts on a direct visit, hence
  // the readyState check as well as the listener.
  useEffect(() => {
    let cancel = () => {};
    const warm = () => setFetchVideo(true);
    const schedule = () => {
      if (typeof window.requestIdleCallback === "function") {
        const handle = window.requestIdleCallback(warm, { timeout: 3000 });
        cancel = () => window.cancelIdleCallback?.(handle);
      } else {
        const handle = window.setTimeout(warm, 1000);
        cancel = () => window.clearTimeout(handle);
      }
    };

    if (document.readyState === "complete") {
      schedule();
    } else {
      window.addEventListener("load", schedule, { once: true });
      cancel = () => window.removeEventListener("load", schedule);
    }
    return () => cancel();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !fetchVideo || !onScreen || !video.paused) return;
    video.play().catch(() => {});
  }, [fetchVideo, onScreen]);

  return (
    <figure>
      <div
        ref={boxRef}
        className="overflow-hidden rounded-2xl bg-secondary/10"
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        <video
          ref={videoRef}
          src={fetchVideo ? src : undefined}
          width={width}
          height={height}
          loop
          muted
          playsInline
          preload="auto"
          aria-label={label}
          className="w-full h-auto block"
        />
      </div>
      <FigureCaption label={label}>{caption}</FigureCaption>
    </figure>
  );
}

export function NeuraLyfeHighlights() {
  return (
    <div className="flex flex-col gap-stack">
      <Chips items={highlights} />
      <PullQuote>Invisible problems require visible systems.</PullQuote>
      <div className="flex flex-col gap-12 md:gap-16">
        {artifacts.map((a) => (
          <NeuraLyfeArtifact key={a.src} {...a} />
        ))}
      </div>
    </div>
  );
}

// ── Two forks ─────────────────────────────────────────────────────────────────
// The two decisions that fixed the shape of the system before any screen
// existed: where the sensing lives, and who acts on what it finds. Each card
// lists the options we weighed; the one we took sits at full ink with a mark,
// the rest at secondary. Same card grammar as Aura's ideation criteria.
const forks = [
  {
    title: "Where the sensing lives",
    options: [
      { name: "Forehead patch", why: "reads like science fiction, and every player would have to be talked into wearing one" },
      { name: "Wrist or limb band", why: "too far from the injury to say anything about the brain" },
      { name: "Helmet add-on", why: "on equipment every player already wears, and localised to where the damage happens", chosen: true },
    ],
  },
  {
    title: "Who acts on it",
    options: [
      { name: "The player", why: "self-reporting fails by design when the person with the most reason to stay in controls the diagnosis" },
      { name: "Medical staff", why: "the one actor with the authority to pull a player and no incentive to keep them on the field", chosen: true },
    ],
  },
];

export function NeuraLyfeForks() {
  return (
    <div className="rounded-2xl overflow-hidden bg-surface-inset border border-case-study-module-border">
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-case-study-module-divider">
        {forks.map((fork) => (
          <div key={fork.title} className="flex flex-col gap-5 px-6 py-7 md:px-7 md:py-8">
            <p className="text-caption font-mono uppercase tracking-eyebrow text-foreground-tertiary">
              {fork.title}
            </p>
            <ul className="flex flex-col gap-4">
              {fork.options.map((o) => (
                <li key={o.name} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${o.chosen ? "bg-foreground" : "bg-foreground-quiet"}`}
                  />
                  <p className={`text-sm md:text-base leading-relaxed ${o.chosen ? "text-foreground" : "text-foreground-secondary font-light"}`}>
                    {o.chosen ? <span className="font-mono text-caption uppercase tracking-eyebrow text-foreground-tertiary">Chosen · </span> : null}
                    <span className={o.chosen ? "font-medium" : "font-normal"}>{o.name}</span>
                    <span>: {o.why}</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── The protocol ──────────────────────────────────────────────────────────────
// Five states a player can be in, read left to right, and the two rules that
// keep the last one honest. The ladder is the part of the system that turns a
// signal into a call someone has to stand behind.
const states = ["Baseline", "Spike", "Elevated", "Critical", "Removed"];
const rules = [
  { title: "The data is the player's", body: "It travels with them across teams and into retirement, not with the franchise." },
  { title: "Removal cannot be overridden", body: "A Critical alert is not advisory. Nobody on the sideline can suppress it." },
];

export function NeuraLyfeProtocol() {
  return (
    <div className="rounded-2xl overflow-hidden bg-surface-inset border border-case-study-module-border">
      {/* Below sm the five states stack as a list: five columns at 390px clip
          the last word. From sm up they read left to right as a ladder. */}
      <ol className="grid grid-cols-1 sm:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-case-study-module-divider border-b border-case-study-module-divider">
        {states.map((state, i) => (
          <li key={state} className="flex flex-row items-baseline gap-4 px-6 py-3 sm:flex-col sm:gap-2 sm:px-6 sm:py-6">
            <span className={`text-caption font-mono tabular-nums ${i >= 3 ? "text-accent-violet/[0.6]" : "text-foreground-tertiary"}`}>
              0{i + 1}
            </span>
            <span className={`text-sm md:text-base tracking-tight ${i >= 3 ? "text-foreground font-medium" : "text-foreground-secondary font-normal"}`}>
              {state}
            </span>
          </li>
        ))}
      </ol>
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-case-study-module-divider">
        {rules.map((r) => (
          <div key={r.title} className="flex flex-col gap-2 px-6 py-6 md:px-7 md:py-7">
            <p className="text-base md:text-xl font-medium text-foreground leading-snug tracking-tight">{noOrphan(r.title)}</p>
            <p className="text-sm md:text-base font-light text-foreground-secondary leading-relaxed">{noOrphan(r.body)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Impact ────────────────────────────────────────────────────────────────────
// The outcome as four tiles a reader can take in without parsing a sentence:
// the placing, the field it was placed in, and the prize. The figures are the
// FigBuild 2026 numbers (rules page on Devpost for the field and prize; the
// builder count from Cindy Ly's write-up of the event). Under them, what the judges
// recognised, as chips rather than a paragraph, in a teammate's plain account.
const impactTiles = [
  { label: "Result", figure: "1st", detail: "Place, FigBuild 2026" },
  { label: "Field", figure: "690", detail: "Teams entered" },
  { label: "Builders", figure: "2,184", detail: "People competing" },
  { label: "Prize", figure: "$10,000", detail: "Grand prize" },
];
const judgesNoted = ["Visuals", "The film", "Storytelling", "The 3D-printed Halo"];

export function NeuraLyfeImpact() {
  return (
    <div className="rounded-2xl overflow-hidden bg-surface-inset border border-case-study-module-border">
      <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-case-study-module-divider [&>*:nth-child(odd)]:border-r md:[&>*:nth-child(odd)]:border-r-0 [&>*:nth-child(-n+2)]:border-t-0">
        {impactTiles.map((t) => (
          <div key={t.label} className="flex flex-col gap-3 px-6 py-6 md:px-7 md:py-8 border-case-study-module-divider">
            <p className="text-caption font-mono uppercase tracking-eyebrow text-foreground-tertiary">{t.label}</p>
            <p className="text-title md:text-heading font-light leading-none tracking-tight tabular-nums text-foreground">{t.figure}</p>
            <p className="text-sm md:text-base font-light text-foreground-secondary leading-relaxed">{t.detail}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-4 px-6 py-6 md:px-7 md:py-7 border-t border-case-study-module-divider">
        <p className="text-caption font-mono uppercase tracking-eyebrow text-foreground-tertiary">What the judges recognised</p>
        <Chips items={judgesNoted} />
      </div>
    </div>
  );
}

// ── Links ─────────────────────────────────────────────────────────────────────
// The Devpost submission the judges scored gets the filled pill, the one live
// link on the page; the film Cindy cut for it sits beside it as the bordered
// control. Same pair of tones as the utility pages.
const NEURALYFE_DEVPOST_URL = "https://devpost.com/software/neuralyfe";
const NEURALYFE_FILM_URL = "https://www.youtube.com/watch?v=yO55s9Qtra8";
export function NeuraLyfeLinks() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
      <Button href={NEURALYFE_DEVPOST_URL} external icon={<ArrowUpRight strokeWidth={1.8} />}>
        View the submission on Devpost
      </Button>
      <Button tone="secondary" href={NEURALYFE_FILM_URL} external icon={<ArrowUpRight strokeWidth={1.8} />}>
        Watch the film
      </Button>
    </div>
  );
}
