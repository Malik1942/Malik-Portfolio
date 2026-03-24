import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

interface Orb {
  x: number;
  y: number;
  size: number;
  color: string;
  pulseSpeed: number;
  pulseOffset: number;
  ringSize: number;
}

interface TextParticle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  baseX: number;
  baseY: number;
}

const StarField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -200, y: -200 });
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Generate stars
    const stars: Star[] = Array.from({ length: 400 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5 + 0.3,
      opacity: Math.random() * 0.6 + 0.1,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinkleOffset: Math.random() * Math.PI * 2,
    }));

    // Generate colored orbs
    const orbs: Orb[] = [
      { x: 0.22, y: 0.38, color: "220, 50, 47", size: 4, pulseSpeed: 0.015, pulseOffset: 0, ringSize: 12 },
      { x: 0.35, y: 0.56, color: "220, 50, 47", size: 3, pulseSpeed: 0.02, pulseOffset: 1, ringSize: 10 },
      { x: 0.85, y: 0.76, color: "220, 50, 47", size: 3.5, pulseSpeed: 0.018, pulseOffset: 2, ringSize: 11 },
      { x: 0.55, y: 0.22, color: "250, 200, 50", size: 4.5, pulseSpeed: 0.012, pulseOffset: 0.5, ringSize: 14 },
      { x: 0.67, y: 0.67, color: "250, 200, 50", size: 5, pulseSpeed: 0.01, pulseOffset: 1.5, ringSize: 16 },
      { x: 0.8, y: 0.37, color: "250, 200, 50", size: 4, pulseSpeed: 0.014, pulseOffset: 2.5, ringSize: 13 },
      { x: 0.78, y: 0.12, color: "250, 200, 50", size: 3.5, pulseSpeed: 0.016, pulseOffset: 3, ringSize: 12 },
    ].map(o => ({ ...o, x: o.x * canvas.width, y: o.y * canvas.height }));

    // Generate text particles for "MALIK" 
    const textParticles: TextParticle[] = [];
    const offscreen = document.createElement("canvas");
    const offCtx = offscreen.getContext("2d");
    if (offCtx) {
      offscreen.width = canvas.width;
      offscreen.height = canvas.height;
      const fontSize = Math.min(canvas.width * 0.18, 220);
      offCtx.font = `700 ${fontSize}px 'Space Grotesk', sans-serif`;
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";
      offCtx.fillStyle = "white";
      offCtx.fillText("MALIK", canvas.width / 2, canvas.height * 0.42);

      const imageData = offCtx.getImageData(0, 0, canvas.width, canvas.height);
      const gap = 3;
      for (let y = 0; y < canvas.height; y += gap) {
        for (let x = 0; x < canvas.width; x += gap) {
          const i = (y * canvas.width + x) * 4;
          if (imageData.data[i + 3] > 128) {
            textParticles.push({
              x: x + (Math.random() - 0.5) * 2,
              y: y + (Math.random() - 0.5) * 2,
              baseX: x,
              baseY: y,
              size: Math.random() * 2 + 0.8,
              opacity: Math.random() * 0.5 + 0.5,
            });
          }
        }
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);

    let time = 0;
    const animate = () => {
      time += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      stars.forEach((star) => {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 200, 210, ${star.opacity * twinkle})`;
        ctx.fill();
      });

      // Draw orbs with rings
      orbs.forEach((orb) => {
        const pulse = Math.sin(time * orb.pulseSpeed + orb.pulseOffset) * 0.3 + 0.7;
        // Glow
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${orb.color}, ${0.15 * pulse})`;
        ctx.fill();
        // Core
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.size * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${orb.color}, ${0.9 * pulse})`;
        ctx.fill();
        // Ring
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.ringSize, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(200, 200, 210, ${0.12 * pulse})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      // Draw text particles with mouse interaction
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      textParticles.forEach((p) => {
        const dx = mx - p.baseX;
        const dy = my - p.baseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 100;

        if (dist < maxDist) {
          const force = (maxDist - dist) / maxDist;
          p.x = p.baseX - dx * force * 0.4;
          p.y = p.baseY - dy * force * 0.4;
        } else {
          p.x += (p.baseX - p.x) * 0.08;
          p.y += (p.baseY - p.y) * 0.08;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240, 238, 230, ${p.opacity})`;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    />
  );
};

export default StarField;
