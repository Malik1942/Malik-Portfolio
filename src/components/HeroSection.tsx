import DotGrid from "./DotGrid";

const HeroSection = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-background">
      <DotGrid />

      {/* Bottom bar overlay */}
      <div className="absolute bottom-0 left-0 right-0 px-6 md:px-16 lg:px-24 pb-10 z-10">
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
