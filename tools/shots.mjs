/* Headless screenshot pass over every screen, driven through the Chrome
   DevTools protocol. Used to eyeball the build; not part of the app.
     node tools/shots.mjs [baseUrl] [outDir] [width] [height]
   Chrome must already be running with --remote-debugging-port=9222. */

const BASE = process.argv[2] || "http://127.0.0.1:8123/";
const OUT = process.argv[3] || "/tmp/shots";
const W = +(process.argv[4] || 1366);
const H = +(process.argv[5] || 1024);

import { writeFileSync, mkdirSync } from "node:fs";
mkdirSync(OUT, { recursive: true });

const targets = await (await fetch("http://127.0.0.1:9222/json/list")).json();
let page = targets.find((t) => t.type === "page");
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
const evaluate = async (expr) => {
  const r = await send("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.text + " :: " + JSON.stringify(r.exceptionDetails.exception?.description || ""));
  return r.result.value;
};

await send("Page.enable");
await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width: W, height: H, deviceScaleFactor: 2, mobile: false
});

const errors = [];
ws.addEventListener("message", (m) => {
  const msg = JSON.parse(m.data);
  if (msg.method === "Runtime.exceptionThrown") {
    errors.push(msg.params.exceptionDetails.text + " " + (msg.params.exceptionDetails.exception?.description || ""));
  }
});

async function goto(url) {
  await send("Page.navigate", { url });
  await sleep(1400);
}

async function shot(name) {
  const { data } = await send("Page.captureScreenshot", { format: "png" });
  writeFileSync(`${OUT}/${name}.png`, Buffer.from(data, "base64"));
  console.log("shot", name);
}

