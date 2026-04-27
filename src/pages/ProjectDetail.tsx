import { useParams, useNavigate } from "react-router-dom";
import { ProjectDetailTemplate } from "@/components/project-detail/ProjectDetailTemplate";
import { getProjectDetail } from "@/data/projectDetails";
import { PageTransition } from "@/components/PageTransition";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const project = getProjectDetail(id);

  if (!project) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <h1 className="text-2xl md:text-3xl font-light text-foreground mb-4 text-display">Project not found</h1>
            <button
              type="button"
              onClick={() => navigate("/")}
              aria-label="Back to home"
              className="group flex items-center gap-2 min-h-[44px] px-1 text-sm text-body text-foreground/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 rounded transition-colors duration-200"
            >
              <svg
                aria-hidden="true"
                className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back to home
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <ProjectDetailTemplate
          key={project.slug}
          project={project}
          onBack={() => navigate("/")}
          onMainProjectsClick={() => navigate("/#projects")}
        />
      </div>
    </PageTransition>
  );
};

export default ProjectDetail;
