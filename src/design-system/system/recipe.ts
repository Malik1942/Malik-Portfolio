/**
 * A recipe is how a component describes itself to the system: the same
 * decision split into the three facets the foundations are written in.
 *
 *   form      shape and structure: layout, size, radius, type role, spacing
 *   material  surface and ink: background, border, text tier, focus ring
 *   motion    pace and curve: transition targets, duration, easing
 *
 * Keeping the facets apart is what makes a variant cheap. A "secondary" tone
 * swaps only the material; a "compact" size swaps only the form; reduced
 * motion drops only the motion. Nothing else in the recipe has to be reread.
 *
 * The facets are plain Tailwind class strings, so a recipe is still just a
 * className, and every class inside it resolves to a token variable.
 */
export interface Recipe {
  form?: string;
  material?: string;
  motion?: string;
}

type Facet = Recipe | string | false | null | undefined;

function facetClasses(facet: Facet): string[] {
  if (!facet) return [];
  if (typeof facet === "string") return facet.split(/\s+/).filter(Boolean);
  return [facet.form, facet.material, facet.motion].flatMap((part) =>
    part ? part.split(/\s+/).filter(Boolean) : [],
  );
}

/** Compose recipes and loose class strings into one className, in order. */
function composeRecipe(...facets: Facet[]): string {
  return facets.flatMap(facetClasses).join(" ");
}

/**
 * Define a recipe with named variants per facet. Each variant axis is a
 * record of variant name to the classes that axis contributes.
 *
 *   const button = defineRecipe({
 *     base: { form: "inline-flex ...", material: "...", motion: "..." },
 *     variants: { tone: { primary: {...}, secondary: {...} } },
 *   });
 *   button({ tone: "secondary" })      // className
 */
export function defineRecipe<
  const Variants extends Record<string, Record<string, Recipe>>,
>(definition: { base: Recipe; variants?: Variants }) {
  type Selection = { [Axis in keyof Variants]?: keyof Variants[Axis] };

  const apply = (selection: Selection = {}, extra?: string): string => {
    const chosen = Object.entries(definition.variants ?? {}).map(([axis, options]) => {
      const name = selection[axis as keyof Variants];
      return name === undefined ? undefined : options[name as string];
    });
    return composeRecipe(definition.base, ...chosen, extra);
  };

  return Object.assign(apply, {
    base: definition.base,
    variants: definition.variants ?? ({} as Variants),
  });
}
