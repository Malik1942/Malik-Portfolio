"""Replace a static, compression-damaged background in a reel with a clean plate.

The reel's background never moves, so its damage is one fixed pattern. A clean
plate is built from a frame where only the background and the centred title
card show: the title glyphs are masked out, the rest is blurred into the smooth
gradient it was meant to be, and a fine static grain is laid back on so the
dark gradient does not band. Every frame then keeps its own pixels wherever
they differ from the old background (the phone, the title card) and takes the
clean plate wherever they still match it. Work happens in YUV 4:2:0 so no
colour conversion touches the phone.

Anything outside the phone's silver ring is background too: the screen
recording's square corners poke past the rounded frame at the top and the
bottom, and they go with the old background.

A reel whose phone moves (the homepage card pushes in) passes PHONE_TIME -1:
no silhouette, and pixels are judged by their distance to the clean plate
rather than to the old background, since a camera move can leave the old
background a level apart between shots.

usage: python3 scripts/clean-reel-background.py SRC OUT PLATE_TIME PHONE_TIME [GRAIN]
  hero: ... src/assets/oryne-hero-loop.mp4 out.mp4 0.3 13
  card: ... src/assets/oryne-card.mp4 out.mp4 0.3 -1
  (run it on the pre-fix encodes from git, commit 5997751 or earlier)
"""
import subprocess
import sys

import numpy as np
from scipy.ndimage import binary_dilation, gaussian_filter

src, out, plate_t, phone_t = sys.argv[1], sys.argv[2], float(sys.argv[3]), float(sys.argv[4])
grain = float(sys.argv[5]) if len(sys.argv) > 5 else 1.0

probe = subprocess.check_output(
    ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
     "stream=width,height,r_frame_rate", "-of", "csv=p=0", src], text=True).strip().split(",")
W, H = int(probe[0]), int(probe[1])
rate = probe[2]
CW, CH = W // 2, H // 2
FRAME = W * H + 2 * CW * CH


def planes(buf):
    a = np.frombuffer(buf, np.uint8)
    y = a[: W * H].reshape(H, W).astype(np.float32)
    u = a[W * H: W * H + CW * CH].reshape(CH, CW).astype(np.float32)
    v = a[W * H + CW * CH:].reshape(CH, CW).astype(np.float32)
    return y, u, v


def read_frame_at(t):
    buf = subprocess.check_output(
        ["ffmpeg", "-v", "error", "-ss", str(t), "-i", src, "-frames:v", "1",
         "-f", "rawvideo", "-pix_fmt", "yuv420p", "-"])
    return planes(buf[:FRAME])


def masked_blur(p, keep, sigma):
    num = gaussian_filter(p * keep, sigma)
    den = gaussian_filter(keep.astype(np.float32), sigma)
    return num / np.maximum(den, 1e-4)


y0, u0, v0 = read_frame_at(plate_t)

# Title glyphs: anything that stands out from the local background.
glyph = np.abs(y0 - gaussian_filter(y0, 25)) > 5
glyph = binary_dilation(glyph, iterations=14)
glyph_c = glyph[::2, ::2] | glyph[1::2, ::2] | glyph[::2, 1::2] | glyph[1::2, 1::2]
keep_y = (~glyph).astype(np.float32)
keep_c = (~glyph_c).astype(np.float32)

rng = np.random.default_rng(7)
yc = masked_blur(y0, keep_y, 40) + gaussian_filter(rng.normal(0, 1, (H, W)), 0.6) * grain * 2.2
uc = masked_blur(u0, keep_c, 20) + rng.normal(0, 0.35, (CH, CW))
vc = masked_blur(v0, keep_c, 20) + rng.normal(0, 0.35, (CH, CW))
yc, uc, vc = (np.clip(np.rint(p), 16, 240).astype(np.float32) for p in (yc, uc, vc))

# The phone's silhouette, row by row, from its silver ring: everything left of
# the ring's first bright pixel or right of its last is outside the phone.
moving = phone_t < 0
outside = np.zeros((H, W), bool) if moving else np.ones((H, W), bool)
yp = None if moving else read_frame_at(phone_t)[0]
cols = np.arange(W)
for r in ([] if moving else range(H)):
    bright = np.where(yp[r] > 100)[0]
    if len(bright):
        lo, hi = bright.min(), bright.max()
        # Just outside the ring, the ring's own antialiasing is lighter than the
        # background and stays; a leftover sliver of a square corner is darker.
        near = ((cols >= lo - 4) & (cols < lo)) | ((cols > hi) & (cols <= hi + 4))
        outside[r] = (cols < lo - 4) | (cols > hi + 4) | (near & (yp[r] < yc[r] - 6))
outside_f = outside.astype(np.float32)

# The old background, as reference: known everywhere except under the glyphs,
# where no frame ever shows bare background, so nothing there is replaced.
yo, uo, vo = y0, u0, v0


def smoothstep(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


dec = subprocess.Popen(["ffmpeg", "-v", "error", "-i", src, "-f", "rawvideo", "-pix_fmt", "yuv420p", "-"],
                       stdout=subprocess.PIPE)
enc = subprocess.Popen(
    # The colour tags go on the input: on the output they make ffmpeg convert
    # the frames from an assumed BT.601 matrix, which shifts the blue.
    ["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "yuv420p", "-s", f"{W}x{H}", "-r", rate,
     "-color_range", "tv", "-colorspace", "bt709", "-i", "-", "-an", "-c:v", "libx264", "-preset", "slower", "-crf", "17", "-tune", "grain",
     "-x264-params", "aq-mode=3:keyint=900:min-keyint=900", "-pix_fmt", "yuv420p",
     "-movflags", "+faststart", out],
    stdin=subprocess.PIPE)

n = 0
while True:
    buf = dec.stdout.read(FRAME)
    if len(buf) < FRAME:
        break
    y, u, v = planes(buf)
    ry, ru, rv = (yc, uc, vc) if moving else (yo, uo, vo)
    dc = np.maximum(np.abs(u - ru), np.abs(v - rv))
    dc_full = np.repeat(np.repeat(dc, 2, 0), 2, 1)
    d = np.maximum(np.abs(y - ry), dc_full * 1.5)
    edge = (5, 9) if moving else (4, 12)
    w = np.maximum((1 - smoothstep(*edge, d)) * keep_y, outside_f)
    wc = (w[::2, ::2] + w[1::2, ::2] + w[::2, 1::2] + w[1::2, 1::2]) / 4
    y2 = w * yc + (1 - w) * y
    u2 = wc * uc + (1 - wc) * u
    v2 = wc * vc + (1 - wc) * v
    enc.stdin.write(np.concatenate([np.rint(p).astype(np.uint8).ravel() for p in (y2, u2, v2)]).tobytes())
    n += 1

enc.stdin.close()
enc.wait()
dec.wait()
print(f"frames {n}")
