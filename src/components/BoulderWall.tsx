import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  DESKTOP_WALL,
  MOBILE_WALL,
  holdsWithinReach,
  minMoves,
  routeBudget,
  startHold,
  topHold,
  type BoulderHold,
  type BoulderRoute,
  type HoldShape,
  type WallLayout,
} from "@/components/boulderRoute";

const pct = (value: number, total: number) => `${(value / total) * 100}%`;

/** Overshooting ease for small celebratory pops. */
const easeSpringy: [number, number, number, number] = [0.34, 1.56, 0.64, 1];

/** The fall should be worth doing on purpose — rotate the punchline. */
const FALL_QUIPS = [
  (grade: string) => `Pumped out on ${grade}! Gravity accepts your donation.`,
  (grade: string) => `${grade} shook you off. The wall keeps score.`,
  (grade: string) => `Airborne! ${grade} wants a cleaner read.`,
];

/** Chalk puff scatter vectors for the hold where the climber blew it. */
const CHALK_PUFF: [number, number][] = [
  [-16, -10],
  [-8, -19],
  [3, -22],
  [13, -15],
  [20, -4],
  [15, 9],
  [-2, 14],
  [-18, 5],
];

const routeColor = (route: BoulderRoute, alpha: number) =>
  `hsl(var(${route.colorVar}) / ${alpha})`;

// Organic hold silhouettes in a 24×24 box — jug, sloper, crimp, pinch.
const HOLD_PATHS: Record<HoldShape, string> = {
  jug: "M12 2.2 C17.2 2 21.6 5.6 21.8 11 C22 16.6 17.8 21.8 12.2 21.8 C6.8 21.8 2.2 17.4 2.4 11.6 C2.6 6 6.8 2.4 12 2.2 Z",
  sloper:
    "M2.5 15.5 C2.5 9 6.5 4.5 12 4.5 C17.5 4.5 21.5 9 21.5 15.5 C21.5 18.2 19.2 19.5 12 19.5 C4.8 19.5 2.5 18.2 2.5 15.5 Z",
  crimp:
    "M2.5 10 C5 8.4 19 8.4 21.5 10 C22.6 11 22.6 13.5 21.5 14.5 C19 16.1 5 16.1 2.5 14.5 C1.4 13.5 1.4 11 2.5 10 Z",
  pinch:
    "M9.5 2.5 C13 1.4 15.6 4 15.6 8 C15.6 12 14.6 18 12.6 21 C11.5 22.4 9.7 22 8.9 20.5 C7.4 17.5 6.9 12 7.4 8 C7.7 4.8 8.1 3 9.5 2.5 Z",
};

type RouteId = BoulderRoute["id"];
type Progress = Record<RouteId, string[]>;

const freshProgress = (layout: WallLayout): Progress =>
  Object.fromEntries(
    layout.routes.map((route) => [route.id, [startHold(route).id]]),
  ) as Progress;

const holdLabel = (route: BoulderRoute, hold: BoulderHold) =>
  hold.start
    ? `${route.grade} start hold`
    : hold.top
    ? `${route.grade} top hold`
    : `${route.grade} hold ${hold.id}`;

/** lg breakpoint — the About section switches to its two-column row there. */
const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(
    () => window.matchMedia("(min-width: 1024px)").matches,
  );
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const onChange = (event: MediaQueryListEvent) => setIsDesktop(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);
  return isDesktop;
};

