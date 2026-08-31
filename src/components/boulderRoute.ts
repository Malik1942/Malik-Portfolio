// ── Boulder wall geometry ──
// Two walls share one schema: a landscape wall for the desktop column and a
// portrait wall for stacked mobile layouts. Coordinates live in each wall's
// own unit space; the DOM scales them by percent so the wall stays
// proportional at every width. Each route is an independent reach graph in a
// gym color: reach is the tuning knob per route, verified in
// boulderWall.test.tsx so every hold is reachable, the shortest line matches
// the advertised move count, and no cross-route holds collide with tap areas.

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
      reach: 120,
      slack: 2,
      holds: [
        { id: "s", x: 120, y: 420, r: 13, shape: "jug", rotation: 0, start: true },
        { id: "a1", x: 195, y: 335, r: 10, shape: "sloper", rotation: 20 },
        { id: "a2", x: 90, y: 330, r: 11, shape: "jug", rotation: -30 },
        { id: "a3", x: 160, y: 240, r: 10, shape: "pinch", rotation: 15 },
        { id: "a4", x: 120, y: 150, r: 10, shape: "sloper", rotation: -15 },
        { id: "t", x: 150, y: 60, r: 13, shape: "jug", rotation: 180, top: true },
      ],
    },
    {
      id: "v2",
      grade: "V2",
      colorVar: "--component-case-study-module-accent-violet",
      reach: 110,
      slack: 1,
      holds: [
        { id: "s", x: 370, y: 425, r: 12, shape: "jug", rotation: 0, start: true },
        { id: "p1", x: 305, y: 350, r: 9, shape: "crimp", rotation: -10 },
        { id: "p2", x: 430, y: 340, r: 10, shape: "sloper", rotation: 25 },
        { id: "p3", x: 365, y: 260, r: 10, shape: "pinch", rotation: -20 },
        { id: "p4", x: 295, y: 180, r: 9, shape: "crimp", rotation: 12 },
        { id: "p5", x: 450, y: 250, r: 10, shape: "sloper", rotation: -35 },
        { id: "p6", x: 340, y: 105, r: 9, shape: "pinch", rotation: 30 },
        { id: "t", x: 400, y: 40, r: 12, shape: "jug", rotation: 180, top: true },
      ],
    },
    {
      id: "v4",
      grade: "V4",
      colorVar: "--color-accent-workshop",
      reach: 100,
      slack: 0,
      holds: [
        { id: "s", x: 600, y: 420, r: 12, shape: "jug", rotation: 0, start: true },
        { id: "q1", x: 540, y: 345, r: 8, shape: "crimp", rotation: 18 },
        { id: "q2", x: 665, y: 350, r: 9, shape: "sloper", rotation: -22 },
        { id: "q3", x: 610, y: 278, r: 8, shape: "crimp", rotation: -8 },
        { id: "q4", x: 545, y: 205, r: 9, shape: "pinch", rotation: 24 },
        { id: "q5", x: 680, y: 255, r: 9, shape: "sloper", rotation: 40 },
        { id: "q6", x: 615, y: 140, r: 8, shape: "crimp", rotation: -16 },
        { id: "q7", x: 550, y: 75, r: 9, shape: "pinch", rotation: -28 },
        { id: "t", x: 630, y: 35, r: 12, shape: "jug", rotation: 180, top: true },
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
      reach: 105,
      slack: 2,
      holds: [
        { id: "s", x: 60, y: 430, r: 12, shape: "jug", rotation: 0, start: true },
        { id: "a1", x: 95, y: 350, r: 9, shape: "sloper", rotation: 20 },
        { id: "a2", x: 30, y: 345, r: 10, shape: "jug", rotation: -30 },
        { id: "a3", x: 62, y: 265, r: 9, shape: "pinch", rotation: 15 },
        { id: "a4", x: 95, y: 185, r: 9, shape: "sloper", rotation: -15 },
        { id: "t", x: 60, y: 100, r: 12, shape: "jug", rotation: 180, top: true },
      ],
    },
    {
      id: "v2",
      grade: "V2",
      colorVar: "--component-case-study-module-accent-violet",
      reach: 95,
      slack: 1,
      holds: [
        { id: "s", x: 175, y: 435, r: 11, shape: "jug", rotation: 0, start: true },
        { id: "p1", x: 145, y: 350, r: 8, shape: "crimp", rotation: -10 },
        { id: "p2", x: 215, y: 355, r: 9, shape: "sloper", rotation: 25 },
        { id: "p3", x: 178, y: 270, r: 9, shape: "pinch", rotation: -20 },
        { id: "p4", x: 140, y: 185, r: 8, shape: "crimp", rotation: 12 },
        { id: "p5", x: 218, y: 195, r: 9, shape: "sloper", rotation: -35 },
        { id: "p6", x: 182, y: 105, r: 8, shape: "pinch", rotation: 30 },
        { id: "t", x: 155, y: 30, r: 11, shape: "jug", rotation: 180, top: true },
      ],
    },
    {
      id: "v4",
      grade: "V4",
      colorVar: "--color-accent-workshop",
      reach: 90,
      slack: 0,
      holds: [
        { id: "s", x: 290, y: 430, r: 11, shape: "jug", rotation: 0, start: true },
        { id: "q1", x: 262, y: 355, r: 8, shape: "crimp", rotation: 18 },
        { id: "q2", x: 325, y: 350, r: 8, shape: "sloper", rotation: -22 },
        { id: "q3", x: 288, y: 275, r: 8, shape: "crimp", rotation: -8 },
        { id: "q4", x: 258, y: 200, r: 8, shape: "pinch", rotation: 24 },
        { id: "q5", x: 322, y: 215, r: 8, shape: "sloper", rotation: 40 },
        { id: "q6", x: 292, y: 130, r: 8, shape: "crimp", rotation: -16 },
        { id: "q7", x: 250, y: 62, r: 8, shape: "pinch", rotation: -28 },
        { id: "t", x: 310, y: 45, r: 11, shape: "jug", rotation: 180, top: true },
      ],
    },
  ],
};

export const holdsWithinReach = (a: BoulderHold, b: BoulderHold, reach: number) =>
  Math.hypot(a.x - b.x, a.y - b.y) <= reach;

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

/** Total chalk: moves the climber may spend before pumping out and falling. */
export const routeBudget = (route: BoulderRoute) => minMoves(route) + route.slack;
