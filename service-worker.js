const CACHE_VERSION = "v2.1.1";
const CACHE_NAME = `hankkitv-${CACHE_VERSION}`;

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./styles.css",
    "./manifest.json",
    "./favicon.png",
    "./logo_t.png"
];

self.addEventListener("install", (event) => {
    self.skipWaiting();

  event.waitUntil(
    caches
      .open(CACHE_NAME)

      .then((cache) => {
        return cache.addAll(FILES_TO_CACHE);
      }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => 
        Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Removing old cache:", cacheName);

            return caches.delete(cacheName);
          }
        }),
      )
    ),
  );

  self.clients.claim();
});

self.addEventListener("fetch", event => {

    const request = event.request;
    const url = new URL(request.url);

    // Ignore non-GET requests
    if (request.method !== "GET") {
        return;
    }

    // Ignore third-party resources
    if (url.origin !== self.location.origin) {
        event.respondWith(fetch(request));
        return;
    }

    const pathname = url.pathname;

    // HTML
    if (
        pathname.endsWith("/") ||
        pathname.endsWith(".html")
    ) {

        event.respondWith(networkFirst(request));
        return;

    }

    // JS / CSS / CSV / JSON
    if (
        pathname.endsWith(".js") ||
        pathname.endsWith(".css") ||
        pathname.endsWith(".csv") ||
        pathname.endsWith(".json")
    ) {

        event.respondWith(staleWhileRevalidate(request));
        return;

    }

    // Images
    if (
        pathname.endsWith(".png") ||
        pathname.endsWith(".jpg") ||
        pathname.endsWith(".jpeg") ||
        pathname.endsWith(".svg") ||
        pathname.endsWith(".webp") ||
        pathname.endsWith(".ico")
    ) {

        event.respondWith(cacheFirst(request));
        return;

    }

    // Default: network first, cache fallback
    event.respondWith(

        fetch(request)

            .catch(() => caches.match(request))

    );

});

async function networkFirst(request){

    try{

        const response =
            await fetch(request);

        const cache =
            await caches.open(CACHE_NAME);

        cache.put(
            request,
            response.clone()
        );

        return response;

    }

    catch{

        return caches.match(request);

    }

}

async function staleWhileRevalidate(request){

    const cache =
        await caches.open(CACHE_NAME);

    const cached =
        await cache.match(request);

    const networkFetch = fetch(request)

        .then(response=>{

            if(response.ok){

                cache.put(
                    request,
                    response.clone()
                );

            }

            return response;

        })

        .catch(()=>cached);

    return cached || networkFetch;

}

async function cacheFirst(request){

    const cache =
        await caches.open(CACHE_NAME);

    const cached =
        await cache.match(request);

    if(cached){

        return cached;

    }

    const response =
        await fetch(request);

    if(response.ok){

        cache.put(
            request,
            response.clone()
        );

    }

    return response;

}

