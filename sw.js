const cacheName = 'azkar-v24-firebase';

const assets = [
  './',
  './index.html',
  './dhikr-data.js',
  './manifest.json',
  './icon.png'
];

// ==========================
// Install
// ==========================
self.addEventListener('install', (event) => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(assets).catch((error) => {
        console.error('Cache addAll error:', error);
      });
    })
  );
});

// ==========================
// Activate
// ==========================
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== cacheName) {
            console.log('Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim();
});

// ==========================
// Fetch (Safe fallback)
// ==========================
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).catch(() => {
          // Return cached index.html as fallback
          return caches.match('./index.html');
        })
      );
    })
  );
});

// ==========================
// Notification Click (FIXED)
// ==========================
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || './';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsArr) => {
      // Check if there's already a window/tab with the target URL open
      for (const client of clientsArr) {
        if (client.url && client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }

      // If not, open a new window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
