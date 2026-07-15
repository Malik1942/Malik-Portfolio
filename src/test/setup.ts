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

export function setReducedMotionPreference(matches: boolean): void {
  reducedMotionPreference = matches;
}

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: query.includes("prefers-reduced-motion") && reducedMotionPreference,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

afterEach(() => {
  reducedMotionPreference = false;
});
