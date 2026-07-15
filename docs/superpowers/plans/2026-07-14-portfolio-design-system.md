# Portfolio Design System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract Malik's current portfolio design language into DTCG token files, publish a VMedium-inspired living reference and local workbench at `/design-system`, and let an authenticated admin open token-change pull requests through the GitHub API.

**Architecture:** Three DTCG source files compile into CSS custom properties and typed browser metadata through a small shared TypeScript compiler. The public React design-system route consumes that metadata for focused hash-linked documentation and browser-local previews. A single Vercel Web Handler independently validates an override patch, creates a Git commit on a new branch through GitHub's Git Database API, and opens a PR against `main`.

**Tech Stack:** React 18, TypeScript, Vite 7, Tailwind CSS 3, Framer Motion 12, Vitest 3, Testing Library, `tsx` for the token generator, Vercel Node.js Web Handler, GitHub REST API 2022-11-28.

## Global Constraints

- Preserve the existing portfolio appearance and interaction behavior; token migration is not a redesign.
- DTCG JSON is the only hand-edited source for supported token values.
- Public experimentation is browser-local and requires no authentication.
- A stored draft applies to portfolio routes only while explicit local-preview mode is active.
- Publishing always creates a new `design-system/` branch and pull request; no code path may update `main` directly.
- The server accepts only allowlisted token paths and independently validates every override.
- Keep DotGrid and the About experience as expressive patterns; do not turn their art-direction constants into broad primitives.
- Do not add a light theme, remote drafts, user accounts, custom version history, rollback UI, or changelog in v1.
- Preserve the unrelated untracked `.claude/` directory.

---

## File Structure

### Canonical tokens and generation

- `tokens/primitive.tokens.json` — raw color, font, dimension, radius, duration, and easing values.
- `tokens/semantic.tokens.json` — role-based aliases used by the portfolio.
- `tokens/component.tokens.json` — narrowly owned header, project-card, project-section, and lightbox values.
- `src/design-system/tokens/types.ts` — shared DTCG, bundle, override, and issue types.
- `src/design-system/tokens/compiler.ts` — merge, flatten, validate, resolve, format, hash, and override logic usable in browser and server code.
- `src/design-system/tokens/compiler.test.ts` — compiler and validation unit tests.
- `scripts/generate-design-tokens.ts` — filesystem adapter that reads token sources and writes generated artifacts.
- `src/styles/tokens.generated.css` — generated CSS variables; never hand-edited.
- `src/design-system/generated/token-manifest.generated.ts` — generated typed manifest and source documents; never hand-edited.

### Public local-preview runtime

- `src/design-system/preview/draft.ts` — local draft persistence, rebase, reset, and export.
- `src/design-system/preview/draft.test.ts` — draft behavior tests.
- `src/design-system/preview/runtime.ts` — CSS-variable application, preview query parsing, and frame messages.
- `src/design-system/preview/runtime.test.ts` — DOM runtime tests.
- `src/design-system/preview/PreviewProvider.tsx` — React context binding manifest, local draft, build commit, and runtime overrides.
- `src/design-system/preview/PreviewBar.tsx` — global explicit-preview indicator and controls.
- `src/design-system/preview/PreviewProvider.test.tsx` — provider and preview-bar integration tests.

### Reference route

- `src/pages/DesignSystem.tsx` — lazy route and page composition.
- `src/design-system/reference/sections.tsx` — stable grouped section registry and content factories.
- `src/design-system/reference/sectionModel.ts` — hash parsing, ordering, and navigation helpers.
- `src/design-system/reference/sectionModel.test.ts` — section-model tests.
- `src/design-system/reference/DesignSystemShell.tsx` — sticky rail, mobile disclosure, selected section, and pager.
- `src/design-system/reference/DesignSystemShell.test.tsx` — hash and keyboard behavior tests.
- `src/design-system/reference/TokenTable.tsx` — production token reference table.
- `src/design-system/reference/Specimen.tsx` — shared guidance/specimen frame.
- `src/design-system/reference/content/Overview.tsx` — philosophy, architecture, standards, and preview explanation.
- `src/design-system/reference/content/Foundations.tsx` — color, typography, spacing/layout, radius/border, and motion sections.
- `src/design-system/reference/content/Components.tsx` — real portfolio component documentation.
- `src/design-system/reference/content/Patterns.tsx` — hero, case study, navigation, responsive, transition, expressive, and accessibility patterns.
- `src/design-system/reference/content/Playground.tsx` — public workbench composition.

### Workbench controls

- `src/design-system/workbench/TokenControl.tsx` — type-aware bounded token editor.
- `src/design-system/workbench/TokenControl.test.tsx` — control behavior tests.
- `src/design-system/workbench/TokenDiff.tsx` — production/draft comparison and dependents.
- `src/design-system/workbench/ContrastChecks.tsx` — registered contrast-pair evaluation.
- `src/design-system/workbench/PortfolioPreview.tsx` — same-origin responsive preview frame.
- `src/design-system/workbench/ExportDraftButton.tsx` — complete DTCG JSON export.

### Publishing

- `src/design-system/publish/client.ts` — typed publish request and response client.
- `src/design-system/publish/PublishDialog.tsx` — password, PR metadata, final diff, and result UI.
- `src/design-system/publish/PublishDialog.test.tsx` — public/admin boundary and error tests.
- `api/design-system/github.ts` — narrow GitHub REST client and one-commit branch creation.
- `api/design-system/publish-core.ts` — authentication, allowlist, stale-base, validation, PR body, and orchestration.
- `api/design-system/publish-core.test.ts` — Node-environment unit tests with mocked GitHub transport.
- `api/design-system/publish.ts` — Vercel `POST` Web Handler.

### Existing integration points

