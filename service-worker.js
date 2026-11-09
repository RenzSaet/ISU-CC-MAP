const cacheName = "isu-cc-map-cache";

self.addEventListener("install", e => {
    console.log("[ServiceWorker] - Install");

    e.waitUntil((async () => {
        const response = await fetch("./precache-manifest.json");

        if (!response.ok) {
            throw new Error("Could not load precache-manifest.json");
        }

        const files = await response.json();
        const cache = await caches.open(cacheName);

        await cache.addAll(files);

        console.log("[ServiceWorker] - App resources cached");
    })());
});

self.addEventListener("activate", e => {
    e.waitUntil((async () => {
        const keyList = await caches.keys();
        await Promise.all(
            keyList.filter(key => key.startsWith("isu-cc-map-")).map(key => {
                console.log(key);

                if (key != cacheName) {
                    console.log("[ServiceWorker] - Removing old cache", key);
                    return caches.delete(key);
                }
            })
        );
    })());

    e.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", e => {
    if (e.request.method != "GET") return;

    e.respondWith(
        caches.match(e.request).then(cachedResponse => {
            return cachedResponse || fetch(e.request);
        })
    );
});
