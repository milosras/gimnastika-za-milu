/* Contact sheet of every dish, every vessel and every food layer, for eyeballing
   the drawings in www/food.js. Use it whenever you touch that file or add a
   dish: forty-odd hand-composed pictures cannot be checked by tapping through
   the app, and they can pass every automated check while looking wrong — the
   first pass here had food sunk in a dark tray and pancakes fused into one blob.
     node tools/food.mjs <outfile.png> */
const OUT = process.argv[2] || "/tmp/food.png";
import { writeFileSync } from "node:fs";

const targets = await (await fetch("http://127.0.0.1:9222/json/list")).json();
const page = targets.find((t) => t.type === "page");
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0;
const pending = new Map();
ws.onmessage = (m) => {
  const msg = JSON.parse(m.data);
  if (msg.id && pending.has(msg.id)) {
    const p = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? p.rej(new Error(JSON.stringify(msg.error))) : p.res(msg.result);
  }
};
const send = (method, params = {}) =>
  new Promise((res, rej) => { const n = ++id; pending.set(n, { res, rej }); ws.send(JSON.stringify({ id: n, method, params })); });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", { width: 1500, height: 900, deviceScaleFactor: 2, mobile: false });
await send("Page.navigate", { url: "http://127.0.0.1:8123/" });
await sleep(900);
/* the app's offline cache is cache-first, so drop it before every pass */
await send("Runtime.evaluate", {
  expression: "(async()=>{const rs=await navigator.serviceWorker.getRegistrations();await Promise.all(rs.map(r=>r.unregister()));const ks=await caches.keys();await Promise.all(ks.map(k=>caches.delete(k)));})()",
  awaitPromise: true
});
await send("Page.navigate", { url: "http://127.0.0.1:8123/?nocache=" + Date.now() });
await sleep(1300);

const build = `
(() => {
  const cell = (svg, lab, w) =>
    '<figure style="margin:0;width:' + w + 'px;text-align:center">' +
    '<div style="background:#ffe3f1;border-radius:14px;overflow:hidden;display:flex">' + svg + '</div>' +
    '<figcaption style="margin-top:3px;font:600 11px Figtree;color:#3b2540">' + lab + '</figcaption></figure>';
  const sec = (title, body) =>
    '<h2 style="font:800 16px Baloo 2,Figtree;color:#7b2ff2;margin:18px 0 6px">' + title + '</h2>' +
    '<section style="display:flex;flex-wrap:wrap;gap:8px">' + body + '</section>';

  /* Layers are shown on a plate in one colour so their shape is what you judge,
     not the palette. Vessels are shown empty for the same reason. */
  document.body.innerHTML =
    '<div style="background:#fff0f7;padding:16px;font-family:Figtree">' +
    sec('Posude (prazne)',
      Object.keys(FOOD.vessels).map(v => cell(FOOD.dish({ v, t: [] }), v, 150)).join('')) +
    sec('Slojevi (na tanjiru)',
      Object.keys(FOOD.tops).map(t => cell(FOOD.dish({ v: 'tanjir', t: [t + ':paradajz'] }), t, 150)).join('')) +
    sec('Jela (' + KUVANJE.JELA.length + ')',
      KUVANJE.JELA.map(r => cell(FOOD.dish(r.art, { label: r.n }), r.n, 150)).join('')) +
    sec('Sastojci (' + KUVANJE.SASTOJCI.length + ')',
      KUVANJE.SASTOJCI.map(s => cell(FOOD.namirnica(s.id, { label: s.n }), s.n, 64)).join('')) +
    '</div>';
  document.body.style.overflow = 'auto'; document.body.style.height = 'auto';
  document.documentElement.style.overflow = 'auto'; document.documentElement.style.height = 'auto';
  return KUVANJE.JELA.length;
})()`;
const r = await send("Runtime.evaluate", { expression: build, returnByValue: true });
if (r.exceptionDetails) throw new Error(r.exceptionDetails.text);
await sleep(400);

const { data } = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true });
writeFileSync(OUT, Buffer.from(data, "base64"));
console.log("wrote", OUT, "—", r.result.value, "dishes");
ws.close();
process.exit(0);
