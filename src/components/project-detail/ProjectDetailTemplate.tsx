import { useState, type MouseEvent } from "react";
import { useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSectionScrollSpy } from "@/hooks/useSectionScrollSpy";
import { useHideOnScroll } from "@/hooks/useHideOnScroll";
import { scrollToProjectSection } from "@/lib/projectDetailScroll";
import { noOrphan } from "@/lib/noOrphan";
import type { ProjectDetailDocument, ProjectSectionFigure, IntroBlock } from "@/types/projectDetail";
import Footer from "@/components/Footer";
import { SiteHeader } from "@/components/SiteHeader";
import { AuraHardwareSystem } from "./AuraHardwareSystem";
import { AuraHighlights } from "./AuraHighlights";
import { AuraScenes } from "./AuraScenes";
import { NeuraLyfeHighlights } from "./NeuraLyfeHighlights";
import { ZeatHighlights } from "./ZeatHighlights";
import { RangerHighlights } from "./RangerHighlights";
import { MoodMuseHighlights } from "./MoodMuseHighlights";
import { MoodMuseUsageProcess } from "./MoodMuseUsageProcess";
import { ImageLightbox, type LightboxImage } from "./ImageLightbox";
import { AuraDesignRequirements } from "./AuraDesignRequirements";
import { AuraIdeationCriteria } from "./AuraIdeationCriteria";
import { AuraTestingFindings } from "./AuraTestingFindings";
import { AuraReflectionLearnings } from "./AuraReflectionLearnings";
import {
  MotiTags,
  MotiHook,
  MotiAppStoreCta,
  MotiProblem,
  MotiCompetitive,
  MotiUserQuotes,
  MotiPrinciples,
  MotiBeforeBuilding,
  MotiBuildJourney,
  MotiTakeaways,
} from "./MotiModules";
import {
  OryneTags,
  OryneAppStoreCta,
  OryneHook,
  OryneProblem,
  OryneIdea,
  OryneFlow,
  OrynePrivacy,
  OryneShipping,
  OryneTakeaways,
} from "./OryneModules";
import { InkworkSymptoms, InkworkSequence, InkworkThemes, InkworkTryCta, InkworkSkillLink, InkworkCta } from "./InkworkModules";
import {
  CalmMouseDemo,
  CalmMouseFixes,
  CalmMouseAbsence,
  CalmMouseMilliseconds,
  CalmMouseShipping,
  CalmMouseVisitCta,
  CalmMouseCta,
} from "./CalmMouseModules";
import { NextUp } from "./NextUp";
import { ProjectMediaFrame } from "./ProjectMediaFrame";
import { ProjectMetadataSummary } from "./ProjectMetadataSummary";

// Shared page container — all major sections align to this grid
const PAGE_OUTER = "px-6 md:px-10 lg:px-16 max-w-page mx-auto";

// The section guide's docked offset while the site header is shown lives in the
// --guide-docked-top CSS var on the guide itself: 48px on mobile (flush under
// the menu row — pt-7 + 20px text — so the two read as one merged bar; the
// header hides its mobile divider for this), 72px on tablet (clearing the
// taller logo header ≈ 73px, which keeps its divider). It drops to the
// safe-area top once the header tucks away on scroll-down.

const sectionDomId = (id: string) => `project-section-${id}`;

