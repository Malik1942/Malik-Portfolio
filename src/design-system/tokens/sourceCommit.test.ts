import { describe, expect, it } from "vitest";
import { resolveTokenSourceCommit } from "./sourceCommit";

describe("resolveTokenSourceCommit", () => {
  it("keeps local builds non-publishable when Vercel provenance is absent", () => {
    expect(resolveTokenSourceCommit(undefined)).toBe("development");
    expect(resolveTokenSourceCommit("")).toBe("development");
  });

  it("accepts a Vercel Git commit SHA as production provenance", () => {
    const sha = "0123456789abcdef0123456789abcdef01234567";
    expect(resolveTokenSourceCommit(sha)).toBe(sha);
  });

  it("rejects malformed provenance instead of enabling publishing", () => {
    expect(resolveTokenSourceCommit("main")).toBe("development");
    expect(resolveTokenSourceCommit("0123456789abcdef")).toBe("development");
  });
});
