import { useEffect, useRef, useCallback } from "react";

// ── Project orbs ──
interface Orb {
  label: string;
  subtitle: string;
  color: "red" | "gold";
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseSize: number;
  mass: number;
  id: string;
}

const ORB_DEFS = [
  { label: "Aura", subtitle: "Main Projects", color: "red" as const, rx: 0.1, ry: 0.25, id: "aura" },
  { label: "NeuraLyfe", subtitle: "Main Projects", color: "red" as const, rx: 0.3, ry: 0.65, id: "neuralyfe" },
  { label: "FlowPrint", subtitle: "Main Projects", color: "red" as const, rx: 0.75, ry: 0.75, id: "flowprint" },
  { label: "Tubular", subtitle: "Main Projects", color: "red" as const, rx: 0.18, ry: 0.8, id: "tubular" },
  { label: "Inspire Ocean", subtitle: "Built with AI", color: "gold" as const, rx: 0.55, ry: 0.2, id: "inspireocean" },
  { label: "Studio Waters", subtitle: "Built with AI", color: "gold" as const, rx: 0.5, ry: 0.48, id: "studiowaters" },
  { label: "OneAdvisory", subtitle: "Built with AI", color: "gold" as const, rx: 0.85, ry: 0.35, id: "oneadvisory" },
];

const RED = "200, 82, 82";
const GOLD = "201, 169, 110";

interface StarDot {
  x: number;
  y: number;
  size: number;
  opacity: number;
  hasRing: boolean;
  ringRadius: number;
}

interface TextDot {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
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
  const hoveredOrbRef = useRef<string | null>(null);

  const initScene = useCallback((w: number, h: number) => {
    // Random star dots
    const starCount = Math.floor((w * h) / 2400);
    const stars: StarDot[] = [];
    for (let i = 0; i < starCount; i++) {
      const hasRing = Math.random() < 0.12;
      const isBright = Math.random() < 0.15;
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: isBright ? Math.random() * 2 + 1.2 : Math.random() * 1.4 + 0.5,
        opacity: isBright ? Math.random() * 0.3 + 0.65 : Math.random() * 0.35 + 0.2,
        hasRing,
        ringRadius: hasRing ? Math.random() * 8 + 8 : 0,
      });
    }
    starsRef.current = stars;

