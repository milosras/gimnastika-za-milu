# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Serbian-language iPad app for a child's daily gymnastics practice, implemented
from a Claude Design project (`design/Mila Gimnastika iPad.dc.html`). It is
installed to the iPad home screen as a PWA and runs offline.

No build step, no framework, no runtime dependencies. `www/` is shipped verbatim.

**`TODO.md` holds the open work and the current state** — read it before
starting anything.

The saved progress is a real child's, and a release has already destroyed it
once. `npm test` exists for exactly that: run it after touching anything under
"Two kinds of state" below.

## Commands

```bash
npm run lan       # serve www/ on the LAN; prints the http://192.168.x.x:8123/ to open on the iPad
npm start         # serve www/ on localhost:8123 only
npm run deploy    # publish www/ to the gh-pages branch (live in ~60s)
npm run icons     # regenerate www/icons/* from tools/make-icons.py (~30s, pure Python)
npm run crop      # re-cut www/img/lili-<id>.png from the pose board (~40s)
npm run shots     # screenshot every screen through headless Chrome
npm run food      # contact sheet of every dish, vessel and food layer
npm run poses     # contact sheet of every drawn gymnast pose
npm test          # migrate every old save shape and check nothing was lost
```

`npm test` is the only automated test — it guards the saved progress, which is
the one thing in the project that cannot be regenerated. Everything else is
verified visually, via `npm run shots`. There is no linter.

### Visual verification

`tools/shots.mjs` is the main way to check work. It drives Chrome over the
DevTools protocol, walks all fourteen screens plus a full workout (including the
ready/prep/go/cheer phases and the to-do list), and reports console errors.
Chrome must already be running with a debugging port:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --remote-debugging-port=9222 --user-data-dir=/tmp/gimchrome \
  --no-first-run about:blank &

node tools/shots.mjs http://127.0.0.1:8123/ /tmp/shots 1366 1024   # design size
node tools/shots.mjs http://127.0.0.1:8123/ /tmp/shots 1180 820    # iPad landscape
node tools/shots.mjs http://127.0.0.1:8123/ /tmp/shots 820 1180    # iPad portrait
```

Screenshots are PNG; convert with `sips -Z 1250 -s format jpeg` before reading
them, or they are too large. `tools/poses.mjs` renders a contact sheet of every
illustration — use it when touching `illustrations.js`.

Both tools unregister the service worker and clear caches before each pass.
Without that they silently screenshot a stale build.

## Architecture

### Rendering

`www/app.js` is a single IIFE with no framework. The model is:

- `render()` rebuilds the **entire** `#app` innerHTML from state on every change.
  Screen functions (`homeHtml`, `listHtml`, …) return HTML strings.
- Events use delegation: buttons carry `data-act="name"` / `data-arg="value"`,
  and one document-level click listener dispatches through the `ACTIONS` map.
  There are no inline handlers and no per-element listeners.
- There are three exceptions, all of them places where a full repaint would take
  something out from under her finger:
  - `tickPaint()` mutates only the timer digits each second. A full re-render
    every second would fight the CSS animations.
  - The name and mascot-name fields patch the one or two spots that show them.
  - The ostava search **filters the ingredient grid by toggling `hidden` on the
    buttons**, matching the typed text against a pre-rendered `data-fold`
    attribute; `sastToggle` likewise flips one button's class and the counter
    instead of re-rendering. The natural rhythm there is *type „sir" → tap →
    type „jaja" → tap*, and a re-render mid-sequence closes the iPad keyboard.
    Both fall back to `render()` if the element is missing, the way `tickPaint()`
    does.

Consequence: any DOM state the browser owns is destroyed on re-render. The
`<input>`s are handled specially — their `input` events update state without a
re-render (the name field patches the rail text directly; the to-do field only
stores `ui.todoDraft`), or typing would lose focus and the iPad keyboard would
close. Adding a to-do *does* re-render, then re-focuses the field inside the
same tap so the keyboard stays up.

`render()` re-applies the ostava filter after painting, because the search field
is drawn carrying its own value — otherwise it would read „sir" while the grid
showed everything.

### Two kinds of state

Keeping these separate matters:

