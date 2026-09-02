import type { SectionLabel } from "@/lib/sections";

export type ProjectMetaCard = {
  label: string;
  value: string;
};

/** The eyebrow on a case-study page: the label of the homepage section the
 *  project lives in. Derived, never hand-written (see projectDetails.ts). */
export type ListSection = SectionLabel;

export type IntroContextCard = {
  title: string;
  body: string;
};

export type IntroBlock = {
  openingParagraph: string;
  /** Optional wide image rendered above the section heading */
  coverImage?: string;
  coverImageFit?: "cover" | "contain";
  contextCards?: IntroContextCard[];
  infoCards?: ProjectMetaCard[];
  whatIDid?: string[];
};

export type ProjectSectionFigure =
  | { type?: "image"; src: string; alt: string; full?: boolean }
  | { type: "video"; src: string; poster?: string }
  | { type: "embed"; url: string; title?: string };

export type ProjectContentSection = {
  id: string;
  /** Used in sidebar navigation */
  label: string;
  /** Takeaway headline shown as the large section heading (replaces generic label-as-heading) */
  headline?: string;
  /** Legacy: same role as headline, kept for backward compat */
  subtitle?: string;
  /** Plain text; paragraphs separated by blank lines (\\n\\n) */
  body: string;
  /** When true, renders the document's metaCards grid at the bottom of this section */
  showProjectMeta?: boolean;
  /** Optional inline-module key rendered after the metaCards grid */
  afterMetaModule?: string;
  /** Optional in-section images / artifacts */
  figures?: ProjectSectionFigure[];
  /** Optional structured intro block — replaces plain body rendering when present */
  introBlock?: IntroBlock;
};

export type ProjectDetailDocument = {
  slug: string;
  /** Shown as eyebrow — e.g. Selected Work / More Work / Workshop */
  listSection: ListSection;
  title: string;
  /** Short one-line subtitle shown below the hero image */
  heroSummary: string;
  /** Optional longer description paragraph shown below heroSummary */
  description?: string;
  /** Optional second line — impact, scope, or positioning */
  heroSubtitle?: string;
  heroImage?: string;
  heroImageFit?: "cover" | "contain" | "natural";
  /** Omit entirely to hide the overview card grid */
  metaCards?: ProjectMetaCard[];
  sections: ProjectContentSection[];
};
