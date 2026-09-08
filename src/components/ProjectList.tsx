import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useIsMobile } from "@/hooks/useIsMobile";
import { noOrphan } from "@/lib/noOrphan";
import { SECTIONS, type SectionKey } from "@/lib/sections";
import {
  MAX_SKILLS,
  STUDIO_GROUPS,
  type ProjectDestination,
  type ProjectLink,
  type Skill,
  type StudioGroupKey,
} from "@/data/projects";
import { ArrowUpRight, Play } from "lucide-react";
import { Chip, ChipButton, LinkChip } from "./ui/Chip";
import { VideoLightbox, type LightboxVideo } from "./VideoLightbox";
import { useLens } from "./Lens";
import { lensMatch } from "@/lib/lens";
import { DURATION, EASE, MOTION } from "@/design-system/system/motion";

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
  /** Studio only: which group's grid the tile belongs in. */
  studioGroup?: StudioGroupKey;
}

interface ProjectListProps {
  section: SectionKey;
  projects: ProjectCardData[];
  /** The Studio page draws its own heading above the grid, so it hides the eyebrow. */
  showLabel?: boolean;
  /** Selected Work only: something set between the eyebrow and the first row
   *  (the skill lens row). */
  intro?: ReactNode;
  /** Studio only: something rendered under a group's grid, keyed by the group
   *  (the GitHub strip closes the software group). */
  trailing?: Partial<Record<StudioGroupKey, ReactNode>>;
}


// ─── Helpers ──────────────────────────────────────────────────────────────────

// Studio tiles and the More Work grid share one cover box. The source files
// keep their own ratios (coverAspect / coverAspect.test.ts); object-cover
// crops them into this frame so a row of cards lines up. Selected Work hero
// rows do not use it — they stay at each cover's own shape.
const GRID_COVER_ASPECT = "16/9";

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
  // carry a `coverImage`. That still is the card's cover: the video's `poster`,
  // and a real <img> on top of the reel, because once the clip has a decoded
  // frame the browser paints that instead of the poster attribute. Hover hides
  // the still; leaving it brings it back.
  const shouldReduceMotion = useReducedMotion();
  const hasVideo = !!project.coverVideo && !shouldReduceMotion;

  // ── Cover video playback ──
  // Hover-only, and it does not loop. Arrival is not a request to watch the
  // reel; hovering is. The clip is fetched once the card is within a viewport
  // of the screen (or the pointer enters), so hover can start without waiting
  // on the download. Latched: once fetching, it stays fetched — leaving the
  // neighbourhood must never yank the src back out of a video that may already
  // have played.
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const mediaNear = useInView(mediaRef, { margin: "100% 0px 100% 0px" });
  const [fetchVideo, setFetchVideo] = useState(false);
  useEffect(() => {
    if (hasVideo && (mediaNear || hovered)) setFetchVideo(true);
  }, [hasVideo, mediaNear, hovered]);

  const playFromStart = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => {});
  }, []);

  // Play on the pointer *entering* the card, not on every render where it
  // happens to already be inside — otherwise a re-render mid-reel restarts it.
  // Leaving pauses and rewinds; the still on top is what the visitor sees.
  const wasHovered = useRef(false);
  useEffect(() => {
    const entered = hovered && !wasHovered.current;
    const left = !hovered && wasHovered.current;
    wasHovered.current = hovered;
    if (!hasVideo) return;
    if (entered) {
      playFromStart();
      return;
    }
    if (left) {
      const video = videoRef.current;
      if (!video) return;
      video.pause();
      video.currentTime = 0;
    }
  }, [hovered, hasVideo, playFromStart]);

  const liftStyle = {
    transform: hovered ? "scale(1.03)" : "scale(1)",
    transition: "transform 0.9s cubic-bezier(0.22,1,0.36,1)",
  };

  return (
    <div
      ref={mediaRef}
      className={`overflow-hidden rounded-2xl bg-project-card-surface relative w-full ${marginClass}`}
      style={reservedAspect ? { aspectRatio: reservedAspect } : undefined}
    >
      {hasVideo ? (
        <>
          <video
            ref={videoRef}
            src={fetchVideo ? project.coverVideo : undefined}
            poster={project.coverImage}
            muted playsInline preload="auto"
            className={mediaClass}
            style={liftStyle}
          />
          {project.coverImage ? (
            <img
              src={project.coverImage}
              alt=""
              aria-hidden="true"
              className={`${mediaClass} pointer-events-none absolute inset-0`}
              style={{
                ...liftStyle,
                opacity: hovered ? 0 : 1,
              }}
            />
          ) : null}
        </>
      ) : project.coverImage ? (
        <img
          src={project.coverImage}
          alt={project.title}
          loading="lazy"
          decoding="async"
          className={mediaClass}
          style={liftStyle}
        />
      ) : (
        <div className="w-full aspect-video flex items-center justify-center">
          <span className="text-foreground-tertiary text-caption uppercase tracking-eyebrow">
            No image
          </span>
        </div>
      )}
      <motion.div
        className="absolute inset-0 bg-project-card-hover-overlay pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={MOTION.fade}
      />
      {cornerGlyph ? (
        <span
          aria-hidden="true"
          className="absolute left-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-hairline bg-background/75 leading-none text-foreground-secondary backdrop-blur-sm"
        >
          {cornerGlyph}
        </span>
      ) : null}
    </div>
  );
};

