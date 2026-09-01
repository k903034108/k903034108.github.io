const VERSION = "nagoya-trip-v1-20260901";
const SHELL_CACHE = VERSION + "-shell";
const RUNTIME_CACHE = VERSION + "-runtime";
const SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./enhancements.css",
  "./app.js",
  "./app-v2.js",
  "./manifest.webmanifest",
  "./kabaddi-schedule.html",
  "./icons/icon-180.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png"
];

self.addEventListener("install",(event) => {
  event.waitUntil(caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL)));
});

self.addEventListener("activate",(event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key.startsWith("nagoya-trip-") && ![SHELL_CACHE,RUNTIME_CACHE].includes(key)).map((key) => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

async function networkFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    const response = await fetch(request);
    if (response && response.ok) await cache.put(request,response.clone());
    return response;
  } catch {
    return (await cache.match(request)) || (await caches.match("./index.html"));
  }
}

async function staleWhileRevalidate(request,cacheName,event) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const network = fetch(request).then(async (response) => {
    if (response && response.ok) await cache.put(request,response.clone());
    return response;
  }).catch(() => null);
  if (cached) { event.waitUntil(network); return cached; }
  return (await network) || Response.error();
}

self.addEventListener("fetch",(event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
    return;
  }
  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(request,RUNTIME_CACHE,event));
  }
});

self.addEventListener("message",(event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});
