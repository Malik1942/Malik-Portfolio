import { useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { GitHubTile } from "@/components/GitHubTile";
import { PageTransition } from "@/components/PageTransition";
import ProjectList from "@/components/ProjectList";
import { SiteHeader } from "@/components/SiteHeader";
import { projectsInSection } from "@/data/projects";
import { useHideOnScroll } from "@/hooks/useHideOnScroll";
import { noOrphan } from "@/lib/noOrphan";
import { SECTIONS } from "@/lib/sections";

// Matches the homepage section gutters so the tile grid below lines up with
// this header.
const PAGE_OUTER = "px-6 md:px-16 lg:px-24";

const PAGE_TITLE = `${SECTIONS.studio.label} | Malik Zhang`;

// The line that says what this page is. Work is the process; Studio is the
// thing: AI explorations next to the industrial design that came before them.
export const STUDIO_HEADLINE =
  "From industrial design to products I design, build with AI, and ship for real.";
export const STUDIO_BLURB =
  "Work shows the process. Studio shows the outcome: apps and tools taken from idea to public release, designed, built, and shipped with an AI workflow that keeps the whole thing moving fast, plus the physical products I designed before moving into software.";
/** The phrase in the blurb that gets the body-highlight treatment. */
export const STUDIO_BLURB_HIGHLIGHT = "designed, built, and shipped with an AI workflow";

// Split the blurb around the highlighted phrase so it can be wrapped in the
// same semibold, full-strength run the case-study body copy uses for **bold**.
const [blurbBefore, blurbAfter] = STUDIO_BLURB.split(STUDIO_BLURB_HIGHLIGHT);

const Studio = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const scrollHidden = useHideOnScroll();
  const headerHidden = !shouldReduceMotion && scrollHidden;

  useEffect(() => {
    const prevTitle = document.title;
    document.title = PAGE_TITLE;
    return () => {
      document.title = prevTitle;
    };
  }, []);

  const navigateToSection = (sectionId: string) => {
    navigate("/", { state: { scrollTo: sectionId } });
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <SiteHeader
          hidden={headerHidden}
          inert={false}
          shouldReduceMotion={shouldReduceMotion}
          entranceVisible
          entranceDelay={0.15}
          hrefBase="/"
          onSection={navigateToSection}
          onAbout={() => navigate("/", { state: { openAbout: true } })}
        />

        {/* Title + the one line that draws the Work / Studio distinction. */}
        <header className={`${PAGE_OUTER} pt-32 md:pt-40`}>
          <h1 className="font-display text-hero font-light text-foreground">
            {SECTIONS.studio.label}
          </h1>
          <p className="mt-5 md:mt-8 text-xl font-semibold text-foreground max-w-reading leading-relaxed text-balance">
            {noOrphan(STUDIO_HEADLINE)}
          </p>
          {/* Body-paragraph role, as in a case-study SectionBody: 16 / 20px,
              regular, 85% strength. The <strong> run inside is the body highlight. */}
          <p className="mt-5 md:mt-6 text-base md:text-xl font-normal leading-relaxed text-foreground/85 max-w-reading">
            {blurbBefore}
            <strong className="font-semibold text-foreground">{STUDIO_BLURB_HIGHLIGHT}</strong>
            {noOrphan(blurbAfter)}
          </p>
        </header>

        <div className="mt-14 md:mt-20">
          <ProjectList
            section="studio"
            projects={projectsInSection("studio")}
            showLabel={false}
            trailing={<GitHubTile index={projectsInSection("studio").length} />}
          />
        </div>

        <Footer
          hrefBase="/"
          onSectionClick={navigateToSection}
          onAboutClick={() => navigate("/", { state: { openAbout: true } })}
          constrained={false}
        />
      </div>
    </PageTransition>
  );
};

export default Studio;
