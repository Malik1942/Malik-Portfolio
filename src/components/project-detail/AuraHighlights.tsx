import auraCover from "@/assets/aura-cover.png";
import auraBud1 from "@/assets/aura-bud-1.png";
import auraApp1 from "@/assets/Aura-app-1.png";
import auraBud2 from "@/assets/aura-bud-2.png";
import { Chips, PullQuote, ArtifactGallery } from "./MotiModules";

// Aura's case-study hook — mirrors Moti's hook (highlight chips → pull-quote →
// artifact gallery), reusing the same primitives. No App Store CTA: Aura is a
// speculative concept, not a shipped product. Copy is drawn from Aura's own text.
const highlights = [
  "Proactive, not reactive",
  "Sense → predict → support",
  "100 Hz audio intervention",
  "93.75% preferred the refined form",
];

const artifacts = [
  {
    src: auraCover,
    alt: "Aura in-flight: earbuds and companion app supporting a motion-sensitive traveler",
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
    src: auraBud2,
    alt: "Aura Buds detail",
    caption: "Familiar enough for travel, with a reason to exist beyond earbuds",
  },
];

export function AuraHighlights() {
  return (
    <div className="flex flex-col gap-10 md:gap-12">
      <Chips items={highlights} />
      <PullQuote>If Aura waited until you felt sick, it was already too late.</PullQuote>
      <ArtifactGallery items={artifacts} />
    </div>
  );
}

export default AuraHighlights;
