const cacheName = 'azkar-v22-firebase';

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
self.addEventListener('install', e => {
  self.skipWaiting();

  e.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll(assets))
  );
});

// ==========================
// Activate
// ==========================
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== cacheName) {
            return caches.delete(key);
          }
        })
      );
    })
  );

  return self.clients.claim();
});

// ==========================
// Fetch
// ==========================
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request).catch(() => {
        return caches.match('./index.html');
      });
    })
  );
});

// ==========================
// Notification Click
// ==========================
self.addEventListener('notificationclick', e => {
  e.notification.close();

  const targetUrl = e.notification.data?.url || './';

  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if ('focus' in client && 'navigate' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
}); 
