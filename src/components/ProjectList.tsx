import { motion } from "framer-motion";

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
  const dotClass = dotColor === "red" ? "bg-dot-red" : "bg-dot-gold";

  return (
    <section id={id} className="px-6 md:px-16 lg:px-24 py-24">
      <motion.div
        className="mb-16 flex items-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <span className={`w-3 h-3 rounded-full ${dotClass}`} />
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-display">
            {sectionTitle}
          </h2>
          <p className="mt-1 text-muted-foreground text-body text-sm">{sectionSubtitle}</p>
        </div>
      </motion.div>

      <div>
        {projects.map((project, i) => (
          <motion.div
            key={project.title}
            className="border-t border-border cursor-pointer group"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <div className="py-8 md:py-10 flex items-start justify-between gap-4">
              <div className="flex-1">
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
              <div className="flex items-center gap-6 text-sm text-muted-foreground text-body mt-2">
                <span className="hidden md:block">{project.role}</span>
                <span>{project.year}</span>
                <motion.span
                  className="text-xl"
                  whileHover={{ rotate: 45 }}
                  transition={{ duration: 0.2 }}
                >
                  +
                </motion.span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ProjectList;