// ─── Chips ────────────────────────────────────────────────────────────────────
// Rendered in the metadata line after role and year, never above the title.
// Skill chips rest as passive, low-contrast labels; the outbound LinkChip (see
// Chip.tsx) is the one that has to read as clickable at a glance.
//
// Inside a LensProvider (the homepage and Studio) every skill chip is also the
// lens control: pressing it holds that skill up against the whole page, and the
// pressed one takes the link material so the active lens is visible on every
// card that carries it. Outside a provider (the Next up strip, the specimens)
// the chip is the plain label it always was.
const SkillChip = ({ skill }: { skill: Skill }) => {
  const lens = useLens();
  if (!lens) return <Chip>{skill}</Chip>;
  const pressed = lens.lens === skill;
  return (
    <ChipButton
      pressed={pressed}
      onPress={() => lens.toggle(skill)}
      title={pressed ? "Clear lens" : `See every project with ${skill}`}
    >
      {skill}
    </ChipButton>
  );
};

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
    color: "hsl(var(--color-text-secondary))",
  };
  const linkChips = links.map((link) => <LinkChip key={link.url} link={link} />);
  const statusChip = project.destination?.kind === "placeholder" ? <Chip>Coming soon</Chip> : null;
  const skillChips = skills.map((skill) => <SkillChip key={skill} skill={skill} />);

  // Tiles: one line, links then skills then the year.
  if (tile) {
    return (
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
        {linkChips}
        {statusChip}
        {skillChips}
        <span style={textStyle}>{project.year}</span>
      </div>
    );
  }

  // Case-study cards: two rows. The facts on the first — role · year, and the
  // shipped chip beside them, since "on the App Store" is a fact of the same
  // kind — and the skills on the second. When everything shared one wrapping
  // line, a long role such as "Industrial Design Lead · Sole UX Designer · 2024"
  // pushed the chips around until one landed alone on a third line under a run
  // of text. As a row of their own the skills wrap as a group, and the ragged
  // edge they make is a tag row's, not an orphan's. Three chips fit the hero
  // rows' 380px text column, four did not, which is why the link chip moved up.
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
        <span style={textStyle}>
          {project.role} · {project.year}
        </span>
        {linkChips}
        {statusChip}
      </div>
      {skillChips.length > 0 ? (
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1.5">{skillChips}</div>
      ) : null}
    </div>
  );
};

