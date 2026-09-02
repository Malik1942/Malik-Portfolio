import { PROJECTS } from "@/data/projects";
import { SECTIONS } from "@/lib/sections";

// ── Hero orb positions ───────────────────────────────────────────────────────
// Which projects get an orb is derived from the project list (every project
// whose section has `dots !== "none"`); *where* each orb sits is art direction
// and stays a hand-tuned table keyed by project id. The table must hold exactly
// the ids that have dots — `dotGridOrbs.test.ts` enforces that.
//
// rx/ry: desktop position as a fraction of the canvas.
// mrx/mry: mobile. On mobile the bright orbs are held in a single labeled column
// (mrx 0.09) and their mry only encodes ORDER and BAND (above or below the title
// cluster, split at 0.5) — DotGrid's layoutMobileColumns distributes the actual
// rows evenly inside each band. Dim orbs draw as unlabeled background stars on
// mobile, so their mobile coordinates are literal, scattered off to the right.
//
// Desktop layout notes, bright tier: Moti sits in the band between the nav and
// the title cluster; Aura at the far left of that band; NeuraLyfe in the lower
// band. Dim tier fills the gaps around them: Mood Muse and FlowPrint down the
// right edge, Tubular in the lower-left.
export interface OrbPosition {
  rx: number;
  ry: number;
  mrx: number;
  mry: number;
  /** Optional display name when it differs from the card title (the App Store
   *  name for Moti). */
  label?: string;
}

export const ORB_POSITIONS: Record<string, OrbPosition> = {
  // Selected Work — bright
  neuralyfe: { rx: 0.28, ry: 0.72, mrx: 0.09, mry: 0.73 },
  moti: { label: "Moti: Plan", rx: 0.42, ry: 0.2, mrx: 0.09, mry: 0.19 },
  aura: { rx: 0.1, ry: 0.25, mrx: 0.09, mry: 0.3 },
  // More Work — dim
  moodmuse: { rx: 0.88, ry: 0.3, mrx: 0.62, mry: 0.72 },
  tubular: { rx: 0.18, ry: 0.7, mrx: 0.86, mry: 0.8 },
  flowprint: { rx: 0.75, ry: 0.45, mrx: 0.72, mry: 0.9 },
};

export type OrbTier = "bright" | "dim";

export interface OrbDef extends OrbPosition {
  id: string;
  label: string;
  subtitle: string;
  tier: OrbTier;
}

/** The orbs the hero draws, derived from the project list and the position
 *  table. A project without a position is skipped (the test catches it). */
export const heroOrbs = (): OrbDef[] =>
  PROJECTS.flatMap((project) => {
    const dots = SECTIONS[project.section].dots;
    if (dots === "none") return [];
    const position = ORB_POSITIONS[project.id];
    if (!position) return [];
    return [
      {
        ...position,
        id: project.id,
        label: position.label ?? project.title,
        subtitle: SECTIONS[project.section].label,
        tier: dots,
      },
    ];
  });
