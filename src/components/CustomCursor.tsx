import { useEffect, useRef, useState } from "react";

const CustomCursor = () => {
  const fieldRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [aiming, setAiming] = useState(false);
  const pos = useRef({ x: -100, y: -100 });
  const fieldPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
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
    const follow = () => {
      const lerp = 0.1;
      fieldPos.current.x += (pos.current.x - fieldPos.current.x) * lerp;
      fieldPos.current.y += (pos.current.y - fieldPos.current.y) * lerp;
      if (fieldRef.current) {
        fieldRef.current.style.transform = `translate(${fieldPos.current.x}px, ${fieldPos.current.y}px) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(follow);
    };
    follow();

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("orb-hover", onOrbHover);
      cancelAnimationFrame(raf);
    };
  }, [visible]);

  const isActive = hovering || aiming;
  const fieldSize = aiming ? 48 : hovering ? 42 : 32;

  return (
    <>
      {/* Magnetic field — soft circular sensing area */}
      <div
        ref={fieldRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        style={{
          width: fieldSize,
          height: fieldSize,
          background: isActive
            ? `radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)`
            : `radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)`,
          border: `${isActive ? 1.2 : 1}px solid rgba(220, 220, 225, ${isActive ? 0.4 : 0.25})`,
          transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
          opacity: visible ? 1 : 0,
        }}
      />
      {/* Center dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        style={{
          width: isActive ? 6 : 4,
          height: isActive ? 6 : 4,
          backgroundColor: `rgba(245, 243, 237, ${isActive ? 1 : 0.85})`,
          boxShadow: `0 0 ${isActive ? 8 : 4}px rgba(245, 243, 237, ${isActive ? 0.4 : 0.2})`,
          transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
          opacity: visible ? 1 : 0,
        }}
      />
    </>
  );
};

export default CustomCursor;
