import { useCallback, useState } from "react";
import { scrollToSectionNavTarget } from "@/lib/scrollToTarget";
import HeroSection from "@/components/HeroSection";
import ProjectList from "@/components/ProjectList";
import Footer from "@/components/Footer";
import AboutDeepContent from "@/components/AboutDeepContent";
import auraCover from "@/assets/aura-cover.png";
import neuralyfeCover from "@/assets/neuralyfe-cover.png";
import flowprintCover from "@/assets/flowprint-cover.png";
import tubularCover from "@/assets/tubular-cover.jpg";
import moodmuseCover from "@/assets/moodmuse-cover.png";
import inspireoceanCover from "@/assets/inspireocean-cover.png";

const selectedWork = [
  {
    id: "aura",
    title: "Aura",
    description: "A calm, proactive system for preventing motion sickness in motion.",
    role: "Product Designer",
    year: "2025",
    coverImage: auraCover,
    coverFit: "contain" as const,
    details: "Led the end-to-end design of a proactive, AI-driven wearable for motion sickness, defining its concept, system, and interaction model.\n\nShaped a seamless cross-device experience, integrating ambient AI to anticipate discomfort and deliver real-time support.",
  },
  {
    id: "neuralyfe",
    title: "NeuraLyfe",
    description: "Making invisible brain trauma visible — before it becomes irreversible.",
    role: "Product Designer, Maker",
    coverImage: neuralyfeCover,
    year: "2026",
    details: "Led ideation and defined the problem scope for NeuraLyfe, designing the AI-driven Impact Replay interface and contributing across both digital and physical product development.\n\nAwarded 1st Place at FigBuild 2026, recognizing the project's concept, execution, and system design.",
  },
  {
    id: "flowprint",
    title: "FlowPrint",
    description: "A frictionless 3D printing system that removes complexity for beginners.",
    role: "Lead Product Designer",
    coverImage: flowprintCover,
    coverFit: "contain" as const,
    year: "2026",
    details: "Led product design for a consumer 3D printing experience that reduced setup time from 1 hours to 15 minutes.\n\nDesigned onboarding flows, real-time print monitoring UI, and a material recommendation engine.",
  },
  {
    id: "tubular",
    title: "Tubular",
    description: "Defy gravity. Shape the path.",
    role: "Product Designer, Maker",
    coverImage: tubularCover,
    year: "2026",
    details: "Conceptualized and built an experimental physics-based toy that teaches fluid dynamics through play.\n\nCombined industrial design with digital prototyping to create an intuitive, tactile learning experience.",
  },
  {
    id: "moodmuse",
    title: "Mood Muse",
    description: "An emotional expression aid designed for autistic children.",
    role: "Product Designer",
    coverImage: moodmuseCover,
    year: "2026",
    details: "A system that helps children externalize and communicate their internal emotional states through intuitive interactions, reducing frustration and enabling clearer social connection.",
  },
];

const aiProjects = [
  {
    id: "inspireocean",
    title: "Inspire Ocean",
    description: "A personal utility for collecting and reorganizing inspirations.",
    role: "Designer + Builder",
    year: "2025",
    coverImage: inspireoceanCover,
    externalUrl: "https://inspired-sea-drift.lovable.app/",
    builtWith: "Lovable",
    details: "Designed a personal inspiration utility that resurfaces forgotten ideas at the right moment — not on demand, but through behavioral adaptation.\n\nThe system learns how you collect and browse, then quietly surfaces what you've lost track of before it becomes irrelevant.",
  },
  {
    id: "studiowaters",
    title: "Studio Waters",
    description: "Predictive analytics made visual.",
    role: "Designer + Builder",
    year: "2026",
    builtWith: "Claude + Cursor",
    details: "Created a data visualization tool that transforms complex predictive models into clear, actionable insights.\n\nDesigned interactive charts and customizable dashboard layouts.",
  },
];

const Index = () => {
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const navigateToMainProjects = useCallback(() => {
    setIsAboutOpen(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToSectionNavTarget("projects");
      });
    });
  }, []);

  return (
    <div className={`bg-background ${isAboutOpen ? "" : "min-h-screen"}`}>
      <HeroSection
        isAboutOpen={isAboutOpen}
        onAboutClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
          setIsAboutOpen(true);
        }}
        onAboutBack={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
          setIsAboutOpen(false);
        }}
      />

      {/* About deep content — below hero, only when about is open */}
      {isAboutOpen && (
        <AboutDeepContent isVisible={isAboutOpen} onMainProjectsClick={navigateToMainProjects} />
      )}

      {/* Regular portfolio content — hidden when about is open */}
      <div
        style={{
          opacity: isAboutOpen ? 0 : 1,
          transition: "opacity 0.6s ease",
          pointerEvents: isAboutOpen ? "none" : "auto",
          height: isAboutOpen ? 0 : "auto",
          overflow: isAboutOpen ? "hidden" : "visible",
        }}
      >
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
          variant="ai"
        />
        <Footer onMainProjectsClick={navigateToMainProjects} />
      </div>
    </div>
  );
};

export default Index;
