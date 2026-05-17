importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// 1. إعداد الـ Firebase الخاص بمشروعك
firebase.initializeApp({
    apiKey: "AIzaSyCs704ZMKYWKTVGkOMdUjYWHlmUsVNDY6U",
    authDomain: "islamic-dhikr-230fa.firebaseapp.com",
    projectId: "islamic-dhikr-230fa",
    storageBucket: "islamic-dhikr-230fa.firebasestorage.app",
    messagingSenderId: "525068923867",
    appId: "1:525068923867:web:8157fbafc2f5f075adedfe"
});

const messaging = firebase.messaging();

// استقبال الإشعارات والتطبيق مغلق
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: './icon.png'
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});

// 2. كود تشغيل التطبيق بدون إنترنت (Offline Cache) مدمج لإنهاء التعارض
const CACHE_NAME = 'dhikr-v2';
const ASSETS = [
    './',
    './index.html',
    './dhikr-data.js',
    './manifest.json',
    './icon.png'
];

self.addEventListener('install', (e) => {
    e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', (e) => {
    e.respondWith(caches.match(e.request).then(response => response || fetch(e.request)));
});
