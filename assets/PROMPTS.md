# Image prompts for Lili

**Eighteen of nineteen exercises now show Lili herself**, cut out of the
"GIMI VEŽBE – SVE IKONE" board (`assets/source/gimi-sheet.png`) by
`tools/crop-gimi.py`. One is still missing, and the board itself is worth
re-exporting larger — both below.

## 1. The one missing pose — Dete poza

`dete` is the only exercise still drawn as the SVG figure, because it is not on
the board. Generate it in the same style, **attaching the board as a reference
image** so it stays the same rabbit:

> 3D Pixar-style cartoon rabbit character, same character as the reference
> image: light grey-lavender fur, large violet eyes with long lashes, small pink
> nose, long ears, purple glitter bow on the left ear, purple and pink
> gymnastics leotard with a heart on the chest and a rainbow swoosh. Full body
> visible, head to toe, nothing cropped. Soft studio lighting, flat pale pink
> background (#f7ecf7), no text, no logo, no props, no shadows on the
> background. Square image, character centred, generous margin on all sides.
>
> *Child's pose on a pink yoga mat, kneeling and sitting back on her heels,
> forehead down, arms stretched forward on the floor, side view, peaceful
> expression.*

To wire it in: save as `www/img/lili-dete.png` (background cut out, or say so
and it gets cut), add `img: "lili-dete.png"` to that exercise in `www/app.js`,
add the file to `ASSETS` in `www/sw.js`, bump `CACHE`.

## 2. Re-export the board bigger

The board is 1551×1014, so each pose is only 90–290 px wide. That is plenty for
the list thumbnails and holds up on the detail screen, but it is visibly soft
blown up to the workout screen's picture. A re-export of **the same layout** at
2× or 3× fixes it with no code change: `tools/crop-gimi.py` scales its grid to
whatever size the file is, as long as the proportions match.

Save the bigger export over `assets/source/gimi-sheet.png` and run:

```bash
python3 tools/crop-gimi.py
```

If the *layout* changes (different number of columns, different card sizes), the
script needs its `COLS`/`ROWS` re-measured — the gutters are found by looking
for columns and rows that are pure background inside the card area.

## 3. Which file belongs to which exercise

One file per exercise id: `www/img/lili-<id>.png`. The ids, in the board's
reading order:

| Row | Left | Middle | Right |
| --- | --- | --- | --- |
| 1 | `zvezdice` | `macka` | `psic` |
| 2 | `leptiric` | `pretklon` | `kobra` |
| 3 | `mostic` | `spaga` | `arabeska` |
| 4 | `linija` | `prsti` | `sveca` |
| 5 | `daska` | `noge` | `cuk` |
| 6 | `lastavica` | `cucanj` | `iskorak` |

That order lives in `IDS` in `tools/crop-gimi.py` — if a future board reorders
the poses, change it there.

`lili-sit.png`, `lili-happy.png` and `lili-split.jpg` are separate: the mascot
in the message cards, the congratulation and the finish screen, and the home
hero. They come from the older sheet via `tools/crop-lili.py`.

Anything without an `img` keeps drawing the fallback figure in
`www/illustrations.js`, so poses can arrive one at a time — nothing breaks in
between.
