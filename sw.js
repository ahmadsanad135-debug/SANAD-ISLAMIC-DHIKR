const cacheName = 'azkar-v5-final'; // تغيير الاسم لضمان التحديث
const assets = [
  './',
  './index.html',
  './dhikr-data.js', // تم تعديل الاسم هنا لضمان عمل الأوفلاين
  './manifest.json',
  './icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assets);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request);
    })
  );
});
 
