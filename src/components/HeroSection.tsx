import StarField from "./StarField";

const HeroSection = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-background">
      <StarField />
      <div className="absolute bottom-0 left-0 right-0 px-6 md:px-16 lg:px-24 pb-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="text-muted-foreground text-sm tracking-[0.15em] uppercase text-body mb-2">
              Product Designer
            </p>
            <p className="text-muted-foreground text-sm md:text-base max-w-sm leading-relaxed text-body">
              Designing products that bridge human needs and digital possibilities.
            </p>
          </div>

          <div className="flex gap-8 text-sm text-muted-foreground text-body">
            <a href="#projects" className="hover:text-foreground transition-colors duration-300">
              Selected Work
            </a>
            <a href="#ai-projects" className="hover:text-foreground transition-colors duration-300">
              Built with AI
            </a>
            <a href="#about" className="hover:text-foreground transition-colors duration-300">
              About
            </a>
            <a href="/resume" className="hover:text-foreground transition-colors duration-300">
              Resume
            </a>
          </div>

          <div className="flex gap-5 text-xs text-body">
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
