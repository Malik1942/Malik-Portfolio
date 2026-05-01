import { useRef, useEffect, useState } from "react";
import { useInView } from "framer-motion";
import scene1 from "@/assets/aura-scene-1.mp4";
import scene2 from "@/assets/aura-scene-2.mp4";
import scene3 from "@/assets/aura-scene-3.mp4";

const scenes = [scene1, scene2, scene3];

const sceneLabels = [
  { num: "01", title: "Pre-travel" },
  { num: "02", title: "In-flight" },
  { num: "03", title: "Turbulence" },
];

export function AuraScenes() {
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasStarted = useRef(false);
  const inView = useInView(containerRef, { once: true, amount: 0.25 });

  // Autoplay once on scroll into view
  useEffect(() => {
    if (inView && !hasStarted.current && videoRef.current) {
      hasStarted.current = true;
      videoRef.current.play().catch(() => {});
    }
  }, [inView]);

  // Play new video once it's ready after a scene switch
  const handleCanPlay = () => {
    if (hasStarted.current && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  // Auto-advance to next scene on end
  const handleEnded = () => {
    setCurrent((c) => (c + 1 < scenes.length ? c + 1 : c));
  };

  // Hover replays current scene from start
  const handleMouseEnter = () => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play().catch(() => {});
  };

  // Manual scene selection
  const handleSelect = (index: number) => {
    if (index === current) {
      // Replay if same scene clicked
      const v = videoRef.current;
      if (v) { v.currentTime = 0; v.play().catch(() => {}); }
    } else {
      setCurrent(index);
    }
  };

  return (
    <div ref={containerRef} className="flex flex-col gap-3">

      {/* Hero video — full content width */}
      <div
        className="w-full overflow-hidden rounded-2xl bg-secondary/[0.06] cursor-pointer"
        onMouseEnter={handleMouseEnter}
      >
        <video
          key={current}
          ref={videoRef}
          src={scenes[current]}
          muted
          playsInline
          onEnded={handleEnded}
          onCanPlay={handleCanPlay}
          className="w-full h-auto block"
        />
      </div>

      {/* Scene selector tabs */}
      <div className="grid grid-cols-3 gap-2">
        {sceneLabels.map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSelect(i)}
            className={`group text-left px-4 py-3 rounded-sm border transition-colors duration-200 ${
              i === current
                ? "border-foreground/20 bg-foreground/[0.06]"
                : "border-border/15 hover:border-border/30 bg-transparent"
            }`}
          >
            <p className={`text-[10px] text-mono tabular-nums mb-1 transition-colors duration-200 ${
              i === current ? "text-foreground/40" : "text-muted-foreground/30 group-hover:text-foreground/30"
            }`}>
              {s.num}
            </p>
            <p className={`text-[11px] uppercase tracking-[0.16em] text-body transition-colors duration-200 ${
              i === current ? "text-foreground/88" : "text-foreground/38 group-hover:text-foreground/60"
            }`}>
              {s.title}
            </p>
          </button>
        ))}
      </div>

    </div>
  );
}