- `package.json`, `package-lock.json` — token scripts and `tsx` development dependency.
- `src/main.tsx` — generated token CSS import.
- `src/App.tsx` — lazy design-system route and preview provider.
- `src/index.css` — remove source-of-truth token declarations and retain behavior styles.
- `tailwind.config.ts` — map existing semantic utilities to canonical generated variables.
- `src/components/Footer.tsx` — public Design System link.
- `public/sitemap.xml` — design-system route.
- `vitest.config.ts` — include API tests.

---

### Task 1: Build the DTCG compiler with tests

**Files:**
- Create: `src/design-system/tokens/types.ts`
- Create: `src/design-system/tokens/compiler.ts`
- Create: `src/design-system/tokens/compiler.test.ts`

**Interfaces:**
- Produces: `compileTokenSources(sources: TokenSource[]): TokenBundle`
- Produces: `applyOverrides(bundle: TokenBundle, overrides: TokenOverrides): TokenBundle`
- Produces: `formatTokenCss(type: DtcgType, value: DtcgValue): string`
- Produces: `TokenCompilationError` with `issues: TokenIssue[]`

- [ ] **Step 1: Define the shared contracts**

```ts
export type DtcgType =
  | "color"
  | "dimension"
  | "fontFamily"
  | "fontWeight"
  | "duration"
  | "cubicBezier"
  | "number";

export interface DtcgColor {
  colorSpace: "hsl";
  components: [number | "none", number | "none", number | "none"];
  alpha?: number;
  hex?: string;
}

export interface DtcgDimension { value: number; unit: "px" | "rem"; }
export interface DtcgDuration { value: number; unit: "ms" | "s"; }
export type DtcgCubicBezier = [number, number, number, number];
export type DtcgValue = string | number | string[] | DtcgColor | DtcgDimension | DtcgDuration | DtcgCubicBezier;
export type TokenOverrides = Record<string, DtcgValue>;

export interface TokenSource { filename: string; document: Record<string, unknown>; }
export interface TokenIssue { path: string; code: string; message: string; }
export interface TokenRecord {
  path: string;
  sourceFile: string;
  type: DtcgType;
  value: DtcgValue;
  resolvedValue: DtcgValue;
  description: string;
  cssVariable: `--${string}`;
  cssValue: string;
  aliasOf?: string;
  dependents: string[];
}
export interface TokenBundle {
  schemaVersion: 1;
  tokenHash: string;
  documents: Record<string, Record<string, unknown>>;
  tokens: TokenRecord[];
}
```

- [ ] **Step 2: Write failing compiler tests**

```ts
import { describe, expect, it } from "vitest";
import { compileTokenSources, formatTokenCss, TokenCompilationError } from "./compiler";

describe("compileTokenSources", () => {
  it("inherits group types and resolves cross-group aliases", () => {
    const result = compileTokenSources([{ filename: "tokens.json", document: {
      color: {
        $type: "color",
        raw: { $value: { colorSpace: "hsl", components: [0, 0, 4], hex: "#0a0a0a" } },
        canvas: { $value: "{color.raw}" },
      },
    } }]);
    expect(result.tokens.find((token) => token.path === "color.canvas")).toMatchObject({
      type: "color",
      aliasOf: "color.raw",
      cssValue: "0 0% 4%",
    });
  });

  it("reports circular aliases", () => {
    expect(() => compileTokenSources([{ filename: "tokens.json", document: {
      duration: {
        $type: "duration",
        a: { $value: "{duration.b}" },
        b: { $value: "{duration.a}" },
      },
    } }])).toThrow(TokenCompilationError);
  });

  it("formats supported DTCG values", () => {
    expect(formatTokenCss("dimension", { value: 1.5, unit: "rem" })).toBe("1.5rem");
    expect(formatTokenCss("duration", { value: 250, unit: "ms" })).toBe("250ms");
    expect(formatTokenCss("cubicBezier", [0.22, 1, 0.36, 1])).toBe("cubic-bezier(0.22, 1, 0.36, 1)");
  });
});
```

- [ ] **Step 3: Run the tests and verify the expected failure**

Run: `npx vitest run src/design-system/tokens/compiler.test.ts`

Expected: FAIL because `./compiler` does not exist.

- [ ] **Step 4: Implement merge, flatten, validation, resolution, formatting, and stable hashing**

Implement `compiler.ts` with these exact rules:

```ts
const ALIAS_PATTERN = /^\{([^{}]+)\}$/;
const SUPPORTED_TYPES = new Set<DtcgType>([
  "color", "dimension", "fontFamily", "fontWeight", "duration", "cubicBezier", "number",
]);

export class TokenCompilationError extends Error {
  constructor(public readonly issues: TokenIssue[]) {
    super(issues.map((issue) => `${issue.path}: ${issue.message}`).join("\n"));
    this.name = "TokenCompilationError";
  }
}

export function tokenPathToCssVariable(path: string): `--${string}` {
  return `--${path.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase()}`;
}

export function formatTokenCss(type: DtcgType, value: DtcgValue): string {
  if (type === "color") {
    const color = value as DtcgColor;
    const [h, s, l] = color.components;
    const channels = `${h} ${s}% ${l}%`;
    return color.alpha === undefined || color.alpha === 1 ? channels : `${channels} / ${color.alpha}`;
  }
  if (type === "dimension" || type === "duration") {
    const measured = value as DtcgDimension | DtcgDuration;
    return `${measured.value}${measured.unit}`;
  }
  if (type === "cubicBezier") return `cubic-bezier(${(value as number[]).join(", ")})`;
  if (type === "fontFamily") return (Array.isArray(value) ? value : [value]).map((name) => /\s/.test(String(name)) ? `'${name}'` : name).join(", ");
  return String(value);
}
```

