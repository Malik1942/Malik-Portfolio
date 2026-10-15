import { FigureTitle } from "./FigureTitle";

/**
 * A titled still in a case study's Highlights: the title above, the image in
 * a rounded well under it. Five case studies each carried a copy of this and
 * the copies were identical, so it lives once here. The title used to be a
 * caption centred under the image; it moved above the frame (Oct 2026) so a
 * reader skimming the gallery knows what each artifact is before looking.
 */
export function ArtifactFigure({ src, alt, title }: { src: string; alt: string; title: string }) {
  return (
    <figure>
      <FigureTitle>{title}</FigureTitle>
      <div className="overflow-hidden rounded-2xl bg-secondary/10">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="w-full h-auto block"
        />
      </div>
    </figure>
  );
}