const click = async (sel) => {
  const ok = await evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(sel)});if(!e)return false;e.click();return true;})()`);
  if (!ok) throw new Error("no element: " + sel);
  await sleep(420);
};

await goto(BASE);
/* the app's offline cache is cache-first, so drop it before every pass */
await evaluate("(async()=>{const rs=await navigator.serviceWorker.getRegistrations();await Promise.all(rs.map(r=>r.unregister()));const ks=await caches.keys();await Promise.all(ks.map(k=>caches.delete(k)));localStorage.clear();})()");
await goto(BASE + "?nocache=" + Date.now());

await shot("01-home");
await click('[data-act="go"][data-arg="list"]');
await shot("02-list");
await click('[data-act="filter"][data-arg="Ravnoteža"]');
await shot("03-list-filter");
await click('[data-act="filter"][data-arg="Sve"]');
await click('[data-act="open"][data-arg="1"]');
await shot("04-detail");
await click('[data-act="go"][data-arg="plan"]');
await shot("05-plan");

/* her own to-do list: type two items, tick one */
await click('[data-act="go"][data-arg="todo"]');
await shot("05b-todo-empty");
const addTodo = async (text) => {
  await evaluate(`(()=>{const i=document.getElementById("novaObaveza");i.value=${JSON.stringify(text)};i.dispatchEvent(new Event("input",{bubbles:true}));})()`);
  await click('[data-act="todoAdd"]');
};
await addTodo("Domaći iz matematike");
await addTodo("Spremi sobu");
await addTodo("Spakuj torbu za trening");
await evaluate('document.querySelector(\'[data-act="todoToggle"]\').click()');
await sleep(420);
await shot("05c-todo");

/* boje: dve obaveze više, da se u jednom snimku vide i jednobojne i šarene */
await addTodo("Nahrani mačku");
await addTodo("Vežbaj špagu");
const todoIds = await evaluate(
  '[...document.querySelectorAll(\'[data-act="todoPal"]\')].map(e=>e.getAttribute("data-arg"))'
);
await click(`[data-act="todoPal"][data-arg="${todoIds[1]}"]`);
await shot("05d-todo-paleta");
const paint = async (i, k) => {
  const sw = `[data-act="todoPaint"][data-arg="${todoIds[i]}|${k}"]`;
  /* samo jedna paleta stoji otvorena — otvori je ako već nije */
  if (!(await evaluate(`!!document.querySelector(${JSON.stringify(sw)})`))) {
    await click(`[data-act="todoPal"][data-arg="${todoIds[i]}"]`);
  }
  await click(sw);
};
await paint(1, "zele");
await paint(0, "plav");
await paint(2, "duga");
await paint(3, "jedn");
await paint(4, "zala");
await shot("05e-todo-boje");

/* Kuvanje: obrok → ostava → jela → recept. Stoji ovde namerno — pre bloka sa
   treningom, koji menja zvezdice i nalepnice od kojih zavise snimci 11-13. */
await click('[data-act="go"][data-arg="kuh"]');
await shot("05f-kuvanje-obrok");
await click('[data-act="obrok"][data-arg="ruc"]');
await shot("05g-kuvanje-ostava-prazna");

for (const id of ["testenina", "paradajz", "luk", "kackavalj", "jaja", "krompir"]) {
  await click(`[data-act="sastToggle"][data-arg="${id}"]`);
}
await shot("05h-kuvanje-ostava");

/* pretraga filtrira mrežu zakrpom DOM-a, bez re-rendera — dokaz da radi */
const traziSastojak = async (v) => {
  await evaluate(`(()=>{const i=document.getElementById("pretragaSastojka");i.value=${JSON.stringify(v)};i.dispatchEvent(new Event("input",{bubbles:true}));})()`);
  await sleep(320);
};
await traziSastojak("pap");
await shot("05i-kuvanje-pretraga");
await traziSastojak("");     /* mora da se obriše, inače `sast` ostane filtriran */

await click('[data-act="go"][data-arg="jela"]');
await shot("05j-kuvanje-jela");
const prvoJelo = await evaluate(
  'document.querySelector(\'[data-act="jelo"]\').getAttribute("data-arg")'
);
await click(`[data-act="jelo"][data-arg="${prvoJelo}"]`);
await shot("05k-kuvanje-recept");

/* Prazna ostava svejedno mora da da kartice — ćorsokak je za dete kraj puta. */
await click('[data-act="go"][data-arg="kuh"]');
await click('[data-act="obrok"][data-arg="uzi"]');
await click('[data-act="sastClear"]');
await click('[data-act="go"][data-arg="jela"]');
await shot("05l-kuvanje-sve");

await click('[data-act="go"][data-arg="prog"]');
await shot("06-prog");
await click('[data-act="go"][data-arg="prize"]');
await shot("07-prize");
await click('[data-act="go"][data-arg="rem"]');
await shot("08-rem");
await click('[data-act="go"][data-arg="home"]');
await click('[data-act="start"]');
await shot("09-work-ready");          /* waiting on KRENI, nothing counting */
await click('[data-act="go1"]');
await sleep(900);
await shot("09b-work-prep");          /* 5s count-in */
await sleep(4600);
await shot("09c-work-go");            /* exercise running */
await click('[data-act="next"]');
await sleep(500);
await shot("09d-cheer");              /* Lili congratulates her */

/* Plan length varies by weekday, and every exercise now takes two taps —
   one to end it (cheer), one to move on — so leave plenty of headroom. */
for (let i = 0; i < 30; i++) {
  const more = await evaluate('!!document.querySelector(\'[data-act="next"]\')');
  if (!more) break;
  await click('[data-act="next"]');
}
await sleep(600);
await shot("10-done");
await click('[data-act="go"][data-arg="prize"]');
await shot("11-prize-earned");
await click('[data-act="go"][data-arg="home"]');
await shot("12-home-after");
await click('[data-act="go"][data-arg="prog"]');
await shot("13-prog-after");

/* the illustration contact sheet lives in tools/poses.mjs */

if (errors.length) {
  console.log("\nCONSOLE ERRORS:");
  errors.forEach((e) => console.log(" -", e));
} else {
  console.log("\nno console errors");
}
ws.close();
process.exit(0);
