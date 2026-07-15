import { applyOverrides } from "../tokens/compiler";
import { usePreviewDraft } from "../preview/PreviewProvider";

export function TokenDiff() {
  const { bundle, draft } = usePreviewDraft();
  const compiled = applyOverrides(bundle, draft.overrides);
  const production = new Map(bundle.tokens.map((token) => [token.path, token]));
  const preview = new Map(compiled.tokens.map((token) => [token.path, token]));
  const paths = Object.keys(draft.overrides).sort();

  return (
    <section aria-labelledby="token-diff-heading" className="min-w-0">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 id="token-diff-heading" className="text-lg font-medium text-foreground text-body">Changed tokens</h2>
          <p className="mt-1 text-sm text-foreground/55 text-body">Direct edits and the aliases whose compiled output follows them.</p>
        </div>
        <span className="font-mono text-xs text-foreground/55">{paths.length}</span>
      </div>
      {paths.length === 0 ? (
        <p className="mt-5 rounded-lg border border-border/50 p-5 text-sm text-foreground/58 text-body">No local changes yet.</p>
      ) : (
        <ul className="mt-5 space-y-3">
          {paths.map((path) => {
            const before = production.get(path)!;
            const after = preview.get(path)!;
            const affected = before.dependents.filter((dependent) => production.get(dependent)?.cssValue !== preview.get(dependent)?.cssValue);
            return (
              <li key={path} data-testid={`diff-${path}`} className="min-w-0 rounded-lg border border-border/50 p-4">
                <code className="block break-all text-xs text-foreground/80">{path}</code>
                <div className="mt-3 grid min-w-0 gap-3 text-xs sm:grid-cols-2">
                  <p className="min-w-0"><span className="block text-foreground/44">Production</span><code className="mt-1 block overflow-x-auto whitespace-nowrap text-foreground/65">{before.cssValue}</code></p>
                  <p className="min-w-0"><span className="block text-foreground/44">Draft</span><code className="mt-1 block overflow-x-auto whitespace-nowrap text-foreground">{after.cssValue}</code></p>
                </div>
                {affected.length > 0 ? <p className="mt-3 break-words text-xs leading-relaxed text-foreground/52 text-body">Also affects {affected.join(", ")}</p> : null}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
