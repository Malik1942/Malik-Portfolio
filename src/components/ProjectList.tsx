import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useIsBelow, useIsMobile } from "@/hooks/useIsMobile";
import { useCanHover } from "@/hooks/useCanHover";
import { usePageLoaded } from "@/hooks/usePageLoaded";
import { useReelFocus } from "@/hooks/useReelFocus";
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
import { PAGE_COLUMN, PAGE_GUTTERS } from "@/design-system/system/layout";
import type { Transition } from "framer-motion";

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
  /** `coverImage` split in two so one element of it can animate on hover: the
   *  photograph without that element, and that element alone on transparency.
   *  See the field docs in src/data/projects.ts. Declare both or neither. */
  coverPlate?: string;
  coverMark?: string;
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
  overlay,
  marginClass = "mb-6",
}: {
  project: ProjectCardData;
  hovered: boolean;
  aspectRatio?: string;
  /** Top-left slot: a small mark for tiles that do not open a case study. */
  cornerGlyph?: ReactNode;
  /** Something laid over the whole frame, inside its rounded clip (the
   *  hover caption). Rendered above the hover tint. */
  overlay?: ReactNode;
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
  // Layered hover motion, for a cover that animates one of its own elements
  // instead of playing a reel. Reduced motion drops back to the flat cover.
  const hasMark =
    !hasVideo && !shouldReduceMotion && !!project.coverPlate && !!project.coverMark;

  // ── Cover video playback ──
  // Hover-only, and it does not loop. Arrival is not a request to watch the
  // reel; hovering is. The clip is fetched once the card is within a viewport
  // of the screen (or the pointer enters), so hover can start without waiting
  // on the download. Latched: once fetching, it stays fetched — leaving the
  // neighbourhood must never yank the src back out of a video that may already
  // have played.
  //
  // Order on the wire: a reel is megabytes and the still under it is tens of
  // kilobytes. On a cold load the first Selected Work frame is already within
  // a viewport of the screen, so fetching on approach alone put a 2.7 MB clip
  // on the wire the moment React mounted, ahead of the covers and fonts the
  // first paint was waiting on (on a 4 Mbps line it held the connection for
  // six seconds while the covers were still arriving). The approach still
  // decides which reels are fetched; the loading screen having lifted and this
  // card's own still having landed decide when. Hover skips the queue: then
  // the reel is wanted now.
  const videoRef = useRef<HTMLVideoElement>(null);
  const stillRef = useRef<HTMLImageElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const mediaNear = useInView(mediaRef, { margin: "100% 0px 100% 0px" });
  const pageLoaded = usePageLoaded();
  const [stillLoaded, setStillLoaded] = useState(!project.coverImage);
  useEffect(() => {
    // A cached still can be complete before its load event is wired up.
    const still = stillRef.current;
    if (still && still.complete && still.naturalWidth > 0) setStillLoaded(true);
  }, []);
  const [fetchVideo, setFetchVideo] = useState(false);
  useEffect(() => {
    if (hasVideo && (hovered || (mediaNear && pageLoaded && stillLoaded))) {
      setFetchVideo(true);
    }
  }, [hasVideo, mediaNear, hovered, pageLoaded, stillLoaded]);

  // ── Touch substitute for hover ──
  // A phone has no pointer to enter the card, so on a device that cannot hover
  // the reel answers to the scroll: scrolling a card into the middle of the
  // screen is the nearest thing to hovering it. Desktop is untouched: there
  // arrival is still not a request to watch, and only the pointer starts the
  // reel. Three rules keep it feeling native rather than transplanted:
  //
  // 1. One reel at a time. Of the reel cards on screen, only the one nearest
  //    the middle of the viewport plays (lib/reelFocus). The Studio grid is two
  //    across on a phone, so without this two reels run side by side.
  // 2. A reel that ends fades back to the title card. Hover is momentary, so
  //    ending on the last frame never shows; on a phone the card sits in view
  //    for a long time. It replays only after leaving the screen and returning.
  // 3. The still lifts on the video's own `playing` event, not on the trigger.
  //    Low Power Mode refuses programmatic play, and then the card must stay a
  //    plain still rather than expose whatever frame the element holds.
  const canHover = useCanHover();
  const touchPlayback = hasVideo && !canHover;
  const mediaShown = useInView(mediaRef, { amount: 0.6 });
  const focused = useReelFocus(mediaRef, touchPlayback && mediaShown);
  const [ended, setEnded] = useState(false);
  useEffect(() => {
    if (!mediaShown) setEnded(false);
  }, [mediaShown]);
  const [playing, setPlaying] = useState(false);
  const active = hovered || (touchPlayback && mediaShown && focused && !ended);
  // Desktop hides the still the instant the pointer arrives; touch waits for a
  // frame to actually be playing, and eases the still both ways.
  const stillHidden = canHover ? hovered : playing;

  const playFromStart = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => {});
  }, []);

  // Play on the pointer *entering* the card, not on every render where it
  // happens to already be inside — otherwise a re-render mid-reel restarts it.
  // Leaving pauses and rewinds; the still on top is what the visitor sees.
  const wasActive = useRef(false);
  useEffect(() => {
    const entered = active && !wasActive.current;
    const left = !active && wasActive.current;
    wasActive.current = active;
    if (!hasVideo) return;
    if (entered) {
      playFromStart();
      return;
    }
    if (left) {
      const video = videoRef.current;
      if (!video) return;
      video.pause();
      // A finished reel keeps its last frame under the returning still: a jump
      // to frame zero mid-fade would show through. The next play rewinds.
      if (!video.ended) video.currentTime = 0;
    }
  }, [active, hasVideo, playFromStart]);

  // The play request above can come before the fetch gate has opened (a hover
  // in the first second of a visit, or a phone reaching a card whose still is
  // still loading), and then it found a video with no src. Start the reel the
  // moment the src is attached, if the card is still asking for it.
  const wasFetching = useRef(false);
  useEffect(() => {
    const attached = fetchVideo && !wasFetching.current;
    wasFetching.current = fetchVideo;
    if (attached && active) playFromStart();
  }, [fetchVideo, active, playFromStart]);

  // No lift on hover. The cover used to scale up 3% while the pointer was
  // on it; with the caption now living inside the frame the picture is the
  // whole card, and a picture that swells and re-crops on hover reads as
  // the frame changing rather than as a reel starting.

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
            onPlaying={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => {
              setPlaying(false);
              if (touchPlayback) setEnded(true);
            }}
          />
          {project.coverImage ? (
            <img
              ref={stillRef}
              src={project.coverImage}
              alt=""
              aria-hidden="true"
              onLoad={() => setStillLoaded(true)}
              // A still that fails must not hold the reel back forever.
              onError={() => setStillLoaded(true)}
              className={`${mediaClass} pointer-events-none absolute inset-0 ${
                canHover ? "" : "transition-opacity duration-medium ease-settle"
              }`}
              style={{ opacity: stillHidden ? 0 : 1 }}
            />
          ) : null}
        </>
      ) : hasMark ? (
        // Hover motion without a reel: the cover, split into the photograph and
        // the wordmark that sits on it. The mark rises and fades in on hover and
        // its rule wipes out from the left, so the brand states itself when the
        // pointer arrives instead of a video having to load and play.
        //
        // Both layers are the cover's own pixels — the mark was matted out of it
        // and recomposites onto the plate exactly — so nothing is redrawn or
        // approximated, and reduced motion falls back to the flat cover below.
        <>
          <img
            src={project.coverPlate}
            alt={project.title}
            loading="lazy"
            decoding="async"
            className={mediaClass}
          />
          <motion.img
            src={project.coverMark}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className={`${mediaClass} pointer-events-none absolute inset-0`}
            initial={false}
            // Only opacity and the wipe are animated: neither layer moves, so
            // the mark stays in register with the photograph it was matted
            // out of.
            animate={{
              opacity: hovered ? 1 : 0,
              clipPath: hovered ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
            }}
            transition={{
              opacity: MOTION.fade,
              clipPath: { duration: DURATION.slow, ease: EASE.enter },
            }}
          />
        </>
      ) : project.coverImage ? (
        <img
          src={project.coverImage}
          alt={project.title}
          loading="lazy"
          decoding="async"
          className={mediaClass}
        />
      ) : (
        <div className="w-full aspect-video flex items-center justify-center">
          <span className="text-foreground-tertiary text-caption uppercase tracking-eyebrow">
            No image
          </span>
        </div>
      )}
      {/* The hover tint belongs to cards whose text sits under the cover.
          A captioned card brings its own ground with the caption, and the
          tint on top of it shifted the whole reel's tone on hover. */}
      {overlay ? null : (
        <motion.div
          className="absolute inset-0 bg-project-card-hover-overlay pointer-events-none"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={MOTION.fade}
        />
      )}
      {cornerGlyph ? (
        <span
          aria-hidden="true"
          className="absolute left-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-hairline bg-background/75 leading-none text-foreground-secondary backdrop-blur-sm"
        >
          {cornerGlyph}
        </span>
      ) : null}
      {overlay}
    </div>
  );
};

