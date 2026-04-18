import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

interface Project {
  id?: string;
  title: string;
  description: string;
  signal?: string;
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
// Default: w-full h-auto — container scales to the image's natural ratio.
// When aspectRatio is provided the container uses that fixed ratio with object-cover,
// so the image fills the shape without distortion.
const CardMedia = ({
  project,
  hovered,
  aspectRatio,
}: {
  project: Project;
  hovered: boolean;
  aspectRatio?: string;
}) => {
  const forced = !!aspectRatio;
  const mediaClass = forced
    ? "w-full h-full object-cover"
    : "w-full h-auto block";

  return (
    <div
      className="overflow-hidden rounded-2xl bg-secondary/15 relative mb-6 w-full"
      style={forced ? { aspectRatio } : undefined}
    >
      {project.coverVideo ? (
        <video
          src={project.coverVideo}
          autoPlay loop muted playsInline
          className={mediaClass}
          style={{
            transform: hovered ? "scale(1.03)" : "scale(1)",
            transition: "transform 0.9s cubic-bezier(0.22,1,0.36,1)",
          }}
        />
      ) : project.coverImage ? (
        <img
          src={project.coverImage}
          alt={project.title}
          className={mediaClass}
          style={{
            transform: hovered ? "scale(1.03)" : "scale(1)",
            transition: "transform 0.9s cubic-bezier(0.22,1,0.36,1)",
          }}
        />
      ) : (
        <div className="w-full aspect-video flex items-center justify-center">
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
};

// ─── Project card (unified) ───────────────────────────────────────────────────
const ProjectCard = ({
  project,
  projectId,
  dotClass,
  globalIndex,
  rowDelay = 0,
  metadataLabel,
  aspectRatio,
  maxWidth,
  horizontal = false,
  imageRight = false,
}: {
  project: Project;
  projectId?: string;
  dotClass: string;
  globalIndex: number;
  rowDelay?: number;
  metadataLabel?: string;
  aspectRatio?: string;
  maxWidth?: string;
  horizontal?: boolean;
  imageRight?: boolean;
}) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -80px 0px" });

  const handleClick = () => {
    if (project.externalUrl) {
      window.open(project.externalUrl, "_blank", "noopener,noreferrer");
    } else if (projectId) {
      navigate(`/project/${projectId}`);
    }
  };

  // ── Vertical card text (grid cards) ──
  const textBlock = () => (
    <>
      {/* Title — confident anchor of the card */}
      <h3
        className="font-bold leading-snug transition-colors duration-300"
        style={{
          fontSize: "clamp(1.2rem, 1.6vw, 1.4rem)",
          letterSpacing: "-0.025em",
          marginBottom: "0.3rem",
          color: hovered ? "hsl(var(--foreground))" : "hsl(var(--foreground) / 0.88)",
        }}
      >
        {project.title}
      </h3>

      {/* Description — concise, one line, clearly softer */}
      <p
        className="leading-snug line-clamp-1"
        style={{
          fontSize: "0.8125rem",
          marginBottom: "1rem",
          color: "hsl(var(--foreground) / 0.42)",
        }}
      >
        {project.description}
      </p>

      {/* Metadata — quiet closing layer */}
      <p
        className="text-mono"
        style={{
          fontSize: "0.6875rem",
          letterSpacing: "0.06em",
          color: "hsl(var(--foreground) / 0.28)",
        }}
      >
        {metadataLabel ?? project.role} · {project.year}
      </p>
    </>
  );

  if (horizontal || imageRight) {
    const imageCol = (
      <div style={{ width: "65%", flexShrink: 0 }}>
        <CardMedia project={project} hovered={hovered} aspectRatio={aspectRatio} />
      </div>
    );

    // ── Editorial text column for hero rows ──
    // Bottom-anchored: text rests at the same baseline as the image bottom.
    const textCol = (
      <div className="flex flex-col flex-1 min-w-0 justify-end" style={{ paddingBottom: "48px" }}>
        <div style={{ maxWidth: "380px" }}>
          {/* Level 1 — Title: isolated anchor, large gap below */}
          <h3
            className="font-bold leading-[1.05] transition-colors duration-300"
            style={{
              fontSize: "clamp(1.6rem, 2.2vw, 2.4rem)",
              letterSpacing: "-0.03em",
              marginBottom: "1rem",
              color: hovered ? "hsl(var(--foreground))" : "hsl(var(--foreground) / 0.9)",
            }}
          >
            {project.title}
          </h3>

          {/* Levels 2 + 3 — Signal + description grouped tightly */}
          <div style={{ marginBottom: "1.375rem" }}>
            {project.signal && (
              <p
                className="font-medium leading-snug"
                style={{
                  fontSize: "0.9375rem",
                  letterSpacing: "-0.01em",
                  marginBottom: "0.5rem",
                  color: "hsl(var(--foreground) / 0.58)",
                }}
              >
                {project.signal}
              </p>
            )}
            <p
              className="leading-relaxed line-clamp-2"
              style={{
                fontSize: "0.875rem",
                color: "hsl(var(--foreground) / 0.38)",
              }}
            >
              {project.description}
            </p>
          </div>

          {/* Level 4 — Metadata: separate, subtle */}
          <p
            className="text-mono"
            style={{
              fontSize: "0.6875rem",
              letterSpacing: "0.09em",
              color: "hsl(var(--foreground) / 0.28)",
            }}
          >
            {metadataLabel ?? project.role} · {project.year}
          </p>
        </div>
      </div>
    );

    return (
      <motion.div
        ref={ref}
        id={projectId ? `project-${projectId}` : undefined}
        initial={{ opacity: 0, scale: 0.94, y: 40 }}
        animate={{ opacity: inView ? 1 : 0, scale: inView ? 1 : 0.94, y: inView ? 0 : 40 }}
        transition={{
          duration: 0.75,
          ease: [0.16, 1, 0.3, 1],
          delay: rowDelay + globalIndex * 0.1,
          opacity: { duration: 0.5, ease: "easeOut", delay: rowDelay + globalIndex * 0.1 },
        }}
        className="cursor-pointer group flex flex-row items-stretch gap-10"
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        data-clickable="true"
      >
        {imageRight ? textCol : imageCol}
        {imageRight ? imageCol : textCol}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      id={projectId ? `project-${projectId}` : undefined}
      initial={{ opacity: 0, scale: 0.94, y: 40 }}
      animate={{ opacity: inView ? 1 : 0, scale: inView ? 1 : 0.94, y: inView ? 0 : 40 }}
      transition={{
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1],
        delay: rowDelay + globalIndex * 0.1,
        opacity: { duration: 0.5, ease: "easeOut", delay: rowDelay + globalIndex * 0.1 },
      }}
      className="cursor-pointer group flex flex-col"
      style={maxWidth ? { maxWidth } : undefined}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-clickable="true"
    >
      <CardMedia project={project} hovered={hovered} aspectRatio={aspectRatio} />
      <div className="flex flex-col">{textBlock()}</div>
    </motion.div>
  );
};

// ─── Parallax wrapper for each grid card ─────────────────────────────────────
// Right column travels faster than left — creates the depth rhythm of Clay/Shopify.
const TwoColCard = ({
  project,
  index,
  dotClass,
  startGlobalIndex,
  aiVariant,
}: {
  project: Project;
  index: number;
  dotClass: string;
  startGlobalIndex: number;
  aiVariant: boolean;
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start end", "end start"],
  });
  const isRight = index % 2 === 1;
  const parallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    isRight ? ["48px", "-48px"] : ["20px", "-20px"]
  );

  return (
    <motion.div
      ref={wrapRef}
      style={{ marginTop: getGridMarginTop(index), y: parallaxY }}
    >
      <ProjectCard
        project={project}
        projectId={project.id}
        dotClass={dotClass}
        globalIndex={startGlobalIndex + index}
        rowDelay={(index % 2) * 0.06}
        metadataLabel={
          aiVariant && project.builtWith
            ? `Built with ${project.builtWith}`
            : undefined
        }
      />
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
      <TwoColCard
        key={p.id ?? p.title}
        project={p}
        index={i}
        dotClass={dotClass}
        startGlobalIndex={startGlobalIndex}
        aiVariant={aiVariant}
      />
    ))}
  </div>
);