const HoldButton = ({
  layout,
  route,
  hold,
  lit,
  litIndex,
  sent,
  routeStarted,
  shaking,
  falling,
  fallDelay,
  onClick,
}: {
  layout: WallLayout;
  route: BoulderRoute;
  hold: BoulderHold;
  lit: boolean;
  litIndex: number;
  sent: boolean;
  routeStarted: boolean;
  shaking: boolean;
  /** This hold is part of a route that is peeling off the wall right now. */
  falling: boolean;
  /** Seconds until this hold releases — the peel runs top-down. */
  fallDelay: number;
  onClick: () => void;
}) => {
  const reducedMotion = useReducedMotion();
  const hit = layout.hitArea;
  // The untouched start hold breathes in its route color to invite the first tap.
  const beckoning = hold.start && !routeStarted;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={holdLabel(route, hold)}
      aria-pressed={lit}
      // The button is an invisible hit area (comfortable touch target); the
      // visible hold is the inner SVG. Centering happens in left/top
      // arithmetic, not CSS translate: framer-motion owns this element's
      // transform and would silently drop a class-based translate.
      className="absolute flex items-center justify-center cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40"
      style={{
        left: pct(hold.x - hit / 2, layout.width),
        top: pct(hold.y - hit / 2, layout.height),
        width: pct(hit, layout.width),
        aspectRatio: "1",
      }}
      animate={
        falling && !reducedMotion
          ? { x: 0, y: [0, -3, 13, 0], rotate: [0, 2, -9, 0], scale: [1, 1.05, 0.94, 1] }
          : shaking && !reducedMotion
          ? { x: [0, -3, 3, -2, 2, 0], y: 0, rotate: 0 }
          : sent && lit && !reducedMotion
          ? { x: 0, y: 0, rotate: 0, scale: [1, 1.28, 1] }
          : { x: 0, y: 0, rotate: 0, scale: 1 }
      }
      transition={
        falling
          ? { duration: 0.55, delay: fallDelay, ease: "easeIn" }
          : shaking
          ? { duration: 0.3 }
          : sent && lit
          ? { duration: 0.45, delay: litIndex * 0.06 }
          : { duration: 0.2 }
      }
      whileHover={lit ? undefined : { scale: 1.18 }}
    >
      <motion.svg
        viewBox="0 0 24 24"
        className="block"
        style={{
          width: `${((hold.r * 2) / hit) * 100}%`,
          aspectRatio: "1",
          rotate: `${hold.rotation}deg`,
          filter: lit ? `drop-shadow(0 0 10px ${routeColor(route, 0.45)})` : "none",
          transition: "filter 0.3s ease",
        }}
        animate={
          beckoning && !reducedMotion ? { opacity: [0.7, 1, 0.7] } : { opacity: 1 }
        }
        transition={
          beckoning ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" } : undefined
        }
        aria-hidden="true"
      >
        <path
          d={HOLD_PATHS[hold.shape]}
          fill={lit ? routeColor(route, 0.85) : routeColor(route, beckoning ? 0.4 : 0.22)}
          stroke={lit ? routeColor(route, 0.95) : routeColor(route, 0.6)}
          strokeWidth={1.2}
          style={{ transition: "fill 0.3s ease, stroke 0.3s ease" }}
        />
      </motion.svg>
    </motion.button>
  );
};

