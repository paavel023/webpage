const CACHE_NAME = 'paaveldev-portfolio-v1.1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/script-projects.js',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://unpkg.com/aos@2.3.1/dist/aos.css',
    'https://unpkg.com/aos@2.3.1/dist/aos.js'
];

// Install event
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Immediately activate the new service worker on install
self.addEventListener('install', event => {
    self.skipWaiting();
});

// Fetch event
self.addEventListener('fetch', event => {
    // Use a network-first strategy for navigation requests (documents/pages)
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .then(networkResponse => {
                    // Update cache with the latest page for offline fallback
                    const copy = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
                    return networkResponse;
                })
                .catch(() => {
                    // If network fails, try to serve from cache
                    return caches.match(event.request).then(cached => cached || caches.match('/index.html'));
                })
        );
        return;
    }

    // For other requests (assets), continue with cache-first to improve offline performance
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Take control of uncontrolled clients as soon as the SW becomes active
self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});

// Background sync for offline form submissions
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

function doBackgroundSync() {
    // Handle offline form submissions
    return fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify({
            // Form data would be stored in IndexedDB
        })
    });
} 