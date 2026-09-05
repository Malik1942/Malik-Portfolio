import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { DURATION, EASE } from "@/design-system/system/motion";

const variants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: DURATION.page, ease: EASE.move }}
    >
      {children}
    </motion.div>
  );
}
