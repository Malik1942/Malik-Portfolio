# Locant Case Study Draft Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Draft the Locant case study at `/project/locant` on this branch, built from Malik's own sources, without connecting it to the homepage card.

**Architecture:** A new `locant` document in `src/data/projectDetails.ts` renders through the existing `ProjectDetailTemplate`. Its rich blocks live in a new `LocantModules.tsx`, registered in the template's `INLINE_MODULES`. Stills and clips are derived from files Malik already has and committed under `src/assets/locant-*`. The card in `src/data/projects.ts` keeps `destination: { kind: "external" }`, and a test holds that line.

**Tech Stack:** React 18 + TypeScript, Tailwind 3.4 on the portfolio's token system, Vitest + Testing Library, ffmpeg (libx264) and cwebp for media, Playwright for the browser check.

**Spec:** `docs/superpowers/specs/2026-09-17-locant-case-study-design.md`

## Global Constraints

- Branch only. Do not edit `src/data/projects.ts`, `src/components/project-detail/NextUp.tsx`, or `public/og/`. Do not push, open a PR, or merge.
- Never `git add -A`. Stage explicit paths. `default.profraw` stays untracked.
- Copy: no em dash or en dash as punctuation in document copy; never "solo", "alone", "by myself"; no line ending on a single word at 1440 px or 375 px; headlines are sentence-case claims; no header that describes a format instead of content.
- Facts: only what the spec's evidence base supports. "Palantir" appears only as "Palantir's Product Design Show & Tell"; nothing about its outcome.
- Design system: token classes only. Font sizes `text-caption|label|sm|base|xl|title|heading|display|hero`; radius `rounded-sm|lg|2xl|full`; no color literals; opacity modifiers in multiples of 5. `src/design-system/boundary.test.ts` enforces this.
- Clips: 1920×1080, H.264 High, yuv420p, `tv` range, bt709 primaries, transfer and matrix, 60 fps, `+faststart`, no audio. Each clip ≤ 4 MB; all clips together ≤ 15 MB.
- Stills: WebP. Figures render in a column at most 900 CSS px wide, so 1800 px is the ceiling that matters.
- Tests: `npm test` runs `tokens:build` and `typecheck` first. `npm run build` prerenders every route.

## File map

| File | Responsibility |
| --- | --- |
| `src/assets/locant-*.webp`, `locant-*.mp4` (create, 30 files) | Stills, clips, and posters, all derived from Malik's files |
| `src/components/project-detail/LocantModules.tsx` (create) | The ten inline modules and their data |
| `src/components/project-detail/LocantModules.test.tsx` (create) | Behavior of those modules |
| `src/components/project-detail/ProjectDetailTemplate.tsx` (modify) | Import and register the ten module keys |
| `src/data/projectDetails.ts` (modify) | Asset imports, the `locant` document, its place in `SOURCES` |
| `src/data/locantDraft.test.ts` (create) | The draft's shape, its copy rules, and that the card is not connected |
| `docs/superpowers/specs/2026-09-17-locant-case-study-design.md` (modify) | Record the copy and figure changes made while planning |

Shell variables used throughout (zsh):

```bash
WT=/Users/malik/Documents/malik-portfolio/.claude/worktrees/locant-case-study-draft-06cca2
SCR=/private/tmp/claude-501/-Users-malik-Documents-malik-portfolio--claude-worktrees-locant-case-study-draft-06cca2/ace9ef7d-b1ed-46a4-8f41-ab425142a160/scratchpad
SITE=~/Documents/Deixis/site/assets
V4=~/Desktop/locant-film/v4
A=$WT/src/assets
mkdir -p $SCR/assets
```

---

### Task 1: Stills

**Files:**
- Create: `src/assets/locant-hero.webp`, `locant-sketch.webp`, `locant-canvas.webp`, `locant-null-element.webp`, `locant-decision.webp`, `locant-overlay-{hover,option,drag,note}.webp`, `locant-ball-{docked,awake,ready,ring}.webp`, `locant-settings.webp`, `locant-measured.webp`, `locant-icon.webp`

**Interfaces:**
- Produces: the 16 files above at the sizes in Step 5. Task 3 imports the overlay, ball, and icon files with these intrinsic sizes: overlay 1260×840, ball 220×220 (ring 520×520), icon 64×64. Task 4 imports the rest.

- [ ] **Step 1: Hero and build-recording frames**

The hero is scene A at 21.0 s: the orb highlighted and the note typed under it, both halves of the product in one frame. The three build frames come from the cuts of the three-hour recording.

```bash
cd $WT
ffmpeg -v error -y -i $V4/sceneA-comp.mp4 -ss 21.0 -frames:v 1 $SCR/assets/hero.png
cwebp -quiet -q 88 $SCR/assets/hero.png -o $A/locant-hero.webp
ffmpeg -v error -y -i $V4/build/build-canvas.mp4 -ss 2.0 -frames:v 1 $SCR/assets/canvas.png
cwebp -quiet -q 88 $SCR/assets/canvas.png -o $A/locant-canvas.webp
ffmpeg -v error -y -i $V4/build/build-null-element.mp4 -ss 3.0 -frames:v 1 $SCR/assets/null.png
cwebp -quiet -q 88 $SCR/assets/null.png -o $A/locant-null-element.webp
ffmpeg -v error -y -i $V4/build/build-decision.mp4 -ss 3.0 -frames:v 1 $SCR/assets/decision.png
cwebp -quiet -q 88 $SCR/assets/decision.png -o $A/locant-decision.webp
```

- [ ] **Step 2: Whiteboard sketch**

`sketch-03` is the close-up of the two rings. The crop keeps "Not activated", "Deixis (Rest)", both rings and both labels, down to the bottom of "Release to pick/confirm".

```bash
sips -s format png ~/Documents/Deixis/docs/sketch-03.HEIC --out $SCR/assets/sketch-03.png >/dev/null
python3 -c "
from PIL import Image
im = Image.open('$SCR/assets/sketch-03.png').crop((0, 122, 5141, 3720))
im.resize((1800, round(im.size[1] * 1800 / im.size[0])), Image.LANCZOS).convert('RGB').save('$SCR/assets/sketch.png')
"
cwebp -quiet -q 85 $SCR/assets/sketch.png -o $A/locant-sketch.webp
```

- [ ] **Step 3: The product site's own captures**

```bash
for n in hover option drag note; do cwebp -quiet -q 88 $SITE/overlay-$n.jpg -o $A/locant-overlay-$n.webp; done
for n in docked awake ready ring; do cwebp -quiet -q 90 $SITE/ball-$n.png -o $A/locant-ball-$n.webp; done
cwebp -quiet -q 88 -resize 1800 0 $SITE/settings-dark.png -o $A/locant-settings.webp
cwebp -quiet -q 88 -resize 1800 0 $SITE/measured-comparison.png -o $A/locant-measured.webp
cwebp -quiet -q 90 -resize 64 64 $SITE/icon-dark.png -o $A/locant-icon.webp
```

- [ ] **Step 4: Look at the sketch crop and the hero**

Open `$A/locant-sketch.webp` and `$A/locant-hero.webp`. Expected: the sketch shows both rings with "Hover" and "Press & hold / Release to pick/confirm" fully legible, nothing cut at the bottom; the hero shows the blue outline on the Product Ideas orb with the note field under it ending "…nodes like Light And Color" and "↩ copy · esc cancel". If the sketch's last line is clipped, raise 3720 in Step 2 by 100 and rerun.

- [ ] **Step 5: Verify sizes**

```bash
for f in $A/locant-*.webp; do printf "%-32s %s %s\n" ${f:t} $(sips -g pixelWidth -g pixelHeight $f | awk '/pixel/ {print $2}' | paste -sd x -) $(du -k $f | cut -f1)K; done
```

