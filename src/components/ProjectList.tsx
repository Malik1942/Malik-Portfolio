import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useIsMobile } from "@/hooks/useIsMobile";
import { noOrphan } from "@/lib/noOrphan";
import { SECTIONS, type SectionKey } from "@/lib/sections";
import { MAX_SKILLS, type ProjectDestination, type ProjectLink, type Skill } from "@/data/projects";
import { ArrowUpRight, Play } from "lucide-react";
import { LinkChip } from "./LinkChip";
import { VideoLightbox, type LightboxVideo } from "./VideoLightbox";

/** What a card needs to render. `Project` in src/data/projects.ts is the strict
 *  homepage record and is assignable to this; tests pass minimal literals. */
export interface ProjectCardData {
  id?: string;
  title: string;
  description: string;
  signal?: string;
  role: string;
  year: string;
  coverImage?: string;
  coverVideo?: string;
  coverFit?: "cover" | "contain";
  /** The cover media's own intrinsic ratio, as "W/H" (e.g. "1600/1000").
   *  Reserves the card's media box before the image or video has loaded, so the
   *  page does not grow underneath a project-dot scroll that is already in
   *  flight. Must match the asset — `coverAspect.test.ts` reads the real files
   *  and fails if a cover is swapped without updating this. */
  coverAspect?: string;
  details?: string;
  /** Skill chips, rendered after role and year. At most MAX_SKILLS. */
  skills?: Skill[];
  /** Outbound "shipped" chips (App Store / GitHub / Live). */
  links?: ProjectLink[];
  /** Defaults to a case-study route when the card has an id. */
  destination?: ProjectDestination;
}

interface ProjectListProps {
  section: SectionKey;
  projects: ProjectCardData[];
  /** The Studio page draws its own heading above the grid, so it hides the eyebrow. */
  showLabel?: boolean;
  /** Studio only: rendered after the last tile, inside the grid (the GitHub tile). */
  trailing?: ReactNode;
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
  cornerGlyph,
  marginClass = "mb-6",
}: {
  project: ProjectCardData;
  hovered: boolean;
  aspectRatio?: string;
  /** Top-left slot: a small mark for tiles that do not open a case study. */
  cornerGlyph?: ReactNode;
  marginClass?: string;
}) => {
  const forced = !!aspectRatio;
  const mediaClass = forced
    ? "w-full h-full object-cover"
    : "w-full h-auto block";

  // ── Reserved box ──
  // An <img> that has not loaded and a <video> that has no frame yet both report
  // no intrinsic size, so a card whose media is still in flight is only as tall
  // as its text. Every card on the page is in that state on a cold load, and the
  // page grows by ~300px as the covers arrive.
  //
  // That growth is why clicking a project dot could land you on the *previous*
  // project: the hero computes where to scroll from the page as it stands, the
  // covers above the target finish loading mid-flight, and the card slides down
  // out from under the landing. Declaring the cover's own ratio here reserves the
  // final height from the first frame, so the page the scroll was aimed at is the
  // page it arrives on. `coverAspect` is the media's exact intrinsic ratio, so
  // the rendered size is unchanged — it is only known *earlier*.
  const reservedAspect = aspectRatio ?? project.coverAspect;

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

  // ── Cover video fetch ──
  // The reel is not fetched until it is plausibly about to be watched. With a
  // src on the element from mount, every page — the home page and, through the
  // "Next up" strip, every case study — pulled the ~½ MB clip during the
  // first seconds of load, competing with the fonts and images that the loading
  // screen was actually waiting on. The card paints from its poster regardless,
  // so the visitor cannot tell the difference; the clip starts downloading once
  // the card is within a viewport of the screen (or the pointer enters it),
  // which is seconds of lead before the settle delay below would let it play.
  // Latched: once fetching, it stays fetched — leaving the neighbourhood must
  // never yank the src back out of a video that has already played.
  const mediaNear = useInView(mediaRef, { margin: "100% 0px 100% 0px" });
  const [fetchVideo, setFetchVideo] = useState(false);
  useEffect(() => {
    if (hasVideo && (mediaNear || mediaInView || hovered)) setFetchVideo(true);
  }, [hasVideo, mediaNear, mediaInView, hovered]);

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
      className={`overflow-hidden rounded-2xl bg-project-card-surface relative w-full ${marginClass}`}
      style={reservedAspect ? { aspectRatio: reservedAspect } : undefined}
    >
      {hasVideo ? (
        <video
          ref={videoRef}
          src={fetchVideo ? project.coverVideo : undefined}
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
      {cornerGlyph ? (
        <span
          aria-hidden="true"
          className="absolute left-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-border/50 bg-background/75 leading-none text-foreground/72 backdrop-blur-sm"
        >
          {cornerGlyph}
        </span>
      ) : null}
    </div>
  );
};

// ─── Chips ────────────────────────────────────────────────────────────────────
// Rendered in the metadata line after role and year, never above the title.
// Skill chips are passive and low-contrast; the outbound LinkChip (see
// LinkChip.tsx) is the one that has to read as clickable.
const SkillChip = ({ skill }: { skill: Skill }) => (
  <span className="inline-flex items-center rounded-full border border-border/50 px-2 py-1 text-label uppercase tracking-eyebrow leading-none whitespace-nowrap text-foreground/60">
    {skill}
  </span>
);

// Metadata line. Case-study sections: role · year, then link chips, then up to
// three skill chips. Studio tiles: link chips first, then up to two skill
// chips, then the year (the role is the same on most tiles there).
const CardMeta = ({
  project,
  tile = false,
  isMobile,
}: {
  project: ProjectCardData;
  tile?: boolean;
  isMobile: boolean;
}) => {
  const skills = (project.skills ?? []).slice(0, tile ? 2 : MAX_SKILLS);
  const links = project.links ?? [];
  const textStyle = {
    // Tiles use the body-small token (14px); the case-study cards keep their
    // existing sizes.
    fontSize: tile ? "var(--font-size-body-small)" : isMobile ? "0.9375rem" : "0.875rem",
    letterSpacing: "0.02em",
    color: "hsl(var(--color-text-primary) / 0.72)",
  };
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
      {tile ? null : (
        <span style={textStyle}>
          {project.role} · {project.year}
        </span>
      )}
      {links.map((link) => (
        <LinkChip key={link.url} link={link} />
      ))}
      {project.destination?.kind === "placeholder" ? (
        <span className="inline-flex items-center rounded-full border border-border/50 px-2 py-1 text-label uppercase tracking-eyebrow leading-none whitespace-nowrap text-foreground/60">
          Coming soon
        </span>
      ) : null}
      {skills.map((skill) => (
        <SkillChip key={skill} skill={skill} />
      ))}
      {tile ? <span style={textStyle}>{project.year}</span> : null}
    </div>
  );
};