Flatten an object with `$value` as a token, inherit `$type` from the closest group, reject names beginning with `$` unless they are recognized properties, resolve whole-value aliases, reject missing and circular references, compute reverse dependents, sort records by path, serialize deterministically with sorted object keys, and compute an eight-character FNV-1a hash.

- [ ] **Step 5: Run compiler tests**

Run: `npx vitest run src/design-system/tokens/compiler.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit Task 1**

```bash
git add src/design-system/tokens
git commit -m "feat: add DTCG token compiler"
```

---

### Task 2: Add canonical tokens and generated artifacts

**Files:**
- Create: `tokens/primitive.tokens.json`
- Create: `tokens/semantic.tokens.json`
- Create: `tokens/component.tokens.json`
- Create: `scripts/generate-design-tokens.ts`
- Create: `src/styles/tokens.generated.css`
- Create: `src/design-system/generated/token-manifest.generated.ts`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Consumes: `compileTokenSources()` from Task 1.
- Produces: `tokenBundle: TokenBundle` from `token-manifest.generated.ts`.
- Produces: `tokenSourceCommit: string` from the production build commit.
- Produces: canonical CSS variables matching each token path.

- [ ] **Step 1: Add a failing artifact test**

Append to `compiler.test.ts`:

```ts
it("applies compatible overrides without mutating the input bundle", () => {
  const base = compileTokenSources([{ filename: "tokens.json", document: {
    duration: { $type: "duration", fast: { $value: { value: 200, unit: "ms" } } },
  } }]);
  const next = applyOverrides(base, { "duration.fast": { value: 120, unit: "ms" } });
  expect(next.tokens[0].cssValue).toBe("120ms");
  expect(base.tokens[0].cssValue).toBe("200ms");
});
```

- [ ] **Step 2: Run the test and verify failure**

Run: `npx vitest run src/design-system/tokens/compiler.test.ts`

Expected: FAIL because `applyOverrides` is not exported.

- [ ] **Step 3: Implement `applyOverrides`**

```ts
export function applyOverrides(bundle: TokenBundle, overrides: TokenOverrides): TokenBundle {
  const documents = structuredClone(bundle.documents);
  for (const [path, value] of Object.entries(overrides)) {
    const token = bundle.tokens.find((candidate) => candidate.path === path);
    if (!token) throw new TokenCompilationError([{ path, code: "unknown-token", message: "Token does not exist." }]);
    setTokenValue(documents[token.sourceFile], path.split("."), value);
  }
  return compileTokenSources(Object.entries(documents).map(([filename, document]) => ({ filename, document })));
}
```

`setTokenValue` walks the exact token path, verifies the target contains `$value`, and replaces only `$value`.

- [ ] **Step 4: Author the exact v1 token families**

Create DTCG groups for these paths and current values:

| Family | Paths |
|---|---|
| Primitive color | `color.neutral.950`, `color.neutral.925`, `color.neutral.900`, `color.neutral.860`, `color.neutral.820`, `color.neutral.580`, `color.warm.100`, `color.warm.050`, `color.red.500`, `color.gold.500` |
| Font | `font.family.display`, `font.family.body`, `font.family.mono`, `font.weight.light`, `font.weight.regular`, `font.weight.medium`, `font.weight.semibold` |
| Type size | `font.size.caption`, `font.size.bodySmall`, `font.size.body`, `font.size.bodyLarge`, `font.size.heading`, `font.size.display` |
| Space | `space.1` through `space.8` with 4, 8, 12, 16, 24, 32, 48, and 64px |
| Radius | `radius.none`, `radius.small`, `radius.base`, `radius.large`, `radius.round` |
| Motion | `duration.fast`, `duration.medium`, `duration.slow`, `duration.page`, `duration.ambient`, `ease.enter`, `ease.move`, `ease.standard`, `ease.ambient` |
| Layout | `layout.content`, `layout.page`, `layout.reading`, `layout.touchTarget` |
| Semantic color | current background, foreground, card, popover, primary, secondary, muted, accent, destructive, border, input, ring, red-dot, gold-dot, and sidebar roles |
| Component | `component.siteHeader.scrim`, `component.projectCard.surface`, `component.projectCard.border`, `component.projectSection.flash`, `component.lightbox.backdrop` |

Use HSL DTCG colors matching the current `src/index.css` values, aliases for semantic roles, descriptions on every editable token, and explicit types or nearest-group type inheritance.

- [ ] **Step 5: Add the generator**

```ts
import { execFileSync } from "node:child_process";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { compileTokenSources } from "../src/design-system/tokens/compiler";

