import { useEffect } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";

const SUPPORT_EMAIL = "malikdes9gn@gmail.com";

const PAGE_TITLE = "Oryne Support | Help, FAQ & Contact";
const PAGE_DESCRIPTION =
  "Support for Oryne, the frictionless place to catch a Whisper by voice or text before it's gone. FAQ, privacy, and how to reach us.";

type Faq = {
  q: string;
  a: ReactNode;
};

const FAQS: Faq[] = [
  {
    q: "How do I capture a thought?",
    a: (
      <>
        One tap. Open Oryne and start a Whisper by voice or text, whichever is faster in the
        moment. Speak it out loud or type it in, then let it go. Capture is meant to take a second,
        so the idea lands before it slips away.
      </>
    ),
  },
  {
    q: "Where do my notes go, and how do they get organized?",
    a: (
      <>
        You never have to file anything. Once you Release a Whisper into the Ocean, on-device
        intelligence reads it, gives it a title, and finds the themes inside it. Related Thoughts
        drift together into currents, so ideas that belong together end up together without you
        sorting them by hand. When you want to find something, you can Ask the Ocean in plain
        language instead of digging through folders.
      </>
    ),
  },
  {
    q: "Is my data private?",
    a: (
      <>
        Privacy is the default, not a setting. The intelligence that titles, themes, and connects
        your Thoughts runs on your device. Your Whispers sync through your own private iCloud, tied
        to your Apple Account, so they move between your devices without passing through our
        servers. Nothing you capture is mined, profiled, or sold.
      </>
    ),
  },
  {
    q: "Does it work offline?",
    a: (
      <>
        Capture always works. You can record or type a Whisper and Release it into the Ocean with
        no connection at all, and titling and theming happen on-device. Some extras need a network,
        though: summarizing a link you saved requires a connection and a supported device. When
        that is not available, Oryne degrades gracefully and keeps the link with its basic details
        instead of failing.
      </>
    ),
  },
  {
    q: "Why didn't a link get summarized?",
    a: (
      <>
        Link summarizing leans on on-device intelligence, and that depends on your hardware. On a
        device without on-device-intelligence-class support, Oryne falls back to basic link
        information (the title and address it can read) rather than a full summary. A network drop
        at the moment of saving can cause the same fallback. The link is still saved either way, so
        nothing is lost, and a more capable device will summarize future links.
      </>
    ),
  },
  {
    q: "How do I edit or delete a Thought?",
    a: (
      <>
        Open any Thought to edit its text, fix a title, or refine what was captured. To remove one,
        delete it from the same view. Deleting a Thought takes it out of your currents and removes
        it from your private iCloud sync across your devices.
      </>
    ),
  },
  {
    q: "How do I get help or report a bug?",
    a: (
      <>
        Email us at{" "}
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="nav-link text-foreground hover:text-foreground"
        >
          {SUPPORT_EMAIL}
        </a>
        . If you are reporting a bug, a short description of what you did, what you expected, and
        your device model helps us track it down faster. We read every message.
      </>
    ),
  },
];

const OryneSupport = () => {
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
      {/* Top bar — mirrors the Resume page back bar */}
      <div className="flex items-center justify-between px-6 md:px-10 py-4 border-b border-border/40 bg-background z-10">
        <button
          type="button"
          onClick={() => navigate("/")}
          aria-label="Back to home"
          className="group flex items-center gap-2 min-h-11 px-1 text-sm font-mono text-foreground/72 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 rounded-sm transition-colors duration-200"
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
        <span className="text-xs font-mono text-foreground/55">Oryne Support</span>
      </div>

      <main className="flex-1 px-6 md:px-16 lg:px-20 pt-16 md:pt-24 pb-8">
        <div className="max-w-reading mx-auto">
          {/* Intro */}
          <header>
            <span className="text-label uppercase tracking-eyebrow text-foreground/55 block mb-6">
              Support
            </span>
            <h1 className="font-display text-title md:text-display font-light text-foreground mb-6">
              Oryne
            </h1>
            <p className="text-base md:text-xl text-foreground/72 leading-relaxed max-w-[60ch]">
              Oryne is a frictionless place to catch inspiration by voice or text before it's gone.
              Start a Whisper the moment an idea arrives, then Release it into the Ocean. On-device
              intelligence names each Thought and connects it to the others, so what you capture
              quietly finds its place.
            </p>
          </header>

          {/* FAQ */}
          <section aria-labelledby="faq-heading" className="mt-16 md:mt-20">
            <h2
              id="faq-heading"
              className="text-xl md:text-title font-light text-foreground mb-8"
            >
              Frequently asked questions
            </h2>
            <dl className="divide-y divide-border">
              {FAQS.map((faq) => (
                <div key={faq.q} className="py-7 first:pt-0">
                  <dt className="text-base md:text-xl text-foreground tracking-tight mb-3">
                    {faq.q}
                  </dt>
                  <dd className="text-sm md:text-base text-foreground/72 leading-relaxed max-w-[64ch]">
                    {faq.a}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Privacy note */}
          <section aria-labelledby="privacy-heading" className="mt-16 md:mt-20">
            <h2
              id="privacy-heading"
              className="text-xl md:text-title font-light text-foreground mb-6"
            >
              Your privacy
            </h2>
            <div className="rounded-lg border border-border bg-card/40 p-6 md:p-8">
              <p className="text-sm md:text-base text-foreground/72 leading-relaxed max-w-[64ch]">
                Oryne is built so your Thoughts stay yours. The intelligence that titles, themes,
                and connects your Whispers runs on your device. Your captures sync only through your
                own private iCloud, tied to your Apple Account, so they reach your other devices
                without living on our servers. There is no tracking, no advertising profile, and
                nothing about what you capture is mined or sold.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section aria-labelledby="contact-heading" className="mt-16 md:mt-20">
            <h2
              id="contact-heading"
              className="text-xl md:text-title font-light text-foreground mb-4"
            >
              Contact
            </h2>
            <p className="text-sm md:text-base text-foreground/72 leading-relaxed mb-6 max-w-[60ch]">
              Questions, feedback, or a bug to report? Reach the Oryne team directly. This is the
              fastest way to get help.
            </p>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="inline-flex items-center gap-3 px-5 py-3 text-sm md:text-base font-mono text-foreground border border-border/60 hover:border-border rounded-sm transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40"
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

          {/* Cross-link to the privacy policy */}
          <div className="mt-14 md:mt-16 pt-8 border-t border-border">
            <p className="text-sm text-foreground/55">
              Read how Oryne handles your data in our{" "}
              <a
                href="/oryne/privacy"
                className="nav-link text-foreground/72 hover:text-foreground transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 rounded-sm"
              >
                Privacy Policy
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

export default OryneSupport;
