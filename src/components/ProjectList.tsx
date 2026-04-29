import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";

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

// ─── Thin animated rule between cards ────────────────────────────────────────
const CardDivider = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="my-14 md:my-20 overflow-hidden">
      <motion.div
        className="h-px bg-foreground/[0.07]"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: inView ? 1 : 0 }}
        style={{ transformOrigin: "left" }}
        transition={{ duration: 0.9, ease }}
      />
    </div>
  );
};

// ─── Section label ────────────────────────────────────────────────────────────
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
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 12 }}
      transition={{ duration: 0.6, ease }}
      className="flex items-center gap-3 mb-14 md:mb-16"
    >
      <span
        className={`rounded-full flex-shrink-0 ${dotClass} ${
          variant === "primary" ? "w-1.5 h-1.5 opacity-70" : "w-1 h-1 opacity-35"
        }`}
      />
      <span
        className={`text-mono text-[10px] tracking-[0.2em] uppercase ${
          variant === "primary" ? "text-foreground/50" : "text-foreground/30"
        }`}
      >
        {title}
      </span>
    </motion.div>
  );
};

// ─── Cinematic card ───────────────────────────────────────────────────────────
// Scroll-in: clip-path mask from bottom — no opacity, pure wipe.
// inset(100% 0 0 0): top inset 100% → clip rect is 0-height at the bottom → nothing visible.
// inset(0 0 0 0):   no inset → fully visible. As top-inset shrinks, content rises into view.
const CinematicCard = ({
  project,
  index,
  cardNumber,
  aiVariant = false,
}: {
  project: Project;
  index: number;
  cardNumber: number;
  aiVariant?: boolean;
}) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });
  const num = String(cardNumber).padStart(2, "0");

  const handleClick = () => {
    if (project.externalUrl) {
      window.open(project.externalUrl, "_blank", "noopener,noreferrer");
    } else if (project.id) {
      navigate(`/project/${project.id}`);
    }
  };

  const metaRight = aiVariant && project.builtWith
    ? `Built with ${project.builtWith}`
    : project.role;

  return (
    <motion.div
      ref={ref}
      id={project.id ? `project-${project.id}` : undefined}
      className="cursor-pointer"
      initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
      animate={{ clipPath: inView ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)" }}
      transition={{ duration: 1.2, ease, delay: index * 0.06 }}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-clickable="true"
    >
      {/* ── Index number ── */}
      <div className="mb-4 md:mb-5">
        <span className="text-mono text-[10px] tracking-[0.22em] uppercase text-foreground/22">
          {num}
        </span>
      </div>

      {/* ── 16:9 poster — image always present, video crossfades on hover ── */}
      <div
        className="relative w-full overflow-hidden bg-secondary/10"
        style={{ aspectRatio: "16 / 9" }}
      >
        {project.coverImage && (
          <img
            src={project.coverImage}
            alt={project.title}
            className="absolute inset-0 w-full h-full"
            style={{
              objectFit: project.coverFit === "contain" ? "contain" : "cover",
              transform: hovered ? "scale(1.025)" : "scale(1)",
              transition: "transform 1s cubic-bezier(0.22,1,0.36,1)",
            }}
          />
        )}

        {/* Video layer — fades in over 600ms on hover */}
        {project.coverVideo && (
          <video
            src={project.coverVideo}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.6s ease",
            }}
          />
        )}

        {/* Subtle cinematic darken on hover */}
        <div
          className="absolute inset-0 bg-black pointer-events-none"
          style={{ opacity: hovered ? 0.06 : 0, transition: "opacity 0.6s ease" }}
        />
      </div>

      {/* ── Title + year · role ── */}
      <div className="flex justify-between items-end mt-5 md:mt-6 gap-8">
        <motion.h3
          className="text-serif font-normal leading-[1.08] flex-1 min-w-0"
          style={{
            fontSize: "clamp(1.5rem, 2.6vw, 2.6rem)",
            letterSpacing: "-0.025em",
            color: hovered
              ? "hsl(var(--foreground))"
              : "hsl(var(--foreground) / 0.88)",
            transition: "color 0.3s ease",
          }}
          animate={{ y: hovered ? -6 : 0 }}
          transition={{ duration: 0.45, ease }}
        >
          {project.title}
        </motion.h3>

        <p
          className="text-mono flex-shrink-0 text-right"
          style={{
            fontSize: "0.625rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "hsl(var(--foreground) / 0.28)",
            maxWidth: "200px",
          }}
        >
          {project.year}&ensp;·&ensp;{metaRight}
        </p>
      </div>
    </motion.div>
  );
};

// ─── Section wrapper ──────────────────────────────────────────────────────────
const CinematicSection = ({
  id,
  sectionTitle,
  dotClass,
  projects,
  variant = "main",
}: {
  id: string;
  sectionTitle: string;
  dotClass: string;
  projects: Project[];
  variant?: "main" | "ai";
}) => (
  <section
    id={id}
    className={`px-6 md:px-16 lg:px-24 pt-24 md:pt-32 ${
      variant === "ai" ? "pb-24 md:pb-32" : ""
    }`}
  >
    <SectionLabel
      title={sectionTitle}
      dotClass={dotClass}
      variant={variant === "ai" ? "secondary" : "primary"}
    />

    {projects.map((project, i) => (
      <div key={project.id ?? project.title}>
        {i > 0 && <CardDivider />}
        <CinematicCard
          project={project}
          index={i}
          cardNumber={i + 1}
          aiVariant={variant === "ai"}
        />
      </div>
    ))}
  </section>
);

// ─── Public component ─────────────────────────────────────────────────────────
const ProjectList = ({
  id,
  sectionTitle,
  sectionSubtitle: _,
  dotColor,
  projects,
  variant = "main",
}: ProjectListProps) => {
  const dotClass = dotColor === "red" ? "bg-dot-red" : "bg-dot-gold";
  return (
    <CinematicSection
      id={id}
      sectionTitle={sectionTitle}
      dotClass={dotClass}
      projects={projects}
      variant={variant}
    />
  );
};

export default ProjectList;