const sourceFiles = ["primitive.tokens.json", "semantic.tokens.json", "component.tokens.json"];
const sources = await Promise.all(sourceFiles.map(async (filename) => ({
  filename,
  document: JSON.parse(await readFile(resolve("tokens", filename), "utf8")),
})));
const bundle = compileTokenSources(sources);
const tokenSourceCommit = process.env.VERCEL_GIT_COMMIT_SHA ?? execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
const css = [
  "/* Generated by npm run tokens:build. Do not edit. */",
  ":root {",
  ...bundle.tokens.map((token) => `  ${token.cssVariable}: ${token.cssValue};`),
  "}",
  "",
].join("\n");
const manifest = `/* Generated by npm run tokens:build. Do not edit. */\nimport type { TokenBundle } from "../tokens/types";\nexport const tokenSourceCommit = ${JSON.stringify(tokenSourceCommit)};\nexport const tokenBundle: TokenBundle = ${JSON.stringify(bundle, null, 2)};\n`;
await mkdir(resolve("src/styles"), { recursive: true });
await mkdir(resolve("src/design-system/generated"), { recursive: true });
await writeFile(resolve("src/styles/tokens.generated.css"), css);
await writeFile(resolve("src/design-system/generated/token-manifest.generated.ts"), manifest);
```

- [ ] **Step 6: Wire scripts and generate**

Add `tsx` as a development dependency and these scripts:

```json
{
  "tokens:build": "tsx scripts/generate-design-tokens.ts",
  "predev": "npm run tokens:build",
  "prebuild": "npm run tokens:build",
  "pretest": "npm run tokens:build"
}
```

Run: `npm install --save-dev tsx@latest && npm run tokens:build`

Expected: generated CSS and manifest exist, and the command exits 0.

- [ ] **Step 7: Run tests and commit Task 2**

Run: `npx vitest run src/design-system/tokens/compiler.test.ts`

Expected: PASS.

```bash
git add package.json package-lock.json tokens scripts/generate-design-tokens.ts src/styles/tokens.generated.css src/design-system/generated src/design-system/tokens
git commit -m "feat: generate portfolio design tokens"
```

---

### Task 3: Integrate generated tokens without visual drift

**Files:**
- Modify: `src/main.tsx`
- Modify: `src/index.css`
- Modify: `tailwind.config.ts`
- Modify: repeated hardcoded surface consumers in `src/components/project-detail/*.tsx`

**Interfaces:**
- Consumes: canonical CSS variables from Task 2.
- Produces: existing Tailwind utility names backed by generated token variables.

- [ ] **Step 1: Capture the pre-migration contract**

Run:

```bash
npm test
npm run build
rg -n 'bg-\[#0c0c0d\]|hsl\(var\(--(background|foreground|border)|--text-(display|body|mono)' src tailwind.config.ts
```

Expected: tests and build pass; the search lists the current migration targets.

- [ ] **Step 2: Import generated CSS before behavior CSS**

```ts
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./styles/tokens.generated.css";
import "./index.css";
```

- [ ] **Step 3: Map Tailwind semantics to canonical variables**

Use alpha-aware HSL mappings:

```ts
const color = (name: string) => `hsl(var(--${name}) / <alpha-value>)`;

colors: {
  background: color("color-background-canvas"),
  foreground: color("color-text-primary"),
  border: color("color-border-default"),
  input: color("color-input-default"),
  ring: color("color-focus-ring"),
  card: { DEFAULT: color("color-surface-card"), foreground: color("color-text-primary") },
  secondary: { DEFAULT: color("color-surface-secondary"), foreground: color("color-text-primary") },
  "surface-inset": color("component-project-card-surface"),
  "dot-red": color("color-accent-selected-work"),
  "dot-gold": color("color-accent-workshop"),
}
```

Map `fontFamily` and `borderRadius` to generated variables while retaining existing utility names.

- [ ] **Step 4: Remove duplicated root token declarations and migrate repeated hardcoded surfaces**

Delete supported values from the handwritten `:root` block in `src/index.css`. Replace repeated `bg-[#0c0c0d]` with `bg-surface-inset`, and replace direct supported font variables with canonical generated variables. Leave one-off canvas animation colors local when they are art-direction details.

- [ ] **Step 5: Verify no-drift integration**

Run:

```bash
npm test
npm run build
rg -n 'bg-\[#0c0c0d\]|--background:|--foreground:|--text-display:' src tokens tailwind.config.ts
```

Expected: tests and build pass; hardcoded surface uses and handwritten source declarations are absent.

- [ ] **Step 6: Commit Task 3**

```bash
git add src/main.tsx src/index.css tailwind.config.ts src/components/project-detail
git commit -m "refactor: drive portfolio styles from tokens"
```

---

### Task 4: Build the browser-local draft and preview runtime

**Files:**
- Create: `src/design-system/preview/draft.ts`
- Create: `src/design-system/preview/draft.test.ts`
- Create: `src/design-system/preview/runtime.ts`
- Create: `src/design-system/preview/runtime.test.ts`

**Interfaces:**
- Consumes: `tokenBundle`, `applyOverrides()`.
- Produces: `loadDraft`, `saveDraft`, `rebaseDraft`, `resetDraft`, `exportDraftDocuments`, `applyDraftToRoot`, and `isLocalPreviewUrl`.

- [ ] **Step 1: Write failing draft tests**

```ts
describe("local token drafts", () => {
  it("round-trips a schema-versioned patch", () => {
    const draft = createDraft("abc123", { "duration.fast": { value: 120, unit: "ms" } }, "2026-07-14T00:00:00.000Z");
    saveDraft(localStorage, draft);
    expect(loadDraft(localStorage)).toEqual(draft);
  });

  it("drops unknown overrides while rebasing", () => {
    const result = rebaseDraft(createDraft("old", {
      "duration.fast": { value: 120, unit: "ms" },
      "removed.token": 2,
    }), tokenBundle);
    expect(result.draft.overrides).toHaveProperty("duration.fast");
    expect(result.discarded).toEqual(["removed.token"]);
  });
});
```

- [ ] **Step 2: Run the draft tests and verify failure**

Run: `npx vitest run src/design-system/preview/draft.test.ts`

Expected: FAIL because the module does not exist.

- [ ] **Step 3: Implement draft persistence and export**

```ts
export const DRAFT_STORAGE_KEY = "malik-design-system:draft:v1";
export interface LocalTokenDraft {
  schemaVersion: 1;
  baseTokenHash: string;
  updatedAt: string;
  overrides: TokenOverrides;
}

export function loadDraft(storage: Storage): LocalTokenDraft | null {
  const raw = storage.getItem(DRAFT_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as LocalTokenDraft;
    return parsed.schemaVersion === 1 && typeof parsed.overrides === "object" ? parsed : null;
  } catch {
    return null;
  }
}
```

`saveDraft` serializes the value, `resetDraft` removes it, `rebaseDraft` retains only known same-type overrides, and `exportDraftDocuments` returns `applyOverrides(bundle, draft.overrides).documents`.

- [ ] **Step 4: Write failing runtime tests**

```ts
it("applies only known variables and can clear them", () => {
  applyDraftToRoot(document.documentElement, tokenBundle, {
    "duration.fast": { value: 120, unit: "ms" },
  });
  expect(document.documentElement.style.getPropertyValue("--duration-fast")).toBe("120ms");
  clearDraftFromRoot(document.documentElement, tokenBundle);
  expect(document.documentElement.style.getPropertyValue("--duration-fast")).toBe("");
});

it("requires an explicit query value for full-site preview", () => {
  expect(isLocalPreviewUrl(new URL("https://www.malikzhang.com/?design-preview=local"))).toBe(true);
  expect(isLocalPreviewUrl(new URL("https://www.malikzhang.com/"))).toBe(false);
});
```

- [ ] **Step 5: Implement runtime helpers and run tests**

`applyDraftToRoot` compiles the override bundle and sets only manifest CSS variables. `clearDraftFromRoot` removes only variables touched by the manifest. Define frame messages as `{ type: "malik-design-preview", overrides: TokenOverrides }` and validate message shape before applying.

Run: `npx vitest run src/design-system/preview`

Expected: PASS.

- [ ] **Step 6: Commit Task 4**

```bash
git add src/design-system/preview
git commit -m "feat: add local token preview runtime"
```

---

### Task 5: Add the VMedium-inspired reference shell and route

**Files:**
- Create: `src/design-system/reference/sectionModel.ts`
- Create: `src/design-system/reference/sectionModel.test.ts`
- Create: `src/design-system/reference/sections.tsx`
- Create: `src/design-system/reference/DesignSystemShell.tsx`
- Create: `src/design-system/reference/DesignSystemShell.test.tsx`
- Create: `src/pages/DesignSystem.tsx`
- Modify: `src/App.tsx`
- Modify: `src/components/Footer.tsx`

**Interfaces:**
- Produces: `DesignSystemSection`, `DESIGN_SYSTEM_GROUPS`, `resolveSectionHash`, and `getAdjacentSections`.
- Consumes later: section content components and preview provider.

- [ ] **Step 1: Write failing section-model tests**

```ts
it("resolves a stable hash and falls back to overview", () => {
  expect(resolveSectionHash("#foundation-color").id).toBe("foundation-color");
  expect(resolveSectionHash("#unknown").id).toBe("overview");
});

it("returns linear previous and next sections", () => {
  expect(getAdjacentSections("foundation-color")).toEqual({
    previous: expect.objectContaining({ id: "playground" }),
    next: expect.objectContaining({ id: "foundation-typography" }),
  });
});
```

- [ ] **Step 2: Define the complete registry**

```ts
export const DESIGN_SYSTEM_GROUPS: DesignSystemGroup[] = [
  { id: "start", label: "Start", sections: [
    { id: "overview", label: "Overview", description: "How Malik's portfolio system is structured, generated, and used." },
    { id: "playground", label: "Playground", description: "A browser-local token draft connected to the real portfolio." },
  ] },
  { id: "foundations", label: "Foundations", sections: [
    { id: "foundation-color", label: "Color", description: "Warm neutrals, semantic surfaces, text, borders, and portfolio accents." },
    { id: "foundation-typography", label: "Typography", description: "Display, body, and mono roles extracted from the current site." },
    { id: "foundation-spacing", label: "Spacing & layout", description: "Spacing rhythm, reading measures, page widths, and touch targets." },
    { id: "foundation-radius", label: "Radius & borders", description: "Shape and separation roles used by cards, media, and controls." },
    { id: "foundation-motion", label: "Motion", description: "Durations and easing roles for entry, movement, state change, and ambience." },
  ] },
  { id: "components", label: "Components", sections: [
    { id: "component-site-header", label: "Site header", description: "Shared responsive navigation and hide-on-scroll behavior." },
    { id: "component-project-card", label: "Project card", description: "The core selected-work preview and interaction states." },
    { id: "component-project-list", label: "Project list", description: "Section heading, project grid, and responsive grouping." },
    { id: "component-metadata-card", label: "Metadata card", description: "Compact role, timeline, and project-context summaries." },
    { id: "component-media-frame", label: "Media frame", description: "Consistent image, video, embed, and caption treatment." },
    { id: "component-footer", label: "Footer", description: "Secondary navigation, social links, and reference discovery." },
    { id: "component-lightbox", label: "Image lightbox", description: "Focused media inspection with keyboard and reduced-motion support." },
  ] },
  { id: "patterns", label: "Patterns", sections: [
    { id: "pattern-homepage-hero", label: "Homepage hero", description: "Canvas identity, terminal statement, and layered navigation." },
    { id: "pattern-case-study", label: "Case-study structure", description: "Editorial hierarchy, media rhythm, and narrative sections." },
    { id: "pattern-section-navigation", label: "Section navigation", description: "Sticky orientation across desktop and mobile case studies." },
    { id: "pattern-responsive", label: "Responsive behavior", description: "How density, hierarchy, and interaction adapt across viewports." },
    { id: "pattern-transitions", label: "Loading & transitions", description: "Font-aware entry, page transitions, and reduced-motion fallbacks." },
    { id: "pattern-expressive", label: "Expressive visuals", description: "DotGrid and About as art-directed systems rather than generic primitives." },
    { id: "pattern-accessibility", label: "Accessibility", description: "Keyboard, focus, contrast, target size, motion, and content resilience." },
  ] },
];
```

`DesignSystemSection` contains `id`, `label`, and `description`. Task 5 renders the description as complete baseline content; Task 6 replaces the body with richer section content while keeping the registry stable.

- [ ] **Step 3: Implement the shell with one rendered section**

`DesignSystemShell` listens to `hashchange`, renders a semantic `nav` labelled `Design system sections`, uses disclosure buttons with `aria-expanded`, renders only the active section's heading and description, and provides previous/next buttons that set `location.hash`. The mobile rail is a labelled disclosure, not a duplicated inaccessible nav. It accepts an optional `renderSection(section)` function that Task 6 uses for rich bodies.

- [ ] **Step 4: Write and run shell tests**

Test that only the active section body exists, clicking a unique rail item changes the hash, and the active section heading receives focus after navigation.

Run: `npx vitest run src/design-system/reference`

Expected: PASS.

- [ ] **Step 5: Add the lazy route and footer link**

```ts
const DesignSystem = lazy(() => import("./pages/DesignSystem.tsx"));
// Inside Routes, before the catch-all:
<Route path="/design-system" element={<DesignSystem />} />
```

Add `<a href="/design-system">Design System</a>` to Footer's Explore list while leaving the primary header unchanged.

- [ ] **Step 6: Commit Task 5**

```bash
git add src/App.tsx src/components/Footer.tsx src/pages/DesignSystem.tsx src/design-system/reference
git commit -m "feat: add design system reference shell"
```

---

### Task 6: Implement documentation content and production specimens

**Files:**
- Create: `src/design-system/reference/TokenTable.tsx`
- Create: `src/design-system/reference/Specimen.tsx`
- Create: `src/design-system/reference/content/Overview.tsx`
- Create: `src/design-system/reference/content/Foundations.tsx`
- Create: `src/design-system/reference/content/Components.tsx`
- Create: `src/design-system/reference/content/Patterns.tsx`
- Modify: `src/design-system/reference/sections.tsx`

**Interfaces:**
- Consumes: `tokenBundle.tokens` and actual reusable portfolio components.
- Produces: all non-Playground section renderers.

- [ ] **Step 1: Add focused rendering tests**

Test `TokenTable` with two records and assert it renders label, canonical path, CSS variable, production value, description, alias, and visual sample. Test `Specimen` with long usage copy and keyboard-focusable children.

- [ ] **Step 2: Implement `TokenTable`**

```tsx
export function TokenTable({ title, tokens }: { title: string; tokens: readonly TokenRecord[] }) {
  return (
    <section aria-labelledby={`${slug(title)}-heading`}>
      <h2 id={`${slug(title)}-heading`}>{title}</h2>
      <div role="list">
        {tokens.map((token) => (
          <article role="listitem" key={token.path}>
            <TokenVisual token={token} />
            <code>{token.path}</code>
            <code>{token.cssVariable}</code>
            <span>{displayProductionValue(token)}</span>
            <p>{token.description}</p>
            {token.aliasOf ? <span>Aliases {token.aliasOf}</span> : null}
          </article>
        ))}
      </div>
    </section>
  );
}
```

`TokenVisual` renders a swatch, type sample, spacing bar, radius shape, or easing curve based on type/path.

- [ ] **Step 3: Write the overview and foundation content**

The overview includes the six approved principles, the data flow `DTCG JSON → generated CSS/metadata → portfolio + reference`, direct links to the DTCG Format/Color/Resolver reports, and a clear production-versus-local-preview explanation. Foundations filter the generated manifest by canonical path; no values are copied into JSX.

- [ ] **Step 4: Write component and pattern content**

For each approved component/pattern include purpose, when to use it, representative real state, token dependencies, responsive behavior, and accessibility notes. Import real components when their existing public API permits safe embedding; use a linked live-portfolio frame for fixed or canvas-bound experiences instead of cloning them.

- [ ] **Step 5: Run content tests and build**

Run:

```bash
npx vitest run src/design-system/reference
npm run build
```

Expected: PASS and a successful production build.

- [ ] **Step 6: Commit Task 6**

```bash
git add src/design-system/reference
git commit -m "feat: document portfolio design foundations"
```

---

### Task 7: Build the public workbench and full-site preview mode

**Files:**
- Create: `src/design-system/preview/PreviewProvider.tsx`
- Create: `src/design-system/preview/PreviewBar.tsx`
- Create: `src/design-system/preview/PreviewProvider.test.tsx`
- Create: `src/design-system/workbench/TokenControl.tsx`
- Create: `src/design-system/workbench/TokenControl.test.tsx`
- Create: `src/design-system/workbench/TokenDiff.tsx`
- Create: `src/design-system/workbench/ContrastChecks.tsx`
- Create: `src/design-system/workbench/PortfolioPreview.tsx`
- Create: `src/design-system/workbench/ExportDraftButton.tsx`
- Create: `src/design-system/reference/content/Playground.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Produces: `usePreviewDraft()` with `draft`, `bundle`, `setOverride`, `resetToken`, `resetCategory`, `resetAll`, `discarded`, and `previewActive`.
- Consumes: draft/runtime APIs and generated bundle.

- [ ] **Step 1: Write failing provider and token-control tests**

```tsx
it("updates a local override without authentication", async () => {
  render(<PreviewProvider><Probe /></PreviewProvider>);
  await userEvent.click(screen.getByRole("button", { name: "Set fast duration" }));
  expect(JSON.parse(localStorage.getItem(DRAFT_STORAGE_KEY)!)).toMatchObject({
    overrides: { "duration.fast": { value: 120, unit: "ms" } },
  });
});

it("labels production and draft values", () => {
  render(<TokenControl token={durationToken} value={{ value: 120, unit: "ms" }} onChange={vi.fn()} />);
  expect(screen.getByText("Production: 200ms")).toBeInTheDocument();
  expect(screen.getByText("Draft: 120ms")).toBeInTheDocument();
});
```

- [ ] **Step 2: Implement `PreviewProvider`**

Initialize from localStorage, rebase against `tokenBundle`, save after every override, apply overrides to the root while on `/design-system`, and apply them globally only when `isLocalPreviewUrl(new URL(location.href))` is true. Expose typed update/reset actions through context.

- [ ] **Step 3: Implement bounded type-aware controls**

- HSL color controls: hue 0–359, saturation/lightness 0–100, alpha 0–1.
- Dimension controls: numeric input and unit-preserving slider when manifest metadata provides a range.
- Duration: 0–5000ms normalized to the token's unit.
- Number and font weight: bounded numeric input.
- Font family: options limited to fonts already loaded by the site.
- Cubic Bézier: four numeric inputs with x coordinates clamped to 0–1 and a curve preview.

Every control keeps a visible label plus production and draft values and calls `onChange` only with a valid DTCG value.

- [ ] **Step 4: Implement diff, contrast, preview, reset, and export**

Register these initial contrast pairs: primary text/canvas, muted text/canvas, primary text/card, and focus ring/canvas. Calculate WCAG ratios from HSL converted to sRGB. `PortfolioPreview` offers 320, 768, and 1440px viewport buttons and posts override messages to a same-origin iframe at `/?design-preview=local&embedded=1`. Embedded mode suppresses the global PreviewBar so it does not appear inside the specimen. Export builds a Blob from `exportDraftDocuments()` and downloads `malik-design-tokens.json` without a server request.

- [ ] **Step 5: Add full-site PreviewBar**

Wrap routes in `PreviewProvider`. When explicit preview mode is active, render a fixed, keyboard-accessible bar showing changed-token count and actions for Design System, Export, Reset, and Exit. Exit clears runtime overrides and removes preview query state without deleting the saved draft.

- [ ] **Step 6: Run workbench tests and build**

Run:

```bash
npx vitest run src/design-system/preview src/design-system/workbench
npm run build
```

Expected: PASS.

- [ ] **Step 7: Commit Task 7**

```bash
git add src/App.tsx src/design-system/preview src/design-system/workbench src/design-system/reference/content/Playground.tsx
git commit -m "feat: add public design token workbench"
```

---

### Task 8: Add the publish dialog and typed client

**Files:**
- Create: `src/design-system/publish/client.ts`
- Create: `src/design-system/publish/PublishDialog.tsx`
- Create: `src/design-system/publish/PublishDialog.test.tsx`
- Modify: `src/pages/DesignSystem.tsx`

**Interfaces:**
- Produces: `publishTokenDraft(request: PublishRequest): Promise<PublishSuccess>`.
- Consumes: generated `tokenSourceCommit` and `tokenBundle.tokenHash` for stale-production detection.
- Consumes later: `/api/design-system/publish` contract from Task 9.

- [ ] **Step 1: Write failing dialog tests**

Test that the public page exposes all sliders before Admin is selected, Admin opens the publish dialog, the password uses `type="password"`, invalid drafts disable submission, successful responses show a unique PR link, and neither localStorage nor emitted analytics receives the password.

- [ ] **Step 2: Define the client contract**

```ts
export interface PublishRequest {
  password: string;
  baseCommitSha: string;
  baseTokenHash: string;
  title: string;
  summary: string;
  overrides: TokenOverrides;
}
export interface PublishSuccess {
  pullRequestUrl: string;
  pullRequestNumber: number;
  branch: string;
  changedTokens: string[];
}

export async function publishTokenDraft(request: PublishRequest): Promise<PublishSuccess> {
  const response = await fetch("/api/design-system/publish", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(request),
  });
  const body = await response.json();
  if (!response.ok) throw new PublishError(response.status, body);
  return body as PublishSuccess;
}
```

- [ ] **Step 3: Implement the dialog**

Require a non-empty password, title between 8 and 120 characters, summary between 12 and 2000 characters, at least one valid override, and acknowledgement of the final diff. Populate `baseCommitSha` from generated `tokenSourceCommit` and `baseTokenHash` from `tokenBundle.tokenHash`. Clear the password on close, success, or failure. Keep the PR result visible until the user follows or dismisses it.

- [ ] **Step 4: Run dialog tests and commit Task 8**

Run: `npx vitest run src/design-system/publish`

Expected: PASS.

```bash
git add src/design-system/publish src/pages/DesignSystem.tsx
git commit -m "feat: add token publish review dialog"
```

---

### Task 9: Implement the authenticated GitHub PR endpoint

**Files:**
- Create: `api/design-system/github.ts`
- Create: `api/design-system/publish-core.ts`
- Create: `api/design-system/publish-core.test.ts`
- Create: `api/design-system/publish.ts`
- Modify: `vitest.config.ts`

**Interfaces:**
- Consumes: `PublishRequest`, `compileTokenSources`, `applyOverrides`, and `tokenSourceCommit` generated in Task 2.
- Produces: Vercel `POST` Web Handler response matching `PublishSuccess`.
- Environment: `DESIGN_SYSTEM_PUBLISH_PASSWORD_HASH`, `GITHUB_TOKEN`, `GITHUB_OWNER=Malik1942`, `GITHUB_REPO=Malik-Portfolio`.

- [ ] **Step 1: Configure Node API tests and write failing security tests**

Update Vitest include to `['src/**/*.{test,spec}.{ts,tsx}', 'api/**/*.{test,spec}.ts']`. Add `// @vitest-environment node` and tests for wrong password, unknown token path, stale base SHA, valid branch/commit/PR sequence, and GitHub failure after commit.

