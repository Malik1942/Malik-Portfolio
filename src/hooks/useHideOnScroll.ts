import { useEffect, useRef, useState } from "react";

interface Options {
  /** Minimum px moved since the last state change before toggling — anti-flicker. */
  threshold?: number;
  /** While scrollY is within this zone of the top, the header is always shown. */
  nearTop?: number;
}

/**
 * Direction-aware visibility for a fixed header.
 * Returns `true` when the header should be hidden (user is scrolling down past
 * the top zone) and `false` when it should be shown (scrolling up, or near top).
 *
 * Performance notes:
 * - passive scroll listener, throttled with requestAnimationFrame
 * - refs hold the live values so React only re-renders when the boolean flips
 * - a movement threshold below which nothing changes prevents jitter/flicker
 */
export function useHideOnScroll({ threshold = 8, nearTop = 80 }: Options = {}): boolean {
  const [hidden, setHidden] = useState(false);
  const hiddenRef = useRef(false);
  const lastYRef = useRef(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    lastYRef.current = window.scrollY;

    const commit = (next: boolean) => {
      if (next !== hiddenRef.current) {
        hiddenRef.current = next;
        setHidden(next);
      }
    };

    const update = () => {
      tickingRef.current = false;
      const y = window.scrollY;

      // Always reveal near the very top.
      if (y <= nearTop) {
        commit(false);
        lastYRef.current = y;
        return;
      }

      const delta = y - lastYRef.current;
      // Ignore sub-threshold movement so tiny scrolls don't toggle state.
      if (Math.abs(delta) < threshold) return;

      commit(delta > 0); // scrolling down hides, up reveals
      lastYRef.current = y;
    };

    const onScroll = () => {
      if (!tickingRef.current) {
        tickingRef.current = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold, nearTop]);

  return hidden;
}
