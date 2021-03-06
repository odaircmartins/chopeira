var cacheName = "Chopeira IOT - 1.8";
var filesToCache = [
    './',                 
    'index.html',
    'css/bulma.css',
    'js/bancoDeDados.js',
    'js/instalador.js'
];

console.log("Rodando aplicação " + cacheName);

self.addEventListener('install',function(e){
    console.log('[ServiceWorker] Installer');
    e.waitUntil(
        caches.open(cacheName).then(function(cache){
            console.log('[ServiceWorker] caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('activate', function(e){
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function(keyList){
            return Promise.all(keyList.map(function(key){
                if (key !== cacheName){
                    console.log('[ServiceWorker] Removing old cache');
                    return caches.delete(key);
                }
            }));
        })
    );    
});

self.addEventListener('fetch', function(e){
    console.log('[ServiceWorker] Fetch', e.request.url);
    e.respondWith(
        caches.match(e.request).then(function(response){
            return response || fetch(e.request);
        })
    );
});

self.addEventListener("message", function(event) {
    if (event.data.action === "skipWaiting") {
      self.skipWaiting();
    }
});