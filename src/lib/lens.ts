import { PROJECTS, SKILLS, projectsWithSkill, type Project, type Skill } from "@/data/projects";
import { SECTIONS, WORK_LABEL, type SectionKey } from "@/lib/sections";

// ── The lens ─────────────────────────────────────────────────────────────────
// A lens is one question held up against the whole site. Nothing moves and
// nothing is hidden: the cards that answer it hold full brightness, the rest
// recede, and the hero dots do the same. Sections still carry importance; the
// lens only answers "which of these is the thing I'm hiring for".
//
// The lens lives in the URL (`?lens=industrial-design`), so a link can be sent
// with the lens already set, and a round trip through a case study brings it
// back. Every skill chip on a card is a control, and the row under the Selected
// Work eyebrow offers the most-asked-for lenses up front. Single select:
// choosing a second lens swaps, choosing the same one clears.
//
// Two kinds of lens share one mechanism. A skill lens gathers the cards whose
// chips include the skill. The Shipped lens gathers the cards that carry an
// outbound link (App Store, Live): shipping is a fact about a project, not a
// skill, so it is never a chip on a card (see projects.ts) — the link chip is
// the evidence — but it is the first question a hiring manager asks, so it is
// the first lens in the row.

export const LENS_PARAM = "lens";

export const SHIPPED = "Shipped";
export type Lens = Skill | typeof SHIPPED;

/** Every lens the URL may name, for the tests and the slug lookup. */
export const LENSES: readonly Lens[] = [SHIPPED, ...SKILLS];

// The lenses offered up front, in the row under the Selected Work eyebrow and
// the Studio header. Every card chip is a lens control, but a visitor will not
// press a chip to find out; this row is the invitation. Shipped first, then a
// curated subset of the skills ordered by what a hiring manager is most likely
// to be hiring for. The rarer skills (Data Visualization, Spatial Computing,
// Motion, Visual, Design Systems, Inclusive Design) stay on their cards only,
// where one or two matches would make a thin lens.
export const LENS_ROW: readonly Lens[] = [
  SHIPPED,
  "AI-Native",
  "Design Engineering",
  "Design Systems",
  "UX Research",
  "Hardware UX",
  "Industrial Design",
  "Physical Prototyping",
];

/** The row on a phone: the full eight ran to five rows of chips under the
 *  eyebrow, which read as a filter bar rather than an invitation. These four
 *  wrap to two rows at 360px and cover the flagship case studies' lenses;
 *  every other lens is still reachable from the chip on any card. */
export const LENS_ROW_COMPACT: readonly Lens[] = [SHIPPED, "AI-Native", "Design Engineering", "UX Research"];

/** A place outside the project list where a lens has evidence. Design Systems
 *  is the one case: the strongest design-systems work on the site is the site's
 *  own system (tokens, recipes, the workbench, the boundary test), which is a
 *  page rather than a project. The bar offers it beside the project counts, so
 *  a lens with one project card behind it is not a thin lens. */
export const lensAside = (lens: Lens): { label: string; path: string } | null =>
  lens === "Design Systems" ? { label: "This site's design system", path: "/design-system" } : null;

/** The URL form of a lens: "Hardware UX" → "hardware-ux". */
export const lensSlug = (lens: Lens): string =>
  lens
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** The lens a URL value names, or null for anything unknown — an unknown lens
 *  is the same as no lens, never an empty page. */
export const lensFromSlug = (slug: string | null | undefined): Lens | null => {
  if (!slug) return null;
  return LENSES.find((lens) => lensSlug(lens) === slug) ?? null;
};

/** Href for a page with the lens set, or the plain page when there is none. */
export const lensHref = (path: string, lens: Lens | null): string =>
  lens ? `${path}?${LENS_PARAM}=${lensSlug(lens)}` : path;

/** What a card needs to say whether it is inside a lens. */
export type LensSubject = Pick<Project, "skills" | "links">;

/** Whether a project has shipped: it carries an outbound link. */
export const isShipped = (project: Pick<Project, "links">): boolean => (project.links?.length ?? 0) > 0;

/** Whether a card is inside the lens. `null` when no lens is active, so a card
 *  can tell "not looked at" from "looked at and not a match". */
export const lensMatch = (project: Partial<LensSubject>, lens: Lens | null): boolean | null => {
  if (lens === null) return null;
  if (lens === SHIPPED) return isShipped(project);
  return (project.skills ?? []).includes(lens);
};

/** The projects inside the lens, in site order, across all sections. */
export const projectsInLens = (lens: Lens): Project[] =>
  lens === SHIPPED ? PROJECTS.filter(isShipped) : projectsWithSkill(lens);

/** Ids of the projects inside the lens (all sections). */
export const lensProjectIds = (lens: Lens | null): Set<string> =>
  new Set(lens ? projectsInLens(lens).map((p) => p.id) : []);

/** The tooltip for a lens control. */
export const lensTitle = (lens: Lens, pressed: boolean): string => {
  if (pressed) return "Clear lens";
  return lens === SHIPPED ? "See every project that shipped" : `See every project with ${lens}`;
};

export interface LensCounts {
  /** Matches on the current page, and how many cards that page shows. */
  here: number;
  total: number;
  /** The first match on this page in display order, so the bar can take the
   *  visitor straight to it. */
  first: string | null;
  /** Every match on this page, in page order, for stepping through them. */
  matches: string[];
  /** Matches on the other page, with where that page is. */
  elsewhere: { count: number; label: string; path: string } | null;
}

/** How many projects a lens gathers, split by page. `page` is the path the
 *  visitor is on: "/" (Work: Selected + More) or Studio's path. */
export const lensCounts = (lens: Lens, page: string): LensCounts => {
  const onPage = (key: SectionKey) => SECTIONS[key].path === page;
  const here = PROJECTS.filter((p) => onPage(p.section));
  const matches = projectsInLens(lens);
  const hereMatches = matches.filter((p) => onPage(p.section));

  // The pages of the site other than this one, with their match counts.
  const otherPaths = [...new Set(Object.values(SECTIONS).map((s) => s.path))].filter((p) => p !== page);
  const elsewhere = otherPaths
    .map((path) => {
      const keys = (Object.keys(SECTIONS) as SectionKey[]).filter((k) => SECTIONS[k].path === path);
      const count = matches.filter((p) => keys.includes(p.section)).length;
      // Work is the umbrella name for the homepage sections; Studio names itself.
      const label = path === "/" ? WORK_LABEL : SECTIONS[keys[0]].label;
      return { count, label, path };
    })
    .find((entry) => entry.count > 0);

  return {
    here: hereMatches.length,
    total: here.length,
    first: hereMatches[0]?.id ?? null,
    matches: hereMatches.map((p) => p.id),
    elsewhere: elsewhere ?? null,
  };
};
