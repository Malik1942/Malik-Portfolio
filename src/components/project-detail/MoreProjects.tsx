import { selectedWork, aiProjects } from "@/pages/Index";
import { ProjectCard, type Project } from "@/components/ProjectList";

// Aligns with ProjectDetailTemplate's PAGE_OUTER so section edges match the rest of the page.
const PAGE_OUTER = "px-6 md:px-10 lg:px-16 max-w-page mx-auto";

// Same order the homepage shows them: Selected Work, then Workshop.
const ALL_PROJECTS: Project[] = [...selectedWork, ...aiProjects];

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

      {/* Same responsive grid as the homepage projects list (1 col, 2 cols ≥768px) */}
      <div className="project-grid">
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
