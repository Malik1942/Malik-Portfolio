import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";

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

// ── Section label ──
const SectionLabel = ({ children, delay = 0 }: { children: string; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  
  return (
    <motion.div
      ref={ref}
      className="flex items-center gap-4 mb-16"
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
    >
      <div className="w-[4px] h-[4px] rounded-full bg-foreground/20" />
      <span className="text-[9px] uppercase tracking-[0.35em] text-foreground/25">
        {children}
      </span>
      <div className="flex-1 h-px bg-foreground/[0.04]" />
    </motion.div>
  );
};

// ── Photography Gallery ──
const PHOTO_PLACEHOLDERS = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  aspect: [1, 1.4, 0.75, 1.2, 0.8, 1, 1.3, 0.9, 1.1, 0.7][i],
  hue: [220, 280, 200, 320, 180, 260, 240, 300, 210, 190][i],
}));

const PhotoNode = ({ photo, index }: { photo: typeof PHOTO_PLACEHOLDERS[0]; index: number }) => {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      className="relative cursor-pointer group"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.8, delay: index * 0.06, ease: "easeOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Dot cluster (default state) */}
      <motion.div
        className="relative overflow-hidden rounded-sm"
        style={{ aspectRatio: photo.aspect }}
        animate={{
          opacity: hovered ? 0 : 1,
        }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-[3px] p-3">
          {Array.from({ length: 24 }).map((_, di) => (
            <motion.div
              key={di}
              className="rounded-full bg-foreground/[0.08]"
              style={{ width: 2 + Math.random() * 2, height: 2 + Math.random() * 2 }}
              animate={{
                opacity: [0.05, 0.12, 0.05],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Image reveal (hover state) */}
      <motion.div
        className="absolute inset-0 rounded-sm overflow-hidden"
        style={{ aspectRatio: photo.aspect }}
        animate={{
          opacity: hovered ? 1 : 0,
          scale: hovered ? 1 : 0.95,
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div
          className="w-full h-full"
          style={{
            background: `linear-gradient(${135 + index * 20}deg, 
              hsl(${photo.hue}, 15%, 12%) 0%, 
              hsl(${photo.hue + 30}, 12%, 18%) 50%,
              hsl(${photo.hue - 10}, 10%, 8%) 100%)`,
          }}
        />
        <div className="absolute inset-0 flex items-end p-3">
          <span className="text-[9px] text-foreground/30 uppercase tracking-[0.2em]">
            Photo {index + 1}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

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

const LifeEventNode = ({ event, index }: { event: LifeEvent; index: number }) => {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const dotColor = event.type === "award" 
    ? "bg-amber-400/40" 
    : event.type === "education" 
    ? "bg-blue-300/30" 
    : "bg-foreground/15";

  return (
    <motion.div
      ref={ref}
      className="flex items-start gap-4 group cursor-default"
      initial={{ opacity: 0, x: -10 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: "easeOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Year */}
      <span className="text-[10px] text-foreground/20 font-light tracking-wider w-10 pt-0.5 flex-shrink-0">
        {event.year}
      </span>

      {/* Node dot */}
      <motion.div
        className={`w-[5px] h-[5px] rounded-full mt-1 flex-shrink-0 ${dotColor}`}
        animate={{
          scale: hovered ? 2 : 1,
          opacity: hovered ? 0.8 : undefined,
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Content */}
      <div className="flex flex-col gap-0.5">
        <motion.span
          className="text-[12px] text-foreground/50 font-light"
          animate={{ opacity: hovered ? 0.85 : 0.5 }}
          transition={{ duration: 0.4 }}
        >
          {event.title}
        </motion.span>
        <motion.span
          className="text-[10px] text-foreground/20 font-light"
          animate={{ opacity: hovered ? 0.45 : 0.2 }}
          transition={{ duration: 0.4 }}
        >
          {event.caption}
        </motion.span>
      </div>
    </motion.div>
  );
};

// ── Movement / Sport Node ──
interface SportData {
  name: string;
  motionType: "bounce" | "circular" | "wave";
}

const SPORTS: SportData[] = [
  { name: "Basketball", motionType: "bounce" },
  { name: "Cycling", motionType: "circular" },
  { name: "Swimming", motionType: "wave" },
];

const SportNode = ({ sport, index }: { sport: SportData; index: number }) => {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const bounceAnim = { y: [0, -6, 0] };
  const circularAnim = { rotate: [0, 360] };
  const waveAnim = { x: [0, 5, -5, 0] };

  const motionAnim = sport.motionType === "bounce" ? bounceAnim 
    : sport.motionType === "circular" ? circularAnim 
    : waveAnim;

  const motionTransition = sport.motionType === "bounce" 
    ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" as const }
    : sport.motionType === "circular"
    ? { duration: 8, repeat: Infinity, ease: "linear" as const }
    : { duration: 3, repeat: Infinity, ease: "easeInOut" as const };

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center gap-3 cursor-default"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15, ease: "easeOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Orbit trail */}
      <div className="relative w-16 h-16 flex items-center justify-center">
        <motion.div
          className="absolute w-10 h-10 rounded-full border border-foreground/[0.05]"
          animate={{ scale: hovered ? 1.2 : 1, opacity: hovered ? 0.12 : 0.05 }}
          transition={{ duration: 0.6 }}
        />
        <motion.div
          className="w-[6px] h-[6px] rounded-full bg-foreground/20"
          animate={{
            ...motionAnim,
            scale: hovered ? 1.8 : 1,
            opacity: hovered ? 0.6 : 0.2,
          }}
          transition={motionTransition}
        />
      </div>

      <motion.span
        className="text-[9px] uppercase tracking-[0.3em] text-foreground/20"
        animate={{ opacity: hovered ? 0.55 : 0.2 }}
        transition={{ duration: 0.4 }}
      >
        {sport.name}
      </motion.span>
    </motion.div>
  );
};

// ── Food / Daily life tags ──
const DAILY_ITEMS = [
  "Coffee rituals", "Street food", "Ramen", "Night markets",
  "Home cooking", "Bakeries", "Film photography", "Long walks",
  "Bookstores", "Vinyl records",
];

const DailyTag = ({ label, index }: { label: string; index: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <motion.span
      ref={ref}
      className="text-[10px] text-foreground/15 font-light px-3 py-1.5 rounded-full border border-foreground/[0.04] hover:text-foreground/40 hover:border-foreground/[0.1] transition-all duration-500 cursor-default"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.04 }}
    >
      {label}
    </motion.span>
  );
};

// ── Main component ──
const AboutDeepContent = ({ isVisible }: { isVisible: boolean }) => {
  if (!isVisible) return null;

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

        <div className="relative z-20 max-w-3xl mx-auto px-8 py-32">
          {/* ── Photography ── */}
          <section className="mb-40">
            <SectionLabel>Photography</SectionLabel>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {PHOTO_PLACEHOLDERS.map((photo, i) => (
                <PhotoNode key={photo.id} photo={photo} index={i} />
              ))}
            </div>
            <motion.p
              className="text-[10px] text-foreground/15 font-light mt-6 text-center tracking-wider"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Hover to reveal · Gallery coming soon
            </motion.p>
          </section>

          {/* ── Life / Events ── */}
          <section className="mb-40">
            <SectionLabel delay={0.1}>Life &amp; Events</SectionLabel>
            <div className="flex flex-col gap-5 ml-2">
              {LIFE_EVENTS.map((event, i) => (
                <LifeEventNode key={event.title} event={event} index={i} />
              ))}
            </div>
          </section>

          {/* ── Movement ── */}
          <section className="mb-40">
            <SectionLabel delay={0.1}>Movement</SectionLabel>
            <div className="flex justify-center gap-16 md:gap-24">
              {SPORTS.map((sport, i) => (
                <SportNode key={sport.name} sport={sport} index={i} />
              ))}
            </div>
          </section>

          {/* ── Daily Life ── */}
          <section className="mb-20">
            <SectionLabel delay={0.1}>Daily Life</SectionLabel>
            <div className="flex flex-wrap gap-2 justify-center">
              {DAILY_ITEMS.map((item, i) => (
                <DailyTag key={item} label={item} index={i} />
              ))}
            </div>
          </section>

          {/* Terminal dot */}
          <motion.div
            className="flex justify-center pt-16 pb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="w-[3px] h-[3px] rounded-full bg-foreground/10" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutDeepContent;
