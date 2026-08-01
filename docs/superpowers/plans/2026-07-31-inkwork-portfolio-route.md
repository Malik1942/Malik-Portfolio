# Inkwork Portfolio Route Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Serve Inkwork at `https://www.malikzhang.com/inkwork` while preserving that URL, direct asset requests, refreshes, hash-based share links, and the standalone Inkwork deployment.

**Architecture:** Inkwork builds production assets beneath `/inkwork/` and rewrites those prefixed requests back to its root asset paths when accessed directly. Malik Portfolio places two external Inkwork rewrites before its existing SPA fallback, serving Inkwork HTML and stripping the prefix from nested asset paths.

**Tech Stack:** Vite 5, Node.js test runner, Vercel rewrites, Vite 7, Vitest 3.

## Global Constraints

- No iframe or client-side redirect.
- No duplication of Inkwork source files into the portfolio repository.
- No changes to Inkwork's QR behavior, share payload format, or portfolio navigation.
- No custom-domain or DNS changes; the existing portfolio domain continues to be used.
- The existing portfolio catch-all rewrite remains last and continues serving the portfolio SPA for all unrelated routes.
- Inkwork share state remains in the URL hash, so no server rewrite is involved for `https://www.malikzhang.com/inkwork#...`.

---

### Task 1: Build and serve Inkwork beneath `/inkwork/`

**Repository:** `/Users/malik/.codex/worktrees/inkwork-portfolio-route-inkwork`

**Files:**
- Modify: `vite.config.js`
- Create: `vercel.json`
- Create: `test/build-base.test.js`

**Interfaces:**
- Consumes: Vite's resolved project configuration and Vercel's ordered `rewrites` array.
- Produces: production HTML whose JavaScript and CSS references begin with `/inkwork/assets/`, plus standalone compatibility rewrites from `/inkwork/:path*` to `/:path*`.

- [ ] **Step 1: Write the failing production-build test**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { build } from "vite";

test("production HTML references assets beneath the portfolio route", async (t) => {
  const outDir = await mkdtemp(join(tmpdir(), "inkwork-build-"));
  t.after(() => rm(outDir, { recursive: true, force: true }));

  await build({ logLevel: "silent", build: { outDir, emptyOutDir: true } });
  const html = await readFile(join(outDir, "index.html"), "utf8");

  assert.match(html, /(?:src|href)="\/inkwork\/assets\//);
  assert.doesNotMatch(html, /(?:src|href)="\/assets\//);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test test/build-base.test.js`

Expected: FAIL because the emitted HTML references `/assets/` rather than `/inkwork/assets/`.

- [ ] **Step 3: Set the production base and add standalone rewrites**

Replace `vite.config.js` with:

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/inkwork/" : "/",
  plugins: [react()],
}));
```

Create `vercel.json` with:

```json
{
  "rewrites": [
    { "source": "/inkwork/:path*", "destination": "/:path*" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

- [ ] **Step 4: Run the targeted test, full suite, and build**

Run: `node --test test/build-base.test.js`

Expected: PASS.

Run: `npm test`

Expected: all tests pass.

Run: `npm run build`

Expected: build succeeds and `dist/index.html` contains `/inkwork/assets/` references.

- [ ] **Step 5: Commit**

```bash
git add vite.config.js vercel.json test/build-base.test.js
git commit -m "feat: serve Inkwork beneath portfolio route"
```

### Task 2: Proxy the portfolio route to Inkwork

**Repository:** `/Users/malik/.codex/worktrees/inkwork-portfolio-route-portfolio`

**Files:**
- Modify: `vercel.json`
- Create: `api/vercel-rewrites.test.ts`

**Interfaces:**
- Consumes: Inkwork's production deployment at `https://inkwork-eight.vercel.app` and its `/inkwork/` asset base from Task 1.
- Produces: exact ordered external rewrites for `/inkwork` and `/inkwork/:path*`, followed by the unchanged portfolio SPA fallback.

- [ ] **Step 1: Write the failing rewrite-order test**

```ts
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Vercel rewrites", () => {
  it("serves Inkwork before the portfolio SPA fallback", () => {
    const config = JSON.parse(readFileSync(resolve("vercel.json"), "utf8"));

    expect(config.rewrites).toEqual([
      { source: "/inkwork", destination: "https://inkwork-eight.vercel.app" },
      { source: "/inkwork/:path*", destination: "https://inkwork-eight.vercel.app/:path*" },
      { source: "/(.*)", destination: "/index.html" },
    ]);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run api/vercel-rewrites.test.ts`

Expected: FAIL because `vercel.json` contains only the portfolio SPA fallback.

- [ ] **Step 3: Insert the exact external rewrites before the fallback**

Replace `vercel.json` with:

```json
{
  "rewrites": [
    { "source": "/inkwork", "destination": "https://inkwork-eight.vercel.app" },
    { "source": "/inkwork/:path*", "destination": "https://inkwork-eight.vercel.app/:path*" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

- [ ] **Step 4: Run the targeted test, full suite, lint, and build**

Run: `npx vitest run api/vercel-rewrites.test.ts`

Expected: PASS.

Run: `npm test`

Expected: all tests pass.

Run: `npm run lint`

Expected: no lint errors.

Run: `npm run build`

Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add vercel.json api/vercel-rewrites.test.ts docs/superpowers/plans/2026-07-31-inkwork-portfolio-route.md
git commit -m "feat: proxy Inkwork through portfolio route"
```
