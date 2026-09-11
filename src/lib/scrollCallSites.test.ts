import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { sourceFiles } from "@/test/sourceFiles";

/**
 * Reduced motion, enforced at the call site.
 *
 * Two mistakes hide in a scroll call, and neither one warns. The first is
 * animating for a reader who asked us not to. The second is subtler: per
 * CSSOM-View `behavior: "auto"` — which is also what the positional
 * `scrollTo(x, y)` means — asks the browser to *defer to CSS*, and
 * `html { scroll-behavior: smooth }` in index.css is waiting to claim exactly
 * that. So a call that reads like a jump animates instead.
 *
 * Both are answered the same way: a scroll either says "instant" outright, or
 * lives in a file that reads `prefersReducedMotion` and branches on it. This
 * checks the file rather than the line, which is coarse on purpose — it is a
 * tripwire for the call site that forgot, not a proof of correctness.
 */

const ROOT = process.cwd();
const SCROLL_CALL = /\b(?:scrollTo|scrollBy|scrollIntoView)\(/;
const HONOURS_REDUCED_MOTION = /from "[^"]*prefersReducedMotion";/;

describe("scroll call sites", () => {
  const files = sourceFiles(["src"], ROOT).filter((file) => !file.startsWith("src/test/"));

  it("scans the production source", () => {
    expect(files.length).toBeGreaterThan(100);
  });

  it("lets nothing animate a scroll behind a reduced-motion reader's back", () => {
    const offenders: string[] = [];
    for (const file of files) {
      const source = readFileSync(join(ROOT, file), "utf8");
      if (HONOURS_REDUCED_MOTION.test(source)) continue;
      source.split("\n").forEach((line, index) => {
        if (SCROLL_CALL.test(line) && !line.includes('"instant"')) {
          offenders.push(`${file}:${index + 1}  ${line.trim()}`);
        }
      });
    }
    expect(
      offenders,
      'Call a scroll helper from src/lib, read prefersReducedMotion and branch on it,\n' +
        'or pass behavior: "instant". Never "auto" — index.css turns that back into smooth.\n' +
        offenders.join("\n"),
    ).toEqual([]);
  });
});
