import CustomCursor from "@/components/CustomCursor";
import HeroSection from "@/components/HeroSection";
import ProjectList from "@/components/ProjectList";

const selectedWork = [
  { title: "Aura", description: "A calm, proactive system for preventing motion sickness in motion.", role: "Product Designer", year: "2025" },
  { title: "NeuraLyfe", description: "Making invisible brain trauma visible — before it becomes irreversible.", role: "Product Designer, Maker", year: "2025" },
  { title: "FlowPrint", description: "A frictionless 3D printing system that removes complexity for beginners.", role: "Lead Product Designer", year: "2026" },
  { title: "Tubular", description: "Defy gravity. Shape the path.", role: "Product Designer, Maker", year: "2026" },
];

const aiProjects = [
  { title: "NeuraLyfe", description: "Making invisible brain trauma visible — before it becomes irreversible.", role: "Designer + Builder", year: "2025" },
  { title: "Inspire Ocean", description: "AI content generation for creators.", role: "Designer + Builder", year: "2025" },
  { title: "Studio Waters", description: "Predictive analytics made visual.", role: "Designer + Builder", year: "2024" },
  { title: "...", description: "Voice-first smart home control.", role: "Designer + Builder", year: "2024" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <CustomCursor />
      <HeroSection />
      <ProjectList
        id="projects"
        sectionTitle="Main Projects"
        sectionSubtitle="Major projects that shaped products and teams."
        dotColor="red"
        projects={selectedWork}
      />
      <ProjectList
        id="ai-projects"
        sectionTitle="Built with AI"
        sectionSubtitle="Side projects where I design and ship with AI tools."
        dotColor="gold"
        projects={aiProjects}
      />
    </div>
  );
};

export default Index;
