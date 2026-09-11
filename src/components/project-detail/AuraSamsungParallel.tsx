import { FigureCaption } from "./FigureCaption";
import auraBudsPair from "@/assets/aura-buds-pair.webp";
import samsungBuds4Pro from "@/assets/samsung-buds4-pro-1.webp";
import hearapyStart from "@/assets/samsung-hearapy-start.webp";
import hearapyTimer from "@/assets/samsung-hearapy-timer.webp";
import hearapySettings from "@/assets/samsung-hearapy-settings.webp";

// The visual half of the Samsung argument. The pair puts the Aura buds next to
// the Galaxy Buds4 Pro at the same 4:3 crop so the reader sees the form
// factor converge before the table says so; the screens underneath are the
// Hearapy app itself, the intervention Samsung shipped. Every Samsung image is
// Samsung's own: the buds from its Galaxy Unpacked 2026 press kit, the screens
// from the Hearapy listing on Google Play, credited in the captions.
//
// aura-buds-pair is Malik's two-bud render set on a light studio ground whose
// tone is sampled from the Samsung backdrop, so the two panels sit at the same
// brightness instead of a dark render beside a white photograph.
const pair = [
  {
    src: auraBudsPair,
    alt: "Aura Buds render: two white earbuds, one showing the flat metal stem with its light strip, the other the rounded in-ear body",
    label: "Aura Buds, Fall 2025",
    caption: "the bar-oriented pair we refined for stability and room for a low-frequency driver",
  },
  {
    src: samsungBuds4Pro,
    alt: "Samsung Galaxy Buds4 Pro press photo: two white stem-style earbuds in front of their open case",
    label: "Galaxy Buds4 Pro, 2026",
    caption: "the earbud Samsung tuned to reproduce the 100 Hz tone, press image by Samsung",
  },
];

// Three phones across at 390px are unreadable, so below sm only the first two
// screens show (start, and the tone running). The settings screen returns at sm.
const screens = [
  { src: hearapyStart, alt: "Hearapy start screen: a large circle reading tap here to start" },
  { src: hearapyTimer, alt: "Hearapy running: a 60-second countdown at 51 seconds with a stop control" },
  { src: hearapySettings, alt: "Hearapy settings: playback duration, a headphone check, and a note on why the 100 Hz tone works", hideOnMobile: true },
];

const FRAME = "overflow-hidden rounded-2xl bg-surface-wash";

export function AuraSamsungParallel() {
  return (
    <div className="flex flex-col gap-stack">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-9 md:gap-x-8 md:gap-y-12">
        {pair.map((f) => (
          <figure key={f.src} className="flex flex-col">
            <div className={FRAME}>
              <img src={f.src} alt={f.alt} loading="lazy" decoding="async" className="w-full h-auto block" />
            </div>
            {/* mt-auto: captions of unequal length still sit on one baseline. */}
            <div className="mt-auto">
              <FigureCaption label={f.label}>{f.caption}</FigureCaption>
            </div>
          </figure>
        ))}
      </div>

      <figure>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-5">
          {screens.map((s) => (
            <div key={s.src} className={`${FRAME} ${s.hideOnMobile ? "hidden sm:block" : ""}`}>
              <img src={s.src} alt={s.alt} loading="lazy" decoding="async" className="w-full h-auto block" />
            </div>
          ))}
        </div>
        <FigureCaption label="Hearapy, March 2026">
          tap to start, hold the tone for 60 seconds, and read why it works, from Samsung&rsquo;s Google Play listing
        </FigureCaption>
      </figure>
    </div>
  );
}
