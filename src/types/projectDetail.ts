export type ProjectMetaCard = {
  label: string;
  value: string;
};

export type IntroContextCard = {
  title: string;
  body: string;
};

export type IntroBlock = {
  openingParagraph: string;
  contextCards: IntroContextCard[];
  infoCards: ProjectMetaCard[];
  whatIDid: string[];
};

export type ProjectSectionFigure =
  | { type?: "image"; src: string; alt: string }
  | { type: "video"; src: string; poster?: string }
  | { type: "embed"; url: string; title?: string };

export type ProjectContentSection = {
  id: string;
  label: string;
  /** Plain text; paragraphs separated by blank lines (\\n\\n) */
  body: string;
  /** Optional in-section images / artifacts */
  figures?: ProjectSectionFigure[];
  /** Optional structured intro block — replaces plain body rendering when present */
  introBlock?: IntroBlock;
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
