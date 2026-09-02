import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Github } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { noOrphan } from "@/lib/noOrphan";
import { LinkChip } from "./LinkChip";

export const GITHUB_URL = "https://github.com/Malik1942";

// The last tile in the Studio grid: everything that did not get a tile of its
// own (skills, agent workflows, experiments) lives on GitHub. It is built to
// the same recipe as a project tile — cover box at the covers' ratio, title,
// one line, metadata with a link chip, stretched link over the whole tile —
// so it reads as one more thing in the grid rather than a button bolted on.
// The cover is a faint dot field, an echo of the hero, with the GitHub mark
// in the middle.
export function GitHubTile({ index = 0 }: { index?: number }) {
  const [hovered, setHovered] = useState(false);
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -80px 0px" });
  const link = { label: "GitHub" as const, url: GITHUB_URL };

  return (
    <motion.div
      ref={ref}
      id="project-github"
      className="relative"
      initial={{ opacity: 0, scale: 0.94, y: 40 }}
      animate={{ opacity: inView ? 1 : 0, scale: inView ? 1 : 0.94, y: inView ? 0 : 40 }}
      transition={{
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1],
        delay: (index % 3) * 0.04 + index * 0.1,
        opacity: { duration: 0.5, ease: "easeOut", delay: (index % 3) * 0.04 + index * 0.1 },
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-clickable="true"
    >
      <div className="flex flex-col">
        <div
          className="relative mb-4 w-full overflow-hidden rounded-2xl bg-project-card-surface"
          style={{ aspectRatio: "16/9" }}
        >
          {/* Dot field, scaled with the same hover as a cover image */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(hsl(var(--color-text-primary)/0.14)_1px,transparent_1px)] bg-[size:14px_14px]"
            style={{
              transform: hovered ? "scale(1.03)" : "scale(1)",
              transition: "transform 0.9s cubic-bezier(0.22,1,0.36,1)",
              maskImage: "radial-gradient(ellipse at center, black 30%, transparent 78%)",
              WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 78%)",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Github
              aria-hidden="true"
              className="h-12 w-12 transition-[color,transform] duration-500"
              strokeWidth={1.5}
              style={{
                color: hovered ? "hsl(var(--color-text-primary))" : "hsl(var(--color-text-primary) / 0.72)",
                transform: hovered ? "scale(1.06)" : "scale(1)",
              }}
            />
          </div>
          <motion.div
            className="pointer-events-none absolute inset-0 bg-project-card-hover-overlay"
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.35 }}
          />
        </div>

        <h3
          className="font-semibold leading-snug tracking-tight transition-colors duration-300"
          style={{
            fontSize: isMobile ? "var(--font-size-body)" : "var(--font-size-body-large)",
            letterSpacing: "-0.025em",
            marginBottom: "0.25rem",
            color: hovered ? "hsl(var(--color-text-primary))" : "hsl(var(--color-text-primary) / 0.88)",
          }}
        >
          More on GitHub
        </h3>
        <p
          className={isMobile ? "leading-relaxed line-clamp-2" : "leading-snug line-clamp-2"}
          style={{
            fontSize: "var(--font-size-body-small)",
            marginBottom: "0.625rem",
            color: "hsl(var(--color-text-primary) / 0.80)",
          }}
        >
          {noOrphan("Skills, agent workflows, and experiments that did not get a tile yet.")}
        </p>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
          <LinkChip link={link} />
        </div>
      </div>

      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="More on GitHub"
        className="absolute inset-0 z-[1] cursor-pointer rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/60 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      />
    </motion.div>
  );
}

export default GitHubTile;
