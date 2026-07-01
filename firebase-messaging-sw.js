// firebase-messaging-sw.js
// Service Worker for handling Firebase Cloud Messaging background messages
// IMPORTANT: Replace the firebase config values below with your project's values.

importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "<YOUR_API_KEY>",
  authDomain: "<YOUR_AUTH_DOMAIN>",
  projectId: "<YOUR_PROJECT_ID>",
  messagingSenderId: "<YOUR_SENDER_ID>",
  appId: "<YOUR_APP_ID>"
});

const messaging = firebase.messaging();

// Handle background messages. Show the notification here once per incoming message.
messaging.onBackgroundMessage(function(payload) {
  try {
    const data = payload.notification || payload.data || {};
    const title = data.title || 'تنبيه';
    const options = {
      body: data.body || data.message || '',
      icon: data.icon || '/favicon.ico',
      data: data
    };
    self.registration.showNotification(title, options);
  } catch (e) {
    console.error('sw background message error', e);
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(clients.matchAll({ type: 'window' }).then(windowClients => {
    for (let client of windowClients) {
      if (client.url === url && 'focus' in client) return client.focus();
    }
    if (clients.openWindow) return clients.openWindow(url);
  }));
});