    // Orbs with mass for gravitational interaction
    orbsRef.current = ORB_DEFS.map((d) => ({
      ...d,
      x: d.rx * w,
      y: d.ry * h,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      baseSize: 5 + Math.random() * 2,
      mass: 1 + Math.random() * 2,
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

      const lineGap = fontSize * 1.05;
      ctx.fillText("Malik", w / 2, h * 0.38 - lineGap * 0.25);
      ctx.fillText("Zhang", w / 2, h * 0.38 + lineGap * 0.75);

      const imageData = ctx.getImageData(0, 0, w, h);
      const gap = 4;
      for (let y = 0; y < h; y += gap) {
        for (let x = 0; x < w; x += gap) {
          const i = (y * w + x) * 4;
          if (imageData.data[i + 3] > 100) {
            textDots.push({ x, y, baseX: x, baseY: y, vx: 0, vy: 0 });
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

    // ── 1. Background stars — bright like real stars ──
    starsRef.current.forEach((star) => {
      const twinkle = Math.sin(time * 2 + star.x * 0.013 + star.y * 0.009) * 0.2 + 0.8;
      const alpha = star.opacity * twinkle;

      // Bright stars get a subtle glow
      if (star.opacity > 0.5) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 220, 235, ${alpha * 0.08})`;
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(240, 240, 250, ${alpha})`;
      ctx.fill();

      if (star.hasRing) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(220, 220, 230, ${0.12 * twinkle})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    });

    // ── 2. Text dots — intense continuous splash ──
    const splashRadius = 90;
    textDotsRef.current.forEach((p) => {
      const dx = mx - p.baseX;
      const dy = my - p.baseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < splashRadius && dist > 0) {
        const force = (splashRadius - dist) / splashRadius;
        const power = force * force;
        const angle = Math.atan2(p.baseY - my, p.baseX - mx);
        const amp = 4 + Math.random() * 5;
        p.vx += Math.cos(angle) * power * amp;
        p.vy += Math.sin(angle) * power * amp;
        p.vx += (Math.random() - 0.5) * power * 3;
        p.vy += (Math.random() - 0.5) * power * 3;
      }

      // Stronger spring to keep dots closer to origin
      const returnDx = p.baseX - p.x;
      const returnDy = p.baseY - p.y;
      p.vx += returnDx * 0.035;
      p.vy += returnDy * 0.035;

      p.vx *= 0.91;
      p.vy *= 0.91;

      p.x += p.vx;
      p.y += p.vy;

      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      const glowAlpha = Math.min(0.95, 0.5 + speed * 0.04);

      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(225, 222, 215, ${glowAlpha})`;
      ctx.fill();
    });

    // ── 3. Gravitational orbs ──
    const orbs = orbsRef.current;
    const G = 8; // gravitational constant
    const minDist = 100; // minimum approach distance

    // Apply gravitational forces between orbs
    for (let i = 0; i < orbs.length; i++) {
      for (let j = i + 1; j < orbs.length; j++) {
        const a = orbs[i];
        const b = orbs[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDist) dist = minDist;

        const force = (G * a.mass * b.mass) / (dist * dist);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        // Attract then repel at close range
        if (dist < minDist * 1.5) {
          // Repel
          a.vx -= fx * 0.002;
          a.vy -= fy * 0.002;
          b.vx += fx * 0.002;
          b.vy += fy * 0.002;
        } else {
          // Attract gently
          a.vx += fx * 0.0003;
          a.vy += fy * 0.0003;
          b.vx -= fx * 0.0003;
          b.vy -= fy * 0.0003;
        }
      }
    }

    let newHoveredOrb: string | null = null;

    orbs.forEach((orb) => {
      // Move
      orb.x += orb.vx;
      orb.y += orb.vy;

      // Soft edge bounce
      const pad = 80;
      if (orb.x < pad) { orb.vx += 0.02; orb.x = Math.max(pad, orb.x); }
      if (orb.x > w - pad) { orb.vx -= 0.02; orb.x = Math.min(w - pad, orb.x); }
      if (orb.y < pad) { orb.vy += 0.02; orb.y = Math.max(pad, orb.y); }
      if (orb.y > h - pad) { orb.vy -= 0.02; orb.y = Math.min(h - pad, orb.y); }

      // Tiny drift
      orb.vx += (Math.random() - 0.5) * 0.005;
      orb.vy += (Math.random() - 0.5) * 0.005;

      // Clamp speed — slow and cosmic
      const maxSpeed = 0.2;
      const speed = Math.sqrt(orb.vx * orb.vx + orb.vy * orb.vy);
      if (speed > maxSpeed) {
        orb.vx = (orb.vx / speed) * maxSpeed;
        orb.vy = (orb.vy / speed) * maxSpeed;
      }

      // Damping
      orb.vx *= 0.998;
      orb.vy *= 0.998;

      const col = orb.color === "red" ? RED : GOLD;
      const pulse = 0.85 + Math.sin(time * 0.8 + orb.mass * 3) * 0.15;

      // Check hover — use orb center as the hitbox center
      const orbDx = mx - orb.x;
      const orbDy = my - orb.y;
      const orbDist = Math.sqrt(orbDx * orbDx + orbDy * orbDy);
      const isHovered = orbDist < 30;
      if (isHovered) newHoveredOrb = orb.id;

      // Magnetic field: nearby background dots get subtly attracted
      const fieldRadius = isHovered ? 55 : 45;
      const hoverScale = isHovered ? 1.25 : 1;
      const ringAlpha = isHovered ? 0.25 : 0.1;
      const glowRadius = isHovered ? 55 : 42;

      // Glow
      const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, glowRadius);
      grad.addColorStop(0, `rgba(${col}, ${(isHovered ? 0.22 : 0.15) * pulse})`);
      grad.addColorStop(1, `rgba(${col}, 0)`);
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, glowRadius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Single soft ring — no crosshair
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, 24 * hoverScale, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(200, 200, 210, ${ringAlpha * pulse})`;
      ctx.lineWidth = isHovered ? 0.8 : 0.5;
      ctx.stroke();

      // Core dot
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, orb.baseSize * pulse * hoverScale, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${col}, ${0.9 * pulse})`;
      ctx.fill();

      // Label
      ctx.font = `${isHovered ? "500" : "500"} 12px 'Space Grotesk', sans-serif`;
      ctx.fillStyle = `rgba(${col}, ${isHovered ? 0.95 : 0.8})`;
      ctx.fillText(orb.label, orb.x + 16, orb.y - 3);

      // Subtitle
      ctx.font = "400 9px 'Space Grotesk', sans-serif";
      ctx.fillStyle = `rgba(${col}, ${isHovered ? 0.6 : 0.45})`;
      ctx.fillText(orb.subtitle, orb.x + 16, orb.y + 10);
    });

    hoveredOrbRef.current = newHoveredOrb;

    // Update canvas cursor style
    if (canvas) {
      canvas.style.cursor = newHoveredOrb ? "none" : "none";
    }

    // Dispatch custom event for cursor component
    window.dispatchEvent(new CustomEvent("orb-hover", { detail: { hovering: !!newHoveredOrb } }));

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
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    window.addEventListener("mousemove", onMove);

    // Click handler for orbs
    const onClick = () => {
      const id = hoveredOrbRef.current;
      if (id) {
        // Navigate to project section
        const orb = ORB_DEFS.find(o => o.id === id);
        if (orb) {
          const sectionId = orb.color === "red" ? "projects" : "ai-projects";
          document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
        }
      }
    };
    canvas.addEventListener("click", onClick);

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("click", onClick);
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
