import type { ProjectMetaCard } from "@/types/projectDetail";

function MetadataItem({ label, value }: ProjectMetaCard) {
  return (
    <div className="border border-border/40 bg-secondary/[0.07] rounded-sm px-5 py-5 md:px-6 md:py-6">
      <p className="text-label uppercase tracking-eyebrow text-foreground/55 mb-3">
        {label}
      </p>
      <p className="text-sm font-normal leading-relaxed text-foreground/72">
        {value}
      </p>
    </div>
  );
}

export function ProjectMetadataSummary({ cards }: { cards: ProjectMetaCard[] }) {
  return (
    <div data-testid="project-metadata-summary" className="grid grid-cols-2 gap-3 md:gap-4">
      {cards.map((card) => <MetadataItem key={card.label} {...card} />)}
    </div>
  );
}
