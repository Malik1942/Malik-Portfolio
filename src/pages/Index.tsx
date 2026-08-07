import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { scrollToSectionNavTarget } from "@/lib/scrollToTarget";
import { WORKSHOP_SECTION_LABEL } from "@/lib/sectionLabels";
import HeroSection from "@/components/HeroSection";
import ProjectList from "@/components/ProjectList";
import Footer from "@/components/Footer";
import AboutDeepContent from "@/components/AboutDeepContent";
import { PageTransition } from "@/components/PageTransition";
import auraCover from "@/assets/aura-cover.webp";
import neuralyfeCover from "@/assets/neuralyfe-cover.webp";
import flowprintCover from "@/assets/flowprint-cover.webp";
import tubularCover from "@/assets/tubular-cover.webp";
import moodmuseCover from "@/assets/moodmuse-cover.webp";
import studioWatersCover from "@/assets/studio-waters-cover.webp";
import motiCard from "@/assets/moti-card-poster.webp";
import motiCardVideo from "@/assets/moti-card.mp4";

export const selectedWork = [
  {
    id: "moti",
    title: "Moti",
    signal: "An AI-Native Timeline for Real Projects",
    description: "Shipped solo on the App Store — an AI-native iOS planner that turns messy, natural language into a living, timeline-aware plan.",
    role: "Product Designer & Builder",
    coverImage: motiCard,
    // The Moti: Plan reel — the title card, then dictating a messy sentence and
    // watching it land on the timeline, then back to the title card. coverImage is
    // that opening frame, so it serves as the poster, the reduced-motion still, and
    // the resting state the reel holds on once it has played.
    coverVideo: motiCardVideo,
    year: "2026",
    details: "Shipped solo on the App Store: an AI-native iOS planner that turns messy, natural language into a living, timeline-aware plan.\n\nBuilt on a hybrid SLM + LLM system, specified spec-first with a full PRD before writing any code.",
  },
  {
    id: "neuralyfe",
    title: "NeuraLyfe",
    signal: "Brain Impact Visualization for Athletes and Medical Teams",
    description: "1st Place, FigBuild 2026 — making invisible brain trauma visible before it becomes irreversible.",
    role: "Product Designer, Maker",
    coverImage: neuralyfeCover,
    year: "2026",
    details: "Won 1st Place at FigBuild 2026 for Impact Replay, an AI-driven brain-impact visualization for athletes and medical teams.\n\nLed ideation and problem scoping, designed the Impact Replay interface, and contributed across both digital and physical product development.",
  },
  {
    id: "aura",
    title: "Aura",
    signal: "AI-Powered Anticipatory Motion Sickness Relief",
    description: "A speculative in-flight motion-sickness concept — its refined form was preferred by 93.75% of testers.",
    role: "Product Designer",
    year: "2025",
    coverImage: auraCover,
    details: "A speculative concept for anticipating motion sickness in flight, designed with a 5-person team over 5 weeks.\n\nUser testing validated the refined form: 15 of 16 testers (93.75%) preferred it over the initial design.",
  },
  {
    id: "flowprint",
    title: "FlowPrint",
    wip: true,
    description: "A 3D-printing onboarding system targeting a setup-time cut from about an hour to 15 minutes.",
    role: "Lead Product Designer",
    coverImage: flowprintCover,
    coverFit: "contain" as const,
    year: "2025",
    details: "Work in progress: a consumer 3D-printing onboarding flow targeting a setup-time cut from about an hour to 15 minutes.\n\nIncludes onboarding flows, real-time print monitoring, and a material recommendation engine.",
  },
  {
    id: "moodmuse",
    title: "Mood Muse",
    wip: true,
    description: "A concept for an emotional-expression aid for autistic children.",
    role: "Product Designer",
    coverImage: moodmuseCover,
    year: "2024",
    details: "A concept exploring how autistic children could externalize and communicate emotional states through simple, tactile interactions.",
  },
];

