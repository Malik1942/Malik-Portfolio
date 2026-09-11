import { applyOverrides } from "../tokens/compiler";
import { usePreviewBundle, usePreviewDraft } from "../preview/PreviewProvider";

export function TokenDiff() {
  const { draft } = usePreviewDraft();
  const bundle = usePreviewBundle();
  const compiled = applyOverrides(bundle, draft.overrides);
  const production = new Map(bundle.tokens.map((token) => [token.path, token]));
  const preview = new Map(compiled.tokens.map((token) => [token.path, token]));
  const paths = Object.keys(draft.overrides).sort();

  return (
    <section aria-labelledby="token-diff-heading" className="min-w-0">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 id="token-diff-heading" className="text-xl font-medium text-foreground">Changed tokens</h2>
          <p className="mt-1 text-sm text-foreground-tertiary">Direct edits and the aliases whose compiled output follows them.</p>
        </div>
        <span className="font-mono text-caption text-foreground-tertiary">{paths.length}</span>
      </div>
      {paths.length === 0 ? (
        <p className="mt-5 rounded-lg border border-hairline p-5 text-sm text-foreground-tertiary">No local changes yet.</p>
      ) : (
        <ul className="mt-5 space-y-3">
          {paths.map((path) => {
            const before = production.get(path)!;
            const after = preview.get(path)!;
            const affected = before.dependents.filter((dependent) => production.get(dependent)?.cssValue !== preview.get(dependent)?.cssValue);
            return (
              <li key={path} data-testid={`diff-${path}`} className="min-w-0 rounded-lg border border-hairline p-4">
                <code className="block break-all text-caption text-foreground-secondary">{path}</code>
                <div className="mt-3 grid min-w-0 gap-3 text-caption sm:grid-cols-2">
                  <p className="min-w-0"><span className="block text-foreground-tertiary">Production</span><code className="mt-1 block overflow-x-auto whitespace-nowrap text-foreground-secondary">{before.cssValue}</code></p>
                  <p className="min-w-0"><span className="block text-foreground-tertiary">Draft</span><code className="mt-1 block overflow-x-auto whitespace-nowrap text-foreground">{after.cssValue}</code></p>
                </div>
                {affected.length > 0 ? <p className="mt-3 break-words text-caption leading-relaxed text-foreground-tertiary">Also affects {affected.join(", ")}</p> : null}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
