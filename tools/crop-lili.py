#!/usr/bin/env python3
"""Cut Lili's poses out of the character sheet and drop the flat background.

The sheet is one 1254×1254 PNG with several poses on a flat pink field (plus a
tinted circle behind the hero pose). Flood-filling inward from the crop edges
removes the field without touching the character, which colour-keying would eat
into — her fur and leotard sit in the same pink family as the background.

    python3 tools/crop-lili.py
"""
import os
import sys
from collections import deque

from PIL import Image, ImageFilter

SRC = "assets/source/lili-sheet.png"
OUT = "www/img"

# name, (left, top, right, bottom), keep_background
# The hero keeps its tinted circle — it reads as a designed backdrop, and
# cutting it out would leave a clipped arc instead.
POSES = [
    # right edge stops short of the sheet's logo ribbon at x≈700
    ("lili-split",  (8, 34, 672, 850),      True),
    ("lili-bridge", (628, 498, 1004, 802),  False),
    ("lili-sit",    (938, 502, 1250, 836),  False),
    ("lili-scale",  (618, 858, 942, 1238),  False),
    ("lili-happy",  (932, 962, 1248, 1254), False),
]

TOL = 34          # per-channel distance counted as "same as background"
FEATHER = 1.2     # blur radius on the alpha edge, to avoid a hard cutout line


def flood(img, seeds, tol):
    """Alpha mask: 0 where connected-to-seed background, 255 elsewhere."""
    w, h = img.size
    px = img.load()
    mask = bytearray([255]) * (w * h)
    seen = bytearray(w * h)
    q = deque()

    for sx, sy in seeds:
        if 0 <= sx < w and 0 <= sy < h and not seen[sy * w + sx]:
            seen[sy * w + sx] = 1
            q.append((sx, sy, px[sx, sy][:3]))

    while q:
        x, y, ref = q.popleft()
        mask[y * w + x] = 0
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and not seen[ny * w + nx]:
                c = px[nx, ny]
                if (abs(c[0] - ref[0]) <= tol and abs(c[1] - ref[1]) <= tol
                        and abs(c[2] - ref[2]) <= tol):
                    seen[ny * w + nx] = 1
                    # carry the *original* seed colour so drift stays bounded
                    q.append((nx, ny, ref))
    return Image.frombytes("L", (w, h), bytes(mask))


def drop_specks(alpha, min_frac=0.004):
    """Erase small islands the flood missed — stray hearts, stars, confetti."""
    w, h = alpha.size
    px = alpha.load()
    seen = bytearray(w * h)
    min_area = int(w * h * min_frac)

    for sy in range(h):
        for sx in range(w):
            if seen[sy * w + sx] or px[sx, sy] < 128:
                continue
            blob, q = [], deque([(sx, sy)])
            seen[sy * w + sx] = 1
            while q:
                x, y = q.popleft()
                blob.append((x, y))
                for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                    if 0 <= nx < w and 0 <= ny < h and not seen[ny * w + nx] \
                            and px[nx, ny] >= 128:
                        seen[ny * w + nx] = 1
                        q.append((nx, ny))
            if len(blob) < min_area:
                for x, y in blob:
                    px[x, y] = 0
    return alpha


def main():
    if not os.path.exists(SRC):
        sys.exit("missing " + SRC)
    os.makedirs(OUT, exist_ok=True)
    sheet = Image.open(SRC).convert("RGB")

    for name, box, keep_bg in POSES:
        crop = sheet.crop(box)
        w, h = crop.size
        out = crop.convert("RGBA")

        if not keep_bg:
            # walk the entire border — the background touches every edge
            seeds = [(x, 0) for x in range(0, w, 4)]
            seeds += [(x, h - 1) for x in range(0, w, 4)]
            seeds += [(0, y) for y in range(0, h, 4)]
            seeds += [(w - 1, y) for y in range(0, h, 4)]

            alpha = drop_specks(flood(crop, seeds, TOL))
            alpha = alpha.filter(ImageFilter.GaussianBlur(FEATHER))
            out.putalpha(alpha)
            bbox = out.getbbox()
            if bbox:
                out = out.crop(bbox)

        out.thumbnail((640, 640), Image.LANCZOS)
        if keep_bg:
            # no alpha to preserve, so JPEG at a fraction of the bytes
            path = os.path.join(OUT, name + ".jpg")
            out.convert("RGB").save(path, quality=86, optimize=True,
                                    progressive=True)
        else:
            path = os.path.join(OUT, name + ".png")
            # 8-bit palette keeps the alpha and roughly quarters the size
            out.quantize(colors=200, method=Image.FASTOCTREE) \
               .save(path, optimize=True)
        print("%-14s %4d×%-4d  %6.1f KB  %s" %
              (name, out.width, out.height, os.path.getsize(path) / 1024,
               os.path.basename(path)))


if __name__ == "__main__":
    main()
