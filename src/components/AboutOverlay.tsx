import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import profileImage from "@/assets/profile-malik.jpg";

// ── Values for the bottom-right dot cluster ──
const VALUES = [
  "Design as behavior",
  "Systems as language",
  "Meaningful interaction",
  "Prototyping to think",
];

// ── Edge clusters (secondary) ──
interface ClusterData {
  label: string;
  position: { left: string; top: string };
  lines?: string[];
}

const CLUSTERS: ClusterData[] = [
  {
    label: "Who I Am",
    position: { left: "8%", top: "20%" },
    lines: ["Maker", "Product designer", "Systems thinker"],
  },
  {
    label: "Outside of Design",
    position: { left: "92%", top: "18%" },
    lines: ["Photography", "Travel", "Basketball", "Cycling", "Swimming", "Food"],
  },
  {
    label: "How I Build",
    position: { left: "7%", top: "82%" },
    lines: ["Experimentation", "Prototyping early", "Learning through craft"],
  },
];

const ClusterNode = ({
  cluster,
  index,
}: {
  cluster: ClusterData;
  index: number;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="absolute flex flex-col items-center gap-2 -translate-x-1/2 -translate-y-1/2 cursor-default select-none"
      style={{ left: cluster.position.left, top: cluster.position.top }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 2.4 + index * 0.1, ease: "easeOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        className="w-[3px] h-[3px] rounded-full bg-foreground/8"
        animate={{ scale: hovered ? 3 : 1, opacity: hovered ? 0.3 : 0.08 }}
        transition={{ duration: 0.5 }}
      />
      <motion.span
        className="text-[8px] uppercase tracking-[0.3em] text-foreground/12 whitespace-nowrap"
        animate={{ opacity: hovered ? 0.4 : 0.12 }}
        transition={{ duration: 0.4 }}
      >
        {cluster.label}
      </motion.span>
      {cluster.lines && (
        <div className="flex flex-col items-center gap-1 mt-1">
          {cluster.lines.map((line, li) => (
            <motion.span
              key={line}
              className="text-[10px] text-foreground/50 font-light whitespace-nowrap"
              initial={false}
              animate={{
                opacity: hovered ? 0.55 : 0,
                y: hovered ? 0 : 4,
                filter: hovered ? "blur(0px)" : "blur(3px)",
              }}
              transition={{ duration: 0.4, delay: hovered ? li * 0.05 : 0, ease: "easeOut" }}
            >
              {line}
            </motion.span>
          ))}
        </div>
      )}
    </motion.div>
  );
};

// ── Values Dot Cluster (bottom-right) ──
// Circle of dots that splash outward on hover, revealing text in the center
interface DotParticle {
  angle: number;
  radius: number;
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  size: number;
}

const ValuesCluster = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hovered, setHovered] = useState(false);
  const hoveredRef = useRef(false);
  const dotsRef = useRef<DotParticle[]>([]);
  const animRef = useRef(0);
  const splashRef = useRef(0); // 0 = gathered, 1 = splashed

  const DOT_COUNT = 60;
  const CLUSTER_RADIUS = 45;
  const SPLASH_RADIUS = 90;
  const CANVAS_SIZE = 240;
  const CENTER = CANVAS_SIZE / 2;

  // Initialize dots in a filled circle
  useEffect(() => {
    const dots: DotParticle[] = [];
    for (let i = 0; i < DOT_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * CLUSTER_RADIUS;
      dots.push({
        angle,
        radius: r,
        baseX: CENTER + Math.cos(angle) * r,
        baseY: CENTER + Math.sin(angle) * r,
        x: CENTER + Math.cos(angle) * r,
        y: CENTER + Math.sin(angle) * r,
        size: 1 + Math.random() * 1.2,
      });
    }
    dotsRef.current = dots;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const targetSplash = hoveredRef.current ? 1 : 0;
    splashRef.current += (targetSplash - splashRef.current) * 0.06;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    const t = splashRef.current;
    const time = performance.now() / 1000;

    dotsRef.current.forEach((dot) => {
      // Splashed position: push outward
      const splashedR = SPLASH_RADIUS + Math.sin(dot.angle * 3 + time * 0.5) * 12;
      const splashedX = CENTER + Math.cos(dot.angle) * splashedR;
      const splashedY = CENTER + Math.sin(dot.angle) * splashedR;

      // Interpolate
      dot.x += ((dot.baseX + (splashedX - dot.baseX) * t) - dot.x) * 0.12;
      dot.y += ((dot.baseY + (splashedY - dot.baseY) * t) - dot.y) * 0.12;

      // Subtle drift
      dot.x += Math.sin(time * 0.8 + dot.angle * 2) * 0.15;
      dot.y += Math.cos(time * 0.6 + dot.angle * 3) * 0.15;

      const alpha = 0.12 + t * 0.08;
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(225, 222, 215, ${alpha})`;
      ctx.fill();
    });

    // Draw a subtle ring
    ctx.beginPath();
    ctx.arc(CENTER, CENTER, CLUSTER_RADIUS + (SPLASH_RADIUS - CLUSTER_RADIUS) * t, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(200, 200, 215, ${0.04 + t * 0.03})`;
    ctx.lineWidth = 0.5;
    ctx.stroke();

    animRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_SIZE * dpr;
    canvas.height = CANVAS_SIZE * dpr;
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  useEffect(() => {
    hoveredRef.current = hovered;
  }, [hovered]);

  return (
    <motion.div
      className="absolute cursor-default select-none"
      style={{ right: "6%", bottom: "12%", width: CANVAS_SIZE, height: CANVAS_SIZE }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, delay: 2.0, ease: "easeOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <canvas
        ref={canvasRef}
        style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
        className="absolute inset-0"
      />

      {/* Label below */}
      <motion.span
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[8px] uppercase tracking-[0.3em] text-foreground/12 whitespace-nowrap"
        animate={{ opacity: hovered ? 0.4 : 0.12 }}
        transition={{ duration: 0.4 }}
      >
        What I Care About
      </motion.span>

      {/* Center text — revealed when dots splash */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="flex flex-col items-center gap-2">
          {VALUES.map((value, i) => (
            <motion.span
              key={value}
              className="text-[11px] text-foreground/65 font-light tracking-wide whitespace-nowrap"
              initial={false}
              animate={{
                opacity: hovered ? 0.7 : 0,
                y: hovered ? 0 : 3,
                filter: hovered ? "blur(0px)" : "blur(4px)",
              }}
              transition={{
                duration: 0.5,
                delay: hovered ? 0.15 + i * 0.08 : 0,
                ease: "easeOut",
              }}
            >
              {value}
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
            {/* Text — left of portrait */}
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

            {/* Portrait */}
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

      {/* Edge cluster nodes */}
      {isVisible &&
        CLUSTERS.map((cluster, i) => (
          <ClusterNode key={cluster.label} cluster={cluster} index={i} />
        ))}

      {/* Values dot cluster — bottom right */}
      {isVisible && <ValuesCluster />}
    </motion.div>
  );
};

export default AboutOverlay;
