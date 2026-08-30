import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  MousePointerClick,
  Crosshair,
  MoveVertical,
  Hand,
  AppWindow,
  BatteryLow,
  ListChecks,
  SlidersHorizontal,
  MessageSquareText,
  Timer,
  GitBranch,
  BadgeCheck,
  RefreshCw,
  ShieldCheck,
  Feather,
  ArrowUpRight,
  X,
  Check,
  type LucideIcon,
} from "lucide-react";
import { noOrphan } from "@/lib/noOrphan";

/* ---------------------------------------------------------------------------
 * CalmMouse case-study inline modules.
 * Same token-backed inline-module language as the Inkwork/Aura/Moti modules
 * (dark cards, mono 01/02 numbers, lucide icons, violet/emerald/slate
 * module-accent tokens) — no unmanaged colors or fonts are introduced.
 * ------------------------------------------------------------------------- */

type Accent = "violet" | "emerald" | "slate";
const accentColor: Record<Accent, { icon: string; num: string }> = {
  violet: { icon: "text-accent-violet", num: "text-accent-violet/60" },
  emerald: { icon: "text-accent-emerald", num: "text-accent-emerald/60" },
  slate: { icon: "text-accent-slate", num: "text-accent-slate/50" },
};

type GridItem = { num: string; title: string; desc?: string; icon: LucideIcon; accent: Accent };

// Shared dark card shell — mirrors the Inkwork/Aura/Moti module shells.
function ModuleCard({ children, header }: { children: ReactNode; header?: string }) {
  return (
    <div className="rounded-2xl overflow-hidden bg-surface-inset border border-case-study-module-border">
      {header ? (
        <div className="px-8 pt-8 pb-7 md:px-10 border-b border-case-study-module-divider">
          <p className="text-xs md:text-xl uppercase tracking-eyebrow font-light leading-relaxed text-foreground font-mono">
            {header}
          </p>
        </div>
      ) : null}
      {children}
    </div>
  );
}

