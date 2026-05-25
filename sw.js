const cacheName = 'azkar-v22-firebase';

const assets = [
  './',
  './index.html',
  './dhikr-data.js',
  './manifest.json',
  './icon.png'
];


// ==========================
// Firebase Messaging
// ==========================

importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyCs704ZMKYWKTVGkOMdUjYWHlmUsVNDY6U",
    authDomain: "islamic-dhikr-230fa.firebaseapp.com",
    projectId: "islamic-dhikr-230fa",
    storageBucket: "islamic-dhikr-230fa.firebasestorage.app",
    messagingSenderId: "525068923867",
    appId: "1:525068923867:web:8157fbafc2f5f075adedfe"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {

    console.log('Background Message:', payload);

    self.registration.showNotification(
        payload.notification?.title || 'إشعار جديد',
        {
            body: payload.notification?.body || '',
            icon: './icon.png',
            badge: './icon.png',
            vibrate: [200, 100, 200],
            data: {
                url: './'
            }
        }
    );
});


// ==========================
// Install
// ==========================

self.addEventListener('install', e => {

    self.skipWaiting();

    e.waitUntil(
        caches.open(cacheName)
        .then(cache => cache.addAll(assets))
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

    e.waitUntil(
        clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        }).then(clientList => {
            // إذا كان التطبيق مفتوحاً، قم بالتركيز عليه
            for (const client of clientList) {
                if ('focus' in client) {
                    return client.focus();
                }
            }
            // إذا كان مغلقاً، افتحه
            if (clients.openWindow) {
                return clients.openWindow('./');
            }
        })
    );
});