// ─── Section label ────────────────────────────────────────────────────────────
// "primary" = SELECTED WORK — tight caps, wide tracking, confident weight.
// "secondary" = AI Explorations — mixed case, quieter, clearly subordinate.
const SectionLabel = ({
  title,
  dotClass,
  variant = "primary",
}: {
  title: string;
  dotClass: string;
  variant?: "primary" | "secondary";
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const isPrimary = variant === "primary";
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 16 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center gap-3 mb-10"
    >
      <span
        className={`rounded-full ${dotClass} ${isPrimary ? "w-1.5 h-1.5 opacity-70" : "w-1 h-1 opacity-35"}`}
      />
      {isPrimary ? (
        <span className="text-sm text-mono text-foreground/55 uppercase tracking-[0.12em] font-medium">
          {title}
        </span>
      ) : (
        <span className="text-sm text-mono text-foreground/35 uppercase tracking-[0.12em] font-medium">
          {title}
        </span>
      )}
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
      <SectionLabel title={sectionTitle} dotClass={dotClass} variant="primary" />

      {/* ── Hero 1: Aura ── */}
      {hero1 && (
        <div className="mb-14 md:mb-16">
          <ProjectCard
            project={hero1}
            projectId={hero1.id}
            dotClass={dotClass}
            globalIndex={0}
            horizontal
          />
        </div>
      )}

      {/* ── Hero 2: Neuralyfe ── */}
      {hero2 && (
        <div className="mb-14 md:mb-16">
          <ProjectCard
            project={hero2}
            projectId={hero2.id}
            dotClass={dotClass}
            globalIndex={1}
            rowDelay={0.06}
            imageRight
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
  <section id={id} className="px-6 md:px-16 lg:px-24 pt-48 pb-24">
    <SectionLabel title={sectionTitle} dotClass={dotClass} variant="secondary" />
    <div style={{ opacity: 0.88 }}>
      <TwoColGrid projects={projects} dotClass={dotClass} aiVariant />
    </div>
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
