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
await click('[data-act="go"][data-arg="prog"]');
await shot("06-prog");
await click('[data-act="go"][data-arg="prize"]');
await shot("07-prize");
await click('[data-act="go"][data-arg="rem"]');
await shot("08-rem");
await click('[data-act="go"][data-arg="home"]');
await click('[data-act="start"]');
await shot("09-work");
for (let i = 0; i < 6; i++) await click('[data-act="next"]');
await sleep(500);
await shot("10-done");
await click('[data-act="go"][data-arg="prize"]');
await shot("11-prize-earned");
await click('[data-act="go"][data-arg="home"]');
await shot("12-home-after");
await click('[data-act="go"][data-arg="prog"]');
await shot("13-prog-after");

/* every pose, on one sheet */
await evaluate(`document.body.innerHTML='<div id=p style="display:grid;grid-template-columns:repeat(5,1fr);background:#f3e8ff">'+Object.keys(ILLU.poses).map(k=>'<div style="aspect-ratio:1">'+ILLU.gymnast(k)+'<div style="text-align:center;font:700 14px Figtree">'+k+'</div></div>').join('')+'<div style="aspect-ratio:1">'+ILLU.maca('idle')+'</div><div style="aspect-ratio:1">'+ILLU.maca('cheer')+'</div><div style="grid-column:span 2">'+ILLU.reminderScene()+'</div>'+[ 'first','streak3','bridge','balance','ten','split','candle','week','fifty','gold'].map(k=>'<div style="aspect-ratio:1">'+ILLU.badge(k,true)+'</div>').join('')+'</div>';document.body.style.overflow='auto';1`);
await sleep(400);
await shot("20-poses");

if (errors.length) {
  console.log("\nCONSOLE ERRORS:");
  errors.forEach((e) => console.log(" -", e));
} else {
  console.log("\nno console errors");
}
ws.close();
process.exit(0);
