# Portfolio Design System — Brief

## Problem

The portfolio already has a recognizable visual language, but its decisions are spread across CSS variables, Tailwind utilities, arbitrary values, inline styles, and Framer Motion configuration. The first public reference exposed that system too literally: a 36-color editor and equally weighted technical controls made the page feel like an internal debugging tool. Malik wants a curated public reference at `www.malikzhang.com/design-system` that explains the system through readable foundations, real components, and production context.

## Who

- Portfolio visitors, recruiters, designers, and engineers who want to understand how the site is constructed without operating an internal token editor.
- Malik, who still needs an unlisted authoring path that can turn a local token draft into a reviewable production change.

## Success

- A visitor can understand the portfolio's foundations, components, patterns, and design philosophy from a focused public reference.
- Color is grouped by semantic purpose and typography is shown as a readable specimen scale rather than a catalog of editing controls.
- Components are discoverable through a lineup and documented through real production examples, relevant states, and concise usage guidance.
- The public reference contains no token inputs, numeric HSL editor, draft/export workflow, or embedded full-site preview.
- Malik can authenticate at publish time and open a pull request containing only validated token changes.
- The pull request receives a Vercel preview deployment for final review; nothing commits directly to `main`.
- Migrating the existing site to tokens produces no unintended visual or behavioral drift.

## Constraints

- Preserve the current React, Vite, TypeScript, Tailwind CSS, Framer Motion, React Router, Vitest, and Vercel stack.
- Follow the Design Tokens Community Group 2025.10 Format, Color, and Resolver guidance where applicable.
- Reference VMedium's philosophy and information architecture: one source of truth, a sticky grouped rail, one focused hash-linked section at a time, previous/next navigation, real specimens, and concise usage guidance.
- Borrow VMedium's restrained foundation tables and contextual component demonstrations without copying its visual identity or catalog size.
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
- A public token playground or exhaustive token catalog.
- Generic controls and components that the portfolio does not actually use.
