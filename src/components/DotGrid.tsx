import { useEffect, useRef, useCallback } from "react";

// ── Cluster definitions for About mode (pushed to edges) ──
const CLUSTER_DEFS = [
  { rx: 0.08, ry: 0.20 },
  { rx: 0.92, ry: 0.18 },
  { rx: 0.07, ry: 0.82 },
  { rx: 0.93, ry: 0.80 },
];

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
  hoverT: number;
}

const ORB_DEFS = [
  { label: "Aura", subtitle: "Main Projects", color: "red" as const, rx: 0.1, ry: 0.25, id: "aura" },
  { label: "NeuraLyfe", subtitle: "Main Projects", color: "red" as const, rx: 0.3, ry: 0.55, id: "neuralyfe" },
  { label: "FlowPrint", subtitle: "Main Projects", color: "red" as const, rx: 0.75, ry: 0.45, id: "flowprint" },
  { label: "Tubular", subtitle: "Main Projects", color: "red" as const, rx: 0.18, ry: 0.7, id: "tubular" },
  { label: "Inspire Ocean", subtitle: "Built with AI", color: "gold" as const, rx: 0.55, ry: 0.2, id: "inspireocean" },
  { label: "Studio Waters", subtitle: "Built with AI", color: "gold" as const, rx: 0.5, ry: 0.38, id: "studiowaters" },
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
  clusterIndex: number;
  orbitAngle: number;
  orbitRadius: number;
  orbitSpeed: number;
}

interface DotGridProps {
  aboutMode: boolean;
}

