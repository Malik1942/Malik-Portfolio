import { exportDraftDocuments } from "../preview/draft";
import { usePreviewBundle, usePreviewDraft } from "../preview/PreviewProvider";

export function ExportDraftButton({ compact = false }: { compact?: boolean }) {
  const { draft } = usePreviewDraft();
  const bundle = usePreviewBundle();
  const exportDraft = () => {
    const documents = exportDraftDocuments(bundle, draft);
    const blob = new Blob([JSON.stringify(documents, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "malik-design-tokens.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };
  return <button type="button" onClick={exportDraft} className={compact ? "min-h-11 px-3 text-caption text-foreground-secondary" : "min-h-11 rounded-lg border border-border px-4 text-sm text-foreground-secondary"}>Export JSON</button>;
}
