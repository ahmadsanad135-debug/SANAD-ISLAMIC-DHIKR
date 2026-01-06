const cacheName = 'azkar-v8-final';
const assets = [
  '/',
  '/index.html',
  '/dhikr-data.js',
  '/manifest.json',
  '/icon.png' 
];

// 1. التثبيت والحفظ في الكاش
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll(assets))
  );
});

// 2. تفعيل الخدمة وتنظيف الكاش القديم
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys.map(key => {
        if (key !== cacheName) return caches.delete(key);
      }));
    })
  );
  return self.clients.claim();
});

// 3. استقبال الأوامر من المتصفح (التصحيح هنا)
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
        const options = {
            body: event.data.body,
            icon: '/icon.png',
            badge: '/icon.png',
            vibrate: [200, 100, 200],
            tag: 'azkar-reminder', 
            renotify: true,
            data: { url: '/' }
        };
        self.registration.showNotification(event.data.title, options);
    }
});

// 4. استراتيجية الكاش (العمل بدون إنترنت)
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});

// 5. عند الضغط على التنبيه يفتح الموقع
self.addEventListener('notificationclick', e => {
    e.notification.close();
    e.waitUntil(
        clients.matchAll({ type: 'window' }).then(clientList => {
            for (const client of clientList) {
                if (client.url === '/' && 'focus' in client) return client.focus();
            }
            if (clients.openWindow) return clients.openWindow('/');
        })
    );
});
