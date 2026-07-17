import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AdminTokenEditor } from "./AdminTokenEditor";

interface AdminAuthoringDialogProps {
  open: boolean;
  onClose: () => void;
  onReviewPublish: () => void;
}

export function AdminAuthoringDialog({
  open,
  onClose,
  onReviewPublish,
}: AdminAuthoringDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    returnFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = getFocusableElements(dialogRef.current);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!dialogRef.current?.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      returnFocusRef.current?.focus();
      returnFocusRef.current = null;
    };
  }, [onClose, open]);

  if (!open) return null;

  return createPortal((
    <div className="fixed inset-0 z-[90] overflow-y-auto bg-lightbox-backdrop px-3 py-4 sm:px-6 sm:py-8">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Admin token authoring"
        className="mx-auto min-h-[calc(100vh-2rem)] w-full max-w-page rounded-lg border border-border bg-background p-5 shadow-2xl sm:min-h-[calc(100vh-4rem)] sm:p-8"
      >
        <header className="mb-8 flex items-start justify-between gap-6 border-b border-border/50 pb-6">
          <div>
            <p className="text-label uppercase tracking-eyebrow text-foreground/55">
              Admin · unlisted authoring
            </p>
            <h2 className="mt-3 font-display text-title font-light text-foreground sm:text-heading">
              Token authoring
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close token authoring"
            className="min-h-11 min-w-11 rounded-lg border border-border text-xl text-foreground/72 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>
        <AdminTokenEditor onReviewPublish={onReviewPublish} />
      </div>
    </div>
  ), document.body);
}

function getFocusableElements(root: HTMLElement | null): HTMLElement[] {
  if (!root) return [];
  return Array.from(root.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), summary, [tabindex]:not([tabindex="-1"])',
  )).filter((element) => !element.hasAttribute("hidden"));
}
