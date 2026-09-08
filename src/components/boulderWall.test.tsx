import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import BoulderWall from "./BoulderWall";
import {
  DESKTOP_WALL,
  MOBILE_WALL,
  chalkCost,
  holdDistance,
  minChalk,
  movesFromStart,
  pathChalk,
  routeBudget,
  startHold,
  topHold,
  type BoulderHold,
  type BoulderRoute,
  type WallLayout,
} from "./boulderRoute";

const holdAt = (
  id: string,
  x: number,
  y: number,
  extra: Partial<BoulderHold> = {},
): BoulderHold => ({
  id,
  x,
  y,
  r: 8,
  shape: "jug",
  rotation: 0,
  ...extra,
});

const hopsFrom = (route: BoulderRoute, originId: string, maxDist: number) => {
  const byId = new Map(route.holds.map((hold) => [hold.id, hold]));
  const dist = new Map<string, number>([[originId, 0]]);
  const queue = [originId];
  while (queue.length > 0) {
    const id = queue.shift()!;
    const from = byId.get(id)!;
    for (const hold of route.holds) {
      if (!dist.has(hold.id) && holdDistance(from, hold) <= maxDist) {
        dist.set(hold.id, dist.get(id)! + 1);
        queue.push(hold.id);
      }
    }
  }
  return dist;
};

/** Every simple start-to-top line whose chalk fits the bag, as hold-id lists. */
const sendingLines = (route: BoulderRoute): string[][] => {
  const byId = new Map(route.holds.map((hold) => [hold.id, hold]));
  const budget = routeBudget(route);
  const lines: string[][] = [];
  const walk = (path: string[], spent: number) => {
    const from = byId.get(path[path.length - 1])!;
    for (const to of route.holds) {
      if (path.includes(to.id)) continue;
      const cost = chalkCost(from, to, route);
      if (cost == null || spent + cost > budget) continue;
      if (to.top) lines.push([...path, to.id]);
      else walk([...path, to.id], spent + cost);
    }
  };
  walk([startHold(route).id], 0);
  return lines;
};

/** close=60, reach=100. s—a is 1, s—b is 2, s—t is 2, a—t is 1. */
const toyRoute: BoulderRoute = {
  id: "v0",
  grade: "V0",
  colorVar: "--toy",
  reach: 100,
  close: 60,
  slack: 1,
  holds: [
    holdAt("s", 0, 0, { start: true }),
    holdAt("a", 50, 0),
    holdAt("b", 80, 0),
    holdAt("t", 50, 50, { top: true }),
  ],
};

// framer-motion's useReducedMotion and the wall's breakpoint hook read
// matchMedia, which jsdom does not ship. matches: false → the mobile wall.
beforeAll(() => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    })),
  );
});

afterEach(cleanup);

describe("two-zone chalk", () => {
  it("charges 1 inside close, 2 between close and reach, and rejects beyond", () => {
    const [start, near, far] = toyRoute.holds;
    expect(chalkCost(start, near, toyRoute)).toBe(1);
    expect(chalkCost(start, far, toyRoute)).toBe(2);
    expect(chalkCost(start, holdAt("out", 200, 0), toyRoute)).toBeNull();
  });

  it("sums a line's chalk and finds the cheapest start-to-top cost", () => {
    expect(pathChalk(["s"], toyRoute)).toBe(0);
    expect(pathChalk(["s", "a", "t"], toyRoute)).toBe(2);
    expect(pathChalk(["s", "b", "t"], toyRoute)).toBe(3);
    expect(minChalk(toyRoute)).toBe(2);
  });

  it("sizes the bag as cheapest chalk plus slack", () => {
    expect(routeBudget(toyRoute)).toBe(3);
  });
});

