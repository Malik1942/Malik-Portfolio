import rangerStep1 from "@/assets/ranger-step-1.webp";
import rangerStep2 from "@/assets/ranger-step-2.webp";
import rangerStep3 from "@/assets/ranger-step-3.webp";
import rangerStep4 from "@/assets/ranger-step-4.webp";
import rangerStep5 from "@/assets/ranger-step-5.webp";
import rangerStep6 from "@/assets/ranger-step-6.webp";
import { ModuleCard } from "./MotiModules";
import { FigureCaption } from "./FigureCaption";
import { noOrphan } from "@/lib/noOrphan";

/**
 * RANGER's capture sequence, one step per cell.
 *
 * The six panels are cropped out of the original usage board (ranger-usage.webp,
 * kept in assets as the source). The board carried its own baked-in text, which
 * meant the one part of the project that has to be understood step by step was
 * delegated to type inside a JPEG: unsearchable, unselectable, and written in a
 * different voice from the page around it. Cropping the illustrations out and
 * captioning them here puts the sequence back in the case study's own words.
 *
 * Same construction as MotiWorkflow: a ModuleCard, then a hairline grid of
 * numbered cells, each with its figure and a "Label: clause" caption.
 */
type Step = { num: string; title: string; src: string; alt: string; caption: string };

const steps: Step[] = [
  {
    num: "01",
    title: "Go to the Hotspot",
    src: rangerStep1,
    alt: "A collection ship above a seabed net, beside a phone showing the ghost gear map",
    caption: "a collection ship drops RANGER where the platform map says gear has piled up",
  },
  {
    num: "02",
    title: "Search",
    src: rangerStep2,
    alt: "RANGER sweeping sonar over the seabed with fish and a net nearby",
    caption: "sonar and cameras run until something reads as gear rather than seabed",
  },
  {
    num: "03",
    title: "Measure the Mesh",
    src: rangerStep3,
    alt: "RANGER lighting the net with its searchlights to measure the mesh",
    caption: "the sensors find the center of the net, because the mesh size decides the cartridge",
  },
  {
    num: "04",
    title: "Launch",
    src: rangerStep4,
    alt: "RANGER firing an inert cartridge toward an opening in the mesh",
    caption: "a cartridge sized to that mesh is fired at the center of the net",
  },
  {
    num: "05",
    title: "Inflate",
    src: rangerStep5,
    alt: "The cartridge inflating into an orange bag on the far side of the mesh",
    caption: "sodium azide makes nitrogen on arrival, and an inflated bag cannot come back through",
  },
  {
    num: "06",
    title: "Let It Rise",
    src: rangerStep6,
    alt: "The inflated bag lifting the net toward a waiting ship at the surface",
    caption: "the bag lifts the net behind a marker while RANGER goes back to searching",
  },
];

export function RangerSequence() {
  return (
    <ModuleCard header="Six Steps, One Cartridge Each">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-case-study-module-divider">
        {steps.map((step) => (
          <div key={step.num} className="flex h-full flex-col bg-surface-inset px-6 py-7 md:px-7 md:py-8">
            <div className="flex items-baseline gap-3">
              <span className="text-caption font-mono tabular-nums text-accent-violet/70">{step.num}</span>
              <p className="text-base md:text-xl font-medium text-foreground">{noOrphan(step.title)}</p>
            </div>
            <figure className="mt-5 flex flex-1 flex-col">
              <div className="overflow-hidden rounded-2xl">
                <img src={step.src} alt={step.alt} loading="lazy" decoding="async" className="w-full h-auto block" />
              </div>
              {/* mt-auto: captions sit on one baseline across a row, as in MotiWorkflow. */}
              <div className="mt-auto">
                <FigureCaption>{step.caption}</FigureCaption>
              </div>
            </figure>
          </div>
        ))}
      </div>
    </ModuleCard>
  );
}