```ts
it("rejects an override outside the manifest before GitHub writes", async () => {
  const github = createFakeGithub();
  const response = await publishTokens(validRequest({ overrides: { "unknown.token": 4 } }), env, github);
  expect(response.status).toBe(422);
  expect(github.writeCalls).toHaveLength(0);
});

it("creates one commit on a new branch and opens a PR", async () => {
  const github = createFakeGithub();
  const response = await publishTokens(validRequest(), env, github);
  expect(response.status).toBe(201);
  expect(github.operations).toEqual(["read-main", "read-token-files", "create-blobs", "create-tree", "create-commit", "create-ref", "create-pr"]);
});
```

- [ ] **Step 2: Implement the narrow GitHub client**

Use `fetch` with `Authorization: Bearer`, `Accept: application/vnd.github+json`, `X-GitHub-Api-Version: 2022-11-28`, and repository-scoped paths. Implement methods to read `main`, read the base commit/tree and token files, create blobs, create a tree using `base_tree`, create one commit with the base SHA as parent, create `refs/heads/design-system/<slug>-<timestamp>`, and open a PR with `base: "main"`.

- [ ] **Step 3: Implement publish orchestration**

`publishTokens` must:

```ts
export async function publishTokens(
  request: PublishRequest,
  env: PublishEnvironment,
  github: GithubPublisher,
): Promise<PublishResult> {
  enforceRequestShape(request);
  verifyPassword(request.password, env.passwordHash);
  const base = await github.readMain();
  if (base.commitSha !== request.baseCommitSha) return conflict("Production changed. Rebase the local draft.");
  const sources = await github.readTokenFiles(base.commitSha, ALLOWED_TOKEN_FILES);
  const bundle = compileTokenSources(sources);
  if (bundle.tokenHash !== request.baseTokenHash) return conflict("Token sources changed. Rebase the local draft.");
  const next = applyOverrides(bundle, request.overrides);
  const changedTokens = Object.keys(request.overrides).sort();
  const files = serializeAllowedDocuments(next.documents, ALLOWED_TOKEN_FILES);
  const published = await github.openTokenPullRequest({ base, files, title: request.title, body: createPullRequestBody(request, bundle, next) });
  return created({ ...published, changedTokens });
}
```

