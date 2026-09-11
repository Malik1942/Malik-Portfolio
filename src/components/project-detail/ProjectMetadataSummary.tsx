import type { ProjectMetaCard } from "@/types/projectDetail";
import { noOrphan } from "@/lib/noOrphan";
import { Eyebrow } from "@/components/ui/Eyebrow";

// A separator that wraps onto the next line reads as a stray dot, so each
// " ·" is glued to the item before it and a break can only fall after it.
const glueSeparators = (value: string) => value.replace(/ · /g, "\u00a0· ");

function MetadataItem({ label, value }: ProjectMetaCard) {
  return (
    <div className="border border-hairline bg-secondary/[0.07] rounded-sm px-5 py-5 md:px-6 md:py-6">
      <Eyebrow className="mb-3">{label}</Eyebrow>
      <p className="text-sm font-normal leading-relaxed text-foreground-secondary whitespace-pre-line">
        {noOrphan(glueSeparators(value))}
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
