import { ExportDraftButton } from "../workbench/ExportDraftButton";
import { usePreviewDraft } from "./PreviewProvider";

export function PreviewBar() {
  const { draft, previewActive, embedded, resetAll, exitPreview } = usePreviewDraft();
  if (!previewActive || embedded) return null;
  const count = Object.keys(draft.overrides).length;
  return (
    <aside role="region" aria-label="Local design preview" className="fixed inset-x-3 bottom-3 z-[100] mx-auto flex max-w-reading flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-background/95 px-3 py-2 shadow-2xl backdrop-blur md:inset-x-6">
      <p className="px-2 text-xs text-foreground/72"><span className="font-medium text-foreground">Local preview</span> · {count} changed</p>
      <div className="flex flex-wrap items-center">
        <a href="/design-system#playground" className="inline-flex min-h-11 items-center px-3 text-xs text-foreground/72">Design System</a>
        <ExportDraftButton compact />
        <button type="button" onClick={resetAll} className="min-h-11 px-3 text-xs text-foreground/72">Reset</button>
        <button type="button" onClick={exitPreview} className="min-h-11 px-3 text-xs text-foreground">Exit preview</button>
      </div>
    </aside>
  );
}
