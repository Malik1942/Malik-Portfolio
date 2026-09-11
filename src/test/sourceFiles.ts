import { readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

/**
 * The production source, as the guard tests see it.
 *
 * Several tests scan the source for things the compiler cannot catch — off-system
 * Tailwind classes that generate no CSS, scrolls that animate when they must not.
 * They all need the same answer to "which files count as production", so it is
 * given once here: the definition of that set is itself a decision, and two
 * copies of it drift.
 */
export function sourceFiles(roots: string[], repoRoot = process.cwd()): string[] {
  return roots.flatMap((root) => walk(join(repoRoot, root))).map((file) => relative(repoRoot, file));
}

function walk(path: string, files: string[] = []): string[] {
  if (statSync(path).isFile()) {
    if (/\.(ts|tsx)$/.test(path) && !/\.test\.tsx?$/.test(path) && !path.includes("/generated/")) {
      files.push(path);
    }
    return files;
  }
  for (const entry of readdirSync(path)) walk(join(path, entry), files);
  return files;
}
