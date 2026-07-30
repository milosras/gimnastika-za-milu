/* Offline cache. Once the iPad has opened the app one time it keeps working
   with no network at all — which is the point, since it gets used on a mat
   in the living room, not next to a router. Bump CACHE to ship an update. */
var CACHE = "gimnastika-v2";
var ASSETS = [
  "./",
  "index.html",
  "styles.css",
  "app.js",
  "illustrations.js",
  "manifest.webmanifest",
  "icons/icon.svg",
  "icons/icon-180.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "img/lili-split.jpg",
  "img/lili-bridge.png",
  "img/lili-sit.png",
  "img/lili-scale.png",
  "img/lili-happy.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        return k === CACHE ? null : caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;

  /* Google Fonts: use the cached copy first, refresh quietly in the
     background. Keeps the app looking right offline. */
  var url = new URL(e.request.url);
  var isFont = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";

  if (isFont || url.origin === location.origin) {
    e.respondWith(
      caches.match(e.request).then(function (hit) {
        var live = fetch(e.request).then(function (res) {
          if (res && res.status === 200) {
            var copy = res.clone();
            caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
          }
          return res;
        }).catch(function () { return hit; });
        return hit || live;
      })
    );
  }
});
