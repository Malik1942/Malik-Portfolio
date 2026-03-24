import { useEffect, useRef, useState } from "react";

interface Project {
  title: string;
  description: string;
  role: string;
  year: string;
  coverImage?: string;
  details?: string;
}

interface ProjectListProps {
  id: string;
  sectionTitle: string;
  sectionSubtitle: string;
  dotColor: "red" | "gold";
  projects: Project[];
}

const ProjectRow = ({ project, index, dotClass, projectId }: { project: Project; index: number; dotClass: string; projectId?: string }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      id={projectId ? `project-${projectId}` : undefined}
      className="reveal border-t border-border group"
      style={{ transitionDelay: `${index * 80}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header row */}
      <div className="py-8 md:py-10 flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-4 mb-2">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotClass}`} />
            <span className="text-muted-foreground text-xs text-mono">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground text-display group-hover:text-muted-foreground transition-colors duration-500">
              {project.title}
            </h3>
          </div>
          <p className="text-muted-foreground text-sm ml-14">{project.description}</p>
        </div>

        <div className="flex items-center gap-6 text-sm text-muted-foreground text-body mt-2 shrink-0">
          <span className="hidden md:block">{project.role}</span>
          <span className="text-mono text-xs">{project.year}</span>
          <span
            className="text-lg text-muted-foreground group-hover:text-foreground transition-all duration-500"
            style={{
              transform: isHovered ? "rotate(45deg)" : "rotate(0deg)",
              transition: "transform 0.5s cubic-bezier(0.4, 0, 0, 1)",
            }}
          >
            ↗
          </span>
        </div>
      </div>

      {/* Expandable details — CSS grid trick for smooth height animation */}
      <div
        className="grid"
        style={{
          gridTemplateRows: isHovered ? "1fr" : "0fr",
          transition: "grid-template-rows 0.6s cubic-bezier(0.4, 0, 0, 1)",
        }}
      >
        <div className="overflow-hidden">
          <div
            className="pb-10 ml-14"
            style={{
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? "translateY(0)" : "translateY(-8px)",
              transition: "opacity 0.5s ease 0.1s, transform 0.5s cubic-bezier(0.4, 0, 0, 1) 0.1s",
            }}
          >
            <div className="flex flex-col md:flex-row gap-8">
              {/* Cover image */}
              <div className="w-full md:w-[320px] shrink-0">
                {project.coverImage ? (
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="w-full h-[200px] object-cover rounded-sm bg-secondary"
                  />
                ) : (
                  <div className="w-full h-[200px] rounded-sm bg-secondary/50 border border-border flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <svg className="w-8 h-8 mx-auto mb-2 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs">Image / GIF / Video</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="flex-1">
                <p className="text-foreground/80 text-sm leading-relaxed whitespace-pre-line text-body">
                  {project.details || "Project details coming soon."}
                </p>
                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground text-mono uppercase tracking-wider">
                  <span>{project.role}</span>
                  <span>·</span>
                  <span>{project.year}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectList = ({ id, sectionTitle, sectionSubtitle, dotColor, projects }: ProjectListProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const dotClass = dotColor === "red" ? "bg-dot-red" : "bg-dot-gold";

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "-20px" }
    );

    const els = sectionRef.current?.querySelectorAll(".reveal");
    els?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section id={id} ref={sectionRef} className="px-6 md:px-16 lg:px-24 py-24">
      <div className="reveal mb-16">
        <div className="flex items-center gap-3 mb-2">
          <span className={`w-2 h-2 rounded-full ${dotClass}`} />
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-display">
            {sectionTitle}
          </h2>
        </div>
        <p className="ml-5 text-muted-foreground text-sm text-body">{sectionSubtitle}</p>
      </div>

      <div>
        {projects.map((project, i) => (
          <ProjectRow key={project.title} project={project} index={i} dotClass={dotClass} />
        ))}
        <div className="border-t border-border" />
      </div>
    </section>
  );
};

export default ProjectList;
