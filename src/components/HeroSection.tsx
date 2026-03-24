import DotGrid from "./DotGrid";

const HeroSection = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-background">
      <DotGrid />

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 px-6 md:px-16 lg:px-24 pb-10 z-10">
        <div className="h-px bg-border/40 mb-8 animate-line-reveal delay-3" />

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          {/* Left */}
          <div className="animate-fade-up delay-3">
            <p className="text-foreground/70 text-xs tracking-[0.2em] uppercase text-mono mb-3">
              Product Designer
            </p>
            <p className="text-muted-foreground text-sm max-w-[300px] leading-relaxed text-body">
              Designing products that bridge human needs and digital possibilities.
            </p>
          </div>

          {/* Nav */}
          <nav className="flex gap-8 text-sm text-muted-foreground text-body animate-fade-up delay-4">
            <a href="#projects" className="nav-link hover:text-foreground transition-colors duration-500">
              Main Projects
            </a>
            <a href="#ai-projects" className="nav-link hover:text-foreground transition-colors duration-500">
              Built with AI
            </a>
            <a href="#about" className="nav-link hover:text-foreground transition-colors duration-500">
              About
            </a>
            <a href="/resume" className="nav-link hover:text-foreground transition-colors duration-500">
              Resume
            </a>
          </nav>

          {/* Legend */}
          <div className="flex gap-6 text-xs text-body animate-fade-up delay-5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-dot-red" />
              <span className="text-muted-foreground">Major Projects</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-dot-gold" />
              <span className="text-muted-foreground">Built with AI</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
