import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

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

const ProjectRow = ({ project, index, dotClass, projectId }: { project: Project; index: number; dotClass: string; projectId?: string }) => {
  const navigate = useNavigate();
  const rowRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isArriving, setIsArriving] = useState(false);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1, rootMargin: "-20px" }
    );

    observer.observe(row);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onArrive = (event: Event) => {
      const { id } = (event as CustomEvent<{ id?: string }>).detail ?? {};
      const matches = !!projectId && id === projectId;

      if (matches) {
        setIsVisible(true);
        setIsArriving(true);
      } else {
        setIsArriving(false);
      }
    };

    window.addEventListener("project-dot-arrive", onArrive);

    return () => {
      window.removeEventListener("project-dot-arrive", onArrive);
    };
  }, [projectId]);

  const handleClick = () => {
    if (project.externalUrl) {
      window.open(project.externalUrl, "_blank", "noopener,noreferrer");
    } else if (projectId) {
      navigate(`/project/${projectId}`);
    }
  };

  return (
    <div
      ref={rowRef}
      id={projectId ? `project-${projectId}` : undefined}
      className={`reveal project-row border-t border-border group cursor-pointer ${isVisible ? "visible" : ""} ${isArriving ? "project-row-arriving" : ""}`}
      style={{ transitionDelay: `${index * 80}ms` }}
      data-clickable="true"
      onClick={handleClick}
      onAnimationEnd={() => setIsArriving(false)}
    >
      {/* Header row */}
      <div className="py-8 md:py-10 flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-4 mb-2">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotClass}`} />
            <span className="text-muted-foreground text-xs text-mono">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-muted-foreground text-display group-hover:text-foreground transition-colors duration-500">
              {project.title}
            </h3>
          </div>
          <p className="text-muted-foreground text-sm ml-14">{project.description}</p>
        </div>

        <div className="flex items-center gap-6 text-sm text-muted-foreground text-body mt-2 shrink-0">
          <span className="hidden md:block">{project.role}</span>
          <span className="text-mono text-xs">{project.year}</span>
          <span className="relative block w-[18px] h-[18px] text-muted-foreground group-hover:text-foreground transition-colors duration-500">
            <svg
              className="absolute inset-0 w-[18px] h-[18px] -rotate-45 transition-transform duration-500 group-hover:rotate-0 group-hover:translate-x-[1px]"
              style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)", transformOrigin: "50% 50%" }}
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M4.75 9H13.25M10.25 6L13.25 9L10.25 12"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>

      {/* Always visible details */}
      <div className="pb-10 ml-14">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Cover media */}
          <div className="w-full md:w-[320px] shrink-0">
            {project.coverVideo ? (
              <video
                src={project.coverVideo}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-[200px] object-cover rounded-sm bg-secondary"
              />
            ) : project.coverImage ? (
              <img
                src={project.coverImage}
                alt={project.title}
                className={`w-full h-[200px] rounded-sm bg-background ${project.coverFit === "contain" ? "object-contain" : "object-cover"}`}
              />
            ) : (
              <div className="w-full h-[200px] rounded-sm bg-secondary/50 border border-border flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <svg className="w-8 h-8 mx-auto mb-2 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs text-muted-foreground/60">Image / GIF / Video</span>
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
  );
};

const ProjectList = ({ id, sectionTitle, sectionSubtitle, dotColor, projects }: ProjectListProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const dotClass = dotColor === "red" ? "bg-dot-red" : "bg-dot-gold";
  const [isSectionArriving, setIsSectionArriving] = useState(false);

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

  useEffect(() => {
    const onSectionArrive = (event: Event) => {
      const { id: arrivedId } = (event as CustomEvent<{ id?: string }>).detail ?? {};
      if (arrivedId === id) {
        setIsSectionArriving(true);
      }
    };

    window.addEventListener("section-nav-arrive", onSectionArrive);
    return () => window.removeEventListener("section-nav-arrive", onSectionArrive);
  }, [id]);

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`project-section px-6 md:px-16 lg:px-24 py-24 ${isSectionArriving ? "project-section-arriving" : ""}`}
      onAnimationEnd={() => setIsSectionArriving(false)}
    >
      <div className="reveal mb-16" data-section-header="true">
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
          <ProjectRow key={project.title} project={project} index={i} dotClass={dotClass} projectId={project.id} />
        ))}
        <div className="border-t border-border" />
      </div>
    </section>
  );
};

export default ProjectList;
