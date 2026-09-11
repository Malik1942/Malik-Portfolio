import type { ProjectMetaCard } from "@/types/projectDetail";
import { noOrphan } from "@/lib/noOrphan";
import { Eyebrow } from "@/components/ui/Eyebrow";

function MetadataItem({ label, value }: ProjectMetaCard) {
  return (
    <div className="border border-hairline rounded-sm px-5 py-5 md:px-6 md:py-6">
      <Eyebrow className="mb-3">{label}</Eyebrow>
      <p className="text-sm font-normal leading-relaxed text-foreground-secondary whitespace-pre-line">
        {noOrphan(value)}
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
