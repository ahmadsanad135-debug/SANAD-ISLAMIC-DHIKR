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

    // إذا كان الإشعار يحتوي على عنوان ونص من السيرفر، المتصفح سيعرضه تلقائياً
    // لذلك نضع هذا الشرط: إذا كان العنوان والنص موجودين بالفعل، نتوقف هنا ولا نكرر الإشعار
    if (payload.notification && payload.notification.title) {
        return; 
    }

    // أما إذا كنت ترسل بيانات صامتة (Data-only message) وتريد تشكيل الإشعار يدوياً:
    const notificationUrl = payload.data?.url || './';

    self.registration.showNotification(
        payload.data?.title || 'إشعار جديد',
        {
            body: payload.data?.body || '',
            icon: './icon.png',
            badge: './icon.png',
            vibrate: [200, 100, 200],
            data: {
                url: notificationUrl
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
// Notification Click (تم تحديثه للتوجيه الذكي)
// ==========================

self.addEventListener('notificationclick', e => {
    e.notification.close();

    // 🚀 استخراج الرابط المخصص المرفق مع الإشعار
    const targetUrl = e.notification.data?.url || './';

    e.waitUntil(
        clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        }).then(clientList => {
            
            // إذا كان التطبيق مفتوحاً في الخلفية، وجّهه للرابط الجديد وقم بالتركيز عليه
            for (const client of clientList) {
                if ('focus' in client && 'navigate' in client) {
                    client.navigate(targetUrl);
                    return client.focus();
                }
            }
            
            // إذا كان التطبيق مغلقاً تماماً، افتحه مباشرة على صفحة الذكر المحددة
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});
 
