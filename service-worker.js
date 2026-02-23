// Use a stable versioned cache (change manually when needed)
const CACHE_NAME = "ons-v4";

// Core app shell
const APP_SHELL = [
  "/",
  "/index.html",
  "/images.html",
  "/playlist.html",
  "/notes.html",
  "/style.css",
  "/main.js",
  "/Ons1.png",
  "/Ons2.png",
  "/Ons3.png",
  "/Ons4.png",
  "/Ons5.png",
  "/Ons6.png",
  "/Ons7.png",
  "/Ons8.png",
  "/Ons9.png",
  "/Ons10.png",
  "/Ons11.png",
  "/Ons12.png",
  "/Ons13.png",
  "/Ons14.png",
  "/Ons15.png",
  "/Onsbg.png",
  "/Belong Together.mp3",
  "/Thank God.mp3",
  "/Soen.mp3",
  "/All I'll Ever Need.mp3",
  "/Once in a lifetime.mp3",
  "/Forever and ever amen.mp3",
  "/Butterflies.mp3",
  "/Diner 39 - Franna Benadé(Official Music Video).mp3",
  "/icon-192.png",
  "/icon-512.png",
  "/manifest.json"
];

// INSTALL
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        await cache.addAll(APP_SHELL);
        console.log("App shell cached successfully");
      } catch (err) {
        console.error("Caching failed:", err);
      }
    })
  );
  self.skipWaiting();
});

// FETCH
self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") return;

  // Ignore cross-origin requests (CDNs, extensions, etc.)
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          // Only cache valid responses
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response;
          }

          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });

          return response;
        })
        .catch(() => {
          // Offline fallback for navigation
          if (event.request.mode === "navigate") {
            return caches.match("/index.html");
          }
        });
    })
  );
});

// ACTIVATE
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});