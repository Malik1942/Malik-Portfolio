import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Footer from "@/components/Footer";
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
  { id: 1, src: "/images/photography/1.jpg", alt: "Photography image 1", priority: true },
  { id: 2, src: "/images/photography/2.jpg", alt: "Photography image 2" },
  { id: 3, src: "/images/photography/3.jpg", alt: "Photography image 3" },
  { id: 4, src: "/images/photography/4.jpg", alt: "Photography image 4" },
  { id: 5, src: "/images/photography/5.jpg", alt: "Photography image 5" },
  { id: 6, src: "/images/photography/6.jpg", alt: "Photography image 6" },
  { id: 7, src: "/images/photography/7.jpg", alt: "Photography image 7" },
  { id: 8, src: "/images/photography/8.jpg", alt: "Photography image 8" },
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

const photoFooterBarVariants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      delay: 0.52,
      ease: easeOutExpo,
    },
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
        className="fixed inset-0 z-[100] bg-background/92 backdrop-blur-md"
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
          className="absolute left-3 top-1/2 z-[101] hidden -translate-y-1/2 items-center justify-center rounded-full p-3 text-foreground/45 transition-colors duration-300 hover:text-foreground md:flex cursor-pointer"
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
          className="absolute right-3 top-1/2 z-[101] hidden -translate-y-1/2 items-center justify-center rounded-full p-3 text-foreground/45 transition-colors duration-300 hover:text-foreground md:flex cursor-pointer"
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
            className="max-h-full max-w-full object-contain select-none rounded-[10px]"
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
    className="group block w-full cursor-pointer rounded-[10px] text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20"
    aria-label={`Open ${photo.alt}`}
  >
    <div
      className={`relative w-full overflow-hidden rounded-[10px] bg-secondary/[0.08] ${
        layout === "pair" ? "aspect-[16/10]" : "aspect-[2.35/1] max-h-[min(30vh,340px)]"
      }`}
    >
      <img
        src={photo.src}
        alt={photo.alt}
        className="h-full w-full rounded-[10px] object-cover object-center transition-[filter] duration-[420ms] ease-out group-hover:brightness-[1.03]"
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
  { year: "2026", title: "FigBuild 2026", caption: "1st Place — NeuraLyfe", type: "award" },
  { year: "2026", title: "FlowPrint", caption: "Led consumer 3D printing redesign", type: "design" },
  { year: "2025", title: "Aura", caption: "AI-driven wearable for motion sickness", type: "design" },
  { year: "2025", title: "NeuraLyfe", caption: "Making invisible brain trauma visible", type: "design" },
  { year: "2025", title: "Inspire Ocean", caption: "AI content generation platform", type: "design" },
  { year: "2024", title: "Studio Waters", caption: "Predictive analytics visualization", type: "design" },
  { year: "2024", title: "Design Systems", caption: "Deep dive into systematic design thinking", type: "education" },
  { year: "2023", title: "Started Building", caption: "First experiments with design + code", type: "education" },
];

