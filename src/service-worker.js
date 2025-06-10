// Service Worker for Dicoding Story App
const CACHE_NAME = 'dicoding-story-v3'; // Cache version
const OFFLINE_URL = '/offline.html'; // Fallback URL for offline navigation

// List of static assets to pre-cache during installation
const urlsToCache = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/favicon.png',
  '/images/logo.png',
  // Internal CSS files
  '/styles/critical.css', // Added critical CSS
  '/styles/styles.css',
  '/styles/responsive.css',
  // Internal JavaScript files
  '/scripts/index.js',
  '/scripts/error-handler.js', // Added error handler script
  '/scripts/connection-monitor.js', // Added connection monitor script
  // External CSS from CDN (consider self-hosting for full control)
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.css',
  'https://unpkg.com/leaflet.locatecontrol/dist/L.Control.Locate.min.css',
  'https://unpkg.com/leaflet.vectorgrid@latest/dist/Leaflet.VectorGrid.bundled.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css',
  // External JavaScript from CDN (consider self-hosting for full control)
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js',
  'https://cdn.jsdelivr.net/npm/sweetalert2@11',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.js',
  'https://unpkg.com/leaflet.locatecontrol/dist/L.Control.Locate.min.js',
  'https://unpkg.com/leaflet.vectorgrid@latest/dist/Leaflet.VectorGrid.bundled.js',
  'https://unpkg.com/web-animations-js@2.3.2/web-animations.min.js',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap', // Google Fonts URL
];

// Install event - Cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      // Add all specified URLs to the cache
      await cache.addAll(urlsToCache);
      // Skip waiting to activate the new Service Worker immediately
      self.skipWaiting();
      console.log('[SW] Service Worker installed & assets cached');
    })()
  );
});

// Activate event - Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Get all current cache names
      const cacheNames = await caches.keys();
      // Delete old caches that do not match the current CACHE_NAME
      await Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
      // Claim control of all clients (tabs/windows) immediately
      self.clients.claim();
      console.log('[SW] Service Worker activated & old caches cleaned');
    })()
  );
});

// Fetch event - Serve from cache, fall back to network, or offline page
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    (async () => {
      try {
        // Try to match the request in the cache first
        const cached = await caches.match(event.request);
        if (cached) return cached;

        // If not in cache, try to fetch from the network
        const response = await fetch(event.request);

        // Check if the response is valid before caching
        // Note: Caching CDN assets might consume significant cache space.
        // For production, consider using Workbox for more robust strategies.
        if (response && response.status === 200 && response.type === 'basic') {
          const cache = await caches.open(CACHE_NAME);
          // Cache the new network response
          cache.put(event.request, response.clone());
        }
        return response;
      } catch (err) {
        // If network fetch fails
        console.error('[SW] Fetch failed:', err);
        // Fallback for navigation requests (HTML documents)
        if (
          event.request.mode === 'navigate' ||
          event.request.destination === 'document'
        ) {
          // Serve the offline page for navigation requests
          return caches.match(OFFLINE_URL);
        }
        // Fallback for other types of requests (e.g., images, scripts)
        return new Response('Offline', { status: 503, statusText: 'Offline' });
      }
    })()
  );
});

// Push notification event listener
self.addEventListener('push', (event) => {
  let data = {};
  try {
    // Attempt to parse push data as JSON
    data = event.data.json();
  } catch {
    // Fallback data if parsing fails
    data = { title: 'Dicoding Story', body: 'Ada notifikasi baru.' };
  }

  // Notification options
  const options = {
    body: data.body || 'New content available',
    icon: '/images/logo.png', // Icon displayed in the notification
    badge: '/images/logo.png', // Badge icon (shown on some platforms)
    vibrate: [100, 50, 100], // Vibration pattern
    data: {
      url: data.url || '/', // URL to open when notification is clicked
    },
  };

  // Show the notification
  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Notification click event listener
self.addEventListener('notificationclick', (event) => {
  event.notification.close(); // Close the notification

  // Open the URL associated with the notification data
  event.waitUntil(clients.openWindow(event.notification.data.url || '/'));
});
