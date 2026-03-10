importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCsF_k_WR9ScrBC1Nq3hWboiWVm4KEigNM",
  authDomain: "islamic-dhikr.firebaseapp.com",
  projectId: "islamic-dhikr",
  storageBucket: "islamic-dhikr.firebasestorage.app",
  messagingSenderId: "335914729881",
  appId: "1:335914729881:web:ab4f5e4c8added6fc65308",
  measurementId: "G-M3GKFFF5YR"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title || "تطبيق الأذكار";
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png', 
    badge: '/icon.png',
    dir: 'rtl'
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
