import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import { noOrphan } from "@/lib/noOrphan";
import { MOTION } from "@/design-system/system/motion";

export const GITHUB_URL = "https://github.com/Malik1942";

// Closes the "Built with AI" group on the Studio page: everything that did not
// get a tile of its own (skills, agent workflows, experiments) lives on GitHub.
//
// This used to be a sixth tile, built to the project-tile recipe with a dot
// field standing in for a cover. Once the grid split into software and
// industrial design it stopped fitting: it is not a project, it belongs with the
// software, and as a fourth tile under three it would have sat alone on a
// second row. So it is a strip instead, a full-width rule under the software
// grid with the GitHub mark, one line, and an outbound arrow. It reads as the
// group's footnote rather than as one more thing in the grid.
export function GitHubStrip() {
  const ref = useRef<HTMLAnchorElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" });

  return (
    <motion.a
      ref={ref}
      id="studio-github"
      href={GITHUB_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="More on GitHub"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 16 }}
      transition={MOTION.enter}
      className="group mt-module flex items-center gap-5 border-t border-hairline-faint pt-6 md:pt-8 rounded-sm text-foreground-secondary transition-colors duration-slow ease-settle hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-4 focus-visible:ring-offset-background"
    >
      <span
        aria-hidden="true"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-hairline transition-colors duration-slow ease-settle group-hover:border-border"
      >
        <Github className="h-4 w-4" strokeWidth={1.5} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-base font-semibold tracking-tight text-foreground">More on GitHub</span>
        <span className="mt-1 block text-sm leading-snug text-foreground-secondary">
          {noOrphan("Skills, agent workflows, and experiments that did not get a tile yet.")}
        </span>
      </span>
      <ArrowUpRight
        aria-hidden="true"
        className="h-5 w-5 shrink-0 transition-transform duration-fast ease-settle group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        strokeWidth={1.75}
      />
    </motion.a>
  );
}

export default GitHubStrip;
