# Malik Zhang — Portfolio

Personal portfolio of Malik Zhang, a product designer based in Seattle (UW MHCI+D). Built with React, Vite, TypeScript, Tailwind CSS, and Framer Motion.

## Tech stack

- **React 18** + **TypeScript**
- **Vite** — build tooling and dev server
- **Tailwind CSS** — styling, with `tailwindcss-animate` for motion utilities
- **Framer Motion** — page transitions and interaction animation
- **React Router** — client-side routing
- **Vitest** + **Testing Library** — unit/component tests
- **Playwright** — end-to-end tests

## Local development

```bash
npm install       # install dependencies
npm run dev       # start the dev server (http://localhost:8080)
npm run build     # production build (outputs to dist/)
npm run test      # run the test suite
```

Other useful scripts:

```bash
npm run build:dev   # development-mode build
npm run lint         # run ESLint
npm run preview      # preview a production build locally
npm run test:watch   # run tests in watch mode
```

## Project structure

```
src/
  pages/              top-level routes (home, project detail, resume, etc.)
  components/         shared UI components (hero, project list, overlays, footer)
  data/
    projectDetails.ts case-study content — the source of truth for project pages
```

## Deployment

Deployed on Vercel. Pushes to the main branch trigger a production build via `npm run build`.
