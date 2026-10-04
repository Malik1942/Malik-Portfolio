import { useEffect, useRef, type ReactNode } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, CircleDashed, Crosshair, FileText, Hammer, Minus, Repeat, RotateCcw, Scissors, Send, ShieldCheck } from "lucide-react";
import locantIcon from "@/assets/locant-icon.webp";
import locantOverlayHover from "@/assets/locant-overlay-hover.webp";
import locantOverlayOption from "@/assets/locant-overlay-option.webp";
import locantOverlayDrag from "@/assets/locant-overlay-drag.webp";
import locantOverlayNote from "@/assets/locant-overlay-note.webp";
import locantBallDocked from "@/assets/locant-ball-docked.webp";
import locantBallAwake from "@/assets/locant-ball-awake.webp";
import locantBallReady from "@/assets/locant-ball-ready.webp";
import locantBallRing from "@/assets/locant-ball-ring.webp";
import locantGalleryAgent from "@/assets/locant-gallery-agent.webp";
import locantGalleryVerify from "@/assets/locant-gallery-verify.webp";
import locantGalleryRing from "@/assets/locant-gallery-ring.webp";
import locantGalleryColor from "@/assets/locant-gallery-color.webp";
import locantTileAgent from "@/assets/locant-tile-agent.mp4";
import locantTileVerify from "@/assets/locant-tile-verify.mp4";
import locantTileRing from "@/assets/locant-tile-ring.mp4";
import locantTileColor from "@/assets/locant-tile-color.mp4";
import locantScreenshot from "@/assets/locant-screenshot.webp";
import locantSketchFirst from "@/assets/locant-sketch-first.webp";
import locantElement from "@/assets/locant-element.webp";
import { Button } from "@/components/ui/Button";
import { noOrphan } from "@/lib/noOrphan";
import { FigureCaption } from "./FigureCaption";
import { CardGrid, Chips, ModuleCard, type GridItem } from "./MotiModules";

/* ---------------------------------------------------------------------------
 * Locant case-study inline modules.
 * Every fact here comes from Malik's own sources: the Locant repo
 * (~/Documents/Locant, called Deixis until Sep 14: README, PRD, the version
 * specs, CHANGELOG, the measurement reports), its product site, git, the raw
 * measurement data in ~/Desktop/locant-film/v4/measure, Locant's own capture
 * store, and the Palantir deck (Figma, "Presentation Final v2"). Nothing is
 * rounded up or inferred; where the deck and a source disagree, the source wins
 * (docs/superpowers/specs/2026-10-03-locant-case-study-refine-design.md).
 * The shells (ModuleCard, CardGrid, Chips) are MotiModules'.
 * ------------------------------------------------------------------------- */

// The 12px mono label every module here opens a block with.
const EYEBROW = "text-label uppercase tracking-eyebrow text-foreground-tertiary font-mono";

// ── Still grids ───────────────────────────────────────────────────────────────
// Two across from sm, one per row below it, each still captioned. Every still in
// a grid shares one intrinsic size, which reserves its box before it loads and
// keeps the captions of a row on one baseline. A still with a `video` plays as
// a loop instead (LoopTile).
type Still = { src: string; label: string; caption: string; alt: string; video?: string };

// A tile that behaves like a GIF: silent, looping, no controls. MP4 rather than
// GIF because a GIF at this size runs to megabytes with banded colour, where
// these are 60 to 540 KB. The poster is the loop's own first frame, so nothing
// swaps when it starts. It fetches once it is within a screen of the viewport
// and plays only while on screen, so four loops never run off-screen at once.
// Under reduced motion the tile is that first frame and nothing moves.
function LoopTile({ still, video, alt, width, height }: { still: string; video: string; alt: string; width: number; height: number }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();
  const near = useInView(ref, { once: true, margin: "100% 0px 100% 0px" });
  const onScreen = useInView(ref, { amount: 0.4 });

  useEffect(() => {
    const loop = ref.current;
    if (!loop || !near) return;
    if (onScreen) loop.play().catch(() => {});
    else loop.pause();
  }, [near, onScreen]);

  if (reduceMotion) {
    return <img src={still} alt={alt} width={width} height={height} loading="lazy" decoding="async" className="block h-auto w-full" />;
  }
  return (
    <video
      ref={ref}
      src={near ? video : undefined}
      poster={still}
      width={width}
      height={height}
      muted
      loop
      playsInline
      preload="none"
      aria-label={alt}
      className="block h-auto w-full"
    />
  );
}

function StillGrid({ stills, width, height }: { stills: Still[]; width: number; height: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10 md:gap-x-8 md:gap-y-12">
      {stills.map((s) => (
        <figure key={s.label} className="flex flex-col">
          <div className="overflow-hidden rounded-2xl bg-secondary/10" style={{ aspectRatio: `${width} / ${height}` }}>
            {s.video ? (
              <LoopTile still={s.src} video={s.video} alt={s.alt} width={width} height={height} />
            ) : (
              <img src={s.src} alt={s.alt} width={width} height={height} loading="lazy" decoding="async" className="block h-auto w-full" />
            )}
          </div>
          <div className="mt-auto">
            <FigureCaption label={s.label}>{s.caption}</FigureCaption>
          </div>
        </figure>
      ))}
    </div>
  );
}

// Screenshot and Locant, the two sides of every measurement on this page. Locant
// is the series the reader follows, so it takes full ink; the screenshot side
// sits back in the tertiary tier. Highlight one and grey the rest: the module
// system is monochrome, and the one green it has means "yes" in the landscape
// table, a status that a series must not borrow. The two inks are far apart in
// lightness on the module surface (CVD and normal-vision separation both pass
// the dataviz validator with room to spare), each clears 3:1 there, and every
// mark also carries its words: a legend, values printed beside the bars, and a
// table for screen readers.
const SERIES = {
  shot: { name: "Screenshot + prompt", dot: "bg-foreground-tertiary", bar: "bg-foreground-tertiary" },
  locant: { name: "Locant capture", dot: "bg-foreground", bar: "bg-foreground" },
} as const;

