# NeuraLyfe card reel — film script

**Date:** 2026-09-04
**Status:** awaiting approval — no renders yet

## What this is

A silent looping-length reel for the NeuraLyfe card in Selected Work, matching
the grammar Moti and Oryne already established.

## The grammar it has to match (measured, not assumed)

The card `<video>` in `ProjectList.tsx` is `muted playsInline` with **no `loop`
attribute**. It plays once and then holds on its **last frame** forever. So:

- **First frame must equal `coverImage`.** It is the poster, so any difference
  flashes at playback start.
- **Last frame should also equal `coverImage`.** It is what the card shows for
  the rest of the session.

Moti's reel obeys both: first frame and last frame are the same "Moti: Plan"
title card, with a zoom into the phone in between. Oryne's obeys only the first;
it ends on the product, so an Oryne card that has played no longer matches its
own poster. **Follow Moti.** It matters more here than it did for Oryne, because
NeuraLyfe's poster is a bright green field while both source clips are on black.
Ending on the brain would leave a black card sitting between Moti's grey one and
Aura's bright cabin one.

Other house rules taken from the two existing reels: no audio track, no titles
beyond the cover's own, and no cross-dissolves.

## Vibe

Set by the siblings, not invented: restrained, unhurried, product-forward. One
idea per beat, long enough to read. NeuraLyfe's own material is darker and more
clinical than Moti's, and that is allowed to show — but the cutting rhythm stays
calm.

## Beats

Physical, then digital: the helmet you can see, the device inside it, the brain
it is protecting. That ordering is why the halo comes before the brain.

| # | In / out | Length | Content |
| --- | --- | --- | --- |
| 1 | 0.00 – 1.60 | 1.60s | Title card, held. `neuralyfe-cover.webp`, unmodified. |
| 2 | 1.60 – 2.00 | 0.40s | Fade to black. |
| 3 | 2.00 – 5.00 | 3.00s | **Halo.** Source `neuralyfe-halo.mp4` 1.00–4.00s. The device turning. |
| 4 | 5.00 – 5.30 | 0.30s | Black breath. Invisible: both neighbours are already black. |
| 5 | 5.30 – 9.80 | 4.50s | **Brain.** Source `neuralyfe-brain.mp4` 18.30–22.80s. |
| 6 | 9.80 – 10.20 | 0.40s | Fade up from black. |
| 7 | 10.20 – 11.40 | 1.20s | Title card, held. Identical to beat 1. |

Total **11.4s**, between Moti's 9.8s and Oryne's 11.1s.

### Why those source windows

**Halo, 1.00–4.00s.** The clip is one seamless 360° turn over 5.03s, front-on at
both ends. Any window is a clean cut; this one runs profile through to
three-quarter, where the fins read most clearly.

**Brain, 18.30–22.80s.** This is the only **forward** scrub in the take. The
season timeline drags left to right, Week 8 to Week 17, and the brain reddens as
it goes — damage accumulating, which is the case study's actual claim. It then
pushes into the frontal lobe with the p-Tau and NfL readouts on screen.

The obvious-looking window at 11–18s is the same interaction scrubbed
**backward**, Week 17 down to Week 8, so the red drains away and it reads as
damage healing. Rejected for that reason.

Both are single unbroken segments. Nothing is cut mid-animation.

## Framing

Canvas **1920×1080 @ 60fps**, 16:9 — the poster's ratio. Deliberately not the
playbook's 2560×1440 default: this is a homepage card that renders under 900 CSS
px, and it loads alongside three other reels.

| Source | Native | Treatment |
| --- | --- | --- |
| Halo | 1920×1200, subject spans x 307–1685, y 265–1015 | Crop 1536×864 centred on the subject, scale to canvas. A 1.25× punch, so the device fills ~90% of frame width instead of ~70%. |
| Brain | 1472×1080, content x 109–1361, y 128–947 | Pillarbox at native scale. No crop, no upscale. The bars are invisible against its black ground, and a 16:9 crop would clip the season timeline, which is the whole point of the beat. |

## Data changes

| File | Change |
| --- | --- |
| `src/assets/neuralyfe-card.mp4` | New. |
| `src/data/projects.ts` | Add `coverVideo: neuralyfeCardVideo` to the NeuraLyfe entry, plus the import and a comment. |

`coverImage` and `coverAspect` are **unchanged**. `neuralyfe-cover.webp` is
2400×1350 and the reel is 1920×1080; both are 16:9, and `coverAspect.test.ts`
compares ratios, so `"2400/1350"` still passes with the video governing.

`neuralyfe-cover.webp` is also the case-study `heroImage`, so it is not touched.

## Open question for approval

Beat 5 ends on the biomarker close-up (p-Tau 217, NfL Level) rather than on the
whole brain. It is the stronger image and it is where the source push lands, but
it is a UI close-up rather than the signature wireframe. Say if the beat should
instead hold on the full brain at Week 17 and skip the push.

## Verification planned

- Frame-extract beats 1 and 7 and pixel-compare both against `neuralyfe-cover.webp`.
- Contact sheet across all seven beats.
- Confirm no audio track.
- `coverAspect.test.ts`, typecheck, full suite.
- Play it in the real card and screenshot the row beside Moti and Aura.
