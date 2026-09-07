import type { ComponentType, ReactNode } from "react";
import { noOrphan } from "@/lib/noOrphan";
import { FigureCaption } from "./FigureCaption";
import { ChatGptMark, MotionMark, NotionMark, SunsamaMark, TodoistMark } from "./motiBrandMarks";
import {
  Inbox,
  Split,
  Compass,
  Mic,
  CalendarClock,
  RefreshCw,
  Gauge,
  Target,
  HeartHandshake,
  Ruler,
  Cpu,
  Brain,
  Rocket,
  ArrowUpRight,
  ArrowRight,
  Ban,
  Camera,
  Check,
  Minus,
  type LucideIcon,
} from "lucide-react";
import motiVoice from "@/assets/moti-voice.webp";
import motiTimelineV1 from "@/assets/moti-timelinev1.webp";
import motiTimelineV2 from "@/assets/moti-timeline-v2.webp";
import motiSlm from "@/assets/moti-slm.webp";
import motiLlm from "@/assets/moti-llm.webp";
import motiIntelligenceModes from "@/assets/moti-intelligence-modes.webp";
import motiLlmPlan1 from "@/assets/moti-llm-plan1.webp";
import motiLlmPlan2 from "@/assets/moti-llm-plan2.webp";
import motiCapture from "@/assets/moti-capture.webp";
import motiReview from "@/assets/moti-review.webp";
import motiCheckin from "@/assets/moti-checkin.webp";
import motiProjects from "@/assets/moti-projects.webp";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";

/* ---------------------------------------------------------------------------
 * Moti case-study inline modules.
 * Reuses the existing token-backed inline-module visual language (dark cards, mono
 * 01/02 numbers, lucide icons, violet/emerald/slate module-accent tokens) and site
 * tokens for prose-level pieces — no unmanaged colors or fonts are introduced.
 * Images are imported from src/assets (moti-*.webp).
 *
 * The shells below (ModuleCard, CardGrid, Chips, PullQuote, SCREEN_FIGURE_WIDTH,
 * GridItem, ArtifactItem) are the shared base for OryneModules and
 * RangerHighlights as well. Changing their signatures breaks those pages.
 * ------------------------------------------------------------------------- */

// Ink is set with the ladder (text-foreground, -lead, -secondary, -tertiary,
// -quiet), never as a raw opacity: Tailwind only generates modifiers on its own
// scale, so an off-scale step produced no rule and rendered at full strength.
// src/design-system/boundary.test.ts fails the raw form. On the module surface
// secondary (72%) reads at 8.3:1 and lead (85%) at 11.4:1. Tertiary (55%) is
// kept off the 12px labels in here, which sit on a dark card: 5.2:1 there.
//
// Module accent rotation: three token-backed hues differentiate grid categories
// (and map semantically where the data has tiers, e.g. Rule-Based/SLM/LLM).
type Accent = "violet" | "emerald" | "slate";
const accentColor: Record<Accent, { icon: string; num: string }> = {
  violet: { icon: "text-accent-violet", num: "text-accent-violet/60" },
  emerald: { icon: "text-accent-emerald", num: "text-accent-emerald/60" },
  slate: { icon: "text-accent-slate", num: "text-accent-slate/50" },
};

export type GridItem = { num: string; title: string; desc?: string; icon: LucideIcon; accent: Accent };

// Shared dark card shell — mirrors AuraDesignRequirements / AuraTestingFindings.
export function ModuleCard({ children, header }: { children: ReactNode; header?: string }) {
  return (
    <div className="rounded-2xl overflow-hidden bg-surface-inset border border-case-study-module-border">
      {header ? (
        <div className="px-8 pt-8 pb-7 md:px-10 border-b border-case-study-module-divider">
          <p className="text-caption md:text-xl uppercase tracking-eyebrow font-light leading-relaxed text-foreground font-mono">
            {header}
          </p>
        </div>
      ) : null}
      {children}
    </div>
  );
}

