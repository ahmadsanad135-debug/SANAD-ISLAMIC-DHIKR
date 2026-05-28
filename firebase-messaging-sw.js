importScripts('https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.5/firebase-messaging-compat.js');

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
    self.registration.showNotification(
        payload.data?.title || "أذكار المسلم",
        {
            body: payload.data?.body || "",
            icon: "./icon.png"
        }
    );
});
