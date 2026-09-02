import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function projectSlugs(): string[] {
  // Regex instead of importing projectDetails.ts: that module pulls in 100+ media assets.
  const source = readFileSync(resolve("src/data/projectDetails.ts"), "utf8");
  return [...source.matchAll(/^\s*slug: "([a-z0-9-]+)"/gm)].map((match) => match[1]);
}

function sitemapProjectSlugs(): string[] {
  const xml = readFileSync(resolve("public/sitemap.xml"), "utf8");
  return [...xml.matchAll(/https:\/\/www\.malikzhang\.com\/project\/([a-z0-9-]+)/g)].map(
    (match) => match[1],
  );
}

describe("sitemap", () => {
  it("lists every case-study slug from projectDetails", () => {
    const slugs = projectSlugs();
    expect(slugs.length).toBeGreaterThan(0);
    expect([...sitemapProjectSlugs()].sort()).toEqual([...slugs].sort());
  });
});
