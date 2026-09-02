import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { PROJECTS } from "@/data/projects";

// `coverAspect` reserves each card's media box before the cover has loaded, so
// that a project-dot scroll lands on the card it aimed at instead of drifting
// while the page grows underneath it (see CardMedia in ProjectList).
//
// It is a hand-declared copy of a fact that really lives in the image file, and
// the failure mode when it goes stale is silent and ugly: swap a cover for one
// with a different shape and every card below it is reserved at the wrong
// height, which both letterboxes the card and puts the dot navigation back where
// it started. So the numbers are checked against the actual pixels here rather
// than trusted.

const ASSET_DIR = path.resolve(__dirname, "../assets");

/** Intrinsic size of a WebP, read from its header — VP8 (lossy), VP8L
 *  (lossless) and VP8X (extended) each store it somewhere different. */
function webpSize(file: string): { width: number; height: number } {
  const buf = readFileSync(file);
  expect(buf.toString("ascii", 0, 4), `${file} is not a RIFF file`).toBe("RIFF");
  expect(buf.toString("ascii", 8, 12), `${file} is not WebP`).toBe("WEBP");

  const chunk = buf.toString("ascii", 12, 16);

  if (chunk === "VP8 ") {
    // Key-frame header: 3-byte frame tag, then the 3-byte start code.
    expect([buf[23], buf[24], buf[25]], `${file} lossy start code`).toEqual([0x9d, 0x01, 0x2a]);
    return {
      width: buf.readUInt16LE(26) & 0x3fff,
      height: buf.readUInt16LE(28) & 0x3fff,
    };
  }

  if (chunk === "VP8L") {
    expect(buf[20], `${file} lossless signature`).toBe(0x2f);
    const bits = buf.readUInt32LE(21);
    return {
      width: (bits & 0x3fff) + 1,
      height: ((bits >> 14) & 0x3fff) + 1,
    };
  }

  if (chunk === "VP8X") {
    // Canvas size, stored minus one as two 24-bit little-endian values.
    return {
      width: (buf[24] | (buf[25] << 8) | (buf[26] << 16)) + 1,
      height: (buf[27] | (buf[28] << 8) | (buf[29] << 16)) + 1,
    };
  }

  throw new Error(`${file}: unrecognised WebP chunk "${chunk}"`);
}

/** Display size of an MP4, from the first track header that declares one.
 *  `tkhd` stores it as 16.16 fixed point; audio tracks carry 0x0. */
function mp4Size(file: string): { width: number; height: number } {
  const buf = readFileSync(file);

  const walk = (start: number, end: number): { width: number; height: number } | null => {
    let at = start;
    while (at + 8 <= end) {
      const size = buf.readUInt32BE(at);
      const type = buf.toString("ascii", at + 4, at + 8);
      if (size < 8) break;

      if (type === "moov" || type === "trak") {
        const found = walk(at + 8, Math.min(at + size, end));
        if (found) return found;
      } else if (type === "tkhd") {
        const version = buf[at + 8];
        const dims = at + 8 + (version === 1 ? 96 - 8 : 84 - 8);
        const width = buf.readUInt32BE(dims) / 65536;
        const height = buf.readUInt32BE(dims + 4) / 65536;
        if (width && height) return { width, height };
      }
      at += size;
    }
    return null;
  };

  const size = walk(0, buf.length);
  if (!size) throw new Error(`${file}: no tkhd with display dimensions`);
  return size;
}

const projects = PROJECTS;

describe("cover aspect ratios", () => {
  it("covers every project card that has a cover image", () => {
    const missing = projects.filter((p) => p.coverImage && !p.coverAspect).map((p) => p.id);
    expect(missing, "a cover with no declared ratio reserves no box").toEqual([]);
  });

  it.each(projects.filter((p) => p.coverAspect))(
    "$id declares the ratio its cover media actually has",
    ({ id, coverImage, coverVideo, coverAspect }) => {
      // Whichever asset ends up governing the box: a card with a reel settles at
      // the video's ratio (the poster only stands in until the first frame is
      // decoded), so the video is the one that has to match or the box would be
      // a hair off once it loads.
      const governing = coverVideo ?? coverImage!;
      // Vite hands the import back as a URL; the file itself sits in src/assets.
      const file = path.join(ASSET_DIR, path.basename(new URL(governing, "file:///").pathname));
      expect(existsSync(file), `${id}: could not find ${file}`).toBe(true);

      const { width, height } = file.endsWith(".mp4") ? mp4Size(file) : webpSize(file);
      const [declaredW, declaredH] = coverAspect!.split("/").map(Number);

      // Exact, because these are meant to be the file's own numbers. Compared as
      // a ratio so an equivalent form (e.g. 16/9) is still accepted.
      expect(
        declaredW / declaredH,
        `${id}: declared ${coverAspect} but ${path.basename(file)} is ${width}x${height}`,
      ).toBeCloseTo(width / height, 4);
    },
  );
});