// The hover caption sits on the page canvas rising from the bottom of the
// frame, and under the type the cover is pulled out of focus. Both ramps are
// eased, not linear: a straight gradient has a visible edge where it starts
// and a kink wherever its slope changes, and the eye reads that line on a
// photograph. A sine-eased ramp reaches zero slope at both ends, so the
// fade has no top edge and the blur has no seam where it begins. The layers
// keep a fixed height and only their strength animates; an earlier version
// grew the fade's height between stages, which stretched the ramp and sent
// its edge sliding up the picture. (The reference here is the way a
// foldable's unfold keeps the content locked in space while a gradient and
// a depth-of-field pull bring the new surface in: the picture never moves,
// the ground arrives around it.) Written inline because the alphas are
// tuned to photographs, not steps on a scale; the mask's stops use the
// canvas token only for its alpha.
const CANVAS = "var(--color-background-canvas)";
const sineInOut = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
/** A bottom-to-top gradient of the canvas at `peak` alpha, easing to clear. */
const easedRamp = (peak: number, steps = 12) =>
  `linear-gradient(to top, ${Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    const alpha = peak * (1 - sineInOut(t));
    return `hsl(${CANVAS} / ${alpha.toFixed(3)}) ${(t * 100).toFixed(1)}%`;
  }).join(", ")})`;
