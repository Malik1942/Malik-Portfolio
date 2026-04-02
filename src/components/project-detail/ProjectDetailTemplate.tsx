import { useSectionScrollSpy } from "@/hooks/useSectionScrollSpy";
import { scrollToProjectSection } from "@/lib/projectDetailScroll";
import type { ProjectDetailDocument } from "@/types/projectDetail";

const sectionDomId = (id: string) => `project-section-${id}`;

function SectionBody({ text }: { text: string }) {
  const blocks = text.split(/\n\n+/).filter(Boolean);
  return (
    <div className="space-y-5">
      {blocks.map((para, i) => (
        <p key={i} className="text-[15px] md:text-base font-light leading-[1.75] text-foreground/78 text-body">
          {para}
        </p>
      ))}
    </div>
  );
}

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border/70 bg-secondary/[0.15] px-5 py-4 md:px-6 md:py-5 rounded-sm">
      <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/60 text-mono mb-2.5">
        {label}
      </p>
      <p className="text-sm md:text-[15px] font-light leading-relaxed text-foreground/85 text-body">
        {value}
      </p>
    </div>
  );
}

interface ProjectDetailTemplateProps {
  project: ProjectDetailDocument;
  onBack: () => void;
}

export function ProjectDetailTemplate({ project, onBack }: ProjectDetailTemplateProps) {
  const sectionIds = project.sections.map((s) => s.id);
  const activeSectionId = useSectionScrollSpy(sectionIds);

  return (
    <div className="min-h-screen bg-background">
      {/* Back */}
      <div className="px-6 md:px-16 lg:px-24 pt-8 pb-4 max-w-[1600px] mx-auto">
        <button
          type="button"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm text-mono flex items-center gap-2"
        >
          ← Back
        </button>
      </div>

      {/* 1 — Hero visual */}
      {project.heroImage ? (
        <div className="px-6 md:px-16 lg:px-24 pb-10 md:pb-14">
          <div className="max-w-[1400px] mx-auto overflow-hidden rounded-sm border border-border/45 bg-secondary/10">
            <img
              src={project.heroImage}
              alt={`${project.title} — project visual`}
              className={`w-full max-h-[min(72vh,780px)] min-h-[200px] ${
                project.heroImageFit === "contain" ? "object-contain" : "object-cover"
              } object-center`}
            />
          </div>
        </div>
      ) : null}

      {/* Hero copy */}
      <header
        className={`px-6 md:px-16 lg:px-24 max-w-4xl ${project.heroImage ? "pb-14 md:pb-16" : "pt-8 pb-14 md:pb-16"}`}
      >
        <p className="text-muted-foreground text-[11px] text-mono uppercase tracking-[0.2em] mb-5">
          {project.listSection}
        </p>
        <h1 className="text-4xl md:text-6xl lg:text-[4.25rem] font-light text-foreground text-display mb-7 tracking-[-0.03em] leading-[1.08]">
          {project.title}
        </h1>
        <p className="text-lg md:text-xl text-foreground/80 font-light leading-relaxed text-body max-w-2xl mb-5">
          {project.heroSummary}
        </p>
        {project.heroSubtitle ? (
          <p className="text-sm md:text-base text-muted-foreground font-light leading-relaxed max-w-2xl text-body">
            {project.heroSubtitle}
          </p>
        ) : null}
      </header>

      {/* 2 — Intro cards */}
      <section
        aria-label="Project overview"
        className="px-6 md:px-16 lg:px-24 pb-20 md:pb-24 border-t border-border/40 pt-14 md:pt-16"
      >
        <div className="max-w-[1200px] mx-auto">
          <h2 className="sr-only">Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
            {project.metaCards.map((card) => (
              <MetaCard key={card.label} label={card.label} value={card.value} />
            ))}
          </div>
        </div>
      </section>

      {/* 3 — Body: sticky nav + sections */}
      <section aria-label="Case study" className="px-6 md:px-16 lg:px-24 pb-28 md:pb-36 border-t border-border/30 pt-16 md:pt-20">
        <div className="max-w-[1200px] mx-auto">
          {/* Mobile / tablet: horizontal section nav */}
          <nav
            className="lg:hidden sticky top-0 z-20 -mx-6 px-6 py-3 mb-12 bg-background/85 backdrop-blur-md border-b border-border/40"
            aria-label="Section navigation"
          >
            <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {project.sections.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => scrollToProjectSection(s.id)}
                  className={`flex-shrink-0 whitespace-nowrap px-3 py-2 rounded-sm text-[10px] uppercase tracking-[0.18em] transition-colors duration-300 ${
                    activeSectionId === s.id
                      ? "bg-foreground/[0.08] text-foreground/90 border border-border/60"
                      : "text-muted-foreground/60 border border-transparent hover:text-foreground/75"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </nav>

          <div className="flex flex-col lg:flex-row lg:gap-16 xl:gap-24 lg:items-start">
            {/* Desktop left nav */}
            <nav
              className="hidden lg:block w-[200px] xl:w-[220px] flex-shrink-0 sticky top-28 self-start"
              aria-label="Section navigation"
            >
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/45 mb-6 text-mono">
                On this page
              </p>
              <ul className="space-y-0.5">
                {project.sections.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => scrollToProjectSection(s.id)}
                      className={`w-full text-left pl-3 py-2.5 border-l transition-[color,border-color] duration-300 text-[11px] uppercase tracking-[0.16em] leading-snug ${
                        activeSectionId === s.id
                          ? "border-foreground/40 text-foreground/88"
                          : "border-transparent text-muted-foreground/50 hover:text-foreground/65 hover:border-border/50"
                      }`}
                    >
                      {s.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="min-w-0 flex-1 max-w-3xl">
              {project.sections.map((s, index) => (
                <article
                  key={s.id}
                  id={sectionDomId(s.id)}
                  className="scroll-mt-28 md:scroll-mt-32 mb-20 md:mb-24 last:mb-0"
                >
                  <h2 className="text-xl md:text-2xl font-light text-foreground/92 text-display tracking-tight mb-8 md:mb-10">
                    <span className="text-muted-foreground/35 text-mono text-sm tabular-nums mr-3 font-normal">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {s.label}
                  </h2>
                  <SectionBody text={s.body} />
                  {s.figures?.length ? (
                    <div className="mt-10 space-y-6">
                      {s.figures.map((fig, fi) => (
                        <figure
                          key={fi}
                          className="overflow-hidden rounded-sm border border-border/45 bg-secondary/10"
                        >
                          <img
                            src={fig.src}
                            alt={fig.alt}
                            className="w-full object-cover max-h-[min(520px,60vh)]"
                          />
                        </figure>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
