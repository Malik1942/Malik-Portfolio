import { noOrphan } from "@/lib/noOrphan";

/**
 * The case-study figure caption. One format for every artifact image and clip:
 * an optional short label naming the screen or artifact, an em dash, then one
 * line saying what the reader is looking at. Centered under the media at
 * reading size, in the primary text color.
 *
 * NeuraLyfe's highlight gallery set this format; Moti and Oryne now share it,
 * so a caption looks the same on every case study. Keep `label` to two or
 * three words and `children` to a single clause.
 */
export function FigureCaption({ label, children }: { label?: string; children: string }) {
  const text = label ? `${label} — ${children}` : children;
  return (
    <figcaption className="mt-5 md:mt-6 text-base md:text-xl text-foreground text-center leading-relaxed">
      {noOrphan(text)}
    </figcaption>
  );
}
