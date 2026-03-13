const cacheName = 'azkar-v11-firebase'; // رفعنا الإصدار للتحديث
const assets = [
  './',
  './index.html',
  './dhikr-data.js',
  './manifest.json',
  './icon.png' 
];

// 1. التثبيت والحفظ في الكاش (العمل بدون إنترنت)
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

// 3. استراتيجية الكاش (الرد من الكاش أولاً لسرعة التطبيق)
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
        return res || fetch(e.request).catch(() => {
            // إذا فشل الاتصال ولم يجد الملف في الكاش (مثل التنقل لصفحة غير موجودة)
            return caches.match('./index.html');
        });
    })
  );
});

// 4. معالجة الضغط على التنبيه (يعمل مع تنبيهات Firebase أيضاً)
self.addEventListener('notificationclick', e => {
    e.notification.close();
    e.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
            // إذا كان التطبيق مفتوحاً، قم بالتركيز عليه
            for (const client of clientList) {
                if ('focus' in client) return client.focus();
            }
            // إذا كان مغلقاً، افتحه
            if (clients.openWindow) return clients.openWindow('./');
        })
    );
});