const DotGrid = ({ aboutMode }: DotGridProps) => {
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
  const aboutModeRef = useRef(aboutMode);
  const transitionRef = useRef(0);
  const clusterPosRef = useRef<{ x: number; y: number }[]>([]);

  useEffect(() => {
    aboutModeRef.current = aboutMode;
  }, [aboutMode]);

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

    // Orbs
    orbsRef.current = ORB_DEFS.map((d) => ({
      ...d,
      x: d.rx * w,
      y: d.ry * h,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      baseSize: 5 + Math.random() * 2,
      mass: 1 + Math.random() * 2,
      hoverT: 0,
    }));

    // Cluster positions
    clusterPosRef.current = CLUSTER_DEFS.map((d) => ({
      x: d.rx * w,
      y: d.ry * h,
    }));

    // Text dots
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
      let dotIndex = 0;
      for (let y = 0; y < h; y += gap) {
        for (let x = 0; x < w; x += gap) {
          const i = (y * w + x) * 4;
          if (imageData.data[i + 3] > 100) {
            textDots.push({
              x,
              y,
              baseX: x,
              baseY: y,
              vx: 0,
              vy: 0,
              clusterIndex: dotIndex % 4,
              orbitAngle: Math.random() * Math.PI * 2,
              orbitRadius: 25 + Math.random() * 85,
              orbitSpeed: 0.001 + Math.random() * 0.003,
            });
            dotIndex++;
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

    // ── Transition interpolation ──
    const targetT = aboutModeRef.current ? 1 : 0;
    transitionRef.current += (targetT - transitionRef.current) * 0.018;
    if (Math.abs(transitionRef.current - targetT) < 0.001) transitionRef.current = targetT;
    const tVal = transitionRef.current;
    // Ease in-out cubic
    const eased =
      tVal < 0.5
        ? 4 * tVal * tVal * tVal
        : 1 - Math.pow(-2 * tVal + 2, 3) / 2;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    // ── 1. Background stars ──
    const starAlpha = 0.65 + 0.35 * (1 - eased);
    starsRef.current.forEach((star) => {
      const twinkle = Math.sin(time * 2 + star.x * 0.013 + star.y * 0.009) * 0.2 + 0.8;
      const alpha = star.opacity * twinkle * starAlpha;

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
        ctx.strokeStyle = `rgba(220, 220, 230, ${0.12 * twinkle * starAlpha})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    });

    // ── 2. Text dots — blend between hero and about positions ──
    const splashRadius = 90;
    const clusters = clusterPosRef.current;

    textDotsRef.current.forEach((p) => {
      // Hero spring physics (always runs to keep hero positions ready)
      if (tVal < 0.95) {
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
      }

      const returnDx = p.baseX - p.x;
      const returnDy = p.baseY - p.y;
      p.vx += returnDx * 0.035;
      p.vy += returnDy * 0.035;
      p.vx *= 0.91;
      p.vy *= 0.91;
      p.x += p.vx;
      p.y += p.vy;

      // Orbit position
      p.orbitAngle += p.orbitSpeed;
      const cluster = clusters[p.clusterIndex];
      if (!cluster) return;
      const aboutX = cluster.x + Math.cos(p.orbitAngle) * p.orbitRadius;
      const aboutY = cluster.y + Math.sin(p.orbitAngle) * p.orbitRadius;

      // Blend positions
      const drawX = p.x + (aboutX - p.x) * eased;
      const drawY = p.y + (aboutY - p.y) * eased;

      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      const baseAlpha = Math.min(0.95, 0.5 + speed * 0.04);
      let dotAlpha = baseAlpha * (0.55 + 0.45 * (1 - eased * 0.2));

      ctx.beginPath();
      ctx.arc(drawX, drawY, 1.3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(225, 222, 215, ${dotAlpha})`;
      ctx.fill();
    });

    // ── 3. Cluster glows (dimmed, secondary) ──
    if (eased > 0.05) {
      clusters.forEach((cluster) => {
        const breathe = 1 + Math.sin(time * 0.3) * 0.06;
        const glowR = 40 * breathe;
        const grad = ctx.createRadialGradient(cluster.x, cluster.y, 0, cluster.x, cluster.y, glowR);
        grad.addColorStop(0, `rgba(210, 210, 225, ${0.025 * eased})`);
        grad.addColorStop(0.6, `rgba(210, 210, 225, ${0.008 * eased})`);
        grad.addColorStop(1, `rgba(210, 210, 225, 0)`);
        ctx.beginPath();
        ctx.arc(cluster.x, cluster.y, glowR, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });
    }

    // ── 4. Gravitational orbs (fade out during transition) ──
    const orbFade = 1 - eased;

    if (orbFade > 0.01) {
      ctx.save();
      ctx.globalAlpha = orbFade;

      const orbs = orbsRef.current;
      const G = 8;
      const minDist = 100;

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

          if (dist < minDist * 1.5) {
            a.vx -= fx * 0.002;
            a.vy -= fy * 0.002;
            b.vx += fx * 0.002;
            b.vy += fy * 0.002;
          } else {
            a.vx += fx * 0.0003;
            a.vy += fy * 0.0003;
            b.vx -= fx * 0.0003;
            b.vy -= fy * 0.0003;
          }
        }
      }

      let newHoveredOrb: string | null = null;

      orbs.forEach((orb) => {
        const orbDx = mx - orb.x;
        const orbDy = my - orb.y;
        const orbDist = Math.sqrt(orbDx * orbDx + orbDy * orbDy);
        if (orbDist < 30) newHoveredOrb = orb.id;
      });

      if (newHoveredOrb) {
        const hovOrb = orbs.find((o) => o.id === newHoveredOrb);
        if (hovOrb) {
          orbs.forEach((orb) => {
            if (orb.id === newHoveredOrb) return;
            if (orb.color !== hovOrb.color) return;
            const dx = orb.x - hovOrb.x;
            const dy = orb.y - hovOrb.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 500) return;
            const alpha = Math.max(0, 0.12 * (1 - dist / 500));
            const col = hovOrb.color === "red" ? RED : GOLD;
            ctx.beginPath();
            ctx.moveTo(hovOrb.x, hovOrb.y);
            ctx.lineTo(orb.x, orb.y);
            ctx.strokeStyle = `rgba(${col}, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          });
        }
      }

      if (newHoveredOrb) {
        const hovOrb = orbs.find((o) => o.id === newHoveredOrb);
        if (hovOrb) {
          starsRef.current.forEach((star) => {
            const dx = hovOrb.x - star.x;
            const dy = hovOrb.y - star.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120 && dist > 2) {
              const pull = 0.15 * (1 - dist / 120);
              star.x += (dx / dist) * pull;
              star.y += (dy / dist) * pull;
            }
          });
        }
      }

      orbs.forEach((orb) => {
        orb.x += orb.vx;
        orb.y += orb.vy;

        const pad = 80;
        const bottomLimit = h * 0.82;
        if (orb.x < pad) { orb.vx += 0.02; orb.x = Math.max(pad, orb.x); }
        if (orb.x > w - pad) { orb.vx -= 0.02; orb.x = Math.min(w - pad, orb.x); }
        if (orb.y < pad) { orb.vy += 0.02; orb.y = Math.max(pad, orb.y); }
        if (orb.y > bottomLimit) { orb.vy -= 0.02; orb.y = Math.min(bottomLimit, orb.y); }

        const isAI = orb.color === "gold";
        const driftAmt = isAI ? 0.008 : 0.004;
        orb.vx += (Math.random() - 0.5) * driftAmt;
        orb.vy += (Math.random() - 0.5) * driftAmt;

        const maxSpeed = isAI ? 0.28 : 0.18;
        const speed = Math.sqrt(orb.vx * orb.vx + orb.vy * orb.vy);
        if (speed > maxSpeed) {
          orb.vx = (orb.vx / speed) * maxSpeed;
          orb.vy = (orb.vy / speed) * maxSpeed;
        }

        orb.vx *= isAI ? 0.996 : 0.993;
        orb.vy *= isAI ? 0.996 : 0.993;

        const col = orb.color === "red" ? RED : GOLD;
        const breathSpeed = isAI ? 1.2 : 0.6;
        const breathAmp = isAI ? 0.2 : 0.12;
        const breath = 1 - breathAmp / 2 + Math.sin(time * breathSpeed + orb.mass * 3) * breathAmp;
        const opacityBreath = 0.85 + Math.sin(time * breathSpeed * 0.7 + orb.mass * 2) * 0.15;

        const orbDx = mx - orb.x;
        const orbDy = my - orb.y;
        const orbDist = Math.sqrt(orbDx * orbDx + orbDy * orbDy);
        const isHovered = orbDist < 30;

        const tgtT = isHovered ? 1 : 0;
        const lerpSpd = isHovered ? 0.08 : 0.04;
        orb.hoverT += (tgtT - orb.hoverT) * lerpSpd;
        const t = orb.hoverT;
        const easedH = 1 - Math.pow(1 - t, 3);

        const hoverScale = 1 + easedH * 0.3;
        const ringAlpha = 0.08 * opacityBreath + easedH * 0.2;
        const glowRadius = 42 + easedH * 18;
        const glowIntensity = (0.12 * opacityBreath + easedH * 0.12) * breath;
        const ringWidth = 0.5 + easedH * 0.4;

        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, glowRadius);
        grad.addColorStop(0, `rgba(${col}, ${glowIntensity})`);
        grad.addColorStop(1, `rgba(${col}, 0)`);
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(orb.x, orb.y, 24 * hoverScale * breath, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(200, 200, 210, ${ringAlpha})`;
        ctx.lineWidth = ringWidth;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.baseSize * breath * hoverScale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${col}, ${(0.85 + easedH * 0.1) * opacityBreath})`;
        ctx.fill();

        ctx.font = "500 12px 'Space Grotesk', sans-serif";
        ctx.fillStyle = `rgba(${col}, ${(0.75 + easedH * 0.2) * opacityBreath})`;
        ctx.fillText(orb.label, orb.x + 16, orb.y - 3);

        ctx.font = "400 9px 'Space Grotesk', sans-serif";
        ctx.fillStyle = `rgba(${col}, ${(0.4 + easedH * 0.2) * opacityBreath})`;
        ctx.fillText(orb.subtitle, orb.x + 16, orb.y + 10);
      });

      hoveredOrbRef.current = newHoveredOrb;
      ctx.restore();

      window.dispatchEvent(new CustomEvent("orb-hover", { detail: { hovering: !!newHoveredOrb } }));
    } else {
      hoveredOrbRef.current = null;
    }

    if (canvas) {
      canvas.style.cursor = "none";
    }

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

    const onClick = () => {
      if (aboutModeRef.current) return;
      const id = hoveredOrbRef.current;
      if (id) {
        const el = document.getElementById(`project-${id}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
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
