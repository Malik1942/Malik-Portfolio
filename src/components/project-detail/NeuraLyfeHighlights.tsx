import neuralyfeRoster from "@/assets/neuralyfe-roster.mp4";
import neuralyfeBrain from "@/assets/neuralyfe-brain.mp4";
import neuralyfeReplay from "@/assets/neuralyfe-replay.mp4";
import neuralyfeHalo from "@/assets/neuralyfe-halo.mp4";
import { Chips, PullQuote } from "./MotiModules";

// NeuraLyfe's case-study hook — mirrors Moti's / Aura's hook (highlight chips →
// pull-quote → artifact gallery). NeuraLyfe's artifacts are its interactive
// screens, so the gallery autoplays the four product videos in uniform 16:9
// frames. Copy is drawn from the case study + the Devpost submission.
const highlights = [
  "CTE in 91% of examined NFL players",
  "Cumulative impact, not just big hits",
  "Halo: EEG · biomarkers · impact camera",
  "Roster → Brain → Impact Replay",
];

const artifacts = [
  { src: neuralyfeRoster, label: "Roster View", caption: "Roster View — triage the whole team at a glance" },
  { src: neuralyfeBrain, label: "Brain View", caption: "Brain View — where neurological stress is building" },
  { src: neuralyfeReplay, label: "Impact Replay", caption: "Impact Replay — trace an alert back to the play" },
  { src: neuralyfeHalo, label: "Halo", caption: "Halo — the sensing layer: EEG, biomarkers, impact camera" },
];

function NeuraLyfeArtifact({ src, label, caption }: { src: string; label: string; caption: string }) {
  return (
    <figure>
      <div className="overflow-hidden rounded-2xl bg-secondary/10 aspect-[3/2]">
        <video
          src={src}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-label={label}
          className="w-full h-full object-contain object-center"
        />
      </div>
      <figcaption className="mt-3 text-[13px] md:text-[14px] text-foreground/55 text-body leading-relaxed">
        {caption}
      </figcaption>
    </figure>
  );
}

export function NeuraLyfeHighlights() {
  return (
    <div className="flex flex-col gap-10 md:gap-12">
      <Chips items={highlights} />
      <PullQuote>Invisible problems require visible systems.</PullQuote>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
        {artifacts.map((a) => (
          <NeuraLyfeArtifact key={a.src} {...a} />
        ))}
      </div>
    </div>
  );
}

export default NeuraLyfeHighlights;
