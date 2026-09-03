# FlowPrint HMI on the case study

Approved in chat on 2026-09-03.

**Goal:** On `/project/flowprint`, a recruiter uses FlowPrint like a product — the printer’s own 16:9 touchscreen — not a click-through of Figma frames. The HMI is rebuilt in React. Figma is the visual source. Photos are scenery.

**Figma:** [Interfaces Lab](https://www.figma.com/design/PWAe0rAEOFxwmCkc3Tyz72/Interfaces-Lab?node-id=7-6) (`PWAe0rAEOFxwmCkc3Tyz72`). Source of truth is the **1600×900 machine cluster** (liquid glass on dark printer photos). Ignore Bambu phone competitive frames, Crew Dragon, posters, and other lab work on the same page.

## Principles

1. **Operate it, don’t advance it.** Lists, buttons, keyboard, nav, and print state are real DOM. No case-study chrome that says “Try the first-print path,” First time / Pro, or Next around the screen. Those choices live inside the glass.
2. **Figma is the picture; React is the UI.** Export photographic assets. Rebuild every control. If a control can’t be cloned in CSS, rebuild the control — do not drop a PNG of the button.
3. **One machine, two lanes.** First-time and Pro meet at home, then share the print path.
4. **Simulated hardware.** No network, no printer, no persistence. Reload resets to welcome. Print time is a few seconds; the Figma duration (9h 45min) is a label.
5. **Stay on the case study.** No `/flowprint` product route. The HMI is a module on `/project/flowprint` only.

## Placement

The live machine is `[[module:flowprint-hmi]]` in the **Final Design** section, after the opening paragraph.

Hero, Context, Research, Problem, Process, Impact, and Reflection stay as they are. The Final Design writeup stays.

The panel is **16:9** at the case study’s content width (same column as other figures), rounded like the Figma screen. Not a phone bezel. Not full-bleed viewport. Not a captioned `<figure>` with “screenshot of…”.

On a phone the panel stays 16:9 landscape, full content width. Do not reflow it into a portrait app. Taps must work at that size.

## Journey

State: `welcome` → (`network` → `password` → `connected` → `filament`) → `home` → `models` → `prepare` → `printing` → `finished`.

Lane is `first` | `pro`, set on welcome. It only changes via the in-screen restart (back to welcome).

**First time**

1. Welcome — “How experienced are you with 3D printing?” **First time user** / **Pro user**.
2. Network — list matching Figma (Malik Design, University of Washington, and the other SSIDs). Pick **Malik Design** (any listed locked network may continue; the designed path is Malik Design).
3. Password — on-screen keyboard. Any **non-empty** string continues. Empty does not.
4. Connected Successfully — in-screen next.
5. Filament — the five Figma Filament Instruction variants, advanced inside the glass, then confirm the slot.
6. Home.

**Pro:** Welcome → Home. No network, no filament.

**Shared print path** (both lanes)

1. Home — printer photo, AMS, head temp/fan, **Tap to Start Printing**.
2. Models — grid. The designed bust is the model you pick; extra tiles exist so the grid looks stocked. One pick continues.
3. Auto-setting / plate view (Extra Fine, filament, settings, Auto Setting).
4. Prepare — time, PLA, bed, **Start Print**.
5. Printing — time-lapse ~4–6 seconds. Title “Printing”. Vertical progress as in Figma.
6. Finished Printing — green part, then the 2×2 summary (Duration, Filament, Print Errors, Layer). The in-screen chevron returns to **home**.

To run the other lane, an in-screen restart on home returns to **welcome**. Reload also resets to welcome.

`prefers-reduced-motion`: skip the time-lapse; jump to finished.

## Look

**Export from Figma (scenery):** printer body (home), AMS + head, welcome blur, green part printing / finished, model busts, build plate.

**Rebuild (chrome):** glass panels (`backdrop-filter` + translucent fill + hairline), pill buttons, circular next/back, sidebar icons, Wi-Fi list, keyboard, Prepare grid, summary cards.

Type: light italic titles (“Printing”, “Finished Printing”); regular white for lists. Green only where Figma uses it (filament, the printed part).

The machine photo still says **Bambu Lab X1-Carbon**. FlowPrint is the HMI on a consumer printer, not a rebranded chassis. Do not paste a FlowPrint wordmark on the metal.

Glass is close, not a pixel clone.

## Out of scope

- Separate product URL
- Hotspot / screenshot click-through
- Other… networks, wifi info sheets
- AMS as a product, firmware, settings, troubleshooting, color picker
- Real printer duration, failure recovery, first-time vs experienced fork beyond the two lanes above
- Case-study rewrite (copy stays; HMI is the new artifact)

## Architecture

One component: `src/components/project-detail/FlowPrintHmi.tsx`, registered in `ProjectDetailTemplate` as `flowprint-hmi`. Assets under `src/assets/flowprint-*`.

State is local React state. No URL params, no localStorage. Reload = welcome.

Password gate: non-empty string. Print timer: local `setTimeout` / rAF, cleared on unmount and on restart.

## Tests

`FlowPrintHmi.test.tsx`, Vitest, same style as other case-study modules. Do not screenshot-test glass.

Lock:

1. First-time can complete welcome → network → password → connected → filament → home → models → prepare → printing → finished.
2. Pro skips from welcome to home.
3. Start Print reaches finished (fake timers).
4. Finished chevron returns to home.
5. Restart on home returns to welcome.
6. Empty password does not continue.

## Honesty

This is a simulated first print. The case study already says target journey, not shipped hardware. The HMI does not claim a live printer.