// ─── Card link ────────────────────────────────────────────────────────────────
// A stretched link: an absolutely positioned anchor that covers the whole card
// (z-1) so the entire tile is the click target, while the card's content stays
// outside it. That is what lets the metadata line carry real outbound anchors
// (LinkChip, z-2) without nesting <a> inside <a>. It is keyboard-focusable and
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
    "absolute inset-0 z-1 cursor-pointer rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-strong focus-visible:ring-offset-4 focus-visible:ring-offset-background";
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
  restOpacity = 1,
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
  /** Studio tile: 16/9 cover, one step smaller type, tile metadata order. */
  tile?: boolean;
  /** The card's brightness at rest, as a CSS opacity value. More Work sits a
   *  step under Selected Work (the rest-dim token); everything else is 1. */
  restOpacity?: number | string;
  onOpenVideo?: (video: LightboxVideo) => void;
}) => {
  const [hovered, setHovered] = useState(false);
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -80px 0px" });

  // ── Skill lens ──
  // One computed brightness for the card body, so the section's resting dim and
  // the lens never stack: a match under a lens is lifted to full, anything else
  // recedes to the lens-dim token, and with no lens the card sits at its rest
  // level. Hover brings any card back to full while the pointer is on it. This
  // is an inner wrapper with a CSS transition, separate from the entrance
  // animation on the outer motion.div, so a lens change answers in one beat
  // instead of replaying the staggered reveal.
  const match = lensMatch(project.skills, useLens()?.lens ?? null);
  const bodyOpacity =
    hovered || match === true
      ? 1
      : match === false
        ? "var(--component-project-card-lens-dim)"
        : restOpacity;
  const bodyProps = {
    className: "transition-opacity duration-medium ease-settle",
    style: { opacity: bodyOpacity },
    "data-lens": match === null ? undefined : match ? "match" : "dim",
  };

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
        className="tracking-tight font-semibold leading-snug transition-colors duration-medium"
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
          color: "hsl(var(--color-text-secondary))",
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
            className="tracking-tight font-semibold leading-none transition-colors duration-medium"
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
                className="font-medium leading-snug transition-colors duration-medium"
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
                color: hovered ? "hsl(var(--color-text-primary) / 0.90)" : "hsl(var(--color-text-secondary))",
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
          duration: DURATION.reveal,
          ease: EASE.enter,
          delay: rowDelay + globalIndex * 0.1,
          opacity: { duration: DURATION.slow, ease: EASE.settle, delay: rowDelay + globalIndex * 0.1 },
        }}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        data-clickable={project.destination?.kind === "placeholder" ? "false" : "true"}
        {...arrivalProps}
      >
        <div
          {...bodyProps}
          className={`${bodyProps.className} flex items-stretch ${isMobile ? "flex-col gap-6" : "flex-row gap-10"}`}
        >
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
        duration: DURATION.reveal,
        ease: EASE.enter,
        delay: rowDelay + globalIndex * 0.1,
        opacity: { duration: DURATION.slow, ease: EASE.settle, delay: rowDelay + globalIndex * 0.1 },
      }}
      style={maxWidth ? { maxWidth } : undefined}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      data-clickable={project.destination?.kind === "placeholder" ? "false" : "true"}
      {...arrivalProps}
    >
      <div {...bodyProps} className={`${bodyProps.className} flex flex-col`}>
        <CardMedia
          project={project}
          hovered={hovered}
          aspectRatio={tile ? GRID_COVER_ASPECT : aspectRatio}
          cornerGlyph={tile ? cornerGlyphFor(project.destination) : undefined}
          marginClass={tile ? "mb-4" : "mb-6"}
        />
        <div className="flex flex-col">{textBlock()}</div>
      </div>
      {cardLink}
    </motion.div>
  );
};

// ─── 2-col grid ───────────────────────────────────────────────────────────────
// Uniform 16/9 covers, no stagger, no parallax — a neat pair of columns.
const TwoColGrid = ({
  projects,
  dotClass,
  startGlobalIndex = 0,
  restOpacity,
}: {
  projects: ProjectCardData[];
  dotClass: string;
  startGlobalIndex?: number;
  restOpacity?: number | string;
}) => (
  <div className="project-grid">
    {projects.map((p, i) => (
      <ProjectCard
        key={p.id ?? p.title}
        project={p}
        projectId={p.id}
        dotClass={dotClass}
        globalIndex={startGlobalIndex + i}
        rowDelay={(i % 2) * 0.06}
        aspectRatio={GRID_COVER_ASPECT}
        restOpacity={restOpacity}
      />
    ))}
  </div>
);

