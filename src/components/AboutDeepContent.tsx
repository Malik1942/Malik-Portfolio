import { useState, useRef, useEffect, useCallback, useId } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Linkedin, Mail, X, type LucideIcon } from "lucide-react";
import Footer from "@/components/Footer";
import BoulderWall from "@/components/BoulderWall";
import {
  AboutEditorialSection,
  aboutEditorialItemVariants,
  aboutEditorialStaggerVariants,
  aboutEditorialTextVariants,
} from "@/components/AboutEditorialSection";

const easeOutExpo: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ── Ambient floating dots for background continuity ──
const AmbientDots = ({ count = 40 }: { count?: number }) => {
  const dotsRef = useRef<{ x: number; y: number; size: number; delay: number; duration: number }[]>([]);
  
  if (dotsRef.current.length === 0) {
    for (let i = 0; i < count; i++) {
      dotsRef.current.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        delay: Math.random() * 5,
        duration: 6 + Math.random() * 8,
      });
    }
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dotsRef.current.map((dot, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-foreground/[0.06]"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: dot.size,
            height: dot.size,
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.04, 0.1, 0.04],
          }}
          transition={{
            duration: dot.duration,
            delay: dot.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// ── Photography Gallery ──
interface PhotoItem {
  id: number;
  src: string;
  alt: string;
  priority?: boolean;
}

const PHOTOS: PhotoItem[] = [
  { id: 1, src: "/images/photography/1.webp", alt: "Photography image 1", priority: true },
  { id: 2, src: "/images/photography/2.webp", alt: "Photography image 2" },
  { id: 3, src: "/images/photography/3.webp", alt: "Photography image 3" },
  { id: 4, src: "/images/photography/4.webp", alt: "Photography image 4" },
  { id: 5, src: "/images/photography/5.webp", alt: "Photography image 5" },
  { id: 6, src: "/images/photography/6.webp", alt: "Photography image 6" },
  { id: 7, src: "/images/photography/7.webp", alt: "Photography image 7" },
  { id: 8, src: "/images/photography/8.webp", alt: "Photography image 8" },
];

/** Rows 1–4: two equal landscape frames per row (images 1–8). Row 5: image 8 again as a wide panoramic close. */
const PHOTO_EDITORIAL_PAIR_ROWS: PhotoItem[][] = [
  [PHOTOS[0], PHOTOS[1]],
  [PHOTOS[2], PHOTOS[3]],
  [PHOTOS[4], PHOTOS[5]],
  [PHOTOS[6], PHOTOS[7]],
];
const PHOTO_EDITORIAL_PANORAMIC = PHOTOS[7];

const photoIndexById = (id: number) => PHOTOS.findIndex((p) => p.id === id);

// Editorial grid: stagger by row (calm, continuous)
const photoEditorialGridVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

const photoEditorialRowVariants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.68, ease: easeOutExpo },
  },
};

const preloadImage = (src: string) => {
  const image = new Image();
  image.src = src;
};

const PhotographyLightbox = ({
  photos,
  activeIndex,
  onClose,
  onNavigate,
}: {
  photos: PhotoItem[];
  activeIndex: number;
  onClose: () => void;
  onNavigate: (direction: -1 | 1) => void;
}) => {
  const touchStartXRef = useRef<number | null>(null);
  const activePhoto = photos[activeIndex];

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onNavigate(-1);
      if (event.key === "ArrowRight") onNavigate(1);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    preloadImage(photos[(activeIndex - 1 + photos.length) % photos.length].src);
    preloadImage(photos[(activeIndex + 1) % photos.length].src);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, onClose, onNavigate, photos]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
        onClick={onClose}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 z-[101] flex h-10 w-10 items-center justify-center rounded-full text-foreground/55 transition-colors duration-300 hover:text-foreground cursor-pointer"
          aria-label="Close photography lightbox"
        >
          <X className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onNavigate(-1);
          }}
          className="absolute left-3 top-1/2 z-[101] hidden -translate-y-1/2 items-center justify-center rounded-full p-3 text-foreground/55 transition-colors duration-300 hover:text-foreground md:flex cursor-pointer"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onNavigate(1);
          }}
          className="absolute right-3 top-1/2 z-[101] hidden -translate-y-1/2 items-center justify-center rounded-full p-3 text-foreground/55 transition-colors duration-300 hover:text-foreground md:flex cursor-pointer"
          aria-label="Next image"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div
          className="absolute inset-0 flex items-center justify-center p-5 md:p-10"
          onClick={(event) => event.stopPropagation()}
          onTouchStart={(event) => {
            touchStartXRef.current = event.changedTouches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            const startX = touchStartXRef.current;
            const endX = event.changedTouches[0]?.clientX ?? null;
            touchStartXRef.current = null;
            if (startX === null || endX === null) return;

            const delta = endX - startX;
            if (Math.abs(delta) < 45) return;
            onNavigate(delta > 0 ? -1 : 1);
          }}
        >
          <motion.img
            key={activePhoto.src}
            src={activePhoto.src}
            alt={activePhoto.alt}
            className="max-h-full max-w-full object-contain select-none rounded-lg"
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            draggable={false}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