const WallGame = ({
  layout,
  onTopOut,
}: {
  layout: WallLayout;
  onTopOut?: () => void;
}) => {
  const reducedMotion = useReducedMotion();
  const [progress, setProgress] = useState<Progress>(() => freshProgress(layout));
  const [activeId, setActiveId] = useState<RouteId | null>(null);
  const [outOfReach, setOutOfReach] = useState<{ route: RouteId; hold: string } | null>(null);
  const [fallingRoute, setFallingRoute] = useState<RouteId | null>(null);
  const [fallCount, setFallCount] = useState(0);
  const shakeTimerRef = useRef<number | null>(null);
  const fallTimerRef = useRef<number | null>(null);
  const toppedRef = useRef(false);

  const routeById = new Map(layout.routes.map((route) => [route.id, route]));
  const isSent = (route: BoulderRoute) =>
    progress[route.id][progress[route.id].length - 1] === topHold(route).id;
  const allSent = layout.routes.every(isSent);
  const anyStarted = layout.routes.some((route) => progress[route.id].length > 1);

  const handleHoldClick = (route: BoulderRoute, hold: BoulderHold) => {
    if (fallingRoute === route.id) return;
    const path = progress[route.id];
    const litIndex = path.indexOf(hold.id);
    setActiveId(route.id);

    if (litIndex === 0 && path.length === 1) {
      setOutOfReach(null);
      return;
    }

    // Downclimb: the last hold pops off, an earlier one truncates back to it.
    // Downclimbing refunds chalk — exploring is free, committing is not.
    if (litIndex !== -1) {
      setProgress({
        ...progress,
        [route.id]: path.slice(0, litIndex === path.length - 1 ? -1 : litIndex + 1),
      });
      setOutOfReach(null);
      return;
    }

    if (isSent(route)) return;

    const holds = new Map(route.holds.map((h) => [h.id, h]));
    const last = holds.get(path[path.length - 1])!;
    if (holdsWithinReach(last, hold, route.reach)) {
      const nextPath = [...path, hold.id];
      setProgress({ ...progress, [route.id]: nextPath });
      setOutOfReach(null);

      if (hold.top) {
        if (!toppedRef.current) {
          toppedRef.current = true;
          onTopOut?.();
        }
        return;
      }

      // Chalk spent without reaching the top: pumped, off the wall.
      if (nextPath.length - 1 >= routeBudget(route)) {
        setFallingRoute(route.id);
        setFallCount((count) => count + 1);
        if (fallTimerRef.current !== null) window.clearTimeout(fallTimerRef.current);
        fallTimerRef.current = window.setTimeout(() => {
          setProgress((current) => ({ ...current, [route.id]: [startHold(route).id] }));
          setFallingRoute(null);
        }, 1100);
      }
      return;
    }

    setOutOfReach({ route: route.id, hold: hold.id });
    if (shakeTimerRef.current !== null) window.clearTimeout(shakeTimerRef.current);
    shakeTimerRef.current = window.setTimeout(() => setOutOfReach(null), 1200);
  };

  const reset = () => {
    setProgress(freshProgress(layout));
    setActiveId(null);
    setOutOfReach(null);
    setFallingRoute(null);
  };

  const active = activeId ? routeById.get(activeId) : undefined;
  const activePath = active ? progress[active.id] : [];
  const activeMoves = activePath.length - 1;
  const activeChalkLeft = active ? Math.max(0, routeBudget(active) - activeMoves) : 0;

  const statusText = (() => {
    if (fallingRoute) {
      const route = routeById.get(fallingRoute)!;
      return FALL_QUIPS[(fallCount + FALL_QUIPS.length - 1) % FALL_QUIPS.length](route.grade);
    }
    if (outOfReach) {
      const route = routeById.get(outOfReach.route)!;
      return `Out of reach on ${route.grade}. Try a closer hold.`;
    }
    if (allSent) return "All three sent, even with Malik. The inbox is right below.";
    if (active && isSent(active)) {
      const min = minMoves(active);
      return activeMoves === min
        ? `${active.grade} flashed! ${min} moves, even with Malik.`
        : `${active.grade} sent in ${activeMoves}. Malik walks it in ${min}.`;
    }
    if (active && activeMoves > 0) {
      return `${active.grade}: ${activeMoves} ${activeMoves === 1 ? "move" : "moves"} in, ${activeChalkLeft} chalk left.`;
    }
    if (active) {
      return `${active.grade}: Malik does it in ${minMoves(active)}. Read the line, then pull on.`;
    }
    return "Three problems, graded by color. Chalk is short, so read your line before pulling on.";
  })();

  return (
    <div className="w-full">
      <div
        className="relative w-full overflow-hidden rounded-lg border border-foreground/[0.14] bg-secondary/[0.08]"
        style={{ aspectRatio: `${layout.width} / ${layout.height}` }}
      >
        {/* Wall texture + finish line + chalk lines, under the holds */}
        <svg
          className="absolute inset-0 h-full w-full pointer-events-none"
          viewBox={`0 0 ${layout.width} ${layout.height}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <polygon
            points={`0,${layout.height} ${layout.width * 0.22},${layout.height * 0.72} 0,${layout.height * 0.5}`}
            fill="hsl(var(--color-text-primary) / 0.02)"
          />
          <polygon
            points={`${layout.width},${layout.height * 0.16} ${layout.width * 0.72},${layout.height * 0.38} ${layout.width},${layout.height * 0.52}`}
            fill="hsl(var(--color-text-primary) / 0.02)"
          />
          <line
            x1={14}
            y1={16}
            x2={layout.width - 14}
            y2={16}
            stroke="hsl(var(--color-text-primary) / 0.18)"
            strokeWidth={1}
            strokeDasharray="2 7"
          />
          {/* Reach ring: everything inside is honestly in range from where you hang */}
          {active &&
            !isSent(active) &&
            fallingRoute !== active.id &&
            (() => {
              const path = progress[active.id];
              const holds = new Map(active.holds.map((h) => [h.id, h]));
              const last = holds.get(path[path.length - 1])!;
              return (
                <motion.circle
                  key={`ring-${active.id}-${last.id}`}
                  data-testid="reach-ring"
                  cx={last.x}
                  cy={last.y}
                  r={active.reach}
                  fill="none"
                  stroke={routeColor(active, 0.25)}
                  strokeWidth={1}
                  strokeDasharray="3 7"
                  initial={reducedMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              );
            })()}

          {layout.routes.map((route) => {
            const path = progress[route.id];
            if (path.length < 2) return null;
            const holds = new Map(route.holds.map((h) => [h.id, h]));
            const points = path
              .map((id) => holds.get(id)!)
              .map((hold) => `${hold.x},${hold.y}`)
              .join(" ");
            const falling = fallingRoute === route.id;
            const lastHold = holds.get(path[path.length - 1])!;
            return (
              <g key={route.id}>
                {/* The chalk line unzips from the top as the climber peels off */}
                <motion.g
                  animate={
                    falling
                      ? { y: reducedMotion ? 0 : 10, opacity: reducedMotion ? 0 : [1, 1, 0] }
                      : { y: 0, opacity: 1 }
                  }
                  transition={
                    falling
                      ? { duration: 0.85, times: reducedMotion ? undefined : [0, 0.65, 1], ease: "easeIn" }
                      : { duration: 0.2 }
                  }
                >
                  <motion.polyline
                    points={points}
                    fill="none"
                    stroke={routeColor(route, 0.12)}
                    strokeWidth={6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    animate={{ pathLength: falling && !reducedMotion ? 0 : 1 }}
                    transition={{ duration: 0.6, ease: "easeIn" }}
                  />
                  <motion.polyline
                    points={points}
                    fill="none"
                    stroke={routeColor(route, 0.55)}
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={reducedMotion ? false : { opacity: 0 }}
                    animate={{
                      opacity: 1,
                      pathLength: falling && !reducedMotion ? 0 : 1,
                    }}
                    transition={{ duration: falling ? 0.6 : 0.3, ease: "easeIn" }}
                  />
                  {/* Send zip: a bright pulse retraces the whole line bottom to top */}
                  {isSent(route) && (
                    <motion.polyline
                      points={points}
                      fill="none"
                      stroke={routeColor(route, 0.95)}
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={reducedMotion ? false : { pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                    />
                  )}
                </motion.g>

                {/* Chalk puff where the climber blew it */}
                {falling && !reducedMotion && (
                  <g key={`puff-${fallCount}`}>
                    {CHALK_PUFF.map(([dx, dy], i) => (
                      <motion.circle
                        key={i}
                        cx={lastHold.x}
                        cy={lastHold.y}
                        r={1.4 + (i % 3) * 0.7}
                        fill="hsl(var(--color-text-primary) / 0.7)"
                        initial={{ x: 0, y: 0, opacity: 0.9 }}
                        animate={{ x: dx * 1.4, y: dy * 1.4 + 10, opacity: 0 }}
                        transition={{ duration: 0.7, delay: 0.05 + i * 0.02, ease: "easeOut" }}
                      />
                    ))}
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* TOP marker sits on the finish line, clear of every top hold */}
        <span
          className="absolute right-3 text-label uppercase tracking-eyebrow text-foreground/55 pointer-events-none"
          style={{ top: pct(16, layout.height), transform: "translateY(-50%)" }}
        >
          Top
        </span>

        {layout.routes.map((route) =>
          route.holds.map((hold) => {
            const path = progress[route.id];
            const litIndex = path.indexOf(hold.id);
            const falling = fallingRoute === route.id && litIndex !== -1;
            return (
              <HoldButton
                key={`${route.id}-${hold.id}`}
                layout={layout}
                route={route}
                hold={hold}
                lit={litIndex !== -1}
                litIndex={litIndex}
                sent={isSent(route)}
                routeStarted={path.length > 1}
                shaking={outOfReach?.route === route.id && outOfReach.hold === hold.id}
                falling={falling}
                fallDelay={falling ? (path.length - 1 - litIndex) * 0.07 : 0}
                onClick={() => handleHoldClick(route, hold)}
              />
            );
          }),
        )}
      </div>

      {/* Grade tags under each start hold — gym-style route cards */}
      <div className="relative mt-2 h-6 w-full">
        {layout.routes.map((route) => {
          const start = startHold(route);
          const min = minMoves(route);
          const sent = isSent(route);
          return (
            <span
              key={route.id}
              className="absolute top-0 -translate-x-1/2 flex items-center gap-1.5 text-label uppercase tracking-eyebrow text-foreground/55 whitespace-nowrap"
              style={{ left: pct(start.x, layout.width) }}
            >
              <span
                className="inline-block h-[7px] w-[7px] rounded-full"
                style={{ background: routeColor(route, 0.85) }}
              />
              {route.grade} · {min}
              {sent && (
                <motion.span
                  style={{ color: routeColor(route, 0.9) }}
                  initial={reducedMotion ? false : { scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.35, ease: easeSpringy }}
                  aria-label={`${route.grade} sent`}
                >
                  ✓
                </motion.span>
              )}
            </span>
          );
        })}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-4">
        <p className="text-caption text-foreground/55" role="status">
          {statusText}
        </p>
        <div className="flex items-baseline gap-4 flex-shrink-0">
          {/* Chalk bag for the route being climbed */}
          {active && !isSent(active) && activeMoves > 0 && fallingRoute === null && (
            <span
              className="flex items-center gap-1"
              aria-label={`Chalk left on ${active.grade}: ${activeChalkLeft} of ${routeBudget(active)}`}
            >
              {Array.from({ length: routeBudget(active) }, (_, i) => (
                <span
                  key={i}
                  className="inline-block h-[5px] w-[5px] rounded-full transition-colors duration-300"
                  style={{
                    background:
                      i < activeChalkLeft
                        ? "hsl(var(--color-text-primary) / 0.7)"
                        : "hsl(var(--color-text-primary) / 0.15)",
                  }}
                />
              ))}
            </span>
          )}
          {anyStarted && (
            <button
              type="button"
              onClick={reset}
              className="nav-link text-caption text-foreground/55 hover:text-foreground transition-colors duration-300"
            >
              Brush it off
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const BoulderWall = ({ onTopOut }: { onTopOut?: () => void }) => {
  const isDesktop = useIsDesktop();
  const layout = isDesktop ? DESKTOP_WALL : MOBILE_WALL;
  // Remount on layout change: hold spacing and reach differ per wall, so a
  // half-climbed line cannot carry across.
  return <WallGame key={layout.id} layout={layout} onTopOut={onTopOut} />;
};

export default BoulderWall;
