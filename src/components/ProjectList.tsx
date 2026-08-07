import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

export interface Project {
  id?: string;
  title: string;
  description: string;
  signal?: string;
  role: string;
  year: string;
  coverImage?: string;
  coverVideo?: string;
  coverFit?: "cover" | "contain";
  details?: string;
  externalUrl?: string;
  builtWith?: string;
  /** Case study still in development: card stays visible but is not clickable. */
  wip?: boolean;
  /** Uppercase eyebrow chip above the title — used to mark a project as a
   *  different kind of work from the rest of its section (e.g. "Industrial Design"
   *  inside Workshop, which is otherwise software built with AI tools). */
  tag?: string;
  /** Render this project as a full-width row above its section's grid.
   *  Declarative rather than positional, so reordering the array can't silently
   *  reassign which project is the hero. */
  sectionHero?: boolean;
}

interface ProjectListProps {
  id: string;
  sectionTitle: string;
  sectionSubtitle: string;
  dotColor: "red" | "gold";
  projects: Project[];
  variant?: "main" | "ai";
}

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Grid alternates portrait/landscape per pair — creates height rhythm without fixed px.
// Pair 0: left=portrait, right=landscape. Pair 1: left=landscape, right=portrait. etc.
function getGridAspectRatio(index: number): string {
  const pair    = Math.floor(index / 2);
  const pos     = index % 2;
  const portrait = pair % 2 === 0 ? pos === 0 : pos === 1;
  return portrait ? "4/5" : "3/2";
}

// Right-column cards stagger down for organic rhythm
function getGridMarginTop(index: number): string {
  return index % 2 === 1 ? "clamp(24px, 3vw, 44px)" : "0px";
}

// How long a cover video waits after its card lands on screen before the reel
// runs. Without it the reel competes with the scroll that brought it into view.
const COVER_VIDEO_START_DELAY_MS = 600;

