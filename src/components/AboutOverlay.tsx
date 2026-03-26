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
    position: { left: "3%", top: "10%" },
  },
  {
    label: "Outside of Design",
    lines: ["Photography", "Travel", "Basketball", "Cycling", "Swimming", "Food"],
    position: { right: "3%", top: "10%" },
  },
  {
    label: "How I Build",
    lines: ["Experimentation", "Prototyping early", "Learning through craft"],
    position: { left: "3%", bottom: "10%" },
  },
  {
    label: "What I Care About",
    lines: ["Design as behavior", "Systems as language", "Meaningful interaction", "Prototyping to think"],
    position: { right: "3%", bottom: "10%" },
  },
];

// ── Reusable dot-splash cluster component ──
interface DotParticle {
  angle: number;
  radius: number;
  x: number;
  y: number;
  size: number;
}

const CONTAINER_SIZE = 280;
const DOT_COUNT = 90;
const INNER_RADIUS = 40;
const ORBIT_RADIUS = 80;
const SPLASH_RADIUS = 120;

const SplashCluster = ({ data, delay }: { data: SplashClusterData; delay: number }) => {
  const [hovered, setHovered] = useState(false);
  const hoveredRef = useRef(false);
  const dotsRef = useRef<DotParticle[]>([]);
  const particleElsRef = useRef<HTMLDivElement>(null);
  const animRef = useRef(0);
  const splashRef = useRef(0);

  useEffect(() => {
    const dots: DotParticle[] = [];
    for (let i = 0; i < DOT_COUNT; i++) {
      const angle = (Math.PI * 2 * i) / DOT_COUNT + (Math.random() - 0.5) * 0.6;
      const r = INNER_RADIUS + Math.random() * (ORBIT_RADIUS - INNER_RADIUS);
      dots.push({ angle, radius: r, x: 0, y: 0, size: 0.8 + Math.random() * 1.2 });
    }
    dotsRef.current = dots;
  }, []);

  const tick = useCallback(() => {
    const container = particleElsRef.current;
    if (!container) return;
    const children = container.children as HTMLCollectionOf<HTMLElement>;
    if (children.length === 0) { animRef.current = requestAnimationFrame(tick); return; }

    const targetSplash = hoveredRef.current ? 1 : 0;
    splashRef.current += (targetSplash - splashRef.current) * 0.06;
    const t = splashRef.current;
    const time = performance.now() / 1000;

    dotsRef.current.forEach((dot, i) => {
      if (!children[i]) return;
      const orbitAngle = dot.angle + time * 0.08 + i * 0.001;

      const defaultR = dot.radius;
      const splashR = SPLASH_RADIUS + Math.sin(orbitAngle * 3 + time * 0.4) * 8;
      const currentR = defaultR + (splashR - defaultR) * t;

      const targetX = Math.cos(orbitAngle) * currentR;
      const targetY = Math.sin(orbitAngle) * currentR;

      dot.x += (targetX - dot.x) * 0.1;
      dot.y += (targetY - dot.y) * 0.1;

      dot.x += Math.sin(time * 0.6 + dot.angle * 2) * 0.12;
      dot.y += Math.cos(time * 0.5 + dot.angle * 3) * 0.12;

      const alpha = 0.12 + t * 0.06;
      children[i].style.transform = `translate(${dot.x}px, ${dot.y}px)`;
      children[i].style.opacity = String(alpha);
    });

    animRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [tick]);

  useEffect(() => { hoveredRef.current = hovered; }, [hovered]);

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
      {/* Particle shell */}
      <div
        ref={particleElsRef}
        className="absolute inset-0"
        style={{ pointerEvents: "none" }}
      >
        {dotsRef.current.length === 0
          ? Array.from({ length: DOT_COUNT }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: "50%",
                  top: "50%",
                  width: 2,
                  height: 2,
                  background: "rgba(225,222,215,0.12)",
                  willChange: "transform",
                }}
              />
            ))
          : dotsRef.current.map((dot, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: "50%",
                  top: "50%",
                  width: dot.size * 2,
                  height: dot.size * 2,
                  marginLeft: -dot.size,
                  marginTop: -dot.size,
                  background: "rgba(225,222,215,0.12)",
                  willChange: "transform",
                }}
              />
            ))}
      </div>

      {/* Text core */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <motion.span
          className="text-[9px] uppercase tracking-[0.25em] text-foreground/50 whitespace-nowrap absolute"
          animate={{
            opacity: hovered ? 0 : 0.5,
            scale: hovered ? 0.92 : 1,
            filter: hovered ? "blur(3px)" : "blur(0px)",
          }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {data.label}
        </motion.span>

        <div className="flex flex-col items-center gap-1.5 absolute">
          {data.lines.map((line, i) => (
            <motion.span
              key={line}
              className="text-[11px] text-foreground/80 font-light tracking-wide whitespace-nowrap"
              initial={false}
              animate={{
                opacity: hovered ? 0.8 : 0,
                y: hovered ? 0 : 2,
                filter: hovered ? "blur(0px)" : "blur(4px)",
              }}
              transition={{
                duration: 0.4,
                delay: hovered ? 0.1 + i * 0.055 : 0,
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
      {isVisible && (
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            background: "radial-gradient(ellipse 55% 50% at 50% 48%, rgba(8,8,10,0.6) 0%, rgba(8,8,10,0.2) 50%, transparent 100%)",
          }}
        />
      )}

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
              <div className="absolute -inset-20" style={{ background: "radial-gradient(circle, rgba(200,200,220,0.05) 0%, rgba(200,200,220,0.015) 40%, transparent 65%)", borderRadius: "50%" }} />
              <div className="absolute -inset-10" style={{ background: "radial-gradient(circle, rgba(200,200,220,0.03) 0%, transparent 55%)", borderRadius: "50%" }} />
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
              <motion.div
                className="absolute inset-0"
                style={{ borderRadius: "28px", boxShadow: "0 0 60px rgba(200,200,220,0.025), 0 0 120px rgba(200,200,220,0.012)" }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
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