- **`st`** — persisted to `localStorage` under `mila-gimnastika`. Name, theme,
  stars, favourites, best streak, per-day history, reminder settings, the sound
  switch (`zvuk`) and her own to-do list (`todos`). Call `save()` after
  mutating. If storage throws (e.g. opened over `file://`), `memoryOnly` is set
  and the app degrades to in-memory with a warning toast.

  **The key carries no version — the version lives inside the payload as `v`.**
  That is the whole point: `mila-gimnastika-v1` and `-v2` put it in the *key*,
  so shipping v2 orphaned every v1 save and wiped a child's real progress.
  Never version the key again.

  `load()` reads the permanent key, falls back to the two old ones, and hands
  whatever it finds to `hydrate()`:

  - **Forward-only migrations.** `MIGRATIONS[v]` transforms a payload one step;
    `hydrate()` applies them until `v === VERSION`. Data is transformed, never
    dropped. Adding a new *field* still needs no migration at all — `normalize()`
    merges over `defaults()`.
  - **A payload newer than the build is kept, not wiped.** It keeps its own `v`
    (stamping ours on it would make a later load migrate it twice) and every
    field this build knows nothing about survives `Object.assign`.
  - **Snapshots before touching anything.** `mila-gimnastika-backup-v<n>` holds
    the pre-migration payload; the old keys are left in place as a second copy;
    an import writes `mila-gimnastika-backup-pre-import` first.
  - **`recoverV1()`** folds the orphaned v1 history back in, once, for dates the
    current record doesn't have. `V1_IDS` and `V1_WORKOUT` freeze that build's
    exercise order so the mapping stays correct however `EX` and `PLAN` change.

  `days[date].done` stores **exercise ids**, not positions in that weekday's
  plan. That is what makes editing `PLAN` safe: positions silently re-pointed
  every historical record. `dayRec()` still converts a stray number, so a
  restored file or a rolled-back build cannot reintroduce the bug.

  Podešavanja has **Sačuvaj kopiju / Vrati iz kopije** — a JSON file, shared
  through the iOS share sheet where that exists and downloaded where it doesn't.
  It is the only answer to a replaced or wiped iPad, since deleting a
  home-screen web app takes its storage with it. `askPersist()` asks iOS not to
  evict the storage under pressure.

  **`npm test` covers all of this** (`tools/test-storage.mjs`): it seeds
  localStorage as each older build left it, loads the app for real in Chrome,
  and checks what came out — including that an import cannot be tricked by a
  junk file. Run it after any change here.
- **`ui`** — ephemeral. Current screen, selected exercise, filter, the weekday
  being trained (`wday`), workout index, phase, seconds remaining. Never
  persisted; resets on launch.

### Derived numbers

Nothing in the UI stores a displayed statistic. `metrics()` recomputes
everything — streaks, totals, per-skill percentages, best exercise, OCENA —
from `st.days` on each render. To change how a number behaves, change
`metrics()`, not the screen that shows it.

**Time is stored in seconds** (`dayRec().sec`) and rounded only at display via
`mins()`. This is deliberate: rounding per-exercise made the totals on Početna,
Napredak and the finish screen disagree.

Streaks count back from *yesterday* when today is still empty, so the counter
does not reset every morning before she trains.

Stickers in `STICKERS` each carry a `val(m)` predicate and a `goal`, so locked
ones can report exactly how much is left. Serbian plurals are not optional here
— `unit` is a three-form array (1 / 2–4 / 5+) fed through `plural()`.

### Illustrations

Two sources, in this order of preference:

1. **Lili's photographs** in `www/img` — the mascot, a purple-leotard bunny.
   An exercise opts in with an `img` field naming the file; `exPic()` renders it.
   Eighteen of the nineteen exercises have one, cut from the pose board
   `assets/source/gimi-sheet.png` by `tools/crop-gimi.py`; the mascot's own
   poses (`sit`, `happy`, the hero) come from the older sheet via
   `tools/crop-lili.py`. Both cut the background by flood-filling inward from
   each crop's edges — colour-keying eats into her fur, which sits in the same
   pale family as the backdrop.

   `crop-gimi.py` holds the board's grid as measured coordinates and **scales
   them to whatever size the file is**, so re-exporting the same board larger
   needs no code change. It refuses a board with different proportions rather
   than cropping the wrong rectangles.
