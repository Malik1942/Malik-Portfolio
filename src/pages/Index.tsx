import CustomCursor from "@/components/CustomCursor";
import HeroSection from "@/components/HeroSection";
import ProjectList from "@/components/ProjectList";

const selectedWork = [
  {
    id: "aura",
    title: "Aura",
    description: "A calm, proactive system for preventing motion sickness in motion.",
    role: "Product Designer",
    year: "2025",
    details: "Led the end-to-end design of a fintech app that simplifies budgeting, investing, and saving for young professionals.\n\nConducted user research with 200+ participants, developed a design system from scratch, and shipped an MVP that grew to 50K users in 3 months.",
  },
  {
    id: "neuralyfe",
    title: "NeuraLyfe",
    description: "Making invisible brain trauma visible — before it becomes irreversible.",
    role: "Product Designer, Maker",
    year: "2025",
    details: "Designed and prototyped a diagnostic platform that visualizes brain injury data for clinicians.\n\nCreated interactive data dashboards, patient journey flows, and a design system that unified medical complexity into intuitive interfaces.",
  },
  {
    id: "flowprint",
    title: "FlowPrint",
    description: "A frictionless 3D printing system that removes complexity for beginners.",
    role: "Lead Product Designer",
    year: "2026",
    details: "Led product design for a consumer 3D printing experience that reduced setup time from 2 hours to 15 minutes.\n\nDesigned onboarding flows, real-time print monitoring UI, and a material recommendation engine.",
  },
  {
    id: "tubular",
    title: "Tubular",
    description: "Defy gravity. Shape the path.",
    role: "Product Designer, Maker",
    year: "2026",
    details: "Conceptualized and built an experimental physics-based toy that teaches fluid dynamics through play.\n\nCombined industrial design with digital prototyping to create an intuitive, tactile learning experience.",
  },
];

const aiProjects = [
  {
    id: "inspireocean",
    title: "Inspire Ocean",
    description: "AI content generation for creators.",
    role: "Designer + Builder",
    year: "2025",
    details: "Designed and shipped an AI-powered content generation platform for social media creators.\n\nBuilt end-to-end with AI coding tools, focusing on intuitive prompt interfaces and real-time preview.",
  },
  {
    id: "studiowaters",
    title: "Studio Waters",
    description: "Predictive analytics made visual.",
    role: "Designer + Builder",
    year: "2024",
    details: "Created a data visualization tool that transforms complex predictive models into clear, actionable insights.\n\nDesigned interactive charts and customizable dashboard layouts.",
  },
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
