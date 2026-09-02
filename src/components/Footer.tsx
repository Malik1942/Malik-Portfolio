import { Link } from "react-router-dom";
import { NAV_ITEMS } from "@/lib/sections";

interface FooterProps {
  /** A homepage section link was clicked; receives the section's DOM id. */
  onSectionClick?: (sectionId: string) => void;
  onAboutClick?: () => void;
  /** Prefix for section anchors: "" on the homepage, "/" elsewhere. */
  hrefBase?: string;
  /** false = no max-width wrapper, aligns with full-bleed page padding. Default true. */
  constrained?: boolean;
  /** true = matches project detail page grid (1400px, tighter padding). Default false. */
  wide?: boolean;
}

const linkClass =
  "nav-link text-foreground/72 hover:text-foreground text-sm transition-colors duration-500";

const Footer = ({
  onSectionClick,
  onAboutClick,
  hrefBase = "",
  constrained = true,
  wide = false,
}: FooterProps) => {
  // wide: max-w + px- on the same element — mirrors PAGE_OUTER pattern so edges align exactly
  const outerClass = wide
    ? "px-6 md:px-10 lg:px-16 max-w-page mx-auto pt-10 md:pt-16 pb-12"
    : "px-6 md:px-16 lg:px-20 pt-10 md:pt-16 pb-12";
  const innerClass = wide ? "" : constrained ? "max-w-content mx-auto" : "";
  return (
    <footer className={outerClass}>
      <div className={innerClass}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 mb-16 md:mb-24">
          {/* Left — Explore: mirrors the header nav (Work scrolls to the top of
              the homepage's work sections; Studio is a page of its own), then
              About, Resume, Design System. */}
          <div>
            <span className="text-label uppercase tracking-eyebrow text-foreground/55 block mb-6">
              Explore
            </span>
            <ul className="space-y-4">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  {item.kind === "section" ? (
                    <a
                      href={`${hrefBase}#${item.sectionId}`}
                      className={linkClass}
                      onClick={(event) => {
                        if (!onSectionClick) return;
                        event.preventDefault();
                        onSectionClick(item.sectionId);
                      }}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link to={item.path} className={linkClass}>
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => {
                    if (onAboutClick) {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      onAboutClick();
                    }
                  }}
                  className={`${linkClass} text-left`}
                >
                  About
                </button>
              </li>
              <li>
                <a href="/resume" className={linkClass}>
                  Resume
                </a>
              </li>
              <li>
                <a href="/design-system" className={linkClass}>
                  Design System
                </a>
              </li>
            </ul>
          </div>

          {/* Right — Social */}
          <div>
            <span className="text-label uppercase tracking-eyebrow text-foreground/55 block mb-6">
              Social
            </span>
            <ul className="space-y-4">
              <li>
                <a href="mailto:malikzhang19@gmail.com" className={linkClass}>
                  Email
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/malik-zhang"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Malik1942"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/MalikZ1942"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  X
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex items-center border-t border-border pt-8">
          <span className="text-xs text-foreground/55">
            &copy; 2026 Malik Zhang
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