Expected (width×height): hero 2560×1440, sketch 1800×1260, canvas 1824×1180, null-element 1824×1180, decision 1824×1180, overlay-* 1260×840, ball-docked/awake/ready 220×220, ball-ring 520×520, settings 1800×1181, measured 1800×1012 or 1800×1013 (cwebp's rounding), icon 64×64. No file above 600 K.

- [ ] **Step 6: Commit**

```bash
git add src/assets/locant-hero.webp src/assets/locant-sketch.webp src/assets/locant-canvas.webp src/assets/locant-null-element.webp src/assets/locant-decision.webp src/assets/locant-overlay-hover.webp src/assets/locant-overlay-option.webp src/assets/locant-overlay-drag.webp src/assets/locant-overlay-note.webp src/assets/locant-ball-docked.webp src/assets/locant-ball-awake.webp src/assets/locant-ball-ready.webp src/assets/locant-ball-ring.webp src/assets/locant-settings.webp src/assets/locant-measured.webp src/assets/locant-icon.webp
git commit -m "Add the Locant case study stills"
```

---

### Task 2: Clips and posters

**Files:**
- Create: `src/assets/locant-{loop,before,hover,agents,verify,ring,self}.mp4` and `src/assets/locant-{loop,before,hover,agents,verify,ring,self}-poster.webp`

**Interfaces:**
- Produces: seven 1920×1080 clips and their first-frame posters, imported by Task 4.

Cut points were read off contact sheets of each scene:
- `loop`: scene A 3.0 s → 39.0 s. Wide shot, the ball clicked (~6 s), hovers on Ocean, Resurfacing and the orb, the note, the toast, the payload pasted into Cursor (~27 s), the agent's diff (~35.5 s), held to 39.0.
- `before`: scene G 0 → 9.95 s. The orb described by hand in Cursor's chat. At 9.9 s the box reads "…the cluster one not the small motes," and the change itself has not started. The take goes on to delete it and retype with a visible slip ("mamake"), so it ends here.
- `hover`: scene D (4.2 s: Calculator, a CalmMouse slider, the orb) then scene D2 (3.0 s: the Locant site in a browser), 0.3 s dissolve.
- `agents`: scene E1 (Codex CLI) then E2 (Claude Code), 10 s each, 0.3 s dissolve.
- `verify`: scene B whole (21.3 s): menu, Show before & after, slide, flip, "1 file changed, 28 insertions(+), 1 deletion(-)".
- `ring`: scene C whole (14.4 s): the ball, the ring, Color, the magnifier, the copied value.
- `self`: scene F whole (3.4 s): the overlay over Locant's own Settings reads "no element info · image only", then names the Cursor button behind it.

- [ ] **Step 1: Define the encoders**

```bash
X264=(-c:v libx264 -preset slow -crf 24 -profile:v high -pix_fmt yuv420p -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 -movflags +faststart -an)
SCALE="scale=1920:1080:flags=lanczos:in_range=tv:out_range=tv,fps=60,format=yuv420p,setsar=1"
cut() { ffmpeg -v error -y -i "$1" -ss "$3" -t "$4" -vf "$SCALE" $X264 "$2"; }
join2() { ffmpeg -v error -y -i "$1" -i "$2" -filter_complex "[0:v]${SCALE}[a];[1:v]${SCALE}[b];[a][b]xfade=transition=fade:duration=0.3:offset=$4[v]" -map "[v]" $X264 "$3"; }
poster() { ffmpeg -v error -y -i "$1" -frames:v 1 "$SCR/assets/poster.png" && cwebp -quiet -q 82 "$SCR/assets/poster.png" -o "$2"; }
```

Seeking is output-side (`-i` before `-ss`) on purpose: input-side seeking on these recordings lands on the wrong frame.

- [ ] **Step 2: Encode**

```bash
cut $V4/sceneA-comp.mp4 $A/locant-loop.mp4 3.0 36.0
cut $V4/sceneG-comp.mp4 $A/locant-before.mp4 0 9.95
join2 $V4/sceneD-comp.mp4 $V4/sceneD2-comp.mp4 $A/locant-hover.mp4 3.9
join2 $V4/sceneE1-comp.mp4 $V4/sceneE2-comp.mp4 $A/locant-agents.mp4 9.7
cut $V4/sceneB-comp.mp4 $A/locant-verify.mp4 0 21.3
cut $V4/sceneC-comp.mp4 $A/locant-ring.mp4 0 14.4
cut $V4/sceneF-comp.mp4 $A/locant-self.mp4 0 3.4
for n in loop before hover agents verify ring self; do poster $A/locant-$n.mp4 $A/locant-$n-poster.webp; done
```

- [ ] **Step 3: Verify format, length, and weight**

```bash
for n in loop before hover agents verify ring self; do f=$A/locant-$n.mp4; printf "%-8s " $n; ffprobe -v error -show_entries stream=width,height,pix_fmt,color_range,color_primaries,color_transfer,color_space,r_frame_rate:format=duration -of csv=p=0 $f | paste -sd' ' -; du -k $f | cut -f1; done
du -ck $A/locant-*.mp4 | tail -1
```

Expected per clip: `1920,1080,yuv420p,tv,bt709,bt709,bt709,60/1` and durations loop 36.0, before ~9.95, hover ~6.9, agents ~19.7, verify ~21.3, ring ~14.4, self ~3.4. Each ≤ 4096 K, total ≤ 15360 K. If a clip is over budget, re-encode only that clip with `-crf 26`; if still over, add `fps=30` in its SCALE. Record any change in the commit message.

- [ ] **Step 4: Check the before clip's last frame**

```bash
ffmpeg -v error -y -sseof -0.05 -i $A/locant-before.mp4 -frames:v 1 $SCR/assets/before-last.png
```

Open it. Expected: the chat box ends "…the cluster one not the small motes," with no "make" after it.

- [ ] **Step 5: Commit**

```bash
git add src/assets/locant-loop.mp4 src/assets/locant-before.mp4 src/assets/locant-hover.mp4 src/assets/locant-agents.mp4 src/assets/locant-verify.mp4 src/assets/locant-ring.mp4 src/assets/locant-self.mp4 src/assets/locant-loop-poster.webp src/assets/locant-before-poster.webp src/assets/locant-hover-poster.webp src/assets/locant-agents-poster.webp src/assets/locant-verify-poster.webp src/assets/locant-ring-poster.webp src/assets/locant-self-poster.webp
git commit -m "Add the Locant case study clips"
```

---

### Task 3: The Locant modules

**Files:**
- Create: `src/components/project-detail/LocantModules.tsx`
- Test: `src/components/project-detail/LocantModules.test.tsx`

**Interfaces:**
- Consumes: `ModuleCard({ children, header? })` and `Chips({ items: string[] })` from `./MotiModules`; `FigureCaption({ label?, children: string })` from `./FigureCaption`; `Button` (`tone`, `href`, `external`, `icon`) from `@/components/ui/Button`; `noOrphan(text: string): string` from `@/lib/noOrphan`; the Task 1 stills.
- Produces (named exports): `LocantHighlights`, `LocantQuestion`, `LocantLandscape`, `LocantOverlay`, `LocantPayload`, `LocantLadder`, `LocantBall`, `LocantReleases`, `LocantMeasured`, `LocantLinks({ filmUrl?: string | null })`, and the constants `AGENT_REPLY: { opening: string; question: string; source: string }`, `PAYLOAD_TEXT: string`, `LOCANT_FILM_URL: string | null`.

- [ ] **Step 1: Write the failing tests**

Create `src/components/project-detail/LocantModules.test.tsx`:

```tsx
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  AGENT_REPLY,
  LocantBall,
  LocantHighlights,
  LocantLadder,
  LocantLandscape,
  LocantLinks,
  LocantMeasured,
  LocantOverlay,
  LocantPayload,
  LocantQuestion,
  LocantReleases,
  PAYLOAD_TEXT,
} from "./LocantModules";

describe("Locant case-study modules", () => {
  it("shows the four highlight chips", () => {
    render(<LocantHighlights />);
    for (const chip of ["The element, not a screenshot", "Any Mac app, any agent", "Asked which orb: 0 of 12 runs", "v0.1 to v0.4 in three hours"]) {
      expect(screen.getByText(chip)).toBeInTheDocument();
    }
  });

  it("quotes the agent's reply to a screenshot word for word", () => {
    render(<LocantQuestion />);
    expect(AGENT_REPLY.opening).toBe("I haven’t changed anything yet, because the screenshot doesn’t show which orb you mean.");
    expect(AGENT_REPLY.question).toBe("Which orb should get them?");
    expect(screen.getByText(/Which orb should get them\?/)).toBeInTheDocument();
    expect(screen.getByText("Claude Code, given a screenshot")).toBeInTheDocument();
  });

  it("gives Locant the one row that holds all four", () => {
    const { container } = render(<LocantLandscape />);
    const rows = container.querySelectorAll("[data-tool]");
    expect(rows).toHaveLength(5);
    const mine = container.querySelectorAll('[data-mine="true"]');
    expect(mine).toHaveLength(1);
    expect(mine[0]).toHaveAttribute("data-tool", "Locant");
    expect(within(mine[0] as HTMLElement).getAllByText(/: yes\./)).toHaveLength(4);
  });

  it("shows the four real overlay captures at their intrinsic size", () => {
    render(<LocantOverlay />);
    const hover = screen.getByAltText(/the 8 key outlined in blue/);
    expect(hover).toHaveAttribute("width", "1260");
    expect(hover).toHaveAttribute("height", "840");
    expect(screen.getAllByRole("img")).toHaveLength(4);
    expect(screen.getByText("Option: one level up, to the keypad that holds it")).toBeInTheDocument();
  });

  it("prints Locant's payload with the image path first", () => {
    render(<LocantPayload />);
    const lines = PAYLOAD_TEXT.split("\n");
    expect(lines[0]).toBe("## Locant capture (fix)");
    expect(lines[1]).toMatch(/^Image: \/Users\/malik\/Pictures\/Locant\/locant-simulator-20260915-021609-zwec\.png$/);
    expect(screen.getByText('button "Product Ideas" · id=oceanCurrent.product ideas')).toBeInTheDocument();
  });

  it("lists the five rungs of the ladder, best first", () => {
    render(<LocantLadder />);
    const rungs = within(screen.getByRole("list", { name: "The ladder, best rung first" })).getAllByRole("listitem");
    expect(rungs.map((r) => r.getAttribute("data-rung"))).toEqual(["Identifier", "Label only", "Drawn frame", "Text and neighbors", "Image"]);
  });

  it("shows the ball's four states", () => {
    render(<LocantBall />);
    expect(screen.getAllByRole("img")).toHaveLength(4);
    expect(screen.getByAltText(/The ring: Snap, Text, Color and Cut/)).toHaveAttribute("width", "520");
  });

  it("puts v0.1 to v0.4 inside the window and the rest after it", () => {
    render(<LocantReleases />);
    const inside = within(screen.getByRole("list", { name: "Inside the window, Sep 13" })).getAllByRole("listitem");
    expect(inside.map((r) => r.getAttribute("data-tag"))).toEqual(["v0.1", "v0.2-region", "v0.3", "v0.3-actions", "v0.4"]);
    const after = within(screen.getByRole("list", { name: "After it, Sep 14 to 16" })).getAllByRole("listitem");
    expect(after.map((r) => r.getAttribute("data-tag"))).toEqual(["v0.5", "v0.6", "v0.7", "v0.7.1", "v0.8"]);
  });

  it("reports the measurement both ways and links the method", () => {
    render(<LocantMeasured />);
    for (const text of ["0 of 12", "With a screenshot, 17 of 18", "22 s", "253k", "30 of 30"]) {
      expect(screen.getByText(text)).toBeInTheDocument();
    }
    expect(screen.getByRole("link", { name: "Method, transcripts, and statistics" })).toHaveAttribute(
      "href",
      "https://github.com/Malik1942/locant/blob/main/docs/video/10-measurement-v3.md",
    );
  });

  it("links the site and GitHub, and the film only once it has a URL", () => {
    const { rerender } = render(<LocantLinks />);
    expect(screen.getByRole("link", { name: /Visit locant\.malikzhang\.com/ })).toHaveAttribute("href", "https://locant.malikzhang.com");
    expect(screen.getByRole("link", { name: /View on GitHub/ })).toHaveAttribute("href", "https://github.com/Malik1942/locant");
    expect(screen.queryByRole("link", { name: /Watch the film/ })).toBeNull();
    rerender(<LocantLinks filmUrl="https://www.youtube.com/watch?v=abcdefghijk" />);
    expect(screen.getByRole("link", { name: /Watch the film/ })).toHaveAttribute("href", "https://www.youtube.com/watch?v=abcdefghijk");
  });
});
```

- [ ] **Step 2: Run them to see them fail**

Run: `npx vitest run src/components/project-detail/LocantModules.test.tsx`
Expected: FAIL, "Failed to resolve import "./LocantModules"".

- [ ] **Step 3: Write the modules**

Create `src/components/project-detail/LocantModules.tsx`:

```tsx
import { ArrowUpRight, Check, CircleDashed, Minus } from "lucide-react";
import locantIcon from "@/assets/locant-icon.webp";
import locantOverlayHover from "@/assets/locant-overlay-hover.webp";
import locantOverlayOption from "@/assets/locant-overlay-option.webp";
import locantOverlayDrag from "@/assets/locant-overlay-drag.webp";
import locantOverlayNote from "@/assets/locant-overlay-note.webp";
import locantBallDocked from "@/assets/locant-ball-docked.webp";
import locantBallAwake from "@/assets/locant-ball-awake.webp";
import locantBallReady from "@/assets/locant-ball-ready.webp";
import locantBallRing from "@/assets/locant-ball-ring.webp";
import { Button } from "@/components/ui/Button";
import { noOrphan } from "@/lib/noOrphan";
import { FigureCaption } from "./FigureCaption";
import { Chips, ModuleCard } from "./MotiModules";

/* ---------------------------------------------------------------------------
 * Locant case-study inline modules.
 * Every fact here comes from Malik's own sources: the Locant repo
 * (~/Documents/Deixis: README, PRD, the version specs, the measurement
 * report), its product site, git, and Locant's own capture store. Nothing is
 * rounded up or inferred. The shells (ModuleCard, Chips) are MotiModules'.
 * ------------------------------------------------------------------------- */

// ── Highlights ────────────────────────────────────────────────────────────────
const highlights = [
  "The element, not a screenshot",
  "Any Mac app, any agent",
  "Asked which orb: 0 of 12 runs",
  "v0.1 to v0.4 in three hours",
];

export function LocantHighlights() {
  return <Chips items={highlights} />;
}

// ── The agent's question ──────────────────────────────────────────────────────
// Its own words, from the published measurement: run 1 of the screenshot side,
// no-build condition (measure/v3/run-claude-opus-5-nobuild-shot-1.jsonl). The
// note it was given already named the mechanism, so the only unknown left was
// which orb. Two sentences of the reply, an ellipsis where the middle was cut,
// not a word changed.
export const AGENT_REPLY = {
  opening: "I haven’t changed anything yet, because the screenshot doesn’t show which orb you mean.",
  question: "Which orb should get them?",
  source:
    "Opus 5 at medium effort, given a crop of the phone and a note that already said how to make the change. Measurement run, September 15, 2026.",
};

export function LocantQuestion() {
  return (
    <ModuleCard>
      <figure className="flex flex-col gap-5 px-6 py-7 md:px-8 md:py-8">
        <p className="text-label uppercase tracking-eyebrow text-foreground-tertiary font-mono">
          Claude Code, given a screenshot
        </p>
        <blockquote className="flex flex-col gap-3 text-xl md:text-title font-light leading-snug tracking-tight [text-wrap:pretty]">
          <p className="text-foreground-lead">{noOrphan(`“${AGENT_REPLY.opening} …`)}</p>
          <p className="text-foreground">{`${AGENT_REPLY.question}”`}</p>
        </blockquote>
        <figcaption className="text-sm md:text-base font-light leading-relaxed text-foreground-secondary">
          {noOrphan(AGENT_REPLY.source)}
        </figcaption>
      </figure>
    </ModuleCard>
  );
}

// ── Landscape ─────────────────────────────────────────────────────────────────
// PRD Appendix A (competitive context as of September 12, 2026), with tools that
// give the same four answers grouped into one row. The rows say what each tool
// does, not how good it is: Agentation is the same idea done well, for web pages.
// "Any agent" is "part" where it depends on the tool (Agentation copies to the
// clipboard and speaks MCP; Stagewise and Cursor keep it in their own agent) or
// the host (Peekaboo over MCP, Device Hub inside Xcode).
type Held = "yes" | "part" | "no";
type Cell = { held: Held; note: string };
type Tool = { name: string; mine?: boolean; cells: [Cell, Cell, Cell, Cell] };
const COLUMNS = ["You point", "One element", "Any agent", "Native apps"] as const;
const HELD_WORD: Record<Held, string> = { yes: "yes", part: "partly", no: "no" };
const TOOL_COLS = "grid-cols-1 md:grid-cols-[minmax(0,1.15fr)_repeat(4,minmax(0,1fr))]";
const COL_RULE = "md:border-l md:border-case-study-module-divider";

const tools: Tool[] = [
  {
    name: "Codex Appshots, Claude Desktop quick entry",
    cells: [
      { held: "yes", note: "A double-tap" },
      { held: "no", note: "The window or a region" },
      { held: "no", note: "Their own agent" },
      { held: "yes", note: "Any Mac app" },
    ],
  },
  {
    name: "Agentation, Stagewise, Cursor Design Mode",
    cells: [
      { held: "yes", note: "A click" },
      { held: "yes", note: "The DOM node" },
      { held: "part", note: "Depends on the tool" },
      { held: "no", note: "Web pages only" },
    ],
  },
  {
    name: "Peekaboo, Xcode 27 Device Hub",
    cells: [
      { held: "no", note: "The agent looks for itself" },
      { held: "yes", note: "The accessibility tree" },
      { held: "part", note: "Over MCP, or in Xcode" },
      { held: "yes", note: "Mac apps, the Simulator" },
    ],
  },
  {
    name: "CleanShot X, Shottr",
    cells: [
      { held: "yes", note: "A drag" },
      { held: "no", note: "Pixels" },
      { held: "yes", note: "An image, anywhere" },
      { held: "yes", note: "Any Mac app" },
    ],
  },
  {
    name: "Locant",
    mine: true,
    cells: [
      { held: "yes", note: "A click, with your note" },
      { held: "yes", note: "Identifier, frame, and path" },
      { held: "yes", note: "Clipboard and MCP" },
      { held: "yes", note: "Any Mac app, and the Simulator" },
    ],
  },
];

function HeldCell({ cell, column, first }: { cell: Cell; column: string; first?: boolean }) {
  const Icon = cell.held === "yes" ? Check : cell.held === "part" ? CircleDashed : Minus;
  const tone = cell.held === "yes" ? "text-success" : "text-foreground-tertiary";
  return (
    <div className={`mt-3 flex items-start gap-2.5 md:mt-0 md:pl-5 ${first ? "" : COL_RULE}`}>
      <Icon aria-hidden="true" className={`mt-0.5 h-4 w-4 shrink-0 ${tone}`} strokeWidth={1.6} />
      <p className={`text-caption md:text-sm font-normal leading-relaxed ${cell.held === "no" ? "text-foreground-tertiary" : "text-foreground-lead"}`}>
        <span className="sr-only">{`${column}: ${HELD_WORD[cell.held]}. `}</span>
        {/* Below md there is no header row, so each cell names its column. */}
        <span aria-hidden="true" className="md:hidden font-mono uppercase tracking-eyebrow text-foreground-tertiary">
          {column} ·{" "}
        </span>
        {cell.note}
      </p>
    </div>
  );
}

export function LocantLandscape() {
  return (
    <ModuleCard>
      <div className={`hidden md:grid ${TOOL_COLS} px-8 py-4 border-b border-case-study-module-divider`}>
        <p className="text-label uppercase tracking-eyebrow text-foreground-tertiary font-mono">Tool</p>
        {COLUMNS.map((c) => (
          <p key={c} className={`text-label uppercase tracking-eyebrow text-foreground-tertiary font-mono pl-5 ${COL_RULE}`}>
            {c}
          </p>
        ))}
      </div>
      <div className="divide-y divide-case-study-module-divider">
        {tools.map((t) => (
          <div
            key={t.name}
            data-tool={t.name}
            data-mine={t.mine ? "true" : undefined}
            className={`grid ${TOOL_COLS} px-6 py-5 md:px-8 md:py-6 ${t.mine ? "bg-case-study-module-divider" : ""}`}
          >
            <div className={`flex items-center gap-2.5 md:pr-5 ${t.mine ? "text-foreground" : "text-foreground-lead"}`}>
              {t.mine ? (
                <img src={locantIcon} alt="" aria-hidden="true" width={16} height={16} className="h-4 w-4 shrink-0 rounded-sm" />
              ) : null}
              <p className={`text-sm md:text-base ${t.mine ? "font-medium" : "font-normal"}`}>{t.name}</p>
            </div>
            {t.cells.map((cell, i) => (
              <HeldCell key={COLUMNS[i]} cell={cell} column={COLUMNS[i]} first={i === 0} />
            ))}
          </div>
        ))}
      </div>
    </ModuleCard>
  );
}

// ── The overlay ───────────────────────────────────────────────────────────────
// The product site's own captures (site/assets/overlay-*.jpg), over Calculator
// on the Tahoe wallpaper, 1260x840. Alt text is the site's.
type Still = { src: string; label: string; caption: string; alt: string };
const overlayStates: Still[] = [
  {
    src: locantOverlayHover,
    label: "Hover",
    caption: "the element under the cursor, and its identifier",
    alt: "The overlay over Calculator: the 8 key outlined in blue, with the label button · Eight beneath it",
  },
  {
    src: locantOverlayOption,
    label: "Option",
    caption: "one level up, to the keypad that holds it",
    alt: "With Option held, the whole keypad is outlined and the label reads group · CalculatorKeypadView",
  },
  {
    src: locantOverlayDrag,
    label: "Drag",
    caption: "a frame, with every element inside it listed",
    alt: "A dragged frame around the number keys with a 161 by 167 point readout",
  },
  {
    src: locantOverlayNote,
    label: "Note",
    caption: "what should change, then Return",
    alt: "After the click, a note field under the highlighted key reads make this key bigger, with Return to copy and Escape to cancel",
  },
];

export function LocantOverlay() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10">
      {overlayStates.map((s) => (
        <figure key={s.label}>
          <div className="overflow-hidden rounded-2xl bg-secondary/10">
            <img src={s.src} alt={s.alt} width={1260} height={840} loading="lazy" decoding="async" className="block h-auto w-full" />
          </div>
          <FigureCaption label={s.label}>{s.caption}</FigureCaption>
        </figure>
      ))}
    </div>
  );
}

// ── The payload ───────────────────────────────────────────────────────────────
// Verbatim from Locant itself: get_capture over its own MCP server for capture
// 20260915-021609-zwec, the one pasted in the Highlights loop and found again
// in the Before & After clip. The Window value is the Simulator's own window
// title, en dash included; the negative y is real too (the Simulator sat on a
// display above the main one). Full-ink lines are what the agent acts on.
const payloadLines: { text: string; key?: boolean }[] = [
  { text: "## Locant capture (fix)" },
  { text: "Image: /Users/malik/Pictures/Locant/locant-simulator-20260915-021609-zwec.png", key: true },
  { text: "App: Simulator (com.inspireocean.app) · Window: iPhone 17 Pro – iOS 26.5" },
  { text: "Captured: 2026-09-15 02:16 · Image region: 139×183 pt @2x (element + 40 pt)" },
  { text: "Project: /Users/malik/Documents/inspire-ocean" },
  { text: "" },
  { text: "### Target element" },
  { text: 'button "Product Ideas" · id=oceanCurrent.product ideas', key: true },
  { text: "Frame: x=152.7 y=-1335.3 w=58 h=102" },
  { text: "Path: application > window > group > button#oceanCurrent.product ideas" },
  { text: "" },
  { text: "### Note" },
  { text: "make this orb bigger, with satellite nodes like Light And Color", key: true },
];
export const PAYLOAD_TEXT = payloadLines.map((l) => l.text).join("\n");

export function LocantPayload() {
  return (
    <ModuleCard>
      <pre className="px-6 py-6 md:px-8 md:py-7 font-mono text-caption md:text-sm leading-relaxed whitespace-pre-wrap [overflow-wrap:anywhere]">
        {payloadLines.map((l, i) => (
          <span key={i} className={`block ${l.key ? "text-foreground" : "text-foreground-secondary"}`}>
            {l.text || " "}
          </span>
        ))}
      </pre>
    </ModuleCard>
  );
}

// ── The ladder ────────────────────────────────────────────────────────────────
// The five rungs as the site and README name them, best first. Each capture
// says which rung it reached.
const rungs = [
  { name: "Identifier", example: "button · id=captureButton", note: "An element with a declared identifier. The best case." },
  { name: "Label only", example: 'button "Save changes" · no identifier', note: "The nearest labeled neighbors are named too." },
  { name: "Drawn frame", example: "Elements in frame (6)", note: "Drag on the overlay, and everything inside is listed." },
  { name: "Text and neighbors", example: "Text in image · Nearby", note: "Words in the image are recognized." },
  { name: "Image", example: "No element information available", note: "The payload says so, and still carries your note." },
];

export function LocantLadder() {
  return (
    <ModuleCard>
      <ol aria-label="The ladder, best rung first" className="divide-y divide-case-study-module-divider">
        {rungs.map((r, i) => (
          <li
            key={r.name}
            data-rung={r.name}
            className="grid grid-cols-[2.5rem_minmax(0,1fr)] md:grid-cols-[2.5rem_11rem_minmax(0,1fr)] gap-x-4 gap-y-2 px-6 py-5 md:px-8 md:py-6"
          >
            <span className="pt-1 text-caption font-mono tabular-nums text-foreground-tertiary">0{i + 1}</span>
            <p className="text-base md:text-xl font-medium text-foreground leading-snug tracking-tight">{r.name}</p>
            <div className="col-start-2 md:col-start-auto flex flex-col gap-1.5">
              <code className="font-mono text-caption md:text-sm text-foreground-lead [overflow-wrap:anywhere]">{r.example}</code>
              <p className="text-sm md:text-base font-light leading-relaxed text-foreground-secondary">{noOrphan(r.note)}</p>
            </div>
          </li>
        ))}
      </ol>
    </ModuleCard>
  );
}

// ── The ball ──────────────────────────────────────────────────────────────────
// The site's four real captures (site/assets/ball-*.png), square, over the same
// wallpaper. Notes follow the site's own lines; alt text is the site's.
const ballStates = [
  { src: locantBallDocked, size: 220, name: "Docked", note: "After two seconds without use, it tucks into the nearest edge.", alt: "The ball docked: a half disc tucked into the screen edge" },
  { src: locantBallAwake, size: 220, name: "Awake", note: "Move toward it and it comes back out. Drag it anywhere.", alt: "The ball awake: a full glass disc on the desktop" },
  { src: locantBallReady, size: 220, name: "Ready", note: "Under the cursor the hand appears. Click to point.", alt: "The ball ready: the pointing hand appears on the disc" },
  { src: locantBallRing, size: 520, name: "The ring", note: "Press and hold for Snap, Text, Color, and Cut.", alt: "The ring: Snap, Text, Color and Cut around the ball, revealed by pressing and holding" },
];

export function LocantBall() {
  return (
    <ModuleCard>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-case-study-module-divider">
        {ballStates.map((b) => (
          <figure key={b.name} className="flex flex-col gap-4 bg-surface-inset px-5 py-6 md:px-6 md:py-7">
            <img src={b.src} alt={b.alt} width={b.size} height={b.size} loading="lazy" decoding="async" className="mx-auto block h-auto w-full max-w-40 rounded-lg" />
            <figcaption className="flex flex-col gap-1.5">
              <span className="text-base md:text-xl font-medium text-foreground tracking-tight">{b.name}</span>
              <span className="text-sm md:text-base font-light leading-relaxed text-foreground-secondary">{noOrphan(b.note)}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </ModuleCard>
  );
}

// ── Releases ──────────────────────────────────────────────────────────────────
// Git tags, local time (PDT). The timer started at 15:27 on Sep 13 (the menu-bar
// timer in the build recording). Patch releases (0.6.1, 0.7.2, 0.7.3) are left
// out; each line is the version spec's own title for what it added.
type Release = { tag: string; when: string; scope: string };
const insideWindow: Release[] = [
  { tag: "v0.1", when: "17:07", scope: "The pointing flow: a hotkey, a click, a payload" },
  { tag: "v0.2-region", when: "17:17", scope: "The ladder: a drawn frame, text, and neighbors" },
  { tag: "v0.3", when: "17:45", scope: "Usable by someone else: mode inferred, Settings, the ball" },
  { tag: "v0.3-actions", when: "17:58", scope: "Snap, Text, Color, Cut, and the ring" },
  { tag: "v0.4", when: "18:08", scope: "Before and after, found again by identifier" },
];
const afterWindow: Release[] = [
  { tag: "v0.5", when: "Sep 14", scope: "The first minute: hints that appear once and fade" },
  { tag: "v0.6", when: "Sep 14", scope: "A download that works, and a daily update check" },
  { tag: "v0.7", when: "Sep 14", scope: "Deixis renamed Locant" },
  { tag: "v0.7.1", when: "Sep 15", scope: "The agent fetches it: an MCP server inside the app" },
  { tag: "v0.8", when: "Sep 16", scope: "Web pages carry their DOM handles, and Shift picks several elements" },
];

function ReleaseList({ title, releases }: { title: string; releases: Release[] }) {
  return (
    <div className="flex flex-col gap-5 px-6 py-7 md:px-7 md:py-8">
      <p className="text-label uppercase tracking-eyebrow text-foreground-tertiary font-mono">{title}</p>
      <ol aria-label={title} className="flex flex-col gap-4">
        {releases.map((r) => (
          <li key={r.tag} data-tag={r.tag} className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-4">
            <p className="font-mono text-caption md:text-sm leading-relaxed text-foreground">
              {r.tag}
              <span className="block text-foreground-tertiary">{r.when}</span>
            </p>
            <p className="text-sm md:text-base font-light leading-relaxed text-foreground-secondary">{noOrphan(r.scope)}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function LocantReleases() {
  return (
    <ModuleCard>
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-case-study-module-divider">
        <ReleaseList title="Inside the window, Sep 13" releases={insideWindow} />
        <ReleaseList title="After it, Sep 14 to 16" releases={afterWindow} />
      </div>
    </ModuleCard>
  );
}

// ── Measured ──────────────────────────────────────────────────────────────────
// docs/video/10-measurement-v3.md: 30 runs, Claude Code 2.1.272, Opus 5 at
// medium effort. Time and tokens are the no-build medians, the condition where
// every run did the same thing; the question count sums both conditions.
const REPORT_URL = "https://github.com/Malik1942/locant/blob/main/docs/video/10-measurement-v3.md";
const measuredTiles = [
  { label: "Asked which orb", figure: "0 of 12", detail: "With a screenshot, 17 of 18" },
  { label: "Time to the edit", figure: "22 s", detail: "With a screenshot, 39 s. Medians, no build" },
  { label: "Session tokens", figure: "253k", detail: "With a screenshot, 312k. Medians, no build" },
  { label: "Correct edit", figure: "30 of 30", detail: "Every run on both sides, once the question was answered" },
];

export function LocantMeasured() {
  return (
    <div className="rounded-2xl overflow-hidden bg-surface-inset border border-case-study-module-border">
      <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-case-study-module-divider [&>*:nth-child(odd)]:border-r md:[&>*:nth-child(odd)]:border-r-0 [&>*:nth-child(-n+2)]:border-t-0">
        {measuredTiles.map((t) => (
          <div key={t.label} className="flex flex-col gap-3 px-6 py-6 md:px-7 md:py-8 border-case-study-module-divider">
            <p className="text-caption font-mono uppercase tracking-eyebrow text-foreground-tertiary">{t.label}</p>
            <p className="text-title md:text-heading font-light leading-none tracking-tight tabular-nums text-foreground">{t.figure}</p>
            <p className="text-sm md:text-base font-light text-foreground-secondary leading-relaxed">{t.detail}</p>
          </div>
        ))}
      </div>
      <p className="px-6 py-6 md:px-7 md:py-7 border-t border-case-study-module-divider text-sm md:text-base font-light leading-relaxed text-foreground-secondary">
        One task, one app, one model: Claude Code on Opus 5 at medium effort, a fresh session per run, no MCP on either side, the repo reset between runs, and the order alternated.{" "}
        <a
          href={REPORT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground-lead underline underline-offset-4 transition-colors duration-fast ease-settle hover:text-foreground"
        >
          Method, transcripts, and statistics
        </a>
      </p>
    </div>
  );
}

// ── Links ─────────────────────────────────────────────────────────────────────
// The product site is the one live-product link, so it takes the filled pill.
// The pitch film joins as a secondary control once Malik has uploaded it; until
// then there is no URL and no button.
const LOCANT_SITE_URL = "https://locant.malikzhang.com";
const LOCANT_GITHUB_URL = "https://github.com/Malik1942/locant";
export const LOCANT_FILM_URL: string | null = null;

export function LocantLinks({ filmUrl = LOCANT_FILM_URL }: { filmUrl?: string | null }) {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4">
      <Button href={LOCANT_SITE_URL} external icon={<ArrowUpRight strokeWidth={1.8} />}>
        Visit locant.malikzhang.com
      </Button>
      <Button tone="secondary" href={LOCANT_GITHUB_URL} external icon={<ArrowUpRight strokeWidth={1.8} />}>
        View on GitHub
      </Button>
      {filmUrl ? (
        <Button tone="secondary" href={filmUrl} external icon={<ArrowUpRight strokeWidth={1.8} />}>
          Watch the film
        </Button>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 4: Run the tests to see them pass**

Run: `npx vitest run src/components/project-detail/LocantModules.test.tsx`
Expected: PASS, 10 tests.

- [ ] **Step 5: Run the design-system boundary test**

Run: `npx vitest run src/design-system/boundary.test.ts`
Expected: PASS. A failure names the file, line, and class; replace that class with the token the hint names.

- [ ] **Step 6: Commit**

```bash
git add src/components/project-detail/LocantModules.tsx src/components/project-detail/LocantModules.test.tsx
git commit -m "Add the Locant case study modules"
```

---

### Task 4: The Locant document and its registration

**Files:**
- Test: `src/data/locantDraft.test.ts`
- Modify: `src/components/project-detail/ProjectDetailTemplate.tsx` (imports after the `./OryneModules` import; ten entries after `"oryne-takeaways"`)
- Modify: `src/data/projectDetails.ts` (imports after `oryneFilmPoster`; the `locant` const before the `SOURCES` comment; `locant` in `SOURCES` after `oryne`)
- Modify: `docs/superpowers/specs/2026-09-17-locant-case-study-design.md`

**Interfaces:**
- Consumes: the Task 3 exports; the Task 1 and Task 2 assets; `getProjectDetail(slug)` from `./projectDetails`; `getProject(id)` from `./projects`.
- Produces: `/project/locant`, prerendered, with sections `intro, highlights, problem, landscape, decisions, build, final-design, measured, reflection`.

- [ ] **Step 1: Write the failing test**

Create `src/data/locantDraft.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getProjectDetail } from "./projectDetails";
import { getProject } from "./projects";

