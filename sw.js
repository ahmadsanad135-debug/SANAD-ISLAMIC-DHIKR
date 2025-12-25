const CACHE_NAME = 'sanad-islamic-v2';
const assets = [
  '/',
  '/index.html',
  '/dhikr-data.js',
  '/manifest.json',
  'https://cdn-icons-png.flaticon.com/512/2805/2805355.png'
];

// 1. تثبيت الخدمة وحفظ الملفات في الكاش
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('تم حفظ الملفات في الكاش بنجاح');
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

// 3. استراتيجية "الكاش أولاً" لضمان العمل بدون إنترنت
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// 4. استقبال التنبيهات (Push Notifications)
self.addEventListener('push', function(event) {
  const options = {
    body: 'نور قلبك بذكر الله.. حان الآن موعد الأذكار.',
    icon: 'https://cdn-icons-png.flaticon.com/512/2805/2805355.png',
    badge: 'https://cdn-icons-png.flaticon.com/512/2805/2805355.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    }
  };
  event.waitUntil(
    self.registration.showNotification('✨ ذكر الله', options)
  );
});

// 5. ماذا يحدث عند الضغط على التنبيه
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/') 
  );
});
