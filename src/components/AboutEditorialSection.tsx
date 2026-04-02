import { motion, type Variants } from "framer-motion";
import type { ReactNode, RefObject } from "react";

const easeOutExpo: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Left column — matches Photography rhythm */
export const aboutEditorialTextVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: easeOutExpo },
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
    transition: { duration: 0.65, ease: easeOutExpo },
  },
};

const outerSectionBase =
  "w-screen max-w-[100vw] relative left-1/2 -translate-x-1/2 overflow-x-clip px-6 md:px-16 lg:px-24";
const outerSectionMarginDefault = "mb-40";
/** Tighter bottom margin before footer / closing elements */
const outerSectionMarginCompact = "mb-10 md:mb-12";

const innerMaxClass = "mx-auto max-w-[1180px]";

const rowClassStart =
  "flex flex-col gap-12 lg:flex-row lg:gap-14 xl:gap-20 lg:items-start";
const rowClassCenter =
  "flex flex-col gap-12 lg:flex-row lg:gap-14 xl:gap-20 lg:items-center";

const leftColClass =
  "lg:w-[min(100%,248px)] xl:w-[260px] flex-shrink-0 lg:sticky lg:top-28";

const eyebrowClass =
  "text-[10px] uppercase tracking-[0.32em] text-foreground/45 mb-5";

const titleClass =
  "text-[21px] sm:text-[23px] font-light tracking-[-0.02em] text-foreground/88 leading-[1.25] mb-5";

const descriptionClass =
  "text-[13px] sm:text-sm font-light leading-[1.65] text-foreground/48 max-w-[36ch]";

export type AboutEditorialSectionProps = {
  sectionRef?: RefObject<HTMLElement | null>;
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
    <section ref={sectionRef} className={`${outerSectionBase} ${marginClass}`}>
      <div className={innerMaxClass}>
        <div className={rowClass}>
          <motion.div
            className={leftColClass}
            variants={aboutEditorialTextVariants}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
          >
            <p className={eyebrowClass}>{eyebrow}</p>
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
