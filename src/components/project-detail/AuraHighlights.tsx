// Highlight chips for the Aura case study — mirrors Moti's hook highlights
// (same rounded-full pill + site tokens). Content is drawn from Aura's own copy,
// avoiding what the hero subtitle / meta cards already state.
const highlights = [
  "Proactive, not reactive",
  "Sense → predict → support",
  "100 Hz audio intervention",
  "93.75% preferred the refined form",
];

export function AuraHighlights() {
  return (
    <div className="flex flex-wrap gap-2.5">
      {highlights.map((c) => (
        <span
          key={c}
          className="inline-flex items-center rounded-full border border-border/50 bg-secondary/[0.08] px-3.5 py-1.5 text-[12px] md:text-[13px] text-foreground/72 text-body"
        >
          {c}
        </span>
      ))}
    </div>
  );
}

export default AuraHighlights;
