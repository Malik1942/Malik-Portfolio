import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import neuralyfeRoster from "@/assets/neuralyfe-roster.mp4";
import neuralyfeBrain from "@/assets/neuralyfe-brain.mp4";
import neuralyfeReplay from "@/assets/neuralyfe-replay.mp4";
import neuralyfeHalo from "@/assets/neuralyfe-halo.mp4";
import { Chips, PullQuote } from "./MotiModules";
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
  { src: neuralyfeRoster, width: 1396, height: 1080, label: "Roster View", caption: "Roster View — triage the whole team at a glance" },
  { src: neuralyfeBrain, width: 1472, height: 1080, label: "Brain View", caption: "Brain View — where neurological stress is building" },
  { src: neuralyfeReplay, width: 1636, height: 1080, label: "Impact Replay", caption: "Impact Replay — trace an alert back to the play" },
  { src: neuralyfeHalo, width: 1920, height: 1200, label: "Halo", caption: "Halo — the sensing layer: EEG, biomarkers, impact camera" },
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
      <figcaption className="mt-5 md:mt-6 text-base md:text-xl text-foreground text-center leading-relaxed">
        {noOrphan(caption)}
      </figcaption>
    </figure>
  );
}

export function NeuraLyfeHighlights() {
  return (
    <div className="flex flex-col gap-10 md:gap-12">
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

export default NeuraLyfeHighlights;