function SectionIntroBlock({ block }: { block: IntroBlock }) {
  return (
    <div className="space-y-10">
      <p className="text-base md:text-xl font-normal leading-relaxed text-foreground/72">
        {block.openingParagraph}
      </p>

      {block.contextCards?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {block.contextCards.map((card) => (
            <div
              key={card.title}
              className="border border-border/50 bg-secondary/[0.08] rounded-sm px-5 py-5"
            >
              <p className="text-label uppercase tracking-eyebrow text-foreground/72 mb-2.5">
                {card.title}
              </p>
              <p className="text-sm font-normal leading-relaxed text-foreground/72">
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
              <p className="text-label uppercase tracking-eyebrow text-foreground/55 mb-2">
                {card.label}
              </p>
              <p className="text-sm font-normal leading-snug text-foreground/72">
                {card.value}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {block.whatIDid?.length ? (
        <div>
          <p className="text-label uppercase tracking-eyebrow text-foreground/55 mb-6">
            What I Did
          </p>
          <ul className="space-y-4">
            {block.whatIDid.map((item, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="mt-[0.5em] w-1 h-1 rounded-full bg-foreground/30 flex-shrink-0" />
                <span className="text-base md:text-xl font-normal leading-relaxed text-foreground/72">
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
          <strong key={i} className="font-semibold text-foreground">
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
  "zeat-highlights": <ZeatHighlights />,
  "ranger-highlights": <RangerHighlights />,
  "moodmuse-highlights": <MoodMuseHighlights />,
  "moodmuse-usage-process": <MoodMuseUsageProcess />,
  "aura-hardware": <AuraHardwareSystem />,
  "aura-scenes": <AuraScenes />,
  "aura-design-requirements": <AuraDesignRequirements />,
  "aura-ideation-criteria": <AuraIdeationCriteria />,
  "aura-testing-findings": <AuraTestingFindings />,
  "aura-reflection-learnings": <AuraReflectionLearnings />,
  "moti-tags": <MotiTags />,
  "moti-hook": <MotiHook />,
  "moti-app-store": <MotiAppStoreCta />,
  "moti-problem": <MotiProblem />,
  "moti-competitive": <MotiCompetitive />,
  "moti-user-quotes": <MotiUserQuotes />,
  "moti-principles": <MotiPrinciples />,
  "moti-before-building": <MotiBeforeBuilding />,
  "moti-build-journey": <MotiBuildJourney />,
  "moti-takeaways": <MotiTakeaways />,
  "oryne-tags": <OryneTags />,
  "oryne-app-store": <OryneAppStoreCta />,
  "oryne-hook": <OryneHook />,
  "oryne-problem": <OryneProblem />,
  "oryne-idea": <OryneIdea />,
  "oryne-flow": <OryneFlow />,
  "oryne-privacy": <OrynePrivacy />,
  "oryne-shipping": <OryneShipping />,
  "oryne-takeaways": <OryneTakeaways />,
  "inkwork-symptoms": <InkworkSymptoms />,
  "inkwork-sequence": <InkworkSequence />,
  "inkwork-themes": <InkworkThemes />,
  "inkwork-try": <InkworkTryCta />,
  "inkwork-skill-link": <InkworkSkillLink />,
  "inkwork-cta": <InkworkCta />,
  "calmmouse-demo": <CalmMouseDemo />,
  "calmmouse-fixes": <CalmMouseFixes />,
  "calmmouse-absence": <CalmMouseAbsence />,
  "calmmouse-milliseconds": <CalmMouseMilliseconds />,
  "calmmouse-shipping": <CalmMouseShipping />,
  "calmmouse-visit": <CalmMouseVisitCta />,
  "calmmouse-cta": <CalmMouseCta />,
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
              className={`${i === 0 ? "" : "mt-16 md:mt-20"} text-xs md:text-xl uppercase tracking-eyebrow font-light leading-relaxed text-foreground font-mono mb-5 md:mb-6`}
            >
              {noOrphan(para.slice(3))}
            </p>
          );
        }

        const figIdx = parseFigRef(para);
        if (figIdx !== null && inlineFigures?.[figIdx]) {
          return (
            <div key={i} className={i === 0 ? "" : "mt-14 md:mt-18"}>
              <ProjectMediaFrame fig={inlineFigures[figIdx]} />
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
        // Editorial hierarchy: the lead paragraph reads at full strength while
        // the remaining copy sits one emphasis step down (/85).
        const emphasisClass =
          leadFirst && i === 0 ? "text-foreground" : "text-foreground/85";
        return (
          <p
            key={i}
            className={`${spacingClass} text-base md:text-xl font-normal leading-relaxed ${emphasisClass}`}
          >
            {renderInline(noOrphan(para))}
          </p>
        );
      })}
    </div>
  );
}

interface ProjectDetailTemplateProps {
  project: ProjectDetailDocument;
  onBack: () => void;
  onMainProjectsClick?: () => void;
}

export function ProjectDetailTemplate({ project, onBack, onMainProjectsClick }: ProjectDetailTemplateProps) {
  const navigate = useNavigate();
  const sectionIds = project.sections.map((s) => s.id);
  const activeSectionId = useSectionScrollSpy(sectionIds);
  const hasIntroSection = project.sections.some((s) => s.subtitle);
  const hasInlineProjectMeta = project.sections.some((s) => s.showProjectMeta);
  const [lightbox, setLightbox] = useState<LightboxImage | null>(null);

  // Direction-aware site header, mirroring the homepage. The section nav below
  // shifts down to sit under it while shown (see MOBILE_SECTION_NAV_TOP).
  const shouldReduceMotion = useReducedMotion();
  // heroImageFit governs the still and the clip alike, so the two can never
  // size differently — swapping one for the other must not move the layout.
  const heroMediaClass =
    project.heroImageFit === "natural"
      ? "w-full h-auto block"
      : `w-full max-h-[min(78vh,900px)] min-h-[200px] ${
          project.heroImageFit === "contain" ? "object-contain" : "object-cover"
        } object-center`;
  const scrollHidden = useHideOnScroll();
  const headerHidden = !shouldReduceMotion && scrollHidden;

  // Delegated: any case-study image opens the lightbox, except navigational
  // thumbnails (the "Next up" cards / any linked image).
  const handleImageClick = (e: MouseEvent<HTMLDivElement>) => {
    const img = (e.target as HTMLElement).closest("img") as HTMLImageElement | null;
    if (!img) return;
    if (img.closest("a") || img.closest('[aria-label="Next up"]')) return;
    setLightbox({ src: img.currentSrc || img.src, alt: img.alt });
  };

  return (
    <div className="min-h-screen bg-background" data-detail-root onClick={handleImageClick}>

      {/* Site nav — shared with the homepage. Links route back home to the
          matching section / the About overlay. */}
      <SiteHeader
        hidden={headerHidden}
        inert={false}
        shouldReduceMotion={shouldReduceMotion}
        entranceVisible
        entranceDelay={0.15}
        hrefBase="/"
        onSection={(sectionId) => navigate("/", { state: { scrollTo: sectionId } })}
        onAbout={() => navigate("/", { state: { openAbout: true } })}
        hideMobileDivider
      />

      {/* Back — extra top padding clears the fixed site header on load */}
      <div className={`${PAGE_OUTER} pt-24 md:pt-28 pb-0`}>
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to home"
          className="group flex items-center gap-2 min-h-11 px-1 text-sm text-foreground/72 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 rounded-sm transition-colors duration-200"
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
        <p className="text-foreground/55 text-label uppercase tracking-eyebrow mb-5">
          {project.listSection}
        </p>
        <h1 className="font-display text-hero font-light text-foreground">
          {project.title}
        </h1>
        {project.heroSummary ? (
          <p
            // Highlighted exactly like a **bold** run in the body copy (renderInline:
            // font-semibold, full-strength), so the claim under the title and the
            // emphasised sentences below it read as one voice.
            className={`mt-5 md:mt-8 text-xl font-semibold text-foreground max-w-reading leading-relaxed text-balance ${
              // A "\n" in a summary is an authored line break, not stray whitespace.
              // Honor it from md up, where the column is wide enough for the lines
              // it was written for; below that the newline collapses back to a
              // space and text-balance wraps the summary on its own.
              project.heroSummary.includes("\n") ? "md:whitespace-pre-line md:text-pretty" : ""
            }`}
          >
            {noOrphan(project.heroSummary)}
          </p>
        ) : null}
      </header>

      {/* 2 — Hero media: a looping clip when the project has one, else the still */}
      {project.heroImage ? (
        <div className={`${PAGE_OUTER} mt-10 md:mt-14`}>
          <div className="overflow-hidden rounded-2xl bg-secondary/10">
            {project.heroVideo && !shouldReduceMotion ? (
              // A hero clip carries the poster as its first frame, so the LCP is
              // the same picture either way and nothing reflows when it starts.
              // No controls and no audio: it is a loop, not a film to watch.
              <video
                src={project.heroVideo}
                poster={project.heroImage}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                aria-label={`${project.title} — project visual`}
                className={heroMediaClass}
              />
            ) : (
              <img
                src={project.heroImage}
                alt={`${project.title} — project visual`}
                // The hero is this page's largest contentful paint and is discovered
                // late (only once the route chunk has run), so tell the browser it
                // outranks the lazy figures below. Lowercase: React 18 does not know
                // the camelCase prop and would warn.
                {...{ fetchpriority: "high" }}
                className={heroMediaClass}
              />
            )}
          </div>
        </div>
      ) : null}

      {/* 3 — Secondary copy below hero */}
      {(project.heroSubtitle || project.description) ? (
        <div className={`${PAGE_OUTER} ${project.heroImage ? "mt-10 md:mt-14" : "mt-8 md:mt-12"}`}>
          <div className="max-w-[900px]">
            {project.heroSubtitle ? (
              <p className="text-base md:text-xl text-foreground/72 font-light leading-relaxed">
                {noOrphan(project.heroSubtitle)}
              </p>
            ) : null}
            {project.description ? (
              <p className={`${project.heroSubtitle ? "mt-5 md:mt-6" : ""} text-base md:text-xl font-light leading-relaxed text-foreground/72`}>
                {noOrphan(project.description)}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* 4 — Standalone metadata */}
      {!hasIntroSection && !hasInlineProjectMeta && project.metaCards?.length ? (
        <div className={`${PAGE_OUTER} mt-12 md:mt-16`}>
          <div className="max-w-[900px]">
            <ProjectMetadataSummary cards={project.metaCards} />
          </div>
        </div>
      ) : null}

      {/* 5 — Body: sticky nav + sections */}
      <section
        aria-label="Case study"
        className={`${PAGE_OUTER} pb-32 md:pb-48 border-t border-border/30 mt-20 md:mt-28 pt-20 md:pt-28`}
      >
        {/* Mobile / tablet: horizontal section guide. A separate sticky layer
            from the global header — translucent like the header's scrim, with
            the backdrop blur carrying legibility over imagery scrolling under
            it. Its sticky offset follows the header:
            dropped below it while shown, flush to the safe-area top once the
            header tucks away. z-[60] keeps it ABOVE the z-50 header: in their
            settled states the two never share screen space, but while the header
            re-reveals mid-scroll the menu links land exactly where the guide sits,
            and the guide must win that hit-test — otherwise a tap meant for a
            section chip fires a menu link and navigates away. (The lightbox at
            z-[2000] still covers it.) */}
        <nav
          className="lg:hidden sticky z-[60] -mx-6 px-6 py-3 mb-14 bg-background/70 backdrop-blur-md border-b border-border/40 transition-[top] duration-300 ease-out [--guide-docked-top:48px] md:[--guide-docked-top:72px]"
          style={{
            top: headerHidden
              ? "env(safe-area-inset-top, 0px)"
              : "calc(env(safe-area-inset-top, 0px) + var(--guide-docked-top))",
          }}
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

          {/* Desktop left nav.
             Type sizes/tracking here (10-11px, 0.16-0.25em) are an intentional
             art-directed treatment kept off the canonical label/eyebrow scale —
             the finer lettering is deliberate. Do not normalize to text-label. */}
          <nav
            className="hidden lg:block w-[200px] xl:w-[220px] flex-shrink-0 sticky top-28 self-start"
            aria-label="Section navigation"
          >
            <p className="text-[10px] uppercase tracking-[0.25em] text-foreground/55 mb-6">
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
                        ? "border-foreground/75 text-foreground/90"
                        : "border-transparent text-foreground/55 hover:text-foreground/80 hover:border-foreground/30"
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
                className="scroll-mt-[calc(env(safe-area-inset-top,0px)+68px)] md:scroll-mt-32 mb-28 md:mb-36 last:mb-0"
              >
                {s.subtitle ? (
                  <>
                    <h2 className="font-display text-heading md:text-display font-light text-foreground mb-10 md:mb-12">
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
                      <p className="text-label uppercase tracking-eyebrow text-foreground/55 mb-4 md:mb-5">
                        {s.label}
                      </p>
                    ) : null}
                    <h2 className="font-display text-heading md:text-display font-light text-foreground mb-10 md:mb-12">
                      {noOrphan(s.headline ?? s.label)}
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
                    <ProjectMetadataSummary cards={project.metaCards} />
                  </div>
                ) : null}
                {s.afterMetaModule && INLINE_MODULES[s.afterMetaModule] ? (
                  <div className="mt-14 md:mt-18">{INLINE_MODULES[s.afterMetaModule]}</div>
                ) : null}
                {s.figures?.length && !s.body.includes("[[fig:") ? (
                  <div className="mt-14 space-y-10">
                    {s.figures.map((fig, fi) => (
                      <ProjectMediaFrame key={fi} fig={fig} />
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* Next up — related projects (reuses the homepage card, grid + navigation) */}
      <NextUp currentSlug={project.slug} />

      {/* Back to all work — returns to the homepage projects list via the site's own nav */}
      <div className={`${PAGE_OUTER} pt-12 md:pt-16 pb-2`}>
        <button
          type="button"
          onClick={onMainProjectsClick ?? onBack}
          aria-label="Back to all work"
          className="group flex items-center gap-2 min-h-11 px-1 text-sm text-foreground/72 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 rounded-sm transition-colors duration-200"
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

      <Footer
        hrefBase="/"
        onSectionClick={(sectionId) => navigate("/", { state: { scrollTo: sectionId } })}
        onAboutClick={() => navigate("/", { state: { openAbout: true } })}
        wide
      />

      <ImageLightbox image={lightbox} onClose={() => setLightbox(null)} />
    </div>
  );
}
