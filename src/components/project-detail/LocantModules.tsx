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
import locantGalleryAgent from "@/assets/locant-gallery-agent.webp";
import locantGalleryVerify from "@/assets/locant-gallery-verify.webp";
import locantGalleryRing from "@/assets/locant-gallery-ring.webp";
import locantGalleryColor from "@/assets/locant-gallery-color.webp";
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

// ── Still grids ───────────────────────────────────────────────────────────────
// Two across from sm, one per row below it, each still captioned. Every still in
// a grid shares one intrinsic size, which reserves its box before it loads and
// keeps the captions of a row on one baseline.
type Still = { src: string; label: string; caption: string; alt: string };

function StillGrid({ stills, width, height }: { stills: Still[]; width: number; height: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10 md:gap-x-8 md:gap-y-12">
      {stills.map((s) => (
        <figure key={s.label} className="flex flex-col">
          <div className="overflow-hidden rounded-2xl bg-secondary/10">
            <img src={s.src} alt={s.alt} width={width} height={height} loading="lazy" decoding="async" className="block h-auto w-full" />
          </div>
          <div className="mt-auto">
            <FigureCaption label={s.label}>{s.caption}</FigureCaption>
          </div>
        </figure>
      ))}
    </div>
  );
}

// ── Highlights ────────────────────────────────────────────────────────────────
// The hero shows the pointing and the clip above this shows the agent's half,
// so the gallery carries the rest of the product: any agent, Before & After,
// the ring, and one of the four actions at work. All four are frames of the v4
// film takes (scenes E2, B, C), cropped to 4:3 around the part that matters.
const highlights = [
  "The element, not a screenshot",
  "Any Mac app, any agent",
  "Asked which orb: 0 of 12 runs",
  "v0.1 to v0.4 in three hours",
];

const gallery: Still[] = [
  {
    src: locantGalleryAgent,
    label: "Any agent",
    caption: "the same payload, pasted into Claude Code",
    alt: "Claude Code in a terminal with a Locant capture pasted in: the image path, the Product Ideas button with its identifier, its frame and path, and the note",
  },
  {
    src: locantGalleryVerify,
    label: "Before & After",
    caption: "the orb found again, with the diff beneath",
    alt: "The Before & After window: the note and identifier at the top, a slider dividing the orb before and after the edit, and 1 file changed, 28 insertions, 1 deletion beneath",
  },
  {
    src: locantGalleryRing,
    label: "The ring",
    caption: "four more actions on the same gesture",
    alt: "The ring open over Cursor's chat, with Snap, Text, Color, and Cut around the pointing hand",
  },
  {
    src: locantGalleryColor,
    label: "Color",
    caption: "a magnifier on the pixel, and the value copied",
    alt: "The Color magnifier over the Oryne Ocean screen: a grid of enlarged pixels with the picked value beneath it",
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
          {noOrphan("Claude Code, given a screenshot")}
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
// A table cell is too narrow for noOrphan's five-word floor: a three-word note
// still left its last word alone at 1440px ("Clipboard and / MCP"). The last
// pair is glued whatever the length, and overflow-wrap is the floor under it.
const glueLastPair = (text: string) => text.replace(/\s+(\S+)$/, "\u00a0$1");

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
      { held: "yes", note: "Mac\u00a0apps, the Simulator" },
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
            {l.text || "\u00a0"}
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
// A count or a value with its unit never splits across lines ("17 / of 18" and
// "39 / s." both happened in a quarter-width tile), so those spaces are no-break.
const measuredTiles = [
  { label: "Asked which orb", figure: "0\u00a0of\u00a012", detail: "With a screenshot, 17\u00a0of\u00a018" },
  { label: "Time to the edit", figure: "22\u00a0s", detail: "With a screenshot, 39\u00a0s. Medians, no build" },
  { label: "Session tokens", figure: "253k", detail: "With a screenshot, 312k. Medians, no build" },
  { label: "Correct edit", figure: "30\u00a0of\u00a030", detail: "Every run on both sides, once the question was answered" },
];

export function LocantMeasured() {
  return (
    <div className="rounded-2xl overflow-hidden bg-surface-inset border border-case-study-module-border">
      <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-case-study-module-divider [&>*:nth-child(odd)]:border-r md:[&>*:nth-child(odd)]:border-r-0 [&>*:nth-child(-n+2)]:border-t-0">
        {measuredTiles.map((t) => (
          <div key={t.label} className="flex flex-col gap-3 px-6 py-6 md:px-7 md:py-8 border-case-study-module-divider">
            <p className="text-caption font-mono uppercase tracking-eyebrow text-foreground-tertiary">{t.label}</p>
            <p className="text-title md:text-heading font-light leading-none tracking-tight tabular-nums text-foreground">{t.figure}</p>
            <p className="text-sm md:text-base font-light text-foreground-secondary leading-relaxed">{noOrphan(t.detail)}</p>
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
