import { createContext, useContext } from "react";
import type { Lens } from "@/lib/lens";

// The lens is URL state (`?lens=…`, see src/lib/lens.ts); LensProvider in
// Lens.tsx is the one place that reads and writes it. The context and the
// hook live here so Lens.tsx exports only components and keeps fast refresh.
// Outside a provider `useLens()` is null and the skill chips stay passive
// labels.

export interface LensState {
  lens: Lens | null;
  setLens: (lens: Lens | null) => void;
  /** Press a chip: the same lens clears, a different one swaps. */
  toggle: (lens: Lens) => void;
}

export const LensContext = createContext<LensState | null>(null);

export const useLens = (): LensState | null => useContext(LensContext);
