/* The one thing in this project worth a test: a release must never cost Mila
   her progress. Each case seeds localStorage the way an older build left it,
   loads the app for real in Chrome, and checks what came out the other side.

     node tools/test-storage.mjs [baseUrl]

   Chrome must already be running with --remote-debugging-port=9222. */

const BASE = process.argv[2] || "http://127.0.0.1:8123/";

const targets = await (await fetch("http://127.0.0.1:9222/json/list")).json();
const page = targets.find((t) => t.type === "page");
if (!page) throw new Error("no page target");
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));

let id = 0;
const pending = new Map();
ws.onmessage = (m) => {
  const msg = JSON.parse(m.data);
  if (msg.id && pending.has(msg.id)) {
    const { res, rej } = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? rej(new Error(JSON.stringify(msg.error))) : res(msg.result);
  }
};
const send = (method, params = {}) =>
  new Promise((res, rej) => {
    const n = ++id;
    pending.set(n, { res, rej });
    ws.send(JSON.stringify({ id: n, method, params }));
  });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const ev = async (expr) => {
  const r = await send("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.text);
  return r.result.value;
};

await send("Page.enable");
await send("Runtime.enable");

/* Monday, so the plan behind the seeded positions is PLAN[0]:
   zvezdice · macka · psic · leptiric · pretklon · dete */
const MONDAY = "2026-07-27";
const MONDAY_IDS = ["zvezdice", "macka", "psic"];
/* a date in the v1 era; its exercises are indices into that build's own list */
const OLD_DAY = "2026-07-20";

const V2 = {
  v: 2, ime: "Mila", tema: "lavanda", stars: 7, favs: ["mostic"], bestStreak: 3,
  days: { [MONDAY]: { sec: 240, workouts: 1, ex: { zvezdice: 1, macka: 1, psic: 1 }, done: [0, 1, 2] } },
  rem: { on: true, time: "17:00", days: { 0: 1, 1: 1, 2: 1, 3: 1, 4: 1, 5: 0, 6: 0 }, lastFired: "" },
};
const V1 = {
  v: 1, ime: "Mila", tema: "roze", stars: 12, favs: [1], bestStreak: 2,
  days: { [OLD_DAY]: { sec: 300, workouts: 1, ex: { 3: 1, 0: 1 }, done: [0, 1] } },
  rem: { on: true, time: "18:00", days: {}, lastFired: "" },
};

/* Wait for the app to have actually drawn itself, rather than guessing with a
   fixed sleep — the guess is what made this flaky. */
async function ready(tries = 40) {
  for (let i = 0; i < tries; i++) {
    try {
      if (await ev(`document.querySelectorAll(".navbtn").length > 0`)) return;
    } catch (e) { /* mid-navigation, try again */ }
    await sleep(150);
  }
  throw new Error("the app never rendered");
}

/* Load the app with exactly these keys in storage, and hand back what it wrote. */
async function run(seed) {
  await send("Page.navigate", { url: BASE });
  await ready();
  await ev(`(async()=>{
    const rs = await navigator.serviceWorker.getRegistrations();
    await Promise.all(rs.map(r => r.unregister()));
    const ks = await caches.keys();
    await Promise.all(ks.map(k => caches.delete(k)));
    localStorage.clear();
    const seed = ${JSON.stringify(seed)};
    Object.keys(seed).forEach(k => localStorage.setItem(k, JSON.stringify(seed[k])));
  })()`);
  await send("Page.navigate", { url: BASE + "?t=" + Date.now() });
  await ready();
  await sleep(250);          /* load() saves the migrated shape on the way in */
  return {
    keys: await ev("Object.keys(localStorage).sort()"),
    saved: await ev(`JSON.parse(localStorage.getItem("mila-gimnastika") || "null")`),
    backupV2: await ev(`localStorage.getItem("mila-gimnastika-backup-v2")`),
    legacyV2: await ev(`localStorage.getItem("mila-gimnastika-v2")`),
    /* what she actually sees: the star count on Početna */
    starsOnScreen: await ev(`(()=>{const s=[...document.querySelectorAll(".stat")].find(x=>x.textContent.includes("ZVEZDICE"));return s?s.querySelector(".stat__v").textContent:"";})()`),
  };
}

let failed = 0;
function check(name, ok, detail) {
  console.log((ok ? "  ok   " : "  FAIL ") + name + (ok || detail === undefined ? "" : "  → " + JSON.stringify(detail)));
  if (!ok) failed++;
}
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
/* key order is not part of the meaning of a counts object */
const sameSet = (a, b) =>
  same(Object.entries(a || {}).sort(), Object.entries(b || {}).sort());

/* ── a v2 save, the shape currently on her iPad ─────────────────────── */
console.log("\nv2 payload under the old key");
let r = await run({ "mila-gimnastika-v2": V2 });
check("migrates to v3", r.saved && r.saved.v === 3, r.saved && r.saved.v);
check("plan ticks become exercise ids", same(r.saved.days[MONDAY].done, MONDAY_IDS), r.saved.days[MONDAY].done);
check("seconds survive", r.saved.days[MONDAY].sec === 240, r.saved.days[MONDAY].sec);
check("exercise counts survive", sameSet(r.saved.days[MONDAY].ex, V2.days[MONDAY].ex), r.saved.days[MONDAY].ex);
check("stars survive", r.saved.stars === 7, r.saved.stars);
check("stars are on screen", r.starsOnScreen === "7", r.starsOnScreen);
check("name, theme, streak and favourites survive",
  r.saved.ime === "Mila" && r.saved.tema === "lavanda" && r.saved.bestStreak === 3 && same(r.saved.favs, ["mostic"]),
  [r.saved.ime, r.saved.tema, r.saved.bestStreak, r.saved.favs]);
check("reminder settings survive", r.saved.rem.time === "17:00", r.saved.rem.time);
check("fields the old build never had are filled in",
  Array.isArray(r.saved.todos) && r.saved.zvuk === true && Array.isArray(r.saved.ostava),
  [r.saved.todos, r.saved.zvuk, r.saved.ostava]);
check("the pre-migration payload is snapshotted", r.backupV2 === JSON.stringify(V2), r.backupV2);
check("the old key is left alone as a backup", r.legacyV2 === JSON.stringify(V2), !!r.legacyV2);

/* ── the v1 save that an earlier release orphaned ───────────────────── */
console.log("\nv1 payload only");
r = await run({ "mila-gimnastika-v1": V1 });
check("migrates all the way to v3", r.saved && r.saved.v === 3, r.saved && r.saved.v);
check("indices become ids", sameSet(r.saved.days[OLD_DAY].ex, { arabeska: 1, leptiric: 1 }), r.saved.days[OLD_DAY].ex);
check("ticks become ids", same(r.saved.days[OLD_DAY].done, ["arabeska", "leptiric"]), r.saved.days[OLD_DAY].done);
check("favourites become ids", same(r.saved.favs, ["mostic"]), r.saved.favs);
check("stars survive", r.saved.stars === 12, r.saved.stars);

/* ── both keys present: v2 is the base, v1 is folded back in ────────── */
console.log("\nv2 and the orphaned v1 together");
r = await run({ "mila-gimnastika-v2": V2, "mila-gimnastika-v1": V1 });
check("keeps the current record", same(r.saved.days[MONDAY].done, MONDAY_IDS), r.saved.days[MONDAY].done);
check("recovers the orphaned day", !!r.saved.days[OLD_DAY], Object.keys(r.saved.days));
check("adds the stars back", r.saved.stars === 19, r.saved.stars);
check("keeps the better streak", r.saved.bestStreak === 3, r.saved.bestStreak);
check("only recovers once", r.saved.recoveredV1 === 1, r.saved.recoveredV1);

/* ── a payload from a build newer than this one ─────────────────────── */
console.log("\npayload from a newer build");
r = await run({ "mila-gimnastika": { v: 99, ime: "Mila", stars: 42, days: {}, nesto: "novo" } });
check("is not wiped", r.saved && r.saved.stars === 42, r.saved && r.saved.stars);
check("keeps its own version", r.saved.v === 99, r.saved.v);
check("keeps fields this build knows nothing about", r.saved.nesto === "novo", r.saved.nesto);

/* ── nothing at all ─────────────────────────────────────────────────── */
console.log("\nfirst ever launch");
r = await run({});
check("starts empty without crashing", r.starsOnScreen === "0", r.starsOnScreen);

/* ── restoring from a saved copy, the answer to a replaced iPad ─────── */
console.log("\nimporting a saved copy onto an empty app");
/* the import asks first — accept the confirm as she would */
ws.addEventListener("message", (m) => {
  const msg = JSON.parse(m.data);
  if (msg.method === "Page.javascriptDialogOpening") {
    send("Page.handleJavaScriptDialog", { accept: true }).catch(() => {});
  }
});
await run({});
await ev(`(()=>{const b=[...document.querySelectorAll(".navbtn")].find(x=>x.textContent.includes("Podsetnik"));b.click();})()`);
await sleep(400);
const copy = { ...V2, v: 3, days: { [MONDAY]: { sec: 240, workouts: 1, ex: { zvezdice: 1 }, done: ["zvezdice"] } } };
await ev(`(()=>{
  const dt = new DataTransfer();
  dt.items.add(new File([${JSON.stringify(JSON.stringify(copy))}], "kopija.json", { type: "application/json" }));
  const i = document.getElementById("uvoz");
  i.files = dt.files;
  i.dispatchEvent(new Event("change", { bubbles: true }));
})()`);
await sleep(900);
const after = await ev(`JSON.parse(localStorage.getItem("mila-gimnastika"))`);
check("the copy is adopted", after && after.stars === 7, after && after.stars);
check("its history comes with it", !!(after.days && after.days[MONDAY]), after && Object.keys(after.days || {}));
check("what it replaced is snapshotted first",
  (await ev(`!!localStorage.getItem("mila-gimnastika-backup-pre-import")`)) === true);
check("a junk file is refused",
  await ev(`(()=>{
    const dt = new DataTransfer();
    dt.items.add(new File(["not json at all"], "x.json", { type: "application/json" }));
    const i = document.getElementById("uvoz");
    i.files = dt.files;
    i.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  })()`) === true);
await sleep(600);
const survived = await ev(`JSON.parse(localStorage.getItem("mila-gimnastika")).stars`);
check("and leaves the real data alone", survived === 7, survived);

/* ── a payload whose ostava is the wrong shape ──────────────────────────
   `adoptCopy()` accepts any JSON a file picker hands it, so normalize() has to
   survive a string where an array belongs — and drop junk entries without
   dropping ids it simply does not recognise yet. */
console.log("\nostava of the wrong shape");
r = await run({ "mila-gimnastika": { v: 3, stars: 4, ostava: "banana" } });
check("a string ostava becomes an empty array", same(r.saved.ostava, []), r.saved.ostava);
check("and the rest of that payload still survives", r.saved.stars === 4, r.saved.stars);
r = await run({
  "mila-gimnastika": { v: 3, stars: 4, ostava: ["jaja", 7, null, "izmisljotina"] }
});
check("junk entries are dropped", same(r.saved.ostava, ["jaja", "izmisljotina"]), r.saved.ostava);

console.log(failed ? `\n${failed} FAILED` : "\nall storage checks passed");
ws.close();
process.exit(failed ? 1 : 0);
