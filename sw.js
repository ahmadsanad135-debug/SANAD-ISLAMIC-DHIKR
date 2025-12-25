const CACHE_NAME = 'sanad-islamic-v2';
const assets = [
  './',
  './index.html',
  './dhikr-data.js',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap',
  'https://cdn-icons-png.flaticon.com/512/2805/2805355.png'
];

// 1. تثبيت الخدمة
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assets);
    })
  );
});

// 2. تفعيل الخدمة وتنظيف الكاش القديم
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
      );
    })
  );
});

// 3. استراتيجية الكاش أولاً
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
