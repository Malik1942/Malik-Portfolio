import { noOrphan } from "@/lib/noOrphan";

/**
 * The case-study figure title: the one line a reader needs before looking,
 * set above the media. `FigureCaption` explains what was just seen, under the
 * frame; this names what is about to be seen, so a gallery can be skimmed by
 * its titles alone. Every Highlights gallery uses it (Oct 2026); the captions
 * under figures elsewhere on a case study stay where they are.
 *
 * Above the title sits an optional eyebrow: the screen or artifact name
 * (`label`), and for a walkthrough the step number (`num`). Keep `children`
 * to one sentence-case line, two at most on a phone-width figure.
 */
export function FigureTitle({ label, num, children }: { label?: string; num?: string; children: string }) {
  const hasEyebrow = Boolean(num || label);
  return (
    <figcaption className="mb-caption">
      {hasEyebrow ? (
        <p className="flex items-baseline gap-3 text-label uppercase tracking-eyebrow font-mono text-foreground-tertiary">
          {num ? <span className="tabular-nums">{num}</span> : null}
          {label ? <span>{label}</span> : null}
        </p>
      ) : null}
      <p
        className={`${hasEyebrow ? "mt-2 " : ""}text-base md:text-xl font-medium leading-snug tracking-tight text-foreground [text-wrap:pretty]`}
      >
        {noOrphan(children)}
      </p>
    </figcaption>
  );
}
