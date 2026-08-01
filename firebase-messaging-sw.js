// Firebase Messaging Service Worker
// يتعامل مع الإشعارات في الخلفية بأولوية عالية إجبارية

importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// Firebase Configuration
try {
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
   * إشعارات الخلفية (عند إغلاق التطبيق) - معالجة فورية إجبارية
   */
  messaging.onBackgroundMessage((payload) => {
    console.log('Background message received:', payload);
    
    const title =
      payload.notification?.title ||
      payload.data?.title ||
      "أذكار المسلم";

    const body =
      payload.notification?.body ||
      payload.data?.body ||
      "لديك تنبيه جديد";

    const url = payload.data?.url || "./";

    // خيارات إشعار عالية الأولوية تجبر المتصفح والنظام على العرض الفوري
    const notificationOptions = {
      body: body,
      icon: "./icon.png",
      badge: "./icon.png",
      tag: 'dhikr-notification-' + Date.now(), // Tag فريد لمنع التأخير أو دمج الإشعارات
      data: { url },
      requireInteraction: true, // يمنع اختفاء الإشعار تلقائياً ويجبر النظام على إظهاره فوراً
      priority: 'high',         // أولوية قصوى للنظام
      urgency: 'high',          // استعجال فوري لشبكة Web Push
      vibrate: [200, 100, 200]  // اهتزاز عند الوصول
    };

    self.registration.showNotification(title, notificationOptions);
  });

  console.log('✅ Firebase Messaging Service Worker initialized successfully');
} catch (error) {
  console.error('❌ Firebase Messaging SW initialization error:', error);
}

/**
 * عند الضغط على الإشعار
 */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url || "./";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // البحث عن نافذة مفتوحة
      for (const client of clientList) {
        if (client.url && client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      // فتح نافذة جديدة إذا لم توجد نافذة مفتوحة
      return clients.openWindow(url);
    })
  );
});
