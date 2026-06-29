import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";

const SUPPORT_EMAIL = "malikdes9gn@gmail.com";
const EFFECTIVE_DATE = "June 28, 2026";

const PAGE_TITLE = "Oryne Privacy Policy";
const PAGE_DESCRIPTION =
  "Oryne keeps your data with you. Your thoughts, notes, voice transcripts, and images stay on your device and sync only through your own private iCloud. Nothing is sold, and every AI feature runs on-device.";

const OrynePrivacy = () => {
  const navigate = useNavigate();

  // The site has no Helmet; index.html ships static meta. Set the document
  // title and description here so this route reads well in tabs, search, and
  // shared previews. Restore the defaults on unmount.
  useEffect(() => {
    const prevTitle = document.title;

    const setMeta = (selector: string, attr: string, name: string, content: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      const prev = el.getAttribute("content");
      el.setAttribute("content", content);
      return { el, prev };
    };

    document.title = PAGE_TITLE;
    const restorers = [
      setMeta('meta[name="description"]', "name", "description", PAGE_DESCRIPTION),
      setMeta('meta[property="og:title"]', "property", "og:title", PAGE_TITLE),
      setMeta('meta[property="og:description"]', "property", "og:description", PAGE_DESCRIPTION),
      setMeta('meta[name="twitter:title"]', "name", "twitter:title", PAGE_TITLE),
      setMeta('meta[name="twitter:description"]', "name", "twitter:description", PAGE_DESCRIPTION),
    ];

    return () => {
      document.title = prevTitle;
      restorers.forEach(({ el, prev }) => {
        if (prev !== null) el.setAttribute("content", prev);
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar, mirrors the support page back bar */}
      <div className="flex items-center justify-between px-6 md:px-10 py-4 border-b border-border/40 bg-background z-10">
        <button
          type="button"
          onClick={() => navigate("/")}
          aria-label="Back to home"
          className="group flex items-center gap-2 min-h-[44px] px-1 text-sm text-mono text-foreground/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 rounded transition-colors duration-200"
        >
          <svg
            aria-hidden="true"
            className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back
        </button>
        <span className="text-xs text-mono text-foreground/44">Oryne Privacy</span>
      </div>

      <main className="flex-1 px-6 md:px-16 lg:px-20 pt-16 md:pt-24 pb-8">
        <div className="max-w-[760px] mx-auto">
          {/* Intro */}
          <header>
            <span className="text-[11px] uppercase tracking-[0.2em] text-foreground/44 text-body block mb-6">
              Privacy
            </span>
            <h1 className="text-3xl md:text-5xl font-light text-foreground text-display mb-5">
              Oryne Privacy Policy
            </h1>
            <p className="text-xs text-mono text-foreground/44 mb-8">
              Effective {EFFECTIVE_DATE}
            </p>
            <p className="text-base md:text-lg text-foreground/72 text-body leading-relaxed max-w-[62ch]">
              Oryne is built so your captures stay yours. What you create stays on your device and
              syncs only through your own private iCloud. Oryne does not sell your data, and does
              not use your content for advertising. Every AI feature runs on your device.
            </p>
          </header>

          {/* The short version */}
          <section aria-labelledby="summary-heading" className="mt-12 md:mt-14">
            <h2 id="summary-heading" className="sr-only">
              Summary
            </h2>
            <div className="rounded-lg border border-border bg-card/40 p-6 md:p-8">
              <ul className="space-y-3 text-sm md:text-base text-foreground/72 text-body leading-relaxed max-w-[64ch]">
                <li>Your thoughts, notes, voice transcripts, and images stay on your device.</li>
                <li>They sync across your devices only through your own private iCloud, which the developer cannot access.</li>
                <li>All AI (link summaries, themes, titles, and Ask the Ocean) runs on-device.</li>
                <li>No user content is ever sent to an external, third-party, or cloud AI service.</li>
                <li>Nothing is sold, mined, or used for advertising.</li>
              </ul>
            </div>
          </section>

          {/* Storage and sync */}
          <section aria-labelledby="storage-heading" className="mt-16 md:mt-20">
            <h2
              id="storage-heading"
              className="text-xl md:text-2xl font-light text-foreground text-display mb-5"
            >
              What Oryne stores, and where
            </h2>
            <p className="text-sm md:text-base text-foreground/68 text-body leading-relaxed max-w-[64ch]">
              Oryne stores the things you capture: your thoughts, notes, voice transcripts, and
              imported images. These are stored on your device. Oryne syncs them through your own
              private iCloud (Apple's CloudKit), so they stay in sync across the devices signed in
              to your Apple Account. This sync is part of the app today. The developer cannot access
              this data. It stays within your private iCloud, and it is never stored on or routed
              through any developer server.
            </p>
          </section>

          {/* AI processing */}
          <section aria-labelledby="ai-heading" className="mt-16 md:mt-20">
            <h2
              id="ai-heading"
              className="text-xl md:text-2xl font-light text-foreground text-display mb-5"
            >
              How AI works in Oryne
            </h2>
            <p className="text-sm md:text-base text-foreground/68 text-body leading-relaxed max-w-[64ch]">
              All of Oryne's AI features run on your device using Apple's on-device intelligence.
              This includes link summaries, themes, titles, and Ask the Ocean. No user content is
              sent to any external, third-party, or cloud AI service, for any feature. Your captures
              are read and organized on-device, and they stay there.
            </p>
          </section>

          {/* Microphone and photos */}
          <section aria-labelledby="permissions-heading" className="mt-16 md:mt-20">
            <h2
              id="permissions-heading"
              className="text-xl md:text-2xl font-light text-foreground text-display mb-5"
            >
              Microphone and photos
            </h2>
            <dl className="divide-y divide-border">
              <div className="py-6 first:pt-0">
                <dt className="text-base md:text-lg text-foreground text-display mb-2">Microphone</dt>
                <dd className="text-sm md:text-base text-foreground/68 text-body leading-relaxed max-w-[64ch]">
                  Oryne uses the microphone only for voice capture, and only when you record. The
                  audio is transcribed on your device so you can capture a thought by speaking.
                </dd>
              </div>
              <div className="py-6">
                <dt className="text-base md:text-lg text-foreground text-display mb-2">Photos</dt>
                <dd className="text-sm md:text-base text-foreground/68 text-body leading-relaxed max-w-[64ch]">
                  Oryne accesses your photos only when you choose to import or attach an image. It
                  does not browse or read your photo library in the background.
                </dd>
              </div>
            </dl>
          </section>

          {/* Selling and advertising */}
          <section aria-labelledby="selling-heading" className="mt-16 md:mt-20">
            <h2
              id="selling-heading"
              className="text-xl md:text-2xl font-light text-foreground text-display mb-5"
            >
              No selling, no advertising
            </h2>
            <p className="text-sm md:text-base text-foreground/68 text-body leading-relaxed max-w-[64ch]">
              Oryne does not sell your data. Oryne does not use your content for advertising. There
              is no tracking and no advertising profile. Because your content stays on your device
              and within your own private iCloud, there is nothing for the developer to collect,
              mine, or share.
            </p>
          </section>

          {/* Deleting your content */}
          <section aria-labelledby="deletion-heading" className="mt-16 md:mt-20">
            <h2
              id="deletion-heading"
              className="text-xl md:text-2xl font-light text-foreground text-display mb-5"
            >
              Deleting your content
            </h2>
            <p className="text-sm md:text-base text-foreground/68 text-body leading-relaxed max-w-[64ch]">
              You are in control of your content. You can delete it in the app by deleting the
              captures or thoughts you no longer want. Deleting a thought removes it from your
              device and from your private iCloud sync across your devices.
            </p>
          </section>

          {/* Changes */}
          <section aria-labelledby="changes-heading" className="mt-16 md:mt-20">
            <h2
              id="changes-heading"
              className="text-xl md:text-2xl font-light text-foreground text-display mb-5"
            >
              Changes to this policy
            </h2>
            <p className="text-sm md:text-base text-foreground/68 text-body leading-relaxed max-w-[64ch]">
              This policy describes how Oryne works today. If the app changes in a way that affects
              your privacy, this page will be updated with a new effective date before that change
              ships.
            </p>
          </section>

          {/* Contact */}
          <section aria-labelledby="contact-heading" className="mt-16 md:mt-20">
            <h2
              id="contact-heading"
              className="text-xl md:text-2xl font-light text-foreground text-display mb-4"
            >
              Contact
            </h2>
            <p className="text-sm md:text-base text-foreground/68 text-body leading-relaxed mb-6 max-w-[62ch]">
              Questions about privacy or anything in this policy? Reach the Oryne team directly.
            </p>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="inline-flex items-center gap-3 px-5 py-3 text-sm md:text-base text-mono text-foreground/90 hover:text-foreground border border-border/60 hover:border-border rounded-sm transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40"
            >
              <svg
                aria-hidden="true"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
              {SUPPORT_EMAIL}
            </a>
          </section>

          {/* Cross-link to the support page */}
          <div className="mt-14 md:mt-16 pt-8 border-t border-border">
            <p className="text-sm text-body text-foreground/52">
              Need help using Oryne? Visit{" "}
              <a
                href="/oryne/support"
                className="nav-link text-foreground/80 hover:text-foreground transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 rounded-sm"
              >
                Oryne Support
              </a>
              .
            </p>
          </div>
        </div>
      </main>

      <Footer
        constrained
        onMainProjectsClick={() => navigate("/#projects")}
        onAboutClick={() => navigate("/")}
      />
    </div>
  );
};

export default OrynePrivacy;