// ─── Media helper (shared) ────────────────────────────────────────────────────
// Default: w-full h-auto — container scales to the image's natural ratio.
// When aspectRatio is provided the container uses that fixed ratio with object-cover,
// so the image fills the shape without distortion.
const CardMedia = ({
  project,
  hovered,
  aspectRatio,
}: {
  project: Project;
  hovered: boolean;
  aspectRatio?: string;
}) => {
  const forced = !!aspectRatio;
  const mediaClass = forced
    ? "w-full h-full object-cover"
    : "w-full h-auto block";

  // A cover video is motion the visitor never asked for, so reduced-motion falls
  // through to the still below — which is why a card with `coverVideo` should also
  // carry a `coverImage`. It doubles as the video's poster, so the card paints a
  // real frame instead of an empty box while the video decodes, and it's what the
  // reel returns to at the top of every run.
  const shouldReduceMotion = useReducedMotion();
  const hasVideo = !!project.coverVideo && !shouldReduceMotion;

  // ── Cover video playback ──
  // The reel plays on arrival, once, and then holds on its closing frame. It does
  // NOT autoplay at page load: a hero card's video would be several seconds deep by
  // the time you scrolled down to it, so you'd never see the opening. And it does
  // not loop — a second viewing is something the visitor asks for by hovering,
  // rather than ambient motion running in the corner of the page forever.
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  // Deliberately not `once: true`. A one-shot latch fires on any intersection the
  // observer ever reports, including the transient ones during load — restoring
  // the scroll position on a reload can sweep a card through the viewport, which
  // burned the trigger for a card the visitor never actually saw. Watching
  // continuously lets the delay below double as the filter for those.
  const mediaInView = useInView(mediaRef, { amount: 0.5 });
  const startTimer = useRef<number>();
  const hasPlayed = useRef(false);

  const playFromStart = useCallback(() => {
    // Cancels a still-pending arrival start, so an early hover doesn't get yanked
    // back to frame 0 when that timer fires a moment later.
    window.clearTimeout(startTimer.current);
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => {});
  }, []);

  // First run: the card has to be half on screen and *stay* there for the delay.
  // Leaving the viewport cancels the pending start, so only a card the visitor
  // actually settled on gets to play. Once is enough — scrolling back to it later
  // is not a request to see it again; hovering is.
  useEffect(() => {
    if (!hasVideo || !mediaInView || hasPlayed.current) return;
    startTimer.current = window.setTimeout(() => {
      hasPlayed.current = true;
      playFromStart();
    }, COVER_VIDEO_START_DELAY_MS);
    return () => window.clearTimeout(startTimer.current);
  }, [hasVideo, mediaInView, playFromStart]);

  // Replay: on the pointer *entering* the card, not on every render where it
  // happens to already be inside — otherwise a re-render mid-reel restarts it.
  const wasHovered = useRef(false);
  useEffect(() => {
    const entered = hovered && !wasHovered.current;
    wasHovered.current = hovered;
    if (hasVideo && entered) playFromStart();
  }, [hovered, hasVideo, playFromStart]);

  return (
    <div
      ref={mediaRef}
      className="overflow-hidden rounded-2xl bg-project-card-surface relative mb-6 w-full"
      style={forced ? { aspectRatio } : undefined}
    >
      {hasVideo ? (
        <video
          ref={videoRef}
          src={project.coverVideo}
          poster={project.coverImage}
          muted playsInline preload="auto"
          className={mediaClass}
          style={{
            transform: hovered ? "scale(1.03)" : "scale(1)",
            transition: "transform 0.9s cubic-bezier(0.22,1,0.36,1)",
          }}
        />
      ) : project.coverImage ? (
        <img
          src={project.coverImage}
          alt={project.title}
          loading="lazy"
          decoding="async"
          className={mediaClass}
          style={{
            transform: hovered ? "scale(1.03)" : "scale(1)",
            transition: "transform 0.9s cubic-bezier(0.22,1,0.36,1)",
          }}
        />
      ) : (
        <div className="w-full aspect-video flex items-center justify-center">
          <span className="text-foreground/55 text-xs uppercase tracking-eyebrow">
            No image
          </span>
        </div>
      )}
      <motion.div
        className="absolute inset-0 bg-project-card-hover-overlay pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.35 }}
      />
      {project.wip ? (
        <span className="absolute left-3 top-3 z-10 rounded-full border border-border/50 bg-background/75 px-2.5 py-1 text-label uppercase tracking-eyebrow text-foreground/72 backdrop-blur-sm">
          In Progress
        </span>
      ) : null}
    </div>
  );
};

