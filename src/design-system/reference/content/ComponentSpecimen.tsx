import { useState } from "react";
import auraCover from "@/assets/aura-cover.webp";
import motiCard from "@/assets/moti-card.webp";
import logo from "@/assets/logo.webp";
import { ImageLightbox, type LightboxImage } from "@/components/project-detail/ImageLightbox";
import { ProjectMediaFrame } from "@/components/project-detail/ProjectMediaFrame";
import { FigureCaption } from "@/components/project-detail/FigureCaption";
import { ProjectMetadataSummary } from "@/components/project-detail/ProjectMetadataSummary";
import { NAV_ITEMS, navItemHref } from "@/lib/sections";
import { ArrowUpRight, Mail } from "lucide-react";
import { BackLink } from "@/components/ui/BackLink";
import { Button } from "@/components/ui/Button";
import { Chip, LinkChip } from "@/components/ui/Chip";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { TextLink } from "@/components/ui/TextLink";
import { Specimen } from "../Specimen";

interface ComponentSpecimenProps {
  sectionId: string;
  contextHref: string;
  contextLabel: string;
}

function ContextLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} className="inline-flex min-h-11 items-center text-sm text-foreground-secondary transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
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
      className="group relative block overflow-hidden rounded-lg border border-hairline bg-secondary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
    >
      <img src={motiCard} alt="Moti mobile product interface" className="aspect-[16/9] w-full object-cover transition-transform duration-medium group-hover:scale-[1.025] group-focus-visible:scale-[1.025]" />
      <div className={`absolute inset-0 flex items-end bg-gradient-to-t from-background via-background/15 to-transparent p-5 transition-opacity duration-fast ${active ? "opacity-100" : "opacity-75"}`}>
        <div>
          <p className="text-label uppercase tracking-eyebrow text-foreground-tertiary font-mono">Selected work · 2025</p>
          <p className="mt-2 text-xl font-medium tracking-tight text-foreground">Moti</p>
          <p className="mt-1 text-sm text-foreground-secondary">Product design</p>
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
        className="group relative block w-full overflow-hidden rounded-lg border border-hairline bg-secondary/30 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        aria-label="Open image lightbox"
      >
        <img src={auraCover} alt="" className="aspect-[16/8] w-full object-cover transition-transform duration-medium group-hover:scale-[1.02] group-focus-visible:scale-[1.02]" />
        <span className="absolute inset-0 grid place-items-center bg-background/15 text-sm text-foreground opacity-0 transition-opacity duration-fast group-hover:opacity-100 group-focus-visible:opacity-100">Inspect image</span>
      </button>
      <ImageLightbox image={image} onClose={() => setImage(null)} />
    </>
  );
}

// Production nav destinations, in production order. Links are inert here —
// the stage demonstrates the hover behavior, not navigation.
const SITE_HEADER_DESTINATIONS: readonly [string, string][] = [
  ...NAV_ITEMS.map((item): [string, string] => [
    item.label,
    navItemHref(item, "/"),
  ]),
  ["About", "/#about"],
  ["Resume", "/resume"],
];

function SiteHeaderStage() {
  return (
    // Full-bleed inside the specimen stage: cancel the card padding so the
    // header and its divider span the component's full width, like production.
    <div className="-mx-5 -mt-5 border-b border-hairline px-5 pb-4 pt-5 sm:-mx-6 sm:-mt-6 sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between gap-4">
        <a
          href="/"
          aria-label="Malik Zhang, home"
          onClick={(event) => event.preventDefault()}
          className="inline-block w-fit shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          <img src={logo} alt="Malik Zhang" className="h-6 w-auto select-none" />
        </a>
        {/* Same classes as the production SiteHeader links: the .nav-link
            underline sweep and 500ms color transition are the real behavior,
            including production's documented focus-ring and target-size gaps. */}
        <nav aria-label="Site header destinations" className="flex flex-wrap justify-end gap-x-5 gap-y-2 text-sm text-foreground-secondary">
          {SITE_HEADER_DESTINATIONS.map(([label, href]) => (
            <TextLink key={label} href={href} onClick={(event) => event.preventDefault()}>
              {label}
            </TextLink>
          ))}
        </nav>
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
        <a key={title} href="#project-list-specimen" onClick={(event) => event.preventDefault()} className="group overflow-hidden rounded-sm border border-hairline bg-secondary/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
          <img src={image} alt="" className="aspect-[16/10] w-full object-cover transition-transform duration-medium group-hover:scale-[1.02] group-focus-visible:scale-[1.02]" />
          <div className="p-4"><p className="text-xl tracking-tight text-foreground">{title}</p><p className="mt-1 text-sm text-foreground-tertiary">{role}</p></div>
        </a>
      ))}
    </div>
  );
}

function MetadataStage() {
  return <ProjectMetadataSummary cards={[{ label: "Role", value: "Product design" }, { label: "Timeline", value: "2024–2025" }, { label: "Scope", value: "Research, strategy, interaction, and visual design" }, { label: "Platform", value: "Web and iOS" }]} />;
}

function MediaFrameStage() {
  return (
    <figure>
      <ProjectMediaFrame fig={{ type: "image", src: auraCover, alt: "Specimen research board" }} />
      <FigureCaption label="Research board">where the evidence was pinned before it became a direction</FigureCaption>
    </figure>
  );
}