// The Locant case study is a draft on its own branch. Until Malik wires it to
// the card, the card keeps opening the product site, and the second test holds
// that line. Delete that test in the change that connects them.
describe("Locant case study draft", () => {
  const doc = getProjectDetail("locant");

  it("tells the story in the spec's nine sections, each headed by a claim", () => {
    expect(doc).toBeDefined();
    expect(doc!.sections.map((s) => s.id)).toEqual([
      "intro",
      "highlights",
      "problem",
      "landscape",
      "decisions",
      "build",
      "final-design",
      "measured",
      "reflection",
    ]);
    for (const s of doc!.sections) expect(s.headline, s.id).toBeTruthy();
  });

  it("is not connected to the card yet: the card still opens the product site", () => {
    expect(getProject("locant")?.destination).toEqual({ kind: "external", url: "https://locant.malikzhang.com" });
  });

  it("keeps Malik's copy rules: no clause dashes, and never solo", () => {
    const strings: string[] = [doc!.title, doc!.heroSummary];
    for (const card of doc!.metaCards ?? []) strings.push(card.label, card.value);
    for (const s of doc!.sections) {
      strings.push(s.label, s.headline ?? "", s.body);
      for (const f of s.figures ?? []) {
        if (f.type === "embed") continue;
        strings.push(f.label ?? "", f.caption ?? "", "alt" in f ? f.alt : "");
      }
    }
    const copy = strings.join("\n");
    expect(copy).not.toMatch(/[–—]/);
    expect(copy).not.toMatch(/\b(solo|alone|by myself)\b/i);
  });
});
```

- [ ] **Step 2: Run it to see it fail**

Run: `npx vitest run src/data/locantDraft.test.ts`
Expected: FAIL at `expect(doc).toBeDefined()` (the first test) and at `doc!.title` (the third); the second passes.

- [ ] **Step 3: Register the modules in the template**

In `src/components/project-detail/ProjectDetailTemplate.tsx`, after the `} from "./OryneModules";` line, add:

```tsx
import {
  LocantBall,
  LocantHighlights,
  LocantLadder,
  LocantLandscape,
  LocantLinks,
  LocantMeasured,
  LocantOverlay,
  LocantPayload,
  LocantQuestion,
  LocantReleases,
} from "./LocantModules";
```

and after the `"oryne-takeaways": <OryneTakeaways />,` entry in `INLINE_MODULES`, add:

```tsx
  "locant-highlights": <LocantHighlights />,
  "locant-question": <LocantQuestion />,
  "locant-landscape": <LocantLandscape />,
  "locant-overlay": <LocantOverlay />,
  "locant-payload": <LocantPayload />,
  "locant-ladder": <LocantLadder />,
  "locant-ball": <LocantBall />,
  "locant-releases": <LocantReleases />,
  "locant-measured": <LocantMeasured />,
  "locant-links": <LocantLinks />,
