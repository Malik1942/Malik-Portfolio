import { ComponentSpecimen } from "./ComponentSpecimen";

interface ReferenceEntry {
  purpose: string;
  usage: string;
  tokens: string[];
  tokenGap?: string;
  responsive: string;
  accessibility: string;
  preview: string;
  previewLabel: string;
  previewNote: string;
}

const COMPONENTS: Record<string, ReferenceEntry> = {
  "component-site-header": {
    purpose: "Keep Malik’s identity and four primary destinations available without competing with the work below it.",
    usage: "Use once at the top of portfolio and case-study routes. It is a fixed, direction-aware navigation layer—not a generic page toolbar.",
    tokens: ["component.siteHeader.scrimColor", "color.text.primary", "color.border.default", "font.family.body"],
    tokenGap: "Header motion values still live directly in CSS and Framer Motion; the duration and easing tokens do not drive them yet.",
    responsive: "Desktop centers navigation between the logo and a balancing column. Mobile removes the logo and preserves a single compact link row down to 320px.",
    accessibility: "Navigation uses real links. The outer hide-and-reveal transition is removed under reduced motion, but the SiteHeader inner entrance still animates, as do its CSS nav and divider entrances. Header inline links do not guarantee a 44px target.",
    preview: "/",
    previewLabel: "View site header in context",
    previewNote: "The header is fixed and coordinates with page scroll, so its production behavior is best evaluated at the top of the real homepage.",
  },
  "component-project-card": {
    purpose: "Turn a portfolio project into a clear, image-led route with title, signal, role, and year.",
    usage: "Use for selected work and workshop entries. WIP projects stay visible but intentionally lose link and hover behavior.",
    tokens: ["component.projectCard.surface", "component.projectCard.hoverOverlay", "color.text.primary", "color.background.canvas", "color.border.default", "font.family.display", "font.family.body"],
    tokenGap: "The card’s 16px rounding and entrance and hover motion still use local Tailwind and Framer Motion values rather than radius.large or ease.enter.",
    responsive: "Editorial rows collapse into vertical cards on narrow screens; the two-column collection retains natural media proportions and readable metadata.",
    accessibility: "Available projects use real anchors for keyboard focus, screen-reader semantics, and native open-in-new-tab behavior. Focus rings remain visible against the canvas; entrance and hover motion do not yet respond to reduced motion.",
    preview: "/#projects",
    previewLabel: "View project cards in context",
    previewNote: "Project cards depend on real project content, media loading, intersection entry, and route behavior. The production collection is the truthful specimen.",
  },
  "component-project-list": {
    purpose: "Organize selected work into a paced collection with a section heading, accent marker, and responsive project arrangement.",
    usage: "Use for the homepage’s Selected Work and Workshop collections, where ordering and visual rhythm are part of the editorial hierarchy.",
    tokens: ["color.accent.selectedWork", "color.accent.workshop", "color.text.primary", "font.family.body"],
    tokenGap: "Collection padding, gaps, and maximum widths are still local responsive values; layout and spacing tokens do not drive this component yet.",
    responsive: "The list shifts from one column to paired cards at tablet widths; hero rows retain asymmetric media and text relationships on larger screens.",
    accessibility: "Section headings name each collection, project links retain native semantics, and visual accent color is reinforced by text labels.",
    preview: "/#projects",
    previewLabel: "View project list in context",
    previewNote: "The list’s value comes from real ordering, media aspect ratios, and scroll entry rather than an isolated miniature.",
  },
  "component-metadata-card": {
    purpose: "Compress project role, timeline, collaborators, and scope into scannable case-study context.",
    usage: "Use near a case-study introduction when short label–value pairs help the reader orient before the narrative begins.",
    tokens: ["color.border.default", "color.surface.secondary", "color.text.primary", "radius.small", "font.family.body"],
    tokenGap: "Metadata label sizes and grid gaps remain local values. These cards use the secondary surface, not the expressive case-study-module surface tokens.",
    responsive: "Cards keep a two-column grid at every breakpoint, with compact spacing and type on smaller screens while preserving complete label and value text.",
    accessibility: "Labels remain visible text, values are never communicated by position or color alone, and long content wraps rather than clipping.",
    preview: "/project/moti#project-section-overview",
    previewLabel: "View metadata cards in context",
    previewNote: "Metadata cards are currently an internal case-study boundary, so the Moti introduction is the canonical production example.",
  },
  "component-media-frame": {
    purpose: "Give images, video, embeds, and captions a consistent editorial place inside case studies.",
    usage: "Use when project evidence needs a stable visual boundary without imposing a single crop or media type.",
    tokens: ["color.surface.secondary"],
    tokenGap: "The frame’s 16px rounding, width constraints, and spacing are still local values rather than radius.large, layout.content, or spacing tokens.",
    responsive: "Media remains fluid, respects its natural or declared aspect ratio, and caps tall assets relative to the viewport.",
    accessibility: "Images require specific alternative text, video exposes controls, embeds receive titles, and captions remain associated inside figures.",
    preview: "/project/aura#project-section-highlights",
    previewLabel: "View media frames in context",
    previewNote: "Media frames are content-driven internal renderers. Aura shows the production mix of image, video, and art-directed modules.",
  },
  "component-footer": {
    purpose: "Close each route with secondary navigation, social destinations, and a path back to this reference.",
    usage: "Use once after the page’s primary content. Keep primary header decisions out of this quieter discovery surface.",
    tokens: ["color.text.primary", "color.border.default", "font.family.body"],
    tokenGap: "Footer widths, spacing, type sizes, and transition timing remain local values rather than layout, spacing, font-size, or duration tokens.",
    responsive: "Explore and social columns stack on small screens and spread into two columns when reading width permits.",
    accessibility: "Destinations are semantic links, the About action remains a button when it opens an in-app experience, and labels do not depend on icons. Footer inline links and the About button do not guarantee 44px targets.",
    preview: "/#projects",
    previewLabel: "View footer in context",
    previewNote: "The footer is shared production UI, but nesting a second site footer inside the reference would create duplicate landmark and navigation semantics.",
  },
  "component-lightbox": {
    purpose: "Let readers inspect case-study imagery at a useful scale without losing their place in the narrative.",
    usage: "Use only for expandable detail imagery. Navigational thumbnails and linked media keep their normal link behavior.",
    tokens: ["component.lightbox.backdrop", "color.text.primary", "radius.base"],
    tokenGap: "Lightbox durations and easing are local Framer Motion values rather than duration.fast or ease.enter.",
    responsive: "The image is constrained to both viewport width and height with more surrounding space on larger screens.",
    accessibility: "The modal is labeled from image alt text, moves focus to Close, dismisses on Escape or backdrop, locks page scroll, and restores prior focus. Under reduced motion, the backdrop fade and image scale and fade durations go to zero. The Close control is 40px, below the 44px target represented in the token set.",
    preview: "/project/aura#project-section-final-design",
    previewLabel: "View image lightbox in context",
    previewNote: "Open a detail image in a case study to evaluate the real portal, focus restoration, backdrop, and viewport constraints together.",
  },
};

