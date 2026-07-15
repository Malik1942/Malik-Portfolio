import { useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";
import { SiteHeader } from "@/components/SiteHeader";
import { DesignSystemShell } from "@/design-system/reference/DesignSystemShell";
import { useHideOnScroll } from "@/hooks/useHideOnScroll";

const PAGE_OUTER = "px-6 md:px-10 lg:px-16 max-w-[1400px] mx-auto";

const DesignSystem = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const scrollHidden = useHideOnScroll();
  const headerHidden = !shouldReduceMotion && scrollHidden;

  const navigateToSelectedWork = () => {
    navigate("/", { state: { scrollTo: "projects" } });
  };

  const navigateToAbout = () => {
    navigate("/", { state: { openAbout: true } });
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
          onSelectedWork={navigateToSelectedWork}
          onWorkshop={() => navigate("/", { state: { scrollTo: "ai-projects" } })}
          onAbout={navigateToAbout}
        />

        <div className={`${PAGE_OUTER} pt-24 md:pt-28 pb-24 md:pb-36`}>
          <DesignSystemShell />
        </div>

        <Footer
          onMainProjectsClick={navigateToSelectedWork}
          onAboutClick={navigateToAbout}
          wide
        />
      </div>
    </PageTransition>
  );
};

export default DesignSystem;
