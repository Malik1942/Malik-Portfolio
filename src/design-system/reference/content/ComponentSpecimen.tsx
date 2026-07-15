import { useState } from "react";
import auraCover from "@/assets/aura-cover.webp";
import motiCard from "@/assets/moti-card.webp";
import { ImageLightbox, type LightboxImage } from "@/components/project-detail/ImageLightbox";
import { ProjectMediaFrame } from "@/components/project-detail/ProjectMediaFrame";
import { ProjectMetadataSummary } from "@/components/project-detail/ProjectMetadataSummary";
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

function SiteHeaderStage() {
  const [active, setActive] = useState("Selected Work");
  return (
    <div className="border-b border-border/45 pb-4">
      <div className="flex items-center justify-between gap-4 text-sm text-body">
        <span className="text-xl italic text-foreground text-display">M</span>
        <div className="flex flex-wrap justify-end gap-x-4 gap-y-2">
          {["Selected Work", "Workshop", "About"].map((item) => (
            <button key={item} type="button" onClick={() => setActive(item)} className={`min-h-[40px] border-b text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${active === item ? "border-foreground text-foreground" : "border-transparent text-foreground/54 hover:text-foreground/80"}`}>
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectListStage() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {[
        [motiCard, "Moti", "Product design"],
        [auraCover, "Aura", "End-to-end experience"],
      ].map(([image, title, role]) => (
        <a key={title} href="#project-list-specimen" onClick={(event) => event.preventDefault()} className="group overflow-hidden rounded-sm border border-border/45 bg-secondary/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <img src={image} alt="" className="aspect-[16/10] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02] group-focus-visible:scale-[1.02]" />
          <div className="p-4"><p className="text-lg text-foreground text-display">{title}</p><p className="mt-1 text-sm text-foreground/56 text-body">{role}</p></div>
        </a>
      ))}
    </div>
  );
}

function MetadataStage() {
  return <ProjectMetadataSummary cards={[{ label: "Role", value: "Product design" }, { label: "Timeline", value: "2024–2025" }, { label: "Scope", value: "Research, strategy, interaction, and visual design" }, { label: "Platform", value: "Web and iOS" }]} />;
}

function MediaFrameStage() {
  return <ProjectMediaFrame fig={{ type: "image", src: auraCover, alt: "Specimen research board" }} />;
}

function FooterStage() {
  return (
    <div className="grid gap-5 border-t border-border/45 pt-5 sm:grid-cols-2">
      <div><p className="text-[10px] uppercase tracking-[0.18em] text-foreground/42 text-mono">Explore</p><div className="mt-3 flex flex-wrap gap-x-4 gap-y-2"><a href="#footer-work" onClick={(event) => event.preventDefault()} className="text-sm text-foreground/72 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Selected Work</a><a href="#footer-about" onClick={(event) => event.preventDefault()} className="text-sm text-foreground/72 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">About</a></div></div>
      <div className="sm:text-right"><p className="text-[10px] uppercase tracking-[0.18em] text-foreground/42 text-mono">Elsewhere</p><p className="mt-3 text-sm text-foreground/62 text-body">A quieter path to the rest of the work.</p></div>
    </div>
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
  "component-site-header": { description: "Select a destination to inspect the compact navigation hierarchy.", render: SiteHeaderStage },
  "component-project-list": { description: "The pair becomes a single reading column as the stage narrows.", render: ProjectListStage },
  "component-metadata-card": { description: "The same production metadata summary keeps context scannable and wrapped.", render: MetadataStage },
  "component-media-frame": { description: "The shared production figure keeps project evidence inside a stable frame.", render: MediaFrameStage },
  "component-footer": { description: "Secondary destinations stay quiet, clear, and separate from page-primary navigation.", render: FooterStage },
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
