// The only place section identity lives. Nav, footer, section eyebrows, the
// case-study `listSection` eyebrow, hero dot subtitles and project grouping all
// derive from this table. The same label used to be hand-written in five
// places, which is how they drifted.
//
// Site shape: the homepage is "Work", made of two sections (Selected Work, the
// three case studies a recruiter should see first, then More Work). Studio is
// a separate page: small software built solo with AI tools alongside the
// industrial design that came before it. Work is where the process is the
// story; Studio is where the thing is.
//
// `id` is the DOM id of the section. `selected` keeps `projects` so existing
// `#projects` links, `scrollTo: "projects"` router state and the hero scroll
// indicator keep working. `path` is the page the section renders on.
export const STUDIO_PATH = "/studio";

export const SECTIONS = {
  selected: { id: "projects", label: "Selected Work", dots: "bright", path: "/" },
  more: { id: "more-work", label: "More Work", dots: "dim", path: "/" },
  studio: { id: "studio", label: "Studio", dots: "none", path: STUDIO_PATH },
} as const;

export type SectionKey = keyof typeof SECTIONS;
export type SectionLabel = (typeof SECTIONS)[SectionKey]["label"];
export type SectionDots = (typeof SECTIONS)[SectionKey]["dots"];

/** Site order, top to bottom. */
export const SECTION_ORDER: readonly SectionKey[] = ["selected", "more", "studio"];

/** The sections rendered on the homepage, in order. */
export const HOME_SECTION_ORDER: readonly SectionKey[] = SECTION_ORDER.filter(
  (key) => SECTIONS[key].path === "/",
);

/** The homepage's nav label: the umbrella over Selected Work and More Work. */
export const WORK_LABEL = "Work";

/** Href for a section from a given page. Homepage sections are in-page anchors
 *  (prefixed with `hrefBase`, "/" when linking from another page); a section
 *  on its own page is a plain route. */
export const sectionHref = (key: SectionKey, hrefBase = ""): string =>
  SECTIONS[key].path === "/" ? `${hrefBase}#${SECTIONS[key].id}` : SECTIONS[key].path;

export type NavItem =
  /** Scrolls to a homepage section (routing home first when elsewhere). */
  | { label: string; kind: "section"; section: SectionKey }
  /** A page of its own. */
  | { label: string; kind: "route"; path: string };

export const navItemHref = (item: NavItem, hrefBase = ""): string =>
  item.kind === "section" ? sectionHref(item.section, hrefBase) : item.path;

/** Header and footer Explore, in order: Work, Studio. About and Resume are
 *  appended by each of those components. More Work is a homepage section, not
 *  a chrome destination. */
export const NAV_ITEMS: readonly NavItem[] = [
  { label: WORK_LABEL, kind: "section", section: "selected" },
  { label: SECTIONS.studio.label, kind: "route", path: STUDIO_PATH },
];
