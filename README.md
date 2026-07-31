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

### Backing it up

A release can no longer cost her anything: the storage key is permanent and old
saves are migrated forward, never dropped. Two things are still outside the
app's control — **deleting the home-screen icon takes its storage with it**, and
so does replacing the iPad. So *Podešavanja → Kopija napretka* has:

- **Sačuvaj kopiju** — writes everything (stars, stickers, history, to-dos) to a
  JSON file, through the iOS share sheet, so it can go to Files or iCloud.
- **Vrati iz kopije** — reads one back. It asks first, and snapshots what it is
  about to replace.

Worth doing after a good week. `npm test` checks the whole migration and import
path against every save shape that has ever shipped.

**The copy contains everything she has written**, including her to-do list, so
treat the file as private. It is generated on the iPad and goes only where you
put it — nothing is uploaded. `.gitignore` refuses `gimnastika-*.json` and
`*backup*.json` so a copy left in this folder cannot be committed to what is a
public repository.

### Shipping a change

```bash
npm run lan       # try it on the iPad first: prints a http://192.168.x.x:8123/ address
npm run deploy    # pushes www/ to the gh-pages branch; live in about a minute
```

Bump two things with every release: `CACHE` in `www/sw.js` (`gimnastika-v4` →
`gimnastika-v5`) and `BUILD` in `www/app.js`. `BUILD` is printed at the bottom
of *Podešavanja*, so you can tell from the iPad which version it is really
running.

The installed app picks a deploy up on the **next launch**: the service worker
fetches the shell from the network and falls back to its cache only when the
network is slow or gone. If the iPad is offline it keeps running the last
version it saw, which is the point.

Hosting is GitHub Pages from the `gh-pages` branch of a **public** repo, and
`gh-pages` holds only the contents of `www/`: markup, styles, script, and the
mascot's pictures. No progress, no to-dos, no name — all of that lives in the
iPad's own storage and is never sent anywhere. The only request the app makes
off the device is to Google Fonts for the two typefaces.

Two things are public by their nature, and are worth knowing rather than
discovering: the URL works for anyone who has it (they would see an empty app
of their own), and the repository's own text — this README, the app's title,
the design file — names Mila. Self-hosting the fonts would remove the last
third-party request; making the repo private would need a paid GitHub plan,
since Pages only serves public repos for free.

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

Ime, tema (three palettes), the sound switch, the backup buttons, *Resetuj
napredak* and the running version live at the bottom of the **Podsetnik**
screen.

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
npm run crop    # re-cut www/img/lili-<id>.png from assets/source/gimi-sheet.png
npm run shots   # screenshot every screen through headless Chrome
npm test        # load every old save shape and check nothing was lost
```

`npm run shots` and `npm test` need Chrome running with
`--remote-debugging-port=9222`, and the app served locally (`npm start`).

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
