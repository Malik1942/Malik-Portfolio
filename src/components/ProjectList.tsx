import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";

interface Project {
  id?: string;
  title: string;
  description: string;
  role: string;
  year: string;
  coverImage?: string;
  coverVideo?: string;
  coverFit?: "cover" | "contain";
  details?: string;
  externalUrl?: string;
  builtWith?: string;
}

interface ProjectListProps {
  id: string;
  sectionTitle: string;
  sectionSubtitle: string;
  dotColor: "red" | "gold";
  projects: Project[];
  variant?: "main" | "ai";
}

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Grid alternates portrait/landscape per pair — creates height rhythm without fixed px.
// Pair 0: left=portrait, right=landscape. Pair 1: left=landscape, right=portrait. etc.
function getGridAspectRatio(index: number): string {
  const pair    = Math.floor(index / 2);
  const pos     = index % 2;
  const portrait = pair % 2 === 0 ? pos === 0 : pos === 1;
  return portrait ? "4/5" : "3/2";
}

// Right-column cards stagger down for organic rhythm
function getGridMarginTop(index: number): string {
  return index % 2 === 1 ? "clamp(24px, 3vw, 44px)" : "0px";
}

// ─── Media helper (shared) ────────────────────────────────────────────────────
// Container sized by aspect-ratio — no fixed px height. Width comes from the grid column,
// height follows naturally. object-cover fills the frame (clay.global approach).
const CardMedia = ({
  project,
  hovered,
  aspectRatio,
}: {
  project: Project;
  hovered: boolean;
  aspectRatio: string;
}) => (
  <div
    className="overflow-hidden rounded-2xl bg-secondary/15 relative mb-4 w-full shrink-0"
    style={{ aspectRatio }}
  >
    {project.coverVideo ? (
      <video
        src={project.coverVideo}
        autoPlay loop muted playsInline
        className="w-full h-full object-cover"
        style={{
          transform: hovered ? "scale(1.03)" : "scale(1)",
          transition: "transform 0.9s cubic-bezier(0.22,1,0.36,1)",
        }}
      />
    ) : project.coverImage ? (
      <img
        src={project.coverImage}
        alt={project.title}
        className="w-full h-full object-cover"
        style={{
          transform: hovered ? "scale(1.03)" : "scale(1)",
          transition: "transform 0.9s cubic-bezier(0.22,1,0.36,1)",
        }}
      />
    ) : (
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-foreground/15 text-xs text-mono uppercase tracking-[0.2em]">
          No image
        </span>
      </div>
    )}
    <motion.div
      className="absolute inset-0 bg-foreground/[0.04] pointer-events-none"
      animate={{ opacity: hovered ? 1 : 0 }}
      transition={{ duration: 0.35 }}
    />
  </div>
);

// ─── Project card (unified) ───────────────────────────────────────────────────
const ProjectCard = ({
  project,
  projectId,
  dotClass,
  aspectRatio,
  globalIndex,
  rowDelay = 0,
  metadataLabel,
}: {
  project: Project;
  projectId?: string;
  dotClass: string;
  aspectRatio: string;
  globalIndex: number;
  rowDelay?: number;
  metadataLabel?: string;
}) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });

  const handleClick = () => {
    if (project.externalUrl) {
      window.open(project.externalUrl, "_blank", "noopener,noreferrer");
    } else if (projectId) {
      navigate(`/project/${projectId}`);
    }
  };

  return (
    <motion.div
      ref={ref}
      id={projectId ? `project-${projectId}` : undefined}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: rowDelay + globalIndex * 0.05, ease }}
      className="cursor-pointer group flex flex-col"
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-clickable="true"
    >
      <CardMedia project={project} hovered={hovered} aspectRatio={aspectRatio} />

      {/* Title */}
      <h3
        className="text-base font-semibold leading-snug tracking-tight mb-1 transition-colors duration-300"
        style={{ color: hovered ? "hsl(var(--foreground))" : "hsl(var(--foreground) / 0.8)" }}
      >
        {project.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-foreground/45 leading-relaxed line-clamp-1 mb-2">
        {project.description}
      </p>

      {/* Metadata */}
      <p className="text-xs text-mono text-foreground/30 mt-auto">
        {metadataLabel ?? project.role} · {project.year}
      </p>
    </motion.div>
  );
};

