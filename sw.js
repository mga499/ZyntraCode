// ================================================
// SERVICE WORKER - ZyntraCode
// Gestion des mises à jour et cache
// ================================================

// Change ce numéro à chaque mise à jour de ton site !
const VERSION = 'v1.1.26';
const CACHE_NAME = 'zyntracode-' + VERSION;

// Fichiers à mettre en cache
const FICHIERS_CACHE = [
    '/',
    '/index.html',
    '/login.html',
    '/register.html',
    '/dashboard.html',
    '/parametres.html',
    '/ebooks.html',
    '/boutique.html',
    '/manifest.json',
    '/logo_zyntracode2.png',
    '/profil-menu.js',
    '/notification-politique.js',
];

// ================================================
// INSTALLATION - mise en cache des fichiers
// ================================================
self.addEventListener('install', event => {
    console.log('[SW] Installation version : ' + VERSION);
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(FICHIERS_CACHE).catch(err => {
                console.log('[SW] Erreur cache :', err);
            });
        })
    );
    // Forcer l'activation immédiate
    self.skipWaiting();
});

// ================================================
// ACTIVATION - supprimer les anciens caches
// ================================================
self.addEventListener('activate', event => {
    console.log('[SW] Activation version : ' + VERSION);
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => {
                        console.log('[SW] Suppression ancien cache :', name);
                        return caches.delete(name);
                    })
            );
        })
    );
    self.clients.claim();
});

// ================================================
// FETCH - servir depuis le cache ou le réseau
// ================================================
self.addEventListener('fetch', event => {
    // Ignorer les requêtes non-GET
    if (event.request.method !== 'GET') return;

    // Ignorer les APIs externes
    const url = new URL(event.request.url);
    if (url.origin !== location.origin) return;

    event.respondWith(
        caches.match(event.request).then(cached => {
            // Toujours essayer le réseau en premier
            return fetch(event.request)
                .then(response => {
                    // Mettre en cache la nouvelle version
                    if (response.ok) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, clone);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    // Si pas de réseau, utiliser le cache
                    return cached;
                });
        })
    );
});

// ================================================
// MESSAGE - communication avec la page
// ================================================
self.addEventListener('message', event => {
    if (event.data === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