// ─── Card link ────────────────────────────────────────────────────────────────
// A stretched link: an absolutely positioned anchor that covers the whole card
// (z-[1]) so the entire tile is the click target, while the card's content stays
// outside it. That is what lets the metadata line carry real outbound anchors
// (LinkChip, z-[2]) without nesting <a> inside <a>. It is keyboard-focusable and
// opens like any anchor (middle-click, cmd-click, screen-reader announcement).
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
  destination,
  projectId,
  title,
  onOpenVideo,
}: {
  destination?: ProjectDestination;
  projectId?: string;
  title: string;
  onOpenVideo?: () => void;
}) => {
  const cls =
    "absolute inset-0 z-[1] cursor-pointer rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/60 focus-visible:ring-offset-4 focus-visible:ring-offset-background";
  if (destination?.kind === "placeholder") return null;
  if (destination?.kind === "external") {
    return (
      <a href={destination.url} target="_blank" rel="noopener noreferrer" aria-label={title} className={cls} />
    );
  }
  if (destination?.kind === "video") {
    return (
      <button type="button" aria-label={`Play ${title}`} onClick={onOpenVideo} className={cls} />
    );
  }
  if (projectId) {
    return <Link to={`/project/${projectId}`} aria-label={title} className={cls} />;
  }
  return null;
};

// Corner glyph for a tile, from its destination: nothing for a case study, a
// small play mark for a video, an outbound arrow for an external link.
const cornerGlyphFor = (destination?: ProjectDestination): ReactNode => {
  if (destination?.kind === "video") return <Play className="h-3 w-3" strokeWidth={2} fill="currentColor" />;
  if (destination?.kind === "external") return <ArrowUpRight className="h-3 w-3" strokeWidth={2} />;
  return null;
};

