import { useEffect, type RefObject } from "react";

/**
 * The dismiss contract every lightbox shares: lock body scroll while open, move
 * focus to the close button, close on Escape, and hand focus back on the way out.
 *
 * `subject` is whatever the lightbox is showing. The effect does nothing while
 * it is falsy and re-runs when it changes, so showing something new re-captures
 * where focus should return to.
 */
export function useLightboxDismiss(
  subject: unknown,
  onClose: () => void,
  closeRef: RefObject<HTMLButtonElement>,
) {
  useEffect(() => {
    if (!subject) return;
    const prevOverflow = document.body.style.overflow;
    const prevFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      prevFocus?.focus?.();
    };
  }, [subject, onClose, closeRef]);
}
