#!/usr/bin/env python3
"""Cut Lili's exercise poses out of the "GIMI VEŽBE – SVE IKONE" board.

The board is a 3×6 grid of pairs: a small card holding the label and a mini
icon, and a wide card holding the large pose. Only the large ones are used —
the app scales one picture into both the list thumbnail and the detail slot.

The card is near-white and the pose sits on a pale pink blob. Flood-filling
inward from the crop's edges removes both without touching the character;
colour-keying would eat into her, since her fur sits in the same pale family.

Grid coordinates come from the gutters in the source and are checked on every
run — if a new board is dropped in at a different size, this fails loudly
rather than quietly cropping the wrong rectangles.

    python3 tools/crop-gimi.py
"""
import os
import sys
from collections import deque

from PIL import Image, ImageFilter

SRC = "assets/source/gimi-sheet.png"
OUT = "www/img"
SIZE = (1551, 1014)          # the board this grid was measured against

# x ranges of the three wide "detail" cards, and the y range of each row
COLS = [(161, 509), (653, 1004), (1152, 1517)]
ROWS = [(102, 249), (257, 404), (411, 559), (565, 714), (721, 860), (865, 1006)]
INSET = 3                    # skip the card's own antialiased rounded border

# reading order across the board; `None` where the board has no pose
IDS = [
    ["zvezdice", "macka",  "psic"],
    ["leptiric", "pretklon", "kobra"],
    ["mostic",   "spaga",  "arabeska"],
    ["linija",   "prsti",  "sveca"],
    ["daska",    "noge",   "cuk"],
    ["lastavica", "cucanj", "iskorak"],
]

TOL = 30          # per-channel distance counted as "same as background"
FEATHER = 0.9     # blur radius on the alpha edge, against a hard cutout line


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


def drop_specks(alpha, min_frac=0.006):
    """Erase small islands the flood missed — the sparkles around each pose."""
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

    # A re-export of the same board at a higher resolution is the whole point
    # of keeping this scriptable, so scale the grid instead of demanding the
    # exact pixel size. A different *shape* is a different board — bail.
    k = sheet.width / SIZE[0]
    if abs(sheet.height / SIZE[1] - k) > 0.01:
        sys.exit("board is %d×%d; the grid was measured on %d×%d and that is a "
                 "different shape — re-measure the gutters" % (sheet.size + SIZE))
    if k != 1:
        print("board is %.2f× the measured one — scaling the grid" % k)
    cols = [(round(a * k), round(b * k)) for a, b in COLS]
    rows = [(round(a * k), round(b * k)) for a, b in ROWS]
    inset = max(1, round(INSET * k))

    for r, (y0, y1) in enumerate(rows):
        for c, (x0, x1) in enumerate(cols):
            name = IDS[r][c]
            if not name:
                continue
            crop = sheet.crop((x0 + inset, y0 + inset, x1 - inset, y1 - inset))
            w, h = crop.size
            out = crop.convert("RGBA")

            # walk the whole border: the card colour touches every edge
            seeds = [(x, 0) for x in range(w)]
            seeds += [(x, h - 1) for x in range(w)]
            seeds += [(0, y) for y in range(h)]
            seeds += [(w - 1, y) for y in range(h)]

            alpha = drop_specks(flood(crop, seeds, TOL))
            alpha = alpha.filter(ImageFilter.GaussianBlur(FEATHER))
            out.putalpha(alpha)
            bbox = out.getbbox()
            if bbox:
                out = out.crop(bbox)

            path = os.path.join(OUT, "lili-" + name + ".png")
            # 8-bit palette keeps the alpha and roughly quarters the size
            out.quantize(colors=220, method=Image.FASTOCTREE).save(path, optimize=True)
            print("%-10s %3d×%-3d  %5.1f KB" %
                  (name, out.width, out.height, os.path.getsize(path) / 1024))


if __name__ == "__main__":
    main()
