/* Gimnastika za Milu — app logic.
   Nine screens from the design, real state that survives a reload, and a
   workout that actually counts toward stars, streaks and stickers. */
(function () {
  "use strict";

  /* ═══ tema ══════════════════════════════════════════════════════════ */

  var THEMES = {
    roze: { label: "Roze", a: "#ff3d8b", v: "#7b2ff2", bg: "#fff0f7", sf: "#ffe3f1", lc: "#f3e8ff", gd: "#ffb01f", ink: "#3b2540" },
    lavanda: { label: "Lavanda", a: "#a855f7", v: "#5b21b6", bg: "#f5f1ff", sf: "#ece3ff", lc: "#e5edff", gd: "#f59e0b", ink: "#2e2440" },
    suncano: { label: "Sunčano", a: "#ff6b4a", v: "#c2185b", bg: "#fff6ec", sf: "#ffe4d3", lc: "#ffeedd", gd: "#ffb703", ink: "#3d2419" }
  };

  /* ═══ vežbe ═════════════════════════════════════════════════════════ */

  /* `id` is the stable handle — plans, stickers and saved history all refer to
     exercises by id, so the list can be reordered or extended safely.
     `img` is a photo of Lili in the pose; without one the SVG figure is drawn.
     `group`: warm (zagrevanje) · bal (ravnoteža) · str (snaga) · flex (gipkost) */
  var EX = [
    { id: "zvezdice", pose: "zvezdice", name: "Zvezdice u mestu", cat: "Zagrevanje", group: "warm", min: "1 min", sec: 60, lvl: 1, opr: "Bez opreme", img: "lili-zvezdice.png",
      desc: "Zagreva celo telo i budi mišiće. Uvek prva vežba na treningu.",
      steps: ["Stani uspravno, ruke pored tela.", "Skoči i raširi noge, ruke gore iznad glave.", "Skoči nazad u početni položaj.", "Ponovi 20 puta, diši ravnomerno."] },
    { id: "macka", pose: "macka", name: "Mačka–krava", cat: "Mobilnost kičme", group: "flex", min: "1–2 min", sec: 90, lvl: 1, opr: "Podloga", img: "lili-macka.png",
      desc: "Zagreva kičmu. Udahni kao krava, izdahni kao mačka.",
      steps: ["Stani na sve četiri, ruke pod ramenima.", "Udahni i spusti stomak, pogledaj gore.", "Izdahni i zaokruži leđa, spusti glavu.", "Ponovi 8 puta lagano."] },
    { id: "psic", pose: "psic", name: "Psić", cat: "Istezanje celog tela", group: "flex", min: "1–2 min", sec: 90, lvl: 1, opr: "Podloga", img: "lili-psic.png",
      desc: "Isteže noge i leđa odjednom. Napravi slovo A svojim telom.",
      steps: ["Stani na sve četiri.", "Podigni kukove ka gore i ispravi noge.", "Spusti glavu između ruku, pete ka podu.", "Zadrži 15 sekundi i diši mirno."] },
    { id: "leptiric", pose: "leptiric", name: "Leptirić", cat: "Istezanje", group: "flex", min: "1–2 min", sec: 90, lvl: 1, opr: "Podloga", img: "lili-leptiric.png",
      desc: "Otvara kukove i opušta noge. Savršena vežba za početak treninga.",
      steps: ["Sedi na podlogu i skupi stopala.", "Uhvati stopala rukama.", "Blago pritisni kolena ka podu.", "Zadrži 20 sekundi i diši mirno."] },
    { id: "pretklon", pose: "pretklon", name: "Sedeći pretklon", cat: "Istezanje nogu", group: "flex", min: "1–2 min", sec: 90, lvl: 1, opr: "Podloga", img: "lili-pretklon.png",
      desc: "Isteže zadnju ložu — prvi korak ka špagi.",
      steps: ["Sedi i ispruži noge napred.", "Ispravi leđa i udahni.", "Izdahni i lagano se spusti ka stopalima.", "Zadrži 20 sekundi, ne trzaj."] },
    { id: "kobra", pose: "kobra", name: "Kobra", cat: "Gipkost leđa", group: "flex", min: "1–2 min", sec: 90, lvl: 1, opr: "Podloga", img: "lili-kobra.png",
      desc: "Otvara grudi i priprema leđa za mostić.",
      steps: ["Lezi na stomak, ruke pored ramena.", "Lagano podigni grudi i pogledaj napred.", "Ramena spusti dole, laktovi uz telo.", "Zadrži 10 sekundi i spusti se."] },
    { id: "mostic", pose: "mostic", name: "Mostić", cat: "Fleksibilnost", group: "flex", min: "2 min", sec: 120, lvl: 2, opr: "Podloga", img: "lili-mostic.png",
      desc: "Jača ruke i leđa i pomaže da ti telo bude gibko kao guma.",
      steps: ["Lezi na leđa i savij kolena.", "Stavi ruke pored glave, prsti gledaju ka ramenima.", "Podigni kukove i grudi ka gore.", "Zadrži 5 sekundi i polako se spusti."] },
    { id: "spaga", pose: "spaga", name: "Špaga", cat: "Fleksibilnost", group: "flex", min: "2 min", sec: 120, lvl: 3, opr: "Podloga", img: "lili-spaga.png",
      desc: "Veliki cilj svake gimnastičarke. Idi polako — svaki dan po malo.",
      steps: ["Klekni, pa isturi jednu nogu napred.", "Rukama se osloni na pod sa strane.", "Spuštaj se koliko možeš bez bola.", "Zadrži 20 sekundi, pa promeni nogu."] },
    { id: "arabeska", pose: "arabeska", name: "Streličar (arabeska)", cat: "Ravnoteža i elegancija", group: "bal", min: "2 min", sec: 120, lvl: 2, opr: "Podloga", img: "lili-arabeska.png",
      desc: "Ojačava leđa, ramena i noge. Pomaže ti da budeš stabilna i graciozna.",
      steps: ["Stani uspravno i podigni ruke u stranu.", "Podigni jednu nogu nazad, telo lagano nagni napred.", "Drži leđa prava i pogled napred.", "Zadrži 2–3 sekunde i polako se vrati."] },
    { id: "linija", pose: "linija", name: "Hodanje po liniji", cat: "Ravnoteža", group: "bal", min: "1–2 min", sec: 90, lvl: 1, opr: "Bez opreme", img: "lili-linija.png",
      desc: "Vežba za gredu — samo što je greda na podu i ne može da se padne.",
      steps: ["Zamisli liniju na podu ili stavi kanap.", "Ruke raširi u stranu.", "Hodaj peta uz prste, polako.", "Napravi 10 koraka napred i 10 nazad."] },
    { id: "prsti", pose: "prsti", name: "Ravnoteža na prstima", cat: "Ravnoteža", group: "bal", min: "1–2 min", sec: 90, lvl: 3, opr: "Bez opreme", img: "lili-prsti.png",
      desc: "Uči te da stojiš mirno kao statua — i na gredi.",
      steps: ["Stani uspravno, ruke u stranu.", "Podigni se na prste.", "Gledaj u jednu tačku pred sobom.", "Zadrži 10 sekundi, pa opusti."] },
    { id: "sveca", pose: "sveca", name: "Sveća", cat: "Ravnoteža naglavce", group: "bal", min: "1–2 min", sec: 90, lvl: 2, opr: "Podloga", img: "lili-sveca.png",
      desc: "Prva vežba za stav na rukama — telo pravo kao sveća.",
      steps: ["Lezi na leđa i podigni noge gore.", "Podupri kukove rukama.", "Ispravi telo u jednu liniju.", "Zadrži 10 sekundi i polako se spusti."] },
    { id: "daska", pose: "daska", name: "Daska", cat: "Snaga trupa", group: "str", min: "1 min", sec: 60, lvl: 2, opr: "Podloga", img: "lili-daska.png",
      desc: "Celo telo pravo kao daska. Najbolja vežba za jak stomak.",
      steps: ["Osloni se na podlaktice i prste stopala.", "Telo drži pravo od glave do peta.", "Stomak uvuci, ne spuštaj kukove.", "Izdrži 20 sekundi."] },
    { id: "noge", pose: "noge", name: "Podigni noge", cat: "Snaga trupa", group: "str", min: "2 min", sec: 120, lvl: 2, opr: "Podloga", img: "lili-noge.png",
      desc: "Pravi jak stomak — to je motor za svaki skok i preskok.",
      steps: ["Lezi na leđa, ruke pored tela.", "Podigni ispravljene noge do 90 stepeni.", "Spuštaj ih polako, ne dodiruj pod.", "Ponovi 10 puta."] },
    { id: "cuk", pose: "cuk", name: "Ćuk (držanje)", cat: "Snaga i držanje", group: "str", min: "1–2 min", sec: 90, lvl: 3, opr: "Podloga", img: "lili-cuk.png",
      desc: "Skupljeno telo koje se drži samo — kao klupko snage.",
      steps: ["Sedi i skupi kolena ka grudima.", "Uhvati potkolenice rukama.", "Podigni stopala od poda i balansiraj.", "Zadrži 8 sekundi."] },
    { id: "lastavica", pose: "lastavica", name: "Lastavica na podu", cat: "Snaga leđa", group: "str", min: "1–2 min", sec: 90, lvl: 1, opr: "Podloga", img: "lili-lastavica.png",
      desc: "Jaka leđa drže telo uspravno u svakoj vežbi.",
      steps: ["Lezi na stomak, ruke ispruži napred.", "Podigni istovremeno ruke i noge.", "Gledaj u pod da vrat bude miran.", "Zadrži 5 sekundi, ponovi 8 puta."] },
    { id: "cucanj", pose: "cucanj", name: "Polučučanj + ruke napred", cat: "Snaga nogu", group: "str", min: "2 min", sec: 120, lvl: 2, opr: "Bez opreme", img: "lili-cucanj.png",
      desc: "Jake noge znače viši skok i sigurno doskakanje.",
      steps: ["Stopala u širini kukova.", "Spusti se do pola čučnja.", "Ispruži ruke napred u visini ramena.", "Zadrži 3 sekunde i vrati se gore."] },
    { id: "iskorak", pose: "iskorak", name: "Iskorak", cat: "Snaga nogu", group: "str", min: "1–2 min", sec: 90, lvl: 2, opr: "Bez opreme", img: "lili-iskorak.png",
      desc: "Uči noge da rade svaka za sebe — važno za doskok i okret.",
      steps: ["Stani uspravno, ruke na kukovima.", "Zakorači jednom nogom napred.", "Spusti zadnje koleno ka podu.", "Vrati se gore i promeni nogu, 8 puta."] },
    { id: "dete", pose: "dete", name: "Dete poza", cat: "Opuštanje", group: "flex", min: "1 min", sec: 60, lvl: 1, opr: "Podloga",
      desc: "Kraj treninga. Odmori leđa i smiri disanje.",
      steps: ["Klekni i sedi na pete.", "Spusti čelo ka podu.", "Ruke ispruži napred ili pored tela.", "Diši polako 30 sekundi."] }
  ];

  var BY_ID = {};
  EX.forEach(function (e, i) { BY_ID[e.id] = i; });
  function idxOf(id) { return BY_ID[id]; }

  var DAY_SHORT = ["Pon", "Uto", "Sre", "Čet", "Pet", "Sub", "Ned"];
  var DAY_LETTER = ["P", "U", "S", "Č", "P", "S", "N"];

  /* A different session each weekday — always a warm-up first and something
     calm last, with hard days followed by lighter ones. */
  var PLAN = [
    { title: "Dan 1 — Zagrevanje i istezanje",
      ex: ["zvezdice", "macka", "psic", "leptiric", "pretklon", "dete"] },
    { title: "Dan 2 — Gipkost",
      ex: ["zvezdice", "macka", "kobra", "mostic", "spaga", "dete"] },
    { title: "Dan 3 — Snaga i ravnoteža",
      ex: ["zvezdice", "daska", "arabeska", "noge", "cucanj", "dete"] },
    { title: "Dan 4 — Lagani dan",
      ex: ["zvezdice", "macka", "linija", "leptiric", "dete"] },
    { title: "Dan 5 — Snaga trupa",
      ex: ["zvezdice", "daska", "noge", "cuk", "lastavica", "dete"] },
    { title: "Dan 6 — Ravnoteža",
      ex: ["zvezdice", "linija", "arabeska", "prsti", "sveca", "dete"] },
    { title: "Dan 7 — Odmor i istezanje",
      ex: ["macka", "psic", "leptiric", "pretklon", "kobra", "dete"] }
  ];

  /* exercise indices for a weekday (0 = Monday) */
  function planFor(day) {
    return PLAN[day].ex.map(idxOf);
  }
  function planSec(day) {
    return planFor(day).reduce(function (n, i) { return n + EX[i].sec; }, 0);
  }

  var FILTERS = [
    { label: "Sve", group: null },
    { label: "Zagrevanje", group: "warm" },
    { label: "Ravnoteža", group: "bal" },
    { label: "Snaga", group: "str" },
    { label: "Gipkost", group: "flex" }
  ];

  /* Nagrade — svaka ima pravi uslov i savet koliko još fali.
     `unit` nosi tri oblika (1 / 2–4 / 5+) zbog srpske množine. */
  var STICKERS = [
    { key: "first", name: "Prvi trening", goal: 1, val: function (m) { return m.workouts; },
      unit: ["trening", "treninga", "treninga"] },
    { key: "streak3", name: "3 dana u nizu", goal: 3, val: function (m) { return m.bestStreak; },
      unit: ["dan", "dana", "dana"], tail: "u nizu" },
    { key: "bridge", name: "Mostić majstor", goal: 10, val: function (m) { return m.exCount.mostic || 0; },
      unit: ["mostić", "mostića", "mostića"] },
    { key: "balance", name: "Ravnoteža", goal: 12, val: function (m) { return m.groupCount.bal; },
      unit: ["vežba", "vežbe", "vežbi"], tail: "ravnoteže" },
    { key: "ten", name: "10 treninga", goal: 10, val: function (m) { return m.workouts; },
      unit: ["trening", "treninga", "treninga"] },
    { key: "split", name: "Špaga", goal: 20, val: function (m) { return m.exCount.spaga || 0; },
      unit: ["vežba za špagu", "vežbe za špagu", "vežbi za špagu"] },
    { key: "candle", name: "Sveća", goal: 10, val: function (m) { return m.exCount.sveca || 0; },
      unit: ["sveća", "sveće", "sveća"] },
    { key: "week", name: "Nedelja bez pauze", goal: 7, val: function (m) { return m.bestStreak; },
      unit: ["dan", "dana", "dana"], tail: "u nizu" },
    { key: "fifty", name: "50 minuta", goal: 50, val: function (m) { return m.minutes; },
      unit: ["minut", "minuta", "minuta"] },
    { key: "gold", name: "Zlatna zvezda", goal: 100, val: function (m) { return m.stars; },
      unit: ["zvezdica", "zvezdice", "zvezdica"] }
  ];

  /* ═══ ikone (Lucide, stroke 2.75 kao u sistemu) ═════════════════════ */

  var IC = {
    star: '<path d="M12 2l2.9 6.3 6.9.8-5 4.7 1.3 6.8L12 17.3 5.9 20.6 7.2 13.8l-5-4.7 6.9-.8z"/>',
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.8V20h14V9.8"/>',
    heart: '<path d="M20.8 8.6c0 5-8.8 10.4-8.8 10.4S3.2 13.6 3.2 8.6a4.6 4.6 0 0 1 8.8-1.9 4.6 4.6 0 0 1 8.8 1.9z"/>',
    cal: '<rect x="3" y="5" width="18" height="16" rx="4"/><path d="M8 3v4M16 3v4M3 11h18"/>',
    chart: '<path d="M5 20V11M12 20V5M19 20v-6"/>',
    trophy: '<circle cx="12" cy="9" r="6"/><path d="M8.5 14.5 7 22l5-2.6L17 22l-1.5-7.5"/>',
    bell: '<circle cx="12" cy="13" r="8"/><path d="M12 9.5V13l2.5 1.5M5 4l2.5 2M19 4l-2.5 2"/>',
    chevron: '<path d="M9 5l7 7-7 7"/>',
    back: '<path d="M15 5l-7 7 7 7"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    arrow: '<path d="M5 12h13M13 6l6 6-6 6"/>',
    check: '<path d="M5 13l4.5 4.5L19 7"/>',
    todo: '<path d="M3.5 7.5 5.5 9.5 9 5.5"/><path d="M3.5 16.5 5.5 18.5 9 14.5"/><path d="M13 7.5h8M13 16.5h8"/>',
    plus: '<path d="M12 5v14M5 12h14"/>'
  };

  function icon(name, size, opts) {
    opts = opts || {};
    var s = size || 26;
    return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="' + (opts.fill || "none") +
      '" stroke="' + (opts.stroke || "currentColor") + '" stroke-width="' + (opts.w || 2.75) +
      '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + IC[name] + "</svg>";
  }

  /* ═══ stanje ════════════════════════════════════════════════════════ */

  var KEY = "mila-gimnastika-v2";
  var memoryOnly = false;

  /* Shown at the bottom of Podešavanja. Bump it with `CACHE` in sw.js on every
     release — it is the only way to tell from the iPad which build is running,
     which matters because the app keeps working offline out of its own cache. */
  var BUILD = "4 · 31.07.2026.";

  function today() { return ymd(new Date()); }
  function ymd(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" +
      String(d.getDate()).padStart(2, "0");
  }
  function fromYmd(s) { var p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  /* 0 = ponedeljak */
  function weekday(d) { return (d.getDay() + 6) % 7; }
  function addDays(d, n) { var x = new Date(d.getTime()); x.setDate(x.getDate() + n); return x; }
  function weekStart(d) { return addDays(d, -weekday(d)); }

  function defaults() {
    return {
      v: 2,
      ime: "Mila",
      tema: "roze",
      stars: 0,
      favs: [],
      bestStreak: 0,
      zvuk: true,
      days: {},            /* "YYYY-MM-DD": { sec, workouts, ex:{id:n}, done:[i] } */
      todos: [],           /* [{ id, t, done }] — njena lista, ne dira gimnastiku */
      rem: { on: true, time: "18:00", days: { 0: 1, 1: 1, 2: 1, 3: 1, 4: 1, 5: 0, 6: 0 }, lastFired: "" }
    };
  }

  var st = defaults();

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var got = JSON.parse(raw);
        if (got && got.v === 2) {
          st = Object.assign(defaults(), got);
          st.rem = Object.assign(defaults().rem, got.rem || {});
          /* fields added after a save was written: keep the old payload,
             just fill in what it could not have known about */
          if (!Array.isArray(st.todos)) st.todos = [];
          if (typeof st.zvuk !== "boolean") st.zvuk = true;
        }
      }
    } catch (e) { memoryOnly = true; }
  }
  function save() {
    if (memoryOnly) return;
    try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { memoryOnly = true; }
  }

  /* Time is kept in seconds and only rounded for display, so the totals on
     Početna, Napredak and the finish screen can never disagree. */
  function dayRec(date) {
    if (!st.days[date]) st.days[date] = { sec: 0, workouts: 0, ex: {}, done: [] };
    var r = st.days[date];
    if (!r.ex) r.ex = {};
    if (!r.done) r.done = [];
    if (typeof r.sec !== "number") r.sec = 0;
    return r;
  }
  function mins(sec) { return Math.round(sec / 60); }

  /* ═══ zvuk ══════════════════════════════════════════════════════════ */

  /* Synthesised, not sampled: no audio files to download or cache, so it works
     with the app fully offline and adds nothing to the bundle. iOS only lets
     an AudioContext make noise if it was started inside a user gesture, so the
     first tap anywhere in the app unlocks it. */
  var actx = null;

  function audible() { return st.zvuk !== false; }

  /* Called on every tap, not just the first: iOS suspends the context again
     whenever the app is backgrounded, and only a gesture may resume it. */
  function unlockAudio() {
    if (!audible()) return;
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!actx) actx = new AC();
      if (actx.state === "suspended") actx.resume();
    } catch (e) { actx = null; }
  }

  /* One note. `at` is an offset in seconds so a whole arpeggio can be
     scheduled up front and still play in time while the timer ticks. */
  function note(freq, at, dur, vol, type) {
    if (!actx || !audible()) return;
    try {
      var t0 = actx.currentTime + at;
      var osc = actx.createOscillator();
      var g = actx.createGain();
      osc.type = type || "sine";
      osc.frequency.setValueAtTime(freq, t0);
      /* fade both ends — a square edge clicks audibly on the iPad speaker */
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(g);
      g.connect(actx.destination);
      osc.start(t0);
      osc.stop(t0 + dur + 0.03);
    } catch (e) {}
  }

  var SOUND = {
    /* count-in: a soft tick a second, the last one a note higher */
    tick: function (last) { note(last ? 1046 : 660, 0, 0.11, 0.15, "triangle"); },
    /* the exercise itself starts: two bright rising notes */
    go: function () {
      note(880, 0, 0.16, 0.2, "triangle");
      note(1318, 0.13, 0.3, 0.2, "triangle");
    },
    /* exercise finished: a little four-note "well done", then a sparkle */
    cheer: function () {
      [523, 659, 784, 1046].forEach(function (f, i) {
        note(f, i * 0.1, 0.32, 0.17, "triangle");
      });
      note(1568, 0.44, 0.55, 0.12, "sine");
    },
    /* the whole workout is done — the one sound that gets to be a fanfare */
    finish: function () {
      [523, 659, 784, 1046, 1318].forEach(function (f, i) {
        note(f, i * 0.11, 0.3, 0.17, "triangle");
      });
      /* held major chord under it, so the run lands on something */
      [523, 659, 784, 1046].forEach(function (f) {
        note(f, 0.58, 1.1, 0.11, "sine");
      });
      note(2093, 0.72, 0.7, 0.07, "sine");
    }
  };

  /* ═══ izvedene brojke ═══════════════════════════════════════════════ */

  function metrics() {
    var m = {
      stars: st.stars, workouts: 0, sec: 0, weekSec: 0,
      exCount: {}, groupCount: { bal: 0, str: 0, flex: 0 },
      streak: 0, bestStreak: st.bestStreak || 0,
      weekWorkouts: 0, activeLast7: 0,
      recent: { bal: 0, str: 0, flex: 0 }
    };

    var ws = weekStart(new Date());
    var d14 = addDays(new Date(), -13);
    var d7 = addDays(new Date(), -6);

    Object.keys(st.days).forEach(function (date) {
      var r = dayRec(date), dt = fromYmd(date);
      m.workouts += r.workouts || 0;
      m.sec += r.sec || 0;
      Object.keys(r.ex).forEach(function (id) {
        var n = r.ex[id], e = EX[idxOf(id)];
        m.exCount[id] = (m.exCount[id] || 0) + n;
        if (e && m.groupCount[e.group] !== undefined) {
          m.groupCount[e.group] += n;
          if (dt >= d14) m.recent[e.group] += n;
        }
      });
      if (dt >= ws) { m.weekSec += r.sec || 0; m.weekWorkouts += r.workouts || 0; }
      if (dt >= d7 && (r.sec > 0 || r.done.length)) m.activeLast7++;
    });
    m.minutes = mins(m.sec);
    m.weekMin = mins(m.weekSec);

    /* serija — unazad od danas (ili juče, da jutro ne resetuje brojač) */
    var cur = new Date();
    if (!active(ymd(cur))) cur = addDays(cur, -1);
    while (active(ymd(cur))) { m.streak++; cur = addDays(cur, -1); }
    if (m.streak > m.bestStreak) m.bestStreak = m.streak;

    /* najbolja vežba */
    var best = null;
    Object.keys(m.exCount).forEach(function (id) {
      if (idxOf(id) === undefined) return;
      if (!best || m.exCount[id] > m.exCount[best]) best = id;
    });
    m.bestEx = best === null ? null : { name: EX[idxOf(best)].name, n: m.exCount[best] };

    /* Target of 6 in a fortnight ≈ three full workouts — reachable enough
       that the bars and the OCENA move after real effort, not months of it. */
    m.skills = [
      { name: "Ravnoteža", pct: pct(m.recent.bal, 6), color: "var(--a)" },
      { name: "Fleksibilnost", pct: pct(m.recent.flex, 6), color: "var(--v)" },
      { name: "Snaga", pct: pct(m.recent.str, 6), color: "var(--gd)" },
      { name: "Redovnost", pct: pct(m.activeLast7, 7), color: "var(--a)" }
    ];
    var avg = m.skills.reduce(function (n, s) { return n + s.pct; }, 0) / m.skills.length;
    m.ocena = (Math.round(avg / 20 * 10) / 10).toFixed(1).replace(".", ",");
    return m;
  }

  function active(date) {
    var r = st.days[date];
    return !!(r && ((r.sec || 0) > 0 || (r.done && r.done.length)));
  }
  function pct(n, target) { return Math.max(0, Math.min(100, Math.round(n / target * 100))); }

  function stickerState(m) {
    return STICKERS.map(function (s) {
      var have = s.val(m) || 0;
      var on = have >= s.goal;
      var left = s.goal - have;
      return {
        key: s.key, name: s.name, on: on, have: have, goal: s.goal, left: left,
        status: on ? "OSVOJENO"
          : "još " + left + " " + plural(left, s.unit[0], s.unit[1], s.unit[2]) +
            (s.tail ? " " + s.tail : "")
      };
    });
  }

  /* ═══ UI stanje (nije trajno) ═══════════════════════════════════════ */

  var ui = {
    screen: "home",
    sel: 0,
    filter: "Sve",
    wday: 0,
    wi: 0,
    phase: "ready",   /* ready → prep → go → cheer */
    sec: 0,
    run: true,
    day: weekday(new Date()),
    praise: "",       /* which congratulation Lili is giving right now */
    todoDraft: "",    /* what she has typed but not added yet */
    lastReward: null,
    toast: null
  };

  var timer = null, wakeLock = null, toastTimer = null, cheerTimer = null;

  /* Lili's congratulations. Kept short — they are read aloud in the head at a
     glance, mid-workout, by a child who is out of breath. */
  var PRAISE = [
    "Bravo!", "Sjajno!", "Odlično!", "Super si!", "Tako se to radi!",
    "Vau, kako lepo!", "Ponosna sam na tebe!", "Prava gimnastičarka!",
    "Još jedna gotova!", "Jaka si!", "Svaka čast!", "To je to!"
  ];

  /* ═══ pomoćno ═══════════════════════════════════════════════════════ */

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function act(name, arg) {
    return 'data-act="' + name + '"' + (arg === undefined ? "" : ' data-arg="' + esc(arg) + '"');
  }
  function theme() { return THEMES[st.tema] || THEMES.roze; }
  function ime() { return (st.ime || "Mila").trim() || "Mila"; }
  function greeting() {
    var h = new Date().getHours();
    if (h < 11) return "DOBRO JUTRO";
    if (h < 18) return "ZDRAVO";
    return "DOBRO VEČE";
  }
  function plural(n, one, few, many) {
    var a = n % 10, b = n % 100;
    if (a === 1 && b !== 11) return one;
    if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return few;
    return many;
  }
  function dani(n) { return n + " " + plural(n, "dan", "dana", "dana"); }

  function toast(msg) {
    ui.toast = msg;
    render();
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { ui.toast = null; render(); }, 3200);
  }

  /* ═══ ekrani ════════════════════════════════════════════════════════ */

  function railHtml() {
    var items = [
      ["home", "home", "Početna"], ["list", "heart", "Vežbe"], ["plan", "cal", "Plan"],
      ["todo", "todo", "Obaveze"], ["prog", "chart", "Napredak"],
      ["prize", "trophy", "Nagrade"], ["rem", "bell", "Podsetnik"]
    ];
    /* mid-workout nothing is highlighted — she isn't "in" a tab, she's training */
    var on = { detail: "list", work: "", done: "" }[ui.screen];
    if (on === undefined) on = ui.screen;
    return '<nav class="rail" aria-label="Glavni meni">' +
      '<div class="rail__logo">' + icon("star", 34) + "</div>" +
      items.map(function (it) {
        return '<button class="navbtn' + (on === it[0] ? " on" : "") + '" ' + act("go", it[0]) +
          (on === it[0] ? ' aria-current="page"' : "") + ">" + icon(it[1], 26) + esc(it[2]) + "</button>";
      }).join("") +
      '<div class="rail__spacer"></div>' +
      '<div class="rail__avatar">' + esc(ime().charAt(0).toUpperCase()) + "</div>" +
      '<div class="rail__name">' + esc(ime()) + "</div></nav>";
  }

  function homeHtml(m) {
    var t = dayRec(today());
    return '<div class="screen"><div class="home">' +
      '<div class="home__left">' +
        '<div class="kicker">' + greeting() + ", " + esc(ime().toUpperCase()) + "!</div>" +
        "<h1>GIMNASTIKA</h1>" +
        '<div class="lead">Vežbaj, zabavi se i postani još jača!</div>' +
        '<div class="stats">' +
          stat("SERIJA", m.streak > 0 ? dani(m.streak) : "kreni!", "var(--v)") +
          stat("ZVEZDICE", m.stars, "var(--gd)") +
          stat("DANAS", mins(t.sec) + " min", "var(--a)") +
        "</div>" +
        '<div class="spacer"></div>' +
        '<button class="cta home__cta" ' + act("start") + ">POČNI TRENING" +
          icon("star", 34, { fill: "var(--gd)", stroke: "none", w: 0 }) + "</button>" +
      "</div>" +
      '<div class="home__right">' +
        '<div class="slot hero"><img class="expic" src="img/lili-split.jpg" ' +
          'alt="Lili u špagi" decoding="async"></div>' +
        '<div class="lilicard"><div class="lilicard__pic">' + lili("sit") + "</div><div>" +
          '<div class="lilicard__t">' + (m.streak > 0 ? "Spremna sam da vežbam s tobom!" : "Hajde da počnemo zajedno!") + "</div>" +
          '<div class="lilicard__s">' + esc(todayFocus()) + "</div>" +
        "</div></div>" +
      "</div></div></div>";
  }

  /* "Gipkost — 6 vežbi." — what today's session actually is. */
  function todayFocus() {
    var d = weekday(new Date());
    var n = planFor(d).length;
    var title = PLAN[d].title.split("— ")[1] || PLAN[d].title;
    return title + " — " + n + " " + plural(n, "vežba", "vežbe", "vežbi") + ".";
  }

  /* Lili herself, for the mascot slots. */
  function lili(pose, alt) {
    return '<img class="expic" src="img/lili-' + pose + '.png" alt="' +
      esc(alt || "Lili") + '" decoding="async">';
  }

  /* Lili photographed in the pose when one exists, the drawn figure when not. */
  function exPic(e, small) {
    if (e.img) {
      return '<img class="expic" src="img/' + e.img + '" alt="Lili radi: ' +
        esc(e.name) + '" loading="lazy" decoding="async">';
    }
    return ILLU.gymnast(e.pose, { decor: !small, label: e.name });
  }

  function stat(k, v, color) {
    return '<div class="stat"><div class="stat__k">' + esc(k) + '</div><div class="stat__v" style="color:' +
      color + '">' + esc(v) + "</div></div>";
  }

  function listHtml() {
    var f = FILTERS.filter(function (x) { return x.label === ui.filter; })[0] || FILTERS[0];
    var cards = EX.map(function (e, i) { return { e: e, i: i }; })
      .filter(function (x) { return !f.group || x.e.group === f.group; });

    return '<div class="screen">' +
      '<div class="headrow"><h2 class="h2">Vežbe</h2><div class="filters">' +
        FILTERS.map(function (x) {
          return '<button class="chip' + (ui.filter === x.label ? " on" : "") + '" ' +
            act("filter", x.label) + ">" + esc(x.label) + "</button>";
        }).join("") +
      "</div></div>" +
      '<div class="exgrid scroll">' +
        (cards.length ? cards.map(function (x) {
          var e = x.e, fav = st.favs.indexOf(e.id) > -1;
          return '<button class="excard" ' + act("open", x.i) + ">" +
            '<div class="excard__thumb">' + exPic(e, true) + "</div>" +
            '<div class="excard__body"><div class="excard__name">' + esc(e.name) + "</div>" +
            '<div class="excard__cat">' + esc(e.cat) + "</div>" +
            '<div class="excard__meta"><span class="excard__min">' + esc(e.min) + "</span>" +
            '<span class="lvl">' + [0, 1, 2].map(function (n) {
              return "<i" + (n < e.lvl ? ' class="on"' : "") + "></i>";
            }).join("") + "</span></div></div>" +
            (fav ? '<span class="excard__fav">' + icon("heart", 20, { fill: "var(--a)" }) + "</span>" : "") +
            icon("chevron", 24, { stroke: "var(--v)" }) + "</button>";
        }).join("") : '<div class="empty">Nema vežbi u ovoj grupi.</div>') +
      "</div></div>";
  }

  function detailHtml() {
    var e = EX[ui.sel], fav = st.favs.indexOf(e.id) > -1;
    return '<div class="screen">' +
      '<div class="headrow" style="margin-bottom:1.125rem">' +
        '<button class="iconbtn" ' + act("go", "list") + ' aria-label="Nazad">' + icon("back", 26) + "</button>" +
        '<h2 class="h2" style="flex:1;font-size:2.5rem">' + esc(e.name) + "</h2>" +
        '<button class="iconbtn" ' + act("fav") + ' aria-label="Omiljena vežba" aria-pressed="' + fav + '">' +
          icon("heart", 26, { fill: fav ? "var(--a)" : "none", stroke: "var(--a)" }) + "</button>" +
      "</div>" +
      '<div class="det">' +
        '<div class="slot det__media">' + exPic(e) + "</div>" +
        '<div class="det__side scroll">' +
          '<span class="tag">' + esc(e.cat) + "</span>" +
          '<p class="desc">' + esc(e.desc) + "</p>" +
          '<div class="facts">' +
            fact("VREME", e.min, "var(--a)") +
            fact("NIVO", ["Lako", "Srednje", "Teže"][e.lvl - 1], "var(--v)") +
            fact("OPREMA", e.opr, "inherit") +
          "</div>" +
          '<div class="steps__h">Koraci</div>' + stepsHtml(e.steps) +
          '<div class="spacer"></div>' +
          '<button class="cta cta--sm" style="margin-top:1.25rem;width:100%" ' + act("startFrom") +
            ">KRENI NA VEŽBU" + icon("star", 28, { fill: "var(--gd)", stroke: "none", w: 0 }) + "</button>" +
        "</div></div></div>";
  }

  function fact(k, v, color) {
    return '<div class="fact"><div class="fact__k">' + esc(k) + '</div><div class="fact__v" style="color:' +
      color + '">' + esc(v) + "</div></div>";
  }
  function stepsHtml(steps) {
    return '<div class="steps">' + steps.map(function (t, i) {
      return '<div class="step"><div class="step__n">' + (i + 1) + '</div><div class="step__t">' +
        esc(t) + "</div></div>";
    }).join("") + "</div>";
  }

  function workHtml() {
    var plan = curPlan();
    var e = EX[plan[ui.wi]];
    var last = ui.wi === plan.length - 1;
    var prep = ui.phase === "prep";
    var mm = Math.floor(ui.sec / 60), ss = String(ui.sec % 60).padStart(2, "0");

    /* Four phases per exercise: ready (waiting on her), prep (5s count-in),
       go (the exercise timer), cheer (Lili congratulates her). Each gets its
       own colour on the dial. */
    var dial, label, ctl;
    if (ui.phase === "cheer") {
      dial = "Bravo!"; label = "GOTOVO";
      ctl = "<p>Odlično! Idemo dalje.</p>";
    } else if (ui.phase === "ready") {
      dial = "Spremna?"; label = "PRITISNI KRENI";
      ctl = '<button class="timerctl__go" ' + act("go1") + ">KRENI" +
        icon("arrow", 24, { stroke: "#fff" }) + "</button>" +
        "<p>Zauzmi položaj, pa pritisni <b>Kreni</b>.</p>";
    } else if (prep) {
      dial = String(ui.sec); label = "SPREMI SE";
      ctl = '<button ' + act("run") + ">" + (ui.run ? "Pauza" : "Nastavi") + "</button>" +
        "<p>Zauzmi položaj — krećemo za <b>" + ui.sec + "</b>!</p>";
    } else {
      dial = ui.sec > 0 ? mm + ":" + ss : "Bravo!"; label = "PREOSTALO";
      ctl = '<button ' + act("run") + ">" + (ui.run ? "Pauza" : "Nastavi") + "</button>" +
        "<p>Kad završiš, pritisni <b>Sledeće</b>. Nema žurbe!</p>";
    }

    return '<div class="screen work">' +
      (ui.phase === "cheer" ? cheerHtml(e, last) : "") +
      '<div class="work__top">' +
        '<button class="iconbtn" ' + act("quit") + ' aria-label="Prekini trening">' + icon("close", 24) + "</button>" +
        '<div class="dots">' + plan.map(function (_, i) {
          return "<i" + (i < ui.wi ? ' class="past"' : i === ui.wi ? ' class="now"' : "") + "></i>";
        }).join("") + "</div>" +
        '<div class="work__count">' + (ui.wi + 1) + " / " + plan.length + "</div>" +
      "</div>" +
      '<div class="work__main">' +
        '<div class="work__media' + (prep ? " work__media--prep" : "") + '">' + exPic(e) + "</div>" +
        '<div class="work__side">' +
          '<div class="work__kicker">VEŽBA ' + (ui.wi + 1) + " / " + plan.length + "</div>" +
          "<h2>" + esc(e.name) + "</h2>" +
          '<div class="timerrow">' +
            '<div class="timer timer--' + ui.phase + (ui.sec === 0 && ui.phase === "go" ? " done" : "") +
              '"><div class="timer__v">' + dial + '</div><div class="timer__k">' + label + "</div></div>" +
            '<div class="timerctl">' + ctl + "</div>" +
          "</div>" +
          '<div class="work__steps scroll"><div class="steps__h">Koraci</div>' + stepsHtml(e.steps) + "</div>" +
          '<button class="cta work__cta" ' + act("next") + ">" + (last ? "ZAVRŠI" : "SLEDEĆE") +
            icon("arrow", 30, { stroke: "#fff" }) + "</button>" +
        "</div></div></div>";
  }

  /* The moment the exercise ends: Lili jumps in, congratulates her and hands
     over the star. It clears itself after CHEER_MS, or the moment she taps. */
  function cheerHtml(e, last) {
    /* The rays keep their own angle in a custom property, because the flying-
       outward keyframes animate `transform` and would otherwise erase it. */
    var burst = "";
    for (var i = 0; i < 12; i++) {
      burst += '<i style="--ang:' + (i * 30) + "deg;animation-delay:" +
        ((i % 4) * 0.07).toFixed(2) + "s;background:" +
        (i % 2 ? "var(--a)" : "var(--gd)") + '"></i>';
    }
    return '<div class="cheer" role="status"><div class="cheer__card">' +
      '<div class="cheer__burst" aria-hidden="true">' + burst + "</div>" +
      '<div class="cheer__pic">' + lili("happy", "Lili ti čestita") + "</div>" +
      '<div class="cheer__t">' + esc(ui.praise) + "</div>" +
      '<div class="cheer__s">Završila si vežbu <b>' + esc(e.name) + "</b>.</div>" +
      '<div class="cheer__star">' +
        icon("star", 30, { fill: "var(--gd)", stroke: "none", w: 0 }) + "+1 zvezdica</div>" +
      '<button class="cta cheer__cta" ' + act("next") + ">" +
        (last ? "ZAVRŠI TRENING" : "SLEDEĆA VEŽBA") + icon("arrow", 28, { stroke: "#fff" }) +
      "</button></div></div>";
  }

  function doneHtml(m) {
    var r = ui.lastReward || { stars: 0, min: mins(planSec(ui.wday)), count: curPlan().length,
      streak: m.streak, sticker: null };
    var conf = "";
    for (var i = 0; i < 18; i++) {
      var c = ["var(--a)", "var(--v)", "var(--gd)", "#fff"][i % 4];
      conf += '<i style="left:' + (4 + i * 5.3).toFixed(1) + "%;background:" + c +
        ";animation-duration:" + (3 + (i % 5) * 0.7).toFixed(1) + "s;animation-delay:" +
        ((i % 7) * 0.35).toFixed(2) + 's"></i>';
    }
    return '<div class="screen done"><div class="confetti" aria-hidden="true">' + conf + "</div>" +
      '<div class="done__pic">' + lili("happy") + "</div>" +
      "<h1>Bravo, " + esc(ime()) + "!</h1>" +
      '<div class="done__sub">Završila si ceo trening — ' + r.count + " " +
        plural(r.count, "vežbu", "vežbe", "vežbi") + ", " + r.min + " minuta.</div>" +
      '<div class="done__stats">' +
        stat("ZVEZDICE", "+" + r.stars, "var(--gd)") +
        stat("SERIJA", dani(r.streak), "var(--v)") +
        (r.sticker ? stat("NOVA NALEPNICA", r.sticker, "var(--a)")
                   : stat("UKUPNO", m.stars + " zvezdica", "var(--a)")) +
      "</div>" +
      '<button class="cta done__cta" ' + act("go", "prize") + ">" +
        (r.sticker ? "POKAŽI NALEPNICU" : "POGLEDAJ NALEPNICE") + "</button></div>";
  }

  function planHtml(m) {
    var ws = weekStart(new Date());
    var days = DAY_SHORT.map(function (w, i) {
      var d = addDays(ws, i);
      return { w: w, d: String(d.getDate()), date: ymd(d), today: ymd(d) === today() };
    });
    var sel = days[ui.day];
    var rec = dayRec(sel.date);
    var plan = planFor(ui.day);
    var doneCount = rec.done.length;
    var p = Math.round(doneCount / plan.length * 100);
    var allDone = doneCount === plan.length;

    return '<div class="screen">' +
      '<h2 class="h2" style="margin-bottom:1.25rem">Plan treninga</h2>' +
      '<div class="daystrip">' + days.map(function (d, i) {
        return '<button class="day' + (ui.day === i ? " on" : "") + (d.today ? " today" : "") + '" ' +
          act("day", i) + '><span class="day__d">' + d.d + '</span><span class="day__w">' + d.w + "</span></button>";
      }).join("") + "</div>" +
      '<div class="plan">' +
        '<div class="plan__main"><div class="plan__title">' + esc(PLAN[ui.day].title) + "</div>" +
          '<div class="planlist scroll">' + plan.map(function (exi, i) {
            var e = EX[exi], on = rec.done.indexOf(i) > -1;
            return '<div class="planitem"><div class="planitem__pic">' +
              exPic(e, true) + "</div>" +
              '<div style="flex:1;min-width:0"><div class="planitem__n">' + esc(e.name) + "</div>" +
              '<div class="planitem__m">' + esc(e.min) + "</div></div>" +
              '<button class="check' + (on ? " on" : "") + '" ' + act("check", sel.date + ":" + i) +
              ' aria-label="' + esc(e.name) + '" aria-pressed="' + on + '">' +
              icon("check", 24, { w: 3 }) + "</button></div>";
          }).join("") + "</div></div>" +
        '<div class="plan__side">' +
          '<div class="msgcard"><div class="msgcard__row"><div class="msgcard__pic">' +
            lili(allDone ? "happy" : "sit") + '</div><div class="msgcard__t">' +
            (allDone ? "Sve za danas — bravo!" : "Sjajno! Ti to možeš!") + "</div></div>" +
            '<div class="msgcard__b">' + (allDone
              ? "Završila si sve vežbe za danas. Odmori se, sutra nastavljamo."
              : "Nastavi tako i bićeš još jača. Ostalo ti je još " + (plan.length - doneCount) +
                " " + plural(plan.length - doneCount, "vežba", "vežbe", "vežbi") + " za ovaj dan.") +
            "</div></div>" +
          '<div class="progcard"><div class="progcard__k">NAPREDAK DANA</div>' +
            '<div class="progcard__v">' + p + '%</div>' +
            '<div class="bar"><div class="bar__fill" style="width:' + p + '%;background:var(--a)"></div></div></div>' +
          '<button class="cta cta--sm" ' + act("startDay", ui.day) + ">" +
            (allDone ? "PONOVI TRENING" : "NASTAVI TRENING") + "</button>" +
        "</div></div></div>";
  }

  /* Mila's own list. Deliberately outside the gymnastics numbers: ticking a
     chore must not move her streak, her stars or her stickers. */
  function todoHtml() {
    var list = st.todos || [];
    var done = list.filter(function (t) { return t.done; }).length;
    var left = list.length - done;
    var p = list.length ? Math.round(done / list.length * 100) : 0;
    var allDone = list.length > 0 && left === 0;

    return '<div class="screen">' +
      '<div class="headrow"><h2 class="h2">Moje obaveze</h2>' +
        '<div style="font:600 1.125rem var(--font-body);opacity:.6">' +
          (list.length
            ? "Urađeno <b style=\"color:var(--a)\">" + done + " od " + list.length + "</b>"
            : "Napiši šta sve treba da uradiš danas") +
        "</div></div>" +
      '<div class="plan">' +
        '<div class="plan__main">' +
          '<div class="todoadd">' +
            '<input class="input todoadd__in" id="novaObaveza" type="text" maxlength="60" ' +
              'placeholder="Npr. domaći iz matematike" value="' + esc(ui.todoDraft) +
              '" autocomplete="off" autocapitalize="sentences" spellcheck="false" ' +
              'enterkeyhint="done" aria-label="Nova obaveza">' +
            '<button class="todoadd__btn" ' + act("todoAdd") + ' aria-label="Dodaj obavezu">' +
              icon("plus", 32, { w: 3 }) + "</button>" +
          "</div>" +
          '<div class="todolist scroll">' +
            (list.length ? list.map(function (t) {
              return '<div class="todoitem' + (t.done ? " on" : "") + '">' +
                '<button class="check' + (t.done ? " on" : "") + '" ' + act("todoToggle", t.id) +
                  ' aria-pressed="' + !!t.done + '" aria-label="' + esc(t.t) + '">' +
                  icon("check", 24, { w: 3 }) + "</button>" +
                '<div class="todoitem__t">' + esc(t.t) + "</div>" +
                '<button class="todoitem__x" ' + act("todoDel", t.id) +
                  ' aria-label="Obriši: ' + esc(t.t) + '">' + icon("close", 22) + "</button>" +
              "</div>";
            }).join("") : '<div class="empty">Lista je prazna. Upiši prvu obavezu gore i pritisni +.</div>') +
          "</div></div>" +
        '<div class="plan__side">' +
          '<div class="msgcard"><div class="msgcard__row"><div class="msgcard__pic">' +
            lili(allDone ? "happy" : "sit") + '</div><div class="msgcard__t">' +
            (allDone ? "Sve si završila!" : list.length ? "Ti to možeš!" : "Šta je danas na redu?") +
            "</div></div>" +
            '<div class="msgcard__b">' +
              (allDone
                ? "Nijedna obaveza nije ostala. Uživaj u ostatku dana!"
                : list.length
                  ? "Ostalo ti je još " + left + " " + plural(left, "obaveza", "obaveze", "obaveza") +
                    ". Idi jednu po jednu."
                  : "Ovde upisuješ svoje obaveze — domaći, sprema sobe, trening. Ja ću ti čuvati spisak.") +
            "</div></div>" +
          '<div class="progcard"><div class="progcard__k">URAĐENO</div>' +
            '<div class="progcard__v">' + p + "%</div>" +
            '<div class="bar"><div class="bar__fill" style="width:' + p +
            '%;background:var(--a)"></div></div></div>' +
          (done ? '<button class="danger" style="align-self:stretch;text-align:center" ' +
            act("todoClear") + ">Skloni završene</button>" : "") +
        "</div></div></div>";
  }

  function progHtml(m) {
    /* 620×540 box: 0% sits at y=460, 100% at y=20. The aspect is kept
       (no preserveAspectRatio="none") so the data points stay circles. */
    var ws = weekStart(new Date());
    var pts = [];
    for (var i = 0; i < 7; i++) {
      var d = addDays(ws, i);
      var rec = st.days[ymd(d)];
      var v = rec && rec.done
        ? Math.round(rec.done.length / planFor(weekday(d)).length * 100) : 0;
      pts.push({
        x: Math.round(96 + i * 83.3), y: Math.round(460 - v * 4.4),
        v: v, today: ymd(d) === today()
      });
    }
    var line = pts.map(function (p) { return p.x + "," + p.y; }).join(" ");
    var grid = [[20, "100%"], [130, "75%"], [240, "50%"], [350, "25%"], [460, "0%"]];

    return '<div class="screen">' +
      '<div class="headrow"><h2 class="h2">Napredak</h2>' +
        '<div class="card" style="padding:0.75rem 1.5rem;border-radius:999px;font:700 1.0625rem var(--font-body);color:var(--v)">Ova nedelja</div></div>' +
      '<div class="kpis">' +
        kpi("TRENINZI", m.weekWorkouts + "/7", "završeno", "var(--v)") +
        kpi("MINUTI", m.weekMin, "ukupno", "var(--a)") +
        (m.bestEx
          ? kpi("NAJBOLJA VEŽBA", m.bestEx.name, m.bestEx.n + "× do sada", "var(--v)", true)
          : kpi("NAJBOLJA VEŽBA", "—", "još nema podataka", "var(--v)", true)) +
        kpi("OCENA", m.ocena, "od 5", "var(--gd)") +
      "</div>" +
      '<div class="progbody">' +
        '<div class="chartcard"><h3>Tvoj napredak</h3><div class="chartcard__plot">' +
          '<svg viewBox="0 0 620 540" width="100%" height="100%" role="img" aria-label="Napredak po danima">' +
            '<g stroke="rgba(123,47,242,.14)" stroke-width="2">' +
              grid.map(function (g) {
                return '<line x1="62" y1="' + g[0] + '" x2="608" y2="' + g[0] + '"/>';
              }).join("") + "</g>" +
            '<g font-family="Figtree" font-size="19" font-weight="700" fill="rgba(59,37,64,.45)">' +
              grid.map(function (g) {
                return '<text x="' + (g[1] === "100%" ? 0 : g[1] === "0%" ? 22 : 10) +
                  '" y="' + (g[0] + 6) + '">' + g[1] + "</text>";
              }).join("") + "</g>" +
            '<polyline points="' + line + '" fill="none" stroke="var(--a)" stroke-width="6" ' +
              'stroke-linecap="round" stroke-linejoin="round"/>' +
            pts.map(function (p) {
              return p.today
                ? '<circle cx="' + p.x + '" cy="' + p.y + '" r="13" fill="var(--gd)"/>'
                : '<circle cx="' + p.x + '" cy="' + p.y + '" r="8" fill="#fff" stroke="var(--a)" stroke-width="5"/>';
            }).join("") +
            '<g font-family="Figtree" font-size="20" font-weight="700" fill="rgba(59,37,64,.55)" text-anchor="middle">' +
              DAY_SHORT.map(function (w, i) {
                return '<text x="' + pts[i].x + '" y="508">' + w + "</text>";
              }).join("") + "</g>" +
          "</svg></div></div>" +
        '<div class="skillcard"><h3>Šta ti najbolje ide</h3>' +
          m.skills.map(function (s) {
            return '<div><div class="skill__row"><span>' + esc(s.name) + '</span><span class="skill__pct">' +
              s.pct + '%</span></div><div class="bar"><div class="bar__fill" style="width:' + s.pct +
              "%;background:" + s.color + '"></div></div></div>';
          }).join("") +
        "</div></div></div>";
  }

  function kpi(k, v, s, color, small) {
    return '<div class="kpi"><div class="kpi__k">' + esc(k) + '</div><div class="kpi__v' +
      (small ? " kpi__v--sm" : "") + '" style="color:' + color + '">' + esc(v) +
      '</div><div class="kpi__s">' + esc(s) + "</div></div>";
  }

  function prizeHtml(m) {
    var list = stickerState(m);
    var got = list.filter(function (s) { return s.on; }).length;
    var next = list.filter(function (s) { return !s.on; })[0];
    return '<div class="screen">' +
      '<div class="headrow" style="align-items:flex-end">' +
        '<h2 class="h2">Nalepnice</h2>' +
        '<div style="font:600 1.125rem var(--font-body);opacity:.6">Skupila si <b style="color:var(--a)">' +
          got + " od " + list.length + "</b>" +
          (next ? " — sledeća je „" + esc(next.name) + "”, " + esc(next.status.replace(/^još /, "još samo ")) + "."
                : " — sve su tvoje!") +
        "</div></div>" +
      '<div class="stickers scroll">' + list.map(function (s) {
        return '<div class="sticker ' + (s.on ? "on" : "off") + '"><div class="sticker__pic">' +
          ILLU.badge(s.key, s.on) + '</div><div class="sticker__n">' + esc(s.name) +
          '</div><div class="sticker__s">' + esc(s.on ? "OSVOJENO" : s.status) + "</div></div>";
      }).join("") + "</div></div>";
  }

  function remHtml() {
    var r = st.rem;
    return '<div class="screen rem">' +
      '<div class="rem__art"><div class="rem__pic">' + ILLU.reminderScene() + "</div>" +
        "<h3>Ne zaboravi na trening!</h3>" +
        "<p>Redovnost donosi rezultate i super osećaj.</p></div>" +
      '<div class="rem__side scroll">' +
        '<div class="panel"><div class="panel__row"><div style="flex:1">' +
          '<div class="panel__t">Podsetnik</div><div class="panel__s">' +
          (r.on ? "Uključen · svakog dana u " + esc(r.time) : "Isključen") + "</div></div>" +
          '<button class="switch' + (r.on ? " on" : "") + '" ' + act("remOn") +
          ' role="switch" aria-checked="' + r.on + '" aria-label="Podsetnik"><span></span></button></div></div>' +
        '<div class="panel"><h3>Vreme podsetnika</h3><div class="times">' +
          ["16:00", "17:00", "18:00", "19:00"].map(function (t) {
            return "<button" + (r.time === t ? ' class="on"' : "") + " " + act("remTime", t) + ">" + t + "</button>";
          }).join("") + "</div></div>" +
        '<div class="panel"><h3>Dani</h3><div class="daycircles">' +
          DAY_LETTER.map(function (l, i) {
            return "<button" + (r.days[i] ? ' class="on"' : "") + " " + act("remDay", i) +
              ' aria-label="' + DAY_SHORT[i] + '" aria-pressed="' + !!r.days[i] + '">' + l + "</button>";
          }).join("") + "</div></div>" +
        '<div class="note"><div class="note__pic">' + lili("sit") + "</div>" +
          "<p>Lili će te pozvati na trening u " + esc(r.time) +
          ". Možeš i da je isključiš kad putujete.</p></div>" +
        '<div class="panel"><h3>Podešavanja</h3>' +
          '<div class="panel__row" style="margin-bottom:1.375rem"><div style="flex:1">' +
            '<div class="panel__t">Zvuk</div><div class="panel__s">' +
            (st.zvuk ? "Odbrojavanje, start vežbe, čestitka i kraj treninga"
                     : "Isključen — vežba teče u tišini") +
            "</div></div>" +
            '<button class="switch' + (st.zvuk ? " on" : "") + '" ' + act("zvuk") +
            ' role="switch" aria-checked="' + !!st.zvuk + '" aria-label="Zvuk"><span></span></button></div>' +
          '<div class="field" style="margin-bottom:1.125rem"><label for="ime">IME</label>' +
            '<input class="input" id="ime" type="text" maxlength="16" value="' + esc(st.ime) +
            '" autocomplete="off" spellcheck="false"></div>' +
          '<div class="field"><label>TEMA</label><div class="themes">' +
            Object.keys(THEMES).map(function (k) {
              var t = THEMES[k];
              return '<button class="theme' + (st.tema === k ? " on" : "") + '" ' + act("tema", k) +
                '><span class="theme__sw"><i style="background:' + t.a + '"></i><i style="background:' +
                t.v + '"></i><i style="background:' + t.gd + '"></i></span>' + t.label + "</button>";
            }).join("") + "</div></div>" +
          '<div style="margin-top:1.25rem;display:flex;align-items:center;gap:1rem">' +
            '<button class="danger" ' + act("reset") + ">Resetuj napredak</button>" +
            '<span style="font:700 0.8125rem var(--font-body);opacity:.35">Verzija ' +
            esc(BUILD) + "</span></div>" +
        "</div></div></div>";
  }

  /* ═══ render ════════════════════════════════════════════════════════ */

  function render() {
    var c = theme();
    var root = document.documentElement.style;
    ["a", "v", "bg", "sf", "lc", "gd", "ink"].forEach(function (k) { root.setProperty("--" + k, c[k]); });
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", c.bg);

    var m = metrics();
    var body;
    switch (ui.screen) {
      case "list": body = listHtml(); break;
      case "detail": body = detailHtml(); break;
      case "work": body = workHtml(); break;
      case "done": body = doneHtml(m); break;
      case "plan": body = planHtml(m); break;
      case "todo": body = todoHtml(); break;
      case "prog": body = progHtml(m); break;
      case "prize": body = prizeHtml(m); break;
      case "rem": body = remHtml(); break;
      default: body = homeHtml(m);
    }
    document.getElementById("app").innerHTML =
      railHtml() + '<main class="stage">' + body + "</main>" +
      (ui.toast ? '<div class="toast" role="status">' + icon("star", 22, { fill: "var(--gd)", stroke: "none", w: 0 }) +
        esc(ui.toast) + "</div>" : "");
  }

  /* Only the timer digits change every second — repaint just those. */
  function tickPaint() {
    var el = document.querySelector(".timer");
    if (!el) { render(); return; }
    var mm = Math.floor(ui.sec / 60), ss = String(ui.sec % 60).padStart(2, "0");
    if (ui.phase === "prep") {
      el.querySelector(".timer__v").textContent = String(ui.sec);
      var p = document.querySelector(".timerctl p b");
      if (p) p.textContent = String(ui.sec);
      return;
    }
    el.querySelector(".timer__v").textContent = ui.sec > 0 ? mm + ":" + ss : "Bravo!";
    el.classList.toggle("done", ui.sec === 0);
  }

  /* ═══ radnje ════════════════════════════════════════════════════════ */

  function go(screen) {
    ui.screen = screen;
    if (screen !== "work") { releaseWake(); stopCheer(); }
    render();
  }

  var PREP_SEC = 5;
  var CHEER_MS = 3400;   /* long enough to enjoy, short enough not to stall */

  /* The exercise is over — Lili congratulates her, then the next exercise
     arms itself (still waiting on KRENI, nothing starts on its own). */
  function beginCheer() {
    if (ui.phase === "cheer") return;
    ui.phase = "cheer";
    ui.run = false;
    ui.praise = PRAISE[Math.floor(Math.random() * PRAISE.length)];
    SOUND.cheer();
    render();
    stopCheer();
    cheerTimer = setTimeout(function () { cheerTimer = null; nextEx(); }, CHEER_MS);
  }
  function stopCheer() {
    if (cheerTimer) { clearTimeout(cheerTimer); cheerTimer = null; }
  }

  /* Nothing counts down until she says so: each exercise opens in "ready",
     KRENI starts a 5s "prep" count-in, then "go" runs the exercise timer. */
  function armExercise(i) {
    ui.wi = i;
    ui.phase = "ready";
    ui.sec = EX[curPlan()[i]].sec;
    ui.run = true;
  }

  function beginPrep() {
    ui.phase = "prep";
    ui.sec = PREP_SEC;
    ui.run = true;
    render();
  }

  function startWorkout(day, fromIndex) {
    ui.wday = day === undefined || day === null ? weekday(new Date()) : day;
    ui.screen = "work";
    armExercise(fromIndex || 0);
    requestWake();
    render();
  }

  function curPlan() { return planFor(ui.wday); }

  function logExercise(i, seconds) {
    var r = dayRec(today());
    var id = EX[i].id;
    r.ex[id] = (r.ex[id] || 0) + 1;
    r.sec += seconds;
    st.stars += 1;
    /* only credit the plan tick when training today's own plan */
    if (ui.wday === weekday(new Date())) {
      var pi = curPlan().indexOf(i);
      if (pi > -1 && r.done.indexOf(pi) === -1) r.done.push(pi);
    }
  }

  function finishWorkout() {
    var before = stickerState(metrics());
    var r = dayRec(today());
    r.workouts += 1;
    st.stars += 5;

    var m = metrics();
    st.bestStreak = Math.max(st.bestStreak || 0, m.streak);
    var after = stickerState(m);
    var fresh = after.filter(function (s, i) { return s.on && !before[i].on; });

    ui.lastReward = {
      stars: curPlan().length + 5,
      count: curPlan().length,
      min: mins(planSec(ui.wday)),
      streak: m.streak,
      sticker: fresh.length ? fresh[0].name : null
    };
    save();
    ui.screen = "done";
    releaseWake();
    SOUND.finish();
    render();
  }

  function nextEx() {
    stopCheer();
    var plan = curPlan();
    logExercise(plan[ui.wi], EX[plan[ui.wi]].sec);
    if (ui.wi === plan.length - 1) { finishWorkout(); return; }
    armExercise(ui.wi + 1);
    save();
    render();
  }

  var ACTIONS = {
    go: function (v) { go(v); },
    start: function () { startWorkout(null, 0); },
    startDay: function (v) { startWorkout(+v, 0); },
    startFrom: function () {
      /* jump straight to this exercise inside whichever day contains it */
      var today0 = weekday(new Date());
      for (var d = 0; d < 7; d++) {
        var day = (today0 + d) % 7, at = planFor(day).indexOf(ui.sel);
        if (at > -1) { startWorkout(day, at); return; }
      }
      startWorkout(null, 0);
    },
    go1: beginPrep,
    quit: function () { ui.run = false; go("home"); },
    run: function () { ui.run = !ui.run; render(); },
    /* Every exercise ends with a congratulation — whether the timer ran out or
       she finished early. A second tap skips straight on. */
    next: function () { if (ui.phase === "cheer") nextEx(); else beginCheer(); },
    open: function (v) { ui.sel = +v; go("detail"); },
    filter: function (v) { ui.filter = v; render(); },
    fav: function () {
      var id = EX[ui.sel].id, i = st.favs.indexOf(id);
      if (i > -1) st.favs.splice(i, 1); else st.favs.push(id);
      save(); render();
    },
    day: function (v) { ui.day = +v; render(); },
    check: function (v) {
      var parts = v.split(":"), date = parts[0], i = +parts[1];
      var r = dayRec(date), at = r.done.indexOf(i);
      var e = EX[planFor(weekday(fromYmd(date)))[i]];
      if (at > -1) {
        r.done.splice(at, 1);
        if (r.ex[e.id]) r.ex[e.id] -= 1;
        r.sec = Math.max(0, r.sec - e.sec);
        st.stars = Math.max(0, st.stars - 1);
      } else {
        var before = stickerState(metrics());
        r.done.push(i);
        r.ex[e.id] = (r.ex[e.id] || 0) + 1;
        r.sec += e.sec;
        st.stars += 1;
        var m = metrics();
        st.bestStreak = Math.max(st.bestStreak || 0, m.streak);
        var fresh = stickerState(m).filter(function (s, k) { return s.on && !before[k].on; });
        if (fresh.length) { save(); toast("Nova nalepnica: " + fresh[0].name + "!"); return; }
      }
      save(); render();
    },
    todoAdd: function () {
      var el = document.getElementById("novaObaveza");
      var text = ((el ? el.value : ui.todoDraft) || "").trim();
      if (!text) { if (el) el.focus(); return; }
      st.todos.push({ id: "t" + Date.now() + "-" + st.todos.length, t: text.slice(0, 60), done: 0 });
      ui.todoDraft = "";
      save();
      render();
      /* still inside her tap, so the iPad keyboard stays up for the next one */
      var again = document.getElementById("novaObaveza");
      if (again) again.focus();
    },
    todoToggle: function (v) {
      st.todos.forEach(function (t) { if (t.id === v) t.done = t.done ? 0 : 1; });
      save(); render();
    },
    todoDel: function (v) {
      st.todos = st.todos.filter(function (t) { return t.id !== v; });
      save(); render();
    },
    todoClear: function () {
      st.todos = st.todos.filter(function (t) { return !t.done; });
      save(); render();
    },
    zvuk: function () {
      st.zvuk = !st.zvuk;
      save();
      if (st.zvuk) { unlockAudio(); SOUND.go(); }
      render();
    },
    remOn: function () {
      st.rem.on = !st.rem.on;
      if (st.rem.on) askNotify();
      save(); render();
    },
    remTime: function (v) { st.rem.time = v; save(); render(); },
    remDay: function (v) { st.rem.days[v] = st.rem.days[v] ? 0 : 1; save(); render(); },
    tema: function (v) { st.tema = v; save(); render(); },
    reset: function () {
      if (!confirm("Obrisati sav napredak — zvezdice, nalepnice i istoriju?")) return;
      var keep = { ime: st.ime, tema: st.tema, rem: st.rem };
      st = Object.assign(defaults(), keep);
      save();
      ui.screen = "home";
      render();
    }
  };

  document.addEventListener("click", function (ev) {
    unlockAudio();
    var el = ev.target.closest ? ev.target.closest("[data-act]") : null;
    if (!el) return;
    var fn = ACTIONS[el.getAttribute("data-act")];
    if (fn) { ev.preventDefault(); fn(el.getAttribute("data-arg")); }
  });

  /* Both text fields update state without re-rendering — a full repaint would
     take the input out from under her finger and lose the keyboard. */
  document.addEventListener("input", function (ev) {
    if (ev.target.id === "ime") {
      st.ime = ev.target.value;
      save();
      var n = document.querySelector(".rail__name"), a = document.querySelector(".rail__avatar");
      if (n) n.textContent = ime();
      if (a) a.textContent = ime().charAt(0).toUpperCase();
    } else if (ev.target.id === "novaObaveza") {
      ui.todoDraft = ev.target.value;
    }
  });

  document.addEventListener("keydown", function (ev) {
    if (ev.target.id === "novaObaveza" && ev.key === "Enter") {
      ev.preventDefault();
      ACTIONS.todoAdd();
    }
  });

  /* ═══ tajmer, ekran, podsetnik ══════════════════════════════════════ */

  function requestWake() {
    if (!navigator.wakeLock || wakeLock) return;
    navigator.wakeLock.request("screen").then(function (l) { wakeLock = l; }).catch(function () {});
  }
  function releaseWake() {
    if (wakeLock) { try { wakeLock.release(); } catch (e) {} wakeLock = null; }
  }
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible" && ui.screen === "work") requestWake();
  });

  function askNotify() {
    if (!("Notification" in window) || Notification.permission !== "default") return;
    Notification.requestPermission().catch(function () {});
  }

  function checkReminder() {
    var r = st.rem;
    if (!r.on) return;
    var now = new Date();
    var stamp = today() + " " + r.time;
    if (r.lastFired === stamp) return;
    if (!r.days[weekday(now)]) return;
    var hm = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");
    if (hm !== r.time) return;
    r.lastFired = stamp;
    save();
    var msg = "Vreme je za trening! Lili te čeka.";
    if ("Notification" in window && Notification.permission === "granted") {
      try { new Notification("Gimnastika za " + ime(), { body: msg, icon: "icons/icon-180.png" }); } catch (e) {}
    }
    toast(msg);
  }

  function tick() {
    if (ui.screen === "work" && ui.run && (ui.phase === "prep" || ui.phase === "go") && ui.sec > 0) {
      ui.sec -= 1;
      if (ui.phase === "prep") {
        if (ui.sec === 0) {
          /* count-in finished — roll straight into the exercise */
          ui.phase = "go";
          ui.sec = EX[curPlan()[ui.wi]].sec;
          SOUND.go();
          render();
        } else {
          tickPaint();
          SOUND.tick(ui.sec === 1);
        }
      } else if (ui.sec === 0) {
        beginCheer();
      } else {
        tickPaint();
      }
    }
    checkReminder();
  }

  /* ═══ start ═════════════════════════════════════════════════════════ */

  document.addEventListener("gesturestart", function (e) { e.preventDefault(); });
  document.addEventListener("dblclick", function (e) { e.preventDefault(); });

  load();
  ui.wday = weekday(new Date());
  ui.day = ui.wday;
  ui.sec = EX[curPlan()[0]].sec;
  render();
  timer = setInterval(tick, 1000);

  /* Keeping an installed iPad up to date.

     `updateViaCache: "none"` stops Safari serving sw.js out of its own HTTP
     cache, which is what made a deploy take ten minutes to be noticed. Then we
     ask for an update check on launch and every time she comes back to the app,
     and reload once when a new worker actually takes over — but never in the
     middle of a workout, where a reload would throw away where she is. */
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", function () {
      var hadWorker = !!navigator.serviceWorker.controller;
      var reloaded = false;

      navigator.serviceWorker.addEventListener("controllerchange", function () {
        if (!hadWorker || reloaded || ui.screen === "work") return;
        reloaded = true;
        location.reload();
      });

      navigator.serviceWorker.register("sw.js", { updateViaCache: "none" })
        .then(function (reg) {
          reg.update();
          document.addEventListener("visibilitychange", function () {
            if (document.visibilityState === "visible") reg.update();
          });
        })
        .catch(function () {});
    });
  }

  if (memoryOnly) {
    setTimeout(function () {
      toast("Napredak se neće sačuvati — otvori aplikaciju preko adrese (http), ne kao fajl.");
    }, 800);
  }
})();
