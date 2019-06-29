const CACHE_NAME = 'static-cache'
const urlsToCache = ['.', 'index.html', 'bundle.js']

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  )
})

self.addEventListener('fetch', event => {
  event.respondWith(
    caches
      .match(event.request)
      .then(response => response || fetchAndCache(event.request))
  )
})

const fetchAndCache = url =>
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw Error(response.statusText)
      }
      return caches.open(CACHE_NAME).then(cache => {
        cache.put(url, response.clone())
        return response
      })
    })
    .catch(error => {
      console.log('Request failed:', error)
      // You could return a custom offline 404 page here
    })
