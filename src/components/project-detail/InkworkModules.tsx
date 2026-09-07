import type { ReactNode } from "react";
import {
  MousePointerClick,
  Layers,
  LayoutTemplate,
  MessagesSquare,
  Palette,
  Copy,
  Link2,
  Shapes,
  QrCode,
  Download,
  Feather,
  Zap,
  Box,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { noOrphan } from "@/lib/noOrphan";
import { Button } from "@/components/ui/Button";

/* ---------------------------------------------------------------------------
 * Inkwork case-study inline modules.
 * Same token-backed inline-module language as the Aura/Moti modules (dark cards,
 * mono 01/02 numbers, lucide icons, violet/emerald/slate module-accent tokens) —
 * no unmanaged colors or fonts are introduced.
 * ------------------------------------------------------------------------- */

type Accent = "violet" | "emerald" | "slate";
const accentColor: Record<Accent, { icon: string; num: string }> = {
  violet: { icon: "text-accent-violet", num: "text-accent-violet/60" },
  emerald: { icon: "text-accent-emerald", num: "text-accent-emerald/60" },
  slate: { icon: "text-accent-slate", num: "text-accent-slate/50" },
};

type GridItem = { num: string; title: string; desc?: string; icon: LucideIcon; accent: Accent };

// Shared dark card shell — mirrors the Aura/Moti module shells.
function ModuleCard({ children, header }: { children: ReactNode; header?: string }) {
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
                <span className={`text-caption font-mono tabular-nums ${a.num}`}>{it.num}</span>
                <Icon aria-hidden="true" className={`w-4 h-4 ${a.icon}`} strokeWidth={1.4} />
              </div>
              <div className="flex flex-col gap-2.5">
                <p className="text-base md:text-xl font-medium text-foreground leading-normal md:leading-snug tracking-tight">
                  {noOrphan(it.title)}
                </p>
                {it.desc ? (
                  <p className="text-sm md:text-base font-light text-foreground-secondary leading-relaxed">
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

/* ── 1) Diagnosis — six costumes of one missing decision ─────────────────── */
const symptoms: GridItem[] = [
  {
    num: "01",
    title: "Two Primary Buttons, One Intent",
    desc: "A black “Download PNG” next to an indigo “Download SVG,” identical weight. The accent color then reappeared on “Copy share link,” marking two unrelated things and meaning nothing.",
    icon: MousePointerClick,
    accent: "violet",
  },
  {
    num: "02",
    title: "Every Card Weighed the Same",
    desc: "Content, preview, Share, Preset I/O, and Print export all sat at identical elevation. Print PDF at 40mm, a power-user feature, was as prominent as the one thing everyone came to do.",
    icon: Layers,
    accent: "emerald",
  },
  {
    num: "03",
    title: "A Promise the Layout Didn’t Keep",
    desc: "“Pick a preset, tune the ink, export,” but the page opened on a textarea, an error-correction dropdown, and two hex fields. The presets weren’t where the eye landed first.",
    icon: LayoutTemplate,
    accent: "slate",
  },
  {
    num: "04",
    title: "Two Voices on One Screen",
    desc: "“Module color” and “Error correction · L · ~7%” were library internals leaking through, sitting next to “Center logo” and “tune the ink,” which is the voice I actually wrote.",
    icon: MessagesSquare,
    accent: "violet",
  },
  {
    num: "05",
    title: "The Default Fought the Brand",
    desc: "A magenta-on-pink code inside indigo-and-ink chrome. The largest element on the page told a color story that appeared nowhere else.",
    icon: Palette,
    accent: "emerald",
  },
  {
    num: "06",
    title: "The Logo, Three Times",
    desc: "Repeated as a section icon, carrying no information.",
    icon: Copy,
    accent: "slate",
  },
];
export function InkworkSymptoms() {
  return <CardGrid items={symptoms} colsClass="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" />;
}

/* ── 2) Decision — the page became a sequence ────────────────────────────── */
const sequence: GridItem[] = [
  {
    num: "01",
    title: "Type Your Link",
    desc: "One field, one “Update QR code” button.",
    icon: Link2,
    accent: "violet",
  },
  {
    num: "02",
    title: "Pick a Style",
    desc: "Named presets as first-class tiles: Pebble, Classic Ink, Inkdrop, Classy Noir, Velvet.",
    icon: Shapes,
    accent: "emerald",
  },
  {
    num: "03",
    title: "Check the Proof",
    desc: "A scannability check that decodes the code you just made.",
    icon: QrCode,
    accent: "slate",
  },
  {
    num: "04",
    title: "Export",
    desc: "One primary “Download PNG”; “Copy PNG” as the quiet secondary.",
    icon: Download,
    accent: "violet",
  },
];
export function InkworkSequence() {
  return <CardGrid items={sequence} colsClass="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" />;
}

/* ── 3) Two Themes — one token system ────────────────────────────────────── */
const themes: GridItem[] = [
  {
    num: "01",
    title: "Paper",
    desc: "Calm cream and ink. The studio at rest.",
    icon: Feather,
    accent: "slate",
  },
  {
    num: "02",
    title: "Arcade",
    desc: "Loud yellow neubrutalism: hard shadows, thick borders, and a 3D cube in the corner that flips between the two.",
    icon: Zap,
    accent: "violet",
  },
  {
    num: "03",
    title: "One Token System",
    desc: "The themes differ in every surface quality and share every structural decision. The cube is the proof the system is real, not two hand-painted skins.",
    icon: Box,
    accent: "emerald",
  },
];
export function InkworkThemes() {
  return <CardGrid items={themes} colsClass="grid-cols-1 sm:grid-cols-3" />;
}

/* ── 4) Outbound link CTAs ───────────────────────────────────────────────── */
// Same treatment as Moti's App Store CTA (MotiAppStoreCta) — live-product links
// get the strongest affordance in the token set: filled foreground pill,
// centered in its own row.
function LinkCta({ href, children }: { href: string; children: ReactNode }) {
  return (
    <div className="flex justify-center">
      <Button href={href} external icon={<ArrowUpRight strokeWidth={1.8} />}>
        {children}
      </Button>
    </div>
  );
}

const INKWORK_URL = "https://www.malikzhang.com/inkwork";

// Intro CTA — closes the Intro section after the meta cards, mirroring the
// placement of Moti's "View on the App Store" CTA.
export function InkworkTryCta() {
  return <LinkCta href={INKWORK_URL}>Try Inkwork</LinkCta>;
}

export function InkworkSkillLink() {
  return <LinkCta href="https://github.com/Malik1942/product-film">View the skill on GitHub</LinkCta>;
}

// Closing CTA — same link as the intro; the cube line pays off only after the
// Two Themes section has introduced it.
export function InkworkCta() {
  return <LinkCta href={INKWORK_URL}>Try Inkwork: press the cube</LinkCta>;
}
