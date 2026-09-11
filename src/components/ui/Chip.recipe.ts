import { defineRecipe } from "@/design-system/system/recipe";

/**
 * Chips are small rounded labels that sit in a metadata line.
 *
 * Two kinds of form: `label` is the uppercase eyebrow chip (skills, "Coming
 * soon"); `text` is a sentence-case chip for short phrases inside a case-study
 * module. Four materials: `passive` is low-contrast and inert; `lead` is the
 * same shape a tier brighter; `link` carries a filled surface and stronger ink
 * so it reads as clickable at a glance (LinkChip); `toggle` rests as passive
 * and lifts on hover, then takes the link material while pressed (ChipButton,
 * the skill lens control).
 */
export const chipRecipe = defineRecipe({
  base: {
    form: "inline-flex items-center rounded-full whitespace-nowrap",
    material: "border border-hairline",
  },
  variants: {
    kind: {
      label: { form: "px-2 py-1 text-label uppercase tracking-eyebrow leading-none" },
      text: { form: "px-4 py-2 text-sm", material: "" },
    },
    tone: {
      passive: { material: "text-foreground-tertiary" },
      lead: { material: "text-foreground-lead" },
      link: {
        material:
          "bg-surface-wash text-foreground-lead hover:border-border hover:bg-surface-wash-strong hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-strong focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        motion: "transition-[background-color,border-color,color] duration-medium ease-settle",
      },
      toggle: {
        material:
          "cursor-pointer text-foreground-tertiary hover:border-border hover:text-foreground-lead aria-pressed:border-border aria-pressed:bg-surface-wash-strong aria-pressed:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-strong focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        motion: "transition-[background-color,border-color,color] duration-medium ease-settle",
      },
    },
  },
});
