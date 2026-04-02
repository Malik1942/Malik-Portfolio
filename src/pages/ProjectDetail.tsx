import { useParams, useNavigate } from "react-router-dom";
import CustomCursor from "@/components/CustomCursor";
import auraCover from "@/assets/aura-cover.png";
import neuralyfeCover from "@/assets/neuralyfe-cover.png";
import flowprintCover from "@/assets/flowprint-cover.png";
import tubularCover from "@/assets/tubular-cover.jpg";
import moodmuseCover from "@/assets/moodmuse-cover.png";

const allProjects: Record<string, {
  title: string;
  description: string;
  role: string;
  year: string;
  coverImage?: string;
  coverFit?: "cover" | "contain";
  details?: string;
  section: string;
}> = {
  aura: {
    title: "Aura",
    description: "A calm, proactive system for preventing motion sickness in motion.",
    role: "Product Designer",
    year: "2026",
    coverImage: auraCover,
    coverFit: "contain",
    section: "Main Projects",
    details: "Led the end-to-end design of a proactive, AI-driven wearable for motion sickness, defining its concept, system, and interaction model.\n\nShaped a seamless cross-device experience, integrating ambient AI to anticipate discomfort and deliver real-time support.",
  },
  neuralyfe: {
    title: "NeuraLyfe",
    description: "Making invisible brain trauma visible — before it becomes irreversible.",
    role: "Product Designer, Maker",
    year: "2026",
    coverImage: neuralyfeCover,
    section: "Main Projects",
    details: "Led ideation and defined the problem scope for NeuraLyfe, designing the AI-driven Impact Replay interface and contributing across both digital and physical product development.\n\nAwarded 1st Place at FigBuild 2026, recognizing the project's concept, execution, and system design.",
  },
  flowprint: {
    title: "FlowPrint",
    description: "A frictionless 3D printing system that removes complexity for beginners.",
    role: "Lead Product Designer",
    year: "2026",
    coverImage: flowprintCover,
    coverFit: "contain",
    section: "Main Projects",
    details: "Led product design for a consumer 3D printing experience that reduced setup time from 1 hours to 15 minutes.\n\nDesigned onboarding flows, real-time print monitoring UI, and a material recommendation engine.",
  },
  tubular: {
    title: "Tubular",
    description: "Defy gravity. Shape the path.",
    role: "Product Designer, Maker",
    year: "2026",
    coverImage: tubularCover,
    section: "Main Projects",
    details: "Conceptualized and built an experimental physics-based toy that teaches fluid dynamics through play.\n\nCombined industrial design with digital prototyping to create an intuitive, tactile learning experience.",
  },
  moodmuse: {
    title: "Mood Muse",
    description: "An emotional expression aid designed for autistic children.",
    role: "Product Designer",
    year: "2026",
    coverImage: moodmuseCover,
    section: "Main Projects",
    details: "A system that helps children externalize and communicate their internal emotional states through intuitive interactions, reducing frustration and enabling clearer social connection.",
  },
  inspireocean: {
    title: "Inspire Ocean",
    description: "AI content generation for creators.",
    role: "Designer + Builder",
    year: "2025",
    section: "Built with AI",
    details: "Designed and shipped an AI-powered content generation platform for social media creators.\n\nBuilt end-to-end with AI coding tools, focusing on intuitive prompt interfaces and real-time preview.",
  },
  studiowaters: {
    title: "Studio Waters",
    description: "Predictive analytics made visual.",
    role: "Designer + Builder",
    year: "2026",
    section: "Built with AI",
    details: "Created a data visualization tool that transforms complex predictive models into clear, actionable insights.\n\nDesigned interactive charts and customizable dashboard layouts.",
  },
};

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const project = id ? allProjects[id] : undefined;

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Project not found</h1>
          <button
            onClick={() => navigate("/")}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <CustomCursor />

      {/* Back navigation */}
      <div className="px-6 md:px-16 lg:px-24 pt-8">
        <button
          onClick={() => navigate("/")}
          className="text-muted-foreground hover:text-foreground transition-colors text-sm text-mono flex items-center gap-2"
        >
          ← Back
        </button>
      </div>

      {/* Hero */}
      <div className="px-6 md:px-16 lg:px-24 pt-16 pb-12">
        <p className="text-muted-foreground text-xs text-mono uppercase tracking-wider mb-4">
          {project.section}
        </p>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground text-display mb-6">
          {project.title}
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground text-body max-w-2xl">
          {project.description}
        </p>
        <div className="mt-6 flex items-center gap-6 text-sm text-muted-foreground text-mono">
          <span>{project.role}</span>
          <span>·</span>
          <span>{project.year}</span>
        </div>
      </div>

      {/* Cover image */}
      {project.coverImage && (
        <div className="px-6 md:px-16 lg:px-24 pb-16">
          <img
            src={project.coverImage}
            alt={project.title}
            className={`w-full max-h-[500px] rounded-sm bg-background ${project.coverFit === "contain" ? "object-contain" : "object-cover"}`}
          />
        </div>
      )}

      {/* Details */}
      <div className="px-6 md:px-16 lg:px-24 pb-24">
        <div className="max-w-2xl">
          <p className="text-foreground/80 text-lg leading-relaxed whitespace-pre-line text-body">
            {project.details}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
