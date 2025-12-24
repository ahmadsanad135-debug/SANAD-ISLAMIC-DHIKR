// 1. تعريف وتثبيت المحرك (Service Worker)
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installed');
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activated');
});

// 2. استقبال التنبيهات (الكود الذي سألت عنه)
self.addEventListener('push', function(event) {
    const options = {
        body: 'حان الآن موعد الأذكار، نور قلبك بذكر الله.',
        icon: 'https://cdn-icons-png.flaticon.com/512/2805/2805355.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/2805/2805355.png'
    };
    event.waitUntil(
        self.registration.showNotification('✨ ذكر الله', options)
    );
});

// 3. ماذا يحدث عند الضغط على التنبيه
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/') // يفتح موقعك فوراً عند الضغط على التذكير
    );
});
