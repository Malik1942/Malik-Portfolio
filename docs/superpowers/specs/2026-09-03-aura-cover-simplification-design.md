# Aura cover: less type, same title card

**Date:** 2026-09-03
**Status:** implemented

## The house language

Every Selected Work cover is a **full-bleed title card that owns its frame**:
its own ground, edge to edge, rounded corners, with the wordmark set on it.

- **Moti** — a light grey ground, the app icon, the "Moti: Plan" wordmark, a phone.
- **NeuraLyfe** — a photographed field, the wordmark, a rule beneath it, the
  helmet, and two lines of copy.

Type inside the cover is not a defect here. It is the pattern. NeuraLyfe carries
a wordmark, a rule, and two lines; Moti carries a wordmark.

This matters because it was got wrong once already. An earlier pass in this same
session replaced the cover with a transparent PNG of the product group floating
on the page background. It had no ground and no frame, so it was the only card
on the page without a card, and it read as a broken asset beside the other two.
Reverted.

## Problem with the original

Aura's cover was already a title card with a ground. It simply carried more than
the pattern allows: the wordmark **and** a blue rule **and** a two-line headline
("Motion-sickness relief for travelers.") **and** a two-line subhead ("Clinically
inspired. Scientifically tuned. / Travel with confidence.").

Four lines of copy, when the card prints the signal and the description in the
column right beside the image. The pitch was set twice, in two typefaces.

## Decision

Keep the composition, the ground, the product, and the wearer. Keep the wordmark
and the blue rule, which is exactly the pairing NeuraLyfe's cover uses. Remove
the headline and the subhead.

Nothing is moved, rescaled, or recomposed. The only edit is erasing four lines of
type off a flat wall.

## How the type was removed

The wall behind the copy is nearly flat (luminance 185-192), so it can be
reconstructed rather than cloned. Within two measured regions:

1. Mask everything below luminance 178, then dilate by 9px to catch antialiasing.
2. Least-squares fit a quadratic surface per channel to the **unmasked** pixels only.
3. Write the fitted surface into the masked pixels, plus Gaussian grain at the
   wall's own sigma (2.57) so the patch is not suspiciously smooth.

Fitting only clean pixels is the point. A first attempt interpolated from each
rectangle's boundary ring instead, and because the boundary clipped the subhead's
descenders it dragged ink vertically through the patch as visible streaks.

The region bounds are measured, not estimated, and stop short of the mockups:

| Region | Bounds | Why it stops there |
| --- | --- | --- |
| Headline + subhead line 1 | x 55-720, y 358-604 | The right phone's corner enters at y 604. |
| Subhead line 2 | x 55-640, y 604-650 | The right phone occupies x >= 650; the left phone's corner enters at y 668. |

Residual after the fill is 45 pixels deviating more than 14 from the wall tone,
against a wall that natively varies by 7 and carries grain of sigma 2.57. That is
noise, not ink.

`coverAspect` stays `"2400/1350"`: same pixels, same frame, only quieter.

## Changes

| File | Change |
| --- | --- |
| `src/assets/aura-cover.webp` | Headline and subhead removed. Same dimensions, same composition. |
| `src/data/projects.ts` | Comment recording why the cover is a title card and what came off it. |

## Non-goals

- The upper-left is airier than it was, since four lines came off it. The
  wordmark and rule still anchor that corner, so it reads as space rather than
  as a hole. Rebalancing would mean moving the product group, which the flat
  export cannot support: there is no clean plate behind it, and an attempt to
  reconstruct the seat edge came out visibly stepped. That needs the layered
  source.
- `aura-detail-1.webp`, the dark twin of this key visual, still carries the same
  wordmark and subhead further down the case study.
- No copy changes, and no change to any other project's cover.

## Verification

- `coverAspect.test.ts` reads the real WebP header; `"2400/1350"` still matches.
- Typecheck clean, full suite green apart from a failure that predates this work
  (`homepageSections` — Spatial Editor is a placeholder card with no click
  target; confirmed failing at HEAD).
- Console and network clean on the homepage, the case study, and the
  design-system page.
- Visual check of all three Selected Work rows together, which is the comparison
  that should have been made first.
