# Repo notes

## Do not change the hero dot → project animation

The animation that runs when you click a project dot in the hero canvas is
**intentional and tuned. Do not alter, "simplify", or refactor it** without an
explicit request to change it. It has already been silently broken twice.

The behavior: clicking a project dot eases the page to that project's card, and
the card answers with a brief pulse on landing.

It depends on four pieces staying wired together. Breaking any one of them kills
the animation **silently** — no error, no test failure, the click still scrolls:

1. `src/components/DotGrid.tsx` — `scrollToProjectCard()` must go through
   `scrollToTarget`, not `element.scrollIntoView()`. Native smooth scrolling
   reports no completion, so nothing can tell the card it has been landed on.
2. `src/lib/scrollToTarget.ts` — dispatches `project-dot-arrive` when the scroll
   settles.
3. `src/components/ProjectList.tsx` — `ProjectCard` listens for
   `project-dot-arrive` and applies `.project-row-arriving`. It also force-reveals
   the card: the scroll outruns the entrance animation, so a card that was never
   scrolled past would otherwise still be at `opacity: 0` when the pulse fires.
4. `src/index.css` — the `.project-row-arriving` / `project-row-arrival`
   keyframes. These sat orphaned in the stylesheet for months after step 3 was
   deleted in a card redesign, which is how the animation went missing.

### Do not animate this scroll from JavaScript

`scrollToTarget` hands the scroll to the browser (`behavior: "smooth"`) and then
*watches* for it to finish. Do not "improve" this into a requestAnimationFrame
loop that sets `window.scrollTo` each frame for custom easing or duration. That
version existed and was visibly laggy in production: a raf loop runs the whole
animation on the main thread, so it drops frames against anything else happening
there — and a dot click starts a long scroll that pulls several `loading="lazy"`
cover images (1620–2400px wide) into view at once, decoding them mid-flight.
A native smooth scroll is driven on the compositor and is immune to that.

The trade is that we don't get to pick the duration or curve, and we can't know
when it ends by arithmetic. `announceOnScrollEnd` handles the latter: `scrollend`
where available, otherwise watching `window.scrollY` settle, with a timeout. Note
it waits `MIN_SETTLE_MS` before trusting stillness — a smooth scroll has not
started moving on the frame after you request it, and treating that initial
stillness as "arrived" fires the pulse instantly.

### The `behavior` trap

`html` sets `scroll-behavior: smooth` in `src/index.css`. Per CSSOM-View,
`scrollTo({ behavior: "auto" })` means *defer to that CSS value* — it does not
mean "jump". Any call here that must not animate (the reduced-motion branch) has
to pass `behavior: "instant"` explicitly, or it will smooth-scroll anyway.

Coverage: `src/components/projectDotArrival.test.tsx`.

## Design system conventions

The system is read in three facets: **form** (type role, spacing, radius,
measure), **material** (surfaces, the five-tier ink ladder, hairlines, focus
rings), and **motion** (duration and easing tokens, five named recipes).
Foundations, component docs, and code all use that vocabulary.

- Tokens are DTCG JSON in `tokens/`; `npm run tokens:build` generates the CSS
  variables and manifest. Every Tailwind utility that expresses a system
  decision references a token variable, so the workbench can edit live.
- Ink is a role, never a raw opacity: `text-foreground`, `-lead`, `-secondary`,
  `-tertiary`, `-quiet` (quiet is decorative-only). Rules are `border-hairline`
  or `border-hairline-faint`; focus is `ring-focus` or `ring-focus-strong`.
  Never write `text-foreground/72`: Tailwind's opacity scale is multiples of 5
  and anything else generates no CSS at all. That is how the secondary tier
  shipped at 100% for months; its alpha lives in `tokens/semantic.tokens.json`.
- Motion in CSS and Tailwind: `duration-fast|medium|slow|page|reveal|ambient`,
  `ease-enter|move|standard|settle|exit|ambient`. In Framer Motion import
  `DURATION`, `EASE`, or a `MOTION` recipe from `src/design-system/system/motion`.
- Reusable primitives live in `src/components/ui/` (Button, BackLink, Chip,
  Eyebrow). They declare their classes with `defineRecipe` split into the three
  facets; add a variant by adding to one facet.
- `src/design-system/boundary.test.ts` fails on off-system classes and color
  literals. Tailwind drops an unknown class silently, so the test is the only
  thing that catches `text-lg` or `duration-150`. Art-directed exemptions are
  listed there by name; add to the list, do not loosen the rule.