```

- [ ] **Step 4: Add the asset imports**

In `src/data/projectDetails.ts`, after `import oryneFilmPoster from "@/assets/oryne-film-poster.webp";`, add:

```ts
import locantHero from "@/assets/locant-hero.webp";
import locantLoop from "@/assets/locant-loop.mp4";
import locantLoopPoster from "@/assets/locant-loop-poster.webp";
import locantBefore from "@/assets/locant-before.mp4";
import locantBeforePoster from "@/assets/locant-before-poster.webp";
import locantCanvas from "@/assets/locant-canvas.webp";
import locantSketch from "@/assets/locant-sketch.webp";
import locantNullElement from "@/assets/locant-null-element.webp";
import locantSelf from "@/assets/locant-self.mp4";
import locantSelfPoster from "@/assets/locant-self-poster.webp";
import locantDecision from "@/assets/locant-decision.webp";
import locantHover from "@/assets/locant-hover.mp4";
import locantHoverPoster from "@/assets/locant-hover-poster.webp";
import locantAgents from "@/assets/locant-agents.mp4";
import locantAgentsPoster from "@/assets/locant-agents-poster.webp";
import locantVerify from "@/assets/locant-verify.mp4";
import locantVerifyPoster from "@/assets/locant-verify-poster.webp";
import locantRing from "@/assets/locant-ring.mp4";
import locantRingPoster from "@/assets/locant-ring-poster.webp";
import locantSettings from "@/assets/locant-settings.webp";
import locantMeasured from "@/assets/locant-measured.webp";
```

- [ ] **Step 5: Add the document**

In `src/data/projectDetails.ts`, directly above the comment `// Authored without \`listSection\`: the eyebrow is filled in below from the`, add:

