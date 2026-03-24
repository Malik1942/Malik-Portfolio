const HeroSection = () => {
  return (
    <section className="relative w-full h-screen flex flex-col justify-between bg-background overflow-hidden">
      {/* Top spacer */}
      <div />

      {/* Center name */}
      <div className="flex-1 flex items-center justify-center px-6">
        <h1 className="text-[clamp(3.5rem,12vw,11rem)] font-bold tracking-[-0.04em] text-foreground text-display leading-[0.9] animate-fade-up">
          MALIK
        </h1>
      </div>

      {/* Bottom bar */}
      <div className="px-6 md:px-16 lg:px-24 pb-10">
        {/* Divider line */}
        <div className="h-px bg-border mb-8 animate-line-reveal delay-3" />

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          {/* Left — role & tagline */}
          <div className="animate-fade-up delay-3">
            <p className="text-foreground text-xs tracking-[0.2em] uppercase text-mono mb-3">
              Product Designer
            </p>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed text-body">
              Designing products that bridge human needs and digital possibilities.
            </p>
          </div>

          {/* Center — nav */}
          <nav className="flex gap-8 text-sm text-muted-foreground text-body animate-fade-up delay-4">
            <a href="#projects" className="nav-link hover:text-foreground transition-colors duration-500">
              Work
            </a>
            <a href="#ai-projects" className="nav-link hover:text-foreground transition-colors duration-500">
              AI Projects
            </a>
            <a href="#about" className="nav-link hover:text-foreground transition-colors duration-500">
              About
            </a>
            <a href="/resume" className="nav-link hover:text-foreground transition-colors duration-500">
              Resume
            </a>
          </nav>

          {/* Right — legend */}
          <div className="flex gap-6 text-xs text-body animate-fade-up delay-5">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-dot-red" />
              <span className="text-muted-foreground">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-dot-gold" />
              <span className="text-muted-foreground">AI Built</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
