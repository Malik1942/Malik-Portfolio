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

// ─── Tier config ─────────────────────────────────────────────────────────────
type Tier = "hero" | "secondary-hero" | "secondary" | "minor";

const TIER: Record<Tier, {
  imageHeight: string;
  mobileImageHeight: string;
  titleSize: string;
  titleWeight: string;
  titleColor: string;
  titleHoverColor: string;
}> = {
  hero: {
    imageHeight: "clamp(480px, 52vw, 720px)",
    mobileImageHeight: "60vw",
    titleSize: "clamp(2.6rem, 4.2vw, 4rem)",
    titleWeight: "700",
    titleColor: "hsl(var(--foreground) / 0.82)",
    titleHoverColor: "hsl(var(--foreground))",
  },
  "secondary-hero": {
    imageHeight: "clamp(380px, 44vw, 640px)",
    mobileImageHeight: "50vw",
    titleSize: "clamp(2rem, 3.2vw, 3rem)",
    titleWeight: "600",
    titleColor: "hsl(var(--foreground) / 0.75)",
    titleHoverColor: "hsl(var(--foreground))",
  },
  secondary: {
    imageHeight: "clamp(280px, 30vw, 440px)",
    mobileImageHeight: "44vw",
    titleSize: "clamp(1.55rem, 2.4vw, 2.25rem)",
    titleWeight: "600",
    titleColor: "hsl(var(--foreground) / 0.68)",
    titleHoverColor: "hsl(var(--foreground) / 0.92)",
  },
  minor: {
    imageHeight: "clamp(200px, 22vw, 320px)",
    mobileImageHeight: "36vw",
    titleSize: "clamp(1.15rem, 1.6vw, 1.55rem)",
    titleWeight: "500",
    titleColor: "hsl(var(--foreground) / 0.58)",
    titleHoverColor: "hsl(var(--foreground) / 0.85)",
  },
};

