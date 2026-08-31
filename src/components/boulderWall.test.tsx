import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import BoulderWall from "./BoulderWall";
import {
  DESKTOP_WALL,
  MOBILE_WALL,
  minMoves,
  movesFromStart,
  routeBudget,
  type WallLayout,
} from "./boulderRoute";

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
      expect(routeBudget(route)).toBeGreaterThanOrEqual(minMoves(route));
    }
  });

  it("grades the routes in order: green easiest, gold hardest", () => {
    const [v0, v2, v4] = wall.routes.map((route) => minMoves(route));
    expect(v0).toBeGreaterThanOrEqual(3);
    expect(v0).toBeLessThanOrEqual(v2);
    expect(v2).toBeLessThanOrEqual(v4);
    expect(Number.isFinite(v4)).toBe(true);
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

  it("shows the reach ring once a route is engaged", () => {
    render(<BoulderWall />);
    expect(screen.queryByTestId("reach-ring")).toBeNull();

    fireEvent.click(hold("V0 start hold"));
    expect(screen.getByTestId("reach-ring")).toBeInTheDocument();
    expect(screen.getByRole("status").textContent).toMatch(/Malik does it in \d/);
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

    const min = minMoves(MOBILE_WALL.routes[0]);
    expect(screen.getByRole("status").textContent).toMatch(/V0 flashed/i);
    expect(screen.getByRole("status").textContent).toMatch(/even with Malik/i);
    expect(screen.getByRole("status").textContent).toContain(String(min));
    expect(onTopOut).toHaveBeenCalledTimes(1);
  });

  it("pumps out and falls when the chalk runs dry short of the top", async () => {
    render(<BoulderWall />);
    // Mobile V4 has zero slack (budget 5). This 5-move line never tops out.
    for (const label of [
      "V4 hold q1",
      "V4 hold q2",
      "V4 hold q3",
      "V4 hold q5",
      "V4 hold q4",
    ]) {
      fireEvent.click(hold(label));
    }
    expect(screen.getByRole("status").textContent).toMatch(/pumped out on V4/i);

    // The fall brushes the route clean after the animation.
    await waitFor(
      () => expect(hold("V4 hold q1")).toHaveAttribute("aria-pressed", "false"),
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
    expect(screen.getByRole("status").textContent).toMatch(/V0 sent in 5\. Malik walks it in 4/i);

    fireEvent.click(screen.getByRole("button", { name: /brush it off/i }));
    expect(screen.getByRole("status").textContent).toMatch(/three problems/i);
    expect(hold("V0 hold a1")).toHaveAttribute("aria-pressed", "false");
  });
});