// number + icon + title + optional desc cell grid (the core module card pattern).
function CardGrid({ items, header, colsClass }: { items: GridItem[]; header?: string; colsClass: string }) {
  return (
    <ModuleCard header={header}>
      <div className={`grid ${colsClass} gap-px bg-case-study-module-divider`}>
        {items.map((it) => {
          const a = accentColor[it.accent];
          const Icon = it.icon;
          return (
            <div key={it.num} className="flex flex-col gap-5 bg-surface-inset px-6 py-7 md:px-7 md:py-8">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-mono tabular-nums ${a.num}`}>{it.num}</span>
                <Icon aria-hidden="true" className={`w-4 h-4 ${a.icon}`} strokeWidth={1.4} />
              </div>
              <div className="flex flex-col gap-2.5">
                <p className="text-base md:text-xl font-medium text-foreground leading-normal md:leading-snug tracking-tight">
                  {noOrphan(it.title)}
                </p>
                {it.desc ? (
                  <p className="text-sm md:text-base font-light text-foreground/72 leading-relaxed">
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

/* ── 1) Live demo — the page jump, side by side ──────────────────────────────
 * The problem is a motion problem, so it's shown as motion: two mini document
 * panes on a 4s loop. Both receive the same click (expanding ring); the bare
 * mouse's content lurches, CalmMouse's holds still. Honors reduced motion by
 * freezing both panes (the still frame reads as "steady", which is the point).
 */
const DEMO_LOOP = { duration: 4, repeat: Infinity, ease: "easeOut" as const };

function ClickRipple({ className }: { className: string }) {
  const reduced = useReducedMotion();
  return (
    <span className="absolute -left-2 -top-2 h-9 w-9 pointer-events-none" aria-hidden="true">
      {!reduced ? (
        <motion.span
          className={`absolute inset-0 rounded-full border-2 ${className}`}
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: [0.3, 0.3, 1.7, 0.3], opacity: [0, 0.8, 0, 0] }}
          transition={{ ...DEMO_LOOP, times: [0, 0.25, 0.5, 1] }}
        />
      ) : null}
    </span>
  );
}

function DemoPane({ fixed }: { fixed: boolean }) {
  const reduced = useReducedMotion();
  const Badge = fixed ? Check : X;
  const badgeTone = fixed ? "text-accent-emerald" : "text-accent-slate";
  // The bare pane lurches right after the click lands; the fixed pane holds.
  const jump = !fixed && !reduced ? { y: [0, 0, -16, -7, 0] } : { y: 0 };
  return (
    <div className="flex flex-col gap-4 bg-surface-inset px-6 py-7 md:px-7 md:py-8">
      <div className="flex items-center gap-2.5">
        <Badge aria-hidden="true" className={`w-4 h-4 ${badgeTone}`} strokeWidth={1.6} />
        <p className="text-sm md:text-base font-medium text-foreground tracking-tight">
          {fixed ? "With CalmMouse" : "Without"}
        </p>
      </div>
      <div className="relative overflow-hidden rounded-lg border border-case-study-module-divider bg-background/40 px-5 pt-5 h-36">
        <motion.div
          aria-hidden="true"
          className="flex flex-col gap-2.5"
          animate={jump}
          transition={{ ...DEMO_LOOP, times: [0, 0.28, 0.42, 0.62, 0.85] }}
        >
          <div className="h-2 w-3/4 rounded-full bg-foreground/30" />
          <div className="h-2 w-full rounded-full bg-foreground/20" />
          <div className="h-2 w-5/6 rounded-full bg-foreground/20" />
          <div className={`h-2 w-2/5 rounded-full ${fixed ? "bg-accent-emerald/50" : "bg-accent-slate/50"}`} />
          <div className="h-2 w-full rounded-full bg-foreground/20" />
          <div className="h-2 w-2/3 rounded-full bg-foreground/20" />
          <div className="h-2 w-11/12 rounded-full bg-foreground/20" />
        </motion.div>
        <div className="absolute left-[38%] top-[52%]">
          <ClickRipple className={fixed ? "border-accent-emerald" : "border-accent-slate"} />
          <MousePointerClick
            aria-hidden="true"
            className="relative w-5 h-5 text-foreground/85"
            strokeWidth={1.6}
          />
        </div>
      </div>
      <p className="text-sm font-light text-foreground/60 leading-relaxed">
        {fixed
          ? "Same click. The page holds still — the swipe is swallowed."
          : "The click lands, the finger rolls half a millimetre, the page jumps."}
      </p>
    </div>
  );
}

export function CalmMouseDemo() {
  return (
    <ModuleCard header="The same click, twice">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-case-study-module-divider">
        <DemoPane fixed={false} />
        <DemoPane fixed />
      </div>
    </ModuleCard>
  );
}

/* ── 2) The fixes — one checkbox, then the rest of the rough edges ─────────── */
const fixes: GridItem[] = [
  {
    num: "01",
    title: "Block Scroll While Clicked",
    desc: "Swallows Magic Mouse scrolling while a button is down, plus a grace period for the trailing swipe.",
    icon: MousePointerClick,
    accent: "violet",
  },
  {
    num: "02",
    title: "Dead Zone",
    desc: "A gesture must travel before it counts — kills the jitter of a finger just resting on the shell.",
    icon: Crosshair,
    accent: "emerald",
  },
  {
    num: "03",
    title: "Axis Lock",
    desc: "Once a scroll commits to an axis, the other is zeroed. No diagonal drift.",
    icon: MoveVertical,
    accent: "slate",
  },
  {
    num: "04",
    title: "Tap to Click & Drag",
    desc: "Trackpad manners for the mouse: tap, right-tap, tap-and-drag, two-finger drag.",
    icon: Hand,
    accent: "violet",
  },
  {
    num: "05",
    title: "Per-App Rules",
    desc: "Any fix, overridden per application — no Magic Mouse scrolling in Figma at all, if you like.",
    icon: AppWindow,
    accent: "emerald",
  },
  {
    num: "06",
    title: "Battery Warning",
    desc: "A notification before the mouse dies mid-afternoon.",
    icon: BatteryLow,
    accent: "slate",
  },
];
export function CalmMouseFixes() {
  return <CardGrid items={fixes} colsClass="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" />;
}

/* ── 3) Designing for absence — three answers ───────────────────────────────── */
const absence: GridItem[] = [
  {
    num: "01",
    title: "The Tour Keeps Score",
    desc: "First launch has you try the fix live — and counts the accidental scrolls it just caught. The number is the demo.",
    icon: ListChecks,
    accent: "violet",
  },
  {
    num: "02",
    title: "Three Opinions Before Thirteen Settings",
    desc: "Just fix clicking · Extra steady · Trackpad feel. One click each; everything stays tweakable after.",
    icon: SlidersHorizontal,
    accent: "emerald",
  },
  {
    num: "03",
    title: "Plain English, With Proof",
    desc: "“Don't scroll while clicking,” not “Suppress scroll events.” Hover any setting for a little animated preview of what it does.",
    icon: MessageSquareText,
    accent: "slate",
  },
];
export function CalmMouseAbsence() {
  return <CardGrid items={absence} colsClass="grid-cols-1 sm:grid-cols-3" />;
}

/* ── 4) Interaction design in milliseconds ─────────────────────────────────── */
const milliseconds: GridItem[] = [
  {
    num: "01",
    title: "The 200 ms Grace Period",
    desc: "Your finger makes one last swipe as it leaves the shell after a click. Blocking keeps going just long enough to eat it — a number tuned by feel, not spec.",
    icon: Timer,
    accent: "violet",
  },
  {
    num: "02",
    title: "The Deferred Press",
    desc: "Tap-and-drag posts nothing until the cursor actually moves. The obvious version presses immediately — and grabs objects in Figma you never meant to touch. Deferred, a resting finger has no side effect at all.",
    icon: GitBranch,
    accent: "emerald",
  },
];
export function CalmMouseMilliseconds() {
  return <CardGrid items={milliseconds} colsClass="grid-cols-1 sm:grid-cols-2" />;
}

/* ── 5) Shipping like a real product ───────────────────────────────────────── */
const shipping: GridItem[] = [
  {
    num: "01",
    title: "Signed & Notarized",
    desc: "Developer ID + Apple notarization. Opens like any real app — no security dialogs.",
    icon: BadgeCheck,
    accent: "violet",
  },
  {
    num: "02",
    title: "Updates Itself",
    desc: "Checks twice a day, verifies the new build's signature is mine, swaps in place, relaunches.",
    icon: RefreshCw,
    accent: "emerald",
  },
  {
    num: "03",
    title: "Private by Design",
    desc: "Never sees keystrokes, never touches the network beyond the update check. The README says so, plainly.",
    icon: ShieldCheck,
    accent: "slate",
  },
  {
    num: "04",
    title: "Godmouse → CalmMouse",
    desc: "The rename is the design insight restated: the product isn't power, it's calm.",
    icon: Feather,
    accent: "violet",
  },
];
export function CalmMouseShipping() {
  return <CardGrid items={shipping} colsClass="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" />;
}

/* ── 6) Outbound link CTAs ─────────────────────────────────────────────────── */
// Same treatment as the Inkwork/Moti live-product CTAs: filled foreground pill,
// centered in its own row.
function LinkCta({ href, children }: { href: string; children: ReactNode }) {
  return (
    <div className="flex justify-center">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-2.5 rounded-full bg-foreground px-8 py-4 text-base md:text-lg font-medium text-background hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors duration-200"
      >
        {children}
        <ArrowUpRight
          aria-hidden="true"
          className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          strokeWidth={1.8}
        />
      </a>
    </div>
  );
}

const CALMMOUSE_URL = "https://calmmouse.malikzhang.com/";

// Intro CTA — closes the Intro section after the meta cards.
export function CalmMouseVisitCta() {
  return <LinkCta href={CALMMOUSE_URL}>Visit the CalmMouse site</LinkCta>;
}

// Closing CTA — the calm line pays off after the whole story.
export function CalmMouseCta() {
  return <LinkCta href={CALMMOUSE_URL}>Get CalmMouse — free & open source</LinkCta>;
}
