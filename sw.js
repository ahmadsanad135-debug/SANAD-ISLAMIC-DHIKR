const CACHE_NAME = 'MUSLIM DHIKR-app-v6'; // تم التحديث إلى v4 لإجبار التحديث
const assets = [
  './',
  './index.html',
  './dhikr-data.js',
  './manifest.json',
  './icon.png',
  'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Tajawal:wght@400;500;700&display=swap'
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // تفعيل التحديث فوراً
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assets);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim(); // السيطرة على الصفحات المفتوحة فوراً
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
