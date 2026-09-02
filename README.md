# Malik Zhang — Portfolio

Personal portfolio of Malik Zhang, a product designer based in Seattle (UW MHCI+D). Built with React, Vite, TypeScript, Tailwind CSS, and Framer Motion.

## Tech stack

- **React 18** + **TypeScript**
- **Vite** — build tooling and dev server
- **Tailwind CSS** — styling, with `tailwindcss-animate` for motion utilities
- **Framer Motion** — page transitions and interaction animation
- **React Router** — client-side routing
- **Vitest** + **Testing Library** — unit/component tests
- **Playwright** — Open Graph screenshot generation (`npm run generate:og`), not end-to-end tests

## Local development

```bash
npm install                # install dependencies
npm run tokens:build       # validate tokens and regenerate CSS + the typed manifest
npm run dev                # start the Vite development server
npm test                   # run browser and API tests
npm run build              # production build (outputs to dist/)
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

## Living design system

The canonical design-token sources are the three DTCG JSON files in `tokens/`.
`npm run tokens:build` validates aliases and supported values, then generates
`src/styles/tokens.generated.css` and
`src/design-system/generated/token-manifest.generated.ts`. Generated files are
committed so production styles, documentation, and the editor use the same
token graph.

The public reference lives at `/design-system`. It presents one focused hash
section at a time: curated semantic color groups, a ruled typography specimen,
production components, responsive patterns, and the standards-backed token
model. Public pages contain no token editing controls.

The Footer's unlisted `Admin` entry opens browser-local token authoring, review,
and publishing. Draft changes affect only the current browser until the
authenticated server endpoint opens a GitHub pull request. Local Vite builds use
`tokenSourceCommit === "development"`, so publishing is disabled. Vercel
production/preview builds receive publishable provenance from
`VERCEL_GIT_COMMIT_SHA` through the Vite build configuration.

## Token publishing

Publishing uses one Vercel Function at `POST /api/design-system/publish`. After
strict request validation and constant-time password verification, the function:

1. reads the current `main` commit and the three allowlisted token files;
2. re-compiles the production bundle and applies the submitted direct overrides;
3. creates blobs only for changed token files and overlays them on the verified
   base tree;
4. creates one commit on a new `design-system/...` branch; and
5. opens a GitHub pull request targeting `main`.

The function has no direct-main or merge operation. Review the Vercel preview,
then merge manually in GitHub. Rollback is a normal `git revert` of the merged
token commit. If PR creation fails after its branch exists, the dialog stops
republishing and presents that branch for manual recovery in GitHub.

### Vercel environment

Copy the variable names from `.env.example` into Vercel; never commit real
values. Generate the password digest without echoing or saving the plaintext:

```bash
read -s -p "Publish password: " PUBLISH_PASSWORD; printf '\n'
printf '%s' "$PUBLISH_PASSWORD" | shasum -a 256
unset PUBLISH_PASSWORD
```

- `DESIGN_SYSTEM_PUBLISH_PASSWORD_HASH`: lowercase SHA-256 hex digest.
- `GITHUB_TOKEN`: a fine-grained PAT scoped only to this repository, with
  **Contents: read and write** and **Pull requests: read and write**.
- `GITHUB_OWNER`: `Malik1942`.
- `GITHUB_REPO`: `Malik-Portfolio`.

Vercel's GitHub integration must be enabled so every design-system PR receives a
preview deployment before merge. Configure rate limiting for
`/api/design-system/publish` in Vercel Firewall; the function itself keeps auth
failures generic and never returns credentials, token file bodies, or raw GitHub
errors.

## Deployment

Deployed on Vercel. Merges to `main` trigger a production build via
`npm run build`; pull requests receive preview deployments for final review.
