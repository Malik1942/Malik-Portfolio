import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;

/** True while the viewport is narrower than `breakpoint` pixels (false until
 *  the first client measurement, so the first paint is the desktop layout). */
export function useIsBelow(breakpoint: number) {
  const [below, setBelow] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const onChange = () => {
      setBelow(window.innerWidth < breakpoint);
    };
    mql.addEventListener("change", onChange);
    setBelow(window.innerWidth < breakpoint);
    return () => mql.removeEventListener("change", onChange);
  }, [breakpoint]);

  return !!below;
}

export function useIsMobile() {
  return useIsBelow(MOBILE_BREAKPOINT);
}
