import { useRef, useState, type MouseEvent } from "react";
import { useInView } from "framer-motion";
import { useSectionScrollSpy } from "@/hooks/useSectionScrollSpy";
import { scrollToProjectSection } from "@/lib/projectDetailScroll";
import type { ProjectDetailDocument, ProjectSectionFigure, IntroBlock } from "@/types/projectDetail";
import Footer from "@/components/Footer";
import { AuraHardwareSystem } from "./AuraHardwareSystem";
import { AuraHighlights } from "./AuraHighlights";
import { AuraScenes } from "./AuraScenes";
import { NeuraLyfeHighlights } from "./NeuraLyfeHighlights";
import { ImageLightbox, type LightboxImage } from "./ImageLightbox";
import { AuraDesignRequirements } from "./AuraDesignRequirements";
import { AuraIdeationCriteria } from "./AuraIdeationCriteria";
import { AuraTestingFindings } from "./AuraTestingFindings";
import { AuraReflectionLearnings } from "./AuraReflectionLearnings";
import {
  MotiTags,
  MotiHook,
  MotiProblem,
  MotiCompetitive,
  MotiUserQuotes,
  MotiPrinciples,
  MotiBeforeBuilding,
  MotiBuildJourney,
  MotiTakeaways,
} from "./MotiModules";
import { MoreProjects } from "./MoreProjects";

// Shared page container — all major sections align to this grid
const PAGE_OUTER = "px-6 md:px-10 lg:px-16 max-w-[1400px] mx-auto";

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
        preload="none"
        muted
        playsInline
        controls
        className="w-full max-h-[min(700px,74vh)] object-contain bg-black"
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
        loading="lazy"
        decoding="async"
        className="w-full h-auto block"
      />
    </figure>
  );
}

const sectionDomId = (id: string) => `project-section-${id}`;

