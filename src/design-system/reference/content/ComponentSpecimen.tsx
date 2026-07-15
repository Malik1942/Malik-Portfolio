import { useState } from "react";
import auraCover from "@/assets/aura-cover.webp";
import motiCard from "@/assets/moti-card.webp";
import { ImageLightbox, type LightboxImage } from "@/components/project-detail/ImageLightbox";
import { Specimen } from "../Specimen";

interface ComponentSpecimenProps {
  sectionId: string;
  contextHref: string;
  contextLabel: string;
}

function ContextLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} className="inline-flex min-h-[44px] items-center text-sm text-foreground/64 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      {label} <span aria-hidden="true" className="ml-2">→</span>
    </a>
  );
}

function ProjectCardStage() {
  const [active, setActive] = useState(false);
  return (
    <a
      href="#project-card-specimen"
      onClick={(event) => event.preventDefault()}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      data-active={active}
      className="group relative block overflow-hidden rounded-md border border-border/50 bg-secondary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <img src={motiCard} alt="Moti mobile product interface" className="aspect-[16/9] w-full object-cover transition-transform duration-300 group-hover:scale-[1.025] group-focus-visible:scale-[1.025]" />
      <div className={`absolute inset-0 flex items-end bg-gradient-to-t from-background via-background/15 to-transparent p-5 transition-opacity duration-200 ${active ? "opacity-100" : "opacity-75"}`}>
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-foreground/58 text-mono">Selected work · 2025</p>
          <p className="mt-2 text-xl font-medium text-foreground text-display">Moti</p>
          <p className="mt-1 text-sm text-foreground/72 text-body">Product design</p>
        </div>
      </div>
    </a>
  );
}

function LightboxStage() {
  const [image, setImage] = useState<LightboxImage | null>(null);
  return (
    <>
      <button
        type="button"
        onClick={() => setImage({ src: auraCover, alt: "Specimen product interface" })}
        className="group relative block w-full overflow-hidden rounded-md border border-border/50 bg-secondary/30 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Open image lightbox"
      >
        <img src={auraCover} alt="" className="aspect-[16/8] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02] group-focus-visible:scale-[1.02]" />
        <span className="absolute inset-0 grid place-items-center bg-background/15 text-sm text-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 text-body">Inspect image</span>
      </button>
      <ImageLightbox image={image} onClose={() => setImage(null)} />
    </>
  );
}

const COMPONENT_STAGES: Record<string, { description: string; render: () => JSX.Element }> = {
  "component-project-card": {
    description: "Hover or focus the card to inspect its image-led overlay state.",
    render: ProjectCardStage,
  },
  "component-lightbox": {
    description: "Open the production lightbox, then use Escape or Close to return to this trigger.",
    render: LightboxStage,
  },
};

export function hasComponentSpecimen(sectionId: string): boolean {
  return sectionId in COMPONENT_STAGES;
}

export function ComponentSpecimen({ sectionId, contextHref, contextLabel }: ComponentSpecimenProps) {
  const stage = COMPONENT_STAGES[sectionId];
  if (!stage) return null;
  const Stage = stage.render;

  return (
    <Specimen label="Live specimen" description={stage.description} footer={<ContextLink href={contextHref} label={contextLabel} />}>
      <Stage />
    </Specimen>
  );
}
