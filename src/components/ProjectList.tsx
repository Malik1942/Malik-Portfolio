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

// Group flat list into rows: pairs + optional solo at end
function groupIntoRows(projects: Project[]): Project[][] {
  const rows: Project[][] = [];
  let i = 0;
  while (i < projects.length) {
    if (i + 1 < projects.length) {
      rows.push([projects[i], projects[i + 1]]);
      i += 2;
    } else {
      rows.push([projects[i]]);
      i += 1;
    }
  }
  return rows;
}

// Alternating split: row 0 → [62%, 38%], row 1 → [38%, 62%], solo → [100%]
function getRowFractions(rowIndex: number, count: number): string {
  if (count === 1) return "1fr";
  return rowIndex % 2 === 0 ? "1.65fr 1fr" : "1fr 1.65fr";
}

// Taller image for the larger card in a pair
function getImageHeight(isBig: boolean, isSolo: boolean): string {
  if (isSolo) return "clamp(280px, 40vw, 540px)";
  if (isBig)  return "clamp(300px, 38vw, 520px)";
  return "clamp(220px, 28vw, 400px)";
}

const ProjectCard = ({
  project,
  projectId,
  dotClass,
  globalIndex,
  isBig,
  isSolo,
}: {
  project: Project;
  projectId?: string;
  dotClass: string;
  globalIndex: number;
  isBig: boolean;
  isSolo: boolean;
}) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: true, margin: "0px 0px -60px 0px" });

  const imageHeight = getImageHeight(isBig, isSolo);

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
      initial={{ opacity: 0, y: 44 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay: globalIndex * 0.07, ease }}
      className="cursor-pointer group flex flex-col"
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-clickable="true"
    >
      {/* Index + meta */}
      <div className="flex items-baseline justify-between mb-3">
        <span className="text-[10px] text-mono text-foreground/22 tabular-nums">
          {String(globalIndex + 1).padStart(2, "0")}
        </span>
        <div className="flex items-center gap-3">
          {isBig && (
            <span className="hidden md:block text-[11px] text-foreground/28 text-body">
              {project.role}
            </span>
          )}
          <span className="text-[10px] text-mono text-foreground/22">{project.year}</span>
        </div>
      </div>

      {/* Image */}
      <div
        className="overflow-hidden rounded-2xl bg-secondary/15 relative mb-4"
        style={{ height: imageHeight }}
      >
        {project.coverVideo ? (
          <video
            src={project.coverVideo}
            autoPlay loop muted playsInline
            className="w-full h-full object-cover"
            style={{
              transform: hovered ? "scale(1.045)" : "scale(1)",
              transition: "transform 0.85s cubic-bezier(0.22,1,0.36,1)",
            }}
          />
        ) : project.coverImage ? (
          <img
            src={project.coverImage}
            alt={project.title}
            className={`w-full h-full ${project.coverFit === "contain" ? "object-contain" : "object-cover"}`}
            style={{
              transform: hovered ? "scale(1.045)" : "scale(1)",
              transition: "transform 0.85s cubic-bezier(0.22,1,0.36,1)",
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
        className="text-display font-semibold leading-[1.08] tracking-[-0.02em] mb-2 transition-colors duration-500"
        style={{
          fontSize: isBig || isSolo ? "clamp(1.5rem, 2.4vw, 2.2rem)" : "clamp(1.2rem, 1.8vw, 1.65rem)",
          color: hovered ? "hsl(var(--foreground))" : "hsl(var(--foreground) / 0.7)",
        }}
      >
        {project.title}
      </h3>

      {/* Description + arrow */}
      <div className="flex items-start justify-between gap-4 mt-auto">
        <p className="text-foreground/38 text-sm text-body leading-relaxed">
          {project.description}
        </p>
        <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
          <span className={`w-1.5 h-1.5 rounded-full ${dotClass} opacity-50`} />
          <motion.span
            animate={{ x: hovered ? 3 : 0, opacity: hovered ? 0.85 : 0.2 }}
            transition={{ duration: 0.3, ease }}
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
  const rows = groupIntoRows(projects);

  return (
    <section id={id} className="px-6 md:px-16 lg:px-24 pt-24 pb-10">
      {/* Section header */}
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 20 }}
        animate={headerInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease }}
        className="flex items-end justify-between gap-6 mb-14 pb-5 border-b border-border/35"
      >
        <div className="flex items-center gap-3">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotClass}`} />
          <h2 className="text-xl md:text-2xl font-semibold text-foreground text-display tracking-tight">
            {sectionTitle}
          </h2>
        </div>
        <p className="text-foreground/32 text-xs text-body text-right max-w-[200px] hidden md:block leading-relaxed">
          {sectionSubtitle}
        </p>
      </motion.div>

      {/* Mosaic grid rows */}
      <div className="flex flex-col gap-6 md:gap-8">
        {rows.map((row, rowIdx) => {
          const isSoloRow = row.length === 1;
          const fractions = getRowFractions(rowIdx, row.length);
          // Determine which card in the row is "big"
          const bigIndex = rowIdx % 2 === 0 ? 0 : 1;

          // Accumulate global index for stagger
          let globalBase = 0;
          for (let r = 0; r < rowIdx; r++) globalBase += rows[r].length;

          return (
            <div
              key={rowIdx}
              className="grid gap-4 md:gap-6"
              style={{
                gridTemplateColumns: `${fractions}`,
              }}
            >
              {row.map((project, colIdx) => (
                <ProjectCard
                  key={project.title}
                  project={project}
                  projectId={project.id}
                  dotClass={dotClass}
                  globalIndex={globalBase + colIdx}
                  isBig={isSoloRow || colIdx === bigIndex}
                  isSolo={isSoloRow}
                />
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProjectList;
