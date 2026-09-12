import { motion, type Variants } from "framer-motion";
import type { ReactNode, RefObject } from "react";
import { DURATION, EASE } from "@/design-system/system/motion";
import { PAGE_COLUMN, PAGE_GUTTERS } from "@/design-system/system/layout";
import { Eyebrow } from "@/components/ui/Eyebrow";

/** Left column — matches Photography rhythm */
export const aboutEditorialTextVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.reveal, ease: EASE.move },
  },
};

/** Stagger container for right-column children */
export const aboutEditorialStaggerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.055,
      delayChildren: 0.04,
    },
  },
};

/** Single row / item inside a staggered editorial column */
export const aboutEditorialItemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE.move },
  },
};

// The About chapters sit in the page column, the same one the site header, the
// Work sections and the footer are set in, so their edges line up down the
// whole page. They used to break out of a 768px wrapper with a 100vw escape
// and cap themselves at 1180px: on a 1728 display that put the chapter 110px
// inside the nav above it and 10px inside the footer below.
const outerSectionBase = `relative overflow-x-clip ${PAGE_GUTTERS}`;
const outerSectionMarginDefault = "mb-40";
/** Tighter bottom margin before footer / closing elements */
const outerSectionMarginCompact = "mb-stack";

const innerMaxClass = PAGE_COLUMN;

const rowClassStart =
  "flex flex-col gap-12 lg:flex-row lg:gap-14 xl:gap-20 lg:items-start";
const rowClassCenter =
  "flex flex-col gap-12 lg:flex-row lg:gap-14 xl:gap-20 lg:items-center";

const leftColClass =
  "lg:w-[min(100%,248px)] xl:w-[260px] flex-shrink-0 lg:sticky lg:top-28";

// The display face at Light, as every other heading on the site is set; it was
// the body sans here alone.
const titleClass =
  "font-display text-xl md:text-title font-light text-foreground leading-tight mb-5";

// The supporting line under a section label: the same role, size and ink the
// Studio group blurbs use. It was a step down from that on both ends, and at
// Light, which is why the About copy read smaller than the rest of the site.
const descriptionClass =
  "text-sm md:text-base font-normal leading-relaxed text-foreground-secondary max-w-[36ch]";

export type AboutEditorialSectionProps = {
  sectionRef?: RefObject<HTMLElement | null>;
  /** Anchor for deep links, e.g. /about/connect finds `id="connect"`. */
  id?: string;
  inView: boolean;
  /** Small caps label (e.g. Photography, Movement) */
  eyebrow: string;
  title: string;
  description: string;
  /** Right column — include your own motion wrappers if needed */
  children: ReactNode;
  footer?: ReactNode;
  /** Cross-axis alignment of the two columns at `lg+` (default: top-aligned). */
  rowCrossAlign?: "start" | "center";
  /** Less space below section (use on last block before footer). */
  compactBottom?: boolean;
};

export function AboutEditorialSection({
  sectionRef,
  id,
  inView,
  eyebrow,
  title,
  description,
  children,
  footer,
  rowCrossAlign = "start",
  compactBottom = false,
}: AboutEditorialSectionProps) {
  const rowClass = rowCrossAlign === "center" ? rowClassCenter : rowClassStart;
  const marginClass = compactBottom ? outerSectionMarginCompact : outerSectionMarginDefault;

  return (
    <section
      id={id}
      ref={sectionRef}
      data-about-chapter=""
      className={`${outerSectionBase} ${marginClass}`}
    >
      <div className={innerMaxClass}>
        <div className={rowClass}>
          <motion.div
            className={leftColClass}
            data-section-header={id ? "true" : undefined}
            variants={aboutEditorialTextVariants}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
          >
            <Eyebrow scale="section" tone="primary" className="mb-5">{eyebrow}</Eyebrow>
            <h2 className={titleClass}>{title}</h2>
            <p className={descriptionClass}>{description}</p>
          </motion.div>
          {children}
        </div>
        {footer}
      </div>
    </section>
  );
}
