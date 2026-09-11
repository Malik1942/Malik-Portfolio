import { useRef } from "react";
import { useLightboxDismiss } from "@/hooks/useLightboxDismiss";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { DURATION, EASE } from "@/design-system/system/motion";

export interface LightboxImage {
  src: string;
  alt: string;
}

interface ImageLightboxProps {
  image: LightboxImage | null;
  onClose: () => void;
}

// Full-screen expanded view for case-study images. Opened via delegated clicks in
// ProjectDetailTemplate. Dismiss with the close button, a backdrop click, or Escape.
export function ImageLightbox({ image, onClose }: ImageLightboxProps) {
  const reduce = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);

  useLightboxDismiss(image, onClose, closeRef);

  return createPortal(
    <AnimatePresence>
      {image && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={image.alt ? `Expanded image: ${image.alt}` : "Expanded image"}
          className="fixed inset-0 z-modal flex items-center justify-center bg-lightbox-backdrop backdrop-blur-sm p-4 md:p-10 cursor-zoom-out"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : DURATION.fast, ease: EASE.settle }}
          onClick={onClose}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 z-10 flex h-10 w-10 items-center justify-center rounded-full text-foreground-tertiary transition-colors duration-medium hover:text-foreground cursor-pointer"
            aria-label="Close expanded image"
          >
            <X className="h-4 w-4" />
          </button>

          <motion.img
            src={image.src}
            alt={image.alt}
            className="max-w-[95vw] max-h-[92vh] w-auto h-auto object-contain rounded-lg shadow-2xl cursor-default"
            initial={{ opacity: 0, scale: reduce ? 1 : 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: reduce ? 1 : 0.98 }}
            transition={{ duration: reduce ? 0 : DURATION.medium, ease: EASE.move }}
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
