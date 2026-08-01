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
