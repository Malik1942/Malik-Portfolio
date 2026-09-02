import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";
import { SiteHeader } from "@/components/SiteHeader";
import { AdminAuthoringDialog } from "@/design-system/publish/AdminAuthoringDialog";
import { PublishDialog } from "@/design-system/publish/PublishDialog";
import { DesignSystemShell } from "@/design-system/reference/DesignSystemShell";
import { useDesignSystemMetadata } from "@/design-system/reference/useDesignSystemMetadata";
import { useHideOnScroll } from "@/hooks/useHideOnScroll";

const PAGE_OUTER = "px-6 md:px-10 lg:px-16 max-w-[1400px] mx-auto";

const DesignSystem = () => {
  useDesignSystemMetadata();
  const navigate = useNavigate();
  const location = useLocation();
  const [authoringOpen, setAuthoringOpen] = useState(
    () => new URLSearchParams(location.search).get("admin") === "1",
  );
  const [publishOpen, setPublishOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const scrollHidden = useHideOnScroll();
  const headerHidden = !shouldReduceMotion && scrollHidden;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("admin") !== "1") return;
    setAuthoringOpen(true);
    params.delete("admin");
    const search = params.toString();
    navigate(`${location.pathname}${search ? `?${search}` : ""}${location.hash}`, {
      replace: true,
      state: location.state,
    });
  }, [location.hash, location.pathname, location.search, location.state, navigate]);

  const navigateToSection = (sectionId: string) => {
    navigate("/", { state: { scrollTo: sectionId } });
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
          onSection={navigateToSection}
          onAbout={navigateToAbout}
        />

        <div className={`${PAGE_OUTER} pt-24 md:pt-28 pb-24 md:pb-36`}>
          <DesignSystemShell />
        </div>

        <Footer
          hrefBase="/"
          onSectionClick={navigateToSection}
          onAboutClick={navigateToAbout}
          wide
        />
        <AdminAuthoringDialog
          open={authoringOpen}
          onClose={() => setAuthoringOpen(false)}
          onReviewPublish={() => {
            setAuthoringOpen(false);
            setPublishOpen(true);
          }}
        />
        <PublishDialog open={publishOpen} onClose={() => setPublishOpen(false)} />
      </div>
    </PageTransition>
  );
};

export default DesignSystem;