function FooterStage() {
  return (
    <div className="grid gap-5 border-t border-hairline pt-5 sm:grid-cols-2">
      <div><p className="text-label uppercase tracking-eyebrow text-foreground-tertiary font-mono">Explore</p><div className="mt-3 flex flex-wrap gap-x-4 gap-y-2"><a href="#footer-work" onClick={(event) => event.preventDefault()} className="text-sm text-foreground-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Selected Work</a><a href="#footer-about" onClick={(event) => event.preventDefault()} className="text-sm text-foreground-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">About</a></div></div>
      <div className="sm:text-right"><p className="text-label uppercase tracking-eyebrow text-foreground-tertiary font-mono">Elsewhere</p><p className="mt-3 text-sm text-foreground-secondary">A quieter path to the rest of the work.</p></div>
    </div>
  );
}

function EyebrowStage() {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      <div>
        <Eyebrow>Selected work</Eyebrow>
        <p className="mt-2 text-sm text-foreground-secondary">tertiary, body</p>
      </div>
      <div>
        <Eyebrow tone="secondary">Photography</Eyebrow>
        <p className="mt-2 text-sm text-foreground-secondary">secondary, body</p>
      </div>
      <div>
        <Eyebrow family="mono">malik@portfolio:~$</Eyebrow>
        <p className="mt-2 text-sm text-foreground-secondary">tertiary, mono</p>
      </div>
      <div>
        <Eyebrow scale="section" tone="primary">More work</Eyebrow>
        <p className="mt-2 text-sm text-foreground-secondary">section, primary</p>
      </div>
    </div>
  );
}

function ChipStage() {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
      <span className="text-sm text-foreground-secondary">Product designer · 2026</span>
      <LinkChip link={{ label: "App Store", url: "#chip-specimen" }} />
      <Chip>Coming soon</Chip>
      <Chip>Interaction</Chip>
      <Chip>Strategy</Chip>
      <Chip kind="text" tone="lead">Plan the day out loud</Chip>
    </div>
  );
}

function ButtonStage() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button href="#button-specimen" icon={<ArrowUpRight strokeWidth={1.8} />} onClick={(event) => event.preventDefault()}>
        View on the App Store
      </Button>
      <Button href="#button-specimen" tone="secondary" iconPosition="leading" icon={<Mail strokeWidth={1.5} />} onClick={(event) => event.preventDefault()}>
        Email support
      </Button>
      <Button tone="secondary">Replay</Button>
    </div>
  );
}

function BackLinkStage() {
  return (
    <div className="flex flex-wrap items-center gap-8">
      <BackLink aria-label="Back to home">Back to home</BackLink>
      <BackLink family="mono" aria-label="Back to home">Back</BackLink>
    </div>
  );
}

function TextLinkStage() {
  const stop = (event: { preventDefault: () => void }) => event.preventDefault();
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      <div className="flex gap-x-6 text-base text-foreground-secondary">
        <TextLink href="#text-link-specimen" onClick={stop}>Work</TextLink>
        <TextLink href="#text-link-specimen" onClick={stop}>Studio</TextLink>
        <TextLink href="#text-link-specimen" onClick={stop}>About</TextLink>
      </div>
      <div className="flex flex-col gap-4">
        <TextLink href="#text-link-specimen" tone="secondary" size="sm" onClick={stop}>Resume</TextLink>
        <TextLink as="button" tone="secondary" size="sm" className="text-left">About</TextLink>
      </div>
      <div>
        <TextLink href="#text-link-specimen" tone="primary" onClick={stop}>malikzhang19@gmail.com</TextLink>
        <p className="mt-2 text-sm text-foreground-tertiary">primary tone</p>
      </div>
    </div>
  );
}

const COMPONENT_STAGES: Record<string, { description: string; render: () => JSX.Element }> = {
  "component-text-link": {
    description: "Hover any link for the underline sweep. The first row inherits its ink from the container, as the header does.",
    render: TextLinkStage,
  },
  "component-eyebrow": {
    description: "Three settings of one label: the two ink tiers and the mono family.",
    render: EyebrowStage,
  },
  "component-chip": {
    description: "A metadata line as the card renders it: the outbound link chip reads as clickable, the skill chips do not.",
    render: ChipStage,
  },
  "component-button": {
    description: "Hover the primary pill for the ink lift and the arrow nudge; the secondary control brightens only its border.",
    render: ButtonStage,
  },
  "component-back-link": {
    description: "Hover to see the arrow nudge left and the ink rise from secondary to primary.",
    render: BackLinkStage,
  },
  "component-project-card": {
    description: "Hover or focus the card to inspect its image-led overlay state.",
    render: ProjectCardStage,
  },
  "component-lightbox": {
    description: "Open the production lightbox, then use Escape or Close to return to this trigger.",
    render: LightboxStage,
  },
  "component-site-header": { description: "Hover a destination for the production underline sweep; fixed positioning and scroll behavior stay in production context.", render: SiteHeaderStage },
  "component-project-list": { description: "The pair becomes a single reading column as the stage narrows.", render: ProjectListStage },
  "component-metadata-card": { description: "The same production metadata summary keeps context scannable and wrapped.", render: MetadataStage },
  "component-media-frame": { description: "The shared production figure keeps project evidence inside a stable frame.", render: MediaFrameStage },
  "component-footer": { description: "Secondary destinations stay quiet, clear, and separate from page-primary navigation.", render: FooterStage },
};

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
