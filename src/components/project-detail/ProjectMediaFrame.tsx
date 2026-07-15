import { useRef } from "react";
import { useInView } from "framer-motion";
import type { ProjectSectionFigure } from "@/types/projectDetail";

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

  if (inView && ref.current && ref.current.paused) {
    ref.current.play().catch(() => {});
  }

  return (
    <div ref={containerRef}>
      <video ref={ref} src={src} poster={poster} preload="none" muted playsInline controls className="w-full max-h-[min(700px,74vh)] object-contain bg-black" />
    </div>
  );
}

export function ProjectMediaFrame({ fig }: { fig: ProjectSectionFigure }) {
  if (fig.type === "video") {
    return <figure data-testid="project-media-frame" className="overflow-hidden rounded-2xl bg-secondary/10"><AutoplayVideo src={fig.src} poster={fig.poster} /></figure>;
  }
  if (fig.type === "embed") {
    return <figure data-testid="project-media-frame" className="overflow-hidden rounded-2xl bg-secondary/10 aspect-video"><iframe src={toEmbedUrl(fig.url)} title={fig.title ?? "Video"} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full" /></figure>;
  }
  return <figure data-testid="project-media-frame" className="overflow-hidden rounded-2xl bg-secondary/10"><img src={fig.src} alt={fig.alt} loading="lazy" decoding="async" className="w-full h-auto block" /></figure>;
}
