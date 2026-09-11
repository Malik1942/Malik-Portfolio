import { useEffect, useState } from "react";

const QUERY = "(hover: hover)";

/** True when the primary input can hover (a mouse or trackpad). Touch-only
 *  devices report false, so anything that reveals itself on hover can pick a
 *  substitute trigger. Starts true so the first paint matches the desktop
 *  behaviour, then corrects itself on the first client measurement. */
export function useCanHover() {
  const [canHover, setCanHover] = useState(true);

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const onChange = () => setCanHover(mql.matches);
    mql.addEventListener("change", onChange);
    onChange();
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return canHover;
}
