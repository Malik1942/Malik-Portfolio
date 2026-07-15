import { expect, test, type Locator, type Page } from "@playwright/test";
import { ABOUT_CLUSTER_DEFS } from "../src/lib/aboutClusters";

const MOBILE_VIEWPORT = { width: 390, height: 844 };
const CLUSTERS = [
  ["Who I Am", 0],
  ["Outside of Design", 1],
  ["How I Build", 2],
  ["What I Care About", 3],
] as const;

test.use({ viewport: MOBILE_VIEWPORT, reducedMotion: "reduce" });

async function boxOf(locator: Locator) {
  const box = await locator.boundingBox();
  if (!box) throw new Error("Expected the element to have a bounding box");
  return box;
}

async function openAbout(page: Page) {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const homeScroll = page.getByRole("button", { name: "Scroll to projects" });
  await expect(homeScroll).toBeVisible();
  const homeScrollBox = await boxOf(homeScroll);

  const aboutLink = page.locator('a[href="#about"]:visible');
  await expect(aboutLink).toHaveCount(1);
  await aboutLink.click();
  await expect(page.getByRole("button", { name: "Who I Am" })).toBeVisible();

  return { homeScrollBox };
}

test("centers mobile controls inside their particle clusters", async ({ page }) => {
  await openAbout(page);

  const canvas = await boxOf(page.locator('canvas[aria-hidden="true"]'));

  for (const [label, index] of CLUSTERS) {
    const control = await boxOf(page.getByRole("button", { name: label }));
    const definition = ABOUT_CLUSTER_DEFS[index];
    const actualCenter = {
      x: control.x + control.width / 2,
      y: control.y + control.height / 2,
    };
    const expectedCenter = {
      x: canvas.x + canvas.width * definition.rx,
      y: canvas.y + canvas.height * definition.ry,
    };

    expect(Math.abs(actualCenter.x - expectedCenter.x), `${label} horizontal center`).toBeLessThanOrEqual(2);
    expect(Math.abs(actualCenter.y - expectedCenter.y), `${label} vertical center`).toBeLessThanOrEqual(2);
  }
});

test("uses a compact two-line mobile statement", async ({ page }) => {
  await openAbout(page);

  const heading = page.locator("h2:visible").filter({ hasText: "I start with the real" });
  await expect(heading).toHaveCount(1);
  await expect(heading).toHaveCSS("font-size", "18px");
  const headingBox = await boxOf(heading);
  const outsideControl = page.getByRole("button", { name: "Outside of Design" });
  await outsideControl.click();
  await expect(outsideControl).toHaveAttribute("aria-expanded", "true");
  const firstOutsideLine = await boxOf(
    page.locator("#about-cluster-mobile-1-details").getByText("Photography", { exact: true }),
  );
  expect(headingBox.height).toBeLessThanOrEqual(60);
  expect(firstOutsideLine.y - (headingBox.y + headingBox.height)).toBeGreaterThanOrEqual(4);
});

test("keeps the mobile About scroll prompt at the home hero position", async ({ page }) => {
  const { homeScrollBox } = await openAbout(page);

  const visibleScrollLabels = page.locator("span:visible").filter({ hasText: "Scroll" });
  await expect(visibleScrollLabels).toHaveCount(1);
  const aboutScrollBox = await boxOf(visibleScrollLabels.locator(".."));

  const homeBottomInset = MOBILE_VIEWPORT.height - (homeScrollBox.y + homeScrollBox.height);
  const aboutBottomInset = MOBILE_VIEWPORT.height - (aboutScrollBox.y + aboutScrollBox.height);
  expect(Math.abs(aboutBottomInset - homeBottomInset)).toBeLessThanOrEqual(2);
});

test("keeps expanded cluster copy clear of the statement on a compact phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 667 });
  await openAbout(page);

  const headingLocator = page.locator("h2:visible").filter({ hasText: "I start with the real" });
  await expect(headingLocator).toHaveCSS("font-size", "15px");
  const heading = await boxOf(headingLocator);
  const outsideControl = page.getByRole("button", { name: "Outside of Design" });
  await outsideControl.click();
  await expect(outsideControl).toHaveAttribute("aria-expanded", "true");
  const outsideDetails = await boxOf(page.locator("#about-cluster-mobile-1-details"));

  expect(outsideDetails.y - (heading.y + heading.height)).toBeGreaterThanOrEqual(4);
});

test("preserves the full composition on a short narrow phone", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await openAbout(page);

  const headingLocator = page.locator("h2:visible").filter({ hasText: "I start with the real" });
  await expect(headingLocator).toHaveCSS("font-size", "13px");
  const heading = await boxOf(headingLocator);
  const howControl = await boxOf(page.getByRole("button", { name: "How I Build" }));
  const outsideControl = page.getByRole("button", { name: "Outside of Design" });
  const visibleScrollLabels = page.locator("span:visible").filter({ hasText: "Scroll" });
  const scrollBox = await boxOf(visibleScrollLabels.locator(".."));

  expect(heading.y - (howControl.y + howControl.height)).toBeGreaterThanOrEqual(4);
  await outsideControl.click();
  await expect(outsideControl).toHaveAttribute("aria-expanded", "true");
  const outsideDetails = await boxOf(page.locator("#about-cluster-mobile-1-details"));

  expect(outsideDetails.y - (heading.y + heading.height)).toBeGreaterThanOrEqual(4);
  expect(scrollBox.y - (outsideDetails.y + outsideDetails.height)).toBeGreaterThanOrEqual(2);
});
