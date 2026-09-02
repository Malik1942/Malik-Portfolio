import type { ReactNode } from "react";
import { ComponentSpecimen } from "./ComponentSpecimen";

/**
 * Five-part component reference page: Preview → API → Pairings → Accessibility → Testing.
 *
 * Piloted on component-project-card. Sections that have no entry in
 * COMPONENT_DOCS keep the older Purpose / Use it when / Responsive / Accessibility
 * card grid in Components.tsx, so this structure can be judged on one page before
 * it spreads to the rest of the lineup.
 *
 * Note on anchors: the shell resolves the URL hash to a *section* id
 * (see sectionModel.resolveSectionHash, which falls back to Overview on an
 * unknown hash), so these sub-sections deliberately expose no `#` links.
 */

export interface DocProp {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

export interface DocPairing {
  partner: string;
  relationship: string;
}

export interface DocNote {
  title: string;
  body: string;
}

export interface DocTestFile {
  path: string;
  covers: string[];
}

export interface ComponentDocEntry {
  /** Preview */
  source: string;
  summary: string;
  contextHref: string;
  contextLabel: string;
  /** API */
  signature: string;
  props: DocProp[];
  dataShape?: { name: string; fields: DocProp[] };
  tokens: string[];
  tokenGap?: string;
  /** Pairings */
  pairings: DocPairing[];
  antipairings: string[];
  /** Accessibility */
  accessibility: DocNote[];
  /** Testing */
  tests: DocTestFile[];
  testGaps: string[];
}

export const COMPONENT_DOCS: Record<string, ComponentDocEntry> = {
  "component-project-card": {
    source: "src/components/ProjectList.tsx → ProjectCard",
    summary:
      "Turns a portfolio project into a clear, image-led route with title, signal, role, and year. Used for Selected Work and Workshop entries; WIP projects stay visible but intentionally lose link and hover behavior.",
    contextHref: "/#projects",
    contextLabel: "View project cards in context",
    signature:
      "<ProjectCard project={project} projectId=\"moti\" dotClass=\"bg-accent-red\" globalIndex={0} />",
    props: [
      {
        name: "project",
        type: "Project",
        required: true,
        description: "The project record. Everything the card renders comes from here.",
      },
      {
        name: "projectId",
        type: "string",
        description:
          "Destination under /project/:id. Omit it and the card renders as a plain div instead of a Link, so nothing focusable promises a page that does not exist. Also the identity the hero dot arrival event matches on.",
      },
      {
        name: "dotClass",
        type: "string",
        required: true,
        description:
          "Accent dot class that ties the card back to its section: red for Selected Work, gold for Workshop.",
      },
      {
        name: "globalIndex",
        type: "number",
        required: true,
        description:
          "Position across every section, not within one. Drives the entrance stagger so the page reads as a single sequence.",
      },
      {
        name: "rowDelay",
        type: "number",
        default: "0",
        description: "Extra entrance delay, in seconds, for cards sharing a row.",
      },
      {
        name: "metadataLabel",
        type: "string",
        description: "Overrides the role and year line beneath the title.",
      },
      {
        name: "aspectRatio",
        type: "string",
        description:
          "Fixed media ratio with object-cover. Omit it and the container scales to the image's natural ratio instead.",
      },
      { name: "maxWidth", type: "string", description: "Caps the card's measure in a wide row." },
      {
        name: "horizontal",
        type: "boolean",
        default: "false",
        description: "Editorial row layout: media beside text rather than above it.",
      },
      {
        name: "imageRight",
        type: "boolean",
        default: "false",
        description: "Flips media and text order. Only meaningful with horizontal.",
      },
    ],
    dataShape: {
      name: "Project",
      fields: [
        { name: "title", type: "string", required: true, description: "Card heading." },
        { name: "description", type: "string", required: true, description: "Supporting line." },
        { name: "role", type: "string", required: true, description: "Malik's role on the project." },
        { name: "year", type: "string", required: true, description: "Displayed alongside role." },
        { name: "id", type: "string", description: "Stable key; usually mirrors projectId." },
        { name: "signal", type: "string", description: "Short editorial line above the description." },
        { name: "coverImage", type: "string", description: "Cover still. Alt text is the project title." },
        {
          name: "coverVideo",
          type: "string",
          description:
            "Cover reel. Never autoplays or loops: the card starts it, and reduced motion parks it entirely.",
        },
        { name: "coverFit", type: '"cover" | "contain"', description: "Media fit inside the frame." },
        { name: "details", type: "string", description: "Extra copy for editorial rows." },
        { name: "externalUrl", type: "string", description: "Off-site destination instead of a case study." },
        { name: "builtWith", type: "string", description: "Tooling credit shown on Workshop entries." },
        {
          name: "wip",
          type: "boolean",
          description: "Case study still in development: card stays visible but is not clickable.",
        },
        {
          name: "tag",
          type: "string",
          description:
            "Uppercase eyebrow marking a project as a different kind of work from the rest of its section.",
        },
        {
          name: "sectionHero",
          type: "boolean",
          description:
            "Render as a full-width row above the section grid. Declarative rather than positional, so reordering the array cannot silently reassign the hero.",
        },
      ],
    },
    tokens: [
      "component.projectCard.surface",
      "component.projectCard.hoverOverlay",
      "color.text.primary",
      "color.background.canvas",
      "color.border.default",
      "font.family.display",
      "font.family.body",
    ],
    tokenGap:
      "The card's 16px rounding and entrance and hover motion still use local Tailwind and Framer Motion values rather than radius.large or ease.enter.",
    pairings: [
      {
        partner: "Project list",
        relationship:
          "The only supported container. It supplies dotClass, globalIndex, and the layout flags, and it owns the alternating portrait/landscape rhythm. A card mounted outside it loses its stagger and its section accent.",
      },
      {
        partner: "Homepage hero dot grid",
        relationship:
          "Clicking a project dot eases the page to the matching card and fires project-dot-arrive on landing. The card answers with a brief pulse and force-reveals itself, since the scroll outruns the entrance animation.",
      },
      {
        partner: "Case-study structure",
        relationship:
          "The card's destination. projectId must resolve to a route under /project/:id, or the card should ship without it and stay inert.",
      },
      {
        partner: "Media frame",
        relationship:
          "Siblings, not nested. The card renders its own cover treatment through CardMedia; media frame is for evidence inside a case study, after the card has done its job.",
      },
    ],
    antipairings: [
      "Do not nest buttons, links, or a lightbox trigger inside a card. The whole card is one anchor, and a second control inside it competes for the same click.",
      "Do not use a card as a generic content tile. Its hover, entrance, and arrival behavior only make sense when the destination is a project.",
    ],
    accessibility: [
      {
        title: "Semantics",
        body: "Available projects use real anchors for keyboard focus, screen-reader semantics, and native open-in-new-tab behavior. WIP entries drop to a plain div rather than a disabled link, so nothing focusable promises a destination that is not there.",
      },
      {
        title: "Focus",
        body: "A two-pixel ring at 60% foreground with a four-pixel offset against the canvas, on focus-visible only. Rings remain visible over both the media and the overlay.",
      },
      {
        title: "Target size",
        body: "The entire card is the target, so it clears the 44px minimum in the token set at every breakpoint. The card is one of the few components here with no target-size gap.",
      },
      {
        title: "Motion",
        body: "Cover video is the one motion path that respects prefers-reduced-motion: the reel parks and the still holds. Entrance, hover, and the dot-arrival pulse do not yet respond to reduced motion.",
      },
      {
        title: "Images",
        body: "Cover images take the project title as alt text. That is accurate for a card whose job is naming the project, but it means the image adds no description beyond the visible heading.",
      },
    ],
    tests: [
      {
        path: "src/components/projectDotArrival.test.tsx",
        covers: [
          "Flags the matching card as arriving so the landing pulse can play",
          "Leaves other cards untouched",
          "Reveals a card that never entered the viewport, so it is composed on landing",
          "scrollToTarget announces arrival immediately when the target is already in place",
        ],
      },
      {
        path: "src/components/coverVideoPlayback.test.tsx",
        covers: [
          "Never autoplays or loops: the reel is driven from the card, not the element",
          "Stays parked below the fold, and waits out the settle delay after arrival",
          "Ignores a card that only sweeps through the viewport, and does not replay on a second pass",
          "Replays from the start on pointer re-entry without restarting mid-reel",
          "Lets an early hover win over the pending arrival start, without a double take",
        ],
      },
    ],
    testGaps: [
      "No test asserts the WIP branch: that a card without projectId renders no link and no hover state.",
      "Nothing covers entrance or hover under prefers-reduced-motion, which is the documented gap above.",
      "The hover overlay and focus ring have no visual regression coverage, so contrast over the media is verified by eye.",
    ],
  },
};

function DocSection({
  id,
  title,
  intro,
  children,
}: {
  id: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="border-t border-border/40 pt-8 first:border-t-0 first:pt-0">
      <h2 id={id} data-doc-heading="" className="text-label uppercase tracking-eyebrow text-foreground/55">
        {title}
      </h2>
      {intro ? (
        <p className="mt-3 max-w-[70ch] text-sm leading-relaxed text-foreground/72">{intro}</p>
      ) : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function PropsTable({ caption, rows }: { caption: string; rows: DocProp[] }) {
  return (
    <div className="min-w-0 overflow-x-auto rounded-lg border border-border/50">
      <table className="w-full min-w-[540px] border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-border/40">
            {["Name", "Type", "Default", "Notes"].map((heading) => (
              <th
                key={heading}
                scope="col"
                className="px-4 py-3 text-label uppercase tracking-eyebrow font-normal text-foreground/55"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-b border-border/25 last:border-b-0 align-top">
              <th scope="row" className="px-4 py-3 font-normal">
                <code className="font-mono text-foreground">{row.name}</code>
                {row.required ? (
                  <span className="ml-2 text-label uppercase tracking-eyebrow text-foreground/55">Required</span>
                ) : null}
              </th>
              <td className="px-4 py-3">
                <code className="font-mono text-foreground/72">{row.type}</code>
              </td>
              <td className="px-4 py-3 text-foreground/55">
                {row.default ? <code className="font-mono">{row.default}</code> : "—"}
              </td>
              <td className="max-w-[42ch] px-4 py-3 leading-relaxed text-foreground/72">{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ComponentDoc({ sectionId }: { sectionId: string }) {
  const doc = COMPONENT_DOCS[sectionId];
  if (!doc) return null;

  return (
    <div data-testid={`reference-${sectionId}`} className="space-y-8 md:space-y-10">
      <DocSection id={`${sectionId}-preview`} title="Preview" intro={doc.summary}>
        <div className="space-y-4">
          <ComponentSpecimen
            sectionId={sectionId}
            contextHref={doc.contextHref}
            contextLabel={doc.contextLabel}
          />
          <p className="text-sm text-foreground/55">
            Source: <code className="font-mono text-foreground/72">{doc.source}</code>
          </p>
        </div>
      </DocSection>

      <DocSection
        id={`${sectionId}-api`}
        title="API"
        intro="The props the component actually accepts, the record it renders from, and the tokens it consumes."
      >
        <div className="space-y-6">
          <pre className="min-w-0 overflow-x-auto rounded-lg border border-border/50 bg-card/25 p-4 text-label leading-relaxed font-mono text-foreground/72">
            <code>{doc.signature}</code>
          </pre>

          <PropsTable caption="Component props" rows={doc.props} />

          {doc.dataShape ? (
            <section aria-labelledby={`${sectionId}-data-shape`}>
              <h3 id={`${sectionId}-data-shape`} className="text-sm font-medium text-foreground">
                {doc.dataShape.name} record
              </h3>
              <div className="mt-3">
                <PropsTable caption={`${doc.dataShape.name} fields`} rows={doc.dataShape.fields} />
              </div>
            </section>
          ) : null}

          <section aria-labelledby={`${sectionId}-tokens`}>
            <h3 id={`${sectionId}-tokens`} className="text-sm font-medium text-foreground">
              Token dependencies
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {doc.tokens.map((token) => (
                <li key={token}>
                  <code className="block rounded-sm border border-border/50 px-2.5 py-1.5 text-label text-foreground/72 font-mono">
                    {token}
                  </code>
                </li>
              ))}
            </ul>
            {doc.tokenGap ? (
              <p className="mt-3 max-w-[70ch] text-sm leading-relaxed text-foreground/55">
                <span className="font-medium text-foreground/72">Current wiring gap:</span> {doc.tokenGap}
              </p>
            ) : null}
          </section>
        </div>
      </DocSection>

      <DocSection
        id={`${sectionId}-pairings`}
        title="Pairings"
        intro="What this component is meant to sit next to, and what it should not be asked to do."
      >
        <div className="space-y-6">
          <dl className="grid gap-px overflow-hidden rounded-lg border border-border/50 bg-border/50">
            {doc.pairings.map((pairing) => (
              <div key={pairing.partner} className="bg-background p-5 sm:p-6">
                <dt className="text-sm font-medium text-foreground">{pairing.partner}</dt>
                <dd className="mt-2 max-w-[70ch] text-sm leading-relaxed text-foreground/72">
                  {pairing.relationship}
                </dd>
              </div>
            ))}
          </dl>
          <section aria-labelledby={`${sectionId}-antipairings`}>
            <h3 id={`${sectionId}-antipairings`} className="text-sm font-medium text-foreground">
              Do not pair
            </h3>
            <ul className="mt-3 space-y-2">
              {doc.antipairings.map((item) => (
                <li key={item} className="max-w-[70ch] text-sm leading-relaxed text-foreground/55">
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </DocSection>

      <DocSection
        id={`${sectionId}-accessibility`}
        title="Accessibility"
        intro="What holds today, stated alongside what does not."
      >
        <dl className="grid gap-px overflow-hidden rounded-lg border border-border/50 bg-border/50 md:grid-cols-2">
          {doc.accessibility.map((note, index) => (
            <div
              key={note.title}
              // An odd count would otherwise leave a bordered empty cell at the end.
              className={`bg-background p-5 sm:p-6 ${
                doc.accessibility.length % 2 === 1 && index === doc.accessibility.length - 1
                  ? "md:col-span-2"
                  : ""
              }`}
            >
              <dt className="text-sm font-medium text-foreground">{note.title}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-foreground/72">{note.body}</dd>
            </div>
          ))}
        </dl>
      </DocSection>

      <DocSection
        id={`${sectionId}-testing`}
        title="Testing"
        intro="The behavior that is pinned by tests, and the behavior that is not."
      >
        <div className="space-y-6">
          {doc.tests.map((file) => (
            <section key={file.path}>
              <h3 className="text-sm font-medium text-foreground">
                <code className="font-mono">{file.path}</code>
              </h3>
              <ul className="mt-3 space-y-2">
                {file.covers.map((item) => (
                  <li key={item} className="max-w-[70ch] text-sm leading-relaxed text-foreground/72">
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}
          <section aria-labelledby={`${sectionId}-test-gaps`}>
            <h3 id={`${sectionId}-test-gaps`} className="text-sm font-medium text-foreground">
              Not covered
            </h3>
            <ul className="mt-3 space-y-2">
              {doc.testGaps.map((gap) => (
                <li key={gap} className="max-w-[70ch] text-sm leading-relaxed text-foreground/55">
                  {gap}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </DocSection>
    </div>
  );
}
