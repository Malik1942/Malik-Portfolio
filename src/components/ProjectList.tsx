import { useEffect, useRef } from "react";

interface Project {
  title: string;
  description: string;
  role: string;
  year: string;
}

interface ProjectListProps {
  id: string;
  sectionTitle: string;
  sectionSubtitle: string;
  dotColor: "red" | "gold";
  projects: Project[];
}

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
      {/* Section header */}
      <div className="reveal mb-16">
        <div className="flex items-center gap-3 mb-2">
          <span className={`w-2 h-2 rounded-full ${dotClass}`} />
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-display">
            {sectionTitle}
          </h2>
        </div>
        <p className="ml-5 text-muted-foreground text-sm text-body">{sectionSubtitle}</p>
      </div>

      {/* Project rows */}
      <div>
        {projects.map((project, i) => (
          <div
            key={project.title}
            className="reveal border-t border-border group"
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <div className="py-8 md:py-10 flex items-start justify-between gap-4">
              {/* Left */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-4 mb-2">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotClass}`} />
                  <span className="text-muted-foreground text-xs text-mono">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground text-display group-hover:text-muted-foreground transition-colors duration-500">
                    {project.title}
                  </h3>
                </div>
                <p className="text-muted-foreground text-sm ml-14">{project.description}</p>
              </div>

              {/* Right */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground text-body mt-2 shrink-0">
                <span className="hidden md:block">{project.role}</span>
                <span className="text-mono text-xs">{project.year}</span>
                <span className="text-lg text-muted-foreground group-hover:text-foreground group-hover:rotate-45 transition-all duration-500">
                  ↗
                </span>
              </div>
            </div>
          </div>
        ))}
        {/* Bottom border */}
        <div className="border-t border-border" />
      </div>
    </section>
  );
};

export default ProjectList;
