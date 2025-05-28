const CACHE_NAME = 'DicodingStory-V6';
const STATIC_CACHE_NAME = 'DicodingStory-Static-V6';
const API_CACHE_NAME = 'DicodingStory-API-V6';
const IMAGE_CACHE_NAME = 'DicodingStory-Images-V6';
const OFFLINE_URL = '/offline.html';
const API_URL = 'https://story-api.dicoding.dev/v1';

// Cache assets with versioning
const urlsToCache = [
  '/',
  '/index.html',
  '/styles/styles.css',
  '/styles/responsive.css',
  '/scripts/index.js',
  '/favicon.png',
  '/images/logo.png',
  '/images/icon-512x512.png',
  '/images/maskable_icon.png',
  '/manifest.json',
  OFFLINE_URL,
];

// Create a queue for offline posting
const postQueue = [];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache:', STATIC_CACHE_NAME);
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Error during service worker installation:', error);
      })
  );
  // Force this service worker to become active immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => {
              return (
                name.startsWith('DicodingStory-') &&
                name !== STATIC_CACHE_NAME &&
                name !== API_CACHE_NAME &&
                name !== IMAGE_CACHE_NAME
              );
            })
            .map((name) => {
              console.log('Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('Service worker activated');
        // Ensure the service worker takes control immediately
        return self.clients.claim();
      })
  );
});

// Helper function to determine if a request is for an image
function isImageRequest(request) {
  return (
    request.destination === 'image' ||
    request.url.match(/\.(jpe?g|png|gif|svg|webp)$/i)
  );
}

// Helper function to determine if a request is for the API
function isApiRequest(request) {
  return request.url.includes('story-api.dicoding.dev');
}

// Helper function to determine if a request is for a static asset
function isStaticAsset(request) {
  return (
    request.url.match(/\.(css|js|html)$/i) ||
    urlsToCache.some((url) => request.url.endsWith(url))
  );
}

// Fetch event
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (
    !event.request.url.startsWith(self.location.origin) &&
    !event.request.url.startsWith(API_URL)
  ) {
    return;
  }

  // Only handle GET requests and non-query string URLs for caching
  if (event.request.method !== 'GET') {
    // Implement offline support for POST requests
    if (
      event.request.method === 'POST' &&
      event.request.url.includes('/stories') &&
      false // Always assume we're online (original: !navigator.onLine)
    ) {
      event.respondWith(
        new Response(
          JSON.stringify({
            error: false,
            message: 'Your story will be posted when you are online again',
            offlineQueued: true,
          }),
          {
            headers: { 'Content-Type': 'application/json' },
          }
        )
      );

      // Queue the request for later
      event.waitUntil(savePostForLater(event.request.clone()));
      return;
    }
    return;
  }

  // Handle API requests with a network-first strategy
  if (isApiRequest(event.request)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Only cache GET responses
          if (event.request.method === 'GET') {
            // Cache the response for offline use
            const responseToCache = response.clone();
            caches
              .open(API_CACHE_NAME)
              .then((cache) => {
                // Only cache successful responses
                if (responseToCache.ok) {
                  // Add expiration metadata
                  const headers = new Headers(responseToCache.headers);
                  const now = new Date();
                  headers.append('sw-fetched-on', now.toISOString());

                  // Create a new response with the expiration metadata
                  const responseWithMeta = new Response(responseToCache.body, {
                    status: responseToCache.status,
                    statusText: responseToCache.statusText,
                    headers: headers,
                  });

                  console.log('Caching API response for:', event.request.url);
                  // Store in cache with URL as key
                  cache.put(event.request.url, responseWithMeta);
                }
              })
              .catch((err) => {
                console.error('Error caching API response:', err);
              });
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              console.log('Using cached API response for:', event.request.url);
              return cachedResponse;
            }

            // Return offline response for API requests
            console.log(
              'Returning offline API response for:',
              event.request.url
            );
            return new Response(
              JSON.stringify({
                error: true,
                message:
                  'Anda sedang offline. Silakan periksa koneksi internet Anda.',
                listStory: [], // Tambahkan array kosong untuk mencegah error
              }),
              {
                headers: { 'Content-Type': 'application/json' },
              }
            );
          });
        })
    );
    return;
  }

  // Handle image requests with a cache-first strategy
  if (isImageRequest(event.request)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then((response) => {
            // Cache the image for future use
            const responseToCache = response.clone();
            caches.open(IMAGE_CACHE_NAME).then((cache) => {
              if (responseToCache.ok) {
                cache.put(event.request, responseToCache);
              }
            });

            return response;
          })
          .catch(() => {
            // Return placeholder image for missing images
            if (event.request.destination === 'image') {
              return caches.match('/images/placeholder.jpg');
            }

            return new Response('Image not available offline', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' },
            });
          });
      })
    );
    return;
  }

  // Handle static assets with a cache-first strategy
  if (isStaticAsset(event.request)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then((response) => {
            // Cache the static asset
            const responseToCache = response.clone();
            caches.open(STATIC_CACHE_NAME).then((cache) => {
              if (responseToCache.ok) {
                cache.put(event.request, responseToCache);
              }
            });

            return response;
          })
          .catch(() => {
            // Return offline page for HTML requests
            if (event.request.destination === 'document') {
              return caches.match(OFFLINE_URL);
            }

            return new Response('Resource not available offline', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' },
            });
          });
      })
    );
    return;
  }

  // Default strategy for everything else (network first with offline fallback)
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Don't cache responses that aren't successful
        if (!response.ok) {
          return response;
        }

        // Clone the response so we can store it in the cache
        const responseToCache = response.clone();
        caches.open(STATIC_CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          // For HTML pages, return the offline page
          if (event.request.destination === 'document') {
            return caches.match(OFFLINE_URL);
          }

          return new Response('Resource not available offline', {
            status: 408,
            headers: { 'Content-Type': 'text/plain' },
          });
        });
      })
  );
});

