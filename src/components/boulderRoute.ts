// ── Boulder wall geometry ──
// Two walls share one schema: a landscape wall for the desktop column and a
// portrait wall for stacked mobile layouts. Coordinates live in each wall's
// own unit space; the DOM scales them by percent so the wall stays
// proportional at every width. Each route is an independent reach graph in a
// gym color: reach and close are the tuning knobs per route, verified in
// boulderWall.test.tsx so every hold is reachable, the close-only flash line
// matches min chalk, and no cross-route holds collide with tap areas.
//
// Keep reach under about 1.5x close. A dyno is meant to be a tax, not a
// shortcut: if reach approaches 2x close, one far grab covers two hops for two
// hops' chalk and skips a hold, and the exact-line puzzle collapses. Line hops
// sit near the close radius so any two of them chord past reach.
//
// Decoys are built to a cost, not a look. On V2 (slack 1) a detour is fatal
// only if it costs +2: a dyno onto a hold between rows, or a 1-chalk dead end
// whose every onward grab is a dyno. A +1 wobble sends fat; each V2 keeps
// exactly one, a left hold near the top that finishes on a dyno. V4 (slack 0)
// weaves a 6-move S on the right of the column with a few inner-ring dead
// ends — enough to hide the line, not enough to blob it. The leftmost cheap
// first hold is bait, not the flash: a left-greedy climber dies. The straight
// center holds are dynos that leave one chalk under the top, which sits in
// the outer ring so the glory slap lights, then peels off. A hang with chalk
// left always has something in the rings; silent isolation is a bug, not a
// puzzle.

export type HoldShape = "jug" | "sloper" | "crimp" | "pinch";

export interface BoulderHold {
  id: string;
  x: number;
  y: number;
  /** Visual radius in wall units — climbing holds come in sizes. */
  r: number;
  shape: HoldShape;
  /** Degrees; keeps repeated shapes from reading as stamped copies. */
  rotation: number;
  start?: boolean;
  top?: boolean;
}

export interface BoulderRoute {
  id: "v0" | "v2" | "v4";
  grade: string;
  /** CSS custom property holding a bare H S L triplet (no baked alpha). */
  colorVar: string;
  reach: number;
  /** Inner-ring radius; grabs at or inside this cost 1 chalk. */
  close: number;
  /** Extra chalk beyond the minimum line — 0 makes the route an exact-line puzzle. */
  slack: number;
  holds: BoulderHold[];
}

export interface WallLayout {
  id: "desktop" | "mobile";
  width: number;
  height: number;
  /** Uniform invisible tap-area diameter in wall units. */
  hitArea: number;
  routes: BoulderRoute[];
}

