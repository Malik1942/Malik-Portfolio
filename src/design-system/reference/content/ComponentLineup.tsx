const COMPONENT_LINEUP = [
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
        <p className="text-base leading-relaxed text-foreground/72 md:text-xl">
          Seven production components carry the portfolio across navigation,
          project discovery, case-study evidence, and focused media.
        </p>
        <p className="text-sm leading-relaxed text-foreground/55">
          Each entry documents the component in its real context rather than
          recreating a generic UI catalog.
        </p>
      </div>

      <ul className="border-t border-border/50">
        {COMPONENT_LINEUP.map((component, index) => (
          <li key={component.id} className="border-b border-border/50">
            <a
              href={`#${component.id}`}
              className="group grid min-h-[112px] gap-5 py-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-foreground/40 sm:grid-cols-[44px_minmax(150px,0.8fr)_minmax(0,1.6fr)_auto] sm:items-center"
            >
              <span className="font-mono text-label tabular-nums text-foreground/55">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-xl font-medium tracking-tight text-foreground">
                {component.name}
              </span>
              <span className="max-w-[54ch] text-sm leading-relaxed text-foreground/55">
                {component.purpose}
              </span>
              <span className="flex items-center gap-3 text-label uppercase tracking-eyebrow text-foreground/55 transition-colors group-hover:text-foreground/72">
                Production component <span aria-hidden="true">→</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
