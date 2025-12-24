self.addEventListener('push', function(event) {
    const options = {
        body: 'حان الآن موعد الأذكار، نور قلبك بذكر الله.',
        icon: 'https://cdn-icons-png.flaticon.com/512/2805/2805355.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/2805/2805355.png'
    };
    event.waitUntil(
        self.registration.showNotification('✨ ذكر الله', options)
    );
});
