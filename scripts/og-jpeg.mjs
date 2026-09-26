/**
 * Shared by the share-image generators: screenshot a clip as a JPEG that stays
 * under OG_MAX_BYTES, at the highest quality that fits.
 *
 * Why the cap: LinkedIn's scraper fetches only the first 64 KiB of a resource
 * (Post Inspector reports the page as "206", a partial response). A share
 * image larger than that arrives truncated and LinkedIn stores a 1×1 blank in
 * its place, so the preview shows an empty box. Confirmed Sep 2026: the 62 KB
 * logo came through, the 80 KB og-image.png did not. iMessage and others fetch
 * the whole file, so an oversize image looks fine everywhere except LinkedIn.
 *
 * Quality is held at MIN_QUALITY or above; a detailed image steps down in
 * size instead (LinkedIn shows the preview at 480px wide anyway), and only the
 * smallest size may go below that quality.
 */
import { writeFile } from "node:fs/promises";

/** 64 KiB, with headroom. */
export const OG_MAX_BYTES = 60_000;

const QUALITIES = [88, 84, 80, 76, 72, 68, 64, 60];
const LAST_RESORT_QUALITIES = [56, 52, 48, 44, 40];
/** Fallback widths; each keeps the clip's aspect ratio. 800 still clears Facebook's 600px minimum for a large card. */
const FALLBACK_WIDTHS = [960, 800];

async function firstUnderCap(shoot, qualities) {
  for (const quality of qualities) {
    const buffer = await shoot(quality);
    if (buffer.length <= OG_MAX_BYTES) return { buffer, quality };
  }
  return null;
}

export async function screenshotOgJpeg(page, clip, path) {
  let width = clip.width;
  let found = await firstUnderCap((quality) => page.screenshot({ type: "jpeg", quality, clip }), QUALITIES);

  if (!found) {
    const png = await page.screenshot({ type: "png", clip });
    const scratch = await page.context().browser().newPage();
    try {
      for (const [i, w] of FALLBACK_WIDTHS.entries()) {
        const h = Math.round((w * clip.height) / clip.width);
        await scratch.setViewportSize({ width: w, height: h });
        await scratch.setContent(
          `<body style="margin:0"><img src="data:image/png;base64,${png.toString("base64")}" style="display:block;width:${w}px;height:${h}px"></body>`,
        );
        await scratch.waitForFunction(() => document.images[0]?.complete);
        const last = i === FALLBACK_WIDTHS.length - 1;
        found = await firstUnderCap(
          (quality) => scratch.screenshot({ type: "jpeg", quality, clip: { x: 0, y: 0, width: w, height: h } }),
          last ? [...QUALITIES, ...LAST_RESORT_QUALITIES] : QUALITIES,
        );
        if (found) {
          width = w;
          break;
        }
      }
    } finally {
      await scratch.close();
    }
  }

  if (!found) {
    throw new Error(
      `${path}: still over ${OG_MAX_BYTES} bytes at ${FALLBACK_WIDTHS.at(-1)}px wide. ` +
        "LinkedIn would show a blank preview; simplify the image.",
    );
  }
  await writeFile(path, found.buffer);
  return { quality: found.quality, bytes: found.buffer.length, width };
}
