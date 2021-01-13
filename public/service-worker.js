self.addEventListener('install', event => console.log('ServiceWorker installed'));

// self.addEventListener('notificationclick', event => {
//   event.waitUntil(self.clients.openWindow('/'));
// });