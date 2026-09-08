import { PROJECTS, SKILLS, projectsWithSkill, type Skill } from "@/data/projects";
import { SECTIONS, WORK_LABEL, type SectionKey } from "@/lib/sections";

// ── The skill lens ───────────────────────────────────────────────────────────
// A lens is one skill held up against the whole site. Nothing moves and nothing
// is hidden: the cards that carry the skill hold full brightness, the rest
// recede, and the hero dots do the same. Sections still carry importance; the
// lens only answers "which of these is the skill I'm hiring for".
//
// The lens lives in the URL (`?lens=industrial-design`), so a link can be sent
// with the lens already set, and a round trip through a case study brings it
// back. Every skill chip on a card is the control; there is no filter bar.
// Single select: choosing a second skill swaps, choosing the same one clears.

export const LENS_PARAM = "lens";

// The lenses offered up front, in the row under the Selected Work eyebrow and
// the Studio header. Every card chip is a lens control, but a visitor will not
// press a chip to find out; this row is the invitation. A curated subset of the
// vocabulary, ordered by what a hiring manager is most likely to be hiring for:
// the rarer skills (Data-Dense UI, Design Systems, Visual Design, iOS) stay on
// their cards only, where one or two matches would make a thin lens.
export const LENS_ROW: readonly Skill[] = [
  "AI-Native",
  "Interaction Design",
  "User Research",
  "Prototyping in Code",
  "Industrial Design",
  "Physical Prototyping",
];

/** The URL form of a skill: "iOS / SwiftUI" → "ios-swiftui". */
export const skillSlug = (skill: Skill): string =>
  skill
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** The skill a URL value names, or null for anything unknown — an unknown lens
 *  is the same as no lens, never an empty page. */
export const skillFromSlug = (slug: string | null | undefined): Skill | null => {
  if (!slug) return null;
  return SKILLS.find((skill) => skillSlug(skill) === slug) ?? null;
};

/** Href for a page with the lens set, or the plain page when there is none. */
export const lensHref = (path: string, lens: Skill | null): string =>
  lens ? `${path}?${LENS_PARAM}=${skillSlug(lens)}` : path;

/** Whether a card is inside the lens. `null` when no lens is active, so a card
 *  can tell "not looked at" from "looked at and not a match". */
export const lensMatch = (skills: readonly Skill[] | undefined, lens: Skill | null): boolean | null =>
  lens === null ? null : (skills ?? []).includes(lens);

/** Ids of the projects inside the lens (all sections). */
export const lensProjectIds = (lens: Skill | null): Set<string> =>
  new Set(lens ? projectsWithSkill(lens).map((p) => p.id) : []);

export interface LensCounts {
  /** Matches on the current page, and how many cards that page shows. */
  here: number;
  total: number;
  /** The first match on this page in display order, so the bar can take the
   *  visitor straight to it. */
  first: string | null;
  /** Matches on the other page, with where that page is. */
  elsewhere: { count: number; label: string; path: string } | null;
}

/** How many projects a lens gathers, split by page. `page` is the path the
 *  visitor is on: "/" (Work: Selected + More) or Studio's path. */
export const lensCounts = (lens: Skill, page: string): LensCounts => {
  const onPage = (key: SectionKey) => SECTIONS[key].path === page;
  const here = PROJECTS.filter((p) => onPage(p.section));
  const matches = projectsWithSkill(lens);
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
    elsewhere: elsewhere ?? null,
  };
};
