# About Connect Bouldering Film Design

Approved on 2026-08-31.

## Goal

Create two short social videos from the interactive bouldering game at
`https://www.malikzhang.com/about/connect`. Both films should make the game
feel immediately playable, show Malik clearing the first two routes, turn the
hard-route failure into a friendly joke, and invite viewers on X and LinkedIn
to try the wall and connect with Malik.

The live product is the source of truth. Its routes are V0, V2, and V4. The
film must call the third route V4 rather than V5.

## Shared Production Contract

- Placement: X and LinkedIn feed posts.
- Master: 2560 x 1440, 16:9 landscape, 60 fps.
- Duration: 15 to 25 seconds.
- Surface: live desktop website, full bleed, with the wall and Connect copy
  visible when the story needs context.
- First three seconds: gameplay is already moving. Do not spend the hook on a
  logo or explanatory card.
- Pointer: use one pointer contract for the entire film. Prefer a hidden OS
  cursor during capture plus the product-film synthetic arrow and click rings.
  If the capture contains a real cursor, use it throughout and do not add a
  second arrow.
- Product truth: preserve the live route geometry, chalk counter, status copy,
  completed route lines, V4 fall, and brush animation.
- Native sound: preserve the game's rising pentatonic step tones, send
  arpeggios, V4 falling pitch, and chalk-brush noise.
- Brand: General Sans, near-black `rgb(10, 10, 10)` background, warm off-white
  `rgb(231, 230, 228)` text, and the live route accents: emerald, violet, and
  warm gold.
- Avoid: corporate explainer language, fake climbing animation, a floating
  browser card, cross-dissolves, side pushes, duplicate pointers, and calling
  the hard route V5.

## Verified Gameplay Lines

- V0 send: `a1 -> a3 -> a4 -> top`, four moves.
- V2 send: `p1 -> p3 -> p4 -> p6 -> top`, five moves.
- V4 pump-out: `q2 -> q5 -> q3 -> q4 -> q6 -> q7`, six moves without the top.
  This spends all chalk and triggers the native fall and brush sequence.

## Version 1: Pure Screen Recording

### Vibe

Playful, direct, and human, like a quick challenge clip recorded in one clean
session. The V4 fall is the biggest beat. Avoid ad-like polish and added music.

### Frame

Use the live desktop game full screen. Keep the website UI, route labels,
cursor, chalk, animations, status message, and game audio. Edits are limited to
clean timing cuts and a restrained final CTA overlay.

### Timeline

1. **0.00 to 0.50, hook:** Open on the wall with the first V0 move already
   beginning.
2. **0.50 to 4.20, V0 send:** Climb `a1 -> a3 -> a4 -> top`. Hold the completed
   line and native send response briefly.
3. **4.20 to 4.50, reset cut:** Cut directly to a clean V2 start state.
4. **4.50 to 9.00, V2 send:** Climb `p1 -> p3 -> p4 -> p6 -> top`. Hold the
   completed line and send response briefly.
5. **9.00 to 9.30, reset cut:** Cut directly to a clean V4 start state.
6. **9.30 to 15.80, V4 attempt:** Climb
   `q2 -> q5 -> q3 -> q4 -> q6 -> q7`. Let the chalk run out, then show the
   full fall and brush animation without interrupting it.
7. **15.80 to 20.00, invitation:** Hold on the live Connect section and add the
   CTA: `Your move. Try it + connect -> malikzhang.com/about/connect`.

### Sound

Use native game sound only. Do not add a score. The climbing tones establish
the rhythm, the send arpeggios punctuate the two wins, and the V4 fall plus
brush provide the comic payoff.

### Tradeoff

This version is the most credible demonstration and the fastest to understand.
It will feel quieter and less authored than Version 2, which is intentional.

## Version 2: Product-Film Cut

### Vibe

Playful, social, and slightly competitive. The camera is energetic but
controlled, with the V4 pump-out as the biggest visual and sonic beat. Avoid
corporate explainer energy, childish game-show styling, and cymbal-heavy music.

### Frame and Camera

Use the product-film desktop path with full-bleed `FILL=1`. The page fills the
canvas at every zoom level. Each camera punch arrives before its click. Nearby
holds use constant-scale follow-pans with a separate camera keyframe at every
hold arrival. The camera remains still through the fall animation.

### Timeline

1. **0.00 to 2.75, V0 hook:** Start in motion on V0. A 1.55x punch arrives on
   `a1`, then follows `a1 -> a3 -> a4 -> top`. Hold the completed route for
   about 0.55 seconds. Show `SEND IT.` only during the first 0.7 seconds.
2. **2.75 to 3.15, transition:** Use one zoom-through into V2.
3. **3.15 to 6.30, V2 send:** Follow
   `p1 -> p3 -> p4 -> p6 -> top` with a precise constant-scale pan. Hold the
   successful top for about 0.6 seconds.
4. **6.30 to 6.85, challenge card:** Brief black breath with `TRY V4.`. Duck the
   score almost to silence.
5. **6.85 to 14.45, V4 attempt:** Begin around 1.45x so the route label, active
   hold, and chalk remain readable. Follow
   `q2 -> q5 -> q3 -> q4 -> q6 -> q7`. At q7, stop moving the camera and let
   the native pitch drop, fall, brush animation, and aftermath play in full.
6. **14.45 to 15.00, breath:** Short black breath that lets the fall tail clear.
7. **15.00 to 20.50, invitation:** Return to a wide live game view, then finish
   on a 2.4-second black end card with `CLIMB. CONNECT.` and
   `malikzhang.com/about/connect`. Hold the final frame without fading out.

### Words

- Hook: `SEND IT.`
- Challenge card: `TRY V4.`
- End card: `CLIMB. CONNECT.`
- URL: `malikzhang.com/about/connect`

### Sound

Use a frame-locked Tier A score based on the `apple-pulse` preset at roughly
112 to 118 BPM. Keep it light: restrained plucks, a soft kick, and a warm
detuned bed without cymbal wash. The native game audio remains the lead.

- Duck the score 6 to 8 dB around each step tone.
- Duck it 8 to 10 dB under each send arpeggio.
- Remove the kick and duck 10 to 12 dB for about 0.8 seconds around the V4
  fall and chalk brush.
- Duck almost to silence under the challenge card and the end-card entrance.
- Measure the actual interaction and animation frames before writing the score
  timeline.

### Tradeoff

This version should attract more attention and create a clearer social hook,
but it requires measured capture, camera planning, card generation, scoring,
frame verification, and a script gap audit.

## Verification and Delivery

Both versions must use fresh live captures. For each version:

1. Conform any variable-frame-rate capture to 60 fps before measuring.
2. Frame-scan the complete take and measure every transition.
3. Preserve every interaction animation as one unbroken segment.
4. Verify one click frame from each route for a consistent pointer contract.
5. Verify the V0 and V2 completion messages and the V4 fall from extracted
   frames, not from intended click timing.
6. Read all added words at full resolution against this document.
7. Preserve the game's native sound effects in the final mux.
8. Deliver each MP4 with its own gap audit graded against this script.

## Acceptance Criteria

- Two distinct MP4s are delivered, one pure screen recording and one authored
  product-film cut.
- Each is between 15 and 25 seconds, 16:9, and suitable for X and LinkedIn.
- Gameplay begins inside the first three seconds.
- V0 and V2 visibly top out.
- V4 visibly pumps out and falls without reaching the top.
- The native sends, fall, and brush are audible.
- The CTA and URL are readable.
- The website is represented accurately as V0, V2, and V4.