/** Editorial frame — uniform landscape cells, minimal treatment */
const EditorialPhotoFrame = ({
  photo,
  onOpen,
  layout,
}: {
  photo: PhotoItem;
  onOpen: () => void;
  layout: "pair" | "panoramic";
}) => (
  <button
    type="button"
    onClick={onOpen}
    className="group block w-full cursor-pointer rounded-lg text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20"
    aria-label={`Open ${photo.alt}`}
  >
    <div
      className={`relative w-full overflow-hidden rounded-lg bg-secondary/[0.08] ${
        layout === "pair" ? "aspect-[16/10]" : "aspect-[2.35/1] max-h-[min(30vh,340px)]"
      }`}
    >
      <img
        src={photo.src}
        alt={photo.alt}
        className="h-full w-full rounded-lg object-cover object-center transition-[filter] duration-[420ms] ease-out group-hover:brightness-[1.03]"
        loading={photo.priority ? "eager" : "lazy"}
        decoding="async"
        sizes={layout === "pair" ? "(min-width: 1024px) 42vw, 50vw" : "100vw"}
      />
    </div>
  </button>
);

// ── Life Event Node ──
interface LifeEvent {
  year: string;
  title: string;
  caption: string;
  type: "design" | "education" | "award";
}

const LIFE_EVENTS: LifeEvent[] = [
  { year: "2026", title: "Inkwork",        caption: "A styled-QR studio with a point of view",    type: "design"    },
  { year: "2026", title: "FigBuild 2026",  caption: "1st Place — NeuraLyfe",                    type: "award"     },
  { year: "2026", title: "NeuraLyfe",      caption: "Making invisible brain trauma visible",      type: "design"    },
  { year: "2026", title: "Studio Waters",  caption: "Vibe-coded CPX controlled fishing game",     type: "design"    },
  { year: "2026", title: "Tubular",        caption: "Designing the mini-golf experience beyond the surface",  type: "design"    },
  { year: "2025", title: "Aura",           caption: "AI-driven wearable for motion sickness",     type: "design"    },
  { year: "2025", title: "FlowPrint",      caption: "Led consumer 3D printing redesign",          type: "design"    },
  { year: "2024", title: "Design Systems", caption: "Deep dive into systematic design thinking",  type: "education" },
  { year: "2024", title: "Mood Muse",      caption: "Physical craft meets digital experience — design beyond form", type: "design" },
  { year: "2023", title: "Started Building", caption: "First experiments with design + code",     type: "education" },
];