Authentication compares a SHA-256 digest of the supplied password against the configured lowercase hex digest using `timingSafeEqual`. Enforce a 64KB body limit in the handler. Rate limiting uses Vercel Firewall configuration or a platform rule documented in the deployment handoff; the function still returns generic 401 responses and performs no GitHub writes before authentication.

- [ ] **Step 4: Implement the Vercel Web Handler**

```ts
import { publishTokensFromRequest } from "./publish-core";

export async function POST(request: Request): Promise<Response> {
  return publishTokensFromRequest(request, process.env);
}

export default { fetch: POST };
```

Reject non-JSON requests, catch malformed JSON, attach `cache-control: no-store`, and never include a credential or GitHub token in responses or logs.

- [ ] **Step 5: Verify SPA/API routing without changing the rewrite**

Keep the existing `vercel.json` unchanged. Vercel resolves filesystem functions before applying rewrites, so `/api/design-system/publish` resolves to the function while the existing catch-all continues to serve `index.html` for client routes. Verify with `npx vercel@latest build` when credentials and project linkage are available; local API tests remain the required repository check when the CLI cannot access project configuration.

- [ ] **Step 6: Run API tests and commit Task 9**

Run:

```bash
npx vitest run api/design-system/publish-core.test.ts
npm run build
```

