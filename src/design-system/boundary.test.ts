import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The system boundary, enforced.
 *
 * tailwind.config.ts replaces Tailwind's default scales for font size, radius,
 * duration, and easing, so an off-system class (text-lg, duration-150) simply
 * generates nothing. Tailwind never warns. This test does: it scans the
 * source for the classes and literals that would silently fall outside the
 * system, so a slip fails the build instead of shipping as a no-op.
 *
 * Art-directed exemptions are listed explicitly rather than tolerated
 * globally, so each one stays a decision.
 */

const ROOT = process.cwd();
const SOURCE_DIRS = ["src/components", "src/pages", "src/design-system", "src/App.tsx", "src/main.tsx"];

// Canvas-drawn and scene-specific code that the decisions doc keeps expressive.
const EXPRESSIVE_FILES = new Set([
  "src/components/DotGrid.tsx",
  "src/components/AboutDeepContent.tsx",
  "src/components/AboutOverlay.tsx",
  "src/components/BoulderWall.tsx",
  "src/components/HeroSection.tsx",
]);

// Sequences tuned as a whole: their durations stay local by decision, on the
// token curves. Everything else names a DURATION or a MOTION recipe.
const CHOREOGRAPHED_FILES = new Set([
  "src/components/DotGrid.tsx",
  "src/components/HeroSection.tsx",
  "src/components/SiteHeader.tsx",
  "src/components/AboutDeepContent.tsx",
  "src/components/AboutEditorialSection.tsx",
  "src/components/AboutOverlay.tsx",
  "src/components/BoulderWall.tsx",
  // The CalmMouse demo loop is a four-second product demonstration.
  "src/components/project-detail/CalmMouseModules.tsx",
]);

// The case-study section guide sets 10 to 11px type at 0.16 to 0.25em: an
// art-directed lettering kept off the label and eyebrow scale on purpose.
const CASE_STUDY_GUIDE = "src/components/project-detail/ProjectDetailTemplate.tsx";

// Measures deliberately kept off the measure scale.
const MEASURE_EXEMPTIONS: Record<string, string[]> = {
  // 36ch is the About editorial description, tuned with authored line breaks.
  "src/components/AboutEditorialSection.tsx": ["max-w-[36ch]"],
  // 43ch is the hero terminal statement: wide enough for "…and build", one
  // character short of "…and build it", so the line breaks where it was written.
  "src/components/HeroSection.tsx": ["max-w-[43ch]"],
  // The Oryne pages' lead and contact paragraphs were wrapped by hand at 60
  // and 62ch; the body measure (64ch) breaks "On-device" at the hyphen.
  "src/pages/OryneSupport.tsx": ["max-w-[60ch]"],
  "src/pages/OrynePrivacy.tsx": ["max-w-[62ch]"],
};

interface Rule {
  name: string;
  pattern: RegExp;
  hint: string;
  /** Files where this rule does not apply. */
  exempt?: (file: string) => boolean;
}