// ─── Section label ────────────────────────────────────────────────────────────
// Both variants render the same white uppercase label and the same dot size.
// "primary" (Selected Work) keeps a brighter dot, "secondary" (More Work and
// Studio) a fainter one; the dot color (red / gold) is passed in via dotClass.
// `blurb` adds one line under the label; the Studio groups use it to say what
// each half of the page is. `as="h2"` when the label heads a region of its own.
export const SectionLabel = ({
  title,
  dotClass,
  variant = "primary",
  blurb,
  as: Tag = "span",
  id,
}: {
  title: string;
  dotClass: string;
  variant?: "primary" | "secondary";
  blurb?: string;
  as?: "span" | "h2";
  id?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const isPrimary = variant === "primary";
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 16 }}
      transition={MOTION.enter}
      className="mb-10"
    >
      <div className="flex items-center gap-3">
        <span
          className={`rounded-full ${dotClass} w-1.5 h-1.5 ${isPrimary ? "opacity-70" : "opacity-35"}`}
        />
        <Tag id={id} className="text-sm text-foreground uppercase tracking-eyebrow font-medium">
          {title}
        </Tag>
      </div>
      {blurb ? (
        <p className="mt-caption text-sm md:text-base leading-relaxed text-foreground-secondary max-w-reading">
          {noOrphan(blurb)}
        </p>
      ) : null}
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
  intro,
}: {
  id: string;
  sectionTitle: string;
  dotClass: string;
  projects: ProjectCardData[];
  intro?: ReactNode;
}) => (
  <section id={id} className="px-6 md:px-16 lg:px-24 pt-16">
    <SectionLabel title={sectionTitle} dotClass={dotClass} variant="primary" />
    {/* The eyebrow carries mb-10; the intro pulls up to sit 16px under it and
        restores the 40px above the first row. */}
    {intro ? <div className="-mt-6 mb-10">{intro}</div> : null}
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
// A uniform 2-col grid of 16/9 covers, each card resting at the rest-dim token
// (0.88). No hero rows, no signal line: the hierarchy is carried by density and
// brightness, not by promoting anything. The dim is set per card rather than on
// a wrapper so the skill lens can lift a match here to full brightness without
// the two opacities stacking.
const MORE_WORK_REST_OPACITY = "var(--component-project-card-rest-dim)";

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
  <section id={id} className="px-6 md:px-16 lg:px-24 pt-section pb-8">
    <SectionLabel title={sectionTitle} dotClass={dotClass} variant="secondary" />
    {projects.length > 0 && (
      <TwoColGrid projects={projects} dotClass={dotClass} restOpacity={MORE_WORK_REST_OPACITY} />
    )}
  </section>
);

// ─── Studio ───────────────────────────────────────────────────────────────────
// A denser tile grid that reads as a different kind of thing without a label:
// 3 columns on desktop, 2 on mobile, 16/9 covers, no stagger, no parallax.
// It is dimmed by size and type only — no opacity layer, which would look
// muddy over the hover video.
//
// The tiles are split into the STUDIO_GROUPS (the software, then the industrial design),
// each under its own eyebrow and one-line blurb. The entrance stagger restarts
// per group, so the second grid does not wait on the first one's delays. A tile
// with no group is not dropped: it lands in an unlabelled grid at the end.
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
  trailing?: Partial<Record<StudioGroupKey, ReactNode>>;
}) => {
  const [video, setVideo] = useState<LightboxVideo | null>(null);
  const closeVideo = useCallback(() => setVideo(null), []);

  const groups = STUDIO_GROUPS.map((group) => ({
    ...group,
    projects: projects.filter((p) => p.studioGroup === group.key),
    trailing: trailing?.[group.key],
  })).filter((group) => group.projects.length > 0 || group.trailing);
  const ungrouped = projects.filter((p) => !p.studioGroup);

  const renderGrid = (list: ProjectCardData[]) => (
    <div className="studio-grid">
      {list.map((p, i) => (
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
    </div>
  );

  return (
    <section id={id} className={`px-6 md:px-16 lg:px-24 pb-8 ${showLabel ? "pt-section" : ""}`}>
      {showLabel ? <SectionLabel title={sectionTitle} dotClass={dotClass} variant="secondary" /> : null}
      {groups.map((group, i) => (
        <div
          key={group.key}
          className={i > 0 ? "mt-section" : undefined}
          data-studio-group={group.key}
          aria-labelledby={`studio-group-${group.key}`}
          role="region"
        >
          <SectionLabel
            id={`studio-group-${group.key}`}
            as="h2"
            title={group.label}
            blurb={group.blurb}
            dotClass={dotClass}
            variant="secondary"
          />
          {group.projects.length > 0 ? renderGrid(group.projects) : null}
          {group.trailing}
        </div>
      ))}
      {ungrouped.length > 0 ? (
        <div className={groups.length > 0 ? "mt-section" : undefined}>{renderGrid(ungrouped)}</div>
      ) : null}
      <VideoLightbox video={video} onClose={closeVideo} />
    </section>
  );
};

// ─── Public component ─────────────────────────────────────────────────────────
// The section's DOM id, eyebrow and layout variant all come from SECTIONS.
const ProjectList = ({ section, projects, showLabel = true, trailing, intro }: ProjectListProps) => {
  const { id, label } = SECTIONS[section];
  const dotClass = section === "selected" ? "bg-dot-red" : "bg-dot-gold";

  if (section === "selected") {
    return (
      <SelectedWorkList id={id} sectionTitle={label} dotClass={dotClass} projects={projects} intro={intro} />
    );
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
