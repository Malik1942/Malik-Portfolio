import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import profileImage from "@/assets/profile-malik.jpg";

// ── All four dot-splash clusters ──
interface SplashClusterData {
  label: string;
  lines: string[];
  position: { right?: string; left?: string; top?: string; bottom?: string };
}

const SPLASH_CLUSTERS: SplashClusterData[] = [
  {
    label: "Who I Am",
    lines: ["Maker", "Product designer", "Systems thinker"],
    position: { left: "8%", top: "14%" },
  },
  {
    label: "Outside of Design",
    lines: ["Photography", "Travel", "Basketball", "Cycling", "Swimming", "Food"],
    position: { right: "8%", top: "14%" },
  },
  {
    label: "How I Build",
    lines: ["Experimentation", "Prototyping early", "Learning through craft"],
    position: { left: "8%", bottom: "14%" },
  },
  {
    label: "What I Care About",
    lines: ["Design as behavior", "Systems as language", "Meaningful interaction", "Prototyping to think"],
    position: { right: "8%", bottom: "14%" },
  },
];

// ── Reusable dot-splash cluster component ──
interface DotParticle {
  angle: number;
  baseRadius: number;
  x: number;
  y: number;
  size: number;
  phase: number;
}

const CONTAINER_SIZE = 260;
const DOT_COUNT = 92;
const TEXT_SAFE_RADIUS = 52;
const BASE_RADIUS = 80;
const SPLASH_RADIUS = 122;

