import { useEffect, useRef, useCallback } from "react";

// ── Project orbs that wander ──
interface Orb {
  label: string;
  subtitle: string;
  color: "red" | "gold";
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseSize: number;
}

const ORB_DEFS = [
  { label: "Aura", subtitle: "Selected Work", color: "red" as const, rx: 0.12, ry: 0.28 },
  { label: "NeuraLyfe", subtitle: "Selected Work", color: "red" as const, rx: 0.35, ry: 0.65 },
  { label: "FlowPrint", subtitle: "Selected Work", color: "red" as const, rx: 0.8, ry: 0.78 },
  { label: "ContentForge", subtitle: "Built with AI", color: "gold" as const, rx: 0.55, ry: 0.22 },
  { label: "InsightLens", subtitle: "Built with AI", color: "gold" as const, rx: 0.5, ry: 0.48 },
  { label: "OneAdvisory", subtitle: "Built with AI", color: "gold" as const, rx: 0.82, ry: 0.38 },
];

const RED = "220, 50, 47";
const GOLD = "250, 200, 50";

// ── Background star dots ──
interface StarDot {
  x: number;
  y: number;
  size: number;
  opacity: number;
  hasRing: boolean;
  ringRadius: number;
}

// ── Text dot particle ──
interface TextDot {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
}

const DotGrid = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -500, y: -500 });
  const animRef = useRef(0);
  const dprRef = useRef(1);
  const starsRef = useRef<StarDot[]>([]);
  const orbsRef = useRef<Orb[]>([]);
  const textDotsRef = useRef<TextDot[]>([]);
  const sizeRef = useRef({ w: 0, h: 0 });
  const initRef = useRef(false);

  const initScene = useCallback((w: number, h: number) => {
    // Random star dots
    const starCount = Math.floor((w * h) / 2800);
    const stars: StarDot[] = [];
    for (let i = 0; i < starCount; i++) {
      const hasRing = Math.random() < 0.12;
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 1.6 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
        hasRing,
        ringRadius: hasRing ? Math.random() * 8 + 8 : 0,
      });
    }
    starsRef.current = stars;

    // Orbs
    orbsRef.current = ORB_DEFS.map((d) => ({
      ...d,
      x: d.rx * w,
      y: d.ry * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      baseSize: 5 + Math.random() * 2,
    }));

    // Text dots — dense dot-matrix for "Malik Zhang"
    const textDots: TextDot[] = [];
    const offscreen = document.createElement("canvas");
    offscreen.width = w;
    offscreen.height = h;
    const ctx = offscreen.getContext("2d");
    if (ctx) {
      const fontSize = Math.min(w * 0.12, 160);
      ctx.font = `700 ${fontSize}px 'Space Grotesk', sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "white";

      // Two lines
      const lineGap = fontSize * 1.05;
      ctx.fillText("Malik", w / 2, h * 0.38 - lineGap * 0.25);
      ctx.fillText("Zhang", w / 2, h * 0.38 + lineGap * 0.75);

      const imageData = ctx.getImageData(0, 0, w, h);
      const gap = 4; // dense
      for (let y = 0; y < h; y += gap) {
        for (let x = 0; x < w; x += gap) {
          const i = (y * w + x) * 4;
          if (imageData.data[i + 3] > 100) {
            textDots.push({
              x: x,
              y: y,
              baseX: x,
              baseY: y,
            });
          }
        }
      }
    }
    textDotsRef.current = textDots;
    sizeRef.current = { w, h };
    initRef.current = true;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !initRef.current) {
      animRef.current = requestAnimationFrame(draw);
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = dprRef.current;
    const w = sizeRef.current.w;
    const h = sizeRef.current.h;
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    const time = performance.now() / 1000;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    // ── 1. Background stars ──
    starsRef.current.forEach((star) => {
      const twinkle = Math.sin(time * 1.5 + star.x * 0.01 + star.y * 0.01) * 0.15 + 0.85;
      const alpha = star.opacity * twinkle;

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 200, 210, ${alpha})`;
      ctx.fill();

      if (star.hasRing) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(200, 200, 210, ${0.08 * twinkle})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    });

    // ── 2. Text dots with splash interaction ──
    const splashRadius = 120;
    const splashForce = 0.6;
    textDotsRef.current.forEach((p) => {
      const dx = mx - p.baseX;
      const dy = my - p.baseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < splashRadius) {
        const force = (splashRadius - dist) / splashRadius;
        const ease = force * force * force; // cubic for snappy splash
        p.x = p.baseX - dx * ease * splashForce;
        p.y = p.baseY - dy * ease * splashForce;
      } else {
        // Spring back
        p.x += (p.baseX - p.x) * 0.08;
        p.y += (p.baseY - p.y) * 0.08;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(225, 222, 215, 0.65)";
      ctx.fill();
    });

    // ── 3. Wandering project orbs ──
    orbsRef.current.forEach((orb) => {
      // Wander movement
      orb.x += orb.vx;
      orb.y += orb.vy;

      // Bounce off edges with padding
      const pad = 80;
      if (orb.x < pad || orb.x > w - pad) {
        orb.vx *= -1;
        orb.x = Math.max(pad, Math.min(w - pad, orb.x));
      }
      if (orb.y < pad || orb.y > h - pad) {
        orb.vy *= -1;
        orb.y = Math.max(pad, Math.min(h - pad, orb.y));
      }

      // Slight random drift
      orb.vx += (Math.random() - 0.5) * 0.02;
      orb.vy += (Math.random() - 0.5) * 0.02;
      // Clamp speed
      const maxSpeed = 0.5;
      const speed = Math.sqrt(orb.vx * orb.vx + orb.vy * orb.vy);
      if (speed > maxSpeed) {
        orb.vx = (orb.vx / speed) * maxSpeed;
        orb.vy = (orb.vy / speed) * maxSpeed;
      }

      const col = orb.color === "red" ? RED : GOLD;
      const pulse = 0.85 + Math.sin(time * 1.2 + orb.x * 0.01) * 0.15;

      // Glow
      const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, 45);
      grad.addColorStop(0, `rgba(${col}, ${0.15 * pulse})`);
      grad.addColorStop(1, `rgba(${col}, 0)`);
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, 45, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Ring
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, 24, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(200, 200, 210, ${0.1 * pulse})`;
      ctx.lineWidth = 0.6;
      ctx.stroke();

      // Core
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, orb.baseSize * pulse, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${col}, ${0.9 * pulse})`;
      ctx.fill();

      // Label
      ctx.font = "500 12px 'Space Grotesk', sans-serif";
      ctx.fillStyle = `rgba(${col}, ${0.8 * pulse})`;
      ctx.fillText(orb.label, orb.x + 16, orb.y - 3);

      // Subtitle
      ctx.font = "400 9px 'Space Grotesk', sans-serif";
      ctx.fillStyle = `rgba(${col}, ${0.45 * pulse})`;
      ctx.fillText(orb.subtitle, orb.x + 16, orb.y + 10);
    });

    animRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    dprRef.current = dpr;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      initScene(rect.width, rect.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, [draw, initScene]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    />
  );
};

export default DotGrid;