export const ProjectCard = ({
  project,
  projectId,
  dotClass: _dotClass,
  globalIndex,
  rowDelay = 0,
  aspectRatio,
  maxWidth,
  horizontal = false,
  imageRight = false,
  tile = false,
  onOpenVideo,
}: {
  project: ProjectCardData;
  projectId?: string;
  dotClass: string;
  globalIndex: number;
  rowDelay?: number;
  aspectRatio?: string;
  maxWidth?: string;
  horizontal?: boolean;
  imageRight?: boolean;
  /** Studio tile: uncropped cover, one step smaller type, tile metadata order. */
  tile?: boolean;
  onOpenVideo?: (video: LightboxVideo) => void;
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
  // Shared by both card layouts below. `relative` anchors the stretched CardLink.
  const arrivalProps = {
    className: arriving ? "relative project-row-arriving" : "relative",
    onAnimationEnd: () => setArriving(false),
  };

  const handleEnter = () => setHovered(true);
  const handleLeave = () => setHovered(false);

  const openVideo = () => {
    if (project.destination?.kind !== "video" || !onOpenVideo) return;
    onOpenVideo({
      src: project.destination.src,
      poster: project.destination.poster,
      title: project.title,
      caption: project.description,
      links: project.links,
    });
  };

  const cardLink = (
    <CardLink
      destination={project.destination}
      projectId={projectId}
      title={project.title}
      onOpenVideo={openVideo}
    />
  );

  // ── Vertical card text (grid cards and tiles) ──
  const textBlock = () => (
    <>
      {/* Title */}
      <h3
        className="tracking-tight font-semibold leading-snug transition-colors duration-300"
        style={{
          // Tile: body on mobile, body-large on desktop (one token step under
          // the grid cards' title).
          fontSize: tile
            ? isMobile ? "var(--font-size-body)" : "var(--font-size-body-large)"
            : isMobile ? "clamp(1.1rem, 4vw, 1.25rem)" : "clamp(1.2rem, 1.6vw, 1.4rem)",
          letterSpacing: "-0.025em",
          marginBottom: tile ? "0.25rem" : isMobile ? "0.5rem" : "0.3rem",
          color: hovered ? "hsl(var(--color-text-primary))" : "hsl(var(--color-text-primary) / 0.88)",
        }}
      >
        {project.title}
      </h3>

      {/* Description */}
      <p
        className={isMobile ? "leading-relaxed line-clamp-2" : "leading-snug line-clamp-2"}
        style={{
          fontSize: tile ? "var(--font-size-body-small)" : isMobile ? "0.9375rem" : "0.875rem",
          marginBottom: tile ? "0.625rem" : isMobile ? "0.75rem" : "1rem",
          color: "hsl(var(--color-text-primary) / 0.80)",
        }}
      >
        {noOrphan(project.description)}
      </p>

      {/* Metadata */}
      <CardMeta project={project} tile={tile} isMobile={isMobile} />
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
          <CardMeta project={project} isMobile={isMobile} />
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
        data-clickable={project.destination?.kind === "placeholder" ? "false" : "true"}
        {...arrivalProps}
      >
        <div className={`flex items-stretch ${isMobile ? "flex-col gap-6" : "flex-row gap-10"}`}>
          {imageRight ? textCol : imageCol}
          {imageRight ? imageCol : textCol}
        </div>
        {cardLink}
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
      data-clickable={project.destination?.kind === "placeholder" ? "false" : "true"}
      {...arrivalProps}
    >
      <div className="flex flex-col">
        <CardMedia
          project={project}
          hovered={hovered}
          // A tile shows its cover whole, at the asset's own ratio (coverAspect),
          // rather than cropping into a uniform box; the covers are all near 16:9.
          aspectRatio={tile ? undefined : aspectRatio}
          cornerGlyph={tile ? cornerGlyphFor(project.destination) : undefined}
          marginClass={tile ? "mb-4" : "mb-6"}
        />
        <div className="flex flex-col">{textBlock()}</div>
      </div>
      {cardLink}
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
}: {
  project: ProjectCardData;
  index: number;
  dotClass: string;
  startGlobalIndex: number;
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
      />
    </motion.div>
  );
};

// ─── 2-col dynamic grid ───────────────────────────────────────────────────────
// Alternating aspect, right-column stagger and parallax: the case-study rhythm.
const TwoColGrid = ({
  projects,
  dotClass,
  startGlobalIndex = 0,
}: {
  projects: ProjectCardData[];
  dotClass: string;
  startGlobalIndex?: number;
}) => (
  <div className="project-grid">
    {projects.map((p, i) => (
      <TwoColCard
        key={p.id ?? p.title}
        project={p}
        index={i}
        dotClass={dotClass}
        startGlobalIndex={startGlobalIndex}
      />
    ))}
  </div>
);

// ─── Section label ────────────────────────────────────────────────────────────
// Both variants render the same white uppercase label and the same dot size.
// "primary" (Selected Work) keeps a brighter dot, "secondary" (More Work and
// Studio) a fainter one; the dot color (red / gold) is passed in via dotClass.
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

// ─── Selected Work ────────────────────────────────────────────────────────────
// Every project is a full-width editorial row (image side alternating, signal
// line, description, metadata). No grid tail; the section stays bright.
const SelectedWorkList = ({
  id,
  sectionTitle,
  dotClass,
  projects,
}: {
  id: string;
  sectionTitle: string;
  dotClass: string;
  projects: ProjectCardData[];
}) => (
  <section id={id} className="px-6 md:px-16 lg:px-24 pt-16">
    <SectionLabel title={sectionTitle} dotClass={dotClass} variant="primary" />
    {projects.map((p, i) => (
      <div key={p.id ?? p.title} className="mb-14 md:mb-16">
        <ProjectCard
          project={p}
          projectId={p.id}
          dotClass={dotClass}
          globalIndex={i}
          rowDelay={i % 2 === 0 ? 0.06 : 0}
          imageRight={i % 2 === 0}
          horizontal={i % 2 === 1}
        />
      </div>
    ))}
  </section>
);

// ─── More Work ────────────────────────────────────────────────────────────────
// A uniform 2-col grid with the case-study rhythm (alternating aspect, stagger,
// parallax), wrapped in the 0.88 dimming. No hero rows, no signal line: the
// hierarchy is carried by density and brightness, not by promoting anything.
const MoreWorkList = ({
  id,
  sectionTitle,
  dotClass,
  projects,
}: {
  id: string;
  sectionTitle: string;
  dotClass: string;
  projects: ProjectCardData[];
}) => (
  <section id={id} className="px-6 md:px-16 lg:px-24 pt-16 md:pt-20 pb-8">
    <SectionLabel title={sectionTitle} dotClass={dotClass} variant="secondary" />
    {projects.length > 0 && (
      <div style={{ opacity: 0.88 }}>
        <TwoColGrid projects={projects} dotClass={dotClass} />
      </div>
    )}
  </section>
);

// ─── Studio ───────────────────────────────────────────────────────────────────
// A denser tile grid that reads as a different kind of thing without a label:
// 3 columns on desktop, 2 on mobile, uncropped covers, no stagger, no parallax,
// no alternating aspect (those rhythms are reserved for the case-study
// sections). It is dimmed by size and type only — no opacity layer, which
// would look muddy over the hover video.
const StudioList = ({
  id,
  sectionTitle,
  dotClass,
  projects,
  showLabel,
  trailing,
}: {
  id: string;
  sectionTitle: string;
  dotClass: string;
  projects: ProjectCardData[];
  showLabel: boolean;
  trailing?: ReactNode;
}) => {
  const [video, setVideo] = useState<LightboxVideo | null>(null);
  const closeVideo = useCallback(() => setVideo(null), []);
  return (
    <section id={id} className={`px-6 md:px-16 lg:px-24 pb-8 ${showLabel ? "pt-16 md:pt-20" : ""}`}>
      {showLabel ? <SectionLabel title={sectionTitle} dotClass={dotClass} variant="secondary" /> : null}
      {projects.length > 0 && (
        <div className="studio-grid">
          {projects.map((p, i) => (
            <ProjectCard
              key={p.id ?? p.title}
              project={p}
              projectId={p.id}
              dotClass={dotClass}
              globalIndex={i}
              rowDelay={(i % 3) * 0.04}
              tile
              onOpenVideo={setVideo}
            />
          ))}
          {trailing}
        </div>
      )}
      <VideoLightbox video={video} onClose={closeVideo} />
    </section>
  );
};

// ─── Public component ─────────────────────────────────────────────────────────
// The section's DOM id, eyebrow and layout variant all come from SECTIONS.
const ProjectList = ({ section, projects, showLabel = true, trailing }: ProjectListProps) => {
  const { id, label } = SECTIONS[section];
  const dotClass = section === "selected" ? "bg-dot-red" : "bg-dot-gold";

  if (section === "selected") {
    return <SelectedWorkList id={id} sectionTitle={label} dotClass={dotClass} projects={projects} />;
  }
  if (section === "more") {
    return <MoreWorkList id={id} sectionTitle={label} dotClass={dotClass} projects={projects} />;
  }
  return (
    <StudioList
      id={id}
      sectionTitle={label}
      dotClass={dotClass}
      projects={projects}
      showLabel={showLabel}
      trailing={trailing}
    />
  );
};

export default ProjectList;