// ─── Project card (unified) ───────────────────────────────────────────────────
// Exported so the project-detail "More work" section can reuse the exact same card.
// Real link wrapper so cards are keyboard-focusable and open like any anchor
// (middle-click, cmd-click, screen-reader announcement). WIP cards fall through
// to a plain div until their case study is ready.
//
// Defined at module scope (NOT inside ProjectCard) so its component identity is
// stable. When it lived in the ProjectCard body, every re-render — useInView
// flipping on scroll-in, and setHovered on each mouse enter/leave — produced a
// brand-new component type. React saw a different type at the same position and
// unmounted/remounted the entire card subtree, so entrance animations popped to
// their end state, images flashed on scroll-in, and the hover overlay fade never
// played (the element was destroyed and recreated already faded). Hoisting fixes
// this without touching any animation values.
const CardLink = ({
  isWip,
  externalUrl,
  projectId,
  className,
  focusRing,
  children,
}: {
  isWip: boolean;
  externalUrl?: string;
  projectId?: string;
  className: string;
  focusRing: string;
  children: ReactNode;
}) => {
  const cls = `${className} ${focusRing}`;
  if (isWip) {
    return <div className={className}>{children}</div>;
  }
  if (externalUrl) {
    return (
      <a href={externalUrl} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  if (projectId) {
    return (
      <Link to={`/project/${projectId}`} className={cls}>
        {children}
      </Link>
    );
  }
  return <div className={className}>{children}</div>;
};

export const ProjectCard = ({
  project,
  projectId,
  dotClass,
  globalIndex,
  rowDelay = 0,
  metadataLabel,
  aspectRatio,
  maxWidth,
  horizontal = false,
  imageRight = false,
}: {
  project: Project;
  projectId?: string;
  dotClass: string;
  globalIndex: number;
  rowDelay?: number;
  metadataLabel?: string;
  aspectRatio?: string;
  maxWidth?: string;
  horizontal?: boolean;
  imageRight?: boolean;
}) => {
  const [hovered, setHovered] = useState(false);
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -80px 0px" });

  // ── Hero dot arrival ──
  // Clicking a project dot in the hero canvas scrolls here and fires
  // "project-dot-arrive" on landing (see DotGrid + lib/scrollToTarget). The card
  // answers with a brief pulse so the jump reads as "this one" rather than an
  // unexplained scroll. `arriving` also forces the reveal: the scroll is faster
  // than the entrance animation, so a card that never crossed the viewport would
  // otherwise be sitting at opacity 0 when the pulse plays.
  const [arriving, setArriving] = useState(false);
  useEffect(() => {
    if (!projectId) return;
    const onArrive = (event: Event) => {
      const { id } = (event as CustomEvent<{ id?: string }>).detail ?? {};
      setArriving(id === projectId);
    };
    window.addEventListener("project-dot-arrive", onArrive);
    return () => window.removeEventListener("project-dot-arrive", onArrive);
  }, [projectId]);

  const revealed = inView || arriving;
  // Shared by both card layouts below.
  const arrivalProps = {
    className: arriving ? "project-row-arriving" : undefined,
    onAnimationEnd: () => setArriving(false),
  };

  // WIP cards stay visible but non-interactive: no link, no pointer, no hover lift.
  const isWip = !!project.wip;
  const cursorClass = isWip ? "cursor-default" : "cursor-pointer";
  const handleEnter = () => { if (!isWip) setHovered(true); };
  const handleLeave = () => { if (!isWip) setHovered(false); };

  // focusRing is passed to the module-scope CardLink (see above ProjectCard).
  // Keeping CardLink out of this function body keeps its component identity stable
  // across re-renders, so the card subtree is never unmounted/remounted.
  const focusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/60 focus-visible:ring-offset-4 focus-visible:ring-offset-background rounded-2xl";

  // Uppercase eyebrow marking a project as a different kind of work from the rest
  // of its section. Shared by both card layouts below.
  const tagChip = () =>
    project.tag ? (
      <span
        className="text-label uppercase tracking-eyebrow text-foreground/60 mb-2 block"
        style={{ fontSize: "0.6875rem" }}
      >
        {project.tag}
      </span>
    ) : null;

  // ── Vertical card text (grid cards) ──
  const textBlock = () => (
    <>
      {tagChip()}
      {/* Title */}
      <h3
        className="tracking-tight font-semibold leading-snug transition-colors duration-300"
        style={{
          fontSize: isMobile ? "clamp(1.1rem, 4vw, 1.25rem)" : "clamp(1.2rem, 1.6vw, 1.4rem)",
          letterSpacing: "-0.025em",
          marginBottom: isMobile ? "0.5rem" : "0.3rem",
          color: hovered ? "hsl(var(--color-text-primary))" : "hsl(var(--color-text-primary) / 0.88)",
        }}
      >
        {project.title}
      </h3>

      {/* Description */}
      <p
        className={isMobile ? "leading-relaxed line-clamp-2" : "leading-snug line-clamp-2"}
        style={{
          fontSize: isMobile ? "0.9375rem" : "0.875rem",
          marginBottom: isMobile ? "0.75rem" : "1rem",
          color: "hsl(var(--color-text-primary) / 0.80)",
        }}
      >
        {project.description}
      </p>

      {/* Metadata */}
      <p
        style={{
          fontSize: isMobile ? "0.9375rem" : "0.875rem",
          letterSpacing: "0.02em",
          color: "hsl(var(--color-text-primary) / 0.72)",
        }}
      >
        {metadataLabel ?? project.role} · {project.year}
      </p>
    </>
  );

  if (horizontal || imageRight) {
    const imageCol = (
      <div
        className={isMobile ? "w-full order-first" : ""}
        style={isMobile ? undefined : { width: "65%", flexShrink: 0 }}
      >
        <CardMedia project={project} hovered={hovered} aspectRatio={aspectRatio} />
      </div>
    );

    // ── Editorial text column for hero rows ──
    // On desktop: bottom-anchored with text at image baseline.
    // On mobile: natural block flow, no anchor padding.
    const textCol = (
      <div
        className={`flex flex-col flex-1 min-w-0 ${isMobile ? "" : "justify-end"}`}
        style={isMobile ? undefined : { paddingBottom: "48px" }}
      >
        <div style={isMobile ? undefined : { maxWidth: "380px" }}>
          {tagChip()}
          {/* Level 1 — Title */}
          <h3
            className="tracking-tight font-semibold leading-none transition-colors duration-300"
            style={{
              fontSize: isMobile ? "clamp(1.4rem, 5vw, 1.8rem)" : "clamp(1.6rem, 2.2vw, 2.4rem)",
              letterSpacing: "-0.03em",
              marginBottom: "1rem",
              color: hovered ? "hsl(var(--color-text-primary))" : "hsl(var(--color-text-primary) / 0.9)",
            }}
          >
            {project.title}
          </h3>

          {/* Levels 2 + 3 — Signal + description */}
          <div style={{ marginBottom: isMobile ? "1rem" : "1.375rem" }}>
            {project.signal && (
              <p
                className="font-medium leading-snug transition-colors duration-300"
                style={{
                  fontSize: isMobile ? "0.875rem" : "0.9375rem",
                  letterSpacing: "-0.01em",
                  marginBottom: "0.5rem",
                  color: hovered ? "hsl(var(--color-text-primary))" : "hsl(var(--color-text-primary) / 0.75)",
                }}
              >
                {project.signal}
              </p>
            )}
            <p
              className="leading-relaxed"
              style={{
                fontSize: "0.875rem",
                color: hovered ? "hsl(var(--color-text-primary) / 0.90)" : "hsl(var(--color-text-primary) / 0.72)",
              }}
            >
              {project.description}
            </p>
          </div>

          {/* Level 4 — Metadata */}
          <p
            style={{
              fontSize: isMobile ? "0.9375rem" : "0.875rem",
              letterSpacing: "0.02em",
              color: "hsl(var(--color-text-primary) / 0.72)",
            }}
          >
            {metadataLabel ?? project.role} · {project.year}
          </p>
        </div>
      </div>
    );

    return (
      <motion.div
        ref={ref}
        id={projectId ? `project-${projectId}` : undefined}
        initial={{ opacity: 0, scale: 0.94, y: 40 }}
        animate={{ opacity: revealed ? 1 : 0, scale: revealed ? 1 : 0.94, y: revealed ? 0 : 40 }}
        transition={{
          duration: 0.75,
          ease: [0.16, 1, 0.3, 1],
          delay: rowDelay + globalIndex * 0.1,
          opacity: { duration: 0.5, ease: "easeOut", delay: rowDelay + globalIndex * 0.1 },
        }}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        data-clickable={isWip ? undefined : "true"}
        {...arrivalProps}
      >
        <CardLink
          isWip={isWip}
          externalUrl={project.externalUrl}
          projectId={projectId}
          focusRing={focusRing}
          className={`${cursorClass} group flex items-stretch ${isMobile ? "flex-col gap-6" : "flex-row gap-10"}`}
        >
          {imageRight ? textCol : imageCol}
          {imageRight ? imageCol : textCol}
        </CardLink>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      id={projectId ? `project-${projectId}` : undefined}
      initial={{ opacity: 0, scale: 0.94, y: 40 }}
      animate={{ opacity: revealed ? 1 : 0, scale: revealed ? 1 : 0.94, y: revealed ? 0 : 40 }}
      transition={{
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1],
        delay: rowDelay + globalIndex * 0.1,
        opacity: { duration: 0.5, ease: "easeOut", delay: rowDelay + globalIndex * 0.1 },
      }}
      style={maxWidth ? { maxWidth } : undefined}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      data-clickable={isWip ? undefined : "true"}
      {...arrivalProps}
    >
      <CardLink
        isWip={isWip}
        externalUrl={project.externalUrl}
        projectId={projectId}
        focusRing={focusRing}
        className={`${cursorClass} group flex flex-col`}
      >
        <CardMedia project={project} hovered={hovered} aspectRatio={aspectRatio} />
        <div className="flex flex-col">{textBlock()}</div>
      </CardLink>
    </motion.div>
  );
};

// ─── Parallax wrapper for each grid card ─────────────────────────────────────
// Right column travels faster than left — creates the depth rhythm of Clay/Shopify.
const TwoColCard = ({
  project,
  index,
  dotClass,
  startGlobalIndex,
  aiVariant,
}: {
  project: Project;
  index: number;
  dotClass: string;
  startGlobalIndex: number;
  aiVariant: boolean;
}) => {
  const isMobile = useIsMobile();
  const wrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start end", "end start"],
  });
  const isRight = index % 2 === 1;
  const parallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    isRight
      ? (isMobile ? ["10px", "-10px"] : ["48px", "-48px"])
      : (isMobile ? ["4px", "-4px"] : ["20px", "-20px"])
  );

  return (
    <motion.div
      ref={wrapRef}
      style={{ marginTop: isMobile ? 0 : getGridMarginTop(index), y: parallaxY }}
    >
      <ProjectCard
        project={project}
        projectId={project.id}
        dotClass={dotClass}
        globalIndex={startGlobalIndex + index}
        rowDelay={(index % 2) * 0.06}
        metadataLabel={
          aiVariant && project.builtWith
            ? `Built with ${project.builtWith}`
            : undefined
        }
      />
    </motion.div>
  );
};

