# Portfolio Design System — Brief

## Problem

The portfolio already has a recognizable visual language, but its decisions are spread across CSS variables, Tailwind utilities, arbitrary values, inline styles, and Framer Motion configuration. Malik wants that existing system extracted, documented, made safely adjustable in the browser, and presented publicly at `www.malikzhang.com/design-system` without turning the portfolio into a generic component library.

## Who

- Portfolio visitors, recruiters, designers, and engineers who want to understand how the site is constructed and experiment with it.
- Malik, who needs a controlled way to turn a browser-local token draft into a reviewable production change.

## Success

- A visitor can understand the portfolio's foundations, components, patterns, and design philosophy from a focused public reference.
- A visitor can adjust supported tokens, watch the real portfolio respond, reset the experiment, and export valid DTCG JSON. Their changes affect only their browser.
- Malik can authenticate at publish time and open a pull request containing only validated token changes.
- The pull request receives a Vercel preview deployment for final review; nothing commits directly to `main`.
- Migrating the existing site to tokens produces no unintended visual or behavioral drift.

## Constraints

- Preserve the current React, Vite, TypeScript, Tailwind CSS, Framer Motion, React Router, Vitest, and Vercel stack.
- Follow the Design Tokens Community Group 2025.10 Format, Color, and Resolver guidance where applicable.
- Reference VMedium's philosophy and information architecture: one source of truth, a sticky grouped rail, one focused hash-linked section at a time, previous/next navigation, real specimens, and concise usage guidance.
- Preserve Malik's visual identity and expressive experiences, especially DotGrid and the About experience.
- Production publishing must use the GitHub API to open a pull request from a new branch.
- The existing application has no backend; the only new server-side infrastructure in v1 is the narrow authenticated publish capability.
- The design system must remain useful at 320px, desktop, and ultrawide viewports and honor reduced-motion preferences.

## Non-goals

- Redesigning the portfolio or inventing a new visual language.
- Building a broad, generic UI kit for controls the portfolio does not use.
- Adding a light theme solely to demonstrate theme support.
- Letting public visitors persist or publish changes remotely.
- Direct commits to `main`.
- Server-side draft storage, gated editor routes, hidden editor bundles, a custom version-history UI, or a rollback UI.
- A changelog before meaningful system history exists.
- Figma, SwiftUI, Android, or other platform exports in v1.
- Unrelated component or content refactors.