```ts
// Locant, first draft (spec: docs/superpowers/specs/2026-09-17-locant-case-study-design.md).
// Not connected to the homepage card: Locant's card still opens the product
// site, and src/data/locantDraft.test.ts holds that line until Malik wires it.
// Every fact traces to the Locant repo (~/Documents/Deixis), its site, git, the
// build recording, or the published measurement. The copy rests on one split:
// a click says which element, the note says what should change.
const locant: ProjectDetailSource = {
  slug: "locant",
  title: "Locant",
  heroSummary: "A Mac app for pointing a coding agent at the element you mean,\nso the words you type are only about the change.",
  // Scene A at 21.0 s: the Product Ideas orb outlined, the note typed under it.
  // Both halves of the product in one frame. A draft pick; see the plan.
  heroImage: locantHero,
  heroImageFit: "cover",
  metaCards: [
    { label: "Role", value: "0→1 Product Designer & Builder" },
    { label: "Timeline", value: "3 Hours to v0.4 · 4 Days to v0.8\nSep 13 to 16, 2026" },
    { label: "Made For", value: "Palantir Product Design\nShow & Tell" },
    { label: "Scope", value: "A Spec for Every Version\nInteraction and Visual Design\nSwift App and MCP Server\nSite, Film, and Measurement" },
    { label: "Tools", value: "Swift 6 · AppKit + SwiftUI\nClaude Design · Claude Code" },
    { label: "Output", value: "Free and Open Source · v0.8\nSigned, Notarized · MCP Server" },
  ],
  sections: [
    {
      id: "intro",
      label: "Intro",
      headline: "A click says which element. The note says what to change.",
      showProjectMeta: true,
      body: "**Locant is a free, open-source Mac app for pointing a coding agent at the exact element you mean. Click it in any app, type what should change, and the agent gets the element itself: its identifier, its frame, its place in the tree, and a crop.**\n\nI design and build my own apps end to end, and a coding agent does most of the typing. Seeing what was wrong took a second. Describing it took the rest: which screen, which component, where it sits in the tree, and then the change itself, in words the agent would read the way I meant them. That attention went into translation, not design.\n\nI made Locant for Palantir's Product Design Show & Tell. Versions 0.1 to 0.4 were built inside the three-hour window, timer running. Four days later it was at 0.8: signed, notarized, public on GitHub, and an MCP server as well.",
    },
    {
      id: "highlights",
      label: "Highlights",
      headline: "One capture, and the agent goes straight to the right file",
      body: "[[fig:0]]\n\n[[module:locant-highlights]]",
      figures: [
        { type: "video", src: locantLoop, poster: locantLoopPoster, label: "The loop", caption: "point at the orb, say what should change, and paste it into Cursor" },
      ],
    },
    {
      id: "problem",
      label: "The Problem",
      headline: "Every fix needed two descriptions, and the first ate the second",
      body: "UI polish starts as something seen: a button that should be rounder, a card that needs room. A coding agent works in text and code. Every fix meant translating one into the other, and the translation was mine to do.\n\nFirst, which element: which screen, which component, where it sits in the tree, in names the agent could match to the code. Then, what should change. The first kept eating the second. By the time I had written which button, I had lost what I was actually going to say about it.\n\n[[fig:0]]\n\nA screenshot doesn't remove that work. It hands the first half to the agent. Given a crop of the phone and a note that already said how to make the change, this is what it said:\n\n[[module:locant-question]]\n\n**It understood the change, down to the mechanism. It could not know which orb. That is the half Locant takes.**",
      figures: [
        { type: "video", src: locantBefore, poster: locantBeforePoster, label: "Before", caption: "a whole sentence about which orb, and not yet a word about the change" },
      ],
    },
    {
      id: "landscape",
      label: "Landscape",
      headline: "Web tools point at elements. Mac tools send the window.",
      body: "In September 2026, three kinds of tool handed a screen to a coding agent, and screenshot tools sat under all of them. None let a person point at one element in a native app and hand it to whichever agent they use.\n\n[[module:locant-landscape]]\n\nThat research changed three things before any code. No window capture, because two platforms already send the window. A payload of plain text with an image path, because agents handled MCP image blocks unevenly. And field names with no Apple prefix, so another platform could write the same shape.\n\n**Appshots gives your agent the window. Locant gives it the element.**",
    },
    {
      id: "decisions",
      label: "Decisions",
      headline: "A pixel is a guess. An identifier can be grepped.",
      body: "Before any code, one sentence set the feel: Locant should read like something macOS grew, in the family of the ⌘⇧4 crosshair, Live Text, and Spotlight. It appears, is used, and is gone. Three rules followed from it.\n\n· **Borrow, don't brand.** System accent, system type, system materials. The only mark of its own is the pointing hand.\n\n· **Nothing lingers.** Every surface dismisses itself, and a confirmation lasts one second.\n\n· **Quiet until approached.** Nothing pulses, bounces, or waits for you to notice it.\n\n[[fig:0]]\n\n## The accessibility tree, not the pixels\n\nEvery native app already carries the answer in its accessibility tree: a role, a label, and often the exact identifier its code uses. A pixel is a guess. An identifier is something an agent can search the code for. The overlay shows it on hover, before the click, so you know what the agent will get.\n\n[[module:locant-overlay]]\n\nIt leaves as plain Markdown with the image path first, because a terminal agent receives only the text on paste. This is the capture from the loop above, as Locant wrote it:\n\n[[module:locant-payload]]\n\n## A ladder when there is no element\n\nNot every view has a name. Views drawn in SpriteKit, Canvas, or Metal expose pixels nobody labeled. So a capture steps down a ladder, and says which rung it reached.\n\n[[module:locant-ladder]]\n\n**The agent always gets something to grep, or an honest null.**\n\n## One gesture instead of a screenshot tool\n\nIt had to replace my screenshot tool, or I would keep switching apps while polishing. Snap, Text, Color, and Cut ride the same gesture, and one rule decides what stays on disk: an action that makes an image keeps a file for 30 days, and one that makes text or a value keeps nothing.\n\n## A ball that wakes when you reach for it\n\nA hotkey is invisible and the menu bar is far. So Locant has a glass disc that tucks into the screen edge and wakes as the cursor approaches. Click it to point. Hold it, and a ring unfolds.\n\n[[module:locant-ball]]\n\nOn the whiteboard, hovering the ball opened a ring of six. Only press and hold shipped, with four segments at the compass points. Hover collided with docking at the edge and opened by accident, and 90 degrees per target is hard to miss. Settings moved to the menu bar: it was not ring material.\n\n[[fig:1]]",
      figures: [
        {
          type: "image",
          src: locantCanvas,
          alt: "The Claude Design canvas titled Deixis Overlay States, showing Frame 1, Hover, over the iPhone Simulator, with the menu-bar timer reading Design Challenge 2:59:57",
          label: "Claude Design",
          caption: "the overlay's states, drawn before any code, three seconds into the timer",
        },
        {
          type: "image",
          src: locantSketch,
          alt: "Whiteboard sketch: the ball at rest and docked at the screen edge, a six-segment ring labeled Hover, and a four-segment ring labeled Press & hold, release to pick/confirm",
          label: "Whiteboard",
          caption: "the ring on hover, and the press and hold that shipped",
        },
      ],
    },
    {
      id: "build",
      label: "Build",
      headline: "Four versions inside the three-hour window",
      body: "The research, the PRD, and the whiteboard came first. The timer started at 15:27 on September 13, and from there AI came in everywhere except the decisions: the overlay drawn in Claude Design, one spec per version written with Claude, and the Swift written by Claude Code.\n\n[[module:locant-releases]]\n\nv0.4 was tagged at 18:08, with about nineteen minutes left on the timer.\n\n## What fought back\n\nWith an hour and 42 minutes left, a capture of Oryne's orbs came back empty: no element information available. The orbs are drawn in SpriteKit, and nothing had named them.\n\n[[fig:0]]\n\nTwo things came out of that capture. The ladder, so a view with no name still gives the agent something to work from. And a fix to Oryne itself: at 17:02 its orbs were exposed to accessibility with identifiers, which is why every capture on this page can name the Product Ideas orb. Pointing at my own app showed me what it had been hiding from the accessibility tree.\n\nThe other fight was Locant seeing itself. Every capture leaves Locant's own windows out, so the overlay, the ball, and the note never land in the picture. Point at Locant's Settings, and it reads the window behind.\n\n[[fig:1]]\n\n## The product before the plumbing\n\nWith an hour and 12 minutes left, the plan said the MCP server came next. I moved it behind the product: Settings and the ball first.\n\n[[fig:2]]\n\nIt shipped in 0.7.1, on September 15, and not as the TypeScript package the PRD had planned. The server lives inside the app, started with a flag, because the captures live on the Mac, the app is already signed and updated, and nobody has to install Node.\n\n**I used Locant to build Locant. Everything after 0.4 was the product earning a second user: a first minute with no tour, a download that works, and an agent that fetches the capture itself.**",
      figures: [
        { type: "image", src: locantNullElement, alt: "The build recording with an hour and 42 minutes left: a Locant payload for the Oryne orb reads No element information available, beside the Library screen in the Simulator", label: "The empty capture", caption: "Oryne's orbs, with an hour and 42 minutes left" },
        { type: "video", src: locantSelf, poster: locantSelfPoster, label: "Locant on Locant", caption: "its own Settings reads as image only, then the window behind it" },
        { type: "image", src: locantDecision, alt: "The build recording with an hour and 12 minutes left: Malik's message asks to do the Settings window and the ball before the MCP connection, and finish the product first", label: "The call", caption: "Settings and the ball first, the MCP server after" },
      ],
    },
    {
      id: "final-design",
      label: "Final Design",
      headline: "One element, from pointed at to verified",
      body: "Every clip below is a recording of the released app.\n\n[[fig:0]]\n\nThe payload is plain Markdown, so any agent takes it on paste. Locant is also its own MCP server: connect Claude Code, Cursor, or Codex in Settings, say \"fix what I just pointed at\", and the agent fetches the capture itself.\n\n[[fig:1]]\n\nAfter the edit, run the app again. Locant finds the same element by its identifier, captures it when it looks different, and keeps every iteration with the git diff beneath.\n\n[[fig:2]]\n\nThe four other actions ride the same ball. Hold it, release on one, and the result is on the clipboard.\n\n[[fig:3]]\n\nSettings had to pass for an Apple app's preferences: system controls only, and every default works on first launch.\n\n[[fig:4]]\n\n**Point, note, paste, and see what changed, without once describing which button.**",
      figures: [
        { type: "video", src: locantHover, poster: locantHoverPoster, label: "Hover", caption: "Calculator, a CalmMouse slider with no identifier, the orb, then a web page" },
        { type: "video", src: locantAgents, poster: locantAgentsPoster, label: "Any agent", caption: "the same payload in Codex, then in Claude Code" },
        { type: "video", src: locantVerify, poster: locantVerifyPoster, label: "Before & After", caption: "the orb found again after the edit, 1 file changed and 28 insertions" },
        { type: "video", src: locantRing, poster: locantRingPoster, label: "The ring", caption: "hold the ball, release on Color, and pick a value from the screen" },
        { type: "image", src: locantSettings, alt: "Locant Settings, General tab, in the dark appearance: Accessibility and Screen Recording granted, the floating ball and auto-hide on, and a daily update check" },
      ],
    },
    {
      id: "measured",
      label: "Measured",
      headline: "What Locant saves is the question",
      body: "I measured one fix both ways. Same fix, same model, same repo, same note. The only difference was what got pasted: a ⌘⇧4 crop of the phone, or one Locant capture of the orb.\n\n[[module:locant-measured]]\n\n[[fig:0]]\n\n**Locant does not make the agent smarter. It removes the one thing the agent could not know from pixels.**\n\n[[module:locant-links]]",
      figures: [
        { type: "image", src: locantMeasured, alt: "Two panels, no build and build verified. With a screenshot the agent stopped to ask which orb in 6 of 6 and 11 of 12 runs; with Locant, 0 of 6 both times. Time from paste to the edit: screenshot medians 39 and 33 seconds, Locant 22 and 16 seconds." },
      ],
    },
    {
      id: "reflection",
      label: "Reflection",
      headline: "Every payload has two readers",
      body: "Every capture is read twice: by me as I point, and by a model that sees only text. The label on the overlay is for the first reader. It says what the agent will get before I click. The image path leads the payload for the second, because a terminal agent can only open what the text tells it to.\n\n## Honest by default\n\nThe ladder names its rung instead of pretending. The agent table on the site says untested until someone has tested it. When the daily update check broke the promise of no network calls, every sentence that made the promise was rewritten to say what was true.\n\n## What is still open\n\nSafari exposes the same web attributes as Chromium and has not been exercised yet. And because the payload's field names carry no Apple prefix, a port to another platform could write the same shape.",
    },
  ],
};

```

