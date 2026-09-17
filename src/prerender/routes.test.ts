import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { PROJECT_DETAILS } from "@/data/projectDetails";
import { HOME_DESCRIPTION, HOME_TITLE } from "@/lib/siteMeta";
import { renderSitemap } from "./html";
import { ROUTES } from "./routes";

describe("prerender routes", () => {
  it("has one route per case study, each with its own title, description and share image", () => {
    for (const doc of Object.values(PROJECT_DETAILS)) {
      const route = ROUTES.find((r) => r.path === `/project/${doc.slug}`);
      expect(route, doc.slug).toBeDefined();
      expect(route?.title).toContain(doc.title);
      expect(route?.description, `${doc.slug} description`).toBeTruthy();
      expect(route?.image).toBe(`/og/${doc.slug}.jpg`);
    }
  });

  it("gives every route a title and description of its own", () => {
    for (const route of ROUTES) {
      expect(route.title, route.path).toBeTruthy();
      expect(route.description, route.path).toBeTruthy();
    }
  });

  it("has no duplicate paths, and every path and canonical is root-relative", () => {
    const paths = ROUTES.map((r) => r.path);
    expect(new Set(paths).size).toBe(paths.length);
    for (const route of ROUTES) {
      expect(route.path.startsWith("/")).toBe(true);
      if (route.canonical) expect(route.canonical.startsWith("/")).toBe(true);
    }
  });

  it("lists every case study in the sitemap", () => {
    const xml = renderSitemap(ROUTES);
    for (const doc of Object.values(PROJECT_DETAILS)) {
      expect(xml).toContain(`<loc>https://www.malikzhang.com/project/${doc.slug}</loc>`);
    }
  });

  it("keeps deep links out of the sitemap", () => {
    const connect = ROUTES.find((r) => r.path === "/about/connect");
    expect(connect?.sitemap).toBe(false);
    expect(connect?.canonical).toBe("/about");
  });

  // index.html is the SPA fallback shell and carries the homepage's metadata
  // as static markup. The homepage sets the same values from siteMeta.ts at
  // runtime, so the two must agree.
  it("matches index.html's static title and description", () => {
    const html = readFileSync(resolve("index.html"), "utf8");
    expect(html).toContain(`<title>${HOME_TITLE}</title>`);
    expect(html).toContain(`<meta name="description" content="${HOME_DESCRIPTION}">`);
  });
});
