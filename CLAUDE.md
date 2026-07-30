# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Serbian-language iPad app for a child's daily gymnastics practice, implemented
from a Claude Design project (`design/Mila Gimnastika iPad.dc.html`). It is
installed to the iPad home screen as a PWA and runs offline.

No build step, no framework, no runtime dependencies. `www/` is shipped verbatim.

## Commands

```bash
npm run lan       # serve www/ on the LAN; prints the http://192.168.x.x:8123/ to open on the iPad
npm start         # serve www/ on localhost:8123 only
npm run deploy    # publish www/ to the gh-pages branch (live in ~60s)
npm run icons     # regenerate www/icons/* from tools/make-icons.py (~30s, pure Python)
npm run shots     # screenshot every screen through headless Chrome
```

There are no tests and no linter. Verification is visual, via `npm run shots`.

### Visual verification

`tools/shots.mjs` is the main way to check work. It drives Chrome over the
DevTools protocol, walks all nine screens plus a full six-exercise workout, and
reports console errors. Chrome must already be running with a debugging port:

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
- The one exception is `tickPaint()`, which mutates only the timer digits each
  second. A full re-render every second would fight the CSS animations.

Consequence: any DOM state the browser owns is destroyed on re-render. The name
`<input>` is handled specially — its `input` event updates state and patches the
rail text directly instead of re-rendering, or typing would lose focus.

### Two kinds of state

Keeping these separate matters:

- **`st`** — persisted to `localStorage` under `mila-gimnastika-v1`. Name, theme,
  stars, favourites, best streak, per-day history, reminder settings. Call
  `save()` after mutating. If storage throws (e.g. opened over `file://`),
  `memoryOnly` is set and the app degrades to in-memory with a warning toast.
- **`ui`** — ephemeral. Current screen, selected exercise, filter, workout index,
  seconds remaining. Never persisted; resets on launch.

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

`www/illustrations.js` draws everything; there are no image assets besides the
generated icons. The gymnast is one character rendered through a skeleton per
pose in `POSES` — hip, shoulder, head, plus elbow/hand and knee/foot pairs.
Index `1` of `arms`/`legs` is the far side and is drawn behind the torso in a
darker skin tone. `curve` bends the torso (used by the bridge and cat poses).

`bbox()` fits the SVG `viewBox` to the actual skeleton rather than a fixed
square, so a wide split and a tall candle both fill whatever slot they land in.
Do not replace this with a fixed viewBox — poses vary too much in shape.

Colors come from CSS custom properties (`var(--a)`, `var(--v)`), so
illustrations re-theme for free.

### Theming and scale

Three palettes in `THEMES`. `render()` writes them as custom properties onto
`documentElement`, so CSS reads `var(--a)` etc. and never hardcodes a hex.

The whole UI scales from one number: `html { font-size: clamp(...) }`. Every
size in `styles.css` is in `rem` against it, which is how the 1366×1024 design
lands proportionally on any iPad. **Portrait needs its own clamp** — the media
query overrides it, because the landscape formula uses `vw` and collapses to its
floor when the viewport is narrow.

## Deployment

Two branches, deliberately:

- `main` — the whole project.
- `gh-pages` — only the *contents* of `www/`, pushed by `git subtree push`.
  GitHub Pages serves this. Pages can only publish from `/` or `/docs`, and
  `www/` must stay put because `capacitor.config.json` points `webDir` at it.

Committing to `main` does not publish. `npm run deploy` does.

**Bump `CACHE` in `www/sw.js` on every release** (`gimnastika-v1` →
`gimnastika-v2`). The service worker is cache-first, so an installed app keeps
serving its stored copy and your deploy appears to do nothing.

`www/.nojekyll` disables GitHub's Jekyll processing. Leave it.

## Conventions

- ES5-style JavaScript (`var`, `function`, no arrow functions or template
  literals in `www/`) for old-Safari safety. `tools/` is modern ESM — it only
  ever runs on the Mac.
- All user-facing copy is Serbian. Match the existing tone: warm, second person,
  addressed to a child.
- Icons are Lucide paths at `stroke-width: 2.75`, per the source design system
  (`design/_ds/.../readme.md`).
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
