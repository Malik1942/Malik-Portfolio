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
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CardGrid, type GridItem } from "./MotiModules";

/* ---------------------------------------------------------------------------
 * Inkwork case-study inline modules.
 * Same token-backed inline-module language as the Aura/Moti modules (dark cards,
 * mono 01/02 numbers, lucide icons, violet/emerald/slate module-accent tokens) —
 * no unmanaged colors or fonts are introduced.
 * ------------------------------------------------------------------------- */

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
