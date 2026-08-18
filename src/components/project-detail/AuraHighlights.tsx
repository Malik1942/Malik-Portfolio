import auraScene4 from "@/assets/aura-scene-4.webp";
import auraBud1 from "@/assets/aura-bud-1.webp";
import auraApp1 from "@/assets/Aura-app-1.webp";
import auraSystem1 from "@/assets/aura-system-1.webp";
import { Chips, PullQuote } from "./MotiModules";
import { noOrphan } from "@/lib/noOrphan";

// Aura's case-study hook — mirrors Moti's / NeuraLyfe's hook (highlight chips →
// pull-quote → artifact gallery). Copy is drawn from Aura's own text. The gallery
// stacks the four artifacts one per row, each a full-width main visual at its
// natural ratio (no crop), so nothing is cut off.
const highlights = [
  "Proactive, not reactive",
  "Sense → predict → support",
  "100 Hz audio intervention",
  "93.75% preferred the refined form",
];

const artifacts = [
  {
    src: auraScene4,
    alt: "Aura in-flight support scene",
    caption: "Proactive support, in the moment it matters most",
  },
  {
    src: auraBud1,
    alt: "Aura Buds product render",
    caption: "Aura Buds — sensing and 100 Hz audio in a familiar form",
  },
  {
    src: auraApp1,
    alt: "Aura app interface showing setup, trip context, support preferences, and at-a-glance status",
    caption: "The app — quiet preparation and at-a-glance status",
  },
  {
    src: auraSystem1,
    alt: "Aura system architecture",
    caption: "The adaptive system — sensing, prediction, and support working as one",
  },
];

function AuraArtifact({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <figure>
      <div className="overflow-hidden rounded-2xl bg-secondary/10">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="w-full h-auto block"
        />
      </div>
      <figcaption className="mt-5 md:mt-6 text-base md:text-xl text-foreground text-center leading-relaxed">
        {noOrphan(caption)}
      </figcaption>
    </figure>
  );
}

export function AuraHighlights() {
  return (
    <div className="flex flex-col gap-10 md:gap-12">
      <Chips items={highlights} />
      <PullQuote>If Aura waited until you felt sick, it was already too late.</PullQuote>
      <div className="flex flex-col gap-12 md:gap-16">
        {artifacts.map((a) => (
          <AuraArtifact key={a.src} {...a} />
        ))}
      </div>
    </div>
  );
}

export default AuraHighlights;
