import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { sourceFiles } from "@/test/sourceFiles";

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

// A simulated device interface, not this site's. FlowPrintHmi draws a 3D
// printer's own touchscreen inside the case study: its black ground, white
// type, and tighter tracking belong to that machine, and putting them on the
// portfolio's ink ladder would make the case study show a screen the product
// does not have. Treated the same way the CalmMouse demo loop is treated
// below, and scoped to the colour and tracking rules only: the file still
// answers to the type scale, radius, spacing, and motion tokens.
const SIMULATED_DEVICE_UI = "src/components/project-detail/FlowPrintHmi.tsx";

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

const OPACITY_RULE = "color opacity modifier off Tailwind's scale";

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
    exempt: (file) => file === SIMULATED_DEVICE_UI,
  },
  {
    name: OPACITY_RULE,
    // Tailwind only generates modifiers on theme.opacity, which ships in fives.
    // bg-background/92 produced no CSS at all: the photography lightbox had
    // no backdrop until it was noticed.
    //
    // So the rule flags a bare modifier only when it is off that scale.
    // tailwind.config.ts does not touch theme.opacity, so the scale is the v3
    // default: 0, every multiple of five, and 100. The negative lookahead
    // spells that set out; anything else — /7, /13, /72, /92, /101, /92.5 —
    // emits nothing and is an offender. A bracketed value never matches,
    // because Tailwind resolves those itself.
    pattern: /\b(?:bg|text|border|ring|from|to|via|divide|outline|fill|stroke)-[a-z-]+\/(?!(?:100|[1-9][05]|[05])(?![\d.]))\d+(?:\.\d+)?(?![\d.\]])/g,
    hint: "Use a multiple of 5, an arbitrary value in brackets, or a token role.",
    exempt: () => false,
  },
  {
    name: "ink as a raw opacity",
    // Both notations, because a bracketed alpha bypasses the ladder just as
    // completely as a bare one: text-foreground/[0.72] is the secondary tier
    // written by hand, out of reach of the token that owns it.
    pattern: /\btext-foreground\/(?:\d+|\[[^\]]+\])/g,
    hint: "Use the ink ladder: text-foreground, -lead, -secondary, -tertiary, or -quiet.",
  },
  {
    name: "focus ring as a raw opacity",
    pattern: /\bring-foreground\/(?:\d+|\[[^\]]+\])|\bring-ring\b/g,
    hint: "Use ring-focus, or ring-focus-strong over media and filled surfaces.",
  },
  {
    name: "hairline as a raw opacity",
    pattern: /\bborder-border\/(?:\d+|\[[^\]]+\])/g,
    hint: "Use border-hairline or border-hairline-faint.",
  },
  {
    name: "surface wash as a raw opacity",
    // bg-secondary/10 resolved to rgb(11,11,11) on an rgb(10,10,10) canvas: a
    // 1/255 difference, which is to say nothing. Thirty-seven call sites
    // carried it in six spellings that all rendered the same, and that was
    // the look: cards, media wells, and panels are outline-only here, a
    // hairline on the canvas with nothing inside. So the class is not
    // replaced, it is removed. A fill that is meant to show is a role.
    pattern: /\bbg-secondary\/(?:\d+|\[[^\]]+\])/g,
    hint: "Surfaces are outline-only: drop the fill. A fill that should show is bg-surface-wash or -wash-strong.",
  },
  {
    name: "control edge or rule as a raw opacity",
    // border-foreground carried two different jobs at ten different values:
    // structural rules, and the state of a control. They are separate ladders
    // now, because a selected state flattened into a hairline stops reading.
    pattern: /\bborder-foreground\/(?:\d+|\[[^\]]+\])/g,
    hint: "Rules: border-hairline, -hairline-faint, or border-border. States: border-control-quiet, -control, -control-strong, -control-selected.",
  },
  {
    name: "alpha written as an arbitrary value",
    // The bracket is the escape hatch that let the surface and border families
    // drift to thirteen values. It stays open for the one file that draws a
    // machine's own interface, and is closed everywhere else: a portfolio
    // surface that needs a new alpha needs a role, not a number at a call site.
    pattern: /\b(?:bg|text|border|ring|from|to|via|divide|outline|fill|stroke)-[a-z-]+\/\[[^\]]+\]/g,
    hint: "Use a token role. FlowPrintHmi is the one art-directed exception.",
    exempt: (file) => file === SIMULATED_DEVICE_UI,
  },
  {
    name: "arbitrary tracking",
    pattern: /\btracking-\[[^\]]+\]/g,
    hint: "Use tracking-tight, tracking-normal, or tracking-eyebrow.",
    exempt: (file) => file === CASE_STUDY_GUIDE || file === SIMULATED_DEVICE_UI,
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
    exempt: (file) =>
      EXPRESSIVE_FILES.has(file) ||
      file === SIMULATED_DEVICE_UI ||
      file === "src/design-system/workbench/ContrastChecks.tsx",
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

describe("design-system boundary", () => {
  const files = sourceFiles(SOURCE_DIRS, ROOT);

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

  // A guardrail that flags working classes is a guardrail nobody can keep
  // green, so the opacity rule is pinned to the scale Tailwind actually
  // generates. Verified against this repo's Tailwind (3.4.19, theme.opacity
  // not overridden, so the v3 default: 0 and every multiple of five to 100) by
  // building these very classes: /7, /13, /72 and /92 emit no CSS at all,
  // while /0, /15, /40, /95, /100 and bracketed values emit it.
  it("flags only the opacity modifiers that generate no CSS", () => {
    const rule = RULES.find((candidate) => candidate.name === OPACITY_RULE)!;
    const flagged = (className: string) => (className.match(rule.pattern) ?? []).length > 0;

    for (const dead of ["bg-background/92", "text-accent-violet/72", "bg-card/7", "border-foreground/13", "bg-secondary/101"]) {
      expect(flagged(dead), `${dead} generates no CSS and has to be flagged`).toBe(true);
    }
    for (const live of ["bg-secondary/10", "text-accent-violet/70", "bg-card/40", "bg-background/0", "bg-secondary/100", "bg-foreground/[0.06]", "bg-card/[13%]"]) {
      expect(flagged(live), `${live} generates CSS and must not be flagged`).toBe(false);
    }
  });

  // The ladder rules own a role outright, so they have to read both notations.
  // A bare /72 and a bracketed /[0.72] are the same hand-written tier, and the
  // bracketed one used to walk straight past them.
  it("catches a ladder role written as a bracketed alpha", () => {
    const cases: Array<[string, string]> = [
      ["ink as a raw opacity", "text-foreground/[0.72]"],
      ["focus ring as a raw opacity", "ring-foreground/[0.4]"],
      ["hairline as a raw opacity", "border-border/[0.5]"],
    ];
    for (const [name, className] of cases) {
      const rule = RULES.find((candidate) => candidate.name === name)!;
      expect((className.match(rule.pattern) ?? []).length, `${name} missed ${className}`).toBeGreaterThan(0);
    }
  });

  it("keeps the measure exemptions honest", () => {
    for (const [file, allowed] of Object.entries(MEASURE_EXEMPTIONS)) {
      const source = readFileSync(join(ROOT, file), "utf8");
      const found = source.match(/\bmax-w-\[\d+ch\]/g) ?? [];
      expect(found.every((match) => allowed.includes(match)), `${file} uses ${found.join(", ")}`).toBe(true);
    }
  });
});