// ─── 2-col dynamic grid ───────────────────────────────────────────────────────
const TwoColGrid = ({
  projects,
  dotClass,
  startGlobalIndex = 0,
  aiVariant = false,
}: {
  projects: Project[];
  dotClass: string;
  startGlobalIndex?: number;
  aiVariant?: boolean;
}) => (
  <div className="project-grid">
    {projects.map((p, i) => (
      <TwoColCard
        key={p.id ?? p.title}
        project={p}
        index={i}
        dotClass={dotClass}
        startGlobalIndex={startGlobalIndex}
        aiVariant={aiVariant}
      />
    ))}
  </div>
);

// ─── Section label ────────────────────────────────────────────────────────────
// Both variants render the same white uppercase label and the same dot size.
// "primary" (Selected Work) keeps a brighter dot, "secondary" (Workshop) a
// fainter one; the dot color (red / gold) is passed in via dotClass.
const SectionLabel = ({
  title,
  dotClass,
  variant = "primary",
}: {
  title: string;
  dotClass: string;
  variant?: "primary" | "secondary";
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const isPrimary = variant === "primary";
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 16 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center gap-3 mb-10"
    >
      <span
        className={`rounded-full ${dotClass} w-1.5 h-1.5 ${isPrimary ? "opacity-70" : "opacity-35"}`}
      />
      <span className="text-sm text-foreground uppercase tracking-eyebrow font-medium">
        {title}
      </span>
    </motion.div>
  );
};