function Guidance({ entry }: { entry: ReferenceEntry }) {
  return (
    <div className="grid gap-px overflow-hidden rounded-lg border border-border/50 bg-border/50 md:grid-cols-2">
      {[
        ["Purpose", entry.purpose],
        ["Use it when", entry.usage],
        ["Responsive behavior", entry.responsive],
        ["Accessibility", entry.accessibility],
      ].map(([title, copy]) => (
        <section key={title} className="bg-background p-5 sm:p-6">
          <h2 className="text-sm font-medium text-foreground text-body">{title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-foreground/62 text-body">{copy}</p>
        </section>
      ))}
    </div>
  );
}

export function ComponentContent({ sectionId }: { sectionId: string }) {
  const entry = COMPONENTS[sectionId];
  if (!entry) return null;

  return (
    <div data-testid={`reference-${sectionId}`} className="space-y-8 md:space-y-10">
      <ComponentSpecimen
        sectionId={sectionId}
        contextHref={entry.preview}
        contextLabel={entry.previewLabel}
      />
      <Guidance entry={entry} />
      <section aria-labelledby={`${sectionId}-tokens`}>
        <h2 id={`${sectionId}-tokens`} className="text-sm font-medium text-foreground text-body">Token dependencies</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {entry.tokens.map((token) => <li key={token}><code className="block rounded-sm border border-border/50 px-2.5 py-1.5 text-[11px] text-foreground/62 text-mono">{token}</code></li>)}
        </ul>
        {entry.tokenGap ? (
          <p className="mt-3 max-w-[70ch] text-sm leading-relaxed text-foreground/55 text-body">
            <span className="font-medium text-foreground/72">Current wiring gap:</span> {entry.tokenGap}
          </p>
        ) : null}
      </section>
    </div>
  );
}
