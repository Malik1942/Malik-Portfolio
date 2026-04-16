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
}

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Each layout shifts the card's horizontal anchor and image width
// creating a staggered, "placed" rhythm instead of a uniform list
const LAYOUTS = [
  { paddingLeft: "0%",  paddingRight: "10%", imageWidth: "100%" },
  { paddingLeft: "16%", paddingRight: "0%",  imageWidth: "100%" },
  { paddingLeft: "6%",  paddingRight: "14%", imageWidth: "100%" },
  { paddingLeft: "20%", paddingRight: "0%",  imageWidth: "100%" },
  { paddingLeft: "2%",  paddingRight: "8%",  imageWidth: "100%" },
];

const ProjectCard = ({
  project,
  index,
  dotClass,
  projectId,
}: {
  project: Project;
  index: number;
  dotClass: string;
  projectId?: string;
}) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: true, margin: "0px 0px -60px 0px" });

  const layout = LAYOUTS[index % LAYOUTS.length];

  const handleClick = () => {
    if (project.externalUrl) {
      window.open(project.externalUrl, "_blank", "noopener,noreferrer");
    } else if (projectId) {
      navigate(`/project/${projectId}`);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      id={projectId ? `project-${projectId}` : undefined}
      initial={{ opacity: 0, y: 52 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.06, ease }}
      className="mb-20 md:mb-28 cursor-pointer group"
      style={{
        paddingLeft: layout.paddingLeft,
        paddingRight: layout.paddingRight,
      }}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-clickable="true"
    >
      {/* Number — floats above as a textural element */}
      <div className="flex items-baseline justify-between gap-4 mb-3">
        <span className="text-[11px] text-mono text-foreground/20 tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="flex items-center gap-4">
          <span className="hidden md:block text-[11px] text-foreground/30 text-body tracking-wide">
            {project.role}
          </span>
          <span className="text-[11px] text-mono text-foreground/25">{project.year}</span>
        </div>
      </div>

      {/* Title */}
      <div className="mb-5">
        <h3
          className="text-[2.1rem] md:text-[2.8rem] lg:text-[3.4rem] font-semibold text-display leading-[1.04] tracking-[-0.025em] transition-colors duration-500"
          style={{ color: hovered ? "hsl(var(--foreground))" : "hsl(var(--foreground) / 0.68)" }}
        >
          {project.title}
        </h3>
      </div>

      {/* Image — constrained to layout width, feels "placed" */}
      <div
        className="overflow-hidden rounded-2xl bg-secondary/15 relative"
        style={{ width: layout.imageWidth }}
      >
        {project.coverVideo ? (
          <video
            src={project.coverVideo}
            autoPlay loop muted playsInline
            className="w-full object-cover block"
            style={{
              height: "clamp(240px, 44vw, 520px)",
              transform: hovered ? "scale(1.04)" : "scale(1)",
              transition: "transform 0.85s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
        ) : project.coverImage ? (
          <img
            src={project.coverImage}
            alt={project.title}
            className={`w-full block ${project.coverFit === "contain" ? "object-contain" : "object-cover"}`}
            style={{
              height: "clamp(240px, 44vw, 520px)",
              transform: hovered ? "scale(1.04)" : "scale(1)",
              transition: "transform 0.85s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
        ) : (
          <div
            className="w-full flex items-center justify-center"
            style={{ height: "clamp(240px, 44vw, 520px)" }}
          >
            <span className="text-foreground/15 text-xs text-mono uppercase tracking-[0.2em]">
              No image
            </span>
          </div>
        )}

        <motion.div
          className="absolute inset-0 bg-foreground/[0.035] pointer-events-none"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Footer: description + arrow */}
      <div className="mt-4 flex items-start justify-between gap-6">
        <p className="text-foreground/38 text-sm text-body leading-relaxed max-w-sm">
          {project.description}
        </p>
        <div className="flex items-center gap-2 shrink-0 pt-0.5">
          <span className={`w-1.5 h-1.5 rounded-full ${dotClass} opacity-50`} />
          <motion.span
            animate={{ x: hovered ? 4 : 0, opacity: hovered ? 0.9 : 0.25 }}
            transition={{ duration: 0.35, ease }}
            className="text-foreground text-sm text-mono"
          >
            →
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
};

const ProjectList = ({
  id,
  sectionTitle,
  sectionSubtitle,
  dotColor,
  projects,
}: ProjectListProps) => {
  const dotClass = dotColor === "red" ? "bg-dot-red" : "bg-dot-gold";
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "0px 0px -40px 0px" });

  return (
    <section id={id} className="px-6 md:px-16 lg:px-24 pt-24 pb-10">
      {/* Section header */}
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 20 }}
        animate={headerInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease }}
        className="flex items-end justify-between gap-6 mb-16 pb-5 border-b border-border/35"
      >
        <div className="flex items-center gap-3">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotClass}`} />
          <h2 className="text-xl md:text-2xl font-semibold text-foreground text-display tracking-tight">
            {sectionTitle}
          </h2>
        </div>
        <p className="text-foreground/32 text-xs text-body text-right max-w-[220px] hidden md:block leading-relaxed">
          {sectionSubtitle}
        </p>
      </motion.div>

      {/* Staggered cards */}
      <div>
        {projects.map((project, i) => (
          <ProjectCard
            key={project.title}
            project={project}
            index={i}
            dotClass={dotClass}
            projectId={project.id}
          />
        ))}
      </div>
    </section>
  );
};

export default ProjectList;