// ─── 2-col dynamic grid ───────────────────────────────────────────────────────
const TwoColGrid = ({
  projects,
  dotClass,
  startGlobalIndex = 0,
  aiVariant = false,
}: {
  projects: Project[];
  dotClass: string;
  startGlobalIndex?: number;
  aiVariant?: boolean;
}) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "0 clamp(24px, 3vw, 40px)",
      alignItems: "start",
    }}
    className="grid-cols-1 md:grid-cols-2"
  >
    {projects.map((p, i) => (
      <div
        key={p.id ?? p.title}
        style={{ marginTop: getGridMarginTop(i) }}
      >
        <ProjectCard
          project={p}
          projectId={p.id}
          dotClass={dotClass}
          aspectRatio={getGridAspectRatio(i)}
          globalIndex={startGlobalIndex + i}
          rowDelay={(i % 2) * 0.06}
          metadataLabel={aiVariant && p.builtWith ? `Built with ${p.builtWith}` : undefined}
        />
      </div>
    ))}
  </div>
);

// ─── Section label ────────────────────────────────────────────────────────────
// Subtitle-weight — labels the section without competing with project content.
const SectionLabel = ({ title, dotClass }: { title: string; dotClass: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5, ease }}
      className="flex items-center gap-2 mb-10"
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass} opacity-60`} />
      <span className="text-xs text-mono text-foreground/45 uppercase tracking-[0.14em]">
        {title}
      </span>
    </motion.div>
  );
};

// ─── Main project list ────────────────────────────────────────────────────────
// Tier 1: Aura + Neuralyfe as full-width heroes.
// Tier 2: All remaining projects in the 2-col dynamic grid.
const MainProjectList = ({
  id,
  sectionTitle,
  dotClass,
  projects,
}: {
  id: string;
  sectionTitle: string;
  dotClass: string;
  projects: Project[];
}) => {
  const hero1   = projects[0]; // Aura
  const hero2   = projects[1]; // Neuralyfe
  const gridPro = projects.slice(2); // FlowPrint, Tubular, Mood Muse, …

  return (
    <section id={id} className="px-6 md:px-16 lg:px-24 pt-24">
      <SectionLabel title={sectionTitle} dotClass={dotClass} />

      {/* ── Hero 1: Aura — wide landscape ── */}
      {hero1 && (
        <div className="mb-14 md:mb-16">
          <ProjectCard
            project={hero1}
            projectId={hero1.id}
            dotClass={dotClass}
            aspectRatio="16/9"
            globalIndex={0}
          />
        </div>
      )}

      {/* ── Hero 2: Neuralyfe — slightly tighter landscape ── */}
      {hero2 && (
        <div className="mb-14 md:mb-16">
          <ProjectCard
            project={hero2}
            projectId={hero2.id}
            dotClass={dotClass}
            aspectRatio="3/2"
            globalIndex={1}
            rowDelay={0.06}
          />
        </div>
      )}

      {/* ── Grid: remaining projects ── */}
      {gridPro.length > 0 && (
        <div className="mt-[100px] pb-10">
          <TwoColGrid
            projects={gridPro}
            dotClass={dotClass}
            startGlobalIndex={2}
          />
        </div>
      )}
    </section>
  );
};

// ─── AI project list ──────────────────────────────────────────────────────────
// All AI projects in the same 2-col dynamic grid. Uniform treatment signals "gallery."
const AIProjectList = ({
  id,
  sectionTitle,
  dotClass,
  projects,
}: {
  id: string;
  sectionTitle: string;
  dotClass: string;
  projects: Project[];
}) => (
  <section id={id} className="px-6 md:px-16 lg:px-24 pt-32 pb-24">
    <SectionLabel title={sectionTitle} dotClass={dotClass} />
    <TwoColGrid projects={projects} dotClass={dotClass} aiVariant />
  </section>
);

// ─── Public component ─────────────────────────────────────────────────────────
const ProjectList = ({
  id,
  sectionTitle,
  sectionSubtitle: _unused,
  dotColor,
  projects,
  variant = "main",
}: ProjectListProps) => {
  const dotClass = dotColor === "red" ? "bg-dot-red" : "bg-dot-gold";

  if (variant === "ai") {
    return (
      <AIProjectList
        id={id}
        sectionTitle={sectionTitle}
        dotClass={dotClass}
        projects={projects}
      />
    );
  }

  return (
    <MainProjectList
      id={id}
      sectionTitle={sectionTitle}
      dotClass={dotClass}
      projects={projects}
    />
  );
};

export default ProjectList;
