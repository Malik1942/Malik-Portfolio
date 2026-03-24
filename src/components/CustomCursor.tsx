import { useEffect, useRef, useState } from "react";

const CustomCursor = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [aiming, setAiming] = useState(false);
  const pos = useRef({ x: -100, y: -100 });
  const outerPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
      if (innerRef.current) {
        innerRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      }

      const target = e.target as HTMLElement;
      const isClickable = target.closest("a, button, [role='button'], [data-clickable]") !== null;
      setHovering(isClickable);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    const onOrbHover = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setAiming(detail.hovering);
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    window.addEventListener("orb-hover", onOrbHover);

    let raf: number;
    const followOuter = () => {
      const lerp = aiming ? 0.15 : 0.1;
      outerPos.current.x += (pos.current.x - outerPos.current.x) * lerp;
      outerPos.current.y += (pos.current.y - outerPos.current.y) * lerp;
      if (containerRef.current) {
        containerRef.current.style.transform = `translate(${outerPos.current.x}px, ${outerPos.current.y}px) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(followOuter);
    };
    followOuter();

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("orb-hover", onOrbHover);
      cancelAnimationFrame(raf);
    };
  }, [visible, aiming]);

  const isActive = hovering || aiming;
  const outerSize = aiming ? 52 : hovering ? 44 : 32;

  return (
    <>
      {/* Orbital cursor system — follows with lag */}
      <div
        ref={containerRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          width: 0,
          height: 0,
          opacity: visible ? 1 : 0,
          transition: "opacity 0.2s ease",
        }}
      >
        {/* Outer orbit ring */}
        <div
          className="absolute rounded-full"
          style={{
            width: outerSize,
            height: outerSize,
            top: -outerSize / 2,
            left: -outerSize / 2,
            border: `${aiming ? 1.2 : 0.8}px solid rgba(200, 200, 210, ${isActive ? 0.4 : 0.2})`,
            transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
          }}
        />

        {/* Inner orbit ring — visible on hover/aim */}
        <div
          className="absolute rounded-full"
          style={{
            width: isActive ? 18 : 0,
            height: isActive ? 18 : 0,
            top: isActive ? -9 : 0,
            left: isActive ? -9 : 0,
            border: `0.6px solid rgba(200, 200, 210, ${isActive ? 0.25 : 0})`,
            transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
          }}
        />

        {/* Crosshair — only when aiming */}
        {aiming && (
          <>
            <div style={{
              position: "absolute",
              top: "-0.25px",
              left: -(outerSize / 2 + 4),
              width: outerSize + 8,
              height: "0.5px",
              background: "rgba(200, 200, 210, 0.15)",
            }} />
            <div style={{
              position: "absolute",
              left: "-0.25px",
              top: -(outerSize / 2 + 4),
              width: "0.5px",
              height: outerSize + 8,
              background: "rgba(200, 200, 210, 0.15)",
            }} />
          </>
        )}

        {/* Center dot — golden accent */}
        <div
          className="absolute rounded-full"
          style={{
            width: aiming ? 7 : hovering ? 6 : 3.5,
            height: aiming ? 7 : hovering ? 6 : 3.5,
            top: aiming ? -3.5 : hovering ? -3 : -1.75,
            left: aiming ? -3.5 : hovering ? -3 : -1.75,
            backgroundColor: aiming
              ? "rgba(250, 200, 50, 0.9)"
              : "rgba(240, 238, 230, 0.9)",
            boxShadow: aiming
              ? "0 0 8px rgba(250, 200, 50, 0.4)"
              : "none",
            transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
          }}
        />
      </div>

      {/* Inner dot — follows cursor exactly (no lag) */}
      <div
        ref={innerRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full"
        style={{
          width: 2,
          height: 2,
          backgroundColor: "rgba(255,255,255,0.5)",
          opacity: visible && !aiming ? 1 : 0,
          transition: "opacity 0.2s ease",
        }}
      />
    </>
  );
};

export default CustomCursor;
