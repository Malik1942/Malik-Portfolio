import { useCallback, useEffect, useRef, useState } from "react";
import { usePreviewDraft } from "../preview/PreviewProvider";
import { DESIGN_PREVIEW_MESSAGE_TYPE } from "../preview/runtime";

const VIEWPORTS = [320, 768, 1440] as const;

export function PortfolioPreview() {
  const { draft } = usePreviewDraft();
  const [width, setWidth] = useState<number>(320);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const postOverrides = useCallback(() => {
    frameRef.current?.contentWindow?.postMessage({
      type: DESIGN_PREVIEW_MESSAGE_TYPE,
      overrides: structuredClone(draft.overrides),
    }, window.location.origin);
  }, [draft.overrides]);

  useEffect(() => postOverrides(), [postOverrides]);

  return (
    <section data-testid="portfolio-preview" aria-labelledby="portfolio-preview-heading">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="portfolio-preview-heading" className="text-xl font-medium text-foreground">Real portfolio preview</h2>
          <p className="mt-1 text-sm text-foreground/55">Same-origin production routes with your local CSS-variable patch.</p>
        </div>
        <div role="group" aria-label="Preview viewport" className="flex gap-2">
          {VIEWPORTS.map((viewport) => <button key={viewport} type="button" aria-pressed={width === viewport} onClick={() => setWidth(viewport)} className="min-h-11 rounded-lg border border-border px-3 font-mono text-xs text-foreground/72 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50">{viewport}px</button>)}
        </div>
      </div>
      <div className="mt-5 overflow-x-auto rounded-lg border border-border/60 bg-card/20 p-2 sm:p-4">
        <div className="mx-auto overflow-hidden rounded-lg bg-background transition-[width]" style={{ width }}>
          <iframe ref={frameRef} title="Live portfolio preview" src="/?design-preview=local&embedded=1" onLoad={postOverrides} className="block h-[680px] w-full border-0" />
        </div>
      </div>
      <a href="/?design-preview=local" className="mt-4 inline-flex min-h-11 items-center text-sm text-foreground/72 underline underline-offset-4 hover:text-foreground">Open full-site preview</a>
    </section>
  );
}