const LifeEventRow = ({ event }: { event: LifeEvent }) => {
  const [hovered, setHovered] = useState(false);

  // Category markers: amber identifies awards, blue identifies education,
  // neutral covers everything else.
  const dotColor = event.type === "award"
    ? "bg-timeline-award"
    : event.type === "education"
    ? "bg-timeline-education"
    : "bg-foreground/15";

  return (
    <motion.div
      variants={aboutEditorialItemVariants}
      className="flex items-start gap-4 group cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Year */}
      <span className="text-xs text-foreground/72 font-normal w-12 pt-0.5 flex-shrink-0">
        {event.year}
      </span>

      {/* Node dot */}
      <motion.div
        className={`w-[6px] h-[6px] rounded-full mt-2 flex-shrink-0 ${dotColor}`}
        animate={{
          scale: hovered ? 2 : 1,
          opacity: hovered ? 0.8 : undefined,
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Content */}
      <div className="flex flex-col gap-0.5">
        <motion.span
          className="text-sm text-foreground/72 font-normal"
          animate={{ opacity: hovered ? 0.95 : 0.8 }}
          transition={{ duration: 0.4 }}
        >
          {event.title}
        </motion.span>
        <motion.span
          className="text-caption text-foreground font-normal"
          animate={{ opacity: hovered ? 1 : 0.8 }}
          transition={{ duration: 0.4 }}
        >
          {event.caption}
        </motion.span>
      </div>
    </motion.div>
  );
};

// ── Resilient Movement System ──
// Each sport has particles forming a stable shape that periodically breaks and recovers.

interface ResilientParticle {
  x: number; y: number;
  homeX: number; homeY: number;
  vx: number; vy: number;
}

type SportType = "basketball" | "cycling" | "swimming" | "climbing";

const SPORTS_DATA: { name: string; type: SportType }[] = [
  { name: "Basketball", type: "basketball" },
  { name: "Cycling", type: "cycling" },
  { name: "Swimming", type: "swimming" },
  { name: "Climbing", type: "climbing" },
];

const PARTICLE_COUNT = 28;

// Links the canvas never draws, per formation: the guide outline and the
// connection lines both skip them. Index i is the link from particle i to
// i + 1 (the last index is the wrap-around link back to particle 0).
//  - swimming: two open lanes, so no line joins lane 1's end to lane 2's start
//    and none closes lane 2 back to lane 1.
//  - climbing: the wrap-around link is the carabiner's gate opening.
function isSkippedLink(type: SportType, i: number): boolean {
  const last = PARTICLE_COUNT - 1;
  if (type === "swimming") return i === PARTICLE_COUNT / 2 - 1 || i === last;
  if (type === "climbing") return i === last;
  return false;
}

// Carabiner — the object climbing is recognised by, the way the ball, the
// wheels and the lanes stand for the other three. A tall D-shaped loop
// (flatter spine on the left, fuller curve on the right) hung at a slight
// tilt. `u` runs 0→1 from just past the gate round to just before it, so the
// wrap-around link the canvas never draws (see isSkippedLink) is the gate
// opening on the upper right.
function carabinerPoint(u: number, cx: number, cy: number, r: number): [number, number] {
  const GATE = -Math.PI * 0.3;
  const GAP = 0.55;
  const a = GATE + GAP / 2 + u * (Math.PI * 2 - GAP);
  const W = r * 0.62;
  const H = r * 0.98;
  const c = Math.cos(a);
  const dx = c * W * (c >= 0 ? 1 : 0.3);
  const dy = Math.sin(a) * H;
  const tilt = -0.2;
  return [cx + dx * Math.cos(tilt) - dy * Math.sin(tilt), cy + dx * Math.sin(tilt) + dy * Math.cos(tilt)];
}

// Sample `count` points evenly by arc length along an open curve.
function sampleByArcLength(
  curve: (u: number) => [number, number],
  count: number,
): [number, number][] {
  const STEPS = 600;
  const pts: [number, number][] = [];
  const cum: number[] = [0];
  for (let k = 0; k <= STEPS; k++) {
    pts.push(curve(k / STEPS));
    if (k > 0) {
      const [x0, y0] = pts[k - 1];
      const [x1, y1] = pts[k];
      cum.push(cum[k - 1] + Math.hypot(x1 - x0, y1 - y0));
    }
  }
  const total = cum[STEPS];
  const out: [number, number][] = [];
  let k = 0;
  for (let i = 0; i < count; i++) {
    const target = (i / (count - 1)) * total;
    while (k < STEPS - 1 && cum[k + 1] < target) k++;
    const seg = cum[k + 1] - cum[k] || 1;
    const f = (target - cum[k]) / seg;
    out.push([pts[k][0] + (pts[k + 1][0] - pts[k][0]) * f, pts[k][1] + (pts[k + 1][1] - pts[k][1]) * f]);
  }
  return out;
}

function createParticles(type: SportType, cx: number, cy: number, r: number): ResilientParticle[] {
  const particles: ResilientParticle[] = [];
  const count = PARTICLE_COUNT;
  const carabiner =
    type === "climbing" ? sampleByArcLength((u) => carabinerPoint(u, cx, cy, r), count) : [];

  for (let i = 0; i < count; i++) {
    const t = i / count;
    let hx: number, hy: number;

    if (type === "basketball") {
      // Circle formation
      const angle = t * Math.PI * 2;
      hx = cx + Math.cos(angle) * r;
      hy = cy + Math.sin(angle) * r;
    } else if (type === "cycling") {
      // Figure-8 / orbit
      const angle = t * Math.PI * 2;
      hx = cx + Math.cos(angle) * r;
      hy = cy + Math.sin(angle * 2) * r * 0.5;
    } else if (type === "climbing") {
      // Climbing — see carabinerPoint. The outline is resampled by arc
      // length (not by angle) so the dots sit evenly along the flattened
      // spine as well as the rounder side.
      [hx, hy] = carabiner[i];
    } else {
      // Swimming — dual sine lanes (stroke rhythm)
      const lane = i < count / 2 ? -1 : 1;
      const lt = (i % (count / 2)) / (count / 2);
      hx = cx - r + lt * r * 2;
      hy = cy + lane * r * 0.32 + Math.sin(lt * Math.PI * 2) * r * 0.28;
    }

    particles.push({ x: hx, y: hy, homeX: hx, homeY: hy, vx: 0, vy: 0 });
  }
  return particles;
}

// The fly-in. When the tab is hidden the rAF loop pauses, and the first frame
// back runs with a multi-second dt: the periodic scatter fires and that one
// oversized step flings every particle 100–300px outside the canvas, after
// which the recovery spring pulls them back into formation with the lines
// trailing. That accident is the entrance we want, so it is replayed on
// purpose: the trigger primes the state machine to scatter on the next frame
// and hands that frame this dt.
const FLY_IN_DT = 4;

const ResilienceCanvas = ({ type, isHovered, inView }: { type: SportType; isHovered: boolean; inView: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<ResilientParticle[]>([]);
  const animRef = useRef(0);
  const phaseRef = useRef<"stable" | "disrupted" | "recovering">("stable");
  const timerRef = useRef(0);
  const hoveredRef = useRef(false);
  const dtOverrideRef = useRef(0);

  useEffect(() => { hoveredRef.current = isHovered; }, [isHovered]);

  // Replay the fly-in whenever the section enters view, including the first
  // paint after entering the About page.
  useEffect(() => {
    if (!inView) return;
    phaseRef.current = "stable";
    timerRef.current = 10; // past the 3.5 s scatter threshold
    dtOverrideRef.current = FLY_IN_DT;
  }, [inView]);

  const init = useCallback(() => {
    const size = 120;
    particlesRef.current = createParticles(type, size / 2, size / 2, 36);
    phaseRef.current = "stable";
    timerRef.current = 0;
  }, [type]);

  useEffect(() => {
    init();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = 120 * dpr;
    canvas.height = 120 * dpr;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let lastTime = performance.now();

    const loop = () => {
      const now = performance.now();
      let dt = (now - lastTime) / 1000;
      lastTime = now;
      if (dtOverrideRef.current) {
        dt = dtOverrideRef.current;
        dtOverrideRef.current = 0;
      }

      const particles = particlesRef.current;
      const phase = phaseRef.current;

      // Phase state machine
      timerRef.current += dt;

      if (hoveredRef.current && phase === "stable") {
        // Hover triggers immediate disruption
        phaseRef.current = "disrupted";
        timerRef.current = 0;
        particles.forEach(p => {
          const angle = Math.atan2(p.y - 60, p.x - 60) + (Math.random() - 0.5) * 1.5;
          const force = 60 + Math.random() * 40;
          p.vx += Math.cos(angle) * force;
          p.vy += Math.sin(angle) * force;
        });
      }

      if (phase === "stable" && timerRef.current > 3.5) {
        // Periodic disruption
        phaseRef.current = "disrupted";
        timerRef.current = 0;
        particles.forEach(p => {
          const angle = Math.random() * Math.PI * 2;
          const force = 25 + Math.random() * 35;
          p.vx += Math.cos(angle) * force;
          p.vy += Math.sin(angle) * force;
        });
      }

      if (phase === "disrupted" && timerRef.current > 0.4) {
        phaseRef.current = "recovering";
        timerRef.current = 0;
      }

      if (phase === "recovering" && timerRef.current > 1.2) {
        phaseRef.current = "stable";
        timerRef.current = 0;
      }

      // Physics update
      const springK = phase === "recovering" ? 12 : phase === "stable" ? 8 : 0.5;
      const damping = phase === "recovering" ? 0.88 : 0.92;

      particles.forEach(p => {
        // Spring toward home
        const dx = p.homeX - p.x;
        const dy = p.homeY - p.y;
        p.vx += dx * springK * dt;
        p.vy += dy * springK * dt;
        p.vx *= damping;
        p.vy *= damping;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
      });

      // Draw
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, 120, 120);

      // Stable guide shape (faint)
      if (phase === "stable") {
        ctx.globalAlpha = 0.06;
        ctx.beginPath();
        particles.forEach((p, i) => {
          if (i === 0 || isSkippedLink(type, i - 1)) ctx.moveTo(p.homeX, p.homeY);
          else ctx.lineTo(p.homeX, p.homeY);
        });
        if (!isSkippedLink(type, particles.length - 1)) ctx.closePath();
        ctx.strokeStyle = "rgba(225, 222, 215, 1)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Particles
      particles.forEach(p => {
        const distFromHome = Math.sqrt((p.x - p.homeX) ** 2 + (p.y - p.homeY) ** 2);
        const displaced = Math.min(1, distFromHome / 30);
        
        // Color shifts: stable = calm white, displaced = warmer/stressed
        const r = Math.round(225 + displaced * 30);
        const g = Math.round(222 - displaced * 40);
        const b = Math.round(215 - displaced * 60);
        const alpha = 0.5 + displaced * 0.4;
        const size = 1.5 + displaced * 0.8;

        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.fill();
      });

      // Connection lines (only when stable or recovering)
      if (phase !== "disrupted") {
        ctx.globalAlpha = phase === "stable" ? 0.08 : 0.04;
        for (let i = 0; i < particles.length; i++) {
          if (isSkippedLink(type, i)) continue;
          const next = particles[(i + 1) % particles.length];
          const p = particles[i];
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(next.x, next.y);
          ctx.strokeStyle = "rgba(225, 222, 215, 1)";
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [init, type]);

  return (
    <canvas
      ref={canvasRef}
      className="w-[120px] h-[120px]"
      style={{ imageRendering: "auto" }}
    />
  );
};

const SportNode = ({ sport, inView }: { sport: (typeof SPORTS_DATA)[0]; inView: boolean }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      variants={aboutEditorialItemVariants}
      className="flex flex-col items-center gap-3 cursor-default w-[132px] flex-shrink-0"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <ResilienceCanvas type={sport.type} isHovered={hovered} inView={inView} />
      <motion.span
        className="text-xs uppercase tracking-eyebrow text-foreground"
        animate={{ opacity: hovered ? 1.0 : 0.72 }}
        transition={{ duration: 0.4 }}
      >
        {sport.name}
      </motion.span>
    </motion.div>
  );
};

// ── Food / Daily life tags ──
const DAILY_ITEMS = [
  "Coffee rituals", "Home cooking (Asian flavors)", "Vinyl & R&B",
  "Driving / long night rides", "Photography", "Outdoor escapes",
  "Basketball", "Cycling", "Snowboarding", "Swimming", "Climbing",
];

const DailyTag = ({ label }: { label: string }) => (
  <span className="text-xs text-foreground/72 font-normal px-4 py-2.5 rounded-sm border border-foreground/[0.22] hover:text-foreground hover:border-foreground/[0.35] transition-colors duration-300 cursor-default">
    {label}
  </span>
);

// ── Connect rocks ──
// The two contact links are climbing holds drawn in an ink-sketch style:
// paper-white fill, bold hand-drawn outline, hatch shading, and small drawn
// bolt holes, like a route-setter's catalog sheet. Paper is the foreground
// token and ink is the background token, so the holds are the site palette
// inverted. When the visitor tops out any route they glow in workshop amber.

const connectAmber = (alpha: number) => `hsl(var(--color-accent-workshop) / ${alpha})`;
const rockPaper = "hsl(var(--color-text-primary))";
const rockInk = (alpha = 1) => `hsl(var(--color-background-canvas) / ${alpha})`;

const ROCK_VIEW = { w: 220, h: 124 };

interface SketchRock {
  /** Silhouette — many short curve segments so the edge bumps and dents like a drawn line. */
  path: string;
  /** Hatch strokes on the shadow side: short curved groups that follow the form. */
  hatch: string;
  /** Interior form lines (lip, ridge, volume), drawn at near-full ink. */
  detail: string;
  /** Drawn bolt holes: ring + center dot. */
  bolts: [number, number][];
  /** Optional finger pocket, drawn as a hatched ring. */
  pocket?: { x: number; y: number; r: number };
  /** Hand-placed tilt so the pair reads as scattered catalog pieces. */
  tilt: number;
  /** Nudge the label into the meat of the shape. */
  labelDx: number;
  labelDy: number;
}

const SKETCH_ROCKS: SketchRock[] = [
  {
    // Organic jug: an uneven, lumpy perimeter with no straight runs anywhere.
    path:
      "M9 62 C8 53 17 43 27 36 C36 29 52 25 65 20 C79 15 96 7 110 7 C124 6 138 14 152 18 C165 23 182 27 190 34 C198 41 201 53 200 62 C199 71 191 78 184 86 C177 93 169 103 157 109 C145 114 126 118 110 119 C94 120 75 118 62 113 C49 108 40 97 31 89 C22 80 10 71 9 62 Z",
    hatch:
      "M191 55 L207 58 M191 65 L205 69 M187 73 L199 79 M180 81 L189 87 M173 88 L182 97 M164 96 L170 106 M153 104 L155 114 M137 109 L136 119 M121 112 L117 122 M106 113 L98 123 M90 113 L79 121 M73 110 L59 117 M59 103 L44 108 M48 95 L32 98 M35 38 L17 37 M50 30 L33 27 M67 25 L53 20",
    detail:
      "M56 100 c16 -9 38 -11 55 -4 M24 52 c5 -10 14 -17 26 -22 M186 42 c8 6 12 13 14 21",
    bolts: [
      [58, 36],
      [162, 92],
    ],
    tilt: -2,
    labelDx: 0,
    labelDy: 0,
  },
  {
    // Organic pinch: same flowing language, different lumps and a low pocket.
    path:
      "M18 62 C19 53 27 42 34 34 C42 26 49 16 62 12 C75 7 94 8 110 9 C126 11 145 15 157 19 C169 24 175 28 183 35 C191 42 206 53 207 62 C208 71 196 81 187 87 C178 94 165 97 152 102 C139 106 124 113 110 115 C96 116 79 116 65 112 C51 108 33 97 25 89 C17 81 16 71 18 62 Z",
    hatch:
      "M196 65 L211 70 M191 74 L203 80 M183 82 L193 89 M173 89 L181 96 M162 94 L166 102 M149 97 L152 106 M137 103 L137 112 M124 107 L120 117 M108 110 L101 119 M92 110 L82 119 M78 109 L66 116 M64 105 L49 110 M50 97 L33 101 M38 89 L19 91 M36 44 L19 44 M45 32 L30 30 M56 22 L42 18",
    detail: "M58 28 c12 -6 26 -9 40 -9 M186 46 c6 5 10 12 11 19",
    bolts: [
      [104, 32],
      [166, 86],
    ],
    pocket: { x: 54, y: 88, r: 7.5 },
    tilt: 1.6,
    labelDx: 0,
    labelDy: 0,
  },
];

const BoltHole = ({ x, y }: { x: number; y: number }) => (
  <g aria-hidden="true">
    <circle cx={x} cy={y} r={3.4} fill="none" stroke={rockInk()} strokeWidth={1.4} />
    <circle cx={x} cy={y} r={1.1} fill={rockInk()} />
  </g>
);

const ConnectRock = ({
  href,
  label,
  icon: Icon,
  lit,
  delay,
  shape,
  external,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  lit: boolean;
  delay: number;
  shape: 0 | 1;
  external?: boolean;
}) => {
  const reducedMotion = useReducedMotion();
  const uid = useId().replace(/:/g, "");
  const rock = SKETCH_ROCKS[shape];
  const clipId = `rock-clip-${uid}`;
  // The top-out pop is a one-shot. Parking its keyframes in `animate` for as
  // long as the rock is lit makes framer replay the whole run every time the
  // cursor *leaves*, so it settles to a static pose once the pop has played.
  const [celebrating, setCelebrating] = useState(false);

  useEffect(() => {
    if (!lit || reducedMotion) {
      setCelebrating(false);
      return;
    }
    setCelebrating(true);
    const timer = window.setTimeout(() => setCelebrating(false), (delay + 0.9) * 1000 + 80);
    return () => window.clearTimeout(timer);
  }, [lit, delay, reducedMotion]);

  return (
    <motion.a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group relative block w-[150px] md:w-[214px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 rounded-[52px]"
      style={{ aspectRatio: `${ROCK_VIEW.w} / ${ROCK_VIEW.h}` }}
      animate={
        celebrating
          ? { scale: [1, 1.16, 0.96, 1.06, 1], rotate: [0, -4, 3, -1.5, 0] }
          : { scale: 1, rotate: 0 }
      }
      // The bounce belongs on the way in. Hover carries its own springy
      // transition so it never inherits the pop's long duration and stagger.
      whileHover={
        reducedMotion
          ? { scale: 1.02, transition: { duration: 0.15 } }
          : {
              scale: 1.06,
              transition: { type: "spring", stiffness: 520, damping: 12, mass: 0.6 },
            }
      }
      transition={
        celebrating
          ? { duration: 0.9, delay, ease: easeOutExpo }
          : { type: "spring", stiffness: 380, damping: 30, mass: 0.6 }
      }
    >
      <div
        className="absolute inset-0"
        style={{ transform: `rotate(${rock.tilt}deg)` }}
      >
        <svg
          viewBox={`0 0 ${ROCK_VIEW.w} ${ROCK_VIEW.h}`}
          className="absolute inset-0 h-full w-full overflow-visible"
          style={{
            filter: lit
              ? `drop-shadow(0 4px 8px rgba(0, 0, 0, 0.35)) drop-shadow(0 0 22px ${connectAmber(0.4)})`
              : "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.35))",
            transition: "filter 0.7s ease",
          }}
          aria-hidden="true"
        >
          <defs>
            <clipPath id={clipId}>
              <path d={rock.path} />
            </clipPath>
          </defs>

          {/* Paper body */}
          <path d={rock.path} fill={rockPaper} />

          {/* Ink work, clipped to the silhouette so the outline's full weight
              lands on the paper instead of vanishing into the dark page */}
          <g clipPath={`url(#${clipId})`}>
            <path
              d={rock.hatch}
              fill="none"
              stroke={rockInk(0.75)}
              strokeWidth={1.5}
              strokeLinecap="round"
            />
            <path
              d={rock.detail}
              fill="none"
              stroke={rockInk(0.85)}
              strokeWidth={1.5}
              strokeLinecap="round"
            />
            <path
              d={rock.path}
              fill="none"
              stroke={rockInk()}
              strokeWidth={7}
              strokeLinejoin="round"
            />
            {/* A second, slightly diverging pass makes the line weight vary
                like a pen that went around twice */}
            <path
              d={rock.path}
              fill="none"
              stroke={rockInk(0.55)}
              strokeWidth={1.8}
              strokeLinejoin="round"
              transform={`rotate(0.7 ${ROCK_VIEW.w / 2} ${ROCK_VIEW.h / 2}) translate(1.4 -1)`}
            />
          </g>

          {rock.pocket && (
            <g>
              <circle
                cx={rock.pocket.x}
                cy={rock.pocket.y}
                r={rock.pocket.r}
                fill="none"
                stroke={rockInk()}
                strokeWidth={2.4}
              />
              <path
                d={`M${rock.pocket.x - 5} ${rock.pocket.y - 2} l7 7 M${rock.pocket.x - 3} ${rock.pocket.y - 6} l8 8`}
                fill="none"
                stroke={rockInk(0.7)}
                strokeWidth={1.3}
                strokeLinecap="round"
              />
            </g>
          )}

          {rock.bolts.map(([x, y]) => (
            <BoltHole key={`${x}-${y}`} x={x} y={y} />
          ))}

          {/* Top-out celebration: an amber pen line traces the silhouette… */}
          <motion.path
            d={rock.path}
            fill="none"
            stroke={connectAmber(0.9)}
            strokeWidth={2.2}
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={lit ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : { duration: 0.9, delay: delay + 0.3, ease: "easeInOut" }
            }
          />

        </svg>

        <span
          className="absolute inset-0 flex items-center justify-center gap-2 md:gap-2.5 text-caption md:text-sm font-medium"
          style={{
            color: rockInk(0.9),
            transform: `translate(${rock.labelDx}px, ${rock.labelDy}px)`,
          }}
        >
          <Icon className="h-4 w-4 md:h-[18px] md:w-[18px]" aria-hidden="true" />
          {label}
        </span>
      </div>
    </motion.a>
  );
};

// ── Main component ──
const AboutDeepContent = ({
  isVisible,
  onSectionClick,
  onBack,
  deepLinkSection,
}: {
  isVisible: boolean;
  /** Footer section links — receives the homepage section's DOM id. */
  onSectionClick?: (sectionId: string) => void;
  /** Section id the URL landed on, e.g. "connect" for /about/connect. */
  deepLinkSection?: string;
  /** Returns to the homepage hero — mirrors the case studies' bottom exit. */
  onBack?: () => void;
}) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [toppedOut, setToppedOut] = useState(false);
  const photoSectionRef = useRef<HTMLElement>(null);
  const lifeSectionRef = useRef<HTMLElement>(null);
  const movementSectionRef = useRef<HTMLElement>(null);
  const dailySectionRef = useRef<HTMLElement>(null);
  const connectSectionRef = useRef<HTMLElement>(null);

  const inViewOpts = { once: true, margin: "0px 0px -6% 0px" as const, amount: 0.15 as const };
  const photoInView = useInView(photoSectionRef, inViewOpts);
  const lifeInView = useInView(lifeSectionRef, inViewOpts);
  const movementInView = useInView(movementSectionRef, inViewOpts);
  // Not `once`: the sport canvases replay their fly-in each time the section
  // scrolls back into view. The editorial reveal above stays once-only.
  const movementReplay = useInView(movementSectionRef, { amount: 0.35 });
  const dailyInView = useInView(dailySectionRef, inViewOpts);
  const connectObserved = useInView(connectSectionRef, inViewOpts);
  // A deep link scrolls straight here, which outruns the in-view entrance and
  // would otherwise land the visitor on a section still at opacity 0.
  const connectInView = connectObserved || deepLinkSection === "connect";

  if (!isVisible) return null;

  const openPhoto = (index: number) => setActivePhotoIndex(index);
  const closePhoto = () => setActivePhotoIndex(null);
  const navigatePhoto = (direction: -1 | 1) => {
    setActivePhotoIndex((current) => {
      if (current === null) return current;
      return (current + direction + PHOTOS.length) % PHOTOS.length;
    });
  };

  return (
    <div className="relative bg-background">
        {/* Gradient transition from particle canvas to content */}
        <div
          className="absolute top-0 left-0 right-0 h-32 pointer-events-none z-10"
          style={{
            background: "linear-gradient(to bottom, hsl(0 0% 4%) 0%, transparent 100%)",
          }}
        />

        <AmbientDots count={50} />

        <div className="relative z-20 max-w-3xl mx-auto px-8 pt-32 pb-8">
          {/* ── Life & Events ── */}
          <AboutEditorialSection
            sectionRef={lifeSectionRef}
            inView={lifeInView}
            eyebrow="Life & Events"
            title="Path and milestones"
            description="A loose chronology of study, craft, and shipped work — awards, roles, and the experiments that led here."
          >
            <motion.div
              className="min-w-0 flex-1 space-y-6 md:space-y-7 border-l border-foreground/[0.08] pl-6 md:pl-7"
              variants={aboutEditorialStaggerVariants}
              initial="hidden"
              animate={lifeInView ? "show" : "hidden"}
            >
              {LIFE_EVENTS.map((event) => (
                <LifeEventRow key={event.title} event={event} />
              ))}
            </motion.div>
          </AboutEditorialSection>

          {/* ── Photography — shared editorial shell + image grid ── */}
          <AboutEditorialSection
            sectionRef={photoSectionRef}
            inView={photoInView}
            eyebrow="Photography"
            title="Selected frames"
            description="Personal stills from travel and everyday light — composed quietly, without narrative noise."
          >
            <motion.div
              className="min-w-0 flex-1 flex flex-col gap-3 md:gap-4"
              variants={photoEditorialGridVariants}
              initial="hidden"
              animate={photoInView ? "show" : "hidden"}
            >
              {PHOTO_EDITORIAL_PAIR_ROWS.map((pair, rowIdx) => (
                <motion.div
                  key={rowIdx}
                  variants={photoEditorialRowVariants}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4"
                >
                  {pair.map((photo) => (
                    <EditorialPhotoFrame
                      key={photo.id}
                      photo={photo}
                      layout="pair"
                      onOpen={() => openPhoto(photoIndexById(photo.id))}
                    />
                  ))}
                </motion.div>
              ))}
              <motion.div variants={photoEditorialRowVariants}>
                <EditorialPhotoFrame
                  photo={PHOTO_EDITORIAL_PANORAMIC}
                  layout="panoramic"
                  onOpen={() => openPhoto(photoIndexById(PHOTO_EDITORIAL_PANORAMIC.id))}
                />
              </motion.div>
            </motion.div>
          </AboutEditorialSection>

          {/* ── Movement ── */}
          <AboutEditorialSection
            sectionRef={movementSectionRef}
            inView={movementInView}
            eyebrow="Movement"
            title="Body and rhythm"
            description="Sports as a small resilience metaphor — structure that holds, breaks, and comes back together."
          >
            <motion.div
              className="min-w-0 w-full flex-1 flex flex-wrap content-start items-start justify-start gap-x-16 gap-y-12 md:gap-x-20 md:gap-y-14 lg:gap-x-24"
              variants={aboutEditorialStaggerVariants}
              initial="hidden"
              animate={movementInView ? "show" : "hidden"}
            >
              {SPORTS_DATA.map((sport) => (
                <SportNode key={sport.name} sport={sport} inView={movementReplay} />
              ))}
            </motion.div>
          </AboutEditorialSection>

          {/* ── Daily Life ── */}
          <AboutEditorialSection
            sectionRef={dailySectionRef}
            inView={dailyInView}
            rowCrossAlign="center"
            eyebrow="Daily Life"
            title="Outside the studio"
            description="The rituals, media, and motion that keep thinking grounded — nothing performative, just what actually shows up."
          >
            <motion.div
              className="min-w-0 flex-1 w-full max-w-full flex flex-wrap content-start items-start justify-start gap-3 md:gap-4"
              variants={aboutEditorialTextVariants}
              initial="hidden"
              animate={dailyInView ? "show" : "hidden"}
            >
              {DAILY_ITEMS.map((item) => (
                <DailyTag key={item} label={item} />
              ))}
            </motion.div>
          </AboutEditorialSection>

          {/* ── Connect ── */}
          <AboutEditorialSection
            id="connect"
            sectionRef={connectSectionRef}
            inView={connectInView}
            compactBottom
            eyebrow="Connect"
            title="Coffee or a climb?"
            description="I'm in Seattle and easy to reach. If you want to talk design, AI, or whatever you're building, the invitation is open: an espresso, a bouldering session, or a plain email."
          >
            <motion.div
              className="min-w-0 flex-1 w-full flex flex-col items-start gap-6"
              variants={aboutEditorialTextVariants}
              initial="hidden"
              animate={connectInView ? "show" : "hidden"}
            >
              <BoulderWall onTopOut={() => setToppedOut(true)} />
              <div className="flex w-full flex-wrap items-center justify-end gap-4 md:gap-6">
                <ConnectRock
                  href="mailto:malikzhang19@gmail.com"
                  label="Email me"
                  icon={Mail}
                  lit={toppedOut}
                  delay={0}
                  shape={0}
                />
                <ConnectRock
                  href="https://www.linkedin.com/in/malik-zhang"
                  label="LinkedIn"
                  icon={Linkedin}
                  lit={toppedOut}
                  delay={0.12}
                  shape={1}
                  external
                />
              </div>
            </motion.div>
          </AboutEditorialSection>

          {/* Terminal dot */}
          <motion.div
            className="flex justify-center pt-8 pb-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="w-[3px] h-[3px] rounded-full bg-foreground/10" />
          </motion.div>
        </div>

        {/* Back to home — same bottom-exit pattern as the case studies'
            "Back to all work". Padding matches the Footer below so their left
            edges align. */}
        {onBack ? (
          <div className="relative z-20 px-6 md:px-16 lg:px-20 pt-4 pb-2">
            <div className="max-w-content mx-auto">
              <button
                type="button"
                onClick={onBack}
                aria-label="Back to home"
                className="group flex items-center gap-2 min-h-11 -ml-1 px-1 text-sm text-foreground/72 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 rounded-sm transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
                Back to home
              </button>
            </div>
          </div>
        ) : null}

        <div className="relative z-20">
          <Footer onSectionClick={onSectionClick} />
        </div>

        {activePhotoIndex !== null && (
          <PhotographyLightbox
            photos={PHOTOS}
            activeIndex={activePhotoIndex}
            onClose={closePhoto}
            onNavigate={navigatePhoto}
          />
        )}
    </div>
  );
};

export default AboutDeepContent;