const SplashCluster = ({ data, delay }: { data: SplashClusterData; delay: number }) => {
  const [hovered, setHovered] = useState(false);
  const hoveredRef = useRef(false);
  const dotsRef = useRef<DotParticle[]>([]);
  const particleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animRef = useRef(0);
  const splashRef = useRef(0);

  useEffect(() => {
    dotsRef.current = Array.from({ length: DOT_COUNT }).map((_, i) => {
      const angle = (Math.PI * 2 * i) / DOT_COUNT + (Math.random() - 0.5) * 0.4;
      const phase = Math.random() * Math.PI * 2;
      const baseRadius = BASE_RADIUS + (Math.random() - 0.5) * 12;
      return {
        angle,
        baseRadius,
        x: Math.cos(angle) * baseRadius,
        y: Math.sin(angle) * baseRadius,
        size: 0.7 + Math.random() * 1.3,
        phase,
      };
    });
  }, []);

  const tick = useCallback(() => {
    const dots = dotsRef.current;
    if (dots.length === 0) {
      animRef.current = requestAnimationFrame(tick);
      return;
    }

    const targetSplash = hoveredRef.current ? 1 : 0;
    splashRef.current += (targetSplash - splashRef.current) * 0.08;

    const t = splashRef.current;
    const time = performance.now() / 1000;

    dots.forEach((dot, i) => {
      const node = particleRefs.current[i];
      if (!node) return;

      const orbitAngle = dot.angle + time * 0.12 + i * 0.0016;
      const defaultR = Math.max(TEXT_SAFE_RADIUS, dot.baseRadius + Math.sin(time * 0.55 + dot.phase) * 2.6);
      const splashR = SPLASH_RADIUS + Math.sin(orbitAngle * 2.8 + time * 0.85 + dot.phase) * 10;
      const radius = defaultR + (splashR - defaultR) * t;

      const targetX = Math.cos(orbitAngle) * radius;
      const targetY = Math.sin(orbitAngle) * radius;

      dot.x += (targetX - dot.x) * 0.16;
      dot.y += (targetY - dot.y) * 0.16;

      dot.x += Math.sin(time * 0.9 + dot.phase) * 0.08;
      dot.y += Math.cos(time * 0.85 + dot.phase) * 0.08;

      const scale = dot.size * (1 + t * 0.16);
      node.style.transform = `translate(-50%, -50%) translate(${dot.x}px, ${dot.y}px) scale(${scale})`;
      node.style.opacity = String(0.24 + t * 0.18);
    });

    animRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [tick]);

  useEffect(() => {
    hoveredRef.current = hovered;
  }, [hovered]);

  return (
    <motion.div
      className="absolute cursor-default select-none"
      style={{ ...data.position, width: CONTAINER_SIZE, height: CONTAINER_SIZE }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, delay, ease: "easeOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: DOT_COUNT }).map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              particleRefs.current[i] = el;
            }}
            className="absolute left-1/2 top-1/2 rounded-full"
            style={{
              width: 2,
              height: 2,
              opacity: 0.24,
              background: "hsl(var(--foreground) / 0.72)",
              transform: "translate(-50%, -50%)",
              willChange: "transform, opacity",
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <motion.span
          className="text-[9px] uppercase tracking-[0.25em] text-foreground/65 whitespace-nowrap absolute"
          animate={{
            opacity: hovered ? 0 : 0.65,
            scale: hovered ? 0.94 : 1,
            filter: hovered ? "blur(3px)" : "blur(0px)",
          }}
          transition={{ duration: 0.32, ease: "easeOut" }}
        >
          {data.label}
        </motion.span>

        <div className="flex flex-col items-center gap-1.5 absolute">
          {data.lines.map((line, i) => (
            <motion.span
              key={line}
              className="text-[11px] text-foreground/90 font-light tracking-wide whitespace-nowrap"
              initial={false}
              animate={{
                opacity: hovered ? 0.9 : 0,
                y: hovered ? 0 : 2,
                filter: hovered ? "blur(0px)" : "blur(4px)",
              }}
              transition={{
                duration: 0.38,
                delay: hovered ? 0.1 + i * 0.05 : 0,
                ease: "easeOut",
              }}
            >
              {line}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

interface AboutOverlayProps {
  isVisible: boolean;
  onBack: () => void;
}

const AboutOverlay = ({ isVisible, onBack }: AboutOverlayProps) => {
  return (
    <motion.div
      className="absolute inset-0 z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.8, delay: isVisible ? 0.6 : 0 }}
      style={{ pointerEvents: isVisible ? "auto" : "none" }}
    >
      {/* Center clean field */}

      {/* Back button */}
      <motion.button
        onClick={onBack}
        className="absolute top-8 left-8 flex items-center gap-2 text-xs text-foreground/20 hover:text-foreground/50 transition-colors duration-500 uppercase tracking-[0.15em] z-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.6, delay: isVisible ? 2.4 : 0 }}
      >
        <ArrowLeft className="w-3 h-3" />
        Back
      </motion.button>

      {/* ── Identity Core ── */}
      {isVisible && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="flex items-center gap-6 md:gap-8 px-6">
            <div className="flex flex-col items-end text-right max-w-[380px]">
              <motion.h2
                className="text-[22px] sm:text-[26px] md:text-[30px] text-foreground font-normal leading-[1.4] tracking-wide"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2, delay: 1.0, ease: "easeOut" }}
              >
                I design through making — shaping systems beyond screens.
              </motion.h2>
              <motion.p
                className="text-[10px] text-foreground/30 font-light uppercase tracking-[0.2em] mt-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.3, ease: "easeOut" }}
              >
                Product designer exploring behavior, interaction, and systems.
              </motion.p>
            </div>

            <motion.div
              className="relative flex-shrink-0"
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.4, delay: 1.1, ease: "easeOut" }}
            >
              <div
                className="relative w-44 h-56 sm:w-52 sm:h-64 md:w-60 md:h-72 overflow-hidden"
                style={{
                  borderRadius: "28px",
                  maskImage: "radial-gradient(ellipse 85% 85% at 50% 45%, black 35%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.3) 65%, rgba(0,0,0,0.08) 78%, transparent 90%)",
                  WebkitMaskImage: "radial-gradient(ellipse 85% 85% at 50% 45%, black 35%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.3) 65%, rgba(0,0,0,0.08) 78%, transparent 90%)",
                }}
              >
                <img src={profileImage} alt="Malik Zhang" className="w-full h-full object-cover object-top" />
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Scroll indicator */}
      {isVisible && (
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.8 }}
        >
          <span className="text-[8px] uppercase tracking-[0.3em] text-foreground/12">Scroll</span>
          <motion.div
            className="w-px h-5 bg-foreground/8"
            animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.06, 0.15, 0.06] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      )}

      {/* Four dot-splash clusters in corners */}
      {isVisible &&
        SPLASH_CLUSTERS.map((cluster, i) => (
          <SplashCluster key={cluster.label} data={cluster} delay={2.0 + i * 0.15} />
        ))}
    </motion.div>
  );
};

export default AboutOverlay;