const RULES: Rule[] = [
  {
    name: "off-system font size",
    pattern: /\b(?:[a-z-]+:)*text-(?:xs|lg|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)\b/g,
    hint: "Use text-caption, text-sm, text-base, text-xl, text-title, text-heading, text-display, or text-hero.",
  },
  {
    name: "off-system radius",
    pattern: /\brounded-(?:md|xl|3xl)\b/g,
    hint: "Use rounded-sm, rounded-lg, rounded-2xl, or rounded-full.",
  },
  {
    name: "numeric transition duration",
    pattern: /\bduration-\d+\b/g,
    hint: "Use duration-fast, duration-medium, duration-slow, duration-page, duration-reveal, or duration-ambient.",
  },
  {
    name: "Tailwind default easing",
    pattern: /\bease-(?:linear|in|out|in-out)\b/g,
    hint: "Use ease-enter, ease-move, ease-standard, ease-settle, ease-exit, or ease-ambient.",
  },
  {
    name: "default palette color",
    pattern: /\b(?:bg|text|border|ring|fill|stroke|from|to|via|divide|outline|shadow)-(?:white|black|zinc|neutral|gray|slate|stone|red|amber|emerald|violet|blue|green|yellow|orange|rose|pink|purple|indigo|sky|cyan|teal|lime)(?:-\d{2,3})?(?:\/[\d.[\]]+)?\b/g,
    hint: "Use a token color: foreground tiers, background, surfaces, hairline, focus, accents.",
  },
  {
    name: "ink as a raw opacity",
    pattern: /\btext-foreground\/\d+\b/g,
    hint: "Use the ink ladder: text-foreground, -lead, -secondary, -tertiary, or -quiet.",
  },
  {
    name: "focus ring as a raw opacity",
    pattern: /\bring-foreground\/\d+\b|\bring-ring\b/g,
    hint: "Use ring-focus, or ring-focus-strong over media and filled surfaces.",
  },
  {
    name: "hairline as a raw opacity",
    pattern: /\bborder-border\/\d+\b/g,
    hint: "Use border-hairline or border-hairline-faint.",
  },
  {
    name: "arbitrary tracking",
    pattern: /\btracking-\[[^\]]+\]/g,
    hint: "Use tracking-tight, tracking-normal, or tracking-eyebrow.",
    exempt: (file) => file === CASE_STUDY_GUIDE,
  },
  {
    name: "arbitrary measure",
    pattern: /\bmax-w-\[\d+ch\]/g,
    hint: "Use max-w-measure-narrow, max-w-measure, or max-w-measure-wide.",
    exempt: (file) => (MEASURE_EXEMPTIONS[file] ?? []).length > 0,
  },
  {
    name: "arbitrary font size",
    pattern: /\btext-\[\d+(?:\.\d+)?px\]/g,
    hint: "Use a type role. The case-study section guide is the one art-directed exception.",
    exempt: (file) => file === CASE_STUDY_GUIDE,
  },
  {
    name: "color literal",
    pattern: /#[0-9a-fA-F]{6}\b|\brgba?\(\s*\d|\bhsla?\(\s*\d/g,
    hint: "Reference a token variable: hsl(var(--color-…)).",
    // ContrastChecks names the #0a0a0a boot canvas from index.html in prose.
    exempt: (file) => EXPRESSIVE_FILES.has(file) || file === "src/design-system/workbench/ContrastChecks.tsx",
  },
  {
    name: "arbitrary stacking order",
    pattern: /\bz-\[-?\d+\]/g,
    hint: "Use a layer (z-header, z-guide, z-overlay, z-modal) or a bare local step (z-1, z-2, z-10, z-20, z-40).",
  },
  {
    name: "layout width written as pixels when a token exists",
    pattern: /\bmax-w-\[(?:1400|1200|900|760)px\]/g,
    hint: "Use max-w-page, max-w-content, max-w-reference, or max-w-reading.",
  },
  {
    name: "rhythm pair written by hand",
    pattern: /\b(?:mt|mb|pt|pb|py|gap|gap-y)-(?:16 md:(?:mt|mb|pt|pb|py|gap|gap-y)-20|14 md:(?:mt|mb|pt|pb|py|gap|gap-y)-18|10 md:(?:mt|mb|pt|pb|py|gap|gap-y)-12|5 md:(?:mt|mb|pt|pb|py|gap|gap-y)-6)\b/g,
    hint: "Use the rhythm utility: -section, -module, -stack, or -caption.",
  },
  {
    name: "spacing step that is not on the scale",
    // Tailwind's spacing scale skips these numbers, so md:mt-18 generates
    // nothing. That is how the module rhythm shipped at 56px on desktop.
    pattern: /\b(?:[a-z]+:)?(?:-?(?:m|p)[trblxy]?|gap(?:-[xy])?|space-[xy]|w|h|min-w|min-h|top|bottom|left|right|inset(?:-[xy])?)-(?:13|15|17|18|19|2[1-3]|2[5-7]|29|3[013-5]|3[7-9]|4[1-3]|4[5-7]|49|5[013-5]|5[7-9]|6[1-3]|6[5-9]|7[013-9]|8[1-9]|9[0-5]|9[7-9])\b/g,
    hint: "Use a step Tailwind defines (…12, 14, 16, 20, 24, 28, 32…) or a rhythm utility.",
  },
  {
    name: "arbitrary line height",
    pattern: /\bleading-\[[^\]]+\]/g,
    hint: "Use leading-none, -tight, -snug, -normal, or -relaxed.",
  },
  {
    name: "Framer duration literal outside a choreographed file",
    pattern: /\bduration:\s*(?:reduce(?:d(?:Motion)?)?\s*\?\s*0\s*:\s*)?(?!0(?![\d.]))\d*\.?\d+(?![\d.])/g,
    hint: "Use DURATION.* or a MOTION recipe. Choreographed sequences are exempt by file name.",
    exempt: (file) => CHOREOGRAPHED_FILES.has(file),
  },
  {
    name: "Framer easing by name or literal",
    pattern: /ease:\s*(?:"ease(?:In|Out|InOut)"|\[\s*[\d.]+\s*,)/g,
    hint: "Import EASE from @/design-system/system/motion.",
  },
];

function walk(path: string, files: string[] = []): string[] {
  const stats = statSync(path);
  if (stats.isFile()) {
    if (/\.(ts|tsx)$/.test(path) && !/\.test\.tsx?$/.test(path) && !path.includes("/generated/")) {
      files.push(path);
    }
    return files;
  }
  for (const entry of readdirSync(path)) walk(join(path, entry), files);
  return files;
}

function sourceFiles(): string[] {
  return SOURCE_DIRS.flatMap((dir) => walk(join(ROOT, dir))).map((file) => relative(ROOT, file));
}

describe("design-system boundary", () => {
  const files = sourceFiles();

  it("scans the production source", () => {
    expect(files.length).toBeGreaterThan(40);
  });

  for (const rule of RULES) {
    it(`has no ${rule.name}`, () => {
      const offenders: string[] = [];
      for (const file of files) {
        if (rule.exempt?.(file)) continue;
        const source = readFileSync(join(ROOT, file), "utf8");
        const lines = source.split("\n");
        lines.forEach((line, index) => {
          const matches = line.match(rule.pattern);
          if (matches) offenders.push(`${file}:${index + 1}  ${matches.join(" ")}`);
        });
      }
      expect(offenders, `${rule.hint}\n${offenders.join("\n")}`).toEqual([]);
    });
  }

  it("keeps the measure exemptions honest", () => {
    for (const [file, allowed] of Object.entries(MEASURE_EXEMPTIONS)) {
      const source = readFileSync(join(ROOT, file), "utf8");
      const found = source.match(/\bmax-w-\[\d+ch\]/g) ?? [];
      expect(found.every((match) => allowed.includes(match)), `${file} uses ${found.join(", ")}`).toBe(true);
    }
  });
});
