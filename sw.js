const cacheName = 'azkar-v8-final';
const assets = [
  '/',
  '/index.html',
  '/dhikr-data.js',
  '/manifest.json',
  '/icon.png' // تأكد من وجود أيقونة بهذا الاسم أو استبدلها برابط
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
});

// 3. استقبال التنبيهات المجدولة (Push) أو اليدوية
self.addEventListener('show-notification', (event) => {
    const title = event.data.title;
    const options = {
        body: event.data.body,
        icon: '/icon.png',
        badge: '/icon.png',
        vibrate: [200, 100, 200],
        tag: event.data.tag, // لمنع تكرار نفس التنبيه
        renotify: true
    };
    self.registration.showNotification(title, options);
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
        clients.openWindow('/')
    );
});
