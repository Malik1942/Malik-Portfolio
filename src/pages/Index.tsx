import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { scrollToSectionNavTarget } from "@/lib/scrollToTarget";
import { HOME_SECTION_ORDER } from "@/lib/sections";
import { projectsInSection } from "@/data/projects";
import HeroSection from "@/components/HeroSection";
import ProjectList from "@/components/ProjectList";
import Footer from "@/components/Footer";
import AboutDeepContent from "@/components/AboutDeepContent";
import { PageTransition } from "@/components/PageTransition";

// aboutOpen: the /about route renders the same page with the About view open on arrival.
// aboutSection: /about/<section> additionally lands on that section, e.g. "connect".
const Index = ({
  aboutOpen = false,
  aboutSection,
}: {
  aboutOpen?: boolean;
  aboutSection?: string;
}) => {
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

  // Deep-linked /about/<section>: the About view is already open on first paint,
  // so wait past App's ScrollToTop and layout, then use the same section-nav
  // scroll the header uses. AboutDeepContent force-reveals the target section so
  // the scroll cannot land on it mid-entrance.
  useEffect(() => {
    if (!aboutSection) return;
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => scrollToSectionNavTarget(aboutSection));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [aboutSection]);

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
        onSectionClick={navigateToSection}
      />

      {/* About deep content — below hero, only when about is open */}
      {isAboutOpen && (
        <AboutDeepContent
          isVisible={isAboutOpen}
          onSectionClick={navigateToSection}
          onBack={closeAbout}
          deepLinkSection={aboutSection}
        />
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
        {/* Work: one section per homepage entry in SECTIONS, in order; each
            derives its own id, eyebrow and layout from the key. Studio is its
            own page. */}
        {HOME_SECTION_ORDER.map((key) => (
          <ProjectList key={key} section={key} projects={projectsInSection(key)} />
        ))}
        <Footer
          onSectionClick={navigateToSection}
          onAboutClick={() => setIsAboutOpen(true)}
          constrained={false}
        />
      </div>
    </div>
    </PageTransition>
  );
};

export default Index;
