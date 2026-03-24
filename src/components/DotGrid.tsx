import { useEffect, useRef, useCallback } from "react";

interface ProjectOrb {
  label: string;
  subtitle: string;
  gridX: number; // grid column position (0-1 normalized)
  gridY: number; // grid row position (0-1 normalized)
  color: "red" | "gold";
}

const PROJECTS: ProjectOrb[] = [
  { label: "Aura", subtitle: "Selected Work", gridX: 0.12, gridY: 0.25, color: "red" },
  { label: "NeuraLyfe", subtitle: "Selected Work", gridX: 0.32, gridY: 0.62, color: "red" },
  { label: "FlowPrint", subtitle: "Selected Work", gridX: 0.78, gridY: 0.82, color: "red" },
  { label: "ContentForge", subtitle: "Built with AI", gridX: 0.58, gridY: 0.28, color: "gold" },
  { label: "InsightLens", subtitle: "Built with AI", gridX: 0.52, gridY: 0.52, color: "gold" },
  { label: "OneAdvisory", subtitle: "Built with AI", gridX: 0.85, gridY: 0.42, color: "gold" },
];

const RED = { r: 220, g: 50, b: 47 };
const GOLD = { r: 250, g: 200, b: 50 };

const DotGrid = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -500, y: -500 });
  const animRef = useRef(0);
  const dprRef = useRef(1);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = dprRef.current;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;

    // ── 1. Background dot grid ──
    const gridSpacing = 28;
    const dotRadius = 1.2;
    const cols = Math.ceil(w / gridSpacing) + 1;
    const rows = Math.ceil(h / gridSpacing) + 1;
    const offsetX = (w % gridSpacing) / 2;
    const offsetY = (h % gridSpacing) / 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = offsetX + col * gridSpacing;
        const y = offsetY + row * gridSpacing;

        // Mouse proximity — subtle brightness boost
        const dx = mx - x;
        const dy = my - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const proximity = Math.max(0, 1 - dist / 180);
        const alpha = 0.12 + proximity * 0.25;

        ctx.beginPath();
        ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 200, 210, ${alpha})`;
        ctx.fill();
      }
    }

    // ── 2. Ring circles (decorative, on grid rhythm) ──
    const ringPositions = [
      { cx: 0.08, cy: 0.15, r: 14 },
      { cx: 0.25, cy: 0.08, r: 10 },
      { cx: 0.45, cy: 0.18, r: 12 },
      { cx: 0.65, cy: 0.08, r: 8 },
      { cx: 0.92, cy: 0.22, r: 11 },
      { cx: 0.15, cy: 0.48, r: 9 },
      { cx: 0.72, cy: 0.38, r: 13 },
      { cx: 0.38, cy: 0.78, r: 10 },
      { cx: 0.62, cy: 0.72, r: 11 },
      { cx: 0.88, cy: 0.68, r: 9 },
      { cx: 0.18, cy: 0.85, r: 12 },
      { cx: 0.95, cy: 0.88, r: 10 },
      { cx: 0.48, cy: 0.92, r: 8 },
      { cx: 0.05, cy: 0.65, r: 11 },
      { cx: 0.75, cy: 0.55, r: 9 },
    ];

    ringPositions.forEach(({ cx, cy, r }) => {
      const rx = cx * w;
      const ry = cy * h;
      // center dot
      ctx.beginPath();
      ctx.arc(rx, ry, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(200, 200, 210, 0.3)";
      ctx.fill();
      // ring
      ctx.beginPath();
      ctx.arc(rx, ry, r, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(200, 200, 210, 0.1)";
      ctx.lineWidth = 0.6;
      ctx.stroke();
    });

    // ── 3. "MALIK" as dot-matrix text ──
    // We render this via offscreen canvas sampling
    drawDotText(ctx, w, h, mx, my);

    // ── 4. Project orbs ──
    const time = performance.now() / 1000;
    PROJECTS.forEach((proj) => {
      const px = proj.gridX * w;
      const py = proj.gridY * h;
      const col = proj.color === "red" ? RED : GOLD;
      const pulse = 0.85 + Math.sin(time * 1.2 + proj.gridX * 10) * 0.15;

      // Glow
      const grad = ctx.createRadialGradient(px, py, 0, px, py, 40);
      grad.addColorStop(0, `rgba(${col.r}, ${col.g}, ${col.b}, ${0.12 * pulse})`);
      grad.addColorStop(1, `rgba(${col.r}, ${col.g}, ${col.b}, 0)`);
      ctx.beginPath();
      ctx.arc(px, py, 40, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Ring
      ctx.beginPath();
      ctx.arc(px, py, 22, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(200, 200, 210, ${0.12 * pulse})`;
      ctx.lineWidth = 0.6;
      ctx.stroke();

      // Core dot
      ctx.beginPath();
      ctx.arc(px, py, 5 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${col.r}, ${col.g}, ${col.b}, ${0.9 * pulse})`;
      ctx.fill();

      // Label
      ctx.font = "500 13px 'Space Grotesk', sans-serif";
      ctx.fillStyle = `rgba(${col.r}, ${col.g}, ${col.b}, ${0.85 * pulse})`;
      ctx.fillText(proj.label, px + 14, py - 4);

      // Subtitle
      ctx.font = "400 10px 'Space Grotesk', sans-serif";
      ctx.fillStyle = `rgba(${col.r}, ${col.g}, ${col.b}, ${0.5 * pulse})`;
      ctx.fillText(proj.subtitle, px + 14, py + 10);
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
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);

    // Pre-generate dot text data
    generateDotTextData(canvas.width / dpr, canvas.height / dpr);

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    />
  );
};

// ── Dot-matrix text rendering ──
let dotTextParticles: { x: number; y: number }[] = [];

function generateDotTextData(w: number, h: number) {
  dotTextParticles = [];
  const offscreen = document.createElement("canvas");
  offscreen.width = w;
  offscreen.height = h;
  const ctx = offscreen.getContext("2d");
  if (!ctx) return;

  const fontSize = Math.min(w * 0.16, 200);
  ctx.font = `700 ${fontSize}px 'Space Grotesk', sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Draw text outline (not filled) by drawing thick then clearing inner
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = "white";
  ctx.strokeText("MALIK", w / 2, h * 0.44);

  const imageData = ctx.getImageData(0, 0, w, h);
  const gap = 5; // consistent grid spacing for dots

  for (let y = 0; y < h; y += gap) {
    for (let x = 0; x < w; x += gap) {
      const i = (y * w + x) * 4;
      if (imageData.data[i + 3] > 80) {
        dotTextParticles.push({ x, y });
      }
    }
  }
}

function drawDotText(ctx: CanvasRenderingContext2D, w: number, h: number, mx: number, my: number) {
  if (dotTextParticles.length === 0) {
    generateDotTextData(w, h);
  }

  dotTextParticles.forEach((p) => {
    const dx = mx - p.x;
    const dy = my - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxDist = 80;

    let drawX = p.x;
    let drawY = p.y;

    if (dist < maxDist) {
      const force = (maxDist - dist) / maxDist;
      const ease = force * force; // quadratic easing for smoother feel
      drawX = p.x - dx * ease * 0.3;
      drawY = p.y - dy * ease * 0.3;
    }

    ctx.beginPath();
    ctx.arc(drawX, drawY, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(230, 228, 220, 0.7)";
    ctx.fill();
  });
}

export default DotGrid;
