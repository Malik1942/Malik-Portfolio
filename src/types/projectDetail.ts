export type ProjectMetaCard = {
  label: string;
  value: string;
};

export type ProjectSectionFigure = {
  src: string;
  alt: string;
};

export type ProjectContentSection = {
  id: string;
  label: string;
  /** Plain text; paragraphs separated by blank lines (\\n\\n) */
  body: string;
  /** Optional in-section images / artifacts */
  figures?: ProjectSectionFigure[];
};

export type ProjectDetailDocument = {
  slug: string;
  /** Shown as eyebrow — e.g. Main Projects / Built with AI */
  listSection: string;
  title: string;
  /** Short value proposition under the title */
  heroSummary: string;
  /** Optional second line — impact, scope, or positioning */
  heroSubtitle?: string;
  heroImage?: string;
  heroImageFit?: "cover" | "contain";
  metaCards: ProjectMetaCard[];
  sections: ProjectContentSection[];
};