export const DESKTOP_WALL: WallLayout = {
  id: "desktop",
  width: 740,
  height: 460,
  hitArea: 44,
  routes: [
    {
      id: "v0",
      grade: "V0",
      colorVar: "--component-case-study-module-accent-emerald",
      reach: 148,
      close: 118,
      slack: 2,
      holds: [
        { id: "s", x: 125, y: 420, r: 13, shape: "jug", rotation: 0, start: true },
        { id: "a1", x: 157, y: 323, r: 10, shape: "sloper", rotation: 20 },
        { id: "a2", x: 42, y: 297, r: 11, shape: "jug", rotation: -30 },
        { id: "a3", x: 135, y: 227, r: 10, shape: "pinch", rotation: 15 },
        { id: "a4", x: 139, y: 142, r: 10, shape: "sloper", rotation: -15 },
        { id: "a5", x: 27, y: 180, r: 9, shape: "crimp", rotation: 10 },
        { id: "a6", x: 219, y: 170, r: 10, shape: "sloper", rotation: 35 },
        { id: "t", x: 120, y: 60, r: 13, shape: "jug", rotation: 180, top: true },
      ],
    },
    {
      id: "v2",
      grade: "V2",
      colorVar: "--component-case-study-module-accent-violet",
      reach: 128,
      close: 95,
      slack: 1,
      holds: [
        { id: "s", x: 390, y: 425, r: 12, shape: "jug", rotation: 0, start: true },
        { id: "p1", x: 349, y: 355, r: 9, shape: "crimp", rotation: -10 },
        { id: "p2", x: 466, y: 370, r: 10, shape: "sloper", rotation: 25 },
        { id: "p3", x: 350, y: 272, r: 10, shape: "pinch", rotation: -20 },
        { id: "p4", x: 259, y: 328, r: 10, shape: "sloper", rotation: -35 },
        { id: "p5", x: 359, y: 190, r: 9, shape: "crimp", rotation: 12 },
        { id: "p6", x: 262, y: 234, r: 9, shape: "crimp", rotation: 28 },
        { id: "p7", x: 354, y: 115, r: 9, shape: "pinch", rotation: 30 },
        { id: "p8", x: 471, y: 245, r: 10, shape: "sloper", rotation: -12 },
        { id: "p9", x: 465, y: 119, r: 9, shape: "pinch", rotation: 40 },
        { id: "p10", x: 281, y: 136, r: 10, shape: "sloper", rotation: 30 },
        { id: "t", x: 365, y: 40, r: 12, shape: "jug", rotation: 180, top: true },
      ],
    },
    {
      id: "v4",
      grade: "V4",
      colorVar: "--color-accent-workshop",
      reach: 115,
      close: 75,
      slack: 0,
      holds: [
        { id: "s", x: 630, y: 425, r: 12, shape: "jug", rotation: 0, start: true },
        { id: "q1", x: 650, y: 366, r: 9, shape: "sloper", rotation: -22 },
        { id: "q2", x: 577, y: 380, r: 8, shape: "crimp", rotation: 18 },
        { id: "q3", x: 614, y: 316, r: 9, shape: "pinch", rotation: 5 },
        { id: "q4", x: 552, y: 310, r: 8, shape: "crimp", rotation: -8 },
        { id: "q6", x: 651, y: 235, r: 9, shape: "pinch", rotation: -18 },
        { id: "q7", x: 577, y: 240, r: 8, shape: "crimp", rotation: 24 },
        { id: "q8", x: 673, y: 296, r: 9, shape: "sloper", rotation: -30 },
        { id: "q9", x: 597, y: 163, r: 8, shape: "crimp", rotation: -16 },
        { id: "q10", x: 671, y: 173, r: 9, shape: "pinch", rotation: 12 },
        { id: "q12", x: 651, y: 113, r: 9, shape: "pinch", rotation: -28 },
        { id: "t", x: 620, y: 58, r: 12, shape: "jug", rotation: 180, top: true },
      ],
    },
  ],
};

export const MOBILE_WALL: WallLayout = {
  id: "mobile",
  width: 340,
  height: 470,
  hitArea: 40,
  routes: [
    {
      id: "v0",
      grade: "V0",
      colorVar: "--component-case-study-module-accent-emerald",
      reach: 125,
      close: 100,
      slack: 2,
      holds: [
        { id: "s", x: 58, y: 430, r: 12, shape: "jug", rotation: 0, start: true },
        { id: "a1", x: 107, y: 343, r: 9, shape: "sloper", rotation: 20 },
        { id: "a2", x: 22, y: 324, r: 10, shape: "jug", rotation: -30 },
        { id: "a3", x: 74, y: 249, r: 9, shape: "pinch", rotation: 15 },
        { id: "a4", x: 105, y: 156, r: 9, shape: "sloper", rotation: -15 },
        { id: "a5", x: 22, y: 175, r: 8, shape: "crimp", rotation: 10 },
        { id: "t", x: 58, y: 70, r: 12, shape: "jug", rotation: 180, top: true },
      ],
    },
    {
      id: "v2",
      grade: "V2",
      colorVar: "--component-case-study-module-accent-violet",
      reach: 118,
      close: 84,
      slack: 1,
      holds: [
        { id: "s", x: 178, y: 435, r: 11, shape: "jug", rotation: 0, start: true },
        { id: "p1", x: 154, y: 365, r: 8, shape: "crimp", rotation: -10 },
        { id: "p2", x: 234, y: 398, r: 9, shape: "sloper", rotation: 25 },
        { id: "p3", x: 142, y: 288, r: 9, shape: "pinch", rotation: -20 },
        { id: "p4", x: 225, y: 282, r: 9, shape: "sloper", rotation: -35 },
        { id: "p5", x: 142, y: 209, r: 8, shape: "crimp", rotation: 12 },
        { id: "p6", x: 212, y: 165, r: 9, shape: "sloper", rotation: 40 },
        { id: "p7", x: 137, y: 130, r: 8, shape: "pinch", rotation: 30 },
        { id: "t", x: 185, y: 65, r: 11, shape: "jug", rotation: 180, top: true },
      ],
    },
    {
      id: "v4",
      grade: "V4",
      colorVar: "--color-accent-workshop",
      reach: 112,
      close: 71,
      slack: 0,
      holds: [
        { id: "s", x: 292, y: 430, r: 11, shape: "jug", rotation: 0, start: true },
        { id: "q1", x: 324, y: 382, r: 8, shape: "sloper", rotation: -22 },
        { id: "q2", x: 270, y: 380, r: 8, shape: "crimp", rotation: 18 },
        { id: "q3", x: 293, y: 338, r: 8, shape: "pinch", rotation: -8 },
        { id: "q4", x: 253, y: 312, r: 8, shape: "sloper", rotation: 40 },
        { id: "q6", x: 321, y: 249, r: 8, shape: "pinch", rotation: -16 },
        { id: "q7", x: 253, y: 250, r: 8, shape: "crimp", rotation: 24 },
        { id: "q8", x: 324, y: 311, r: 8, shape: "sloper", rotation: 15 },
        { id: "q9", x: 320, y: 138, r: 8, shape: "pinch", rotation: 6 },
        { id: "q10", x: 294, y: 192, r: 8, shape: "crimp", rotation: 30 },
        { id: "q12", x: 264, y: 129, r: 8, shape: "pinch", rotation: 10 },
        { id: "t", x: 278, y: 60, r: 11, shape: "jug", rotation: 180, top: true },
      ],
    },
  ],
};

