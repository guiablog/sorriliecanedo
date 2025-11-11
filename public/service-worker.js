const CACHE_NAME = 'sorrilie-cache-v1'
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/main.css',
  '/favicon.ico',
  '/skip.png',
  '/og-image.png',
  '/placeholder.svg',
  '/skip.js',
  '/manifest.json',
  '/android-launchericon-48-48.png',
  '/android-launchericon-72-72.png',
  '/android-launchericon-96-96.png',
  'android-launchericon-144-144.png',
  '/android-launchericon-192-192.png',
  '/android-launchericon-512-512.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache')
      return cache.addAll(urlsToCache)
    }),
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response
      }
      return fetch(event.request)
    }),
  )
})

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME]
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})
