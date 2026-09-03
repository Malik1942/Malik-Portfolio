import { lazy, Suspense, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
// Vite + React Router app → use the /react entry (not /next).
import { Analytics } from "@vercel/analytics/react";
import { PreviewBar } from "./design-system/preview/PreviewBar";
import { PreviewProvider, usePreviewDraft } from "./design-system/preview/PreviewProvider";
import Index from "./pages/Index.tsx";

// Code-split the heavier secondary routes so the landing page doesn't ship them.
const Resume = lazy(() => import("./pages/Resume.tsx"));
const Studio = lazy(() => import("./pages/Studio.tsx"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail.tsx"));
const DesignSystem = lazy(() => import("./pages/DesignSystem.tsx"));
const OryneSupport = lazy(() => import("./pages/OryneSupport.tsx"));
const OrynePrivacy = lazy(() => import("./pages/OrynePrivacy.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<Index aboutOpen />} />
          {/* Deep link straight to a section of About, e.g. /about/connect.
              The trailing-slash twin keeps a pasted or linked URL off the 404. */}
          <Route path="/about/connect" element={<Index aboutOpen aboutSection="connect" />} />
          <Route path="/about/connect/" element={<Index aboutOpen aboutSection="connect" />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/studio" element={<Studio />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/design-system" element={<DesignSystem />} />
          <Route path="/oryne/support" element={<OryneSupport />} />
          <Route path="/oryne/privacy" element={<OrynePrivacy />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

const App = () => (
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <AppFrame />
  </BrowserRouter>
);

function AppFrame() {
  return (
    <PreviewProvider>
      <AppContents />
    </PreviewProvider>
  );
}

function AppContents() {
  const { embedded } = usePreviewDraft();
  return (
    <>
      <ScrollToTop />
      <ErrorBoundary>
        <AnimatedRoutes />
      </ErrorBoundary>
      <PreviewBar />
      {!embedded ? <Analytics /> : null}
    </>
  );
}

export default App;
