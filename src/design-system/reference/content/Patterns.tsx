import { Specimen } from "../Specimen";

interface PatternEntry {
  purpose: string;
  usage: string;
  tokens: string[];
  responsive: string;
  accessibility: string;
  preview: string;
  label: string;
  note: string;
}

const PATTERNS: Record<string, PatternEntry> = {
  "pattern-homepage-hero": {
    purpose: "Introduce Malik’s point of view through a terminal-like statement, DotGrid identity field, and layered navigation.",
    usage: "Reserve for the homepage opening. It is a composed identity moment, not a reusable marketing hero.",
    tokens: ["color.background.canvas", "color.text.primary", "layout.page", "duration.ambient", "ease.ambient"],
    responsive: "Copy, terminal geometry, and navigation density adapt independently so the statement remains legible from mobile through ultrawide screens.",
    accessibility: "The canvas is decorative, text remains real DOM content, and reduced motion presents a stable composition without requiring animation to understand it.",
    preview: "/",
    label: "View homepage hero in context",
    note: "DotGrid is canvas-bound and the hero coordinates font readiness, navigation, and scroll. The real opening is the representative state.",
  },
  "pattern-case-study": {
    purpose: "Turn project evidence into an editorial sequence of premise, context, decisions, outcomes, and reflection.",
    usage: "Use for substantial projects where narrative order and varied evidence matter more than a uniform module catalog.",
    tokens: ["layout.page", "layout.content", "layout.reading", "space.7", "space.8", "component.caseStudyModule.surface"],
    responsive: "Wide media and a sticky guide use larger canvases; prose retains a controlled measure and modules collapse without losing narrative order.",
    accessibility: "Sections use headings and stable anchors, figures keep alternative text or titles, and narrative meaning is not encoded only in layout.",
    preview: "/project/moti",
    label: "View case-study structure in context",
    note: "Moti demonstrates the full production template with authored modules, evidence, responsive hierarchy, and cross-project navigation.",
  },
  "pattern-section-navigation": {
    purpose: "Keep readers oriented inside long case studies and allow direct movement to stable narrative sections.",
    usage: "Use when the number and length of project sections make scroll position difficult to infer from content alone.",
    tokens: ["color.text.primary", "color.border.default", "color.surface.secondary", "layout.touchTarget", "ease.standard"],
    responsive: "Desktop uses a left sticky rail; mobile switches to a horizontal sticky strip that clears the direction-aware site header.",
    accessibility: "Both variants are named navigation landmarks with real, labeled controls and a visible active state reinforced beyond color.",
    preview: "/project/aura#project-section-research",
    label: "View section navigation in context",
    note: "Scroll-spy state and coordination with the fixed header require a full case-study viewport, so Aura is the canonical interaction specimen.",
  },
  "pattern-responsive": {
    purpose: "Preserve hierarchy and reading comfort as space changes instead of shrinking the desktop composition uniformly.",
    usage: "Apply to every portfolio route: collapse relationships when needed, keep content complete, and protect interaction targets.",
    tokens: ["layout.page", "layout.content", "layout.reading", "layout.touchTarget", "font.size.body"],
    responsive: "At narrow widths, grids stack, section guides become horizontal, media stays fluid, and typography scales down selectively. Larger screens gain rhythm, not extra clutter.",
    accessibility: "Reflow does not hide canonical information, require horizontal page scrolling, or change meaningful reading order.",
    preview: "/#projects",
    label: "View responsive portfolio in context",
    note: "Resize the real project collection to see content order, card composition, spacing, and interaction targets respond together.",
  },
  "pattern-transitions": {
    purpose: "Make font loading, route changes, and content arrival feel continuous without blocking access to the work.",
    usage: "Use sparingly at page boundaries and meaningful entrances; state changes should remain clear without relying on choreography.",
    tokens: ["duration.fast", "duration.medium", "duration.page", "ease.enter", "ease.move", "ease.standard"],
    responsive: "Transition intent stays consistent across viewports while layout-specific movement distances remain local to each artifact.",
    accessibility: "The operating-system reduced-motion preference suppresses decorative movement, and no essential content waits on animation completion.",
    preview: "/project/neuralyfe",
    label: "View loading and transitions in context",
    note: "Open a real case study to see page entry, media reveal, and scroll arrival coordinated with production loading behavior.",
  },
  "pattern-expressive": {
    purpose: "Give Malik’s portfolio a recognizable voice through DotGrid and the About experience while preserving their art-directed character.",
    usage: "Use these patterns only where identity and narrative justify bespoke behavior. Do not promote particle geometry or scene-specific constants into shared primitives.",
    tokens: ["color.background.canvas", "color.text.primary", "duration.ambient", "ease.ambient"],
    responsive: "Density, composition, and movement adapt to device capability and viewport while the expressive premise remains intact.",
    accessibility: "Decorative canvas output stays outside the content model, About retains readable DOM content, and reduced-motion fallbacks remove nonessential animation.",
    preview: "/",
    label: "View expressive visuals in context",
    note: "DotGrid and About are deliberately not cloned as generic primitives. Their production contexts preserve the relationship between expression and content.",
  },
  "pattern-accessibility": {
    purpose: "Treat keyboard use, focus, contrast, target size, motion preference, and resilient content as system behavior rather than cleanup.",
    usage: "Apply at every token, component, and pattern boundary, then verify in the composed production route where interactions meet.",
    tokens: ["color.focus.ring", "color.text.primary", "color.background.canvas", "layout.touchTarget", "duration.fast"],
    responsive: "Accessible behavior persists through reflow: navigation remains reachable, content order remains logical, and targets keep a usable minimum size.",
    accessibility: "Visible focus, semantic HTML, labeled landmarks, alternative text, Escape dismissal, contrast, and reduced motion are explicit acceptance conditions.",
    preview: "/design-system#overview",
    label: "View accessibility behavior in context",
    note: "Use keyboard-only navigation through this reference, then inspect a case study and lightbox to test the system across multiple interaction boundaries.",
  },
};

export function PatternContent({ sectionId }: { sectionId: string }) {
  const entry = PATTERNS[sectionId];
  if (!entry) return null;

  return (
    <div data-testid={`reference-${sectionId}`} className="space-y-8 md:space-y-10">
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
      <section aria-labelledby={`${sectionId}-tokens`}>
        <h2 id={`${sectionId}-tokens`} className="text-sm font-medium text-foreground text-body">Token dependencies</h2>
        <ul className="mt-3 flex flex-wrap gap-2">{entry.tokens.map((token) => <li key={token}><code className="block rounded-sm border border-border/50 px-2.5 py-1.5 text-[11px] text-foreground/62 text-mono">{token}</code></li>)}</ul>
      </section>
      <Specimen label="Production context" description={entry.note}>
        <a href={entry.preview} className="inline-flex min-h-[44px] items-center rounded-sm border border-border/60 px-4 text-sm text-foreground/72 transition-colors hover:border-foreground/35 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40">{entry.label} →</a>
      </Specimen>
    </div>
  );
}