describe.each([
  ["desktop", DESKTOP_WALL],
  ["mobile", MOBILE_WALL],
] as [string, WallLayout][])("%s wall geometry", (_name, wall) => {
  it("keeps every hold of every route reachable from its start", () => {
    for (const route of wall.routes) {
      const dist = movesFromStart(route);
      for (const hold of route.holds) {
        expect(dist.has(hold.id), `${route.id} hold ${hold.id} is stranded`).toBe(true);
      }
    }
  });

  it("gives every route at least its minimum line of chalk", () => {
    for (const route of wall.routes) {
      expect(routeBudget(route)).toBeGreaterThanOrEqual(minChalk(route));
    }
  });

  it("grades the routes in order: green easiest, gold hardest", () => {
    const [v0, v2, v4] = wall.routes.map((route) => minChalk(route));
    expect(v0).toBeGreaterThanOrEqual(3);
    expect(v0).toBeLessThanOrEqual(v2);
    expect(v2).toBeLessThanOrEqual(v4);
    expect(Number.isFinite(v4)).toBe(true);
  });

  it("keeps the inner ring inside reach, generous on V0 and stingy on V4", () => {
    const ratios = wall.routes.map((route) => {
      expect(route.close).toBeLessThan(route.reach);
      return route.close / route.reach;
    });
    expect(ratios[0]).toBeGreaterThan(ratios[1]);
    expect(ratios[1]).toBeGreaterThan(ratios[2]);
  });

  it("has a close-only flash line whose chalk is the cheapest, plus a 2-chalk temptation", () => {
    for (const route of wall.routes) {
      const closeHops = hopsFrom(route, startHold(route).id, route.close);
      const hopsToTop = closeHops.get(topHold(route).id);
      expect(hopsToTop, `${route.id} has no inner-ring line`).toBe(minChalk(route));

      const toTop = hopsFrom(route, topHold(route).id, route.close);
      const onFlash = route.holds.filter((hold) => {
        const fromStart = closeHops.get(hold.id);
        const fromTop = toTop.get(hold.id);
        return fromStart != null && fromTop != null && fromStart + fromTop === hopsToTop;
      });
      const temptation = onFlash.some((from) =>
        route.holds.some((to) => chalkCost(from, to, route) === 2),
      );
      expect(temptation, `${route.id} has no 2-chalk grab off the flash line`).toBe(true);
    }
  });

  it("never lets a dyno skip a hold: every send takes at least the flash's move count", () => {
    for (const route of wall.routes) {
      for (const line of sendingLines(route)) {
        expect(
          line.length - 1,
          `${route.id} sends in ${line.length - 1} via ${line.join(">")}`,
        ).toBeGreaterThanOrEqual(minChalk(route));
      }
    }
  });

  it("narrows the sends by grade: one exact line on V4, a single wobble on V2", () => {
    const [v0, v2, v4] = wall.routes.map((route) => sendingLines(route).length);
    expect(v4).toBe(1);
    expect(v2).toBeGreaterThanOrEqual(2);
    expect(v2).toBeLessThanOrEqual(3);
    expect(v2).toBeLessThan(v0);
  });

  // Visitors scan left-to-right and take the leftmost cheap hold. That lane
  // is the bait on V4, not the flash.
  const greedyLeft = (route: BoulderRoute) => {
    const byId = new Map(route.holds.map((hold) => [hold.id, hold]));
    const budget = routeBudget(route);
    const path = [startHold(route).id];
    let spent = 0;
    while (true) {
      const from = byId.get(path[path.length - 1])!;
      if (from.top) break;
      const unused = route.holds.filter(
        (hold) => !path.includes(hold.id) && hold.y < from.y && chalkCost(from, hold, route) != null,
      );
      const cheap = unused.filter((hold) => chalkCost(from, hold, route) === 1);
      const opts = (cheap.length ? cheap : unused).slice().sort((a, b) => a.x - b.x);
      if (!opts.length) break;
      const next = opts[0];
      const cost = chalkCost(from, next, route)!;
      path.push(next.id);
      spent += cost;
      if (next.top || spent >= budget) break;
    }
    return path;
  };

  it("hides V4's flash off the leftmost cheap lane", () => {
    const v4 = wall.routes[2];
    const start = startHold(v4);
    const send = sendingLines(v4)[0];
    const firsts = v4.holds.filter(
      (hold) => !hold.start && hold.y < start.y && chalkCost(start, hold, v4) === 1,
    );
    const leftmost = firsts.reduce((a, b) => (a.x <= b.x ? a : b));
    expect(
      send.includes(leftmost.id),
      `left first move ${leftmost.id} is on the flash ${send.join(">")}`,
    ).toBe(false);

    const left = greedyLeft(v4);
    const sent =
      left[left.length - 1] === topHold(v4).id && pathChalk(left, v4) <= routeBudget(v4);
    expect(sent, `left-greedy sent via ${left.join(">")}`).toBe(false);
  });

  // Line holds that offer an upward 1-chalk grab onto a hold no send uses.
  // Ring-counting cannot tell these from the line; only trying them can.
  const forkedLineHolds = (route: BoulderRoute) => {
    const onLine = new Set(sendingLines(route).flat());
    return route.holds.filter(
      (from) =>
        onLine.has(from.id) &&
        !from.top &&
        route.holds.some(
          (to) => !onLine.has(to.id) && to.y < from.y && chalkCost(from, to, route) === 1,
        ),
    ).length;
  };

  it("forks V4 enough to hide the line without crowding the column", () => {
    const [, v2, v4] = wall.routes;
    expect(v4.holds.length).toBeLessThanOrEqual(12);
    expect(forkedLineHolds(v4)).toBeGreaterThanOrEqual(3);
    expect(forkedLineHolds(v4)).toBeGreaterThan(forkedLineHolds(v2));
  });

  // Visual distribution: a pair closer than half the inner ring reads as a
  // blob, and the rest of the column looks empty. Difficulty is the cost
  // graph; this only forbids stacking holds on top of each other.
  it("spreads holds instead of stacking them into a blob", () => {
    for (const route of wall.routes) {
      const floor = route.close * 0.52;
      for (let i = 0; i < route.holds.length; i++) {
        for (let j = i + 1; j < route.holds.length; j++) {
          const a = route.holds[i];
          const b = route.holds[j];
          const d = holdDistance(a, b);
          expect(
            d,
            `${route.id} ${a.id}-${b.id} bunched at ${d.toFixed(1)} (need ≥ ${floor.toFixed(1)})`,
          ).toBeGreaterThanOrEqual(floor);
        }
      }
    }
  });

  // A hang with chalk left and nothing in the rings feels broken: the top
  // just shakes. Every in-budget hang must still have a grab, and a 1-chalk
  // leftover with no cheap hop must offer the top as a 2-chalk glory slap.
  const unusedInReach = (route: BoulderRoute, from: BoulderHold, path: string[]) =>
    route.holds.filter((hold) => !path.includes(hold.id) && chalkCost(from, hold, route) != null);

  const inBudgetHangs = (route: BoulderRoute) => {
    const byId = new Map(route.holds.map((hold) => [hold.id, hold]));
    const budget = routeBudget(route);
    const hangs: { path: string[]; spent: number }[] = [];
    const walk = (path: string[], spent: number) => {
      const from = byId.get(path[path.length - 1])!;
      if (!from.top) hangs.push({ path, spent });
      for (const to of unusedInReach(route, from, path)) {
        const cost = chalkCost(from, to, route)!;
        if (to.top || spent + cost > budget) continue;
        walk([...path, to.id], spent + cost);
      }
    };
    walk([startHold(route).id], 0);
    return hangs;
  };

  it("never strands a climber high on the wall with chalk left", () => {
    for (const route of wall.routes) {
      const byId = new Map(route.holds.map((hold) => [hold.id, hold]));
      const budget = routeBudget(route);
      const start = startHold(route);
      const top = topHold(route);
      const midline = (start.y + top.y) / 2;
      for (const hang of inBudgetHangs(route)) {
        if (hang.spent >= budget) continue;
        const from = byId.get(hang.path[hang.path.length - 1])!;
        if (from.y > midline) continue;
        expect(
          unusedInReach(route, from, hang.path).length,
          `${route.id} isolated high at ${hang.path.join(">")}`,
        ).toBeGreaterThan(0);
      }
    }
  });

  it("puts the top in the outer ring when one chalk is left and no cheap hop remains", () => {
    for (const route of wall.routes) {
      const byId = new Map(route.holds.map((hold) => [hold.id, hold]));
      const budget = routeBudget(route);
      const top = topHold(route);
      const midline = (startHold(route).y + topHold(route).y) / 2;
      for (const hang of inBudgetHangs(route)) {
        if (budget - hang.spent !== 1) continue;
        const from = byId.get(hang.path[hang.path.length - 1])!;
        if (from.y > midline) continue;
        const cheap = unusedInReach(route, from, hang.path).some(
          (hold) => chalkCost(from, hold, route) === 1,
        );
        if (cheap) continue;
        expect(
          chalkCost(from, top, route),
          `${route.id} ${hang.path.join(">")}: leftover 1, no cheap hop, top not a dyno`,
        ).toBe(2);
      }
    }
  });

  it("forks V2 early so it is not V0 with fewer holds", () => {
    const v2 = wall.routes[1];
    expect(forkedLineHolds(v2)).toBeGreaterThanOrEqual(2);
  });

  it("keeps holds inside the wall and tap areas from overlapping across routes", () => {
    const all = wall.routes.flatMap((route) =>
      route.holds.map((hold) => ({ ...hold, routeId: route.id })),
    );
    for (const hold of all) {
      expect(hold.x - hold.r).toBeGreaterThanOrEqual(0);
      expect(hold.x + hold.r).toBeLessThanOrEqual(wall.width);
      expect(hold.y - hold.r).toBeGreaterThanOrEqual(0);
      expect(hold.y + hold.r).toBeLessThanOrEqual(wall.height);
    }
    for (let i = 0; i < all.length; i++) {
      for (let j = i + 1; j < all.length; j++) {
        if (all[i].routeId === all[j].routeId) continue;
        const gap = Math.hypot(all[i].x - all[j].x, all[i].y - all[j].y);
        expect(
          gap,
          `${all[i].routeId}:${all[i].id} and ${all[j].routeId}:${all[j].id} tap areas overlap`,
        ).toBeGreaterThanOrEqual(wall.hitArea);
      }
    }
  });
});

