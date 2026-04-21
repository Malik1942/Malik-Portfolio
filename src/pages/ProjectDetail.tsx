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
              className="text-muted-foreground hover:text-foreground transition-colors text-sm text-body"
            >
              ← Back to home
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
