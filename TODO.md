# TODO

Working notes so a new session can pick this up cold. Architecture lives in
`CLAUDE.md`; how to install and deploy lives in `README.md`.

## Where things stand

Live at **https://milosras.github.io/gimnastika-za-milu/**, installed on Mila's
iPad from the home screen.

Done so far:

- Ten screens implemented from the Claude Design source, running as an offline
  PWA. No build step, no framework.
- Lili the bunny is the mascot, cropped from `assets/source/lili-sheet.png` by
  `tools/crop-lili.py` and from the pose board by `tools/crop-gimi.py`.
- Workout runs `ready → prep → go → cheer` per exercise: nothing auto-starts,
  KRENI begins a 5s gold count-in, then the pink exercise timer, then Lili's
  congratulation.
- 19 exercises, a different session per weekday.
- Display font is Baloo 2 (Caprasimo had no `č ć ž š đ`).
- Progress, streaks, stickers and charts all derived from real activity.

Second round, from Mila's own list (July 2026):

- **Zvuk** — a tick through the 5s count-in, a chime when the exercise starts,
  a four-note run when it ends and a longer fanfare when the whole workout is
  done. Synthesised with `AudioContext`, no files. Switch at the top of
  Podešavanja (`st.zvuk`).
- **Čestitka posle svake vežbe** — a fourth workout phase, `cheer`: Lili jumps
  in over the screen with a random praise line and the star, then advances
  itself after `CHEER_MS`. Both the timer running out and SLEDEĆE go through
  `beginCheer()`.
- **Obaveze** — a tenth screen, her own free-form to-do list (`st.todos`),
  kept out of every gymnastics metric.
- **Lili in every exercise** — the drawn SVG figure is gone from all but one
  exercise, replaced by the pose board (see item 2).

---

## 1. Storage must survive updates — HIGH, do this first

**The problem.** Shipping the per-day plans changed the shape of saved history,
and the release discarded everything Mila had done. That is unacceptable as a
normal cost of shipping, and right now it would happen again on the next schema
change. Two separate faults cause it:

1. `KEY = "mila-gimnastika-v2"` puts the version *in the key*, and `load()`
   accepts only an exact `got.v === 2`. Anything else is silently dropped.
2. `dayRec().done` stores **positions within that weekday's plan**, not exercise
   ids. Editing any day's `PLAN` therefore silently re-points every historical
   record at different exercises. This is a live bug today, not just a future
   risk — reordering Monday would rewrite Monday's past.

**The fix.**

- **One permanent key.** `mila-gimnastika`, with no version in the name. The
  version stays inside the payload as `v`.
- **Forward-only migrations.** A `MIGRATIONS` map keyed by source version, each
  entry transforming the payload one step. `load()` applies them in sequence
  until `v === CURRENT`. Data is transformed, never discarded.
- **Never wipe on an unknown version.** If the payload is *newer* than the build
  (a rollback, or Safari restoring an old bundle), keep it and render what can
  be read. Wiping is always the wrong answer.
- **Store plan completion by exercise id.** `done: ["zvezdice", "macka"]`
  instead of `done: [0, 1]`. This decouples saved history from the `PLAN`
  arrays and is what makes editing plans safe. Requires a migration that maps
  each old index through the plan the date's weekday *used to have* — so do it
  before `PLAN` changes again, while the mapping is still known.
- **Snapshot before migrating.** Copy the raw payload to
  `mila-gimnastika-backup-v<n>` before transforming. Cheap insurance, and it
  makes a bad migration recoverable rather than fatal.
- **Ask for persistent storage.** `navigator.storage.persist()` on first launch.
  iOS can evict a home-screen app's storage under pressure; this reduces it.
- **Export and import** in Podešavanja. A JSON file she can keep, and the only
  real answer to a lost or replaced iPad. Also makes testing migrations easy.

**Test it.** This is the first thing in the project genuinely worth a test: feed
a saved v2 payload through the migration chain and assert the totals, streak and
sticker states come out unchanged. A silent regression here costs real progress.

**Also worth deciding:** whether a schema change should ever be able to alter
past *derived* numbers. Stars are stored, but streaks and skill percentages are
recomputed from history — so changing `metrics()` retroactively changes what her
past looks like. Probably fine, but it should be a decision rather than an
accident.

---

## 2. Exercise illustrations — done except one

Eighteen of nineteen exercises now show Lili herself, cut from the "GIMI VEŽBE
– SVE IKONE" board (`assets/source/gimi-sheet.png`) by `tools/crop-gimi.py`.

Two things are left:

- **`Dete poza` has no photo** — it is the only exercise still drawing the SVG
  figure. Prompt for it is in `assets/PROMPTS.md`.
- **The board is only 1551×1014**, so each pose is 90–290 px wide. Fine in the
  list and on the detail screen, visibly soft on the workout screen where the
  picture is biggest. A re-export of the same layout at 2–3× fixes it with no
  code change — the crop script scales its grid to the file it is given.

## 3. Weakest drawn poses — mostly moot now

`illustrations.js` only renders `dete` among the exercises; the rest of the file
still matters for `ILLU.badge()` and `ILLU.reminderScene()`. Check any change
with `node tools/poses.mjs`.

## 4. Reminder cannot fire when the app is closed

A home-screen web app can't schedule a notification for when it is fully shut.
Only the native build fixes it — `capacitor.config.json` is already in place, so
`npm run ios:add` generates the Xcode project without restructuring. Needs Xcode
installed, and a paid Apple developer account if it should last beyond 7 days.

Worth doing only if the reminder turns out to matter in practice.

## 5. Fonts need the network on first load

Baloo 2 and Figtree come from Google Fonts. The service worker caches them after
the first successful load, but a first launch with no network falls back to
system fonts. Self-hosting the two woff2 files in `www/` would make the app
genuinely offline-complete and remove a third-party request.

## 6. Smaller things

- The hero image letterboxes against a flat colour; the artwork's own soft
  gradient leaves a faint seam at some window shapes.
- No accessibility pass yet beyond `aria-label`s and focus rings — worth a
  VoiceOver run on the iPad at some point.
- `assets/source/lili-sheet.png` is committed at full size (1.9 MB). Fine for
  now; it is the master for all crops.
