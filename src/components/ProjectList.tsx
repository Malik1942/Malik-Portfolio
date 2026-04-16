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
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay: index * 0.08, ease }}
      className="mb-20 md:mb-28 cursor-pointer group"
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-clickable="true"
    >
      {/* Header: number + title + meta */}
      <div className="flex items-end justify-between gap-6 mb-5">
        <div className="flex items-baseline gap-4 min-w-0">
          <span className="text-[11px] text-mono text-foreground/22 flex-shrink-0 tabular-nums pb-1">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3
            className="text-[2rem] md:text-[2.75rem] lg:text-[3.25rem] font-semibold text-display leading-[1.05] tracking-[-0.02em] transition-colors duration-500"
            style={{ color: hovered ? "hsl(var(--foreground))" : "hsl(var(--foreground) / 0.72)" }}
          >
            {project.title}
          </h3>
        </div>

        <div className="flex items-center gap-4 pb-1 shrink-0">
          <span className="hidden md:block text-xs text-foreground/35 text-body">{project.role}</span>
          <span className="text-[11px] text-mono text-foreground/28">{project.year}</span>
          <motion.span
            animate={{ x: hovered ? 4 : 0, opacity: hovered ? 1 : 0.3 }}
            transition={{ duration: 0.4, ease }}
            className="text-foreground text-base leading-none"
          >
            →
          </motion.span>
        </div>
      </div>

      {/* Cover image / video — full width, tall */}
      <div className="overflow-hidden rounded-2xl bg-secondary/20 relative">
        {project.coverVideo ? (
          <video
            src={project.coverVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-full object-cover"
            style={{
              height: "clamp(260px, 48vw, 560px)",
              transform: hovered ? "scale(1.04)" : "scale(1)",
              transition: "transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
        ) : project.coverImage ? (
          <img
            src={project.coverImage}
            alt={project.title}
            className={`w-full ${project.coverFit === "contain" ? "object-contain" : "object-cover"}`}
            style={{
              height: "clamp(260px, 48vw, 560px)",
              transform: hovered ? "scale(1.04)" : "scale(1)",
              transition: "transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
        ) : (
          <div
            className="w-full flex items-center justify-center"
            style={{ height: "clamp(260px, 48vw, 560px)" }}
          >
            <span className="text-foreground/15 text-sm text-mono uppercase tracking-widest">
              No image
            </span>
          </div>
        )}

        {/* Subtle hover scrim */}
        <motion.div
          className="absolute inset-0 bg-foreground/[0.04] pointer-events-none rounded-2xl"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Footer: description + dot */}
      <div className="mt-4 flex items-start justify-between gap-6">
        <p className="text-foreground/42 text-sm text-body leading-relaxed max-w-lg">
          {project.description}
        </p>
        <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${dotClass} opacity-50`} />
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
        initial={{ opacity: 0, y: 24 }}
        animate={headerInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, ease }}
        className="flex items-end justify-between gap-6 mb-16 pb-6 border-b border-border/40"
      >
        <div className="flex items-center gap-3">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotClass}`} />
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-display tracking-tight">
            {sectionTitle}
          </h2>
        </div>
        <p className="text-foreground/38 text-sm text-body text-right max-w-xs hidden md:block">
          {sectionSubtitle}
        </p>
      </motion.div>

      {/* Cards */}
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