const LifeEventRow = ({ event }: { event: LifeEvent }) => {
  const [hovered, setHovered] = useState(false);

  const dotColor = event.type === "award" 
    ? "bg-amber-400/40" 
    : event.type === "education" 
    ? "bg-blue-300/30" 
    : "bg-foreground/15";

  return (
    <motion.div
      variants={aboutEditorialItemVariants}
      className="flex items-start gap-4 group cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Year */}
      <span className="text-[13px] text-foreground/60 font-light tracking-wider w-12 pt-0.5 flex-shrink-0">
        {event.year}
      </span>

      {/* Node dot */}
      <motion.div
        className={`w-[6px] h-[6px] rounded-full mt-[7px] flex-shrink-0 ${dotColor}`}
        animate={{
          scale: hovered ? 2 : 1,
          opacity: hovered ? 0.8 : undefined,
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Content */}
      <div className="flex flex-col gap-0.5">
        <motion.span
          className="text-[15px] text-foreground/80 font-light"
          animate={{ opacity: hovered ? 0.95 : 0.8 }}
          transition={{ duration: 0.4 }}
        >
          {event.title}
        </motion.span>
        <motion.span
          className="text-[13px] text-foreground/50 font-light"
          animate={{ opacity: hovered ? 0.7 : 0.5 }}
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

type SportType = "basketball" | "cycling" | "swimming";

const SPORTS_DATA: { name: string; type: SportType }[] = [
  { name: "Basketball", type: "basketball" },
  { name: "Cycling", type: "cycling" },
  { name: "Swimming", type: "swimming" },
];

function createParticles(type: SportType, cx: number, cy: number, r: number): ResilientParticle[] {
  const particles: ResilientParticle[] = [];
  const count = 28;

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

const ResilienceCanvas = ({ type, isHovered }: { type: SportType; isHovered: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<ResilientParticle[]>([]);
  const animRef = useRef(0);
  const phaseRef = useRef<"stable" | "disrupted" | "recovering">("stable");
  const timerRef = useRef(0);
  const hoveredRef = useRef(false);

  useEffect(() => { hoveredRef.current = isHovered; }, [isHovered]);

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
      const dt = (now - lastTime) / 1000;
      lastTime = now;

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
          if (i === 0) ctx.moveTo(p.homeX, p.homeY);
          else ctx.lineTo(p.homeX, p.homeY);
        });
        ctx.closePath();
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
  }, [init]);

  return (
    <canvas
      ref={canvasRef}
      className="w-[120px] h-[120px]"
      style={{ imageRendering: "auto" }}
    />
  );
};

const SportNode = ({ sport }: { sport: (typeof SPORTS_DATA)[0] }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      variants={aboutEditorialItemVariants}
      className="flex flex-col items-center gap-3 cursor-default w-[132px] flex-shrink-0"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <ResilienceCanvas type={sport.type} isHovered={hovered} />
      <motion.span
        className="text-[12px] uppercase tracking-[0.3em] text-foreground/50"
        animate={{ opacity: hovered ? 0.9 : 0.5 }}
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
  "Basketball", "Cycling", "Snowboarding", "Swimming",
];

const DailyTag = ({ label }: { label: string }) => (
  <span className="text-[13px] text-foreground/50 font-light px-4 py-2.5 rounded-sm border border-foreground/[0.1] hover:text-foreground/80 hover:border-foreground/[0.18] transition-colors duration-300 cursor-default">
    {label}
  </span>
);

// ── Main component ──
const AboutDeepContent = ({
  isVisible,
  onMainProjectsClick,
}: {
  isVisible: boolean;
  onMainProjectsClick?: () => void;
}) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const photoSectionRef = useRef<HTMLElement>(null);
  const lifeSectionRef = useRef<HTMLElement>(null);
  const movementSectionRef = useRef<HTMLElement>(null);
  const dailySectionRef = useRef<HTMLElement>(null);

  const inViewOpts = { once: true, margin: "0px 0px -6% 0px" as const, amount: 0.15 as const };
  const photoInView = useInView(photoSectionRef, inViewOpts);
  const lifeInView = useInView(lifeSectionRef, inViewOpts);
  const movementInView = useInView(movementSectionRef, inViewOpts);
  const dailyInView = useInView(dailySectionRef, inViewOpts);

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
          {/* ── Photography — shared editorial shell + image grid ── */}
          <AboutEditorialSection
            sectionRef={photoSectionRef}
            inView={photoInView}
            eyebrow="Photography"
            title="Selected frames"
            description="Personal stills from travel and everyday light — composed quietly, without narrative noise."
            footer={
              <motion.div
                className="mt-10 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t border-foreground/[0.07] pt-5"
                variants={photoFooterBarVariants}
                initial="hidden"
                animate={photoInView ? "show" : "hidden"}
              >
                <span className="text-[10px] uppercase tracking-[0.28em] text-foreground/38">
                  Archive · 8 frames
                </span>
                <span className="text-[10px] text-foreground/32 tracking-[0.12em]">
                  Tap any image to view full size
                </span>
              </motion.div>
            }
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
                <SportNode key={sport.name} sport={sport} />
              ))}
            </motion.div>
          </AboutEditorialSection>

          {/* ── Daily Life ── */}
          <AboutEditorialSection
            sectionRef={dailySectionRef}
            inView={dailyInView}
            rowCrossAlign="center"
            compactBottom
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

        <div className="relative z-20">
          <Footer onMainProjectsClick={onMainProjectsClick} />
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