// number + icon + title + optional desc cell grid (the core Aura card pattern).
// gap-px over a white/[0.05] background renders crisp 1px dividers for any layout.
export function CardGrid({ items, header, colsClass }: { items: GridItem[]; header?: string; colsClass: string }) {
  return (
    <ModuleCard header={header}>
      <div className={`grid ${colsClass} gap-px bg-case-study-module-divider`}>
        {items.map((it) => {
          const a = accentColor[it.accent];
          const Icon = it.icon;
          return (
            <div key={it.num} className="flex flex-col gap-5 bg-surface-inset px-6 py-7 md:px-7 md:py-8">
              <div className="flex items-center justify-between">
                <span className={`text-caption font-mono tabular-nums ${a.num}`}>{it.num}</span>
                <Icon aria-hidden="true" className={`w-4 h-4 ${a.icon}`} strokeWidth={1.4} />
              </div>
              <div className="flex flex-col gap-2.5">
                {/* noOrphan glues the last two words with a non-breaking space, which
                    makes them one unbreakable token. In a 3-across grid that token can
                    be wider than the cell and bleeds out of it (measured worst at
                    1024px). overflow-wrap:anywhere is the floor: keep titles short
                    enough that it never fires, and it catches the case if one grows. */}
                <p className="text-base md:text-xl font-medium text-foreground leading-normal md:leading-snug tracking-tight [overflow-wrap:anywhere]">
                  {noOrphan(it.title)}
                </p>
                {it.desc ? (
                  <p className="text-sm md:text-base font-light text-foreground-secondary leading-relaxed [overflow-wrap:anywhere]">
                    {noOrphan(it.desc)}
                  </p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </ModuleCard>
  );
}

// Pill chips (tags + highlights): the system's text chip, in lead ink.
export function Chips({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {items.map((c) => (
        <Chip key={c} kind="text" tone="lead">
          {c}
        </Chip>
      ))}
    </div>
  );
}

// Pull-quote — reuses the display font + foreground tokens.
export function PullQuote({ children }: { children: ReactNode }) {
  // Every caller passes a plain string; guard the type since children is
  // typed as ReactNode. noOrphan is a no-op on text that already wraps fine.
  // `text-wrap: pretty`, not the page's `balance`: a balanced two-line quote
  // splits into two half-width lines and leaves the right half of the reading
  // column empty. Pretty fills the first line and only guards the last one.
  return (
    <blockquote className="border-l-2 border-foreground/20 pl-6 md:pl-8">
      <p className="text-xl md:text-title font-light leading-snug tracking-tight text-foreground [text-wrap:pretty]">
        {typeof children === "string" ? noOrphan(children) : children}
      </p>
    </blockquote>
  );
}

// Single image + caption. Reuses the SectionFigure container styling and the
// shared FigureCaption ("Label — what you are looking at").
// Every phone screen on a case study renders at this one width, whether it sits
// alone under a grid, in a pair, or in a gallery. It is the width a two-column
// gallery cell measures on the reading width, so pairs fill their cells and a
// single screen matches them. Landscape figures (diagrams, boards) omit `screen`
// and take the full reading width instead.
export const SCREEN_FIGURE_WIDTH = "mx-auto w-full max-w-[400px]";
export type ArtifactItem = { src: string; alt: string; caption: string; label?: string };
export function MotiFigure({ src, alt, caption, label, screen }: ArtifactItem & { screen?: boolean }) {
  return (
    <figure className={screen ? SCREEN_FIGURE_WIDTH : undefined}>
      <div className="overflow-hidden rounded-2xl bg-secondary/10">
        <img src={src} alt={alt} loading="lazy" decoding="async" className="w-full h-auto block" />
      </div>
      <FigureCaption label={label}>{caption}</FigureCaption>
    </figure>
  );
}

// App Store CTA — the one live-product link on the page, so it gets the strongest
// affordance in the token set: filled foreground pill, centered in its own row.
// It renders twice, at the overview and at the close, so the label is a prop:
// two identical buttons read as one repeated element rather than as an opening
// and a closing invitation. Same pattern as OryneModules' AppStoreLink.
const MOTI_APP_STORE_URL = "https://apps.apple.com/us/app/moti-plan/id6770705491";
export function MotiAppStoreCta({ label = "View on the App Store" }: { label?: string }) {
  return (
    <div className="flex justify-center">
      <Button href={MOTI_APP_STORE_URL} external icon={<ArrowUpRight strokeWidth={1.8} />}>
        {label}
      </Button>
    </div>
  );
}
export function MotiAppStoreCtaClose() {
  return <MotiAppStoreCta label="Get Moti: Plan on the App Store" />;
}

/* ── 1) Overview — tags ──────────────────────────────────────────────────── */
const tags = ["Main Project", "AI-Native UX", "iOS", "Built & Shipped"];
export function MotiTags() {
  return <Chips items={tags} />;
}

/* ── 2) Hook — chips + pull-quote (the reel sits above, as a figure) ─────── */
// The reel is the section's own figure, declared on the `highlights` section in
// projectDetails.ts and placed by its [[fig:0]] ref above this module, the same
// treatment the Oryne film gets. The 2x2 ArtifactGallery that used to sit here
// is gone. Three of its four images (voice capture, the timeline, the slipping
// warning) become beats in How Moti Works, where they carry the loop instead of
// decorating it; the fourth was the app icon, which has no beat and no reuse.
// Showing the same screens in two places is the duplication this restructure
// exists to remove.
// The chips are the five design decisions that define Moti, in story order, each
// traceable to the section that makes it: understanding gets its own model
// (Intelligence), asks instead of guessing (beat 02), every proposal can be refused
// (beats 03, 04, 07 and the grid quote), pace not counts (Principles row 04, beats
// 05 and 06), three tiers and you pick which runs (Settings). They used to carry
// credentials, which the meta cards, the button and Build Journey already state.
const hookHighlights = [
  "Understanding gets its own model",
  "Asks instead of guessing",
  "Every proposal can be refused",
  "Pace, not task counts",
  "Three tiers, and you pick which runs",
];
// Two surfaces the seven beats do not carry: the Projects tab, and the typed way
// in (beat 01 shows the spoken one). Recaptured in dark mode from the shipped 2.0
// build, so nothing here comes from the product film.
type Surface = { src: string; alt: string; label: string; caption: string };
const surfaces: Surface[] = [
  {
    src: motiProjects,
    alt: "The Projects tab listing Move, Launch, Parents, Fitness and Reading with their active counts and next dates",
    label: "Projects",
    caption: "every project with its active count, its next date, and how far it has run",
  },
  {
    src: motiCapture,
    alt: "The Add to Timeline sheet holding a lowercase, unpunctuated sentence, with Submit enabled and a mic button",
    label: "Add to Timeline",
    caption: "lowercase, unpunctuated, exactly as you would say it, and Submit is the only next step",
  },
];
export function MotiHook() {
  return (
    <div className="flex flex-col gap-stack">
      <Chips items={hookHighlights} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-9 md:gap-x-8 md:gap-y-12">
        {surfaces.map((f) => (
          <figure key={f.src} className={`${SCREEN_FIGURE_WIDTH} flex flex-col`}>
            <div className="overflow-hidden rounded-2xl bg-secondary/10">
              <img src={f.src} alt={f.alt} loading="lazy" decoding="async" className="w-full h-auto block" />
            </div>
            {/* mt-auto: captions of unequal length still sit on one baseline per row. */}
            <div className="mt-auto">
              <FigureCaption label={f.label}>{f.caption}</FigureCaption>
            </div>
          </figure>
        ))}
      </div>
      <PullQuote>The problem wasn&rsquo;t planning. It was understanding.</PullQuote>
    </div>
  );
}

/* ── 3) The Problem — three stages of one failure ────────────────────────── */
// Not three separate problems. The 01/02/03 order is the causal chain: input
// arrives (01), nothing reads it against anything else (02), so the list is
// unactionable (03). Card 02 is the stage the product attacks and the one the
// section's closing line singles out, so it has to stay about the missing
// understanding step. It must not become a second scatter card, which would
// duplicate 01 and leave the close with nothing in the module to point at.
// Card 01's vocabulary is the HUMAN INPUT column of moti-slm.webp.
// CardGrid runs noOrphan on every title and desc, so no explicit call here.
const problemPillars: GridItem[] = [
  { num: "01", title: "Overwhelming Inputs", desc: "Thoughts, deadlines, and half-formed ideas, all landing on the same day.", icon: Inbox, accent: "violet" },
  { num: "02", title: "Fragmented Thinking", desc: "Nothing reads them together, so each one stays a loose end.", icon: Split, accent: "emerald" },
  { num: "03", title: "Unclear Action", desc: "The list is full, and the next move is still a guess.", icon: Compass, accent: "slate" },
];
export function MotiProblem() {
  return <CardGrid items={problemPillars} colsClass="grid-cols-1 sm:grid-cols-3" />;
}

/* ── 4) Competitive Analysis — strength / gap rows ───────────────────────── */
const competitors = [
  { name: "Todoist", strength: "Great for capture", gap: "Doesn’t plan for you" },
  { name: "Motion", strength: "AI scheduling", gap: "Can feel rigid" },
  { name: "Sunsama", strength: "Intentional daily planning", gap: "Requires discipline" },
  { name: "Notion", strength: "Flexible and powerful", gap: "Heavy setup" },
  { name: "ChatGPT", strength: "Flexible thinking", gap: "Not timeline-aware" },
] as const;
type Competitor = (typeof competitors)[number]["name"];
const competitorMarks: Record<Competitor, ComponentType<{ className?: string }>> = {
  Todoist: TodoistMark,
  Motion: MotionMark,
  Sunsama: SunsamaMark,
  Notion: NotionMark,
  ChatGPT: ChatGptMark,
};
export function MotiCompetitive() {
  return (
    <ModuleCard>
      <div className="divide-y divide-case-study-module-divider">
        {competitors.map((c) => (
          <div key={c.name} className="grid grid-cols-1 md:grid-cols-[1fr_2fr_2fr] gap-2 md:gap-6 px-6 py-5 md:px-8 md:py-6">
            <p className="text-sm md:text-base font-medium text-foreground">{c.name}</p>
            <div className="flex items-start gap-2.5">
              <Check aria-hidden="true" className="w-4 h-4 mt-0.5 shrink-0 text-success" strokeWidth={1.6} />
              <p className="text-sm font-normal text-foreground-lead">{c.strength}</p>
            </div>
            <div className="flex items-start gap-2.5">
              <Minus aria-hidden="true" className="w-4 h-4 mt-0.5 shrink-0 text-foreground-secondary" strokeWidth={1.6} />
              <p className="text-sm font-normal text-foreground-secondary">{c.gap}</p>
            </div>
          </div>
        ))}
      </div>
    </ModuleCard>
  );
}

/* ── 5) From Frustrations to Principles — the derivation, made visible ───── */
// Six paired rows: the frustration on one side, the rule it produced on the
// other, and the thing that rule ruled out. The two lists used to sit in
// separate sections with nothing on the page saying they map one to one, which
// is the whole reason they were merged. Each quote keeps the brand mark of the
// competitor whose gap (above) it voices; Todoist carries two, since manual
// entry is the whole interaction and capture alone leaves a pile of tasks.
//
// Every `ruledOut` clause states a decision, so each one is written to something
// a captured screen can back up, and each is deliberately narrower than a claim
// about the whole app. Row 03 in particular says nothing about an inbox: the tab
// bar on every captured screen carries a Review tab with an inbox-tray icon, so
// "no inbox" would be contradicted by the shipped app. What the screens do
// support is where the sorting happens, which is at capture.
//
// One thing the reel does NOT establish: how many of the items on its closing
// Timeline came from the dictated sentence. At 0.4s, before the sheet is even
// open, the Timeline already holds six items across Home, Portfolio and Aurora.
// The sentence adds two visible ones, Case study and Portfolio review. So no row
// here claims that one sentence produced a board.
type PrincipleRow = {
  num: string;
  quote: string;
  product: Competitor;
  title: string;
  desc: string;
  ruledOut: string;
  icon: LucideIcon;
  accent: Accent;
};
const principleRows: PrincipleRow[] = [
  {
    num: "01",
    quote: "Entering tasks is so annoying.",
    product: "Todoist",
    title: "Natural Input",
    desc: "You say the sentence you were already thinking. Moti does the structuring.",
    ruledOut: "A structured entry form as the way in.",
    icon: Mic,
    accent: "violet",
  },
  {
    num: "02",
    quote: "It’s hard to change plans when things change.",
    product: "Motion",
    title: "Adaptive Timelines",
    desc: "When something changes, the plan you already have shifts to absorb it.",
    ruledOut: "Regenerating the plan from scratch.",
    icon: CalendarClock,
    accent: "emerald",
  },
  {
    num: "03",
    quote: "I spend more time organizing than doing.",
    product: "Notion",
    title: "Living Plans",
    desc: "The sorting happens when the work is captured, not in a session you set aside for it.",
    ruledOut: "Sorting the work yourself before the timeline is usable.",
    icon: RefreshCw,
    accent: "slate",
  },
  {
    num: "04",
    quote: "I end up with more tasks, not more clarity.",
    product: "Todoist",
    title: "Momentum Tracking",
    desc: "Work shows how far along it is, and the timeline shows where the pace is heading.",
    ruledOut: "Progress measured by how many tasks are left.",
    icon: Gauge,
    accent: "violet",
  },
  {
    num: "05",
    quote: "AI suggestions don’t get my timeline or real-world constraints.",
    product: "ChatGPT",
    title: "Context-Aware Planning",
    desc: "The timeline, the open projects and the commitments already made go in before anything is planned.",
    ruledOut: "A suggestion made without the timeline in front of it.",
    icon: Target,
    accent: "emerald",
  },
  {
    num: "06",
    quote: "I just want a plan that adapts to me, not the other way around.",
    product: "Sunsama",
    title: "Human-Centered Planning",
    desc: "Moti proposes. You answer with Add to Timeline, Refine or Dismiss, and one of the three is no.",
    ruledOut: "Anything landing on the timeline without a yes.",
    icon: HeartHandshake,
    accent: "slate",
  },
];

// Fractional and fixed tracks only, no `auto`: every row is its own grid, so the
// columns have to be content-independent for the header and the six rows to line
// up. The middle track is the arrow, which is why it is a fixed 3.5rem.
const PRINCIPLE_COLS = "grid-cols-1 md:grid-cols-[minmax(0,1fr)_3.5rem_minmax(0,1.15fr)]";

export function MotiPrinciples() {
  return (
    <ModuleCard>
      <div className={`hidden md:grid ${PRINCIPLE_COLS} px-8 py-4 border-b border-case-study-module-divider`}>
        <p className="text-label uppercase tracking-eyebrow text-foreground-secondary font-mono">The frustration</p>
        <span aria-hidden="true" />
        <p className="text-label uppercase tracking-eyebrow text-foreground-secondary font-mono">The rule it produced</p>
      </div>
      <div className="divide-y divide-case-study-module-divider">
        {principleRows.map((row) => {
          const a = accentColor[row.accent];
          const Mark = competitorMarks[row.product];
          const Icon = row.icon;
          return (
            <div key={row.num} className={`grid ${PRINCIPLE_COLS} gap-5 md:gap-0 px-6 py-7 md:px-8 md:py-8`}>
              {/* The closing quote mark is an adjacent text node with no space
                  before it, so the pair noOrphan glues carries it along. */}
              <figure className="flex flex-col gap-3 md:justify-center">
                <blockquote className="text-sm md:text-base font-light leading-relaxed text-foreground">
                  “{noOrphan(row.quote)}”
                </blockquote>
                <figcaption className="flex items-center gap-2 text-label uppercase tracking-eyebrow text-foreground-secondary font-mono">
                  <Mark className="w-3.5 h-3.5 shrink-0" />
                  {row.product}
                </figcaption>
              </figure>

              {/* The derivation itself: down the page on one column, across on two.
                  It takes the row's accent so the pair reads as one unit. */}
              <div className="flex items-center justify-start md:justify-center">
                <ArrowRight
                  aria-hidden="true"
                  className={`w-4 h-4 rotate-90 md:rotate-0 ${a.num}`}
                  strokeWidth={1.5}
                />
              </div>

              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className={`text-caption font-mono tabular-nums ${a.num}`}>{row.num}</span>
                  <Icon aria-hidden="true" className={`w-4 h-4 ${a.icon}`} strokeWidth={1.4} />
                </div>
                <p className="text-base md:text-xl font-medium text-foreground leading-normal md:leading-snug tracking-tight">
                  {noOrphan(row.title)}
                </p>
                <p className="text-sm md:text-base font-light text-foreground-secondary leading-relaxed">
                  {noOrphan(row.desc)}
                </p>
                <div className="mt-1.5 flex items-start gap-2.5">
                  <Ban aria-hidden="true" className="mt-[0.3em] h-3.5 w-3.5 shrink-0 text-foreground-secondary" strokeWidth={1.6} />
                  <p className="text-sm font-normal leading-relaxed text-foreground-secondary">
                    <span className="text-label uppercase tracking-eyebrow font-mono">Ruled out:</span>{" "}
                    {noOrphan(row.ruledOut)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ModuleCard>
  );
}

/* ── 6) How Moti Works — the loop, seven steps ───────────────────────────── */
// The product doing one complete job, in the order it happens. Same construction
// as OryneFlow (ModuleCard, a header carrying a lead, then a two-column grid of
// numbered figure steps), so the two case studies read as one system.
//
// There is no prose in a cell beyond the caption, on purpose. An earlier version
// hung a labelled WHY paragraph under every screen, and it read as the page
// explaining itself. The reasoning now lives in the sequence: each caption says
// what is on screen and what it leaves undecided, and the next step is the answer
// to that. A reader who follows the seven captions in order should know why each
// step exists without being told.
//
// The screens come from more than one session: beats 02 and 03 capture a MOTI v2.1
// sentence, beats 04 and 06 the seeded Move / Launch / Parents / Fitness / Reading
// board, and 01, 05 and 07 a Job Search / Portfolio / Personal one. So nothing here
// claims the reader is following one literal sentence through all seven.
//
// Layout: a cell is number and title (one line), the screen (every asset is
// 1105x2259, so they are all the same height at a given width), then the caption.
// The caption is the last thing in the cell, so its length can vary without moving
// anything, and the phones in a row sit at the same y.
//
// Seven beats leave one slot open in a two-column grid. It takes the module's one
// pull-quote, the way OryneFlow ends an act on a line, so the grid closes on the
// loop's thesis instead of on a blank cell.
//
// `screen` is optional and `PendingScreen` remains as the fallback, so a beat added
// ahead of its capture still renders in the exact box the image will occupy.
type BeatScreen = { src: string; alt: string; label: string; caption: string };
type WorkflowBeat = {
  num: string;
  title: string;
  /** Present once the screen is captured; absent renders the pending slot. */
  screen?: BeatScreen;
  /** What the pending slot is holding a place for. Ignored once `screen` lands. */
  pending?: string;
};

const workflowLead = "Each step picks up what the one before it left undecided.";
const workflowQuote = "A plan you can refuse is a plan you can trust.";

const workflowBeats: WorkflowBeat[] = [
  {
    num: "01",
    title: "Say It",
    screen: {
      src: motiVoice,
      alt: "Moti Voice Capture listening over the Timeline, with a stop button and a Type instead option",
      label: "Voice Capture",
      caption: "the sheet opens already listening, so the cheapest way in is the default one, and what comes in is rough",
    },
  },
  {
    num: "02",
    title: "Ask One Thing",
    screen: {
      src: motiLlmPlan1,
      alt: "Moti Smart Capture showing the captured sentence above a Quick question with four tappable answers",
      label: "Smart Capture",
      caption: "the sentence names a deadline but not a deliverable, so Moti asks one question instead of guessing",
    },
  },
  {
    num: "03",
    title: "Propose, Do Not Commit",
    screen: {
      src: motiLlmPlan2,
      alt: "Moti Smart Capture proposing a task flagged Review suggested, with Add to Timeline, Refine and Dismiss",
      label: "Proposed task",
      caption: "it flags what it inferred, then offers Add to Timeline, Refine or Dismiss, and one of those is no",
    },
  },
  {
    num: "04",
    title: "It Waits for You",
    screen: {
      src: motiReview,
      alt: "The Review inbox holding Live site, Write case study and Portfolio review with Kai, all marked Unassigned, each with a suggested project of Portfolio",
      label: "Review",
      caption: "the pieces it pulled out wait here with a suggested project each, and none of them is on the timeline yet",
    },
  },
  {
    num: "05",
    title: "Work Has a Shape",
    screen: {
      src: motiTimelineV1,
      alt: "The Moti timeline with Job Search, Portfolio and Personal as parallel streams over one date range",
      label: "Timeline",
      caption: "once accepted, work runs as parallel streams with a percentage each, so pace reads at a glance",
    },
  },
  {
    num: "06",
    title: "Check In",
    screen: {
      src: motiCheckin,
      alt: "The Pulse check-in sheet asking how is your pace right now, with Good, Normal and Bad and an optional note field",
      label: "Pulse",
      caption: "a percentage cannot say whether the pace is realistic, so at 25, 50, 75 and 100 percent Moti asks how it feels",
    },
  },
  {
    num: "07",
    title: "It Says When You Are Drifting",
    screen: {
      src: motiTimelineV2,
      alt: "The Moti timeline projecting Personal, Portfolio and Job Search, with a card reading Portfolio is slipping and buttons Make space and Not this week",
      label: "What matters now",
      caption: "the check-ins feed a projection that names what is slipping, and the decision comes back to you: Make space, or Not this week",
    },
  },
];

// The reserved slot. `py-16` is the floor for the degenerate case of two pending
// beats sharing a row.
function PendingScreen({ note }: { note: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-case-study-module-border bg-secondary/10 px-6 py-16 text-center">
      <Camera aria-hidden="true" className="w-5 h-5 text-foreground-quiet" strokeWidth={1.4} />
      <p className="text-label uppercase tracking-eyebrow text-foreground-secondary font-mono">Capture pending</p>
      <p className="text-sm font-light leading-relaxed text-foreground-lead">{noOrphan(note)}</p>
    </div>
  );
}

function WorkflowBeatCell({ beat }: { beat: WorkflowBeat }) {
  const screen = beat.screen;
  return (
    <div className="flex h-full flex-col bg-surface-inset px-6 py-7 md:px-8 md:py-8">
      <div className="flex items-baseline gap-3">
        <span className="text-caption font-mono tabular-nums text-accent-violet/70">{beat.num}</span>
        <p className="text-base md:text-xl font-medium text-foreground">{noOrphan(beat.title)}</p>
      </div>
      <figure className={`${SCREEN_FIGURE_WIDTH} mt-5`}>
        {screen ? (
          <>
            <div className="overflow-hidden rounded-2xl bg-secondary/10">
              <img src={screen.src} alt={screen.alt} loading="lazy" decoding="async" className="w-full h-auto block" />
            </div>
            <FigureCaption label={screen.label}>{screen.caption}</FigureCaption>
          </>
        ) : (
          <PendingScreen note={beat.pending ?? "Screen not yet captured."} />
        )}
      </figure>
    </div>
  );
}

export function MotiWorkflow() {
  const openSlot = workflowBeats.length % 2 === 1;
  return (
    <ModuleCard>
      <div className="px-6 pt-7 pb-6 md:px-8 md:pt-8 md:pb-7 border-b border-case-study-module-divider">
        <p className="text-caption md:text-xl uppercase tracking-eyebrow font-light leading-relaxed text-foreground font-mono">
          Seven Steps, One Loop
        </p>
        <p className="mt-3 text-sm md:text-base font-light leading-relaxed text-foreground-lead max-w-measure">
          {noOrphan(workflowLead)}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-case-study-module-divider">
        {workflowBeats.map((beat) => (
          <WorkflowBeatCell key={beat.num} beat={beat} />
        ))}
        {openSlot ? (
          <div className="flex items-center bg-surface-inset px-6 py-7 md:px-8 md:py-8">
            <PullQuote>{workflowQuote}</PullQuote>
          </div>
        ) : null}
      </div>
    </ModuleCard>
  );
}

/* ── 7) Why Three Kinds of Intelligence ──────────────────────────────────── */
// Sits after the workflow, so the two diagrams explain a loop the reader has
// already watched run. Each tier card carries its own reason, in the card, so the
// section does not need a second block to argue what the first one lists. The
// diagrams are the architecture as specified; the Settings screen is what shipped,
// and its caption says which is which. Nothing here claims a tier runs underneath
// another: Settings shows Active as one exclusive picker.
const tierItems: GridItem[] = [
  { num: "01", title: "Rule-Based", desc: "Dates, checkpoints and timeline math. Computed, never inferred, because a date that is usually right is a bug you cannot see.", icon: Ruler, accent: "slate" },
  { num: "02", title: "Foundational Model · SLM", desc: "Reads the sentence while you are still looking at the screen. Understanding only. It stops before planning.", icon: Cpu, accent: "emerald" },
  { num: "03", title: "LLM", desc: "Weighs a launch against a lease renewal. Judgment across projects, and the one job worth the wait.", icon: Brain, accent: "violet" },
];

export function MotiIntelligence() {
  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <CardGrid items={tierItems} header="Three Tiers, Three Jobs" colsClass="grid-cols-1 sm:grid-cols-3" />
      <MotiFigure
        src={motiSlm}
        alt="Moti stage one: the SLM extracts signals, structures intent, and builds context"
        label="Stage one"
        caption="three columns, and the middle one only understands: extract, structure, build context, then hand off"
      />
      <MotiFigure
        src={motiLlm}
        alt="Moti stage two: the LLM planning layer turns structured context into an adaptive plan"
        label="Stage two"
        caption="the loop under the planning layer is the part that matters: review, refine, adjust, learn"
      />
      <MotiFigure
        src={motiIntelligenceModes}
        alt="Moti Settings with the Intelligence picker open on Foundational Model, Rule-based and LLM, above the Smart Capture API key field"
        label="Settings"
        caption="all three modes ship, the picker decides which one runs, and the LLM key stays in the Keychain on the device"
        screen
      />
    </div>
  );
}

/* ── 8) Build Journey — specified first, then rebuilt twice ──────────────── */
// The spec-first claim lives in the section body as one sentence; the version
// blocks are the record of what that spec could not decide. Each block keeps its
// two load-bearing lines. The App Store outcome is the button that ends the page.
type VersionPoint = { label: string; text: string };
function VersionBlock({ tag, title, subtitle, points }: { tag: string; title: string; subtitle?: string; points: VersionPoint[] }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-case-study-module-border bg-surface-inset">
      <div className="flex items-baseline gap-4 px-6 py-6 md:px-8 md:py-7 border-b border-case-study-module-divider">
        <span className="text-caption font-mono tabular-nums text-accent-violet/70">{tag}</span>
        <div>
          <p className="text-xl font-medium text-foreground leading-snug">{noOrphan(title)}</p>
          {subtitle ? <p className="mt-1 text-caption md:text-sm text-foreground-secondary">{noOrphan(subtitle)}</p> : null}
        </div>
      </div>
      <div className="flex flex-col gap-5 px-6 py-6 md:px-8 md:py-7">
        {points.map((pt) => (
          <div key={pt.label}>
            <p className="text-label uppercase tracking-eyebrow text-foreground-secondary font-mono mb-1.5">{pt.label}</p>
            <p className="text-sm md:text-base font-light leading-relaxed text-foreground-lead">{noOrphan(pt.text)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// SLOT C — RESERVED AND PENDING. Do not delete this empty array as dead code.
// The weakest joint on the page runs from "trust broke under complexity" in V0 to
// the two versions that answer it, and nothing states what caused the change. Malik
// has TestFlight feedback that supplies it and has not given it yet. Fill the array
// and the block appears between V1.1 and the end of the section; leave it empty and
// nothing renders, so the live page never implies evidence that does not exist.
type TestFlightNote = { version: string; observed: string; change: string };
const testFlightNotes: TestFlightNote[] = [];
function MotiTestFlightNotes() {
  if (testFlightNotes.length === 0) return null;
  return (
    <ModuleCard header="What TestFlight Sent Back">
      <div className="divide-y divide-case-study-module-divider">
        {testFlightNotes.map((n) => (
          <div key={n.version + n.observed} className="grid grid-cols-1 md:grid-cols-[5rem_minmax(0,1fr)_minmax(0,1fr)] px-6 py-5 md:px-8 md:py-6">
            <p className="text-caption md:text-sm font-mono tabular-nums text-accent-violet/70">{n.version}</p>
            <p className="mt-2 md:mt-0 md:pl-4 text-sm font-light leading-relaxed text-foreground md:border-l md:border-case-study-module-divider">{noOrphan(n.observed)}</p>
            <p className="mt-2 md:mt-0 md:pl-4 text-sm font-light leading-relaxed text-foreground-lead md:border-l md:border-case-study-module-divider">{noOrphan(n.change)}</p>
          </div>
        ))}
      </div>
    </ModuleCard>
  );
}

export function MotiBuildJourney() {
  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <VersionBlock
        tag="V0"
        title="Rule-Based Prototype"
        subtitle="Testing the core interaction loop"
        points={[
          { label: "What Broke", text: "Trust broke under complexity." },
          { label: "Learning", text: "The interaction model worked. The intelligence layer had to evolve." },
        ]}
      />
      <VersionBlock
        tag="V1"
        title="Foundational Model for Understanding"
        points={[
          { label: "Why Evolve", text: "Temporal blindness, context loss, over-rigid parsing." },
          { label: "Learning", text: "Understanding fidelity is the bottleneck." },
        ]}
      />
      <VersionBlock
        tag="V1.1"
        title="Constraining the Understanding Layer"
        points={[
          { label: "Stance", text: "Not autonomous planning. Reliable understanding." },
          { label: "Shipped", text: "TestFlight with real feedback, then the App Store." },
        ]}
      />
      <MotiTestFlightNotes />
    </div>
  );
}

/* ── 9) What Moti Proved — closing takeaways ─────────────────────────────── */
const takeaways: GridItem[] = [
  { num: "01", title: "A Complete Loop, Shipped End to End", desc: "Capture, clarify, propose, plan, check in. Built with Claude and Codex, live on the App Store.", icon: Rocket, accent: "violet" },
  { num: "02", title: "Understanding Beat Autonomy", desc: "Trust broke in V0. The model got one job, understanding, and the user kept Add, Refine and Dismiss.", icon: Brain, accent: "emerald" },
  { num: "03", title: "A Spec Settles Behavior, Not Trust", desc: "Behavior and interaction were fixed before any code. How far to trust the model took three versions.", icon: Ruler, accent: "slate" },
];
export function MotiTakeaways() {
  return <CardGrid items={takeaways} colsClass="grid-cols-1 sm:grid-cols-3" />;
}
