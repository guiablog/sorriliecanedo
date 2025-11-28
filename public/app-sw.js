const CACHE_NAME = 'sorrilie-app-v2'
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/app.webmanifest',
  '/manifest.json',
  '/favicon.ico',
  '/og-image.png',
  '/placeholder.svg',
  '/skip.png',
]

// Install Event: Cache core assets
self.addEventListener('install', (event) => {
  self.skipWaiting() // Force the waiting service worker to become the active service worker
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache')
      return cache.addAll(STATIC_ASSETS)
    }),
  )
})

// Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => {
        console.log('Service Worker Activated')
        return self.clients.claim() // Take control of all clients immediately
      }),
  )
})

// Fetch Event: Network First for navigation, Stale-While-Revalidate for assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // 1. Handle Navigation Requests (HTML) -> Network First, Fallback to Cache
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/index.html')
      }),
    )
    return
  }

  // 2. Handle Static Assets (JS, CSS, Images, Fonts) -> Stale-While-Revalidate
  // This ensures assets load fast from cache, but update in background
  if (
    url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|ico|json|woff2)$/) ||
    url.pathname.includes('/assets/')
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            // Check if we received a valid response
            if (
              !networkResponse ||
              networkResponse.status !== 200 ||
              networkResponse.type !== 'basic'
            ) {
              return networkResponse
            }

            // Clone the response
            const responseToCache = networkResponse.clone()

            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache)
            })

            return networkResponse
          })
          .catch((err) => {
            // Network failed, nothing to do here if we have cached response
            // If no cached response, this promise rejects and we might fail
            console.log('Fetch failed for asset:', event.request.url)
          })

        // Return cached response immediately if available, otherwise wait for network
        return cachedResponse || fetchPromise
      }),
    )
    return
  }

  // 3. Default Strategy -> Network Only (for API calls, etc.)
  // We don't cache API calls to ensure data freshness
})
