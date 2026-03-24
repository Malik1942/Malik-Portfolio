import CustomCursor from "@/components/CustomCursor";
import HeroSection from "@/components/HeroSection";
import ProjectList from "@/components/ProjectList";
import auraCover from "@/assets/aura-cover.png";
import neuralyfeCover from "@/assets/neuralyfe-cover.png";
import flowprintCover from "@/assets/flowprint-cover.png";

const selectedWork = [
  {
    id: "aura",
    title: "Aura",
    description: "A calm, proactive system for preventing motion sickness in motion.",
    role: "Product Designer",
    year: "2025",
    coverImage: auraCover,
    coverFit: "contain" as const,
    details: "Led the end-to-end design of Aura, defining its concept, system scope, and interaction model as a proactive, AI-driven wearable for motion sickness.\n\nTranslated research into a cohesive product strategy, prioritizing features within technical constraints and shaping a seamless end-to-end experience from onboarding to real-time relief.\n\nDesigned the user flow and interaction across hardware and software, contributing to both the industrial design of the device and its integration with the mobile app.\n\nDefined the role of ambient AI in sensing context, predicting discomfort, and delivering timely, adaptive support.",
  },
  {
    id: "neuralyfe",
    title: "NeuraLyfe",
    description: "Making invisible brain trauma visible — before it becomes irreversible.",
    role: "Product Designer, Maker",
    coverImage: neuralyfeCover,
    year: "2025",
    details: "Led early-stage ideation and defined the problem space for NeuraLyfe, framing how invisible cumulative brain trauma could be made perceptible and actionable.\n\nDesigned and prompted the AI-driven Impact Replay interface, translating impact data into intuitive, emotionally resonant visual narratives.\n\nContributed to the end-to-end system, including interaction design, visual direction, and the design, rendering, and prototyping of the physical device.\n\nThe project was recognized with 1st Place at FigBuild 2026, validating its strength in concept, execution, and system-level thinking.",
  },
  {
    id: "flowprint",
    title: "FlowPrint",
    description: "A frictionless 3D printing system that removes complexity for beginners.",
    role: "Lead Product Designer",
    coverImage: flowprintCover,
    coverFit: "contain" as const,
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
