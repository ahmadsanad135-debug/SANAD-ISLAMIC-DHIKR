// firebase-push-client.js
// Client-side registration, token handling and unsubscribe logic.
// Put this file where your site's JS is served (e.g., public/js/) and include it in HTML.

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getMessaging, getToken, onMessage, deleteToken } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging.js";

const firebaseConfig = {
  apiKey: "<YOUR_API_KEY>",
  authDomain: "<YOUR_AUTH_DOMAIN>",
  projectId: "<YOUR_PROJECT_ID>",
  messagingSenderId: "<YOUR_SENDER_ID>",
  appId: "<YOUR_APP_ID>"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Register service worker (once)
async function registerSW() {
  try {
    const reg = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    console.log('SW registered with scope:', reg.scope);
    return reg;
  } catch (err) {
    console.error('SW registration failed', err);
    throw err;
  }
}

// Call this from a user gesture (button) to request permission and get token
async function requestPermissionAndGetToken() {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Notification permission not granted');
      return null;
    }
    const reg = await registerSW();
    const vapidKey = '<YOUR_PUBLIC_VAPID_KEY>'; // ضع هنا مفتاح VAPID العام من Firebase console
    const currentToken = await getToken(messaging, { vapidKey, serviceWorkerRegistration: reg });
    if (currentToken) {
      console.log('FCM token:', currentToken);
      // أرسل التوكن للخادم وتخزينه في DB (مرة واحدة فقط)
      await fetch('/api/save-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: currentToken })
      });
      return currentToken;
    }
    return null;
  } catch (err) {
    console.error('get token error', err);
    return null;
  }
}

// Foreground message handling: update UI only (لا تعرض system notification هنا إذا كانت SW يعرضها)
onMessage(messaging, (payload) => {
  console.log('Message received in foreground:', payload);
  // مثال: عرض toast أو تحديث DOM بدلاً من showNotification
});

// Unsubscribe helper for user action (button)
async function unsubscribeUser() {
  try {
    // delete FCM token
    const tokenToDelete = await getToken(messaging) || null;
    if (tokenToDelete) {
      await deleteToken(messaging);
      await fetch('/api/delete-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenToDelete })
      });
      console.log('token deleted and server notified');
    }

    // also unsubscribe push subscriptions if present
    const regs = await navigator.serviceWorker.getRegistrations();
    await Promise.all(regs.map(r => r.pushManager.getSubscription().then(s => s && s.unsubscribe())));
    console.log('unsubscribed push subscriptions');
  } catch (err) {
    console.error('unsubscribe error', err);
  }
}

// expose to window for easy wiring to buttons
window.requestPermissionAndGetToken = requestPermissionAndGetToken;
window.unsubscribeUser = unsubscribeUser;
