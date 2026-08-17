import moodmuseBrushViews from "@/assets/moodmuse-brush-views.webp";
import moodmuseSensorFace from "@/assets/moodmuse-sensor-face.webp";
import moodmuseUiInsights from "@/assets/moodmuse-ui-insights.webp";
import { Chips, PullQuote } from "./MotiModules";

// Mood Muse's case-study hook — same shape as ZEAT's and Aura's (highlight
// chips → pull-quote → artifact gallery). The gallery images reappear in
// their own sections below; the hook is the skim layer.
//
// Claim discipline, same as ZEAT's: each chip names something the brush
// actually does. "Arousal", not "emotion" — GSR and heart rate read arousal
// well and valence poorly, which the Reflection says out loud. Scent fires on
// a positive state, not on CALM specifically; CALM is one of the four inks.
const highlights = [
  "Reads arousal through the grip",
  "Shifts ink color with the mood",
  "Rewards a positive turn with scent",
  "Turns a painting into a mood record",
  "Connects parent and therapist",
];

const artifacts = [
  {
    src: moodmuseBrushViews,
    alt: "Side view of the white brush, a translucent view of its motor, board, battery and ink tubes, and the four ink cartridges",
    caption: "Outside, inside, and the four inks the motor switches between",
  },
  {
    src: moodmuseSensorFace,
    alt: "The brush's sensing window: an oval recess labelled GSR SENSOR set into the white body",
    caption: "Where the hand lands — the window that reads arousal while the child paints",
    narrow: true,
  },
  {
    src: moodmuseUiInsights,
    alt: "Three Mood Connect screens: an emotion-state ring, the memory slider of past paintings, and an emotion analysis breakdown",
    caption: "Mood Connect — where a session becomes something a parent and therapist can read",
  },
];

// `narrow` holds a portrait figure to a sane width — full-bleed, the sensing
// window would tower over the two landscape artifacts either side of it.
function MoodMuseArtifact({ src, alt, caption, narrow }: { src: string; alt: string; caption: string; narrow?: boolean }) {
  return (
    <figure className={narrow ? "mx-auto w-full max-w-[420px]" : undefined}>
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