Expected: PASS.

```bash
git add api vitest.config.ts
git commit -m "feat: publish token changes through pull requests"
```

---

### Task 10: Metadata, sitemap, accessibility, and final verification

**Files:**
- Create: `src/design-system/reference/useDesignSystemMetadata.ts`
- Create: `src/design-system/reference/useDesignSystemMetadata.test.tsx`
- Modify: `src/pages/DesignSystem.tsx`
- Modify: `public/sitemap.xml`
- Modify: `README.md`
- Create: `.env.example`

**Interfaces:**
- Produces: route-specific title, description, canonical, and social metadata restored on unmount.
- Documents: local generation, preview behavior, and Vercel/GitHub environment configuration.

- [ ] **Step 1: Write failing metadata tests**

Render the hook, assert title `Design System · Malik Zhang`, canonical `https://www.malikzhang.com/design-system`, description, Open Graph URL/title/description, and restoration of previous values after unmount.

- [ ] **Step 2: Implement metadata and sitemap**

Use a focused hook that snapshots existing attributes, upserts the route metadata, and restores it on cleanup. Add:

```xml
<url>
  <loc>https://www.malikzhang.com/design-system</loc>
</url>
```

to `public/sitemap.xml`.

- [ ] **Step 3: Document development and deployment**

README must include:

