// ── Boulder wall geometry ──
// Two walls share one schema: a landscape wall for the desktop column and a
// portrait wall for stacked mobile layouts. Coordinates live in each wall's
// own unit space; the DOM scales them by percent so the wall stays
// proportional at every width. Each route is an independent reach graph in a
// gym color: reach and close are the tuning knobs per route, verified in
// boulderWall.test.tsx so every hold is reachable, the close-only flash line
// matches min chalk, and no cross-route holds collide with tap areas.

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
      reach: 160,
      close: 120,
      slack: 2,
      holds: [
        { id: "s", x: 120, y: 420, r: 13, shape: "jug", rotation: 0, start: true },
        { id: "a1", x: 150, y: 330, r: 10, shape: "sloper", rotation: 20 },
        { id: "a2", x: 30, y: 310, r: 11, shape: "jug", rotation: -30 },
        { id: "a3", x: 110, y: 240, r: 10, shape: "pinch", rotation: 15 },
        { id: "a4", x: 155, y: 150, r: 10, shape: "sloper", rotation: -15 },
        { id: "t", x: 125, y: 55, r: 13, shape: "jug", rotation: 180, top: true },
      ],
    },
    {
      id: "v2",
      grade: "V2",
      colorVar: "--component-case-study-module-accent-violet",
      reach: 150,
      close: 96,
      slack: 1,
      holds: [
        { id: "s", x: 370, y: 425, r: 12, shape: "jug", rotation: 0, start: true },
        { id: "p1", x: 340, y: 345, r: 9, shape: "crimp", rotation: -10 },
        { id: "p2", x: 470, y: 355, r: 10, shape: "sloper", rotation: 25 },
        { id: "p3", x: 385, y: 270, r: 10, shape: "pinch", rotation: -20 },
        { id: "p4", x: 335, y: 195, r: 9, shape: "crimp", rotation: 12 },
        { id: "p5", x: 500, y: 240, r: 10, shape: "sloper", rotation: -35 },
        { id: "p6", x: 380, y: 115, r: 9, shape: "pinch", rotation: 30 },
        { id: "t", x: 355, y: 40, r: 12, shape: "jug", rotation: 180, top: true },
      ],
    },
    {
      id: "v4",
      grade: "V4",
      colorVar: "--color-accent-workshop",
      reach: 145,
      close: 80,
      slack: 0,
      holds: [
        { id: "s", x: 610, y: 420, r: 12, shape: "jug", rotation: 0, start: true },
        { id: "q1", x: 585, y: 355, r: 8, shape: "crimp", rotation: 18 },
        { id: "q2", x: 700, y: 360, r: 9, shape: "sloper", rotation: -22 },
        { id: "q3", x: 630, y: 295, r: 8, shape: "crimp", rotation: -8 },
        { id: "q4", x: 590, y: 230, r: 9, shape: "pinch", rotation: 24 },
        { id: "q5", x: 705, y: 250, r: 9, shape: "sloper", rotation: 40 },
        { id: "q6", x: 635, y: 165, r: 8, shape: "crimp", rotation: -16 },
        { id: "q7", x: 595, y: 100, r: 9, shape: "pinch", rotation: -28 },
        { id: "t", x: 630, y: 40, r: 12, shape: "jug", rotation: 180, top: true },
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
      reach: 140,
      close: 105,
      slack: 2,
      holds: [
        { id: "s", x: 55, y: 430, r: 12, shape: "jug", rotation: 0, start: true },
        { id: "a1", x: 85, y: 345, r: 9, shape: "sloper", rotation: 20 },
        { id: "a2", x: 18, y: 310, r: 10, shape: "jug", rotation: -30 },
        { id: "a3", x: 50, y: 260, r: 9, shape: "pinch", rotation: 15 },
        { id: "a4", x: 88, y: 175, r: 9, shape: "sloper", rotation: -15 },
        { id: "t", x: 58, y: 90, r: 12, shape: "jug", rotation: 180, top: true },
      ],
    },
    {
      id: "v2",
      grade: "V2",
      colorVar: "--component-case-study-module-accent-violet",
      reach: 133,
      close: 85,
      slack: 1,
      holds: [
        { id: "s", x: 175, y: 435, r: 11, shape: "jug", rotation: 0, start: true },
        { id: "p1", x: 150, y: 360, r: 8, shape: "crimp", rotation: -10 },
        { id: "p2", x: 220, y: 360, r: 9, shape: "sloper", rotation: 25 },
        { id: "p3", x: 188, y: 288, r: 9, shape: "pinch", rotation: -20 },
        { id: "p4", x: 155, y: 215, r: 8, shape: "crimp", rotation: 12 },
        { id: "p5", x: 240, y: 200, r: 9, shape: "sloper", rotation: -35 },
        { id: "p6", x: 185, y: 140, r: 8, shape: "pinch", rotation: 30 },
        { id: "t", x: 160, y: 70, r: 11, shape: "jug", rotation: 180, top: true },
      ],
    },
    {
      id: "v4",
      grade: "V4",
      colorVar: "--color-accent-workshop",
      reach: 125,
      close: 69,
      slack: 0,
      holds: [
        { id: "s", x: 290, y: 430, r: 11, shape: "jug", rotation: 0, start: true },
        { id: "q1", x: 270, y: 370, r: 8, shape: "crimp", rotation: 18 },
        { id: "q2", x: 328, y: 355, r: 8, shape: "sloper", rotation: -22 },
        { id: "q3", x: 305, y: 315, r: 8, shape: "crimp", rotation: -8 },
        { id: "q4", x: 282, y: 255, r: 8, shape: "pinch", rotation: 24 },
        { id: "q5", x: 330, y: 235, r: 8, shape: "sloper", rotation: 40 },
        { id: "q6", x: 310, y: 195, r: 8, shape: "crimp", rotation: -16 },
        { id: "q7", x: 280, y: 135, r: 8, shape: "pinch", rotation: -28 },
        { id: "t", x: 305, y: 78, r: 11, shape: "jug", rotation: 180, top: true },
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

export const minMoves = (route: BoulderRoute) =>
  movesFromStart(route).get(topHold(route).id) ?? Number.POSITIVE_INFINITY;

/** Total chalk: chalk the climber may spend before pumping out and falling. */
export const routeBudget = (route: BoulderRoute) => minChalk(route) + route.slack;
