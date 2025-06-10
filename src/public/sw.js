const CACHE_NAME = 'DicodingStory-V7';
const OFFLINE_URL = '/offline.html';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles/styles.css',
  '/styles/responsive.css',
  '/scripts/index.js',
  '/favicon.png',
  '/images/logo.png',
  '/manifest.json',
  OFFLINE_URL,
];

// Install event: cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Activate event: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        )
      )
  );
  self.clients.claim();
});

// Fetch event: cache-first for static, network-first for navigation, fallback to offline
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Network-first for navigation (HTML)
  if (
    event.request.mode === 'navigate' ||
    event.request.destination === 'document'
  ) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache the page for offline use
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() =>
          caches
            .match(event.request)
            .then((res) => res || caches.match(OFFLINE_URL))
        )
    );
    return;
  }

  // Cache-first for static assets
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response;
      return fetch(event.request)
        .then((networkResponse) => {
          // Cache new static assets
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            event.request.url.startsWith(self.location.origin)
          ) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Fallback for images/icons
          if (event.request.destination === 'image') {
            return new Response('', { status: 404 });
          }
        });
    })
  );
});

// Push notification
self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data.json();
  } catch {
    data = { title: 'Dicoding Story', body: 'Ada notifikasi baru.' };
  }
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/images/logo.png',
      badge: '/images/logo.png',
      data: { url: data.url || '/' },
      vibrate: [100, 50, 100],
      actions: [
        { action: 'open', title: 'Buka' },
        { action: 'close', title: 'Tutup' },
      ],
    })
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url || '/'));
});
