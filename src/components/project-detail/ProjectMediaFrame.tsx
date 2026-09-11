import { useRef } from "react";
import { useInView } from "framer-motion";
import type { ProjectSectionFigure } from "@/types/projectDetail";
import { FigureCaption } from "./FigureCaption";

function toEmbedUrl(url: string): string {
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return url;
}

function AutoplayVideo({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, amount: 0.5 });
  // These are the long demo reels (the largest is 11 MB). Nothing is fetched at
  // page load — but once the frame is within a viewport of the screen the clip
  // starts buffering, so that by the time it is half on screen and asked to
  // play, it plays instead of stalling on its poster while the first bytes arrive.
  const near = useInView(containerRef, { once: true, margin: "100% 0px 100% 0px" });

  if (inView && ref.current && ref.current.paused) {
    ref.current.play().catch(() => {});
  }

  return (
    <div ref={containerRef}>
      <video ref={ref} src={src} poster={poster} preload={near ? "auto" : "none"} muted playsInline controls className="w-full max-h-[min(700px,74vh)] object-contain bg-background" />
    </div>
  );
}

// The frame is the rounded, clipped surface the media sits on. With a caption
// it becomes an inner element, so the caption sits outside the clip and on the
// page ground, the way a module's figure does. Without one the markup is
// unchanged, which is what keeps every uncaptioned case study rendering as it did.
const FRAME = "overflow-hidden rounded-2xl";

export function ProjectMediaFrame({ fig }: { fig: ProjectSectionFigure }) {
  const media =
    fig.type === "video" ? (
      <AutoplayVideo src={fig.src} poster={fig.poster} />
    ) : fig.type === "embed" ? (
      <iframe src={toEmbedUrl(fig.url)} title={fig.title ?? "Video"} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full" />
    ) : (
      <img src={fig.src} alt={fig.alt} loading="lazy" decoding="async" className="mx-auto w-full h-auto block" />
    );
  const frameClass = fig.type === "embed" ? `${FRAME} aspect-video` : FRAME;
  const caption = fig.type === "embed" ? undefined : fig.caption;

  if (!caption) {
    return <figure data-testid="project-media-frame" className={frameClass}>{media}</figure>;
  }
  return (
    <figure data-testid="project-media-frame">
      <div className={frameClass}>{media}</div>
      <FigureCaption label={fig.label}>{caption}</FigureCaption>
    </figure>
  );
}
