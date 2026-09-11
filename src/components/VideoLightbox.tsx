import { useRef } from "react";
import { useLightboxDismiss } from "@/hooks/useLightboxDismiss";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import type { ProjectLink } from "@/data/projects";
import { LinkChip } from "./ui/Chip";
import { DURATION, EASE } from "@/design-system/system/motion";

export interface LightboxVideo {
  src: string;
  poster: string;
  title: string;
  /** One caption line under the video. */
  caption: string;
  links?: ProjectLink[];
}

interface VideoLightboxProps {
  video: LightboxVideo | null;
  onClose: () => void;
}

// In-place player for a Workshop tile whose destination is a video: the story
// is the artifact, so it plays here rather than on a one-video detail page.
// No route change. Dismiss with the close button, a backdrop click, or Escape;
// the page keeps its scroll position (body overflow is locked, not scrolled)
// and focus returns to the tile that opened it.
export function VideoLightbox({ video, onClose }: VideoLightboxProps) {
  const reduce = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);

  useLightboxDismiss(video, onClose, closeRef);

  return createPortal(
    <AnimatePresence>
      {video && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={video.title}
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
            aria-label="Close video"
          >
            <X className="h-4 w-4" />
          </button>

          <motion.div
            className="flex max-w-[min(95vw,1280px)] flex-col gap-4 cursor-default"
            initial={{ opacity: 0, scale: reduce ? 1 : 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: reduce ? 1 : 0.98 }}
            transition={{ duration: reduce ? 0 : DURATION.medium, ease: EASE.move }}
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={video.src}
              poster={video.poster}
              controls
              autoPlay
              playsInline
              className="max-h-[80vh] w-auto max-w-full rounded-lg bg-background shadow-2xl"
            />
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-1">
              <p className="text-sm text-foreground-secondary">{video.caption}</p>
              {video.links?.map((link) => (
                <LinkChip key={link.url} link={link} />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
