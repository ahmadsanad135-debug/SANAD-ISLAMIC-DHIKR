const cacheName = 'azkar-v23-firebase';

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
    caches.open(cacheName).then((cache) => cache.addAll(assets))
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
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim();
});

// ==========================
// Fetch (safe fallback)
// ==========================
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).catch(() => caches.match('./index.html'))
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
      for (const client of clientsArr) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }

      return clients.openWindow(targetUrl);
    })
  );
}); 
