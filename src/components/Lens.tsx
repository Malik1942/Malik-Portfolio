import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import {
  LENS_PARAM,
  LENS_ROW,
  lensAside,
  lensCounts,
  lensFromSlug,
  lensHref,
  lensSlug,
  lensTitle,
  type Lens,
} from "@/lib/lens";
import { scrollToTarget } from "@/lib/scrollToTarget";
import { DURATION, EASE, MOTION } from "@/design-system/system/motion";
import { Chip, ChipButton } from "./ui/Chip";
import { TextLink } from "./ui/TextLink";

// ─── Lens state ───────────────────────────────────────────────────────────────
// The lens is URL state (`?lens=…`, see src/lib/lens.ts). This provider is the
// one place that reads and writes it, so the cards, the hero dots, and the bar
// below all agree. Outside a provider `useLens()` is null and the skill chips
// stay passive labels: the Next up strip on a case-study page and the design
// system specimens render the same card without becoming controls.
//
// Writes replace the history entry rather than pushing one: a recruiter trying
// three lenses should not need three presses of Back to leave the page, and a
// round trip into a case study still returns to the lens they had.

export interface LensState {
  lens: Lens | null;
  setLens: (lens: Lens | null) => void;
  /** Press a chip: the same lens clears, a different one swaps. */
  toggle: (lens: Lens) => void;
}

const LensContext = createContext<LensState | null>(null);

export const useLens = (): LensState | null => useContext(LensContext);

export function LensProvider({ children }: { children: ReactNode }) {
  const [params, setParams] = useSearchParams();
  const lens = lensFromSlug(params.get(LENS_PARAM));

  const setLens = useCallback(
    (next: Lens | null) => {
      setParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          if (next) params.set(LENS_PARAM, lensSlug(next));
          else params.delete(LENS_PARAM);
          return params;
        },
        { replace: true, preventScrollReset: true },
      );
    },
    [setParams],
  );

  const toggle = useCallback((next: Lens) => setLens(lens === next ? null : next), [lens, setLens]);

  // Escape clears the lens, unless something modal (the video lightbox) owns
  // the key right now.
  useEffect(() => {
    if (!lens) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.defaultPrevented) return;
      if (document.querySelector('[aria-modal="true"]')) return;
      setLens(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lens, setLens]);

  const value = useMemo(() => ({ lens, setLens, toggle }), [lens, setLens, toggle]);
  return <LensContext.Provider value={value}>{children}</LensContext.Provider>;
}

// ─── Lens row ─────────────────────────────────────────────────────────────────
// The invitation: one quiet line of the most-asked-for lenses, under the
// Selected Work eyebrow and the Studio header. Shipped first, then skills. The
// same ChipButton the cards use, so pressing a skill here and pressing it on a
// card are the same act, and the pressed state is shared. Nothing here is a
// filter bar: the row does not sort, hide, or count; it only offers the lens.
// It carries no visible label either: the eyebrow above it names the section,
// and the chips are the same chips the cards wear, so they explain themselves.
// The name is for assistive tech only.

export const LENS_ROW_ID = "lens-row";
export const LENS_ROW_LABEL = "Lenses";

export function LensRow({ className = "" }: { className?: string }) {
  const state = useLens();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  if (!state) return null;
  return (
    <motion.div
      ref={ref}
      id={LENS_ROW_ID}
      role="group"
      aria-label={LENS_ROW_LABEL}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 8 }}
      transition={{ ...MOTION.enter, delay: 0.1 }}
      className={`flex flex-wrap items-center gap-x-1.5 gap-y-1.5 ${className}`}
    >
      {LENS_ROW.map((lens) => (
        <ChipButton
          key={lens}
          pressed={state.lens === lens}
          onPress={() => state.toggle(lens)}
          title={lensTitle(lens, state.lens === lens)}
        >
          {lens}
        </ChipButton>
      ))}
    </motion.div>
  );
}

