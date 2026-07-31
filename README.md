# Gimnastika za Milu

An iPad app for a kid's daily gymnastics practice, in Serbian. Ten screens, a
different guided workout each weekday, a weekly plan, her own to-do list,
progress charts, stickers and a reminder — implemented from the Claude Design project
*Mila Gimnastika iPad.dc.html*. Lili the bunny is the coach.

No build step, no framework, no dependencies. Plain HTML, CSS and JavaScript
that runs from `www/`.

```
www/
  index.html            shell
  styles.css            design tokens + every screen's layout
  app.js                data, state, the ten screens, workout logic, sound
  illustrations.js      drawn fallback figures + badges, inline SVG
  img/                  Lili photographed in every pose
  sw.js                 offline cache
  manifest.webmanifest  home-screen app metadata
  icons/                generated app icons
design/                 the original .dc.html and its design system, for reference
assets/                 the source boards and PROMPTS.md for what is still missing
tools/                  icon generator, image cropper, local server, screenshot harness
```

## Putting it on the iPad

**https://milosras.github.io/gimnastika-za-milu/**

The app installs to the home screen — its own icon, full screen, no Safari
chrome, and it keeps working with no network once it has loaded one time.

1. On the iPad, open that address **in Safari** (not Chrome — only Safari can
   install to the home screen).
2. Tap the **Share** button → **Add to Home Screen** → *Dodaj*.
3. Launch it from the new icon.

Progress is stored on the iPad itself. It is not synced anywhere and nothing is
sent off the device.

### Shipping a change

```bash
npm run lan       # try it on the iPad first: prints a http://192.168.x.x:8123/ address
npm run deploy    # pushes www/ to the gh-pages branch; live in about a minute
```

Bump `CACHE` in `www/sw.js` (`gimnastika-v1` → `gimnastika-v2`) with every
release. The offline cache serves its stored copy first, so without the bump an
already-installed app keeps running the old version.

Hosting is GitHub Pages from the `gh-pages` branch of a public repo. The page
holds no personal data — the name and all progress live only in the iPad's own
storage — but the URL itself is reachable by anyone who has it.

Open work and known issues are in [`TODO.md`](TODO.md).

## How the app behaves

Everything starts at zero and is earned:

- **Zvezdice** — 1 per exercise finished, 5 more for completing a whole workout.
- **Serija** — consecutive days with any activity. It counts back from
  yesterday if today is still empty, so it doesn't reset every morning.
- **Nalepnice** — ten awards with real conditions (10 mostića, 50 minuta, 7
  dana u nizu…). Locked ones show exactly how much is left.
- **Plan** — a different session every weekday, warm-up first and a calm
  stretch last. Nineteen exercises in the library.
- **Trening** — nothing auto-starts. Each exercise waits on KRENI, then counts
  in for five seconds (gold dial, a tick a second) before the exercise timer
  runs (pink). When it runs out Lili jumps in, congratulates her and hands over
  the star, then the next exercise arms itself. Finishing early gets the same
  celebration; tapping again skips it.
- **Zvuk** — a tick through the count-in, a chime when the exercise starts, a
  little run of notes when it ends and a proper fanfare when the whole workout
  is done. Synthesised in the app, so it works offline; the switch is at the top
  of *Podešavanja*. iOS plays it only if the iPad is not on silent.
- **Obaveze** — her own list, typed by her: domaći, sprema sobu, torba za
  trening. It is kept apart from the gymnastics numbers on purpose — ticking a
  chore does not move a streak, a star or a sticker.
- **Napredak** — the chart is the current week, one point per day, from the
  plan items actually ticked off. The skill bars measure the last fortnight
  against a target of six sessions per skill; OCENA is their average.
Ticking an exercise off the plan counts it too, not just running the workout.

Time is stored in seconds and rounded only for display, so the totals on
Početna, Napredak and the finish screen always agree.

Ime, tema (three palettes) and *Resetuj napredak* live at the bottom of the
**Podsetnik** screen.

### The reminder

The reminder fires while the app is open or recently backgrounded. iOS does not
let a home-screen web app schedule a notification for when it is fully closed —
that needs the native build below.

## Going native later

The project is laid out for Capacitor: `capacitor.config.json` already points
`webDir` at `www`, so no restructuring is needed.

```bash
npm run ios:add     # installs Capacitor and generates ios/
npm run ios:open    # opens the Xcode project
```

Requires Xcode. With a free Apple ID the installed app expires after 7 days; a
paid developer account extends it to a year. The reason to do it is real local
notifications — the reminder firing when the app is closed.

## Tools

```bash
npm run icons   # regenerate www/icons/* (pure Python, no image libraries)
npm run shots   # screenshot every screen through headless Chrome
```

`npm run shots` needs Chrome running with `--remote-debugging-port=9222`.

## Notes on the implementation

Two things were changed deliberately from the design source:

- **Category filters** matched on the visible category text, so *Leptirić*
  (`Istezanje`) and *Mačka–krava* (`Mobilnost kičme`) could never appear under
  any filter. Exercises now carry a group (`warm`/`bal`/`str`/`flex`) and the
  chips filter on that.
- **The display font** is Baloo 2, not the design's Caprasimo — Caprasimo has no
  `č ć ž š đ` and the browser was substituting a different face mid-word.
- The design's illustration slots were dashed placeholders and its numbers were
  fixed sample values. Both are real here — Lili photographed in eighteen of the
  nineteen poses (`Dete poza` still uses the drawn fallback figure), and counts
  derived from what has actually been done.
