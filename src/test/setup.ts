import "@testing-library/jest-dom";
import { afterEach } from "vitest";

const storageEntries = new Map<string, string>();
const storage: Storage = {
  get length() { return storageEntries.size; },
  clear: () => storageEntries.clear(),
  getItem: (key) => storageEntries.get(key) ?? null,
  key: (index) => [...storageEntries.keys()][index] ?? null,
  removeItem: (key) => { storageEntries.delete(key); },
  setItem: (key, value) => { storageEntries.set(key, String(value)); },
};

Object.defineProperty(window, "localStorage", { configurable: true, value: storage });
Object.defineProperty(globalThis, "localStorage", { configurable: true, value: storage });
Object.defineProperty(window, "scrollTo", { configurable: true, value: () => {} });

let reducedMotionPreference = false;
const reducedMotionListeners = new Set<(event: { matches: boolean; media: string }) => void>();

export function setReducedMotionPreference(matches: boolean): void {
  reducedMotionPreference = matches;
  const event = { matches, media: "(prefers-reduced-motion: reduce)" };
  reducedMotionListeners.forEach((listener) => listener(event));
}

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => {
    const isReducedMotionQuery = query.includes("prefers-reduced-motion");
    const addListener = (listener: (event: { matches: boolean; media: string }) => void) => {
      if (isReducedMotionQuery) reducedMotionListeners.add(listener);
    };
    const removeListener = (listener: (event: { matches: boolean; media: string }) => void) => {
      reducedMotionListeners.delete(listener);
    };
    return {
      get matches() { return isReducedMotionQuery && reducedMotionPreference; },
      media: query,
      onchange: null,
      addListener,
      removeListener,
      addEventListener: (_type: string, listener: (event: { matches: boolean; media: string }) => void) => addListener(listener),
      removeEventListener: (_type: string, listener: (event: { matches: boolean; media: string }) => void) => removeListener(listener),
      dispatchEvent: () => true,
    };
  },
});

afterEach(() => {
  setReducedMotionPreference(false);
});

/**
 * Budget for the two tests that mount the whole design-system app: the token
 * workbench with a control per token, and the reference shell with routing.
 * They take 1.5 to 2.5s alone and are pure render, not waiting, so the 5s
 * default is a 2x margin that a second suite running beside this one (Cursor
 * and a worktree, measured Sep 2026) eats. Fifteen seconds still catches a
 * hang; it stops catching a busy machine. Everything else keeps the default.
 */
export const WHOLE_APP_RENDER_TIMEOUT_MS = 15_000;