export const aiProjects = [
  {
    id: "studiowaters",
    title: "Studio Waters",
    description: "A CPX-powered interactive game built through vibe coding",
    role: "Designer + Builder",
    year: "2026",
    coverImage: studioWatersCover,
    builtWith: "Claude + p5.js",
    details: "A motion-controlled fishing experience built with Claude and p5.js — physical gestures mapped to calm, responsive digital play.",
  },
  {
    id: "tubular",
    title: "Tubular",
    wip: true,
    description: "Defy gravity. Shape the path.",
    role: "Product Designer, Maker",
    coverImage: tubularCover,
    year: "2026",
    details: "Work in progress: an experimental physics-based toy exploring fluid dynamics through tactile play.\n\nCombines industrial design with digital prototyping — unshipped and still evolving.",
  },
];

// aboutOpen: the /about route renders the same page with the About view open on arrival.
const Index = ({ aboutOpen = false }: { aboutOpen?: boolean }) => {
  const [isAboutOpen, setIsAboutOpen] = useState(aboutOpen);
  const location = useLocation();
  const navigate = useNavigate();

  // Cross-page nav intent: pages that link back here (case studies) pass router
  // state to land on a specific section or open the About overlay on arrival.
  useEffect(() => {
    const navState = location.state as { scrollTo?: string; openAbout?: boolean } | null;
    if (!navState) return;
    if (navState.openAbout) {
      setIsAboutOpen(true);
      return;
    }
    if (navState.scrollTo) {
      const target = navState.scrollTo;
      // Defer past App's ScrollToTop (fires on the same navigation) and layout.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => scrollToSectionNavTarget(target));
      });
    }
  }, [location.state]);

  // Close the About overlay (if open) and scroll to a homepage section. Works
  // from both the plain hero and the About view — the header nav uses it so the
  // links behave identically in either state.
  const navigateToSection = useCallback((sectionId: string) => {
    // Deep-linked /about: go home first; the scrollTo nav state lands on the section.
    if (aboutOpen) {
      navigate("/", { state: { scrollTo: sectionId } });
      return;
    }
    setIsAboutOpen(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToSectionNavTarget(sectionId);
      });
    });
  }, [aboutOpen, navigate]);

  const navigateToMainProjects = useCallback(() => navigateToSection("projects"), [navigateToSection]);

  const closeAbout = useCallback(() => {
    // Deep-linked /about: leave the route so the URL matches the home view again.
    if (aboutOpen) {
      navigate("/");
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsAboutOpen(false);
  }, [aboutOpen, navigate]);

  return (
    <PageTransition>
    <div className={`bg-background ${isAboutOpen ? "" : "min-h-screen"}`}>
      <HeroSection
        isAboutOpen={isAboutOpen}
        onAboutClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
          setIsAboutOpen(true);
        }}
        onAboutBack={closeAbout}
        onSelectedWorkClick={navigateToMainProjects}
        onWorkshopClick={() => navigateToSection("ai-projects")}
      />

      {/* About deep content — below hero, only when about is open */}
      {isAboutOpen && (
        <AboutDeepContent isVisible={isAboutOpen} onMainProjectsClick={navigateToMainProjects} onBack={closeAbout} />
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
          sectionTitle="Selected Work"
          sectionSubtitle="One shipped solo, one awarded, one tested — plus concepts still in progress."
          dotColor="red"
          projects={selectedWork}
        />
        <ProjectList
          id="ai-projects"
          sectionTitle={WORKSHOP_SECTION_LABEL}
          sectionSubtitle="Small projects designed and built solo with AI tools."
          dotColor="gold"
          projects={aiProjects}
          variant="ai"
        />
        <Footer
          onMainProjectsClick={navigateToMainProjects}
          onAboutClick={() => setIsAboutOpen(true)}
          constrained={false}
        />
      </div>
    </div>
    </PageTransition>
  );
};

export default Index;
