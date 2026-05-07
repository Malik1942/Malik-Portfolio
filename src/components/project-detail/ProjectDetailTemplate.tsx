import { useRef } from "react";
import { useInView } from "framer-motion";
import { useSectionScrollSpy } from "@/hooks/useSectionScrollSpy";
import { scrollToProjectSection } from "@/lib/projectDetailScroll";
import type { ProjectDetailDocument, ProjectSectionFigure, IntroBlock } from "@/types/projectDetail";
import Footer from "@/components/Footer";
import { AuraHardwareSystem } from "./AuraHardwareSystem";
import { AuraScenes } from "./AuraScenes";

function toEmbedUrl(url: string): string {
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return url;
}

function AutoplayVideo({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, amount: 0.5 });

  if (inView && ref.current && ref.current.paused) {
    ref.current.play().catch(() => {});
  }

  return (
    <div ref={containerRef}>
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        playsInline
        controls
        className="w-full max-h-[min(640px,72vh)] object-contain bg-black"
      />
    </div>
  );
}

function SectionFigure({ fig }: { fig: ProjectSectionFigure }) {
  if (fig.type === "video") {
    return (
      <figure className="overflow-hidden rounded-2xl bg-secondary/10">
        <AutoplayVideo src={fig.src} poster={fig.poster} />
      </figure>
    );
  }
  if (fig.type === "embed") {
    return (
      <figure className="overflow-hidden rounded-2xl bg-secondary/10 aspect-video">
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
    <figure className="overflow-hidden rounded-2xl bg-secondary/10">
      <img
        src={fig.src}
        alt={fig.alt}
        className="w-full h-auto block"
      />
    </figure>
  );
}

const sectionDomId = (id: string) => `project-section-${id}`;

function SectionIntroBlock({ block }: { block: IntroBlock }) {
  return (
    <div className="space-y-10">
      <p className="text-[15px] md:text-[17px] font-normal leading-[1.72] text-foreground/75 text-body">
        {block.openingParagraph}
      </p>

      {block.contextCards?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {block.contextCards.map((card) => (
            <div
              key={card.title}
              className="border border-border/50 bg-secondary/[0.08] rounded-sm px-4 py-4"
            >
              <p className="text-[11px] uppercase tracking-[0.18em] text-foreground/60 text-body mb-2">
                {card.title}
              </p>
              <p className="text-[13px] font-light leading-relaxed text-foreground/65 text-body">
                {card.body}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {block.infoCards?.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {block.infoCards.map((card) => (
            <div
              key={card.label}
              className="border border-border/40 bg-transparent rounded-sm px-4 py-3"
            >
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 text-body mb-1.5">
                {card.label}
              </p>
              <p className="text-[13px] font-light leading-snug text-foreground/75 text-body">
                {card.value}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {block.whatIDid?.length ? (
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground/50 text-body mb-5">
            What I Did
          </p>
          <ul className="space-y-3">
            {block.whatIDid.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-[0.45em] w-1 h-1 rounded-full bg-foreground/25 flex-shrink-0" />
                <span className="text-[15px] md:text-[17px] font-normal leading-[1.72] text-foreground/75 text-body">
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

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  if (parts.length === 1) return text;
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className="font-medium text-foreground/[0.96]">
            {part.slice(2, -2)}
          </strong>
        ) : (
          part
        )
      )}
    </>
  );
}

const INLINE_MODULES: Record<string, React.ReactNode> = {
  "aura-hardware": <AuraHardwareSystem />,
  "aura-scenes": <AuraScenes />,
};

function SectionBody({ text, leadFirst, inlineFigures }: { text: string; leadFirst?: boolean; inlineFigures?: ProjectSectionFigure[] }) {
  const blocks = text.split(/\n\n+/).filter(Boolean);
  const isBullet = (s: string) => s.trimStart().startsWith("·");
  const isSubheading = (s: string) => s.startsWith("## ");
  const parseFigRef = (s: string) => { const m = s.match(/^\[\[fig:(\d+)\]\]$/); return m ? parseInt(m[1]) : null; };
  const parseModuleRef = (s: string) => { const m = s.match(/^\[\[module:([^\]]+)\]\]$/); return m ? m[1] : null; };
  return (
    <div>
      {blocks.map((para, i) => {
        const bullet = isBullet(para);
        const prevBullet = i > 0 && isBullet(blocks[i - 1]);
        const prevSubheading = i > 0 && isSubheading(blocks[i - 1]);

        if (isSubheading(para)) {
          return (
            <p
              key={i}
              className={`${i === 0 ? "" : "mt-16 md:mt-20"} text-[13px] md:text-[14px] uppercase tracking-[0.16em] font-normal text-foreground/72 text-body mb-4 md:mb-5`}
            >
              {para.slice(3)}
            </p>
          );
        }

        const figIdx = parseFigRef(para);
        if (figIdx !== null && inlineFigures?.[figIdx]) {
          return (
            <div key={i} className={i === 0 ? "" : "mt-12 md:mt-16"}>
              <SectionFigure fig={inlineFigures[figIdx]} />
            </div>
          );
        }

        const modName = parseModuleRef(para);
        if (modName !== null && INLINE_MODULES[modName]) {
          return (
            <div key={i} className={i === 0 ? "" : "mt-14 md:mt-18"}>
              {INLINE_MODULES[modName]}
            </div>
          );
        }

        const spacingClass =
          i === 0 ? ""
          : prevSubheading ? ""
          : bullet && prevBullet ? "mt-3"
          : "mt-5 md:mt-6";
        return (
          <p
            key={i}
            className={`${spacingClass} text-[15px] md:text-[17px] font-normal leading-[1.55] ${
              leadFirst && i === 0 ? "text-foreground/85" : "text-foreground/75"
            } text-body`}
          >
            {renderInline(para)}
          </p>
        );
      })}
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border/40 bg-secondary/[0.07] rounded-sm px-5 py-5 md:px-6 md:py-6">
      <p className="text-[10px] uppercase tracking-[0.22em] text-foreground/38 text-body mb-3">
        {label}
      </p>
      <p className="text-[13px] md:text-sm font-normal leading-relaxed text-foreground/75 text-body">
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
  const hasIntroSection = project.sections.some((s) => s.subtitle);

  return (
    <div className="min-h-screen bg-background">
      {/* Back */}
      <div className="px-6 md:px-16 lg:px-20 pt-8 pb-0 max-w-[1600px] mx-auto">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to home"
          className="group flex items-center gap-2 min-h-[44px] px-1 text-sm text-body text-foreground/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 rounded transition-colors duration-200"
        >
          <svg
            aria-hidden="true"
            className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back
        </button>
      </div>

      {/* 1 — Title + hook */}
      <header className="px-6 md:px-16 lg:px-20 pt-8 md:pt-10 max-w-[1440px] mx-auto">
        <p className="text-muted-foreground text-[11px] text-body uppercase tracking-[0.2em] mb-4">
          {project.listSection}
        </p>
        <h1 className="text-4xl md:text-6xl lg:text-[4.5rem] font-light text-foreground text-display tracking-[-0.03em] leading-[1.08]">
          {project.title}
        </h1>
        {project.heroSummary ? (
          <p className="mt-4 md:mt-6 text-base md:text-lg font-light text-foreground/55 text-body max-w-2xl leading-relaxed">
            {project.heroSummary}
          </p>
        ) : null}
      </header>

      {/* 2 — Hero image */}
      {project.heroImage ? (
        <div className="px-6 md:px-16 lg:px-20 mt-10 md:mt-12 max-w-[1440px] mx-auto">
          <div className="overflow-hidden rounded-2xl bg-secondary/10">
            <img
              src={project.heroImage}
              alt={`${project.title} — project visual`}
              className={
                project.heroImageFit === "natural"
                  ? "w-full h-auto block"
                  : `w-full max-h-[min(76vh,860px)] min-h-[200px] ${
                      project.heroImageFit === "contain" ? "object-contain" : "object-cover"
                    } object-center`
              }
            />
          </div>
        </div>
      ) : null}

      {/* 3 — Secondary copy below hero */}
      {(project.heroSubtitle || project.description) ? (
        <div className={`px-6 md:px-16 lg:px-20 max-w-[1440px] mx-auto ${project.heroImage ? "mt-10 md:mt-14" : "mt-8 md:mt-10"}`}>
          <div className="max-w-[860px]">
            {project.heroSubtitle ? (
              <p className="text-sm md:text-base text-muted-foreground font-light leading-relaxed text-body">
                {project.heroSubtitle}
              </p>
            ) : null}
            {project.description ? (
              <p className={`${project.heroSubtitle ? "mt-4 md:mt-5" : ""} text-[15px] md:text-[17px] font-light leading-[1.8] text-foreground/65 text-body`}>
                {project.description}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* 4 — Standalone metadata */}
      {!hasIntroSection && project.metaCards?.length ? (
        <div className="px-6 md:px-16 lg:px-20 mt-10 md:mt-14 max-w-[1200px] mx-auto">
          <MetaGrid cards={project.metaCards} />
        </div>
      ) : null}

      {/* 5 — Body: sticky nav + sections */}
      <section aria-label="Case study" className="px-6 md:px-16 lg:px-20 pb-32 md:pb-40 border-t border-border/30 mt-20 md:mt-28 pt-20 md:pt-28">
        <div className="max-w-[1200px] mx-auto">
          {/* Mobile / tablet: horizontal section nav */}
          <nav
            className="lg:hidden sticky top-0 z-20 -mx-6 px-6 py-3 mb-14 bg-background/85 backdrop-blur-md border-b border-border/40"
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
                      : "text-foreground/48 border border-transparent hover:text-foreground/72"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </nav>

          <div className="flex flex-col lg:flex-row lg:gap-16 xl:gap-20 lg:items-start">
            {/* Desktop left nav */}
            <nav
              className="hidden lg:block w-[180px] xl:w-[200px] flex-shrink-0 sticky top-28 self-start"
              aria-label="Section navigation"
            >
              <p className="text-[10px] uppercase tracking-[0.25em] text-foreground/38 mb-6 text-body">
                On this page
              </p>
              <ul className="space-y-0.5">
                {project.sections.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => scrollToProjectSection(s.id)}
                      className={`w-full text-left pl-3 py-2.5 border-l transition-[color,border-color] duration-300 text-[15px] leading-tight ${
                        activeSectionId === s.id
                          ? "border-foreground/62 text-foreground/92"
                          : "border-transparent text-foreground/55 hover:text-foreground/72 hover:border-foreground/28"
                      }`}
                    >
                      {s.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Main content column */}
            <div className="min-w-0 flex-1">
              {project.sections.map((s) => (
                <article
                  key={s.id}
                  id={sectionDomId(s.id)}
                  className="scroll-mt-28 md:scroll-mt-32 mb-28 md:mb-36 last:mb-0"
                >
                  {s.subtitle ? (
                    <>
                      <h2 className="text-[2rem] md:text-[2.5rem] font-light text-foreground/93 text-display tracking-[-0.02em] leading-[1.12] mb-8 md:mb-10">
                        {s.subtitle}
                      </h2>
                      <SectionBody text={s.body} leadFirst />
                      {s.showProjectMeta && project.metaCards?.length ? (
                        <div className="mt-12 md:mt-16">
                          <MetaGrid cards={project.metaCards} />
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <>
                      {s.introBlock?.coverImage ? (
                        <div className="mb-12 overflow-hidden rounded-2xl bg-secondary/10">
                          <img
                            src={s.introBlock.coverImage}
                            alt=""
                            className={`w-full max-h-[min(72vh,820px)] min-h-[180px] ${
                              s.introBlock.coverImageFit === "cover" ? "object-cover" : "object-contain"
                            } object-center`}
                          />
                        </div>
                      ) : null}
                      <h2 className="text-[2rem] md:text-[2.5rem] font-light text-foreground/93 text-display tracking-[-0.02em] leading-[1.12] mb-8 md:mb-10">
                        {s.label}
                      </h2>
                      {s.introBlock ? (
                        <SectionIntroBlock block={s.introBlock} />
                      ) : (
                        <SectionBody text={s.body} inlineFigures={s.figures} />
                      )}
                    </>
                  )}
                  {s.figures?.length && !s.body.includes("[[fig:") ? (
                    <div className="mt-12 space-y-8">
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
