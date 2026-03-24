import { useEffect, useRef, useState } from "react";

const CustomCursor = () => {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const crosshairRef = useRef<HTMLDivElement>(null);
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
      if (crosshairRef.current) {
        crosshairRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      }

      const target = e.target as HTMLElement;
      const isClickable = target.closest("a, button, [role='button'], [data-clickable]") !== null;
      setHovering(isClickable);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    // Listen for orb hover events from canvas
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
      outerPos.current.x += (pos.current.x - outerPos.current.x) * (aiming ? 0.18 : 0.12);
      outerPos.current.y += (pos.current.y - outerPos.current.y) * (aiming ? 0.18 : 0.12);
      if (outerRef.current) {
        outerRef.current.style.transform = `translate(${outerPos.current.x}px, ${outerPos.current.y}px) translate(-50%, -50%)`;
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

  return (
    <>
      {/* Outer ring */}
      <div
        ref={outerRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference rounded-full"
        style={{
          width: aiming ? 56 : hovering ? 48 : 36,
          height: aiming ? 56 : hovering ? 48 : 36,
          border: aiming
            ? "1.5px solid rgba(255,255,255,0.5)"
            : hovering
            ? "1.5px solid rgba(255,255,255,0.6)"
            : "1px solid rgba(255,255,255,0.25)",
          transition: "width 0.35s cubic-bezier(0.16,1,0.3,1), height 0.35s cubic-bezier(0.16,1,0.3,1), border 0.3s ease",
          opacity: visible ? 1 : 0,
        }}
      />
      {/* Crosshair lines — visible when aiming at orbs */}
      <div
        ref={crosshairRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          width: 0,
          height: 0,
          opacity: visible && aiming ? 1 : 0,
          transition: "opacity 0.25s ease",
        }}
      >
        {/* Horizontal */}
        <div style={{
          position: "absolute",
          top: "-0.5px",
          left: "-14px",
          width: "28px",
          height: "1px",
          background: "rgba(255,255,255,0.35)",
        }} />
        {/* Vertical */}
        <div style={{
          position: "absolute",
          left: "-0.5px",
          top: "-14px",
          width: "1px",
          height: "28px",
          background: "rgba(255,255,255,0.35)",
        }} />
      </div>
      {/* Inner dot */}
      <div
        ref={innerRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference rounded-full"
        style={{
          width: aiming ? 6 : isActive ? 8 : 4,
          height: aiming ? 6 : isActive ? 8 : 4,
          backgroundColor: "rgba(255,255,255,0.9)",
          transition: "width 0.25s cubic-bezier(0.16,1,0.3,1), height 0.25s cubic-bezier(0.16,1,0.3,1)",
          opacity: visible ? 1 : 0,
        }}
      />
    </>
  );
};

export default CustomCursor;
