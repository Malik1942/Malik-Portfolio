# Boulder Two-Zone Chalk Design

Approved on 2026-09-02.

## Goal

Make the About Connect bouldering wall harder and more playful without
punishing a clean first send. Close hops stay cheap; far hops cost extra
chalk. V0 still flashes if the visitor stays inside the inner ring.

## Player rules

From the hold the climber is hanging on, two rings in the route color:

- Inside the **inner** ring: the grab costs **1 chalk**.
- Between inner and **outer**: the grab costs **2 chalk**.
- Outside the outer ring: shake, no spend (same as today).

Chalk is the currency. The bag is `minChalk + slack`. Slack stays V0 +2,
V2 +1, V4 0. A send that spends exactly `minChalk` is a flash. Downclimbing
refunds what that grab actually cost.

The move that empties the bag still happens. If it is not the top, the hold
lights, then the route peels off. A dyno the climber cannot quite afford is
a pump-out, not a blocked tap. Spending 1 over budget (a 2-chalk grab from 1
chalk left) still takes the hold, then falls.

No `1` / `2` labels on holds. The rings are the tell. Bag dots are chalk;
a 2-chalk grab snuffs two dots at once.

## Layout

Desktop (`DESKTOP_WALL`) and mobile (`MOBILE_WALL`) stay separate layouts
and both get retuned. Columns stay V0 left, V2 center, V4 right. Cross-route
tap areas still must not overlap. Holds stay inside the wall.

Each route has two radii in wall units: `close` (inner) and `reach` (outer).
`close < reach`. Inner ring as a fraction of reach, generous to stingy:

| Grade | Target `close / reach` | Slack |
| ----- | ---------------------- | ----- |
| V0    | ~0.75                  | +2    |
| V2    | ~0.64                  | +1    |
| V4    | ~0.55                  | 0     |

Exact radii may flex in implementation. The tests lock the grade order:
V0's ratio is strictly greater than V2's, V2's strictly greater than V4's.

Authoring contract (enforced by tests, not by a coordinate spreadsheet):

1. Every hold is reachable from its start under `reach`.
2. Every grade has a start-to-top path whose every hop is inside `close`.
   That all-1s path's chalk cost equals `minChalk`, so a clean V0 send is
   still a short close-hop line, not a dyno puzzle.
3. Every grade has at least one hold that is a legal 2-chalk grab from a
   hold on a min-chalk all-1s path — a visible temptation in the outer band.
4. Stretch `reach` as needed so the two bands are readable, not a hairline.
5. Grade tags stay `V0 · 4` style. The number is `minChalk`. Because the
   flash line is all 1s, that number equals the flash-line hop count.

Hold ids may keep today's vocabulary (`s`, `a1`…`t`, `p*`, `q*`) when the
graph shape still fits. Add or drop holds if the contract needs it.

## Rings

Two unfilled circles, centered on the current hang of the active unsent
route. They appear once that route is engaged and disappear on send, fall,
or when another route is active.

- Outer: today's light dashed ring at `reach`, `data-testid="reach-ring"`.
- Inner: same language at `close`, higher opacity and a denser dash so the
  cheap zone reads at a glance, `data-testid="close-ring"`.

## Status copy

Same voice. Chalk is the unit for budget and flash; move count stays in the
climbing progress line.

- Idle: `Three problems, graded by color. Close hops cost one chalk, dynos cost two.`
- Route selected, not pulled on: `{grade}: Malik does it in {minChalk}. Stay inside the inner ring.`
- Climbing: `{grade}: {n} move(s) in, {chalkLeft} chalk left.`
- Flash: `{grade} flashed! {minChalk} chalk, even with Malik.`
- Fat send: `{grade} sent in {spent}. Malik walks it in {minChalk}.`
- Out of reach, pump-out quips, and all-three sent: keep today's lines.

## Internals

Files: `src/components/boulderRoute.ts`, `src/components/BoulderWall.tsx`,
`src/components/boulderWall.test.tsx`.

`BoulderRoute` gains `close: number` beside `reach`. Progress stays a list
of hold ids. Spent chalk is derived from consecutive pairs so downclimb
refunds the real edge cost.

Helpers in `boulderRoute.ts`:

- `chalkCost(from, to, route)` → `1` if `dist <= close`, `2` if
  `close < dist <= reach`, unreachable otherwise.
- `pathChalk(holdIds, route)` sums `chalkCost` along consecutive pairs.
- `minChalk(route)` is the cheapest start-to-top path (Dijkstra over 1/2
  edges, not hop BFS).
- `routeBudget(route)` is `minChalk(route) + slack`.

`BoulderWall.tsx` spends, flashes, and falls on `pathChalk`, not
`path.length - 1`. Keep `movesFromStart` for reachability. Grade order
and the bag use chalk.

Sound, brush-off, independent routes, reduced motion, and the top-out
callback are unchanged.

## Tests

Keep: every hold reachable, holds on-wall, cross-route tap gap, interaction
coverage for light/reject, reach ring, independent routes, downclimb,
brush-off.

Change:

- Budget is `>= minChalk`, not `>= minMoves`.
- Grade order compares `minChalk` (still green easiest, gold hardest;
  green at least 3).
- `close < reach` on every route.
- `close/reach` strictly decreases V0 → V2 → V4.
- Every route has an all-1s start-to-top path whose cost equals `minChalk`.
- Every route has a legal 2-chalk edge from a hold on a min-chalk all-1s path.
- A 2-chalk grab drops remaining bag dots by 2.
- Mobile V0's close line still flashes.
- A wander that empties the bag short of the top still pumps out. Update
  the fixture to a real emptying line on the retuned mobile V4.

## Out of scope

- Reshooting the Connect films. `docs/superpowers/specs/2026-08-31-about-connect-bouldering-film-design.md`
  hard-codes today's holds; those lines will drift until a new cut.
- Numbers on holds, hover cost previews, or changing slack off 2 / 1 / 0.
- Rewriting sound, fall animation, or the Connect rocks under the wall.
