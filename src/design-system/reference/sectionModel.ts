export interface DesignSystemSection {
  id: string;
  label: string;
  description: string;
}

export interface DesignSystemGroup {
  id: string;
  label: string;
  sections: DesignSystemSection[];
}

// The overview is the system's landing page — it describes the whole reference
// (all three groups), so it sits above them rather than inside Foundations.
export const OVERVIEW_SECTION: DesignSystemSection = {
  id: "overview",
  label: "Overview",
  description: "How Malik's portfolio system is structured, generated, and used.",
};

export const DESIGN_SYSTEM_GROUPS: DesignSystemGroup[] = [
  {
    id: "foundations",
    label: "Foundations",
    sections: [
      {
        id: "foundation-typography",
        label: "Type",
        description: "Display, body, and mono roles extracted from the current site.",
      },
      {
        id: "foundation-color",
        label: "Color",
        description: "Warm neutrals, semantic surfaces, text, borders, and portfolio accents.",
      },
      {
        id: "foundation-tokens",
        label: "Spacing & motion",
        description: "Spacing rhythm, layout measures, radius, and motion values in one place.",
      },
      {
        id: "foundation-icons",
        label: "Icons",
        description: "The lucide-react icon set, stroke, and sizing used across the interface.",
      },
    ],
  },
  {
    id: "components",
    label: "Components",
    sections: [
      {
        id: "component-lineup",
        label: "Component lineup",
        description: "The production building blocks used across Malik's portfolio.",
      },
      {
        id: "component-site-header",
        label: "Site header",
        description: "Shared responsive navigation and hide-on-scroll behavior.",
      },
      {
        id: "component-project-card",
        label: "Project card",
        description: "The core selected-work preview and interaction states.",
      },
      {
        id: "component-project-list",
        label: "Project list",
        description: "Section heading, project grid, and responsive grouping.",
      },
      {
        id: "component-metadata-card",
        label: "Metadata card",
        description: "Compact role, timeline, and project-context summaries.",
      },
      {
        id: "component-media-frame",
        label: "Media frame",
        description: "Consistent image, video, embed, and caption treatment.",
      },
      {
        id: "component-footer",
        label: "Footer",
        description: "Secondary navigation, social links, and reference discovery.",
      },
      {
        id: "component-lightbox",
        label: "Image lightbox",
        description: "Focused media inspection with keyboard and reduced-motion support.",
      },
    ],
  },
  {
    id: "patterns",
    label: "Patterns",
    sections: [
      {
        id: "pattern-homepage-hero",
        label: "Homepage hero",
        description: "Canvas identity, terminal statement, and layered navigation.",
      },
      {
        id: "pattern-case-study",
        label: "Case-study structure",
        description: "Editorial hierarchy, media rhythm, and narrative sections.",
      },
      {
        id: "pattern-section-navigation",
        label: "Section navigation",
        description: "Sticky orientation across desktop and mobile case studies.",
      },
      {
        id: "pattern-responsive",
        label: "Responsive behavior",
        description: "How density, hierarchy, and interaction adapt across viewports.",
      },
      {
        id: "pattern-transitions",
        label: "Loading & transitions",
        description: "Font-aware entry, page transitions, and reduced-motion fallbacks.",
      },
      {
        id: "pattern-expressive",
        label: "Expressive visuals",
        description: "DotGrid and About as art-directed systems rather than generic primitives.",
      },
      {
        id: "pattern-accessibility",
        label: "Accessibility",
        description: "Keyboard, focus, contrast, target size, motion, and content resilience.",
      },
    ],
  },
];

// The overview leads the linear reading sequence even though it is not part of
// any group, so previous/next and hash resolution treat it as the first section.
const SECTIONS = [
  OVERVIEW_SECTION,
  ...DESIGN_SYSTEM_GROUPS.flatMap((group) => group.sections),
];

export function resolveSectionHash(hash: string): DesignSystemSection {
  const id = hash.startsWith("#") ? hash.slice(1) : hash;
  return SECTIONS.find((section) => section.id === id) ?? OVERVIEW_SECTION;
}

export function getAdjacentSections(id: string): {
  previous: DesignSystemSection | undefined;
  next: DesignSystemSection | undefined;
} {
  const current = resolveSectionHash(id);
  const index = SECTIONS.findIndex((section) => section.id === current.id);

  return {
    previous: SECTIONS[index - 1],
    next: SECTIONS[index + 1],
  };
}
