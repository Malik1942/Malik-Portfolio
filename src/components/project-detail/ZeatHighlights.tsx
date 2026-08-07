import zeatInContext from "@/assets/zeat-in-context.webp";
import zeatArm from "@/assets/zeat-arm.webp";
import zeatStructure from "@/assets/zeat-structure.webp";
import { Chips, PullQuote } from "./MotiModules";

// ZEAT's case-study hook — mirrors Aura's (highlight chips → pull-quote →
// artifact gallery). The gallery images reappear in their own sections below,
// same as Aura's; the hook is the skim layer, the sections are the argument.
const highlights = [
  "Cleans floors and seats",
  "Crosses grandstand steps",
  "Compacts what it collects",
  "Runs as a dispatched fleet",
];

const artifacts = [
  {
    src: zeatInContext,
    alt: "ZEAT working a littered grandstand, arm raised and collection lid open",
    caption: "Working the rows — floor, seats, and everything wedged between",
  },
  {
    src: zeatArm,
    alt: "Articulated arm raised above the garbage inlet, lid open",
    caption: "The folding arm — for the half of the trash that never touches the floor",
  },
  {
    src: zeatStructure,
    alt: "Ghosted side view revealing the internal layout",
    caption: "Inside — the body is mostly collection volume",
  },
];

function ZeatArtifact({ src, alt, caption }: { src: string; alt: string; caption: string }) {
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

export function ZeatHighlights() {
  return (
    <div className="flex flex-col gap-10 md:gap-12">
      <Chips items={highlights} />
      <PullQuote>The hard part isn&rsquo;t the trash — it&rsquo;s the terrain.</PullQuote>
      <div className="flex flex-col gap-12 md:gap-16">
        {artifacts.map((a) => (
          <ZeatArtifact key={a.src} {...a} />
        ))}
      </div>
    </div>
  );
}

export default ZeatHighlights;
