const staticCacheName = "site-static-v1";
const dynamicCacheName = "site-dynamic-v1";
const assets = [
  "/",
  "/app.js",
  "/fallback",
  "https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700",
];

// cache size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

// install service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      assets.forEach((asset) => cache.add(asset));
    })
  );
});

// activate service worker
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

self.addEventListener("fetch", function (event) {
  if (event.request.method === "GET") {
    event.respondWith(
      caches
        .open(staticCacheName)
        .then((staticCache) => staticCache.match(event.request))
        .then((cacheRes) => {
          return (
            cacheRes ||
            fetch(event.request).then((fetchRes) => {
              return caches.open(dynamicCacheName).then((dynamicCache) => {
                dynamicCache.put(event.request.url, fetchRes.clone());
                // check cached items size
                limitCacheSize(dynamicCacheName, 15);
                return fetchRes;
              });
            })
          );
        })
        .catch(async function (err) {
          // Return page if it exists in cache
          const pageResponse = await caches.match(event.request);
          if (pageResponse) return pageResponse;
          // if not, return fallback page
          const errorResponse = await caches.match("/fallback");
          return errorResponse;
        })
    );
  }
});
