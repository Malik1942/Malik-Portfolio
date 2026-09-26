import { useSyncExternalStore } from "react";

// Asks the negative question on purpose: `(hover: none)` is true only on a
// device whose primary pointer cannot hover (a phone, a tablet), so anything
// that cannot answer — the prerender, a browser without media queries — falls
// back to hover, which is the site's default.
const QUERY = "(hover: none)";

const subscribe = (onChange: () => void) => {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
};

/** False on a device that cannot hover. Read synchronously on the client, so
 *  a touch screen never paints a hover-only state first and then swaps. */
export function useCanHover() {
  return useSyncExternalStore(
    subscribe,
    () => !window.matchMedia(QUERY).matches,
    () => true,
  );
}
