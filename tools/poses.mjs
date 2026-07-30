/* Contact sheet of every illustration, for eyeballing pose work.
     node tools/poses.mjs <outfile.png> */
const OUT = process.argv[2] || "/tmp/poses.png";
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
await send("Emulation.setDeviceMetricsOverride", { width: 1250, height: 900, deviceScaleFactor: 2, mobile: false });
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
document.body.innerHTML = '<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:4px;background:#f3e8ff;padding:8px">' +
  Object.keys(ILLU.poses).map(k =>
    '<div style="background:#fff;border-radius:16px"><div style="height:210px">' + ILLU.gymnast(k) +
    '</div><div style="text-align:center;font:700 15px Figtree;padding-bottom:6px">' + k + '</div></div>').join('') +
  ['idle','cheer'].map(v => '<div style="background:#fff;border-radius:16px"><div style="height:210px">' + ILLU.maca(v) +
    '</div><div style="text-align:center;font:700 15px Figtree;padding-bottom:6px">maca ' + v + '</div></div>').join('') +
  '<div style="background:#fff;border-radius:16px;grid-column:span 2"><div style="height:210px">' + ILLU.reminderScene() +
  '</div><div style="text-align:center;font:700 15px Figtree;padding-bottom:6px">podsetnik</div></div>' +
  ['first','streak3','bridge','balance','ten','split','candle','week','fifty','gold'].map(k =>
    '<div style="background:#fff;border-radius:16px"><div style="height:120px">' + ILLU.badge(k, true) +
    '</div><div style="text-align:center;font:700 13px Figtree;padding-bottom:6px">' + k + '</div></div>').join('') +
  '</div>';
document.body.style.overflow = 'auto'; document.body.style.height = 'auto';
document.documentElement.style.overflow = 'auto'; document.documentElement.style.height = 'auto';
1`;
const r = await send("Runtime.evaluate", { expression: build, returnByValue: true });
if (r.exceptionDetails) throw new Error(r.exceptionDetails.text);
await sleep(400);

const { data } = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true });
writeFileSync(OUT, Buffer.from(data, "base64"));
console.log("wrote", OUT);
ws.close();
process.exit(0);
