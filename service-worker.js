/* NetLearn service worker — offline-first.
 * Precaches the whole app on install so it works with no connection.
 * All paths are RELATIVE so this works under a GitHub Pages subpath
 * (username.github.io/repo/) and from a local file server alike.
 *
 * Bump CACHE when content changes so clients fetch the new version.
 */
var CACHE = "netlearn-v1.6";

var ASSETS = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "css/styles.css",
  "js/data/concepts.js",
  "js/data/more-questions.js",
  "js/data/expand/cctv.js",
  "js/data/expand/dhcp-dns.js",
  "js/data/expand/firewall.js",
  "js/data/expand/multicast.js",
  "js/data/expand/poe.js",
  "js/data/expand/storage.js",
  "js/data/expand/subnetting.js",
  "js/data/expand/vlan.js",
  "js/data/expand/vlan-setup.js",
  "js/data/expand/firewall-lab.js",
  "js/data/ccna/ccna-osi.js",
  "js/data/ccna/ccna-ipv4.js",
  "js/data/ccna/ccna-ipv6.js",
  "js/data/ccna/ccna-switching.js",
  "js/data/ccna/ccna-routing.js",
  "js/data/ccna/ccna-ipservices.js",
  "js/data/ccna/ccna-security.js",
  "js/data/ccna/ccna-wireless.js",
  "js/data/ccna/ccna-automation.js",
  "js/data/ccna/expand/ccna-osi.js",
  "js/data/ccna/expand/ccna-ipv4.js",
  "js/data/ccna/expand/ccna-ipv6.js",
  "js/data/ccna/expand/ccna-switching.js",
  "js/data/ccna/expand/ccna-routing.js",
  "js/data/ccna/expand/ccna-ipservices.js",
  "js/data/ccna/expand/ccna-security.js",
  "js/data/ccna/expand/ccna-wireless.js",
  "js/data/ccna/expand/ccna-automation.js",
  "js/data/content.js",
  "js/store.js",
  "js/components.js",
  "js/router.js",
  "js/features/flashcards.js",
  "js/features/diagrams.js",
  "js/features/quiz.js",
  "js/features/games.js",
  "js/features/test.js",
  "js/features/exam.js",
  "js/features/sync.js",
  "js/app.js",
  "assets/diagrams/CCTV_System_Architecture.png",
  "assets/diagrams/DHCP_DNS_Explained.png",
  "assets/diagrams/Firewalls_Ports_Explained.png",
  "assets/diagrams/Multicast_vs_Unicast.png",
  "assets/diagrams/PoE_Explained.png",
  "assets/diagrams/Storage_RAID_Explained.png",
  "assets/diagrams/Subnetting_Explained.png",
  "assets/diagrams/VLAN_Explained.png",
  "assets/diagrams/VLAN_Setup_Guide.png",
  "assets/icons/icon-192.png",
  "assets/icons/icon-512.png",
  "assets/icons/icon-maskable-512.png",
  "assets/icons/icon-180.png",
  "assets/icons/favicon-32.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (cache) {
      // addAll is atomic; if one asset 404s the whole install fails, so
      // cache them individually and ignore the odd miss.
      return Promise.all(ASSETS.map(function (url) {
        return cache.add(url).catch(function () { /* ignore single failures */ });
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== CACHE) return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

// Cache-first for same-origin GETs; fall back to network, then cache the result.
self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  if (new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    caches.match(req).then(function (hit) {
      if (hit) return hit;
      return fetch(req).then(function (res) {
        if (res && res.status === 200 && res.type === "basic") {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () {
        // offline navigation fallback → app shell
        if (req.mode === "navigate") return caches.match("index.html");
      });
    })
  );
});