Then add `locant,` to `SOURCES` directly after `oryne,`.

- [ ] **Step 6: Run the new test and the suites that read every document**

Run: `npx vitest run src/data/locantDraft.test.ts src/data/projectDetailRefs.test.ts src/data/projectDetails.test.ts src/prerender/routes.test.ts`
Expected: PASS. `projectDetailRefs` proves every `[[module:…]]` and `[[fig:N]]` resolves and that all ten modules are used.

- [ ] **Step 7: Record the planning changes in the spec**

In `docs/superpowers/specs/2026-09-17-locant-case-study-design.md`, section 2, replace the headline line with:

```markdown
- id `highlights` · Headline: **One capture, and the agent goes straight to the right file** (changed while planning: the loop takes about 20 s from ball to paste because it tours the hover labels, so "three seconds" would contradict its own clip)
```

and append to the end of the file:

```markdown
## Changes made while planning

- Problem gains its own clip: scene G, the orb described by hand in Cursor's chat, cut at 9.95 s before the change is typed.
- Build gains two figures: the self-exclusion clip (scene F) and the build-recording frame of the "product first, MCP later" call at 1:12:55 left. The dogfood frame is dropped: its capture is too small to read at column width.
- The payload module shows capture `20260915-021609-zwec`, the one pasted in the loop, taken from Locant's own `get_capture`.
- Six meta cards instead of five (a two-column grid leaves an odd card alone): Scope is added.
- The Final Design close no longer says Settings is the only window: Before & After and Help are windows too.
```