export const holdDistance = (a: BoulderHold, b: BoulderHold) =>
  Math.hypot(a.x - b.x, a.y - b.y);

export const holdsWithinReach = (a: BoulderHold, b: BoulderHold, reach: number) =>
  holdDistance(a, b) <= reach;

/** 1 inside close, 2 between close and reach, null when the grab is illegal. */
export const chalkCost = (
  from: BoulderHold,
  to: BoulderHold,
  route: BoulderRoute,
): 1 | 2 | null => {
  const dist = holdDistance(from, to);
  if (dist <= route.close) return 1;
  if (dist <= route.reach) return 2;
  return null;
};

export const pathChalk = (holdIds: string[], route: BoulderRoute): number => {
  const byId = new Map(route.holds.map((hold) => [hold.id, hold]));
  let sum = 0;
  for (let i = 1; i < holdIds.length; i++) {
    const from = byId.get(holdIds[i - 1]);
    const to = byId.get(holdIds[i]);
    if (!from || !to) return Number.POSITIVE_INFINITY;
    const cost = chalkCost(from, to, route);
    if (cost == null) return Number.POSITIVE_INFINITY;
    sum += cost;
  }
  return sum;
};

/** Cheapest start-to-top chalk (Dijkstra over 1/2 edges). */
export function minChalk(route: BoulderRoute): number {
  const start = startHold(route);
  const remaining = new Set(route.holds.map((hold) => hold.id));
  const dist = new Map(route.holds.map((hold) => [hold.id, Number.POSITIVE_INFINITY]));
  dist.set(start.id, 0);
  const byId = new Map(route.holds.map((hold) => [hold.id, hold]));

  while (remaining.size > 0) {
    let current: string | null = null;
    let best = Number.POSITIVE_INFINITY;
    for (const id of remaining) {
      const d = dist.get(id)!;
      if (d < best) {
        best = d;
        current = id;
      }
    }
    if (current == null || best === Number.POSITIVE_INFINITY) break;
    remaining.delete(current);
    const from = byId.get(current)!;
    for (const to of route.holds) {
      if (to.id === current) continue;
      const cost = chalkCost(from, to, route);
      if (cost == null) continue;
      const next = best + cost;
      if (next < dist.get(to.id)!) dist.set(to.id, next);
    }
  }

  return dist.get(topHold(route).id) ?? Number.POSITIVE_INFINITY;
}

export const startHold = (route: BoulderRoute) => route.holds.find((h) => h.start)!;
export const topHold = (route: BoulderRoute) => route.holds.find((h) => h.top)!;

/** BFS move-count from the route's start to every hold; unreachable holds are absent. */
export function movesFromStart(route: BoulderRoute): Map<string, number> {
  const start = startHold(route);
  const byId = new Map(route.holds.map((h) => [h.id, h]));
  const dist = new Map<string, number>([[start.id, 0]]);
  const queue = [start.id];
  while (queue.length > 0) {
    const id = queue.shift()!;
    const from = byId.get(id)!;
    for (const hold of route.holds) {
      if (!dist.has(hold.id) && holdsWithinReach(from, hold, route.reach)) {
        dist.set(hold.id, dist.get(id)! + 1);
        queue.push(hold.id);
      }
    }
  }
  return dist;
}

/** Total chalk: chalk the climber may spend before pumping out and falling. */
export const routeBudget = (route: BoulderRoute) => minChalk(route) + route.slack;