function SectionIntroBlock({ block }: { block: IntroBlock }) {
  return (
    <div className="space-y-10">
      <p className="text-[17px] md:text-[19px] font-normal leading-[1.68] text-foreground/82 text-body">
        {block.openingParagraph}
      </p>

      {block.contextCards?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {block.contextCards.map((card) => (
            <div
              key={card.title}
              className="border border-border/50 bg-secondary/[0.08] rounded-sm px-5 py-5"
            >
              <p className="text-[11px] uppercase tracking-[0.18em] text-foreground/60 text-body mb-2.5">
                {card.title}
              </p>
              <p className="text-[14px] font-normal leading-relaxed text-foreground/75 text-body">
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
              className="border border-border/40 bg-transparent rounded-sm px-4 py-4"
            >
              <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/44 text-body mb-2">
                {card.label}
              </p>
              <p className="text-[14px] font-normal leading-snug text-foreground/80 text-body">
                {card.value}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {block.whatIDid?.length ? (
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-foreground/44 text-body mb-6">
            What I Did
          </p>
          <ul className="space-y-4">
            {block.whatIDid.map((item, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="mt-[0.5em] w-1 h-1 rounded-full bg-foreground/30 flex-shrink-0" />
                <span className="text-[17px] md:text-[19px] font-normal leading-[1.68] text-foreground/82 text-body">
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
          <strong key={i} className="font-semibold text-foreground/[0.98]">
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
  "aura-highlights": <AuraHighlights />,
  "neuralyfe-highlights": <NeuraLyfeHighlights />,
  "aura-hardware": <AuraHardwareSystem />,
  "aura-scenes": <AuraScenes />,
  "aura-design-requirements": <AuraDesignRequirements />,
  "aura-ideation-criteria": <AuraIdeationCriteria />,
  "aura-testing-findings": <AuraTestingFindings />,
  "aura-reflection-learnings": <AuraReflectionLearnings />,
  "moti-tags": <MotiTags />,
  "moti-hook": <MotiHook />,
  "moti-problem": <MotiProblem />,
  "moti-competitive": <MotiCompetitive />,
  "moti-user-quotes": <MotiUserQuotes />,
  "moti-principles": <MotiPrinciples />,
  "moti-before-building": <MotiBeforeBuilding />,
  "moti-build-journey": <MotiBuildJourney />,
  "moti-takeaways": <MotiTakeaways />,
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
              className={`${i === 0 ? "" : "mt-16 md:mt-20"} text-[12px] md:text-[20px] uppercase tracking-[0.08em] font-light leading-[24px] md:leading-[32px] text-foreground/85 text-mono mb-5 md:mb-6`}
            >
              {para.slice(3)}
            </p>
          );
        }

        const figIdx = parseFigRef(para);
        if (figIdx !== null && inlineFigures?.[figIdx]) {
          return (
            <div key={i} className={i === 0 ? "" : "mt-14 md:mt-18"}>
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
          : bullet && prevBullet ? "mt-4"
          : "mt-7 md:mt-8";
        return (
          <p
            key={i}
            className={`${spacingClass} text-[16px] md:text-[20px] font-normal leading-[28px] md:leading-[36px] ${
              leadFirst && i === 0 ? "text-foreground/90" : "text-foreground/85"
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
      <p className="text-[10px] uppercase tracking-[0.22em] text-foreground/44 text-body mb-3">
        {label}
      </p>
      <p className="text-[14px] md:text-[15px] font-normal leading-relaxed text-foreground/80 text-body">
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
  const hasInlineProjectMeta = project.sections.some((s) => s.showProjectMeta);
  const [lightbox, setLightbox] = useState<LightboxImage | null>(null);

  // Delegated: any case-study image opens the lightbox, except navigational
  // thumbnails (the "More projects" cards / any linked image).
  const handleImageClick = (e: MouseEvent<HTMLDivElement>) => {
    const img = (e.target as HTMLElement).closest("img") as HTMLImageElement | null;
    if (!img) return;
    if (img.closest("a") || img.closest('[aria-label="More projects"]')) return;
    setLightbox({ src: img.currentSrc || img.src, alt: img.alt });
  };

  return (
    <div className="min-h-screen bg-background" data-detail-root onClick={handleImageClick}>

      {/* Back */}
      <div className={`${PAGE_OUTER} pt-8 pb-0`}>
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
      <header className={`${PAGE_OUTER} pt-8 md:pt-12`}>
        <p className="text-foreground/44 text-[11px] text-body uppercase tracking-[0.2em] mb-5">
          {project.listSection}
        </p>
        <h1 className="text-[2.8rem] md:text-[4.5rem] lg:text-[5.5rem] font-light text-foreground text-display tracking-[-0.03em] leading-[1.06]">
          {project.title}
        </h1>
        {project.heroSummary ? (
          <p className="mt-5 md:mt-8 text-lg md:text-xl font-light text-foreground/70 text-body max-w-[760px] leading-[1.6]">
            {project.heroSummary}
          </p>
        ) : null}
      </header>

      {/* 2 — Hero image */}
      {project.heroImage ? (
        <div className={`${PAGE_OUTER} mt-10 md:mt-14`}>
          <div className="overflow-hidden rounded-2xl bg-secondary/10">
            <img
              src={project.heroImage}
              alt={`${project.title} — project visual`}
              className={
                project.heroImageFit === "natural"
                  ? "w-full h-auto block"
                  : `w-full max-h-[min(78vh,900px)] min-h-[200px] ${
                      project.heroImageFit === "contain" ? "object-contain" : "object-cover"
                    } object-center`
              }
            />
          </div>
        </div>
      ) : null}

      {/* 3 — Secondary copy below hero */}
      {(project.heroSubtitle || project.description) ? (
        <div className={`${PAGE_OUTER} ${project.heroImage ? "mt-10 md:mt-14" : "mt-8 md:mt-12"}`}>
          <div className="max-w-[900px]">
            {project.heroSubtitle ? (
              <p className="text-base md:text-lg text-foreground/65 font-light leading-[1.65] text-body">
                {project.heroSubtitle}
              </p>
            ) : null}
            {project.description ? (
              <p className={`${project.heroSubtitle ? "mt-5 md:mt-6" : ""} text-[17px] md:text-[19px] font-light leading-[1.68] text-foreground/72 text-body`}>
                {project.description}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* 4 — Standalone metadata */}
      {!hasIntroSection && !hasInlineProjectMeta && project.metaCards?.length ? (
        <div className={`${PAGE_OUTER} mt-12 md:mt-16`}>
          <div className="max-w-[900px]">
            <MetaGrid cards={project.metaCards} />
          </div>
        </div>
      ) : null}

      {/* 5 — Body: sticky nav + sections */}
      <section
        aria-label="Case study"
        className={`${PAGE_OUTER} pb-32 md:pb-48 border-t border-border/30 mt-20 md:mt-28 pt-20 md:pt-28`}
      >
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
                    : "text-foreground/55 border border-transparent hover:text-foreground/75"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="flex flex-col lg:flex-row lg:gap-20 xl:gap-24 lg:items-start">

          {/* Desktop left nav */}
          <nav
            className="hidden lg:block w-[200px] xl:w-[220px] flex-shrink-0 sticky top-28 self-start"
            aria-label="Section navigation"
          >
            <p className="text-[10px] uppercase tracking-[0.25em] text-foreground/44 mb-6 text-body">
              On this page
            </p>
            <ul className="space-y-0.5">
              {project.sections.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => scrollToProjectSection(s.id)}
                    className={`w-full text-left pl-3 py-2.5 border-l transition-[color,border-color] duration-300 text-[11px] uppercase tracking-[0.16em] leading-tight ${
                      activeSectionId === s.id
                        ? "border-foreground/75 text-foreground/92"
                        : "border-transparent text-foreground/55 hover:text-foreground/78 hover:border-foreground/30"
                    }`}
                  >
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Main content column */}
          <div className="min-w-0 flex-1 max-w-[900px]">
            {project.sections.map((s) => (
              <article
                key={s.id}
                id={sectionDomId(s.id)}
                className="scroll-mt-28 md:scroll-mt-32 mb-28 md:mb-36 last:mb-0"
              >
                {s.subtitle ? (
                  <>
                    <h2 className="text-[40px] md:text-[56px] font-light text-foreground text-display tracking-[-0.02em] leading-[48px] md:leading-[64px] mb-10 md:mb-12">
                      {s.subtitle}
                    </h2>
                    <SectionBody text={s.body} leadFirst />
                  </>
                ) : (
                  <>
                    {s.introBlock?.coverImage ? (
                      <div className="mb-12 overflow-hidden rounded-2xl bg-secondary/10">
                        <img
                          src={s.introBlock.coverImage}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className={`w-full max-h-[min(74vh,840px)] min-h-[180px] ${
                            s.introBlock.coverImageFit === "cover" ? "object-cover" : "object-contain"
                          } object-center`}
                        />
                      </div>
                    ) : null}
                    {s.headline ? (
                      <p className="text-[11px] uppercase tracking-[0.22em] text-foreground/55 text-body mb-4 md:mb-5">
                        {s.label}
                      </p>
                    ) : null}
                    <h2 className="text-[40px] md:text-[56px] font-light text-foreground text-display tracking-[-0.02em] leading-[48px] md:leading-[64px] mb-10 md:mb-12">
                      {s.headline ?? s.label}
                    </h2>
                    {s.introBlock ? (
                      <SectionIntroBlock block={s.introBlock} />
                    ) : (
                      <SectionBody text={s.body} inlineFigures={s.figures} />
                    )}
                  </>
                )}
                {s.showProjectMeta && project.metaCards?.length ? (
                  <div className="mt-14 md:mt-18">
                    <MetaGrid cards={project.metaCards} />
                  </div>
                ) : null}
                {s.figures?.length && !s.body.includes("[[fig:") ? (
                  <div className="mt-14 space-y-10">
                    {s.figures.map((fig, fi) => (
                      <SectionFigure key={fi} fig={fig} />
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* More work — related projects (reuses the homepage card, grid + navigation) */}
      <MoreProjects currentSlug={project.slug} />

      {/* Back to all work — returns to the homepage projects list via the site's own nav */}
      <div className={`${PAGE_OUTER} pt-12 md:pt-16 pb-2`}>
        <button
          type="button"
          onClick={onMainProjectsClick ?? onBack}
          aria-label="Back to all work"
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
          Back to all work
        </button>
      </div>

      <Footer onMainProjectsClick={onMainProjectsClick} wide />

      <ImageLightbox image={lightbox} onClose={() => setLightbox(null)} />
    </div>
  );
}
