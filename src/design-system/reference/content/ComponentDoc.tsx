import type { ReactNode } from "react";
import { ComponentSpecimen } from "./ComponentSpecimen";
import { DocProp, DocRecipe, COMPONENT_DOCS } from "./componentDocs";
import { Eyebrow } from "@/components/ui/Eyebrow";

/**
 * Six-part component reference page:
 * Preview → Recipe → API → Pairings → Accessibility → Testing.
 *
 * Recipe is the component described in the system's three facets. Form is
 * shape and structure, material is surface and ink, motion is pace and
 * curve. A variant changes one facet; the recipe says which.
 *
 * Note on anchors: the shell resolves the URL hash to a *section* id
 * (see sectionModel.resolveSectionHash, which falls back to Overview on an
 * unknown hash), so these sub-sections deliberately expose no `#` links.
 */

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
    <section aria-labelledby={id} className="border-t border-hairline pt-8 first:border-t-0 first:pt-0">
      <Eyebrow as="h2" id={id} data-doc-heading="">
        {title}
      </Eyebrow>
      {intro ? (
        <p className="mt-3 max-w-measure-wide text-sm leading-relaxed text-foreground-secondary">{intro}</p>
      ) : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function PropsTable({ caption, rows }: { caption: string; rows: DocProp[] }) {
  return (
    <div className="min-w-0 overflow-x-auto rounded-lg border border-hairline">
      <table className="w-full min-w-[540px] border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-hairline">
            {["Name", "Type", "Default", "Notes"].map((heading) => (
              <th
                key={heading}
                scope="col"
                className="px-4 py-3 text-label uppercase tracking-eyebrow font-normal text-foreground-tertiary"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-b border-hairline-faint last:border-b-0 align-top">
              <th scope="row" className="px-4 py-3 font-normal">
                <code className="font-mono text-foreground">{row.name}</code>
                {row.required ? (
                  <span className="ml-2 text-label uppercase tracking-eyebrow text-foreground-tertiary">Required</span>
                ) : null}
              </th>
              <td className="px-4 py-3">
                <code className="font-mono text-foreground-secondary">{row.type}</code>
              </td>
              <td className="px-4 py-3 text-foreground-tertiary">
                {row.default ? <code className="font-mono">{row.default}</code> : "none"}
              </td>
              <td className="max-w-measure-narrow px-4 py-3 leading-relaxed text-foreground-secondary">{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RecipeFacets({ recipe }: { recipe: DocRecipe }) {
  const facets: [string, string][] = [
    ["Form", recipe.form],
    ["Material", recipe.material],
    ["Motion", recipe.motion],
  ];
  return (
    <div className="space-y-4" data-testid="doc-recipe">
      <dl className="grid gap-px overflow-hidden rounded-lg border border-hairline bg-hairline md:grid-cols-3">
        {facets.map(([title, body]) => (
          <div key={title} className="bg-background p-5 sm:p-6">
            <dt className="text-sm font-medium text-foreground">{title}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-foreground-secondary">{body}</dd>
          </div>
        ))}
      </dl>
      {recipe.variants ? (
        <p className="max-w-measure-wide text-sm leading-relaxed text-foreground-tertiary">
          <span className="font-medium text-foreground-secondary">Variants:</span> {recipe.variants}
        </p>
      ) : null}
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
          <p className="text-sm text-foreground-tertiary">
            Source: <code className="font-mono text-foreground-secondary">{doc.source}</code>
          </p>
        </div>
      </DocSection>

      <DocSection
        id={`${sectionId}-recipe`}
        title="Recipe"
        intro="The component in the system's three facets. A variant changes one facet and leaves the other two alone."
      >
        <RecipeFacets recipe={doc.recipe} />
      </DocSection>

      <DocSection
        id={`${sectionId}-api`}
        title="API"
        intro="The props the component actually accepts, the record it renders from, and the tokens it consumes."
      >
        <div className="space-y-6">
          <pre className="min-w-0 overflow-x-auto rounded-lg border border-hairline bg-card/25 p-4 text-label leading-relaxed font-mono text-foreground-secondary">
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
                  <code className="block rounded-sm border border-hairline px-2.5 py-1.5 text-label text-foreground-secondary font-mono">
                    {token}
                  </code>
                </li>
              ))}
            </ul>
            {doc.tokenGap ? (
              <p className="mt-3 max-w-measure-wide text-sm leading-relaxed text-foreground-tertiary">
                <span className="font-medium text-foreground-secondary">Local values:</span> {doc.tokenGap}
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
          <dl className="grid gap-px overflow-hidden rounded-lg border border-hairline bg-hairline">
            {doc.pairings.map((pairing) => (
              <div key={pairing.partner} className="bg-background p-5 sm:p-6">
                <dt className="text-sm font-medium text-foreground">{pairing.partner}</dt>
                <dd className="mt-2 max-w-measure-wide text-sm leading-relaxed text-foreground-secondary">
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
                <li key={item} className="max-w-measure-wide text-sm leading-relaxed text-foreground-tertiary">
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
        <dl className="grid gap-px overflow-hidden rounded-lg border border-hairline bg-hairline md:grid-cols-2">
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
              <dd className="mt-2 text-sm leading-relaxed text-foreground-secondary">{note.body}</dd>
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
                  <li key={item} className="max-w-measure-wide text-sm leading-relaxed text-foreground-secondary">
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
                <li key={gap} className="max-w-measure-wide text-sm leading-relaxed text-foreground-tertiary">
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