// ─── Single card ─────────────────────────────────────────────────────────────
const ProjectCard = ({
  project,
  projectId,
  dotClass,
  tier,
  globalIndex,
  rowDelay = 0,
}: {
  project: Project;
  projectId?: string;
  dotClass: string;
  tier: Tier;
  globalIndex: number;
  rowDelay?: number;
}) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });
  const cfg = TIER[tier];

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
      transition={{ duration: 0.75, delay: rowDelay + globalIndex * 0.04, ease }}
      className="cursor-pointer group flex flex-col"
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-clickable="true"
    >
      {/* Cover image */}
      <div
        className="overflow-hidden rounded-2xl bg-secondary/15 relative mb-4 w-full"
        style={{ height: cfg.imageHeight }}
      >
        {project.coverVideo ? (
          <video
            src={project.coverVideo}
            autoPlay loop muted playsInline
            className="w-full h-full object-cover"
            style={{
              transform: hovered ? "scale(1.04)" : "scale(1)",
              transition: "transform 0.9s cubic-bezier(0.22,1,0.36,1)",
            }}
          />
        ) : project.coverImage ? (
          <img
            src={project.coverImage}
            alt={project.title}
            className={`w-full h-full ${project.coverFit === "contain" ? "object-contain" : "object-cover"}`}
            style={{
              transform: hovered ? "scale(1.04)" : "scale(1)",
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

      {/* Title */}
      <h3
        className="text-display leading-[1.06] tracking-[-0.02em] mb-2 transition-colors duration-500"
        style={{
          fontSize: cfg.titleSize,
          fontWeight: cfg.titleWeight,
          color: hovered ? cfg.titleHoverColor : cfg.titleColor,
        }}
      >
        {project.title}
      </h3>

      {/* Description */}
      <p
        className="text-foreground/40 text-body leading-relaxed mb-3 line-clamp-2"
        style={{ fontSize: tier === "hero" || tier === "secondary-hero" ? "0.9rem" : "0.8125rem" }}
      >
        {project.description}
      </p>

      {/* Metadata + arrow */}
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-3">
          <span className={`w-1.5 h-1.5 rounded-full ${dotClass} opacity-45`} />
          <span className="text-[11px] text-mono text-foreground/28 uppercase tracking-wider">
            {project.role}
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

// ─── Section label ────────────────────────────────────────────────────────────
const SectionLabel = ({
  title,
  dotClass,
}: {
  title: string;
  dotClass: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5, ease }}
      className="flex items-center gap-2.5 mb-14"
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass} opacity-70`} />
      <span className="text-sm font-normal text-foreground/40 text-mono tracking-[0.06em]">
        {title}
      </span>
    </motion.div>
  );
};

// ─── Main tiered layout ───────────────────────────────────────────────────────
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
  // Tier assignment by position
  const hero          = projects[0];               // Aura
  const secondaryHero = projects[1];               // Neuralyfe
  const secondary     = projects.slice(2, 4);      // FlowPrint, Tubular
  const minor         = projects.slice(4);         // Mood Muse…

  return (
    <section id={id} className="px-6 md:px-16 lg:px-24 pt-24">
      <SectionLabel title={sectionTitle} dotClass={dotClass} />

      {/* ── Tier 1: Hero (full width) ── */}
      {hero && (
        <div className="mb-20 md:mb-24">
          <ProjectCard
            project={hero}
            projectId={hero.id}
            dotClass={dotClass}
            tier="hero"
            globalIndex={0}
          />
        </div>
      )}

      {/* ── Tier 1: Secondary-hero (9/12 cols, offset right) ── */}
      {secondaryHero && (
        <div
          className="mb-[140px]"
          style={{ display: "grid", gridTemplateColumns: "repeat(12,1fr)", gap: "1.5rem" }}
        >
          <div
            style={{
              gridColumn: "1 / 13",
            }}
            className="lg:[grid-column:4_/_13]"
          >
            {/* Use inline style for the lg offset since Tailwind arbitrary grid-column isn't reliable */}
            <div className="lg:ml-[25%]">
              <ProjectCard
                project={secondaryHero}
                projectId={secondaryHero.id}
                dotClass={dotClass}
                tier="secondary-hero"
                globalIndex={1}
                rowDelay={0.05}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Tier 2: Secondary pair (6/12 each) ── */}
      {secondary.length > 0 && (
        <div
          className="mb-[140px]"
          style={{ display: "grid", gridTemplateColumns: "repeat(12,1fr)", gap: "1.5rem 2rem" }}
        >
          {secondary.map((p, i) => (
            <div
              key={p.title}
              style={{ gridColumn: "span 12" }}
              className="md:[grid-column:span_6]"
            >
              <ProjectCard
                project={p}
                projectId={p.id}
                dotClass={dotClass}
                tier="secondary"
                globalIndex={2 + i}
                rowDelay={i * 0.08}
              />
            </div>
          ))}
        </div>
      )}

      {/* ── Tier 3: Minor (5/12 cols) ── */}
      {minor.length > 0 && (
        <div
          className="pb-10"
          style={{ display: "grid", gridTemplateColumns: "repeat(12,1fr)", gap: "1.5rem 2rem" }}
        >
          {minor.map((p, i) => (
            <div
              key={p.title}
              style={{ gridColumn: "span 12" }}
              className="md:[grid-column:span_7] lg:[grid-column:span_5]"
            >
              <ProjectCard
                project={p}
                projectId={p.id}
                dotClass={dotClass}
                tier="minor"
                globalIndex={4 + i}
                rowDelay={i * 0.06}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

// ─── AI tiered layout ─────────────────────────────────────────────────────────
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
  <section id={id} className="px-6 md:px-16 lg:px-24 pt-24 pb-24">
    <SectionLabel title={sectionTitle} dotClass={dotClass} />
    <div
      style={{ display: "grid", gridTemplateColumns: "repeat(12,1fr)", gap: "1.5rem 2rem" }}
    >
      {projects.map((p, i) => (
        <div
          key={p.title}
          style={{ gridColumn: "span 12" }}
          className="sm:[grid-column:span_6] lg:[grid-column:span_4]"
        >
          <ProjectCard
            project={p}
            projectId={p.id}
            dotClass={dotClass}
            tier="minor"
            globalIndex={i}
            rowDelay={i * 0.07}
          />
        </div>
      ))}
    </div>
  </section>
);

// ─── Public component (router) ────────────────────────────────────────────────
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
