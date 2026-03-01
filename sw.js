const CACHE_NAME = 'chaosprep-cache-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './styles.css',
    './script.js',
    './manifest.json',
    // You can also add your icon paths here
];

// Install Event: Cache core assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// Activate Event: Clean up old caches if you update the CACHE_NAME version
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

// Fetch Event: Serve from cache first, then network
self.addEventListener('fetch', (event) => {
    // Ignore non-GET requests and external API calls (like Firebase)
    if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || fetch(event.request).then((networkResponse) => {
                // Optionally cache new static assets dynamically here
                return networkResponse;
            });
        })
    );
});