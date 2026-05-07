interface FooterProps {
  onMainProjectsClick?: () => void;
  onAboutClick?: () => void;
  /** false = no max-width wrapper, aligns with full-bleed page padding. Default true. */
  constrained?: boolean;
  /** true = matches project detail page grid (1400px, tighter padding). Default false. */
  wide?: boolean;
}

const Footer = ({ onMainProjectsClick, onAboutClick, constrained = true, wide = false }: FooterProps) => {
  const outerPad = wide ? "px-6 md:px-10 lg:px-16" : "px-6 md:px-16 lg:px-20";
  const innerClass = wide ? "max-w-[1400px] mx-auto" : constrained ? "max-w-[1200px] mx-auto" : "";
  return (
    <footer className={`${outerPad} pt-10 md:pt-16 pb-12`}>
      <div className={innerClass}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 mb-16 md:mb-24">
          {/* Left — Explore */}
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-foreground/44 text-body block mb-6">
              Explore
            </span>
            <ul className="space-y-4">
              <li>
                <a
                  href="#projects"
                  className="text-foreground/72 hover:text-foreground text-sm text-body transition-colors duration-200 hover:underline underline-offset-2 decoration-foreground/40"
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
                  className="text-foreground/72 hover:text-foreground text-sm text-body transition-colors duration-200 hover:underline underline-offset-2 decoration-foreground/40 text-left"
                >
                  About
                </button>
              </li>
              <li>
                <a
                  href="/resume"
                  className="text-foreground/72 hover:text-foreground text-sm text-body transition-colors duration-200 hover:underline underline-offset-2 decoration-foreground/40"
                >
                  Resume
                </a>
              </li>
            </ul>
          </div>

          {/* Right — Social */}
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-foreground/44 text-body block mb-6">
              Social
            </span>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:malikzhang19@gmail.com"
                  className="text-foreground/72 hover:text-foreground text-sm text-body transition-colors duration-200 hover:underline underline-offset-2 decoration-foreground/40"
                >
                  Email
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/malik-zhang"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/72 hover:text-foreground text-sm text-body transition-colors duration-200 hover:underline underline-offset-2 decoration-foreground/40"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/malikz1942?igsh=eHN4bjkzamtpcGFi&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/72 hover:text-foreground text-sm text-body transition-colors duration-200 hover:underline underline-offset-2 decoration-foreground/40"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="border-t border-border pt-8">
          <span className="text-xs text-foreground/44 text-body">
            &copy; 2026 Malik Zhang
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
