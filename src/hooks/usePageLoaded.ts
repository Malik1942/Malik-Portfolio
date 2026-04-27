import { useState, useEffect } from "react";

/**
 * Returns true once main.tsx has dismissed the loading screen and added
 * `body.loaded`. React components use this to start Framer Motion entrance
 * animations after fonts are ready — not on mount (which fires behind the
 * loading screen on cold loads).
 */
export function usePageLoaded(): boolean {
  const [loaded, setLoaded] = useState(
    () => typeof document !== "undefined" && document.body.classList.contains("loaded")
  );

  useEffect(() => {
    if (document.body.classList.contains("loaded")) {
      setLoaded(true);
      return;
    }
    const onLoaded = () => setLoaded(true);
    window.addEventListener("page-loaded", onLoaded);
    return () => window.removeEventListener("page-loaded", onLoaded);
  }, []);

  return loaded;
}
