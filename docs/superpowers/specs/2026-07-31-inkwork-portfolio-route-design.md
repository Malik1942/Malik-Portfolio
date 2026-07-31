# Inkwork Portfolio Route Design

**Goal:** Serve Inkwork at `https://www.malikzhang.com/inkwork` while keeping that portfolio URL in the browser address bar.

## Scope

This integration spans two independently deployed Vercel projects:

- `Malik1942/Inkwork` supplies the styled QR studio.
- `Malik1942/Malik-Portfolio` owns `www.malikzhang.com` and its route handling.

The route must work on a direct visit, asset requests, refreshes, and Inkwork's existing hash-based share links. It must not change any existing portfolio route or require an iframe.

## Architecture

Inkwork will compile with `/inkwork/` as its public asset base. Its HTML will therefore request assets through `/inkwork/assets/...` when it is displayed at the portfolio route.

The portfolio's `vercel.json` will place two external rewrites before the existing SPA fallback:

```json
{ "source": "/inkwork", "destination": "https://inkwork-eight.vercel.app" }
{ "source": "/inkwork/:path*", "destination": "https://inkwork-eight.vercel.app/:path*" }
```

The first rewrite serves Inkwork's HTML. The second forwards its JavaScript, CSS, and other nested paths to the Inkwork deployment after removing the portfolio prefix. The current catch-all rewrite remains last and continues serving the portfolio SPA for all unrelated routes.

Inkwork will add a local Vercel rewrite from `/inkwork/:path*` to `/:path*`. That preserves the existing standalone `https://inkwork-eight.vercel.app` deployment: after its root HTML requests `/inkwork/assets/...`, the deployment resolves those requests to its real `/assets/...` files.

## Request Flow

```text
Browser: www.malikzhang.com/inkwork
  -> Portfolio Vercel external rewrite
  -> inkwork-eight.vercel.app/
  -> Inkwork HTML references /inkwork/assets/*
  -> Browser: www.malikzhang.com/inkwork/assets/*
  -> Portfolio external rewrite strips /inkwork
  -> inkwork-eight.vercel.app/assets/*
```

Inkwork share state remains in the URL hash, so no server rewrite is involved for `https://www.malikzhang.com/inkwork#...`.

## Change Set

### Inkwork

- Set Vite's production `base` to `/inkwork/`.
- Add `vercel.json` with the `/inkwork/:path*` compatibility rewrite and the existing static SPA fallback.
- Add a build-level test that verifies the emitted HTML references `/inkwork/assets/`.

### Malik Portfolio

- Insert exact `/inkwork` and `/inkwork/:path*` rewrites ahead of the existing `/(.*) -> /index.html` fallback.
- Add a configuration test that asserts rewrite ordering and destinations.

## Non-Goals

- No iframe or client-side redirect.
- No duplication of Inkwork source files into the portfolio repository.
- No changes to Inkwork's QR behavior, share payload format, or portfolio navigation.
- No custom-domain or DNS changes; the existing portfolio domain continues to be used.

## Verification

1. Run Inkwork tests and build; confirm `dist/index.html` references `/inkwork/assets/`.
2. Run portfolio tests, lint, and build; confirm the Vercel rewrite configuration is valid.
3. Push Inkwork first and wait for its Vercel production deployment.
4. Push the portfolio rewrite second and wait for its Vercel production deployment.
5. Verify with HTTP requests that:
   - `/inkwork` returns Inkwork's HTML rather than the portfolio shell;
   - `/inkwork/assets/...` returns a JavaScript or CSS asset rather than HTML;
   - `/inkwork#<share-state>` restores a shared code after a page load;
   - the standalone Inkwork deployment still loads its assets.

## Rollback

Revert the portfolio rewrite commit to restore the current portfolio SPA fallback at `/inkwork`. Revert the Inkwork base/rewrite commit to restore root-based assets. Neither rollback changes data or requires DNS updates.
