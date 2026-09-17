import { describe, expect, it } from "vitest";
import {
  applyRouteMeta,
  injectApp,
  neutralizeMedia,
  renderSitemap,
  routeToFile,
} from "./html";

const SHELL = `<!doctype html><html><head>
<title>Home – Site</title>
<meta name="description" content="Home description">
<link rel="canonical" href="https://www.malikzhang.com/">
<meta property="og:title" content="Home – Site">
<meta property="og:description" content="Home description">
<meta property="og:url" content="https://www.malikzhang.com">
<meta property="og:image" content="https://www.malikzhang.com/og-image.png">
<meta name="twitter:title" content="Home – Site">
<meta name="twitter:description" content="Home description">
<meta name="twitter:image" content="https://www.malikzhang.com/og-image.png">
</head><body><div id="root"></div></body></html>`;

describe("applyRouteMeta", () => {
  it("stamps a route's title, description, canonical and share tags", () => {
    const html = applyRouteMeta(SHELL, {
      path: "/project/oryne",
      title: 'Oryne "the app" | Malik Zhang',
      description: "Thoughts & currents",
      image: "/og/oryne.jpg",
    });
    expect(html).toContain("<title>Oryne &quot;the app&quot; | Malik Zhang</title>");
    expect(html).toContain('<meta property="og:title" content="Oryne &quot;the app&quot; | Malik Zhang">');
    expect(html).toContain('<meta name="twitter:title" content="Oryne &quot;the app&quot; | Malik Zhang">');
    expect(html).toContain('<meta name="description" content="Thoughts &amp; currents">');
    expect(html).toContain('<meta property="og:description" content="Thoughts &amp; currents">');
    expect(html).toContain('<link rel="canonical" href="https://www.malikzhang.com/project/oryne">');
    expect(html).toContain('<meta property="og:url" content="https://www.malikzhang.com/project/oryne">');
    expect(html).toContain('<meta property="og:image" content="https://www.malikzhang.com/og/oryne.jpg">');
    expect(html).toContain('<meta name="twitter:image" content="https://www.malikzhang.com/og/oryne.jpg">');
    expect(html).not.toContain("Home description");
  });

  it("keeps the shell's title and description when a route sets none, but still owns its canonical", () => {
    const html = applyRouteMeta(SHELL, { path: "/about/connect", canonical: "/about" });
    expect(html).toContain("<title>Home – Site</title>");
    expect(html).toContain('<meta name="description" content="Home description">');
    expect(html).toContain('<link rel="canonical" href="https://www.malikzhang.com/about">');
    expect(html).toContain('<meta property="og:url" content="https://www.malikzhang.com/about">');
    expect(html).toContain('<meta property="og:image" content="https://www.malikzhang.com/og-image.png">');
  });

  it("fails the build when the shell has lost a tag", () => {
    const broken = SHELL.replace(/<link rel="canonical"[^>]*>/, "");
    expect(() => applyRouteMeta(broken, { path: "/about" })).toThrow(/canonical/);
  });
});

describe("injectApp", () => {
  it("puts the app markup inside #root, keeping `$` sequences literal", () => {
    const html = injectApp(SHELL, '<main>Costs $1 and $& more</main>');
    expect(html).toContain('<div id="root"><main>Costs $1 and $& more</main></div>');
  });

  it("refuses a shell without an empty root", () => {
    expect(() => injectApp(SHELL.replace('<div id="root"></div>', ""), "<p/>")).toThrow(/#root/);
  });
});

describe("neutralizeMedia", () => {
  it("strips a reel's src and autoplay and turns preload off, keeping poster and label", () => {
    const input =
      '<video src="/assets/reel.mp4" poster="/assets/poster.webp" autoplay="" loop="" muted="" playsinline="" preload="auto" aria-label="Oryne" class="w-full"><source src="/assets/reel.webm" type="video/webm"></video>';
    const out = neutralizeMedia(input);
    expect(out).toBe(
      '<video preload="none" poster="/assets/poster.webp" loop="" muted="" playsinline="" aria-label="Oryne" class="w-full"></video>',
    );
  });

  it("leaves images alone", () => {
    const img = '<img src="/assets/cover.webp" loading="lazy" alt="">';
    expect(neutralizeMedia(img)).toBe(img);
  });
});

describe("routeToFile", () => {
  it("maps the root to index.html and nested paths to a directory index", () => {
    expect(routeToFile("/")).toBe("index.html");
    expect(routeToFile("/about")).toBe("about/index.html");
    expect(routeToFile("/project/oryne")).toBe("project/oryne/index.html");
  });
});

describe("renderSitemap", () => {
  it("lists canonical URLs and leaves deep links out", () => {
    const xml = renderSitemap([
      { path: "/" },
      { path: "/about/connect", canonical: "/about", sitemap: false },
      { path: "/project/oryne" },
    ]);
    expect(xml).toContain("<loc>https://www.malikzhang.com/</loc>");
    expect(xml).toContain("<loc>https://www.malikzhang.com/project/oryne</loc>");
    expect(xml).not.toContain("connect");
    expect(xml).not.toContain("/about</loc>");
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
  });
});
