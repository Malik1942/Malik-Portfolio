import moodmuseBrushViews from "@/assets/moodmuse-brush-views.webp";
import moodmuseSensorFace from "@/assets/moodmuse-sensor-face.webp";
import moodmuseErgonomic from "@/assets/moodmuse-ergonomic.webp";
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
// "Mid-session" is load-bearing on the last chip: the brush pairs and is
// configured from the app, it just asks nothing of the child while painting.
const highlights = [
  "Reads arousal through the grip",
  "Shifts ink color with the mood",
  "Rewards a positive turn with scent",
  "Turns a painting into a mood record",
  "Connects parent and therapist",
  "Needs no button mid-session",
];

// Rows, not a flat list: the sensing window and the hand map are one argument
// (the sensor sits where the hand already presses), so they run two-up.
const rows = [
  [
    {
      src: moodmuseBrushViews,
      alt: "Side view of the white brush, a translucent view of its motor, board, battery and ink tubes, and the four ink cartridges",
      caption: "Outside, inside, and the four inks the motor switches between",
    },
  ],
  [
    {
      src: moodmuseSensorFace,
      alt: "The brush's sensing window: an oval recess labelled GSR SENSOR set into the white body",
      caption: "The sensing window, set into the face of the grip",
    },
    {
      src: moodmuseErgonomic,
      alt: "An open child's palm marked with Pressure Zone 1 across the fingers, Pressure Zone 2 on the little finger, and the heart rate and GSR sensor detection areas on the pad below the fingers",
      caption: "Mapped to the hand — the two pressure zones double as the sensor contacts",
    },
  ],
  [
    {
      src: moodmuseUiInsights,
      alt: "Three Mood Connect screens: an emotion-state ring, the memory slider of past paintings, and an emotion analysis breakdown",
      caption: "Mood Connect — where a session becomes something a parent and therapist can read",
    },
  ],
];

// In a pair row the two images are matched on height, not width — the window
// is portrait and the hand map is square, so sizing them by width would leave
// the captions staggered by a third of an image.
function MoodMuseArtifact({ src, alt, caption, paired }: { src: string; alt: string; caption: string; paired?: boolean }) {
  return (
    <figure className="min-w-0 flex-1">
      <div className="overflow-hidden rounded-2xl bg-secondary/10 flex items-center justify-center">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={paired ? "h-[260px] md:h-[320px] w-auto max-w-full block" : "w-full h-auto block"}
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
        {rows.map((row) => (
          // A pair row stacks on mobile and matches image heights on desktop.
          <div key={row[0].src} className="flex flex-col sm:flex-row gap-8 sm:gap-6 md:gap-8">
            {row.map((a) => (
              <MoodMuseArtifact key={a.src} {...a} paired={row.length > 1} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MoodMuseHighlights;
