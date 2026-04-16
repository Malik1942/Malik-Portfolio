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

// Grid alternates: even pair → left tall / right short; odd pair → left short / right tall
function getGridImageHeight(index: number): string {
  const pair = Math.floor(index / 2);
  const pos  = index % 2; // 0 = left, 1 = right
  const tall = pair % 2 === 0 ? pos === 0 : pos === 1;
  return tall
    ? "clamp(300px, 27vw, 390px)"  // tall card
    : "clamp(220px, 20vw, 290px)"; // short card
}

// Right-column cards (odd index) stagger down
function getGridMarginTop(index: number): string {
  return index % 2 === 1 ? "clamp(24px, 3vw, 44px)" : "0px";
}

// ─── Media helper (shared) ────────────────────────────────────────────────────
const CardMedia = ({
  project,
  hovered,
  imageHeight,
}: {
  project: Project;
  hovered: boolean;
  imageHeight: string;
}) => (
  <div
    className="overflow-hidden rounded-2xl bg-secondary/15 relative mb-4 w-full shrink-0"
    style={{ height: imageHeight }}
  >
    {project.coverVideo ? (
      <video
        src={project.coverVideo}
        autoPlay loop muted playsInline
        className="w-full h-full object-contain"
        style={{
          transform: hovered ? "scale(1.035)" : "scale(1)",
          transition: "transform 0.9s cubic-bezier(0.22,1,0.36,1)",
        }}
      />
    ) : project.coverImage ? (
      <img
        src={project.coverImage}
        alt={project.title}
        className="w-full h-full object-contain"
        style={{
          transform: hovered ? "scale(1.035)" : "scale(1)",
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
// Single card component used for all projects. Visual hierarchy comes from
// imageHeight alone — typography is identical across every card.
const ProjectCard = ({
  project,
  projectId,
  dotClass,
  imageHeight,
  globalIndex,
  rowDelay = 0,
  metadataLabel,
}: {
  project: Project;
  projectId?: string;
  dotClass: string;
  imageHeight: string;
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
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay: rowDelay + globalIndex * 0.05, ease }}
      className="cursor-pointer group flex flex-col"
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-clickable="true"
    >
      <CardMedia project={project} hovered={hovered} imageHeight={imageHeight} />

      <h3
        className="text-display font-semibold leading-[1.07] tracking-[-0.02em] mb-2 transition-colors duration-500"
        style={{
          fontSize: "clamp(1.25rem, 2vw, 1.75rem)",
          color: hovered ? "hsl(var(--foreground))" : "hsl(var(--foreground) / 0.78)",
        }}
      >
        {project.title}
      </h3>

      <p className="text-foreground/40 text-body leading-relaxed mb-3 text-sm line-clamp-2">
        {project.description}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-3">
          <span className={`w-1.5 h-1.5 rounded-full ${dotClass} opacity-45`} />
          <span className="text-[11px] text-mono text-foreground/28 uppercase tracking-wider">
            {metadataLabel ?? project.role}
          </span>
          <span className="text-[11px] text-mono text-foreground/22">{project.year}</span>
        </div>
        <motion.span
          animate={{ x: hovered ? 4 : 0, opacity: hovered ? 0.8 : 0.18 }}
          transition={{ duration: 0.3, ease }}
          className="text-foreground text-sm text-mono"
        >
          →
        </motion.span>
      </div>
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
          imageHeight={getGridImageHeight(i)}
          globalIndex={startGlobalIndex + i}
          rowDelay={(i % 2) * 0.06}
          metadataLabel={aiVariant && p.builtWith ? `Built with ${p.builtWith}` : undefined}
        />
      </div>
    ))}
  </div>
);

// ─── Section label ────────────────────────────────────────────────────────────
const SectionLabel = ({ title, dotClass }: { title: string; dotClass: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease }}
      className="flex items-center gap-2.5 mb-14"
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass} opacity-70`} />
      <span className="text-sm font-semibold text-foreground tracking-tight text-display">
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

      {/* ── Hero 1: Aura ── */}
      {hero1 && (
        <div className="mb-16 md:mb-20">
          <ProjectCard
            project={hero1}
            projectId={hero1.id}
            dotClass={dotClass}
            imageHeight="clamp(520px, 52vw, 700px)"
            globalIndex={0}
          />
        </div>
      )}

      {/* ── Hero 2: Neuralyfe ── */}
      {hero2 && (
        <div className="mb-16 md:mb-20">
          <ProjectCard
            project={hero2}
            projectId={hero2.id}
            dotClass={dotClass}
            imageHeight="clamp(480px, 46vw, 640px)"
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