2. **The drawn gymnast** in `www/illustrations.js`, now used only by `dete`,
   which is not on the board. `assets/PROMPTS.md` holds its prompt; dropping a
   file in `www/img` and adding `img:` swaps it over. `ILLU.badge()` (stickers)
   and `ILLU.reminderScene()` are still the drawn artwork everywhere.

The gymnast is one character rendered through a skeleton per pose in `POSES` — hip, shoulder, head, plus elbow/hand and knee/foot pairs.
Index `1` of `arms`/`legs` is the far side and is drawn behind the torso in a
darker skin tone. `curve` bends the torso (used by the bridge and cat poses).

`bbox()` fits the SVG `viewBox` to the actual skeleton rather than a fixed
square, so a wide split and a tall candle both fill whatever slot they land in.
Do not replace this with a fixed viewBox — poses vary too much in shape.

Colors come from CSS custom properties (`var(--a)`, `var(--v)`), so drawn
illustrations re-theme for free; the photographs do not.

### Exercises, plans and the workout

`EX` is the exercise library. **`id` is the stable handle** — plans, stickers,
favourites and saved history all refer to exercises by id, never by array index,
so the list can be reordered or extended safely. `idxOf(id)` maps back.

`PLAN` holds a different session per weekday (0 = Monday), each opening with a
warm-up and closing with something calm. `planFor(day)` returns exercise
indices. A date's plan is always `planFor(weekday(date))`, which is why
`dayRec().done` can store positions within it.

The workout runs four phases per exercise, in `ui.phase`:

- `ready` — nothing counts down; waiting for her to press KRENI.
- `prep` — a 5s count-in (`PREP_SEC`) while she gets into position.
- `go` — the exercise timer.
- `cheer` — Lili congratulates her (`cheerHtml`), then it advances itself.

Each phase has its own dial colour (`.timer--ready/prep/go/cheer`): violet for
waiting, gold for counting in, pink for working. `tick()` promotes prep → go and
go → cheer. Nothing auto-*starts* — that was deliberate, a timer running before
she is in position is useless — but the celebration does auto-*end*, after
`CHEER_MS`, into the next exercise's `ready`.

`beginCheer()` is the single exit from an exercise: the timer running out calls
it, and so does SLEDEĆE, so she gets the same congratulation whether she used
the whole time or finished early. A second tap during `cheer` skips ahead.
Anything that leaves the workout must call `stopCheer()` or the pending timeout
advances a workout she has already quit.

### Sound

`SOUND` synthesises its three cues with an `AudioContext` — no audio files, so
nothing to download, cache or ship, and it works fully offline. `note()` is the
only primitive; each cue schedules a few of them at offsets.

iOS only lets an `AudioContext` produce sound if it was started inside a user
gesture, and re-suspends it whenever the app is backgrounded, so `unlockAudio()`
runs on *every* document click, not just the first. Sound respects `st.zvuk`
(switch at the top of Podešavanja) and fails silently everywhere — a missing
`AudioContext` must never break the timer.

### Obaveze

Her own to-do list (`st.todos`, `[{ id, t, done, c }]`), reached from the rail.
Deliberately **outside** the gymnastics numbers: `metrics()` never looks at it,
so ticking a chore cannot move a streak, a star or a sticker. Items persist
until she deletes them — nothing resets overnight.

It reuses the plan screen's two-column layout (`.plan`, `.plan__main`,
`.plan__side`, `.msgcard`, `.progcard`), which is also what makes it work in
portrait for free.

`c` is a colour key into `TODO_COLORS`, not a hex — changing a shade there
repaints every to-do already wearing it. Three entries are multi-colour
gradients and carry `g` alongside `c`: the stripe, the dot and the swatch take
`var(--tg, var(--tc))`, while `color-mix()` and the shadows need a single
colour, so every gradient must also name the shade that stands for it. The
stripe is a `::before`, not a `border-left`, for the same reason — a border
takes one colour. The palette is deliberately **fixed
rather than themed**: the point is telling her own tasks apart, so switching
theme must not recolour them. A key this build does not know is left alone on
load (it may come from a newer build) and simply renders uncoloured via
`todoColor()`. Only one palette is open at a time (`ui.todoPal`, ephemeral) —
opening several would make the whole list jump.