- [ ] **Step 8: Run the whole suite and the build**

Run: `npm test`
Expected: all tests pass (typecheck included). The known timing-flaky tests under encoding load (`AdminAuthoringDialog`, `Admin entry integration`, `project dot arrival`, `ComponentLineup`) may time out; rerun those files alone before treating them as failures.

Run: `npm run build`
Expected: success. One warning that `/project/locant` has no share image in `public/og/` and falls back to the site-wide one. That is accepted for the draft.

- [ ] **Step 9: Commit**

```bash
git add src/data/locantDraft.test.ts src/data/projectDetails.ts src/components/project-detail/ProjectDetailTemplate.tsx docs/superpowers/specs/2026-09-17-locant-case-study-design.md
git commit -m "Draft the Locant case study at /project/locant, unlinked from its card"
```

---

### Task 5: Browser check and the hero pick

**Files:**
- Create (scratchpad only): `$SCR/check-locant.mjs`, `$SCR/shots/*.png`, `$SCR/hero-options.jpg`

**Interfaces:**
- Consumes: the running dev server; the Task 1 to 4 output.
- Produces: section screenshots at 1440×900 and 375×812, an orphan report, a console report, the card check, and a hero comparison for Malik.

- [ ] **Step 1: Start the dev server on a pinned port**

