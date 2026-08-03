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

Third round (August 2026):

- **Svaka vežba traje 1 minut** — `sec: 60` kroz ceo `EX`, umesto 60/90/120.
  Ništa u istoriji se ne menja: sačuvano vreme su sekunde koje je stvarno
  odradila, a ne ono što plan predviđa.
- **Boja po obavezi** — `st.todos[i].c` nosi ključ iz `TODO_COLORS`. Paleta se
  otvara u samom redu, jedna po jedna (`ui.todoPal`).

---

## 1. Storage survives updates — done

The key is now permanent (`mila-gimnastika`), the version lives inside the
payload, and `hydrate()` migrates forward one step at a time instead of
dropping anything it does not recognise. Specifically:

- `MIGRATIONS` covers 1 → 2 (exercise indices become ids) and 2 → 3 (plan ticks
  become exercise ids, so editing `PLAN` no longer re-points history).
- A payload *newer* than the build is kept and read, never wiped, and keeps its
  own version number.
- Snapshots: `mila-gimnastika-backup-v<n>` before migrating, the old keys left
  in place, `mila-gimnastika-backup-pre-import` before an import.
- `recoverV1()` folds the history orphaned by the v1 → v2 release back in, once,
  for dates the current record does not already have — so if that payload is
  still on the iPad, the progress lost back then comes back on next launch.
- Export / import as a JSON file in Podešavanja, and `navigator.storage.persist()`
  on launch.
- `npm test` (`tools/test-storage.mjs`) seeds each old shape, loads the app in
  Chrome and checks what survived. Twenty-six checks, including a junk import.

**What is still not protected:** deleting the home-screen app takes its storage
with it — iOS gives each installed web app its own — and no code can prevent
that. The saved copy is the answer; it is worth exporting one after a big week.

**Still worth deciding:** whether a schema change should ever be able to alter
past *derived* numbers. Stars are stored, but streaks and skill percentages are
recomputed from history, so changing `metrics()` retroactively changes what her
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
