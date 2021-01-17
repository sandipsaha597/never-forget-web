self.addEventListener('notificationclick', event => {
  console.log('noti click')
  event.waitUntil(self.clients.matchAll().then(clients => {
    console.log(clients)
    if (clients.length) { // check if at least one tab is already open
      clients[0].focus();
    } else {
      self.clients.openWindow('/');
    }
  }));
});
// self.addEventListener('notificationclick', event => {
//   event.waitUntil(self.clients.openWindow('/'));
// });
self.addEventListener('install', event => console.log('ServiceWorker installed'));