### Kuvanje

Four screens behind the last rail tab: pick a meal (`kuh`) → tap what is in the
house (`sast`) → see dishes she can make (`jela`) → read the recipe (`recept`).
The three inner screens alias to `kuh` in the rail highlight — unlike the
workout, she really is inside the tab.

Like Obaveze, it is **outside every gymnastics number**: `metrics()` never looks
at it, so cooking earns no star, moves no streak and unlocks no sticker. Adding
a cooking entry to `STICKERS` is the one change that would create that
dependency — don't.

- **The corpus is the whole source and there is no network call.** `www/` has no
  `fetch` outside the service worker and that is deliberate: the app is
  installed on an iPad that goes to grandma's house. Recipes were written once,
  reviewed, and shipped as `www/recipes.js`. A live model call would need a key
  in the client, an internet connection, and a review step for every answer a
  child reads — all three are worse than a static file. (Claude also does not
  generate images at all, so the pictures could never have come from an API.)
- **Two files, split the way `EX` and `illustrations.js` are split:**
  `recipes.js` is the data that names its picture (`art`), `food.js` knows how
  to draw it. Both load before `app.js`, and `food.js` uses `ILLU.sparkle`, so
  it must come after `illustrations.js`.
- **A recipe carries two ingredient lists on purpose.** `req`/`opt` are ids for
  matching; `sast` is human text *with quantities* for reading. Same reason `EX`
  carries both `sec: 60` and `min: "1 min"`.
- **Staples (`stap: 1`) — so, ulje, voda, biber, brašno, šećer — never appear in
  the grid and always count as present.** Otherwise every dish would demand that
  she tap salt.
- **The dish list can never come back empty.** `jelaZa()` offers what she can
  make now, then what she is one or two ingredients short of, and if neither
  produced anything it drops the threshold entirely. An empty results screen is
  a dead end for a child, so the code makes one structurally impossible; the
  `.empty` div is never rendered there.
- The sort is **total** (`fali`, `bonus`, `req.length` desc, `min`, `id`) so the
  grid cannot reshuffle under her finger across the re-renders. No `Math.random()`
  anywhere in this path. `req.length` descending is deliberate: between two
  dishes she can make right now, the one using *more* of what she tapped feels
  like it came out of her own fridge.
- `fold()` strips case and diacritics before comparing, so `sunka` finds Šunka
  and `sargarepa` finds Šargarepa. Search that misses those is decoration.
- **`st.ostava` is the only new persisted field** — ids from `KUVANJE.SASTOJCI`.
  No `VERSION` bump and no migration: `normalize()` merges over `defaults()`.
  An id this build does not recognise is *kept*, exactly like an unknown to-do
  colour — it may come from a newer corpus, and the matcher just ignores it.
  `ACTIONS.reset` keeps it: the confirm promises to delete stars, stickers and
  history, not to empty her fridge.
- `ui.jelo` holds an **id, not an index**, so editing the corpus can never
  re-point a stale selection.

Food colours in `food.js` are **fixed, not themed** — a tomato is red in the
lavender theme too — for the same reason `TODO_COLORS` is fixed. Vessels are
neutral ceramic so the food reads on all three backgrounds; only `opts.decor`
touches `var(--gd)` and `var(--a)`.

The dish viewBox is a **fixed `0 0 200 160`, and `bbox()` is the wrong tool
here.** Poses need fitting because a split is wide and a candle is tall; every
dish is a vessel of roughly the same footprint on a common baseline, so fitting
per dish would render a tall glass and a wide plate at wildly different scales
side by side in the same grid. Vessel differences are handled inside the fixed
box instead. `.det__media--jelo` constrains the big picture for the same reason:
a 5:4 drawing in a tall slot leaves a lake of empty space above the plate.

Each vessel returns `back`/`front` so toppings draw *inside* it rather than over
its near rim. An unknown vessel or topping key falls back or is skipped —
`undefined` must never reach the output string.

**Run `npm run food` after touching `food.js` or adding a dish** — it renders
every vessel, every layer and every dish onto one sheet. The drawings pass
automated checks (no unknown keys, no `NaN`) while still looking wrong: the
first pass had food sunk in a dark tray, pancakes fused into a single blob and
whipped cream floating above the mug. None of that is visible from the app.

