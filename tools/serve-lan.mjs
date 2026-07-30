/* Serves www/ on the local network and prints the address to type on the
   iPad. Handy for testing a change without redeploying.
     npm run lan */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { networkInterfaces } from "node:os";
import { extname, join, normalize } from "node:path";

const ROOT = new URL("../www/", import.meta.url).pathname;
const PORT = +(process.env.PORT || 8123);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png"
};

createServer(async (req, res) => {
  let path = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (path.endsWith("/")) path += "index.html";
  /* keep requests inside www/ */
  const file = join(ROOT, normalize(path).replace(/^(\.\.[/\\])+/, ""));
  try {
    const body = await readFile(file);
    res.writeHead(200, {
      "content-type": TYPES[extname(file)] || "application/octet-stream",
      "cache-control": "no-cache"
    });
    res.end(body);
  } catch {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("404");
  }
}).listen(PORT, "0.0.0.0", () => {
  const ips = Object.values(networkInterfaces())
    .flat()
    .filter((n) => n && n.family === "IPv4" && !n.internal)
    .map((n) => n.address);
  console.log("Gimnastika — otvori na iPadu:\n");
  for (const ip of ips) console.log("  http://" + ip + ":" + PORT + "/");
  console.log("\n(Mac i iPad moraju biti na istom Wi-Fi.)  Ctrl+C za kraj.");
});
