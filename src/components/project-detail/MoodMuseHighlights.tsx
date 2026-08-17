import moodmuseSensorFace from "@/assets/moodmuse-sensor-face.webp";
import { Chips, PullQuote } from "./MotiModules";

// Mood Muse's case-study hook — chips → pull-quote → one artifact. ZEAT and
// Aura repeat their section imagery up here as a skim layer; this page has a
// denser gallery below, so the hook carries a single image that appears
// nowhere else, and every other figure is shown exactly once in its section.
const highlights = [
  "Senses arousal through the grip",
  "Shifts ink color with the child's state",
  "Rewards calm with scent",
  "Turns a painting into a mood record",
  "Connects parent and therapist",
];

const artifacts = [
  {
    src: moodmuseSensorFace,
    alt: "Macro view of the brush's sensing window, an oval recess labelled GSR SENSOR set into the white body",
    caption: "Where the hand lands — the window that reads arousal while the child paints",
  },
];

function MoodMuseArtifact({ src, alt, caption }: { src: string; alt: string; caption: string }) {
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
        {caption}
      </figcaption>
    </figure>
  );
}

export function MoodMuseHighlights() {
  return (
    <div className="flex flex-col gap-10 md:gap-12">
      <Chips items={highlights} />
      <PullQuote>A child who can&rsquo;t say the feeling can still paint it. The brush listens to the hand.</PullQuote>
      <div className="flex flex-col gap-12 md:gap-16">
        {artifacts.map((a) => (
          <MoodMuseArtifact key={a.src} {...a} />
        ))}
      </div>
    </div>
  );
}

export default MoodMuseHighlights;