const FADE_UP = easedRamp(0.92);
const BLUR_MASK = easedRamp(1);
const captionGround = (near: boolean, transition: Transition) => (
  <>
    {/* Focus pull: the bottom half of the cover goes soft under the caption,
        radius on the spring so it arrives with the lines rather than
        switching on. */}
    <motion.div
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 h-1/2"
      style={{ maskImage: BLUR_MASK, WebkitMaskImage: BLUR_MASK }}
      initial={false}
      animate={{ backdropFilter: near ? "blur(14px)" : "blur(0px)" }}
      transition={transition}
    />
    {/* The fade: fixed height, strength only. Stage one is just enough to
        hold the title; stage two carries the whole caption. */}
    <motion.div
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 h-3/4"
      style={{ background: FADE_UP }}
      initial={false}
      animate={{ opacity: near ? 1 : 0.3 }}
      transition={transition}
    />
  </>
);

// The lower part of a frame that counts as "at the caption": the pointer
// below this fraction of the card's height (the bottom 30%) unfolds the
// full caption.
const CAPTION_ZONE_FROM = 0.7;

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

// Metadata block, the same shape on every card: the facts (role · year and the
// shipped chip) on one row, the skill chips on the row beneath. Studio tiles
// show two skills, the case-study cards up to three.
const CardMeta = ({
  project,
  tile = false,
  narrow = false,
  skillsOnly = false,
  isMobile,
}: {
  project: ProjectCardData;
  tile?: boolean;
  /** Only the skill row: a Studio tile's hover caption has room for one
   *  line under the title, and the skills are the line the lens reads. */
  skillsOnly?: boolean;
  /** A hero row's 380px desktop text column: two skill chips fit it on one
   *  line, a third never does (measured 421–507px for three). The first two in
   *  the project's list are shown; the data orders them most-telling first. */
  narrow?: boolean;
  isMobile: boolean;
}) => {
  const skills = (project.skills ?? []).slice(0, tile || narrow ? 2 : MAX_SKILLS);
  const links = project.links ?? [];
  const textStyle = {
    // Tiles use the body-small token (14px); the case-study cards keep their
    // existing sizes.
    fontSize: tile ? "var(--font-size-body-small)" : isMobile ? "0.9375rem" : "0.875rem",
    letterSpacing: "0.02em",
    color: "hsl(var(--color-text-secondary))",
  };
  const linkChips = links.map((link) => <LinkChip key={link.url} link={link} />);
  const statusChip = project.destination?.kind === "placeholder" ? <Chip key="status">Coming soon</Chip> : null;
  const skillChips = skills.map((skill) => <SkillChip key={skill} skill={skill} />);
  // A Studio tile has no facts row (skillsOnly), so its link and status chips
  // move down and lead the chip row instead of leaving with it. The facts row
  // went because a run of text is too much for a short frame; a chip is not,
  // and the link chip is the one piece of that row a tile cannot do without.
  // The Shipped lens is answered by carrying an outbound link, and the chip is
  // the evidence for it (see lens.ts), so a tile in that lens with no chip is
  // a claim with nothing behind it. CalmMouse and Inkwork went that way for a
  // while: live products whose tiles offered no way to go and use them. Only
  // the link chip takes the filled link material, so it still reads as the one
  // control in a row of labels.
  const rowChips = skillsOnly ? [...linkChips, statusChip, ...skillChips].filter(Boolean) : skillChips;

  // Two rows. The facts on the first — role · year, and the shipped chip beside
  // them, since "on the App Store" is a fact of the same kind — and the skills
  // on the second. When everything shared one wrapping line, a long role such
  // as "Industrial Design Lead · Sole UX Designer · 2024" pushed the chips
  // around until one landed alone on a third line under a run of text. As a
  // row of their own the skills wrap as a group, and the ragged edge they make
  // is a tag row's, not an orphan's. Three chips fit the hero rows' 380px text
  // column, four did not, which is why the link chip moved up.
  //
  // Studio tiles used to run everything on one line with the year last, which
  // read as a different system from the Work cards and, on a phone where every
  // card is a full-width tile, left the year orphaned after the chips.
  return (
    <div className="flex flex-col gap-y-2">
      {skillsOnly ? null : (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
          <span style={textStyle}>
            {project.role} · {project.year}
          </span>
          {linkChips}
          {statusChip}
        </div>
      )}
      {rowChips.length > 0 ? (
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1.5">{rowChips}</div>
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
  featured = false,
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
  /** Studio tile: 16/9 cover, the smallest caption tier, two skill chips. */
  tile?: boolean;
  /** Selected Work: the cover as a frame at its own shape, the largest
   *  caption tier, and the signal line as the subline. */
  featured?: boolean;
  /** The card's brightness at rest, as a CSS opacity value. More Work sits a
   *  step under Selected Work (the rest-dim token); everything else is 1. */
  restOpacity?: number | string;
  onOpenVideo?: (video: LightboxVideo) => void;
}) => {
  const [hovered, setHovered] = useState(false);
  const isMobile = useIsMobile();
  const shouldReduceMotion = useReducedMotion();
  // Where the caption goes: under the cover below md (lg for the More Work
  // cards and Studio tiles, which are two and three across), over it on
  // hover from there. See the caption block below.
  const captionUnder = useIsBelow(featured ? 768 : 1024);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -80px 0px" });

  // ── Skill lens ──
  // One computed brightness for the card body, so the section's resting dim and
  // the lens never stack: a match under a lens is lifted to full, anything else
  // recedes to the lens-dim token, and with no lens the card sits at its rest
  // level. Hover does not change it: a card that brightened under the pointer
  // read as the picture's tone shifting. This
  // is an inner wrapper with a CSS transition, separate from the entrance
  // animation on the outer motion.div, so a lens change answers in one beat
  // instead of replaying the staggered reveal.
  const match = lensMatch(project, useLens()?.lens ?? null);
  const bodyOpacity =
    match === true
      ? 1
      : match === false
        ? "var(--component-project-card-lens-dim)"
        : restOpacity;
  // The body stacks above the card's stretched link (z-2 over its z-1) and
  // lets pointer events fall through to it everywhere except the metadata
  // chips, which switch them back on. The body's opacity makes it a stacking
  // context, so without this a chip inside the frame's caption could never
  // rise above the link: it was drawn but neither hoverable nor clickable.
  const bodyProps = {
    className: "relative z-2 pointer-events-none transition-opacity duration-medium ease-settle",
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

  // `near`: the pointer is in the lower part of the card, at the caption.
  // Keyboard focus counts as near, so the chips are reachable.
  const [near, setNear] = useState(false);
  const handleEnter = () => setHovered(true);
  const handleLeave = () => {
    setHovered(false);
    setNear(false);
  };
  const handleFocus = () => {
    setHovered(true);
    setNear(true);
  };
  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const next = (event.clientY - rect.top) / rect.height > CAPTION_ZONE_FROM;
    if (next !== near) setNear(next);
  };

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

  // ── Caption (every card whose cover sits above its text) ──
  // One caption recipe across the three tiers, so Selected Work, More Work,
  // and the Studio tiles read as one family: a display-face title, a subline
  // (the signal line on Selected Work, the description elsewhere), then the
  // metadata (role, year, shipped link, skill chips). Where the frame is big
  // enough the caption lives inside it and appears on hover or keyboard
  // focus, at the bottom; at rest the card is the picture. Below that width
  // the same caption sits under the cover, since there is no hover on a
  // phone anyway. One caption is rendered, not both: the chips in it are
  // real links and buttons, and two copies would be two tab stops.
  //
  // The caption comes in two stages, because the reel is the point of the
  // hover and a full caption over it pulled the eye off the picture. With
  // the pointer anywhere on the card the reel plays and only the first
  // stage shows, sitting on the frame's bottom padding on a light fade: the
  // title and subline on a Selected Work frame, the title alone on the
  // smaller cards. When the pointer comes down into the caption zone
  // (CAPTION_ZONE_FROM) the metadata unfolds beneath: its block grows from
  // zero height, lifting the first stage, while the lines rise and fade in
  // from a few pixels below; the fade deepens and the cover blurs under the
  // text (captionGround). All of it rides one spring (MOTION.unfold), so
  // the lift, the rise, the fade, and the blur settle together as one
  // gesture. Moving toward the words to get more of them is the whole
  // affordance, and the unfold is a height animation, so there is no
  // reserved gap under the title in the first stage. What changes
  // with frame size is how much the caption carries and how big it is set:
  // a Selected Work frame is most of the viewport and takes the whole
  // caption; a More Work card or a Studio tile is a few hundred pixels
  // tall, so More Work keeps title and metadata, a tile keeps title and
  // skills, and both step down a size. The overlay lets pointer events
  // through to the stretched card link except over the metadata, whose
  // chips are real controls.
  const tier = featured ? "featured" : tile ? "tile" : "grid";
  // Selected Work sets its title light at heading size, where the weight
  // reads as poise; the smaller More Work and Studio titles take the regular
  // weight, since light at 20px reads thin against a photograph.
  const display = "font-display leading-tight text-foreground";
  const titleClass = {
    featured: { over: `text-title lg:text-heading font-light ${display}`, under: `text-title font-light ${display}` },
    grid: { over: `text-xl font-normal ${display}`, under: `text-title font-normal ${display}` },
    tile: { over: `text-base font-normal ${display}`, under: `text-xl font-normal ${display}` },
  }[tier];
  const subline = featured ? project.signal : noOrphan(project.description);
  const sublineClass = {
    featured: "mt-2 lg:mt-3 max-w-reading text-sm lg:text-base leading-relaxed text-foreground-lead",
    grid: "mt-2 max-w-reading text-sm leading-relaxed text-foreground-lead line-clamp-2",
    tile: "mt-1.5 text-sm leading-snug text-foreground-lead line-clamp-2",
  }[tier];
  const metaGap = { featured: "mt-4 lg:mt-5", grid: "mt-3", tile: "mt-2" }[tier];

  const meta = (inOverlay: boolean) => (
    <div className={`${metaGap} ${!inOverlay || near ? "pointer-events-auto" : ""}`}>
      <CardMeta
        project={project}
        tile={tile}
        skillsOnly={inOverlay && tier === "tile"}
        isMobile={inOverlay ? false : isMobile}
      />
    </div>
  );
  const unfold: Transition = shouldReduceMotion ? { duration: 0 } : MOTION.unfold;
  // The lines arrive a beat after the ground on the way in, and leave with
  // it on the way out.
  const unfoldLines: Transition = shouldReduceMotion || !near ? unfold : { ...unfold, delay: 0.05 };
  const caption = (inOverlay: boolean) => (
    <>
      <h3 className={inOverlay ? titleClass.over : titleClass.under}>{project.title}</h3>
      {subline && (featured || !inOverlay) ? <p className={sublineClass}>{subline}</p> : null}
      {inOverlay ? (
        <motion.div
          initial={false}
          animate={{ height: near ? "auto" : 0, opacity: near ? 1 : 0 }}
          transition={unfoldLines}
          className="overflow-hidden"
        >
          <motion.div initial={false} animate={{ y: near ? 0 : 12 }} transition={unfoldLines}>
            {meta(true)}
          </motion.div>
        </motion.div>
      ) : (
        meta(false)
      )}
    </>
  );
  const overlayCaption = (
    <div
      className={`pointer-events-none absolute inset-0 flex flex-col justify-end transition-opacity duration-medium ease-settle ${
        hovered ? "opacity-100" : "opacity-0"
      }`}
    >
      {captionGround(near, unfold)}
      <div className={`relative z-2 ${{ featured: "p-6 md:p-10", grid: "p-5", tile: "p-4" }[tier]}`}>{caption(true)}</div>
    </div>
  );
  const underCaption = (
    <div className={`flex flex-col ${tier === "tile" ? "mt-4" : "mt-5"}`}>{caption(false)}</div>
  );

  if (horizontal || imageRight) {
    // ── Hero row columns ──
    // Desktop: the cover takes 65% and the text column is exactly as wide as
    // its copy (380px), so the block sits flush against the page margin on
    // whichever side it lands and the gutter beside the cover is the same in
    // both row directions. When the two columns don't fill the row, the
    // spare width goes into that gutter (justify-between); when they don't
    // fit, both shrink in proportion. An earlier version gave the text a
    // flexible column with a 380px block inside it, which left the slack on
    // the outer edge of image-left rows only, so the two directions never
    // quite matched.
    const imageCol = (
      <div
        className={isMobile ? "w-full order-first" : "min-w-0"}
        style={isMobile ? undefined : { flex: "0 1 65%" }}
      >
        {/* No bottom margin on desktop: the text column centers on this
            box, and a margin here would put the center 12px low. Mobile
            keeps it as the gap above the title. */}
        <CardMedia
          project={project}
          hovered={hovered}
          aspectRatio={aspectRatio}
          marginClass={isMobile ? "mb-6" : ""}
        />
      </div>
    );

    // ── Editorial text column for hero rows ──
    // On desktop the text is one block, centered on the cover's height. It
    // used to be bottom-anchored, which left the top corner of every row
    // empty, and on a wide display, where the cover is tall, that hole was
    // the first thing the eye met; pinning the title to the top edge and the
    // metadata to the bottom edge moved the hole to the middle instead.
    // Centered, the air above and below the block is equal, so it reads as
    // margin rather than as something missing. The text is left-aligned in
    // both row directions: a right-aligned block was tried for the
    // image-left rows and read as a mirror rather than as copy.
    // On mobile: natural block flow under the cover.
    const textCol = (
      <div
        className={`flex flex-col min-w-0 ${isMobile ? "" : "justify-center"}`}
        style={isMobile ? undefined : { flex: "0 1 380px" }}
      >
        <div>
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
          <div className="pointer-events-auto">
            <CardMeta project={project} narrow={!isMobile} isMobile={isMobile} />
          </div>
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
          className={`${bodyProps.className} flex items-stretch ${isMobile ? "flex-col gap-6" : "flex-row justify-between gap-10"}`}
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
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onFocusCapture={handleFocus}
      onBlurCapture={handleLeave}
      data-clickable={project.destination?.kind === "placeholder" ? "false" : "true"}
      {...arrivalProps}
    >
      <div {...bodyProps} className={`${bodyProps.className} flex flex-col`}>
        <CardMedia
          project={project}
          hovered={hovered}
          aspectRatio={tile ? GRID_COVER_ASPECT : aspectRatio}
          cornerGlyph={tile ? cornerGlyphFor(project.destination) : undefined}
          overlay={captionUnder ? undefined : overlayCaption}
          marginClass=""
        />
        {captionUnder ? underCaption : null}
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
const SectionLabel = ({
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

// ─── Work sections' container ─────────────────────────────────────────────────
// Both homepage Work sections sit in one centered column capped at the page
// token (1400px), the same cap the footer uses, so a Selected Work frame and
// a More Work row are the same width. Under the cap nothing changes: a 1440
// display already fits inside. Above it the column stops growing with the
// viewport, so on a 2560 display a frame is 1400px wide rather than 2368.
const WORK_CONTAINER = PAGE_COLUMN;

// ─── Selected Work ────────────────────────────────────────────────────────────
// A sequence of frames, each the full width of the page column (the same
// column More Work sits in) at its own shape. The caption lives inside the
// frame and appears on hover (under the cover on a phone), so at rest the
// section is pictures only. Every project gets the same treatment, so the
// section carries no hierarchy among the four. (Frames sized to the
// viewport height were tried first; covers of different ratios then came
// out at different widths, which read as a mistake rather than a wall of
// stills.)
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
  <section id={id} className={`${PAGE_GUTTERS} pt-16`}>
    <div className={WORK_CONTAINER}>
      <SectionLabel title={sectionTitle} dotClass={dotClass} variant="primary" />
      {/* The eyebrow carries mb-10; the intro pulls up to sit 16px under it and
          restores the 40px above the first frame. */}
      {intro ? <div className="-mt-6 mb-10">{intro}</div> : null}
      <div className="flex flex-col gap-y-section">
        {projects.map((p, i) => (
          <ProjectCard key={p.id ?? p.title} project={p} projectId={p.id} dotClass={dotClass} globalIndex={i} featured />
        ))}
      </div>
    </div>
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
  <section id={id} className={`${PAGE_GUTTERS} pt-section pb-8`}>
    <div className={WORK_CONTAINER}>
      <SectionLabel title={sectionTitle} dotClass={dotClass} variant="secondary" />
      {projects.length > 0 && (
        <TwoColGrid projects={projects} dotClass={dotClass} restOpacity={MORE_WORK_REST_OPACITY} />
      )}
    </div>
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
    <section id={id} className={`${PAGE_GUTTERS} pb-8 ${showLabel ? "pt-section" : ""}`}>
      <div className={WORK_CONTAINER}>
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
      </div>
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