```text
npm run tokens:build
npm run dev
npm test
npm run build
```

Document `DESIGN_SYSTEM_PUBLISH_PASSWORD_HASH`, `GITHUB_TOKEN`, `GITHUB_OWNER`, and `GITHUB_REPO`; explain that the GitHub token needs repository Contents read/write and Pull Requests read/write permissions and that merging remains a manual GitHub action.

- [ ] **Step 4: Run the complete verification suite**

Run:

```bash
npm test
npm run lint
npm run build
git diff --check
rg -n 'TO[D]O|FIX[M]E|TB[D]' src api tokens scripts
```

Expected: tests, lint, build, and diff checks pass; the incomplete-marker scan returns no matches.

- [ ] **Step 5: Perform browser QA**

Verify at 320, 768, 1440, and ultrawide widths:

- `/design-system` overview, every rail group, hash deep links, back/forward, and previous/next.
- Keyboard-only navigation and focus placement.
- Production/draft labels, every supported control, category reset, full reset, and export.
- Embedded preview and full-site preview across homepage and one case study.
- Preview bar exit preserves the draft but removes runtime overrides.
- Reduced-motion behavior.
- Contrast results update with color edits.
- Admin publish dialog is the only gated UI and handles mocked success, unauthorized, conflict, validation, and GitHub failures.

- [ ] **Step 6: Request code review**

Invoke `superpowers:requesting-code-review`, address actionable findings, rerun the complete verification suite, and only then prepare the branch for handoff.

- [ ] **Step 7: Commit Task 10**

```bash
git add src/design-system/reference src/pages/DesignSystem.tsx public/sitemap.xml README.md .env.example
git commit -m "docs: finish design system launch setup"
```
