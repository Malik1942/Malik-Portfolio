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
