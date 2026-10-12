// O-Shachi Service Worker (v2.0.0) - Offline-First Engine
const CACHE_NAME = 'o-shachi-v2.0.0';

const PRECACHE_ASSETS = [
  './',
  './index.html',
  './orca-mascot.png',
  './orca-icon.svg',
  './manifest.webmanifest',
  './data/manifest.json',
  './data/kana.json',
  './data/n5_kanji.json',
  './data/n5_grammar.json',
  './data/n5_vocab.json',
  './data/n4_kanji.json',
  './data/n4_grammar.json',
  './data/n4_vocab.json',
  './data/n3_kanji.json',
  './data/n3_grammar.json',
  './data/n3_vocab.json',
  './data/n3_readings.json',
  './data/phonetic_rules.json',
  './data/nuance_pairs.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        // Precache critical app shell & offline chunks
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
      .catch((err) => {
        console.warn('SW Precache non-blocking warning:', err);
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => {
            if (name !== CACHE_NAME) {
              return caches.delete(name);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // If requesting local app content or data chunks: Cache-First with Stale-While-Revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch fresh copy in background to update cache (stale-while-revalidate)
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse.clone());
              });
            }
          })
          .catch(() => {
            // Offline - ignore network error since we served cached
          });
        return cachedResponse;
      }

      // If not in cache, fetch from network and store in cache
      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        })
        .catch(() => {
          // If offline and navigating to a page, fallback to cached index.html
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html') || caches.match('./');
          }
        });
    })
  );
});
