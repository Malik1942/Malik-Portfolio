import { useParams, useNavigate } from "react-router-dom";
import { ProjectDetailTemplate } from "@/components/project-detail/ProjectDetailTemplate";
import { getProjectDetail } from "@/data/projectDetails";
import { PageTransition } from "@/components/PageTransition";
import { projectReturn } from "@/data/projects";
import { BackLink } from "@/components/ui/BackLink";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const project = getProjectDetail(id);

  if (!project) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <h1 className="font-display text-title font-light text-foreground mb-4">Project not found</h1>
            <BackLink onClick={() => navigate("/")} aria-label="Back to home">
              Back to home
            </BackLink>
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
          onBack={() => {
            const origin = projectReturn(project.slug);
            navigate(origin.to, origin.state ? { state: origin.state } : undefined);
          }}
          onMainProjectsClick={() => {
            const origin = projectReturn(project.slug);
            navigate(origin.to, origin.state ? { state: origin.state } : undefined);
          }}
        />
      </div>
    </PageTransition>
  );
};

export default ProjectDetail;
