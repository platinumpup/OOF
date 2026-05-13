const CACHE_NAME = "oof-cache-v1";

const FILES_TO_CACHE = [
  "/OOF/",
  "/OOF/index.html",
  "/OOF/manifest.json",
  "/OOF/icon-192.png",
  "/OOF/icon-512.png"
];

// INSTALL → cache core files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// ACTIVATE → remove old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// FETCH → app works offline + prevents 404
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match("/OOF/index.html");
    })
  );
});
