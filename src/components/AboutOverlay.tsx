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
  orbitSpeed: number;
  size: number;
  jitter: number;
  layer: "back" | "front";
}

const SplashCluster = ({ data, delay }: { data: SplashClusterData; delay: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<DotParticle[]>([]);
  const animRef = useRef(0);
  const hoveredRef = useRef(false);
  const splashRef = useRef(0);
  const splashVelRef = useRef(0);

  const DOT_COUNT = 62;
  const INNER_RADIUS = 26;
  const ORBIT_RADIUS = 52;
  const SPLASH_RADIUS = 90;
  const CANVAS_SIZE = 220;
  const CENTER = CANVAS_SIZE / 2;

  useEffect(() => {
    const dots: DotParticle[] = [];
    for (let i = 0; i < DOT_COUNT; i++) {
      const angle = (Math.PI * 2 * i) / DOT_COUNT + (Math.random() - 0.5) * 0.35;
      const radius = INNER_RADIUS + Math.random() * (ORBIT_RADIUS - INNER_RADIUS);
      dots.push({
        angle,
        radius,
        orbitSpeed: (0.0012 + Math.random() * 0.0018) * (Math.random() < 0.5 ? -1 : 1),
        size: 0.7 + Math.random() * 1.15,
        jitter: Math.random() * Math.PI * 2,
        layer: Math.random() < 0.28 ? "front" : "back",
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
    const target = hoveredRef.current ? 1 : 0;

    splashVelRef.current += (target - splashRef.current) * 0.09;
    splashVelRef.current *= 0.86;
    splashRef.current += splashVelRef.current;

    const tRaw = splashRef.current;
    const t = Math.max(0, Math.min(1, tRaw));
    const time = performance.now() * 0.001;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    const clearRadius = 18 + 30 * t;

    const drawParticles = (layer: "back" | "front") => {
      dotsRef.current.forEach((dot, i) => {
        if (dot.layer !== layer) return;

        dot.angle += dot.orbitSpeed * (1 - 0.25 * t);

        const expanded = dot.radius + (SPLASH_RADIUS - ORBIT_RADIUS) + Math.sin(time * 0.8 + dot.jitter) * 4;
        let r = dot.radius + (expanded - dot.radius) * t;
        if (r < clearRadius) r = clearRadius + (i % 4) * 0.8;

        const x = CENTER + Math.cos(dot.angle) * r + Math.sin(time * 0.55 + dot.jitter) * 0.22;
        const y = CENTER + Math.sin(dot.angle) * r + Math.cos(time * 0.45 + dot.jitter * 1.3) * 0.22;

        const alpha = (dot.layer === "front" ? 0.18 : 0.12) + t * 0.06;
        ctx.beginPath();
        ctx.arc(x, y, dot.size * (dot.layer === "front" ? 1.06 : 1), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(225, 222, 215, ${alpha})`;
        ctx.fill();
      });
    };

    drawParticles("back");

    const coreGrad = ctx.createRadialGradient(CENTER, CENTER, 0, CENTER, CENTER, 34 + t * 10);
    coreGrad.addColorStop(0, `rgba(220, 220, 230, ${0.05 + t * 0.03})`);
    coreGrad.addColorStop(1, "rgba(220, 220, 230, 0)");
    ctx.beginPath();
    ctx.arc(CENTER, CENTER, 34 + t * 10, 0, Math.PI * 2);
    ctx.fillStyle = coreGrad;
    ctx.fill();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const titleAlpha = 0.62 * (1 - t);
    if (titleAlpha > 0.01) {
      ctx.font = "500 10px 'Space Grotesk', sans-serif";
      ctx.fillStyle = `rgba(235, 232, 225, ${titleAlpha})`;
      ctx.fillText(data.label, CENTER, CENTER);
    }

    ctx.font = "300 11px 'Space Grotesk', sans-serif";
    const lineHeight = 14;
    const baseY = CENTER - ((data.lines.length - 1) * lineHeight) / 2;
    data.lines.forEach((line, i) => {
      const lineProgress = Math.max(0, Math.min(1, t * 1.18 - i * 0.16));
      if (lineProgress <= 0) return;
      const y = baseY + i * lineHeight + (1 - lineProgress) * 2.2;
      ctx.fillStyle = `rgba(235, 232, 225, ${0.78 * lineProgress})`;
      ctx.fillText(line, CENTER, y);
    });

    drawParticles("front");

    const ringR = ORBIT_RADIUS + (SPLASH_RADIUS - ORBIT_RADIUS) * t;
    ctx.beginPath();
    ctx.arc(CENTER, CENTER, ringR, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(200, 200, 215, ${0.02 + t * 0.03})`;
    ctx.lineWidth = 0.4;
    ctx.stroke();

    animRef.current = requestAnimationFrame(draw);
  }, [CENTER]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_SIZE * dpr;
    canvas.height = CANVAS_SIZE * dpr;
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  return (
    <motion.div
      className="absolute cursor-default select-none"
      style={{ ...data.position, width: CANVAS_SIZE, height: CANVAS_SIZE }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, delay, ease: "easeOut" }}
      onMouseEnter={() => {
        hoveredRef.current = true;
      }}
      onMouseLeave={() => {
        hoveredRef.current = false;
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
        className="absolute inset-0"
      />
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
