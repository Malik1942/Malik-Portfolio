import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { tokenBundle } from "../../generated/token-manifest.generated";
import { DURATION, EASE, MOTION } from "../../system/motion";
import type { TokenRecord } from "../../tokens/types";
import { TokenTable } from "../TokenTable";
import { Specimen } from "../Specimen";
import { Eyebrow } from "@/components/ui/Eyebrow";

/**
 * Motion is pace and curve. Six durations say how long, six easings say how,
 * and five recipes pair them for the situations the interface repeats. The
 * same tokens reach CSS (var(--duration-fast)), Tailwind (duration-fast) and
 * Framer Motion (DURATION.fast) so one edit moves all three.
 */

const RECIPES = [
  { key: "enter", label: "Enter", when: "Something arrives in the viewport: a card, a paragraph, a figure.", css: "duration-reveal ease-enter" },
  { key: "move", label: "Move", when: "Something changes place or size: a route, a lightbox image, a card lift.", css: "duration-page ease-move" },
  { key: "fade", label: "Fade", when: "Something appears or leaves in place: a backdrop, a menu, a caption.", css: "duration-medium ease-settle" },
  { key: "respond", label: "Respond", when: "Something answers the pointer: a color, an arrow nudge, a chip fill.", css: "duration-fast ease-settle" },
  { key: "ambient", label: "Ambient", when: "Something breathes on its own: an orb, a cursor, a pulse.", css: "duration-ambient ease-ambient" },
] as const;

type RecipeKey = (typeof RECIPES)[number]["key"];

function tokensForPrefix(prefix: string): TokenRecord[] {
  return tokenBundle.tokens
    .filter((token) => token.path.startsWith(prefix))
    .slice()
    .sort((left, right) => left.path.localeCompare(right.path));
}

function RecipeStage() {
  const reduce = useReducedMotion();
  const [playing, setPlaying] = useState<RecipeKey | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!playing || playing === "ambient") return;
    const timer = window.setTimeout(() => setPlaying(null), MOTION[playing].duration * 1000 + 120);
    return () => window.clearTimeout(timer);
  }, [playing, tick]);

  const play = (key: RecipeKey) => {
    if (reduce) return;
    setPlaying((current) => (key === "ambient" && current === "ambient" ? null : key));
    setTick((value) => value + 1);
  };

  const animate = (() => {
    if (reduce) return { opacity: 1, x: 0, y: 0, scale: 1 };
    switch (playing) {
      case "enter": return { opacity: [0, 1], y: [16, 0], x: 0, scale: 1 };
      case "move": return { x: [0, 96], y: 0, opacity: 1, scale: 1 };
      case "fade": return { opacity: [0, 1], x: 0, y: 0, scale: 1 };
      case "respond": return { scale: [1, 0.94, 1], opacity: 1, x: 0, y: 0 };
      case "ambient": return { scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7], x: 0, y: 0 };
      default: return { opacity: 1, x: 0, y: 0, scale: 1 };
    }
  })();

  const transition = playing ? { ...MOTION[playing] } : { duration: 0 };

  return (
    <div data-testid="motion-recipe-stage" data-playing={playing ?? "none"} data-reduced-motion={reduce ? "true" : "false"} className="space-y-5">
      <div className="flex min-h-[144px] items-center overflow-hidden rounded-sm border border-hairline p-6">
        <motion.div
          key={tick}
          animate={animate}
          transition={transition}
          className="h-14 w-14 rounded-2xl bg-foreground"
          aria-hidden="true"
        />
        <p className="ml-6 max-w-measure-narrow text-sm text-foreground-secondary">
          {playing ? RECIPES.find((recipe) => recipe.key === playing)?.when : "Pick a recipe to replay it. Each pairs one duration with one curve."}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {RECIPES.map((recipe) => (
          <button
            key={recipe.key}
            type="button"
            onClick={() => play(recipe.key)}
            aria-pressed={playing === recipe.key}
            className={`min-h-11 rounded-sm border px-4 text-sm transition-colors duration-fast ease-settle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus ${
              playing === recipe.key ? "border-foreground-lead text-foreground" : "border-hairline text-foreground-secondary hover:text-foreground"
            }`}
          >
            {recipe.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function MotionFoundation() {
  return (
    <div data-testid="reference-foundation-motion" className="space-y-12 md:space-y-16">
      <div className="max-w-reading space-y-4">
        <p className="text-base leading-relaxed text-foreground-secondary md:text-xl">
          Durations describe pace and curves describe intent. A recipe pairs
          one of each for a situation the interface repeats, so a component
          names the situation instead of picking numbers.
        </p>
        <p className="text-sm leading-relaxed text-foreground-tertiary">
          Reduced motion stays authoritative: the recipes settle to their final
          state, and the hero entrance, DotGrid, and About choreography keep
          the local timings their sequences were tuned with.
        </p>
      </div>

      <Specimen
        label="Live specimen"
        description="Replay each recipe. Under reduced motion the stage holds its settled state."
      >
        <RecipeStage />
      </Specimen>

      <section aria-labelledby="motion-recipes" className="space-y-5">
        <div className="max-w-reading space-y-2">
          <Eyebrow as="h2" id="motion-recipes" tone="secondary">Recipes</Eyebrow>
          <p className="text-sm leading-relaxed text-foreground-tertiary">
            The same five pairs in each of the three places motion is written.
          </p>
        </div>
        <div className="min-w-0 overflow-x-auto rounded-lg border border-hairline">
          <table className="w-full min-w-[560px] border-collapse text-left text-sm">
            <caption className="sr-only">Motion recipes</caption>
            <thead>
              <tr className="border-b border-hairline">
                {["Recipe", "Use when", "Tailwind", "Framer Motion"].map((heading) => (
                  <th key={heading} scope="col" className="px-4 py-3 text-label uppercase tracking-eyebrow font-normal text-foreground-tertiary">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECIPES.map((recipe) => {
                const pair = MOTION[recipe.key];
                return (
                  <tr key={recipe.key} className="border-b border-hairline-faint last:border-b-0 align-top">
                    <th scope="row" className="px-4 py-3 font-medium text-foreground">{recipe.label}</th>
                    <td className="max-w-measure-narrow px-4 py-3 leading-relaxed text-foreground-secondary">{recipe.when}</td>
                    <td className="px-4 py-3"><code className="font-mono text-foreground-secondary">{recipe.css}</code></td>
                    <td className="px-4 py-3">
                      <code className="font-mono text-foreground-secondary">
                        MOTION.{recipe.key} · {pair.duration}s · [{pair.ease.join(", ")}]
                      </code>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-5">
        <div className="max-w-reading space-y-2">
          <Eyebrow as="h2" tone="secondary">Durations</Eyebrow>
          <p className="text-sm leading-relaxed text-foreground-tertiary">
            Six paces from a pointer answer ({DURATION.fast}s) to an ambient loop ({DURATION.ambient}s).
          </p>
        </div>
        <TokenTable title="Duration tokens" tokens={tokensForPrefix("duration.")} />
      </section>

      <section className="space-y-5">
        <div className="max-w-reading space-y-2">
          <Eyebrow as="h2" tone="secondary">Easings</Eyebrow>
          <p className="text-sm leading-relaxed text-foreground-tertiary">
            Enter and move are the expressive curves; settle, exit, standard, and ambient are the
            plain ones. The enter curve starts at [{EASE.enter.join(", ")}].
          </p>
        </div>
        <TokenTable title="Easing tokens" tokens={tokensForPrefix("ease.")} />
      </section>
    </div>
  );
}
