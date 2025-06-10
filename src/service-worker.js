// Service Worker for Dicoding Story App
const CACHE_NAME = 'dicoding-story-v3';
const OFFLINE_URL = '/offline.html';

const urlsToCache = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/favicon.png',
  '/images/logo.png',
  '/styles/styles.css',
  '/styles/responsive.css',
  '/scripts/index.js',
];

// Install event - Cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(urlsToCache);
      self.skipWaiting();
      console.log('[SW] Service Worker installed & assets cached');
    })()
  );
});

// Activate event - Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
      self.clients.claim();
      console.log('[SW] Service Worker activated & old caches cleaned');
    })()
  );
});

// Fetch event - Serve from cache, fall back to network, fallback to offline
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    (async () => {
      try {
        // Try cache first
        const cached = await caches.match(event.request);
        if (cached) return cached;

        // Try network
        const response = await fetch(event.request);
        // Cache new requests for static assets
        if (
          response &&
          response.status === 200 &&
          event.request.url.startsWith(self.location.origin)
        ) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, response.clone());
        }
        return response;
      } catch (err) {
        // Fallback for navigation requests (HTML)
        if (
          event.request.mode === 'navigate' ||
          event.request.destination === 'document'
        ) {
          return caches.match(OFFLINE_URL);
        }
        // Fallback for other requests
        return new Response('Offline', { status: 503, statusText: 'Offline' });
      }
    })()
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data.json();
  } catch {
    data = { title: 'Dicoding Story', body: 'Ada notifikasi baru.' };
  }
  const options = {
    body: data.body || 'New content available',
    icon: '/images/logo.png',
    badge: '/images/logo.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
    },
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url || '/'));
});
