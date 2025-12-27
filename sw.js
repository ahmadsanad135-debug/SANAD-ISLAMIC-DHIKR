const cacheName = 'azkar-v6-notif';
const assets = ['./', './index.html', './dhikr-data.js', './manifest.json', './icon.png'];

let reminders = { morning: '', evening: '' };

self.addEventListener('install', e => {
  e.waitUntil(caches.open(cacheName).then(cache => cache.addAll(assets)));
});

// استقبال موعد التذكير من الصفحة
self.addEventListener('message', (event) => {
    if (event.data.type === 'UPDATE_REMINDERS') {
        reminders.morning = event.data.morning;
        reminders.evening = event.data.evening;
    }
});

// فحص الوقت كل دقيقة لإرسال التنبيه حتى لو التطبيق مغلق
setInterval(() => {
    if (!reminders.morning && !reminders.evening) return;
    const now = new Date();
    const currentTime = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    if (currentTime === reminders.morning) {
        self.registration.showNotification("☀️ أذكار الصباح", { body: "حان وقت الأذكار" });
    } else if (currentTime === reminders.evening) {
        self.registration.showNotification("🌙 أذكار المساء", { body: "حان وقت الأذكار" });
    }
}, 60000);

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});
