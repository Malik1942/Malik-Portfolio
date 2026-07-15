import { Specimen } from "../Specimen";
import { hasPatternSpecimen, PatternSpecimen } from "./PatternSpecimen";

interface PatternEntry {
  purpose: string;
  usage: string;
  tokens: string[];
  tokenGap?: string;
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
    tokens: ["color.background.canvas", "color.text.primary", "color.accent.selectedWork", "font.family.body", "font.family.mono", "component.siteHeader.scrimColor"],
    tokenGap: "Hero geometry and motion remain local values. DotGrid’s orb palette is intentionally expressive code, while duration and easing tokens do not drive the composition yet.",
    responsive: "Copy, terminal geometry, and navigation density adapt independently so the statement remains legible from mobile through ultrawide screens.",
    accessibility: "The canvas is decorative and the text remains real DOM content. Under reduced motion, the direction-aware header’s outer transition is removed and DotGrid freezes ambient twinkle, orb drift, and breathing. The terminal, hero entrances, scroll indicator, SiteHeader inner entrance, DotGrid mode morph, and About motion still animate.",
    preview: "/",
    label: "View homepage hero in context",
    note: "DotGrid is canvas-bound and the hero coordinates font readiness, navigation, and scroll. The real opening is the representative state.",
  },
  "pattern-case-study": {
    purpose: "Turn project evidence into an editorial sequence of premise, context, decisions, outcomes, and reflection.",
    usage: "Use for substantial projects where narrative order and varied evidence matter more than a uniform module catalog.",
    tokens: ["color.background.canvas", "color.text.primary", "color.border.default", "color.surface.secondary", "font.family.body", "font.family.display", "font.family.mono", "component.caseStudyModule.surface", "component.caseStudyModule.border", "component.caseStudyModule.divider"],
    tokenGap: "The template’s page, reading, and module widths plus its vertical rhythm are still local values; layout and spacing tokens do not drive them yet.",
    responsive: "Wide media and a sticky guide use larger canvases; prose retains a controlled measure and modules collapse without losing narrative order.",
    accessibility: "Sections use headings and stable anchors, figures keep alternative text or titles, and narrative meaning is not encoded only in layout.",
    preview: "/project/moti",
    label: "View case-study structure in context",
    note: "Moti demonstrates the full production template with authored modules, evidence, responsive hierarchy, and cross-project navigation.",
  },
  "pattern-section-navigation": {
    purpose: "Keep readers oriented inside long case studies and allow direct movement to stable narrative sections.",
    usage: "Use when the number and length of project sections make scroll position difficult to infer from content alone.",
    tokens: ["color.background.canvas", "color.text.primary", "color.border.default", "radius.small", "font.family.body"],
    tokenGap: "Sticky offsets, transition timing, and control sizing remain local values. layout.touchTarget and ease.standard are not wired here, and the section controls do not guarantee 44px targets.",
    responsive: "Desktop uses a left sticky rail; mobile switches to a horizontal sticky strip that clears the direction-aware site header.",
    accessibility: "Both variants are named navigation landmarks with real, labeled controls and a visible active state reinforced beyond color.",
    preview: "/project/aura#project-section-research",
    label: "View section navigation in context",
    note: "Scroll-spy state and coordination with the fixed header require a full case-study viewport, so Aura is the canonical interaction specimen.",
  },
  "pattern-responsive": {
    purpose: "Preserve hierarchy and reading comfort as space changes instead of shrinking the desktop composition uniformly.",
    usage: "Apply to every portfolio route: collapse relationships when needed, keep content complete, and protect interaction targets.",
    tokens: ["color.background.canvas", "color.text.primary", "font.family.body"],
    tokenGap: "Breakpoints, maximum widths, padding, gaps, and most type sizes are still responsive utility or component values; the generated layout, spacing, touch-target, and font-size tokens do not drive reflow yet.",
    responsive: "At narrow widths, grids stack, section guides become horizontal, media stays fluid, and typography scales down selectively. Larger screens gain rhythm, not extra clutter.",
    accessibility: "Reflow keeps content order and canonical information intact. Target-size coverage is uneven: several controls hardcode 44px, while header and footer inline links and case-study section controls do not guarantee it.",
    preview: "/#projects",
    label: "View responsive portfolio in context",
    note: "Resize the real project collection to see content order, card composition, spacing, and interaction targets respond together.",
  },
  "pattern-transitions": {
    purpose: "Make font loading, route changes, and content arrival feel continuous without blocking access to the work.",
    usage: "Use sparingly at page boundaries and meaningful entrances; state changes should remain clear without relying on choreography.",
    tokens: ["color.text.primary"],
    tokenGap: "The duration and easing tokens are documented but not wired to these effects; current CSS and Framer Motion values are local.",
    responsive: "Transition intent stays consistent across viewports while layout-specific movement distances remain local to each artifact.",
    accessibility: "Reduced motion removes the SiteHeader outer hide-and-reveal transition, freezes DotGrid’s ambient movement, and removes the lightbox backdrop and image durations. PageTransition, ProjectCard entrances and hover motion, and the SiteHeader inner entrance still animate. No essential content depends on completing the animation.",
    preview: "/project/neuralyfe",
    label: "View loading and transitions in context",
    note: "Open a real case study to see page entry, media reveal, and scroll arrival coordinated with production loading behavior.",
  },
  "pattern-expressive": {
    purpose: "Give Malik’s portfolio a recognizable voice through DotGrid and the About experience while preserving their art-directed character.",
    usage: "Use these patterns only where identity and narrative justify bespoke behavior. Do not promote particle geometry or scene-specific constants into shared primitives.",
    tokens: ["color.background.canvas", "color.text.primary", "font.family.body", "font.family.display"],
    tokenGap: "DotGrid’s palette and movement constants remain inside the expressive implementation; duration.ambient and ease.ambient do not drive it today.",
    responsive: "Density, composition, and movement adapt to device capability and viewport while the expressive premise remains intact.",
    accessibility: "Decorative canvas output stays outside the content model and About retains readable DOM content. Under reduced motion, DotGrid freezes ambient twinkle, orb drift, and breathing; the name-to-About morph and About’s Framer Motion entrances and scroll cue still animate.",
    preview: "/",
    label: "View expressive visuals in context",
    note: "DotGrid and About are deliberately not cloned as generic primitives. Their production contexts preserve the relationship between expression and content.",
  },
  "pattern-accessibility": {
    purpose: "Treat keyboard use, focus, contrast, target size, motion preference, and resilient content as system behavior rather than cleanup.",
    usage: "Apply at every token, component, and pattern boundary, then verify in the composed production route where interactions meet.",
    tokens: ["color.text.primary", "color.background.canvas", "color.border.default", "component.lightbox.backdrop"],
    tokenGap: "The focus ring and touch target tokens exist but are not wired to the documented production paths; focus rings derive from the foreground color and many target sizes remain local values.",
    responsive: "Navigation remains reachable and content order remains logical through reflow. Header and footer inline links and case-study section controls do not guarantee a 44px target.",
    accessibility: "Visible focus, semantic HTML, labeled landmarks, alternative text, Escape dismissal, and contrast are present across the referenced paths. Reduced-motion coverage is partial: header outer motion, DotGrid ambient movement, and lightbox motion respond, while several entrances and transitions still animate.",
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
      {hasPatternSpecimen(sectionId) ? (
        <PatternSpecimen sectionId={sectionId} contextHref={entry.preview} contextLabel={entry.label} />
      ) : null}
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
        {entry.tokenGap ? (
          <p className="mt-3 max-w-[70ch] text-sm leading-relaxed text-foreground/55 text-body">
            <span className="font-medium text-foreground/72">Current wiring gap:</span> {entry.tokenGap}
          </p>
        ) : null}
      </section>
      {!hasPatternSpecimen(sectionId) ? (
        <Specimen label="Production context" description={entry.note}>
          <a href={entry.preview} className="inline-flex min-h-[44px] items-center rounded-sm border border-border/60 px-4 text-sm text-foreground/72 transition-colors hover:border-foreground/35 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40">{entry.label} →</a>
        </Specimen>
      ) : null}
    </div>
  );
}