// ─── Main project list ────────────────────────────────────────────────────────
// Tier 1: Moti + Aura + Neuralyfe as full-width heroes.
// Tier 2: All remaining projects in the 2-col dynamic grid.
const MainProjectList = ({
  id,
  sectionTitle,
  dotClass,
  projects,
}: {
  id: string;
  sectionTitle: string;
  dotClass: string;
  projects: Project[];
}) => {
  const heroMoti = projects[0]; // Moti (placeholder clone of NeuraLyfe)
  const hero1    = projects[1]; // Aura
  const hero2    = projects[2]; // Neuralyfe
  const gridPro  = projects.slice(3); // FlowPrint, Mood Muse, …

  return (
    <section id={id} className="px-6 md:px-16 lg:px-24 pt-16">
      <SectionLabel title={sectionTitle} dotClass={dotClass} variant="primary" />

      {/* ── Hero 0: Moti (styled exactly like NeuraLyfe — image right) ── */}
      {heroMoti && (
        <div className="mb-14 md:mb-16">
          <ProjectCard
            project={heroMoti}
            projectId={heroMoti.id}
            dotClass={dotClass}
            globalIndex={0}
            rowDelay={0.06}
            imageRight
          />
        </div>
      )}

      {/* ── Hero 1: Aura ── */}
      {hero1 && (
        <div className="mb-14 md:mb-16">
          <ProjectCard
            project={hero1}
            projectId={hero1.id}
            dotClass={dotClass}
            globalIndex={1}
            horizontal
          />
        </div>
      )}

      {/* ── Hero 2: Neuralyfe ── */}
      {hero2 && (
        <div className="mb-14 md:mb-16">
          <ProjectCard
            project={hero2}
            projectId={hero2.id}
            dotClass={dotClass}
            globalIndex={2}
            rowDelay={0.06}
            imageRight
          />
        </div>
      )}

      {/* ── Grid: remaining projects ── */}
      {gridPro.length > 0 && (
        <div className="mt-12 md:mt-24 pb-10">
          <TwoColGrid
            projects={gridPro}
            dotClass={dotClass}
            startGlobalIndex={3}
          />
        </div>
      )}
    </section>
  );
};

