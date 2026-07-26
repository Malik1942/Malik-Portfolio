interface FooterProps {
  onMainProjectsClick?: () => void;
  onAboutClick?: () => void;
  onAdminClick?: () => void;
  /** false = no max-width wrapper, aligns with full-bleed page padding. Default true. */
  constrained?: boolean;
  /** true = matches project detail page grid (1400px, tighter padding). Default false. */
  wide?: boolean;
}

const Footer = ({ onMainProjectsClick, onAboutClick, onAdminClick, constrained = true, wide = false }: FooterProps) => {
  // wide: max-w + px- on the same element — mirrors PAGE_OUTER pattern so edges align exactly
  const outerClass = wide
    ? "px-6 md:px-10 lg:px-16 max-w-page mx-auto pt-10 md:pt-16 pb-12"
    : "px-6 md:px-16 lg:px-20 pt-10 md:pt-16 pb-12";
  const innerClass = wide ? "" : constrained ? "max-w-content mx-auto" : "";
  return (
    <footer className={outerClass}>
      <div className={innerClass}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 mb-16 md:mb-24">
          {/* Left — Explore */}
          <div>
            <span className="text-label uppercase tracking-eyebrow text-foreground/55 block mb-6">
              Explore
            </span>
            <ul className="space-y-4">
              <li>
                <a
                  href="#projects"
                  className="nav-link text-foreground/72 hover:text-foreground text-sm transition-colors duration-500"
                  onClick={(event) => {
                    if (!onMainProjectsClick) return;
                    event.preventDefault();
                    onMainProjectsClick();
                  }}
                >
                  Selected Work
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    if (onAboutClick) {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      onAboutClick();
                    }
                  }}
                  className="nav-link text-foreground/72 hover:text-foreground text-sm transition-colors duration-500 text-left"
                >
                  About
                </button>
              </li>
              <li>
                <a
                  href="/resume"
                  className="nav-link text-foreground/72 hover:text-foreground text-sm transition-colors duration-500"
                >
                  Resume
                </a>
              </li>
              <li>
                <a
                  href="/design-system"
                  className="nav-link text-foreground/72 hover:text-foreground text-sm transition-colors duration-500"
                >
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
                <a
                  href="mailto:malikzhang19@gmail.com"
                  className="nav-link text-foreground/72 hover:text-foreground text-sm transition-colors duration-500"
                >
                  Email
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/malik-zhang"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-link text-foreground/72 hover:text-foreground text-sm transition-colors duration-500"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/malikz_visual?igsh=dzRpdnlnY3h4cmRs&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-link text-foreground/72 hover:text-foreground text-sm transition-colors duration-500"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://medium.com/@malikzhang19"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-link text-foreground/72 hover:text-foreground text-sm transition-colors duration-500"
                >
                  Medium
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between gap-4 border-t border-border pt-8">
          <span className="text-xs text-foreground/55">
            &copy; 2026 Malik Zhang
          </span>
          <a
            href="/design-system?admin=1"
            onClick={(event) => {
              if (!onAdminClick) return;
              event.preventDefault();
              onAdminClick();
            }}
            className="nav-link min-h-11 inline-flex items-center text-xs text-foreground/55 transition-colors duration-500 hover:text-foreground/72 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Admin
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