// ─── Lens bar ─────────────────────────────────────────────────────────────────
// The only chrome the lens adds, and only while one is active: a pill at the
// foot of the viewport naming the lens, how many of this page's projects
// carry it, where the rest are, and how to put it down. The resting page has
// no filter bar, so nothing changes until a chip is pressed.
//
// Bottom-right on desktop, clear of the hero's centred scroll cue; centred on
// a phone, where there is no right corner to speak of.

export const LENS_BAR_ID = "lens-bar";

const projectsNoun = (n: number) => (n === 1 ? "project" : "projects");

// The count is also the way in: it eases the page to the first match and lets
// the card answer with the same landing pulse a hero dot click gets. This only
// *calls* scrollToTarget with the card's arrival event; the scroll-and-arrive
// chain itself is untouched (see CLAUDE.md).
const scrollToFirstMatch = (projectId: string) => {
  const element = document.getElementById(`project-${projectId}`);
  if (!element) return;
  scrollToTarget({
    element,
    arrivalEventName: "project-dot-arrive",
    arrivalDetail: { id: projectId },
  });
};

const CONTROL =
  "rounded-full transition-colors duration-fast ease-settle hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-strong focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function LensBar({ hidden = false }: { hidden?: boolean }) {
  const state = useLens();
  const { pathname } = useLocation();
  const lens = state?.lens ?? null;
  const counts = lens ? lensCounts(lens, pathname) : null;
  const aside = lens ? lensAside(lens) : null;

  return (
    <AnimatePresence>
      {state && lens && counts && !hidden ? (
        <motion.div
          key="lens-bar"
          id={LENS_BAR_ID}
          aria-label="Lens"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: DURATION.medium, ease: EASE.move }}
          className="fixed bottom-5 left-1/2 z-guide flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-3 rounded-full border border-hairline bg-background/[0.8] py-2 pl-2 pr-2 text-caption text-foreground-secondary backdrop-blur-md md:bottom-8 md:left-auto md:right-8 md:translate-x-0 md:gap-4 md:pl-2.5 md:pr-3"
        >
          <Chip tone="lead" className="border-border bg-foreground/[0.14] text-foreground">
            {lens}
          </Chip>

          {counts.first ? (
            <button
              type="button"
              onClick={() => scrollToFirstMatch(counts.first!)}
              title="Go to the first match"
              className={`${CONTROL} whitespace-nowrap`}
            >
              <span role="status" aria-live="polite">
                {counts.here} of {counts.total} {projectsNoun(counts.total)} here
              </span>
            </button>
          ) : (
            <span role="status" aria-live="polite" className="whitespace-nowrap">
              {counts.here} of {counts.total} {projectsNoun(counts.total)} here
            </span>
          )}

          {counts.elsewhere ? (
            <TextLink
              as={Link}
              to={lensHref(counts.elsewhere.path, lens)}
              tone="secondary"
              size="caption"
              className="inline-flex items-center gap-1 whitespace-nowrap"
            >
              {counts.elsewhere.count} in {counts.elsewhere.label}
              <ArrowRight aria-hidden="true" className="h-3 w-3" strokeWidth={2} />
            </TextLink>
          ) : null}

          {aside ? (
            <TextLink
              as={Link}
              to={aside.path}
              tone="secondary"
              size="caption"
              className="inline-flex items-center gap-1 whitespace-nowrap"
            >
              {aside.label}
              <ArrowRight aria-hidden="true" className="h-3 w-3" strokeWidth={2} />
            </TextLink>
          ) : null}

          <button
            type="button"
            onClick={() => state.setLens(null)}
            aria-label="Clear lens"
            title="Clear lens (Esc)"
            className={`${CONTROL} inline-flex h-6 w-6 shrink-0 items-center justify-center text-foreground-tertiary hover:bg-foreground/[0.08]`}
          >
            <X aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
