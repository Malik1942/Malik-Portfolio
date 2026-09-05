const COMPONENT_LINEUP = [
  {
    id: "component-eyebrow",
    name: "Eyebrow",
    purpose: "Uppercase label that names the block beneath it.",
  },
  {
    id: "component-chip",
    name: "Chip",
    purpose: "Passive skill labels and the outbound link chip in a metadata line.",
  },
  {
    id: "component-button",
    name: "Button",
    purpose: "Filled primary pill and bordered secondary control.",
  },
  {
    id: "component-back-link",
    name: "Back link",
    purpose: "Quiet inline return control with a nudging arrow.",
  },
  {
    id: "component-site-header",
    name: "Site header",
    purpose: "Direction-aware navigation shared across portfolio routes.",
  },
  {
    id: "component-project-card",
    name: "Project card",
    purpose: "Image-led entry point into selected work and workshop projects.",
  },
  {
    id: "component-project-list",
    name: "Project list",
    purpose: "Responsive editorial grouping for project collections.",
  },
  {
    id: "component-metadata-card",
    name: "Metadata card",
    purpose: "Compact role, timeline, and project-context summary.",
  },
  {
    id: "component-media-frame",
    name: "Media frame",
    purpose: "Consistent image, video, embed, and caption boundary.",
  },
  {
    id: "component-footer",
    name: "Footer",
    purpose: "Secondary navigation, social links, and reference discovery.",
  },
  {
    id: "component-lightbox",
    name: "Image lightbox",
    purpose: "Focused image inspection without losing narrative position.",
  },
] as const;

export function ComponentLineup() {
  return (
    <div data-testid="reference-component-lineup" className="space-y-10">
      <div className="max-w-reading space-y-4">
        <p className="text-base leading-relaxed text-foreground-secondary md:text-xl">
          Four primitives and seven composed components carry the portfolio
          across navigation, project discovery, case-study evidence, and
          focused media.
        </p>
        <p className="text-sm leading-relaxed text-foreground-tertiary">
          Each entry shows the component live, states its recipe as form,
          material, and motion, and documents it in its real context rather
          than recreating a generic UI catalog.
        </p>
      </div>

      <ul className="border-t border-hairline">
        {COMPONENT_LINEUP.map((component, index) => (
          <li key={component.id} className="border-b border-hairline">
            <a
              href={`#${component.id}`}
              className="group grid min-h-[112px] gap-5 py-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus sm:grid-cols-[44px_minmax(150px,0.8fr)_minmax(0,1.6fr)_auto] sm:items-center"
            >
              <span className="font-mono text-label tabular-nums text-foreground-tertiary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-xl font-medium tracking-tight text-foreground">
                {component.name}
              </span>
              <span className="max-w-measure text-sm leading-relaxed text-foreground-tertiary">
                {component.purpose}
              </span>
              <span className="flex items-center gap-3 text-label uppercase tracking-eyebrow text-foreground-tertiary transition-colors group-hover:text-foreground-secondary">
                Production component <span aria-hidden="true">→</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
