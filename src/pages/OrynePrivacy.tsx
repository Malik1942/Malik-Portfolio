import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePageMeta } from "@/hooks/usePageMeta";
import Footer from "@/components/Footer";
import { BackLink } from "@/components/ui/BackLink";
import { TextLink } from "@/components/ui/TextLink";

/** Oryne's privacy policy lives on Oryne's own site. `vercel.json` redirects this
 *  address there; this page covers a visit that arrives without asking the server. */
const POLICY_URL = "https://oryne.malikzhang.com/privacy";

export const PAGE_TITLE = "Oryne Privacy Policy";
export const PAGE_DESCRIPTION =
  "Oryne's privacy policy has moved to oryne.malikzhang.com/privacy.";

const OrynePrivacy = () => {
  const navigate = useNavigate();

  usePageMeta(PAGE_TITLE, PAGE_DESCRIPTION);

  useEffect(() => {
    window.location.replace(POLICY_URL);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar, mirrors the support page back bar */}
      <div className="flex items-center justify-between px-6 md:px-10 py-4 border-b border-hairline bg-background z-10">
        <BackLink onClick={() => navigate("/")} aria-label="Back to home" family="mono">
          Back
        </BackLink>
        <span className="text-caption font-mono text-foreground-tertiary">Oryne Privacy</span>
      </div>

      <main className="flex-1 px-6 md:px-16 lg:px-24 pt-16 md:pt-24 pb-8">
        <div className="max-w-reading mx-auto">
          <header>
            <span className="text-label uppercase tracking-eyebrow text-foreground-tertiary block mb-6">
              Privacy
            </span>
            <h1 className="font-display text-title md:text-display font-light text-foreground mb-5">
              Oryne Privacy Policy
            </h1>
            <p className="text-sm md:text-base text-foreground-secondary leading-relaxed">
              The policy has moved to{" "}
              <TextLink href={POLICY_URL} tone="secondary">
                oryne.malikzhang.com/privacy
              </TextLink>
              .
            </p>
          </header>
        </div>
      </main>

      <Footer
        constrained
        hrefBase="/"
        onSectionClick={(sectionId) => navigate("/", { state: { scrollTo: sectionId } })}
        onAboutClick={() => navigate("/")}
      />
    </div>
  );
};

export default OrynePrivacy;
