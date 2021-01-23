const cacheName = 'v1.0.0'

self.addEventListener('activate', (e) => {
  //remove unwanted caches
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== cacheName) {
            return caches.delete(cache)
          }
        })
      )
    })
  )
})

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Make copy/clone of response
        const resClone = res.clone()
        // Open cache
        caches
          .open(cacheName)
          .then(cache => {
            cache.put(e.request, resClone)
          })
        return res
      })
      .catch(err => caches.match(e.request).then(res => res))
  )
})

self.addEventListener('notificationclick', event => {
  event.waitUntil(self.clients.matchAll().then(clients => {
    if (clients.length) { // check if at least one tab is already open
      clients[0].focus();
    } else {
      self.clients.openWindow('/');
    }
  }));
});