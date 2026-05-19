// استيراد مكتبات Firebase متوافقة مع الإصدار 10
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// تهيئة Firebase داخل السيرفس وركر
firebase.initializeApp({
    apiKey: "AIzaSyCs704ZMKYWKTVGkOMdUjYWHlmUsVNDY6U",
    authDomain: "islamic-dhikr-230fa.firebaseapp.com",
    projectId: "islamic-dhikr-230fa",
    storageBucket: "islamic-dhikr-230fa.firebasestorage.app",
    messagingSenderId: "525068923867",
    appId: "1:525068923867:web:8157fbafc2f5f075adedfe"
});

const messaging = firebase.messaging();

// استقبال الإشعارات في الخلفية
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: './icon.png' // تأكد من وجود صورة بهذا الاسم في المجلد الرئيسي
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});
 
