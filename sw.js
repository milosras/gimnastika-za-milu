/* Offline cache. Once the iPad has opened the app one time it keeps working
   with no network at all — which is the point, since it gets used on a mat
   in the living room, not next to a router. Bump CACHE to ship an update. */
var CACHE = "gimnastika-v4";
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
  "img/lili-sit.png",
  "img/lili-happy.png",
  /* one photograph of Lili per exercise, cut from the board by
     tools/crop-gimi.py — every id in EX that has an `img` */
  "img/lili-zvezdice.png",
  "img/lili-macka.png",
  "img/lili-psic.png",
  "img/lili-leptiric.png",
  "img/lili-pretklon.png",
  "img/lili-kobra.png",
  "img/lili-mostic.png",
  "img/lili-spaga.png",
  "img/lili-arabeska.png",
  "img/lili-linija.png",
  "img/lili-prsti.png",
  "img/lili-sveca.png",
  "img/lili-daska.png",
  "img/lili-noge.png",
  "img/lili-cuk.png",
  "img/lili-lastavica.png",
  "img/lili-cucanj.png",
  "img/lili-iskorak.png"
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

/* Fetch, store a copy, and give up after SHELL_MS so a slow or captive network
   can't leave her looking at a blank screen — the cached copy takes over. */
var SHELL_MS = 3000;

function freshest(req) {
  return new Promise(function (resolve, reject) {
    var settled = false;
    var timer = setTimeout(function () {
      if (!settled) { settled = true; reject(new Error("slow")); }
    }, SHELL_MS);

    fetch(req).then(function (res) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (res && res.status === 200) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
      }
      resolve(res);
    }).catch(function (err) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(err);
    });
  });
}

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;

  var url = new URL(e.request.url);
  var isFont = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  var mine = url.origin === location.origin;
  if (!isFont && !mine) return;

  /* The shell is what decides which version is running, so it goes to the
     network first and falls back to the cache. Cache-first here is why a
     deploy used to appear to do nothing on an already-installed iPad. */
  var shell = mine && (e.request.mode === "navigate" ||
    /\.(html|js|css|webmanifest)$/.test(url.pathname) || /\/$/.test(url.pathname));

  if (shell) {
    e.respondWith(
      freshest(e.request).catch(function () {
        return caches.match(e.request).then(function (hit) {
          return hit || caches.match("index.html") || caches.match("./");
        });
      })
    );
    return;
  }

  /* Pictures, icons and fonts never change without changing their name, so
     they stay cache-first and refresh quietly in the background. */
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
});
