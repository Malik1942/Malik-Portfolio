import { useSectionScrollSpy } from "@/hooks/useSectionScrollSpy";
import { scrollToProjectSection } from "@/lib/projectDetailScroll";
import type { ProjectDetailDocument, ProjectSectionFigure, IntroBlock } from "@/types/projectDetail";
import Footer from "@/components/Footer";

function toEmbedUrl(url: string): string {
  // YouTube: watch?v=ID or youtu.be/ID → embed/ID
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  // Vimeo: vimeo.com/ID → player.vimeo.com/video/ID
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return url;
}

function SectionFigure({ fig }: { fig: ProjectSectionFigure }) {
  if (fig.type === "video") {
    return (
      <figure className="overflow-hidden rounded-sm border border-border/45 bg-secondary/10">
        <video
          src={fig.src}
          poster={fig.poster}
          controls
          playsInline
          className="w-full max-h-[min(520px,60vh)] object-cover"
        />
      </figure>
    );
  }
  if (fig.type === "embed") {
    return (
      <figure className="overflow-hidden rounded-sm border border-border/45 bg-secondary/10 aspect-video">
        <iframe
          src={toEmbedUrl(fig.url)}
          title={fig.title ?? "Video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </figure>
    );
  }
  return (
    <figure className="overflow-hidden rounded-sm border border-border/45 bg-secondary/10">
      <img
        src={fig.src}
        alt={fig.alt}
        className="w-full object-cover max-h-[min(520px,60vh)]"
      />
    </figure>
  );
}

const sectionDomId = (id: string) => `project-section-${id}`;

function SectionIntroBlock({ block }: { block: IntroBlock }) {
  return (
    <div className="space-y-10">
      {/* Opening paragraph */}
      <p className="text-[15px] md:text-base font-light leading-[1.75] text-foreground/78 text-body">
        {block.openingParagraph}
      </p>

      {/* Context cards — optional */}
      {block.contextCards?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {block.contextCards.map((card) => (
            <div
              key={card.title}
              className="border border-border/50 bg-secondary/[0.08] rounded-sm px-4 py-4"
            >
              <p className="text-[11px] uppercase tracking-[0.18em] text-foreground/60 text-mono mb-2">
                {card.title}
              </p>
              <p className="text-[13px] font-light leading-relaxed text-foreground/65 text-body">
                {card.body}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {/* Project info cards — optional */}
      {block.infoCards?.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {block.infoCards.map((card) => (
            <div
              key={card.label}
              className="border border-border/40 bg-transparent rounded-sm px-4 py-3"
            >
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 text-mono mb-1.5">
                {card.label}
              </p>
              <p className="text-[13px] font-light leading-snug text-foreground/75 text-body">
                {card.value}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {/* What I Did — optional */}
      {block.whatIDid?.length ? (
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground/50 text-mono mb-5">
            What I Did
          </p>
          <ul className="space-y-3">
            {block.whatIDid.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-[0.45em] w-1 h-1 rounded-full bg-foreground/25 flex-shrink-0" />
                <span className="text-[14px] md:text-[15px] font-light leading-relaxed text-foreground/72 text-body">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function SectionBody({ text, leadFirst }: { text: string; leadFirst?: boolean }) {
  const blocks = text.split(/\n\n+/).filter(Boolean);
  return (
    <div>
      {blocks.map((para, i) => (
        <p
          key={i}
          className={
            leadFirst && i === 0
              ? "text-[1.1rem] md:text-[1.25rem] font-bold leading-[1.65] text-foreground/88 text-body"
              : `${i > 0 ? "mt-4 md:mt-5" : ""} text-[15px] md:text-base font-light leading-[1.75] text-foreground/58 text-body`
          }
        >
          {para}
        </p>
      ))}
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border/40 bg-secondary/[0.07] rounded-sm px-5 py-5 md:px-6 md:py-6">
      <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/45 text-mono mb-3">
        {label}
      </p>
      <p className="text-[13px] md:text-sm font-light leading-relaxed text-foreground/78 text-body">
        {value}
      </p>
    </div>
  );
}

function MetaGrid({ cards }: { cards: { label: string; value: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4">
      {cards.map((card) => (
        <MetaItem key={card.label} label={card.label} value={card.value} />
      ))}
    </div>
  );
}

interface ProjectDetailTemplateProps {
  project: ProjectDetailDocument;
  onBack: () => void;
  onMainProjectsClick?: () => void;
}

export function ProjectDetailTemplate({ project, onBack, onMainProjectsClick }: ProjectDetailTemplateProps) {
  const sectionIds = project.sections.map((s) => s.id);
  const activeSectionId = useSectionScrollSpy(sectionIds);
  // When any section owns the intro content via subtitle, skip the standalone block
  const hasIntroSection = project.sections.some((s) => s.subtitle);

  return (
    <div className="min-h-screen bg-background">
      {/* Back */}
      <div className="px-6 md:px-16 lg:px-24 pt-8 pb-0 max-w-[1600px] mx-auto">
        <button
          type="button"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm text-mono flex items-center gap-2"
        >
          ← Back
        </button>
      </div>

      {/* 1 — Title + hook */}
      <header className="px-6 md:px-16 lg:px-24 pt-8 md:pt-10 max-w-[1400px] mx-auto">
        <p className="text-muted-foreground text-[11px] text-mono uppercase tracking-[0.2em] mb-4">
          {project.listSection}
        </p>
        <h1 className="text-4xl md:text-6xl lg:text-[4.25rem] font-light text-foreground text-display tracking-[-0.03em] leading-[1.08]">
          {project.title}
        </h1>
        {project.heroSummary ? (
          <p className="mt-4 md:mt-5 text-base md:text-lg font-light text-foreground/55 text-body max-w-2xl leading-relaxed">
            {project.heroSummary}
          </p>
        ) : null}
      </header>

      {/* 2 — Hero image */}
      {project.heroImage ? (
        <div className="px-6 md:px-16 lg:px-24 mt-8 md:mt-10 max-w-[1400px] mx-auto">
          <div className="overflow-hidden rounded-sm border border-border/45 bg-secondary/10">
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

      {/* 3 — Secondary copy below hero */}
      {(project.heroSubtitle || project.description) ? (
        <div className={`px-6 md:px-16 lg:px-24 max-w-[1400px] mx-auto ${project.heroImage ? "mt-10 md:mt-14" : "mt-8 md:mt-10"}`}>
          <div className="max-w-[860px]">
          {project.heroSubtitle ? (
            <p className="text-sm md:text-base text-muted-foreground font-light leading-relaxed text-body">
              {project.heroSubtitle}
            </p>
          ) : null}
          {project.description ? (
            <p className={`${project.heroSubtitle ? "mt-4 md:mt-5" : ""} text-[15px] md:text-base font-light leading-[1.75] text-foreground/65 text-body`}>
              {project.description}
            </p>
          ) : null}
          </div>
        </div>
      ) : null}

      {/* 4 — Standalone metadata (only when no section owns it) */}
      {!hasIntroSection && project.metaCards?.length ? (
        <div className="px-6 md:px-16 lg:px-24 mt-10 md:mt-14 max-w-[1200px] mx-auto">
          <MetaGrid cards={project.metaCards} />
        </div>
      ) : null}

      {/* 5 — Body: sticky nav + sections */}
      <section aria-label="Case study" className="px-6 md:px-16 lg:px-24 pb-28 md:pb-36 border-t border-border/30 mt-16 md:mt-20 pt-16 md:pt-20">
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
                  {s.subtitle ? (
                    /* Subtitle section: Intro heading → lead + body → MetaGrid */
                    <>
                      <h2 className="text-[1.75rem] md:text-[2.25rem] font-light text-foreground/90 text-display tracking-[-0.02em] leading-[1.15] mb-6 md:mb-8">
                        {s.subtitle}
                      </h2>
                      <SectionBody text={s.body} leadFirst />
                      {s.showProjectMeta && project.metaCards?.length ? (
                        <div className="mt-10 md:mt-14">
                          <MetaGrid cards={project.metaCards} />
                        </div>
                      ) : null}
                    </>
                  ) : (
                    /* Standard numbered section */
                    <>
                      {s.introBlock?.coverImage ? (
                        <div className="mb-10 overflow-hidden rounded-sm border border-border/45 bg-secondary/10">
                          <img
                            src={s.introBlock.coverImage}
                            alt=""
                            className={`w-full max-h-[min(68vh,760px)] min-h-[180px] ${
                              s.introBlock.coverImageFit === "cover" ? "object-cover" : "object-contain"
                            } object-center`}
                          />
                        </div>
                      ) : null}
                      <h2 className="text-xl md:text-2xl font-light text-foreground/92 text-display tracking-tight mb-8 md:mb-10">
                        {s.label}
                      </h2>
                      {s.introBlock ? (
                        <SectionIntroBlock block={s.introBlock} />
                      ) : (
                        <SectionBody text={s.body} />
                      )}
                    </>
                  )}
                  {s.figures?.length ? (
                    <div className="mt-10 space-y-6">
                      {s.figures.map((fig, fi) => (
                        <SectionFigure key={fi} fig={fig} />
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer onMainProjectsClick={onMainProjectsClick} />
    </div>
  );
}
