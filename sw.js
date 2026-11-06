// Service worker for Villa Villekulla: makes the game installable and playable offline.
// Bump CACHE when you change the game, so phones pick up the new version, and keep GAME_VERSION in js/boot.js
// the same number (tests/pwa.spec.js checks). The page shows that number and offers a reload when a newer one arrives.
const CACHE = 'pippi-villa-v19';
const CORE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './css/base.css',
  './css/chapter0.css',
  './css/chapter1.css',
  './css/chapter2.css',
  './css/chapter3.css',
  './css/chapter4.css',
  './css/chapter5.css',
  './css/chapter6.css',
  './css/chapter7.css',
  './css/chapter8.css',
  './css/chapter9.css',
  './css/chapter10.css',
  './css/phone.css',
  './css/animations.css',
  './js/boot.js',
  './js/i18n.js',
  './js/core.js',
  './js/chapter0.js',
  './js/chapter1.js',
  './js/chapter2.js',
  './js/chapter3.js',
  './js/chapter4.js',
  './js/chapter5.js',
  './js/chapter6.js',
  './js/chapter7.js',
  './js/chapter8.js',
  './js/chapter9.js',
  './js/chapter10.js',
  './js/items.js',
  './js/hints.js',
  './js/ambience.js',
  './js/voice.js',
  './js/app.js',
  './lang/nl/ui.txt',
  './lang/nl/ch0.txt',
  './lang/nl/ch1.txt',
  './lang/nl/ch2.txt',
  './lang/nl/ch3.txt',
  './lang/nl/ch4.txt',
  './lang/nl/ch5.txt',
  './lang/nl/ch6.txt',
  './lang/nl/ch7.txt',
  './lang/nl/ch8.txt',
  './lang/nl/ch9.txt',
  './lang/nl/ch10.txt',
  './lang/nl/hints.txt',
  './lang/nl/scenes.txt',
  './lang/sv/ui.txt',
  './lang/sv/ch0.txt',
  './lang/sv/ch1.txt',
  './lang/sv/ch2.txt',
  './lang/sv/ch3.txt',
  './lang/sv/ch4.txt',
  './lang/sv/ch5.txt',
  './lang/sv/ch6.txt',
  './lang/sv/ch7.txt',
  './lang/sv/ch8.txt',
  './lang/sv/ch9.txt',
  './lang/sv/ch10.txt',
  './lang/sv/hints.txt',
  './lang/sv/scenes.txt',
  './scenes/move.svg',
  './scenes/kitchen.svg',
  './scenes/bedroom.svg',
  './scenes/school.svg',
  './scenes/winter.svg',
  './scenes/circus.svg',
  './scenes/balloon.svg',
  './scenes/ship.svg',
  './scenes/island.svg',
  './scenes/voyage.svg',
  './scenes/home.svg',
  './portraits/you.svg',
  './portraits/pippi.svg',
  './portraits/nilsson.svg',
  './portraits/horse.svg',
  './portraits/spunk.svg',
  './portraits/tommy.svg',
  './portraits/annika.svg',
  './portraits/karlsson.svg',
  './portraits/bloom.svg',
  './portraits/teacher.svg',
  './portraits/ringmaster.svg',
  './portraits/clown.svg',
  './portraits/strongman.svg',
  './portraits/captain.svg',
  './portraits/kling.svg',
  './portraits/klang.svg'
];
self.addEventListener('install', event => {
  // cache: 'reload' skips the browser's HTTP cache, so the offline copy is the new version, not a 10-minute-old one
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())
    .then(() => self.clients.matchAll({ type: 'window' })).then(pages => pages.forEach(p => p.postMessage({ type: 'version', cache: CACHE }))));
});

// An open page asks which version this service worker serves; it offers a reload when that is newer than itself.
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'version?' && event.source) event.source.postMessage({ type: 'version', cache: CACHE });
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // The game page: try the network first so updates arrive, fall back to the cached copy offline.
  if (req.mode === 'navigate') {
    // cache: 'no-cache' checks with the server every time (a cheap 304 when nothing changed) instead of reusing an old copy
    event.respondWith(fetch(req.url, { cache: 'no-cache', credentials: 'same-origin' }).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put('./index.html', copy)); return res; })
      .catch(() => caches.match('./index.html')));
    return;
  }

  // The game's own files (scripts, styles, scenes): network first, so updates arrive together; cache when offline.
  if (url.origin === location.origin) {
    event.respondWith(fetch(req, { cache: 'no-cache' }).then(res => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return res; })
      .catch(() => caches.match(req)));
    return;
  }

  // Google Fonts: cache first, then fetch and keep a copy.
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    })));
  }
});
