interface FooterProps {
  /** Same behavior as hero “Projects”: smooth scroll to that section; parent may close About first. */
  onMainProjectsClick?: () => void;
}

const Footer = ({ onMainProjectsClick }: FooterProps) => {
  return (
    <footer className="px-6 md:px-16 lg:px-24 pt-32 pb-12">
      <div className="max-w-[1200px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-24">
        {/* Left — Explore */}
        <div>
          <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/50 text-mono block mb-6">
            Explore
          </span>
          <ul className="space-y-4">
            <li>
              <a
                href="#projects"
                className="text-foreground/70 hover:text-foreground text-sm text-body transition-colors duration-300"
                onClick={(event) => {
                  if (!onMainProjectsClick) return;
                  event.preventDefault();
                  onMainProjectsClick();
                }}
              >
                Projects
              </a>
            </li>
            {[
              { label: "About", href: "#about" },
              { label: "Resume", href: "/resume" },
            ].map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="text-foreground/70 hover:text-foreground text-sm text-body transition-colors duration-300"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Right — Social */}
        <div>
          <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/50 text-mono block mb-6">
            Social
          </span>
          <ul className="space-y-4">
            <li>
              <a
                href="mailto:malikzhang19@gmail.com"
                className="text-foreground/70 hover:text-foreground text-sm text-body transition-colors duration-300"
              >
                Email
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/malik-zhang"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 hover:text-foreground text-sm text-body transition-colors duration-300"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/malikz1942?igsh=eHN4bjkzamtpcGFi&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 hover:text-foreground text-sm text-body transition-colors duration-300"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom row */}
      <div className="border-t border-border pt-8">
        <span className="text-xs text-muted-foreground/40 text-mono">
          © 2026 Malik Zhang
        </span>
      </div>
      </div>
    </footer>
  );
};

export default Footer;
