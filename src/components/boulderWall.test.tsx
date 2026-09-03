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
    // Mobile V4 is exact-chalk. Three dynos spend the bag without the top.
    for (const label of ["V4 hold q2", "V4 hold q5", "V4 hold q7"]) {
      fireEvent.click(hold(label));
    }
    expect(screen.getByRole("status").textContent).toMatch(/pumped out on V4/i);

    await waitFor(
      () => expect(hold("V4 hold q2")).toHaveAttribute("aria-pressed", "false"),
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