// Function to save a POST request for later
async function savePostForLater(request) {
  try {
    const requestData = await request.formData();
    const queueItem = {
      url: request.url,
      method: request.method,
      headers: [...request.headers.entries()].reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {}),
      formData: [...requestData.entries()].reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {}),
      timestamp: Date.now(),
    };

    postQueue.push(queueItem);

    // Store in IndexedDB
    const dbPromise = indexedDB.open('offline-posts', 1);

    dbPromise.onupgradeneeded = function (event) {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('posts')) {
        db.createObjectStore('posts', { keyPath: 'timestamp' });
      }
    };

    dbPromise.onsuccess = function (event) {
      const db = event.target.result;
      const tx = db.transaction('posts', 'readwrite');
      const store = tx.objectStore('posts');
      store.add(queueItem);
    };

    // Attempt to process the queue when we go online
    self.addEventListener('online', processPostQueue);
  } catch (error) {
    console.error('Error saving post for later:', error);
  }
}

// Process the offline post queue
async function processPostQueue() {
  if (postQueue.length === 0) {
    return;
  }

  console.log('Processing offline post queue:', postQueue.length, 'items');

  // Process each queued item
  while (postQueue.length > 0) {
    const item = postQueue.shift();

    try {
      // Recreate the FormData
      const formData = new FormData();
      for (const [key, value] of Object.entries(item.formData)) {
        formData.append(key, value);
      }

      // Send the request
      const response = await fetch(item.url, {
        method: item.method,
        headers: new Headers(item.headers),
        body: formData,
      });

      if (response.ok) {
        console.log('Successfully processed offline post:', item.url);

        // Show a notification
        self.registration.showNotification('Story Posted', {
          body: 'Your offline story has been successfully posted!',
          icon: '/images/logo.png',
          vibrate: [200, 100, 200],
        });

        // Remove from IndexedDB
        const dbPromise = indexedDB.open('offline-posts', 1);
        dbPromise.onsuccess = function (event) {
          const db = event.target.result;
          const tx = db.transaction('posts', 'readwrite');
          const store = tx.objectStore('posts');
          store.delete(item.timestamp);
        };
      } else {
        console.error('Failed to process offline post:', response.status);
        // Put back in queue if server error (5xx)
        if (response.status >= 500) {
          postQueue.push(item);
        }
      }
    } catch (error) {
      console.error('Error processing offline post:', error);
      // Put back in queue for retry later
      postQueue.push(item);
    }
  }
}

// Sync event for background syncing
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-posts') {
    event.waitUntil(processPostQueue());
  }
});

// Push notification event
self.addEventListener('push', (event) => {
  if (!event.data) {
    return;
  }

  try {
    const data = event.data.json();

    const options = {
      body: data.options?.body || 'Ada pemberitahuan baru dari Dicoding Story',
      icon: '/images/logo.png',
      badge: '/images/favicon.png',
      vibrate: [100, 50, 100, 50, 100],
      data: {
        url: data.url || '/',
        timestamp: Date.now(),
      },
      actions: [
        {
          action: 'view',
          title: 'Lihat',
        },
        {
          action: 'close',
          title: 'Tutup',
        },
      ],
      // Show timestamp
      timestamp: Date.now(),
    };

    event.waitUntil(
      self.registration.showNotification(
        data.title || 'Dicoding Story',
        options
      )
    );
  } catch (error) {
    console.error('Error showing notification:', error);
  }
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // Handle notification action buttons
  if (event.action === 'close') {
    return;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Check if there's already a window open
      for (const client of clientList) {
        if ('focus' in client) {
          // If the action is 'view' or not specified, navigate to the URL
          if (event.action === 'view' || !event.action) {
            client.navigate(event.notification.data.url);
            return client.focus();
          }
        }
      }

      // If no window is open, open a new one
      if (clients.openWindow && (event.action === 'view' || !event.action)) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});
