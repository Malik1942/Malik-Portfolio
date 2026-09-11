import { defineRecipe } from "@/design-system/system/recipe";

/**
 * "Back" as a quiet inline control: an arrow that nudges left on hover, text
 * in secondary ink that rises to primary. It is a button, not a link, because
 * every host decides where back goes (router navigate, close an overlay,
 * scroll to the list). The 44px minimum height is the touch-target token.
 *
 * `family="mono"` is the utility-page voice (Resume, Oryne support and
 * privacy), where the whole top bar is set in JetBrains Mono.
 */
export const backLinkRecipe = defineRecipe({
  base: {
    form: "group flex items-center gap-2 min-h-11 px-1 rounded-sm text-sm",
    material:
      "text-foreground-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
    motion: "transition-colors duration-fast ease-settle",
  },
  variants: {
    family: {
      body: {},
      mono: { form: "font-mono" },
    },
  },
});
