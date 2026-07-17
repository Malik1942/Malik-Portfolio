import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const color = (name: string) => `hsl(var(--${name}) / <alpha-value>)`;
const completeColor = (name: string) => `hsl(var(--${name}))`;

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    // Top-level overrides define the ENFORCEABLE system boundary: only these
    // steps exist as utilities, and every one references an editable token
    // variable so workbench edits update the live portfolio.
    fontSize: {
      label: ["var(--font-size-label)", { lineHeight: "1.4" }],
      xs: ["var(--font-size-caption)", { lineHeight: "1.4" }],
      sm: ["var(--font-size-body-small)", { lineHeight: "1.5" }],
      base: ["var(--font-size-body)", { lineHeight: "1.5" }],
      xl: ["var(--font-size-body-large)", { lineHeight: "1.5" }],
      title: ["var(--font-size-title)", { lineHeight: "1.3", letterSpacing: "-0.02em" }],
      heading: ["var(--font-size-heading)", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
      display: ["var(--font-size-display)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
      hero: [
        "clamp(var(--font-size-hero-min), 6.5vw, var(--font-size-hero-max))",
        { lineHeight: "1.06", letterSpacing: "-0.02em" },
      ],
    },
    fontFamily: {
      sans: "var(--font-family-body)",
      display: "var(--font-family-display)",
      mono: "var(--font-family-mono)",
    },
    letterSpacing: {
      tight: "-0.02em",
      normal: "0em",
      eyebrow: "0.18em",
    },
    borderRadius: {
      none: "0",
      DEFAULT: "var(--radius-small)",
      sm: "var(--radius-small)",
      lg: "var(--radius-base)",
      "2xl": "var(--radius-large)",
      full: "9999px",
    },
    extend: {
      spacing: {
        // 44px touch target, kept live-editable via the layout token.
        11: "var(--layout-touch-target)",
      },
      colors: {
        border: color("color-border-default"),
        input: color("color-input-default"),
        ring: color("color-focus-ring"),
        background: color("color-background-canvas"),
        foreground: color("color-text-primary"),
        primary: {
          DEFAULT: color("color-action-primary"),
          foreground: color("color-text-on-primary"),
        },
        secondary: {
          DEFAULT: color("color-surface-secondary"),
          foreground: color("color-text-primary"),
        },
        destructive: {
          DEFAULT: color("color-action-destructive"),
          foreground: color("color-text-on-destructive"),
        },
        muted: {
          DEFAULT: color("color-surface-muted"),
          foreground: color("color-text-muted"),
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
        "surface-inset": color("component-case-study-module-surface"),
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
        sidebar: {
          DEFAULT: color("color-sidebar-background"),
          foreground: color("color-sidebar-foreground"),
          primary: color("color-sidebar-primary"),
          "primary-foreground": color("color-sidebar-primary-foreground"),
          accent: color("color-sidebar-accent"),
          "accent-foreground": color("color-sidebar-accent-foreground"),
          border: color("color-sidebar-border"),
          ring: color("color-sidebar-ring"),
        },
      },
      maxWidth: {
        content: "var(--layout-content)",
        page: "var(--layout-page)",
        reading: "var(--layout-reading)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
