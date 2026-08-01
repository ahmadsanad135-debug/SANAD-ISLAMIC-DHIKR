const cacheName = 'azkar-v25-firebase';

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
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).catch(() => {
          return caches.match('./index.html');
        })
      );
    })
  );
});

// ==========================
// Notification Click
// ==========================
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || './';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsArr) => {
      for (const client of clientsArr) {
        if (client.url && client.url.includes(self.location.origin) && 'focus' in client) {
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

// ==========================
// High Priority Push Fallback
// كود احتياطي في حال توجيه إشعار Firebase لهذا الملف بدلاً من firebase-messaging-sw.js
// ==========================
self.addEventListener('push', (event) => {
  if (event.data) {
    try {
      const payload = event.data.json();
      const title = payload.notification?.title || payload.data?.title || "أذكار المسلم";
      const body = payload.notification?.body || payload.data?.body || "لديك تنبيه جديد";
      const url = payload.data?.url || "./";

      event.waitUntil(
        self.registration.showNotification(title, {
          body: body,
          icon: "./icon.png",
          badge: "./icon.png",
          tag: 'dhikr-push-' + Date.now(),
          data: { url: url },
          requireInteraction: true,
          priority: 'high',
          urgency: 'high',
          vibrate: [200, 100, 200]
        })
      );
    } catch (e) {
      console.error('Error handling push event in sw.js:', e);
    }
  }
});
