/* Offline cache. Once the iPad has opened the app one time it keeps working
   with no network at all — which is the point, since it gets used on a mat
   in the living room, not next to a router. Bump CACHE to ship an update. */
var CACHE = "gimnastika-v6";
var ASSETS = [
  "./",
  "index.html",
  "styles.css",
  "app.js",
  "illustrations.js",
  "mascots.js",
  "manifest.webmanifest",
  "icons/icon.svg",
  "icons/icon-180.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  /* every mascot, every pose — she can switch animals with no network,
     which is the point of an app used on a mat in the living room.
     Generated list; regenerate with tools/build-mascots.py. */
  "img/bear-daska.png",
  "img/bear-hero.png",
  "img/bear-iskorak.png",
  "img/bear-lastavica.png",
  "img/bear-leptiric.png",
  "img/bear-linija.png",
  "img/bear-macka.png",
  "img/bear-portret.png",
  "img/bear-prsti.png",
  "img/bear-psic.png",
  "img/bear-sit.png",
  "img/bear-spaga.png",
  "img/bear-spava.png",
  "img/bear-zvezdice.png",
  "img/fox-arabeska.png",
  "img/fox-cucanj.png",
  "img/fox-cuk.png",
  "img/fox-daska.png",
  "img/fox-dete.png",
  "img/fox-happy.png",
  "img/fox-hero.png",
  "img/fox-iskorak.png",
  "img/fox-kobra.png",
  "img/fox-lastavica.png",
  "img/fox-leptiric.png",
  "img/fox-linija.png",
  "img/fox-macka.png",
  "img/fox-mostic.png",
  "img/fox-noge.png",
  "img/fox-portret.png",
  "img/fox-pretklon.png",
  "img/fox-prsti.png",
  "img/fox-psic.png",
  "img/fox-sit.png",
  "img/fox-spaga.png",
  "img/fox-spava.png",
  "img/fox-sveca.png",
  "img/fox-zvezdice.png",
  "img/rabbit-arabeska.png",
  "img/rabbit-cucanj.png",
  "img/rabbit-cuk.png",
  "img/rabbit-daska.png",
  "img/rabbit-dete.png",
  "img/rabbit-happy.png",
  "img/rabbit-hero.png",
  "img/rabbit-iskorak.png",
  "img/rabbit-kobra.png",
  "img/rabbit-lastavica.png",
  "img/rabbit-leptiric.png",
  "img/rabbit-linija.png",
  "img/rabbit-macka.png",
  "img/rabbit-mostic.png",
  "img/rabbit-noge.png",
  "img/rabbit-portret.png",
  "img/rabbit-pretklon.png",
  "img/rabbit-prsti.png",
  "img/rabbit-psic.png",
  "img/rabbit-sit.png",
  "img/rabbit-spaga.png",
  "img/rabbit-spava.png",
  "img/rabbit-sveca.png",
  "img/rabbit-zvezdice.png"
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
