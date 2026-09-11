import { noOrphan } from "@/lib/noOrphan";

/**
 * A captioned still in a case study's Highlights: the image in a rounded well,
 * the caption centred beneath. Five case studies each carried a copy of this
 * and the copies were identical, so it lives once here.
 */
export function ArtifactFigure({ src, alt, caption }: { src: string; alt: string; caption: string }) {
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
      <figcaption className="mt-caption text-base md:text-xl text-foreground text-center leading-relaxed">
        {noOrphan(caption)}
      </figcaption>
    </figure>
  );
}