function Legend({ never }: { never?: boolean }) {
  return (
    <ul aria-label="Legend" className="flex flex-wrap items-center gap-x-5 gap-y-2">
      {(["shot", "locant"] as const).map((s) => (
        <li key={s} className="flex items-center gap-2 text-sm text-foreground-secondary">
          <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${SERIES[s].dot}`} />
          {SERIES[s].name}
        </li>
      ))}
      {never ? (
        <li className="flex items-center gap-2 text-sm text-foreground-secondary">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full border border-foreground-tertiary" />
          Never got there
        </li>
      ) : null}
    </ul>
  );
}

// ── Highlights ────────────────────────────────────────────────────────────────
// The hero shows the pointing and the clip above this shows the agent's half,
// so the gallery carries the rest of the product: any agent, Before & After,
// the ring, and one of the four actions at work. Each tile loops the one
// interaction it names, cut from the v4 film takes, cropped to 4:3 around the
// part that matters, 1200x900 at 60 fps. Each file opens on its most telling
// frame and wraps back round to it; the one 0.4 s dissolve sits where the take
// resets, mid-file.
//
// "Any agent" is four takes in a 2x2, on one clock, each sending the same payload
// together: Cursor (scene A) and Claude Code (E2) from the film, then Codex (the
// ChatGPT app's Work mode) and Antigravity, recorded on inspire-ocean on Sep 18
// and stopped as soon as each had started. Cursor's cell opens with the payload
// already pasted, because its paste lands while the film's camera is still moving.
// The film bakes in its real pointer, which sat parked on Cursor's payload and
// mid-terminal in Claude Code until the send; each is covered with a clean frame
// of the same pixels from the same take, never redrawn. The new takes were
// recorded without a pointer. Every segment plays at 1x: waits are cut only where
// the frame is still, and a cell changes its crop only at the send, where the
// app's own layout jumps. Antigravity asked once for leave to read the capture
// image; the tile skips that wait. Claude Code stays the terminal: Malik settled
// on the take that exists rather than shooting its app.
//
// The third chip is the worktree test's time to the right file, 80 s to 39 s
// (Measured). It replaced "Asked which orb: 0 of 12", from the September test
// that gave the screenshot side the whole window and Locant one element.
const highlights = [
  "The element, not a screenshot",
  "Any Mac app, any agent",
  "Right file in half the time",
  "v0.1 to v0.4 in three hours",
];

const gallery: Still[] = [
  {
    src: locantGalleryAgent,
    video: locantTileAgent,
    label: "Any agent",
    // A product name never breaks across lines ("Claude / Code" did at 1440).
    caption: "the same payload in Cursor, Claude Code, Codex, and Antigravity",
    alt: "Cursor, Claude Code, Codex, and Antigravity in one frame, each sent the same Locant payload for the Product Ideas button. Cursor and Codex set out to match it to the Light And Color orb, Antigravity searches for Product Ideas and opens SeedScreenshot.swift, and Claude Code starts thinking",
  },
  {
    src: locantGalleryVerify,
    video: locantTileVerify,
    label: "Before & After",
    caption: "one click flips between the orb before and after the edit",
    alt: "The Before & After window in Flip mode: each click swaps the Product Ideas orb between before the edit, small, and after it, larger with satellite dots, above 1 file changed, 28 insertions, 1 deletion",
  },
  {
    src: locantGalleryRing,
    video: locantTileRing,
    label: "The ring",
    caption: "hold the ball, then release on an action",
    alt: "The ball held down until the ring unfolds with Snap, Text, Color, and Cut, then released on Color, which opens the magnifier",
  },
  {
    src: locantGalleryColor,
    video: locantTileColor,
    label: "Color",
    caption: "a magnifier on the pixel, and the value copied",
    alt: "The Color magnifier on the Resurfacing card in Oryne, then a click and a Copied toast with the picked value",
  },
];

export function LocantHighlights() {
  return (
    <div className="flex flex-col gap-stack">
      <Chips items={highlights} />
      <StillGrid stills={gallery} width={1200} height={900} />
    </div>
  );
}

// ── The agent's question ──────────────────────────────────────────────────────
// Its own words, whole: the first measurement (v3, Sep 15), screenshot side, run
// build-shot-2, the run the Palantir deck quotes on its problem slide
// (measure/v3/run-claude-opus-5-build-shot-2.jsonl, the result field). Nothing
// is cut or reworded, straight quotes and backticks included; the agent's own
// bold is the orb names set in full ink. The screenshot beside it is the one it
// was given: the whole Simulator window, measure/screenshot-crop.png, 912x1944,
// shown at 684x1458.
export const AGENT_REPLY = {
  opening: "I haven't changed anything yet: I can't tell from the screenshot which orb you mean.",
  context: "`screenshot-crop.png` shows the whole Ocean screen, and nothing in it points to a single orb. Besides Light And Color, five orbs could be the one:",
  candidates: [
    { name: "Product Ideas", detail: ': 1 thought ("Half a sentence from the train")' },
    { name: "Cooking", detail: ': 1 thought ("Weeknight noodles")' },
    { name: "Sound & Music", detail: ': 1 thought ("Four notes in the cafe")' },
    { name: "Interface Design", detail: ': 2 thoughts (the Apple Design Principles link and "A button that doesn\'t need a label")' },
    { name: "Reading", detail: ": 2 thoughts (the Are.na Editorial link), mostly hidden behind the tab bar" },
  ],
  question: "Which one should get the three thoughts?",
  plan: "Once you tell me, I'll add three new thoughts in the same voice to `Oryne/App/SeedScreenshot.swift`, without touching the layout engine. Then I'll run your build command and report the result.",
};
// measure/v3/REPORT.md, "Reading it": 17 of 18 screenshot runs asked, and the
// one that did not (build condition, pair 1) guessed Product Ideas and was right.
const QUESTION_STAT = "17 of 18 screenshot runs stopped here. The one that didn't guessed, and happened to be right.";
const QUESTION_SOURCE = "Claude Code on Opus 5 at medium effort, given the screenshot and a note that already said how to make the change. Measurement run, September 15, 2026.";

export function LocantQuestion() {
  return (
    <ModuleCard>
      <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] divide-y sm:divide-y-0 sm:divide-x divide-case-study-module-divider">
        <figure className="flex flex-col gap-5 px-6 py-6 md:px-8 md:py-7">
          <p className={EYEBROW}>{noOrphan("The screenshot it was given")}</p>
          <img
            src={locantScreenshot}
            alt="The Simulator window on Oryne's Ocean screen, captured whole: six orbs, Product Ideas, Cooking, Sound & Music, Interface Design, Light And Color, and Reading behind the tab bar, with nothing marking which one is meant"
            width={684}
            height={1458}
            loading="lazy"
            decoding="async"
            className="mx-auto block h-auto w-full max-w-48 md:max-w-56"
          />
        </figure>
        <figure className="flex flex-col gap-5 px-6 py-6 md:px-8 md:py-7">
          <p className={EYEBROW}>Claude Code's reply</p>
          <blockquote className="flex flex-col gap-4 font-mono text-caption md:text-sm leading-relaxed text-foreground-secondary [overflow-wrap:anywhere]">
            <p className="text-foreground">{AGENT_REPLY.opening}</p>
            <p>{AGENT_REPLY.context}</p>
            <ul aria-label="The five orbs it could not choose between" className="flex flex-col gap-1.5">
              {AGENT_REPLY.candidates.map((c) => (
                <li key={c.name} data-orb={c.name}>
                  <span aria-hidden="true" className="text-foreground-quiet">
                    {"· "}
                  </span>
                  <span className="text-foreground">{c.name}</span>
                  {c.detail}
                </li>
              ))}
            </ul>
            <p>
              <span className="text-foreground">{AGENT_REPLY.question}</span> {AGENT_REPLY.plan}
            </p>
          </blockquote>
        </figure>
      </div>
      <div className="flex flex-col gap-2 border-t border-case-study-module-divider px-6 py-5 md:px-8 md:py-6">
        <p className="text-base md:text-xl font-normal leading-relaxed text-foreground">{noOrphan(QUESTION_STAT)}</p>
        <p className="text-sm md:text-base font-light leading-relaxed text-foreground-secondary">{noOrphan(QUESTION_SOURCE)}</p>
      </div>
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
// A table cell is too narrow for noOrphan's five-word floor: a three-word note
// still left its last word alone at 1440px ("Clipboard and / MCP"). The last
// pair is glued whatever the length, and overflow-wrap is the floor under it.
const glueLastPair = (text: string) => text.replace(/\s+(\S+)$/, " $1");

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
      { held: "yes", note: "Mac apps, the Simulator" },
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
      <p className={`text-caption md:text-sm font-normal leading-relaxed [overflow-wrap:anywhere] ${cell.held === "no" ? "text-foreground-tertiary" : "text-foreground-lead"}`}>
        <span className="sr-only">{`${column}: ${HELD_WORD[cell.held]}. `}</span>
        {/* Below md there is no header row, so each cell names its column. */}
        <span aria-hidden="true" className="md:hidden font-mono uppercase tracking-eyebrow text-foreground-tertiary">
          {column} ·{" "}
        </span>
        {glueLastPair(cell.note)}
      </p>
    </div>
  );
}

export function LocantLandscape() {
  return (
    <ModuleCard>
      <div className={`hidden md:grid ${TOOL_COLS} px-8 py-4 border-b border-case-study-module-divider`}>
        <p className={EYEBROW}>Tool</p>
        {COLUMNS.map((c) => (
          <p key={c} className={`${EYEBROW} pl-5 ${COL_RULE}`}>
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
              <p className={`text-sm md:text-base ${t.mine ? "font-medium" : "font-normal"}`}>{glueLastPair(t.name)}</p>
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

// ── The turn ──────────────────────────────────────────────────────────────────
// The deck's slide 06. Before: whiteboard sketch-01 (docs/sketch-01.HEIC, Sep
// 13, before the first commit), Deixis as a screenshot tool, a disc at the
// screen edge and a ring of capture actions on hover. After: Locant 0.9.2 over
// Oryne in Xcode 27's Device Hub, Oct 1, one frame of the v10 take at 15.0 s in
// native 4K pixels, cropped 4:3: the orb outlined under the pointing hand, its
// identifier beneath. The pointer is the interaction there, so it stays.
const turn: Still[] = [
  {
    src: locantSketchFirst,
    label: "The first idea",
    caption: "screenshots plus context, to help the agent design",
    alt: "Whiteboard sketch from September 13: a Mac screen titled Deixis holding a window and the iPhone Simulator, a disc resting at the screen edge labeled Not activated and Deixis (Rest), and a ring of screenshot actions labeled Hover",
  },
  {
    src: locantElement,
    label: "What it became",
    caption: "point at the element, so the agent knows what to change",
    alt: "Locant 0.9.2 over Oryne's Ocean screen in Xcode's Device Hub: the Product Ideas orb outlined in blue under the pointing hand, with the label button · oceanCurrent.product ideas beneath it",
  },
];

export function LocantTurn() {
  return <StillGrid stills={turn} width={1096} height={822} />;
}

// ── The overlay ───────────────────────────────────────────────────────────────
// The product site's own captures (site/assets/overlay-*.jpg), over Calculator
// on the Tahoe wallpaper, 1260x840. Alt text is the site's.
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
  return <StillGrid stills={overlayStates} width={1260} height={840} />;
}

// ── The payload ───────────────────────────────────────────────────────────────
// Verbatim from Locant itself: get_capture over its own MCP server for capture
// 20260915-021609-zwec, the one taken in the hero reel, pasted in Highlights, and found again
// in the Before & After clip. The Window value is the Simulator's own window
// title, en dash included; the negative y is real too (the Simulator sat on a
// display above the main one). Full-ink lines are what the agent acts on.
// The numbered notes are the order's reasons, from the deck's payload anatomy
// (backup B1). Their markers sit outside the text, so the payload stays exactly
// what Locant wrote.
const payloadLines: { text: string; key?: boolean; note?: string }[] = [
  { text: "## Locant capture (fix)" },
  {
    text: "Image: /Users/malik/Pictures/Locant/locant-simulator-20260915-021609-zwec.png",
    key: true,
    note: "The crop, path first. A terminal agent gets only text on paste, and any agent can open a file.",
  },
  { text: "App: Simulator (com.inspireocean.app) · Window: iPhone 17 Pro – iOS 26.5" },
  { text: "Captured: 2026-09-15 02:16 · Image region: 139×183 pt @2x (element + 40 pt)" },
  {
    text: "Project: /Users/malik/Documents/inspire-ocean",
    note: "The folder that built the app on screen. The test below put one more sentence here.",
  },
  { text: "" },
  { text: "### Target element" },
  { text: 'button "Product Ideas" · id=oceanCurrent.product ideas', key: true, note: "The identifier. What the agent greps for." },
  { text: "Frame: x=152.7 y=-1335.3 w=58 h=102" },
  { text: "Path: application > window > group > button#oceanCurrent.product ideas", note: "Where it sits in the tree." },
  { text: "" },
  { text: "### Note" },
  {
    text: "make this orb bigger, with satellite nodes like Light And Color",
    key: true,
    note: "Your note, last. The agent reads the context before the intent.",
  },
];
export const PAYLOAD_TEXT = payloadLines.map((l) => l.text).join("\n");
export const PAYLOAD_NOTES = payloadLines.flatMap((l) => (l.note ? [l.note] : []));

function Marker({ n }: { n: number }) {
  return (
    <span
      aria-hidden="true"
      className="ml-2 inline-flex h-4 w-4 select-none items-center justify-center rounded-full border border-hairline align-middle font-mono text-label leading-none text-foreground-tertiary"
    >
      {n}
    </span>
  );
}

export function LocantPayload() {
  let n = 0;
  return (
    <ModuleCard>
      <pre className="px-6 py-6 md:px-8 md:py-7 font-mono text-caption md:text-sm leading-relaxed whitespace-pre-wrap [overflow-wrap:anywhere]">
        {payloadLines.map((l, i) => (
          <span key={i} className={`block ${l.key ? "text-foreground" : "text-foreground-secondary"}`}>
            {l.text || " "}
            {l.note ? <Marker n={++n} /> : null}
          </span>
        ))}
      </pre>
      <ol
        aria-label="Why the payload is in this order"
        className="grid grid-cols-1 sm:grid-cols-2 gap-px border-t border-case-study-module-divider bg-case-study-module-divider"
      >
        {PAYLOAD_NOTES.map((note, i) => (
          <li key={note} className="flex items-start gap-3 bg-surface-inset px-6 py-5 md:px-8 md:py-6 sm:last:col-span-2">
            <span className="mt-0.5 font-mono text-caption tabular-nums text-foreground-tertiary">{i + 1}</span>
            <p className="text-sm md:text-base font-light leading-relaxed text-foreground-lead">{noOrphan(note)}</p>
          </li>
        ))}
      </ol>
    </ModuleCard>
  );
}

// ── The ladder ────────────────────────────────────────────────────────────────
// The five rungs in the deck's words (slide 09: "each rung asks less of the
// app"), best first. Each example is Locant's own wording: the Product Ideas
// capture above for the identifier; the Food Truck T3 capture from the worktree
// test for a label with no identifier, with the line MarkdownBuilder adds under
// it; the site's own chips for the frame and the text; and MarkdownBuilder's
// no-element text, verbatim, for the image alone.
const rungs = [
  {
    name: "Identifier",
    example: 'button "Product Ideas" · id=oceanCurrent.product ideas',
    note: "The element names itself, and the agent greps for the name.",
  },
  {
    name: "Label",
    example: 'unknown "Sweet level" · no identifier\nNo identifier. Grep the label text; add .accessibilityIdentifier("…") to this view so the next capture is exact.',
    note: "A label to search for, and the line the view is missing.",
  },
  { name: "A frame you draw", example: "### Elements in frame (6)", note: "Drag on the overlay, and everything inside is listed." },
  { name: "Text and neighbors", example: "### Text in image · ### Nearby", note: "The words in the image, and the nearest named elements with their offsets." },
  {
    name: "The image alone",
    example:
      'No element information available (app exposes no accessibility tree). Use the image.\nIf this view is yours, give it .accessibilityElement() and .accessibilityIdentifier("…") so Locant can point at it next time.',
    note: "The payload says so, keeps your note, and says how to name the view next time.",
  },
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
              <code className="font-mono text-caption md:text-sm text-foreground-lead whitespace-pre-line [overflow-wrap:anywhere]">{r.example}</code>
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

// ── The ring, against the layouts it beat ─────────────────────────────────────
// The deck's slide 10, "Four actions, and where to put them": the ring shipped,
// and each alternative has the one reason it lost, in the deck's words. The
// diagrams are drawn here in currentColor (no image assets), one 96x72 frame
// each, so the five read as one comparison.
type Layout = { name: string; why: string; shipped?: boolean; draw: () => ReactNode };

function polar(cx: number, cy: number, r: number, deg: number) {
  const a = (deg * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}
// One segment of an annulus between radii r1 and r2, from angle a0 to a1.
function sector(cx: number, cy: number, r1: number, r2: number, a0: number, a1: number) {
  const f = (v: number) => v.toFixed(2);
  const [x0, y0] = polar(cx, cy, r2, a0);
  const [x1, y1] = polar(cx, cy, r2, a1);
  const [x2, y2] = polar(cx, cy, r1, a1);
  const [x3, y3] = polar(cx, cy, r1, a0);
  return `M${f(x0)} ${f(y0)}A${r2} ${r2} 0 0 1 ${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}A${r1} ${r1} 0 0 0 ${f(x3)} ${f(y3)}Z`;
}

const layouts: Layout[] = [
  {
    name: "Ring",
    shipped: true,
    why: "Each action gets its own direction, the same distance away. Pick without looking.",
    draw: () => (
      <>
        {[-90, 0, 90, 180].map((a) => (
          <path key={a} d={sector(48, 36, 14, 30, a - 37, a + 37)} fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round" />
        ))}
        <circle cx={48} cy={36} r={6} fill="currentColor" />
      </>
    ),
  },
  {
    name: "Square panel",
    why: "You find the box, then aim.",
    draw: () => (
      <>
        <circle cx={14} cy={36} r={4} fill="currentColor" />
        <path d="M20 36H40" stroke="currentColor" strokeWidth={1.2} strokeDasharray="2 3" />
        {[
          [46, 20],
          [64, 20],
          [46, 38],
          [64, 38],
        ].map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width={14} height={14} rx={3} fill="none" stroke="currentColor" strokeWidth={1.4} />
        ))}
      </>
    ),
  },
  {
    name: "Pop-up list",
    why: "Near an edge it flips, so actions move.",
    draw: () => (
      <>
        <path d="M80 6V66" stroke="currentColor" strokeWidth={1.4} />
        <circle cx={72} cy={12} r={4} fill="currentColor" />
        <rect x={30} y={18} width={34} height={42} rx={4} fill="none" stroke="currentColor" strokeWidth={1.4} />
        {[28, 38, 48].map((y) => (
          <path key={y} d={`M30 ${y}H64`} stroke="currentColor" strokeWidth={1} />
        ))}
        <path d="M86 18V58" stroke="currentColor" strokeWidth={1.2} strokeDasharray="2 3" />
      </>
    ),
  },
  {
    name: "Stack",
    why: "Each action sits farther than the last.",
    draw: () => (
      <>
        {[10, 22, 34, 46].map((y) => (
          <rect key={y} x={30} y={y} width={28} height={8} rx={4} fill="none" stroke="currentColor" strokeWidth={1.4} />
        ))}
        <circle cx={44} cy={64} r={4} fill="currentColor" />
        <path d="M68 60V12M64 16l4-4 4 4" fill="none" stroke="currentColor" strokeWidth={1.2} strokeDasharray="2 3" />
      </>
    ),
  },
  {
    name: "Picker",
    why: "The third action is three moves away.",
    draw: () => (
      <>
        <circle cx={14} cy={36} r={4} fill="currentColor" />
        {[
          [12, 0.3],
          [24, 0.6],
          [48, 0.6],
          [60, 0.3],
        ].map(([y, o]) => (
          <rect key={y} x={30} y={y - 4} width={36} height={8} rx={4} fill="none" stroke="currentColor" strokeWidth={1.2} opacity={o} />
        ))}
        <rect x={26} y={30} width={44} height={12} rx={6} fill="none" stroke="currentColor" strokeWidth={1.6} />
        <path d="M80 22l4-4 4 4M80 50l4 4 4-4" fill="none" stroke="currentColor" strokeWidth={1.2} />
      </>
    ),
  },
];

function LayoutCell({ layout }: { layout: Layout }) {
  return (
    <div
      data-layout={layout.name}
      data-shipped={layout.shipped ? "true" : undefined}
      className={`flex flex-col gap-5 px-6 py-6 md:px-7 md:py-7 ${layout.shipped ? "bg-case-study-module-divider sm:col-span-2 md:col-span-1 md:row-span-2 md:justify-center" : "bg-surface-inset"}`}
    >
      <svg
        viewBox="0 0 96 72"
        aria-hidden="true"
        className={`h-auto ${layout.shipped ? "w-36 md:w-48 text-foreground" : "w-24 text-foreground-secondary"}`}
      >
        {layout.draw()}
      </svg>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2.5">
          <p className="text-base md:text-xl font-medium text-foreground tracking-tight">{layout.name}</p>
          {layout.shipped ? (
            <span className="rounded-full border border-hairline px-2 py-0.5 font-mono text-label uppercase tracking-eyebrow text-foreground-lead">Shipped</span>
          ) : null}
        </div>
        <p className="text-sm md:text-base font-light leading-relaxed text-foreground-secondary">{noOrphan(layout.why)}</p>
      </div>
    </div>
  );
}

export function LocantRing() {
  return (
    <ModuleCard>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)] gap-px bg-case-study-module-divider">
        {layouts.map((l) => (
          <LayoutCell key={l.name} layout={l} />
        ))}
      </div>
    </ModuleCard>
  );
}

// ── The plan ──────────────────────────────────────────────────────────────────
// specs/v0.1.md, "2. Time plan (3 hours, timer on, commits carry timestamps)",
// in the condensed wording of the deck's backup B2. The plan covered v0.1 only;
// the rule under it is the spec's sentence, verbatim.
const planSlots = [
  { slot: "0:00 to 0:10", work: "Confirm the system-wide fallback", exit: "Result noted in README. Hard stop at 0:10." },
  { slot: "0:10 to 0:45", work: "ElementResolver + tests with recorded AX fixtures", exit: "8 tests green" },
  { slot: "0:45 to 1:30", work: "Capture: hotkey, live overlay, window hit-test, crop", exit: "Overlay appears, hover shows readout, click resolves" },
  { slot: "1:30 to 2:15", work: "Payload: MarkdownBuilder, PasteboardWriter, FileStore", exit: "Paste into Claude Code shows Markdown" },
  { slot: "2:15 to 2:45", work: "Note field, failure feedback, menu bar item", exit: "End-to-end run on demo target" },
  { slot: "2:45 to 3:00", work: "git tag v0.1, README with permissions steps", exit: "Tag pushed" },
];
export const PLAN_RULE = "If a slot overruns by more than 10 minutes, cut the next slot's polish, not its core.";
const PLAN_COLS = "grid-cols-1 md:grid-cols-[7.5rem_minmax(0,1.2fr)_minmax(0,1fr)]";

export function LocantPlan() {
  return (
    <ModuleCard>
      <div className={`hidden md:grid ${PLAN_COLS} gap-x-6 px-8 py-4 border-b border-case-study-module-divider`}>
        <p className={EYEBROW}>Slot</p>
        <p className={EYEBROW}>Work</p>
        <p className={EYEBROW}>Exit condition</p>
      </div>
      <ol aria-label="The v0.1 time plan" className="divide-y divide-case-study-module-divider">
        {planSlots.map((s) => (
          <li key={s.slot} data-slot={s.slot} className={`grid ${PLAN_COLS} gap-x-6 gap-y-1.5 px-6 py-4 md:px-8 md:py-5`}>
            <p className="font-mono text-caption md:text-sm tabular-nums text-foreground-tertiary">{s.slot}</p>
            <p className="text-sm md:text-base font-normal leading-relaxed text-foreground-lead">{noOrphan(s.work)}</p>
            <p className="text-sm md:text-base font-light leading-relaxed text-foreground-secondary">
              <span className="md:hidden font-mono text-caption uppercase tracking-eyebrow text-foreground-tertiary">Exit · </span>
              {noOrphan(s.exit)}
            </p>
          </li>
        ))}
      </ol>
      <div className="flex flex-col gap-1.5 border-t border-case-study-module-divider px-6 py-5 md:px-8 md:py-6">
        <p className="text-base md:text-xl font-normal leading-relaxed text-foreground">{noOrphan(PLAN_RULE)}</p>
        <p className="font-mono text-caption md:text-sm text-foreground-tertiary">specs/v0.1.md · Sep 13, 2026</p>
      </div>
    </ModuleCard>
  );
}

// ── The loop ──────────────────────────────────────────────────────────────────
// The deck's slide 08, "How three hours was possible". Codex as the second
// opinion is Malik's own account from the deck; the repo does not record it. The
// deck's "123 tests" was the README's count on Sep 15, dropped there on Sep 29 as
// stale, so no count is given. Every version has its own spec in specs/, v0.1.md
// to v0.9.md.
const loop: GridItem[] = [
  { num: "01", title: "Spec", desc: "Scope, a time plan, and exit conditions, written first.", icon: FileText, accent: "violet" },
  { num: "02", title: "Build", desc: "Claude Code builds. Codex gives a second opinion.", icon: Hammer, accent: "emerald" },
  { num: "03", title: "Check", desc: "CLAUDE.md guardrails, and tests on the pure functions.", icon: ShieldCheck, accent: "slate" },
  { num: "04", title: "Use", desc: "Use it daily. What breaks becomes the next spec.", icon: Repeat, accent: "violet" },
];

export function LocantLoop() {
  return (
    <div className="flex flex-col gap-5">
      <CardGrid items={loop} colsClass="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" />
      <p className="flex items-center justify-center gap-2.5 text-sm md:text-base font-light text-foreground-secondary">
        <RotateCcw aria-hidden="true" className="h-4 w-4 shrink-0 text-foreground-tertiary" strokeWidth={1.6} />
        {noOrphan("One spec per version, from 0.1 to 0.9.")}
      </p>
    </div>
  );
}

// ── Releases ──────────────────────────────────────────────────────────────────
// Git tags, local time (PDT). The timer started at 15:27 on Sep 13 (the menu-bar
// countdown in the build recording) and ran out about 18:28. Grouped as the deck
// groups them (slide 08: the three-hour build, ready for other people, fixes
// from daily use), with the release candidate after. v0.7 (the rename) folds
// into v0.7.1, and the other patch releases are left out; each line is what the
// version's spec or the CHANGELOG says it added.
type Release = { tag: string; when: string; scope: string };
type Phase = { title: string; releases: Release[] };
const phases: Phase[] = [
  {
    title: "The three-hour build, Sep 13",
    releases: [
      { tag: "v0.1", when: "17:07", scope: "The pointing flow: a hotkey, a click, a payload" },
      { tag: "v0.2-region", when: "17:17", scope: "The ladder: a drawn frame, text, and neighbors" },
      { tag: "v0.3", when: "17:45", scope: "Usable by someone else: mode inferred, Settings, the ball" },
      { tag: "v0.3-actions", when: "17:58", scope: "Snap, Text, Color, Cut, and the ring" },
      { tag: "v0.4", when: "18:08", scope: "Before and after, found again by identifier" },
    ],
  },
  {
    title: "Ready for other people, Sep 14 to 15",
    releases: [
      { tag: "v0.5", when: "Sep 14", scope: "The first minute: hints that appear once and fade" },
      { tag: "v0.6", when: "Sep 14", scope: "A download that works, and a daily update check" },
      { tag: "v0.7.1", when: "Sep 15", scope: "Renamed Locant, and an MCP server inside the app" },
    ],
  },
  {
    title: "Fixes from daily use, Sep 16 to 21",
    releases: [
      { tag: "v0.8", when: "Sep 16", scope: "Web pages carry their DOM handles, and Shift picks several elements" },
      { tag: "v0.8.1", when: "Sep 21", scope: "Paste into your agent, trackpad taps, and sounds" },
    ],
  },
  {
    title: "The release candidate, Sep 29 to Oct 1",
    releases: [
      { tag: "v0.9.0", when: "Sep 29", scope: "Homebrew, diagnostics, and CI, for Macs that are not mine" },
      { tag: "v0.9.1", when: "Oct 1", scope: "Xcode 27's Device Hub, and one sentence under the Project line" },
      { tag: "v0.9.2", when: "Oct 1", scope: "A paste arrives whole, and the ball rests beside the Dock" },
    ],
  },
];

function ReleaseList({ phase }: { phase: Phase }) {
  return (
    <div className="flex flex-col gap-5 bg-surface-inset px-6 py-7 md:px-7 md:py-8">
      <p className={EYEBROW}>{phase.title}</p>
      <ol aria-label={phase.title} className="flex flex-col gap-4">
        {phase.releases.map((r) => (
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-case-study-module-divider">
        {phases.map((p) => (
          <ReleaseList key={p.title} phase={p} />
        ))}
      </div>
    </ModuleCard>
  );
}

// ── The worktree test: setup ──────────────────────────────────────────────────
// docs/video/11-measurement-worktrees.md, section 1, in the deck's words (slide
// 12, step 0). Apple's Food Truck sample in three checkouts: the redesign that
// built the app on screen for T1 to T4, the session worktree every agent ran in
// (main without the redesign, on screen only for T5), and the main checkout.
const checkouts = [
  { name: "order-cards-redesign", role: "Built the app on screen.", when: "Tasks 1 to 4", onScreen: true },
  { name: "session-7c1d", role: "Where every agent runs.", when: "On screen only in task 5, the control" },
  { name: "main checkout", role: "Not on screen.", when: "Any change here is in the wrong place" },
];
export const TEST_QUESTION = "Does the agent change the code on screen, or a look-alike in its own copy?";

export function LocantTestSetup() {
  return (
    <ModuleCard>
      <ul aria-label="The three checkouts" className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-case-study-module-divider">
        {checkouts.map((c) => (
          <li
            key={c.name}
            data-checkout={c.name}
            data-on-screen={c.onScreen ? "true" : undefined}
            className={`flex flex-col gap-2 px-6 py-6 md:px-7 md:py-7 ${c.onScreen ? "bg-case-study-module-divider" : "bg-surface-inset"}`}
          >
            <p className={`font-mono text-sm md:text-base [overflow-wrap:anywhere] ${c.onScreen ? "text-foreground" : "text-foreground-lead"}`}>{c.name}</p>
            <p className="text-base md:text-xl font-normal leading-snug text-foreground-lead">{c.role}</p>
            <p className="mt-auto pt-3 text-sm font-light leading-relaxed text-foreground-tertiary">{noOrphan(c.when)}</p>
          </li>
        ))}
      </ul>
      <p className="border-t border-case-study-module-divider px-6 py-5 md:px-8 md:py-6 text-base md:text-xl font-normal leading-relaxed text-foreground">
        {noOrphan(TEST_QUESTION)}
      </p>
    </ModuleCard>
  );
}

// ── The fix ───────────────────────────────────────────────────────────────────
// The sentence is MarkdownBuilder.projectAdvice, verbatim, shipped in 0.9.1. The
// Project line is the one the round-two agents received for T3, the look-alike
// task (measure/v8/captures/T3.md). The capture's App line carries Device Hub's
// window title, en dash and all, so the excerpt starts at the Project line.
export const PROJECT_ADVICE =
  "The app on screen was built from this folder. If you are working in a different checkout of this repo (another worktree or clone), your copy is not the code on screen: change it in this folder, or ask which copy to change.";
const FIX_PROJECT_LINE = "Project: /Users/malik/Documents/food-truck-lab/.claude/worktrees/order-cards-redesign-4f2a";

export function LocantFix() {
  return (
    <ModuleCard>
      <div className="flex flex-col gap-4 px-6 py-6 md:px-8 md:py-7 font-mono text-caption md:text-sm leading-relaxed [overflow-wrap:anywhere]">
        <p className="text-foreground-secondary">{FIX_PROJECT_LINE}</p>
        <div className="border-l-2 border-foreground pl-4">
          <p className="mb-1.5 text-label uppercase tracking-eyebrow text-foreground-tertiary">Added in 0.9.1</p>
          <p className="text-foreground">{PROJECT_ADVICE}</p>
        </div>
      </div>
      <p className="border-t border-case-study-module-divider px-6 py-5 md:px-8 md:py-6 text-sm md:text-base font-light leading-relaxed text-foreground-secondary">
        {noOrphan("From the capture for task 3, the look-alike, as round two's agents received it.")}
      </p>
    </ModuleCard>
  );
}

// ── Measured ──────────────────────────────────────────────────────────────────
// Round two (v8, Locant with the fix, Oct 1), recomputed from measure/v8/
// results.tsv with the report's own stats.load: time to the first change in the
// right file, medians of the runs that got there, 79.75 s (16 runs) and 38.55 s
// (20); a wrong copy changed at any point, 14 and 0; right with no reply, 4 and
// 19; cost per run, medians, $1.258 and $0.549 (totals $22.54 and $10.95 for 20
// runs). Each tile draws its own scale: counts out of 20, time and cost against
// the screenshot side's value.
const REPORT_URL = "https://github.com/Malik1942/locant/blob/main/docs/video/11-measurement-worktrees.md";
type Side = { value: string; share: number };
type Tile = { label: string; figure: string; shot: Side; locant: Side };
// A count or a value with its unit never splits across lines ("17 / of 18" and
// "39 / s." both happened in a quarter-width tile), so those spaces are no-break.
const measuredTiles: Tile[] = [
  { label: "Time to the right file", figure: "39 s", shot: { value: "80 s", share: 1 }, locant: { value: "39 s", share: 38.55 / 79.75 } },
  { label: "Changed a wrong copy", figure: "0 of 20", shot: { value: "14 of 20", share: 14 / 20 }, locant: { value: "0 of 20", share: 0 } },
  { label: "Right with no reply", figure: "19 of 20", shot: { value: "4 of 20", share: 4 / 20 }, locant: { value: "19 of 20", share: 19 / 20 } },
  { label: "Cost per run", figure: "$0.55", shot: { value: "$1.26", share: 1 }, locant: { value: "$0.55", share: 0.549 / 1.258 } },
];

function SideBar({ side, which }: { side: Side; which: keyof typeof SERIES }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="text-foreground-secondary">{which === "shot" ? "Screenshot" : "Locant"}</span>
        <span className="tabular-nums text-foreground-lead">{side.value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-foreground/10">
        <div className={`h-full rounded-full ${SERIES[which].bar}`} style={{ width: `${Math.round(side.share * 1000) / 10}%` }} />
      </div>
    </div>
  );
}

export function LocantMeasured() {
  return (
    <div className="rounded-2xl overflow-hidden bg-surface-inset border border-case-study-module-border">
      <div className="px-6 pt-6 md:px-7 md:pt-7">
        <Legend />
      </div>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px border-t border-case-study-module-divider bg-case-study-module-divider">
        {measuredTiles.map((t) => (
          <div key={t.label} data-tile={t.label} className="flex flex-col gap-4 bg-surface-inset px-6 py-6 md:px-7 md:py-8">
            <p className="text-caption font-mono uppercase tracking-eyebrow text-foreground-tertiary">{t.label}</p>
            <p className="text-title md:text-heading font-light leading-none tracking-tight tabular-nums text-foreground">{t.figure}</p>
            <div className="mt-2 flex flex-col gap-3">
              <SideBar side={t.shot} which="shot" />
              <SideBar side={t.locant} which="locant" />
            </div>
          </div>
        ))}
      </div>
      <p className="px-6 py-6 md:px-7 md:py-7 border-t border-case-study-module-divider text-sm md:text-base font-light leading-relaxed text-foreground-secondary">
        Medians for time and cost; time counts the runs that reached the right file. Claude Code on Opus 5 at medium effort, a fresh session per run, no
        MCP on either side, every checkout reset between runs, the order alternated, graded blind. The fix came from these five tasks, so it still has to
        hold on new ones.{" "}
        <a
          href={REPORT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground-lead underline underline-offset-4 transition-colors duration-fast ease-settle hover:text-foreground"
        >
          Method, both rounds, and statistics
        </a>
      </p>
    </div>
  );
}

// ── All 20 pairs ──────────────────────────────────────────────────────────────
// The deck's slide 12, step 6: round two, task by task. Each pair is one task run
// both ways; the value is time to the first change in the right file, in agent
// seconds (stats.load: the reply's session is added after the first one ends).
// Null means the run never got there: all four T3 screenshot runs, which changed
// the look-alike in the agent's own copy and never noticed. Pair numbers are the
// run order, alternated (Locant first in pairs 1 to 5 and 16 to 20).
type Pair = { task: string; pair: number; shot: number | null; locant: number };
export const PAIR_TASKS = [
  { id: "T1", name: "Order pill" },
  { id: "T2", name: "Header badge" },
  { id: "T3", name: "Flavor bars" },
  { id: "T4", name: "Summary banner" },
  { id: "T5", name: "Control, the agent's own build" },
];
export const PAIRS: Pair[] = [
  { task: "T1", pair: 1, shot: 101.1, locant: 37.7 },
  { task: "T1", pair: 6, shot: 114.7, locant: 38.1 },
  { task: "T1", pair: 11, shot: 111.1, locant: 69.1 },
  { task: "T1", pair: 16, shot: 96.2, locant: 42.0 },
  { task: "T2", pair: 2, shot: 73.2, locant: 26.9 },
  { task: "T2", pair: 7, shot: 84.9, locant: 59.3 },
  { task: "T2", pair: 12, shot: 67.1, locant: 28.4 },
  { task: "T2", pair: 17, shot: 90.4, locant: 48.4 },
  { task: "T3", pair: 3, shot: null, locant: 43.5 },
  { task: "T3", pair: 8, shot: null, locant: 47.4 },
  { task: "T3", pair: 13, shot: null, locant: 50.7 },
  { task: "T3", pair: 18, shot: null, locant: 44.4 },
  { task: "T4", pair: 4, shot: 141.8, locant: 39.0 },
  { task: "T4", pair: 9, shot: 104.2, locant: 35.2 },
  { task: "T4", pair: 14, shot: 65.6, locant: 36.1 },
  { task: "T4", pair: 19, shot: 74.6, locant: 41.5 },
  { task: "T5", pair: 5, shot: 31.1, locant: 32.1 },
  { task: "T5", pair: 10, shot: 32.8, locant: 38.0 },
  { task: "T5", pair: 15, shot: 36.5, locant: 29.2 },
  { task: "T5", pair: 20, shot: 30.4, locant: 34.6 },
];
// The scale runs 0 to 150 s across most of the track; "never" sits past its end.
const AXIS_MAX = 150;
const SCALE = 0.86;
const NEVER = 0.95;
const TICKS = [0, 30, 60, 90, 120, 150];
const xOf = (t: number | null) => (t === null ? NEVER : (t / AXIS_MAX) * SCALE);
const pct = (x: number) => `${Math.round(x * 10000) / 100}%`;
const secs = (t: number | null) => (t === null ? "never" : `${Math.round(t)} s`);
const PAIR_COLS = "grid-cols-1 md:grid-cols-[11rem_minmax(0,1fr)]";

function PairRow({ p }: { p: Pair }) {
  const shotX = xOf(p.shot);
  const locantX = xOf(p.locant);
  const lo = Math.min(shotX, locantX);
  const hi = Math.max(shotX, locantX);
  return (
    <div className="relative h-5" title={`Pair ${p.pair}: Locant ${secs(p.locant)}, screenshot ${secs(p.shot)}`}>
      <span className="absolute top-1/2 h-px -translate-y-1/2 bg-foreground/20" style={{ left: pct(lo), width: pct(hi - lo) }} />
      {p.shot === null ? (
        <span
          className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground-tertiary bg-surface-inset"
          style={{ left: pct(shotX) }}
        />
      ) : (
        <span
          className={`absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-surface-inset ${SERIES.shot.dot}`}
          style={{ left: pct(shotX) }}
        />
      )}
      <span
        className={`absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-surface-inset ${SERIES.locant.dot}`}
        style={{ left: pct(locantX) }}
      />
    </div>
  );
}

function Gridlines() {
  return (
    <>
      {TICKS.map((t) => (
        <span key={t} aria-hidden="true" className="absolute inset-y-0 w-px bg-case-study-module-divider" style={{ left: pct(xOf(t)) }} />
      ))}
    </>
  );
}

export function LocantPairs() {
  return (
    <ModuleCard>
      <div className="flex flex-col gap-4 px-6 pt-6 md:flex-row md:items-center md:justify-between md:px-8 md:pt-7">
        <p className={EYEBROW}>Time to the first change in the right file</p>
        <Legend never />
      </div>
      <div aria-hidden="true" className="px-6 pb-6 pt-4 md:px-8 md:pb-7">
        {PAIR_TASKS.map((task) => (
          <div key={task.id} data-task={task.id} className={`grid ${PAIR_COLS} gap-x-6 gap-y-2 border-t border-case-study-module-divider py-3.5 first:border-t-0`}>
            <p className="text-sm text-foreground-lead md:pt-0.5">
              <span className="font-mono text-foreground-tertiary">{task.id}</span> {task.name}
            </p>
            <div className="relative">
              <Gridlines />
              <div className="relative flex flex-col gap-0.5">
                {PAIRS.filter((p) => p.task === task.id).map((p) => (
                  <PairRow key={p.pair} p={p} />
                ))}
              </div>
            </div>
          </div>
        ))}
        <div className={`grid ${PAIR_COLS} gap-x-6`}>
          <span className="hidden md:block" />
          <div className="relative h-5 font-mono text-caption tabular-nums text-foreground-tertiary">
            {TICKS.map((t, i) => (
              <span key={t} className={`absolute top-1 ${i === 0 ? "" : "-translate-x-1/2"}`} style={{ left: pct(xOf(t)) }}>
                {t === 0 ? "0" : `${t} s`}
              </span>
            ))}
            <span className="absolute top-1 -translate-x-1/2" style={{ left: pct(NEVER) }}>
              never
            </span>
          </div>
        </div>
      </div>
      <table className="sr-only">
        <caption>Round two, time to the first change in the right file, in seconds, for each of the 20 pairs</caption>
        <thead>
          <tr>
            <th scope="col">Task</th>
            <th scope="col">Pair</th>
            <th scope="col">Screenshot + prompt</th>
            <th scope="col">Locant capture</th>
          </tr>
        </thead>
        <tbody>
          {PAIRS.map((p) => (
            <tr key={p.pair}>
              <td>{`${p.task}, ${PAIR_TASKS.find((t) => t.id === p.task)?.name}`}</td>
              <td>{p.pair}</td>
              <td>{p.shot === null ? "never reached it" : Math.round(p.shot)}</td>
              <td>{Math.round(p.locant)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ModuleCard>
  );
}

// ── Three calls ───────────────────────────────────────────────────────────────
// The deck's close ("Three calls I'd make again"), in its order and its words,
// with where each call was made in place of the deck's agenda labels.
const calls: GridItem[] = [
  {
    num: "01",
    title: "Cut the MCP server, shipped text plus an image path",
    desc: "Inside the three hours. The pointing was the core; the server could wait, and when it came, it saved one paste.",
    icon: Scissors,
    accent: "violet",
  },
  {
    num: "02",
    title: "The element, not the window",
    desc: "Before any code. Two platforms already sent the window, and nothing sent the one element a fix is about.",
    icon: Crosshair,
    accent: "emerald",
  },
  {
    num: "03",
    title: "Removed auto-send after it interrupted a live chat",
    desc: "In daily use. A send cannot be taken back, so Locant pastes and the person sends.",
    icon: Send,
    accent: "slate",
  },
];

export function LocantCalls() {
  return <CardGrid items={calls} colsClass="grid-cols-1 sm:grid-cols-3" />;
}

// ── Links ─────────────────────────────────────────────────────────────────────
// The product site is the one live-product link, so it takes the filled pill.
// The three-minute pitch film joins as a secondary control. It is linked, never
// embedded: its voice-over claims sole authorship, which the copy here does not.
// It is unlisted on YouTube, so the link is the only way to it. Pass filmUrl as
// null and the button is gone.
const LOCANT_SITE_URL = "https://locant.malikzhang.com";
const LOCANT_GITHUB_URL = "https://github.com/Malik1942/locant";
export const LOCANT_FILM_URL: string | null = "https://www.youtube.com/watch?v=gIjtllxV-gI";

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
