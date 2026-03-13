importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// نفس الـ Config الخاص بك
const firebaseConfig = {
    apiKey: "AIzaSyCsF_k_WR9ScrBC1Nq3hWboiWVm4KEigNM",
    authDomain: "islamic-dhikr.firebaseapp.com",
    projectId: "islamic-dhikr",
    storageBucket: "islamic-dhikr.firebasestorage.app",
    messagingSenderId: "335914729881",
    appId: "1:335914729881:web:ab4f5e4c8added6fc65308"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// هذه الدالة هي التي تظهر الإشعار عندما يصل من Firebase والجهاز مغلق
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/icon.png', // تأكد من وجود صورة بهذا الاسم في موقعك أو غير المسار
        badge: '/icon.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
