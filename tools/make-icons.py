#!/usr/bin/env python3
"""Generate the app icons (no image libraries needed).

A violet tile with the app's gold star, matching the rail logo in the UI.
iOS masks the corners itself, so the square is filled edge to edge.

    python3 tools/make-icons.py
"""
import math
import os
import struct
import zlib

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "www", "icons")
VIOLET = (0x7B, 0x2F, 0xF2)
GOLD = (0xFF, 0xB0, 0x1F)
PINK = (0xFF, 0x3D, 0x8B)
SIZES = [180, 192, 512, 1024]
SS = 4  # supersampling factor, for smooth edges


def star_points(cx, cy, r_out, r_in, n=5, rot=-math.pi / 2):
    pts = []
    for i in range(n * 2):
        r = r_out if i % 2 == 0 else r_in
        a = rot + i * math.pi / n
        pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    return pts


def inside(poly, x, y):
    hit = False
    j = len(poly) - 1
    for i in range(len(poly)):
        xi, yi = poly[i]
        xj, yj = poly[j]
        if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / (yj - yi) + xi:
            hit = not hit
        j = i
    return hit


def blend(bg, fg, a):
    return tuple(round(bg[k] + (fg[k] - bg[k]) * a) for k in range(3))


def render(size):
    star = star_points(size / 2, size / 2 * 1.02, size * 0.34, size * 0.148)
    glow = star_points(size / 2, size / 2 * 1.02, size * 0.40, size * 0.174)
    rows = []
    step = 1.0 / SS
    for y in range(size):
        row = bytearray()
        for x in range(size):
            cov_s = cov_g = 0
            for sy in range(SS):
                py = y + (sy + 0.5) * step
                for sx in range(SS):
                    px = x + (sx + 0.5) * step
                    if inside(star, px, py):
                        cov_s += 1
                    elif inside(glow, px, py):
                        cov_g += 1
            n = SS * SS
            px_col = VIOLET
            if cov_g:
                px_col = blend(px_col, PINK, 0.55 * cov_g / n)
            if cov_s:
                px_col = blend(px_col, GOLD, cov_s / n)
            row += bytes(px_col)
        rows.append(bytes(row))
    return rows


def write_png(path, size, rows):
    raw = b"".join(b"\x00" + r for r in rows)

    def chunk(tag, data):
        c = tag + data
        return struct.pack(">I", len(data)) + c + struct.pack(">I", zlib.crc32(c) & 0xFFFFFFFF)

    png = (b"\x89PNG\r\n\x1a\n"
           + chunk(b"IHDR", struct.pack(">IIBBBBB", size, size, 8, 2, 0, 0, 0))
           + chunk(b"IDAT", zlib.compress(raw, 9))
           + chunk(b"IEND", b""))
    with open(path, "wb") as f:
        f.write(png)


SVG = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="114" fill="#7b2ff2"/>
  <path d="M256 60l55 122 133 15-99 90 26 131-115-63-115 63 26-131-99-90 133-15z" fill="#ff3d8b" opacity=".55"/>
  <path d="M256 92l47 103 113 13-84 76 22 111-98-54-98 54 22-111-84-76 113-13z" fill="#ffb01f"/>
</svg>
"""


def main():
    os.makedirs(OUT, exist_ok=True)
    with open(os.path.join(OUT, "icon.svg"), "w") as f:
        f.write(SVG)
    for s in SIZES:
        write_png(os.path.join(OUT, "icon-%d.png" % s), s, render(s))
        print("icons/icon-%d.png" % s)
    print("icons/icon.svg")


if __name__ == "__main__":
    main()