// Interaction runs against the mobile wall (matchMedia stub reports < 1024px).
describe("BoulderWall interaction", () => {
  const hold = (label: string) => screen.getByRole("button", { name: label });
  const v0Line = ["V0 hold a1", "V0 hold a3", "V0 hold a4", "V0 top hold"];

  it("lights a hold within reach and rejects one out of reach", () => {
    render(<BoulderWall />);

    fireEvent.click(hold("V0 hold a4"));
    expect(hold("V0 hold a4")).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("status").textContent).toMatch(/out of reach on V0/i);

    fireEvent.click(hold("V0 hold a1"));
    expect(hold("V0 hold a1")).toHaveAttribute("aria-pressed", "true");
  });

  it("shows both rings once a route is engaged", () => {
    render(<BoulderWall />);
    expect(screen.queryByTestId("reach-ring")).toBeNull();
    expect(screen.queryByTestId("close-ring")).toBeNull();
    expect(screen.getByRole("status").textContent).toMatch(/close hops cost one chalk/i);

    fireEvent.click(hold("V0 start hold"));
    expect(screen.getByTestId("reach-ring")).toBeInTheDocument();
    expect(screen.getByTestId("close-ring")).toBeInTheDocument();
    expect(screen.getByRole("status").textContent).toMatch(/Malik does it in \d/);
    expect(screen.getByRole("status").textContent).toMatch(/inner ring/i);
  });

  it("climbs routes independently, keeping both lines lit", () => {
    render(<BoulderWall />);
    fireEvent.click(hold("V0 hold a1"));
    fireEvent.click(hold("V2 hold p1"));
    expect(hold("V0 hold a1")).toHaveAttribute("aria-pressed", "true");
    expect(hold("V2 hold p1")).toHaveAttribute("aria-pressed", "true");
  });

  it("downclimbs when the last lit hold is tapped again", () => {
    render(<BoulderWall />);
    fireEvent.click(hold("V0 hold a1"));
    fireEvent.click(hold("V0 hold a1"));
    expect(hold("V0 hold a1")).toHaveAttribute("aria-pressed", "false");
  });

  it("celebrates a shortest line as a flash and reports the top-out", () => {
    const onTopOut = vi.fn();
    render(<BoulderWall onTopOut={onTopOut} />);
    for (const label of v0Line) fireEvent.click(hold(label));

    const min = minChalk(MOBILE_WALL.routes[0]);
    expect(screen.getByRole("status").textContent).toMatch(/V0 flashed/i);
    expect(screen.getByRole("status").textContent).toMatch(/even with Malik/i);
    expect(screen.getByRole("status").textContent).toMatch(/chalk/i);
    expect(screen.getByRole("status").textContent).toContain(String(min));
    expect(onTopOut).toHaveBeenCalledTimes(1);
  });

  it("snuffs two bag dots for a far grab", () => {
    render(<BoulderWall />);
    fireEvent.click(hold("V0 hold a2"));
    const v0 = MOBILE_WALL.routes[0];
    expect(
      screen.getByLabelText(`Chalk left on V0: ${routeBudget(v0) - 2} of ${routeBudget(v0)}`),
    ).toBeInTheDocument();
  });

  it("pumps out and falls when the chalk runs dry short of the top", async () => {
    render(<BoulderWall />);
    // Mobile V4 is exact-chalk. Start on the center dyno, then join the
    // right-hand line: the bag empties on q12, one move under the top.
    for (const label of ["V4 hold q3", "V4 hold q8", "V4 hold q6", "V4 hold q10", "V4 hold q12"]) {
      fireEvent.click(hold(label));
    }
    expect(screen.getByRole("status").textContent).toMatch(/pumped out on V4/i);

    await waitFor(
      () => expect(hold("V4 hold q3")).toHaveAttribute("aria-pressed", "false"),
      { timeout: 2500 },
    );
  });

  it("pumps out on a dyno to the top that the bag cannot cover", async () => {
    render(<BoulderWall />);
    // Mobile V0 budget is 6. An opening dyno plus a wander leave 1 chalk on
    // a5, and the top sits in a5's outer band: the grab happens, then falls.
    for (const label of ["V0 hold a2", "V0 hold a1", "V0 hold a3", "V0 hold a5", "V0 top hold"]) {
      fireEvent.click(hold(label));
    }
    expect(screen.getByRole("status").textContent).toMatch(/pumped out on V0/i);
    await waitFor(
      () => expect(hold("V0 hold a2")).toHaveAttribute("aria-pressed", "false"),
      { timeout: 2500 },
    );
  });

  it("falls when a decoy hang slaps the top with the last chalk", async () => {
    const route = MOBILE_WALL.routes[1];
    const byId = new Map(route.holds.map((h) => [h.id, h]));
    const budget = routeBudget(route);
    const top = topHold(route);
    let slap: string[] | null = null;
    const walk = (path: string[], spent: number) => {
      if (slap) return;
      const from = byId.get(path[path.length - 1])!;
      if (
        !from.top &&
        budget - spent === 1 &&
        chalkCost(from, top, route) === 2 &&
        !route.holds.some(
          (h) => !path.includes(h.id) && chalkCost(from, h, route) === 1,
        )
      ) {
        slap = [...path, top.id];
        return;
      }
      for (const to of route.holds) {
        if (path.includes(to.id) || to.top) continue;
        const cost = chalkCost(from, to, route);
        if (cost == null || spent + cost > budget) continue;
        walk([...path, to.id], spent + cost);
      }
    };
    walk([startHold(route).id], 0);
    expect(slap, "mobile V2 has no glory-slap decoy").not.toBeNull();

    render(<BoulderWall />);
    for (const id of slap!.slice(1)) {
      fireEvent.click(hold(id === top.id ? "V2 top hold" : `V2 hold ${id}`));
    }
    expect(screen.getByRole("status").textContent).toMatch(/pumped out on V2/i);
    const firstHold = slap!.find((id) => id !== startHold(route).id && id !== top.id)!;
    await waitFor(
      () => expect(hold(`V2 hold ${firstHold}`)).toHaveAttribute("aria-pressed", "false"),
      { timeout: 2500 },
    );
  });

  it("reports the cleaner line after a wandering send, and resets", () => {
    render(<BoulderWall />);
    for (const label of [
      "V0 hold a2",
      "V0 hold a1",
      "V0 hold a3",
      "V0 hold a4",
      "V0 top hold",
    ]) {
      fireEvent.click(hold(label));
    }
    expect(screen.getByRole("status").textContent).toMatch(/V0 sent in 6\. Malik walks it in 4/i);

    fireEvent.click(screen.getByRole("button", { name: /brush it off/i }));
    expect(screen.getByRole("status").textContent).toMatch(/three problems/i);
    expect(hold("V0 hold a1")).toHaveAttribute("aria-pressed", "false");
  });
});