Start `vite-dev-worktree` with the preview tool (`preview_start {name: "vite-dev-worktree"}`, port 5199, `--strictPort`). If 5199 is taken by another session, add a temporary entry to `.claude/launch.json` with `--port 5198 --strictPort`, start that, and remove the entry before any later commit. Read the port from the server's log before using it.

- [ ] **Step 2: Write the check script**

Create `$SCR/check-locant.mjs`:

```js
import { createRequire } from "node:module";
const require = createRequire("/Users/malik/Documents/malik-portfolio/.claude/worktrees/locant-case-study-draft-06cca2/package.json");
const { chromium } = require("playwright");

const BASE = process.env.BASE ?? "http://localhost:5199";
const OUT = process.env.OUT;
const SECTIONS = ["intro", "highlights", "problem", "landscape", "decisions", "build", "final-design", "measured", "reflection"];
setTimeout(() => { console.error("timed out"); process.exit(2); }, 300_000);

// A block ends on an orphan when its last word sits on a lower line than the
// word before it. noOrphan's no-break space splits into two words here, so a
// glued pair reads as the same line and passes.
function findOrphans() {
  const root = document.querySelector('[aria-label="Case study"]');
  const out = [];
  const wordsOf = (el) => {
    const words = [];
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      for (const m of n.data.matchAll(/\S+/g)) words.push({ node: n, start: m.index, end: m.index + m[0].length });
    }
    return words;
  };
  const lineTop = (w) => {
    const r = document.createRange();
    r.setStart(w.node, w.start);
    r.setEnd(w.node, w.end);
    const rects = r.getClientRects();
    return rects.length ? rects[rects.length - 1].top : null;
  };
  for (const el of root.querySelectorAll("h2, p, figcaption")) {
    if (el.closest("pre, nav") || el.getClientRects().length === 0) continue;
    const words = wordsOf(el);
    if (words.length < 5) continue;
    const a = lineTop(words[words.length - 2]);
    const b = lineTop(words[words.length - 1]);
    if (a !== null && b !== null && b - a > 2) out.push(el.textContent.trim().slice(-90));
  }
  return out;
}

const browser = await chromium.launch();
const report = [];
for (const vp of [{ name: "desktop", width: 1440, height: 900 }, { name: "phone", width: 375, height: 812 }]) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 2, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(`${BASE}/project/locant`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("#project-section-intro");
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 600) { await page.mouse.wheel(0, 600); await page.waitForTimeout(120); }
  await page.evaluate(async () => { await Promise.all([...document.images].map((i) => i.decode().catch(() => {}))); });
  for (const id of SECTIONS) {
    const el = page.locator(`#project-section-${id}`);
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await el.screenshot({ path: `${OUT}/${vp.name}-${id}.png` });
  }
  const orphans = await page.evaluate(findOrphans);
  const literalRefs = await page.evaluate(() => document.body.innerText.match(/\[\[(module|fig):[^\]]+\]\]/g) ?? []);
  report.push({ viewport: vp.name, errors, orphans, literalRefs });
  await ctx.close();
}

const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const home = await ctx.newPage();
await home.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
const card = home.getByRole("link", { name: "Locant, opens locant.malikzhang.com in a new tab" }).first();
report.push({ card: await card.getAttribute("href") });

await browser.close();
console.log(JSON.stringify(report, null, 2));
process.exit(0);
```

- [ ] **Step 3: Run it**

```bash
mkdir -p $SCR/shots && OUT=$SCR/shots BASE=http://localhost:5199 node $SCR/check-locant.mjs
```

Expected: for both viewports, `errors: []` (a 404 for `/_vercel/insights/script.js` is expected locally and can be ignored), `orphans: []`, `literalRefs: []`; and `{ "card": "https://locant.malikzhang.com" }`. For each orphan reported, fix it in the copy (reword, or an authored `\n` in a headline) and rerun. Then look at all 18 screenshots: the landscape grid reads at both widths, the payload wraps inside its card at 375 px, the ball tiles are not blurred beyond the site's own captures, and no figure overflows its column.

- [ ] **Step 4: Build the hero comparison for Malik**

The hero must not repeat the card cover, so the comparison shows the cover beside three candidates: scene A at 21.0 s (the default), scene A at 15.25 s (the hover label on the orb), and scene B at 12.0 s (the Before & After window).

```bash
ffmpeg -v error -y -i $V4/sceneA-comp.mp4 -ss 15.25 -frames:v 1 $SCR/assets/hero-b.png
ffmpeg -v error -y -i $V4/sceneB-comp.mp4 -ss 12.0 -frames:v 1 $SCR/assets/hero-c.png
python3 - <<EOF
from PIL import Image, ImageDraw, ImageFont
font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 28)
tiles = [("Card cover (homepage)", "$WT/src/assets/locant-card-poster.webp"), ("A: note under the orb (default)", "$SCR/assets/hero.png"), ("B: hover label on the orb", "$SCR/assets/hero-b.png"), ("C: Before & After", "$SCR/assets/hero-c.png")]
W, H = 1200, 675
sheet = Image.new("RGB", (W * 2, (H + 50) * 2), (10, 10, 10))
for i, (label, path) in enumerate(tiles):
    im = Image.open(path).convert("RGB").resize((W, H), Image.LANCZOS)
    x, y = (i % 2) * W, (i // 2) * (H + 50)
    sheet.paste(im, (x, y + 50))
    ImageDraw.Draw(sheet).text((x + 16, y + 10), label, fill=(235, 235, 235), font=font)
sheet.save("$SCR/hero-options.jpg", quality=85)
EOF
```

Send `$SCR/hero-options.jpg` to Malik with the screenshots, and ask which hero to keep. Swapping is one line: re-export the chosen frame to `src/assets/locant-hero.webp` with Task 1 Step 1's command at the new timestamp.

- [ ] **Step 5: Stop the server and confirm the tree is clean**

Stop the preview server. Run `git status --short`. Expected: only `?? default.profraw` (and nothing under `.claude/launch.json` if a temporary entry was used).
