importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyCsF_k_WR9ScrBC1Nq3hWboiWVm4KEigNM",
    authDomain: "islamic-dhikr.firebaseapp.com",
    projectId: "islamic-dhikr",
    storageBucket: "islamic-dhikr.firebasestorage.app",
    messagingSenderId: "335914729881",
    appId: "1:335914729881:web:ab4f5e4c8added6fc65308"
});

const messaging = firebase.messaging();

/**
 * إشعارات الخلفية (عند إغلاق التطبيق)
 */
messaging.onBackgroundMessage((payload) => {
    const title =
        payload.notification?.title ||
        payload.data?.title ||
        "أذكار المسلم";

    const body =
        payload.notification?.body ||
        payload.data?.body ||
        "";

    const url = payload.data?.url || "./";

    self.registration.showNotification(title, {
        body: body,
        icon: "./icon.png",
        badge: "./icon.png",
        data: { url }
    });
});

/**
 * عند الضغط على الإشعار
 */
self.addEventListener("notificationclick", (event) => {
    event.notification.close();

    const url = event.notification.data?.url || "./";

    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if (client.url === url && "focus" in client) {
                    return client.focus();
                }
            }
            return clients.openWindow(url);
        })
    );
});
