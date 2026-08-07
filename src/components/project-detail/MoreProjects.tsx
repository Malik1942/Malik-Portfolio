import { selectedWork, aiProjects } from "@/pages/Index";
import { ProjectCard, type Project } from "@/components/ProjectList";

// Aligns with ProjectDetailTemplate's PAGE_OUTER so section edges match the rest of the page.
const PAGE_OUTER = "px-6 md:px-10 lg:px-16 max-w-page mx-auto";

// The rail only ever shows 3, so it doesn't simply inherit homepage order —
// these lead, and everything else falls in behind them in homepage order
// (Selected Work, then Workshop). ZEAT holds the slot FlowPrint used to.
const LEAD_ORDER = ["moti", "neuralyfe", "aura", "zeat"];
const rank = (p: Project) => {
  const i = LEAD_ORDER.indexOf(p.id ?? "");
  return i === -1 ? LEAD_ORDER.length : i;
};

// Array.prototype.sort is stable, so the non-lead projects keep homepage order.
const ALL_PROJECTS: Project[] = [...selectedWork, ...aiProjects].sort((a, b) => rank(a) - rank(b));

interface MoreProjectsProps {
  /** slug/id of the project being viewed; excluded from the list (slug === homepage id). */
  currentSlug: string;
}

/**
 * "More work" — up to 3 other projects, reusing the homepage ProjectCard, the
 * `.project-grid` responsive grid, and the card's built-in navigation. Implemented
 * once and rendered in the shared ProjectDetailTemplate so it stays DRY.
 */
export function MoreProjects({ currentSlug }: MoreProjectsProps) {
  const others = ALL_PROJECTS.filter((p) => p.id !== currentSlug).slice(0, 3);
  if (others.length === 0) return null;

  return (
    <section aria-label="More projects" className={`${PAGE_OUTER} border-t border-border/30 pt-16 md:pt-20`}>
      {/* Section label — same tokens/style as the homepage "Selected Work" heading */}
      <div className="flex items-center gap-3 mb-10">
        <span className="rounded-full bg-dot-red w-1.5 h-1.5 opacity-70" />
        <span className="text-sm text-foreground/55 uppercase tracking-eyebrow font-medium">
          More work
        </span>
      </div>

      {/* Same responsive grid as the homepage projects list (1 col, 2 cols ≥768px),
          plus the row gap the wrapped third card needs (see index.css). */}
      <div className="project-grid project-grid--more-work">
        {others.map((p, i) => (
          <ProjectCard
            key={p.id ?? p.title}
            project={p}
            projectId={p.id}
            dotClass=""
            globalIndex={i}
            metadataLabel={p.builtWith ? `Built with ${p.builtWith}` : undefined}
          />
        ))}
      </div>
    </section>
  );
}