// ─── AI project list ──────────────────────────────────────────────────────────
// Projects flagged `sectionHero` render as full-width rows above the grid; the
// rest keep the uniform 2-col "gallery" treatment. The 0.88 dimming wraps the
// grid only — a hero row reads at full strength, which is the point of promoting
// it out of the gallery in the first place.
const AIProjectList = ({
  id,
  sectionTitle,
  dotClass,
  projects,
}: {
  id: string;
  sectionTitle: string;
  dotClass: string;
  projects: Project[];
}) => {
  const heroes = projects.filter((p) => p.sectionHero);
  const gridProjects = projects.filter((p) => !p.sectionHero);

  return (
    <section id={id} className="px-6 md:px-16 lg:px-24 pt-16 md:pt-20 pb-8">
      <SectionLabel title={sectionTitle} dotClass={dotClass} variant="secondary" />

      {heroes.map((p, i) => (
        <div key={p.id ?? p.title} className="mb-14 md:mb-16">
          <ProjectCard
            project={p}
            projectId={p.id}
            dotClass={dotClass}
            globalIndex={i}
            rowDelay={0.06}
            horizontal
          />
        </div>
      ))}

      {gridProjects.length > 0 && (
        <div style={{ opacity: 0.88 }}>
          <TwoColGrid
            projects={gridProjects}
            dotClass={dotClass}
            startGlobalIndex={heroes.length}
            aiVariant
          />
        </div>
      )}
    </section>
  );
};

// ─── Public component ─────────────────────────────────────────────────────────
const ProjectList = ({
  id,
  sectionTitle,
  sectionSubtitle: _unused,
  dotColor,
  projects,
  variant = "main",
}: ProjectListProps) => {
  const dotClass = dotColor === "red" ? "bg-dot-red" : "bg-dot-gold";

  if (variant === "ai") {
    return (
      <AIProjectList
        id={id}
        sectionTitle={sectionTitle}
        dotClass={dotClass}
        projects={projects}
      />
    );
  }

  return (
    <MainProjectList
      id={id}
      sectionTitle={sectionTitle}
      dotClass={dotClass}
      projects={projects}
    />
  );
};

export default ProjectList;
