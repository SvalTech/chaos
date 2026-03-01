const CACHE_NAME = 'chaosprep-cache';

// Core local files to cache immediately on install
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './styles.css',
    './script.js',
    './manifest.json'
];

// External CDNs that power the app's UI and logic
const APPROVED_EXTERNAL_DOMAINS = [
    'cdn.tailwindcss.com',          // Tailwind CSS
    'unpkg.com/lucide',             // Icons
    'cdn.jsdelivr.net',             // Chart.js, Confetti, Sortable
    'fonts.googleapis.com',         // Inter Font CSS
    'fonts.gstatic.com',            // Inter Font Files
    'www.gstatic.com/firebasejs'    // Firebase SDKs
];

// Install Event: Cache local assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
    );
    self.skipWaiting();
});

// Activate Event: Clean up old caches
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

// Fetch Event: Serve from cache first, then network (Runtime Caching)
self.addEventListener('fetch', (event) => {
    // 1. Ignore non-GET requests (like form submissions)
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);

    // 2. CRITICAL: Ignore Firebase Database/Auth API calls
    // We want the Firebase SDK's IndexedDB persistence to handle offline data, NOT the service worker.
    if (url.hostname.includes('firestore.googleapis.com') ||
        url.hostname.includes('identitytoolkit.googleapis.com') ||
        url.hostname.includes('securetoken.googleapis.com')) {
        return;
    }

    // 3. Is it a local asset OR an approved external CDN?
    const isLocal = url.origin === self.location.origin;
    const isApprovedCDN = APPROVED_EXTERNAL_DOMAINS.some(domain => event.request.url.includes(domain));

    if (isLocal || isApprovedCDN) {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                // Return the cached version if we have it
                if (cachedResponse) {
                    return cachedResponse;
                }

                // Otherwise, fetch it from the network...
                return fetch(event.request).then((networkResponse) => {
                    // Don't cache bad responses
                    if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'error') {
                        return networkResponse;
                    }

                    // ...and save a copy in the cache for next time
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });

                    return networkResponse;
                });
            })
        );
    }
});