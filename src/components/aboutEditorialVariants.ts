import type { Variants } from "framer-motion";
import { DURATION, EASE } from "@/design-system/system/motion";

// The About editorial motion, shared by the section and by the deep content
// that reuses its rhythm. Kept beside the component rather than in it so the
// component file exports only components and keeps fast refresh.

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
