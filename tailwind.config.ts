import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

// Every utility that expresses a system decision references a generated token
// variable (src/styles/tokens.generated.css). That is what lets the workbench
// edit tokens live: change the variable and the running portfolio follows.
//
// The theme is read in three facets, the same three the reference uses:
//   form      shape and structure: type scale, radius, measure, layout, target
//   material  surface and ink: color roles, hairlines, focus rings
//   motion    pace and curve: durations and easings
// Top-level keys (fontSize, borderRadius, transitionDuration, ...) REPLACE
// Tailwind's defaults, so only system steps exist as utilities. An off-system
// class such as text-lg or duration-150 generates nothing; the boundary test in
// src/design-system/boundary.test.ts fails the build before that can ship.

/** A token color with an alpha channel left open for `/NN` modifiers. */
const color = (name: string) => `hsl(var(--${name}) / <alpha-value>)`;
/** A token color whose alpha is part of the token (ink tiers, hairlines, rings). */
const completeColor = (name: string) => `hsl(var(--${name}))`;
/** A `measure.*` token is a character count; utilities turn it into a width. */
const measure = (name: string) => `calc(var(--measure-${name}) * 1ch)`;
/** A `font.tracking.*` token is an em multiple. */
const tracking = (name: string) => `calc(var(--font-tracking-${name}) * 1em)`;

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    // ── Form: type ──────────────────────────────────────────────────────────
    fontSize: {
      // Label and caption both sit at 12px (Sep 2026: label raised from 11px so
      // metadata labels read comfortably) but stay distinct roles: label is
      // uppercase at eyebrow tracking, caption is sentence case.
      label: ["var(--font-size-label)", { lineHeight: "var(--font-leading-label)" }],
      caption: ["var(--font-size-caption)", { lineHeight: "var(--font-leading-label)" }],
      sm: ["var(--font-size-body-small)", { lineHeight: "var(--font-leading-body)" }],
      base: ["var(--font-size-body)", { lineHeight: "var(--font-leading-body)" }],
      xl: ["var(--font-size-body-large)", { lineHeight: "var(--font-leading-body)" }],
      title: ["var(--font-size-title)", { lineHeight: "var(--font-leading-title)", letterSpacing: tracking("tight") }],
      heading: ["var(--font-size-heading)", { lineHeight: "var(--font-leading-heading)", letterSpacing: tracking("tight") }],
      display: ["var(--font-size-display)", { lineHeight: "var(--font-leading-display)", letterSpacing: tracking("tight") }],
      hero: [
        "clamp(var(--font-size-hero-min), 6.5vw, var(--font-size-hero-max))",
        { lineHeight: "var(--font-leading-hero)", letterSpacing: tracking("tight") },
      ],
    },
    fontFamily: {
      sans: "var(--font-family-body)",
      display: "var(--font-family-display)",
      mono: "var(--font-family-mono)",
    },
    letterSpacing: {
      tight: tracking("tight"),
      normal: tracking("normal"),
      eyebrow: tracking("eyebrow"),
    },
    lineHeight: {
      none: "var(--font-leading-none)",
      tight: "var(--font-leading-tight)",
      snug: "var(--font-leading-snug)",
      normal: "var(--font-leading-body)",
      relaxed: "var(--font-leading-relaxed)",
    },
    fontWeight: {
      light: "var(--font-weight-light)",
      normal: "var(--font-weight-regular)",
      medium: "var(--font-weight-medium)",
      semibold: "var(--font-weight-semibold)",
    },

    // ── Form: shape ─────────────────────────────────────────────────────────
    borderRadius: {
      none: "0",
      DEFAULT: "var(--radius-small)",
      sm: "var(--radius-small)",
      lg: "var(--radius-base)",
      "2xl": "var(--radius-large)",
      full: "var(--radius-round)",
    },

    // ── Form: stacking ──────────────────────────────────────────────────────
    // Named layers are the site's global stacking order. Bare numbers are for
    // ordering inside a component's own stacking context (a card, an overlay).
    zIndex: {
      0: "0",
      1: "1",
      2: "2",
      10: "10",
      20: "20",
      40: "40",
      header: "var(--layer-header)",
      guide: "var(--layer-guide)",
      overlay: "var(--layer-overlay)",
      modal: "var(--layer-modal)",
    },

    // ── Motion ──────────────────────────────────────────────────────────────
    // `transition-*` utilities pick up DEFAULT, so an unqualified transition
    // runs at the fast pace on the standard curve.
    transitionDuration: {
      DEFAULT: "var(--duration-fast)",
      fast: "var(--duration-fast)",
      medium: "var(--duration-medium)",
      slow: "var(--duration-slow)",
      page: "var(--duration-page)",
      reveal: "var(--duration-reveal)",
      ambient: "var(--duration-ambient)",
    },
    transitionTimingFunction: {
      DEFAULT: "var(--ease-standard)",
      enter: "var(--ease-enter)",
      move: "var(--ease-move)",
      standard: "var(--ease-standard)",
      settle: "var(--ease-settle)",
      exit: "var(--ease-exit)",
      ambient: "var(--ease-ambient)",
    },

    extend: {
      // ── Form: layout ──────────────────────────────────────────────────────
      spacing: {
        // 44px touch target, kept live-editable via the layout token.
        11: "var(--layout-touch-target)",
      },
      maxWidth: {
        content: "var(--layout-content)",
        page: "var(--layout-page)",
        reading: "var(--layout-reading)",
        reference: "var(--layout-reference)",
        "measure-narrow": measure("narrow"),
        measure: measure("body"),
        "measure-wide": measure("wide"),
      },

      // ── Material ──────────────────────────────────────────────────────────
      colors: {
        background: color("color-background-canvas"),
        // The ink ladder. `foreground` keeps an open alpha for the rare
        // decorative wash (bg-foreground/[0.08] on a chip); text should use a
        // named tier so the hierarchy stays editable as five roles.
        foreground: {
          DEFAULT: color("color-text-primary"),
          lead: completeColor("color-text-lead"),
          secondary: completeColor("color-text-secondary"),
          tertiary: completeColor("color-text-tertiary"),
          quiet: completeColor("color-text-quiet"),
        },
        primary: {
          DEFAULT: color("color-action-primary"),
          foreground: color("color-text-on-primary"),
        },
        destructive: color("color-action-destructive"),
        secondary: {
          DEFAULT: color("color-surface-secondary"),
          foreground: color("color-text-primary"),
        },
        muted: {
          DEFAULT: color("color-surface-muted"),
          foreground: color("color-text-tertiary"),
        },
        accent: {
          DEFAULT: color("color-surface-accent"),
          foreground: color("color-text-primary"),
        },
        popover: {
          DEFAULT: color("color-surface-popover"),
          foreground: color("color-text-primary"),
        },
        card: {
          DEFAULT: color("color-surface-card"),
          foreground: color("color-text-primary"),
        },
        // Boundaries: `border` is the full-strength rule, `hairline` the
        // everyday one, `hairline-faint` for rows inside a bounded surface.
        border: color("color-border-default"),
        hairline: {
          DEFAULT: completeColor("color-border-hairline"),
          faint: completeColor("color-border-faint"),
        },
        // Control edges are a state, not a rule. `border-control` is the
        // outline a control carries at rest, `-hover` the one that arrives on
        // an edge that is transparent until pointed at, `-selected` the active
        // item. Kept apart from the hairline family on purpose: a selected
        // state flattened into a rule stops reading as a state.
        control: {
          quiet: completeColor("color-border-control-quiet"),
          DEFAULT: completeColor("color-border-control"),
          strong: completeColor("color-border-control-strong"),
          selected: completeColor("color-border-control-selected"),
        },
        // Focus rings: `ring-focus` on the canvas, `ring-focus-strong` over
        // media and filled surfaces.
        focus: {
          DEFAULT: completeColor("color-focus-ring"),
          strong: completeColor("color-focus-ring-strong"),
        },
        "surface-inset": color("component-case-study-module-surface"),
        // A faint wash of ink: media wells and chip fills. Named for the
        // material, not the component, because both roles use it.
        "surface-wash": completeColor("color-surface-wash"),
        "surface-wash-strong": completeColor("color-surface-wash-strong"),
        // Veils over the page, in three weights. A scrim is the canvas at an
        // alpha, so it dims whatever it covers without tinting it.
        scrim: {
          faint: completeColor("color-scrim-faint"),
          DEFAULT: completeColor("color-scrim-default"),
          strong: completeColor("color-scrim-strong"),
        },
        "project-card-surface": completeColor("component-project-card-surface"),
        "project-card-hover-overlay": completeColor("component-project-card-hover-overlay"),
        "case-study-module-border": completeColor("component-case-study-module-border"),
        "case-study-module-divider": completeColor("component-case-study-module-divider"),
        "lightbox-backdrop": completeColor("component-lightbox-backdrop"),
        "dot-red": color("color-accent-selected-work"),
        "dot-gold": color("color-accent-workshop"),
        success: color("color-status-positive"),
        "accent-violet": color("component-case-study-module-accent-violet"),
        "accent-emerald": color("component-case-study-module-accent-emerald"),
        "accent-slate": color("component-case-study-module-accent-slate"),
        "timeline-award": completeColor("component-about-timeline-award-dot"),
        "timeline-education": completeColor("component-about-timeline-education-dot"),
      },
    },
  },
  plugins: [
    // ── Form: rhythm ──────────────────────────────────────────────────────
    // The four vertical rhythms the pages repeat, each a compact value that
    // steps up at md. One class (`mt-section`, `gap-stack`) carries both, so
    // the pair can never drift apart at a call site.
    plugin(({ addUtilities }) => {
      const roles = ["section", "module", "stack", "caption"];
      const properties: Record<string, string[]> = {
        mt: ["marginTop"],
        mb: ["marginBottom"],
        pt: ["paddingTop"],
        pb: ["paddingBottom"],
        py: ["paddingTop", "paddingBottom"],
        gap: ["gap"],
        "gap-y": ["rowGap"],
      };
      const utilities: Record<string, Record<string, unknown>> = {};
      for (const role of roles) {
        for (const [prefix, props] of Object.entries(properties)) {
          const compact = Object.fromEntries(props.map((prop) => [prop, `var(--rhythm-${role}-compact)`]));
          const wide = Object.fromEntries(props.map((prop) => [prop, `var(--rhythm-${role}-wide)`]));
          utilities[`.${prefix}-${role}`] = { ...compact, "@media (min-width: 768px)": wide };
        }
      }
      addUtilities(utilities);
    }),
  ],
} satisfies Config;
