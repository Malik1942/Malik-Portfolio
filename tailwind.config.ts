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
    extend: {
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
      borderRadius: {
        lg: "var(--radius-base)",
        md: "calc(var(--radius-base) - 2px)",
        sm: "var(--radius-small)",
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
