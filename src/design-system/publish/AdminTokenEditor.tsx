import { useMemo } from "react";
import { tokenBundle } from "../generated/token-manifest.generated";
import { applyOverrides } from "../tokens/compiler";
import { usePreviewDraft } from "../preview/PreviewProvider";
import { ContrastChecks } from "../workbench/ContrastChecks";
import { ExportDraftButton } from "../workbench/ExportDraftButton";
import { PortfolioPreview } from "../workbench/PortfolioPreview";
import { TokenControl } from "../workbench/TokenControl";
import { TokenDiff } from "../workbench/TokenDiff";

const CATEGORIES = [...new Set(tokenBundle.tokens.map((token) => token.path.split(".")[0]))];

export function AdminTokenEditor({ onReviewPublish }: { onReviewPublish: () => void }) {
  const { draft, discarded, setOverride, resetToken, resetCategory, resetAll } = usePreviewDraft();
  const compiledTokens = useMemo(
    () => new Map(
      applyOverrides(tokenBundle, draft.overrides).tokens.map((token) => [token.path, token]),
    ),
    [draft.overrides],
  );
  const changedCount = Object.keys(draft.overrides).length;

  return (
    <div data-testid="admin-token-editor" className="space-y-12 md:space-y-16">
      <div className="flex flex-wrap items-end justify-between gap-5 border-b border-border/50 pb-6">
        <div className="max-w-[660px]">
          <p className="text-sm leading-relaxed text-foreground/58 text-body">
            Draft changes stay in this browser. Review opens the authenticated
            GitHub pull-request flow; nothing writes directly to main.
          </p>
        </div>
        <button
          type="button"
          disabled={changedCount === 0}
          onClick={onReviewPublish}
          className="min-h-[44px] rounded-md bg-foreground px-5 text-sm text-background disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Review and publish
        </button>
      </div>

      {discarded.length > 0 ? (
        <aside role="status" className="rounded-lg border border-destructive/50 p-4 text-sm text-foreground/72 text-body">
          Production changed since this draft was saved. Discarded incompatible
          paths: <code className="break-all">{discarded.join(", ")}</code>.
        </aside>
      ) : null}

      <div className="grid min-w-0 gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(0,420px)] xl:items-start xl:gap-8">
        <div className="min-w-0 xl:col-start-2 xl:row-start-1">
          <div className="min-w-0 xl:sticky xl:top-6">
            <PortfolioPreview />
          </div>
        </div>

        <section aria-labelledby="admin-token-controls-heading" className="min-w-0 xl:col-start-1 xl:row-start-1">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h3 id="admin-token-controls-heading" className="text-xl font-medium text-foreground text-body">
                Token controls
              </h3>
              <p className="mt-1 text-sm text-foreground/55 text-body">
                Technical authoring controls derived from the canonical token bundle.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <ExportDraftButton />
              <button
                type="button"
                onClick={resetAll}
                className="min-h-[44px] rounded-md border border-border px-4 text-sm text-foreground/72"
              >
                Reset all
              </button>
            </div>
          </div>

          <div className="mt-7 space-y-5">
            {CATEGORIES.map((category, index) => {
              const tokens = tokenBundle.tokens.filter((token) => token.path.startsWith(`${category}.`));
              const changed = tokens.filter((token) => Object.prototype.hasOwnProperty.call(draft.overrides, token.path)).length;
              return (
                <details key={category} open={index === 0 || changed > 0} className="rounded-lg border border-border/50">
                  <summary className="flex min-h-[52px] cursor-pointer items-center justify-between gap-4 px-4 py-3 text-sm text-foreground/78 text-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50">
                    <span className="capitalize">{category}</span>
                    <span className="font-mono text-xs text-foreground/44">{changed}/{tokens.length}</span>
                  </summary>
                  <div className="border-t border-border/40 p-4">
                    <div className="mb-4 flex justify-end">
                      <button
                        type="button"
                        onClick={() => resetCategory(category)}
                        className="min-h-[44px] text-xs text-foreground/60 underline underline-offset-4"
                      >
                        Reset {category}
                      </button>
                    </div>
                    <div className="grid min-w-0 gap-4">
                      {tokens.map((token) => {
                        const overridden = Object.prototype.hasOwnProperty.call(draft.overrides, token.path);
                        return (
                          <div key={token.path} className="min-w-0">
                            <TokenControl
                              token={token}
                              value={compiledTokens.get(token.path)!.resolvedValue}
                              onChange={(value) => setOverride(token.path, value)}
                            />
                            {overridden ? (
                              <button
                                type="button"
                                onClick={() => resetToken(token.path)}
                                className="mt-1 min-h-[44px] px-2 text-xs text-foreground/58 underline underline-offset-4"
                              >
                                Reset {token.path}
                              </button>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </details>
              );
            })}
          </div>
        </section>
      </div>

      <TokenDiff />
      <ContrastChecks />
    </div>
  );
}
