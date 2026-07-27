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

### The `behavior` trap

`html` sets `scroll-behavior: smooth` in `src/index.css`. Per CSSOM-View,
`scrollTo({ behavior: "auto" })` means *defer to that CSS value* — it does not
mean "jump". `scrollToTarget` must keep passing `behavior: "instant"` in both its
raf loop and its reduced-motion branch. When it passed `"auto"`, every frame of
the eased loop kicked off its own native smooth scroll, so the loop announced
arrival ~800ms before the page actually stopped moving and the pulse played
mid-flight, invisible at the destination.

The duration constants at the top of `scrollToTarget.ts` (220 / 720 / 0.5) are
tuned to preserve that original ~800ms glide. They are shared with the header
nav, so changing them changes in-page navigation site-wide.

Coverage: `src/components/projectDotArrival.test.tsx`.
