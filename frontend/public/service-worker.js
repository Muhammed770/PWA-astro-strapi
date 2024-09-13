const staticCacheName = "site-static-v1";
const dynamicCacheName = "site-dynamic-v1";
const assets = [
  "/app.js",
  "/fallback",
  "/manifest.json",
  "https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700",
];

// Cache size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(() => limitCacheSize(name, size));
      }
    });
  });
};

// Install service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      return cache.addAll(assets);
    })
  );
});

// Activate service worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== staticCacheName && key !== dynamicCacheName)
          .map((key) => caches.delete(key))
      );
    })
  );
});

// Fetch event listener
self.addEventListener("fetch", (event) => {
  if (event.request.method === "GET") {
    event.respondWith(
      caches.match(event.request).then((cacheRes) => {
        // Make the network request to check if there's new data
        return fetch(event.request).then((fetchRes) => {
          return caches.open(dynamicCacheName).then((dynamicCache) => {
            // Check if the ETag values differ (if cached response exists)
            if (
              !cacheRes || // If not cached
              cacheRes.headers.get("ETag") !== fetchRes.headers.get("ETag") // If cache is outdated
            ) {
              // If the data is new, update the cache
              dynamicCache.put(event.request.url, fetchRes.clone());
            }
            return fetchRes; // Always return the fresh response
          });
        }).catch(() => {
          // Fallback to the cached response if the network request fails
          return cacheRes || new Response("Network error occurred.");
        });
      })
    );
  }
});