### Theming and scale

Three palettes in `THEMES`. `render()` writes them as custom properties onto
`documentElement`, so CSS reads `var(--a)` etc. and never hardcodes a hex.

The whole UI scales from one number: `html { font-size: clamp(...) }`. Every
size in `styles.css` is in `rem` against it, which is how the 1366×1024 design
lands proportionally on any iPad. **Portrait needs its own clamp** — the media
query overrides it, because the landscape formula uses `vw` and collapses to its
floor when the viewport is narrow.

### Branches

Work on a branch, merge to `main`, and the branch goes away with it:
`tools/hooks/post-merge` deletes whatever was just merged in. It is a local
hook, so a fresh clone needs it installed once:

```bash
cp tools/hooks/post-merge .git/hooks/ && chmod +x .git/hooks/post-merge
```

It refuses anything that is not fully merged (`git branch -d`, never `-D`) and
never touches `main` or `gh-pages`, so it cannot lose work.

## Deployment

Two branches, deliberately:

- `main` — the whole project.
- `gh-pages` — only the *contents* of `www/`, pushed by `git subtree push`.
  GitHub Pages serves this. Pages can only publish from `/` or `/docs`, and
  `www/` must stay put because `capacitor.config.json` points `webDir` at it.

Committing to `main` does not publish. `npm run deploy` does.

**Bump `CACHE` in `www/sw.js` and `BUILD` in `www/app.js` on every release**
(`gimnastika-v4` → `gimnastika-v5`). `BUILD` shows at the bottom of Podešavanja
and is the only way to tell from the iPad which build is actually running.

The service worker is **network-first for the shell** (navigations and
`.html/.js/.css/.webmanifest`) and cache-first for everything else. That split
is deliberate: pictures and icons never change without changing their name, but
the shell decides which version is running, and serving it from cache was why a
deploy used to appear to do nothing on an installed iPad. `freshest()` gives the
network 3s before falling back to the cache, so a bad connection cannot leave
her staring at nothing.

The page also registers with `updateViaCache: "none"` (Safari otherwise serves
`sw.js` out of its own HTTP cache for ten minutes), asks for an update check on
launch and on every return to the app, and reloads once when a new worker takes
over — except during a workout, where a reload would throw away where she is.

Verified end to end in `tools/`-style CDP scripts: with the network emulated
off the app still renders from cache, and a fresh build lands on the *first*
launch after a deploy.

`www/.nojekyll` disables GitHub's Jekyll processing. Leave it.

## Conventions

- The display face is **Baloo 2**, not the design's Caprasimo: Caprasimo ships
  no `č ć ž š đ`, so Chrome substitutes a different font mid-word. Any
  replacement must be checked against `Sveća Ćuk Streličar Mačka Špaga Đak`.
- ES5-style JavaScript (`var`, `function`, no arrow functions or template
  literals in `www/`) for old-Safari safety. `tools/` is modern ESM — it only
  ever runs on the Mac.
- All user-facing copy is Serbian. Match the existing tone: warm, second person,
  addressed to a child.
- Icons are Lucide paths at `stroke-width: 2.75`, per the source design system
  (`design/_ds/.../readme.md`).
- Serbian plurals are not optional. `plural(n, one, few, many)` covers the
  1 / 2–4 / 5+ forms; sticker units carry all three.
- `design/` is reference only. It is never served or built; it holds the
  original `.dc.html` and its design-system tokens.

## Known deviations from the design source

- The design's category filters matched on visible category text, so `Leptirić`
  (*Istezanje*) and `Mačka–krava` (*Mobilnost kičme*) could never appear under
  any filter. Exercises now carry a `group` (`bal`/`str`/`flex`) and the chips
  filter on that.
- The design's illustration slots were dashed placeholders and its statistics
  were fixed sample values. Both are real here.

## Platform limits

The reminder only fires while the app is open or recently backgrounded. iOS does
not let a home-screen web app schedule a notification for when it is fully
closed. That requires the native build — `capacitor.config.json` is already in
place, so `npm run ios:add` generates the Xcode project without restructuring.
